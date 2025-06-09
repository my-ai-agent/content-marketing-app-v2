'use client'
import Link from 'next/link'
import { useState } from 'react'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C' 
const BRAND_BLUE = '#11B3FF'

export default function Interests() {
  const [selectedInterest, setSelectedInterest] = useState('')

  // Enhanced lifestyle/interest options for tourism (8 categories)
  const allInterests = [
    'Cultural Experiences', 
    'Adventure & Outdoor Activities', 
    'Food & Wine', 
    'Relaxation & Wellness', 
    'History & Heritage', 
    'Photography & Social Media',
    'Arts & Creative Experiences',
    'Gardens & Nature'
  ]

  const handleNext = () => {
    if (!selectedInterest) {
      alert('Please select an interest before continuing.')
      return
    }
    localStorage.setItem('selectedInterests', JSON.stringify([selectedInterest]))
    window.location.href = '/dashboard/create/formats'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header with Step Indicator Only */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        padding: '1.5rem',
        width: '100%'
      }}>
        <div style={{ 
          color: '#6b7280', 
          fontWeight: '600',
          fontSize: 'clamp(0.875rem, 2vw, 1rem)'
        }}>
          Step 3 of 4
        </div>
      </div>

      {/* Logo Section - Centered like Steps 1 & 2 */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '15vh', 
        textAlign: 'center', 
        width: '100%' 
      }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div style={{ 
              color: BRAND_PURPLE, 
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
              fontWeight: '900',
              lineHeight: '0.9',
              marginBottom: '0.2rem',
              display: 'inline'
            }}>speak</div>
            <div style={{ 
              color: BRAND_ORANGE, 
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
              fontWeight: '900',
              lineHeight: '0.9',
              marginBottom: '0.2rem',
              display: 'inline',
              marginLeft: '0.25rem'
            }}>click</div>
            <div style={{ 
              color: BRAND_BLUE, 
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
              fontWeight: '900',
              lineHeight: '0.9',
              display: 'inline',
              marginLeft: '0.25rem'
            }}>send</div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
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
        
        {/* Page Title */}
        <div style={{ marginBottom: '3rem', width: '100%' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 auto',
            textAlign: 'center',
            lineHeight: '1.1',
            marginBottom: '1rem'
          }}>
            Audience Interests
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: '#6b7280',
            margin: '0 auto',
            maxWidth: '600px'
          }}>
            What interests your audience most?
          </p>
        </div>

        {/* Interests Selection Grid - 8 Categories */}
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {allInterests.map(interest => (
              <button
                key={interest}
                onClick={() => setSelectedInterest(interest)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.5rem 1rem',
                  backgroundColor: selectedInterest === interest ? '#ecfdf5' : 'white',
                  border: `2px solid ${selectedInterest === interest ? '#10b981' : '#e5e7eb'}`,
                  borderRadius: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  fontWeight: selectedInterest === interest ? '600' : '500',
                  color: selectedInterest === interest ? '#065f46' : '#374151',
                  textAlign: 'center',
                  minHeight: '80px'
                }}
                onMouseOver={(e) => {
                  if (selectedInterest !== interest) {
                    const target = e.target as HTMLButtonElement
                    target.style.borderColor = '#d1d5db'
                    target.style.backgroundColor = '#f9fafb'
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedInterest !== interest) {
                    const target = e.target as HTMLButtonElement
                    target.style.borderColor = '#e5e7eb'
                    target.style.backgroundColor = 'white'
                  }
                }}
              >
                {selectedInterest === interest && (
                  <span style={{ marginRight: '0.5rem', fontSize: '1.25rem' }}>✅</span>
                )}
                {interest}
              </button>
            ))}
          </div>

          {/* Selection Info - Updated for 8 categories */}
          <div style={{
            padding: '1rem',
            backgroundColor: '#f0f9ff',
            border: '1px solid #3b82f6',
            borderRadius: '0.75rem',
            marginBottom: '2rem',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            color: '#1e40af'
          }}>
            🎯 Select one primary interest to focus your story's appeal (includes NZ Great Walks in Gardens & Nature)
          </div>

        </div>

        {/* Spacing */}
        <div style={{ height: '2rem' }}></div>

        {/* Navigation Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          width: '100%', 
          maxWidth: '800px',
          gap: '1rem'
        }}>
          <Link 
            href="/dashboard/create/demographics"
            style={{ 
              color: '#6b7280', 
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              padding: '0.75rem 1.5rem'
            }}
          >
            ← Back
          </Link>

          <button
            onClick={handleNext}
            disabled={!selectedInterest}
            style={{
              padding: '1rem 2rem',
              borderRadius: '1rem',
              fontWeight: '900',
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              border: 'none',
              cursor: selectedInterest ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              background: selectedInterest
                ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                : '#e5e7eb',
              color: selectedInterest ? 'white' : '#9ca3af',
              boxShadow: selectedInterest ? '0 10px 25px -5px rgba(0, 0, 0, 0.2)' : 'none'
            }}
            onMouseOver={(e) => {
              if (selectedInterest) {
                const target = e.target as HTMLButtonElement
                target.style.transform = 'scale(1.02)'
              }
            }}
            onMouseOut={(e) => {
              if (selectedInterest) {
                const target = e.target as HTMLButtonElement
                target.style.transform = 'scale(1)'
              }
            }}
          >
            Next →
          </button>
        </div>

      </div>

      {/* Spacer for bottom */}
      <div style={{ height: '2rem' }}></div>

    </div>
  )
}
