'use client'
import Link from 'next/link'
import { useState } from 'react'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C' 
const BRAND_BLUE = '#11B3FF'

export default function Interests() {
  const [selectedInterest, setSelectedInterest] = useState('')

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
      window.location.href = '/dashboard/create/results'
    } else {
      alert('Please select an interest before continuing.')
    }
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
            backgroundColor: '#1f2937', 
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
          Select your primary interest now - you can create an additional content publication for other interests later!
        </p>
      </div>

      <div style={{ 
        flex: '1', 
        maxWidth: '900px', 
        margin: '0 auto', 
        width: '100%', 
        padding: '2rem 1rem' 
      }}>

        {/* Interests Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem',
          marginBottom: '3rem'
        }}>
          {interests.map((interest) => {
            const tooltips = {
              'Cultural Experiences': 'Māori experiences, cultural events, traditional arts, heritage sites, museums, festivals',
              'Adventure & Outdoor Activities': 'Hiking, extreme sports, Great Walks, skiing, water sports, adrenaline activities',
              'Food & Wine': 'Wine tours, culinary experiences, local cuisine, cooking classes, food festivals',
              'Relaxation & Wellness': 'Spa retreats, hot springs, wellness centers, meditation, yoga, luxury resorts',
              'History & Heritage': 'Historical sites, battlefields, colonial history, archaeological sites, guided tours',
              'Photography & Social Media': 'Instagram spots, scenic viewpoints, photography tours, influencer experiences',
              'Gardens & Nature': 'Botanical gardens, Great Walks, national parks, wildlife encounters, eco-tours',
              'Arts & Creative Experiences': 'Art galleries, workshops, creative retreats, local artisans, craft experiences'
            }

            return (
              <div key={interest} style={{ position: 'relative' }}>
                <button
                  onClick={() => setSelectedInterest(interest)}
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    border: selectedInterest === interest ? '2px solid #10b981' : '2px solid #e5e7eb',
                    borderRadius: '1rem',
                    backgroundColor: selectedInterest === interest ? '#dcfce7' : 'white',
                    color: '#374151',
                    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    minHeight: '4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedInterest !== interest) {
                      e.currentTarget.style.borderColor = '#9ca3af'
                      e.currentTarget.style.backgroundColor = '#f9fafb'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.1)'
                    }
                    // Show tooltip
                    const tooltip = e.currentTarget.parentElement?.querySelector('.tooltip') as HTMLElement
                    if (tooltip) {
                      tooltip.style.opacity = '1'
                      tooltip.style.visibility = 'visible'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedInterest !== interest) {
                      e.currentTarget.style.borderColor = '#e5e7eb'
                      e.currentTarget.style.backgroundColor = 'white'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }
                    // Hide tooltip
                    const tooltip = e.currentTarget.parentElement?.querySelector('.tooltip') as HTMLElement
                    if (tooltip) {
                      tooltip.style.opacity = '0'
                      tooltip.style.visibility = 'hidden'
                    }
                  }}
                >
                  {interest}
                </button>
                
                {/* Tooltip */}
                <div 
                  className="tooltip"
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#1f2937',
                    color: 'white',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    opacity: '0',
                    visibility: 'hidden',
                    transition: 'all 0.3s ease',
                    zIndex: '10',
                    marginBottom: '0.5rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    maxWidth: '280px',
                    whiteSpace: 'normal',
                    textAlign: 'center',
                    lineHeight: '1.3'
                  }}
                >
                  {tooltips[interest as keyof typeof tooltips]}
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid #1f2937'
                  }}></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Selection Guidance */}
        <div style={{
          backgroundColor: '#dcfce7',
          border: '1px solid #bbf7d0',
          borderRadius: '1rem',
          padding: '1.5rem',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🎯</span>
          <span style={{ 
            color: '#15803d', 
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            fontWeight: '500'
          }}>
            Select one primary interest for the most effective content targeting
          </span>
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
              display: 'block',
              margin: '0 auto',
              transition: 'all 0.2s'
            }}
            className={selectedInterest ? "transition-all hover:scale-105" : ""}
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
