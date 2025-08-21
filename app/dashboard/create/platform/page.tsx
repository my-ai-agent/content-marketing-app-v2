'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import PlatformDropdown, { Platform } from './PlatformDropdown'
import FormatDropdown, { Format } from './FormatDropdown'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C' 
const BRAND_BLUE = '#11B3FF'

// ENHANCED PLATFORMS - Tourism + EOTC Distribution Channels
const PLATFORMS: Platform[] = [
  // Core Social Platforms
  { value: 'instagram', label: 'Instagram', description: 'Visual storytelling, posts & stories' },
  { value: 'facebook', label: 'Facebook', description: 'Broad reach, all demographics' },
  { value: 'website', label: 'Website/Blog', description: 'SEO content, professional presence' },
  { value: 'linkedin', label: 'LinkedIn', description: 'B2B networking, professional credibility' },
  
  // Video & Content Platforms
  { value: 'tiktok', label: 'TikTok', description: 'Gen Z/Millennial engagement, video content' },
  { value: 'youtube', label: 'YouTube', description: 'Long-form content, tutorials' },
  { value: 'pinterest', label: 'Pinterest', description: 'Inspiration, planning phase' },
  
  // Communication Platforms
  { value: 'email', label: 'Email Newsletter', description: 'Direct audience relationship' },
  { value: 'twitter', label: 'Twitter/X', description: 'News, updates, quick engagement' },
  
  // Tourism Business Platforms (Moved from Formats)
  { value: 'press-release', label: 'Press Release', description: 'Media coverage, credibility building' },
  { value: 'brochure', label: 'Brochure', description: 'Tourism classic, print/digital marketing' },
  { value: 'flyer', label: 'Flyer', description: 'Events, promotions, marketing material' },
  
  // EOTC & Education Platforms
  { value: 'teacher-resources', label: 'Teacher Resources', description: 'EOTC program materials, curriculum support' },
  { value: 'school-newsletter', label: 'School Newsletter', description: 'Educational institution communications' },
]

// ENHANCED FORMATS - Content Style & Tone with EOTC Focus
const FORMATS: Format[] = [
  // Social & Marketing Formats
  { value: 'social-post', label: 'Social Post', description: 'Casual, engaging, hashtag-optimized' },
  { value: 'marketing-copy', label: 'Marketing Copy', description: 'Promotional, conversion-focused' },
  { value: 'cultural-narrative', label: 'Cultural Narrative', description: 'Storytelling, authentic Māori voice' },
  
  // Professional & Business Formats  
  { value: 'professional-blog', label: 'Professional Blog', description: 'SEO-optimized, industry insights' },
  { value: 'executive-summary', label: 'Executive Summary', description: 'Stakeholder reports, business case' },
  
  // EOTC & Education Formats
  { value: 'eotc-program', label: 'EOTC Program Description', description: 'Curriculum-aligned, learning outcomes focused' },
  { value: 'educational-korero', label: 'Educational Kōrero', description: 'Cultural learning, traditional knowledge sharing' },
  { value: 'teacher-guide', label: 'Teacher Resource Guide', description: 'Pre-visit preparation, activity suggestions' },
  { value: 'student-worksheet', label: 'Student Engagement Content', description: 'Reflection prompts, learning activities' },
  
  // Safety & Compliance Formats
  { value: 'safety-briefing', label: 'Safety Briefing', description: 'Risk management, procedures, compliance' },
  { value: 'cultural-protocol', label: 'Cultural Protocol Guide', description: 'Respectful engagement, tikanga Māori' },
]

