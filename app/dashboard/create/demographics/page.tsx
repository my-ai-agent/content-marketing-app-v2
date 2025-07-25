'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import DemographicDropdown, { Demographic } from './DemographicDropdown'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C' 
const BRAND_BLUE = '#11B3FF'

const DEMOGRAPHICS: Demographic[] = [
  { value: 'baby-boomers', label: 'Baby Boomers (1946-1964)', description: 'Comfort-seeking, knowledge-focused, heritage experiences' },
  { value: 'gen-x', label: 'Gen X (1965-1980)', description: 'Family-focused, value-conscious, authentic experiences' },
  { value: 'millennials', label: 'Millennials (1981-1996)', description: 'Experience-focused, cultural seekers, social media savvy' },
  { value: 'gen-z', label: 'Gen Z (1997-2012)', description: 'Digital natives prioritising authenticity and sustainability' },
  { value: 'female-travellers', label: 'Female Travellers', description: 'Solo female adventurers, women\'s groups, safety-conscious' },
  { value: 'families', label: 'Family Travellers', description: 'Multi-generational groups, child-friendly experiences' },
  { value: 'eco-tourism', label: 'Eco-Tourism Enthusiasts', description: 'Sustainability-focused, environmental conservation minded' },
  { value: 'vfr', label: 'Visiting Friends & Relatives', description: 'Personal connections, local experiences, extended stays' },
  { value: 'conference', label: 'Event/Conference Delegates', description: 'Business travellers, networking opportunities, efficiency-focused' },
  { value: 'independent', label: 'Free & Independent Travellers', description: 'Self-planned journeys, flexibility, off-the-beaten-path' },
  { value: 'luxury', label: 'Luxury/Premium Travellers', description: 'High-end experiences, personalised service, exclusive access' },
  { value: 'adventure', label: 'Adventure/Active Travellers', description: 'Outdoor experiences, physical activities, adrenaline seekers' },
  { value: 'cultural', label: 'Cultural Heritage Seekers', description: 'History enthusiasts, museum visitors, traditional experiences' },
  { value: 'digital-nomads', label: 'Digital Nomads', description: 'Remote workers, long-stay travellers, workspace requirements' },
  { value: 'honeymoon', label: 'Honeymoon/Romance Travellers', description: 'Couples experiences, romantic settings, special occasions' },
  { value: 'solo', label: 'Solo Travellers', description: 'Independent explorers, personal growth focused, flexible schedules' },
  { value: 'accessible', label: 'Accessible Tourism', description: 'Travellers with accessibility needs, inclusive experiences' }
]

export default function Demographics() {
  const [selectedDemographic, setSelectedDemographic] = useState('')

  useEffect(() => {
    // Get any existing demographic selection
    const existingDemographic = localStorage.getItem('selectedDemographics')
    if (existingDemographic) {
      try {
        const parsed = JSON.parse(existingDemographic)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedDemographic(parsed[0])
        }
      } catch (error) {
        console.error('Error parsing existing demographic:', error)
      }
    }
  }, [])

  const handleNext = () => {
    if (selectedDemographic) {
      localStorage.setItem('selectedDemographics', JSON.stringify([selectedDemographic]))
      window.location.href = '/dashboard/create/interests'
    } else {
      alert('Please select a target audience before continuing.')
    }
  }

  const handleSkip = () => {
    localStorage.setItem('selectedDemographics', JSON.stringify(['millennials']))
    window.location.href = '/dashboard/create/interests'
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
            backgroundColor: '#10b981', 
            color: 'white', 
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
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          Target Audience
        </h1>
        <p style={{ 
          color: '#6b7280', 
          textAlign: 'center', 
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Who is your story for?
        </p>
      </div>

      <div style={{ 
        flex: '1', 
        maxWidth: '900px', 
        margin: '0 auto', 
        width: '100%', 
        padding: '2rem 1rem' 
      }}>

        {/* Target Audience Selection */}
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
            🎯 Select Your Target Audience
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '1rem'
          }}>
            Choose a primary audience, this helps AI to create effective messaging that resonates with your ideal reader.
          </p>
          
          <DemographicDropdown
            demographics={DEMOGRAPHICS}
            selectedDemographic={selectedDemographic}
            setSelectedDemographic={setSelectedDemographic}
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
            disabled={!selectedDemographic}
            style={{
              background: selectedDemographic 
                ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                : '#e5e7eb',
              color: selectedDemographic ? 'white' : '#9ca3af',
              fontSize: '1.25rem',
              fontWeight: '700',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: selectedDemographic ? 'pointer' : 'not-allowed',
              boxShadow: selectedDemographic ? '0 4px 15px rgba(107, 46, 255, 0.3)' : 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (selectedDemographic) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(107, 46, 255, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedDemographic) {
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
          href="/dashboard/create/story"
          style={{ 
            color: '#6b7280', 
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)'
          }}
        >
          ← Back to Story
        </Link>
      </div>
    </div>
  )
}
