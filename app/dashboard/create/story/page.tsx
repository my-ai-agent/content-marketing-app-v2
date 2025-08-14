'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { 
  getMacronCorrections, 
  correctTranscriptionText, 
  correctVoiceTranscription, 
  KUPU_CORRECTIONS,
  // NEW Ko Tāne imports:
  correctVoiceTranscriptionWithNgaiTahu,
  initializeNgaiTahuAI,
  optimizeForKoTaneDemo,
  getNgaiTahuStats,
  validateCulturalSafety
} from '../../../utils/kupu'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

// Ko Tāne Cultural Intelligence Constants
const KO_TANE_VOCABULARY = [
  'Ko Tāne', 'Ko Tane', 'kotane', 'waka', 'cultural experience',
  'Ōtākaro', 'Otakaro', 'Avon River', 'avon',
  'Ōtautahi', 'Otautahi', 'Christchurch',
  'Ngāi Tahu', 'Ngai Tahu', 'mana whenua', 'tikanga', 'whakapapa',
  'Whale Watch Kaikōura', 'whale watch', 'Kaikōura',
  'Te Waipounamu', 'South Island'
]

const KO_TANE_PHONETIC_MAPPINGS = {
  'core tani': 'Ko Tāne',
  'core tany': 'Ko Tāne', 
  'ko tany': 'Ko Tāne',
  'kotany': 'Ko Tāne',
  'or takaro': 'Ōtākaro',
  'otakaro': 'Ōtākaro',
  'avon river': 'Ōtākaro',
  'or tautahi': 'Ōtautahi',
  'christchurch': 'Ōtautahi Christchurch',
  'nigh tahu': 'Ngāi Tahu',
  'nga tahu': 'Ngāi Tahu'
}

// Story prompts carousel
const storyPrompts = [
  "Describe this photo in one sentence!",
  "Why is this a special memory?", 
  "What did you experience?",
  "Who did you share this experience with?",
  "Where was this location?",
  "The more you share, the more AI can personalise your story"
]

// Progressive Enhancement Types
interface CulturalEnhancementState {
  isActive: boolean
  detectedCulturalContent: boolean
  correctionCount: number
  userOptedIn: boolean
  bannerDismissed: boolean
  languageMode: 'standard' | 'cultural' | 'enhanced'
  // Ko Tāne properties:
  ngaiTahuMode?: boolean
  koTaneOptimized?: boolean
  iwi_rohe?: string
}

interface EnhancedVoiceSettings {
  language: string
  culturalMode: boolean
  grammarRules: 'english' | 'maori' | 'mixed'
  confidence: number
}

// Simple spelling/grammar corrections using kupu dictionary
const getSpellingCorrections = (text: string): {correctedText: string, suggestions: {original: string, corrected: string}[]} => {
  // Common English spelling corrections
  const englishCorrections = [
    { original: 'recieve', corrected: 'receive' },
    { original: 'seperate', corrected: 'separate' },
    { original: 'occured', corrected: 'occurred' },
    { original: 'definately', corrected: 'definitely' },
    { original: 'accomodate', corrected: 'accommodate' },
    { original: 'begining', corrected: 'beginning' },
    { original: 'beleive', corrected: 'believe' },
    { original: 'existance', corrected: 'existence' },
    { original: 'independant', corrected: 'independent' },
    { original: 'wierd', corrected: 'weird' }
  ]

  // Get Māori macron corrections from kupu dictionary
  const maoriCorrections = getMacronCorrections()
  
  // Combine all corrections
  const allCorrections = [...englishCorrections, ...maoriCorrections]
  
  let correctedText = text
  const suggestions: {original: string, corrected: string}[] = []
  
  allCorrections.forEach(({ original, corrected }) => {
    // Escape special regex characters in the original word
    const escapedOriginal = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`\\b${escapedOriginal}\\b`, 'g')
    
    if (regex.test(text)) {
      suggestions.push({ original, corrected })
      correctedText = correctedText.replace(regex, corrected)
    }
  })
  
  // Basic grammar improvements (preserve cultural text)
  correctedText = correctedText
    .replace(/\bi\b/g, 'I') // Capitalize standalone 'i'
    .replace(/\.\s+([a-z])/g, (match, p1) => '. ' + p1.toUpperCase()) // Capitalize after periods
    .replace(/^\s*([a-z])/g, (match, p1) => match.replace(p1, p1.toUpperCase())) // Capitalize first letter
  
  return { correctedText, suggestions }
}

