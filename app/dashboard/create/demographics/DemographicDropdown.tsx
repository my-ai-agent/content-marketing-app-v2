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
  const [tooltipDemo, setTooltipDemo] = useState<Demographic | null>(null)
  const [touchedItem, setTouchedItem] = useState<string | null>(null)
  const [isTouch, setIsTouch] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 🔧 FIX: Force re-render when selectedDemographic changes
  const [displayValue, setDisplayValue] = useState('')

  useEffect(() => {
    const selectedDemo = demographics.find(demo => demo.value === selectedDemographic)
    setDisplayValue(selectedDemo ? selectedDemo.label : '')
  }, [selectedDemographic, demographics])

  // Mobile-optimized touch handlers
  const handleTouchStart = (demoValue?: string) => {
    setIsTouch(true)
    if (demoValue) {
      setTouchedItem(demoValue)
      setTooltipDemo(demographics.find(d => d.value === demoValue) || null)
      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    }
  }

  const handleTouchEnd = () => {
    setTouchedItem(null)
  }

  // Hide tooltip on mobile tap outside
  const handleBackdropClick = () => {
    setTooltipDemo(null)
  }

  // 🔧 FIX: Improved selection handler
  const handleSelectDemographic = (demoValue: string) => {
    console.log('Selecting demographic:', demoValue) // Debug log
    setSelectedDemographic(demoValue)
    setIsDropdownOpen(false)
    setTooltipDemo(null)
    setTouchedItem(null)
    
    // 🔧 FIX: Immediately update display value
    const selectedDemo = demographics.find(demo => demo.value === demoValue)
    if (selectedDemo) {
      setDisplayValue(selectedDemo.label)
    }
  }

  const selectedDemo = demographics.find(demo => demo.value === selectedDemographic)

  return (
    <>
      <div
        style={{ position: 'relative' }}
        ref={dropdownRef}
        onTouchStart={() => handleTouchStart()}
      >
        <button
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
          onClick={() => setIsDropdownOpen((v) => !v)}
          onTouchStart={() => {
            if (navigator.vibrate) navigator.vibrate(30)
          }}
          style={{
            width: '100%',
            minHeight: '44px',
            padding: '0.75rem 1rem',
            border: '2px solid #e5e7eb',
            borderRadius: '0.75rem',
            fontSize: '1rem',
            backgroundColor: 'white',
            // 🔧 FIX: Better color logic for selected state
            color: displayValue ? '#374151' : '#9ca3af',
            outline: 'none',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            touchAction: 'manipulation'
          }}
          onFocus={(e) => e.target.style.borderColor = BRAND_PURPLE}
          onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
        >
          <span>
            {/* 🔧 FIX: Use displayValue instead of complex logic */}
            {displayValue || 'Select your target audience...'}
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            ▼
          </span>
        </button>

        {isDropdownOpen && (
          <div
            style={{
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
            }}
            role="listbox"
          >
            {demographics.map((demo, index) => (
              <div
                key={demo.value}
                role="option"
                aria-selected={selectedDemographic === demo.value}
                tabIndex={0}
                onMouseEnter={() => !isTouch && setTooltipDemo(demo)}
                onMouseLeave={() => !isTouch && setTooltipDemo(null)}
                onFocus={() => !isTouch && setTooltipDemo(demo)}
                onBlur={() => !isTouch && setTooltipDemo(null)}
                onTouchStart={() => handleTouchStart(demo.value)}
                onTouchEnd={handleTouchEnd}
                // 🔧 FIX: Use the improved selection handler
                onClick={() => handleSelectDemographic(demo.value)}
                style={{
                  minHeight: '44px',
                  padding: '1rem',
                  cursor: 'pointer',
                  borderBottom: index < demographics.length - 1 ? '1px solid #f3f4f6' : 'none',
                  position: 'relative',
                  backgroundColor:
                    touchedItem === demo.value ? '#e0e7ff' :
                    selectedDemographic === demo.value ? '#f0f9ff' :
                    tooltipDemo?.value === demo.value ? '#f9fafb' : 'white',
                  color: '#374151',
                  fontSize: '0.95rem',
                  outline: tooltipDemo?.value === demo.value ? `2px solid ${BRAND_PURPLE}` : 'none',
                  touchAction: 'manipulation',
                  transition: 'background-color 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', marginBottom: '2px' }}>{demo.label}</div>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: '#6b7280', 
                    lineHeight: '1.3',
                    display: isTouch ? 'block' : 'none'
                  }}>
                    {demo.description.substring(0, 50)}...
                  </div>
                </div>

                {/* ✅ Selection indicator */}
                {selectedDemographic === demo.value && (
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: BRAND_PURPLE,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    marginLeft: '0.5rem',
                    flexShrink: 0,
                    fontWeight: 'bold'
                  }}>
                    ✓
                  </div>
                )}

                {/* Info icon for mobile users (when not selected) */}
                {isTouch && selectedDemographic !== demo.value && (
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#e5e7eb',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    marginLeft: '0.5rem',
                    flexShrink: 0
                  }}>
                    ℹ
                  </div>
                )}

                {/* Tooltip for desktop */}
                {!isTouch && tooltipDemo?.value === demo.value && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      top: '-60px',
                      background: '#1f2937',
                      color: 'white',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      opacity: 1,
                      visibility: 'visible',
                      zIndex: 30,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      maxWidth: '280px',
                      minWidth: '200px',
                      whiteSpace: 'normal',
                      lineHeight: '1.4',
                      pointerEvents: 'none',
                      textAlign: 'center'
                    }}
                  >
                    {demo.description}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-6px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '6px solid #1f2937',
                      }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Selected Audience Description */}
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

      {/* Improved mobile modal */}
      {isTouch && tooltipDemo && (
        <>
          <div
            onClick={handleBackdropClick}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.25)',
              zIndex: 50,
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
              padding: '1.5rem',
              borderRadius: '1rem',
              fontSize: '1rem',
              zIndex: 60,
              boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
              maxWidth: '90vw',
              width: '320px',
              textAlign: 'center',
            }}
          >
            <div style={{ marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.1em' }}>
              {tooltipDemo.label}
            </div>
            <div style={{ marginBottom: '1.5rem', lineHeight: '1.4' }}>
              {tooltipDemo.description}
            </div>
            <button
              onClick={handleBackdropClick}
              onTouchStart={() => {
                if (navigator.vibrate) navigator.vibrate(30)
              }}
              style={{
                backgroundColor: BRAND_PURPLE,
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                minHeight: '44px',
                minWidth: '100px',
                touchAction: 'manipulation'
              }}
            >
              Got it!
            </button>
          </div>
        </>
      )}
    </>
  )
}
