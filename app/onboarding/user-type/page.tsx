'use client'
import { useState } from 'react'
import Link from 'next/link'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

const BETA_CODES = [
  'CULTURAL2025', 'MAORI2025', 'TOURISM2025', 'KAITIAKI2025', 'AOTEAROA2025',
  'WELLNESS2025', 'HERITAGE2025', 'ADVENTURE2025', 'DISCOVER2025', 'AUTHENTIC2025'
]

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

const personalPersonas = [
  { id: 'cultural-explorer', title: 'Cultural Explorer', description: 'Heritage & tradition focused', emoji: '🪶' },
  { id: 'adventure-seeker', title: 'Adventure Seeker', description: 'Active & outdoor focused', emoji: '🌟' },
  { id: 'content-creator', title: 'Content Creator', description: 'Social media & blog creator', emoji: '📱' },
  { id: 'family-storyteller', title: 'Family Storyteller', description: 'Multi-generational experiences', emoji: '👨‍👩‍👧‍👦' },
  { id: 'independent-traveller', title: 'Independent Traveller', description: 'Personal experience sharer', emoji: '🎒' }
]

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
  const [betaCode, setBetaCode] = useState('')
  const [isBetaValidated, setIsBetaValidated] = useState(false)
  const [betaCodeError, setBetaCodeError] = useState('')
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [location, setLocation] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [linkedInUrl, setLinkedInUrl] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [culturalConnection, setCulturalConnection] = useState('')
  const [userType, setUserType] = useState('')
  const [businessCategory, setBusinessCategory] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [personalPersona, setPersonalPersona] = useState('')
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

  const validateBetaCode = () => {
    const code = betaCode.toUpperCase().trim()
    if (BETA_CODES.includes(code)) {
      setIsBetaValidated(true)
      setBetaCodeError('')
      localStorage.setItem('betaAccess', 'validated')
    } else {
      setBetaCodeError('Invalid access code. Please check and try again.')
      setTimeout(() => setShowWaitlist(true), 2000)
    }
  }

  const handleSubmit = async () => {
    if (!name || !email || !location || !userType) return
    if (userType === 'business' && (!businessCategory || !businessType)) return
    if (userType === 'personal' && !personalPersona) return

    setIsSubmitting(true)
    
    try {
      const userProfile = {
        profile: { name, email, location, websiteUrl, linkedInUrl, facebookUrl, instagramUrl, culturalConnection, userType },
        business: userType === 'business' ? { category: businessCategory, type: businessType } : null,
        personal: userType === 'personal' ? { persona: personalPersona } : null,
        betaAccess: true,
        completedAt: new Date().toISOString()
      }
      
      localStorage.setItem('userProfile', JSON.stringify(userProfile))
      localStorage.setItem('userToken', 'authenticated')
      localStorage.setItem('userType', userType)
      window.location.href = '/dashboard/create/photo'
    } catch (error) {
      console.error('Failed to save profile:', error)
      setIsSubmitting(false)
    }
  }

  const canSubmit = name && email && location && userType && privacyConsent &&
    ((userType === 'business' && businessCategory && businessType) ||
     (userType === 'personal' && personalPersona))

  if (showWaitlist) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', padding: '1rem', display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: '3rem 1rem', maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🌟</div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>Join the Waitlist</h1>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem', lineHeight: '1.6' }}>Click Speak Send is currently in private beta. Join our waitlist to be notified when we launch publicly!</p>
            <button onClick={() => { alert('Thank you for your interest! We\'ll notify you when Click Speak Send launches.'); window.location.href = '/' }} style={{ background: `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`, color: 'white', fontSize: '1.125rem', fontWeight: '600', padding: '1rem 2rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer' }}>Join Waitlist</button>
          </div>
        </div>
      </div>
    )
  }

  if (!isBetaValidated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', padding: '1rem', display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🔑</div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>Beta Access Required</h1>
            <p style={{ color: '#6b7280', fontSize: '1.125rem', marginBottom: '2rem', lineHeight: '1.6' }}>Click Speak Send is currently in private beta testing.<br/>Enter your access code to continue.</p>
            <input type="text" value={betaCode} onChange={(e) => { setBetaCode(e.target.value); setBetaCodeError('') }} placeholder="Enter your beta access code" style={{ width: '100%', padding: '1rem', border: betaCodeError ? '2px solid #ef4444' : '2px solid #d1d5db', borderRadius: '0.75rem', fontSize: '1.125rem', textAlign: 'center', outline: 'none', textTransform: 'uppercase', marginBottom: '1rem' }} onKeyPress={(e) => e.key === 'Enter' && validateBetaCode()} />
            {betaCodeError && <div style={{ color: '#ef4444', fontSize: '0.875rem', backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>{betaCodeError}</div>}
            <button onClick={validateBetaCode} disabled={!betaCode.trim()} style={{ width: '100%', background: betaCode.trim() ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)` : '#e5e7eb', color: betaCode.trim() ? 'white' : '#9ca3af', fontSize: '1.125rem', fontWeight: '700', padding: '1rem 2rem', borderRadius: '0.75rem', border: 'none', cursor: betaCode.trim() ? 'pointer' : 'not-allowed' }}>Access Beta Platform</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {showTermsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', maxWidth: '600px', maxHeight: '80vh', overflow: 'auto', width: '100%', position: 'relative' }}>
            <button onClick={() => setShowTermsModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' }}>Terms & Conditions</h2>
            <div style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#374151', marginBottom: '2rem' }}>
              <p>Click Speak Send is an AI-powered content creation platform that generates culturally-intelligent tourism content using your photos and stories. Your photos and stories are processed by AI to generate content and all data is deleted from AI memory after processing. We respect cultural protocols and Mātauranga Māori. Generated content remains your intellectual property.</p>
            </div>
            <button onClick={() => setShowTermsModal(false)} style={{ background: `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`, color: 'white', fontSize: '1rem', fontWeight: '600', padding: '0.75rem 2rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer' }}>Got it</button>
          </div>
        </div>
      )}
      
      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', padding: '1rem', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '2rem 0', borderBottom: '1px solid #e5e7eb', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>Welcome to Click Speak Send</h1>
          <p style={{ color: '#6b7280', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', margin: '0' }}>Set up your account to create culturally-intelligent content</p>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>👤 Set Up Your Account</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Full Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Email Address *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Location *</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem', backgroundColor: 'white', cursor: 'pointer' }}>
                <option value="">Select your location...</option>
                {nzLocations.map((loc) => <option key={loc.value} value={loc.value}>{loc.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Website URL <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>(Recommended for businesses)</span>
              </label>
              <input 
                type="url" 
                value={websiteUrl} 
                onChange={(e) => setWebsiteUrl(e.target.value)} 
                placeholder="https://yourwebsite.com" 
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '0.5rem', 
                  fontSize: '1rem',
                  outline: 'none'
                }} 
              />
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                💡 We'll analyze your website to create more authentic, on-brand content
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Cultural Connection (Optional)</label>
              <input type="text" value={culturalConnection} onChange={(e) => setCulturalConnection(e.target.value)} placeholder="Share your cultural background or connections" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem', outline: 'none' }} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>🎯 Select Your Creator Type</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div onClick={() => setUserType('business')} style={{ display: 'flex', alignItems: 'center', padding: '1rem', border: userType === 'business' ? `2px solid ${BRAND_PURPLE}` : '2px solid #e5e7eb', borderRadius: '0.75rem', backgroundColor: userType === 'business' ? '#f0f9ff' : 'white', cursor: 'pointer' }}>
              <div style={{ width: '20px', height: '20px', border: '2px solid #d1d5db', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: userType === 'business' ? BRAND_PURPLE : 'white', borderColor: userType === 'business' ? BRAND_PURPLE : '#d1d5db', marginRight: '1rem' }}>
                {userType === 'business' && <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }}></div>}
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#111827' }}>🏢 Business Content Creator</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Tourism/Hospitality/Community Business</div>
              </div>
            </div>
            <div onClick={() => setUserType('personal')} style={{ display: 'flex', alignItems: 'center', padding: '1rem', border: userType === 'personal' ? `2px solid ${BRAND_PURPLE}` : '2px solid #e5e7eb', borderRadius: '0.75rem', backgroundColor: userType === 'personal' ? '#f0f9ff' : 'white', cursor: 'pointer' }}>
              <div style={{ width: '20px', height: '20px', border: '2px solid #d1d5db', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: userType === 'personal' ? BRAND_PURPLE : 'white', borderColor: userType === 'personal' ? BRAND_PURPLE : '#d1d5db', marginRight: '1rem' }}>
                {userType === 'personal' && <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }}></div>}
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#111827' }}>👤 Personal Content Creator</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Individual Traveller/Content Creator</div>
              </div>
            </div>
          </div>
        </div>

        {userType === 'business' && (
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>🏢 Business Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <select value={businessCategory} onChange={(e) => { setBusinessCategory(e.target.value); setBusinessType('') }} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem', backgroundColor: 'white' }}>
                <option value="">Select business category...</option>
                {Object.keys(businessTypes).map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
              {businessCategory && (
                <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem', backgroundColor: 'white' }}>
                  <option value="">Select business type...</option>
                  {businessTypes[businessCategory as keyof typeof businessTypes]?.map((type) => <option key={type.value} value={type.value}>{type.label} - {type.description}</option>)}
                </select>
              )}
              
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginTop: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>🔗 Social Media & Online Presence</h3>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1rem', lineHeight: '1.4' }}>Add your social media profiles for enhanced brand analysis. We'll analyze your tone, style, and messaging across platforms.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#0077b5' }}>💼</span> LinkedIn Profile <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: '400' }}>(Recommended)</span>
                    </label>
                    <input type="url" value={linkedInUrl} onChange={(e) => setLinkedInUrl(e.target.value)} placeholder="https://linkedin.com/company/your-business" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem' }} />
                  </div>
                  
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#1877f2' }}>📘</span> Facebook Page
                    </label>
                    <input type="url" value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} placeholder="https://facebook.com/your-business" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem' }} />
                  </div>
                  
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#e4405f' }}>📷</span> Instagram Profile
                    </label>
                    <input type="url" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="https://instagram.com/your-business" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem' }} />
                  </div>
                </div>
                
                <div style={{ backgroundColor: '#f0f9ff', padding: '0.75rem', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid #bae6fd' }}>
                  <p style={{ fontSize: '0.75rem', color: '#0c4a6e', margin: '0', lineHeight: '1.4' }}>
                    💡 <strong>Enhanced AI Accuracy:</strong> More platforms = better brand voice analysis = 5x more authentic content
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {userType === 'personal' && (
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>🎭 Choose Your Voice</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {personalPersonas.map((persona) => (
                <div key={persona.id} onClick={() => setPersonalPersona(persona.id)} style={{ display: 'flex', alignItems: 'center', padding: '1rem', border: personalPersona === persona.id ? `2px solid ${BRAND_PURPLE}` : '2px solid #e5e7eb', borderRadius: '0.75rem', backgroundColor: personalPersona === persona.id ? '#f0f9ff' : 'white', cursor: 'pointer' }}>
                  <div style={{ width: '20px', height: '20px', border: '2px solid #d1d5db', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: personalPersona === persona.id ? BRAND_PURPLE : 'white', borderColor: personalPersona === persona.id ? BRAND_PURPLE : '#d1d5db', marginRight: '1rem' }}>
                    {personalPersona === persona.id && <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }}></div>}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#111827' }}>{persona.emoji} {persona.title}</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{persona.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.75rem' }}>
            <input type="checkbox" checked={privacyConsent} onChange={(e) => setPrivacyConsent(e.target.checked)} style={{ width: '18px', height: '18px', marginTop: '2px' }} />
            <label style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.4' }}>
              I consent to my story/photo being used for AI content generation, and understand that this will be deleted from AI's memory after processing. I accept the{' '}
              <button onClick={() => setShowTermsModal(true)} style={{ color: BRAND_PURPLE, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>Terms & Conditions</button>.
            </label>
          </div>
          <button onClick={handleSubmit} disabled={!canSubmit || isSubmitting} style={{ width: '100%', background: canSubmit ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)` : '#e5e7eb', color: canSubmit ? 'white' : '#9ca3af', fontSize: '1.25rem', fontWeight: '700', padding: '1rem 2rem', borderRadius: '1rem', border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed' }}>
            {isSubmitting ? 'Setting up your account...' : 'Start Creating →'}
          </button>
        </div>
      </div>
    </div>
  )
}
