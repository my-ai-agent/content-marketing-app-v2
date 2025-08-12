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
    const browserTranscript = formData.get('browserTranscript') as string

    if (!audioFile && !browserTranscript) {
      return NextResponse.json({ error: 'No audio file or transcript provided' }, { status: 400 })
    }

    // Convert image to base64 if provided
    let imageBase64: string | null = null
    if (imageFile) {
      const imageArrayBuffer = await imageFile.arrayBuffer()
      imageBase64 = Buffer.from(imageArrayBuffer).toString('base64')
    }

    // Test 1: Claude Text Enhancement Only
    console.log('🧪 Testing Claude Cultural Enhancement...')
    const textOnlyResponse = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: `I have a browser speech recognition transcript about Māori cultural tourism. Please enhance it for cultural accuracy and provide corrections.

Original transcript: "${browserTranscript}"

Please:
1. Identify and correct any Māori cultural terms that may be mispronounced or misrepresented
2. Suggest proper spellings for place names (Ko Tāne, Te Moananui-a-Kiwa, etc.)
3. Enhance cultural context and respectful language
4. Rate your confidence in the cultural accuracy (0-100%)

Format your response as:
ENHANCED_TRANSCRIPT: [your enhanced version]
CULTURAL_CORRECTIONS: [list of corrections made]
CONFIDENCE: [0-100]%`
          }
        ]
      }]
    })

    // Test 2: Claude with Image Context (if image provided)
    let imageEnhancedResponse = null
    if (imageBase64) {
      console.log('🧪 Testing Claude Cultural Enhancement + Image Context...')
      imageEnhancedResponse = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: [
            {
              type: "text",
              text: `I have a browser speech recognition transcript about the Māori cultural experience shown in this image. Please enhance it for cultural accuracy using the visual context.

Original transcript: "${browserTranscript}"

Please:
1. Use the image context to better understand cultural references
2. Correct Māori cultural terms based on visual cues
3. Enhance place names and cultural concepts with image context
4. Provide culturally respectful and accurate language
5. Rate your confidence with image context (0-100%)

Format your response as:
ENHANCED_TRANSCRIPT: [your enhanced version]
CULTURAL_CORRECTIONS: [list of corrections made]
IMAGE_INSIGHTS: [how the image helped with accuracy]
CONFIDENCE: [0-100]%`
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: imageFile.type,
                data: imageBase64
              }
            }
          ]
        }]
      })
    }

    // Parse responses
    const parseResponse = (response: any) => {
      const text = response.content[0].text
      const enhancedMatch = text.match(/ENHANCED_TRANSCRIPT:\s*(.+?)(?=CULTURAL_CORRECTIONS:|$)/s)
      const correctionsMatch = text.match(/CULTURAL_CORRECTIONS:\s*(.+?)(?=(?:IMAGE_INSIGHTS:|CONFIDENCE:)|$)/s)
      const confidenceMatch = text.match(/CONFIDENCE:\s*(\d+)%/)
      const insightsMatch = text.match(/IMAGE_INSIGHTS:\s*(.+?)(?=CONFIDENCE:|$)/s)
      
      return {
        enhancedTranscript: enhancedMatch?.[1]?.trim() || text,
        culturalCorrections: correctionsMatch?.[1]?.trim() || 'None specified',
        confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : null,
        imageInsights: insightsMatch?.[1]?.trim() || null,
        fullResponse: text
      }
    }

    const textOnlyResult = parseResponse(textOnlyResponse)
    const imageEnhancedResult = imageEnhancedResponse ? parseResponse(imageEnhancedResponse) : null

    // Generate analysis
    const analysis = generateAnalysis(browserTranscript, textOnlyResult, imageEnhancedResult)

    return NextResponse.json({
      originalTranscript: browserTranscript,
      textOnlyEnhancement: textOnlyResult,
      imageEnhancedResult: imageEnhancedResult,
      analysis,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Claude cultural enhancement error:', error)
    return NextResponse.json(
      { error: 'Failed to process with Claude', details: error.message },
      { status: 500 }
    )
  }
}

function generateAnalysis(original: string, textOnly: any, imageEnhanced: any | null): string {
  let analysis = `🧪 CLAUDE CULTURAL ENHANCEMENT TEST RESULTS\n\n`
  
  analysis += `📝 Original Browser Transcript:\n`
  analysis += `"${original}"\n\n`
  
  analysis += `🏛️ Claude Text-Only Enhancement:\n`
  analysis += `- Confidence: ${textOnly.confidence || 'Not specified'}%\n`
  analysis += `- Corrections: ${textOnly.culturalCorrections}\n`
  analysis += `- Enhanced: "${textOnly.enhancedTranscript}"\n\n`
  
  if (imageEnhanced) {
    analysis += `📸 Claude + Image Context Enhancement:\n`
    analysis += `- Confidence: ${imageEnhanced.confidence || 'Not specified'}%\n`
    analysis += `- Corrections: ${imageEnhanced.culturalCorrections}\n`
    analysis += `- Enhanced: "${imageEnhanced.enhancedTranscript}"\n`
    
    const improvement = imageEnhanced.confidence && textOnly.confidence 
      ? imageEnhanced.confidence - textOnly.confidence 
      : null
    
    if (improvement !== null) {
      analysis += `- Improvement: ${improvement > 0 ? '+' : ''}${improvement}% confidence with image\n`
    }
    
    if (imageEnhanced.imageInsights) {
      analysis += `- Image Insights: ${imageEnhanced.imageInsights}\n`
    }
    analysis += `\n`
  }
  
  // Māori term analysis
  const maoriTerms = ['Ko Tāne', 'tīpuna', 'Te Moananui-a-Kiwa', 'manuhiri', 'waka', 'mana', 'taonga', 'Tūhourangi']
  const originalTerms = maoriTerms.filter(term => 
    original?.toLowerCase().includes(term.toLowerCase())
  )
  const enhancedTerms = maoriTerms.filter(term => 
    textOnly.enhancedTranscript?.toLowerCase().includes(term.toLowerCase()) ||
    imageEnhanced?.enhancedTranscript?.toLowerCase().includes(term.toLowerCase())
  )
  
  analysis += `🏛️ Cultural Term Enhancement:\n`
  analysis += `- Original detected: ${originalTerms.length} terms (${originalTerms.join(', ') || 'none'})\n`
  analysis += `- Enhanced detected: ${enhancedTerms.length} terms (${enhancedTerms.join(', ') || 'none'})\n`
  analysis += `- Cultural improvement: ${enhancedTerms.length - originalTerms.length} additional accurate terms\n`
  
  analysis += `\n🎯 Recommendation: ${imageEnhanced && imageEnhanced.confidence > textOnly.confidence 
    ? 'Multi-modal (text+image) shows superior cultural enhancement!' 
    : 'Text-only cultural enhancement provides significant value.'}`
  
  return analysis
}
