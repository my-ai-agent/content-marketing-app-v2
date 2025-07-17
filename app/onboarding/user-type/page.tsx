'use client'
import { useState } from 'react'
import Link from 'next/link'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

// Beta access codes
const BETA_CODES = [
  'CULTURAL2025',
  'MAORI2025', 
  'TOURISM2025',
  'KAITIAKI2025',
  'AOTEAROA2025',
  'WELLNESS2025',
  'HERITAGE2025',
  'ADVENTURE2025',
  'DISCOVER2025',
  'AUTHENTIC2025'
]

// Business types for business users
const businessTypes = {
  'Tourism Business': [
    { value: 'visitor-attraction', label: 'Visitor Attraction', description: 'Museums, Theme Parks, Cultural Sites' },
    { value: 'accommodation', label: 'Accommodation', description: 'Hotels, B&Bs, Holiday Parks' },
    { value: 'food-beverage', label: 'Food & Beverage', description: 'Restaurants, Cafes, Wineries' },
    { value: 'tours-activities', label: 'Tours & Activities', description: 'Guided Tours, Adventure Activities' },
    { value: 'cultural-heritage', label: 'Cultural & Heritage', description: 'Marae Visits, Cultural Performances' },
    { value: 'wellness-spa', label: 'Wellness & Spa', description: 'Hot Springs, Spa Retreats' }
  ],
  'Small Business': [
    { value: 'local-retail', label: 'Local Retail', description: 'Shops, Markets, Boutiques' },
    { value: 'professional-services', label: 'Professional Services', description: 'Legal, Accounting, Consulting' },
    { value: 'health-fitness', label: 'Health & Fitness', description: 'Gyms, Clinics, Wellness' }
  ],
  'Community Service': [
    { value: 'non-profit', label: 'Non-Profit', description: 'Charities, Foundations' },
    { value: 'government-local', label: 'Local Government', description: 'Councils, Public Services' },
    { value: 'education', label: 'Education', description: 'Schools, Libraries, Training' }
  ]
}

// Personal personas for personal users
const personalPersonas = [
  { id: 'cultural-explorer', title: 'Cultural Explorer', description: 'Heritage & tradition focused', emoji: '🪶' },
  { id: 'adventure-seeker', title: 'Adventure Seeker', description: 'Active & outdoor focused', emoji: '🌟' },
  { id: 'content-creator', title: 'Content Creator', description: 'Social media & blog creator', emoji: '📱' },
  { id: 'family-storyteller', title: 'Family Storyteller', description: 'Multi-generational experiences', emoji: '👨‍👩‍👧‍👦' },
  { id: 'independent-traveller', title: 'Independent Traveller', description: 'Personal experience sharer', emoji: '🎒' }
]

// New Zealand locations with iwi names
const nzLocations = [
  { value: 'auckland', label: 'Auckland (Tāmaki Makaurau)' },
  { value: 'wellington', label: 'Wellington (Te Whanganui-a-Tara)' },
  { value: 'christchurch', label: 'Christchurch (Ōtautahi)' },
  { value: 'hamilton', label: 'Hamilton (Kirikiriroa)' },
  { value: 'tauranga', label: 'Tauranga (Tauranga Moana)' },
  { value: 'napier', label: 'Napier (Ahuriri)' },
  { value: 'palmerston-north', label: 'Palmerston North (Papaioea)' },
  { value: 'nelson', label: 'Nelson (Whakatū)' },
  { value: 'rotorua', label: 'Rotorua (Te Rotorua-nui-a-Kahumatamomoe)' },
  { value: 'queenstown', label: 'Queenstown (Tāhuna)' }
]

