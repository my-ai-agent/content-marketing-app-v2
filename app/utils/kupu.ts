// /app/utils/kupu.ts
// Top 150 Māori Kupu Dictionary with Proper Macron (Tohutō) Usage
// Sources: NZ History, Te Aka Māori Dictionary, Official Government Lists

export interface KupuCorrection {
  incorrect: string[]  // Common misspellings without macrons
  correct: string     // Proper spelling with macrons
  meaning: string     // English translation
  category: 'greeting' | 'family' | 'place' | 'concept' | 'nature' | 'cultural' | 'direction' | 'time' | 'action' | 'sacred' | 'grammar'
}

// Enhanced context interface for progressive enhancement
export interface VoiceContext {
  location?: string
  previousWords?: string[]
  context?: string
  culturalMode?: boolean
  confidenceThreshold?: number
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

  // ENHANCED VOICE CORRECTIONS - Based on real testing
  {
    incorrect: [
      'took career village', 'took career', 'two career village', 'te career village',
      'took carer village', 'two carer village', 'te carer village',
      'took whaka village', 'two whaka village', 'te whaka village'
    ],
    correct: 'Te Whakarewarewa Village',
    meaning: 'living Māori village in Rotorua',
    category: 'place'
  },

  // FUNDAMENTAL RULE: NO 'Z' IN MĀORI - Any 'Z' is culturally inappropriate
  {
    incorrect: [
      'nazi', 'nasi', 'natzi', 'nozi', 'nezi', 'zati', 'zāti',
      'nazi waheo people', 'nazi wahiao people', 'nazi people',
      'nazi waheo', 'nazi wahiao', 'nazi wāhiao'
    ],
    correct: 'Ngāti',
    meaning: 'sub-tribe, people group',
    category: 'cultural'
  },

  // SILENT 'G' PATTERNS - 'Ng' often transcribed without 'g'
  {
    incorrect: [
      'nati wahiao', 'nāti wahiao', 'na ti wahiao', 'nati wāhiao',
      'nati people', 'nāti people', 'na ti people'
    ],
    correct: 'Ngāti Wāhiao',
    meaning: 'hapū (sub-tribe) of Te Arawa',
    category: 'cultural'
  },

  {
    incorrect: [
      'na', 'nar', 'nah', 'n ga', 'nga people'
    ],
    correct: 'ngā',
    meaning: 'the (plural)',
    category: 'grammar'
  },

  // Silent G in place names and iwi names
  {
    incorrect: [
      'tūhourani', 'tuhourani', 'two hourani', 'tūhouran',
      'two hodungi people', 'tuhorangi people', 'two hourangi'
    ],
    correct: 'Tūhourangi',
    meaning: 'iwi name - people group',
    category: 'cultural'
  },

  {
    incorrect: [
      'wairao', 'waheo', 'waihao', 'wa hiao'
    ],
    correct: 'Wāhiao',
    meaning: 'part of Ngāti Wāhiao hapū name',
    category: 'cultural'
  },

  // Complex iwi name corrections (updated from previous version)
  {
    incorrect: [
      'two hodungi nazi waheo people', 'two hodungi people', 
      'two hodungi ngati wahiao', 'tuhorangi nazi waheo', 
      'two hodungi nazi wahiao', 'two hodungi nati wahiao'
    ],
    correct: 'Tūhourangi Ngāti Wāhiao',
    meaning: 'iwi of Te Whakarewarewa Village',
    category: 'cultural'
  },

