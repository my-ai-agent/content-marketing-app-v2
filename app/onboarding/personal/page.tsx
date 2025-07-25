// Update file: /app/onboarding/personal/page.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

interface PersonalOption {
  id: string
  title: string
  subtitle: string
  description: string
  traits: string[]
  emoji: string
  example: string
  userTypes: string[] // 'business' | 'personal' | 'both'
} 

const allPersonalOptions: PersonalOption[] = [
  // Business-focused personas
  {
    id: 'professional',
    title: 'Business Professional',
    subtitle: 'Authoritative Business Voice',
    description: 'Professional, business-focused content that builds credibility and drives direct bookings',
    traits: ['Authoritative tone', 'Industry expertise', 'Business-focused', 'Call-to-action oriented'],
    emoji: '🏢',
    example: '"This authentic cultural experience demonstrates our commitment to preserving indigenous heritage while creating meaningful opportunities for discerning travellers."',
    userTypes: ['business']
  },
  
  // Personal & business personas
  {
    id: 'influencer',
    title: 'Content Creator',
    subtitle: 'Social Media & Blog Creator',
    description: 'Engaging, personal storytelling that builds community and inspires followers',
    traits: ['Authentic & relatable', 'Personal stories', 'Community building', 'Engagement focused'],
    emoji: '📱',
    example: '"Guys, I\'m still getting goosebumps! The way the warriors moved during the haka - you could feel the spiritual energy in the room. This is why I love sharing these hidden gems with you all!"',
    userTypes: ['personal', 'business']
  },
  
  {
    id: 'adventure',
    title: 'Adventure Seeker',
    subtitle: 'Active & Outdoor Focused',
    description: 'Excited, energetic content that captures the thrill of discovery and adventure',
    traits: ['High energy & excitement', 'Spontaneous discoveries', 'Emotional reactions', 'FOMO-inducing'],
    emoji: '🌟',
    example: '"OMG YOU GUYS!!! Just had my mind BLOWN at the Auckland War Memorial Museum! This Māori performance was absolutely INCREDIBLE - like nothing I\'ve ever experienced! WHO ELSE NEEDS TO ADD THIS TO THEIR BUCKET LIST?!"',
    userTypes: ['personal', 'business']
  },
  
  // Personal-focused personas
  {
    id: 'cultural',
    title: 'Cultural Explorer',
    subtitle: 'Heritage & Tradition Focused',
    description: 'Respectful, educational content that shares cultural learning and authentic experiences',
    traits: ['Respectful engagement', 'Cultural learning', 'Educational focus', 'Authentic sharing'],
    emoji: '🪶',
    example: '"Learning about the significance of this sacred site from local iwi members was humbling. Understanding the protocols and stories behind these traditions deepened my appreciation for Māori culture immensely."',
    userTypes: ['personal']
  },
  
  {
    id: 'family',
    title: 'Family Storyteller',
    subtitle: 'Multi-generational Experiences',
    description: 'Inclusive, family-friendly content that appeals to multiple generations and creates lasting memories',
    traits: ['Multi-generational appeal', 'Inclusive experiences', 'Safety-conscious', 'Memory-making focus'],
    emoji: '👨‍👩‍👧‍👦',
    example: '"The kids were amazed by the thermal pools, and even grandma enjoyed the cultural performance. Finding experiences that work for everyone from 5 to 75 isn\'t easy, but this place nailed it!"',
    userTypes: ['personal']
  },
  
  {
    id: 'independent',
    title: 'Individual Traveller',
    subtitle: 'Personal Experience Sharer',
    description: 'Authentic, personal travel storytelling that inspires others through genuine experiences',
    traits: ['Personal reflection', 'Authentic experiences', 'Solo travel insights', 'Genuine storytelling'],
    emoji: '🎒',
    example: '"Travelling solo to this remote part of New Zealand taught me so much about myself. Sometimes the best discoveries happen when you venture off the beaten track alone."',
    userTypes: ['personal']
  }
]

