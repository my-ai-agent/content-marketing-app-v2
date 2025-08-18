import { NextRequest, NextResponse } from 'next/server'

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022'
const ANTHROPIC_VERSION = '2023-06-01'

// 🎯 KO TĀNE CONTENT TEMPLATES (CACHED FOR SPEED)
const KO_TANE_TEMPLATES = {
  instagram: {
    waka: `🌊 Experience authentic Māori culture with Ko Tāne on the beautiful Ōtākaro (Avon River)!

Our traditional waka journey connects you with Ngāi Tahu and Ngāi Tūāhuriri korero (stories) and their whakapapa (geneology) while experiencing the peaceful waters that have sustained our people for generations. As traditional guardians of the Ōtākaro, they are the keepers of its stories.

Join us for an unforgettable and immersive cultural engagement that honors tradition while creating deep and meaningful new memories. Our knowledgeable kaiārahi (guides) share stories passed down through generations.

#KoTāne #ŌtākaroExperience #NgāiTahu #NgāiTūāhuriri #AuthenticCulture #Ōtautahi #WakaJourney #CulturalTourism #Manaakitanga #NewZealand #TourismInNewZealand #ChristchurchNZ`,
    
    cultural: `🏛️ Discover the cultural beating heart of Ōtautahi with Ko Tāne!

Experience authentic Ngāi Tahu and Ngāi Tūāhuriri storytelling and traditional practices on the peaceful waters of the Ōtākaro. Our cultural experiences connect past and present through living traditions.

Every journey with Ko Tāne is a chance to understand the deep connection between Ngāi Tahu and Ngāi Tūāhuriri and these sacred waters. Come and be part of our whanau (family) story and create your own personal cultural storytelling.

#KoTāne #NgāiTahu #NgāiTūāhuriri #CulturalExperience #Ōtautahi #TraditionalKnowledge #MāoriCulture #AuthenticTourism #CulturalHeritage #NewZealand`
  },
  
  facebook: {
    waka: `What an incredible way to connect with the cultural heart of Ōtautahi Christchurch! Ko Tāne's waka experience on the Ōtākaro offers something truly special - the chance to understand our waterways through Ngāi Tahu and Ngāi Tūāhuriri eyes.

Our guide shared stories passed down through generations, explaining how these waters have sustained and connected our people for centuries. As traditional guardians of the Ōtākaro and keepers of its stories, Ngāi Tūāhuriri provide deep cultural insights that make this more than just a boat ride - it's a living cultural experience that honors tradition while creating new memories.

The peaceful journey along the Ōtākaro (Avon River) provides the perfect setting to learn about traditional navigation techniques and the deep spiritual connection Ngāi Tahu and Ngāi Tūāhuriri have with these waters.

Highly recommend for anyone wanting to experience authentic Māori culture with mana whenua in their own rohe. The knowledge shared and the respect shown for cultural protocols makes this a genuinely enriching experience.

#KoTāne #NgāiTahu #NgāiTūāhuriri #CulturalTourism #Ōtākaro #WakaExperience #Ōtautahi #AuthenticCulture`,
    
    cultural: `Ko Tāne continues to set the standard for authentic cultural tourism in Ōtautahi Christchurch. Their approach to sharing Ngāi Tahu and Ngāi Tūāhuriri culture is both respectful and deeply engaging.

What makes Ko Tāne special is their commitment to authentic storytelling. Every experience is guided by people who understand the cultural significance of the places and practices they share. This isn't performance - it's genuine cultural exchange with the traditional guardians of these waters.

The location on the Ōtākaro adds something magical. There's something profound about learning traditional stories while floating on the same waters that have been central to Ngāi Tahu and Ngāi Tūāhuriri life for generations.

For visitors wanting to understand the real cultural heritage of our region, Ko Tāne provides an experience that's both educational and deeply moving. This is how cultural tourism should be done.

#KoTāne #CulturalTourism #NgāiTahu #NgāiTūāhuriri #Ōtautahi #RespectfulTourism #CulturalAuthenticity`
  },
  
  linkedin: {
    waka: `Professional cultural experience review: Ko Tāne Traditional Waka Journey, Ōtautahi Christchurch.

As someone interested in sustainable and authentic tourism, Ko Tāne's approach to cultural sharing impressed me greatly. Their waka experience on the Ōtākaro (Avon River) demonstrates how tourism can respectfully honor indigenous culture while creating meaningful economic opportunities.

The experience showcased how traditional Ngāi Tahu and Ngāi Tūāhuriri knowledge systems continue to inform contemporary understanding of waterway management and cultural connection to place. As traditional guardians of the Ōtākaro and keepers of its stories, Ngāi Tūāhuriri bring essential cultural authority to this experience.

Key observations:
• Authentic cultural narrative delivered by knowledgeable guides
• Respectful integration of traditional and contemporary perspectives  
• Clear educational value alongside experiential elements
• Strong emphasis on cultural protocols and appropriate behavior
• Recognition of both Ngāi Tahu and Ngāi Tūāhuriri as mana whenua

For tourism operators looking to develop culturally authentic experiences, Ko Tāne provides an excellent model of how to share indigenous culture with integrity and respect.

#SustainableTourism #CulturalAuthenticity #IndigenousTourism #NgāiTahu #NgāiTūāhuriri #ResponsibleTravel #TourismInnovation`,
    
    cultural: `Ko Tāne's approach to cultural tourism in Ōtautahi Christchurch demonstrates how authentic indigenous experiences can drive both cultural preservation and economic development.

Their model successfully balances cultural integrity with commercial viability, creating meaningful employment for cultural practitioners while ensuring traditional knowledge from both Ngāi Tahu and Ngāi Tūāhuriri is shared appropriately. This represents sustainable tourism at its best.

What stands out is their commitment to authentic storytelling and cultural protocols. Rather than commodifying culture, they create genuine opportunities for cultural exchange that benefit both visitors and the local community, while properly acknowledging the traditional guardians of the Ōtākaro.

For businesses considering cultural partnerships, Ko Tāne shows how authentic collaboration with indigenous communities can create competitive advantage while supporting cultural continuity.

The integration of traditional knowledge with contemporary tourism practices offers valuable insights for the broader industry's evolution toward more sustainable and respectful models.

#CulturalTourism #IndigenousBusiness #SustainableEconomics #NgāiTahu #NgāiTūāhuriri #CulturalPreservation #ResponsibleTourism #TourismInnovation`
  }
}

