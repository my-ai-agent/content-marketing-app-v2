// Tell Your Story Page: /app/dashboard/create/story/page.tsx
'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import ExecutivePromptBuilder from '../../../utils/ExecutivePromptBuilder'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

export default function TellYourStory() {
  const [story, setStory] = useState('')
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [selectedPersona, setSelectedPersona] = useState('')
  const [customPersonaText, setCustomPersonaText] = useState('')
  const [showPersonaSelection, setShowPersonaSelection] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Initialize Executive Prompt Builder
  const [promptBuilder] = useState(() => new ExecutivePromptBuilder())

  const storyPrompts = [
    "What made this moment special?",
    "Where was this photo taken?", 
    "Who was with you during this experience?",
    "What emotions did you feel here?",
    "What's the story behind this image?",
    "What would you want others to know about this place?"
  ]

  const personas = [
    {
      id: 'tourism-business-owner',
      title: 'Tourism Business Owner',
      subtitle: 'leads & bookings focus',
      description: 'Content optimized for lead generation, customer acquisition, and showcasing business offerings'
    },
    {
      id: 'content-creator',
      title: 'Travel Content Creator',
      subtitle: 'engagement & reach focus',
      description: 'Engaging content designed to build audience, increase social reach, and establish creative portfolio'
    },
    {
      id: 'travel-enthusiast',
      title: 'Travel Enthusiast',
      subtitle: 'sharing & inspiration focus',
      description: 'Authentic storytelling that inspires others to explore and discover new destinations'
    },
    {
      id: 'conference-attendee',
      title: 'Conference or Event Attendee',
      subtitle: 'networking & professional sharing',
      description: 'Professional content for networking, industry connections, and event experiences'
    },
    {
      id: 'corporate-travel-manager',
      title: 'Corporate Travel Manager',
      subtitle: 'team experiences & business travel',
      description: 'Business-focused content for team building, corporate experiences, and professional travel'
    },
    {
      id: 'tourism-educator',
      title: 'Tourism Educator/Guide',
      subtitle: 'educational content & cultural sharing',
      description: 'Educational storytelling that teaches, informs, and shares cultural knowledge authentically'
    },
    {
      id: 'travel-journalist',
      title: 'Travel Journalist/Blogger',
      subtitle: 'professional storytelling & reviews',
      description: 'Professional travel writing with journalistic quality, reviews, and in-depth destination coverage'
    },
    {
      id: 'family-travel-planner',
      title: 'Family Travel Planner',
      subtitle: 'family memories & recommendations',
      description: 'Family-friendly content focusing on creating memories and helping other families plan trips'
    },
    {
      id: 'student-backpacker',
      title: 'Student/Backpacker',
      subtitle: 'budget travel & authentic experiences',
      description: 'Budget-conscious travel content with authentic experiences and practical tips for young travelers'
    },
    {
      id: 'luxury-enthusiast',
      title: 'Luxury Travel Enthusiast',
      subtitle: 'premium experiences & high-end content',
      description: 'Premium travel content showcasing luxury experiences, fine dining, and exclusive destinations'
    },
    {
      id: 'adventure-sports',
      title: 'Adventure Sports Enthusiast',
      subtitle: 'action-focused & adrenaline content',
      description: 'High-energy content focused on adventure activities, extreme sports, and adrenaline experiences'
    },
    {
      id: 'other',
      title: 'Other',
      subtitle: 'custom content focus',
      description: 'Describe your unique content creation purpose and goals'
    }
  ]

  const selectedPersonaData = personas.find(p => p.id === selectedPersona)

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

    // Get any existing persona selection
    const existingPersona = localStorage.getItem('selectedPersona')
    const existingCustomPersona = localStorage.getItem('customPersonaText')
    if (existingPersona) {
      setSelectedPersona(existingPersona)
    }
    if (existingCustomPersona) {
      setCustomPersonaText(existingCustomPersona)
    }

    // Carousel effect for prompts
    const interval = setInterval(() => {
      setCurrentPromptIndex((prev) => (prev + 1) % storyPrompts.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [storyPrompts.length])

  // Show persona selection when story has content
  useEffect(() => {
    if (story.trim().length > 50) {
      setShowPersonaSelection(true)
    } else {
      setShowPersonaSelection(false)
    }
  }, [story])

  // NEW: Update Executive Prompt Builder when story changes
  useEffect(() => {
    if (story.trim().length > 10) {
      promptBuilder.updateStoryData(story)
    }
  }, [story, promptBuilder])

  // NEW: Update Executive Prompt Builder when persona changes
  useEffect(() => {
    if (selectedPersona) {
      promptBuilder.updatePersonaData(selectedPersona, customPersonaText)
    }
  }, [selectedPersona, customPersonaText, promptBuilder])

  const handleNext = () => {
    if (story.trim()) {
      localStorage.setItem('userStoryContext', story.trim())
      
      // Save persona data for Executive Prompt Builder
      if (selectedPersona) {
        localStorage.setItem('selectedPersona', selectedPersona)
        if (selectedPersona === 'other' && customPersonaText.trim()) {
          localStorage.setItem('customPersonaText', customPersonaText.trim())
        }
        // NEW: Ensure data is in Executive Prompt Builder
        promptBuilder.updatePersonaData(selectedPersona, customPersonaText)
      }
      
      // NEW: Ensure story data is in Executive Prompt Builder
      promptBuilder.updateStoryData(story.trim())
      
      console.log('🚀 Moving to Demographics with story and persona data captured')
      window.location.href = '/dashboard/create/demographics'
    } else {
      alert('Please tell us about your photo before continuing.')
    }
  }

  const handleSkip = () => {
    localStorage.setItem('userStoryContext', 'Amazing cultural experience in New Zealand')
    // Set default persona when skipping
    localStorage.setItem('selectedPersona', 'content-creator')
    
    // NEW: Update Executive Prompt Builder with defaults
    promptBuilder.updateStoryData('Amazing cultural experience in New Zealand')
    promptBuilder.updatePersonaData('content-creator', '')
    
    console.log('⏭️ Skipping story step with defaults')
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

        {/* Step Tracker - Updated to 6 steps */}
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
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#10b981' }}></div>
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
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#e5e7eb' }}></div>
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
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#e5e7eb' }}></div>
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
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#e5e7eb' }}></div>
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
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#e5e7eb' }}></div>
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
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          Tell Your Story
        </h1>
      </div>

      <div style={{ 
        flex: '1', 
        maxWidth: '800px', 
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

        {/* Story Input - Matching Photo Page Style */}
        <div style={{ textAlign: 'center', width: '100%', marginBottom: '2rem' }}>
          <div style={{
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto',
            position: 'relative'
          }}>
            <div style={{
              width: '100%',
              minHeight: '300px',
              border: '2px solid #d1d5db',
              borderRadius: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#fafafa',
              position: 'relative',
              padding: '1.5rem'
            }}>
              <h3 style={{
                fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '1rem',
                margin: '0 0 1rem 0',
                textAlign: 'left'
              }}>
                What's the story behind this photo? ✨
              </h3>
              
              {/* Rotating prompt suggestion */}
              <div style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #0ea5e9',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                marginBottom: '1rem',
                fontSize: '0.875rem',
                color: '#0369a1',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                opacity: story.length > 50 ? 0.6 : 1
              }}>
                💡 {storyPrompts[currentPromptIndex]}
              </div>

              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Share your experience... What made this moment special?"
                style={{
                  width: '100%',
                  flex: '1',
                  minHeight: '180px',
                  padding: '1rem',
                  border: 'none',
                  borderRadius: '1rem',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  lineHeight: '1.5',
                  resize: 'none',
                  outline: 'none',
                  backgroundColor: 'white',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.boxShadow = `0 0 0 2px ${BRAND_PURPLE}40`
                }}
                onBlur={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.boxShadow = 'none'
                }}
              />
              
              {/* Progress indicator */}
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                fontSize: '0.75rem',
                color: '#9ca3af',
                transition: 'opacity 0.3s ease'
              }}>
                {story.length}/600
              </div>
            </div>
          </div>
        </div>

        {/* Persona Selection - Shows when story has content */}
        {showPersonaSelection && (
          <div style={{ textAlign: 'center', width: '100%', marginBottom: '2rem' }}>
            <div style={{
              width: '100%',
              maxWidth: '500px',
              margin: '0 auto',
              position: 'relative'
            }}>
              <div style={{
                width: '100%',
                border: '2px solid #d1d5db',
                borderRadius: '1.5rem',
                backgroundColor: '#fafafa',
                padding: '1.5rem'
              }}>
                <h3 style={{
                  fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '1rem',
                  margin: '0 0 1rem 0',
                  textAlign: 'left'
                }}>
                  Who are you creating content as? 🎯
                </h3>

                <div style={{ position: 'relative' }}>
                  {/* Dropdown Button */}
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      backgroundColor: 'white',
                      border: '2px solid #e5e7eb',
                      borderRadius: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                      color: selectedPersona ? '#1f2937' : '#9ca3af',
                      transition: 'all 0.2s ease',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLButtonElement
                      target.style.borderColor = '#d1d5db'
                      target.style.backgroundColor = '#f9fafb'
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLButtonElement
                      target.style.borderColor = '#e5e7eb'
                      target.style.backgroundColor = 'white'
                    }}
                  >
                    <span>
                      {selectedPersonaData ? 
                        (selectedPersona === 'other' && customPersonaText.trim() ? 
                          `Other: ${customPersonaText.slice(0, 50)}${customPersonaText.length > 50 ? '...' : ''}` 
                          : selectedPersonaData.title
                        ) 
                        : 'Select your content creator type...'
                      }
                    </span>
                    <svg 
                      style={{ 
                        width: '20px',
                        height: '20px',
                        transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                      }} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown List */}
                  {isDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      right: '0',
                      backgroundColor: 'white',
                      border: '2px solid #e5e7eb',
                      borderRadius: '1rem',
                      marginTop: '0.5rem',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                      zIndex: 10,
                      maxHeight: '300px',
                      overflowY: 'auto'
                    }}>
                      {personas.map((persona, index) => (
                        <div key={persona.id}>
                          <div
                            onClick={() => {
                              setSelectedPersona(persona.id)
                              if (persona.id !== 'other') {
                                setIsDropdownOpen(false)
                              }
                            }}
                            style={{
                              padding: '1rem',
                              borderBottom: persona.id === 'other' ? 'none' : (index < personas.length - 1 ? '1px solid #f3f4f6' : 'none'),
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.75rem',
                              transition: 'background-color 0.2s ease',
                              backgroundColor: selectedPersona === persona.id ? '#eef2ff' : 'transparent'
                            }}
                            onMouseEnter={(e) => {
                              if (selectedPersona !== persona.id) {
                                e.currentTarget.style.backgroundColor = '#f9fafb'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (selectedPersona !== persona.id) {
                                e.currentTarget.style.backgroundColor = 'transparent'
                              }
                            }}
                          >
                            {/* Custom Checkbox */}
                            <div style={{
                              width: '18px',
                              height: '18px',
                              border: selectedPersona === persona.id ? '2px solid #6366f1' : '2px solid #d1d5db',
                              borderRadius: '4px',
                              backgroundColor: selectedPersona === persona.id ? '#6366f1' : 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginTop: '2px',
                              transition: 'all 0.2s ease'
                            }}>
                              {selectedPersona === persona.id && (
                                <svg width="12" height="12" fill="white" viewBox="0 0 12 12">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 3L4.5 8.5L2 6" />
                                </svg>
                              )}
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1, textAlign: 'left' }}>
                              <div style={{
                                fontWeight: '600',
                                color: '#1f2937',
                                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                marginBottom: '0.25rem'
                              }}>
                                {persona.title}
                              </div>
                              <div style={{
                                color: '#6366f1',
                                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                                fontWeight: '500',
                                marginBottom: '0.25rem'
                              }}>
                                {persona.subtitle}
                              </div>
                              <div style={{
                                color: '#6b7280',
                                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                                lineHeight: '1.4'
                              }}>
                                {persona.description}
                              </div>
                            </div>
                          </div>

                          {/* Custom Text Input for "Other" */}
                          {selectedPersona === 'other' && persona.id === 'other' && (
                            <div style={{
                              padding: '1rem',
                              borderTop: '1px solid #f3f4f6',
                              backgroundColor: '#f9fafb'
                            }}>
                              <textarea
                                value={customPersonaText}
                                onChange={(e) => setCustomPersonaText(e.target.value)}
                                placeholder="Describe your content creation goals and focus (e.g., 'Digital nomad sharing remote work experiences' or 'Local historian promoting cultural heritage')"
                                style={{
                                  width: '100%',
                                  minHeight: '80px',
                                  padding: '0.75rem',
                                  border: '2px solid #e5e7eb',
                                  borderRadius: '0.5rem',
                                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                  fontFamily: 'inherit',
                                  resize: 'vertical',
                                  outline: 'none',
                                  transition: 'border-color 0.2s ease'
                                }}
                                onFocus={(e) => {
                                  const target = e.target as HTMLTextAreaElement
                                  target.style.borderColor = '#6366f1'
                                }}
                                onBlur={(e) => {
                                  const target = e.target as HTMLTextAreaElement
                                  target.style.borderColor = '#e5e7eb'
                                }}
                              />
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: '0.5rem'
                              }}>
                                <div style={{
                                  fontSize: '0.75rem',
                                  color: '#6b7280'
                                }}>
                                  Help us understand your unique content goals
                                </div>
                                <button
                                  onClick={() => setIsDropdownOpen(false)}
                                  disabled={!customPersonaText.trim()}
                                  style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: customPersonaText.trim() ? '#6366f1' : '#e5e7eb',
                                    color: customPersonaText.trim() ? 'white' : '#9ca3af',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    cursor: customPersonaText.trim() ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.2s ease'
                                  }}
                                >
                                  Done
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '1rem',
          width: '100%',
          marginBottom: '1rem'
        }}>
          <button
            onClick={handleSkip}
            style={{
              background: '#f3f4f6',
              color: '#6b7280',
              fontSize: 'clamp(1rem, 3vw, 1.25rem)',
              fontWeight: '600',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
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
              fontSize: 'clamp(1.25rem, 4vw, 2rem)',
              fontWeight: '900',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: story.trim() ? 'pointer' : 'not-allowed',
              boxShadow: story.trim() ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
              transition: 'all 0.2s'
            }}
            className={story.trim() ? "transition-all hover:scale-105" : ""}
          >
            Continue →
          </button>
        </div>

        {/* Logo - Brand Reinforcement */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '1rem',
          paddingTop: '0'
        }}>
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
    </div>
  )
}
