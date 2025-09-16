'use client'
import { useState } from 'react'
import Link from 'next/link'

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

const BETA_CODES = [
  'CULTURAL2025', 'MAORI2025', 'TOURISM2025', 'KAITIAKI2025', 'AOTEAROA2025',
  'WELLNESS2025', 'HERITAGE2025', 'ADVENTURE2025', 'DISCOVER2025', 'WHENUA2025', 'ALLBLACKS2025', 'AUTHENTIC2025'
]

const businessTypes = {
  'Tourism Business': [
    { value: 'visitor-attraction', label: 'Visitor Attraction', description: 'Museums, theme parks, scenic attractions, cultural sites' },
    { value: 'accommodation', label: 'Accommodation', description: 'Hotels, B&Bs, holiday parks, lodges, farm stays' },
    { value: 'food-beverage', label: 'Food & Beverage', description: 'Restaurants, cafes, wineries, food tours' },
    { value: 'adventure-operators', label: 'Adventure Operators', description: 'Extreme sports, outdoor activities, adrenaline experiences' },
    { value: 'tours-activities', label: 'Tours & Activities', description: 'Guided tours, cultural experiences, leisure activities' },
    { value: 'maori-cultural', label: 'Māori Cultural Experiences', description: 'Marae visits, cultural performances, traditional arts' },
    { value: 'nature-wildlife', label: 'Nature & Wildlife', description: 'Conservation experiences, wildlife encounters, eco-tours' },
    { value: 'wellness-spa', label: 'Wellness & Spa', description: 'Thermal springs, spa retreats, wellness centers' },
    { value: 'transport-logistics', label: 'Transport & Logistics', description: 'Rental services, shuttle operators, transport providers' },
    { value: 'community-facilities', label: 'Community Facilities', description: 'Recreation centers, sports complexes, community halls, public facilities' },
    { value: 'events-entertainment', label: 'Events & Entertainment', description: 'Venues, festivals, sporting events, concerts' }
  ],
  'Small Business': [
  { value: 'local-retail', label: 'Local Retail & Services', description: 'Shops, markets, boutiques, local services' },
  { value: 'professional-services', label: 'Professional Services', description: 'Legal, accounting, consulting, marketing' },
  { value: 'health-fitness', label: 'Health & Fitness', description: 'Gyms, clinics, wellness centers' }
],
'Community Service': [
  { value: 'non-profit', label: 'Non-Profit', description: 'Charities, foundations, community organizations' },
  { value: 'government-local', label: 'Local Government', description: 'Local councils, public services, visitor information centers' },
  { value: 'education', label: 'Education', description: 'Schools, libraries, training centers, cultural education' },
  { value: 'community-facilities', label: 'Community Facilities', description: 'Recreation centers, sports complexes, community halls, public facilities' }
]
}

const personalPersonas = [
  // Cultural & Heritage (Your Competitive Advantage)
  { id: 'cultural-connector', title: 'Cultural Connector', description: 'Seeks authentic Māori experiences and meaningful cultural exchange' },
  { id: 'heritage-explorer', title: 'Heritage Explorer', description: 'Historical sites, museums, and traditional storytelling focused' },
  
  // Adventure Segmentation (Major NZ Market)
  { id: 'soft-adventurer', title: 'Scenic Adventurer', description: 'Accessible outdoor experiences and scenic beauty focused' },
  { id: 'extreme-thrill-seeker', title: 'Extreme Thrill Seeker', description: 'Adrenaline activities and extreme sports focused' },
  
  // Wellness & Contribution (Growing Segments)
  { id: 'wellness-seeker', title: 'Wellness Seeker', description: 'Thermal springs, spas, and mindful travel experiences' },
  { id: 'conscious-contributor', title: 'Conscious Contributor', description: 'Community volunteering and conservation project participation' },
  
  // Content & Documentation
  { id: 'content-creator', title: 'Content Creator', description: 'Social media influencer and professional content creation' },
  { id: 'memory-maker', title: 'Memory Maker', description: 'Capturing and sharing personal travel stories and moments' },
  
  // Travel Style Segments
  { id: 'family-coordinator', title: 'Family Coordinator', description: 'Multi-generational experiences and family-friendly activities' },
  { id: 'business-networker', title: 'Business Networker', description: 'Professional development and business tourism focused' },
  { id: 'solo-explorer', title: 'Solo Explorer', description: 'Independent travel with authentic local connections' },
  
  // Specialized Segments
  { id: 'sports-enthusiast', title: 'Sports Enthusiast', description: 'Sporting events, outdoor competitions, and active experiences' },
  { id: 'community-engager', title: 'Community Engager', description: 'Local community events, social connections, and authentic neighborhood experiences' }
]

