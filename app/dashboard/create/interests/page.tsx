'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C' 
const BRAND_BLUE = '#11B3FF'

export default function Interests() {
  const [selectedInterest, setSelectedInterest] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const interests = [
    { value: 'cultural', label: 'Cultural Experiences', description: 'Māori experiences, cultural events, traditional arts, heritage sites, museums, festivals' },
    { value: 'adventure', label: 'Adventure & Outdoor Activities', description: 'Hiking, extreme sports, Great Walks, skiing, water sports, adrenaline activities' },
    { value: 'food-wine', label: 'Food & Wine', description: 'Wine tours, culinary experiences, local cuisine, cooking classes, food festivals' },
    { value: 'wellness', label: 'Relaxation & Wellness', description: 'Spa retreats, hot springs, wellness centers, meditation, yoga, luxury resorts' },
    { value: 'history', label: 'History & Heritage', description: 'Historical sites, battlefields, colonial history, archaeological sites, guided tours' },
    { value: 'photography', label: 'Photography & Social Media', description: 'Instagram spots, scenic viewpoints, photography tours, influencer experiences' },
    { value: 'nature', label: 'Gardens & Nature', description: 'Botanical gardens, Great Walks, national parks, wildlife encounters, eco-tours' },
    { value: 'arts', label: 'Arts & Creative Experiences', description: 'Art galleries, workshops, creative retreats, local artisans, craft experiences' }
  ]

  useEffect(() => {
    // Get any existing interest selection
    const existingInterest = localStorage.getItem('selectedInterests')
    if (existingInterest) {
      try {
        const parsed = JSON.parse(existingInterest)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedInterest(parsed[0])
        }
      } catch (error) {
        console.error('Error parsing existing interest:', error)
      }
    }
  }, [])

  const handleNext = () => {
    if (selectedInterest) {
      localStorage.setItem('selectedInterests', JSON.stringify([selectedInterest]))
      window.location.href = '/dashboard/create/platform'
    } else {
      alert('Please select an interest before continuing.')
    }
  }

  const handleSkip = () => {
    localStorage.setItem('selectedInterests', JSON.stringify(['cultural']))
    window.location.href = '/dashboard/create/platform'
  }

  const selectedInterestObj = interests.find(interest => interest.value === selectedInterest)

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
        <p style={{ 
          color: '#6b7280', 
          textAlign: 'center', 
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          What interests your audience most?
        </p>
        <p style={{ 
          color: '#9ca3af', 
          textAlign: 'center', 
          fontSize: 'clamp(0.875rem, 2vw, 1rem)',
          maxWidth: '700px',
          margin: '0.5rem auto 0 auto',
          fontStyle: 'italic'
        }}>
          Select your primary interest now - you can create additional content for other interests later!
        </p>
      </div>

      <div style={{ 
        flex: '1', 
        maxWidth: '900px', 
        margin: '0 auto', 
        width: '100%', 
        padding: '2rem 1rem' 
      }}>

        {/* Interest Selection */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '1rem'
          }}>
            🎯 Select Primary Interest
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '1rem'
          }}>
            Choose the interest that best matches your audience's preferences
          </p>
          
          {/* Custom Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                backgroundColor: 'white',
                color: selectedInterest ? '#374151' : '#9ca3af',
                outline: 'none',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onFocus={(e) => e.target.style.borderColor = BRAND_PURPLE}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              <span>
                {selectedInterestObj ? selectedInterestObj.label : 'Select primary interest...'}
              </span>
              <span style={{ 
                fontSize: '0.75rem', 
                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
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
                right: '0',
                backgroundColor: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                marginTop: '0.25rem',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 10,
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
              }}>
                {interests.map((interest, index) => (
                  <div
                    key={interest.value}
                    onClick={() => {
                      setSelectedInterest(interest.value)
                      setIsDropdownOpen(false)
                    }}
                    style={{
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      borderBottom: index < interests.length - 1 ? '1px solid #f3f4f6' : 'none',
                      backgroundColor: selectedInterest === interest.value ? '#f0f9ff' : 'white',
                      color: '#374151',
                      fontSize: '0.95rem'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedInterest !== interest.value) {
                        e.currentTarget.style.backgroundColor = '#f9fafb'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedInterest !== interest.value) {
                        e.currentTarget.style.backgroundColor = 'white'
                      }
                    }}
                  >
                    {interest.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Interest Description */}
          {selectedInterestObj && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#dcfce7',
              border: '1px solid #bbf7d0',
              borderRadius: '0.75rem'
            }}>
              <p style={{
                fontSize: '0.875rem',
                color: '#15803d',
                margin: '0',
                fontWeight: '500'
              }}>
                <strong>{selectedInterestObj.label}:</strong> {selectedInterestObj.description}
              </p>
            </div>
          )}
        </div>

        {/* Interest Targeting Benefits */}
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '1rem',
          padding: '1.5rem',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>💡</span>
          <span style={{ 
            color: '#1e40af', 
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            fontWeight: '500'
          }}>
            Selecting a primary interest helps create focused content that drives engagement with your chosen audience
          </span>
        </div>

        {/* Navigation Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
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
            disabled={!selectedInterest}
            style={{
              background: selectedInterest 
                ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                : '#e5e7eb',
              color: selectedInterest ? 'white' : '#9ca3af',
              fontSize: '1.25rem',
              fontWeight: '700',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: selectedInterest ? 'pointer' : 'not-allowed',
              boxShadow: selectedInterest ? '0 4px 15px rgba(107, 46, 255, 0.3)' : 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (selectedInterest) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(107, 46, 255, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedInterest) {
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