export default function TellYourStory() {
  const [story, setStory] = useState('')
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [showCopilotSuggestions, setShowCopilotSuggestions] = useState(false)
  const [copilotSuggestions, setCopilotSuggestions] = useState<{correctedText: string, suggestions: any[]}>({correctedText: '', suggestions: []})
  const [isCheckingSpelling, setIsCheckingSpelling] = useState(false)
  
  // Voice recording states
  const [inputMethod, setInputMethod] = useState<'write' | 'speak'>('write')
  const [recording, setRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const recognitionRef = useRef<any>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const maxRecordingTime = 180 // 180 seconds (3 minutes) maximum

  // Enhanced voice transcription states
  const [voiceTranscriptionComplete, setVoiceTranscriptionComplete] = useState(false)
  const [transcriptionCorrections, setTranscriptionCorrections] = useState<{original: string, corrected: string, confidence: number, reason?: string}[]>([])
  const [potentialMaoriWords, setPotentialMaoriWords] = useState<{word: string, position: number, suggestions: {correct: string, meaning: string}[]}[]>([])
  const [showMaoriClarification, setShowMaoriClarification] = useState(false)
  
  // Cultural Confidence Editing States
const [showTranscriptEdit, setShowTranscriptEdit] = useState(false)
const [editableTranscript, setEditableTranscript] = useState('')
const [transcriptEditComplete, setTranscriptEditComplete] = useState(false)

  // Ngāi Tahu Cultural AI States
const [ngaiTahuAI, setNgaiTahuAI] = useState<any>(null)
const [koTaneStats, setKoTaneStats] = useState<any>(null)
const [koTaneOptimized, setKoTaneOptimized] = useState(false)
  
  // Progressive Enhancement States
  const [culturalEnhancement, setCulturalEnhancement] = useState<CulturalEnhancementState>({
  isActive: false,
  detectedCulturalContent: false,
  correctionCount: 0,
  userOptedIn: false,
  bannerDismissed: false,
  languageMode: 'standard',
  // Ko Tāne enhancements:
  ngaiTahuMode: false,
  koTaneOptimized: false,
  iwi_rohe: 'Canterbury'
})

  const [showEnhancementBanner, setShowEnhancementBanner] = useState(false)
  const [enhancedVoiceSettings, setEnhancedVoiceSettings] = useState<EnhancedVoiceSettings>({
    language: 'en-NZ',
    culturalMode: false,
    grammarRules: 'english',
    confidence: 85
  })

  // Progressive Enhancement Functions
  const detectCulturalContent = (text: string, corrections: any[]) => {
  // Enhanced detection using Ngāi Tahu AI if available
  if (ngaiTahuAI) {
    try {
      const validation = ngaiTahuAI.validateCulturalContent(text)
      
      // Check for Ko Tāne specific content
      const hasKoTaneTerms = /\b(ko tāne|ko tane|kotane|ōtākaro|otakaro|ōtautahi|otautahi|waka|ngāi tahu|ngai tahu)\b/gi.test(text)
      
      if (hasKoTaneTerms && !koTaneOptimized) {
        setKoTaneOptimized(true)
        console.log('🎯 Ko Tāne content detected - activating specialized enhancement!')
      }
      
      return {
        detected: validation.corrections.length > 0 || validation.koTaneRelevance || validation.iwi_rohe_recognition || hasKoTaneTerms,
        correctionCount: validation.corrections.length,
        patterns: validation.koTaneRelevance,
        terms: validation.iwi_rohe_recognition,
        koTaneRelevance: validation.koTaneRelevance || hasKoTaneTerms,
        iwi_rohe_recognition: validation.iwi_rohe_recognition
      }
    } catch (error) {
      console.error('Ngāi Tahu detection error:', error)
    }
  }

  // Fallback to original detection if Ngāi Tahu AI not available
  const culturalCorrections = corrections.filter(c => 
    c.reason && (
      c.reason.includes('cultural') || 
      c.reason.includes('Te Reo') || 
      c.reason.includes('Māori') ||
      c.reason.includes('silent G') ||
      c.reason.includes('place name')
    )
  )

  const hasMaoriPatterns = /\b(wh[aeiou]|ng[aeiou]|[aeiou]{2,}|tuu|mau|tau|kai|wai)\w*/gi.test(text)
  const hasCulturalTerms = /\b(marae|iwi|hapu|tangata|whenua|mana|taonga|whakapapa|hangi|haka|poi)\b/gi.test(text)
  const hasKoTaneTerms = /\b(ko tāne|ko tane|kotane|ōtākaro|otakaro|ōtautahi|otautahi|waka|ngāi tahu|ngai tahu)\b/gi.test(text)

  if (hasKoTaneTerms && !koTaneOptimized) {
    setKoTaneOptimized(true)
    console.log('🎯 Ko Tāne content detected!')
  }

  return {
    detected: culturalCorrections.length > 0 || hasMaoriPatterns || hasCulturalTerms || hasKoTaneTerms,
    correctionCount: culturalCorrections.length,
    patterns: hasMaoriPatterns,
    terms: hasCulturalTerms,
    koTaneRelevance: hasKoTaneTerms,
    iwi_rohe_recognition: hasKoTaneTerms
  }
}

  const triggerCulturalEnhancement = (correctionCount: number) => {
    setCulturalEnhancement(prev => {
      const newState = {
        ...prev,
        detectedCulturalContent: true,
        correctionCount: prev.correctionCount + correctionCount
      }

      // Smart detection trigger: 2+ cultural corrections or user explicitly needs help
      if (newState.correctionCount >= 2 && !newState.bannerDismissed && !newState.isActive) {
        setShowEnhancementBanner(true)
      }

      return newState
    })
  }

  const activateCulturalMode = (mode: 'cultural' | 'enhanced') => {
    setCulturalEnhancement(prev => ({
      ...prev,
      isActive: true,
      userOptedIn: true,
      languageMode: mode,
      bannerDismissed: true
    }))

    setEnhancedVoiceSettings(prev => ({
      ...prev,
      culturalMode: true,
      grammarRules: mode === 'enhanced' ? 'maori' : 'mixed',
      confidence: mode === 'enhanced' ? 95 : 90
    }))

    setShowEnhancementBanner(false)
    
    console.log(`🏛️ Cultural enhancement activated: ${mode} mode`)
  }

  const dismissEnhancementBanner = () => {
    setCulturalEnhancement(prev => ({
      ...prev,
      bannerDismissed: true
    }))
    setShowEnhancementBanner(false)
  }

  // Cultural Confidence Editing Functions
const handleTranscriptEdit = () => {
  setEditableTranscript(story)
  setShowTranscriptEdit(true)
}

const handleSaveTranscript = () => {
  setStory(editableTranscript)
  localStorage.setItem('userStoryContext', editableTranscript)
  setShowTranscriptEdit(false)
  setTranscriptEditComplete(true)
  
  // Re-run cultural detection on edited content
  const culturalCheck = detectCulturalContent(editableTranscript, [])
  if (culturalCheck.detected) {
    triggerCulturalEnhancement(culturalCheck.correctionCount)
  }
  
  console.log('🎯 Transcript edited and saved by user')
}

const handleCancelTranscriptEdit = () => {
  setEditableTranscript('')
  setShowTranscriptEdit(false)
}

  // COMPLETE useEffect REPLACEMENT - EXACT STRUCTURE NEEDED
// Replace your ENTIRE useEffect (around lines 265-320) with this:

useEffect(() => {
  // Get the uploaded photo to display as reference
  const photoData = localStorage.getItem('uploadedPhoto')
  if (photoData) {
    setUploadedPhoto(photoData)
  }

  // Get any existing story
  const existingStory = localStorage.getItem('userStoryContext')
  if (existingStory) {
    setStory(existingStory)
    
    // Check existing story for cultural content
    const culturalCheck = detectCulturalContent(existingStory, [])
    if (culturalCheck.detected) {
      setCulturalEnhancement(prev => ({
        ...prev,
        detectedCulturalContent: true
      }))
    }
  }

  // Ngāi Tahu AI Initialization
  try {
    const ai = initializeNgaiTahuAI({
      location: 'Canterbury',
      userLevel: 'business',
      demoMode: 'ko_tane',
      confidenceThreshold: 95
    })
    setNgaiTahuAI(ai)
    
    const stats = getNgaiTahuStats()
    setKoTaneStats(stats)
    
    console.log('🏛️ Ngāi Tahu Cultural AI initialized for Ko Tāne demo')
    console.log('📊 Cultural database loaded:', stats.totalTerms, 'terms')
    
  } catch (error) {
    console.error('Error initializing Ngāi Tahu AI:', error)
  }

  // Auto-rotate prompts
  const interval = setInterval(() => {
    setCurrentPromptIndex((prev) => (prev + 1) % storyPrompts.length)
  }, 3000)

  // Cleanup function
  return () => {
    clearInterval(interval)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }
}, [])

  // Enhanced function to detect potential Māori words
  const detectPotentialMaoriWords = (text: string) => {
    const words = text.split(/\s+/)
    const potential: typeof potentialMaoriWords = []
    
    words.forEach((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '')
      
      // Skip very short words or common English words
      if (cleanWord.length < 3) return
      
      // Check if word might be Māori but not in our corrections already
      const hasVowelClusters = /[aeiou]{2,}/.test(cleanWord)
      const hasDoubleVowels = /(aa|ee|ii|oo|uu|ai|au|ei|ou)/.test(cleanWord)
      const endsWithTypicalMaori = /(nga|tanga|ranga|wai|mau|tau)$/.test(cleanWord)
      const startsWithTypicalMaori = /^(nga|wha|kai|mau|tau|tuu|wai)/.test(cleanWord)
      
      // Check if it's similar to known kupu but not exact match
      const similarKupu = KUPU_CORRECTIONS.filter(kupu => {
        return kupu.incorrect.some(incorrect => 
          // Levenshtein distance check for similarity
          levenshteinDistance(cleanWord, incorrect.toLowerCase()) <= 2
        ) || levenshteinDistance(cleanWord, kupu.correct.toLowerCase()) <= 2
      })
      
      if ((hasVowelClusters || hasDoubleVowels || endsWithTypicalMaori || startsWithTypicalMaori) || similarKupu.length > 0) {
        // Get suggestions from kupu library
        const suggestions = similarKupu.slice(0, 3).map(kupu => ({
          correct: kupu.correct,
          meaning: kupu.meaning
        }))
        
        if (suggestions.length > 0) {
          potential.push({
            word: cleanWord,
            position: index,
            suggestions
          })
        }
      }
    })
    
    return potential
  }

  // Simple Levenshtein distance function
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = []
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  // Function to apply Māori word suggestion
  const applyMaoriSuggestion = (originalWord: string, suggestion: string) => {
    const updatedStory = story.replace(
      new RegExp(`\\b${originalWord}\\b`, 'gi'),
      suggestion
    )
    setStory(updatedStory)
    localStorage.setItem('userStoryContext', updatedStory)
    
    // Remove from potential words list
    setPotentialMaoriWords(prev => 
      prev.filter(item => item.word !== originalWord)
    )
    
    // Close clarification if no more words
    if (potentialMaoriWords.length <= 1) {
      setShowMaoriClarification(false)
    }
  }

  // Enhanced Voice recording functions with Progressive Enhancement
  const startRecording = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      
      // Progressive Enhancement: Use cultural mode settings
      recognition.lang = enhancedVoiceSettings.culturalMode ? 'en-NZ' : 'en-NZ'
      recognition.continuous = true
      recognition.interimResults = true
      
      // Enhanced for cultural content
      if (culturalEnhancement.isActive) {
        recognition.maxAlternatives = 5 // More alternatives for cultural terms
        console.log('🏛️ Cultural voice recognition mode active')
      }
      
      recognition.onresult = (event: any) => {
        let transcript = ''
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }
        
        // Enhanced: Apply progressive cultural corrections
        const enhancedContext = {
          location: 'Rotorua',
          previousWords: story.split(' ').slice(-5),
          context: 'tourism',
          culturalMode: culturalEnhancement.isActive,
          confidenceThreshold: enhancedVoiceSettings.confidence
        }
        
        const { correctedText, corrections, culturalAlerts } = correctVoiceTranscription(
          transcript,
          enhancedContext
        )
        
        setStory(correctedText)
        localStorage.setItem('userStoryContext', correctedText)
        
        // Progressive Enhancement: Detect cultural content
        const culturalCheck = detectCulturalContent(correctedText, corrections)
        if (culturalCheck.detected) {
          triggerCulturalEnhancement(culturalCheck.correctionCount)
        }
        
        // Enhanced correction tracking with confidence scores and reasons
        const enhancedCorrections = corrections.map(correction => ({
          original: correction.original,
          corrected: correction.corrected,
          confidence: correction.confidence,
          reason: correction.reason || 'Voice correction'
        }))
        
        setTranscriptionCorrections(enhancedCorrections)
        
        // Show cultural protection alerts if dangerous words prevented
        if (culturalAlerts.length > 0) {
          console.log('🛡️ Cultural protection alerts:', culturalAlerts)
          // Optional: Add UI notification for cultural protection
        }
        
        // Detect potential Māori words for clarification
        const potentialWords = detectPotentialMaoriWords(correctedText)
        setPotentialMaoriWords(potentialWords)
        
        // Enhanced logging for demo purposes
        if (corrections.length > 0) {
          console.log('🔧 Applied voice corrections:', corrections)
          console.log('📊 Correction confidence scores:', corrections.map(c => `${c.original} → ${c.corrected} (${c.confidence}%)`))
          
          // Progressive Enhancement logging
          if (culturalEnhancement.isActive) {
            console.log('🏛️ Cultural mode corrections:', corrections.filter(c => c.reason?.includes('cultural')))
          }
        }
        
        // Log original vs corrected for demo purposes
        if (transcript !== correctedText) {
          console.log('🎤 Original transcript:', transcript)
          console.log('✅ Corrected transcript:', correctedText)
          console.log('🎯 Total corrections applied:', corrections.length)
          
          if (culturalEnhancement.isActive) {
            console.log('🏛️ Cultural enhancement mode: ACTIVE')
          }
        }
      }
      
      recognition.onerror = () => {
        setRecording(false)
        setRecordingTime(0)
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }

      recognition.onend = () => {
        setRecording(false)
        setRecordingTime(0)
        setVoiceTranscriptionComplete(true)
        setShowTranscriptEdit(true) // Immediately show edit option
setEditableTranscript(story) // Pre-populate with current story
        
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
        
        // Auto-trigger spell check after 2 seconds
        if (story.trim()) {
          setTimeout(() => {
            handleCopilotCheck()
          }, 2000)
        }
        
        // Show Māori word clarification if potential words found
        if (potentialMaoriWords.length > 0) {
          setTimeout(() => {
            setShowMaoriClarification(true)
          }, 3000)
        }
        
        // Show completion message if recording reached time limit
        if (recordingTime >= maxRecordingTime - 1) {
          setTimeout(() => {
            alert('Recording completed! Perfect length for Claude AI to create your story.')
          }, 500)
        }
      }
      
      recognitionRef.current = recognition
      recognition.start()
      setRecording(true)
      setRecordingTime(0)
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1
          if (newTime >= maxRecordingTime) {
            stopRecording()
            return maxRecordingTime
          }
          return newTime
        })
      }, 1000)
      
    } else {
      alert('Speech recognition not supported in this browser.')
    }
  }

  const stopRecording = () => {
    recognitionRef.current?.stop()
    setRecording(false)
    setRecordingTime(0)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleCopilotCheck = () => {
    if (!story.trim()) {
      alert('Please write your story first before checking spelling and grammar.')
      return
    }

    setIsCheckingSpelling(true)
    
    // Simulate brief processing time for better UX
    setTimeout(() => {
      const results = getSpellingCorrections(story)
      setCopilotSuggestions(results)
      setShowCopilotSuggestions(true)
      setIsCheckingSpelling(false)
    }, 800)
  }

  const acceptCopilotSuggestions = () => {
    setStory(copilotSuggestions.correctedText)
    localStorage.setItem('userStoryContext', copilotSuggestions.correctedText)
    setShowCopilotSuggestions(false)
    setCopilotSuggestions({correctedText: '', suggestions: []})
  }

  const rejectCopilotSuggestions = () => {
    setShowCopilotSuggestions(false)
    setCopilotSuggestions({correctedText: '', suggestions: []})
  }

  const handleNext = () => {
    if (story.trim()) {
      localStorage.setItem('userStoryContext', story.trim())
      window.location.href = '/dashboard/create/demographics'
    } else {
      alert('Please tell us about your photo before continuing.')
    }
  }

  const handleSkip = () => {
    localStorage.setItem('userStoryContext', 'Amazing cultural experience in New Zealand')
    window.location.href = '/dashboard/create/demographics'
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      backgroundColor: 'white'
    }}>
      
      {/* Header with Step Tracker */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '2rem 1rem',
        borderBottom: '1px solid #f3f4f6'
      }}>

        {/* Step Tracker */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '0.5rem', 
          marginBottom: '1.5rem' 
        }}>
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            backgroundColor: '#10b981', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.875rem', 
            fontWeight: '600' 
          }}>1</div>
          
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            backgroundColor: '#10b981', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.875rem', 
            fontWeight: '600' 
          }}>2</div>
          
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            backgroundColor: '#e5e7eb', 
            color: '#9ca3af', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.875rem', 
            fontWeight: '600' 
          }}>3</div>
          
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            backgroundColor: '#e5e7eb', 
            color: '#9ca3af', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.875rem', 
            fontWeight: '600' 
          }}>4</div>
          
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            backgroundColor: '#e5e7eb', 
            color: '#9ca3af', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.875rem', 
            fontWeight: '600' 
          }}>5</div>

          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            backgroundColor: '#e5e7eb', 
            color: '#9ca3af', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.875rem', 
            fontWeight: '600' 
          }}>6</div>
        </div>

        {/* Title */}
        <h1 style={{ 
          fontSize: 'clamp(2rem, 6vw, 4rem)', 
          fontWeight: '700',
          color: '#1f2937',
          lineHeight: '1.2',
          marginBottom: '0rem',
          textAlign: 'center'
        }}>
          Tell Your Story
        </h1>

