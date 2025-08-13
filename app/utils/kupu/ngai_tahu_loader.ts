// /app/utils/kupu/ngai_tahu_loader.ts
// Smart Loading Priority System for Ngāi Tahu Kupu
// Implements iwi rohe-based cultural intelligence with performance optimization

import { NGAI_TAHU_CORE_CULTURAL, NgaiTahuCoreKupu } from './ngai_tahu_core_cultural'
import { NGAI_TAHU_PLACE_NAMES, NgaiTahuPlaceKupu } from './ngai_tahu_place_names'
import { NGAI_TAHU_TOURISM_BUSINESSES, NgaiTahuBusinessKupu } from './ngai_tahu_tourism_businesses'

export interface NgaiTahuLoadingConfig {
  essential: string[]  // Always loaded (250 terms)
  enhanced: string[]   // Context-based loading (180 terms) 
  cultural: string[]   // Advanced users (100 terms)
}

export interface CulturalContext {
  location?: 'Canterbury' | 'West_Coast' | 'Otago' | 'Southland'
  userLevel?: 'tourist' | 'business' | 'cultural_expert'
  demoMode?: 'ko_tane' | 'general' | 'advanced'
  confidenceThreshold?: number
}

export interface NgaiTahuValidationResult {
  correctedText: string
  corrections: Array<{
    original: string
    corrected: string
    confidence: number
    source: 'core_cultural' | 'place_names' | 'tourism_businesses'
    culturalSignificance: 'highest' | 'high' | 'medium'
  }>
  culturalScore: number
  koTaneRelevance: boolean
  demoOpportunities: string[]
  iwi_rohe_recognition: boolean
}

// Smart loading configuration
export const NGAI_TAHU_LOADING_CONFIG: NgaiTahuLoadingConfig = {
  // Priority Tier 1: Always loaded (370 terms)
  essential: [
    'ngai_tahu_core_cultural',    // 150 terms - iwi identity, rūnanga, cultural concepts
    'ngai_tahu_place_names',      // 100 terms - major settlements, waterways, landmarks  
    'ngai_tahu_tourism_businesses' // 120 terms - Tier A & B operators
  ],
  
  // Priority Tier 2: Context-based loading (180 terms)
  enhanced: [
    'ngai_tahu_descriptive',      // 80 terms - numbers, colours, directions
    'ngai_tahu_phonics_patterns'  // 100 terms - pronunciation rules, corrections
  ],
  
  // Priority Tier 3: Advanced users (100 terms)
  cultural: [
    'ngai_tahu_cultural_context'  // 100 terms - ceremonial, traditional knowledge
  ]
}

// Revolutionary iwi rohe-based cultural intelligence
export class NgaiTahuCulturalAI {
  private loadedModules: Set<string> = new Set()
  private culturalDatabase: Map<string, any> = new Map()
  private context: CulturalContext

  constructor(context: CulturalContext = {}) {
    this.context = context
    this.loadEssentialModules()
  }

  // Load essential modules for all users
  private loadEssentialModules(): void {
    // Core Cultural Intelligence
    this.culturalDatabase.set('core_cultural', NGAI_TAHU_CORE_CULTURAL)
    this.culturalDatabase.set('place_names', NGAI_TAHU_PLACE_NAMES)
    this.culturalDatabase.set('tourism_businesses', NGAI_TAHU_TOURISM_BUSINESSES)
    
    NGAI_TAHU_LOADING_CONFIG.essential.forEach(module => {
      this.loadedModules.add(module)
    })

    console.log('🏛️ Ngāi Tahu Cultural AI initialized - Essential modules loaded')
    console.log(`📊 Cultural database: ${this.getTotalTermCount()} terms loaded`)
  }

  // Get total loaded term count
  private getTotalTermCount(): number {
    let count = 0
    this.culturalDatabase.forEach(module => count += module.length)
    return count
  }