export default function PersonaSelection() {
  const [selectedPersona, setSelectedPersona] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userType, setUserType] = useState<string>('personal')
  const [availablePersonas, setAvailablePersonas] = useState<PersonalOption[]>([])

  useEffect(() => {
    // Get user type from previous selection
    const storedUserType = localStorage.getItem('userType') || 'personal'
    setUserType(storedUserType)
    
    // Filter personas based on user type
    const filtered = allPersonalOptions.filter(persona => 
      persona.userTypes.includes(storedUserType) || persona.userTypes.includes('both')
    )
    setAvailablePersonas(filtered)
    
    // Get any existing persona selection
    const existingPersona = localStorage.getItem('userPersona')
    if (existingPersona && filtered.some(p => p.id === existingPersona)) {
      setSelectedPersona(existingPersona)
    }
  }, [])

  const handlePersonaSelect = (personaId: string) => {
    setSelectedPersona(personaId)
  }

  const handleSubmit = async () => {
    if (!selectedPersona) return

    setIsSubmitting(true)
    
    try {
      // Store persona in localStorage
      localStorage.setItem('userPersona', selectedPersona)
      
      // Get selected persona details
      const persona = availablePersonas.find(p => p.id === selectedPersona)
      localStorage.setItem('userPersonaDetails', JSON.stringify(persona))
      
      // Redirect to dashboard
      window.location.href = '/dashboard'
      
    } catch (error) {
      console.error('Failed to save persona:', error)
      setIsSubmitting(false)
    }
  }

  const getHeaderText = () => {
    if (userType === 'business') {
      return {
        title: '🎭 Choose Your Business Voice',
        subtitle: 'How does your business communicate with customers? This helps us create content that matches your brand personality.'
      }
    }
    return {
      title: '🎭 Choose Your Voice',
      subtitle: 'How do you like to share your travel experiences? This helps us create content that matches your unique style.'
    }
  }

  const headerText = getHeaderText()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`,
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
          {headerText.title}
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          opacity: 0.9,
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          {headerText.subtitle}
        </p>
        {userType === 'business' && (
          <p style={{
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            opacity: 0.7,
            maxWidth: '600px',
            margin: '0.5rem auto 0 auto',
            fontStyle: 'italic'
          }}>
            This applies to all content created for your business
          </p>
        )}
      </div>

      {/* Persona Options */}
      <div style={{
        flex: 1,
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          maxWidth: userType === 'business' ? '800px' : '1400px',
          width: '100%',
          marginBottom: '3rem'
        }}>
          {availablePersonas.map((persona) => (
            <div
              key={persona.id}
              onClick={() => handlePersonaSelect(persona.id)}
              style={{
                background: selectedPersona === persona.id 
                  ? 'rgba(255,255,255,0.25)' 
                  : 'rgba(255,255,255,0.1)',
                borderRadius: '20px',
                padding: '2rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: selectedPersona === persona.id 
                  ? '3px solid white' 
                  : '3px solid transparent',
                backdropFilter: 'blur(10px)',
                transform: selectedPersona === persona.id ? 'scale(1.02)' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                if (selectedPersona !== persona.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedPersona !== persona.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <div style={{
                fontSize: '3rem',
                textAlign: 'center',
                marginBottom: '1rem'
              }}>
                {persona.emoji}
              </div>
              
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
                textAlign: 'center'
              }}>
                {persona.title}
              </h3>
              
              <p style={{
                fontSize: '1rem',
                opacity: 0.8,
                marginBottom: '1rem',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                {persona.subtitle}
              </p>
              
              <p style={{
                fontSize: '0.95rem',
                marginBottom: '1.5rem',
                textAlign: 'center',
                lineHeight: '1.5'
              }}>
                {persona.description}
              </p>
              
              <div style={{ marginBottom: '1.5rem' }}>
                {persona.traits.map((trait, index) => (
                  <div key={index} style={{
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{ marginRight: '0.5rem' }}>✓</span>
                    {trait}
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
                {persona.example}
              </div>
              
              {selectedPersona === persona.id && (
                <div style={{
                  marginTop: '1rem',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: 'white'
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
          disabled={!selectedPersona || isSubmitting}
          style={{
            background: selectedPersona 
              ? `linear-gradient(45deg, ${BRAND_BLUE} 0%, ${BRAND_PURPLE} 100%)`
              : '#e5e7eb',
            color: selectedPersona ? 'white' : '#9ca3af',
            fontSize: 'clamp(1.25rem, 4vw, 2rem)',
            fontWeight: '900',
            padding: '1rem 3rem',
            borderRadius: '1rem',
            border: 'none',
            cursor: selectedPersona ? 'pointer' : 'not-allowed',
            boxShadow: selectedPersona ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
            transition: 'all 0.2s',
            transform: selectedPersona ? 'scale(1)' : 'scale(0.95)'
          }}
          className={selectedPersona ? "transition-all hover:scale-105" : ""}
        >
          {isSubmitting ? 'Setting up your voice...' : 'Continue →'}
        </button>

        {/* Skip Option */}
        <Link 
          href="/dashboard" 
          style={{
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            fontSize: '1rem',
            marginTop: '1rem'
          }}
        >
          Skip for now
        </Link>
      </div>

      {/* Back Navigation */}
      <div style={{ 
        padding: '1rem', 
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Link 
          href={userType === 'business' ? '/onboarding/business' : '/onboarding/user-type'}
          style={{ 
            color: 'rgba(255,255,255,0.7)', 
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)'
          }}
        >
          ← Back to {userType === 'business' ? 'Business Type' : 'User Type'}
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
