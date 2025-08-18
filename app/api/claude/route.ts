// /api/claude/route.ts - Mobile Timeout Fix Implementation
// Add this to your existing API route file

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // MOBILE DETECTION - Critical for timeout handling
    const userAgent = request.headers.get('user-agent') || ''
    const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    
    // MOBILE-SPECIFIC TIMEOUT CONFIGURATION
    const timeoutMs = isMobile ? 45000 : 60000 // 45s mobile, 60s desktop
    const maxTokens = isMobile ? 800 : 1000   // Reduce tokens for faster mobile generation
    
    // Log mobile detection for debugging
    console.log('🔍 Request detection:', {
      isMobile,
      userAgent: userAgent.substring(0, 50) + '...',
      timeout: timeoutMs,
      maxTokens
    })
    
    // MOBILE OPTIMIZATION: Simplify content for faster generation
    let optimizedMessages = body.messages
    if (isMobile && body.messages) {
      optimizedMessages = body.messages.map((msg: any) => {
        if (typeof msg.content === 'string' && msg.content.length > 1000) {
          // Truncate very long content on mobile for faster processing
          return {
            ...msg,
            content: msg.content.substring(0, 1000) + '... (continued)'
          }
        }
        return msg
      })
    }
    
    // ANTHROPIC API PAYLOAD with mobile optimizations
    const anthropicPayload = {
      model: body.model || 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      messages: optimizedMessages,
      // Reduce temperature slightly on mobile for more focused responses
      temperature: isMobile ? 0.7 : (body.temperature || 1.0),
      // Add system prompt optimization for mobile
      ...(body.system && {
        system: isMobile 
          ? `${body.system}\n\nIMPORTANT: Provide concise, mobile-optimized responses.`
          : body.system
      })
    }
    
    // MOBILE-AWARE FETCH with AbortSignal timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort(`Request timeout after ${timeoutMs}ms`)
    }, timeoutMs)
    
    console.log(`🚀 Starting ${isMobile ? 'MOBILE' : 'DESKTOP'} generation...`)
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify(anthropicPayload),
      // CRITICAL: Mobile timeout handling
      signal: controller.signal
    })
    
    // Clear timeout on successful response
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      console.error('❌ Anthropic API error:', {
        status: response.status,
        statusText: response.statusText,
        isMobile
      })
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Log successful generation
    console.log(`✅ ${isMobile ? 'MOBILE' : 'DESKTOP'} generation successful:`, {
      responseLength: JSON.stringify(data).length,
      contentLength: data.content?.[0]?.text?.length || 0,
      model: anthropicPayload.model
    })
    
    // MOBILE SUCCESS INDICATOR: Add mobile flag to response
    if (isMobile) {
      data._mobileGeneration = true
      data._optimizations = {
        reducedTokens: maxTokens < 1000,
        reducedTimeout: timeoutMs < 60000,
        contentTruncated: optimizedMessages !== body.messages
      }
    }
    
    return NextResponse.json(data)
    
  } catch (error: any) {
    // ENHANCED ERROR HANDLING for mobile debugging
    const userAgent = request.headers.get('user-agent') || ''
    const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    
    console.error(`💥 ${isMobile ? 'MOBILE' : 'DESKTOP'} generation error:`, {
      error: error.message,
      name: error.name,
      stack: error.stack?.substring(0, 200),
      isMobile,
      timestamp: new Date().toISOString()
    })
    
    // MOBILE-SPECIFIC ERROR RESPONSES
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return NextResponse.json({
        error: isMobile 
          ? 'Mobile generation timeout - content may be too complex. Try shorter descriptions.'
          : 'Request timeout - please try again.',
        type: 'timeout_error',
        isMobile,
        suggestion: isMobile 
          ? 'For mobile devices, try shorter, simpler descriptions for faster generation.'
          : 'Please try again or contact support if the issue persists.'
      }, { status: 408 })
    }
    
    return NextResponse.json({
      error: 'Failed to generate content',
      details: error.message,
      type: 'generation_error',
      isMobile
    }, { status: 500 })
  }
}
