'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import PlatformDropdown, { Platform } from './PlatformDropdown'
import FormatDropdown, { Format } from './FormatDropdown'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C' 
const BRAND_BLUE = '#11B3FF'

// Priority order for tourism/business
const PLATFORMS: Platform[] = [
  { value: 'instagram', label: 'Instagram', description: 'Visual storytelling, posts & stories' },
  { value: 'facebook', label: 'Facebook', description: 'Broad reach, all demographics' },
  { value: 'website', label: 'Website/Blog', description: 'SEO content, professional presence' },
  { value: 'linkedin', label: 'LinkedIn', description: 'B2B networking, professional credibility' },
  { value: 'tiktok', label: 'TikTok', description: 'Gen Z/Millennial engagement, video content' },
  { value: 'email', label: 'Email Newsletter', description: 'Direct audience relationship' },
  { value: 'youtube', label: 'YouTube', description: 'Long-form content, tutorials' },
  { value: 'pinterest', label: 'Pinterest', description: 'Inspiration, planning phase' },
  { value: 'twitter', label: 'Twitter/X', description: 'News, updates, quick engagement' }
]

const FORMATS: Format[] = [
  { value: 'social-post', label: 'Social Post', description: 'Ready-to-post content for social media' },
  { value: 'blog-article', label: 'Blog Article', description: 'SEO-optimized detailed storytelling' },
  { value: 'email-newsletter', label: 'Email Newsletter', description: 'Audience retention and engagement' },
  { value: 'video-script', label: 'Video Script', description: 'Growing demand, high engagement' },
  { value: 'brochure', label: 'Brochure', description: 'Tourism classic, print/digital' },
  { value: 'press-release', label: 'Press Release', description: 'Media coverage, credibility building' },
  { value: 'flyer', label: 'Flyer', description: 'Events, promotions, marketing material' }
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

  const handleNext = () => {
    if (selectedPlatforms.length > 0 && selectedFormats.length > 0) {
      localStorage.setItem('selectedPlatforms', JSON.stringify(selectedPlatforms))
      localStorage.setItem('selectedFormats', JSON.stringify(selectedFormats))
      window.location.href = '/dashboard/create/generate'
    } else {
      alert('Please select at least one platform and one format before continuing.')
    }
  }

  const handleSkip = () => {
    // Set smart defaults for tourism business
    const defaultPlatforms = ['instagram', 'facebook', 'website']
    const defaultFormats = ['social-post', 'blog-article', 'brochure']
    
    localStorage.setItem('selectedPlatforms', JSON.stringify(defaultPlatforms))
    localStorage.setItem('selectedFormats', JSON.stringify(defaultFormats))
    window.location.href = '/dashboard/create/generate'
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

        {/* Step Tracker */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '0.5rem', 
          marginBottom: '1.5rem' 
        }}>
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            backgroundColor: '#10b981', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.875rem', 
            fontWeight: '600' 
          }}>1</div>
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            backgroundColor: '#10b981', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.875rem', 
            fontWeight: '600' 
          }}>2</div>
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            backgroundColor: '#10b981', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.875rem', 
            fontWeight: '600' 
          }}>3</div>
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            backgroundColor: '#10b981', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.875rem', 
            fontWeight: '600' 
          }}>4</div>
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            backgroundColor: '#10b981', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.875rem', 
            fontWeight: '600' 
          }}>5</div>
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            backgroundColor: '#e5e7eb', 
            color: '#9ca3af', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.875rem', 
            fontWeight: '600' 
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
        <p style={{ 
          color: '#6b7280', 
          textAlign: 'center', 
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Choose where to share your story and in what format
        </p>
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
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '1rem'
          }}>
            📱 Select Platforms
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '1rem'
          }}>
            Choose where you want to share your content (select multiple)
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
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '1rem'
          }}>
            📄 Select Formats
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '1rem'
          }}>
            Choose the content formats you need (select multiple)
          </p>
          
          <FormatDropdown
            formats={FORMATS}
            selectedFormats={selectedFormats}
            setSelectedFormats={setSelectedFormats}
          />
        </div>

        {/* Platform & Format Benefits */}
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '1rem',
          padding: '1.5rem',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🚀</span>
          <span style={{ 
            color: '#1e40af', 
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            fontWeight: '500'
          }}>
            AI will create content optimized for each platform and format you select
          </span>
        </div>

        {/* Navigation Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
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
            Continue →
          </button>
        </div>

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
