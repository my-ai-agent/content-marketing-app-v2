'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

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

export default function TellYourStory() {
  const [story, setStory] = useState('')
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)

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

    return () => clearInterval(interval)
  }, [])

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

        {/* Story Input with Carousel Prompts */}
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
          
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
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
        </div>

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
    </div>
  )
}
