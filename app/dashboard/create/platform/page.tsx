'use client'
import { useState, useEffect } from 'react'
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

// Standardized Step Tracker Component
const StepTracker = ({ currentStep }: { currentStep: number }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: '0.5rem', 
    marginBottom: '1.5rem' 
  }}>
    {[1, 2, 3, 4, 5, 6].map((step) => (
      <div key={step} style={{ 
        width: '2rem', 
        height: '2rem', 
        borderRadius: '50%', 
        backgroundColor: step <= currentStep ? (step === currentStep ? BRAND_PURPLE : BRAND_ORANGE) : '#e5e7eb',
        color: step <= currentStep ? 'white' : '#9ca3af',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: '0.875rem', 
        fontWeight: '600',
        transition: 'all 0.3s ease'
      }}>
        {step}
      </div>
    ))}
  </div>
)

// Platform showcase with real platform names and colors
const platformSets = [
  [
    { name: 'Instagram', color: '#E4405F', icon: '📷' },
    { name: 'Facebook', color: '#1877F2', icon: '👥' },
    { name: 'LinkedIn', color: '#0A66C2', icon: '💼' },
    { name: 'Website', color: '#6B46C1', icon: '🌐' }
  ],
  [
    { name: 'TikTok', color: '#000000', icon: '🎵' },
    { name: 'YouTube', color: '#FF0000', icon: '📺' },
    { name: 'Twitter', color: '#1DA1F2', icon: '🐦' },
    { name: 'Pinterest', color: '#E60023', icon: '📌' }
  ],
  [
    { name: 'Snapchat', color: '#FFFC00', icon: '👻' },
    { name: 'WhatsApp', color: '#25D366', icon: '💬' },
    { name: 'Email Newsletter', color: '#4338ca', icon: '📧' },
    { name: 'Reddit', color: '#FF4500', icon: '🤖' }
  ]
]

