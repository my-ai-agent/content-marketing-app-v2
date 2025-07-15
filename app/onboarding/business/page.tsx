// Update file: /app/onboarding/business/page.tsx
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

// Group business types into categories
interface BusinessCategory {
  id: string
  title: string
  subtitle: string
  emoji: string
  businessTypes: BusinessType[]
}

const businessCategories: BusinessCategory[] = [
  {
    id: 'tourism',
    title: 'Tourism Business',
    subtitle: 'Travel, accommodation, attractions, experiences',
    emoji: '🏨',
    businessTypes: businessTypes.filter(bt => 
      ['accommodation', 'attraction', 'tours', 'transport', 'cultural', 'wellness', 'cruise'].includes(bt.id)
    )
  },
  {
    id: 'smallbusiness',
    title: 'Small Business',
    subtitle: 'Local commerce, food, retail, entertainment',
    emoji: '🏪',
    businessTypes: businessTypes.filter(bt => 
      ['food', 'retail', 'entertainment'].includes(bt.id)
    )
  },
  {
    id: 'community',
    title: 'Community Service',
    subtitle: 'Information, conservation, events, specialized services',
    emoji: '🏛️',
    businessTypes: businessTypes.filter(bt => 
      ['information', 'conservation', 'events', 'other'].includes(bt.id)
    )
  }
]

