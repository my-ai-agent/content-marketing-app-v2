"use client"

import { useState, useRef, useEffect } from 'react'

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
  const [isMobile, setIsMobile] = useState(false)
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
  const handleMobileChange = (formatValue: string, isChecked: boolean) => {
    console.log('Mobile format selection:', formatValue, isChecked)
    if (isChecked) {
      setSelectedFormats([...selectedFormats, formatValue])
    } else {
      setSelectedFormats(selectedFormats.filter(f => f !== formatValue))
    }
  }

  // Desktop handler - existing logic
  const handleDesktopToggle = (formatValue: string) => {
    console.log('Desktop format toggle:', formatValue)
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

  // Helper to get format emoji
  const getFormatEmoji = (formatValue: string) => {
    const emojiMap: { [key: string]: string } = {
      'social-post': '📱',
      'marketing-copy': '📢',
      'cultural-narrative': '📜',
      'professional-blog': '✍️',
      'executive-summary': '📊',
      'eotc-program': '🎓',
      'educational-korero': '🌿',
      'teacher-guide': '👩‍🏫',
      'student-worksheet': '📝',
      'safety-briefing': '⚠️',
      'cultural-protocol': '🤝'
    }
    return emojiMap[formatValue] || '📄'
  }

  // Helper to categorize formats
  const getFormatCategory = (formatValue: string) => {
    const eotcFormats = ['eotc-program', 'educational-korero', 'teacher-guide', 'student-worksheet']
    const socialFormats = ['social-post', 'marketing-copy', 'cultural-narrative']
    const professionalFormats = ['professional-blog', 'executive-summary']
    const complianceFormats = ['safety-briefing', 'cultural-protocol']

    if (eotcFormats.includes(formatValue)) return 'EOTC'
    if (socialFormats.includes(formatValue)) return 'Social & Marketing'
    if (professionalFormats.includes(formatValue)) return 'Professional'
    if (complianceFormats.includes(formatValue)) return 'Safety & Compliance'
    return 'Other'
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors = {
      'EOTC': '#22c55e',
      'Social & Marketing': '#3b82f6',
      'Professional': '#6366f1',
      'Safety & Compliance': '#f59e0b',
      'Other': '#6b7280'
    }
    return colors[category as keyof typeof colors] || '#6b7280'
  }

  // 📱 MOBILE RENDER: Native checkboxes with categories
  if (isMobile) {
    // Group formats by category
    const categorizedFormats = formats.reduce((acc, format) => {
      const category = getFormatCategory(format.value)
      if (!acc[category]) acc[category] = []
      acc[category].push(format)
      return acc
    }, {} as { [key: string]: Format[] })

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

          {/* Mobile Checkbox List with Categories */}
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
              Select Formats ({selectedFormats.length} selected):
            </div>
            
            {Object.entries(categorizedFormats).map(([category, categoryFormats]) => (
              <div key={category} style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: getCategoryColor(category),
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {category === 'EOTC' ? '🎓 EDUCATION & LEARNING' : category}
                </div>
                
                {categoryFormats.map((format) => (
                  <label
                    key={format.value}
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
                      checked={selectedFormats.includes(format.value)}
                      onChange={(e) => handleMobileChange(format.value, e.target.checked)}
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
                        marginBottom: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span>{getFormatEmoji(format.value)}</span>
                        {format.label}
                        {category === 'EOTC' && (
                          <span style={{
                            fontSize: '0.625rem',
                            backgroundColor: '#22c55e',
                            color: 'white',
                            padding: '0.125rem 0.375rem',
                            borderRadius: '0.25rem',
                            fontWeight: '600'
                          }}>
                            CURRICULUM
                          </span>
                        )}
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        color: '#6b7280',
                        lineHeight: '1.3'
                      }}>
                        {format.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Format Tags - Mobile */}
        {selectedFormats.length > 0 && (
          <div style={{
            marginTop: '1rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            {getSelectedFormatLabels().map((label, index) => {
              const category = getFormatCategory(selectedFormats[index])
              return (
                <div
                  key={selectedFormats[index]}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: category === 'EOTC' ? '#f0fdf4' : '#dcfce7',
                    border: `1px solid ${category === 'EOTC' ? '#bbf7d0' : '#bbf7d0'}`,
                    borderRadius: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    color: category === 'EOTC' ? '#15803d' : '#15803d'
                  }}
                >
                  <span>{getFormatEmoji(selectedFormats[index])}</span>
                  <span>{label}</span>
                  <button
                    onClick={() => removeFormat(selectedFormats[index])}
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
              )
            })}
          </div>
        )}
      </>
    )
  }

  // 🖥️ DESKTOP RENDER: Custom Dropdown with categories
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
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 10,
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            {/* Group formats by category for desktop */}
            {Object.entries(formats.reduce((acc, format) => {
              const category = getFormatCategory(format.value)
              if (!acc[category]) acc[category] = []
              acc[category].push(format)
              return acc
            }, {} as { [key: string]: Format[] })).map(([category, categoryFormats]) => (
              <div key={category}>
                {/* Category Header */}
                <div style={{
                  padding: '0.75rem 1rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: getCategoryColor(category),
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  backgroundColor: '#f9fafb',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  {category === 'EOTC' ? '🎓 EDUCATION & LEARNING' : 
                   category === 'Social & Marketing' ? '📱 SOCIAL & MARKETING' :
                   category === 'Professional' ? '💼 PROFESSIONAL' :
                   category === 'Safety & Compliance' ? '⚠️ SAFETY & COMPLIANCE' : category}
                </div>

                {/* Category Formats */}
                {categoryFormats.map((format) => (
                  <div
                    key={format.value}
                    onClick={() => handleDesktopToggle(format.value)}
                    style={{
                      minHeight: '44px',
                      padding: '1rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f3f4f6',
                      backgroundColor: selectedFormats.includes(format.value) ? 
                        (category === 'EOTC' ? '#f0fdf4' : '#f0f9ff') : 'white',
                      color: '#374151',
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
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
                      width: '24px',
                      height: '24px',
                      border: '2px solid #d1d5db',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: selectedFormats.includes(format.value) ? 
                        (category === 'EOTC' ? '#22c55e' : BRAND_PURPLE) : 'white',
                      borderColor: selectedFormats.includes(format.value) ? 
                        (category === 'EOTC' ? '#22c55e' : BRAND_PURPLE) : '#d1d5db',
                      flexShrink: 0
                    }}>
                      {selectedFormats.includes(format.value) && (
                        <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>✓</span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: '500', 
                        marginBottom: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span>{getFormatEmoji(format.value)}</span>
                        {format.label}
                        {category === 'EOTC' && (
                          <span style={{
                            fontSize: '0.625rem',
                            backgroundColor: '#22c55e',
                            color: 'white',
                            padding: '0.125rem 0.375rem',
                            borderRadius: '0.25rem',
                            fontWeight: '600'
                          }}>
                            CURRICULUM
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.3' }}>
                        {format.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Format Tags - Desktop */}
      {selectedFormats.length > 0 && (
        <div style={{
          marginTop: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          {getSelectedFormatLabels().map((label, index) => {
            const category = getFormatCategory(selectedFormats[index])
            return (
              <div
                key={selectedFormats[index]}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: category === 'EOTC' ? '#f0fdf4' : '#dcfce7',
                  border: `1px solid ${category === 'EOTC' ? '#bbf7d0' : '#bbf7d0'}`,
                  borderRadius: '0.75rem',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  color: category === 'EOTC' ? '#15803d' : '#15803d',
                  minHeight: '36px'
                }}
              >
                <span>{getFormatEmoji(selectedFormats[index])}</span>
                <span>{label}</span>
                {category === 'EOTC' && (
                  <span style={{
                    fontSize: '0.625rem',
                    backgroundColor: '#22c55e',
                    color: 'white',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '0.25rem',
                    fontWeight: '600'
                  }}>
                    CURRICULUM
                  </span>
                )}
                <button
                  onClick={() => removeFormat(selectedFormats[index])}
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
            )
          })}
        </div>
      )}
    </>
  )
}
