'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C' 
const BRAND_BLUE = '#11B3FF'

interface PlatformContent {
  [key: string]: {
    content: string;
    charCount: number;
    isOptimal: boolean;
    isCompleted: boolean;
  }
}

export default function ReviewDistribute() {
  const [story, setStory] = useState('')
  const [demographics, setDemographics] = useState('')
  const [interests, setInterests] = useState('')
  const [activePlatform, setActivePlatform] = useState('Website')
  const [platformContent, setPlatformContent] = useState<PlatformContent>({})
  const [isGenerating, setIsGenerating] = useState(true)
  const [completedPlatforms, setCompletedPlatforms] = useState<string[]>([])

  // Platform configurations with character limits
  const platforms = {
    'Website': {
      icon: '🌐',
      optimal: { min: 150, max: 300 },
      maximum: 500,
      description: 'Website landing page copy'
    },
    'Facebook': {
      icon: '📘',
      optimal: { min: 80, max: 100 },
      maximum: 2200,
      description: 'Facebook post with engagement focus'
    },
    'Blog': {
      icon: '📝',
      optimal: { min: 300, max: 500 },
      maximum: 3000,
      description: 'Blog article introduction'
    }
  }

  // Load data from previous steps
  useEffect(() => {
    const savedStory = localStorage.getItem('currentStory') || ''
    const savedDemographics = localStorage.getItem('selectedDemographics') || ''
    const savedInterests = localStorage.getItem('selectedInterests') || ''
    
    setStory(savedStory)
    setDemographics(savedDemographics)
    setInterests(savedInterests)

    // Generate content for each platform
    setTimeout(() => {
      const generatedContent: PlatformContent = {}
      
      Object.keys(platforms).forEach(platform => {
        const content = generatePlatformContent(platform, savedStory, savedDemographics, savedInterests)
        const charCount = content.length
        const optimal = platforms[platform as keyof typeof platforms].optimal
        const isOptimal = charCount >= optimal.min && charCount <= optimal.max
        
        generatedContent[platform] = {
          content,
          charCount,
          isOptimal,
          isCompleted: false
        }
      })
      
      setPlatformContent(generatedContent)
      setIsGenerating(false)
    }, 2000)
  }, [])

  const generatePlatformContent = (platform: string, storyText: string, demo: string, int: string) => {
    const storyPreview = storyText.substring(0, 200)
    
    switch (platform) {
      case 'Website':
        return `Experience authentic travel stories that inspire your next adventure.\n\n${storyPreview}...\n\nDiscover unique destinations through the eyes of real travelers. Our curated stories help you plan meaningful journeys that go beyond typical tourist experiences.\n\nStart planning your authentic travel experience today.`
        
      case 'Facebook':
        return `🌟 ${storyPreview}...\n\nEvery journey has a story worth sharing! ✨ This incredible experience shows why authentic travel creates the most unforgettable memories.\n\nWhat's your most inspiring travel moment? Share below! 👇\n\n#AuthenticTravel #TravelStories #Adventure #Wanderlust`
        
      case 'Blog':
        return `# Discovering Authentic Travel: ${storyPreview.substring(0, 50)}...\n\n## The Journey Begins\n\n${storyPreview}...\n\nIn today's world of social media travel, finding authentic experiences can feel challenging. But stories like this remind us that genuine adventures are still out there, waiting for those willing to step off the beaten path.\n\n## Why Authentic Travel Matters\n\nAuthentic travel experiences create lasting memories and meaningful connections. They challenge us, inspire us, and help us see the world through different perspectives.\n\n*Continue reading to discover how you can plan your own authentic adventure...*`
        
      default:
        return storyText
    }
  }

  const getCharacterStatus = (platform: string) => {
    const content = platformContent[platform]
    if (!content) return 'optimal'
    
    const config = platforms[platform as keyof typeof platforms]
    const { charCount } = content
    
    if (charCount >= config.optimal.min && charCount <= config.optimal.max) {
      return 'optimal'
    } else if (charCount <= config.maximum) {
      return 'acceptable'
    } else {
      return 'over'
    }
  }

  const handleEditContent = (platform: string, newContent: string) => {
    const charCount = newContent.length
    const optimal = platforms[platform as keyof typeof platforms].optimal
    const isOptimal = charCount >= optimal.min && charCount <= optimal.max
    
    setPlatformContent(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        content: newContent,
        charCount,
        isOptimal
      }
    }))
  }

  const handleSendToPlatform = (platform: string) => {
    setCompletedPlatforms(prev => [...prev, platform])
    setPlatformContent(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        isCompleted: true
      }
    }))
    alert(`Content sent to ${platform}! 🚀`)
  }

  const handleMorePlatforms = () => {
    alert('Upgrade to access Instagram, LinkedIn, TikTok and more! 🚀')
  }

  if (isGenerating) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>🚀</div>
        <h2 style={{ 
          fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
          fontWeight: '700', 
          color: '#1f2937', 
          marginBottom: '1rem' 
        }}>
          Generating Your Content...
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Creating platform-optimized versions of your story</p>
        <div style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', color: '#9ca3af' }}>
          <p>✓ Analyzing your story</p>
          <p>✓ Optimizing for your target audience</p>
          <p>✓ Formatting for each platform</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      backgroundColor: 'white' 
    }}>
      
      {/* Header with Logo and Step Tracker */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '2rem 1rem',
        borderBottom: '1px solid #f3f4f6'
      }}>
        
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div style={{ 
              color: BRAND_PURPLE, 
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', 
              fontWeight: '900',
              display: 'inline'
            }}>speak</div>
            <div style={{ 
              color: BRAND_ORANGE, 
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', 
              fontWeight: '900',
              display: 'inline',
              marginLeft: '0.25rem'
            }}>click</div>
            <div style={{ 
              color: BRAND_BLUE, 
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', 
              fontWeight: '900',
              display: 'inline',
              marginLeft: '0.25rem'
            }}>send</div>
          </Link>
        </div>

        <div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',
  gap: '1rem',                    // Increased from 0.75rem
  marginBottom: '2rem',
  width: '100%',
  maxWidth: '500px',              // Increased from 400px
  margin: '0 auto'                // Added for better centering
}}>
  {[1, 2, 3, 4, 5].map((step, index) => (
    <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
      {/* Step Circle */}
      <div style={{
        width: '2.5rem',
        height: '2.5rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: step <= 5 ? '#10b981' : '#d1d5db',
        color: step <= 5 ? 'white' : '#6b7280',
        fontSize: '0.875rem',
        fontWeight: '600',
        flexShrink: 0
      }}>
        {step}
      </div>
      
      {/* Connecting Line */}
      {index < 4 && (
        <div style={{
          width: '2rem',
          height: '2px',
          backgroundColor: step < 5 ? '#10b981' : '#d1d5db',
          margin: '0 0.25rem'
        }} />
      )}
    </div>
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
          Review & Distribute
        </h1>
        <p style={{ 
          color: '#6b7280', 
          textAlign: 'center', 
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          maxWidth: '600px' 
        }}>
          Your AI-generated content is ready. Review each platform and send when perfect.
        </p>
      </div>

      <div style={{ 
        flex: '1', 
        maxWidth: '1200px', 
        margin: '0 auto', 
        width: '100%', 
        padding: '2rem 1rem' 
      }}>
        
        {/* Generated Story Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1rem' 
          }}>
            <h2 style={{ 
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', 
              fontWeight: '600', 
              color: '#1f2937' 
            }}>
              Your Generated Story
            </h2>
            <button 
              style={{
                color: '#6b7280',
                border: '1px solid #d1d5db',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              ✏️ Edit Story
            </button>
          </div>
          <div style={{
            backgroundColor: '#f9fafb',
            border: '2px solid #e5e7eb',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            color: '#374151',
            lineHeight: '1.6',
            fontSize: 'clamp(1rem, 2.5vw, 1.125rem)'
          }}>
            {story || "Your story will appear here..."}
          </div>
        </div>

        {/* Platform Distribution Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1rem' 
          }}>
            <h2 style={{ 
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', 
              fontWeight: '600', 
              color: '#1f2937' 
            }}>
              Your Chosen Platform Distribution
            </h2>
            <div style={{ 
              fontSize: '0.875rem', 
              color: '#6b7280' 
            }}>
              {completedPlatforms.length} of {Object.keys(platforms).length} platforms completed
            </div>
          </div>

          {/* Platform Tabs */}
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            marginBottom: '1.5rem',
            borderBottom: '2px solid #f1f5f9',
            overflowX: 'auto'
          }}>
            {Object.keys(platforms).map((platform) => (
              <button
                key={platform}
                onClick={() => setActivePlatform(platform)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 1.25rem',
                  borderRadius: '0.5rem 0.5rem 0 0',
                  minWidth: '120px',
                  position: 'relative',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activePlatform === platform ? 'white' : 'transparent',
                  borderBottom: activePlatform === platform ? '3px solid #3b82f6' : 'none',
                  color: activePlatform === platform ? '#3b82f6' : '#6b7280'
                }}
              >
                {completedPlatforms.includes(platform) && (
                  <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    width: '1.25rem',
                    height: '1.25rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                  }}>
                    ✓
                  </div>
                )}
                <div style={{ fontSize: '1.5rem' }}>
                  {platforms[platform as keyof typeof platforms].icon}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                  {platform}
                </div>
              </button>
            ))}
            
            {/* More Platforms Button */}
            <button
              onClick={handleMorePlatforms}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '1rem 1.25rem',
                borderRadius: '0.5rem',
                border: '2px dashed #fbbf24',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                minWidth: '120px',
                position: 'relative',
                marginLeft: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                width: '1.25rem',
                height: '1.25rem',
                backgroundColor: '#f59e0b',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '700'
              }}>
                +3
              </div>
              <div style={{ fontSize: '1.5rem' }}>✨</div>
              <div style={{ 
                fontSize: '0.75rem', 
                fontWeight: '600', 
                color: '#92400e', 
                textAlign: 'center', 
                lineHeight: '1.2' 
              }}>
                More Platforms
              </div>
            </button>
          </div>

          {/* Active Platform Content */}
          {activePlatform && platformContent[activePlatform] && (
            <div style={{
              backgroundColor: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid #f1f5f9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    backgroundColor: '#eff6ff',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem'
                  }}>
                    {platforms[activePlatform as keyof typeof platforms].icon}
                  </div>
                  <div>
                    <h3 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: '600', 
                      color: '#1f2937', 
                      marginBottom: '0.25rem' 
                    }}>
                      {activePlatform} Post
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {platforms[activePlatform as keyof typeof platforms].description}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: getCharacterStatus(activePlatform) === 'optimal' ? '#059669' :
                           getCharacterStatus(activePlatform) === 'acceptable' ? '#d97706' : '#dc2626'
                  }}>
                    {platformContent[activePlatform].charCount}/{platforms[activePlatform as keyof typeof platforms].optimal.max} chars
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '9999px',
                    marginTop: '0.25rem',
                    backgroundColor: getCharacterStatus(activePlatform) === 'optimal' ? '#dcfce7' :
                                    getCharacterStatus(activePlatform) === 'acceptable' ? '#fef3c7' : '#fee2e2',
                    color: getCharacterStatus(activePlatform) === 'optimal' ? '#166534' :
                           getCharacterStatus(activePlatform) === 'acceptable' ? '#92400e' : '#dc2626'
                  }}>
                    Optimal: {platforms[activePlatform as keyof typeof platforms].optimal.min}-{platforms[activePlatform as keyof typeof platforms].optimal.max}
                  </div>
                </div>
              </div>

              <textarea
                value={platformContent[activePlatform].content}
                onChange={(e) => handleEditContent(activePlatform, e.target.value)}
                style={{
                  width: '100%',
                  height: '12rem',
                  padding: '1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
                placeholder="Generated content will appear here..."
              />

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1rem'
              }}>
                <button
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    fontWeight: '500',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  ✏️ Edit This Version
                </button>
                <button
                  onClick={() => handleSendToPlatform(activePlatform)}
                  disabled={completedPlatforms.includes(activePlatform)}
                  style={{
                    fontWeight: '500',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: completedPlatforms.includes(activePlatform) ? 'not-allowed' : 'pointer',
                    backgroundColor: completedPlatforms.includes(activePlatform) ? '#d1d5db' : '#059669',
                    color: completedPlatforms.includes(activePlatform) ? '#6b7280' : 'white'
                  }}
                >
                  {completedPlatforms.includes(activePlatform) ? '✅ Sent' : '📤 Send to ' + activePlatform}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1.5rem',
          borderTop: '1px solid #f1f5f9'
        }}>
          <Link
            href="/dashboard/create/interests"
            style={{
              backgroundColor: '#e5e7eb',
              color: '#374151',
              fontWeight: '500',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            ← Back to Interests
          </Link>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => {
                localStorage.setItem('platformContent', JSON.stringify(platformContent))
                alert('All content saved as drafts! 💾')
              }}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                fontWeight: '500',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              💾 Save All Drafts
            </button>
            <Link
              href="/dashboard"
              style={{
                backgroundColor: '#059669',
                color: 'white',
                fontWeight: '500',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              ✅ Complete
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '1rem',
        color: '#6b7280',
        fontSize: '0.875rem',
        borderTop: '1px solid #f1f5f9'
      }}>
        <strong>Speak Click Send</strong> is another <strong>CCC Marketing Pro™ SaaS 2025</strong>
      </div>
    </div>
  )
}
