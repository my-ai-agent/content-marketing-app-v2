'use client'
import Link from 'next/link'
import { useState } from 'react'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C' 
const BRAND_BLUE = '#11B3FF'

export default function Demographics() {
  const [selectedDemographic, setSelectedDemographic] = useState('')

  const demographics = [
    'Female Travellers',
    'Families',
    'Young Adults (18-35)',
    'Business Travellers',
    'Solo Travellers',
    'Mature Travellers'
  ]

  const handleNext = () => {
    if (selectedDemographic) {
      localStorage.setItem('selectedDemographics', JSON.stringify([selectedDemographic]))
      window.location.href = '/dashboard/create/interests'
    } else {
      alert('Please select a target audience before continuing.')
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
            backgroundColor: '#1f2937', 
            color: 'white', 
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
        maxWidth: '800px', 
        margin: '0 auto', 
        width: '100%', 
        padding: '2rem 1rem' 
      }}>

        {/* Demographics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem',
          marginBottom: '3rem'
        }}>
          {demographics.map((demographic) => {
            const tooltips = {
              'Female Travellers': 'Solo female adventurers, women\'s groups, female business travellers, female event participants',
              'Families': 'Parents with children, multi-generational trips, visiting friends & relatives',
              'Young Adults (18-35)': 'Students, backpackers, young professionals, adventure seekers, environmental warriors',
              'Business Travellers': 'Corporate travellers, conference attendees, business meeting planners',
              'Solo Travellers': 'Independent explorers, digital nomads, solo adventure enthusiasts',
              'Mature Travellers': 'Empty nesters, retirees, luxury travellers, cultural enthusiasts'
            }

            return (
              <div key={demographic} style={{ position: 'relative' }}>
                <button
                  onClick={() => setSelectedDemographic(demographic)}
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    border: selectedDemographic === demographic ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                    borderRadius: '1rem',
                    backgroundColor: selectedDemographic === demographic ? '#eff6ff' : 'white',
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
                    if (selectedDemographic !== demographic) {
                      e.currentTarget.style.borderColor = '#9ca3af'
                      e.currentTarget.style.backgroundColor = '#f9fafb'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.1)'
                    }
                    // Show tooltip
                    const tooltip = e.currentTarget.parentElement?.querySelector('.tooltip') as HTMLElement
                    if (tooltip) {
                      tooltip.style.opacity = '1'
                      tooltip.style.visibility = 'visible'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedDemographic !== demographic) {
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
                  {demographic}
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
                  {tooltips[demographic as keyof typeof tooltips]}
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
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '1rem',
          padding: '1.5rem',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🎯</span>
          <span style={{ 
            color: '#1e40af', 
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            fontWeight: '500'
          }}>
            Select one target audience for the most effective messaging
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
            disabled={!selectedDemographic}
            style={{
              background: selectedDemographic 
                ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                : '#e5e7eb',
              color: selectedDemographic ? 'white' : '#9ca3af',
              fontSize: 'clamp(1.25rem, 4vw, 2rem)',
              fontWeight: '900',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: selectedDemographic ? 'pointer' : 'not-allowed',
              boxShadow: selectedDemographic ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
              display: 'block',
              margin: '0 auto',
              transition: 'all 0.2s'
            }}
            className={selectedDemographic ? "transition-all hover:scale-105" : ""}
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
