import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const imageFile = formData.get('image') as File | null

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    // Convert audio to base64
    const audioArrayBuffer = await audioFile.arrayBuffer()
    const audioBase64 = Buffer.from(audioArrayBuffer).toString('base64')

    // Convert image to base64 if provided
    let imageBase64: string | null = null
    if (imageFile) {
      const imageArrayBuffer = await imageFile.arrayBuffer()
      imageBase64 = Buffer.from(imageArrayBuffer).toString('base64')
    }

    // Test 1: Audio Only
    console.log('🧪 Testing Claude Audio Only...')
    const audioOnlyResponse = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: `Please transcribe this audio recording accurately. Pay special attention to:
- Māori words and cultural terms
- Place names (Ko Tāne, Te Moananui-a-Kiwa, etc.)
- Cultural concepts (tīpuna, mana, waka, etc.)
- Tourism and cultural context

Provide the transcription and rate your confidence (0-100%).

Format your response as:
TRANSCRIPTION: [your transcription here]
CONFIDENCE: [0-100]%`
          },
          {
            type: "audio",
            source: {
              type: "base64",
              media_type: "audio/wav",
              data: audioBase64
            }
          }
        ]
      }]
    })

    // Test 2: Audio + Image (if image provided)
    let audioImageResponse = null
    if (imageBase64) {
      console.log('🧪 Testing Claude Audio + Image...')
      audioImageResponse = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: [
            {
              type: "text",
              text: `Please transcribe this audio recording about the image shown. The speaker is describing a cultural tourism experience in New Zealand.

Pay special attention to:
- Māori place names and cultural terms in context
- Tourism and cultural context from the image
- Proper pronunciation interpretation
- Cultural significance and respect

Use the image context to enhance your understanding of cultural terms and place names.

Format your response as:
TRANSCRIPTION: [your transcription here]
CONFIDENCE: [0-100]%
IMAGE_CONTEXT: [how the image helped with transcription]`
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: imageFile.type,
                data: imageBase64
              }
            },
            {
              type: "audio",
              source: {
                type: "base64",
                media_type: "audio/wav",
                data: audioBase64
              }
            }
          ]
        }]
      })
    }

    // Parse responses
    const parseResponse = (response: any) => {
      const text = response.content[0].text
      const transcriptionMatch = text.match(/TRANSCRIPTION:\s*(.+?)(?=CONFIDENCE:|$)/s)
      const confidenceMatch = text.match(/CONFIDENCE:\s*(\d+)%/)
      const contextMatch = text.match(/IMAGE_CONTEXT:\s*(.+?)$/s)
      
      return {
        transcription: transcriptionMatch?.[1]?.trim() || text,
        confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : null,
        imageContext: contextMatch?.[1]?.trim() || null,
        fullResponse: text
      }
    }

    const audioOnlyResult = parseResponse(audioOnlyResponse)
    const audioImageResult = audioImageResponse ? parseResponse(audioImageResponse) : null

    // Generate analysis
    const analysis = generateAnalysis(audioOnlyResult, audioImageResult)

    return NextResponse.json({
      audioOnly: audioOnlyResult,
      audioWithImage: audioImageResult,
      analysis,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Claude voice test error:', error)
    return NextResponse.json(
      { error: 'Failed to process audio with Claude', details: error.message },
      { status: 500 }
    )
  }
}

function generateAnalysis(audioOnly: any, audioImage: any | null): string {
  let analysis = `🧪 CLAUDE VOICE RECOGNITION TEST RESULTS\n\n`
  
  analysis += `📊 Audio Only Performance:\n`
  analysis += `- Confidence: ${audioOnly.confidence || 'Not specified'}%\n`
  analysis += `- Length: ${audioOnly.transcription?.length || 0} characters\n\n`
  
  if (audioImage) {
    analysis += `📊 Audio + Image Performance:\n`
    analysis += `- Confidence: ${audioImage.confidence || 'Not specified'}%\n`
    analysis += `- Length: ${audioImage.transcription?.length || 0} characters\n`
    
    const improvement = audioImage.confidence && audioOnly.confidence 
      ? audioImage.confidence - audioOnly.confidence 
      : null
    
    if (improvement !== null) {
      analysis += `- Improvement: ${improvement > 0 ? '+' : ''}${improvement}% confidence\n`
    }
    
    if (audioImage.imageContext) {
      analysis += `- Image Context Benefit: ${audioImage.imageContext}\n`
    }
    analysis += `\n`
  }
  
  // Māori term analysis
  const maoriTerms = ['Ko Tāne', 'tīpuna', 'Te Moananui-a-Kiwa', 'manuhiri', 'waka', 'mana', 'taonga']
  const detectedTerms = maoriTerms.filter(term => 
    audioOnly.transcription?.toLowerCase().includes(term.toLowerCase()) ||
    audioImage?.transcription?.toLowerCase().includes(term.toLowerCase())
  )
  
  analysis += `🏛️ Cultural Term Recognition:\n`
  analysis += `- Detected ${detectedTerms.length}/${maoriTerms.length} common Māori terms\n`
  if (detectedTerms.length > 0) {
    analysis += `- Recognized: ${detectedTerms.join(', ')}\n`
  }
  
  analysis += `\n🎯 Recommendation: ${audioImage && audioImage.confidence > audioOnly.confidence 
    ? 'Multi-modal (audio+image) shows superior performance!' 
    : 'Audio-only performance acceptable for implementation.'}`
  
  return analysis
}
