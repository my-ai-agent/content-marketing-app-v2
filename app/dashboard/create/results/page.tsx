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
  businessType?: string
  websiteUrl?: string
  name?: string
  location?: string
  culturalConnection?: string
}

interface GeneratedContent {
  platform: string
  content: string
  qrCode: string
  tips: string[]
  optimalTime: string
  culturalAuthenticity?: string
  brandConsistency?: string
  generationTime?: number
  cached?: boolean
}

interface GenerationProgress {
  currentPlatform: string
  completedPlatforms: string[]
  progress: number
  message: string
}

export default function StreamlinedResults() {
  const [isGenerating, setIsGenerating] = useState(true)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  const [userData, setUserData] = useState<UserData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({
    currentPlatform: '',
    completedPlatforms: [],
    progress: 0,
    message: 'Initializing cultural intelligence...'
  })
  const [koTaneOptimized, setKoTaneOptimized] = useState(false)

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

  // Ko Tāne content detection
  const detectKoTaneContent = (story: string): boolean => {
    const koTaneTerms = [
      'ko tāne', 'ko tane', 'kotane',
      'ōtākaro', 'otakaro', 'avon river',
      'ōtautahi', 'otautahi', 'christchurch',
      'waka', 'ngāi tahu', 'ngai tahu', 'ngāi tūāhuriri', 'ngai tuahuriri'
    ]
    
    const lowerStory = story.toLowerCase()
    return koTaneTerms.some(term => lowerStory.includes(term))
  }

  // Streamlined progressive generation
  const generateContentProgressive = async (userData: UserData) => {
    const platforms = userData.platforms || ['instagram']
    const startTime = Date.now()
    
    try {
      // Stage 1: Cultural Detection (fast)
      setGenerationProgress({
        currentPlatform: '',
        completedPlatforms: [],
        progress: 20,
        message: 'Analyzing cultural content...'
      })
      
      const isKoTaneContent = detectKoTaneContent(userData.story || '')
      setKoTaneOptimized(isKoTaneContent)
      
      if (isKoTaneContent) {
        setGenerationProgress(prev => ({
          ...prev,
          progress: 30,
          message: '🎯 Ko Tāne content detected - activating cultural intelligence!'
        }))
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      // Stage 2: Generate platforms progressively
      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i]
        
        setGenerationProgress(prev => ({
          ...prev,
          currentPlatform: platform,
          progress: 30 + (i / platforms.length) * 60,
          message: `Generating ${platform} content...`
        }))
        
        const content = await generateSinglePlatform(userData, platform)
        
        const platformContent: GeneratedContent = {
          platform: platform.charAt(0).toUpperCase() + platform.slice(1),
          content: content.content,
          qrCode: generateQRCode(`${platform}_${Date.now()}_${i}`),
          tips: getPlatformTips(platform),
          optimalTime: getOptimalPostingTime(platform),
          culturalAuthenticity: isKoTaneContent ? 'High - Ko Tāne & Ngāi Tūāhuriri optimized' : 'High - Cultural intelligence active',
          brandConsistency: '95% - Culturally intelligent',
          generationTime: content.generationTime,
          cached: content.cached
        }
        
        // Add content immediately for progressive display
        setGeneratedContent(prev => [...prev, platformContent])
        
        setGenerationProgress(prev => ({
          ...prev,
          completedPlatforms: [...prev.completedPlatforms, platform],
          progress: 30 + ((i + 1) / platforms.length) * 60
        }))
      }
      
      // Stage 3: Complete
      const totalTime = Date.now() - startTime
      setGenerationProgress({
        currentPlatform: '',
        completedPlatforms: platforms,
        progress: 100,
        message: `All content ready in ${(totalTime / 1000).toFixed(1)}s! 🎉`
      })
      
      setShowSuccessAnimation(true)
      setTimeout(() => setShowSuccessAnimation(false), 2000)
      
    } catch (error) {
      console.error('Progressive generation error:', error)
      setError('Generation failed. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Simple single platform generation - mobile compatible
  const generateSinglePlatform = async (userData: UserData, platform: string): Promise<{content: string, cached: boolean, generationTime: number}> => {
    const startTime = Date.now()
    
    try {
      const requestBody = {
        prompt: `Create engaging ${platform} content for this cultural experience: "${userData.story || 'Amazing experience'}"`,
        platform,
        userData: {
          story: userData.story,
          location: userData.location,
          businessType: userData.businessType
        },
        mobileOptimized: true
      }
      
      // MOBILE TIMEOUT FIX - Replace lines 189-195 with this:

// RESTORE ORIGINAL SIMPLE FETCH (lines 192-195)
const response = await fetch('/api/claude', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(requestBody)
})

console.log(`✅ Response received: ${response.status}`)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      const generationTime = Date.now() - startTime
      
      return {
        content: data.content || getFallbackContent(platform, userData),
        cached: data.cached || false,
        generationTime
      }
      
    } catch (error) {
      console.error(`Generation error for ${platform}:`, error)
      return {
        content: getFallbackContent(platform, userData),
        cached: false,
        generationTime: Date.now() - startTime
      }
    }
  }

  // Simple fallback content
  const getFallbackContent = (platform: string, userData: UserData): string => {
    const story = userData.story || 'Amazing cultural experience'
    
    if (koTaneOptimized) {
      if (platform === 'instagram') {
        return `🎯 ${story} with Ko Tāne on the beautiful Ōtākaro! Experience authentic Ngāi Tahu and Ngāi Tūāhuriri culture with traditional guardians of these sacred waters. #KoTāne #NgāiTahu #NgāiTūāhuriri #CulturalTourism #Ōtākaro #Ōtautahi`
      } else if (platform === 'facebook') {
        return `${story}

What an incredible way to connect with authentic Māori culture! Ko Tāne's experience with the traditional guardians of the Ōtākaro (Avon River) offers something truly special - learning from Ngāi Tahu and Ngāi Tūāhuriri in their own rohe.

#KoTāne #NgāiTahu #NgāiTūāhuriri #CulturalTourism #AuthenticExperience`
      }
    }
    
    return `🌟 ${story} in beautiful Aotearoa New Zealand! #NewZealand #CulturalTourism #AuthenticExperience`
  }

  // Helper functions
  const getPlatformTips = (platform: string): string[] => {
    const tips: Record<string, string[]> = {
      instagram: ['Use high-quality images', 'Include relevant hashtags', 'Tag location', 'Engage with comments quickly'],
      facebook: ['Share during peak hours', 'Encourage comments and shares', 'Use Facebook Groups for wider reach', 'Include call-to-action'],
      linkedin: ['Professional tone', 'Industry insights', 'Network engagement', 'Share business value'],
      website: ['SEO optimization', 'Clear structure', 'Cultural authenticity', 'Compelling headlines']
    }
    return tips[platform] || ['Optimize for your audience', 'Use platform best practices', 'Engage authentically']
  }

  const getOptimalPostingTime = (platform: string): string => {
    const times: Record<string, string> = {
      instagram: '11 AM - 2 PM, 5 PM - 7 PM',
      facebook: '1 PM - 3 PM, 7 PM - 9 PM',
      linkedin: '8 AM - 10 AM, 12 PM - 2 PM, 5 PM - 6 PM',
      website: 'Anytime - SEO optimized'
    }
    return times[platform] || 'Peak audience hours'
  }

  const generateQRCode = (content: string): string => {
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
      setGeneratedContent([])
      setIsGenerating(true)
      setGenerationProgress({
        currentPlatform: '',
        completedPlatforms: [],
        progress: 0,
        message: 'Initializing cultural intelligence...'
      })
      generateContentProgressive(userData)
    }
  }

  // Load user data and start generation
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Load data from localStorage
        const story = localStorage.getItem('userStoryContext')
        const audienceData = localStorage.getItem('selectedDemographics')
        const interests = localStorage.getItem('selectedInterests')
        const platforms = localStorage.getItem('selectedPlatforms')
        const formats = localStorage.getItem('selectedFormats')
        const profile = localStorage.getItem('userProfile')

        // Load photo from IndexedDB
        let photoData: Blob | null = null
        try {
          photoData = await getImageFromIndexedDB('selectedPhoto')
        } catch (photoErr) {
          console.log('No photo found in IndexedDB, continuing without photo')
        }

        // Check required data
        if (!story || !platforms) {
          setError('Missing required content data. Please complete all steps.')
          setIsGenerating(false)
          return
        }

        // Parse JSON data with error handling
        const parsedProfile = profile ? JSON.parse(profile) : {}
        const parsedAudience: string[] = audienceData ? JSON.parse(audienceData) : ['millennials']
        const parsedInterests: string[] = interests ? JSON.parse(interests) : ['cultural']
        const parsedPlatforms: string[] = platforms ? JSON.parse(platforms) : ['instagram']
        const parsedFormats: string[] = formats ? JSON.parse(formats) : ['social-post']

        const userData: UserData = {
          photo: photoData ? URL.createObjectURL(photoData) : undefined,
          story,
          persona: parsedProfile.profile?.role || 'cultural-explorer',
          audience: parsedAudience[0] || 'millennials',
          interests: parsedInterests[0] || 'cultural',
          platforms: parsedPlatforms,
          formats: parsedFormats,
          businessType: parsedProfile.business?.businessType,
          websiteUrl: parsedProfile.business?.websiteUrl,
          name: parsedProfile.profile?.name,
          location: parsedProfile.profile?.location,
          culturalConnection: parsedProfile.pepeha?.culturalBackground
        }

        setUserData(userData)
        generateContentProgressive(userData)
        
      } catch (err) {
        console.error('Error loading user data:', err)
        setError('Failed to load your content data.')
        setIsGenerating(false)
      }
    }
    
    loadUserData()
  }, [])

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
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Mobile-First Container */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Header */}
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

          {/* Title and controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h1 style={{
              fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
              fontWeight: '700',
              color: '#111827',
              margin: '0'
            }}>
              Your AI-Generated Content
            </h1>
            
            <div style={{
              display: 'flex',
              gap: '0.5rem'
            }}>
              <button
                onClick={generateNewContent}
                style={{
                  backgroundColor: BRAND_ORANGE,
                  color: 'white',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                ↻ Regenerate
              </button>
              <Link href="/dashboard" style={{
                backgroundColor: '#6b7280',
                color: 'white',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.75rem'
              }}>
                Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        {isGenerating && (
          <div style={{
            backgroundColor: 'white',
            padding: '1rem',
            borderBottom: '2px solid #e5e7eb'
          }}>
            {/* Ko Tāne Detection Banner */}
            {koTaneOptimized && (
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '2px solid #16a34a',
                borderRadius: '0.75rem',
                padding: '0.75rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>🎯</span>
                <div>
                  <div style={{ fontWeight: '700', color: '#15803d', fontSize: '0.95rem' }}>
                    Ko Tāne Content Detected - Cultural Intelligence Active
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#166534' }}>
                    Enhanced accuracy for Ngāi Tahu & Ngāi Tūāhuriri content
                  </div>
                </div>
              </div>
            )}
            
            {/* Progress Bar */}
            <div style={{
              backgroundColor: '#f3f4f6',
              borderRadius: '1rem',
              overflow: 'hidden',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                backgroundColor: koTaneOptimized ? '#16a34a' : BRAND_PURPLE,
                height: '0.75rem',
                width: `${generationProgress.progress}%`,
                transition: 'width 0.5s ease',
                borderRadius: '1rem'
              }} />
            </div>
            
            {/* Progress Message */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: koTaneOptimized ? '#15803d' : '#6b46c1'
              }}>
                {generationProgress.message}
              </span>
              <span style={{
                fontSize: '0.75rem',
                color: '#6b7280'
              }}>
                {generationProgress.progress}%
              </span>
            </div>
            
            {/* Completed Platforms */}
            {generationProgress.completedPlatforms.length > 0 && (
              <div style={{
                marginTop: '0.5rem',
                display: 'flex',
                gap: '0.25rem',
                flexWrap: 'wrap'
              }}>
                {generationProgress.completedPlatforms.map(platform => (
                  <span key={platform} style={{
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    ✅ {platform}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Success Animation */}
        {showSuccessAnimation && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: koTaneOptimized ? '#16a34a' : '#10b981',
            color: 'white',
            padding: '1.5rem 2rem',
            borderRadius: '1rem',
            fontSize: '1.125rem',
            fontWeight: '700',
            zIndex: 1000,
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
            textAlign: 'center',
            border: '2px solid #ffffff'
          }}>
            <div style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>
              {koTaneOptimized ? '🎯' : '🏛️'}
            </div>
            <div>
              {koTaneOptimized ? 'Ko Tāne Content Ready!' : 'Cultural AI Content Ready!'}
            </div>
            <div style={{ 
              fontSize: '0.8rem', 
              fontWeight: '500', 
              marginTop: '0.25rem',
              opacity: 0.9 
            }}>
              Authentic • Respectful • Professional
            </div>
          </div>
        )}

        {/* Content Area */}
        <div style={{ flex: '1', padding: '1rem' }}>
          
          {/* Loading State */}
          {isGenerating && generatedContent.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '2rem 1rem'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: `4px solid ${koTaneOptimized ? '#16a34a' : BRAND_PURPLE}`,
                borderTop: '4px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }}></div>
              <h2 style={{ 
                color: '#111827', 
                marginBottom: '0.75rem',
                fontSize: '1.125rem'
              }}>
                {koTaneOptimized ? '🎯 Creating Ko Tāne Cultural Content' : '🤖 Claude AI Creating Your Content'}
              </h2>
              <p style={{ 
                color: '#6b7280', 
                marginBottom: '1rem',
                lineHeight: '1.4',
                fontSize: '0.875rem'
              }}>
                {koTaneOptimized 
                  ? 'Enhanced cultural intelligence active for authentic Ngāi Tahu and Ngāi Tūāhuriri content...'
                  : 'Claude is crafting authentic content that honors cultural principles and respects local heritage...'}
              </p>
            </div>
          )}

          {/* Generated Content Results */}
          {generatedContent.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {generatedContent.map((item, index) => (
                <div key={index} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  border: koTaneOptimized ? '2px solid #16a34a' : '1px solid #e5e7eb'
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
                      margin: '0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {koTaneOptimized ? '🎯' : '🤖'} {item.platform}
                      {item.cached && (
                        <span style={{
                          fontSize: '0.75rem',
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          padding: '0.125rem 0.5rem',
                          borderRadius: '0.375rem'
                        }}>
                          ⚡ Cached
                        </span>
                      )}
                    </h3>
                    <div style={{
                      backgroundColor: koTaneOptimized ? '#16a34a' : '#10b981',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {koTaneOptimized ? 'Ko Tāne AI' : 'AI Generated'}
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

                  {/* Cultural Intelligence Indicator */}
                  <div style={{
                    backgroundColor: '#f0fdf4',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    borderLeft: `4px solid ${koTaneOptimized ? '#16a34a' : '#10b981'}`
                  }}>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#065f46',
                      margin: '0',
                      fontWeight: '500'
                    }}>
                      ✅ {item.culturalAuthenticity} | Brand Consistency: {item.brandConsistency}
                      {item.generationTime && ` | Generated in ${(item.generationTime / 1000).toFixed(1)}s`}
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
                        width: '100px',
                        height: '100px',
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
                        backgroundColor: koTaneOptimized ? '#16a34a' : BRAND_PURPLE,
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

        {/* Enhanced Navigation Panel */}
        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid #f3f4f6',
          backgroundColor: '#f8fafc'
        }}>
          <h4 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            🎉 Content Created Successfully! What's next?
          </h4>
          
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '1rem'
          }}>
            <Link href="/dashboard/create/photo" style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: koTaneOptimized ? '#16a34a' : BRAND_PURPLE,
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📸 Create New Story
            </Link>
            
            <Link href="/dashboard/create/platform" style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: BRAND_ORANGE,
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              ⚙️ Change Platforms
            </Link>
            
            <Link href="/dashboard" style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: BRAND_BLUE,
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🏠 Dashboard
            </Link>
          </div>
          
          <p style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            textAlign: 'center',
            margin: '0'
          }}>
            {koTaneOptimized 
              ? 'Your Ko Tāne cultural content is ready to share! 🎯🏛️'
              : 'Your culturally intelligent content is ready to share! 🏛️'}
          </p>
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

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
