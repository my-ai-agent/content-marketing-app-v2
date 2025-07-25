'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { getMacronCorrections } from '../../../utils/kupu'

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
  const maxRecordingTime = 90 // 90 seconds maximum

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
        setStory(transcript)
        localStorage.setItem('userStoryContext', transcript)
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
        if (timerRef.current) {
          clearInterval(timerRef.current)
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

              {recording && recordingTime >= 80 && (
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
                  ? 'Share your experience naturally... Claude AI will create your full LinkedIn story from this!' 
                  : 'Record up to 90 seconds about your experience. Claude AI will transform it into a compelling LinkedIn story.'}
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
