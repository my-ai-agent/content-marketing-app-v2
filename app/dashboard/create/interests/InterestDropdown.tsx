"use client"

import { useState, useRef, useEffect } from 'react'

const BRAND_PURPLE = '#6B2EFF'

export interface Interest {
  value: string
  label: string
  description: string
}

interface Props {
  interests: Interest[]
  selectedInterest: string
  setSelectedInterest: (val: string) => void
}

export default function InterestDropdown({
  interests,
  selectedInterest,
  setSelectedInterest,
}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [tooltipInterest, setTooltipInterest] = useState<Interest | null>(null)
  const [touchedItem, setTouchedItem] = useState<string | null>(null)
  const [isTouch, setIsTouch] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Display value for selected interest
  const [displayValue, setDisplayValue] = useState('')

  useEffect(() => {
    const selected = interests.find(int => int.value === selectedInterest)
    setDisplayValue(selected ? selected.label : '')
  }, [selectedInterest, interests])

  // Mobile-optimized touch handlers
  const handleTouchStart = (interestValue?: string) => {
    setIsTouch(true)
    if (interestValue) {
      setTouchedItem(interestValue)
      setTooltipInterest(interests.find(i => i.value === interestValue) || null)
      if (navigator.vibrate) navigator.vibrate(50)
    }
  }

  const handleTouchEnd = () => {
    setTouchedItem(null)
  }

  const handleBackdropClick = () => {
    setTooltipInterest(null)
  }

  const handleSelectInterest = (interestValue: string) => {
    setSelectedInterest(interestValue)
    setIsDropdownOpen(false)
    setTooltipInterest(null)
    setTouchedItem(null)
    const selected = interests.find(int => int.value === interestValue)
    if (selected) setDisplayValue(selected.label)
  }

  const selectedInt = interests.find(int => int.value === selectedInterest)

  // Close dropdown on outside click (mobile and desktop)
  useEffect(() => {
    if (!isDropdownOpen) return
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
        setTooltipInterest(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isDropdownOpen])

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
          onFocus={e => (e.target as HTMLButtonElement).style.borderColor = BRAND_PURPLE}
          onBlur={e => (e.target as HTMLButtonElement).style.borderColor = '#e5e7eb'}
        >
          <span>
            {displayValue || 'Select an interest...'}
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
            {interests.map((interest, index) => (
              <div
                key={interest.value}
                role="option"
                aria-selected={selectedInterest === interest.value}
                tabIndex={0}
                onMouseEnter={() => !isTouch && setTooltipInterest(interest)}
                onMouseLeave={() => !isTouch && setTooltipInterest(null)}
                onFocus={() => !isTouch && setTooltipInterest(interest)}
                onBlur={() => !isTouch && setTooltipInterest(null)}
                onTouchStart={() => handleTouchStart(interest.value)}
                onTouchEnd={handleTouchEnd}
                onClick={() => handleSelectInterest(interest.value)}
                style={{
                  minHeight: '44px',
                  padding: '1rem',
                  cursor: 'pointer',
                  borderBottom: index < interests.length - 1 ? '1px solid #f3f4f6' : 'none',
                  position: 'relative',
                  backgroundColor:
                    touchedItem === interest.value ? '#e0e7ff' :
                    selectedInterest === interest.value ? '#f0f9ff' :
                    tooltipInterest?.value === interest.value ? '#f9fafb' : 'white',
                  color: '#374151',
                  fontSize: '0.95rem',
                  outline: tooltipInterest?.value === interest.value ? `2px solid ${BRAND_PURPLE}` : 'none',
                  touchAction: 'manipulation',
                  transition: 'background-color 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', marginBottom: '2px' }}>{interest.label}</div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#6b7280',
                    lineHeight: '1.3',
                    display: isTouch ? 'block' : 'none'
                  }}>
                    {interest.description.substring(0, 50)}...
                  </div>
                </div>

                {selectedInterest === interest.value && (
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

                {isTouch && selectedInterest !== interest.value && (
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

                {!isTouch && tooltipInterest?.value === interest.value && (
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
                    {interest.description}
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

      {selectedInt && (
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
            <strong>{selectedInt.label}:</strong> {selectedInt.description}
          </p>
        </div>
      )}

      {isTouch && tooltipInterest && (
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
              {tooltipInterest.label}
            </div>
            <div style={{ marginBottom: '1.5rem', lineHeight: '1.4' }}>
              {tooltipInterest.description}
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
