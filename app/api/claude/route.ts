// /app/api/claude/route.ts - ENHANCED DEBUG VERSION
import { NextRequest, NextResponse } from 'next/server'

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'

export async function POST(request: NextRequest) {
  try {
    // DEBUGGING: Check which environment variables exist
    console.log('🔍 Environment Variables Debug:')
    console.log('CLAUDE_API_KEY prefix:', process.env.CLAUDE_API_KEY?.slice(0, 15) || 'NOT FOUND')
    console.log('CLAUDE_API_KEY length:', process.env.CLAUDE_API_KEY?.length || 0)
    console.log('NEXT_PUBLIC_CLAUDE_API_KEY prefix:', process.env.NEXT_PUBLIC_CLAUDE_API_KEY?.slice(0, 15) || 'NOT FOUND')
    console.log('ANTHROPIC_API_KEY prefix:', process.env.ANTHROPIC_API_KEY?.slice(0, 15) || 'NOT FOUND')
    console.log('All env keys containing CLAUDE:', Object.keys(process.env).filter(key => key.includes('CLAUDE')))
    console.log('Total env variables count:', Object.keys(process.env).length)
    
    // SIMPLIFIED: Use only the main key (no fallbacks for debugging)
    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY

    // ENHANCED: Comprehensive API key validation
    if (!CLAUDE_API_KEY) {
      console.error('❌ No Claude API key found in CLAUDE_API_KEY environment variable')
      console.log('Available env vars:', Object.keys(process.env).filter(key => 
        key.toLowerCase().includes('claude') || key.toLowerCase().includes('anthropic')
      ))
      return NextResponse.json(
        { 
          error: 'Claude API key not configured',
          availableVars: Object.keys(process.env).filter(key => 
            key.toLowerCase().includes('claude') || key.toLowerCase().includes('anthropic')
          ),
          debug: 'CLAUDE_API_KEY environment variable not found'
        },
        { status: 500 }
      )
    }

    // ENHANCED: API key format validation
    if (!CLAUDE_API_KEY.startsWith('sk-ant-')) {
      console.error('❌ Invalid Claude API key format. Should start with "sk-ant-"')
      console.log('Current key format:', CLAUDE_API_KEY.substring(0, 10) + '...')
      return NextResponse.json(
        { 
          error: 'Invalid Claude API key format',
          keyPrefix: CLAUDE_API_KEY.substring(0, 15) + '...',
          debug: 'API key does not start with sk-ant-'
        },
        { status: 500 }
      )
    }

    console.log('✅ Claude API key found and validated:', CLAUDE_API_KEY.substring(0, 15) + '...')
    console.log('🔑 API Key Details:')
    console.log('  - Length:', CLAUDE_API_KEY.length, 'characters')
    console.log('  - Starts with:', CLAUDE_API_KEY.substring(0, 10))
    console.log('  - Ends with:', CLAUDE_API_KEY.substring(CLAUDE_API_KEY.length - 4))

    // Parse request body
    const body = await request.json()
    const { prompt, platform, userData } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    console.log(`🚀 Server: Generating ${platform} content with Claude API...`)
    console.log(`📝 User story: "${userData?.story?.substring(0, 50) || 'No story'}..."`)
    console.log(`🔑 Using API Key length: ${CLAUDE_API_KEY.length} characters`)

    // ENHANCED: Claude API call with better error handling
    const claudeRequestBody = {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    }

    console.log('📤 Sending request to Claude API...')
    console.log('📤 Request URL:', CLAUDE_API_URL)
    console.log('📤 Request headers:', {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01'
    })

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(claudeRequestBody)
    })

    console.log(`📥 Claude API response status: ${response.status}`)
    console.log(`📥 Claude API response headers:`, Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Claude API error: ${response.status}`)
      console.error(`❌ Error details: ${errorText}`)
      console.error(`❌ API Key used (first 15 chars): ${CLAUDE_API_KEY.substring(0, 15)}...`)
      
      // ENHANCED: Specific error handling
      if (response.status === 401) {
        console.error('❌ Authentication failed - API Key Details:')
        console.error('  - Key length:', CLAUDE_API_KEY.length)
        console.error('  - Key prefix:', CLAUDE_API_KEY.substring(0, 15))
        console.error('  - Key suffix:', CLAUDE_API_KEY.substring(CLAUDE_API_KEY.length - 4))
        
        return NextResponse.json(
          { 
            error: 'Claude API authentication failed',
            status: 401,
            details: 'Invalid API key or insufficient permissions',
            keyPrefix: CLAUDE_API_KEY.substring(0, 15) + '...',
            keyLength: CLAUDE_API_KEY.length,
            fallback: true
          },
          { status: 401 }
        )
      }

      if (response.status === 429) {
        console.error('❌ Rate limited - Too many requests')
        return NextResponse.json(
          { 
            error: 'Claude API rate limit exceeded',
            status: 429,
            details: 'Please try again in a moment',
            fallback: true
          },
          { status: 429 }
        )
      }

      if (response.status === 400) {
        console.error('❌ Bad request - Check prompt format')
        return NextResponse.json(
          { 
            error: 'Claude API bad request',
            status: 400,
            details: errorText,
            fallback: true
          },
          { status: 400 }
        )
      }

      // Generic error fallback
      return NextResponse.json(
        { 
          error: `Claude API error: ${response.status}`,
          details: errorText,
          fallback: true
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('📦 Claude API response structure:', Object.keys(data))

    const generatedContent = data.content?.[0]?.text

    if (!generatedContent) {
      console.error('❌ No content returned from Claude API')
      console.log('📦 Full response data:', JSON.stringify(data, null, 2))
      return NextResponse.json(
        { 
          error: 'No content generated by Claude',
          responseData: data,
          fallback: true
        },
        { status: 500 }
      )
    }

    console.log(`✅ SUCCESS! Generated ${platform} content (${generatedContent.length} characters)`)
    console.log(`📝 Content preview: "${generatedContent.substring(0, 100)}..."`)

    return NextResponse.json({
      content: generatedContent,
      platform,
      success: true,
      metadata: {
        contentLength: generatedContent.length,
        model: 'claude-3-sonnet-20240229',
        timestamp: new Date().toISOString(),
        apiKeyUsed: CLAUDE_API_KEY.substring(0, 15) + '...'
      }
    })

  } catch (error) {
    console.error('❌ CRITICAL SERVER ERROR:', error)
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : 'Unknown',
        fallback: true
      },
      { status: 500 }
    )
  }
}