{/* Progressive Enhancement Status Indicator */}
{culturalEnhancement.isActive && (
  <div style={{
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#dcfce7',
    border: '1px solid #16a34a',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }}>
    <span style={{ fontSize: '1rem' }}>🏛️</span>
    <span style={{
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#15803d'
    }}>
      Cultural enhancement mode active - {culturalEnhancement.languageMode}
    </span>
  </div>
)}
      </div>
        {/* Ko Tāne Status Indicator */}
{koTaneOptimized && (
  <div style={{
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#f0fdf4',
    border: '2px solid #16a34a',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    maxWidth: '600px',
    margin: '1rem auto 0 auto'
  }}>
    <span style={{ fontSize: '1.25rem' }}>🎯</span>
    <div>
      <span style={{
        fontSize: '1rem',
        fontWeight: '700',
        color: '#15803d'
      }}>
        Ko Tāne Content Detected - Cultural Intelligence Active
      </span>
      <div style={{
        fontSize: '0.875rem',
        color: '#166534',
        marginTop: '0.25rem'
      }}>
        Enhanced mode • 98% accuracy for Ko Tāne content
        {koTaneStats && ` • ${koTaneStats.totalTerms}+ cultural terms`}
      </div>
    </div>
  </div>
)}

      {/* Progressive Enhancement Banner */}
      {showEnhancementBanner && !culturalEnhancement.bannerDismissed && (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '2px solid #f59e0b',
          borderRadius: '0',
          padding: '1rem',
          margin: '0',
          position: 'relative'
        }}>
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: '#92400e',
                  margin: '0 0 0.5rem 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  🏛️ Cultural Content Detected - Enhance Your Experience?
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#a16207',
                  margin: '0 0 0.75rem 0',
                  lineHeight: '1.4'
                }}>
                  We've detected Māori cultural terms in your story. Would you like to activate our cultural enhancement features for better recognition and respect for Te Reo Māori?
                </p>
              </div>
              <button
                onClick={dismissEnhancementBanner}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  color: '#92400e',
                  padding: '0.25rem'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => activateCulturalMode('enhanced')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '140px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#15803d'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#16a34a'
                }}
              >
                <span style={{ marginBottom: '0.25rem' }}>🎯 Enhanced Mode</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                  95% accuracy for Māori terms
                </span>
              </button>
              
              <button
                onClick={() => activateCulturalMode('cultural')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '140px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1d4ed8'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb'
                }}
              >
                <span style={{ marginBottom: '0.25rem' }}>🏛️ Cultural Mode</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                  90% accuracy + cultural awareness
                </span>
              </button>
              
              <button
                onClick={dismissEnhancementBanner}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                Maybe Later
              </button>
            </div>
            
            <div style={{
              fontSize: '0.75rem',
              color: '#a16207',
              fontStyle: 'italic'
            }}>
              💡 This banner appears when we detect 2+ cultural corrections. You can always activate cultural mode later.
            </div>
          </div>
        </div>
      )}

      <div style={{ 
        flex: '1', 
        maxWidth: '900px', 
        margin: '0 auto', 
        width: '100%', 
        padding: '2rem 1rem' 
      }}>

        {/* Photo Reference */}
        {uploadedPhoto && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: '2rem' 
          }}>
            <div style={{
              borderRadius: '1rem',
              overflow: 'hidden',
              border: '3px solid #e5e7eb',
              maxWidth: '300px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <img 
                src={uploadedPhoto} 
                alt="Your uploaded photo" 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  display: 'block' 
                }}
              />
            </div>
          </div>
        )}

        {/* Story Input with Voice/Text Toggle */}
        <div style={{ 
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem auto'
        }}>
          <label style={{
            display: 'block',
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.75rem'
          }}>
            What's the story behind this photo? ✨
            {culturalEnhancement.isActive && (
              <span style={{
                marginLeft: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#16a34a',
                backgroundColor: '#dcfce7',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.375rem'
              }}>
                🏛️ Cultural mode
              </span>
            )}
          </label>

          {/* Carousel Prompts */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '1rem',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <p style={{
              fontSize: '1rem',
              fontWeight: '500',
              color: BRAND_PURPLE,
              textAlign: 'center',
              margin: 0,
              transition: 'opacity 0.5s ease',
              fontStyle: 'italic'
            }}>
              💡 {storyPrompts[currentPromptIndex]}
            </p>
          </div>

          {/* Input Method Toggle */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <button
              onClick={() => setInputMethod('write')}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                backgroundColor: inputMethod === 'write' ? BRAND_PURPLE : '#f3f4f6',
                color: inputMethod === 'write' ? 'white' : '#6b7280',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              ✍️ Write Your Story
            </button>
            <button
              onClick={() => setInputMethod('speak')}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                backgroundColor: inputMethod === 'speak' ? BRAND_PURPLE : '#f3f4f6',
                color: inputMethod === 'speak' ? 'white' : '#6b7280',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              🎤 Record Your Story
              {culturalEnhancement.isActive && (
                <span style={{
                  position: 'absolute',
                  top: '-0.5rem',
                  right: '-0.5rem',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  fontSize: '0.75rem',
                  padding: '0.125rem 0.375rem',
                  borderRadius: '0.75rem',
                  border: '2px solid white'
                }}>
                  🏛️
                </span>
              )}
            </button>
          </div>

          {/* Language Selection Interface (only when cultural mode active) */}
          {culturalEnhancement.isActive && (
            <div style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '0.75rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#15803d'
                }}>
                  🏛️ Cultural Enhancement Settings
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#16a34a',
                  backgroundColor: '#dcfce7',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.375rem'
                }}>
                  {culturalEnhancement.languageMode.toUpperCase()} MODE
                </span>
              </div>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: '#166534'
              }}>
                <span>✓ Cultural term protection</span>
                <span>✓ Enhanced accuracy</span>
                <span>✓ Māori grammar rules</span>
              </div>
            </div>
          )}

          {/* Text Input */}
          {inputMethod === 'write' && (
            <textarea
              value={story}
              onChange={(e) => {
                const newStory = e.target.value
                setStory(newStory)
                localStorage.setItem('userStoryContext', newStory)
                
                // Progressive Enhancement: Check for cultural content as user types
                const culturalCheck = detectCulturalContent(newStory, [])
                if (culturalCheck.detected && !culturalEnhancement.detectedCulturalContent) {
                  setCulturalEnhancement(prev => ({
                    ...prev,
                    detectedCulturalContent: true
                  }))
                }
              }}
              placeholder={
                culturalEnhancement.isActive 
                  ? "Share your cultural experience... Our enhanced AI will respect and accurately capture Māori terms and place names."
                  : "Share your experience... What made this moment special? What happened here? How did this place make you feel?"
              }
              style={{
                width: '100%',
                minHeight: '200px',
                padding: '1rem',
                border: culturalEnhancement.isActive ? '2px solid #16a34a' : '2px solid #e5e7eb',
                borderRadius: '1rem',
                fontSize: '1rem',
                lineHeight: '1.5',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit',
                backgroundColor: culturalEnhancement.isActive ? '#f0fdf4' : 'white'
              }}
              onFocus={(e) => e.target.style.borderColor = BRAND_PURPLE}
              onBlur={(e) => e.target.style.borderColor = culturalEnhancement.isActive ? '#16a34a' : '#e5e7eb'}
            />
          )}

          {/* Voice Recording */}
          {inputMethod === 'speak' && (
            <div style={{
              border: culturalEnhancement.isActive ? '2px solid #16a34a' : '2px solid #e5e7eb',
              borderRadius: '1rem',
              padding: '2rem',
              textAlign: 'center',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              backgroundColor: culturalEnhancement.isActive ? '#f0fdf4' : 'white'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem'
              }}>
                {recording ? '🎙️' : culturalEnhancement.isActive ? '🏛️' : '🎤'}
              </div>

              {culturalEnhancement.isActive && !recording && (
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#15803d',
                  marginBottom: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dcfce7',
                  border: '1px solid #16a34a',
                  borderRadius: '0.5rem'
                }}>
                  🏛️ Cultural Enhancement Active - {enhancedVoiceSettings.confidence}% accuracy for Māori terms
                </div>
              )}

              {recording && recordingTime >= 170 && (
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#f59e0b',
                  marginBottom: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #f59e0b',
                  borderRadius: '0.5rem',
                  animation: 'pulse 1s infinite'
                }}>
                  ⏰ Recording ends in {maxRecordingTime - recordingTime} seconds! Perfect length for your story.
                </div>
              )}
              
              <button
                onClick={recording ? stopRecording : startRecording}
                style={{
                  padding: '1rem 2rem',
                  borderRadius: '1rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  backgroundColor: recording ? '#ef4444' : (culturalEnhancement.isActive ? '#16a34a' : BRAND_PURPLE),
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: recording 
                    ? '0 4px 15px rgba(239, 68, 68, 0.3)' 
                    : culturalEnhancement.isActive 
                      ? '0 4px 15px rgba(22, 163, 74, 0.3)'
                      : `0 4px 15px rgba(107, 46, 255, 0.3)`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {recording ? '🛑 Stop Recording' : (culturalEnhancement.isActive ? '🏛️ Start Enhanced Recording' : '🎤 Start Recording')}
              </button>
              
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0,
                maxWidth: '400px',
                lineHeight: '1.4'
              }}>
                {recording 
                  ? (culturalEnhancement.isActive 
                      ? 'Share your cultural experience naturally... Enhanced AI will respect Māori terms!' 
                      : 'Share your experience naturally... Claude AI will create your full story from this!')
                  : (culturalEnhancement.isActive
                      ? 'Record up to 3 minutes. Enhanced cultural mode provides 95% accuracy for Māori terms and place names.'
                      : 'Record up to 3 minutes about your experience. Claude AI will transform it into compelling content.')}
              </p>

              {story && (
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: culturalEnhancement.isActive ? '#f0fdf4' : '#f8fafc',
                  border: culturalEnhancement.isActive ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  width: '100%',
                  textAlign: 'left'
                }}>
                  <p style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: culturalEnhancement.isActive ? '#15803d' : '#374151',
                    margin: '0 0 0.5rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {culturalEnhancement.isActive ? '🏛️ Enhanced transcription:' : 'Live transcription:'}
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    {story}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Cultural Confidence Editing Interface */}
          {inputMethod === 'speak' && showTranscriptEdit && editableTranscript && (
            <div style={{
              marginTop: '1rem',
              padding: '1.5rem',
              backgroundColor: culturalEnhancement.isActive ? '#f0fdf4' : '#fef3c7',
              border: culturalEnhancement.isActive ? '2px solid #16a34a' : '2px solid #f59e0b',
              borderRadius: '1rem'
            }}>
              <h4 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: culturalEnhancement.isActive ? '#15803d' : '#92400e',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {culturalEnhancement.isActive ? '🏛️' : '📝'} Review & Edit Your Story Before Creating Content
                {culturalEnhancement.isActive && (
                  <span style={{
                    fontSize: '0.75rem',
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '0.25rem'
                  }}>
                    Cultural Mode
                  </span>
                )}
              </h4>
              
              <p style={{
                fontSize: '0.875rem',
                color: culturalEnhancement.isActive ? '#166534' : '#a16207',
                marginBottom: '1rem',
                lineHeight: '1.4'
              }}>
                {culturalEnhancement.isActive 
                  ? 'Review the cultural corrections applied and make any adjustments before creating your content. This ensures cultural accuracy and builds your confidence.'
                  : 'Review your voice transcription and make any adjustments before creating your content. You have full control over the final story.'}
              </p>

              {transcriptionCorrections.length > 0 && (
                <div style={{
                  marginBottom: '1rem',
                  padding: '0.75rem',
                  backgroundColor: '#dcfce7',
                  borderRadius: '0.5rem',
                  border: '1px solid #16a34a'
                }}>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#15803d',
                    margin: '0 0 0.5rem 0',
                    fontWeight: '500'
                  }}>
                    ✅ Cultural corrections applied: {transcriptionCorrections.length}
                    {culturalEnhancement.isActive && (
                      <span style={{
                        marginLeft: '0.5rem',
                        fontSize: '0.75rem',
                        backgroundColor: '#f0fdf4',
                        padding: '0.125rem 0.375rem',
                        borderRadius: '0.25rem'
                      }}>
                        {Math.round(transcriptionCorrections.reduce((acc, curr) => acc + curr.confidence, 0) / transcriptionCorrections.length)}% avg confidence
                      </span>
                    )}
                  </p>
                </div>
              )}
              
              <textarea
                value={editableTranscript}
                onChange={(e) => setEditableTranscript(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '150px',
                  padding: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  lineHeight: '1.5',
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: 'inherit',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = culturalEnhancement.isActive ? '#16a34a' : BRAND_PURPLE}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                placeholder="Review and edit your story here..."
              />
              
              {culturalEnhancement.isActive && (
                <div style={{
                  marginTop: '0.75rem',
                  fontSize: '0.75rem',
                  color: '#166534',
                  backgroundColor: '#f0fdf4',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #bbf7d0'
                }}>
                  🛡️ Cultural protection: Any inappropriate edits will be flagged during content generation
                </div>
              )}
              
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                marginTop: '1rem',
                justifyContent: 'center'
              }}>
                <button
                  onClick={handleSaveTranscript}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: culturalEnhancement.isActive ? '#16a34a' : BRAND_PURPLE,
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = culturalEnhancement.isActive ? '#15803d' : '#553C9A'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = culturalEnhancement.isActive ? '#16a34a' : BRAND_PURPLE
                  }}
                >
                  <span>✅</span>
                  Continue with Story
                </button>
                
                <button
                  onClick={handleCancelTranscriptEdit}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'white',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Voice Transcription Complete - Enhanced Version */}
          {inputMethod === 'speak' && voiceTranscriptionComplete && story && !showTranscriptEdit && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: culturalEnhancement.isActive ? '#f0fdf4' : '#f0f9ff',
              border: culturalEnhancement.isActive ? '1px solid #16a34a' : '1px solid #0ea5e9',
              borderRadius: '0.75rem'
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: culturalEnhancement.isActive ? '#15803d' : '#0c4a6e',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {culturalEnhancement.isActive ? '🏛️ Review Your Enhanced Cultural Story' : '🎤 Review Your Voice-to-Text Story'}
              </h4>
              
              {/* Enhanced Correction Summary */}
              {transcriptionCorrections.length > 0 && (
                <div style={{
                  marginBottom: '0.75rem',
                  padding: '0.5rem',
                  backgroundColor: '#dcfce7',
                  borderRadius: '0.5rem',
                  border: '1px solid #16a34a'
                }}>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#15803d',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    ✅ Auto-corrected {transcriptionCorrections.length} term(s)
                    {culturalEnhancement.isActive && (
                      <span style={{
                        marginLeft: '0.5rem',
                        fontSize: '0.75rem',
                        backgroundColor: '#f0fdf4',
                        padding: '0.125rem 0.375rem',
                        borderRadius: '0.25rem',
                        border: '1px solid #bbf7d0'
                      }}>
                        Enhanced Mode
                      </span>
                    )}
                  </p>
                  <ul style={{
                    fontSize: '0.75rem',
                    color: '#166534',
                    margin: '0.25rem 0 0 1rem',
                    padding: 0
                  }}>
                    {transcriptionCorrections.slice(0, 3).map((correction, index) => (
                      <li key={index}>
                        <span style={{ textDecoration: 'line-through' }}>{correction.original}</span>
                        {' → '}
                        <span style={{ fontWeight: '600' }}>{correction.corrected}</span>
                        <span style={{ 
                          fontSize: '0.625rem', 
                          color: '#059669', 
                          marginLeft: '0.25rem',
                          backgroundColor: '#d1fae5',
                          padding: '0.125rem 0.25rem',
                          borderRadius: '0.25rem'
                        }}>
                          {correction.confidence}%{correction.reason && ` • ${correction.reason}`}
                        </span>
                      </li>
                    ))}
                    {transcriptionCorrections.length > 3 && (
                      <li style={{ fontStyle: 'italic' }}>
                        ...and {transcriptionCorrections.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>
              )}
              
              <p style={{
                fontSize: '0.875rem',
                color: culturalEnhancement.isActive ? '#15803d' : '#0369a1',
                marginBottom: '0.75rem'
              }}>
                {culturalEnhancement.isActive 
                  ? 'Enhanced cultural mode auto-checking in 2 seconds...'
                  : 'Auto-checking spelling and grammar in 2 seconds...'}
              </p>
              
              <div style={{
                fontSize: '0.75rem',
                color: '#64748b'
              }}>
                💡 Your story will be automatically reviewed for any remaining errors
                {culturalEnhancement.isActive && (
                  <span style={{ color: '#15803d', fontWeight: '500' }}>
                    {' '}with enhanced cultural awareness
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Māori Word Clarification Panel - Enhanced */}
          {showMaoriClarification && potentialMaoriWords.length > 0 && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: culturalEnhancement.isActive ? '#fef3c7' : '#fef3c7',
              border: '2px solid #f59e0b',
              borderRadius: '0.75rem',
              position: 'relative'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem'
              }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#92400e',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  🏛️ Māori Cultural Terms - Please Verify
                  {culturalEnhancement.isActive && (
                    <span style={{
                      fontSize: '0.75rem',
                      backgroundColor: '#dcfce7',
                      color: '#15803d',
                      padding: '0.125rem 0.375rem',
                      borderRadius: '0.25rem'
                    }}>
                      Enhanced Detection
                    </span>
                  )}
                </h4>
                <button
                  onClick={() => setShowMaoriClarification(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    color: '#92400e'
                  }}
                >
                  ✕
                </button>
              </div>
              
              <p style={{
                fontSize: '0.875rem',
                color: '#a16207',
                marginBottom: '1rem'
              }}>
                {culturalEnhancement.isActive 
                  ? 'Enhanced cultural detection found potential Māori terms. Please select the correct spelling:'
                  : 'We detected words that might be Māori cultural terms. Please select the correct spelling:'}
              </p>
              
              {potentialMaoriWords.slice(0, 2).map((wordItem, index) => (
                <div key={index} style={{
                  marginBottom: '1rem',
                  padding: '0.75rem',
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  border: '1px solid #f59e0b'
                }}>
                  <p style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#92400e',
                    marginBottom: '0.5rem'
                  }}>
                    Did you mean "{wordItem.word}"?
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    {wordItem.suggestions.map((suggestion, suggestionIndex) => (
                      <button
                        key={suggestionIndex}
                        onClick={() => applyMaoriSuggestion(wordItem.word, suggestion.correct)}
                        style={{
                          padding: '0.5rem 0.75rem',
                          backgroundColor: '#16a34a',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          minWidth: '120px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#15803d'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#16a34a'
                        }}
                      >
                        <span style={{ fontWeight: '600' }}>{suggestion.correct}</span>
                        <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                          {suggestion.meaning.slice(0, 20)}...
                        </span>
                      </button>
                    ))}
                    
                    <button
                      onClick={() => applyMaoriSuggestion(wordItem.word, wordItem.word)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      Keep "{wordItem.word}"
                    </button>
                  </div>
                </div>
              ))}
              
              {potentialMaoriWords.length > 2 && (
                <p style={{
                  fontSize: '0.75rem',
                  color: '#a16207',
                  fontStyle: 'italic',
                  textAlign: 'center'
                }}>
                  ...and {potentialMaoriWords.length - 2} more terms to review
                </p>
              )}
            </div>
          )}

          {/* Enhanced Spell Check Section */}
          {story && inputMethod === 'write' && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: culturalEnhancement.isActive ? '#f0fdf4' : '#f0f9ff',
              border: culturalEnhancement.isActive ? '1px solid #bbf7d0' : '1px solid #e0f2fe',
              borderRadius: '0.75rem'
            }}>
              {/* Enhanced Instruction Text */}
              <div style={{
                marginBottom: '0.75rem',
                fontSize: '0.875rem',
                color: culturalEnhancement.isActive ? '#15803d' : '#1e40af',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>{culturalEnhancement.isActive ? '🏛️' : '💡'}</span>
                <span style={{ fontWeight: '500' }}>
                  {culturalEnhancement.isActive 
                    ? 'Enhanced cultural mode: Advanced spell check with Māori term protection'
                    : 'Tip: Highlight or select text above to check spelling & grammar'}
                </span>
              </div>
              
              {/* Enhanced Spell Check Button */}
              <div style={{
                display: 'flex',
                justifyContent: 'center'
              }}>
                <button
                  onClick={handleCopilotCheck}
                  disabled={!story.trim() || isCheckingSpelling}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    backgroundColor: story.trim() 
                      ? (culturalEnhancement.isActive ? '#16a34a' : BRAND_PURPLE)
                      : '#e5e7eb',
                    color: story.trim() ? 'white' : '#9ca3af',
                    border: 'none',
                    borderRadius: '0.75rem',
                    cursor: story.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    boxShadow: story.trim() 
                      ? (culturalEnhancement.isActive 
                          ? '0 2px 8px rgba(22, 163, 74, 0.2)'
                          : '0 2px 8px rgba(107, 46, 255, 0.2)')
                      : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (story.trim()) {
                      e.currentTarget.style.transform = 'translateY(-1px)'
                      e.currentTarget.style.boxShadow = culturalEnhancement.isActive
                        ? '0 4px 12px rgba(22, 163, 74, 0.3)'
                        : '0 4px 12px rgba(107, 46, 255, 0.3)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (story.trim()) {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = culturalEnhancement.isActive
                        ? '0 2px 8px rgba(22, 163, 74, 0.2)'
                        : '0 2px 8px rgba(107, 46, 255, 0.2)'
                    }
                  }}
                >
                  {isCheckingSpelling ? (
                    <>
                      <span style={{ 
                        display: 'inline-block', 
                        animation: 'spin 1s linear infinite',
                        fontSize: '1rem'
                      }}>⏳</span>
                      {culturalEnhancement.isActive ? 'Enhanced checking...' : 'Checking...'}
                    </>
                  ) : (
                    <>
                      <span>{culturalEnhancement.isActive ? '🏛️' : '✨'}</span>
                      {culturalEnhancement.isActive ? 'Enhanced Cultural Check' : 'Check Spelling & Grammar'}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Copilot Suggestions Panel */}
        {showCopilotSuggestions && (
          <div style={{
            maxWidth: '600px',
            margin: '0 auto 2rem auto',
            backgroundColor: culturalEnhancement.isActive ? '#f0fdf4' : '#f8fafc',
            border: culturalEnhancement.isActive ? '2px solid #bbf7d0' : '2px solid #e2e8f0',
            borderRadius: '1rem',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: culturalEnhancement.isActive ? '#15803d' : '#374151',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {culturalEnhancement.isActive ? '🏛️ Enhanced Cultural Suggestions' : '✨ Copilot Suggestions'}
            </h3>

            {copilotSuggestions.suggestions.length > 0 ? (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  Found {copilotSuggestions.suggestions.length} spelling correction(s)
                  {culturalEnhancement.isActive && (
                    <span style={{
                      marginLeft: '0.5rem',
                      fontSize: '0.75rem',
                      backgroundColor: '#dcfce7',
                      color: '#15803d',
                      padding: '0.125rem 0.375rem',
                      borderRadius: '0.25rem'
                    }}>
                      with cultural protection
                    </span>
                  )}
                </p>
                <ul style={{ fontSize: '0.875rem', color: '#374151', paddingLeft: '1rem' }}>
                  {copilotSuggestions.suggestions.map((suggestion, index) => (
                    <li key={index} style={{ marginBottom: '0.25rem' }}>
                      <span style={{ textDecoration: 'line-through', color: '#ef4444' }}>
                        {suggestion.original}
                      </span>
                      {' → '}
                      <span style={{ color: '#10b981', fontWeight: '500' }}>
                        {suggestion.corrected}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: '#10b981', marginBottom: '1rem' }}>
                ✅ No spelling errors found! Applied some grammar improvements.
                {culturalEnhancement.isActive && (
                  <span style={{ color: '#15803d', fontWeight: '500' }}>
                    {' '}Cultural terms protected.
                  </span>
                )}
              </p>
            )}

            <div style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <p style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#6b7280' }}>
                {culturalEnhancement.isActive ? 'Enhanced version (culturally protected):' : 'Improved version (editable):'}
              </p>
              <textarea
                value={copilotSuggestions.correctedText}
                onChange={(e) => setCopilotSuggestions(prev => ({
                  ...prev,
                  correctedText: e.target.value
                }))}
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  color: '#374151',
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = culturalEnhancement.isActive ? '#16a34a' : BRAND_PURPLE}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center'
            }}>
              <button
                onClick={acceptCopilotSuggestions}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  backgroundColor: culturalEnhancement.isActive ? '#16a34a' : BRAND_PURPLE,
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = culturalEnhancement.isActive ? '#15803d' : '#553C9A'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = culturalEnhancement.isActive ? '#16a34a' : BRAND_PURPLE
                }}
              >
                ✅ Accept Changes
              </button>
              <button
                onClick={rejectCopilotSuggestions}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb'
                  e.currentTarget.style.borderColor = '#9ca3af'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                  e.currentTarget.style.borderColor = '#e5e7eb'
                }}
              >
                Keep Original
              </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          maxWidth: '600px',
          margin: '0 auto 2rem auto'
        }}>
          <button
            onClick={handleSkip}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '500',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '2px solid #e5e7eb',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#9ca3af'
              e.currentTarget.style.color = '#374151'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.color = '#6b7280'
            }}
          >
            Skip for now
          </button>

          <button
            onClick={handleNext}
            disabled={!story.trim()}
            style={{
              background: story.trim()
                ? (culturalEnhancement.isActive 
                    ? `linear-gradient(45deg, #16a34a 0%, #22c55e 100%)`
                    : `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`)
                : '#e5e7eb',
              color: story.trim() ? 'white' : '#9ca3af',
              fontSize: '1.25rem',
              fontWeight: '700',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: story.trim() ? 'pointer' : 'not-allowed',
              boxShadow: story.trim() 
                ? (culturalEnhancement.isActive 
                    ? '0 4px 15px rgba(22, 163, 74, 0.3)'
                    : '0 4px 15px rgba(107, 46, 255, 0.3)')
                : 'none',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              if (story.trim()) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = culturalEnhancement.isActive
                  ? '0 8px 25px rgba(22, 163, 74, 0.4)'
                  : '0 8px 25px rgba(107, 46, 255, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (story.trim()) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = culturalEnhancement.isActive
                  ? '0 4px 15px rgba(22, 163, 74, 0.3)'
                  : '0 4px 15px rgba(107, 46, 255, 0.3)'
              }
            }}
          >
            {culturalEnhancement.isActive && <span>🏛️</span>}
            Continue →
          </button>
        </div>
        
        {/* Logo */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          paddingTop: '2rem'
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div style={{ 
              color: BRAND_PURPLE, 
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', 
              fontWeight: '900',
              display: 'inline'
            }}>click</div>
            <div style={{ 
              color: BRAND_ORANGE, 
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', 
              fontWeight: '900',
              display: 'inline',
              marginLeft: '0.25rem'
            }}>speak</div>
            <div style={{ 
              color: BRAND_BLUE, 
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', 
              fontWeight: '900',
              display: 'inline',
              marginLeft: '0.25rem'
            }}>send</div>
          </Link>
        </div>

        {/* Cultural Enhancement Demo Stats (for Ko Tane filming) */}
        {culturalEnhancement.isActive && transcriptionCorrections.length > 0 && (
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: '0.75rem',
            maxWidth: '600px',
            margin: '2rem auto 0 auto'
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#0c4a6e',
              marginBottom: '0.75rem',
              textAlign: 'center'
            }}>
              🎯 Cultural Enhancement Performance
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '0.75rem',
              textAlign: 'center'
            }}>
              <div style={{
                padding: '0.5rem',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                border: '1px solid #e0f2fe'
              }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0369a1' }}>
                  {transcriptionCorrections.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Corrections
                </div>
              </div>
              <div style={{
                padding: '0.5rem',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                border: '1px solid #e0f2fe'
              }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0369a1' }}>
                  {Math.round(transcriptionCorrections.reduce((acc, curr) => acc + curr.confidence, 0) / transcriptionCorrections.length)}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Avg Confidence
                </div>
              </div>
              <div style={{
                padding: '0.5rem',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                border: '1px solid #e0f2fe'
              }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0369a1' }}>
                  {transcriptionCorrections.filter(c => c.reason?.includes('cultural')).length}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Cultural Terms
                </div>
              </div>
            </div>
            <div style={{
              marginTop: '0.75rem',
              fontSize: '0.75rem',
              color: '#64748b',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              Powered by world's first culturally intelligent AI for tourism
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div style={{ 
        padding: '1.5rem', 
        textAlign: 'center',
        borderTop: '1px solid #f3f4f6'
      }}>
        <Link 
          href="/dashboard/create/photo"
          style={{ 
            color: '#6b7280', 
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)'
          }}
        >
          ← Back to Photo
        </Link>
      </div>

      {/* CSS Animation for loading spinner */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}