// 🎯 KO TĀNE CONTENT DETECTION
const detectKoTaneContent = (text: string): { isKoTane: boolean, experienceType: string } => {
  const lowerText = text.toLowerCase()
  
  const koTaneTerms = ['ko tāne', 'ko tane', 'kotane']
  const wakaTerms = ['waka', 'ōtākaro', 'otakaro', 'avon river', 'river', 'water']
  const culturalTerms = ['ngāi tahu', 'ngai tahu', 'ngāi tūāhuriri', 'ngai tuahuriri', 'māori', 'maori', 'cultural', 'traditional']
  
  const isKoTane = koTaneTerms.some(term => lowerText.includes(term))
  
  let experienceType = 'cultural'
  if (wakaTerms.some(term => lowerText.includes(term))) {
    experienceType = 'waka'
  }
  
  return { isKoTane, experienceType }
}

// 🎯 GET CACHED KO TĀNE TEMPLATE
const getKoTaneTemplate = (platform: string, experienceType: string, userStory: string): string => {
  const template = KO_TANE_TEMPLATES[platform as keyof typeof KO_TANE_TEMPLATES]?.[experienceType as keyof typeof KO_TANE_TEMPLATES.instagram]
  
  if (template && userStory.length > 20) {
    // Personalize template with user story elements
    return template.replace('Our traditional waka journey', `${userStory.substring(0, 100)}...

Our traditional waka journey`)
  }
  
  return template || ''
}

