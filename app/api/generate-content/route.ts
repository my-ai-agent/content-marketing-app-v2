// CORRECT API Route: /app/api/generate-content/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API route called')
    
    const data = await request.json()
    console.log('📝 Request data:', data)
    
    // Check if Claude API key exists
    if (!process.env.CLAUDE_API_KEY) {
      console.error('❌ No Claude API key found')
      return NextResponse.json(
        { error: 'Claude API key not configured' },
        { status: 500 }
      )
    }

    console.log('🔑 Claude API key found:', process.env.CLAUDE_API_KEY ? 'Yes' : 'No')

    // Build a simple prompt
    const prompt = `Create tourism content for:
    - Audience: ${data.audience || 'travelers'}
    - Interests: ${data.interests || 'cultural experiences'}
    - Persona: ${data.persona || 'casual'}
    
    Please respond with a JSON object containing:
    {
      "mainStory": "A compelling 200-word story about this New Zealand cultural experience",
      "qrSummary": "A 40-word summary",
      "hashtags": ["#NewZealand", "#Tourism", "#Culture"]
    }`

    console.log('🧠 Calling Claude API...')

    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    console.log('📡 Claude response status:', claudeResponse.status)

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text()
      console.error('❌ Claude API error:', errorText)
      return NextResponse.json(
        { error: 'Failed to generate content' },
        { status: 500 }
      )
    }

    const claudeData = await claudeResponse.json()
    console.log('✅ Claude response received')

    const generatedContent = claudeData.content[0].text

    // Try to parse JSON, fallback if needed
    let structuredContent
    try {
      structuredContent = JSON.parse(generatedContent)
    } catch {
      structuredContent = {
        mainStory: generatedContent,
        qrSummary: "Amazing New Zealand cultural experience!",
        hashtags: ["#NewZealand", "#Tourism", "#Culture"]
      }
    }

    console.log('🎉 Success! Returning content')
    return NextResponse.json({
      content: structuredContent,
      success: true
    })

  } catch (error) {
    console.error('💥 API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
