// Cross-Generational Content Strategy with Travel Trends
// Enhanced audience targeting system replacing age ranges with generational psychology

const GENERATIONAL_PROFILES = {
  'Gen Z (1997-2012)': {
    displayName: 'Gen Z',
    description: 'Digital natives who prioritize authenticity, sustainability, and social impact',
    
    communicationStyle: {
      tone: 'Casual, authentic, conversational',
      language: 'Direct, inclusive, emoji-friendly',
      format: 'Bite-sized, visual-heavy, mobile-first',
      attention: '8-second attention span, quick decision makers',
      values: ['Authenticity', 'Sustainability', 'Diversity', 'Mental Health', 'Social Justice']
    },
    
    platformPreferences: {
      primary: ['TikTok', 'Instagram', 'Snapchat', 'YouTube Shorts'],
      secondary: ['Twitter', 'Discord', 'BeReal'],
      consumption: 'Short-form video, Stories, Live content',
      engagement: 'Comments, shares, user-generated content'
    },
    
    travelTrends: {
      motivations: [
        'Self-discovery and personal growth',
        'Social media content creation',
        'Sustainable and eco-friendly experiences',
        'Solo travel and independence',
        'Authentic local experiences',
        'Budget-conscious adventures'
      ],
      trendingExperiences: [
        'Solo backpacking and hostels',
        'Wellness retreats and mindfulness',
        'Eco-tourism and conservation volunteering',
        'Food tours and local cuisine exploration',
        'Adventure sports and outdoor activities',
        'Cultural immersion and language learning',
        'Digital detox experiences',
        'Instagram-worthy photo locations'
      ],
      decisionMaking: {
        research: 'TikTok videos, Instagram posts, peer recommendations',
        booking: 'Mobile apps, last-minute deals, flexible options',
        influence: 'Social media influencers, user reviews, sustainability ratings'
      },
      budgetApproach: 'Value-seeking, budget accommodations, free activities',
      groupDynamics: 'Solo travel, small friend groups, meeting new people'
    },
    
    contentPreferences: {
      headlines: 'Question-based, emoji use, FOMO triggers',
      messaging: 'Inclusive, purpose-driven, visually appealing',
      callToAction: 'Tap, swipe, discover, explore',
      storytelling: 'Personal journeys, behind-the-scenes, real moments'
    }
  },

  'Millennials (1981-1996)': {
    displayName: 'Millennials / Gen Y',
    description: 'Experience-focused generation balancing digital savvy with authentic connections',
    
    communicationStyle: {
      tone: 'Friendly, informative, slightly formal',
      language: 'Clear, benefit-focused, storytelling',
      format: 'Medium-form content, visual + text balance',
      attention: '12-second attention span, comparison shoppers',
      values: ['Experiences', 'Work-Life Balance', 'Authenticity', 'Social Responsibility', 'Quality']
    },
    
    platformPreferences: {
      primary: ['Instagram', 'Facebook', 'YouTube', 'LinkedIn'],
      secondary: ['Twitter', 'Pinterest', 'Reddit'],
      consumption: 'Mixed content lengths, video + articles',
      engagement: 'Likes, shares, detailed reviews'
    },
    
    travelTrends: {
      motivations: [
        'Collecting unique experiences over material possessions',
        'Cultural learning and personal enrichment',
        'Work-life balance and stress relief',
        'Authentic local culture immersion',
        'Food and culinary exploration',
        'Instagram-worthy but meaningful moments'
      ],
      trendingExperiences: [
        'Food and wine tourism',
        'Cultural festivals and events',
        'Working holidays and remote work travel',
        'Boutique accommodations and unique stays',
        'Local cooking classes and workshops',
        'Historical and heritage site visits',
        'Sustainable tourism experiences',
        'Multi-destination trips and city breaks'
      ],
      decisionMaking: {
        research: 'Online reviews, travel blogs, comparison websites',
        booking: 'Mix of online and mobile, advance planning',
        influence: 'Peer recommendations, expert reviews, brand reputation'
      },
      budgetApproach: 'Mid-range spending, value for experiences, quality over quantity',
      groupDynamics: 'Couples travel, friend groups, family trips'
    },
    
    contentPreferences: {
      headlines: 'Benefit-focused, experience-driven, FOMO but thoughtful',
      messaging: 'Authentic stories, practical benefits, social proof',
      callToAction: 'Discover, experience, book now, learn more',
      storytelling: 'Journey narratives, transformation stories, lifestyle integration'
    }
  },

  'Gen X (1965-1980)': {
    displayName: 'Gen X',
    description: 'Self-reliant, family-focused generation seeking practical value and authentic experiences',
    
    communicationStyle: {
      tone: 'Straightforward, practical, slightly skeptical',
      language: 'Clear, no-nonsense, benefit-focused',
      format: 'Longer-form, detailed information, structured',
      attention: '20-second attention span, thorough researchers',
      values: ['Independence', 'Family', 'Practicality', 'Quality', 'Authenticity', 'Value']
    },
    
    platformPreferences: {
      primary: ['Facebook', 'Email', 'YouTube', 'Google Search'],
      secondary: ['LinkedIn', 'Pinterest', 'Travel websites'],
      consumption: 'Articles, longer videos, detailed reviews',
      engagement: 'Comments, shares, recommendations'
    },
    
    travelTrends: {
      motivations: [
        'Family bonding and creating memories',
        'Educational experiences for children',
        'Personal enrichment and learning',
        'Stress relief and relaxation',
        'Value for money and practical benefits',
        'Multi-generational family experiences'
      ],
      trendingExperiences: [
        'Family-friendly adventure activities',
        'Educational museums and cultural sites',
        'Multi-generational family trips',
        'Active holidays and outdoor pursuits',
        'Heritage and historical tourism',
        'Road trips and self-drive holidays',
        'Resort-style accommodations with activities',
        'Guided tours with expert knowledge'
      ],
      decisionMaking: {
        research: 'Detailed online research, travel agents, guidebooks',
        booking: 'Mix of online and phone, advance planning',
        influence: 'Expert recommendations, detailed reviews, family input'
      },
      budgetApproach: 'Value-conscious, willing to pay for quality, family budget considerations',
      groupDynamics: 'Family travel, extended family trips, established friend groups'
    },
    
    contentPreferences: {
      headlines: 'Clear benefits, family-focused, practical outcomes',
      messaging: 'Straightforward, informative, trust-building',
      callToAction: 'Learn more, plan your trip, get details, compare options',
      storytelling: 'Family success stories, practical advice, expert insights'
    }
  },

  'Baby Boomers (1946-1964)': {
    displayName: 'Baby Boomers',
    description: 'Experienced travelers seeking comfort, knowledge, and meaningful connections',
    
    communicationStyle: {
      tone: 'Respectful, formal, authoritative',
      language: 'Traditional, detailed, relationship-focused',
      format: 'Long-form, comprehensive, well-structured',
      attention: '45-second attention span, patient decision makers',
      values: ['Respect', 'Tradition', 'Knowledge', 'Comfort', 'Legacy', 'Relationships']
    },
    
    platformPreferences: {
      primary: ['Email', 'Facebook', 'Traditional websites', 'Print materials'],
      secondary: ['YouTube', 'Travel blogs', 'Phone consultations'],
      consumption: 'Detailed articles, traditional media, expert content',
      engagement: 'Email responses, phone calls, word-of-mouth'
    },
    
    travelTrends: {
      motivations: [
        'Lifelong learning and cultural enrichment',
        'Comfortable, worry-free experiences',
        'Grandchildren bonding and legacy creation',
        'Historical and cultural exploration',
        'Social connections and group experiences',
        'Luxury and pampering after years of hard work'
      ],
      trendingExperiences: [
        'Luxury cruise experiences',
        'Guided cultural and historical tours',
        'Multi-generational family vacations',
        'River cruises and scenic journeys',
        'Educational travel with expert guides',
        'Spa and wellness retreats',
        'Wine and culinary tours',
        'Classic destinations with modern comforts'
      ],
      decisionMaking: {
        research: 'Travel agents, brochures, word-of-mouth, expert advice',
        booking: 'Phone bookings, travel agents, established companies',
        influence: 'Personal recommendations, expert guidance, brand reputation'
      },
      budgetApproach: 'Quality-focused, comfort-oriented, willing to pay for service',
      groupDynamics: 'Couples travel, group tours, family gatherings, organized trips'
    },
    
    contentPreferences: {
      headlines: 'Traditional, benefit-clear, respect-based',
      messaging: 'Detailed, authoritative, comfort-focused',
      callToAction: 'Contact us, speak with expert, request information',
      storytelling: 'Success stories, expert testimonials, detailed itineraries'
    }
  }
};

