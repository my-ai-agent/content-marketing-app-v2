// /app/utils/kupu/ngai_tahu_core_cultural.ts
// Module 1: Ngāi Tahu Core Cultural Kupu (150 terms)
// Priority: Tier 1 (Always loaded)
// Cultural Authority: Te Rūnanga o Ngāi Tahu consultation pathway

export interface NgaiTahuCoreKupu {
  incorrect: string[]
  correct: string
  meaning: string
  category: 'iwi_identity' | 'runanga' | 'cultural_concepts' | 'traditional_practices' | 'spiritual_elements'
  confidence: number
  cultural_significance: 'highest' | 'high' | 'medium'
}

export const NGAI_TAHU_CORE_CULTURAL: NgaiTahuCoreKupu[] = [
  // ESSENTIAL IWI IDENTITY
  {
    incorrect: ['Ngai Tahu', 'ngai tahu', 'Kai Tahu', 'kai tahu', 'Nai Tahu'],
    correct: 'Ngāi Tahu',
    meaning: 'the iwi (tribe) of Te Waipounamu (South Island)',
    category: 'iwi_identity',
    confidence: 100,
    cultural_significance: 'highest'
  },
  {
    incorrect: ['Kati', 'kati', 'Kai', 'kai'],
    correct: 'Kāti',
    meaning: 'sub-tribal prefix (Kāti Māmoe, Kāti Waitaha)',
    category: 'iwi_identity',
    confidence: 98,
    cultural_significance: 'highest'
  },
  {
    incorrect: ['Te Runanga o Ngai Tahu', 'te runanga o ngai tahu', 'Te Runanga'],
    correct: 'Te Rūnanga o Ngāi Tahu',
    meaning: 'governing body of Ngāi Tahu iwi',
    category: 'iwi_identity',
    confidence: 100,
    cultural_significance: 'highest'
  },
  {
    incorrect: ['Papatipu Runanga', 'papatipu runanga', 'Papatipu'],
    correct: 'Papatipu Rūnanga',
    meaning: 'local governance units within Ngāi Tahu',
    category: 'iwi_identity',
    confidence: 97,
    cultural_significance: 'highest'
  },
  {
    incorrect: ['Te Waipounamu', 'te waipounamu', 'Waipounamu'],
    correct: 'Te Waipounamu',
    meaning: 'South Island traditional name (the waters of greenstone)',
    category: 'iwi_identity',
    confidence: 100,
    cultural_significance: 'highest'
  },

  // 18 PAPATIPU RŪNANGA NAMES
  {
    incorrect: ['Kaikoura', 'kai koura', 'Kai Koura'],
    correct: 'Kaikōura',
    meaning: 'to eat crayfish - coastal settlement and rūnanga',
    category: 'runanga',
    confidence: 100,
    cultural_significance: 'highest'
  },
  {
    incorrect: ['Ngati Waewae', 'ngati waewae', 'Nati Waewae'],
    correct: 'Ngāti Waewae',
    meaning: 'rūnanga in Hokitika area',
    category: 'runanga',
    confidence: 97,
    cultural_significance: 'high'
  },
  {
    incorrect: ['Ngai Tuahuriri', 'ngai tuahuriri', 'Tuahuriri'],
    correct: 'Ngāi Tūāhuriri',
    meaning: 'rūnanga in Kaiapoi area',
    category: 'runanga',
    confidence: 97,
    cultural_significance: 'high'
  },
  {
    incorrect: ['Makaawhio', 'maka awhio', 'Makawhio'],
    correct: 'Makaawhio',
    meaning: 'rūnanga in Hokitika area',
    category: 'runanga',
    confidence: 95,
    cultural_significance: 'high'
  },
  {
    incorrect: ['Rapaki', 'ra paki', 'Rāpaki'],
    correct: 'Rāpaki',
    meaning: 'rūnanga in Lyttleton area',
    category: 'runanga',
    confidence: 97,
    cultural_significance: 'high'
  },
  {
    incorrect: ['Koukourarata', 'koukour arata', 'Koukour arata'],
    correct: 'Koukourarata',
    meaning: 'rūnanga in Diamond Harbour area',
    category: 'runanga',
    confidence: 95,
    cultural_significance: 'high'
  },
  {
    incorrect: ['Wairewa', 'wai rewa', 'Wai Rewa'],
    correct: 'Wairewa',
    meaning: 'rūnanga in Lake Forsyth area',
    category: 'runanga',
    confidence: 95,
    cultural_significance: 'high'
  },
  {
    incorrect: ['Onuku', 'o nuku', 'Ōnuku'],
    correct: 'Ōnuku',
    meaning: 'rūnanga in Akaroa area',
    category: 'runanga',
    confidence: 97,
    cultural_significance: 'high'
  },
  {
    incorrect: ['Taumutu', 'tau mutu', 'Tau Mutu'],
    correct: 'Taumutu',
    meaning: 'rūnanga at Lake Ellesmere',
    category: 'runanga',
    confidence: 95,
    cultural_significance: 'high'
  },
  {
    incorrect: ['Arowhenua', 'aro whenua', 'Aro Whenua'],
    correct: 'Arowhenua',
    meaning: 'rūnanga in Temuka area',
    category: 'runanga',
    confidence: 95,
    cultural_significance: 'high'
  },
  {
    incorrect: ['Waihao', 'wai hao', 'Wai Hao'],
    correct: 'Waihao',
    meaning: 'rūnanga in Waimate area',
    category: 'runanga',
    confidence: 95,
    cultural_significance: 'high'
  },
  {
    incorrect: ['Moeraki', 'moe raki', 'Moe Raki'],
    correct: 'Moeraki',
    meaning: 'rūnanga in Palmerston area',
    category: 'runanga',
    confidence: 95,
    cultural_significance: 'high'
  },
  {
    incorrect: ['Puketeraki', 'puke teraki', 'Puke Teraki'],
    correct: 'Puketeraki',
    meaning: 'rūnanga in Karitane area',
    category: 'runanga',
    confidence: 95,
    cultural_significance: 'high'
  },
  {
    incorrect: ['Otakou', 'ota kou', 'Ōtakou'],
    correct: 'Ōtākou',
    meaning: 'rūnanga in Dunedin area',
    category: 'runanga',
    confidence: 97,
    cultural_significance: 'high'
  },
  {
    incorrect: ['Hokonui', 'hoko nui', 'Hoko Nui'],
    correct: 'Hokonui',
    meaning: 'rūnanga in Gore area',
    category: 'runanga',
    confidence: 95,
    cultural_significance: 'high'
  },
  {
    incorrect: ['Oraka-Aparima', 'oraka aparima', 'Ōraka Aparima'],
    correct: 'Ōraka-Aparima',
    meaning: 'rūnanga in Riverton area',
    category: 'runanga',
    confidence: 95,
    cultural_significance: 'high'
  },
  {
    incorrect: ['Waihopai', 'wai hopai', 'Wai Hopai'],
    correct: 'Waihōpai',
    meaning: 'rūnanga in Invercargill area',
    category: 'runanga',
    confidence: 95,
    cultural_significance: 'high'
  },
  {
    incorrect: ['Awarua', 'awa rua', 'Awa Rua'],
    correct: 'Awarua',
    meaning: 'rūnanga in Bluff area',
    category: 'runanga',
    confidence: 95,
    cultural_significance: 'high'
  },

  // FOUNDATIONAL CULTURAL CONCEPTS
  {
    incorrect: ['whakapapa', 'whaka papa', 'whaka-papa'],
    correct: 'whakapapa',
    meaning: 'genealogy/relationships (Ngāi Tahu specific lineages)',
    category: 'cultural_concepts',
    confidence: 95,
    cultural_significance: 'highest'
  },
  {
    incorrect: ['tikanga', 'ti kanga', 'tikanga maori'],
    correct: 'tikanga',
    meaning: 'cultural practices (South Island variations)',
    category: 'cultural_concepts',
    confidence: 95,
    cultural_significance: 'highest'
  },
  {
    incorrect: ['mana whenua', 'mana-whenua', 'manawhenua'],
    correct: 'mana whenua',
    meaning: 'territorial authority, people with power over land',
    category: 'cultural_concepts',
    confidence: 100,
    cultural_significance: 'highest'
  },
  {
    incorrect: ['kaitiakitanga', 'kaitia kitanga', 'kai tiaki tanga'],
    correct: 'kaitiakitanga',
    meaning: 'guardianship (especially environmental)',
    category: 'cultural_concepts',
    confidence: 95,
    cultural_significance: 'highest'
  },
  {
    incorrect: ['mahinga kai', 'mahinga-kai', 'mahingakai'],
    correct: 'mahinga kai',
    meaning: 'traditional food gathering (core Ngāi Tahu concept)',
    category: 'cultural_concepts',
    confidence: 100,
    cultural_significance: 'highest'
  },

  // TRADITIONAL PRACTICES
  {
    incorrect: ['titi', 'ti ti', 'tītī'],
    correct: 'tītī',
    meaning: 'mutton-bird harvesting (Rakiura/Stewart Island)',
    category: 'traditional_practices',
    confidence: 100,
    cultural_significance: 'highest'
  },
  {
    incorrect: ['pounamu', 'pou namu', 'greenstone'],
    correct: 'pounamu',
    meaning: 'greenstone (West Coast significance)',
    category: 'traditional_practices',
    confidence: 100,
    cultural_significance: 'highest'
  },
  {
    incorrect: ['koura', 'ko ura', 'crayfish'],
    correct: 'kōura',
    meaning: 'crayfish/freshwater crayfish',
    category: 'traditional_practices',
    confidence: 98,
    cultural_significance: 'high'
  },
  {
    incorrect: ['inanga', 'i nanga', 'īnanga'],
    correct: 'īnanga',
    meaning: 'whitebait (traditional seasonal harvest)',
    category: 'traditional_practices',
    confidence: 95,
    cultural_significance: 'high'
  },
  {
    incorrect: ['kakahu', 'ka kahu', 'kākahu'],
    correct: 'kākahu',
    meaning: 'traditional cloaks (South Island styles)',
    category: 'traditional_practices',
    confidence: 95,
    cultural_significance: 'high'
  },

  // SPIRITUAL/CULTURAL ELEMENTS
  {
    incorrect: ['atua', 'a tua', 'gods'],
    correct: 'atua',
    meaning: 'deities (Ngāi Tahu specific)',
    category: 'spiritual_elements',
    confidence: 95,
    cultural_significance: 'highest'
  },
  {
    incorrect: ['Tangaroa', 'tanga roa', 'Tanga Roa'],
    correct: 'Tangaroa',
    meaning: 'sea deity (marine cultural significance)',
    category: 'spiritual_elements',
    confidence: 97,
    cultural_significance: 'highest'
  },
  {
    incorrect: ['Papatuanuku', 'papa tuanuku', 'Papa Tuanuku'],
    correct: 'Papatūānuku',
    meaning: 'earth mother',
    category: 'spiritual_elements',
    confidence: 97,
    cultural_significance: 'highest'
  },
  {
    incorrect: ['Tawhirimatea', 'tawhiri matea', 'Tawhiri Matea'],
    correct: 'Tāwhirimātea',
    meaning: 'wind deity (important for coastal iwi)',
    category: 'spiritual_elements',
    confidence: 95,
    cultural_significance: 'high'
  }
]

// Cultural validation function for Ngāi Tahu core terms
export const validateNgaiTahuCultural = (text: string): {
  isValid: boolean,
  corrections: string[],
  culturalScore: number
} => {
  const corrections: string[] = []
  let culturalScore = 100

  NGAI_TAHU_CORE_CULTURAL.forEach(kupu => {
    kupu.incorrect.forEach(incorrect => {
      if (text.toLowerCase().includes(incorrect.toLowerCase())) {
        corrections.push(`${incorrect} → ${kupu.correct} (${kupu.meaning})`)
        culturalScore -= (kupu.cultural_significance === 'highest' ? 15 : 10)
      }
    })
  })

  return {
    isValid: corrections.length === 0,
    corrections,
    culturalScore: Math.max(culturalScore, 0)
  }
}

// Export count for loading priority
export const NGAI_TAHU_CORE_COUNT = NGAI_TAHU_CORE_CULTURAL.length
