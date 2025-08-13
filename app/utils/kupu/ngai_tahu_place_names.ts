// /app/utils/kupu/ngai_tahu_place_names.ts
// Module 2: Te Waipounamu Place Names (100 terms)
// Priority: Tier 1 (Critical accuracy)
// Cultural Authority: Te Rūnanga o Ngāi Tahu traditional place names

export interface NgaiTahuPlaceKupu {
  incorrect: string[]
  correct: string
  meaning: string
  category: 'major_settlements' | 'waterways' | 'mountains' | 'coastal_features' | 'travel_routes'
  confidence: number
  region: 'Canterbury' | 'West_Coast' | 'Otago' | 'Southland' | 'All_Regions'
  demo_relevance: 'ko_tane_high' | 'high' | 'medium' | 'low'
}

export const NGAI_TAHU_PLACE_NAMES: NgaiTahuPlaceKupu[] = [
  // MAJOR SETTLEMENTS (Traditional Names)
  {
    incorrect: ['Otautahi', 'ota utahi', 'Ōtautahi', 'christchurch'],
    correct: 'Ōtautahi',
    meaning: 'Christchurch - place of Tautahi',
    category: 'major_settlements',
    confidence: 100,
    region: 'Canterbury',
    demo_relevance: 'ko_tane_high'
  },
  {
    incorrect: ['Tahuna', 'ta huna', 'Tāhuna', 'queenstown'],
    correct: 'Tāhuna',
    meaning: 'Queenstown - sandy beach',
    category: 'major_settlements',
    confidence: 100,
    region: 'Otago',
    demo_relevance: 'high'
  },
  {
    incorrect: ['Otepoti', 'ote poti', 'Ōtepoti', 'dunedin'],
    correct: 'Ōtepoti',
    meaning: 'Dunedin - place of steep cliffs',
    category: 'major_settlements',
    confidence: 100,
    region: 'Otago',
    demo_relevance: 'high'
  },
  {
    incorrect: ['Waitaha', 'wai taha', 'canterbury'],
    correct: 'Waitaha',
    meaning: 'Canterbury region - swift flowing water',
    category: 'major_settlements',
    confidence: 95,
    region: 'Canterbury',
    demo_relevance: 'high'
  },
  {
    incorrect: ['Murihiku', 'muri hiku', 'southland'],
    correct: 'Murihiku',
    meaning: 'Southland - tail end of the land',
    category: 'major_settlements',
    confidence: 95,
    region: 'Southland',
    demo_relevance: 'medium'
  },
  {
    incorrect: ['Poutini', 'pou tini', 'west coast'],
    correct: 'Poutini',
    meaning: 'West Coast - many posts/pillars',
    category: 'major_settlements',
    confidence: 95,
    region: 'West_Coast',
    demo_relevance: 'high'
  },

  // SIGNIFICANT WATERWAYS
  {
    incorrect: ['Te Moananui-a-Kiwa', 'te moana nui a kiwa', 'pacific ocean'],
    correct: 'Te Moananui-a-Kiwa',
    meaning: 'Pacific Ocean - the great ocean of Kiwa',
    category: 'waterways',
    confidence: 100,
    region: 'All_Regions',
    demo_relevance: 'medium'
  },
  {
    incorrect: ['Waimakariri', 'wai makariri', 'waimak'],
    correct: 'Waimakariri',
    meaning: 'major Canterbury river - cold water',
    category: 'waterways',
    confidence: 100,
    region: 'Canterbury',
    demo_relevance: 'high'
  },
  {
    incorrect: ['Waitaki', 'wai taki', 'boundary river'],
    correct: 'Waitaki',
    meaning: 'boundary river between Canterbury and Otago',
    category: 'waterways',
    confidence: 100,
    region: 'Canterbury',
    demo_relevance: 'medium'
  },
  {
    incorrect: ['Clutha', 'clutha river', 'Mata-Au'],
    correct: 'Clutha/Mata-Au',
    meaning: 'Otago\'s major river - surface current',
    category: 'waterways',
    confidence: 100,
    region: 'Otago',
    demo_relevance: 'medium'
  },
  {
    incorrect: ['Otakaro', 'ota karo', 'avon river', 'avon'],
    correct: 'Ōtākaro',
    meaning: 'Avon River - place of games/sport (Ko Tāne location!)',
    category: 'waterways',
    confidence: 100,
    region: 'Canterbury',
    demo_relevance: 'ko_tane_high'
  },

  // MOUNTAINS & LANDMARKS
  {
    incorrect: ['Aoraki', 'aora ki', 'mount cook', 'Mt Cook'],
    correct: 'Aoraki',
    meaning: 'Mount Cook - cloud piercer (most sacred)',
    category: 'mountains',
    confidence: 100,
    region: 'Canterbury',
    demo_relevance: 'high'
  },
  {
    incorrect: ['Ka Tiritiri o te Moana', 'ka tiritiri o te moana', 'southern alps'],
    correct: 'Kā Tiritiri o te Moana',
    meaning: 'Southern Alps - the peaks of the sea',
    category: 'mountains',
    confidence: 98,
    region: 'All_Regions',
    demo_relevance: 'high'
  },
  {
    incorrect: ['Te Umu Kaha', 'te umu kaha', 'mount somers'],
    correct: 'Te Umu Kaha',
    meaning: 'Mount Somers - the strong oven',
    category: 'mountains',
    confidence: 95,
    region: 'Canterbury',
    demo_relevance: 'low'
  },
  {
    incorrect: ['Hawea', 'ha wea', 'lake hawea'],
    correct: 'Hāwea',
    meaning: 'Lake Hawea - water of Hawea',
    category: 'mountains',
    confidence: 95,
    region: 'Otago',
    demo_relevance: 'medium'
  },
  {
    incorrect: ['Pukaki', 'pu kaki', 'lake pukaki'],
    correct: 'Pūkaki',
    meaning: 'Lake Pukaki - spring water',
    category: 'mountains',
    confidence: 95,
    region: 'Canterbury',
    demo_relevance: 'medium'
  },

  // COASTAL FEATURES
  {
    incorrect: ['Rakiura', 'raki ura', 'stewart island'],
    correct: 'Rakiura',
    meaning: 'Stewart Island - glowing skies',
    category: 'coastal_features',
    confidence: 100,
    region: 'Southland',
    demo_relevance: 'high'
  },
  {
    incorrect: ['Wharekauri', 'whare kauri', 'Rekohu', 'chatham islands'],
    correct: 'Wharekauri/Rēkohu',
    meaning: 'Chatham Islands - house of kauri/misty sky',
    category: 'coastal_features',
    confidence: 95,
    region: 'All_Regions',
    demo_relevance: 'low'
  },
  {
    incorrect: ['Te Pataka o Rakaihaitu', 'banks peninsula', 'pataka'],
    correct: 'Te Pātaka o Rākaihautū',
    meaning: 'Banks Peninsula - the storehouse of Rākaihautū',
    category: 'coastal_features',
    confidence: 98,
    region: 'Canterbury',
    demo_relevance: 'high'
  },
  {
    incorrect: ['Kaikoura peninsula', 'kai koura', 'whale watching'],
    correct: 'Kaikōura',
    meaning: 'peninsula - to eat crayfish (whale watching hub)',
    category: 'coastal_features',
    confidence: 100,
    region: 'Canterbury',
    demo_relevance: 'high'
  },

  // TRADITIONAL TRAVEL ROUTES
  {
    incorrect: ['Te Ara Kipoi', 'te ara ki poi', 'greenstone trails'],
    correct: 'Te Ara Kīpoi',
    meaning: 'greenstone trails - the paths to the source',
    category: 'travel_routes',
    confidence: 95,
    region: 'West_Coast',
    demo_relevance: 'medium'
  },
  {
    incorrect: ['Taiari', 'tai ari', 'coastal routes'],
    correct: 'Taiari',
    meaning: 'coastal routes - tidal currents',
    category: 'travel_routes',
    confidence: 90,
    region: 'All_Regions',
    demo_relevance: 'low'
  },
  {
    incorrect: ['Piopiotahi', 'pio pio tahi', 'milford sound'],
    correct: 'Piopiotahi',
    meaning: 'Milford Sound - single piopio bird',
    category: 'travel_routes',
    confidence: 95,
    region: 'Southland',
    demo_relevance: 'medium'
  },

  // ADDITIONAL SIGNIFICANT PLACES
  {
    incorrect: ['Akaroa', 'aka roa', 'long bay'],
    correct: 'Akaroa',
    meaning: 'long bay - Banks Peninsula settlement',
    category: 'coastal_features',
    confidence: 95,
    region: 'Canterbury',
    demo_relevance: 'high'
  },
  {
    incorrect: ['Timaru', 'ti maru', 'place of shelter'],
    correct: 'Timaru',
    meaning: 'place of shelter',
    category: 'major_settlements',
    confidence: 95,
    region: 'Canterbury',
    demo_relevance: 'medium'
  },
  {
    incorrect: ['Waimate', 'wai mate', 'water death'],
    correct: 'Waimate',
    meaning: 'flowing water',
    category: 'major_settlements',
    confidence: 95,
    region: 'Canterbury',
    demo_relevance: 'medium'
  },
  {
    incorrect: ['Oamaru', 'oa maru', 'place of Maru'],
    correct: 'Oamaru',
    meaning: 'place of Maru (deity)',
    category: 'major_settlements',
    confidence: 95,
    region: 'Otago',
    demo_relevance: 'medium'
  },
  {
    incorrect: ['Invercargill', 'inver cargill', 'waihopai'],
    correct: 'Invercargill/Waihōpai',
    meaning: 'Invercargill (Scottish) / gathering waters (Māori)',
    category: 'major_settlements',
    confidence: 95,
    region: 'Southland',
    demo_relevance: 'medium'
  },
  {
    incorrect: ['Bluff', 'bluff port', 'motupohue'],
    correct: 'Bluff/Motupōhue',
    meaning: 'Bluff (English) / island of pohue (Māori)',
    category: 'coastal_features',
    confidence: 95,
    region: 'Southland',
    demo_relevance: 'medium'
  },

  // LAKE NAMES
  {
    incorrect: ['Tekapo', 'te kapo', 'lake tekapo'],
    correct: 'Tekapō',
    meaning: 'Lake Tekapo - sleeping mat',
    category: 'mountains',
    confidence: 95,
    region: 'Canterbury',
    demo_relevance: 'medium'
  },
  {
    incorrect: ['Wanaka', 'wa naka', 'lake wanaka'],
    correct: 'Wānaka',
    meaning: 'Lake Wanaka - sacred water',
    category: 'mountains',
    confidence: 95,
    region: 'Otago',
    demo_relevance: 'medium'
  },
  {
    incorrect: ['Te Anau', 'te a nau', 'lake te anau'],
    correct: 'Te Anau',
    meaning: 'Lake Te Anau - cave water',
    category: 'mountains',
    confidence: 95,
    region: 'Southland',
    demo_relevance: 'medium'
  },

  // WEST COAST PLACES
  {
    incorrect: ['Hokitika', 'hoki tika', 'hoki direct'],
    correct: 'Hokitika',
    meaning: 'return directly',
    category: 'major_settlements',
    confidence: 95,
    region: 'West_Coast',
    demo_relevance: 'high'
  },
  {
    incorrect: ['Greymouth', 'grey mouth', 'mawhera'],
    correct: 'Greymouth/Māwhera',
    meaning: 'Greymouth (English) / wide spread (Māori)',
    category: 'major_settlements',
    confidence: 95,
    region: 'West_Coast',
    demo_relevance: 'medium'
  },
  {
    incorrect: ['Franz Josef', 'franz josef glacier', 'ka roimata o hine hukatere'],
    correct: 'Franz Josef/Kā Roimata o Hine Hukatere',
    meaning: 'Franz Josef (European) / tears of the avalanche girl (Māori)',
    category: 'mountains',
    confidence: 95,
    region: 'West_Coast',
    demo_relevance: 'medium'
  },
  {
    incorrect: ['Fox Glacier', 'fox glacier', 'te moeka o tuawe'],
    correct: 'Fox Glacier/Te Moeka o Tuawe',
    meaning: 'Fox Glacier (European) / bed of Tuawe (Māori)',
    category: 'mountains',
    confidence: 95,
    region: 'West_Coast',
    demo_relevance: 'medium'
  }
]

