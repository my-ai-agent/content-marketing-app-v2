// middleware/enhancedResponseSystem.js
// Enhanced Response Variety System - 8+ Options for Better AI Performance

const LOCATION_CONTEXTS = {
  'Christchurch': {
    culturalContext: [
      'Post-earthquake resilience and renewal',
      'Garden City heritage and botanical beauty',
      'Ngāi Tahu cultural significance (Ōtautahi)',
      'Canterbury Plains world-leading agri-tech research and innovation',
      'Southern Alps proximity and adventure access',
      'Arts and cultural renaissance',
      'Innovation and rebuild creativity',
      'Community spirit and collaboration'
    ],
    uniqueElements: [
      'Cardboard Cathedral and transitional architecture',
      'Hagley Park and Botanic Gardens',
      'Christchurch Tram and heritage experiences',
      'Riverside Marketplace & Eateries',
      'Avon River punting and city waterways',
      'Canterbury Museum and cultural institutions',
      'International Antarctic Centre',
      'Margaret Mahy Playground',
      'The Tannery Retail Outlets',
      'Te Pae (Christchurch Convention Centre)',
      'One.NZ Premier Stadium (opening June 2026)',
      'International gateway to Te Waipounamu (South Island) of Aotearoa New Zealand'
    ],
    audienceAngles: [
      'Families seeking safe, walkable city experiences',
      'Adventure seekers using Christchurch as Southern Alps base',
      'Cultural enthusiasts exploring post-earthquake renaissance',
      'Business travelers attending events and conferences',
      'International visitors exploring Antarctic connections',
      'Environmental and conservation activists',
      'Travellers seeking safe and welcoming manaakitanga (respect, generosity and care)',
      'Travellers seeking a working holiday experience',
      'Regenerative/sustainable tourism visitors',
      'Māori cultural learning travelers',
      'University city appeal (UC, student visitors)'
    ]
  },

  'Auckland': {
    culturalContext: [
      'Polynesian cultural hub and Pacific identity',
      'Tāmaki Makaurau (many lovers) historical significance',
      'Urban Māori renaissance and contemporary expression',
      'Pacific Island cultural diversity and celebration',
      'Volcanic landscape and harbourside living',
      'Innovation and tech startup ecosystem',
      'International gateway and cosmopolitan energy',
      'Maritime heritage and sailing culture'
    ],
    uniqueElements: [
      'Sky Tower and harbour bridge icons',
      'Waitemata and Manukau harbours',
      'Hauraki Gulf islands and ferry connections',
      'Queen Street and Karangahape Road culture',
      'Auckland War Memorial Museum',
      'Viaduct Harbour and waterfront dining',
      'Rangitoto Island volcanic experience',
      'Mission Bay and eastern beaches',
      'Auckland Domain and winter gardens',
      'Kelly Tarlton\'s SEA LIFE Aquarium',
      'Eden Park sporting venue'
    ],
    audienceAngles: [
      'Urban explorers seeking Pacific cultural immersion',
      'Sailing and water sports enthusiasts',
      'Food and wine connoisseurs',
      'Business and conference travelers',
      'Island-hopping adventurers',
      'Shopping and entertainment seekers',
      'Pacific cultural learning visitors',
      'International transit visitors'
    ]
  },

  'Wellington': {
    culturalContext: [
      'Te Whanga-nui-a-Tara (great harbour) significance',
      'Creative capital and arts scene vibrancy',
      'Political and cultural heart of Aotearoa',
      'Film industry innovation (Wellywood)',
      'Bohemian and intellectual atmosphere',
      'Café culture and culinary excellence',
      'Harbour city lifestyle and hillside living',
      'Innovation in government and policy'
    ],
    uniqueElements: [
      'Te Papa Tongarewa Museum of New Zealand',
      'Wellington Cable Car and Botanic Garden',
      'Cuba Street and creative quarter',
      'Parliament Buildings and Beehive',
      'Oriental Bay and harbour walkways',
      'Weta Workshop and film tourism',
      'Zealandia ecosanctuary',
      'Wellington Waterfront and harbour',
      'Mount Victoria lookout',
      'Katherine Mansfield House',
      'Old St Paul\'s Cathedral'
    ],
    audienceAngles: [
      'Arts and culture enthusiasts',
      'Film and creative industry visitors',
      'Political and historical interest travelers',
      'Café and food culture explorers',
      'Walking and harbour activity seekers',
      'Government and business visitors',
      'Literary and intellectual tourists',
      'Eco-tourism and conservation visitors'
    ]
  },

  'Queenstown': {
    culturalContext: [
      'Adventure capital reputation and extreme sports',
      'Tāhuna (shallow bay) traditional significance',
      'Southern Alps grandeur and dramatic landscapes',
      'Luxury tourism and premium experiences',
      'Film location fame (Lord of the Rings)',
      'Wine region excellence (Central Otago)',
      'Seasonal contrasts and four-season appeal',
      'International destination prestige'
    ],
    uniqueElements: [
      'Lake Wakatipu and TSS Earnslaw steamship',
      'Skyline Gondola and Luge',
      'Milford Sound day trip access',
      'Bungy jumping birthplace (AJ Hackett)',
      'Central Otago wine trails',
      'The Remarkables and Coronet Peak skiing',
      'Shotover River jet boating',
      'Arrowtown historic gold mining town',
      'Gibbston Valley wineries',
      'Walter Peak high country farm'
    ],
    audienceAngles: [
      'Adrenaline and adventure sports seekers',
      'Luxury travelers and honeymooners',
      'Wine enthusiasts and connoisseurs',
      'Photography and scenery admirers',
      'Film location tourists',
      'Winter sports and skiing visitors',
      'High-end dining and hospitality seekers',
      'Bucket-list and milestone celebration travelers'
    ]
  },

  'Rotorua': {
    culturalContext: [
      'Te Arawa iwi cultural heartland',
      'Living Māori culture and traditional practices',
      'Geothermal wonder and natural phenomena',
      'Traditional healing and wellness (rongoā)',
      'Spiritual significance and mauri (life force)',
      'Forest conservation and eco-tourism',
      'Adventure activities in natural settings',
      'Authentic cultural exchange and learning'
    ],
    uniqueElements: [
      'Te Puia geothermal park and Pohutu geyser',
      'Whakarewarewa Living Māori Village',
      'Government Gardens and Rotorua Museum',
      'Lake Rotorua and trout fishing',
      'Redwoods Treewalk and forest experiences',
      'Hell\'s Gate geothermal park',
      'Māori cultural performances and hākari (feast)',
      'Polynesian Spa and hot pools',
      'Agrodome farm show',
      'Rainbow Springs nature park',
      'Skyline Rotorua gondola and luge'
    ],
    audienceAngles: [
      'Cultural learning and Māori experience seekers',
      'Geothermal and natural phenomenon enthusiasts',
      'Wellness and spa retreat visitors',
      'Family-friendly activity seekers',
      'Eco-tourism and conservation travelers',
      'Adventure activity participants',
      'Educational and school group visitors',
      'Spiritual and healing experience seekers'
    ]
  }
};

