// /app/utils/claudePrompt.ts
// Essential Claude prompt generation logic extracted from generate page

export interface UserData {
  photo?: string
  story?: string
  persona?: string
  audience?: string
  interests?: string
  platforms?: string[]
  formats?: string[]
}

export interface PrivacySettings {
  includePhoto: boolean
  detailLevel: 'basic' | 'enhanced' | 'full'
  shareStoryDetails: boolean
  anonymizeLocation: boolean
}

// Sanitize data based on privacy settings
export const sanitizeUserData = (data: UserData, privacy: PrivacySettings): UserData => {
  const sanitized = { ...data }

  // Handle photo
  if (!privacy.includePhoto && sanitized.photo) {
    // Convert photo to description instead of sending actual image
    sanitized.photo = "Cultural tourism experience photo"
    delete sanitized.photo // Remove actual photo data
  }

  // Handle story details
  if (!privacy.shareStoryDetails) {
    sanitized.story = "Authentic New Zealand tourism experience"
  } else if (privacy.anonymizeLocation && sanitized.story) {
    // Remove specific location details
    sanitized.story = sanitized.story
      .replace(/\b[A-Z][a-z]+\s+(village|town|city|region)\b/gi, 'thermal region')
      .replace(/\bWhakarewarewa\b/gi, 'traditional Māori village')
      .replace(/\bRotorua\b/gi, 'geothermal region')
  }

  return sanitized
}

// Comprehensive persona mapping
export const personaMap: { [key: string]: string } = {
  'professional': 'Professional/Business Owner - authoritative, business-focused content',
  'influencer': 'Content Creator/Influencer - engaging, personal storytelling',
  'adventure': 'Adventure Seeker - excited, energetic content',
  'female': 'Female Traveller - safety-conscious, authentic sharing',
  'cultural': 'Cultural Explorer - respectful, educational content',
  'family': 'Family Traveller - inclusive, multi-generational appeal',
  'storyteller': 'Storyteller/Writer - narrative-focused, detailed content',
  'eco': 'Eco Tourism Champion - sustainability-focused messaging',
  'vfr': 'Visiting Friends & Family - personal, relationship-focused',
  'independent': 'Free & Independent Traveller - flexible, self-guided content'
}

// Comprehensive audience mapping
export const audienceMap: { [key: string]: string } = {
  'baby-boomers': 'Baby Boomers (comfort-seeking, knowledge-focused)',
  'gen-x': 'Gen X (family-focused, value-conscious)',
  'millennials': 'Millennials (experience-focused, social media savvy)',
  'gen-z': 'Gen Z (digital natives, authenticity-focused)',
  'female-travellers': 'Female Travellers (safety-conscious, community-oriented)',
  'families': 'Family Travellers (multi-generational, child-friendly)',
  'eco-tourism': 'Eco-Tourism Enthusiasts (sustainability-minded)',
  'vfr': 'Visiting Friends & Relatives (personal connections)',
  'conference': 'Event/Conference Delegates (business travelers)',
  'independent': 'Free & Independent Travellers (self-planned)',
  'luxury': 'Luxury/Premium Travellers (high-end experiences)',
  'adventure': 'Adventure/Active Travellers (outdoor experiences)',
  'cultural': 'Cultural Heritage Seekers (history enthusiasts)',
  'digital-nomads': 'Digital Nomads (remote workers)',
  'honeymoon': 'Honeymoon/Romance Travellers (couples)',
  'solo': 'Solo Travellers (independent explorers)',
  'accessible': 'Accessible Tourism (inclusive experiences)'
}