// Travel trend categories for dynamic content generation
const TRAVEL_TREND_CATEGORIES = {
  accommodation: {
    'Gen Z': ['Hostels', 'Budget hotels', 'Eco-lodges', 'Unique stays', 'Shared accommodations'],
    'Millennials': ['Boutique hotels', 'Airbnb', 'Design hotels', 'Local guesthouses', 'Unique experiences'],
    'Gen X': ['Family resorts', 'Self-catering', 'Mid-range hotels', 'Holiday parks', 'Family-friendly'],
    'Baby Boomers': ['Luxury hotels', 'Cruise cabins', 'Resort all-inclusive', 'Premium lodges', 'Service-focused']
  },
  
  activities: {
    'Gen Z': ['Adventure sports', 'Solo exploration', 'Local meetups', 'Eco-volunteering', 'Photography walks'],
    'Millennials': ['Food tours', 'Cultural workshops', 'Local experiences', 'Fitness activities', 'Learning experiences'],
    'Gen X': ['Family activities', 'Educational tours', 'Outdoor adventures', 'Cultural sites', 'Practical learning'],
    'Baby Boomers': ['Guided tours', 'Cultural sites', 'Scenic experiences', 'Comfort-focused', 'Expert-led activities']
  },
  
  transportation: {
    'Gen Z': ['Public transport', 'Walking', 'Bike sharing', 'Budget flights', 'Ride sharing'],
    'Millennials': ['Mix of options', 'Efficient transport', 'Sustainable choices', 'Experience-based', 'Flexible booking'],
    'Gen X': ['Rental cars', 'Family-friendly', 'Practical routes', 'Reliable transport', 'Safe options'],
    'Baby Boomers': ['Organized transport', 'Comfortable options', 'Guided transfers', 'Premium services', 'Hassle-free']
  },
  
  dining: {
    'Gen Z': ['Street food', 'Local cafes', 'Vegan options', 'Budget-friendly', 'Instagrammable'],
    'Millennials': ['Local cuisine', 'Farm-to-table', 'Unique dining', 'Culinary experiences', 'Authentic flavors'],
    'Gen X': ['Family restaurants', 'Reliable options', 'Value meals', 'Familiar cuisines', 'Quality focused'],
    'Baby Boomers': ['Fine dining', 'Traditional cuisine', 'Comfortable settings', 'Service-oriented', 'Classic dishes']
  }
};