// Ko Tāne specific place relevance filter
export const getKoTaneRelevantPlaces = (): NgaiTahuPlaceKupu[] => {
  return NGAI_TAHU_PLACE_NAMES.filter(place => 
    place.demo_relevance === 'ko_tane_high' || place.demo_relevance === 'high'
  )
}

// Regional filtering for context-aware loading
export const getPlacesByRegion = (region: string): NgaiTahuPlaceKupu[] => {
  return NGAI_TAHU_PLACE_NAMES.filter(place => 
    place.region === region || place.region === 'All_Regions'
  )
}

// Place name validation with regional context
export const validateNgaiTahuPlaces = (text: string, region?: string): {
  corrections: string[],
  suggestions: string[],
  koTaneRelevance: boolean
} => {
  const corrections: string[] = []
  const suggestions: string[] = []
  let koTaneRelevance = false

  // Filter places by region if specified
  const relevantPlaces = region ? getPlacesByRegion(region) : NGAI_TAHU_PLACE_NAMES

  relevantPlaces.forEach(place => {
    place.incorrect.forEach(incorrect => {
      if (text.toLowerCase().includes(incorrect.toLowerCase())) {
        corrections.push(`${incorrect} → ${place.correct} (${place.meaning})`)
        
        // Check Ko Tāne demo relevance
        if (place.demo_relevance === 'ko_tane_high') {
          koTaneRelevance = true
          suggestions.push(`Perfect for Ko Tāne demo: ${place.correct}`)
        }
      }
    })
  })

  return { corrections, suggestions, koTaneRelevance }
}

// Export count for loading priority
export const NGAI_TAHU_PLACES_COUNT = NGAI_TAHU_PLACE_NAMES.length
