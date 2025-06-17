import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Generational Psychology Profiles for Content Generation
const generationalProfiles = {
  'Gen Z (1997-2012) - Digital natives prioritizing authenticity': {
    platforms: ['TikTok', 'Instagram', 'Snapchat'],
    contentStyle: 'authentic, visual, mobile-first, sustainable',
    decisionFactors: ['social proof', 'sustainability', 'authenticity', 'visual appeal'],
    communicationStyle: 'casual, direct, emoji-friendly, story-driven',
    valuePropositions: ['authenticity', 'sustainability', 'self-discovery', 'social impact'],
    contentFormats: ['short videos', 'Instagram stories', 'visual content', 'user-generated content'],
    callToActionStyle: 'urgent, FOMO-driven, community-focused'
  },
  'Millennials (1981-1996) - Experience-focused, cultural seekers': {
    platforms: ['Instagram', 'Facebook', 'YouTube'],
    contentStyle: 'experience-focused, research-backed, authentic, detailed',
    decisionFactors: ['reviews', 'authenticity', 'value', 'social sharing potential'],
    communicationStyle: 'conversational, informative, story-telling, experience-rich',
    valuePropositions: ['authentic experiences', 'personal growth', 'cultural immersion', 'memories'],
    contentFormats: ['long-form posts', 'detailed guides', 'experience stories', 'photo galleries'],
    callToActionStyle: 'experience-driven, value-focused, socially shareable'
  },
  'Gen X (1965-1980) - Family-focused, value-conscious': {
    platforms: ['Facebook', 'Email', 'Google Search'],
    contentStyle: 'practical, family-oriented, value-focused, informative',
    decisionFactors: ['safety', 'value', 'family-friendly', 'convenience'],
    communicationStyle: 'straightforward, practical, benefit-focused, trustworthy',
    valuePropositions: ['family bonding', 'practical benefits', 'value for money', 'convenience'],
    contentFormats: ['detailed articles', 'family guides', 'practical tips', 'comparison content'],
    callToActionStyle: 'benefit-focused, family-oriented, value-driven'
  },
  'Baby Boomers (1946-1964) - Comfort-seeking, knowledge-focused': {
    platforms: ['Email', 'Facebook', 'Traditional websites'],
    contentStyle: 'informative, comfortable, service-oriented, traditional',
    decisionFactors: ['comfort', 'service quality', 'reputation', 'expert guidance'],
    communicationStyle: 'formal, respectful, detailed, expert-led',
    valuePropositions: ['cultural enrichment', 'comfort', 'expert guidance', 'premium service'],
    contentFormats: ['detailed brochures', 'expert articles', 'testimonials', 'traditional marketing'],
    callToActionStyle: 'comfort-focused, service-oriented, expert-recommended'
  },
  'Multi-Generational Families - Mixed-age groups': {
    platforms: ['Facebook', 'WhatsApp', 'Email'],
    contentStyle: 'inclusive, flexible, memory-focused, adaptable',
    decisionFactors: ['inclusivity', 'flexibility', 'group appeal', 'accessibility'],
    communicationStyle: 'inclusive, warm, memory-focused, family-oriented',
    valuePropositions: ['shared memories', 'inclusive experiences', 'family bonding', 'accessibility'],
    contentFormats: ['family stories', 'inclusive content', 'accessibility guides', 'group activities'],
    callToActionStyle: 'inclusive, memory-focused, family-bonding'
  },
  'Business & Corporate Travellers - Professional efficiency-focused': {
    platforms: ['LinkedIn', 'Email', 'Professional networks'],
    contentStyle: 'professional, efficient, ROI-focused, networking-oriented',
    decisionFactors: ['efficiency', 'professional value', 'networking opportunities', 'ROI'],
    communicationStyle: 'professional, concise, benefit-focused, results-oriented',
    valuePropositions: ['professional development', 'business success', 'networking', 'efficiency'],
    contentFormats: ['professional case studies', 'ROI analysis', 'networking content', 'business benefits'],
    callToActionStyle: 'professional, ROI-focused, efficiency-driven'
  }
}

