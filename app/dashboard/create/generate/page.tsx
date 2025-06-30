'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

interface UserData {
  photo?: string
  story?: string
  persona?: string
  audience?: string
  interests?: string
  platforms?: string[]
  formats?: string[]
}

interface PrivacySettings {
  includePhoto: boolean
  detailLevel: 'basic' | 'enhanced' | 'full'
  shareStoryDetails: boolean
  anonymizeLocation: boolean
}

export default function GenerateContent() {
  const [userData, setUserData] = useState<UserData>({})
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    includePhoto: false,
    detailLevel: 'enhanced',
    shareStoryDetails: true,
    anonymizeLocation: true
  })
  const [showPrivacyControls, setShowPrivacyControls] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [userConsent, setUserConsent] = useState(false)

  // Load user data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const data: UserData = {
          photo: localStorage.getItem('uploadedPhoto') || undefined,
          story: localStorage.getItem('userStoryContext') || undefined,
          persona: localStorage.getItem('selectedPersona') || undefined,
          audience: JSON.parse(localStorage.getItem('selectedDemographics') || '[]')[0],
          interests: JSON.parse(localStorage.getItem('selectedInterests') || '[]')[0],
          platforms: JSON.parse(localStorage.getItem('selectedPlatforms') || '[]'),
          formats: JSON.parse(localStorage.getItem('selectedFormats') || '[]')
        }
        setUserData(data)
        console.log('📋 Loaded user data:', data)
      } catch (error) {
        console.error('Error loading user data:', error)
        setError('Error loading your content data. Please try refreshing the page.')
      }
    }
  }, [])

  // Sanitize data based on privacy settings
  const sanitizeUserData = (data: UserData, privacy: PrivacySettings) => {
    const sanitized = { ...data }

    // Handle photo
    if (!privacy.includePhoto && sanitized.photo) {
      // Convert photo to description instead of sending actual image
      sanitized.photo = "Cultural tourism experience photo"
      delete sanitized.photo // Remove actual photo data
    }

    // Handle story details
    if (!privacy.shareStoryDetails) {
      sanitized.story = "Authentic New Zealand tourism experience"
    } else if (privacy.anonymizeLocation && sanitized.story) {
      // Remove specific location details
      sanitized.story = sanitized.story
        .replace(/\b[A-Z][a-z]+\s+(village|town|city|region)\b/gi, 'thermal region')
        .replace(/\bWhakarewarewa\b/gi, 'traditional Māori village')
        .replace(/\bRotorua\b/gi, 'geothermal region')
    }

    return sanitized
  }

  // Generate comprehensive Claude prompt
  const generateClaudePrompt = (data: UserData, privacy: PrivacySettings) => {
    const sanitizedData = sanitizeUserData(data, privacy)
    
    const personaMap: { [key: string]: string } = {
      'professional': 'Professional/Business Owner - authoritative, business-focused content',
      'influencer': 'Content Creator/Influencer - engaging, personal storytelling',
      'adventure': 'Adventure Seeker - excited, energetic content',
      'female': 'Female Traveller - safety-conscious, authentic sharing',
      'cultural': 'Cultural Explorer - respectful, educational content',
      'family': 'Family Traveller - inclusive, multi-generational appeal',
      'storyteller': 'Storyteller/Writer - narrative-focused, detailed content',
      'eco': 'Eco Tourism Champion - sustainability-focused messaging',
      'vfr': 'Visiting Friends & Family - personal, relationship-focused',
      'independent': 'Free & Independent Traveller - flexible, self-guided content'
    }

    const audienceMap: { [key: string]: string } = {
      'baby-boomers': 'Baby Boomers (comfort-seeking, knowledge-focused)',
      'gen-x': 'Gen X (family-focused, value-conscious)',
      'millennials': 'Millennials (experience-focused, social media savvy)',
      'gen-z': 'Gen Z (digital natives, authenticity-focused)',
      'female-travellers': 'Female Travellers (safety-conscious, community-oriented)',
      'families': 'Family Travellers (multi-generational, child-friendly)',
      'eco-tourism': 'Eco-Tourism Enthusiasts (sustainability-minded)',
      'vfr': 'Visiting Friends & Relatives (personal connections)',
      'conference': 'Event/Conference Delegates (business travelers)',
      'independent': 'Free & Independent Travellers (self-planned)',
      'luxury': 'Luxury/Premium Travellers (high-end experiences)',
      'adventure': 'Adventure/Active Travellers (outdoor experiences)',
      'cultural': 'Cultural Heritage Seekers (history enthusiasts)',
      'digital-nomads': 'Digital Nomads (remote workers)',
      'honeymoon': 'Honeymoon/Romance Travellers (couples)',
      'solo': 'Solo Travellers (independent explorers)',
      'accessible': 'Accessible Tourism (inclusive experiences)'
    }

    return `You are a professional tourism content expert specializing in culturally-sensitive, authentic New Zealand storytelling.

CREATOR PROFILE:
- Type: ${personaMap[sanitizedData.persona || ''] || 'Tourism Content Creator'}
- Experience: ${sanitizedData.story || 'Authentic New Zealand tourism experience'}

TARGET AUDIENCE: ${audienceMap[sanitizedData.audience || ''] || 'Tourism enthusiasts'}

INTEREST FOCUS: ${sanitizedData.interests || 'Cultural experiences'}

PLATFORMS REQUESTED: ${sanitizedData.platforms?.join(', ') || 'Social media'}
FORMATS REQUESTED: ${sanitizedData.formats?.join(', ') || 'Social posts'}

CULTURAL REQUIREMENTS:
- Respect Mātauranga Māori intellectual property and cultural protocols
- Use authentic representation without appropriation
- Include sustainable tourism messaging
- Ensure cultural sensitivity in all content
- Acknowledge the mana (spiritual power) of places and people

CONTENT GUIDELINES:
- Create engaging, platform-optimized content for each requested format
- Match the creator's voice and style to their persona type
- Appeal specifically to the target audience demographics
- Include relevant hashtags and engagement strategies
- Provide call-to-action appropriate for the creator type
- Ensure content promotes responsible tourism practices

GENERATE:
Create ${sanitizedData.platforms?.length || 1} distinct pieces of content, one optimized for each platform:
${sanitizedData.platforms?.map(platform => `- ${platform}: ${sanitizedData.formats?.join(' and ') || 'Social post'}`).join('\n') || '- Social media post'}

Each piece should:
1. Reflect the ${personaMap[sanitizedData.persona || '']} voice
2. Appeal to ${audienceMap[sanitizedData.audience || '']}
3. Focus on ${sanitizedData.interests || 'cultural experiences'}
4. Include platform-specific optimization
5. Maintain cultural respect and authenticity

IMPORTANT: All content must honor Te Tiriti o Waitangi principles and support sustainable, culturally-conscious tourism in Aotearoa New Zealand.`
  }

  // Handle content generation
  const handleGenerate = async () => {
    if (!userConsent) {
      setError('Please review and accept the privacy terms before generating content.')
      return
    }

    setIsGenerating(true)
    setError('')
    setShowPrivacyControls(false)
    
    try {
      const prompt = generateClaudePrompt(userData, privacySettings)
      console.log('🎯 Generated Claude Prompt:', prompt)

      // TODO: Replace with actual Claude API call
      // const response = await fetch('/api/claude', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prompt })
      // })
      
      // Simulate API delay for now
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock generated content
      const mockContent = generateMockContent(userData)
      setGeneratedContent(mockContent)
      
      console.log('✅ Content generated successfully')
    } catch (err) {
      setError('Failed to generate content. Please try again.')
      console.error('❌ Generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate mock content (replace with actual API response processing)
  const generateMockContent = (data: UserData) => {
    return {
      platforms: data.platforms?.map(platform => ({
        name: platform,
        content: {
          text: `🌟 ${data.story?.substring(0, 120)}...\n\nAn incredible cultural experience that perfectly captures the spirit of Aotearoa New Zealand! ${platform === 'Instagram' ? '✨' : ''}\n\n${platform === 'LinkedIn' ? 'This authentic encounter showcases the importance of cultural tourism done right.' : 'Tag someone who needs to experience this magic!'}\n\n#NewZealand #CulturalTourism #Authentic${platform === 'Instagram' ? ' #TravelGram #Culture' : ''}`,
          hashtags: platform === 'Instagram' 
            ? ['#NewZealand', '#CulturalTourism', '#TravelGram', '#Authentic', '#Culture', '#Māori', '#Thermal', '#Travel']
            : ['#NewZealand', '#CulturalTourism', '#Authentic'],
          callToAction: data.persona === 'professional' 
            ? 'Experience authentic cultural tourism - book your visit today!'
            : 'Save this post and tag someone who needs to see this!',
          optimalTiming: platform === 'Instagram' ? 'Post between 11am-1pm or 7-9pm NZST' : 'Post weekdays 8-10am NZST',
          engagementTips: `Optimized for ${platform} - ${data.audience} engagement`
        }
      })) || [],
      metrics: {
        estimatedReach: '2,500-5,000 people',
        engagementRate: '4.2-6.8%',
        culturalSensitivityScore: '95/100',
        sustainabilityRating: 'High'
      },
      recommendations: [
        'Content respects Mātauranga Māori protocols',
        'Promotes sustainable tourism practices',
        'Optimized for target audience engagement',
        'Platform-specific formatting applied'
      ]
    }
  }

  const handleStartOver = () => {
    window.location.href = '/dashboard/create/photo'
  }

  if (showPrivacyControls) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'white'
      }}>
        {/* Header */}
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
            {[1,2,3,4,5,6].map((step) => (
              <div key={step} style={{
                width: '2rem', height: '2rem', borderRadius: '50%',
                backgroundColor: '#10b981', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.875rem', fontWeight: '600'
              }}>{step}</div>
            ))}
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            fontWeight: '700',
            color: '#1f2937',
            lineHeight: '1.2',
            marginBottom: '0.5rem',
            textAlign: 'center'
          }}>
            Privacy & Content Settings
          </h1>
          
          <p style={{
            fontSize: 'clamp(1rem, 3vw, 1.25rem)',
            color: '#6b7280',
            textAlign: 'center',
            maxWidth: '600px'
          }}>
            Choose how your data is used for content generation
          </p>
        </div>

        <div style={{
          flex: 1,
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%',
          padding: '2rem 1rem'
        }}>
          
          {/* Data Summary */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '1rem'
            }}>
              📋 Your Content Profile
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              fontSize: '0.875rem'
            }}>
              <div>
                <strong>Story:</strong> {userData.story ? '✓ Provided' : '❌ Missing'}
              </div>
              <div>
                <strong>Persona:</strong> {userData.persona || 'Not selected'}
              </div>
              <div>
                <strong>Audience:</strong> {userData.audience || 'Not selected'}
              </div>
              <div>
                <strong>Platforms:</strong> {userData.platforms?.length || 0} selected
              </div>
            </div>
          </div>

          {/* Privacy Controls */}
          <div style={{
            backgroundColor: '#fff7ed',
            border: '1px solid #fed7aa',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#ea580c',
              marginBottom: '1rem'
            }}>
              🔒 Privacy Settings
            </h3>

            {/* Photo Handling */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={privacySettings.includePhoto}
                  onChange={(e) => setPrivacySettings(prev => ({
                    ...prev,
                    includePhoto: e.target.checked
                  }))}
                />
                <strong>Include photo for enhanced content generation</strong>
              </label>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '1.5rem' }}>
                Sending your photo helps Claude create more specific, visual content. 
                {!privacySettings.includePhoto && ' We\'ll use a generic description instead.'}
              </p>
            </div>

            {/* Story Details */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={privacySettings.shareStoryDetails}
                  onChange={(e) => setPrivacySettings(prev => ({
                    ...prev,
                    shareStoryDetails: e.target.checked
                  }))}
                />
                <strong>Share detailed story context</strong>
              </label>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '1.5rem' }}>
                Include your full story for better personalization.
                {!privacySettings.shareStoryDetails && ' We\'ll use generic tourism content instead.'}
              </p>
            </div>

            {/* Location Anonymization */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={privacySettings.anonymizeLocation}
                  onChange={(e) => setPrivacySettings(prev => ({
                    ...prev,
                    anonymizeLocation: e.target.checked
                  }))}
                />
                <strong>Anonymize specific locations</strong>
              </label>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '1.5rem' }}>
                Replace specific place names with generic regional references for privacy.
              </p>
            </div>
          </div>

          {/* Data Usage Transparency */}
          <div style={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#0369a1',
              marginBottom: '1rem'
            }}>
              📊 Data Usage Transparency
            </h3>
            
            <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#0369a1' }}>✓ SENT TO CLAUDE:</strong>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', color: '#374151' }}>
                  <li>Your selected persona and preferences</li>
                  <li>Target audience and interest categories</li>
                  <li>Platform and format requirements</li>
                  {privacySettings.includePhoto && <li>Your uploaded photo</li>}
                  {privacySettings.shareStoryDetails && <li>Your travel story (anonymized if selected)</li>}
                  <li>Cultural sensitivity guidelines</li>
                </ul>
              </div>
              
              <div>
                <strong style={{ color: '#dc2626' }}>❌ NOT SENT:</strong>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', color: '#374151' }}>
                  <li>Personal contact information</li>
                  <li>Location coordinates or exact addresses</li>
                  <li>Travel dates or future plans</li>
                  <li>Any identifying personal details</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Consent and Generate */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '1rem',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
              <input
                type="checkbox"
                checked={userConsent}
                onChange={(e) => setUserConsent(e.target.checked)}
              />
              <span>I understand and consent to data usage as described above</span>
            </label>

            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!userConsent}
              style={{
                background: userConsent 
                  ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                  : '#e5e7eb',
                color: userConsent ? 'white' : '#9ca3af',
                fontSize: '1.5rem',
                fontWeight: '700',
                padding: '1.5rem 3rem',
                borderRadius: '1rem',
                border: 'none',
                cursor: userConsent ? 'pointer' : 'not-allowed',
                boxShadow: userConsent ? '0 10px 25px rgba(107, 46, 255, 0.3)' : 'none',
                transition: 'all 0.2s',
                marginBottom: '1rem'
              }}
            >
              🚀 Generate My Content
            </button>

            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Generate culturally-sensitive, platform-optimized tourism content using AI
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Main generation and results view
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'white'
    }}>
      {/* Header */}
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
          {[1,2,3,4,5,6].map((step) => (
            <div key={step} style={{
              width: '2rem', height: '2rem', borderRadius: '50%',
              backgroundColor: '#10b981', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.875rem', fontWeight: '600'
            }}>{step}</div>
          ))}
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          fontWeight: '700',
          color: '#1f2937',
          lineHeight: '1.2',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          {isGenerating ? 'Generating Content...' : 'Your Content Results'}
        </h1>
        
        <p style={{
          fontSize: 'clamp(1rem, 3vw, 1.25rem)',
          color: '#6b7280',
          textAlign: 'center',
          maxWidth: '600px'
        }}>
          {isGenerating 
            ? 'Creating culturally-sensitive, personalized content using AI...'
            : 'Your AI-powered tourism content is ready!'
          }
        </p>
      </div>

      <div style={{
        flex: 1,
        maxWidth: '1000px',
        margin: '0 auto',
        width: '100%',
        padding: '2rem 1rem'
      }}>
        
        {isGenerating ? (
          /* Loading State */
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem'
          }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              border: '4px solid #f3f4f6',
              borderTop: `4px solid ${BRAND_PURPLE}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 2rem'
            }}></div>
            
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '1rem'
            }}>
              Creating Your Content...
            </h3>
            
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              marginBottom: '2rem'
            }}>
              Our AI is crafting culturally-sensitive, platform-optimized content based on your preferences.
            </p>

            <div style={{
              backgroundColor: '#f0f9ff',
              border: '1px solid #0ea5e9',
              borderRadius: '1rem',
              padding: '1.5rem',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <p style={{ fontSize: '0.875rem', color: '#0369a1', margin: 0 }}>
                ✨ Analyzing your story for cultural elements<br/>
                🎯 Optimizing for your target audience<br/>
                📱 Creating platform-specific formats<br/>
                🌺 Ensuring cultural sensitivity
              </p>
            </div>
          </div>
        ) : generatedContent ? (
          /* Results Display */
          <div>
            {/* Success Header */}
            <div style={{
              backgroundColor: '#dcfce7',
              border: '1px solid #bbf7d0',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#15803d',
                marginBottom: '0.5rem'
              }}>
                ✨ Content Generated Successfully!
              </h2>
              <p style={{
                color: '#166534',
                fontSize: '1rem',
                margin: 0
              }}>
                Your culturally-sensitive, personalized tourism content is ready to share
              </p>
            </div>

            {/* Generated Content */}
            <div style={{
              display: 'grid',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              {generatedContent.platforms?.map((platform: any, index: number) => (
                <div key={index} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  backgroundColor: 'white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: '#374151',
                      margin: 0
                    }}>
                      📱 {platform.name} Content
                    </h3>
                    
                    <button
                      onClick={() => navigator.clipboard.writeText(platform.content.text)}
                      style={{
                        background: BRAND_BLUE,
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      📋 Copy
                    </button>
                  </div>
                  
                  <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    fontFamily: 'system-ui',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    border: '1px solid #e2e8f0'
                  }}>
                    {platform.content.text}
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    fontSize: '0.875rem'
                  }}>
                    <div>
                      <strong style={{ color: '#374151' }}>Call to Action:</strong>
                      <div style={{ color: '#6b7280' }}>{platform.content.callToAction}</div>
                    </div>
                    <div>
                      <strong style={{ color: '#374151' }}>Best Time to Post:</strong>
                      <div style={{ color: '#6b7280' }}>{platform.content.optimalTiming}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Metrics */}
            {generatedContent.metrics && (
              <div style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #0ea5e9',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#0369a1',
                  marginBottom: '1rem'
                }}>
                  📊 Content Performance Insights
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem'
                }}>
