// /app/api/claude/route.ts
import { NextRequest, NextResponse } from 'next/server'

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY

export async function POST(request: NextRequest) {
  try {
    // Check if API key exists
    if (!CLAUDE_API_KEY) {
      console.error('❌ Claude API key not found in environment variables')
      return NextResponse.json(
        { error: 'Claude API key not configured' },
        { status: 500 }
      )
    }

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
    console.log(`📝 Using user story: "${userData?.story?.substring(0, 50)}..."`)

    // Call Claude API from server-side (no CORS issues)
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CLAUDE_API_KEY}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Claude API error: ${response.status} - ${errorText}`)
      
      // Return specific error information
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
    const generatedContent = data.content?.[0]?.text

    if (!generatedContent) {
      console.error('❌ No content returned from Claude API')
      return NextResponse.json(
        { error: 'No content generated', fallback: true },
        { status: 500 }
      )
    }

    console.log(`✅ Successfully generated ${platform} content (${generatedContent.length} characters)`)

    return NextResponse.json({
      content: generatedContent,
      platform,
      success: true
    })

  } catch (error) {
    console.error('❌ Server error in Claude API endpoint:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        fallback: true
      },
      { status: 500 }
    )
  }
}