// Enhanced content generation with generational travel trends
function generateGenerationalContent(params) {
  const {
    location,
    generation,
    contentType,
    platform,
    travelCategory
  } = params;

  const profile = GENERATIONAL_PROFILES[generation];
  if (!profile) {
    throw new Error(`Unknown generation: ${generation}`);
  }

  // Get location-specific data (from previous system)
  const locationData = LOCATION_CONTEXTS[location] || {};
  
  // Select appropriate travel trends for this generation
  const relevantTrends = profile.travelTrends.trendingExperiences;
  const motivations = profile.travelTrends.motivations;
  const decisionFactors = profile.travelTrends.decisionMaking;
  
  // Get category-specific preferences
  const categoryPreferences = travelCategory 
    ? TRAVEL_TREND_CATEGORIES[travelCategory][profile.displayName] || []
    : [];

  return {
    generationalProfile: {
      name: profile.displayName,
      description: profile.description,
      primaryValues: profile.communicationStyle.values,
      communicationStyle: profile.communicationStyle,
      platformPreferences: profile.platformPreferences
    },
    
    travelPersonalization: {
      motivations: motivations,
      trendingExperiences: relevantTrends,
      decisionMaking: decisionFactors,
      budgetApproach: profile.travelTrends.budgetApproach,
      groupDynamics: profile.travelTrends.groupDynamics,
      categoryPreferences: categoryPreferences
    },
    
    contentGuidelines: {
      tone: profile.communicationStyle.tone,
      format: profile.communicationStyle.format,
      headlines: profile.contentPreferences.headlines,
      messaging: profile.contentPreferences.messaging,
      callToAction: profile.contentPreferences.callToAction,
      storytelling: profile.contentPreferences.storytelling
    },
    
    locationAdaptation: {
      culturalContext: locationData.culturalContext || [],
      uniqueElements: locationData.uniqueElements || [],
      audienceAngles: locationData.audienceAngles || []
    }
  };
}

