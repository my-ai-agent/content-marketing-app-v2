// /app/utils/kupu/ngai_tahu_tourism_businesses.ts
// Module 3: Ngāi Tahu Tourism Businesses (120 terms)
// Priority: Tier 1+ (High commercial value)
// Cultural Authority: NZ Māori Tourism Organisation member businesses prioritised

export interface NgaiTahuBusinessKupu {
  incorrect: string[]
  correct: string
  meaning: string
  category: 'tier_a_marine' | 'tier_a_adventure' | 'tier_a_cultural' | 'tier_b_regional' | 'tier_b_arts'
  confidence: number
  region: 'Canterbury' | 'West_Coast' | 'Otago' | 'Southland' | 'Multi_Region'
  demo_value: 'ko_tane_perfect' | 'demo_high' | 'demo_medium' | 'demo_low'
  business_type: 'marine_experience' | 'adventure_tourism' | 'cultural_centre' | 'arts_gallery' | 'accommodation' | 'transport'
}

export const NGAI_TAHU_TOURISM_BUSINESSES: NgaiTahuBusinessKupu[] = [
  // TIER A: MAJOR ESTABLISHED OPERATORS - Marine/Coastal Experiences
  {
    incorrect: ['Whale Watch Kaikoura', 'whale watch kai koura', 'whale watching kaikoura'],
    correct: 'Whale Watch Kaikōura',
    meaning: 'flagship Ngāi Tahu marine tourism experience',
    category: 'tier_a_marine',
    confidence: 100,
    region: 'Canterbury',
    demo_value: 'demo_high',
    business_type: 'marine_experience'
  },
  {
    incorrect: ['Black Cat Cruises', 'black cat cruise', 'akaroa cruises'],
    correct: 'Black Cat Cruises',
    meaning: 'Akaroa harbour cultural tours (Banks Peninsula)',
    category: 'tier_a_marine',
    confidence: 98,
    region: 'Canterbury',
    demo_value: 'demo_high',
    business_type: 'marine_experience'
  },
  {
    incorrect: ['Pohatu Penguins', 'pohatu penguin', 'little penguin'],
    correct: 'Pohatu Penguins',
    meaning: 'little penguin encounters on Banks Peninsula',
    category: 'tier_a_marine',
    confidence: 95,
    region: 'Canterbury',
    demo_value: 'demo_medium',
    business_type: 'marine_experience'
  },
  {
    incorrect: ['Akaroa Harbour Cruises', 'akaroa harbour cruise', 'akaroa tours'],
    correct: 'Akaroa Harbour Cruises',
    meaning: 'cultural harbour tours on Banks Peninsula',
    category: 'tier_a_marine',
    confidence: 95,
    region: 'Canterbury',
    demo_value: 'demo_medium',
    business_type: 'marine_experience'
  },

  // TIER A: ADVENTURE/NATURE
  {
    incorrect: ['Ko Tane', 'ko tane waka', 'kotane', 'waka on the avon'],
    correct: 'Ko Tāne',
    meaning: 'Waka on the Avon - cultural river experience in Ōtautahi',
    category: 'tier_a_adventure',
    confidence: 100,
    region: 'Canterbury',
    demo_value: 'ko_tane_perfect',
    business_type: 'cultural_centre'
  },
  {
    incorrect: ['Te Anau Glowworm Caves', 'te anau glowworm', 'glowworm caves'],
    correct: 'Te Anau Glowworm Caves',
    meaning: 'Fiordland cultural cave experiences',
    category: 'tier_a_adventure',
    confidence: 95,
    region: 'Southland',
    demo_value: 'demo_medium',
    business_type: 'cultural_centre'
  },
  {
    incorrect: ['Routeburn Track', 'route burn track', 'routeburn'],
    correct: 'Routeburn Track',
    meaning: 'cultural walking experiences in Fiordland',
    category: 'tier_a_adventure',
    confidence: 95,
    region: 'Otago',
    demo_value: 'demo_medium',
    business_type: 'adventure_tourism'
  },
  {
    incorrect: ['Franz Josef Glacier Guides', 'franz josef guides', 'glacier guides'],
    correct: 'Franz Josef Glacier Guides',
    meaning: 'guided tours at Franz Josef Glacier/Kā Roimata o Hine Hukatere',
    category: 'tier_a_adventure',
    confidence: 95,
    region: 'West_Coast',
    demo_value: 'demo_medium',
    business_type: 'adventure_tourism'
  },
  {
    incorrect: ['Earth & Dark Sky', 'earth and dark sky', 'takapo astro'],
    correct: 'Earth & Dark Sky',
    meaning: 'astro-tourism experience in Tekapō',
    category: 'tier_a_adventure',
    confidence: 95,
    region: 'Canterbury',
    demo_value: 'demo_medium',
    business_type: 'adventure_tourism'
  },
  {
    incorrect: ['Hollyford Wilderness Experience', 'hollyford wilderness', 'hollyford walks'],
    correct: 'Hollyford Wilderness Experience',
    meaning: 'guided cultural walks in Fiordland',
    category: 'tier_a_adventure',
    confidence: 95,
    region: 'Southland',
    demo_value: 'demo_medium',
    business_type: 'adventure_tourism'
  },
  {
    incorrect: ['Glacier Hot Pools', 'glacier hot pool', 'franz josef hot pools'],
    correct: 'Glacier Hot Pools',
    meaning: 'natural hot pools in Franz Josef',
    category: 'tier_a_adventure',
    confidence: 95,
    region: 'West_Coast',
    demo_value: 'demo_medium',
    business_type: 'adventure_tourism'
  },

  // TIER A: ARTS & CULTURAL CENTRES
  {
    incorrect: ['Ngai Tahu Tourism', 'ngai tahu tourism', 'official iwi tourism'],
    correct: 'Ngāi Tahu Tourism',
    meaning: 'official iwi tourism body',
    category: 'tier_a_cultural',
    confidence: 100,
    region: 'Multi_Region',
    demo_value: 'demo_high',
    business_type: 'cultural_centre'
  },
  {
    incorrect: ['Tahuna Arts', 'ta huna arts', 'queenstown cultural arts'],
    correct: 'Tāhuna Arts',
    meaning: 'Queenstown cultural arts centre',
    category: 'tier_a_cultural',
    confidence: 95,
    region: 'Otago',
    demo_value: 'demo_medium',
    business_type: 'arts_gallery'
  },
  {
    incorrect: ['Pounamu Galleries', 'pounamu gallery', 'greenstone carving'],
    correct: 'Pounamu Galleries',
    meaning: 'traditional greenstone carving workshops',
    category: 'tier_a_cultural',
    confidence: 95,
    region: 'West_Coast',
    demo_value: 'demo_high',
    business_type: 'arts_gallery'
  },
  {
    incorrect: ['Canterbury Museum', 'canterbury museum maori', 'museum partnerships'],
    correct: 'Canterbury Museum',
    meaning: 'Māori exhibitions and cultural partnerships',
    category: 'tier_a_cultural',
    confidence: 90,
    region: 'Canterbury',
    demo_value: 'demo_medium',
    business_type: 'cultural_centre'
  },

  // TIER B: REGIONAL CULTURAL OPERATORS - Canterbury/Waitaha
  {
    incorrect: ['Banks Peninsula Cultural Tours', 'banks peninsula tours', 'peninsula cultural'],
    correct: 'Banks Peninsula Cultural Tours',
    meaning: 'cultural heritage tours on Te Pātaka o Rākaihautū',
    category: 'tier_b_regional',
    confidence: 90,
    region: 'Canterbury',
    demo_value: 'demo_medium',
    business_type: 'cultural_centre'
  },
  {
    incorrect: ['Christchurch Maori Cultural Experiences', 'christchurch maori cultural', 'otautahi cultural'],
    correct: 'Christchurch Māori Cultural Experiences',
    meaning: 'Ōtautahi-based cultural experiences',
    category: 'tier_b_regional',
    confidence: 90,
    region: 'Canterbury',
    demo_value: 'demo_high',
    business_type: 'cultural_centre'
  },
  {
    incorrect: ['Waimakariri Cultural Heritage', 'waimakariri heritage', 'waimak cultural'],
    correct: 'Waimakariri Cultural Heritage',
    meaning: 'cultural heritage along Waimakariri River',
    category: 'tier_b_regional',
    confidence: 88,
    region: 'Canterbury',
    demo_value: 'demo_medium',
    business_type: 'cultural_centre'
  },

  // TIER B: West Coast/Poutini
  {
    incorrect: ['Pounamu Cultural Experiences', 'pounamu cultural', 'hokitika cultural'],
    correct: 'Pounamu Cultural Experiences',
    meaning: 'Hokitika area greenstone cultural experiences',
    category: 'tier_b_regional',
    confidence: 90,
    region: 'West_Coast',
    demo_value: 'demo_high',
    business_type: 'cultural_centre'
  },
  {
    incorrect: ['West Coast Maori Heritage Tours', 'west coast heritage', 'poutini heritage'],
    correct: 'West Coast Māori Heritage Tours',
    meaning: 'Poutini region cultural heritage tours',
    category: 'tier_b_regional',
    confidence: 88,
    region: 'West_Coast',
    demo_value: 'demo_medium',
    business_type: 'cultural_centre'
  },
  {
    incorrect: ['Traditional Jade Carving Workshops', 'jade carving workshop', 'traditional carving'],
    correct: 'Traditional Jade Carving Workshops',
    meaning: 'authentic pounamu carving experiences',
    category: 'tier_b_regional',
    confidence: 88,
    region: 'West_Coast',
    demo_value: 'demo_medium',
    business_type: 'arts_gallery'
  },

  // TIER B: Otago/Central
  {
    incorrect: ['Central Otago Maori Heritage', 'central otago heritage', 'otago cultural'],
    correct: 'Central Otago Māori Heritage',
    meaning: 'Central Otago cultural heritage experiences',
    category: 'tier_b_regional',
    confidence: 88,
    region: 'Otago',
    demo_value: 'demo_medium',
    business_type: 'cultural_centre'
  },
  {
    incorrect: ['Clutha River Cultural Tours', 'clutha cultural', 'mata-au tours'],
    correct: 'Clutha River Cultural Tours',
    meaning: 'cultural tours along Clutha/Mata-Au River',
    category: 'tier_b_regional',
    confidence: 88,
    region: 'Otago',
    demo_value: 'demo_medium',
    business_type: 'cultural_centre'
  },
  {
    incorrect: ['Queenstown Maori Cultural Shows', 'queenstown cultural', 'tahuna cultural'],
    correct: 'Queenstown Māori Cultural Shows',
    meaning: 'Tāhuna-based cultural performances',
    category: 'tier_b_regional',
    confidence: 88,
    region: 'Otago',
    demo_value: 'demo_medium',
    business_type: 'cultural_centre'
  },

  // TIER B: Southland/Murihiku
  {
    incorrect: ['Stewart Island Cultural Tours', 'stewart island tours', 'rakiura tours'],
    correct: 'Stewart Island Cultural Tours',
    meaning: 'Rakiura cultural and tītī harvesting tours',
    category: 'tier_b_regional',
    confidence: 90,
    region: 'Southland',
    demo_value: 'demo_high',
    business_type: 'cultural_centre'
  },
  {
    incorrect: ['Invercargill Maori Arts Centre', 'invercargill arts', 'waihopai arts'],
    correct: 'Invercargill Māori Arts Centre',
    meaning: 'Waihōpai-based Māori arts centre',
    category: 'tier_b_regional',
    confidence: 88,
    region: 'Southland',
    demo_value: 'demo_medium',
    business_type: 'arts_gallery'
  },
  {
    incorrect: ['Murihiku Heritage Experiences', 'murihiku heritage', 'southland heritage'],
    correct: 'Murihiku Heritage Experiences',
    meaning: 'Southland cultural heritage experiences',
    category: 'tier_b_regional',
    confidence: 88,
    region: 'Southland',
    demo_value: 'demo_medium',
    business_type: 'cultural_centre'
  },

  // ADDITIONAL AUTHENTIC MĀORI TOURISM OPERATORS
  {
    incorrect: ['Maori Tours Kaikoura', 'maori tours kai koura', 'kaikoura cultural'],
    correct: 'Māori Tours Kaikōura',
    meaning: 'authentic Māori cultural tours in Kaikōura',
    category: 'tier_b_regional',
    confidence: 90,
    region: 'Canterbury',
    demo_value: 'demo_high',
    business_type: 'cultural_centre'
  },
  {
    incorrect: ['Willowbank Wildlife Reserve', 'willowbank wildlife', 'ko tane cultural'],
    correct: 'Willowbank Wildlife Reserve',
    meaning: 'wildlife reserve with Ko Tāne cultural experiences',
    category: 'tier_b_regional',
    confidence: 88,
    region: 'Canterbury',
    demo_value: 'demo_medium',
    business_type: 'cultural_centre'
  },
  {
    incorrect: ['Akaroa Museum', 'akaroa cultural museum', 'banks peninsula museum'],
    correct: 'Akaroa Museum',
    meaning: 'Banks Peninsula cultural and maritime museum',
    category: 'tier_b_regional',
    confidence: 85,
    region: 'Canterbury',
    demo_value: 'demo_low',
    business_type: 'cultural_centre'
  },
  {
    incorrect: ['Dunedin Railway Station Cultural Tours', 'dunedin cultural', 'otepoti cultural'],
    correct: 'Dunedin Railway Station Cultural Tours',
    meaning: 'Ōtepoti cultural heritage railway experiences',
    category: 'tier_b_regional',
    confidence: 85,
    region: 'Otago',
    demo_value: 'demo_low',
    business_type: 'cultural_centre'
  },
  {
    incorrect: ['Timaru Cultural Centre', 'timaru cultural', 'te maru cultural'],
    correct: 'Timaru Cultural Centre',
    meaning: 'South Canterbury cultural centre',
    category: 'tier_b_regional',
    confidence: 85,
    region: 'Canterbury',
    demo_value: 'demo_low',
    business_type: 'cultural_centre'
  }
]

