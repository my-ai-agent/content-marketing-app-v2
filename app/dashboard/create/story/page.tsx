'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { getMacronCorrections, correctTranscriptionText, correctVoiceTranscription, KUPU_CORRECTIONS } from '../../../utils/kupu'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

// Story prompts carousel
const storyPrompts = [
  "Describe this photo in one sentence!",
  "Why is this a special memory?", 
  "What did you experience?",
  "Who did you share this experience with?",
  "Where was this location?",
  "The more you share, the more AI can personalise your story"
]

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

  // Voice recording functions
  const startRecording = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.lang = 'en-NZ' // New Zealand English - critical for correct vocabulary
      recognition.continuous = true // Allow longer recording
      recognition.interimResults = true // Show live transcription
      
      recognition.onresult = (event: any) => {
  let transcript = ''
  for (let i = 0; i < event.results.length; i++) {
    transcript += event.results[i][0].transcript
  }
  
  // ENHANCED: Apply advanced voice correction with cultural protection
  const { correctedText, corrections, culturalAlerts } = correctVoiceTranscription(
    transcript,
    { 
      location: 'Rotorua', 
      previousWords: story.split(' ').slice(-5),
      context: 'tourism'
    }
  )
  
  setStory(correctedText)
  localStorage.setItem('userStoryContext', correctedText)
  
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
  
  // Enhanced logging for debugging and demo purposes
  if (corrections.length > 0) {
    console.log('🔧 Applied voice corrections:', corrections)
    console.log('📊 Correction confidence scores:', corrections.map(c => `${c.original} → ${c.corrected} (${c.confidence}%)`))
  }
  
  // Log original vs corrected for demo purposes
  if (transcript !== correctedText) {
    console.log('🎤 Original transcript:', transcript)
    console.log('✅ Corrected transcript:', correctedText)
    console.log('🎯 Total corrections applied:', corrections.length)
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
      </div>

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
                transition: 'all 0.2s'
              }}
            >
              🎤 Record Your Story
            </button>
          </div>

          {/* Text Input */}
          {inputMethod === 'write' && (
            <textarea
              value={story}
              onChange={(e) => {
                setStory(e.target.value)
                localStorage.setItem('userStoryContext', e.target.value)
              }}
              placeholder="Share your experience... What made this moment special? What happened here? How did this place make you feel?"
              style={{
                width: '100%',
                minHeight: '200px',
                padding: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '1rem',
                fontSize: '1rem',
                lineHeight: '1.5',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = BRAND_PURPLE}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          )}

          {/* Voice Recording */}
          {inputMethod === 'speak' && (
            <div style={{
              border: '2px solid #e5e7eb',
              borderRadius: '1rem',
              padding: '2rem',
              textAlign: 'center',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem'
              }}>
                {recording ? '🎙️' : '🎤'}
              </div>

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
                  backgroundColor: recording ? '#ef4444' : BRAND_PURPLE,
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: recording ? '0 4px 15px rgba(239, 68, 68, 0.3)' : `0 4px 15px rgba(107, 46, 255, 0.3)`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {recording ? '🛑 Stop Recording' : '🎤 Start Recording'}
              </button>
              
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0,
                maxWidth: '400px',
                lineHeight: '1.4'
              }}>
                {recording 
                  ? 'Share your experience naturally... Claude AI will create your full story from this!' 
                  : 'Record up to 3 minutes about your experience. Claude AI will transform it into compelling content.'}
              </p>

              {story && (
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  width: '100%',
                  textAlign: 'left'
                }}>
                  <p style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    margin: '0 0 0.5rem 0'
                  }}>
                    Live transcription:
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

          {/* Voice Transcription Complete - Auto Actions */}
          {inputMethod === 'speak' && voiceTranscriptionComplete && story && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#f0f9ff',
              border: '1px solid #0ea5e9',
              borderRadius: '0.75rem'
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#0c4a6e',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🎤 Review Your Voice-to-Text Story
              </h4>
              
              {/* Correction Summary */}
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
                    ✅ Auto-corrected {transcriptionCorrections.length} cultural term(s):
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
                color: '#0369a1',
                marginBottom: '0.75rem'
              }}>
                Auto-checking spelling and grammar in 2 seconds...
              </p>
              
              <div style={{
                fontSize: '0.75rem',
                color: '#64748b'
              }}>
                💡 Your story will be automatically reviewed for any remaining errors
              </div>
            </div>
          )}

          {/* Māori Word Clarification Panel */}
          {showMaoriClarification && potentialMaoriWords.length > 0 && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#fef3c7',
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
                We detected words that might be Māori cultural terms. Please select the correct spelling:
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

          {/* Spell Check Section with Enhanced Instructions */}
          {story && inputMethod === 'write' && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#f0f9ff',
              border: '1px solid #e0f2fe',
              borderRadius: '0.75rem'
            }}>
              {/* Instruction Text */}
              <div style={{
                marginBottom: '0.75rem',
                fontSize: '0.875rem',
                color: '#1e40af',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>💡</span>
                <span style={{ fontWeight: '500' }}>
                  Tip: Highlight or select text above to check spelling & grammar
                </span>
              </div>
              
              {/* Spell Check Button */}
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
                    backgroundColor: story.trim() ? BRAND_PURPLE : '#e5e7eb',
                    color: story.trim() ? 'white' : '#9ca3af',
                    border: 'none',
                    borderRadius: '0.75rem',
                    cursor: story.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    boxShadow: story.trim() ? '0 2px 8px rgba(107, 46, 255, 0.2)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (story.trim()) {
                      e.currentTarget.style.transform = 'translateY(-1px)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(107, 46, 255, 0.3)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (story.trim()) {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(107, 46, 255, 0.2)'
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
                      Checking...
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      Check Spelling & Grammar
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Copilot Suggestions Panel */}
        {showCopilotSuggestions && (
          <div style={{
            maxWidth: '600px',
            margin: '0 auto 2rem auto',
            backgroundColor: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: '1rem',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              ✨ Copilot Suggestions
            </h3>

            {copilotSuggestions.suggestions.length > 0 ? (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  Found {copilotSuggestions.suggestions.length} spelling correction(s):
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
                Improved version (editable):
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
                onFocus={(e) => e.target.style.borderColor = BRAND_PURPLE}
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
                  backgroundColor: BRAND_PURPLE,
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#553C9A'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = BRAND_PURPLE
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
                ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                : '#e5e7eb',
              color: story.trim() ? 'white' : '#9ca3af',
              fontSize: '1.25rem',
              fontWeight: '700',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: story.trim() ? 'pointer' : 'not-allowed',
              boxShadow: story.trim() ? '0 4px 15px rgba(107, 46, 255, 0.3)' : 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (story.trim()) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(107, 46, 255, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (story.trim()) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(107, 46, 255, 0.3)'
              }
            }}
          >
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
      `}</style>
    </div>
  )
}
