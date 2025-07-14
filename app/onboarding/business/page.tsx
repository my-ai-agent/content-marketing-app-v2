// Create new file: /app/onboarding/business/page.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

interface BusinessType {
  id: string
  title: string
  subtitle: string
  description: string
  contentFocus: string[]
  emoji: string
  examples: string[]
}

const businessTypes: BusinessType[] = [
  {
    id: 'accommodation',
    title: 'Accommodation',
    subtitle: 'Hotels, B&Bs, Holiday Parks, Motels',
    description: 'Hospitality-focused content that drives direct bookings and showcases guest experiences',
    contentFocus: ['Guest experiences', 'Local recommendations', 'Comfort & amenities', 'Cultural connections'],
    emoji: '🏨',
    examples: ['Hotel chains', 'Boutique B&Bs', 'Holiday parks', 'Backpacker hostels']
  },
  {
    id: 'attraction',
    title: 'Visitor Attraction',
    subtitle: 'Theme Parks, Museums, Cultural Sites, Galleries',
    description: 'Experience-driven content that highlights unique features and cultural significance',
    contentFocus: ['Unique experiences', 'Educational value', 'Cultural stories', 'Visitor engagement'],
    emoji: '🎡',
    examples: ['Museums', 'Theme parks', 'Historic sites', 'Art galleries']
  },
  {
    id: 'food',
    title: 'Food & Beverage',
    subtitle: 'Restaurants, Cafés, Wineries, Breweries',
    description: 'Culinary storytelling that showcases authentic New Zealand flavours and dining experiences',
    contentFocus: ['Local ingredients', 'Culinary traditions', 'Dining atmosphere', 'Wine & food pairing'],
    emoji: '🍽️',
    examples: ['Fine dining', 'Casual cafés', 'Wineries', 'Food markets']
  },
  {
    id: 'retail',
    title: 'Retail & Gifts',
    subtitle: 'Souvenir Shops, Art Galleries, Markets, Crafts',
    description: 'Product storytelling that emphasizes authenticity, local craftsmanship, and cultural value',
    contentFocus: ['Authentic products', 'Local artisans', 'Cultural significance', 'Unique souvenirs'],
    emoji: '🛍️',
    examples: ['Souvenir shops', 'Art galleries', 'Craft markets', 'Māori art stores']
  },
  {
    id: 'tours',
    title: 'Tours & Activities',
    subtitle: 'Guided Tours, Adventure Activities, Experiences',
    description: 'Adventure and experience content that captures excitement and educational value',
    contentFocus: ['Adventure experiences', 'Educational tours', 'Safety & expertise', 'Memorable moments'],
    emoji: '🗺️',
    examples: ['Walking tours', 'Adventure activities', 'Cultural tours', 'Wildlife experiences']
  },
  {
    id: 'transport',
    title: 'Transport Services',
    subtitle: 'Scenic Railways, Ferry Services, Tour Buses',
    description: 'Journey-focused content that highlights scenic routes and travel experiences',
    contentFocus: ['Scenic journeys', 'Comfortable travel', 'Route highlights', 'Convenient connections'],
    emoji: '🚂',
    examples: ['Scenic railways', 'Ferry services', 'Tour buses', 'Charter flights']
  },
  {
    id: 'cultural',
    title: 'Cultural Experience',
    subtitle: 'Māori Cultural Centres, Marae Visits, Heritage',
    description: 'Culturally respectful content that educates and shares authentic Māori traditions',
    contentFocus: ['Cultural education', 'Authentic traditions', 'Respectful engagement', 'Living culture'],
    emoji: '🪶',
    examples: ['Māori cultural centres', 'Marae experiences', 'Cultural performances', 'Heritage sites']
  },
  {
    id: 'wellness',
    title: 'Wellness & Spa',
    subtitle: 'Hot Springs, Spa Retreats, Health Tourism',
    description: 'Wellness-focused content that promotes relaxation, rejuvenation, and natural healing',
    contentFocus: ['Relaxation benefits', 'Natural healing', 'Wellness journeys', 'Therapeutic experiences'],
    emoji: '♨️',
    examples: ['Hot springs', 'Spa retreats', 'Wellness centres', 'Health resorts']
  },
  {
    id: 'information',
    title: 'Visitor Information',
    subtitle: 'i-SITE Centres, Tourist Information, Concierge',
    description: 'Informational content that guides visitors and promotes local attractions and services',
    contentFocus: ['Local expertise', 'Travel planning', 'Regional highlights', 'Visitor guidance'],
    emoji: 'ℹ️',
    examples: ['i-SITE centres', 'Tourist information', 'Concierge services', 'Travel consultants']
  },
  {
    id: 'conservation',
    title: 'DOC & Conservation',
    subtitle: 'Department of Conservation, National Parks, Sanctuaries',
    description: 'Conservation-focused content that educates about environmental protection and natural heritage',
    contentFocus: ['Environmental education', 'Conservation efforts', 'Natural heritage', 'Sustainable tourism'],
    emoji: '🌿',
    examples: ['DOC visitor centres', 'National parks', 'Wildlife sanctuaries', 'Conservation projects']
  },
  {
    id: 'events',
    title: 'Event Organiser',
    subtitle: 'Festivals, Conferences, Cultural Events, Sports',
    description: 'Event-focused content that builds excitement, drives attendance, and showcases experiences',
    contentFocus: ['Event excitement', 'Attendee experiences', 'Cultural celebrations', 'Community engagement'],
    emoji: '🎪',
    examples: ['Cultural festivals', 'Music events', 'Sports tournaments', 'Business conferences']
  },
  {
    id: 'entertainment',
    title: 'Entertainment & Gaming',
    subtitle: 'Casinos, Entertainment Venues, Gaming',
    description: 'Entertainment content that highlights exciting experiences and responsible gaming',
    contentFocus: ['Entertainment value', 'Responsible gaming', 'Venue atmosphere', 'Special events'],
    emoji: '🎰',
    examples: ['Casinos', 'Entertainment complexes', 'Gaming venues', 'Show venues']
  },
  {
    id: 'cruise',
    title: 'Cruise & Marine',
    subtitle: 'Cruise Ships, Marine Tours, Harbour Experiences',
    description: 'Marine-focused content that showcases ocean experiences and coastal attractions',
    contentFocus: ['Ocean experiences', 'Coastal beauty', 'Marine wildlife', 'Onboard amenities'],
    emoji: '🚢',
    examples: ['Cruise operators', 'Marine tour companies', 'Harbour cruises', 'Yacht charters']
  },
  {
    id: 'other',
    title: 'Other Tourism Business',
    subtitle: 'Specialized Services, Unique Experiences',
    description: 'Customized content approach for unique or specialized tourism businesses',
    contentFocus: ['Specialized services', 'Unique value proposition', 'Target audience focus', 'Custom messaging'],
    emoji: '🎯',
    examples: ['Photography services', 'Equipment rental', 'Specialized tours', 'Consulting services']
  }
]

