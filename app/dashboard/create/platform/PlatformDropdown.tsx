"use client"

import { useState, useRef, useEffect } from 'react'

const BRAND_PURPLE = '#6B2EFF'

export interface Platform {
  value: string
  label: string
  description: string
}

interface Props {
  platforms: Platform[]
  selectedPlatforms: string[]
  setSelectedPlatforms: (platforms: string[]) => void
}

export default function PlatformDropdown({
  platforms,
  selectedPlatforms,
  setSelectedPlatforms,
}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [touchedItem, setTouchedItem] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone']
      return mobileKeywords.some(keyword => userAgent.includes(keyword)) || 
             window.innerWidth <= 768 ||
             ('ontouchstart' in window)
    }
    
    setIsMobile(checkMobile())
    
    // Re-check on resize
    const handleResize = () => setIsMobile(checkMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Mobile handler - multiple select with checkboxes
  const handleMobileChange = (platformValue: string, isChecked: boolean) => {
    console.log('Mobile platform selection:', platformValue, isChecked)
    if (isChecked) {
      setSelectedPlatforms([...selectedPlatforms, platformValue])
    } else {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platformValue))
    }
  }

  // Desktop handler - existing logic
  const handleDesktopToggle = (platformValue: string) => {
    console.log('Desktop platform toggle:', platformValue)
    if (selectedPlatforms.includes(platformValue)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platformValue))
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformValue])
    }
  }

  const removePlatform = (platformValue: string) => {
    setSelectedPlatforms(selectedPlatforms.filter(p => p !== platformValue))
  }

  const getSelectedPlatformLabels = () => {
    return selectedPlatforms.map(value => 
      platforms.find(p => p.value === value)?.label || value
    )
  }

  // 📱 MOBILE RENDER: Native checkboxes (Multi-select friendly)
  if (isMobile) {
    return (
      <>
        <div style={{ position: 'relative' }}>
          {/* Mobile indicator */}
          <div style={{
            position: 'absolute',
            top: '-0.5rem',
            right: '0.5rem',
            backgroundColor: '#10b981',
            color: 'white',
            fontSize: '0.625rem',
            padding: '0.125rem 0.375rem',
            borderRadius: '0.25rem',
            fontWeight: '600',
            zIndex: 10
          }}>
            📱 Mobile
          </div>

          {/* Mobile Checkbox List */}
          <div style={{
            border: '2px solid #e5e7eb',
            borderRadius: '0.75rem',
            backgroundColor: 'white',
            padding: '1rem'
          }}>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '1rem'
            }}>
              Select Platforms ({selectedPlatforms.length} selected):
            </div>
            
            {platforms.map((platform) => (
              <label
                key={platform.value}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #f3f4f6',
                  cursor: 'pointer',
                  minHeight: '44px'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedPlatforms.includes(platform.value)}
                  onChange={(e) => handleMobileChange(platform.value, e.target.checked)}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginTop: '2px',
                    flexShrink: 0,
                    cursor: 'pointer'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    {platform.label}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#6b7280',
                    lineHeight: '1.3'
                  }}>
                    {platform.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Selected Platform Tags - Mobile */}
        {selectedPlatforms.length > 0 && (
          <div style={{
            marginTop: '1rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            {getSelectedPlatformLabels().map((label, index) => (
              <div
                key={selectedPlatforms[index]}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.875rem',
                  color: '#1e40af'
                }}
              >
                <span>{label}</span>
                <button
                  onClick={() => removePlatform(selectedPlatforms[index])}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    padding: '0.25rem',
                    minWidth: '24px',
                    minHeight: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </>
    )
  }

  // 🖥️ DESKTOP RENDER: Custom Dropdown (Existing working code)
  return (
    <>
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            width: '100%',
            minHeight: '44px',
            padding: '0.75rem 1rem',
            border: '2px solid #e5e7eb',
            borderRadius: '0.75rem',
            fontSize: '1rem',
            backgroundColor: 'white',
            color: selectedPlatforms.length > 0 ? '#374151' : '#9ca3af',
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
            {selectedPlatforms.length === 0 
              ? 'Select platforms...' 
              : `${selectedPlatforms.length} platform${selectedPlatforms.length === 1 ? '' : 's'} selected`
            }
          </span>
          <span style={{ 
            fontSize: '0.75rem', 
            transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }}>
            ▼
          </span>
        </button>

        {/* Desktop indicator */}
        <div style={{
          position: 'absolute',
          top: '-0.5rem',
          right: '0.5rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          fontSize: '0.625rem',
          padding: '0.125rem 0.375rem',
          borderRadius: '0.25rem',
          fontWeight: '600'
        }}>
          🖥️ Desktop
        </div>

        {isDropdownOpen && (
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
            {platforms.map((platform, index) => (
              <div
                key={platform.value}
                onClick={() => handleDesktopToggle(platform.value)}
                style={{
                  minHeight: '44px',
                  padding: '1rem',
                  cursor: 'pointer',
                  borderBottom: index < platforms.length - 1 ? '1px solid #f3f4f6' : 'none',
                  backgroundColor: selectedPlatforms.includes(platform.value) ? '#f0f9ff' : 'white',
                  color: '#374151',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
                onMouseEnter={(e) => {
                  if (!selectedPlatforms.includes(platform.value)) {
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedPlatforms.includes(platform.value)) {
                    e.currentTarget.style.backgroundColor = 'white'
                  }
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  border: '2px solid #d1d5db',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: selectedPlatforms.includes(platform.value) ? BRAND_PURPLE : 'white',
                  borderColor: selectedPlatforms.includes(platform.value) ? BRAND_PURPLE : '#d1d5db',
                  flexShrink: 0
                }}>
                  {selectedPlatforms.includes(platform.value) && (
                    <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>✓</span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', marginBottom: '2px' }}>{platform.label}</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.3' }}>
                    {platform.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Platform Tags - Desktop */}
      {selectedPlatforms.length > 0 && (
        <div style={{
          marginTop: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          {getSelectedPlatformLabels().map((label, index) => (
            <div
              key={selectedPlatforms[index]}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '0.75rem',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                color: '#1e40af',
                minHeight: '36px'
              }}
            >
              <span>{label}</span>
              <button
                onClick={() => removePlatform(selectedPlatforms[index])}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  fontSize: '1.125rem',
                  padding: '0.25rem',
                  minWidth: '24px',
                  minHeight: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#dc2626'
                  e.currentTarget.style.backgroundColor = '#fee2e2'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#6b7280'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
