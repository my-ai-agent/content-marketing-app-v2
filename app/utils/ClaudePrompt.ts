// /app/utils/claudePrompt.ts
// Enhanced Claude prompt generation with business type integration

export interface UserData {
  photo?: string
  story?: string
  persona?: string
  audience?: string
  interests?: string
  platforms?: string[]
  formats?: string[]
  businessType?: string
  photoType?: string
}

export interface BusinessTypeDetails {
  id: string
  title: string
  subtitle: string
  description: string
  contentFocus: string[]
  emoji: string
  examples: string[]
}

export interface PrivacySettings {
  includePhoto: boolean
  detailLevel: 'basic' | 'enhanced' | 'full'
  shareStoryDetails: boolean
  anonymizeLocation: boolean
}

// Sanitize data based on privacy settings
export const sanitiseUserData = (data: UserData, privacy: PrivacySettings): UserData => {
  const sanitised = { ...data }

  // Handle photo
  if (!privacy.includePhoto && sanitised.photo) {
    // Convert photo to description instead of sending actual image
    sanitised.photo = "Cultural tourism experience photo"
    delete sanitised.photo // Remove actual photo data
  }

  // Handle story details
  if (!privacy.shareStoryDetails) {
    sanitised.story = "Authentic New Zealand tourism experience"
  } else if (privacy.anonymizeLocation && sanitised.story) {
    // Remove specific location details
    sanitised.story = sanitised.story
      .replace(/\b[A-Z][a-z]+\s+(village|town|city|region)\b/gi, 'thermal region')
      .replace(/\bWhakarewarewa\b/gi, 'traditional Māori village')
      .replace(/\bRotorua\b/gi, 'geothermal region')
  }

  return sanitised
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
  'conference': 'Event/Conference Delegates (business travellers)',
  'independent': 'Free & Independent Travellers (self-planned)',
  'luxury': 'Luxury/Premium Travellers (high-end experiences)',
  'adventure': 'Adventure/Active Travellers (outdoor experiences)',
  'cultural': 'Cultural Heritage Seekers (history enthusiasts)',
  'digital-nomads': 'Digital Nomads (remote workers)',
  'honeymoon': 'Honeymoon/Romance Travellers (couples)',
  'solo': 'Solo Travellers (independent explorers)',
  'accessible': 'Accessible Tourism (inclusive experiences)'
}

// Business type mapping for content strategy
export const businessTypeMap: { [key: string]: string } = {
  'accommodation': 'Accommodation Provider - hospitality experiences, guest comfort, local recommendations, direct booking focus',
  'attraction': 'Visitor Attraction - unique experiences, educational value, cultural stories, visitor engagement',
  'food': 'Food & Beverage - culinary traditions, local ingredients, dining atmosphere, authentic flavours',
  'retail': 'Retail & Gifts - authentic products, local artisans, cultural significance, unique souvenirs',
  'tours': 'Tours & Activities - adventure experiences, educational content, safety expertise, memorable moments',
  'transport': 'Transport Services - scenic journeys, comfortable travel, route highlights, convenient connections',
  'cultural': 'Cultural Experience - respectful traditions, authentic engagement, living culture, educational focus',
  'wellness': 'Wellness & Spa - relaxation benefits, natural healing, wellness journeys, therapeutic experiences',
  'information': 'Visitor Information - local expertise, travel planning, regional highlights, visitor guidance',
  'government': 'Government Tourism - destination marketing, industry support, official information, economic development',
  'conservation': 'DOC & Conservation - environmental education, conservation efforts, natural heritage, sustainable tourism',
  'events': 'Event Organiser - event excitement, attendee experiences, cultural celebrations, community engagement',
  'entertainment': 'Entertainment & Gaming - entertainment value, responsible messaging, venue atmosphere, special events',
  'cruise': 'Cruise & Marine - ocean experiences, coastal beauty, marine wildlife, onboard amenities',
  'other': 'Specialised Tourism Business - unique value proposition, target audience focus, custom messaging'
}

// Photo type context mapping
export const photoTypeMap: { [key: string]: string } = {
  'camera': 'Personal Experience Photo - authentic, first-hand tourism experience',
  'gallery': 'Personal Gallery Photo - curated personal travel content',
  'upload': 'Business/Website Content - professional marketing material or reference content'
}

// Get business type details from localStorage
export const getBusinessTypeDetails = (): BusinessTypeDetails | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const businessTypeDetails = localStorage.getItem('userBusinessTypeDetails')
    return businessTypeDetails ? JSON.parse(businessTypeDetails) : null
  } catch {
    return null
  }
}

// Get user data from localStorage
export const getUserDataFromStorage = (): Partial<UserData> => {
  if (typeof window === 'undefined') return {}
  
  return {
    businessType: localStorage.getItem('userBusinessType') || undefined,
    photoType: localStorage.getItem('photoType') || undefined,
    persona: localStorage.getItem('userPersona') || undefined,
    // Add other stored user data as needed
  }
}

