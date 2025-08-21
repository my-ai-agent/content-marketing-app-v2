"use client"

import { useState, useRef, useEffect } from 'react'

const BRAND_PURPLE = '#6B2EFF'

export interface Demographic {
  value: string
  label: string
  description: string
}

interface Props {
  demographics: Demographic[]
  selectedDemographic: string
  setSelectedDemographic: (val: string) => void
}

export default function DemographicDropdown({
  demographics,
  selectedDemographic,
  setSelectedDemographic,
}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [tooltipDemo, setTooltipDemo] = useState<Demographic | null>(null)
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

  // Mobile handler - simple and reliable
  const handleMobileSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    console.log('Mobile demographic selection:', value)
    setSelectedDemographic(value)
  }

  // Desktop handler - existing complex logic
  const handleDesktopSelect = (demoValue: string) => {
    console.log('Desktop demographic selection:', demoValue)
    setSelectedDemographic(demoValue)
    setIsDropdownOpen(false)
    setTooltipDemo(null)
  }

  const selectedDemo = demographics.find(demo => demo.value === selectedDemographic)

  // 📱 MOBILE RENDER: Native HTML Select (Fixes all mobile issues)
  if (isMobile) {
    return (
      <>
        <div style={{ position: 'relative' }}>
          <select
            value={selectedDemographic}
            onChange={handleMobileSelect}
            style={{
              width: '100%',
              minHeight: '44px',
              padding: '0.75rem 1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              backgroundColor: 'white',
              color: selectedDemographic ? '#374151' : '#9ca3af',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1rem',
              paddingRight: '3rem'
            }}
            onFocus={(e) => e.target.style.borderColor = BRAND_PURPLE}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          >
            <option value="" disabled>
              Select your target audience...
            </option>
            {demographics.map((demo) => (
              <option key={demo.value} value={demo.value}>
                {demo.label}
              </option>
            ))}
          </select>
          
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
            fontWeight: '600'
          }}>
            📱 Mobile
          </div>
        </div>

        {/* Selected Description - Mobile */}
        {selectedDemo && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#dcfce7',
            border: '1px solid #bbf7d0',
            borderRadius: '0.75rem'
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#15803d',
              margin: '0',
              fontWeight: '500',
              lineHeight: '1.4'
            }}>
              <strong>{selectedDemo.label}:</strong> {selectedDemo.description}
            </p>
          </div>
        )}
      </>
    )
  }

  // 🖥️ DESKTOP RENDER: Custom Dropdown (Your existing working code)
  return (
    <>
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <button
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            width: '100%',
            minHeight: '44px',
            padding: '0.75rem 1rem',
            border: '2px solid #e5e7eb',
            borderRadius: '0.75rem',
            fontSize: '1rem',
            backgroundColor: 'white',
            color: selectedDemographic ? '#374151' : '#9ca3af',
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
            {selectedDemo ? selectedDemo.label : 'Select your target audience...'}
          </span>
          <span style={{
            fontSize: '0.75rem',
            transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
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
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: '0.75rem',
            marginTop: '0.25rem',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 10,
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          }}>
            {demographics.map((demo, index) => (
              <div
                key={demo.value}
                onClick={() => handleDesktopSelect(demo.value)}
                onMouseEnter={() => setTooltipDemo(demo)}
                onMouseLeave={() => setTooltipDemo(null)}
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  borderBottom: index < demographics.length - 1 ? '1px solid #f3f4f6' : 'none',
                  backgroundColor: selectedDemographic === demo.value ? '#f0f9ff' : 'white',
                  color: '#374151',
                  fontSize: '0.95rem',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  if (selectedDemographic !== demo.value) {
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedDemographic !== demo.value) {
                    e.currentTarget.style.backgroundColor = 'white'
                  }
                }}
              >
                <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                  {demo.label}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  {demo.description}
                </div>

                {/* Desktop tooltip */}
                {tooltipDemo?.value === demo.value && (
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    top: '-60px',
                    background: '#1f2937',
                    color: 'white',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    zIndex: 30,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    maxWidth: '280px',
                    minWidth: '200px',
                    whiteSpace: 'normal',
                    lineHeight: '1.4',
                    pointerEvents: 'none',
                    textAlign: 'center'
                  }}>
                    {demo.description}
                    <div style={{
                      position: 'absolute',
                      bottom: '-6px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '6px solid #1f2937',
                    }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Description - Desktop */}
      {selectedDemo && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#dcfce7',
          border: '1px solid #bbf7d0',
          borderRadius: '0.75rem'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#15803d',
            margin: '0',
            fontWeight: '500',
            lineHeight: '1.4'
          }}>
            <strong>{selectedDemo.label}:</strong> {selectedDemo.description}
          </p>
        </div>
      )}
    </>
  )
}
