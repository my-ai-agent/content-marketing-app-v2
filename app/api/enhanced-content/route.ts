import { NextResponse } from 'next/server'

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

// Sophisticated content generation functions
function generateGenZContent(story: string, interests: string[], culturalContext: any) {
  const interestTags = interests?.map(i => `#${i.replace(/\s+/g, '')}`).join(' ') || '#Travel'
  
  return {
    social: `🌱 Real talk: ${story} hits different ✨ This is the kind of authentic experience that actually matters. No greenwashing, just genuine sustainable travel that makes an impact 🌍

${interestTags} #AuthenticTravel #SustainableVibes #GenZTravel #RealExperiences

Who's ready to travel with purpose? 👇`,

    detailed: `Why ${story} is exactly what Gen Z has been searching for:

✨ AUTHENTIC AF - No manufactured experiences here
🌍 SUSTAINABLE IMPACT - Travel that actually helps, not hurts  
📱 SHARE-WORTHY - But like, genuinely beautiful moments
🤝 COMMUNITY VIBES - Connect with real people, not tourists
💚 VALUES-ALIGNED - Your money goes toward good stuff

This isn't just travel - it's purposeful exploration that doesn't compromise your values. Finally.`,

    cta: `Ready to experience something REAL? 
Book ${story} now and be part of the sustainable travel movement! 
Link in bio 🌱✈️ #NoMoreFakeTravel`
  }
}

function generateMillennialContent(story: string, interests: string[], culturalContext: any) {
  return {
    social: `Just discovered ${story} and honestly, this is the kind of experience that creates those memories you'll be talking about for years 📸

The cultural immersion here is incredible - perfect for anyone who travels for the stories, not just the photos. This is going straight to the top of my bucket list ✨

#ExperienceTravel #CulturalImmersion #TravelStories #AuthenticExperiences`,

    detailed: `Why ${story} belongs on every Millennial's travel list:

🎯 AUTHENTIC CULTURAL EXPERIENCES - Real connections, not tourist traps
📚 INCREDIBLE STORYTELLING OPPORTUNITIES - Content that actually matters
💡 PERSONAL GROWTH THROUGH TRAVEL - Come back changed, not just tanned
🌟 INSTAGRAM-WORTHY WITH SUBSTANCE - Beautiful AND meaningful
📝 STORIES WORTH SHARING - Conversations that go beyond "nice weather"
💰 EXCELLENT VALUE - Experience-to-dollar ratio is unmatched

This isn't just a trip - it's a chapter in your personal journey. The kind of travel that reminds you why you started exploring in the first place.`,

    cta: `Ready to create memories that matter? 
Experience ${story} and add another incredible chapter to your travel story 📖✈️
Book now - your future self will thank you.`
  }
}

function generateGenXContent(story: string, interests: string[], culturalContext: any) {
  return {
    social: `Found the perfect family experience with ${story}! 👨‍👩‍👧‍👦

Finally, something that works for everyone - from teens to grandparents. Great value, safe environment, and the kids actually want to put their phones down. Win-win-win!

#FamilyTravel #MultiGenerational #ValueTravel #FamilyMemories`,

    detailed: `Why ${story} is perfect for families:

👨‍👩‍👧‍👦 ACTIVITIES FOR ALL AGES - Teens won't be bored, grandparents won't be overwhelmed
💰 EXCELLENT VALUE FOR MONEY - Transparent pricing, no hidden costs
🛡️ SAFE AND FAMILY-FRIENDLY - Thoroughly vetted for family groups
🎯 EDUCATIONAL OPPORTUNITIES - Kids learn while having fun
📍 CONVENIENT LOGISTICS - Easy coordination, minimal stress
🏆 CREATES LASTING FAMILY MEMORIES - The kind kids remember as adults

Planning family travel that actually works? This is it. No compromises needed.`,

    cta: `Give your family an experience they'll treasure forever.
Book ${story} now and create those priceless family moments 👨‍👩‍👧‍👦✈️
Limited family-friendly dates available.`
  }
}

function generateBoomerContent(story: string, interests: string[], culturalContext: any) {
  return {
    social: `Thoroughly enjoyed our recent experience with ${story}. The attention to detail, expert guidance, and comfortable arrangements made this a truly memorable journey.

Highly recommended for those who appreciate quality travel experiences with proper service standards.`,

    detailed: `What makes ${story} exceptional for discerning travelers:

🏆 PREMIUM SERVICE AND COMFORT - Every detail attended to with care
👨‍🏫 EXPERT LOCAL GUIDES - Deep knowledge and genuine passion for the region
🎓 RICH CULTURAL AND HISTORICAL CONTEXT - Learn the real stories behind the places
🛏️ COMFORTABLE ACCOMMODATIONS - Quality lodging that meets high standards
🍽️ EXCELLENT DINING EXPERIENCES - Authentic local cuisine, properly prepared
🚌 CONVENIENT TRANSPORTATION - Comfortable, reliable, and well-maintained
📞 DEDICATED SUPPORT THROUGHOUT - Personal attention when you need it

Travel with confidence and comfort. This is how travel should be.`,

    cta: `Experience travel the way it was meant to be.
Reserve your spot for ${story} and enjoy the journey in comfort and style.
Contact our travel specialists for personalized service. 🌟`
  }
}

