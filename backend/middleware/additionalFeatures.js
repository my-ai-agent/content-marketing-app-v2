// middleware/additionalFeatures.js
// Seasonal Trends & Competitor Analysis Enhancement

// Seasonal Travel Trends for New Zealand
const SEASONAL_TRENDS = {
  summer: {
    months: ['December', 'January', 'February'],
    hemisphere: 'Southern Hemisphere Summer',
    
    trending: {
      'Gen Z': [
        'Beach camping and festival season',
        'Outdoor adventure challenges',
        'Summer job working holidays',
        'Beach photography and content creation',
        'Sustainable summer travel practices'
      ],
      'Millennials': [
        'Summer wine festivals and food events',
        'Coastal hiking and beach experiences',
        'Outdoor wedding and celebration travel',
        'Summer city breaks and rooftop experiences',
        'Beach-to-mountain adventure combinations'
      ],
      'Gen X': [
        'Family summer holiday traditions',
        'Educational summer camps for kids',
        'Multi-generational beach house rentals',
        'Outdoor family activities and sports',
        'Summer road trip adventures'
      ],
      'Baby Boomers': [
        'Luxury coastal resorts and cruises',
        'Garden tours and summer cultural events',
        'Comfortable beach accommodations',
        'Summer grandchildren bonding trips',
        'Scenic summer drive experiences'
      ]
    },
    
    locationSpecific: {
      'Christchurch': [
        'Summer festivals in Hagley Park',
        'Beach day trips to nearby coast',
        'Outdoor dining at Riverside Marketplace',
        'Summer events at Te Pae',
        'Canterbury Plains agri-tourism experiences'
      ],
      'Auckland': [
        'Hauraki Gulf island hopping',
        'Beach culture and water sports',
        'Summer city festivals and events',
        'Outdoor dining and rooftop bars',
        'Sailing and maritime experiences'
      ],
      'Queenstown': [
        'Peak adventure season activities',
        'Summer alpine experiences',
        'Lake Wakatipu water activities',
        'Central Otago wine harvest tours',
        'Peak hiking and outdoor pursuits'
      ]
    }
  },

  autumn: {
    months: ['March', 'April', 'May'],
    hemisphere: 'Southern Hemisphere Autumn',
    
    trending: {
      'Gen Z': [
        'Autumn leaf photography and content',
        'Harvest festival experiences',
        'Cozy café culture and indoor spaces',
        'Budget-friendly shoulder season travel',
        'Autumn hiking with perfect weather'
      ],
      'Millennials': [
        'Wine harvest and food festivals',
        'Autumn cultural events and arts festivals',
        'Perfect weather hiking and outdoor dining',
        'Harvest season culinary experiences',
        'Autumn wedding and celebration season'
      ],
      'Gen X': [
        'School holiday family activities',
        'Autumn sports and outdoor family time',
        'Educational harvest and farm experiences',
        'Perfect weather family adventures',
        'Autumn scenic drives and sightseeing'
      ],
      'Baby Boomers': [
        'Comfortable autumn touring weather',
        'Harvest season wine and food tours',
        'Autumn garden tours and cultural events',
        'Perfect climate for walking and sightseeing',
        'Autumn cruise season and comfortable travel'
      ]
    }
  },

  winter: {
    months: ['June', 'July', 'August'],
    hemisphere: 'Southern Hemisphere Winter',
    
    trending: {
      'Gen Z': [
        'Cozy indoor experiences and café culture',
        'Budget winter city breaks',
        'Winter sports and skiing adventures',
        'Indoor entertainment and cultural experiences',
        'Winter wellness and self-care retreats'
      ],
      'Millennials': [
        'Winter food and wine experiences',
        'Cozy accommodation and indoor activities',
        'Winter cultural events and exhibitions',
        'Spa and wellness winter retreats',
        'Winter city exploration and indoor dining'
      ],
      'Gen X': [
        'Family winter school holiday activities',
        'Educational indoor attractions and museums',
        'Family-friendly winter sports',
        'Warm indoor family experiences',
        'Winter cultural and educational activities'
      ],
      'Baby Boomers': [
        'Warm indoor cultural experiences',
        'Comfortable winter touring',
        'Museum and gallery winter visits',
        'Warm, comfortable accommodations',
        'Winter cruise escapes to warmer climates'
      ]
    }
  },

  spring: {
    months: ['September', 'October', 'November'],
    hemisphere: 'Southern Hemisphere Spring',
    
    trending: {
      'Gen Z': [
        'Spring festival and event season',
        'Outdoor adventure season restart',
        'Spring break and university holidays',
        'Flower season photography',
        'Spring wellness and renewal experiences'
      ],
      'Millennials': [
        'Spring wedding and celebration season',
        'Outdoor dining and festival season',
        'Spring wine and food events',
        'Perfect weather outdoor experiences',
        'Spring cultural and arts festivals'
      ],
      'Gen X': [
        'Spring family outdoor activities',
        'Educational spring activities for kids',
        'Perfect weather family adventures',
        'Spring sports and outdoor family time',
        'Spring break family holiday planning'
      ],
      'Baby Boomers': [
        'Perfect spring touring weather',
        'Garden tours and spring cultural events',
        'Comfortable spring travel season',
        'Spring cruise and touring season',
        'Spring sightseeing and cultural activities'
      ]
    }
  }
};

