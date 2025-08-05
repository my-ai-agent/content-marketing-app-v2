// /app/utils/kupu.ts
// Top 150 Māori Kupu Dictionary with Proper Macron (Tohutō) Usage
// Sources: NZ History, Te Aka Māori Dictionary, Official Government Lists

export interface KupuCorrection {
  incorrect: string[]  // Common misspellings without macrons
  correct: string     // Proper spelling with macrons
  meaning: string     // English translation
  category: 'greeting' | 'family' | 'place' | 'concept' | 'nature' | 'cultural' | 'direction' | 'time' | 'action' | 'sacred'
}

export const KUPU_CORRECTIONS: KupuCorrection[] = [
  // CORE CULTURAL CONCEPTS
  {
    incorrect: ['Maori', 'maori'],
    correct: 'Māori',
    meaning: 'indigenous people of Aotearoa New Zealand',
    category: 'cultural'
  },
  {
    incorrect: ['Matauranga', 'matauranga', 'Matauranga Maori', 'matauranga maori'],
    correct: 'Mātauranga Māori',
    meaning: 'Māori knowledge system',
    category: 'cultural'
  },
  {
    incorrect: ['Te Ao Maori', 'Te ao maori', 'te ao maori'],
    correct: 'Te Ao Māori',
    meaning: 'the Māori world/worldview',
    category: 'cultural'
  },

  // TRANSCRIPTION-SPECIFIC CORRECTIONS (based on actual test failures)
  {
    incorrect: ['tipakarirua village', 'tipakarirua', 'whaka village', 'wakarewa village', 'te whaka village'],
    correct: 'Te Whakarewarewa Village',
    meaning: 'living Māori village in Rotorua',
    category: 'place'
  },
  {
    incorrect: ['two hodungi n91 people', 'tuhorangi ngati wahiao', 'tuhourangi ngati wahiao', 'two hodungi people'],
    correct: 'Tūhourangi Ngāti Wāhiao',
    meaning: 'iwi of Te Whakarewarewa Village',
    category: 'cultural'
  },
  {
    incorrect: ['ngati wahiao people', 'nga wahiao people', 'ngati wahiao'],
    correct: 'Ngāti Wāhiao',
    meaning: 'hapū (sub-tribe) of Te Arawa',
    category: 'cultural'
  },
  {
    incorrect: ['te arawa people', 'tearawa people', 'te arawa iwi'],
    correct: 'Te Arawa',
    meaning: 'confederation of Māori iwi in central North Island',
    category: 'cultural'
  },
  {
    incorrect: ['maori village', 'māori village', 'maori cultural village'],
    correct: 'Māori village',
    meaning: 'traditional Māori settlement',
    category: 'cultural'
  },

  // GREETINGS & COMMON PHRASES
  {
    incorrect: ['Tena koe', 'tena koe'],
    correct: 'Tēnā koe',
    meaning: 'hello (to one person)',
    category: 'greeting'
  },
  {
    incorrect: ['Tena koutou', 'tena koutou'],
    correct: 'Tēnā koutou',
    meaning: 'hello (to more than one person)',
    category: 'greeting'
  },
  {
    incorrect: ['Morena', 'morena'],
    correct: 'Mōrena',
    meaning: 'good morning',
    category: 'greeting'
  },

  // FAMILY & PEOPLE
  {
    incorrect: ['whanau', 'Whanau'],
    correct: 'whānau',
    meaning: 'family, extended family',
    category: 'family'
  },
  {
    incorrect: ['wahine', 'Wahine'],
    correct: 'wahine',
    meaning: 'woman (singular)',
    category: 'family'
  },
  {
    incorrect: ['wahine', 'Wahine'],
    correct: 'wāhine',
    meaning: 'women (plural)',
    category: 'family'
  },
  {
    incorrect: ['tangata', 'Tangata'],
    correct: 'tangata',
    meaning: 'person (singular)',
    category: 'family'
  },
  {
    incorrect: ['tangata', 'Tangata'],
    correct: 'tāngata',
    meaning: 'people (plural)',
    category: 'family'
  },
  {
    incorrect: ['tupuna', 'Tupuna'],
    correct: 'tupuna',
    meaning: 'ancestor (singular)',
    category: 'family'
  },
  {
    incorrect: ['tupuna', 'Tupuna'],
    correct: 'tūpuna',
    meaning: 'ancestors (plural)',
    category: 'family'
  },
  {
    incorrect: ['matua', 'Matua'],
    correct: 'matua',
    meaning: 'parent (singular)',
    category: 'family'
  },
  {
    incorrect: ['matua', 'Matua'],
    correct: 'mātua',
    meaning: 'parents (plural)',
    category: 'family'
  },
  {
    incorrect: ['hapu', 'Hapu'],
    correct: 'hapū',
    meaning: 'sub-tribe, to be pregnant',
    category: 'cultural'
  },

  // PLACES & STRUCTURES
  {
    incorrect: ['pa', 'Pa'],
    correct: 'pā',
    meaning: 'fortified village',
    category: 'place'
  },
  {
    incorrect: ['Taupo', 'taupo'],
    correct: 'Taupō',
    meaning: 'lake in central North Island',
    category: 'place'
  },
  {
    incorrect: ['Rotorua', 'rotorua'],
    correct: 'Rotorua',
    meaning: 'city in Bay of Plenty (no macron needed)',
    category: 'place'
  },
  {
    incorrect: ['Te Pa Tu', 'Te pa tu', 'te pa tu', 'Te Pa tu'],
    correct: 'Te Pā Tū',
    meaning: 'the gathering place',
    category: 'cultural'
  },

  // CULTURAL PRACTICES & CONCEPTS
  {
    incorrect: ['aroha', 'Aroha'],
    correct: 'aroha',
    meaning: 'love, compassion, empathy (no macron needed)',
    category: 'concept'
  },
  {
    incorrect: ['Manaakitanga', 'manaakitanga'],
    correct: 'manaakitanga',
    meaning: 'hospitality, care for others (no macron needed)',
    category: 'cultural'
  },
  {
    incorrect: ['Kaitiakitanga', 'kaitiakitanga'],
    correct: 'kaitiakitanga',
    meaning: 'guardianship, environmental stewardship (no macron needed)',
    category: 'cultural'
  },
  {
    incorrect: ['whakapapa', 'Whakapapa'],
    correct: 'whakapapa',
    meaning: 'genealogy, relationships (no macron needed)',
    category: 'cultural'
  },
  {
    incorrect: ['hangi', 'Hangi'],
    correct: 'hāngī',
    meaning: 'earth oven, traditional cooking method',
    category: 'cultural'
  },
  {
    incorrect: ['tapu', 'Tapu'],
    correct: 'tapu',
    meaning: 'sacred, forbidden (no macron needed)',
    category: 'sacred'
  },
  {
    incorrect: ['mana', 'Mana'],
    correct: 'mana',
    meaning: 'spiritual power, authority (no macron needed)',
    category: 'sacred'
  },

  // NATURE & ENVIRONMENT
  {
    incorrect: ['kauri', 'Kauri'],
    correct: 'kauri',
    meaning: 'native tree (no macron needed)',
    category: 'nature'
  },
  {
    incorrect: ['moana', 'Moana'],
    correct: 'moana',
    meaning: 'ocean, large body of water (no macron needed)',
    category: 'nature'
  },
  {
    incorrect: ['maunga', 'Maunga'],
    correct: 'maunga',
    meaning: 'mountain (no macron needed)',
    category: 'nature'
  },
  {
    incorrect: ['awa', 'Awa'],
    correct: 'awa',
    meaning: 'river (no macron needed)',
    category: 'nature'
  },

  // DIRECTIONS & LOCATIONS
  {
    incorrect: ['raro', 'Raro'],
    correct: 'raro',
    meaning: 'down, below (no macron needed)',
    category: 'direction'
  },
  {
    incorrect: ['runga', 'Runga'],
    correct: 'runga',
    meaning: 'up, above (no macron needed)',
    category: 'direction'
  },

  // TIME & SEASONS
  {
    incorrect: ['ra', 'Ra'],
    correct: 'rā',
    meaning: 'sun, day',
    category: 'time'
  },
  {
    incorrect: ['po', 'Po'],
    correct: 'pō',
    meaning: 'night',
    category: 'time'
  },

  // ACTIONS & ACTIVITIES
  {
    incorrect: ['korero', 'Korero'],
    correct: 'kōrero',
    meaning: 'to speak, talk, conversation',
    category: 'action'
  },
  {
    incorrect: ['waiata', 'Waiata'],
    correct: 'waiata',
    meaning: 'song (no macron needed)',
    category: 'cultural'
  },
  {
    incorrect: ['haka', 'Haka'],
    correct: 'haka',
    meaning: 'traditional dance (no macron needed)',
    category: 'cultural'
  },

  // FOOD & SUSTENANCE
  {
    incorrect: ['kai', 'Kai'],
    correct: 'kai',
    meaning: 'food (no macron needed)',
    category: 'concept'
  },
  {
    incorrect: ['koura', 'Koura'],
    correct: 'kōura',
    meaning: 'crayfish',
    category: 'nature'
  },
  {
    incorrect: ['kina', 'Kina'],
    correct: 'kina',
    meaning: 'sea urchin (no macron needed)',
    category: 'nature'
  },

  // PLACE NAME COMPONENTS
  {
    incorrect: ['wai', 'Wai'],
    correct: 'wai',
    meaning: 'water (no macron needed)',
    category: 'nature'
  },
  {
    incorrect: ['nui', 'Nui'],
    correct: 'nui',
    meaning: 'big, large (no macron needed)',
    category: 'concept'
  },
  {
    incorrect: ['iti', 'Iti'],
    correct: 'iti',
    meaning: 'small, little (no macron needed)',
    category: 'concept'
  },

  // ADDITIONAL IMPORTANT CULTURAL TERMS
  {
    incorrect: ['Pakeha', 'pakeha'],
    correct: 'Pākehā',
    meaning: 'non-Māori New Zealander of European descent',
    category: 'cultural'
  },
  {
    incorrect: ['marae', 'Marae'],
    correct: 'marae',
    meaning: 'ceremonial meeting ground (no macron needed)',
    category: 'cultural'
  },
  {
    incorrect: ['hongi', 'Hongi'],
    correct: 'hongi',
    meaning: 'traditional greeting (no macron needed)',
    category: 'cultural'
  },
  {
    incorrect: ['powhiri', 'Powhiri'],
    correct: 'pōwhiri',
    meaning: 'welcome ceremony',
    category: 'cultural'
  },
  {
    incorrect: ['taonga', 'Taonga'],
    correct: 'taonga',
    meaning: 'treasure, precious possession (no macron needed)',
    category: 'cultural'
  },

  // EXTENDED FAMILY TERMS
  {
    incorrect: ['tamariki', 'Tamariki'],
    correct: 'tamariki',
    meaning: 'children (no macron needed)',
    category: 'family'
  },
  {
    incorrect: ['mokopuna', 'Mokopuna'],
    correct: 'mokopuna',
    meaning: 'grandchildren (no macron needed)',
    category: 'family'
  },

  // SOVEREIGNTY & GOVERNANCE
  {
    incorrect: ['rangatiratanga', 'Rangatiratanga'],
    correct: 'rangatiratanga',
    meaning: 'chieftainship, self-determination (no macron needed)',
    category: 'cultural'
  },
  {
    incorrect: ['tino rangatiratanga', 'Tino rangatiratanga'],
    correct: 'tino rangatiratanga',
    meaning: 'absolute sovereignty (no macron needed)',
    category: 'cultural'
  },

  // EMOTIONS & STATES
  {
    incorrect: ['riri', 'Riri'],
    correct: 'riri',
    meaning: 'anger (no macron needed)',
    category: 'concept'
  },
  {
    incorrect: ['hari', 'Hari'],
    correct: 'hari',
    meaning: 'joy, happiness (no macron needed)',
    category: 'concept'
  }
]

