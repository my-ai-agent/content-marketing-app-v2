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

const businessTypes: Record<string, { value: string; label: string; description: string }[]> = {
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
  const [betaCode, setBetaCode] = useState<string>('')
  const [isBetaValidated, setIsBetaValidated] = useState<boolean>(false)
  const [betaCodeError, setBetaCodeError] = useState<string>('')
  const [showWaitlist, setShowWaitlist] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [websiteUrl, setWebsiteUrl] = useState<string>('')
  const [culturalConnection, setCulturalConnection] = useState<string>('')
  const [userType, setUserType] = useState<'business' | 'personal' | ''>('')
  const [businessCategory, setBusinessCategory] = useState<string>('')
  const [businessType, setBusinessType] = useState<string>('')
  const [personalPersona, setPersonalPersona] = useState<string>('')
  const [privacyConsent, setPrivacyConsent] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false)

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
        profile: { name, email, location, websiteUrl, culturalConnection, userType },
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

  const canSubmit = !!(name && email && location && userType && privacyConsent &&
    ((userType === 'business' && businessCategory && businessType) ||
     (userType === 'personal' && personalPersona)))

  // ... rest of the component unchanged ...
  // (No runtime or TypeScript errors with above types)
  
  // JSX remains as you wrote in your original file.
}