export default function PlatformSelection() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [currentPlatformSet, setCurrentPlatformSet] = useState(0)

  useEffect(() => {
    // Auto-rotate platform sets
    const interval = setInterval(() => {
      setCurrentPlatformSet(prev => (prev + 1) % platformSets.length)
    }, 4000)

    // Load existing selections
    const existingPlatforms = localStorage.getItem('selectedPlatforms')
    if (existingPlatforms) {
      try {
        const parsed = JSON.parse(existingPlatforms)
        if (Array.isArray(parsed)) {
          setSelectedPlatforms(parsed)
        }
      } catch (error) {
        console.error('Error parsing existing platforms:', error)
      }
    }

    return () => clearInterval(interval)
  }, [])

  const togglePlatform = (platformName: string) => {
    setSelectedPlatforms(prev => {
      const updated = prev.includes(platformName.toLowerCase())
        ? prev.filter(p => p !== platformName.toLowerCase())
        : [...prev, platformName.toLowerCase()]
      
      localStorage.setItem('selectedPlatforms', JSON.stringify(updated))
      return updated
    })
  }

  const handleNext = () => {
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform before continuing.')
      return
    }
    
    localStorage.setItem('selectedPlatforms', JSON.stringify(selectedPlatforms))
    window.location.href = '/dashboard/create/results'
  }

  const handleSkip = () => {
    const defaultPlatforms = ['instagram', 'facebook']
    localStorage.setItem('selectedPlatforms', JSON.stringify(defaultPlatforms))
    window.location.href = '/dashboard/create/results'
  }

  const handleSelectAll = () => {
    const currentPlatforms = platformSets[currentPlatformSet].map(p => p.name.toLowerCase())
    const allSelected = currentPlatforms.every(platform => 
      selectedPlatforms.includes(platform)
    )
    
    if (allSelected) {
      // Deselect all current platforms
      setSelectedPlatforms(prev => 
        prev.filter(p => !currentPlatforms.includes(p))
      )
    } else {
      // Select all current platforms
      setSelectedPlatforms(prev => {
        const updated = [...prev]
        currentPlatforms.forEach(platform => {
          if (!updated.includes(platform)) {
            updated.push(platform)
          }
        })
        return updated
      })
    }
  }

  const currentPlatforms = platformSets[currentPlatformSet]
  const allCurrentSelected = currentPlatforms.every(platform => 
    selectedPlatforms.includes(platform.name.toLowerCase())
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header with Step Tracker */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '2rem 1rem',
          marginBottom: '2rem'
        }}>
          <StepTracker currentStep={5} />
          
          <h1 style={{ 
            fontSize: 'clamp(2rem, 6vw, 3rem)', 
            fontWeight: '700',
            color: '#1f2937',
            lineHeight: '1.2',
            marginBottom: '0rem',
            textAlign: 'center'
          }}>
            Choose Your Platforms
          </h1>
          <p style={{ 
            fontSize: '1.125rem',
            color: '#6b7280',
            margin: '1rem 0 0 0',
            textAlign: 'center'
          }}>
            Select where you want to share your content
          </p>
        </div>

        {/* Platform Selection */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          
          {/* Platform Set Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0'
            }}>
              Popular Platforms
            </h2>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleSelectAll}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  backgroundColor: allCurrentSelected ? '#ef4444' : BRAND_BLUE,
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {allCurrentSelected ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>

          {/* Platform Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {currentPlatforms.map((platform) => {
              const isSelected = selectedPlatforms.includes(platform.name.toLowerCase())
              return (
                <div
                  key={platform.name}
                  onClick={() => togglePlatform(platform.name)}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '1rem',
                    border: isSelected 
                      ? `3px solid ${BRAND_PURPLE}` 
                      : '3px solid transparent',
                    backgroundColor: isSelected 
                      ? 'rgba(107, 46, 255, 0.05)' 
                      : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    position: 'relative',
                    boxShadow: isSelected 
                      ? '0 8px 25px rgba(107, 46, 255, 0.15)' 
                      : '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = isSelected 
                      ? '0 12px 35px rgba(107, 46, 255, 0.25)'
                      : '0 8px 25px rgba(0,0,0,0.15)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = isSelected 
                      ? '0 8px 25px rgba(107, 46, 255, 0.15)'
                      : '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      width: '1.5rem',
                      height: '1.5rem',
                      backgroundColor: BRAND_PURPLE,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: '700'
                    }}>
                      ✓
                    </div>
                  )}
                  
                  <div style={{
                    fontSize: '2.5rem',
                    marginBottom: '0.75rem'
                  }}>
                    {platform.icon}
                  </div>
                  
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '0.5rem',
                    margin: '0'
                  }}>
                    {platform.name}
                  </h3>
                  
                  <div style={{
                    width: '100%',
                    height: '3px',
                    backgroundColor: platform.color,
                    borderRadius: '1.5px',
                    marginTop: '0.75rem'
                  }} />
                </div>
              )
            })}
          </div>

          {/* Platform Set Indicators */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            {platformSets.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentPlatformSet(index)}
                style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  borderRadius: '50%',
                  backgroundColor: index === currentPlatformSet ? BRAND_PURPLE : '#d1d5db',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Selected Platforms Summary */}
        {selectedPlatforms.length > 0 && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '1rem',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#065f46',
              marginBottom: '0.5rem',
              margin: '0 0 0.5rem 0'
            }}>
              Selected Platforms ({selectedPlatforms.length}):
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              {selectedPlatforms.map((platform) => (
                <span
                  key={platform}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <button
            onClick={handleSkip}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '2px solid #e5e7eb',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#9ca3af'
              e.currentTarget.style.color = '#374151'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.color = '#6b7280'
            }}
          >
            Use Defaults
          </button>

          <PrimaryButton
            onClick={handleNext}
            disabled={selectedPlatforms.length === 0}
            size="large"
          >
            Generate Content →
          </PrimaryButton>
        </div>

        {/* Logo */}
<div style={{ 
  textAlign: 'center', 
  marginBottom: '2rem',
  paddingTop: '2rem'
}}>
  <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
    <BrandLogo />
  </Link>
</div>

        {/* Bottom Navigation */}
        <div style={{ textAlign: 'center' }}>
          <Link 
            href="/dashboard/create/interests" 
            style={{ 
              color: '#6b7280', 
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#374151'}
            onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
          >
            ← Back to Interests
          </Link>
        </div>
      </div>
    </div>
  )
}