export default function BusinessTypeSelection() {
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleBusinessTypeSelect = (businessTypeId: string) => {
    setSelectedBusinessType(businessTypeId)
  }

  const handleSubmit = async () => {
    if (!selectedBusinessType) return

    setIsSubmitting(true)
    
    try {
      // Store business type in localStorage for now (later: user profile)
      localStorage.setItem('userBusinessType', selectedBusinessType)
      
      // Get selected business type details
      const businessType = businessTypes.find(bt => bt.id === selectedBusinessType)
      localStorage.setItem('userBusinessTypeDetails', JSON.stringify(businessType))
      
      // Redirect to persona selection
      window.location.href = '/onboarding/persona'
      
    } catch (error) {
      console.error('Failed to save business type:', error)
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
          🏢 What's Your Tourism Business?
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Tell us about your business so we can create content that perfectly matches your industry and audience.
        </p>
      </div>

      {/* Business Type Options */}
      <div style={{
        flex: 1,
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1400px',
          width: '100%',
          marginBottom: '3rem'
        }}>
          {businessTypes.map((businessType) => (
            <div
              key={businessType.id}
              onClick={() => handleBusinessTypeSelect(businessType.id)}
              style={{
                background: selectedBusinessType === businessType.id 
                  ? 'rgba(255,255,255,0.25)' 
                  : 'rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: selectedBusinessType === businessType.id 
                  ? '2px solid white' 
                  : '2px solid transparent',
                backdropFilter: 'blur(10px)',
                transform: selectedBusinessType === businessType.id ? 'scale(1.02)' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                if (selectedBusinessType !== businessType.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedBusinessType !== businessType.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{
                  fontSize: '2rem',
                  marginRight: '0.75rem'
                }}>
                  {businessType.emoji}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    margin: '0 0 0.25rem 0'
                  }}>
                    {businessType.title}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    opacity: 0.8,
                    margin: '0'
                  }}>
                    {businessType.subtitle}
                  </p>
                </div>
              </div>
              
              <p style={{
                fontSize: '0.875rem',
                marginBottom: '1rem',
                lineHeight: '1.4',
                opacity: 0.9
              }}>
                {businessType.description}
              </p>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  opacity: 0.8
                }}>
                  Content Focus:
                </div>
                {businessType.contentFocus.slice(0, 3).map((focus, index) => (
                  <div key={index} style={{
                    fontSize: '0.75rem',
                    marginBottom: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: 0.9
                  }}>
                    <span style={{ marginRight: '0.5rem', fontSize: '0.6rem' }}>✓</span>
                    {focus}
                  </div>
                ))}
              </div>
              
              <div style={{
                fontSize: '0.75rem',
                opacity: 0.7,
                fontStyle: 'italic'
              }}>
                Examples: {businessType.examples.slice(0, 2).join(', ')}
              </div>
              
              {selectedBusinessType === businessType.id && (
                <div style={{
                  marginTop: '1rem',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: 'white',
                  fontSize: '0.875rem'
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
          disabled={!selectedBusinessType || isSubmitting}
          style={{
            background: selectedBusinessType 
              ? `linear-gradient(45deg, ${BRAND_ORANGE} 0%, ${BRAND_PURPLE} 100%)`
              : '#e5e7eb',
            color: selectedBusinessType ? 'white' : '#9ca3af',
            fontSize: 'clamp(1.25rem, 4vw, 2rem)',
            fontWeight: '900',
            padding: '1rem 3rem',
            borderRadius: '1rem',
            border: 'none',
            cursor: selectedBusinessType ? 'pointer' : 'not-allowed',
            boxShadow: selectedBusinessType ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
            transition: 'all 0.2s',
            transform: selectedBusinessType ? 'scale(1)' : 'scale(0.95)'
          }}
        >
          {isSubmitting ? 'Setting up your business profile...' : 'Continue to Voice Selection →'}
        </button>

        {/* Skip Option */}
        <Link 
          href="/onboarding/persona" 
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
