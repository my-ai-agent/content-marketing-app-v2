'use client'
import Link from 'next/link'
import { useState } from 'react'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C' 
const BRAND_BLUE = '#11B3FF'

export default function Interests() {
  const [selectedInterest, setSelectedInterest] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const interests = [
    'Cultural Experiences',
    'Adventure & Outdoor Activities',
    'Food & Wine',
    'Relaxation & Wellness',
    'History & Heritage',
    'Photography & Social Media',
    'Gardens & Nature',
    'Arts & Creative Experiences'
  ]

  const handleNext = () => {
    if (selectedInterest) {
      localStorage.setItem('selectedInterests', JSON.stringify([selectedInterest]))
      window.location.href = '/dashboard/create/platform'
    } else {
      alert('Please select an interest before continuing.')
    }
  }

  const handleSkip = () => {
    localStorage.setItem('selectedInterests', JSON.stringify(['Cultural Experiences']))
    window.location.href = '/dashboard/create/platform'
  }

  const handleDropdownSelect = (interest: string) => {
    setSelectedInterest(interest)
    setIsDropdownOpen(false)
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
          }}>3</div>
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
          Audience Interests
        </h1>
      </div>

      <div style={{ 
        flex: '1', 
        maxWidth: '800px', 
        margin: '0 auto', 
        width: '100%', 
        padding: '2rem 1rem' 
      }}>

        {/* Single Dropdown Selection - Matching Previous Pages Style */}
        <div style={{ textAlign: 'center', width: '100%', marginBottom: '3rem' }}>
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
                What interests your audience most? 🎯
              </h3>

              {/* Custom Dropdown */}
              <div style={{ position: 'relative', width: '100%' }}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: 'none',
                    borderRadius: '1rem',
                    backgroundColor: 'white',
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: isDropdownOpen ? `0 0 0 2px ${BRAND_PURPLE}40` : '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    color: selectedInterest ? '#374151' : '#9ca3af',
                    fontWeight: selectedInterest ? '500' : '400'
                  }}
                >
                  <span style={{ 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap',
                    maxWidth: '90%'
                  }}>
                    {selectedInterest || 'Select your audience interest...'}
                  </span>
                  <span style={{ 
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    fontSize: '1.2rem'
                  }}>
                    ▼
                  </span>
                </button>

                {/* Dropdown Options */}
                {isDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    width: '100%',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '1rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    zIndex: '10',
                    marginTop: '0.5rem',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    {interests.map((interest, index) => (
                      <button
                        key={index}
                        onClick={() => handleDropdownSelect(interest)}
                        style={{
                          width: '100%',
                          padding: '1rem',
                          border: 'none',
                          backgroundColor: 'transparent',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                          color: '#374151',
                          borderBottom: index < interests.length - 1 ? '1px solid #f3f4f6' : 'none',
                          transition: 'background-color 0.2s ease',
                          borderRadius: index === 0 ? '1rem 1rem 0 0' : index === interests.length - 1 ? '0 0 1rem 1rem' : '0'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8fafc'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selection Display */}
              {selectedInterest && (
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #0ea5e9',
                  borderRadius: '0.75rem',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  color: '#0369a1',
                  fontWeight: '500'
                }}>
                  ✓ Selected: {selectedInterest}
                </div>
              )}
            </div>
          </div>
        </div>

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
            disabled={!selectedInterest}
            style={{
              background: selectedInterest 
                ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                : '#e5e7eb',
              color: selectedInterest ? 'white' : '#9ca3af',
              fontSize: 'clamp(1.25rem, 4vw, 2rem)',
              fontWeight: '900',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: selectedInterest ? 'pointer' : 'not-allowed',
              boxShadow: selectedInterest ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
              transition: 'all 0.2s'
            }}
            className={selectedInterest ? "transition-all hover:scale-105" : ""}
          >
            Continue →
          </button>
        </div>

        {/* Logo - Brand Reinforcement - Deactivated */}
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
          href="/dashboard/create/demographics"
          style={{ 
            color: '#6b7280', 
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)'
          }}
        >
          ← Back to Target Audience
        </Link>
      </div>
    </div>
  )
}