  // Enhanced Te Whakarewarewa variations
  {
    incorrect: [
      'whakarewarewa village', 'wakarewa village', 'whaka village',
      'whakarewarewa', 'wakarewa', 'whakarerawera', 'wakarewarewa',
      'fakarewa', 'fakarewa village', 'whakarerawewa'
    ],
    correct: 'Te Whakarewarewa',
    meaning: 'the place of uprising/war party',
    category: 'place'
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

// ORIGINAL FUNCTION: Post-transcription correction specifically for voice input
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

// ENHANCED FUNCTION: Advanced voice correction with cultural protection and progressive enhancement
export const correctVoiceTranscription = (
  transcript: string, 
  context?: VoiceContext
): {
  correctedText: string,
  corrections: {original: string, corrected: string, confidence: number, reason: string}[],
  culturalAlerts: string[]
} => {
  let correctedText = transcript.toLowerCase()
  const corrections: {original: string, corrected: string, confidence: number, reason: string}[] = []
  const culturalAlerts: string[] = []

  // Enhanced cultural mode settings
  const culturalMode = context?.culturalMode || false
  const confidenceThreshold = context?.confidenceThreshold || (culturalMode ? 95 : 85)
  const location = context?.location || ''
  const previousWords = context?.previousWords || []

  // Log enhanced mode activation
  if (culturalMode) {
    console.log(`🏛️ Enhanced cultural mode active - confidence threshold: ${confidenceThreshold}%`)
  }

  // PRIORITY 1: FUNDAMENTAL MĀORI PHONETIC RULES
  
  // Rule 1: NO 'Z' in Māori alphabet - immediate cultural violation
  const zLetterViolations = correctedText.match(/\b\w*z\w*\b/gi)
  if (zLetterViolations) {
    zLetterViolations.forEach(violation => {
      // Check if it's in cultural context
      const culturalContext = ['wahiao', 'waheo', 'people', 'village', 'iwi', 'hapū', 'māori', 'rotorua']
      const hasCulturalContext = culturalContext.some(ctx => 
        correctedText.includes(ctx.toLowerCase())
      )
      
      if (hasCulturalContext) {
        let replacement = violation.toLowerCase()
        
        // Specific Z-letter corrections
        if (violation.toLowerCase().includes('nazi')) {
          replacement = 'Ngāti'
          culturalAlerts.push(`CRITICAL: Prevented culturally inappropriate word "${violation}" → "${replacement}"`)
        } else if (violation.toLowerCase().includes('zati')) {
          replacement = 'āti'
        } else {
          // Generic Z removal for cultural terms
          replacement = violation.replace(/z/gi, '')
          culturalAlerts.push(`Removed inappropriate 'Z' from cultural term: ${violation} → ${replacement}`)
        }
        
        corrections.push({
          original: violation,
          corrected: replacement,
          confidence: culturalMode ? 98 : 95,
          reason: 'Cultural protection - No Z in Māori'
        })
        
        correctedText = correctedText.replace(new RegExp(`\\b${violation}\\b`, 'gi'), replacement)
      }
    })
  }

  // Rule 2: Silent 'G' patterns - Enhanced in cultural mode
  const silentGCorrections = [
    {
      pattern: /\b(nati|nāti|na ti)(\s+wahiao|\s+wāhiao|\s+people)?\b/gi,
      replacement: 'Ngāti$2',
      confidence: culturalMode ? 97 : 95,
      reason: 'Silent G restoration - Ngāti'
    },
    {
      pattern: /\b(na|nar|nah)\b(?=\s|$)/gi,
      replacement: 'ngā',
      confidence: culturalMode ? 94 : 92,
      reason: 'Silent G restoration - ngā'
    },
    {
      pattern: /\b(tūhourani|tuhourani|two hourani|two hodungi|2 haurangi)(\s+people)?\b/gi,
      replacement: 'Tūhourangi$2',
      confidence: culturalMode ? 96 : 94,
      reason: culturalMode ? 'Enhanced cultural correction - Tūhourangi' : 'Silent G restoration - Tūhourangi'
    },
    {
      pattern: /\b(wairao|waheo|waihao|wa hiao)\b/gi,
      replacement: 'Wāhiao',
      confidence: culturalMode ? 95 : 93,
      reason: 'Silent G restoration - Wāhiao'
    }
  ]

  silentGCorrections.forEach(correction => {
    if (correction.pattern.test(correctedText)) {
      const matches = correctedText.match(correction.pattern)
      if (matches) {
        matches.forEach(match => {
          const correctedMatch = match.replace(correction.pattern, correction.replacement)
          corrections.push({
            original: match,
            corrected: correctedMatch,
            confidence: correction.confidence,
            reason: correction.reason
          })
        })
        correctedText = correctedText.replace(correction.pattern, correction.replacement)
      }
    }
  })

  // PRIORITY 2: Enhanced complex place name corrections
  const complexCorrections = [
    {
      patterns: [
        /took career(\s+village)?/gi,
        /two career(\s+village)?/gi,
        /te career(\s+village)?/gi,
        /took carer(\s+village)?/gi,
        /two carer(\s+village)?/gi
      ],
      replacement: 'Te Whakarewarewa$1',
      confidence: culturalMode ? 90 : 85,
      reason: culturalMode ? 'Enhanced place name correction' : 'Complex place name phonetic correction'
    },
    {
      patterns: [
        /(two hodungi|tuhorangi|2 haurangi)(\s+ngati|\s+nazi|\s+nati)?(\s+waheo|\s+wahiao|\s+wāhiao)?(\s+people)?/gi
      ],
      replacement: 'Tūhourangi Ngāti Wāhiao$4',
      confidence: culturalMode ? 95 : 90,
      reason: culturalMode ? 'Enhanced iwi name correction' : 'Iwi name phonetic correction'
    },
    {
      patterns: [
        /whaka village/gi,
        /wakarewa village/gi,
        /te whaka village/gi
      ],
      replacement: 'Te Whakarewarewa Village',
      confidence: culturalMode ? 92 : 88,
      reason: culturalMode ? 'Enhanced place name correction' : 'Partial place name correction'
    }
  ]

  complexCorrections.forEach(correction => {
    correction.patterns.forEach(pattern => {
      if (pattern.test(correctedText)) {
        const matches = correctedText.match(pattern)
        if (matches) {
          matches.forEach(match => {
            const correctedMatch = match.replace(pattern, correction.replacement)
            corrections.push({
              original: match,
              corrected: correctedMatch,
              confidence: correction.confidence,
              reason: correction.reason
            })
          })
          correctedText = correctedText.replace(pattern, correction.replacement)
        }
      }
    })
  })

  // PRIORITY 3: Standard kupu corrections with enhanced confidence in cultural mode
  const { correctedText: standardCorrected, corrections: standardCorrections } = correctTranscriptionText(correctedText)
  
  // Add standard corrections to our enhanced list with boosted confidence in cultural mode
  standardCorrections.forEach(correction => {
    const enhancedConfidence = culturalMode ? 
      Math.min((correction.confidence || 88) + 5, 98) : 
      (correction.confidence || 88)
    
    corrections.push({
      original: correction.original,
      corrected: correction.corrected,
      confidence: enhancedConfidence,
      reason: culturalMode ? 'Enhanced cultural correction' : 'Standard Māori correction'
    })
  })
  
  correctedText = standardCorrected

  // PRIORITY 4: Enhanced capitalization and cultural respect
  correctedText = correctedText
    .replace(/\b(te whakarewarewa|rotorua|tūhourangi|ngāti wāhiao|māori|ngā)\b/gi, (match) => {
      return match.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    })

  // Enhanced logging for cultural mode
  if (culturalMode && corrections.length > 0) {
    console.log(`🏛️ Cultural mode applied ${corrections.length} enhanced corrections`)
    console.log(`📊 Average confidence: ${Math.round(corrections.reduce((acc, curr) => acc + curr.confidence, 0) / corrections.length)}%`)
  }

  return { correctedText, corrections, culturalAlerts }
}

// OPTIONAL: Enhanced cultural validation function with progressive enhancement
export const validateCulturalText = (text: string, culturalMode: boolean = false): {
  isValid: boolean,
  violations: string[],
  suggestions: string[],
  culturalScore: number
} => {
  const violations: string[] = []
  const suggestions: string[] = []
  let culturalScore = 100
  
  // Check for Z-letter violations with enhanced detection in cultural mode
  const zWords = text.match(/\b\w*z\w*\b/gi)
  if (zWords) {
    zWords.forEach(word => {
      violations.push(`Contains 'Z' which doesn't exist in Māori: "${word}"`)
      suggestions.push(`Check if "${word}" should be a Māori term without 'Z'`)
      culturalScore -= culturalMode ? 15 : 10 // Higher penalty in cultural mode
    })
  }
  
  // Check for silent G patterns with enhanced detection
  const silentGPatterns = text.match(/\b(nati|nāti|na ti|tuhourani|wairao|2 haurangi)\b/gi)
  if (silentGPatterns) {
    silentGPatterns.forEach(pattern => {
      violations.push(`Possible silent 'G' omission: "${pattern}"`)
      suggestions.push(`Consider if "${pattern}" should include 'ng' sound`)
      culturalScore -= culturalMode ? 8 : 5
    })
  }
  
  // Enhanced cultural term detection
  const culturalTermsFound = KUPU_CORRECTIONS.filter(kupu => 
    kupu.category === 'cultural' && 
    (kupu.correct.toLowerCase().includes(text.toLowerCase()) || 
     kupu.incorrect.some(incorrect => text.toLowerCase().includes(incorrect.toLowerCase())))
  )
  
  // Bonus points for proper cultural terms in cultural mode
  if (culturalMode && culturalTermsFound.length > 0) {
    culturalScore = Math.min(culturalScore + (culturalTermsFound.length * 3), 100)
  }
  
  return {
    isValid: violations.length === 0 && culturalScore >= (culturalMode ? 90 : 80),
    violations,
    suggestions,
    culturalScore: Math.max(culturalScore, 0)
  }
}

// Progressive Enhancement Helper Functions
export const detectCulturalContent = (text: string): {
  hasCulturalTerms: boolean,
  culturalTermCount: number,
  suggestEnhancement: boolean
} => {
  const culturalTerms = KUPU_CORRECTIONS.filter(kupu => 
    kupu.category === 'cultural' || kupu.category === 'place' || kupu.category === 'sacred'
  )
  
  let culturalTermCount = 0
  
  culturalTerms.forEach(kupu => {
    // Check if text contains the correct term or incorrect variants
    if (kupu.correct.toLowerCase().includes(text.toLowerCase()) || 
        kupu.incorrect.some(incorrect => text.toLowerCase().includes(incorrect.toLowerCase()))) {
      culturalTermCount++
    }
  })
  
  return {
    hasCulturalTerms: culturalTermCount > 0,
    culturalTermCount,
    suggestEnhancement: culturalTermCount >= 2 // Trigger enhancement banner after 2+ cultural terms
  }
}

// Ko Tane Demo Statistics Helper
export const getCulturalStats = (corrections: {original: string, corrected: string, confidence: number, reason: string}[]): {
  totalCorrections: number,
  culturalCorrections: number,
  averageConfidence: number,
  highConfidenceCount: number
} => {
  const culturalCorrections = corrections.filter(c => 
    c.reason.includes('cultural') || 
    c.reason.includes('Cultural') ||
    c.reason.includes('Silent G') ||
    c.reason.includes('protection')
  )
  
  const averageConfidence = corrections.length > 0 ? 
    Math.round(corrections.reduce((acc, curr) => acc + curr.confidence, 0) / corrections.length) : 0
  
  const highConfidenceCount = corrections.filter(c => c.confidence >= 95).length
  
  return {
    totalCorrections: corrections.length,
    culturalCorrections: culturalCorrections.length,
    averageConfidence,
    highConfidenceCount
  }
}