// Generate comprehensive Claude prompt for content creation
export const generateClaudePrompt = (data: UserData, privacy: PrivacySettings): string => {
  const sanitisedData = sanitiseUserData(data, privacy)
  const businessTypeDetails = getBusinessTypeDetails()
  const storedUserData = getUserDataFromStorage()
  
  // Merge stored data with provided data
  const completeData = { ...storedUserData, ...sanitisedData }

  // Build business context section
  let businessContext = ''
  if (completeData.businessType && businessTypeDetails) {
    businessContext = `
BUSINESS CONTEXT:
- Industry Type: ${businessTypeDetails.title}
- Business Category: ${businessTypeDetails.subtitle}
- Content Strategy: ${businessTypeMap[completeData.businessType] || 'General tourism business'}
- Industry Focus: ${businessTypeDetails.contentFocus.join(', ')}
- Business Description: ${businessTypeDetails.description}
`
  }

  // Build photo context section
  let photoContext = ''
  if (completeData.photoType) {
    photoContext = `
PHOTO CONTEXT:
- Photo Type: ${photoTypeMap[completeData.photoType] || 'Tourism experience photo'}
- Content Approach: ${completeData.photoType === 'upload' ? 'Professional brand-consistent content' : 
                     completeData.photoType === 'camera' ? 'Authentic personal experience storytelling' : 
                     'Curated personal travel content'}
`
  }

  return `You are a multi-award winning tourism professional with 25+ years experience specialising in culturally-intelligent New Zealand tourism content creation.

ROLE & EXPERTISE:
- Expert Cultural Tourism Content Creator & AI Business Coach
- Champion of Mātauranga Māori IP protection and Te Tiriti o Waitangi principles
- Specialist in New Zealand English and authentic regional tourism

${businessContext}

CREATOR PROFILE:
- Voice/Persona: ${personaMap[completeData.persona || ''] || 'Tourism Content Creator'}
- Experience Story: ${completeData.story || 'Authentic New Zealand tourism experience'}
- Content Style: ${completeData.persona === 'professional' ? 'Authoritative business-focused messaging' :
                   completeData.persona === 'influencer' ? 'Engaging personal storytelling for community building' :
                   'Authentic tourism experience sharing'}

${photoContext}

TARGET AUDIENCE: ${audienceMap[completeData.audience || ''] || 'Tourism enthusiasts'}

INTEREST FOCUS: ${completeData.interests || 'Cultural experiences'}

PLATFORMS REQUESTED: ${completeData.platforms?.join(', ') || 'Social media'}
FORMATS REQUESTED: ${completeData.formats?.join(', ') || 'Social posts'}

CULTURAL INTELLIGENCE REQUIREMENTS:
- Use 100% New Zealand English (traveller, organised, recognised, centre, colour, etc.)
- Respect Mātauranga Māori intellectual property and cultural protocols
- Include appropriate iwi acknowledgment when location-relevant
- Integrate seasonal Maramataka calendar context where appropriate
- Apply kaitiakitanga (environmental guardianship) principles
- Ensure cultural sensitivity without appropriation
- Acknowledge the mana (spiritual power) of places and people
- Support Te Tiriti o Waitangi partnership principles

BUSINESS OBJECTIVES:
- Drive direct bookings over OTA dependency
- Position business as premium cultural experience provider
- Create authentic connections with target audience
- Demonstrate respect for indigenous culture and environment
- Support sustainable tourism practices
- Build credible industry authority and trust

CONTENT GUIDELINES:
- Create engaging, platform-optimised content for each requested format
- Match the creator's voice and style to their persona type
- Appeal specifically to the target audience demographics
- Include relevant hashtags and engagement strategies optimised for New Zealand market
- Provide compelling call-to-action appropriate for the creator's business type
- Ensure content promotes responsible tourism practices
- Use authentic New Zealand terminology and cultural references
- Include cultural context that enhances rather than exploits

PLATFORM-SPECIFIC REQUIREMENTS:
${completeData.platforms?.map(platform => {
  switch(platform) {
    case 'Instagram':
      return '- Instagram: 2,200 character limit, 8-12 hashtags, visual storytelling focus, Story format optimisation'
    case 'LinkedIn':
      return '- LinkedIn: 1,300 character limit, professional tourism industry tone, B2B networking optimisation'
    case 'Facebook':
      return '- Facebook: 500 character limit, community engagement focus, local business promotion'
    case 'TikTok':
      return '- TikTok: Short-form video script, trending audio consideration, Gen Z authentic voice'
    default:
      return `- ${platform}: Platform-optimised content with appropriate character limits and engagement tactics`
  }
}).join('\n') || '- Social media: Platform-optimised content'}

GENERATE:
Create ${completeData.platforms?.length || 1} distinct pieces of content, one optimised for each platform:
${completeData.platforms?.map(platform => `- ${platform}: ${completeData.formats?.join(' and ') || 'Social post'}`).join('\n') || '- Social media post'}

Each piece must:
1. Reflect the ${personaMap[completeData.persona || ''] || 'tourism professional'} voice
2. Appeal specifically to ${audienceMap[completeData.audience || ''] || 'tourism enthusiasts'}
3. Focus on ${completeData.interests || 'cultural experiences'}
4. Include ${businessTypeDetails?.title || 'tourism business'}-specific messaging and value proposition
5. Use 100% New Zealand English spelling and terminology
6. Maintain cultural respect and authenticity throughout
7. Drive direct business value through appropriate calls-to-action
8. Support sustainable and responsible tourism practices

CRITICAL: All content must honour Te Tiriti o Waitangi principles, protect Mātauranga Māori, use authentic New Zealand English, and support sustainable, culturally-conscious tourism in Aotearoa New Zealand while driving genuine business value for ${businessTypeDetails?.title?.toLowerCase() || 'tourism'} operators.`
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
  const businessTypeDetails = getBusinessTypeDetails()
  const storedUserData = getUserDataFromStorage()
  const completeData = { ...storedUserData, ...data }

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

  // Business-specific call to action
  const getBusinessCTA = (businessType?: string, persona?: string) => {
    if (persona === 'professional' && businessType) {
      switch(businessType) {
        case 'accommodation':
          return 'Book your authentic New Zealand stay - direct bookings available!'
        case 'attraction':
          return 'Experience this cultural journey - tickets available at our visitor centre!'
        case 'food':
          return 'Taste authentic New Zealand flavours - reservations recommended!'
        case 'cultural':
          return 'Join our respectful cultural experiences - bookings essential!'
        case 'tours':
          return 'Book your guided cultural adventure - small groups for authentic experiences!'
        default:
          return 'Experience authentic New Zealand tourism - book direct!'
      }
    }
    return 'Experience authentic cultural tourism - book your visit today!'
  }

  return {
    platforms: completeData.platforms?.map(platform => ({
      name: platform,
      content: {
        text: `🌟 ${completeData.story?.substring(0, 120)}...\n\n${businessTypeDetails?.title ? `As a ${businessTypeDetails.title.toLowerCase()}, we're` : 'An'} incredible cultural experience that perfectly captures the spirit of Aotearoa New Zealand! ${platform === 'Instagram' ? '✨' : ''}\n\n${platform === 'LinkedIn' ? 'This authentic encounter showcases the importance of cultural tourism done right.' : getEngagementText(platform, completeData.audience || '')}\n\n${getBusinessCTA(completeData.businessType, completeData.persona)}\n\n#NewZealand #CulturalTourism #Authentic${platform === 'Instagram' ? ' #TravelGram #Culture' : ''}${businessTypeDetails?.title ? ` #${businessTypeDetails.title.replace(/\s+/g, '')}` : ''}`,
        hashtags: platform === 'Instagram' 
          ? ['#NewZealand', '#CulturalTourism', '#TravelGram', '#Authentic', '#Culture', '#Māori', '#Travel', businessTypeDetails?.title ? `#${businessTypeDetails.title.replace(/\s+/g, '')}` : '#Tourism'].filter(Boolean)
          : ['#NewZealand', '#CulturalTourism', '#Authentic', businessTypeDetails?.title ? `#${businessTypeDetails.title.replace(/\s+/g, '')}` : '#Tourism'].filter(Boolean),
        callToAction: getBusinessCTA(completeData.businessType, completeData.persona),
        optimalTiming: platform === 'Instagram' ? 'Post between 11am-1pm or 7-9pm NZST' : 'Post weekdays 8-10am NZST',
        engagementTips: `Optimised for ${platform} - ${completeData.audience} engagement${businessTypeDetails?.title ? ` in ${businessTypeDetails.title.toLowerCase()} industry` : ''}`,
        platformTips: platform === 'TikTok' 
          ? 'Tip: Use @ followed by a username to tag someone (e.g. @yourfriend)'
          : platform === 'Instagram' 
          ? 'Tip: Tag friends by typing @ and their username in comments'
          : 'Tip: Engage authentically with your network'
      }
    })) || [],
    metrics: {
      estimatedReach: businessTypeDetails?.title === 'Accommodation' ? '3,500-7,000 people' : '2,500-5,000 people',
      engagementRate: '4.2-6.8%',
      culturalSensitivityScore: '95/100',
      sustainabilityRating: 'High',
      businessTypeOptimisation: businessTypeDetails?.title ? `Optimised for ${businessTypeDetails.title} industry` : 'General tourism optimisation'
    },
    recommendations: [
      'Content respects Mātauranga Māori protocols',
      'Promotes sustainable tourism practices',
      'Uses authentic New Zealand English',
      'Optimised for target audience engagement',
      'Platform-specific formatting applied',
      businessTypeDetails?.title ? `${businessTypeDetails.title}-specific messaging included` : 'Tourism business value integrated'
    ].filter(Boolean)
  }
}
