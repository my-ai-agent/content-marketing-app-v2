'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import InterestDropdown, { Interest } from './InterestDropdown'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C' 
const BRAND_BLUE = '#11B3FF'

// Standardized Brand Logo Component
const BrandLogo = ({ size = 'default', layout = 'inline' }: { size?: 'default' | 'large', layout?: 'stacked' | 'inline' }) => (
  <div style={{ 
    display: layout === 'stacked' ? 'block' : 'flex',
    textAlign: 'center',
    alignItems: 'center',
    gap: layout === 'inline' ? '0.25rem' : '0'
  }}>
    <span style={{ 
      color: BRAND_PURPLE, 
      fontSize: size === 'large' ? 'clamp(2rem, 8vw, 3.5rem)' : 'clamp(1rem, 2.5vw, 1.25rem)',
      fontWeight: '900',
      display: layout === 'stacked' ? 'block' : 'inline',
      lineHeight: '0.9'
    }}>click</span>
    <span style={{ 
      color: BRAND_ORANGE, 
      fontSize: size === 'large' ? 'clamp(2rem, 8vw, 3.5rem)' : 'clamp(1rem, 2.5vw, 1.25rem)',
      fontWeight: '900',
      display: layout === 'stacked' ? 'block' : 'inline',
      lineHeight: '0.9'
    }}>speak</span>
    <span style={{ 
      color: BRAND_BLUE, 
      fontSize: size === 'large' ? 'clamp(2rem, 8vw, 3.5rem)' : 'clamp(1rem, 2.5vw, 1.25rem)',
      fontWeight: '900',
      display: layout === 'stacked' ? 'block' : 'inline',
      lineHeight: '0.9'
    }}>send</span>
  </div>
)

// Standardized Primary Button Component
const PrimaryButton = ({ 
  onClick, 
  children, 
  disabled = false, 
  size = 'default',
  style = {} 
}: { 
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
  size?: 'default' | 'large'
  style?: React.CSSProperties 
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      background: disabled 
        ? '#e5e7eb' 
        : `linear-gradient(135deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`,
      color: disabled ? '#9ca3af' : 'white',
      padding: size === 'large' ? '1.25rem 2.5rem' : '0.75rem 1.5rem',
      borderRadius: size === 'large' ? '1rem' : '0.75rem',
      fontSize: size === 'large' ? '1.25rem' : '1rem',
      fontWeight: '700',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      boxShadow: disabled ? 'none' : '0 4px 15px rgba(107, 46, 255, 0.2)',
      transition: 'all 0.3s ease',
      ...style
    }}
    onMouseOver={(e) => {
      if (!disabled) {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(107, 46, 255, 0.3)'
      }
    }}
    onMouseOut={(e) => {
      if (!disabled) {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(107, 46, 255, 0.2)'
      }
    }}
  >
    {children}
  </button>
)

// Standardized Step Tracker Component
const StepTracker = ({ currentStep }: { currentStep: number }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: '0.5rem', 
    marginBottom: '1.5rem' 
  }}>
    {[1, 2, 3, 4, 5, 6].map((step) => (
      <div key={step} style={{ 
        width: '2rem', 
        height: '2rem', 
        borderRadius: '50%', 
        backgroundColor: step <= currentStep ? (step === currentStep ? BRAND_PURPLE : BRAND_ORANGE) : '#e5e7eb',
        color: step <= currentStep ? 'white' : '#9ca3af',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: '0.875rem', 
        fontWeight: '600',
        transition: 'all 0.3s ease'
      }}>
        {step}
      </div>
    ))}
  </div>
)

const INTERESTS: Interest[] = [
    { value: 'cultural', label: 'Cultural Experiences', description: 'Māori experiences, cultural events, traditional arts, heritage sites, museums, festivals' },
    { value: 'adventure', label: 'Adventure & Outdoor Activities', description: 'Hiking, extreme sports, Great Walks, skiing, water sports, adrenaline activities' },
    { value: 'food-wine', label: 'Food & Wine', description: 'Wine tours, culinary experiences, local cuisine, cooking classes, food festivals' },
    { value: 'wellness', label: 'Relaxation & Wellness', description: 'Spa retreats, hot springs, wellness centres, meditation, yoga, luxury resorts' },
    { value: 'history', label: 'History & Heritage', description: 'Historical sites, battlefields, colonial history, archaeological sites, guided tours' },
    { value: 'photography', label: 'Photography & Social Media', description: 'Instagram spots, scenic viewpoints, photography tours, influencer experiences' },
    { value: 'nature', label: 'Gardens & Nature', description: 'Botanical gardens, Great Walks, national parks, wildlife encounters, eco-tours' },
    { value: 'arts', label: 'Arts & Creative Experiences', description: 'Art galleries, workshops, creative retreats, local artisans, craft experiences' }
]

export default function Interests() {
  const [selectedInterest, setSelectedInterest] = useState('')

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

  const selectedInterestObj = INTERESTS.find(interest => interest.value === selectedInterest)

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

        {/* Standardized Step Tracker */}
        <StepTracker currentStep={5} />

        {/* Title */}
        <h1 style={{ 
          fontSize: 'clamp(2rem, 6vw, 3rem)', 
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
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem auto'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '1rem'
          }}>
            Select Primary Interest
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '1rem'
          }}>
            Choose a primary interest, this helps AI to create effective messaging that resonates with your ideal reader
          </p>
          
          <InterestDropdown
            interests={INTERESTS}
            selectedInterest={selectedInterest}
            setSelectedInterest={setSelectedInterest}
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
              fontWeight: '600',
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

          <PrimaryButton
            onClick={handleNext}
            disabled={!selectedInterest}
            size="large"
          >
            Continue →
          </PrimaryButton>
        </div>

        {/* Logo */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          paddingTop: '2rem'
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <BrandLogo />
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
