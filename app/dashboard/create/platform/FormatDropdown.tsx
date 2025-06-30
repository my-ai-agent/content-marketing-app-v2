"use client"

import { useState, useRef } from 'react'

const BRAND_PURPLE = '#6B2EFF'

export interface Format {
  value: string
  label: string
  description: string
}

interface Props {
  formats: Format[]
  selectedFormats: string[]
  setSelectedFormats: (formats: string[]) => void
}

export default function FormatDropdown({
  formats,
  selectedFormats,
  setSelectedFormats,
}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleFormatToggle = (formatValue: string) => {
    if (selectedFormats.includes(formatValue)) {
      setSelectedFormats(selectedFormats.filter(f => f !== formatValue))
    } else {
      setSelectedFormats([...selectedFormats, formatValue])
    }
  }

  const removeFormat = (formatValue: string) => {
    setSelectedFormats(selectedFormats.filter(f => f !== formatValue))
  }

  const getSelectedFormatLabels = () => {
    return selectedFormats.map(value => 
      formats.find(f => f.value === value)?.label || value
    )
  }

  return (
    <>
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            border: '2px solid #e5e7eb',
            borderRadius: '0.75rem',
            fontSize: '1rem',
            backgroundColor: 'white',
            color: selectedFormats.length > 0 ? '#374151' : '#9ca3af',
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
            {selectedFormats.length === 0 
              ? 'Select formats...' 
              : `${selectedFormats.length} format${selectedFormats.length === 1 ? '' : 's'} selected`
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
            {formats.map((format, index) => (
              <div
                key={format.value}
                onClick={() => handleFormatToggle(format.value)}
                style={{
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  borderBottom: index < formats.length - 1 ? '1px solid #f3f4f6' : 'none',
                  backgroundColor: selectedFormats.includes(format.value) ? '#f0f9ff' : 'white',
                  color: '#374151',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
                onMouseEnter={(e) => {
                  if (!selectedFormats.includes(format.value)) {
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedFormats.includes(format.value)) {
                    e.currentTarget.style.backgroundColor = 'white'
                  }
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
                  backgroundColor: selectedFormats.includes(format.value) ? BRAND_PURPLE : 'white',
                  borderColor: selectedFormats.includes(format.value) ? BRAND_PURPLE : '#d1d5db'
                }}>
                  {selectedFormats.includes(format.value) && (
                    <span style={{ color: 'white', fontSize: '10px' }}>✓</span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500' }}>{format.label}</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {format.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Format Tags */}
      {selectedFormats.length > 0 && (
        <div style={{
          marginTop: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          {getSelectedFormatLabels().map((label, index) => (
            <div
              key={selectedFormats[index]}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#dcfce7',
                border: '1px solid #bbf7d0',
                borderRadius: '0.5rem',
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                color: '#15803d'
              }}
            >
              <span>{label}</span>
              <button
                onClick={() => removeFormat(selectedFormats[index])}
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
    </>
  )
}