export default function UnifiedOnboarding() {
  // Beta access state
  const [betaCode, setBetaCode] = useState('')
  const [isBetaValidated, setIsBetaValidated] = useState(false)
  const [betaCodeError, setBetaCodeError] = useState('')
  const [showWaitlist, setShowWaitlist] = useState(false)

  // Account Setup (Window 1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [location, setLocation] = useState('')
  const [culturalConnection, setCulturalConnection] = useState('')
  
  // User Type Selection (Window 2)
  const [userType, setUserType] = useState('') // 'business' or 'personal'
  
  // Business Selection (Window 3a)
  const [businessCategory, setBusinessCategory] = useState('')
  const [businessType, setBusinessType] = useState('')
  
  // Personal Selection (Window 3b)
  const [personalPersona, setPersonalPersona] = useState('')
  
  // Privacy consent
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Terms modal
  const [showTermsModal, setShowTermsModal] = useState(false)

  // Beta code validation
  const validateBetaCode = () => {
    const code = betaCode.toUpperCase().trim()
    if (BETA_CODES.includes(code)) {
      setIsBetaValidated(true)
      setBetaCodeError('')
      localStorage.setItem('betaAccess', 'validated')
    } else {
      setBetaCodeError('Invalid access code. Please check and try again.')
      setTimeout(() => {
        setShowWaitlist(true)
      }, 2000)
    }
  }

  const handleSubmit = async () => {
    if (!name || !email || !location || !userType) return
    if (userType === 'business' && (!businessCategory || !businessType)) return
    if (userType === 'personal' && !personalPersona) return

    setIsSubmitting(true)
    
    try {
      // Create complete user profile
      const userProfile = {
        profile: {
          name,
          email,
          location,
          culturalConnection,
          userType
        },
        business: userType === 'business' ? {
          category: businessCategory,
          type: businessType
        } : null,
        personal: userType === 'personal' ? {
          persona: personalPersona
        } : null,
        betaAccess: true,
        completedAt: new Date().toISOString()
      }
      
      // Store in localStorage
      localStorage.setItem('userProfile', JSON.stringify(userProfile))
      localStorage.setItem('userToken', 'authenticated')
      localStorage.setItem('userType', userType)
      
      // Route directly to content creation
      window.location.href = '/dashboard/create/photo'
      
    } catch (error) {
      console.error('Failed to save profile:', error)
      setIsSubmitting(false)
    }
  }

  const canSubmit = name && email && location && userType && privacyConsent &&
    ((userType === 'business' && businessCategory && businessType) ||
     (userType === 'personal' && personalPersona))

  // Waitlist Component
  const WaitlistPage = () => (
    <div style={{ 
      textAlign: 'center', 
      padding: '3rem 1rem',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <div style={{
        fontSize: '4rem',
        marginBottom: '1.5rem'
      }}>🌟</div>
      
      <h1 style={{
        fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
        fontWeight: '700',
        color: '#111827',
        marginBottom: '1rem'
      }}>
        Join the Waitlist
      </h1>
      
      <p style={{
        fontSize: '1.125rem',
        color: '#6b7280',
        marginBottom: '2rem',
        lineHeight: '1.6'
      }}>
        Click Speak Send is currently in private beta. Join our waitlist to be notified when we launch publicly!
      </p>
      
      <div style={{
        backgroundColor: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#0c4a6e',
          marginBottom: '0.75rem'
        }}>
          🚀 What's Coming?
        </h3>
        <ul style={{
          textAlign: 'left',
          color: '#0c4a6e',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          paddingLeft: '1rem'
        }}>
          <li>AI-powered cultural content generation</li>
          <li>Multi-platform story optimization</li>
          <li>Māori cultural intelligence integration</li>
          <li>QR code sharing system</li>
        </ul>
      </div>
      
      <button
        onClick={() => {
          alert('Thank you for your interest! We\'ll notify you when Click Speak Send launches.')
          window.location.href = '/'
        }}
        style={{
          background: `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`,
          color: 'white',
          fontSize: '1.125rem',
          fontWeight: '600',
          padding: '1rem 2rem',
          borderRadius: '0.75rem',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '1rem'
        }}
      >
        Join Waitlist
      </button>
      
      <div style={{ marginTop: '2rem' }}>
        <Link 
          href="/"
          style={{
            color: '#6b7280',
            textDecoration: 'none',
            fontSize: '0.875rem'
          }}
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )

  // Terms & Conditions Modal Component
  const TermsModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        width: '100%',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={() => setShowTermsModal(false)}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#6b7280',
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>

        {/* Terms Content */}
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '1.5rem',
          paddingRight: '2rem'
        }}>
          Terms & Conditions
        </h2>

        <div style={{
          fontSize: '0.875rem',
          lineHeight: '1.6',
          color: '#374151',
          marginBottom: '2rem'
        }}>
          
          <h3 style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#111827' }}>
            1. Service Description
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            Click Speak Send is an AI-powered content creation platform that generates culturally-intelligent tourism content using your photos and stories.
          </p>

          <h3 style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#111827' }}>
            2. Content and Privacy
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            • Your photos and stories are processed by AI to generate content<br/>
            • All data is deleted from AI memory after processing<br/>
            • We respect cultural protocols and Mātauranga Māori<br/>
            • Generated content remains your intellectual property
          </p>

          <h3 style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#111827' }}>
            3. Cultural Responsibility
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            We are committed to protecting indigenous knowledge and cultural heritage. Our AI is designed to respect Te Tiriti o Waitangi principles and Māori cultural protocols.
          </p>

          <h3 style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#111827' }}>
            4. User Responsibilities
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            • Ensure you have rights to photos you upload<br/>
            • Use generated content respectfully<br/>
            • Respect cultural significance of places and people<br/>
            • Follow platform-specific guidelines when sharing
          </p>

          <h3 style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#111827' }}>
            5. Service Availability
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            We provide this service "as is" and reserve the right to modify or discontinue features. Your subscription includes access to AI content generation as described in your plan.
          </p>

          <h3 style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#111827' }}>
            6. Contact
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            Questions about these terms? Contact us at support@clickspeaksend.com
          </p>

          <p style={{ 
            fontSize: '0.75rem', 
            color: '#6b7280', 
            fontStyle: 'italic',
            marginTop: '1.5rem' 
          }}>
            Last updated: July 2025
          </p>
        </div>

        {/* Accept Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => setShowTermsModal(false)}
            style={{
              background: `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`,
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              padding: '0.75rem 2rem',
              borderRadius: '0.75rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )

  // Show waitlist if user failed beta validation
  if (showWaitlist) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ 
          maxWidth: '600px', 
          margin: '0 auto', 
          width: '100%', 
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          justifyContent: 'center'
        }}>
          <WaitlistPage />
        </div>
      </div>
    )
  }

  // Show beta access code entry if not validated
  if (!isBetaValidated) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb'
      }}>
        
        {/* 600px Mobile-First Container */}
        <div style={{ 
          maxWidth: '600px', 
          margin: '0 auto', 
          width: '100%', 
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          justifyContent: 'center'
        }}>

          {/* Beta Access Code Entry */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            
            <div style={{
              fontSize: '3rem',
              marginBottom: '1.5rem'
            }}>🔑</div>
            
            <h1 style={{
              fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Beta Access Required
            </h1>
            
            <p style={{
              color: '#6b7280',
              fontSize: '1.125rem',
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              Click Speak Send is currently in private beta testing.<br/>
              Enter your access code to continue.
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <input
                type="text"
                value={betaCode}
                onChange={(e) => {
                  setBetaCode(e.target.value)
                  setBetaCodeError('')
                }}
                placeholder="Enter your beta access code"
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: betaCodeError ? '2px solid #ef4444' : '2px solid #d1d5db',
                  borderRadius: '0.75rem',
                  fontSize: '1.125rem',
                  textAlign: 'center',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  textTransform: 'uppercase'
                }}
                onFocus={(e) => e.target.style.borderColor = betaCodeError ? '#ef4444' : BRAND_PURPLE}
                onBlur={(e) => e.target.style.borderColor = betaCodeError ? '#ef4444' : '#d1d5db'}
                onKeyPress={(e) => e.key === 'Enter' && validateBetaCode()}
              />
              
              {betaCodeError && (
                <div style={{
                  color: '#ef4444',
                  fontSize: '0.875rem',
                  backgroundColor: userType === 'business' ? BRAND_PURPLE : 'white',
                borderColor: userType === 'business' ? BRAND_PURPLE : '#d1d5db',
                marginRight: '1rem'
              }}>
                {userType === 'business' && (
                  <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }}></div>
                )}
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                  🏢 Business Content Creator
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Tourism/Hospitality/Community Business
                </div>
              </div>
            </div>
            
            {/* Personal Option */}
            <div
              onClick={() => setUserType('personal')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                border: userType === 'personal' ? `2px solid ${BRAND_PURPLE}` : '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                backgroundColor: userType === 'personal' ? '#f0f9ff' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #d1d5db',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: userType === 'personal' ? BRAND_PURPLE : 'white',
                borderColor: userType === 'personal' ? BRAND_PURPLE : '#d1d5db',
                marginRight: '1rem'
              }}>
                {userType === 'personal' && (
                  <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }}></div>
                )}
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                  👤 Personal Content Creator
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Individual Traveller/Content Creator
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Window 3a: Business Selection */}
        {userType === 'business' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>🏢</span> Business Details
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Business Category *
                </label>
                <select
                  value={businessCategory}
                  onChange={(e) => {
                    setBusinessCategory(e.target.value)
                    setBusinessType('')
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select business category...</option>
                  {Object.keys(businessTypes).map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {businessCategory && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Business Type *
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      outline: 'none',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Select business type...</option>
                    {businessTypes[businessCategory as keyof typeof businessTypes]?.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label} - {type.description}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Window 3b: Personal Selection */}
        {userType === 'personal' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>🎭</span> Choose Your Voice
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {personalPersonas.map((persona) => (
                <div
                  key={persona.id}
                  onClick={() => setPersonalPersona(persona.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    border: personalPersona === persona.id ? `2px solid ${BRAND_PURPLE}` : '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    backgroundColor: personalPersona === persona.id ? '#f0f9ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #d1d5db',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: personalPersona === persona.id ? BRAND_PURPLE : 'white',
                    borderColor: personalPersona === persona.id ? BRAND_PURPLE : '#d1d5db',
                    marginRight: '1rem'
                  }}>
                    {personalPersona === persona.id && (
                      <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }}></div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                      {persona.emoji} {persona.title}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {persona.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Privacy Consent & Submit */}
        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          {/* Privacy Consent Checkbox */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.75rem',
            border: '1px solid #e5e7eb'
          }}>
            <input
              type="checkbox"
              id="privacy-consent"
              checked={privacyConsent}
              onChange={(e) => setPrivacyConsent(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                marginTop: '2px',
                cursor: 'pointer'
              }}
            />
            <label 
              htmlFor="privacy-consent"
              style={{
                fontSize: '0.875rem',
                color: '#374151',
                lineHeight: '1.4',
                cursor: 'pointer'
              }}
            >
              I consent to my story/photo being used for AI content generation, and understand that this will be deleted from AI's memory after processing. I accept the{' '}
              <button
                onClick={() => setShowTermsModal(true)}
                style={{
                  color: BRAND_PURPLE,
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  padding: 0
                }}
              >
                Terms & Conditions
              </button>.
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            style={{
              width: '100%',
              background: canSubmit 
                ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                : '#e5e7eb',
              color: canSubmit ? 'white' : '#9ca3af',
              fontSize: '1.25rem',
              fontWeight: '700',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              boxShadow: canSubmit ? '0 4px 15px rgba(107, 46, 255, 0.3)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            {isSubmitting ? 'Setting up your account...' : 'Start Creating →'}
          </button>
          
          {/* Skip Option */}
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link 
              href="/"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.875rem'
              }}
            >
              Skip for now
            </Link>
          </div>
        </div>

        {/* Footer Logo */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '2rem',
          paddingTop: '2rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div style={{ 
              color: BRAND_PURPLE, 
              fontSize: '1rem', 
              fontWeight: '900',
              display: 'inline'
            }}>click</div>
            <div style={{ 
              color: BRAND_ORANGE, 
              fontSize: '1rem', 
              fontWeight: '900',
              display: 'inline',
              marginLeft: '0.25rem'
            }}>speak</div>
            <div style={{ 
              color: BRAND_BLUE, 
              fontSize: '1rem', 
              fontWeight: '900',
              display: 'inline',
              marginLeft: '0.25rem'
            }}>send</div>
          </Link>
        </div>
      </div>
    </div>
  )
} '#fef2f2',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #fecaca'
                }}>
                  {betaCodeError}
                </div>
              )}
            </div>

            <button
              onClick={validateBetaCode}
              disabled={!betaCode.trim()}
              style={{
                width: '100%',
                background: betaCode.trim() 
                  ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                  : '#e5e7eb',
                color: betaCode.trim() ? 'white' : '#9ca3af',
                fontSize: '1.125rem',
                fontWeight: '700',
                padding: '1rem 2rem',
                borderRadius: '0.75rem',
                border: 'none',
                cursor: betaCode.trim() ? 'pointer' : 'not-allowed',
                boxShadow: betaCode.trim() ? '0 4px 15px rgba(107, 46, 255, 0.3)' : 'none',
                transition: 'all 0.2s',
                marginBottom: '1.5rem'
              }}
            >
              Access Beta Platform
            </button>

            <div style={{
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '0.75rem',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <p style={{
                fontSize: '0.875rem',
                color: '#0c4a6e',
                margin: '0'
              }}>
                <strong>Beta Testers:</strong> You should have received your access code via email or invitation.
              </p>
            </div>

            <Link 
              href="/"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.875rem'
              }}
            >
              ← Back to home
            </Link>
          </div>

          {/* Footer Logo */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '2rem',
            paddingTop: '2rem'
          }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <div style={{ 
                color: BRAND_PURPLE, 
                fontSize: '1rem', 
                fontWeight: '900',
                display: 'inline'
              }}>click</div>
              <div style={{ 
                color: BRAND_ORANGE, 
                fontSize: '1rem', 
                fontWeight: '900',
                display: 'inline',
                marginLeft: '0.25rem'
              }}>speak</div>
              <div style={{ 
                color: BRAND_BLUE, 
                fontSize: '1rem', 
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

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb'
    }}>
      
      {/* Terms Modal */}
      {showTermsModal && <TermsModal />}
      
      {/* 600px Mobile-First Container */}
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        width: '100%', 
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>

        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem 0',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '2rem'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', 
            fontWeight: '700',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Welcome to Click Speak Send
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
            margin: '0'
          }}>
            Set up your account to create culturally-intelligent content
          </p>
        </div>

        {/* Window 1: Account Setup */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>👤</span> Set Up Your Account
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = BRAND_PURPLE}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = BRAND_PURPLE}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Location *
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.target.style.borderColor = BRAND_PURPLE}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              >
                <option value="">Select your location...</option>
                {nzLocations.map((loc) => (
                  <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Cultural Connection (Optional)
              </label>
              <input
                type="text"
                value={culturalConnection}
                onChange={(e) => setCulturalConnection(e.target.value)}
                placeholder="Share your cultural background or connections"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = BRAND_PURPLE}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
          </div>
        </div>

        {/* Window 2: User Type Selection */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>🎯</span> Select Your Creator Type
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Business Option */}
            <div
              onClick={() => setUserType('business')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                border: userType === 'business' ? `2px solid ${BRAND_PURPLE}` : '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                backgroundColor: userType === 'business' ? '#f0f9ff' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #d1d5db',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
