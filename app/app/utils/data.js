// app/utils/data.js
// Simple data definitions for API routes

export const LOCATION_CONTEXTS = {
  'Christchurch': {
    culturalContext: [
      'Post-earthquake resilience and renewal',
      'Garden City heritage and botanical beauty',
      'Ngāi Tahu cultural significance (Ōtautahi)',
      'Canterbury Plains world-leading agri-tech research and innovation',
      'Southern Alps proximity and adventure access'
    ],
    uniqueElements: [
      'Cardboard Cathedral and transitional architecture',
      'Hagley Park and Botanic Gardens', 
      'Riverside Marketplace & Eateries',
      'Te Pae (Christchurch Convention Centre)',
      'International Antarctic Centre'
    ],
    audienceAngles: [
      'Families seeking safe, walkable city experiences',
      'Adventure seekers using Christchurch as Southern Alps base',
      'Environmental and conservation activists',
      'Travellers seeking safe and welcoming manaakitanga'
    ]
  },
  'Auckland': {
    culturalContext: [
      'Polynesian cultural hub and Pacific identity',
      'Tāmaki Makaurau (many lovers) historical significance',
      'Urban Māori renaissance and contemporary expression'
    ],
    uniqueElements: [
      'Sky Tower and harbour bridge icons',
      'Hauraki Gulf islands and ferry connections',
      'Viaduct Harbour and waterfront dining'
    ],
    audienceAngles: [
      'Urban explorers seeking Pacific cultural immersion',
      'Sailing and water sports enthusiasts',
      'Business and conference travelers'
    ]
  },
  'Wellington': {
    culturalContext: [
      'Te Whanga-nui-a-Tara (great harbour) significance',
      'Creative capital and arts scene vibrancy',
      'Political and cultural heart of Aotearoa'
    ],
    uniqueElements: [
      'Te Papa Tongarewa Museum of New Zealand',
      'Wellington Cable Car and Botanic Garden',
      'Cuba Street and creative quarter'
    ],
    audienceAngles: [
      'Arts and culture enthusiasts',
      'Film and creative industry visitors',
      'Political and historical interest travelers'
    ]
  },
  'Queenstown': {
    culturalContext: [
      'Adventure capital reputation and extreme sports',
      'Tāhuna (shallow bay) traditional significance',
      'Southern Alps grandeur and dramatic landscapes'
    ],
    uniqueElements: [
      'Lake Wakatipu and TSS Earnslaw steamship',
      'Skyline Gondola and Luge',
      'Central Otago wine trails'
    ],
    audienceAngles: [
      'Adrenaline and adventure sports seekers',
      'Luxury travelers and honeymooners',
      'Wine enthusiasts and connoisseurs'
    ]
  },
  'Rotorua': {
    culturalContext: [
      'Te Arawa iwi cultural heartland',
      'Living Māori culture and traditional practices',
      'Geothermal wonder and natural phenomena'
    ],
    uniqueElements: [
      'Te Puia geothermal park and Pohutu geyser',
      'Whakarewarewa Living Māori Village',
      'Polynesian Spa and hot pools'
    ],
    audienceAngles: [
      'Cultural learning and Māori experience seekers',
      'Geothermal and natural phenomenon enthusiasts',
      'Wellness and spa retreat visitors'
    ]
  }
};

export const MAORI_GLOSSARY = {
  'Aotearoa': {
    translation: 'Land of the long white cloud',
    context: 'Māori name for New Zealand',
    pronunciation: 'ah-oh-teh-ah-roh-ah'
  },
  'manaakitanga': {
    translation: 'Hospitality, care, respect, generosity',
    context: 'Core Māori value of caring for others',
    pronunciation: 'mah-nah-ah-kee-tah-ngah'
  },
  'Ngāi Tahu': {
    translation: 'People of Tahu',
    context: 'South Island iwi, Canterbury region',
    pronunciation: 'ngah-ee tah-hoo'
  },
  'Te Arawa': {
    translation: 'The canoe/waka',
    context: 'Bay of Plenty iwi, Rotorua region',
    pronunciation: 'teh ah-rah-wah'
  },
  'Ōtautahi': {
    translation: 'The place of Tautahi',
    context: 'Māori name for Christchurch',
    pronunciation: 'oh-tah-oo-tah-hee'
  },
  'kaitiakitanga': {
    translation: 'Guardianship, environmental stewardship',
    context: 'Responsibility to protect and care for environment',
    pronunciation: 'kah-ee-tee-ah-kee-tah-ngah'
  }
};

export const GENERATIONAL_PROFILES = {
  'Gen Z (1997-2012)': {
    displayName: 'Gen Z',
    description: 'Digital natives prioritizing authenticity & sustainability',
    travelTrends: [
      'Solo backpacking and hostels',
      'Eco-tourism and conservation volunteering',
      'Instagram-worthy photo locations'
    ]
  },
  'Millennials (1981-1996)': {
    displayName: 'Millennials',
    description: 'Experience-focused, digitally savvy, authenticity-seeking',
    travelTrends: [
      'Food and wine tourism',
      'Cultural workshops and local experiences',
      'Working holidays and remote work travel'
    ]
  },
  'Gen X (1965-1980)': {
    displayName: 'Gen X',
    description: 'Family-focused, practical, value-conscious',
    travelTrends: [
      'Family-friendly adventure activities',
      'Educational museums and cultural sites',
      'Multi-generational family trips'
    ]
  },
  'Baby Boomers (1946-1964)': {
    displayName: 'Baby Boomers',
    description: 'Comfort-seeking, knowledge-focused, service-oriented',
    travelTrends: [
      'Luxury cruise experiences',
      'Guided cultural and historical tours',
      'Spa and wellness retreats'
    ]
  }
};

export const EMOTIONAL_APPROACHES = [
  'Inspirational and aspirational',
  'Practical and informative',
  'Emotional and heartfelt',
  'Adventurous and exciting',
  'Peaceful and reflective',
  'Social and community-focused',
  'Educational and discovery-oriented',
  'Luxury and premium experience'
];