// Emotional and approach variety for content generation
const EMOTIONAL_APPROACHES = [
  'Inspirational and aspirational',
  'Practical and informative',
  'Emotional and heartfelt',
  'Adventurous and exciting',
  'Peaceful and reflective',
  'Social and community-focused',
  'Educational and discovery-oriented',
  'Luxury and premium experience'
];

// Cultural frameworks for respectful content creation
const CULTURAL_FRAMEWORKS = [
  {
    name: 'Manaakitanga',
    description: 'Hospitality, care, respect, generosity',
    application: 'Welcoming tone, respectful approach, generous spirit'
  },
  {
    name: 'Whakatōhea',
    description: 'Collective responsibility and care',
    application: 'Community-focused, inclusive messaging'
  },
  {
    name: 'Kaitiakitanga',
    description: 'Guardianship and environmental stewardship',
    application: 'Sustainable tourism, conservation awareness'
  }
];

// Enhanced content generation function
function generateEnhancedContent(params) {
  const {
    location,
    targetAudience,
    contentType,
    platform,
    emotionalTone
  } = params;

  // Get location-specific context
  const locationData = LOCATION_CONTEXTS[location] || {};
  const culturalContexts = locationData.culturalContext || [];
  const uniqueElements = locationData.uniqueElements || [];
  const audienceAngles = locationData.audienceAngles || [];

  // Select multiple contexts for richer content
  const selectedContexts = selectMultipleRandom(culturalContexts, 3);
  const selectedElements = selectMultipleRandom(uniqueElements, 4);
  const selectedAngles = selectMultipleRandom(audienceAngles, 2);

  // Generate content variations
  const contentVariations = [];

  // Create 8+ different approaches
  EMOTIONAL_APPROACHES.forEach((approach, index) => {
    const variation = {
      id: `variation_${index + 1}`,
      approach: approach,
      culturalContext: selectedContexts[index % selectedContexts.length],
      uniqueElement: selectedElements[index % selectedElements.length],
      audienceAngle: selectedAngles[index % selectedAngles.length],
      content: generateSpecificContent({
        approach,
        culturalContext: selectedContexts[index % selectedContexts.length],
        uniqueElement: selectedElements[index % selectedElements.length],
        audienceAngle: selectedAngles[index % selectedAngles.length],
        location,
        targetAudience,
        contentType,
        platform
      })
    };
    contentVariations.push(variation);
  });

  return {
    location,
    totalVariations: contentVariations.length,
    variations: contentVariations,
    metadata: {
      culturalContextsAvailable: culturalContexts.length,
      uniqueElementsAvailable: uniqueElements.length,
      audienceAnglesAvailable: audienceAngles.length
    }
  };
}

// Helper function to select multiple random items
function selectMultipleRandom(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

// Generate specific content based on parameters
function generateSpecificContent(params) {
  const {
    approach,
    culturalContext,
    uniqueElement,
    audienceAngle,
    location,
    targetAudience,
    contentType,
    platform
  } = params;

  // This would integrate with Claude API for actual content generation
  // For now, return structured prompt data
  return {
    prompt: `Create ${contentType} content for ${platform} targeting ${targetAudience} with an ${approach} tone. 
    
    Context: ${culturalContext} in ${location}
    Feature: ${uniqueElement}
    Audience angle: ${audienceAngle}
    
    Ensure content respects local cultural values and includes appropriate Te Reo Māori where relevant.`,
    
    culturalGuidelines: [
      'Use appropriate Te Reo Māori with correct macrons',
      'Respect local iwi and cultural significance',
      'Include manaakitanga principles',
      'Acknowledge traditional knowledge respectfully'
    ]
  };
}

// Export for use in backend
module.exports = {
  LOCATION_CONTEXTS,
  EMOTIONAL_APPROACHES,
  CULTURAL_FRAMEWORKS,
  generateEnhancedContent
};