const nzLocations = [
  // Major Cities (Current)
  { value: 'auckland', label: 'Auckland (Tāmaki Makaurau)' },
  { value: 'wellington', label: 'Wellington (Te Whanganui-a-Tara)' },
  { value: 'christchurch', label: 'Christchurch (Ōtautahi)' },
  { value: 'hamilton', label: 'Hamilton (Kirikiriroa)' },
  { value: 'tauranga', label: 'Tauranga (Tauranga Moana)' },
  { value: 'napier', label: 'Napier (Ahuriri)' },
  { value: 'palmerston-north', label: 'Palmerston North (Papaioea)' },
  { value: 'nelson', label: 'Nelson (Whakatū)' },
  { value: 'rotorua', label: 'Rotorua (Te Rotorua-nui-a-Kahumatamomoe)' },
  { value: 'queenstown', label: 'Queenstown (Tāhuna)' },
  
  // North Island Tourism Regions
  { value: 'bay-of-islands', label: 'Bay of Islands (Pēwhairangi)' },
  { value: 'coromandel', label: 'Coromandel Peninsula (Te Tara-o-te-Ika)' },
  { value: 'gisborne', label: 'Gisborne (Tūranga-nui-a-Kiwa)' },
  { value: 'new-plymouth', label: 'New Plymouth (Ngāmotu)' },
  { value: 'whanganui', label: 'Whanganui' },
  
  // South Island Tourism Regions  
  { value: 'marlborough', label: 'Marlborough (Te Tauihu-o-te-waka)' },
  { value: 'west-coast', label: 'West Coast (Te Tai Poutini)' },
  { value: 'canterbury', label: 'Canterbury (Waitaha)' },
  { value: 'selwyn-district', label: 'Selwyn District' },
  { value: 'mackenzie-district', label: 'Mackenzie District (Tekapo/Pukaki region)' },
  { value: 'otago', label: 'Otago (Ō Tākou)' },
  { value: 'southland', label: 'Southland (Murihiku)' },
  { value: 'stewart-island', label: 'Stewart Island (Rakiura)' },
  { value: 'fiordland', label: 'Fiordland (Te Rua-o-te-Moko)' },
  
  // Major Tourism Destinations
  { value: 'lake-taupo', label: 'Lake Taupō (Taupō-nui-a-Tia)' },
  { value: 'waitomo', label: 'Waitomo' }
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

  // Mobile detection
  const isMobile = typeof window !== 'undefined' && (
    /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent) ||
    window.innerWidth <= 768
  )

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
      const userProfile = isMobile ? {
        profile: { 
          name, 
          email, 
          location, 
          websiteUrl: websiteUrl || '',
          culturalConnection, 
          userType 
        },
        business: userType === 'business' ? { category: businessCategory, type: businessType } : null,
        personal: userType === 'personal' ? { persona: personalPersona } : null,
        betaAccess: true,
        completedAt: new Date().toISOString(),
        deviceType: 'mobile'
      } : {
        profile: { 
          name, 
          email, 
          location, 
          websiteUrl, 
          linkedInUrl, 
          facebookUrl, 
          instagramUrl, 
          culturalConnection, 
          userType 
        },
        business: userType === 'business' ? { category: businessCategory, type: businessType } : null,
        personal: userType === 'personal' ? { persona: personalPersona } : null,
        betaAccess: true,
        completedAt: new Date().toISOString(),
        deviceType: 'desktop'
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
            <PrimaryButton onClick={() => window.location.href = '/'}>
              Join Waitlist
            </PrimaryButton>
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
            <input 
              type="text" 
              value={betaCode} 
              onChange={(e) => { setBetaCode(e.target.value); setBetaCodeError('') }} 
              placeholder="Enter your beta access code" 
              style={{ 
                width: '100%', 
                padding: '1rem', 
                border: betaCodeError ? '2px solid #ef4444' : '2px solid #d1d5db', 
                borderRadius: '0.75rem', 
                fontSize: '1.125rem', 
                textAlign: 'center', 
                outline: 'none', 
                textTransform: 'uppercase', 
                marginBottom: '1rem' 
              }} 
              onKeyPress={(e) => e.key === 'Enter' && validateBetaCode()} 
            />
            {betaCodeError && <div style={{ color: '#ef4444', fontSize: '0.875rem', backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>{betaCodeError}</div>}
            <PrimaryButton 
              onClick={validateBetaCode}
              disabled={!betaCode.trim()}
              style={{ width: '100%' }}
            >
              Access Beta Platform
            </PrimaryButton>
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
            <PrimaryButton onClick={() => setShowTermsModal(false)}>
              Got it
            </PrimaryButton>
          </div>
        </div>
      )}
      
      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', padding: '1rem', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '2rem 0', borderBottom: '1px solid #e5e7eb', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>Welcome to Click Speak Send</h1>
          <p style={{ color: '#6b7280', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', margin: '0' }}>Set up your account to create culturally-intelligent content</p>
          {isMobile && (
            <div style={{ backgroundColor: '#f0f9ff', padding: '0.75rem', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid #bae6fd' }}>
              <p style={{ fontSize: '0.75rem', color: '#0c4a6e', margin: '0' }}>
                Mobile-optimized setup for faster content creation
              </p>
            </div>
          )}
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Set Up Your Account</h2>
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
                We'll analyze your website to create more authentic, on-brand content
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Cultural Connection (Optional)</label>
              <input type="text" value={culturalConnection} onChange={(e) => setCulturalConnection(e.target.value)} placeholder="Share your cultural background or connections" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem', outline: 'none' }} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Select Your Creator Type</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div onClick={() => setUserType('business')} style={{ display: 'flex', alignItems: 'center', padding: '1rem', border: userType === 'business' ? `2px solid ${BRAND_PURPLE}` : '2px solid #e5e7eb', borderRadius: '0.75rem', backgroundColor: userType === 'business' ? '#f0f9ff' : 'white', cursor: 'pointer' }}>
              <div style={{ width: '20px', height: '20px', border: '2px solid #d1d5db', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: userType === 'business' ? BRAND_PURPLE : 'white', borderColor: userType === 'business' ? BRAND_PURPLE : '#d1d5db', marginRight: '1rem' }}>
                {userType === 'business' && <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }}></div>}
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#111827' }}>Business Content Creator</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Tourism/Hospitality/Community Business</div>
              </div>
            </div>
            <div onClick={() => setUserType('personal')} style={{ display: 'flex', alignItems: 'center', padding: '1rem', border: userType === 'personal' ? `2px solid ${BRAND_PURPLE}` : '2px solid #e5e7eb', borderRadius: '0.75rem', backgroundColor: userType === 'personal' ? '#f0f9ff' : 'white', cursor: 'pointer' }}>
              <div style={{ width: '20px', height: '20px', border: '2px solid #d1d5db', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: userType === 'personal' ? BRAND_PURPLE : 'white', borderColor: userType === 'personal' ? BRAND_PURPLE : '#d1d5db', marginRight: '1rem' }}>
                {userType === 'personal' && <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }}></div>}
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#111827' }}>Personal Content Creator</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Individual Traveller/Content Creator</div>
              </div>
            </div>
          </div>
        </div>

        {userType === 'business' && (
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Business Details</h2>
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
              
              {!isMobile && (
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginTop: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>Social Media & Online Presence</h3>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1rem', lineHeight: '1.4' }}>Add your social media profiles for enhanced brand analysis. We'll analyze your tone, style, and messaging across platforms.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#0077b5' }}>LinkedIn Profile</span>
                        <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: '400' }}>(Recommended)</span>
                      </label>
                      <input type="url" value={linkedInUrl} onChange={(e) => setLinkedInUrl(e.target.value)} placeholder="https://linkedin.com/company/your-business" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem' }} />
                    </div>
                    
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#1877f2' }}>Facebook Page</span>
                      </label>
                      <input type="url" value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} placeholder="https://facebook.com/your-business" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem' }} />
                    </div>
                    
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#e4405f' }}>Instagram Profile</span>
                      </label>
                      <input type="url" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="https://instagram.com/your-business" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem' }} />
                    </div>
                  </div>
                  
                  <div style={{ backgroundColor: '#f0f9ff', padding: '0.75rem', borderRadius: '0.5rem', marginTop: '1rem', border: '1px solid #bae6fd' }}>
                    <p style={{ fontSize: '0.75rem', color: '#0c4a6e', margin: '0', lineHeight: '1.4' }}>
                      <strong>Enhanced AI Accuracy:</strong> More platforms = better brand voice analysis = 5x more authentic content
                    </p>
                  </div>
                </div>
              )}

              {isMobile && (
                <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #bbf7d0', marginTop: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#166534', marginBottom: '0.5rem' }}>Mobile-Optimized Setup</h3>
                  <p style={{ fontSize: '0.75rem', color: '#166534', margin: '0', lineHeight: '1.4' }}>
                    Social media profiles can be added later from desktop for enhanced brand analysis. Mobile setup focuses on essential data for faster content creation.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {userType === 'personal' && (
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Choose Your Voice</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {personalPersonas.map((persona) => (
                <div key={persona.id} onClick={() => setPersonalPersona(persona.id)} style={{ display: 'flex', alignItems: 'center', padding: '1rem', border: personalPersona === persona.id ? `2px solid ${BRAND_PURPLE}` : '2px solid #e5e7eb', borderRadius: '0.75rem', backgroundColor: personalPersona === persona.id ? '#f0f9ff' : 'white', cursor: 'pointer' }}>
                  <div style={{ width: '20px', height: '20px', border: '2px solid #d1d5db', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: personalPersona === persona.id ? BRAND_PURPLE : 'white', borderColor: personalPersona === persona.id ? BRAND_PURPLE : '#d1d5db', marginRight: '1rem' }}>
                    {personalPersona === persona.id && <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }}></div>}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#111827' }}>{persona.title}</div>
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
          
          <PrimaryButton 
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            size="large"
            style={{ width: '100%' }}
          >
            {isSubmitting ? 'Setting up your account...' : 'Start Creating'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}
