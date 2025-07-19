'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { generateClaudePrompt, defaultPrivacySettings, UserData, generateMockContent } from '../../../utils/ClaudePrompt'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

// ADD MISSING TYPESCRIPT INTERFACES
interface PlatformMockContent {
  name: string
  content: {
    text: string
    platformTips?: string
    optimalTiming?: string
  }
}

interface MockResult {
  platforms: PlatformMockContent[]
}

interface GeneratedContent {
  platform: string
  content: string
  qrCode: string
  tips: string[]
  optimalTime: string
}

export default function QRDistributionHub() {
  const [isGenerating, setIsGenerating] = useState(true)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  const [userData, setUserData] = useState<UserData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Helper for IndexedDB image loading
  const getImageFromIndexedDB = (key: string): Promise<Blob | null> => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('PhotoAppDB', 1)
      req.onerror = () => reject(req.error)
      req.onsuccess = () => {
        const db = req.result
        const tx = db.transaction('photos', 'readonly')
        const store = tx.objectStore('photos')
        const getReq = store.get(key)
        
        getReq.onsuccess = () => {
          db.close()
          resolve(getReq.result || null)
        }
        getReq.onerror = () => {
          db.close()
          reject(getReq.error)
        }
      }
    })
  }

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Load data using the ACTUAL localStorage keys from each step
        const story = localStorage.getItem('userStoryContext') // NOT 'userStory'
        const audienceData = localStorage.getItem('selectedDemographics') // NOT 'selectedAudience'
        const interests = localStorage.getItem('selectedInterests') // Correct
        const platforms = localStorage.getItem('selectedPlatforms') // Correct
        const formats = localStorage.getItem('selectedFormats') // Correct
        const profile = localStorage.getItem('userProfile')

        // Load photo from IndexedDB (not localStorage)
        let photoData: Blob | null = null
        try {
          photoData = await getImageFromIndexedDB('selectedPhoto')
        } catch (photoErr) {
          console.log('No photo found in IndexedDB, continuing without photo')
        }

        // Check required data (photo is optional)
        if (!story || !audienceData || !platforms) {
          setError('Missing required content data. Please complete all steps.')
          setIsGenerating(false)
          return
        }

        // Parse JSON data properly
        const parsedProfile = profile ? JSON.parse(profile) : {}
        const parsedAudience: string[] = audienceData ? JSON.parse(audienceData) : ['millennials']
        const parsedInterests: string[] = interests ? JSON.parse(interests) : ['cultural']
        const parsedPlatforms: string[] = platforms ? JSON.parse(platforms) : ['instagram']
        const parsedFormats: string[] = formats ? JSON.parse(formats) : ['social-post']

        const userData: UserData = {
          photo: photoData ? URL.createObjectURL(photoData) : undefined, // Convert Blob to data URL
          story,
          persona: parsedProfile.profile?.role || 'cultural',
          audience: parsedAudience[0] || 'millennials', // Take first item from array
          interests: parsedInterests[0] || 'cultural', // Take first item from array
          platforms: parsedPlatforms,
          formats: parsedFormats
        }

        console.log('Loaded user data:', userData) // Debug log
        setUserData(userData)
        generateContent(userData)
      } catch (err) {
        console.error('Error loading user data:', err)
        setError('Failed to load your content data.')
        setIsGenerating(false)
      }
    }
    loadUserData()
  }, [])

  const generateContent = async (userData: UserData) => {
    try {
      setIsGenerating(true)
      
      // Generate Claude prompt with proper privacy settings
      await generateClaudePrompt(userData, defaultPrivacySettings)
      console.log('Generated prompt for user data')

      // Use your existing generateMockContent function
      const mockContent = await mockGenerateContentWrapper(userData)
      setGeneratedContent(mockContent)
      
      setIsGenerating(false)
    } catch (err) {
      console.error('Content generation error:', err)
      setError('Failed to generate your content. Please try again.')
      setIsGenerating(false)
    }
  }

  const mockGenerateContentWrapper = async (userData: UserData): Promise<GeneratedContent[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Use your existing generateMockContent function with proper typing
    const mockResult = generateMockContent(userData) as MockResult
    
    const platforms = userData.platforms || ['instagram']
    
    return platforms.map((platform: string) => {
      // FIX: Add explicit typing for the callback parameter
      const platformContent = mockResult.platforms.find((p: PlatformMockContent) => p.name.toLowerCase() === platform.toLowerCase())
      
      return {
        platform: platform.charAt(0).toUpperCase() + platform.slice(1),
        content: platformContent?.content.text || `🌟 ${userData.story}\n\n${getPlatformOptimisedContent(platform, userData)}\n\n#CulturalTourism #${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
        qrCode: generateQRCode(`${platform}_${Date.now()}_${userData.story?.substring(0, 20) || 'story'}`),
        tips: platformContent?.content.platformTips ? [platformContent.content.platformTips] : getPlatformTips(platform),
        optimalTime: platformContent?.content.optimalTiming || getOptimalPostingTime(platform)
      }
    })
  }

  const getPlatformOptimisedContent = (platform: string, userData: UserData) => {
    const audience = userData.audience || 'cultural-explorer'
    const baseContent = userData.story || 'Incredible cultural experience'
    
    switch (platform) {
      case 'instagram':
        return `Experience the authentic beauty of this moment. Perfect for ${audience} seeking meaningful cultural connections. 📸✨`
      case 'facebook':
        return `Sharing this incredible cultural journey! For fellow ${audience} who appreciate authentic experiences and local stories. 🌍`
      case 'twitter':
        return `Cultural discovery at its finest! #AuthenticTravel #${audience.replace('-', '')}`
      case 'linkedin':
        return `Professional insight: Cultural tourism creates meaningful connections between travellers and local communities. Worth experiencing! 🤝`
      default:
        return baseContent
    }
  }

  const getPlatformTips = (platform: string): string[] => {
    switch (platform) {
      case 'instagram':
        return ['Use high-quality images', 'Include relevant hashtags', 'Tag location if appropriate', 'Engage with comments quickly']
      case 'facebook':
        return ['Share during peak hours', 'Encourage comments and shares', 'Use Facebook Groups for wider reach', 'Include call-to-action']
      case 'twitter':
        return ['Keep it concise', 'Use trending hashtags', 'Include relevant mentions', 'Tweet during active hours']
      case 'linkedin':
        return ['Professional tone', 'Industry insights', 'Network engagement', 'Share business value']
      default:
        return ['Optimise for your audience', 'Use platform best practices', 'Engage authentically']
    }
  }

  const getOptimalPostingTime = (platform: string): string => {
    switch (platform) {
      case 'instagram':
        return '11 AM - 2 PM, 5 PM - 7 PM'
      case 'facebook':
        return '1 PM - 3 PM, 7 PM - 9 PM'
      case 'twitter':
        return '9 AM - 10 AM, 7 PM - 9 PM'
      case 'linkedin':
        return '8 AM - 10 AM, 12 PM - 2 PM, 5 PM - 6 PM'
      default:
        return 'Peak audience hours'
    }
  }

  const generateQRCode = (content: string): string => {
    // Generate QR code using QR Server API
    const encodedContent = encodeURIComponent(content)
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedContent}`
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    alert('Content copied to clipboard!')
  }

  const downloadQRCode = (qrUrl: string, platform: string) => {
    const link = document.createElement('a')
    link.href = qrUrl
    link.download = `${platform}_QR_Code.png`
    link.click()
  }

  const generateNewContent = () => {
    if (userData) {
      generateContent(userData)
    }
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Content Generation Error</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>{error}</p>
          <Link href="/dashboard/create/photo" style={{
            display: 'inline-block',
            backgroundColor: BRAND_PURPLE,
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            Start Over
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb'
    }}>
      {/* Mobile-First 600px Container */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Header with Step Tracker */}
        <div style={{
          padding: '2rem 1rem',
          borderBottom: '1px solid #f3f4f6',
          textAlign: 'center'
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
                backgroundColor: '#10b981',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>{step}</div>
            ))}
          </div>

          {/* Header Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h1 style={{
              fontSize: 'clamp(1.5rem, 5vw, 2rem)',
              fontWeight: '700',
              color: '#111827',
              margin: '0'
            }}>
              Your Content & QR Codes
            </h1>
            
            <div style={{
              display: 'flex',
              gap: '0.75rem'
            }}>
              <button
                onClick={generateNewContent}
                style={{
                  backgroundColor: BRAND_ORANGE,
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                ↻ New
              </button>
              <Link href="/dashboard" style={{
                backgroundColor: '#6b7280',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}>
                Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: '1', padding: '1rem' }}>
          
          {/* Loading State */}
          {isGenerating && (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                border: `4px solid ${BRAND_PURPLE}`,
                borderTop: '4px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1.5rem'
              }}></div>
              <h2 style={{ 
                color: '#111827', 
                marginBottom: '1rem',
                fontSize: '1.25rem'
              }}>
                Creating Your Cultural Content
              </h2>
              <p style={{ 
                color: '#6b7280', 
                marginBottom: '1rem',
                lineHeight: '1.5'
              }}>
                Our AI is crafting personalised content that honours local culture and resonates with your target audience...
              </p>
              <div style={{
                backgroundColor: '#f0f9ff',
                padding: '1rem',
                borderRadius: '8px',
                borderLeft: `4px solid ${BRAND_BLUE}`,
                textAlign: 'left'
              }}>
                <p style={{ 
                  color: '#0369a1', 
                  fontWeight: '500',
                  margin: '0',
                  fontSize: '0.875rem'
                }}>
                  🧠 Cultural Intelligence: Ensuring content respects mātauranga Māori and local tikanga
                </p>
              </div>
            </div>
          )}

          {/* Generated Content Results */}
          {!isGenerating && generatedContent.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {generatedContent.map((item, index) => (
                <div key={index} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb'
                }}>
                  {/* Platform Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#111827',
                      margin: '0'
                    }}>
                      {item.platform}
                    </h3>
                    <div style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      Ready to Share
                    </div>
                  </div>

                  {/* Generated Content */}
                  <div style={{
                    backgroundColor: '#f9fafb',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}>
                    <p style={{
                      color: '#374151',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap',
                      margin: '0',
                      fontSize: '0.875rem'
                    }}>
                      {item.content}
                    </p>
                  </div>

                  {/* QR Code */}
                  <div style={{
                    textAlign: 'center',
                    marginBottom: '1rem'
                  }}>
                    <img 
                      src={item.qrCode} 
                      alt={`QR Code for ${item.platform}`}
                      style={{
                        width: '120px',
                        height: '120px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '0.5rem',
                      margin: '0.5rem 0 0 0'
                    }}>
                      Scan to share this content
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    <button
                      onClick={() => copyToClipboard(item.content)}
                      style={{
                        flex: 1,
                        backgroundColor: BRAND_PURPLE,
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      📋 Copy Content
                    </button>
                    <button
                      onClick={() => downloadQRCode(item.qrCode, item.platform)}
                      style={{
                        flex: 1,
                        backgroundColor: BRAND_ORANGE,
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      ⬇️ Download QR
                    </button>
                  </div>

                  {/* Platform Tips */}
                  <div style={{
                    backgroundColor: '#fef3c7',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}>
                    <h4 style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#92400e',
                      marginBottom: '0.5rem',
                      margin: '0 0 0.5rem 0'
                    }}>
                      💡 {item.platform} Tips:
                    </h4>
                    <ul style={{
                      fontSize: '0.75rem',
                      color: '#92400e',
                      paddingLeft: '1rem',
                      margin: '0',
                      lineHeight: '1.4'
                    }}>
                      {item.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} style={{ marginBottom: '0.25rem' }}>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Optimal Time */}
                  <div style={{
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    <strong>⏰ Best posting time:</strong> {item.optimalTime}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid #f3f4f6',
          textAlign: 'center'
        }}>
          <Link
            href="/dashboard/create/platforms"
            style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}
          >
            ← Back to Platform Selection
          </Link>
        </div>

        {/* Footer Logo */}
        <div style={{
          textAlign: 'center',
          padding: '1rem',
          borderTop: '1px solid #f3f4f6'
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div style={{
              color: BRAND_PURPLE,
              fontSize: '1rem',
              fontWeight: '900',
              display: 'inline'
            }}>click</div>
            <div style={{
              color: BRAND_ORANGE,
              fontSize: '1rem',
              fontWeight: '900',
              display: 'inline',
              marginLeft: '0.25rem'
            }}>speak</div>
            <div style={{
              color: BRAND_BLUE,
              fontSize: '1rem',
              fontWeight: '900',
              display: 'inline',
              marginLeft: '0.25rem'
            }}>send</div>
          </Link>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