// New Zealand Cultural Context
const nzCulturalContext = {
  locations: {
    'Christchurch': {
      iwi: 'Ngāi Tahu',
      culturalElements: ['Garden City', 'Māori heritage', 'Rebuild story', 'Canterbury Plains'],
      seasonalHighlights: ['Spring gardens', 'Winter skiing', 'Autumn colours', 'Summer festivals']
    },
    'Auckland': {
      iwi: 'Ngāti Whātua',
      culturalElements: ['City of Sails', 'Polynesian culture', 'Urban diversity', 'Harbour bridge'],
      seasonalHighlights: ['Summer beaches', 'Winter events', 'Spring blooms', 'Autumn wine']
    },
    'Wellington': {
      iwi: 'Te Āti Awa',
      culturalElements: ['Capital culture', 'Arts scene', 'Wellington wind', 'Craft beer'],
      seasonalHighlights: ['Summer festivals', 'Winter storms', 'Spring culture', 'Autumn theatre']
    },
    'Queenstown': {
      iwi: 'Ngāi Tahu',
      culturalElements: ['Adventure capital', 'Southern Alps', 'Lake Wakatipu', 'Gold mining history'],
      seasonalHighlights: ['Winter skiing', 'Summer adventures', 'Spring hiking', 'Autumn colours']
    }
  },
  maoriGreetings: ['Kia ora', 'Haere mai', 'Nau mai'],
  culturalValues: ['manaakitanga (hospitality)', 'whakapapa (connections)', 'taiao (environment)']
}

export async function POST(request: Request) {
  try {
    const { 
      story, 
      targetAudience, 
      interests, 
      platforms,
      location = 'New Zealand',
      contentType = 'social_media_post'
    } = await request.json()

    // Get generational profile
    const profile = generationalProfiles[targetAudience as keyof typeof generationalProfiles]
    
    if (!profile) {
      return NextResponse.json({ error: 'Invalid target audience' }, { status: 400 })
    }

    // Get cultural context
    const culturalContext = nzCulturalContext.locations[location as keyof typeof nzCulturalContext.locations] || null

    // Generate multiple content variations
    const contentVariations = await generateContentVariations({
      story,
      profile,
      interests,
      platforms,
      culturalContext,
      contentType
    })

    return NextResponse.json({
      success: true,
      targetAudience,
      profile: {
        platforms: profile.platforms,
        contentStyle: profile.contentStyle,
        valuePropositions: profile.valuePropositions
      },
      culturalContext,
      contentVariations
    })

  } catch (error) {
    console.error('Enhanced content generation error:', error)
    return NextResponse.json({ error: 'Failed to generate enhanced content' }, { status: 500 })
  }
}

async function generateContentVariations({
  story,
  profile,
  interests,
  platforms,
  culturalContext,
  contentType
}: any) {
  const variations = []

  // Platform-specific variations
  for (const platform of profile.platforms.slice(0, 3)) {
    const prompt = `
Create ${contentType} content for ${platform} targeting ${profile.contentStyle} audience.

Story: ${story}
Interests: ${interests?.join(', ') || 'general travel'}
Communication Style: ${profile.communicationStyle}
Value Propositions: ${profile.valuePropositions.join(', ')}
Call-to-Action Style: ${profile.callToActionStyle}

${culturalContext ? `
Cultural Context: 
- Location: ${culturalContext.iwi} iwi territory
- Cultural Elements: ${culturalContext.culturalElements.join(', ')}
- Include appropriate cultural respect and local knowledge
` : ''}

Requirements:
- Match ${platform} content style and format
- Use ${profile.contentStyle} tone
- Include ${profile.decisionFactors.join(' and ')} elements
- Keep culturally appropriate for New Zealand
- Include relevant hashtags and calls-to-action

Generate compelling, authentic content that resonates with this specific audience psychology.
`

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.8
      })

      variations.push({
        platform,
        content: response.choices[0]?.message?.content || '',
        style: profile.contentStyle,
        targetFactors: profile.decisionFactors
      })
    } catch (error) {
      console.error(`Error generating content for ${platform}:`, error)
    }
  }

  // Add a cultural-specific variation if context available
  if (culturalContext) {
    const culturalPrompt = `
Create culturally-informed content that respectfully incorporates ${culturalContext.iwi} perspectives and local knowledge.

Story: ${story}
Cultural Elements: ${culturalContext.culturalElements.join(', ')}
Communication Style: ${profile.communicationStyle}

Include:
- Appropriate cultural acknowledgment
- Local seasonal context
- Respect for indigenous culture
- Authentic New Zealand voice

Generate content that shows cultural awareness and local expertise.
`

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: culturalPrompt }],
        max_tokens: 500,
        temperature: 0.7
      })

      variations.push({
        platform: 'Cultural',
        content: response.choices[0]?.message?.content || '',
        style: 'culturally-informed',
        targetFactors: ['cultural respect', 'local knowledge']
      })
    } catch (error) {
      console.error('Error generating cultural content:', error)
    }
  }

  return variations
}
