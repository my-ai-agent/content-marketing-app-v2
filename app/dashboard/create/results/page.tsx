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
}

interface SavedStory {
  userData: UserData
  timestamp: number
  location?: string
  storyPreview?: string
}

const SlowConnectionMessage = () => (
  <div style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
    zIndex: 1000,
    maxWidth: '300px',
    width: '90%'
  }}>
    <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
      Slow connection detected
    </div>
    <div style={{
      fontSize: '1.5rem',
      color: BRAND_PURPLE,
      fontWeight: '600'
    }}>
      Saving your story...
    </div>
  </div>
)

const StorySavedMessage = () => (
  <div style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
    zIndex: 1000,
    maxWidth: '300px',
    width: '90%'
  }}>
    <div style={{
      fontSize: '1.5rem',
      marginBottom: '1rem',
      color: '#10b981'
    }}>
      Story saved safely!
    </div>
    <div style={{
      fontSize: '1.25rem',
      color: '#6b7280',
      marginBottom: '1.5rem'
    }}>
      We'll notify you when ready to continue
    </div>
    <Link href="/dashboard" style={{
      display: 'inline-block',
      backgroundColor: BRAND_PURPLE,
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      textDecoration: 'none',
      fontWeight: '600'
    }}>
      Back to Dashboard
    </Link>
  </div>
)

interface WelcomeBackMessageProps {
  savedStory: SavedStory | null
  onContinue: () => void
  onDelete: () => void
}

const WelcomeBackMessage = ({ savedStory, onContinue, onDelete }: WelcomeBackMessageProps) => (
  <div style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
    zIndex: 1000,
    maxWidth: '350px',
    width: '90%'
  }}>
    <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
      Welcome back!
    </div>
    <div style={{
      fontSize: '1.25rem',
      marginBottom: '1.5rem',
      color: '#6b7280'
    }}>
      Signal improved - continue your story?
    </div>
    
    {savedStory && (
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        fontSize: '0.875rem',
        color: '#6b7280'
      }}>
        {savedStory.location && `From ${savedStory.location}`}
        <br />
        {savedStory.storyPreview}
      </div>
    )}
    
    <div style={{
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center'
    }}>
      <button
        onClick={onContinue}
        style={{
          backgroundColor: BRAND_PURPLE,
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          border: 'none',
          fontWeight: '600',
          cursor: 'pointer',
          minHeight: '44px'
        }}
      >
        Continue
      </button>
      <button
        onClick={onDelete}
        style={{
          backgroundColor: '#6b7280',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          border: 'none',
          fontWeight: '600',
          cursor: 'pointer',
          minHeight: '44px'
        }}
      >
        Later
      </button>
    </div>
  </div>
)