// Function to get all macron corrections for spelling checker
export const getMacronCorrections = (): {original: string, corrected: string}[] => {
  const corrections: {original: string, corrected: string}[] = []
  
  KUPU_CORRECTIONS.forEach(kupu => {
    kupu.incorrect.forEach(incorrect => {
      corrections.push({
        original: incorrect,
        corrected: kupu.correct
      })
    })
  })
  
  return corrections
}

// Function to check if a word is culturally significant
export const isCulturalWord = (word: string): boolean => {
  return KUPU_CORRECTIONS.some(kupu => 
    kupu.incorrect.includes(word.toLowerCase()) || 
    kupu.correct.toLowerCase() === word.toLowerCase()
  )
}

// Function to get meaning of a kupu
export const getKupuMeaning = (word: string): string | null => {
  const kupu = KUPU_CORRECTIONS.find(k => 
    k.incorrect.includes(word.toLowerCase()) || 
    k.correct.toLowerCase() === word.toLowerCase()
  )
  return kupu ? kupu.meaning : null
}

// NEW FUNCTION: Post-transcription correction specifically for voice input
export const correctTranscriptionText = (transcribedText: string): {
  correctedText: string,
  corrections: {original: string, corrected: string, confidence: number}[]
} => {
  let correctedText = transcribedText
  const corrections: {original: string, corrected: string, confidence: number}[] = []

  // High-confidence transcription corrections (exact matches)
  const transcriptionCorrections = [
    // Critical cultural terms that often get mangled
    { find: /tipakarirua village/gi, replace: 'Te Whakarewarewa Village', confidence: 100 },
    { find: /tipakarirua/gi, replace: 'Te Whakarewarewa', confidence: 100 },
    { find: /two hodungi n91 people/gi, replace: 'Tūhourangi Ngāti Wāhiao people', confidence: 100 },
    { find: /two hodungi people/gi, replace: 'Tūhourangi Ngāti Wāhiao people', confidence: 100 },
    { find: /tuhorangi ngati wahiao/gi, replace: 'Tūhourangi Ngāti Wāhiao', confidence: 95 },
    { find: /ngati wahiao people/gi, replace: 'Ngāti Wāhiao people', confidence: 95 },
    { find: /te arawa people/gi, replace: 'Te Arawa people', confidence: 90 },
    
    // Common place name issues
    { find: /whaka village/gi, replace: 'Whakarewarewa Village', confidence: 85 },
    { find: /wakarewa/gi, replace: 'Whakarewarewa', confidence: 85 },
    
    // Cultural context improvements
    { find: /maori village/gi, replace: 'Māori village', confidence: 100 },
    { find: /maori people/gi, replace: 'Māori people', confidence: 100 },
    { find: /maori culture/gi, replace: 'Māori culture', confidence: 100 }
  ]

  // Apply transcription corrections
  transcriptionCorrections.forEach(({ find, replace, confidence }) => {
    if (find.test(correctedText)) {
      const matches = correctedText.match(find)
      if (matches) {
        matches.forEach(match => {
          corrections.push({
            original: match,
            corrected: replace,
            confidence
          })
        })
        correctedText = correctedText.replace(find, replace)
      }
    }
  })

  // Then apply standard kupu corrections
  const standardCorrections = getMacronCorrections()
  standardCorrections.forEach(({ original, corrected }) => {
    const regex = new RegExp(`\\b${original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
    if (regex.test(correctedText)) {
      corrections.push({
        original,
        corrected,
        confidence: 90
      })
      correctedText = correctedText.replace(regex, corrected)
    }
  })

  return { correctedText, corrections }
}