  // Enhanced cultural validation with iwi rohe recognition
  public validateCulturalContent(text: string): NgaiTahuValidationResult {
    let correctedText = text
    const corrections: NgaiTahuValidationResult['corrections'] = []
    let culturalScore = 100
    let koTaneRelevance = false
    const demoOpportunities: string[] = []
    let iwi_rohe_recognition = false

    // PRIORITY 1: Core Cultural Validation
    const coreModule = this.culturalDatabase.get('core_cultural') as NgaiTahuCoreKupu[]
    if (coreModule) {
      coreModule.forEach(kupu => {
        kupu.incorrect.forEach(incorrect => {
          const regex = new RegExp(`\\b${incorrect.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
          if (regex.test(correctedText)) {
            corrections.push({
              original: incorrect,
              corrected: kupu.correct,
              confidence: kupu.confidence,
              source: 'core_cultural',
              culturalSignificance: kupu.cultural_significance
            })
            
            correctedText = correctedText.replace(regex, kupu.correct)
            
            // Iwi rohe recognition bonus
            if (kupu.category === 'iwi_identity' || kupu.category === 'runanga') {
              iwi_rohe_recognition = true
              culturalScore += 5
              console.log(`🏛️ Iwi rohe recognition: ${kupu.correct}`)
            }
          }
        })
      })
    }

    // PRIORITY 2: Place Names with Regional Context
    const placeModule = this.culturalDatabase.get('place_names') as NgaiTahuPlaceKupu[]
    if (placeModule) {
      placeModule.forEach(place => {
        place.incorrect.forEach(incorrect => {
          const regex = new RegExp(`\\b${incorrect.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
          if (regex.test(correctedText)) {
            corrections.push({
              original: incorrect,
              corrected: place.correct,
              confidence: place.confidence,
              source: 'place_names',
              culturalSignificance: 'high'
            })
            
            correctedText = correctedText.replace(regex, place.correct)
            
            // Ko Tāne demo detection
            if (place.demo_relevance === 'ko_tane_high') {
              koTaneRelevance = true
              demoOpportunities.push(`Perfect Ko Tāne demo location: ${place.correct}`)
            }
            
            // Regional context enhancement
            if (this.context.location && place.region === this.context.location) {
              culturalScore += 3
              console.log(`🗺️ Regional context match: ${place.correct} in ${place.region}`)
            }
          }
        })
      })
    }

    // PRIORITY 3: Tourism Business Intelligence
    const businessModule = this.culturalDatabase.get('tourism_businesses') as NgaiTahuBusinessKupu[]
    if (businessModule) {
      businessModule.forEach(business => {
        business.incorrect.forEach(incorrect => {
          const regex = new RegExp(`\\b${incorrect.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
          if (regex.test(correctedText)) {
            corrections.push({
              original: incorrect,
              corrected: business.correct,
              confidence: business.confidence,
              source: 'tourism_businesses',
              culturalSignificance: 'high'
            })
            
            correctedText = correctedText.replace(regex, business.correct)
            
            // Ko Tāne perfect match detection
            if (business.demo_value === 'ko_tane_perfect') {
              koTaneRelevance = true
              demoOpportunities.push(`🎯 PERFECT Ko Tāne demo business: ${business.correct}`)
              culturalScore += 10
            }
          }
        })
      })
    }

    // Calculate final cultural score
    const penaltyPerCorrection = 5
    culturalScore = Math.max(culturalScore - (corrections.length * penaltyPerCorrection), 0)

    // Iwi rohe recognition enhances everything
    if (iwi_rohe_recognition) {
      culturalScore = Math.min(culturalScore + 15, 100)
      console.log('🏛️ Iwi rohe intelligence active - cultural score enhanced')
    }

    return {
      correctedText,
      corrections,
      culturalScore,
      koTaneRelevance,
      demoOpportunities,
      iwi_rohe_recognition
    }
  }

  // Ko Tāne demo optimization
  public optimizeForKoTaneDemo(text: string): {
    demoScore: number,
    perfectMatches: string[],
    suggestedEnhancements: string[],
    culturalAuthority: boolean
  } {
    const validation = this.validateCulturalContent(text)
    const perfectMatches: string[] = []
    const suggestedEnhancements: string[] = []
    let demoScore = 0
    let culturalAuthority = false

    // Check for Ko Tāne specific content
    if (text.toLowerCase().includes('ko tāne') || text.toLowerCase().includes('kotane')) {
      perfectMatches.push('Ko Tāne - Perfect demo business')
      demoScore += 25
    }

    // Check for Ōtākaro/Avon River context
    if (text.toLowerCase().includes('avon') || text.toLowerCase().includes('ōtākaro')) {
      perfectMatches.push('Ōtākaro (Avon River) - Ko Tāne location context')
      demoScore += 20
    }

    // Check for Ōtautahi/Christchurch context
    if (text.toLowerCase().includes('christchurch') || text.toLowerCase().includes('ōtautahi')) {
      perfectMatches.push('Ōtautahi (Christchurch) - Regional context')
      demoScore += 15
    }

    // Cultural authority indicators
    if (validation.iwi_rohe_recognition) {
      culturalAuthority = true
      demoScore += 20
      perfectMatches.push('Iwi rohe recognition - Cultural authority demonstrated')
    }

    // Enhancement suggestions
    if (demoScore < 50) {
      suggestedEnhancements.push('Add Ko Tāne business reference for perfect demo')
      suggestedEnhancements.push('Include Ōtautahi/Christchurch regional context')
      suggestedEnhancements.push('Mention Ngāi Tahu mana whenua for cultural authority')
    }

    if (!validation.koTaneRelevance) {
      suggestedEnhancements.push('Consider referencing other high-value Ngāi Tahu tourism businesses')
    }

    return {
      demoScore,
      perfectMatches,
      suggestedEnhancements,
      culturalAuthority
    }
  }

  // Regional context adaptation
  public adaptToRegion(region: 'Canterbury' | 'West_Coast' | 'Otago' | 'Southland'): void {
    this.context.location = region
    console.log(`🗺️ Adapted to ${region} region - enhanced local cultural intelligence`)
  }

  // Demo mode activation
  public setDemoMode(mode: 'ko_tane' | 'general' | 'advanced'): void {
    this.context.demoMode = mode
    
    if (mode === 'ko_tane') {
      console.log('🎯 Ko Tāne demo mode activated - optimizing for cultural tourism demonstration')
      this.context.confidenceThreshold = 97
    } else if (mode === 'advanced') {
      console.log('🏛️ Advanced cultural mode activated - maximum cultural intelligence')
      this.context.confidenceThreshold = 95
    } else {
      console.log('📱 General mode activated - balanced cultural intelligence')
      this.context.confidenceThreshold = 90
    }
  }

  // Get cultural statistics for Ko Tāne presentation
  public getCulturalStats(): {
    totalTerms: number,
    coreTerms: number,
    placeNames: number,
    businessNames: number,
    culturalCoverage: string,
    competitiveAdvantage: string
  } {
    const coreTerms = this.culturalDatabase.get('core_cultural')?.length || 0
    const placeNames = this.culturalDatabase.get('place_names')?.length || 0
    const businessNames = this.culturalDatabase.get('tourism_businesses')?.length || 0
    const totalTerms = coreTerms + placeNames + businessNames

    return {
      totalTerms,
      coreTerms,
      placeNames,
      businessNames,
      culturalCoverage: `${totalTerms}+ authentic Ngāi Tahu terms vs competitors' generic 50`,
      competitiveAdvantage: 'World\'s first iwi rohe-based cultural AI - impossible to replicate without authentic partnerships'
    }
  }

  // Cultural protection validation
  public validateCulturalSafety(text: string): {
    isSafe: boolean,
    violations: string[],
    protectionScore: number
  } {
    const violations: string[] = []
    let protectionScore = 100

    // Check for fundamental violations
    const zViolations = text.match(/\b\w*z\w*\b/gi)
    if (zViolations) {
      zViolations.forEach(violation => {
        if (this.isCulturalContext(text)) {
          violations.push(`Cultural protection: '${violation}' contains 'Z' which doesn't exist in Māori`)
          protectionScore -= 15
        }
      })
    }

    // Check for silent G omissions
    const silentGPatterns = text.match(/\b(nati|nāti|na ti)\b/gi)
    if (silentGPatterns) {
      silentGPatterns.forEach(pattern => {
        violations.push(`Possible cultural error: '${pattern}' may be missing 'ng' sound`)
        protectionScore -= 8
      })
    }

    // Check for cultural appropriation risks
    const appropriationRisks = [
      'fake maori', 'pseudo maori', 'maori-style', 'maori-inspired'
    ]
    appropriationRisks.forEach(risk => {
      if (text.toLowerCase().includes(risk)) {
        violations.push(`Cultural appropriation risk: '${risk}' detected`)
        protectionScore -= 20
      }
    })

    return {
      isSafe: violations.length === 0 && protectionScore >= 80,
      violations,
      protectionScore: Math.max(protectionScore, 0)
    }
  }

  // Helper: Check if text contains cultural context
  private isCulturalContext(text: string): boolean {
    const culturalIndicators = [
      'māori', 'maori', 'iwi', 'hapū', 'rūnanga', 'ngāi', 'ngai', 
      'tahu', 'whenua', 'rotorua', 'christchurch', 'tourism'
    ]
    
    return culturalIndicators.some(indicator => 
      text.toLowerCase().includes(indicator.toLowerCase())
    )
  }
}

// Factory function for easy initialization
export const createNgaiTahuAI = (context?: CulturalContext): NgaiTahuCulturalAI => {
  return new NgaiTahuCulturalAI(context)
}

// Ko Tāne demo setup helper
export const setupKoTaneDemo = (): NgaiTahuCulturalAI => {
  const ai = new NgaiTahuCulturalAI({
    location: 'Canterbury',
    userLevel: 'business',
    demoMode: 'ko_tane',
    confidenceThreshold: 97
  })
  
  console.log('🎯 Ko Tāne demo AI ready - cultural authority activated')
  return ai
}

// Export configuration for integration
export const NGAI_TAHU_CONFIG = {
  TOTAL_TERMS: 370, // Essential modules only
  ENHANCED_TERMS: 550, // With enhanced modules  
  FULL_TERMS: 650, // All modules loaded
  CONFIDENCE_TARGETS: {
    core_cultural: 97,
    place_names: 95,
    tourism_businesses: 93,
    enhanced_features: 90
  },
  DEMO_PRIORITIES: {
    ko_tane_perfect: 100,
    demo_high: 85,
    demo_medium: 70,
    demo_low: 50
  }
}
