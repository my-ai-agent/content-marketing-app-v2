'use client'
import { useState } from 'react'
import Link from 'next/link'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

export default function PlatformFormatSelection() {
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('')
  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false)
  const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false)
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null)

  const platforms = [
    'Instagram - Posts & Stories',
    'Facebook - Social sharing',
    'TikTok - Video content',
    'YouTube - Video/Shorts',
    'Pinterest - Visual discovery',
    'Twitter/X - Quick updates',
    'LinkedIn - Professional network',
    'Website - Your website',
    'Email - Newsletter',
    'Blog - SEO content',
    'Medium - Article platform',
    'Substack - Newsletter platform'
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
    'Instagram - Posts & Stories': 'Visual storytelling, hashtags, stories, reels, high engagement rates',
    'Facebook - Social sharing': 'Community building, event promotion, link sharing, older demographics',
    'TikTok - Video content': 'Short-form videos, trending sounds, younger audience, viral potential',
    'YouTube - Video/Shorts': 'Long-form and short content, monetization, search optimization, global reach',
    'Pinterest - Visual discovery': 'Visual search, DIY content, travel inspiration, female-heavy audience',
    'Twitter/X - Quick updates': 'Real-time updates, news sharing, professional networking, hashtag campaigns',
    'LinkedIn - Professional network': 'B2B content, thought leadership, professional networking, industry insights',
    'Website - Your website': 'Complete control, SEO benefits, detailed analytics, professional credibility',
    'Email - Newsletter': 'Direct communication, high ROI, personalized content, customer retention',
    'Blog - SEO content': 'Search engine optimization, detailed content, authority building, lead generation',
    'Medium - Article platform': 'Thought leadership, writing community, built-in audience, easy publishing',
    'Substack - Newsletter platform': 'Paid subscriptions, email-first content, independent publishing, loyal readership'
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

  const handleNext = () => {
    if (selectedPlatform && selectedFormat) {
      // Store selections in localStorage
      localStorage.setItem('selectedPlatforms', JSON.stringify([selectedPlatform.split(' - ')[0]]))
      localStorage.setItem('selectedFormats', JSON.stringify([selectedFormat.split(' - ')[0]]))
      
      // Navigate to AI generation
      window.location.href = '/dashboard/create/generate'
    } else {
      alert('Please select both a platform and format before continuing.')
    }
  }

  const handleSkip = () => {
    // Set smart defaults
    localStorage.setItem('selectedPlatforms', JSON.stringify(['Instagram']))
    localStorage.setItem('selectedFormats', JSON.stringify(['Social Post']))
    
    window.location.href = '/dashboard/create/generate'
  }

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform)
    setIsPlatformDropdownOpen(false)
  }

  const handleFormatSelect = (format: string) => {
    setSelectedFormat(format)
    setIsFormatDropdownOpen(false)
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
              minHeight: '200px',
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
                    color: selectedPlatform ? '#374151' : '#9ca3af',
                    fontWeight: selectedPlatform ? '500' : '400'
                  }}
                >
                  <span style={{ 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap',
                    maxWidth: '90%'
                  }}>
                    {selectedPlatform || 'Select your platform...'}
                  </span>
                  <span style={{ 
                    transform: isPlatformDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    fontSize: '1.2rem'
                  }}>
                    ▼
                  </span>
                </button>

                {/* Platform Dropdown Options */}
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
                      <button
                        key={index}
                        onClick={() => handlePlatformSelect(platform)}
                        onMouseEnter={() => setHoveredTooltip(platform)}
                        onMouseLeave={() => setHoveredTooltip(null)}
                        style={{
                          width: '100%',
                          padding: '1rem',
                          border: 'none',
                          backgroundColor: hoveredTooltip === platform ? '#f8fafc' : 'transparent',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                          color: '#374151',
                          borderBottom: index < platforms.length - 1 ? '1px solid #f3f4f6' : 'none',
                          transition: 'background-color 0.2s ease',
                          borderRadius: index === 0 ? '1rem 1rem 0 0' : index === platforms.length - 1 ? '0 0 1rem 1rem' : '0'
                        }}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Platform Selection Display */}
              {selectedPlatform && (
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
                  ✓ Selected: {selectedPlatform}
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
              minHeight: '200px',
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
                    color: selectedFormat ? '#374151' : '#9ca3af',
                    fontWeight: selectedFormat ? '500' : '400'
                  }}
                >
                  <span style={{ 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap',
                    maxWidth: '90%'
                  }}>
                    {selectedFormat || 'Select your format...'}
                  </span>
                  <span style={{ 
                    transform: isFormatDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    fontSize: '1.2rem'
                  }}>
                    ▼
                  </span>
                </button>

                {/* Format Dropdown Options */}
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
                      <button
                        key={index}
                        onClick={() => handleFormatSelect(format)}
                        onMouseEnter={() => setHoveredTooltip(format)}
                        onMouseLeave={() => setHoveredTooltip(null)}
                        style={{
                          width: '100%',
                          padding: '1rem',
                          border: 'none',
                          backgroundColor: hoveredTooltip === format ? '#f8fafc' : 'transparent',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                          color: '#374151',
                          borderBottom: index < formats.length - 1 ? '1px solid #f3f4f6' : 'none',
                          transition: 'background-color 0.2s ease',
                          borderRadius: index === 0 ? '1rem 1rem 0 0' : index === formats.length - 1 ? '0 0 1rem 1rem' : '0'
                        }}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Format Selection Display */}
              {selectedFormat && (
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
                  ✓ Selected: {selectedFormat}
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
            disabled={!selectedPlatform || !selectedFormat}
            style={{
              background: (selectedPlatform && selectedFormat)
                ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                : '#e5e7eb',
              color: (selectedPlatform && selectedFormat) ? 'white' : '#9ca3af',
              fontSize: 'clamp(1.25rem, 4vw, 2rem)',
              fontWeight: '900',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: (selectedPlatform && selectedFormat) ? 'pointer' : 'not-allowed',
              boxShadow: (selectedPlatform && selectedFormat) ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
              transition: 'all 0.2s'
            }}
            className={(selectedPlatform && selectedFormat) ? "transition-all hover:scale-105" : ""}
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