function generateCulturalContent(story: string, culturalContext: any) {
  if (!culturalContext) return null
  
  return `Kia ora! ${story} offers an authentic New Zealand experience in ${culturalContext.iwi} territory. 

Discover ${culturalContext.culturalElements.join(', ')} while respecting the rich cultural heritage of Aotearoa. Our approach honors ${nzCulturalContext.culturalValues.join(', ')}, ensuring every visitor gains genuine appreciation for local culture.

Experience ${culturalContext.seasonalHighlights.join(', ')} with the guidance of those who know this land best. This is more than sightseeing - it's cultural connection with respect and authenticity at its heart.

Haere mai - you are welcome here. 🇳🇿`
}

export async function POST(request: Request) {
  try {
    const { 
      story, 
      targetAudience, 
      interests, 
      platforms,
      location = 'Christchurch',
      contentType = 'social_media_post'
    } = await request.json()

    // Get generational profile
    const profile = generationalProfiles[targetAudience as keyof typeof generationalProfiles]
    
    if (!profile) {
      return NextResponse.json({ error: 'Invalid target audience' }, { status: 400 })
    }

    // Get cultural context
    const culturalContext = nzCulturalContext.locations[location as keyof typeof nzCulturalContext.locations] || null

    // Generate sophisticated content based on generational psychology
    let contentVariations = []

    switch (targetAudience) {
      case 'Gen Z (1997-2012) - Digital natives prioritizing authenticity':
        const genZContent = generateGenZContent(story, interests, culturalContext)
        contentVariations = [
          { platform: 'TikTok/Instagram', content: genZContent.social, style: 'authentic_casual', targetFactors: ['authenticity', 'sustainability'] },
          { platform: 'Blog/Long-form', content: genZContent.detailed, style: 'values_driven', targetFactors: ['social_impact', 'authenticity'] },
          { platform: 'Call-to-Action', content: genZContent.cta, style: 'urgent_authentic', targetFactors: ['FOMO', 'values_alignment'] }
        ]
        break

      case 'Millennials (1981-1996) - Experience-focused, cultural seekers':
        const millennialContent = generateMillennialContent(story, interests, culturalContext)
        contentVariations = [
          { platform: 'Instagram/Facebook', content: millennialContent.social, style: 'experience_storytelling', targetFactors: ['authenticity', 'shareability'] },
          { platform: 'Blog/Email', content: millennialContent.detailed, style: 'detailed_experiential', targetFactors: ['value', 'personal_growth'] },
          { platform: 'Conversion', content: millennialContent.cta, style: 'memory_focused', targetFactors: ['experience_value', 'future_self'] }
        ]
        break

      case 'Gen X (1965-1980) - Family-focused, value-conscious':
        const genXContent = generateGenXContent(story, interests, culturalContext)
        contentVariations = [
          { platform: 'Facebook/Email', content: genXContent.social, style: 'family_practical', targetFactors: ['value', 'family_appeal'] },
          { platform: 'Detailed Guide', content: genXContent.detailed, style: 'practical_benefits', targetFactors: ['safety', 'convenience', 'value'] },
          { platform: 'Family CTA', content: genXContent.cta, style: 'family_memory_focused', targetFactors: ['family_bonding', 'lasting_memories'] }
        ]
        break

      case 'Baby Boomers (1946-1964) - Comfort-seeking, knowledge-focused':
        const boomerContent = generateBoomerContent(story, interests, culturalContext)
        contentVariations = [
          { platform: 'Email/Facebook', content: boomerContent.social, style: 'respectful_quality', targetFactors: ['quality', 'service'] },
          { platform: 'Detailed Brochure', content: boomerContent.detailed, style: 'premium_informative', targetFactors: ['comfort', 'expertise', 'quality'] },
          { platform: 'Premium CTA', content: boomerContent.cta, style: 'service_oriented', targetFactors: ['premium_service', 'personal_attention'] }
        ]
        break

      default:
        // Fallback for other audiences
        contentVariations = [
          { platform: 'General', content: `Experience ${story} - a memorable journey awaits!`, style: 'general', targetFactors: ['general_appeal'] }
        ]
    }

    // Add cultural content if available
    if (culturalContext) {
      const culturalContent = generateCulturalContent(story, culturalContext)
      if (culturalContent) {
        contentVariations.push({
          platform: 'Cultural/Educational',
          content: culturalContent,
          style: 'culturally_informed',
          targetFactors: ['cultural_respect', 'local_knowledge', 'authenticity']
        })
      }
    }

    return NextResponse.json({
      success: true,
      targetAudience,
      profile: {
        platforms: profile.platforms,
        contentStyle: profile.contentStyle,
        valuePropositions: profile.valuePropositions,
        communicationStyle: profile.communicationStyle,
        decisionFactors: profile.decisionFactors
      },
      culturalContext,
      contentVariations,
      enhancementNote: 'Content generated using sophisticated generational psychology and cultural awareness'
    })

  } catch (error) {
    console.error('Enhanced content generation error:', error)
    return NextResponse.json({ error: 'Failed to generate enhanced content' }, { status: 500 })
  }
}