export default function PlatformFormat() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])

  useEffect(() => {
    // Get any existing selections
    const existingPlatforms = localStorage.getItem('selectedPlatforms')
    const existingFormats = localStorage.getItem('selectedFormats')
    
    if (existingPlatforms) {
      try {
        const parsed = JSON.parse(existingPlatforms)
        if (Array.isArray(parsed)) {
          setSelectedPlatforms(parsed)
        }
      } catch (error) {
        console.error('Error parsing existing platforms:', error)
      }
    }

    if (existingFormats) {
      try {
        const parsed = JSON.parse(existingFormats)
        if (Array.isArray(parsed)) {
          setSelectedFormats(parsed)
        }
      } catch (error) {
        console.error('Error parsing existing formats:', error)
      }
    }
  }, [])

  const handleGenerate = () => {
    if (selectedPlatforms.length > 0 && selectedFormats.length > 0) {
      localStorage.setItem('selectedPlatforms', JSON.stringify(selectedPlatforms))
      localStorage.setItem('selectedFormats', JSON.stringify(selectedFormats))
      window.location.href = '/dashboard/create/results'
    } else {
      alert('Please select at least one platform and one format before continuing.')
    }
  }

  const handleSkip = () => {
    // Enhanced smart defaults for tourism + EOTC business
    const defaultPlatforms = ['instagram', 'facebook', 'website', 'teacher-resources']
    const defaultFormats = ['social-post', 'professional-blog', 'eotc-program', 'cultural-narrative']
    
    localStorage.setItem('selectedPlatforms', JSON.stringify(defaultPlatforms))
    localStorage.setItem('selectedFormats', JSON.stringify(defaultFormats))
    window.location.href = '/dashboard/create/results'
  }

  // Helper function to get EOTC count - FIXED SYNTAX
  const getEOTCSelections = () => {
    const eotcPlatforms = ['teacher-resources', 'school-newsletter']
    const eotcFormats = ['eotc-program', 'educational-korero', 'teacher-guide', 'student-worksheet']
    
    const eotcPlatformCount = selectedPlatforms.filter(p => eotcPlatforms.includes(p)).length
    const eotcFormatCount = selectedFormats.filter(f => eotcFormats.includes(f)).length
    
    return { platforms: eotcPlatformCount, formats: eotcFormatCount }
  }

  const eotcSelections = getEOTCSelections()
  const hasEOTCContent = eotcSelections.platforms > 0 || eotcSelections.formats > 0

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

        {/* Step Tracker */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '0.5rem', 
          marginBottom: '1.5rem' 
        }}>
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div key={step} style={{ 
              width: '2rem', 
              height: '2rem', 
              borderRadius: '50%', 
              backgroundColor: step <= 5 ? '#10b981' : '#e5e7eb', 
              color: step <= 5 ? 'white' : '#9ca3af', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '0.875rem', 
              fontWeight: '600' 
            }}>{step}</div>
          ))}
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
        <p style={{ 
          color: '#6b7280', 
          textAlign: 'center', 
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Choose where to share your story and in what format
        </p>

        {/* EOTC Indicator */}
        {hasEOTCContent && (
          <div style={{
            marginTop: '1rem',
            backgroundColor: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '0.75rem',
            padding: '0.75rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.25rem' }}>🎓</span>
            <div>
              <div style={{ 
                fontWeight: '600', 
                color: '#15803d',
                fontSize: '0.875rem'
              }}>
                EOTC Education Content Selected
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#166534'
              }}>
                {eotcSelections.platforms} platform(s) + {eotcSelections.formats} format(s) for curriculum-aligned content
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ 
        flex: '1', 
        maxWidth: '900px', 
        margin: '0 auto', 
        width: '100%', 
        padding: '2rem 1rem' 
      }}>

        {/* Platform Selection */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem auto'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            📱 Select Platforms
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '1rem'
          }}>
            Choose <strong>where</strong> you want to distribute your content. Includes social media, websites, marketing materials, and EOTC resources.
          </p>
          
          <PlatformDropdown
            platforms={PLATFORMS}
            selectedPlatforms={selectedPlatforms}
            setSelectedPlatforms={setSelectedPlatforms}
          />
        </div>

        {/* Format Selection */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem auto'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            📄 Select Formats
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '1rem'
          }}>
            Choose <strong>how</strong> your content should be written. Content style, tone, and structure for your audience and purpose.
          </p>
          
          <FormatDropdown
            formats={FORMATS}
            selectedFormats={selectedFormats}
            setSelectedFormats={setSelectedFormats}
          />
        </div>

        {/* EOTC Information Panel */}
        <div style={{
          backgroundColor: '#fefce8',
          border: '2px solid #facc15',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem auto'
        }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#a16207',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🎓 Education Outside The Classroom (EOTC)
          </h4>
          <p style={{
            fontSize: '0.875rem',
            color: '#a16207',
            lineHeight: '1.5',
            marginBottom: '0.75rem'
          }}>
            New Zealand's EOTC market is massive! Select education-focused platforms and formats to create curriculum-aligned content that teachers actually want to use.
          </p>
          <div style={{
            fontSize: '0.75rem',
            color: '#92400e',
            backgroundColor: '#fef3c7',
            padding: '0.5rem',
            borderRadius: '0.5rem'
          }}>
            <strong>💡 Pro Tip:</strong> Combining EOTC formats with social platforms creates content that works for both school bookings AND general tourism marketing.
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          maxWidth: '600px',
          margin: '0 auto 2rem auto'
        }}>
          <button
            onClick={handleSkip}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '500',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '2px solid #e5e7eb',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#9ca3af'
              e.currentTarget.style.color = '#374151'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.color = '#6b7280'
            }}
          >
            Tourism + EOTC Defaults
          </button>

          <button
            onClick={handleGenerate}
            disabled={selectedPlatforms.length === 0 || selectedFormats.length === 0}
            style={{
              background: (selectedPlatforms.length > 0 && selectedFormats.length > 0)
                ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                : '#e5e7eb',
              color: (selectedPlatforms.length > 0 && selectedFormats.length > 0) ? 'white' : '#9ca3af',
              fontSize: '1.25rem',
              fontWeight: '700',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: (selectedPlatforms.length > 0 && selectedFormats.length > 0) ? 'pointer' : 'not-allowed',
              boxShadow: (selectedPlatforms.length > 0 && selectedFormats.length > 0) ? '0 4px 15px rgba(107, 46, 255, 0.3)' : 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (selectedPlatforms.length > 0 && selectedFormats.length > 0) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(107, 46, 255, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedPlatforms.length > 0 && selectedFormats.length > 0) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(107, 46, 255, 0.3)'
              }
            }}
          >
            🚀 Generate My Content
          </button>
        </div>

        {/* Content Generation Preview */}
        {selectedPlatforms.length > 0 && selectedFormats.length > 0 && (
          <div style={{
            backgroundColor: '#f0f9ff',
            border: '2px solid #3b82f6',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem auto'
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#1e40af',
              marginBottom: '0.75rem'
            }}>
              🤖 Content Generation Preview
            </h4>
            <p style={{
              fontSize: '0.875rem',
              color: '#1e40af',
              marginBottom: '1rem'
            }}>
              AI will create <strong>{selectedPlatforms.length × selectedFormats.length} pieces</strong> of culturally-intelligent content:
            </p>
            <div style={{
              fontSize: '0.75rem',
              color: '#1e3a8a',
              backgroundColor: '#dbeafe',
              padding: '0.75rem',
              borderRadius: '0.5rem'
            }}>
              <div><strong>Platforms:</strong> {selectedPlatforms.length} selected</div>
              <div><strong>Formats:</strong> {selectedFormats.length} selected</div>
              {hasEOTCContent && (
                <div style={{ marginTop: '0.5rem', fontWeight: '600' }}>
                  🎓 Includes EOTC curriculum-aligned content
                </div>
              )}
            </div>
          </div>
        )}

        {/* Logo */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          paddingTop: '2rem'
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
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
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={{ 
        padding: '1.5rem', 
        textAlign: 'center',
        borderTop: '1px solid #f3f4f6'
      }}>
        <Link 
          href="/dashboard/create/interests"
          style={{ 
            color: '#6b7280', 
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)'
          }}
        >
          ← Back to Audience Interests
        </Link>
      </div>
    </div>
  )
}
