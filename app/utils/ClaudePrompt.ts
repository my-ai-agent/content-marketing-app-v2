// /app/utils/claudePrompt.ts
// Enhanced Claude prompt generation with web scraping integration

import { scrapeWebsiteBasic, generateBrandContext, ScrapedBrandData } from './webScraper'

export interface UserData {
  photo?: string
  story?: string
  persona?: string
  audience?: string
  interests?: string
  platforms?: string[]
  formats?: string[]
  businessType?: string
  websiteUrl?: string
  name?: string
  location?: string
  culturalConnection?: string
}

export interface EnhancedPromptData extends UserData {
  brandContext?: string
  scrapedData?: ScrapedBrandData
}

// Privacy settings remain the same
export const defaultPrivacySettings = {
  consentGiven: false,
  dataRetention: '24-hours',
  aiProcessing: 'temporary',
  culturalSensitivity: 'high'
}

// Platform-specific optimization templates
const platformOptimization = {
  instagram: {
    style: 'visual-first storytelling with engaging captions',
    length: '125-150 words',
    tone: 'authentic and inspiring',
    hashtags: '8-12 relevant hashtags',
    callToAction: 'encourage engagement and shares'
  },
  facebook: {
    style: 'community-focused narrative with personal connection',
    length: '150-200 words',
    tone: 'conversational and relatable',
    engagement: 'encourage comments and discussion',
    callToAction: 'drive meaningful interactions'
  },
  linkedin: {
    style: 'professional storytelling with industry insights',
    length: '200-300 words',
    tone: 'authoritative yet personable',
    value: 'provide business value and networking opportunities',
    callToAction: 'encourage professional connections'
  }
}

// Enhanced business type mappings with cultural context
const businessTypePrompts = {
  'visitor-attraction': {
    focus: 'unique cultural experiences and visitor journey',
    expertise: 'cultural storytelling and heritage preservation',
    audienceValue: 'authentic cultural immersion and learning',
    culturalNote: 'respectful representation of indigenous stories and protocols'
  },
  'accommodation': {
    focus: 'hospitality excellence and guest experience',
    expertise: 'comfort, service quality, and local connections',
    audienceValue: 'memorable stays and local insider knowledge',
    culturalNote: 'incorporation of local cultural elements and Māori hospitality principles'
  },
  'food-beverage': {
    focus: 'culinary journey and local flavors',
    expertise: 'food quality, local sourcing, and cultural cuisine',
    audienceValue: 'authentic taste experiences and cultural food stories',
    culturalNote: 'respect for traditional recipes and indigenous food practices'
  },
  'tours-activities': {
    focus: 'adventure and cultural discovery experiences',
    expertise: 'safety, local knowledge, and experiential learning',
    audienceValue: 'transformative experiences and cultural understanding',
    culturalNote: 'respectful access to cultural sites and traditional knowledge sharing'
  },
  'cultural-heritage': {
    focus: 'preservation and sharing of cultural knowledge',
    expertise: 'authentic cultural interpretation and education',
    audienceValue: 'deep cultural learning and respectful engagement',
    culturalNote: 'protection of sacred knowledge and appropriate cultural sharing protocols'
  },
  'wellness-spa': {
    focus: 'holistic wellbeing and cultural healing practices',
    expertise: 'therapeutic treatments and mindful relaxation',
    audienceValue: 'restoration and cultural wellness traditions',
    culturalNote: 'integration of traditional Māori wellness practices and rongoā Māori'
  }
}

// Personal persona enhanced prompts
const personalPersonaPrompts = {
  'cultural-explorer': {
    voice: 'curious and respectful cultural learner',
    focus: 'deep cultural connections and meaningful experiences',
    style: 'thoughtful reflection and cultural appreciation'
  },
  'adventure-seeker': {
    voice: 'enthusiastic and bold experience sharer',
    focus: 'exciting discoveries and personal challenges',
    style: 'energetic storytelling with inspirational calls to action'
  },
  'content-creator': {
    voice: 'creative and engaging digital storyteller',
    focus: 'visual narratives and shareable moments',
    style: 'platform-optimized content with strong visual elements'
  },
  'family-storyteller': {
    voice: 'warm and inclusive family narrator',
    focus: 'multi-generational experiences and family bonding',
    style: 'heartwarming stories that resonate with families'
  },
  'independent-traveller': {
    voice: 'authentic and practical experience sharer',
    focus: 'genuine travel insights and personal discoveries',
    style: 'honest, detailed accounts with practical value'
  }
}

