'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getPlanLimits } from '../../../config/plans'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C' 
const BRAND_BLUE = '#11B3FF'

export default function Demographics() {
  const userPlan = 'free'
  const planLimits = getPlanLimits(userPlan)
  const [selectedDemographic, setSelectedDemographic] = useState('')
  const [story, setStory] = useState('')

  useEffect(() => {
    const savedStory = localStorage.getItem('currentStory')
    if (savedStory) setStory(savedStory)
  }, [])

  // Updated demographics list with respectful terminology
  const allDemographics = [
    'Female Travellers', 
    'Families', 
    'Young Adults (18-35)', 
    'Business Travellers', 
    'Solo Travellers', 
    'Mature Travellers'
  ]

  const handleNext = () => {
    if (!selectedDemographic) {
      alert('Please select your target audience before continuing.')
      return
    }
    // Save single selection (not array since we only allow one)
    localStorage.setItem('selectedDemographics', JSON.stringify([selectedDemographic]))
    window.location.href = '/dashboard/create/interests'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header - Same as Step 1 Success Pattern */}
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
          Step 2 of 4
        </div>
      </div>

      {/* Main Content - Using Step 1 Success Pattern */}
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
            Target Audience
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: '#6b7280',
            margin: '0 auto',
            maxWidth: '600px'
          }}>
            Who is your story for?
          </p>
        </div>

        {/* Demographics Selection Grid - Single Selection */}
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {allDemographics.map(demo => (
              <button
                key={demo}
                onClick={() => setSelectedDemographic(demo)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.5rem 1rem',
                  backgroundColor: selectedDemographic === demo ? '#ecfdf5' : 'white',
                  border: `2px solid ${selectedDemographic === demo ? '#10b981' : '#e5e7eb'}`,
                  borderRadius: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  fontWeight: selectedDemographic === demo ? '600' : '500',
                  color: selectedDemographic === demo ? '#065f46' : '#374151',
                  textAlign: 'center',
                  minHeight: '80px'
                }}
                onMouseOver={(e) => {
                  if (selectedDemographic !== demo) {
                    e.target.style.borderColor = '#d1d5db'
                    e.target.style.backgroundColor = '#f9fafb'
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedDemographic !== demo) {
                    e.target.style.borderColor = '#e5e7eb'
                    e.target.style.backgroundColor = 'white'
                  }
                }}
              >
                {selectedDemographic === demo && (
                  <span style={{ marginRight: '0.5rem', fontSize: '1.25rem' }}>✅</span>
                )}
                {demo}
              </button>
            ))}
          </div>

          {/* Single Selection Info */}
          <div style={{
            padding: '1rem',
            backgroundColor: '#f0f9ff',
            border: '1px solid #3b82f6',
            borderRadius: '0.75rem',
            marginBottom: '2rem',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            color: '#1e40af'
          }}>
            🎯 Select one target audience for the most effective messaging
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
          maxWidth: '600px',
          gap: '1rem'
        }}>
          <Link 
            href="/dashboard/create"
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
            disabled={!selectedDemographic}
            style={{
              padding: '1rem 2rem',
              borderRadius: '1rem',
              fontWeight: '900',
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              border: 'none',
              cursor: selectedDemographic ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              background: selectedDemographic
                ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                : '#e5e7eb',
              color: selectedDemographic ? 'white' : '#9ca3af',
              boxShadow: selectedDemographic ? '0 10px 25px -5px rgba(0, 0, 0, 0.2)' : 'none'
            }}
            onMouseOver={(e) => {
              if (selectedDemographic) e.target.style.transform = 'scale(1.02)'
            }}
            onMouseOut={(e) => {
              if (selectedDemographic) e.target.style.transform = 'scale(1)'
            }}
          >
            Next →
          </button>
        </div>

        {/* Story Preview - Enhanced */}
        {story && (
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem',
            maxWidth: '600px',
            width: '100%'
          }}>
            <p style={{ 
              fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)', 
              color: '#64748b',
              margin: 0,
              fontStyle: 'italic'
            }}>
              Your story: "{story.substring(0, 80)}..."
            </p>
          </div>
        )}

      </div>

      {/* Spacer for bottom */}
      <div style={{ height: '2rem' }}></div>

    </div>
  )
}