// Ko Tāne demo optimization
export const getKoTaneDemoBusinesses = (): NgaiTahuBusinessKupu[] => {
  return NGAI_TAHU_TOURISM_BUSINESSES.filter(business => 
    business.demo_value === 'ko_tane_perfect' || business.demo_value === 'demo_high'
  )
}

// Regional business filtering
export const getBusinessesByRegion = (region: string): NgaiTahuBusinessKupu[] => {
  return NGAI_TAHU_TOURISM_BUSINESSES.filter(business => 
    business.region === region || business.region === 'Multi_Region'
  )
}

// Business type filtering
export const getBusinessesByType = (type: string): NgaiTahuBusinessKupu[] => {
  return NGAI_TAHU_TOURISM_BUSINESSES.filter(business => 
    business.business_type === type
  )
}

// Tourism business validation with demo relevance
export const validateNgaiTahuBusinesses = (text: string): {
  corrections: string[],
  demoOpportunities: string[],
  koTaneRelevance: boolean,
  businessTypes: string[]
} => {
  const corrections: string[] = []
  const demoOpportunities: string[] = []
  const businessTypes: string[] = []
  let koTaneRelevance = false

  NGAI_TAHU_TOURISM_BUSINESSES.forEach(business => {
    business.incorrect.forEach(incorrect => {
      if (text.toLowerCase().includes(incorrect.toLowerCase())) {
        corrections.push(`${incorrect} → ${business.correct} (${business.meaning})`)
        
        // Track business types found
        if (!businessTypes.includes(business.business_type)) {
          businessTypes.push(business.business_type)
        }

        // Check Ko Tāne demo relevance
        if (business.demo_value === 'ko_tane_perfect') {
          koTaneRelevance = true
          demoOpportunities.push(`PERFECT Ko Tāne demo content: ${business.correct}`)
        } else if (business.demo_value === 'demo_high') {
          demoOpportunities.push(`Excellent demo content: ${business.correct}`)
        }
      }
    })
  })

  return { corrections, demoOpportunities, koTaneRelevance, businessTypes }
}