// Generate comprehensive Claude prompt for content creation
export const generateClaudePrompt = (data: UserData, privacy: PrivacySettings): string => {
  const sanitizedData = sanitizeUserData(data, privacy)

  return `You are a professional tourism content expert specializing in culturally-sensitive, authentic New Zealand storytelling.

CREATOR PROFILE:
- Type: ${personaMap[sanitizedData.persona || ''] || 'Tourism Content Creator'}
- Experience: ${sanitizedData.story || 'Authentic New Zealand tourism experience'}

TARGET AUDIENCE: ${audienceMap[sanitizedData.audience || ''] || 'Tourism enthusiasts'}

INTEREST FOCUS: ${sanitizedData.interests || 'Cultural experiences'}

PLATFORMS REQUESTED: ${sanitizedData.platforms?.join(', ') || 'Social media'}
FORMATS REQUESTED: ${sanitizedData.formats?.join(', ') || 'Social posts'}

CULTURAL REQUIREMENTS:
- Respect Mātauranga Māori intellectual property and cultural protocols
- Use authentic representation without appropriation
- Include sustainable tourism messaging
- Ensure cultural sensitivity in all content
- Acknowledge the mana (spiritual power) of places and people

CONTENT GUIDELINES:
- Create engaging, platform-optimized content for each requested format
- Match the creator's voice and style to their persona type
- Appeal specifically to the target audience demographics
- Include relevant hashtags and engagement strategies
- Provide call-to-action appropriate for the creator type
- Ensure content promotes responsible tourism practices

GENERATE:
Create ${sanitizedData.platforms?.length || 1} distinct pieces of content, one optimized for each platform:
${sanitizedData.platforms?.map(platform => `- ${platform}: ${sanitizedData.formats?.join(' and ') || 'Social post'}`).join('\n') || '- Social media post'}

Each piece should:
1. Reflect the ${personaMap[sanitizedData.persona || '']} voice
2. Appeal to ${audienceMap[sanitizedData.audience || '']}
3. Focus on ${sanitizedData.interests || 'cultural experiences'}
4. Include platform-specific optimization
5. Maintain cultural respect and authenticity

IMPORTANT: All content must honor Te Tiriti o Waitangi principles and support sustainable, culturally-conscious tourism in Aotearoa New Zealand.`
}

// Default privacy settings for auto-generation
export const defaultPrivacySettings: PrivacySettings = {
  includePhoto: false,
  detailLevel: 'enhanced',
  shareStoryDetails: true,
  anonymizeLocation: true
}

// Generate mock content for testing (can be replaced with actual Claude API)
export const generateMockContent = (data: UserData) => {
  // Helper function to generate user-friendly engagement text
  const getEngagementText = (platform: string, audience: string) => {
    const audienceAge = audience?.toLowerCase() || ''
    
    if (audienceAge.includes('baby-boomers') || audienceAge.includes('gen-x')) {
      return 'Share this with friends and family who would love this experience!'
    } else if (platform === 'TikTok') {
      return 'Tag someone who needs to see this! (Type @ followed by their username)'
    } else if (platform === 'LinkedIn') {
      return 'Share your thoughts in the comments below.'
    } else {
      return 'Tag a friend who needs to experience this! (Type @ + their name)'
    }
  }

  return {
    platforms: data.platforms?.map(platform => ({
      name: platform,
      content: {
        text: `🌟 ${data.story?.substring(0, 120)}...\n\nAn incredible cultural experience that perfectly captures the spirit of Aotearoa New Zealand! ${platform === 'Instagram' ? '✨' : ''}\n\n${platform === 'LinkedIn' ? 'This authentic encounter showcases the importance of cultural tourism done right.' : getEngagementText(platform, data.audience || '')}\n\n#NewZealand #CulturalTourism #Authentic${platform === 'Instagram' ? ' #TravelGram #Culture' : ''}`,
        hashtags: platform === 'Instagram' 
          ? ['#NewZealand', '#CulturalTourism', '#TravelGram', '#Authentic', '#Culture', '#Māori', '#Thermal', '#Travel']
          : ['#NewZealand', '#CulturalTourism', '#Authentic'],
        callToAction: data.persona === 'professional' 
          ? 'Experience authentic cultural tourism - book your visit today!'
          : getEngagementText(platform, data.audience || ''),
        optimalTiming: platform === 'Instagram' ? 'Post between 11am-1pm or 7-9pm NZST' : 'Post weekdays 8-10am NZST',
        engagementTips: `Optimized for ${platform} - ${data.audience} engagement`,
        platformTips: platform === 'TikTok' 
          ? 'Tip: Use @ followed by a username to tag someone (e.g. @yourfriend)'
          : platform === 'Instagram' 
          ? 'Tip: Tag friends by typing @ and their username in comments'
          : 'Tip: Engage authentically with your network'
      }
    })) || [],
    metrics: {
      estimatedReach: '2,500-5,000 people',
      engagementRate: '4.2-6.8%',
      culturalSensitivityScore: '95/100',
      sustainabilityRating: 'High'
    },
    recommendations: [
      'Content respects Mātauranga Māori protocols',
      'Promotes sustainable tourism practices',
      'Optimized for target audience engagement',
      'Platform-specific formatting applied'
    ]
  }
}