// Competitor Analysis Framework
const COMPETITOR_ANALYSIS = {
  contentTypes: {
    tourism_boards: {
      strengths: [
        'Official authority and credibility',
        'Comprehensive destination information',
        'Government backing and resources',
        'Professional photography and media'
      ],
      weaknesses: [
        'Generic, one-size-fits-all messaging',
        'Limited personalization capabilities',
        'Slow to adapt to trends',
        'Limited generational targeting'
      ],
      opportunities: [
        'Personalized generational messaging',
        'Cultural authenticity and respect',
        'AI-powered content variety',
        'Real-time trend integration'
      ]
    },
    
    travel_influencers: {
      strengths: [
        'Authentic personal experiences',
        'Strong generational connection',
        'Visual content and storytelling',
        'Social media engagement'
      ],
      weaknesses: [
        'Limited cultural knowledge depth',
        'Inconsistent messaging',
        'Personal bias and limited scope',
        'No systematic cultural respect'
      ],
      opportunities: [
        'Systematic cultural education',
        'Multiple generational perspectives',
        'Consistent quality and respect',
        'Scalable authentic content'
      ]
    },
    
    travel_agencies: {
      strengths: [
        'Professional service and expertise',
        'Established booking systems',
        'Customer relationship management',
        'Traditional marketing reach'
      ],
      weaknesses: [
        'Limited content personalization',
        'Dated demographic targeting',
        'Generic promotional content',
        'Limited cultural sensitivity'
      ],
      opportunities: [
        'Advanced generational targeting',
        'Cultural respect differentiation',
        'AI-enhanced personalization',
        'Modern content delivery'
      ]
    }
  },

  differentiators: {
    cultural_authenticity: {
      description: 'Genuine respect for Māori culture with accurate iwi-specific references',
      advantage: 'Most competitors use generic cultural references or avoid them entirely',
      implementation: 'Te Reo Māori glossary, iwi-specific content, cultural validation'
    },
    
    generational_psychology: {
      description: 'Psychology-based targeting instead of simple age demographics',
      advantage: 'Competitors still use outdated age ranges like "25-65"',
      implementation: 'Formative experience understanding, travel motivation mapping'
    },
    
    enhanced_variety: {
      description: '15+ content variations instead of single generic responses',
      advantage: 'Most AI content tools provide single, repetitive outputs',
      implementation: 'Multiple emotional approaches, cultural contexts, unique elements'
    },
    
    ethical_ai: {
      description: 'Built-in cultural respect and IP protection',
      advantage: 'Competitors rarely address cultural sensitivity or IP compliance',
      implementation: 'Content validation, user education, ethical guidelines'
    }
  }
};

