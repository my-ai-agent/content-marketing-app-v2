'use client'
import { useState } from 'react'
import Link from 'next/link'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

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
  
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const canSubmit = name && email && location && userType && 
    ((userType === 'business' && businessCategory && businessType) ||
     (userType === 'personal' && personalPersona))

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

        {/* Submit Button */}
        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
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
            {isSubmitting ? 'Setting up your account...' : 'Complete Setup & Start Creating →'}
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
}