export async function POST(request: NextRequest) {
  try {
    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY
    if (!CLAUDE_API_KEY || !CLAUDE_API_KEY.startsWith('sk-ant-')) {
      return NextResponse.json(
        { error: 'Claude API key not configured properly' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { 
      prompt, 
      platforms, 
      formats, 
      userData,
      mobileOptimized = false, // 📱 NEW: Mobile optimization flag
      maxTokens,
      platform: singlePlatform // 📱 NEW: For single platform generation
    } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    console.log('🚀 Generating content for:')
    console.log('📱 Mobile optimized:', mobileOptimized)
    console.log('📝 Platform:', singlePlatform || platforms)
    console.log('👤 User story preview:', userData?.story?.substring(0, 50) + '...')

    // 🎯 KO TĀNE OPTIMIZATION: Check for cached content first
    if (userData?.story) {
      const koTaneDetection = detectKoTaneContent(userData.story)
      
      if (koTaneDetection.isKoTane && singlePlatform) {
        const cachedTemplate = getKoTaneTemplate(singlePlatform, koTaneDetection.experienceType, userData.story)
        
        if (cachedTemplate) {
          console.log('🎯 Using Ko Tāne cached template for', singlePlatform)
          
          // Simulate brief processing time for better UX
          await new Promise(resolve => setTimeout(resolve, 800))
          
          return NextResponse.json({
            content: cachedTemplate,
            platforms: [singlePlatform],
            formats: formats || ['social-post'],
            success: true,
            cached: true, // 📱 NEW: Indicate this was cached
            koTaneOptimized: true, // 📱 NEW: Ko Tāne flag
            generationTime: 800,
            metadata: {
              contentLength: cachedTemplate.length,
              platformCount: 1,
              formatCount: 1,
              timestamp: new Date().toISOString(),
              mobileOptimized,
              koTaneDetection
            }
          })
        }
      }
    }

    // 📱 MOBILE-OPTIMIZED PROMPT BUILDING
    let enhancedPrompt = prompt
    
    if (mobileOptimized && singlePlatform) {
      // Shorter, focused prompts for mobile
      enhancedPrompt = `Create engaging ${singlePlatform} content for this story: "${userData?.story || 'Amazing experience'}"

Location: ${userData?.location || 'New Zealand'}
Business: ${userData?.businessType || 'Tourism'}

Requirements:
- ${singlePlatform === 'instagram' ? '125-150 words' : singlePlatform === 'facebook' ? '150-200 words' : '200-300 words'}
- Include relevant hashtags
- Respectful cultural language
- Engaging call-to-action
- ${mobileOptimized ? 'Mobile-optimized format' : 'Standard format'}

Focus on authentic storytelling with cultural respect.`
    } else {
      // Original enhanced prompt for desktop
      enhancedPrompt = `${prompt}

PLATFORMS TO OPTIMIZE FOR: ${platforms?.join(', ') || singlePlatform || 'Not specified'}
CONTENT FORMATS REQUESTED: ${formats?.join(', ') || 'Not specified'}

Please create content optimized for each platform AND in the requested formats.
Ensure each piece of content is specifically tailored for its platform AND format combination.`
    }

    // 📱 MOBILE TOKEN OPTIMIZATION
    const tokenLimit = mobileOptimized 
      ? (maxTokens || 1500) // Reduced for mobile
      : (maxTokens || 2000) // Standard for desktop

    const claudeRequestBody = {
      model: CLAUDE_MODEL,
      max_tokens: tokenLimit,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: enhancedPrompt
      }]
    }

    // ⏱️ MOBILE TIMEOUT OPTIMIZATION
    const timeoutMs = mobileOptimized ? 30000 : 60000 // 30s for mobile, 60s for desktop
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    const startTime = Date.now()

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': ANTHROPIC_VERSION
      },
      body: JSON.stringify(claudeRequestBody),
      signal: controller.signal
    }).catch((err) => {
      if (err.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeoutMs/1000}s`)
      }
      throw err
    })

    clearTimeout(timeout)
    const generationTime = Date.now() - startTime

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Claude API error: ${response.status}`, errorText)
      return NextResponse.json(
        { error: `Claude API error: ${response.status}`, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    const generatedContent = data.content?.[0]?.text

    if (!generatedContent) {
      return NextResponse.json(
        { error: 'No content generated by Claude' },
        { status: 500 }
      )
    }

    console.log(`✅ SUCCESS! Generated content in ${generationTime}ms`)

    // 📱 ENHANCED RESPONSE WITH MOBILE METADATA
    return NextResponse.json({
      content: generatedContent,
      platforms: singlePlatform ? [singlePlatform] : platforms,
      formats: formats || ['social-post'],
      success: true,
      cached: false,
      koTaneOptimized: userData?.story ? detectKoTaneContent(userData.story).isKoTane : false,
      generationTime,
      metadata: {
        contentLength: generatedContent.length,
        platformCount: singlePlatform ? 1 : (platforms?.length || 0),
        formatCount: formats?.length || 1,
        timestamp: new Date().toISOString(),
        mobileOptimized,
        tokenLimit,
        model: CLAUDE_MODEL
      }
    })

  } catch (error) {
    console.error('❌ Server error:', error)
    return NextResponse.json(
      { 
        error: 'Content generation failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        mobileOptimized: false
      },
      { status: 500 }
    )
  }
}