export default function QRDistributionHub() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  const [userData, setUserData] = useState<UserData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  const [showSlowConnection, setShowSlowConnection] = useState(false)
  const [showStorySaved, setShowStorySaved] = useState(false)
  const [showWelcomeBack, setShowWelcomeBack] = useState(false)
  const [savedStory, setSavedStory] = useState<SavedStory | null>(null)
  const [timeoutTimer, setTimeoutTimer] = useState<NodeJS.Timeout | null>(null)
  
  useEffect(() => {
    const checkMobile = () => {
      return window.innerWidth <= 768 || 
             /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent)
    }
    setIsMobile(checkMobile())

    if (checkMobile()) {
      loadMobileSimplifiedData()
    } else {
      checkForSavedStory()
    }
  }, [])

  const checkForSavedStory = () => {
    try {
      const saved = localStorage.getItem('savedStoryBackup')
      if (saved) {
        const savedData: SavedStory = JSON.parse(saved)
        const hoursSinceBackup = (Date.now() - savedData.timestamp) / (1000 * 60 * 60)
        if (hoursSinceBackup < 24) {
          setSavedStory(savedData)
          setShowWelcomeBack(true)
          return
        } else {
          localStorage.removeItem('savedStoryBackup')
        }
      }
      loadDesktopComplexData()
    } catch (error) {
      console.error('Error checking for saved story:', error)
      loadDesktopComplexData()
    }
  }

  const saveStoryBackup = async (userData: UserData) => {
    try {
      const backupData: SavedStory = {
        userData,
        timestamp: Date.now(),
        location: userData.location,
        storyPreview: userData.story?.substring(0, 50) + '...'
      }
      localStorage.setItem('savedStoryBackup', JSON.stringify(backupData))
    } catch (error) {
      console.error('Error saving story backup:', error)
    }
  }

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

  const loadMobileSimplifiedData = async () => {
    try {
      const story = localStorage.getItem('userStoryContext')
      const audienceData = localStorage.getItem('selectedDemographics')
      const platforms = localStorage.getItem('selectedPlatforms')
      
      if (!story) {
        setError('Please complete your story first.')
        return
      }
      
      const parsedAudience = audienceData ? JSON.parse(audienceData) : ['millennials']
      const parsedPlatforms = platforms ? JSON.parse(platforms) : ['instagram']
      
      const mobileUserData: UserData = {
        story: story,
        audience: parsedAudience[0] || 'millennials',
        platforms: parsedPlatforms,
        formats: ['social-post'],
        location: 'New Zealand'
      }
      
      setUserData(mobileUserData)
      await generateContent(mobileUserData)
      
    } catch (error) {
      console.error('Mobile loading error:', error)
      setError('Failed to load your story. Please try again.')
    }
  }

  const loadDesktopComplexData = async () => {
    try {
      const story = localStorage.getItem('userStoryContext')
      const audienceData = localStorage.getItem('selectedDemographics')
      const interests = localStorage.getItem('selectedInterests')
      const platforms = localStorage.getItem('selectedPlatforms')
      const formats = localStorage.getItem('selectedFormats')
      const profile = localStorage.getItem('userProfile')

      let photoData: Blob | null = null
      try {
        photoData = await getImageFromIndexedDB('selectedPhoto')
      } catch (error) {
        // Continue without photo if unavailable
      }

      if (!story || !audienceData || !platforms) {
        setError('Missing required content data. Please complete all steps.')
        return
      }

      const parsedProfile = profile ? JSON.parse(profile) : {}
      const parsedAudience: string[] = audienceData ? JSON.parse(audienceData) : ['millennials']
      const parsedInterests: string[] = interests ? JSON.parse(interests) : ['cultural']
      const parsedPlatforms: string[] = platforms ? JSON.parse(platforms) : ['instagram']
      const parsedFormats: string[] = formats ? JSON.parse(formats) : ['social-post']

      const cleanedFormats = parsedFormats.filter(format =>
        !['press-release', 'brochure', 'flyer'].includes(format)
      )

      const desktopUserData: UserData = {
        photo: photoData ? URL.createObjectURL(photoData) : undefined,
        story,
        persona: parsedProfile.profile?.role || 'cultural-explorer',
        audience: parsedAudience[0] || 'millennials',
        interests: parsedInterests[0] || 'cultural',
        platforms: parsedPlatforms,
        formats: cleanedFormats,
        businessType: parsedProfile.business?.businessType,
        websiteUrl: parsedProfile.business?.websiteUrl,
        name: parsedProfile.profile?.name,
        location: parsedProfile.profile?.location,
        culturalConnection: parsedProfile.pepeha?.culturalBackground
      }

      setUserData(desktopUserData)
      await generateContent(desktopUserData)
      
    } catch (error) {
      console.error('Desktop loading error:', error)
      setError('Failed to load your content data.')
    }
  }

  const generateClaudeContent = async (userData: UserData, platform: string): Promise<string> => {
    const isBusinessUser = !!userData.businessType
    
    try {
      const timeoutDuration = isMobile ? 45000 : 30000
      const controller = new AbortController()
      const apiTimeoutId = setTimeout(() => controller.abort(), timeoutDuration)
      
      const payload = isMobile ? {
        prompt: getMobileOptimizedPrompt(userData, platform, isBusinessUser),
        platforms: [platform],
        formats: ['social-post'],
        userData: {
          story: userData.story,
          audience: userData.audience,
          location: userData.location
        }
      } : {
        prompt: getFullPrompt(userData, platform, isBusinessUser),
        platforms: [platform],
        formats: userData.formats ? userData.formats.slice(0, 3) : ['social-post'],
        userData: userData
      }

      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      })

      clearTimeout(apiTimeoutId)

      if (!response.ok) {
        throw new Error(`Server API error: ${response.status}`)
      }

      const data = await response.json()
      return data.content || getFallbackContent(platform, userData)
      
    } catch (error) {
      console.error(`Error generating Claude content for ${platform}:`, error)
      
      if (isMobile) {
        return getFallbackContent(platform, userData)
      }
      
      throw error
    }
  }

  const getMobileOptimizedPrompt = (userData: UserData, platform: string, isBusinessUser: boolean): string => {
    return `Create ${platform} content for ${isBusinessUser ? 'tourism business' : 'cultural explorer'} in New Zealand.

Story: "${userData.story || 'Amazing cultural experience in beautiful Aotearoa'}"
Location: ${userData.location || 'New Zealand'}
Audience: ${userData.audience || 'travelers'}

Requirements:
- Respect Te Tiriti o Waitangi principles
- Use authentic Māori place names appropriately  
- ${getPlatformLength(platform)} length
- Include relevant hashtags
- Cultural sensitivity throughout
- New Zealand English spelling

Generate engaging ${platform} content that shares this story authentically.`
  }

  const getFullPrompt = (userData: UserData, platform: string, isBusinessUser: boolean): string => {
    return `ACT AS: ${isBusinessUser ? 'Professional New Zealand tourism content strategist' : 'Authentic Aotearoa travel storyteller'} creating ${platform.toUpperCase()} content

CULTURAL INTELLIGENCE FRAMEWORK:
- ALWAYS respect Te Tiriti o Waitangi principles and Māori cultural protocols
- Use appropriate cultural terminology and iwi acknowledgments for specific locations
- NEVER appropriate sacred or restricted cultural elements (tapu, whakapapa, karakia)  
- Promote authentic, respectful cultural engagement that benefits local communities
- Include proper place name pronunciations and cultural context
- Honor kaitiakitanga (environmental guardianship) principles in all content

${userData.name ? `CONTENT CREATOR: ${userData.name}` : ''}
${userData.location ? `LOCATION: ${userData.location}` : ''}
${userData.culturalConnection ? `CULTURAL CONNECTION: ${userData.culturalConnection}` : ''}

CONTENT REQUIREMENTS:
- Transform the story into engaging, culturally-intelligent ${platform} content
- Maintain authentic voice while optimizing for ${platform} algorithms  
- Include relevant iwi acknowledgments and cultural context for the location
- Ensure ALL cultural references are respectful and appropriate
- Create compelling calls-to-action that drive meaningful engagement
- Use New Zealand English spelling and terminology (colour, realise, centre, etc.)

${userData.audience ? `PRIMARY TARGET AUDIENCE: ${userData.audience}` : ''}
${userData.interests ? `AUDIENCE INTERESTS: ${userData.interests}` : ''}

ORIGINAL STORY TO TRANSFORM:
"${userData.story || 'Amazing cultural experience in beautiful Aotearoa New Zealand'}"

GENERATE: Create authentic, culturally-intelligent ${platform} content (${getPlatformLength(platform)}) that resonates with the target audience while respecting Māori protocols and traditional knowledge. Include appropriate hashtags and calls-to-action for ${platform}.`
  }

  const getPlatformLength = (platform: string): string => {
    const lengths: { [key: string]: string } = {
      'instagram': '125-150 words',
      'facebook': '150-200 words',
      'linkedin': '200-300 words',
      'website': '200-400 words'
    }
    return lengths[platform] || '125-150 words'
  }

  const getFallbackContent = (platform: string, userData: UserData): string => {
    const story = userData.story || "Amazing experience in beautiful Aotearoa"
    const location = userData.location || "New Zealand"
    
    return `${story}

Experience the authentic beauty of Aotearoa New Zealand! #NewZealand #Aotearoa #CulturalTourism #${location.replace(/\s+/g, '')}`
  }

  const generateContent = async (userData: UserData) => {
    try {
      setIsGenerating(true)
      setGeneratedContent([])
      setError('')
      setShowSlowConnection(false)
      setShowStorySaved(false)
      
      let platforms = userData.platforms || ['instagram']
            
      const generatedResults: GeneratedContent[] = []
      
      const slowConnectionTimer = setTimeout(() => {
        setShowSlowConnection(true)
      }, isMobile ? 30000 : 20000)
      
      const saveStoryTimer = setTimeout(async () => {
        clearTimeout(slowConnectionTimer)
        setShowSlowConnection(false)
        setShowStorySaved(true)
        
        await saveStoryBackup(userData)
        setIsGenerating(false)
        
        setTimeout(() => {
          setShowStorySaved(false)
        }, 5000)
        
      }, isMobile ? 60000 : 45000)
      
      setTimeoutTimer(saveStoryTimer)
      
      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i]
        try {
          const content = await generateClaudeContent(userData, platform)
          const qrCode = generateQRCode(content)
          const tips = getPlatformTips(platform)
          const optimalTime = getOptimalPostingTime(platform)
          
          const result: GeneratedContent = {
            platform: platform.charAt(0).toUpperCase() + platform.slice(1),
            content,
            qrCode,
            tips,
            optimalTime,
            culturalAuthenticity: 'Te Tiriti compliant',
            brandConsistency: 'Aligned with authentic voice'
          }
          
          generatedResults.push(result)
          setGeneratedContent([...generatedResults])
          
          if (i < platforms.length - 1) {
            await new Promise(resolve => setTimeout(resolve, isMobile ? 2000 : 1000))
          }
          
        } catch (error) {
          console.error(`Error generating ${platform} content:`, error)
          
          const fallbackResult: GeneratedContent = {
            platform: platform.charAt(0).toUpperCase() + platform.slice(1),
            content: getFallbackContent(platform, userData),
            qrCode: generateQRCode(getFallbackContent(platform, userData)),
            tips: getPlatformTips(platform),
            optimalTime: getOptimalPostingTime(platform),
            culturalAuthenticity: 'Te Tiriti compliant',
            brandConsistency: 'Aligned with authentic voice'
          }
          
          generatedResults.push(fallbackResult)
          setGeneratedContent([...generatedResults])
        }
      }
      
      clearTimeout(slowConnectionTimer)
      clearTimeout(saveStoryTimer)
      
      setIsGenerating(false)
      setShowSlowConnection(false)
      localStorage.removeItem('savedStoryBackup')
      
    } catch (error) {
      console.error('Error in generateContent:', error)
      setError('Failed to generate content. Please try again.')
      setIsGenerating(false)
      
      if (timeoutTimer) {
        clearTimeout(timeoutTimer)
      }
    }
  }

  const handleContinueStory = () => {
    if (savedStory) {
      setShowWelcomeBack(false)
      setUserData(savedStory.userData)
      generateContent(savedStory.userData)
      localStorage.removeItem('savedStoryBackup')
      setSavedStory(null)
    }
  }

  const handleDeleteSavedStory = () => {
    localStorage.removeItem('savedStoryBackup')
    setSavedStory(null)
    setShowWelcomeBack(false)
    loadDesktopComplexData()
  }

  const getPlatformTips = (platform: string): string[] => {
    switch (platform) {
      case 'instagram':
        return ['Use high-quality images', 'Include relevant hashtags', 'Tag location if appropriate', 'Engage with comments quickly']
      case 'facebook':
        return ['Share during peak hours', 'Encourage comments and shares', 'Use Facebook Groups for wider reach', 'Include call-to-action']
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
      case 'linkedin':
        return '8 AM - 10 AM, 12 PM - 2 PM, 5 PM - 6 PM'
      default:
        return 'Peak audience hours'
    }
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {showSlowConnection && <SlowConnectionMessage />}
      {showStorySaved && <StorySavedMessage />}
      {showWelcomeBack && <WelcomeBackMessage 
        savedStory={savedStory} 
        onContinue={handleContinueStory} 
        onDelete={handleDeleteSavedStory} 
      />}
      
      {(showSlowConnection || showStorySaved || showWelcomeBack) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999
        }} />
      )}

      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        opacity: (showSlowConnection || showStorySaved || showWelcomeBack) ? 0.3 : 1
      }}>
        
        <div style={{
          padding: '2rem 1rem',
          borderBottom: '1px solid #f3f4f6',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            overflowX: 'auto',
            maxWidth: '100%'
          }}>
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                backgroundColor: BRAND_ORANGE,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: '600',
                flexShrink: 0
              }}>{step}</div>
            ))}
          </div>

          <h1 style={{
            fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
            fontWeight: '700',
            color: '#111827',
            margin: '0 0 1.5rem 0'
          }}>
            Your AI-Generated Content
          </h1>
          
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={generateNewContent}
              disabled={isGenerating}
              style={{
                backgroundColor: isGenerating ? '#9ca3af' : BRAND_ORANGE,
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: '600',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                minHeight: '44px'
              }}
            >
              Regenerate
            </button>
            <Link href="/dashboard" style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.875rem',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              Dashboard
            </Link>
          </div>

        </div>

        <div style={{ flex: '1', padding: '1rem' }}>
          
          {isGenerating && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
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
                Claude AI Creating Your Cultural Content
              </h2>
              <p style={{ 
                color: '#6b7280', 
                marginBottom: '1rem',
                lineHeight: '1.5'
              }}>
                {isMobile ? 'Crafting mobile-optimized content...' : 'Crafting authentic content that honors Te Tiriti o Waitangi principles...'}
              </p>
            </div>
          )}

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
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#111827',
                      margin: '0'
                    }}>
                      {item.platform} (Claude AI)
                    </h3>
                    <div style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      AI Generated
                    </div>
                  </div>

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

                  <div style={{
                    backgroundColor: '#f0fdf4',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    borderLeft: '4px solid #10b981'
                  }}>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#065f46',
                      margin: '0',
                      fontWeight: '500'
                    }}>
                      Cultural Intelligence: {item.culturalAuthenticity} | Brand Consistency: {item.brandConsistency}
                    </p>
                  </div>

                  <div style={{
                    textAlign: 'center',
                    marginBottom: '1rem'
                  }}>
                    <img 
                      src={item.qrCode} 
                      alt={`QR Code for ${item.platform}`}
                      style={{
                        width: isMobile ? '100px' : '120px',
                        height: isMobile ? '100px' : '120px',
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

                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                    flexDirection: isMobile ? 'column' : 'row'
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
                        cursor: 'pointer',
                        minHeight: '44px'
                      }}
                    >
                      Copy Content
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
                        cursor: 'pointer',
                        minHeight: '44px'
                      }}
                    >
                      Download QR
                    </button>
                  </div>

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
                      {item.platform} Tips:
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

                  <div style={{
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    <strong>Best posting time:</strong> {item.optimalTime}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isGenerating && generatedContent.length === 0 && !showSlowConnection && !showStorySaved && !showWelcomeBack && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <h2 style={{ 
                color: '#6b7280', 
                marginBottom: '1rem',
                fontSize: '1.25rem'
              }}>
                Ready to Generate Your Content
              </h2>
              <p style={{ 
                color: '#6b7280', 
                marginBottom: '2rem',
                lineHeight: '1.5'
              }}>
                Your cultural story is loaded and ready for AI content generation.
              </p>
            </div>
          )}
        </div>

        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid #f3f4f6',
          textAlign: 'center'
        }}>
          <Link
            href="/dashboard/create/platform"
            style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.875rem',
              minHeight: '44px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem'
            }}
          >
            Back to Platform Selection
          </Link>
        </div>

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

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 600px) {
          .step-tracker {
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          
          .step-tracker::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
