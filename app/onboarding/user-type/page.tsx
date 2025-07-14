// Create new file: /app/onboarding/user-type/page.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

interface UserType {
  id: string
  title: string
  subtitle: string
  description: string
  benefits: string[]
  emoji: string
  examples: string[]
  nextStep: string
}

const userTypes: UserType[] = [
  {
    id: 'business',
    title: 'Business Content Creator',
    subtitle: 'Tourism/Hospitality/Community Business',
    description: 'Create professional content that drives bookings, builds credibility, and showcases your business authentically',
    benefits: [
      'Industry-specific content strategy',
      'Direct booking focus over OTAs', 
      'Professional brand positioning',
      'Cultural intelligence integration',
      'Business performance analytics'
    ],
    emoji: '🏢',
    examples: ['Hotels & accommodation', 'Restaurants & cafés', 'Tourist attractions', 'Cultural experiences', 'Community services'],
    nextStep: '/onboarding/business'
  },
  {
    id: 'personal',
    title: 'Personal Content Creator',
    subtitle: 'Individual Traveller/Content Creator',
    description: 'Share authentic travel experiences, build your personal brand, and inspire others with your unique perspective',
    benefits: [
      'Personal storytelling optimization',
      'Authentic travel experiences',
      'Social media growth strategies',
      'Cultural respect and awareness',
      'Audience engagement focus'
    ],
    emoji: '👤',
    examples: ['Travel bloggers', 'Social media influencers', 'Individual travellers', 'Cultural explorers', 'Adventure seekers'],
    nextStep: '/onboarding/persona'
  }
]

export default function UserTypeSelection() {
  const [selectedUserType, setSelectedUserType] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUserTypeSelect = (userTypeId: string) => {
    setSelectedUserType(userTypeId)
  }

  const handleSubmit = async () => {
    if (!selectedUserType) return

    setIsSubmitting(true)
    
    try {
      // Store user type for dual-path routing
      localStorage.setItem('userType', selectedUserType)
      
      // Get selected user type details
      const userType = userTypes.find(ut => ut.id === selectedUserType)
      localStorage.setItem('userTypeDetails', JSON.stringify(userType))
      
      // Route to appropriate next step
      const nextStep = userType?.nextStep || '/onboarding/business'
      window.location.href = nextStep
      
    } catch (error) {
      console.error('Failed to save user type:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${BRAND_BLUE} 0%, ${BRAND_PURPLE} 100%)`,
      color: 'white'
    }}>
      {/* Header */}
      <div style={{
        padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          fontWeight: '700',
          marginBottom: '1rem',
          lineHeight: '1.2'
        }}>
          🎯 What Type of Content Creator Are You?
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          opacity: 0.9,
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          Choose your path to get content perfectly tailored to your goals and audience.
        </p>
      </div>

      {/* User Type Options */}
      <div style={{
        flex: 1,
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
          maxWidth: '1000px',
          width: '100%',
          marginBottom: '3rem'
        }}>
          {userTypes.map((userType) => (
            <div
              key={userType.id}
              onClick={() => handleUserTypeSelect(userType.id)}
              style={{
                background: selectedUserType === userType.id 
                  ? 'rgba(255,255,255,0.25)' 
                  : 'rgba(255,255,255,0.1)',
                borderRadius: '20px',
                padding: '2rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: selectedUserType === userType.id 
                  ? '3px solid white' 
                  : '3px solid transparent',
                backdropFilter: 'blur(10px)',
                transform: selectedUserType === userType.id ? 'scale(1.02)' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                if (selectedUserType !== userType.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedUserType !== userType.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <div style={{
                fontSize: '3rem',
                textAlign: 'center',
                marginBottom: '1rem'
              }}>
                {userType.emoji}
              </div>
              
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
                textAlign: 'center'
              }}>
                {userType.title}
              </h3>
              
              <p style={{
                fontSize: '1rem',
                opacity: 0.8,
                marginBottom: '1rem',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                {userType.subtitle}
              </p>
              
              <p style={{
                fontSize: '0.95rem',
                marginBottom: '1.5rem',
                textAlign: 'center',
                lineHeight: '1.5'
              }}>
                {userType.description}
              </p>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '0.75rem',
                  textAlign: 'center'
                }}>
                  ✨ What You Get:
                </div>
                {userType.benefits.map((benefit, index) => (
                  <div key={index} style={{
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{ marginRight: '0.5rem' }}>✓</span>
                    {benefit}
                  </div>
                ))}
              </div>
              
              <div style={{
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '10px',
                padding: '1rem',
                fontSize: '0.875rem',
                fontStyle: 'italic',
                lineHeight: '1.4'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                  Perfect For:
                </div>
                {userType.examples.slice(0, 3).join(', ')}
                {userType.examples.length > 3 && '...'}
              </div>
              
              {selectedUserType === userType.id && (
                <div style={{
                  marginTop: '1rem',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: 'white',
                  fontSize: '1rem'
                }}>
                  ✓ Selected
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedUserType || isSubmitting}
          style={{
            background: selectedUserType 
              ? `linear-gradient(45deg, ${BRAND_ORANGE} 0%, ${BRAND_PURPLE} 100%)`
              : '#e5e7eb',
            color: selectedUserType ? 'white' : '#9ca3af',
            fontSize: 'clamp(1.25rem, 4vw, 2rem)',
            fontWeight: '900',
            padding: '1rem 3rem',
            borderRadius: '1rem',
            border: 'none',
            cursor: selectedUserType ? 'pointer' : 'not-allowed',
            boxShadow: selectedUserType ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
            transition: 'all 0.2s',
            transform: selectedUserType ? 'scale(1)' : 'scale(0.95)'
          }}
        >
          {isSubmitting ? 'Setting up your journey...' : 'Continue to Setup →'}
        </button>

        {/* Skip Option */}
        <Link 
          href="/onboarding/business" 
          style={{
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            fontSize: '1rem',
            marginTop: '1rem'
          }}
        >
          Skip - I'll choose later
        </Link>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ color: BRAND_PURPLE, fontSize: '1.25rem', fontWeight: '900' }}>click</span>
          <span style={{ color: BRAND_ORANGE, fontSize: '1.25rem', fontWeight: '900' }}>speak</span>
          <span style={{ color: BRAND_BLUE, fontSize: '1.25rem', fontWeight: '900' }}>send</span>
        </div>
      </div>
    </div>
  )
}