// Function to replace age ranges with generational targeting
function convertAgeRangeToGenerational(ageRange) {
  const conversions = {
    '18-25': 'Gen Z (1997-2012)',
    '25-40': 'Millennials (1981-1996)',
    '25-65': 'Multiple Generations - recommend specific targeting',
    '40-55': 'Gen X (1965-1980)',
    '55+': 'Baby Boomers (1946-1964)',
    '30-50': 'Millennials + Gen X - recommend split targeting'
  };
  
  return conversions[ageRange] || 'Recommend generational profiling instead';
}

// Educational tooltips for user learning
const GENERATIONAL_EDUCATION = {
  'Why Generational Targeting Works': {
    explanation: 'Generations share formative experiences that shape their values, communication preferences, and decision-making patterns. This creates more accurate targeting than age alone.',
    examples: [
      'A 35-year-old Millennial values experiences over possessions',
      'A 35-year-old Gen X prioritizes family and practical value',
      'Same age, completely different motivations and messaging needs'
    ]
  },
  
  'Travel Trend Integration': {
    explanation: 'Each generation has distinct travel motivations, research habits, and experience preferences based on their life stage and cultural influences.',
    benefits: [
      'More relevant content that resonates with specific travel motivations',
      'Platform-appropriate messaging for where each generation consumes content',
      'Better conversion rates through psychographic targeting vs demographics'
    ]
  }
};

// Integration with Claude API for generational content
const enhancePromptWithGenerationalData = (basePrompt, generationalData) => {
  return `
GENERATIONAL TARGETING DATA:
Target Generation: ${generationalData.generationalProfile.name}
Core Values: ${generationalData.generationalProfile.primaryValues.join(', ')}
Communication Style: ${generationalData.contentGuidelines.tone}
Content Format: ${generationalData.contentGuidelines.format}

TRAVEL MOTIVATIONS:
${generationalData.travelPersonalization.motivations.join('\n')}

TRENDING EXPERIENCES FOR THIS GENERATION:
${generationalData.travelPersonalization.trendingExperiences.join('\n')}

DECISION-MAKING PATTERNS:
Research: ${generationalData.travelPersonalization.decisionMaking.research}
Booking: ${generationalData.travelPersonalization.decisionMaking.booking}
Influences: ${generationalData.travelPersonalization.decisionMaking.influence}

CONTENT GUIDELINES:
Tone: ${generationalData.contentGuidelines.tone}
Headlines: ${generationalData.contentGuidelines.headlines}
Messaging: ${generationalData.contentGuidelines.messaging}
Call-to-Action: ${generationalData.contentGuidelines.callToAction}
Storytelling: ${generationalData.contentGuidelines.storytelling}

${basePrompt}

Create content that speaks directly to this generation's travel motivations and communication preferences.`;
};

module.exports = {
  GENERATIONAL_PROFILES,
  TRAVEL_TREND_CATEGORIES,
  GENERATIONAL_EDUCATION,
  generateGenerationalContent,
  convertAgeRangeToGenerational,
  enhancePromptWithGenerationalData
};
