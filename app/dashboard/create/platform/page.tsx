'use client'
import { useState } from 'react'
import Link from 'next/link'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

interface PlatformOption {
  id: string
  name: string
  icon: string
  description: string
  category: 'social' | 'professional' | 'content'
  color: string
}

interface FormatOption {
  id: string
  name: string
  icon: string
  description: string
  category: 'digital' | 'print' | 'business'
}

const platformOptions: PlatformOption[] = [
  // Social Media Platforms
  { id: 'instagram', name: 'Instagram', icon: '📷', description: 'Posts & Stories', category: 'social', color: '#E4405F' },
  { id: 'facebook', name: 'Facebook', icon: '📘', description: 'Social sharing', category: 'social', color: '#1877F2' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', description: 'Video content', category: 'social', color: '#000000' },
  { id: 'youtube', name: 'YouTube', icon: '📺', description: 'Video/Shorts', category: 'social', color: '#FF0000' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌', description: 'Visual discovery', category: 'social', color: '#BD081C' },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦', description: 'Quick updates', category: 'social', color: '#1DA1F2' },
  
  // Professional Platforms
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', description: 'Professional network', category: 'professional', color: '#0A66C2' },
  { id: 'website', name: 'Website', icon: '🌐', description: 'Your website', category: 'professional', color: '#718096' },
  { id: 'email', name: 'Email', icon: '📧', description: 'Newsletter', category: 'professional', color: '#718096' },
  
  // Content Platforms
  { id: 'blog', name: 'Blog', icon: '✍️', description: 'SEO content', category: 'content', color: '#10b981' },
  { id: 'medium', name: 'Medium', icon: '📰', description: 'Article platform', category: 'content', color: '#000000' },
  { id: 'substack', name: 'Substack', icon: '📖', description: 'Newsletter platform', category: 'content', color: '#FF6719' }
]

const formatOptions: FormatOption[] = [
  // Digital Formats
  { id: 'social-post', name: 'Social Post', icon: '📱', description: 'Ready-to-post content', category: 'digital' },
  { id: 'blog-article', name: 'Blog Article', icon: '📝', description: 'SEO-optimized post', category: 'digital' },
  { id: 'email-newsletter', name: 'Email Newsletter', icon: '📧', description: 'Email template', category: 'digital' },
  { id: 'video-script', name: 'Video Script', icon: '🎬', description: 'TikTok/YouTube script', category: 'digital' },
  
  // Print Formats
  { id: 'brochure', name: 'Brochure', icon: '📄', description: 'Print-ready PDF', category: 'print' },
  { id: 'flyer', name: 'Flyer', icon: '📋', description: 'Marketing material', category: 'print' },
  { id: 'poster', name: 'Poster', icon: '🖼️', description: 'Large format print', category: 'print' },
  
  // Business Formats
  { id: 'press-release', name: 'Press Release', icon: '📰', description: 'Media format', category: 'business' },
  { id: 'board-report', name: 'Board Report', icon: '📊', description: 'Executive summary', category: 'business' },
  { id: 'stakeholder-letter', name: 'Stakeholder Letter', icon: '🤝', description: 'Partner communication', category: 'business' },
  { id: 'staff-memo', name: 'Staff Memo', icon: '👥', description: 'Internal communication', category: 'business' }
]

export default function PlatformFormatSelection() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'platforms' | 'formats'>('platforms')

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
  }

  const handleFormatToggle = (formatId: string) => {
    setSelectedFormats(prev => 
      prev.includes(formatId) 
        ? prev.filter(id => id !== formatId)
        : [...prev, formatId]
    )
  }

  const handleNext = () => {
    // Store selections in localStorage
    localStorage.setItem('selectedPlatforms', JSON.stringify(selectedPlatforms))
    localStorage.setItem('selectedFormats', JSON.stringify(selectedFormats))
    
    // Navigate to AI generation
    window.location.href = '/dashboard/create/generate'
  }

  const handleSkip = () => {
    // Set smart defaults based on persona if available
    const userPersona = localStorage.getItem('userPersona')
    
    let defaultPlatforms: string[] = []
    let defaultFormats: string[] = []
    
    switch (userPersona) {
      case 'professional':
        defaultPlatforms = ['linkedin', 'website', 'email']
        defaultFormats = ['blog-article', 'email-newsletter', 'press-release']
        break
      case 'content-creator':
        defaultPlatforms = ['instagram', 'tiktok', 'youtube']
        defaultFormats = ['social-post', 'video-script', 'blog-article']
        break
      case 'adventure-explorer':
      default:
        defaultPlatforms = ['instagram', 'facebook', 'blog']
        defaultFormats = ['social-post', 'blog-article', 'brochure']
        break
    }
    
    localStorage.setItem('selectedPlatforms', JSON.stringify(defaultPlatforms))
    localStorage.setItem('selectedFormats', JSON.stringify(defaultFormats))
    
    window.location.href = '/dashboard/create/generate'
  }

  const groupedPlatforms = {
    social: platformOptions.filter(p => p.category === 'social'),
    professional: platformOptions.filter(p => p.category === 'professional'),
    content: platformOptions.filter(p => p.category === 'content')
  }

  const groupedFormats = {
    digital: formatOptions.filter(f => f.category === 'digital'),
    print: formatOptions.filter(f => f.category === 'print'),
    business: formatOptions.filter(f => f.category === 'business')
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
            backgroundColor: '#1f2937', color: 'white',
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

      {/* Tab Selection */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '2rem 1rem 0'
      }}>
        <div style={{
          display: 'inline-flex',
          backgroundColor: '#f3f4f6',
          borderRadius: '1rem',
          padding: '0.5rem'
        }}>
          <button
            onClick={() => setActiveTab('platforms')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'platforms' ? 'white' : 'transparent',
              color: activeTab === 'platforms' ? '#1f2937' : '#6b7280',
              boxShadow: activeTab === 'platforms' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
              fontSize: 'clamp(0.875rem, 2vw, 1rem)'
            }}
          >
            📱 Platforms ({selectedPlatforms.length})
          </button>
          <button
            onClick={() => setActiveTab('formats')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'formats' ? 'white' : 'transparent',
              color: activeTab === 'formats' ? '#1f2937' : '#6b7280',
              boxShadow: activeTab === 'formats' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
              fontSize: 'clamp(0.875rem, 2vw, 1rem)'
            }}
          >
            📄 Formats ({selectedFormats.length})
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={{
        flex: 1,
        maxWidth: '1000px',
        margin: '0 auto',
        width: '100%',
        padding: '2rem 1rem'
      }}>
        
        {activeTab === 'platforms' && (
          <div>
            {/* Social Media Platforms */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                📱 Social Media
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem'
              }}>
                {groupedPlatforms.social.map(platform => (
                  <div
                    key={platform.id}
                    onClick={() => handlePlatformToggle(platform.id)}
                    style={{
                      border: selectedPlatforms.includes(platform.id) 
                        ? `2px solid ${platform.color}` 
                        : '2px solid #e5e7eb',
                      borderRadius: '1rem',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: selectedPlatforms.includes(platform.id) ? `${platform.color}15` : 'white'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div style={{ fontSize: '1.5rem' }}>{platform.icon}</div>
                      <div>
                        <h4 style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#1f2937',
                          margin: '0 0 0.25rem 0'
                        }}>
                          {platform.name}
                        </h4>
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          margin: 0
                        }}>
                          {platform.description}
                        </p>
                      </div>
                      {selectedPlatforms.includes(platform.id) && (
                        <div style={{
                          marginLeft: 'auto',
                          color: platform.color,
                          fontSize: '1.25rem'
                        }}>
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Platforms */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                💼 Professional
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem'
              }}>
                {groupedPlatforms.professional.map(platform => (
                  <div
                    key={platform.id}
                    onClick={() => handlePlatformToggle(platform.id)}
                    style={{
                      border: selectedPlatforms.includes(platform.id) 
                        ? `2px solid ${platform.color}` 
                        : '2px solid #e5e7eb',
                      borderRadius: '1rem',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: selectedPlatforms.includes(platform.id) ? `${platform.color}15` : 'white'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div style={{ fontSize: '1.5rem' }}>{platform.icon}</div>
                      <div>
                        <h4 style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#1f2937',
                          margin: '0 0 0.25rem 0'
                        }}>
                          {platform.name}
                        </h4>
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          margin: 0
                        }}>
                          {platform.description}
                        </p>
                      </div>
                      {selectedPlatforms.includes(platform.id) && (
                        <div style={{
                          marginLeft: 'auto',
                          color: platform.color,
                          fontSize: '1.25rem'
                        }}>
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Platforms */}
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                ✍️ Content
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem'
              }}>
                {groupedPlatforms.content.map(platform => (
                  <div
                    key={platform.id}
                    onClick={() => handlePlatformToggle(platform.id)}
                    style={{
                      border: selectedPlatforms.includes(platform.id) 
                        ? `2px solid ${platform.color}` 
                        : '2px solid #e5e7eb',
                      borderRadius: '1rem',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: selectedPlatforms.includes(platform.id) ? `${platform.color}15` : 'white'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div style={{ fontSize: '1.5rem' }}>{platform.icon}</div>
                      <div>
                        <h4 style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#1f2937',
                          margin: '0 0 0.25rem 0'
                        }}>
                          {platform.name}
                        </h4>
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          margin: 0
                        }}>
                          {platform.description}
                        </p>
                      </div>
                      {selectedPlatforms.includes(platform.id) && (
                        <div style={{
                          marginLeft: 'auto',
                          color: platform.color,
                          fontSize: '1.25rem'
                        }}>
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'formats' && (
          <div>
            {/* Digital Formats */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                💻 Digital Formats
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem'
              }}>
                {groupedFormats.digital.map(format => (
                  <div
                    key={format.id}
                    onClick={() => handleFormatToggle(format.id)}
                    style={{
                      border: selectedFormats.includes(format.id) 
                        ? '2px solid #3b82f6' 
                        : '2px solid #e5e7eb',
                      borderRadius: '1rem',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: selectedFormats.includes(format.id) ? '#eff6ff' : 'white'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div style={{ fontSize: '1.5rem' }}>{format.icon}</div>
                      <div>
                        <h4 style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#1f2937',
                          margin: '0 0 0.25rem 0'
                        }}>
                          {format.name}
                        </h4>
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          margin: 0
                        }}>
                          {format.description}
                        </p>
                      </div>
                      {selectedFormats.includes(format.id) && (
                        <div style={{
                          marginLeft: 'auto',
                          color: '#3b82f6',
                          fontSize: '1.25rem'
                        }}>
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Print Formats */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🖨️ Print Formats
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem'
              }}>
                {groupedFormats.print.map(format => (
                  <div
                    key={format.id}
                    onClick={() => handleFormatToggle(format.id)}
                    style={{
                      border: selectedFormats.includes(format.id) 
                        ? '2px solid #10b981' 
                        : '2px solid #e5e7eb',
                      borderRadius: '1rem',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: selectedFormats.includes(format.id) ? '#ecfdf5' : 'white'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div style={{ fontSize: '1.5rem' }}>{format.icon}</div>
                      <div>
                        <h4 style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#1f2937',
                          margin: '0 0 0.25rem 0'
                        }}>
                          {format.name}
                        </h4>
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          margin: 0
                        }}>
                          {format.description}
                        </p>
                      </div>
                      {selectedFormats.includes(format.id) && (
                        <div style={{
                          marginLeft: 'auto',
                          color: '#10b981',
                          fontSize: '1.25rem'
                        }}>
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Formats */}
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🏢 Business Formats
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem'
              }}>
                {groupedFormats.business.map(format => (
                  <div
                    key={format.id}
                    onClick={() => handleFormatToggle(format.id)}
                    style={{
                      border: selectedFormats.includes(format.id) 
                        ? '2px solid #f59e0b' 
                        : '2px solid #e5e7eb',
                      borderRadius: '1rem',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: selectedFormats.includes(format.id) ? '#fef3c7' : 'white'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div style={{ fontSize: '1.5rem' }}>{format.icon}</div>
                      <div>
                        <h4 style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#1f2937',
                          margin: '0 0 0.25rem 0'
                        }}>
                          {format.name}
                        </h4>
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          margin: 0
                        }}>
                          {format.description}
                        </p>
                      </div>
                      {selectedFormats.includes(format.id) && (
                        <div style={{
                          marginLeft: 'auto',
                          color: '#f59e0b',
                          fontSize: '1.25rem'
                        }}>
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        width: '100%',
        padding: '2rem 1rem',
        borderTop: '1px solid #f3f4f6'
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
          disabled={(selectedPlatforms.length === 0 && selectedFormats.length === 0)}
          style={{
            background: (selectedPlatforms.length > 0 || selectedFormats.length > 0)
              ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
              : '#e5e7eb',
            color: (selectedPlatforms.length > 0 || selectedFormats.length > 0) ? 'white' : '#9ca3af',
            fontSize: 'clamp(1.25rem, 4vw, 2rem)',
            fontWeight: '900',
            padding: '1rem 2rem',
            borderRadius: '1rem',
            border: 'none',
            cursor: (selectedPlatforms.length > 0 || selectedFormats.length > 0) ? 'pointer' : 'not-allowed',
            boxShadow: (selectedPlatforms.length > 0 || selectedFormats.length > 0) ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
            transition: 'all 0.2s',
            transform: (selectedPlatforms.length > 0 || selectedFormats.length > 0) ? 'scale(1)' : 'scale(0.95)'
          }}
          className={(selectedPlatforms.length > 0 || selectedFormats.length > 0) ? "transition-all hover:scale-105" : ""}
        >
          Next: AI Generation →
        </button>
      </div>

      {/* Logo - Brand Reinforcement */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
        paddingTop: '2rem'
      }}>
        <Link href="/" style={{
          textDecoration: 'none',
          display: 'inline-block'
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
        </Link>
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
