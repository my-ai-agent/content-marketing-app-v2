'use client'
import Link from 'next/link'
import { useState } from 'react'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C' 
const BRAND_BLUE = '#11B3FF'

export default function CreateStory() {
  const [story, setStory] = useState('')
  const [inputMethod, setInputMethod] = useState<'type' | 'record'>('type')

  const handleNext = () => {
    if (story.trim()) {
      localStorage.setItem('currentStory', story.trim())
      localStorage.setItem('storyInputMethod', inputMethod)
      window.location.href = '/dashboard/create/photo'
    } else {
      alert('Please share your story before continuing.')
    }
  }

  const handleRecord = () => {
    alert('Voice recording feature coming soon!')
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      backgroundColor: 'white'
    }}>
      
      {/* Header with Step Tracker Only */}
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
            backgroundColor: '#1f2937', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.875rem', 
            fontWeight: '600' 
          }}>1</div>
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
          Create Your Story
        </h1>
      </div>

      <div style={{ 
        flex: '1', 
        maxWidth: '800px', 
        margin: '0 auto', 
        width: '100%', 
        padding: '2rem 1rem' 
      }}>

        {/* Input Method Toggle */}
        <div style={{ textAlign: 'center', width: '100%', marginBottom: '2rem' }}>
          <div style={{ 
            display: 'inline-flex',
            backgroundColor: '#f3f4f6',
            borderRadius: '1rem',
            padding: '0.5rem'
          }}>
            <button
              type="button"
              onClick={() => setInputMethod('type')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: inputMethod === 'type' ? 'white' : 'transparent',
                color: inputMethod === 'type' ? '#1f2937' : '#6b7280',
                boxShadow: inputMethod === 'type' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)'
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>📝</span>
              Write
            </button>
            <button
              type="button"
              onClick={() => setInputMethod('record')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: inputMethod === 'record' ? 'white' : 'transparent',
                color: inputMethod === 'record' ? '#1f2937' : '#6b7280',
                boxShadow: inputMethod === 'record' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)'
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>🎤</span>
              Record
            </button>
          </div>
        </div>

        {/* Story Input Area */}
        <div style={{ textAlign: 'center', width: '100%', marginBottom: '3rem' }}>
          {inputMethod === 'type' ? (
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Write your unique story here, or copy and paste from your existing notes..."
              style={{
                width: '100%',
                maxWidth: '700px',
                height: '200px',
                padding: '1.5rem',
                border: '2px solid #e5e7eb',
                borderRadius: '1.5rem',
                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                resize: 'none',
                outline: 'none',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                lineHeight: '1.5',
                backgroundColor: 'white',
                transition: 'all 0.2s',
                boxSizing: 'border-box',
                display: 'block',
                margin: '0 auto'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6'
                e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb'
                e.target.style.boxShadow = 'none'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              maxWidth: '700px',
              height: '200px',
              border: '2px dashed #d1d5db',
              borderRadius: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              backgroundColor: '#fafafa',
              margin: '0 auto'
            }}>
              <div style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>🎤</div>
              <h3 style={{ 
                fontSize: 'clamp(1rem, 3vw, 1.25rem)', 
                fontWeight: '600', 
                color: '#374151', 
                marginBottom: '1rem',
                margin: '0 0 1rem 0'
              }}>
                Record Your Story
              </h3>
              <button
                onClick={handleRecord}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '1rem',
                  color: 'white',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  backgroundColor: BRAND_PURPLE
                }}
                className="transition-all hover:scale-105"
              >
                Start Recording
              </button>
            </div>
          )}
          
          {/* Character Count */}
          {inputMethod === 'type' && story && (
            <div style={{ 
              fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)', 
              color: '#9ca3af', 
              marginTop: '0.75rem',
              textAlign: 'right',
              maxWidth: '700px',
              margin: '0.75rem auto 0 auto'
            }}>
              {story.length} characters
            </div>
          )}
        </div>

        {/* Next Button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          width: '100%', 
          marginBottom: '2rem' 
        }}>
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
              display: 'block',
              margin: '0 auto',
              transition: 'all 0.2s'
            }}
            className={story.trim() ? "transition-all hover:scale-105" : ""}
          >
            Next →
          </button>
        </div>

        {/* Logo - Brand Reinforcement */}
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
            }}>speak</div>
            <div style={{ 
              color: BRAND_ORANGE, 
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', 
              fontWeight: '900',
              display: 'inline',
              marginLeft: '0.25rem'
            }}>click</div>
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
          href="/"
          style={{ 
            color: '#6b7280', 
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)'
          }}
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