// Function to get seasonal recommendations
function getSeasonalRecommendations(location, generation, currentMonth) {
  // Determine current season in Southern Hemisphere
  let currentSeason;
  if ([12, 1, 2].includes(currentMonth)) currentSeason = 'summer';
  else if ([3, 4, 5].includes(currentMonth)) currentSeason = 'autumn';
  else if ([6, 7, 8].includes(currentMonth)) currentSeason = 'winter';
  else currentSeason = 'spring';

  const seasonData = SEASONAL_TRENDS[currentSeason];
  const generationalTrends = seasonData.trending[generation] || [];
  const locationTrends = seasonData.locationSpecific[location] || [];

  return {
    season: currentSeason,
    hemisphere: seasonData.hemisphere,
    months: seasonData.months,
    generationalTrends,
    locationTrends,
    recommendations: [
      ...generationalTrends.slice(0, 3),
      ...locationTrends.slice(0, 2)
    ]
  };
}

// Function to generate competitive advantage messaging
function generateCompetitiveAdvantage(contentType, targetGeneration) {
  const relevantDifferentiators = Object.keys(COMPETITOR_ANALYSIS.differentiators);
  
  return relevantDifferentiators.map(key => {
    const diff = COMPETITOR_ANALYSIS.differentiators[key];
    return {
      advantage: key,
      description: diff.description,
      competitorGap: diff.advantage,
      yourBenefit: diff.implementation,
      relevanceScore: calculateRelevanceScore(key, targetGeneration)
    };
  }).sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// Helper function to calculate relevance score
function calculateRelevanceScore(differentiator, generation) {
  const scores = {
    'cultural_authenticity': {
      'Gen Z': 95, 'Millennials': 85, 'Gen X': 75, 'Baby Boomers': 70
    },
    'generational_psychology': {
      'Gen Z': 90, 'Millennials': 95, 'Gen X': 80, 'Baby Boomers': 70
    },
    'enhanced_variety': {
      'Gen Z': 85, 'Millennials': 80, 'Gen X': 75, 'Baby Boomers': 65
    },
    'ethical_ai': {
      'Gen Z': 95, 'Millennials': 85, 'Gen X': 70, 'Baby Boomers': 60
    }
  };

  return scores[differentiator]?.[generation] || 50;
}

// Enhanced prompt with seasonal and competitive insights
function enhanceWithSeasonalAndCompetitive(basePrompt, location, generation, currentMonth) {
  const seasonalData = getSeasonalRecommendations(location, generation, currentMonth);
  const competitiveAdvantages = generateCompetitiveAdvantage('tourism', generation);

  return `${basePrompt}

SEASONAL ENHANCEMENT (${seasonalData.season.toUpperCase()} - ${seasonalData.hemisphere}):
Current trending for ${generation}:
${seasonalData.generationalTrends.slice(0, 3).map(trend => `• ${trend}`).join('\n')}

Location-specific ${location} trends:
${seasonalData.locationTrends.slice(0, 2).map(trend => `• ${trend}`).join('\n')}

COMPETITIVE ADVANTAGE MESSAGING:
Your unique differentiators vs competitors:
${competitiveAdvantages.slice(0, 2).map(adv => 
  `• ${adv.description} (Competitor gap: ${adv.competitorGap})`
).join('\n')}

Integrate seasonal relevance and competitive differentiation naturally into your content.`;
}

module.exports = {
  SEASONAL_TRENDS,
  COMPETITOR_ANALYSIS,
  getSeasonalRecommendations,
  generateCompetitiveAdvantage,
  enhanceWithSeasonalAndCompetitive
};
