"use client"

import { useState, useRef } from 'react'

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
  const [isTouch, setIsTouch] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Helper: determine if device is touch
  const handleTouchStart = () => {
    setIsTouch(true)
  }

  // Hide tooltip on mobile tap outside
  const handleBackdropClick = () => {
    setTooltipDemo(null)
  }

  const selectedDemo = demographics.find(demo => demo.value === selectedDemographic)

  return (
    <>
      <div
        style={{ position: 'relative' }}
        ref={dropdownRef}
        onTouchStart={handleTouchStart}
      >
        <button
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
          onClick={() => setIsDropdownOpen((v) => !v)}
          style={{
            width: '100%',
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
            alignItems: 'center',
          }}
          onFocus={(e) => e.target.style.borderColor = BRAND_PURPLE}
          onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
        >
          <span>
            {selectedDemo ? selectedDemo.label : 'Select your target audience...'}
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
                onTouchStart={() => setTooltipDemo(demo)}
                onClick={() => {
                  setSelectedDemographic(demo.value)
                  setIsDropdownOpen(false)
                  setTooltipDemo(null)
                }}
                style={{
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  borderBottom: index < demographics.length - 1 ? '1px solid #f3f4f6' : 'none',
                  position: 'relative',
                  backgroundColor:
                    selectedDemographic === demo.value
                      ? '#f0f9ff'
                      : tooltipDemo?.value === demo.value
                      ? '#f9fafb'
                      : 'white',
                  color: '#374151',
                  fontSize: '0.95rem',
                  outline: tooltipDemo?.value === demo.value ? `2px solid ${BRAND_PURPLE}` : 'none',
                }}
              >
                {demo.label}

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

      {/* Selected Audience Description */}
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
            fontWeight: '500'
          }}>
            <strong>{selectedDemo.label}:</strong> {selectedDemo.description}
          </p>
        </div>
      )}

      {/* Tooltip for mobile: show as modal overlay */}
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
              padding: '1.25rem 1.5rem',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              zIndex: 60,
              boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
              maxWidth: '90vw',
              width: '320px',
              textAlign: 'center',
            }}
            onClick={handleBackdropClick}
          >
            <div style={{ marginBottom: '0.75rem', fontWeight: 'bold', fontSize: '1.1em' }}>
              {tooltipDemo.label}
            </div>
            <div style={{ marginBottom: '1rem', lineHeight: '1.4' }}>
              {tooltipDemo.description}
            </div>
            <div style={{
              color: '#fbbf24',
              fontSize: '0.875em',
            }}>
              Tap anywhere to close
            </div>
          </div>
        </>
      )}
    </>
  )
}