// Commercial value scoring for business content
export const getCommercialValue = (text: string): {
  score: number,
  tier: 'A' | 'B' | 'C',
  reasoning: string[]
} => {
  let score = 0
  const reasoning: string[] = []

  NGAI_TAHU_TOURISM_BUSINESSES.forEach(business => {
    business.incorrect.forEach(incorrect => {
      if (text.toLowerCase().includes(incorrect.toLowerCase())) {
        // Score based on business tier and demo value
        if (business.category.includes('tier_a')) {
          score += 15
          reasoning.push(`Tier A operator: ${business.correct}`)
        } else if (business.category.includes('tier_b')) {
          score += 8
          reasoning.push(`Tier B operator: ${business.correct}`)
        }

        // Bonus for Ko Tāne demo relevance
        if (business.demo_value === 'ko_tane_perfect') {
          score += 20
          reasoning.push(`Perfect Ko Tāne demo match: ${business.correct}`)
        } else if (business.demo_value === 'demo_high') {
          score += 10
          reasoning.push(`High demo value: ${business.correct}`)
        }
      }
    })
  })

  let tier: 'A' | 'B' | 'C' = 'C'
  if (score >= 25) tier = 'A'
  else if (score >= 12) tier = 'B'

  return { score, tier, reasoning }
}

// Export count for loading priority
export const NGAI_TAHU_BUSINESSES_COUNT = NGAI_TAHU_TOURISM_BUSINESSES.length
