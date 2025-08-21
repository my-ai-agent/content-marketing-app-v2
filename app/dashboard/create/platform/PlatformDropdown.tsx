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
  const [isTouch, setIsTouch] = useState(false)
  const [touchedItem, setTouchedItem] = useState<string | null>(null)
  const [tooltipPlatform, setTooltipPlatform] = useState<Platform | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click/tap
  useEffect(() => {
    if (!isDropdownOpen) return
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
        setTooltipPlatform(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isDropdownOpen])

  const handlePlatformToggle = (platformValue: string) => {
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

  // Touch/mobile handlers
  const handleTouchStart = (platformValue?: string) => {
    setIsTouch(true)
    if (platformValue) {
      setTouchedItem(platformValue)
      setTooltipPlatform(platforms.find(p => p.value === platformValue) || null)
      if (navigator.vibrate) navigator.vibrate(50)
    }
  }
  const handleTouchEnd = () => {
    setTouchedItem(null)
  }
  const handleBackdropClick = () => {
    setTooltipPlatform(null)
  }

  return (
    <>
      <div style={{ position: 'relative' }} ref={dropdownRef} onTouchStart={() => handleTouchStart()}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          onTouchStart={() => {
            setIsTouch(true)
            if (navigator.vibrate) navigator.vibrate(30)
          }}
          style={{
            width: '100%',
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
            alignItems: 'center',
            touchAction: 'manipulation'
          }}
          onFocus={(e) => (e.target as HTMLButtonElement).style.borderColor = BRAND_PURPLE}
          onBlur={(e) => (e.target as HTMLButtonElement).style.borderColor = '#e5e7eb'}
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
                onClick={() => handlePlatformToggle(platform.value)}
                onTouchStart={() => handleTouchStart(platform.value)}
                onTouchEnd={handleTouchEnd}
                onMouseEnter={() => !isTouch && setTooltipPlatform(platform)}
                onMouseLeave={() => !isTouch && setTooltipPlatform(null)}
                style={{
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  borderBottom: index < platforms.length - 1 ? '1px solid #f3f4f6' : 'none',
                  backgroundColor:
                    touchedItem === platform.value ? '#e0e7ff'
                    : selectedPlatforms.includes(platform.value) ? '#f0f9ff'
                    : tooltipPlatform?.value === platform.value ? '#f9fafb'
                    : 'white',
                  color: '#374151',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  outline: tooltipPlatform?.value === platform.value ? `2px solid ${BRAND_PURPLE}` : 'none',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #d1d5db',
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: selectedPlatforms.includes(platform.value) ? BRAND_PURPLE : 'white',
                  borderColor: selectedPlatforms.includes(platform.value) ? BRAND_PURPLE : '#d1d5db'
                }}>
                  {selectedPlatforms.includes(platform.value) && (
                    <span style={{ color: 'white', fontSize: '10px' }}>✓</span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500' }}>{platform.label}</div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    display: isTouch ? 'block' : 'none'
                  }}>
                    {platform.description.substring(0, 50)}...
                  </div>
                </div>
                {/* Tooltip for desktop */}
                {!isTouch && tooltipPlatform?.value === platform.value && (
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
                    {platform.description}
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

      {/* Selected Platform Tags */}
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
                  fontSize: '0.875rem',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal tooltip for mobile */}
      {isTouch && tooltipPlatform && (
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
              {tooltipPlatform.label}
            </div>
            <div style={{ marginBottom: '1.5rem', lineHeight: '1.4' }}>
              {tooltipPlatform.description}
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