// Main function to generate enhanced Claude prompt
export async function generateEnhancedClaudePrompt(userData: UserData): Promise<string> {
  let enhancedData: EnhancedPromptData = { ...userData }

  // Scrape website if URL is provided and user is business type
  if (userData.websiteUrl && userData.businessType) {
    try {
      console.log('Scraping website for brand context:', userData.websiteUrl)
      const scrapedData = await scrapeWebsiteBasic(userData.websiteUrl)
      
      if (scrapedData.success) {
        enhancedData.brandContext = generateBrandContext(scrapedData)
        enhancedData.scrapedData = scrapedData
        console.log('Brand context generated successfully')
      } else {
        console.warn('Website scraping failed, proceeding without brand context')
      }
    } catch (error) {
      console.warn('Error during website scraping:', error)
    }
  }

  // Generate platform-specific prompts
  const platforms = userData.platforms || ['instagram']
  const prompts: { [platform: string]: string } = {}

  for (const platform of platforms) {
    prompts[platform] = await generatePlatformSpecificPrompt(enhancedData, platform)
  }

  return JSON.stringify(prompts, null, 2)
}

// Generate platform-specific prompt with brand context
async function generatePlatformSpecificPrompt(data: EnhancedPromptData, platform: string): Promise<string> {
  const platformConfig = platformOptimization[platform as keyof typeof platformOptimization]
  const isBusinessUser = !!data.businessType
  
  let prompt = `ACT AS: ${isBusinessUser ? 'Professional tourism content strategist' : 'Authentic travel storyteller'} creating ${platform} content\n\n`

  // Add cultural intelligence context
  prompt += `CULTURAL INTELLIGENCE FRAMEWORK:
- Always respect Te Tiriti o Waitangi principles and Māori cultural protocols
- Use appropriate cultural terminology and acknowledgments
- Avoid appropriation of sacred or restricted cultural elements
- Promote authentic, respectful cultural engagement
- Include iwi acknowledgments when referencing specific locations\n\n`

  // Add user context
  if (data.name) {
    prompt += `CONTENT CREATOR: ${data.name}\n`
  }
  
  if (data.location) {
    prompt += `LOCATION: ${data.location}\n`
  }

  if (data.culturalConnection) {
    prompt += `CULTURAL CONNECTION: ${data.culturalConnection}\n`
  }

  // Add business or personal context
  if (isBusinessUser && data.businessType) {
    const businessContext = businessTypePrompts[data.businessType as keyof typeof businessTypePrompts]
    if (businessContext) {
      prompt += `\nBUSINESS CONTEXT:
- Business Type: ${data.businessType}
- Industry Focus: ${businessContext.focus}
- Core Expertise: ${businessContext.expertise}
- Audience Value: ${businessContext.audienceValue}
- Cultural Consideration: ${businessContext.culturalNote}\n`
    }

    // Add scraped brand context if available
    if (data.brandContext) {
      prompt += `\n${data.brandContext}`
    }
  } else if (data.persona) {
    const personaContext = personalPersonaPrompts[data.persona as keyof typeof personalPersonaPrompts]
    if (personaContext) {
      prompt += `\nPERSONAL CONTEXT:
- Creator Voice: ${personaContext.voice}
- Content Focus: ${personaContext.focus}
- Storytelling Style: ${personaContext.style}\n`
    }
  }

  // Add platform optimization
  if (platformConfig) {
    prompt += `\nPLATFORM OPTIMIZATION for ${platform.toUpperCase()}:
- Content Style: ${platformConfig.style}
- Target Length: ${platformConfig.length}
- Tone: ${platformConfig.tone}`

    if ('hashtags' in platformConfig) {
      prompt += `\n- Hashtags: ${platformConfig.hashtags}`
    }
    if ('engagement' in platformConfig) {
      prompt += `\n- Engagement: ${platformConfig.engagement}`
    }
    if ('value' in platformConfig) {
      prompt += `\n- Value Proposition: ${platformConfig.value}`
    }
    
    prompt += `\n- Call to Action: ${platformConfig.callToAction}\n`
  }

  // Add content requirements
  prompt += `\nCONTENT REQUIREMENTS:
- Transform the provided story into engaging ${platform} content
- Maintain authentic voice while optimizing for platform
- Include relevant cultural context and location acknowledgments
- Ensure content respects cultural protocols and sensitivities
- Create compelling call-to-action appropriate for the platform\n`

  // Add audience targeting
  if (data.audience) {
    prompt += `\nTARGET AUDIENCE: ${data.audience}\n`
  }

  if (data.interests) {
    prompt += `AUDIENCE INTERESTS: ${data.interests}\n`
  }

  // Add story content
  if (data.story) {
    prompt += `\nORIGINAL STORY TO TRANSFORM:\n"${data.story}"\n`
  }

  // Add photo context if available
  if (data.photo) {
    prompt += `\nVISUAL CONTEXT: Photo(s) provided showing the experience/location\n`
  }

  // Final instructions
  prompt += `\nFINAL INSTRUCTIONS:
- Generate authentic, culturally-intelligent content that resonates with ${platform} users
- Ensure all cultural references are respectful and appropriate
- Include specific location details with proper cultural acknowledgments
- Create engaging content that drives meaningful interaction
- Maintain the authentic voice while optimizing for platform algorithms
- Include relevant hashtags and calls-to-action as appropriate for ${platform}`

  // Add brand voice consistency for business users
  if (isBusinessUser && data.scrapedData?.success) {
    prompt += `\n- CRITICAL: Match the established brand voice and messaging style identified from the website analysis`
  }

  return prompt
}

