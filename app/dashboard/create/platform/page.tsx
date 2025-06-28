'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ExecutivePromptBuilder from '../../../utils/ExecutivePromptBuilder'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

export default function PlatformFormatSelection() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])
  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false)
  const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false)
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null)

  const platforms = [
    'Facebook - Social sharing',
    'Blog - SEO content',
    'Website - Your website',
    'Instagram - Posts & Stories',
    'TikTok - Video content',
    'YouTube - Video/Shorts',
    'Pinterest - Visual discovery',
    'Twitter/X - Quick updates',
    'LinkedIn - Professional network'
  ]

  const formats = [
    'Social Post - Ready-to-post content',
    'Blog Article - SEO-optimized post',
    'Email Newsletter - Email template',
    'Video Script - TikTok/YouTube script',
    'Brochure - Print-ready PDF',
    'Flyer - Marketing material',
    'Poster - Large format print',
    'Press Release - Media format',
    'Board Report - Executive summary',
    'Stakeholder Letter - Partner communication',
    'Staff Memo - Internal communication'
  ]

  const platformTooltips = {
    'Facebook - Social sharing': 'Community building, event promotion, link sharing, older demographics',
    'Blog - SEO content': 'Search engine optimization, detailed content, authority building, lead generation',
    'Website - Your website': 'Complete control, SEO benefits, detailed analytics, professional credibility',
    'Instagram - Posts & Stories': 'Visual storytelling, hashtags, stories, reels, high engagement rates',
    'TikTok - Video content': 'Short-form videos, trending sounds, younger audience, viral potential',
    'YouTube - Video/Shorts': 'Long-form and short content, monetization, search optimization, global reach',
    'Pinterest - Visual discovery': 'Visual search, DIY content, travel inspiration, female-heavy audience',
    'Twitter/X - Quick updates': 'Real-time updates, news sharing, professional networking, hashtag campaigns',
    'LinkedIn - Professional network': 'B2B content, thought leadership, professional networking, industry insights'
  }

  const formatTooltips = {
    'Social Post - Ready-to-post content': 'Optimized for social platforms, engaging captions, hashtag suggestions, visual elements',
    'Blog Article - SEO-optimized post': 'Search-friendly content, structured headers, keyword optimization, internal linking',
    'Email Newsletter - Email template': 'Mobile-responsive design, clear CTAs, personalized content, segmentation-ready',
    'Video Script - TikTok/YouTube script': 'Hook-driven openings, visual cues, timing markers, engagement techniques',
    'Brochure - Print-ready PDF': 'High-resolution graphics, fold marks, print specifications, professional layout',
    'Flyer - Marketing material': 'Eye-catching design, essential information, clear call-to-action, brand consistency',
    'Poster - Large format print': 'High-impact visuals, readable from distance, brand prominence, event details',
    'Press Release - Media format': 'Newsworthy angle, journalist-friendly format, contact information, distribution-ready',
    'Board Report - Executive summary': 'Key metrics, strategic insights, decision-focused content, professional presentation',
    'Stakeholder Letter - Partner communication': 'Relationship-focused, transparent communication, partnership benefits, future planning',
    'Staff Memo - Internal communication': 'Clear directives, team-focused language, actionable items, company culture alignment'
  }

  // NEW: Initialize Executive Prompt Builder
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const promptBuilder = new ExecutivePromptBuilder()
      
      // Load existing selections from localStorage
      const savedPlatforms = localStorage.getItem('selectedPlatforms')
      const savedFormats = localStorage.getItem('selectedFormats')
      
      if (savedPlatforms) {
        try {
          const platforms = JSON.parse(savedPlatforms)
          setSelectedPlatforms(platforms.map((p: string) => `${p} - ${getDefaultDescription(p)}`))
        } catch (e) {
          console.log('Error loading saved platforms:', e)
        }
      }
      
      if (savedFormats) {
        try {
          const formats = JSON.parse(savedFormats)
          setSelectedFormats(formats.map((f: string) => `${f} - ${getDefaultFormatDescription(f)}`))
        } catch (e) {
          console.log('Error loading saved formats:', e)
        }
      }
    }
  }, [])

  // NEW: Helper functions for default descriptions
  const getDefaultDescription = (platform: string) => {
    const descriptions = {
      'Facebook': 'Social sharing',
      'Blog': 'SEO content',
      'Website': 'Your website',
      'Instagram': 'Posts & Stories',
      'TikTok': 'Video content',
      'YouTube': 'Video/Shorts',
      'Pinterest': 'Visual discovery',
      'Twitter/X': 'Quick updates',
      'LinkedIn': 'Professional network'
    }
    return descriptions[platform as keyof typeof descriptions] || 'Platform'
  }

  const getDefaultFormatDescription = (format: string) => {
    const descriptions = {
      'Social Post': 'Ready-to-post content',
      'Blog Article': 'SEO-optimized post',
      'Email Newsletter': 'Email template',
      'Video Script': 'TikTok/YouTube script',
      'Brochure': 'Print-ready PDF',
      'Flyer': 'Marketing material',
      'Poster': 'Large format print',
      'Press Release': 'Media format',
      'Board Report': 'Executive summary',
      'Stakeholder Letter': 'Partner communication',
      'Staff Memo': 'Internal communication'
    }
    return descriptions[format as keyof typeof descriptions] || 'Format'
  }

  // NEW: Update Executive Prompt Builder when selections change
  useEffect(() => {
    if (typeof window !== 'undefined' && (selectedPlatforms.length > 0 || selectedFormats.length > 0)) {
      const promptBuilder = new ExecutivePromptBuilder()
      promptBuilder.updatePlatformData(
        selectedPlatforms.map(p => p.split(' - ')[0]),
        selectedFormats.map(f => f.split(' - ')[0])
      )
      console.log('✅ Platform and format data saved to Executive Prompt Builder')
    }
  }, [selectedPlatforms, selectedFormats])

  const handleNext = () => {
    if (selectedPlatforms.length > 0 && selectedFormats.length > 0) {
      // Store selections in localStorage
      localStorage.setItem('selectedPlatforms', JSON.stringify(selectedPlatforms.map(p => p.split(' - ')[0])))
      localStorage.setItem('selectedFormats', JSON.stringify(selectedFormats.map(f => f.split(' - ')[0])))
      
      // NEW: Final update to Executive Prompt Builder
      if (typeof window !== 'undefined') {
        const promptBuilder = new ExecutivePromptBuilder()
        promptBuilder.updatePlatformData(
          selectedPlatforms.map(p => p.split(' - ')[0]),
          selectedFormats.map(f => f.split(' - ')[0])
        )
        console.log('✅ Final platform data update completed')
      }
      
      // Navigate to AI generation
      window.location.href = '/dashboard/create/generate'
    } else {
      alert('Please select at least one platform and one format before continuing.')
    }
  }

  const handleSkip = () => {
    // Set smart defaults
    const defaultPlatforms = ['Instagram']
    const defaultFormats = ['Social Post']
    
    localStorage.setItem('selectedPlatforms', JSON.stringify(defaultPlatforms))
    localStorage.setItem('selectedFormats', JSON.stringify(defaultFormats))
    
    // NEW: Update Executive Prompt Builder with defaults
    if (typeof window !== 'undefined') {
      const promptBuilder = new ExecutivePromptBuilder()
      promptBuilder.updatePlatformData(defaultPlatforms, defaultFormats)
      console.log('✅ Smart defaults saved to Executive Prompt Builder')
    }
    
    window.location.href = '/dashboard/create/generate'
  }

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const handleFormatToggle = (format: string) => {
    setSelectedFormats(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format)
        : [...prev, format]
    )
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'white'
    }}>
      
      {/* Header with Step Tracker */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1rem',
        borderBottom: '1px solid #f3f4f6'
      }}>
        
        {/* Step Tracker - Updated to 6 steps */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '2rem', height: '2rem', borderRadius: '50%',
            backgroundColor: '#10b981', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.875rem', fontWeight: '600'
          }}>1</div>
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#10b981' }}></div>
          
          <div style={{
            width: '2rem', height: '2rem', borderRadius: '50%',
            backgroundColor: '#10b981', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.875rem', fontWeight: '600'
          }}>2</div>
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#10b981' }}></div>
          
          <div style={{
            width: '2rem', height: '2rem', borderRadius: '50%',
            backgroundColor: '#10b981', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.875rem', fontWeight: '600'
          }}>3</div>
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#10b981' }}></div>
          
          <div style={{
            width: '2rem', height: '2rem', borderRadius: '50%',
            backgroundColor: '#10b981', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.875rem', fontWeight: '600'
          }}>4</div>
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#10b981' }}></div>
          
          <div style={{
            width: '2rem', height: '2rem', borderRadius: '50%',
            backgroundColor: '#10b981', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.875rem', fontWeight: '600'
          }}>5</div>
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#e5e7eb' }}></div>
          
          <div style={{
            width: '2rem', height: '2rem', borderRadius: '50%',
            backgroundColor: '#e5e7eb', color: '#9ca3af',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.875rem', fontWeight: '600'
          }}>6</div>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          fontWeight: '700',
          color: '#1f2937',
          lineHeight: '1.2',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          Platform & Format
        </h1>
      </div>

      <div style={{
        flex: 1,
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
        padding: '2rem 1rem'
      }}>

        {/* Platform Selection Window */}
        <div style={{ textAlign: 'center', width: '100%', marginBottom: '2rem' }}>
          <div style={{
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto',
            position: 'relative'
          }}>
            <div style={{
              width: '100%',
              minHeight: '300px',
              border: '2px solid #d1d5db',
              borderRadius: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#fafafa',
              position: 'relative',
              padding: '1.5rem'
            }}>
              <h3 style={{
                fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '1rem',
                margin: '0 0 1rem 0',
                textAlign: 'left'
              }}>
                Where do you want to share? 🚀
              </h3>

              {/* Platform Dropdown */}
              <div style={{ position: 'relative', width: '100%' }}>
                <button
                  onClick={() => setIsPlatformDropdownOpen(!isPlatformDropdownOpen)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: 'none',
                    borderRadius: '1rem',
                    backgroundColor: 'white',
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: isPlatformDropdownOpen ? `0 0 0 2px ${BRAND_PURPLE}40` : '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    color: selectedPlatforms.length > 0 ? '#374151' : '#9ca3af',
                    fontWeight: selectedPlatforms.length > 0 ? '500' : '400'
                  }}
                >
                  <span style={{ 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap',
                    maxWidth: '90%'
                  }}>
                    {selectedPlatforms.length > 0 
                      ? `${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? 's' : ''} selected`
                      : 'Select your platforms...'}
                  </span>
                  <span style={{ 
                    transform: isPlatformDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    fontSize: '1.2rem'
                  }}>
                    ▼
                  </span>
                </button>

                {/* Platform Dropdown Options with Checkboxes */}
                {isPlatformDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    width: '100%',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '1rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    zIndex: '10',
                    marginTop: '0.5rem',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    {platforms.map((platform, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <div
                          onClick={() => handlePlatformToggle(platform)}
                          onMouseEnter={() => setHoveredTooltip(platform)}
                          onMouseLeave={() => setHoveredTooltip(null)}
                          style={{
                            width: '100%',
                            padding: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                            color: '#374151',
                            borderBottom: index < platforms.length - 1 ? '1px solid #f3f4f6' : 'none',
                            transition: 'background-color 0.2s ease',
                            borderRadius: index === 0 ? '1rem 1rem 0 0' : index === platforms.length - 1 ? '0 0 1rem 1rem' : '0',
                            backgroundColor: hoveredTooltip === platform ? '#f8fafc' : 'transparent'
                          }}
                        >
                          <div style={{
                            width: '1.25rem',
                            height: '1.25rem',
                            border: selectedPlatforms.includes(platform) ? '2px solid #0ea5e9' : '2px solid #d1d5db',
                            borderRadius: '0.25rem',
                            marginRight: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: selectedPlatforms.includes(platform) ? '#0ea5e9' : 'white',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {selectedPlatforms.includes(platform) ? '✓' : ''}
                          </div>
                          <span style={{ flex: 1, textAlign: 'left' }}>{platform}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Platform Selection Display */}
              {selectedPlatforms.length > 0 && (
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #0ea5e9',
                  borderRadius: '0.75rem',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  color: '#0369a1',
                  fontWeight: '500'
                }}>
                  ✓ Selected ({selectedPlatforms.length}): {selectedPlatforms.map(p => p.split(' - ')[0]).join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Format Selection Window */}
        <div style={{ textAlign: 'center', width: '100%', marginBottom: '3rem' }}>
          <div style={{
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto',
            position: 'relative'
          }}>
            <div style={{
              width: '100%',
              minHeight: '300px',
              border: '2px solid #d1d5db',
              borderRadius: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#fafafa',
              position: 'relative',
              padding: '1.5rem'
            }}>
              <h3 style={{
                fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '1rem',
                margin: '0 0 1rem 0',
                textAlign: 'left'
              }}>
                What format works best? 📝
              </h3>

              {/* Format Dropdown */}
              <div style={{ position: 'relative', width: '100%' }}>
                <button
                  onClick={() => setIsFormatDropdownOpen(!isFormatDropdownOpen)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: 'none',
                    borderRadius: '1rem',
                    backgroundColor: 'white',
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: isFormatDropdownOpen ? `0 0 0 2px ${BRAND_PURPLE}40` : '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    color: selectedFormats.length > 0 ? '#374151' : '#9ca3af',
                    fontWeight: selectedFormats.length > 0 ? '500' : '400'
                  }}
                >
                  <span style={{ 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap',
                    maxWidth: '90%'
                  }}>
                    {selectedFormats.length > 0 
                      ? `${selectedFormats.length} format${selectedFormats.length > 1 ? 's' : ''} selected`
                      : 'Select your formats...'}
                  </span>
                  <span style={{ 
                    transform: isFormatDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    fontSize: '1.2rem'
                  }}>
                    ▼
                  </span>
                </button>

                {/* Format Dropdown Options with Checkboxes */}
                {isFormatDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    width: '100%',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '1rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    zIndex: '10',
                    marginTop: '0.5rem',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    {formats.map((format, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <div
                          onClick={() => handleFormatToggle(format)}
                          onMouseEnter={() => setHoveredTooltip(format)}
                          onMouseLeave={() => setHoveredTooltip(null)}
                          style={{
                            width: '100%',
                            padding: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                            color: '#374151',
                            borderBottom: index < formats.length - 1 ? '1px solid #f3f4f6' : 'none',
                            transition: 'background-color 0.2s ease',
                            borderRadius: index === 0 ? '1rem 1rem 0 0' : index === formats.length - 1 ? '0 0 1rem 1rem' : '0',
                            backgroundColor: hoveredTooltip === format ? '#f8fafc' : 'transparent'
                          }}
                        >
                          <div style={{
                            width: '1.25rem',
                            height: '1.25rem',
                            border: selectedFormats.includes(format) ? '2px solid #0ea5e9' : '2px solid #d1d5db',
                            borderRadius: '0.25rem',
                            marginRight: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: selectedFormats.includes(format) ? '#0ea5e9' : 'white',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {selectedFormats.includes(format) ? '✓' : ''}
                          </div>
                          <span style={{ flex: 1, textAlign: 'left' }}>{format}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Format Selection Display */}
              {selectedFormats.length > 0 && (
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #0ea5e9',
                  borderRadius: '0.75rem',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  color: '#0369a1',
                  fontWeight: '500'
                }}>
                  ✓ Selected ({selectedFormats.length}): {selectedFormats.map(f => f.split(' - ')[0]).join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Tooltip */}
        {hoveredTooltip && (isPlatformDropdownOpen || isFormatDropdownOpen) && (
          <div style={{
            position: 'fixed',
            left: '50%',
            top: '20%',
            transform: 'translateX(-50%)',
            background: '#1f2937',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            zIndex: '1000',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            maxWidth: '320px',
            textAlign: 'center',
            lineHeight: '1.4',
            animation: 'fadeIn 0.2s ease-in'
          }}>
            <div style={{ 
              fontWeight: '600', 
              marginBottom: '0.5rem',
              color: '#10b981'
            }}>
              {hoveredTooltip.split(' - ')[0]}
            </div>
            {platformTooltips[hoveredTooltip as keyof typeof platformTooltips] || 
             formatTooltips[hoveredTooltip as keyof typeof formatTooltips]}
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid #1f2937'
            }}></div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          width: '100%',
          marginBottom: '1rem'
        }}>
          <button
            onClick={handleSkip}
            style={{
              background: '#f3f4f6',
              color: '#6b7280',
              fontSize: 'clamp(1rem, 3vw, 1.25rem)',
              fontWeight: '600',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Use Smart Defaults
          </button>

          <button
            onClick={handleNext}
            disabled={selectedPlatforms.length === 0 || selectedFormats.length === 0}
            style={{
              background: (selectedPlatforms.length > 0 && selectedFormats.length > 0)
                ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                : '#e5e7eb',
              color: (selectedPlatforms.length > 0 && selectedFormats.length > 0) ? 'white' : '#9ca3af',
              fontSize: 'clamp(1.25rem, 4vw, 2rem)',
              fontWeight: '900',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: (selectedPlatforms.length > 0 && selectedFormats.length > 0) ? 'pointer' : 'not-allowed',
              boxShadow: (selectedPlatforms.length > 0 && selectedFormats.length > 0) ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
              transition: 'all 0.2s'
            }}
            className={(selectedPlatforms.length > 0 && selectedFormats.length > 0) ? "transition-all hover:scale-105" : ""}
          >
            Continue →
          </button>
        </div>

        {/* Logo - Brand Reinforcement - Deactivated */}
        <div style={{
          textAlign: 'center',
          marginBottom: '1rem',
          paddingTop: '0'
        }}>
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
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={{
        padding: '1.5rem',
        textAlign: 'center',
        borderTop: '1px solid #f3f4f6'
      }}>
        <Link href="/dashboard/create/interests" style={{
          color: '#6b7280',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: 'clamp(0.875rem, 2vw, 1rem)'
        }}>
          ← Back to Audience Interests
        </Link>
      </div>
    </div>
  )
}