export default function BusinessTypeSelection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>('')
  const [showTooltip, setShowTooltip] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedBusinessType('') // Reset business type when category changes
    setShowTooltip('')
  }

  const handleBusinessTypeSelect = (businessTypeId: string) => {
    setSelectedBusinessType(businessTypeId)
    setShowTooltip('')
  }

  const handleSubmit = async () => {
    if (!selectedBusinessType) return

    setIsSubmitting(true)
    
    try {
      // Store business type in localStorage (same structure as before)
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

  const selectedCategoryData = businessCategories.find(cat => cat.id === selectedCategory)
  const selectedBusinessTypeData = businessTypes.find(bt => bt.id === selectedBusinessType)

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
        <h1 style={{ 
          fontSize: 'clamp(2rem, 6vw, 4rem)', 
          fontWeight: '700',
          color: '#1f2937',
          lineHeight: '1.2',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          Select Business Type
        </h1>
        <p style={{ 
          color: '#6b7280', 
          textAlign: 'center', 
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Choose your business category to get targeted content strategies
        </p>
      </div>

      <div style={{ 
        flex: '1', 
        maxWidth: '900px', 
        margin: '0 auto', 
        width: '100%', 
        padding: '2rem 1rem' 
      }}>

        {/* Step 1: Business Category Selection */}
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
            marginBottom: '1rem'
          }}>
            🏢 Select Your Business Category
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '1rem'
          }}>
            Choose the category that best describes your business type.
          </p>
          
          {/* Category Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowTooltip(showTooltip === 'category' ? '' : 'category')}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                backgroundColor: 'white',
                color: selectedCategory ? '#374151' : '#9ca3af',
                outline: 'none',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onFocus={(e) => e.target.style.borderColor = BRAND_PURPLE}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              <span>
                {selectedCategory 
                  ? `${selectedCategoryData?.emoji} ${selectedCategoryData?.title}`
                  : 'Select your business category...'
                }
              </span>
              <span style={{ 
                fontSize: '0.75rem', 
                transform: showTooltip === 'category' ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }}>
                ▼
              </span>
            </button>

            {/* Category Dropdown Options */}
            {showTooltip === 'category' && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                right: '0',
                backgroundColor: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                marginTop: '0.25rem',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 10,
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
              }}>
                {businessCategories.map((category, index) => (
                  <div
                    key={category.id}
                    onClick={() => {
                      handleCategorySelect(category.id)
                      setShowTooltip('')
                    }}
                    style={{
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      borderBottom: index < businessCategories.length - 1 ? '1px solid #f3f4f6' : 'none',
                      backgroundColor: selectedCategory === category.id ? '#f0f9ff' : 'white',
                      color: '#374151',
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedCategory !== category.id) {
                        e.currentTarget.style.backgroundColor = '#f9fafb'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCategory !== category.id) {
                        e.currentTarget.style.backgroundColor = 'white'
                      }
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{category.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500' }}>{category.title}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {category.subtitle}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Specific Business Type Selection */}
        {selectedCategory && (
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
              marginBottom: '1rem'
            }}>
              🎯 Select Your Specific Business Type
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '1rem'
            }}>
              Choose the specific type that best matches your business.
            </p>
            
            {/* Business Type Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowTooltip(showTooltip === 'business' ? '' : 'business')}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  color: selectedBusinessType ? '#374151' : '#9ca3af',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onFocus={(e) => e.target.style.borderColor = BRAND_PURPLE}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              >
                <span>
                  {selectedBusinessType 
                    ? `${selectedBusinessTypeData?.emoji} ${selectedBusinessTypeData?.title}`
                    : 'Select your business type...'
                  }
                </span>
                <span style={{ 
                  fontSize: '0.75rem', 
                  transform: showTooltip === 'business' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}>
                  ▼
                </span>
              </button>

              {/* Business Type Dropdown Options */}
              {showTooltip === 'business' && selectedCategoryData && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  right: '0',
                  backgroundColor: 'white',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  marginTop: '0.25rem',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  zIndex: 10,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}>
                  {selectedCategoryData.businessTypes.map((businessType, index) => (
                    <div
                      key={businessType.id}
                      onClick={() => {
                        handleBusinessTypeSelect(businessType.id)
                        setShowTooltip('')
                      }}
                      style={{
                        padding: '0.75rem 1rem',
                        cursor: 'pointer',
                        borderBottom: index < selectedCategoryData.businessTypes.length - 1 ? '1px solid #f3f4f6' : 'none',
                        backgroundColor: selectedBusinessType === businessType.id ? '#f0f9ff' : 'white',
                        color: '#374151',
                        fontSize: '0.95rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedBusinessType !== businessType.id) {
                          e.currentTarget.style.backgroundColor = '#f9fafb'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedBusinessType !== businessType.id) {
                          e.currentTarget.style.backgroundColor = 'white'
                        }
                      }}
                    >
                      <span style={{ fontSize: '1.25rem' }}>{businessType.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500' }}>{businessType.title}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {businessType.subtitle}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowTooltip(showTooltip === businessType.id ? '' : businessType.id)
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: BRAND_PURPLE,
                          fontSize: '1rem',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          borderRadius: '50%'
                        }}
                      >
                        ℹ️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Selected Business Type Description */}
        {selectedBusinessType && selectedBusinessTypeData && (
          <div style={{
            marginBottom: '2rem',
            padding: '1rem',
            backgroundColor: '#dcfce7',
            border: '1px solid #bbf7d0',
            borderRadius: '0.75rem',
            maxWidth: '600px',
            margin: '0 auto 2rem auto'
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#15803d',
              margin: '0 0 0.5rem 0',
              fontWeight: '500'
            }}>
              <strong>{selectedBusinessTypeData.emoji} {selectedBusinessTypeData.title}:</strong> {selectedBusinessTypeData.subtitle}
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: '#15803d',
              margin: '0'
            }}>
              {selectedBusinessTypeData.description}
            </p>
          </div>
        )}

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
            href="/onboarding/user-type"
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
            ← Back
          </Link>

          <button
            onClick={handleSubmit}
            disabled={!selectedBusinessType || isSubmitting}
            style={{
              background: selectedBusinessType 
                ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                : '#e5e7eb',
              color: selectedBusinessType ? 'white' : '#9ca3af',
              fontSize: '1.25rem',
              fontWeight: '700',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: selectedBusinessType ? 'pointer' : 'not-allowed',
              boxShadow: selectedBusinessType ? '0 4px 15px rgba(107, 46, 255, 0.3)' : 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (selectedBusinessType) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(107, 46, 255, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedBusinessType) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(107, 46, 255, 0.3)'
              }
            }}
          >
            {isSubmitting ? 'Setting up your business...' : 'Continue →'}
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

        {/* Business Type Detail Tooltip */}
        {showTooltip && showTooltip !== 'category' && showTooltip !== 'business' && (
          <>
            <div
              onClick={() => setShowTooltip('')}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.25)',
                zIndex: 50
              }}
            />
            <div
              style={{
                position: 'fixed',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%,-50%)',
                background: '#1f2937',
                color: 'white',
                padding: '1.25rem 1.5rem',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                zIndex: 60,
                boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
                maxWidth: '90vw',
                width: '320px',
                textAlign: 'center'
              }}
            >
              {(() => {
                const businessType = businessTypes.find(bt => bt.id === showTooltip)
                return businessType ? (
                  <>
                    <div style={{ marginBottom: '0.75rem', fontWeight: 'bold', fontSize: '1.1em' }}>
                      {businessType.emoji} {businessType.title}
                    </div>
                    <div style={{ marginBottom: '1rem', lineHeight: '1.4' }}>
                      {businessType.description}
                    </div>
                    <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                      <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Content Focus:</div>
                      {businessType.contentFocus.slice(0, 3).map((focus, index) => (
                        <div key={index} style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          • {focus}
                        </div>
                      ))}
                    </div>
                    <div style={{ color: '#fbbf24', fontSize: '0.875em' }}>
                      Tap anywhere to close
                    </div>
                  </>
                ) : null
              })()}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