// Generate mock content for development/testing (keeping original function)
export function generateMockContent(userData: UserData): { [platform: string]: any } {
  const platforms = userData.platforms || ['instagram', 'facebook']
  const mockContent: { [platform: string]: any } = {}

  platforms.forEach(platform => {
    const isBusinessUser = !!userData.businessType
    const baseContent = userData.story || "Amazing experience at this beautiful location"

    let content = ""
    let hashtags: string[] = []
    let tips = ""

    if (platform === 'instagram') {
      content = `🌟 ${baseContent}\n\n${isBusinessUser ? 'Experience authentic New Zealand culture with us!' : 'What an incredible journey through Aotearoa!'}\n\n#NewZealand #Aotearoa #CulturalTourism #AuthenticExperience`
      hashtags = ['#NewZealand', '#Aotearoa', '#CulturalTourism', '#AuthenticExperience']
      tips = "Best times to visit: Early morning or late afternoon for perfect lighting"
    } else if (platform === 'facebook') {
      content = `${baseContent}\n\nThis experience really showed me the beauty of New Zealand's cultural heritage. ${isBusinessUser ? 'We welcome visitors to share in these authentic moments.' : 'Highly recommend for anyone wanting to connect with local culture!'}`
      tips = "Remember to be respectful of cultural protocols and local customs"
    } else if (platform === 'linkedin') {
      content = `Professional insight: ${baseContent}\n\nThe tourism industry in New Zealand continues to showcase how authentic cultural experiences can create meaningful connections between visitors and local communities.`
      tips = "Consider the business impact of cultural tourism on local communities"
    }

    mockContent[platform] = {
      content,
      hashtags,
      tips,
      estimatedReach: Math.floor(Math.random() * 1000) + 500,
      suggestedPostTime: "6:00 PM - 8:00 PM"
    }
  })

  return mockContent
}

// Enhanced content generation with real Claude API (placeholder for integration)
export async function generateClaudeContent(userData: UserData): Promise<{ [platform: string]: any }> {
  try {
    // Generate enhanced prompt with brand context
    const enhancedPrompt = await generateEnhancedClaudePrompt(userData)
    
    console.log('Generated enhanced prompt:', enhancedPrompt)
    
    // TODO: Replace with actual Claude API call
    // const response = await callClaudeAPI(enhancedPrompt)
    
    // For now, return enhanced mock content
    const mockContent = generateMockContent(userData)
    
    // Add brand context indicator if available
    if (userData.websiteUrl) {
      Object.keys(mockContent).forEach(platform => {
        mockContent[platform].brandEnhanced = true
        mockContent[platform].websiteAnalyzed = userData.websiteUrl
      })
    }
    
    return mockContent
    
  } catch (error) {
    console.error('Error generating Claude content:', error)
    
    // Fallback to regular mock content
    return generateMockContent(userData)
  }
}

// Function to be called from results page
export function generateContentWithBrandContext(userData: UserData) {
  return generateClaudeContent(userData)
}

// Backward compatibility - export the original function name
export const generateClaudePrompt = generateEnhancedClaudePrompt
