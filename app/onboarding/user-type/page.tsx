// Update file: /app/onboarding/user-type/page.tsx
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
  const [showTooltip, setShowTooltip] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUserTypeSelect = (userTypeId: string) => {
    setSelectedUserType(userTypeId)
    setShowTooltip('') // Close tooltip on selection
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
      backgroundColor: 'white'
    }}>
      
      {/* Header - matches Steps 1-6 pattern */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '2rem 1rem',
        borderBottom: '1px solid #f3f4f6'
      }}>

        {/* Title */}
        <h1 style={{ 
          fontSize: 'clamp(2rem, 6vw, 4rem)', 
          fontWeight: '700',
          color: '#1f2937',
          lineHeight: '1.2',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          🎯 What Type of Content Creator Are You?
        </h1>
        <p style={{ 
          color: '#6b7280', 
          textAlign: 'center', 
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Choose your path to get content perfectly tailored to your goals
        </p>
      </div>

      <div style={{ 
        flex: '1', 
        maxWidth: '900px', 
        margin: '0 auto', 
        width: '100%', 
        padding: '2rem 1rem' 
      }}>

        {/* User Type Selection - Mobile Optimized */}
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
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Select Your Creator Type
          </h3>
          
          {/* Top Window - User Type Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            {userTypes.map((userType) => (
              <div
                key={userType.id}
                style={{
                  position: 'relative',
                  marginBottom: '1rem'
                }}
              >
                <div
                  onClick={() => handleUserTypeSelect(userType.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    border: selectedUserType === userType.id ? `2px solid ${BRAND_PURPLE}` : '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    backgroundColor: selectedUserType === userType.id ? '#f0f9ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedUserType !== userType.id) {
                      e.currentTarget.style.borderColor = '#9ca3af'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedUserType !== userType.id) {
                      e.currentTarget.style.borderColor = '#e5e7eb'
                    }
                  }}
                >
                  {/* Checkbox */}
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #d1d5db',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: selectedUserType === userType.id ? BRAND_PURPLE : 'white',
                    borderColor: selectedUserType === userType.id ? BRAND_PURPLE : '#d1d5db',
                    marginRight: '1rem',
                    flexShrink: 0
                  }}>
                    {selectedUserType === userType.id && (
                      <span style={{ color: 'white', fontSize: '12px' }}>✓</span>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '0.25rem'
                    }}>
                      <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>
                        {userType.emoji}
                      </span>
                      <span style={{ 
                        fontWeight: '600', 
                        color: '#374151',
                        fontSize: '1rem'
                      }}>
                        {userType.title}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      margin: '0'
                    }}>
                      {userType.subtitle}
                    </p>
                  </div>

                  {/* Info Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowTooltip(showTooltip === userType.id ? '' : userType.id)
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: BRAND_PURPLE,
                      fontSize: '1.25rem',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px'
                    }}
                  >
                    ℹ️
                  </button>
                </div>

                {/* Tooltip/Details */}
                {showTooltip === userType.id && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    right: '0',
                    zIndex: 10,
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    marginTop: '0.5rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}>
                    <h4 style={{
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem'
                    }}>
                      What You Get:
                    </h4>
                    <div style={{ marginBottom: '1rem' }}>
                      {userType.benefits.slice(0, 3).map((benefit, index) => (
                        <div key={index} style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          marginBottom: '0.25rem',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                          {benefit}
                        </div>
                      ))}
                    </div>
                    <h4 style={{
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem'
                    }}>
                      Perfect For:
                    </h4>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      margin: '0',
                      fontStyle: 'italic'
                    }}>
                      {userType.examples.slice(0, 3).join(', ')}...
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
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
          <Link
            href="/dashboard"
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '500',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '2px solid #e5e7eb',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
          >
            Skip for now
          </Link>

          <button
            onClick={handleSubmit}
            disabled={!selectedUserType || isSubmitting}
            style={{
              background: selectedUserType 
                ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                : '#e5e7eb',
              color: selectedUserType ? 'white' : '#9ca3af',
              fontSize: '1.25rem',
              fontWeight: '700',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: selectedUserType ? 'pointer' : 'not-allowed',
              boxShadow: selectedUserType ? '0 4px 15px rgba(107, 46, 255, 0.3)' : 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (selectedUserType) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(107, 46, 255, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedUserType) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(107, 46, 255, 0.3)'
              }
            }}
          >
            {isSubmitting ? 'Setting up your journey...' : 'Continue →'}
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
    </div>
  )
}
