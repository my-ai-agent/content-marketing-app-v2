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
      window.location.href = '/dashboard/create/platforms'
    } else {
      alert('Please share your story before continuing.')
    }
  }

  const handleRecord = () => {
    alert('Voice recording feature coming soon!')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header - Clean and Consistent */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1.5rem',
        width: '100%'
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            color: BRAND_PURPLE, 
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', 
            fontWeight: '900' 
          }}>speak</div>
          <div style={{ 
            color: BRAND_ORANGE, 
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', 
            fontWeight: '900',
            marginLeft: '0.25rem'
          }}>click</div>
          <div style={{ 
            color: BRAND_BLUE, 
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', 
            fontWeight: '900',
            marginLeft: '0.25rem'
          }}>send</div>
        </Link>
        
        <div style={{ 
          color: '#6b7280', 
          fontWeight: '600',
          fontSize: 'clamp(0.875rem, 2vw, 1rem)'
        }}>
          Step 1 of 4
        </div>
      </div>

      {/* Main Content - Using Landing Page Success Pattern */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '0 1rem',
        textAlign: 'center',
        width: '100%'
      }}>
        
        {/* Page Title - Same Approach as Landing Page */}
        <div style={{ marginBottom: '3rem', width: '100%' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 auto',
            textAlign: 'center',
            lineHeight: '1.1'
          }}>
            Create Your Story
          </h1>
        </div>

        {/* Input Method Toggle - Bulletproof Centering */}
        <div style={{ 
          marginBottom: '2rem',
          display: 'flex',
          backgroundColor: '#f3f4f6',
          borderRadius: '1rem',
          padding: '0.5rem',
          justifyContent: 'center'
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
            Type
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

        {/* Story Input Area - Landing Page Style */}
        <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
          {inputMethod === 'type' ? (
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Share your unique story here..."
              style={{
                width: '100%',
                height: '280px',
                padding: '2rem',
                border: '2px solid #e5e7eb',
                borderRadius: '1.5rem',
                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                resize: 'none',
                outline: 'none',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                lineHeight: '1.5',
                backgroundColor: 'white',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
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
              height: '280px',
              border: '2px dashed #d1d5db',
              borderRadius: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              backgroundColor: '#fafafa'
            }}>
              <div style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '1rem' }}>🎤</div>
              <h3 style={{ 
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', 
                fontWeight: '600', 
                color: '#374151', 
                marginBottom: '1.5rem',
                margin: '0 0 1.5rem 0'
              }}>
                Record Your Story
              </h3>
              <button
                onClick={handleRecord}
                style={{
                  padding: '1rem 2rem',
                  borderRadius: '1rem',
                  color: 'white',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  backgroundColor: BRAND_PURPLE
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                Start Recording
              </button>
              <p style={{ 
                fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)', 
                color: '#6b7280', 
                marginTop: '1rem',
                margin: '1rem 0 0 0'
              }}>
                Voice recording feature coming soon
              </p>
            </div>
          )}
          
          {/* Character Count - Same Style as Landing Page */}
          {inputMethod === 'type' && story && (
            <div style={{ 
              textAlign: 'right', 
              fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)', 
              color: '#9ca3af', 
              marginTop: '0.75rem' 
            }}>
              {story.length} characters
            </div>
          )}
        </div>

        {/* Spacing - Landing Page Style */}
        <div style={{ height: '3rem' }}></div>

        {/* Next Button - Exact Landing Page Approach */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <button
            onClick={handleNext}
            disabled={!story.trim()}
            style={{
              padding: '1.5rem 3rem',
              borderRadius: '1.5rem',
              fontWeight: '900',
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              border: 'none',
              cursor: story.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              background: story.trim() 
                ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                : '#e5e7eb',
              color: story.trim() ? 'white' : '#9ca3af',
              boxShadow: story.trim() ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
              display: 'block',
              margin: '0 auto'
            }}
            onMouseOver={(e) => {
              if (story.trim()) e.target.style.transform = 'scale(1.05)'
            }}
            onMouseOut={(e) => {
              if (story.trim()) e.target.style.transform = 'scale(1)'
            }}
          >
            Next →
          </button>
        </div>

      </div>

      {/* Bottom Navigation - Clean */}
      <div style={{ 
        padding: '1.5rem', 
        borderTop: '1px solid #f3f4f6',
        backgroundColor: 'white'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '700px',
          margin: '0 auto',
          width: '100%'
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
          <div style={{ 
            fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)', 
            color: '#9ca3af' 
          }}>
            Save draft feature coming soon
          </div>
        </div>
      </div>

    </div>
  )
}
