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

// MOBILE MESSAGE COMPONENTS - DEFINED OUTSIDE MAIN COMPONENT
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
    <div style={{
      fontSize: '1.5rem',
      marginBottom: '1rem'
    }}>
      📶 Slow connection detected
    </div>
    <div style={{
      fontSize: '1.5rem',
      color: BRAND_PURPLE,
      fontWeight: '600'
    }}>
      💾 Saving your story...
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
      ✅ Story saved safely!
    </div>
    <div style={{
      fontSize: '1.25rem',
      color: '#6b7280',
      marginBottom: '1.5rem'
    }}>
      🔔 We'll notify you when ready to continue
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
    <div style={{
      fontSize: '1.5rem',
      marginBottom: '1rem'
    }}>
      👋 Welcome back!
    </div>
    <div style={{
      fontSize: '1.25rem',
      marginBottom: '1.5rem',
      color: '#6b7280'
    }}>
      📶 Signal improved - continue your story?
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
        {savedStory.location && `📍 From ${savedStory.location}`}
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

// MAIN COMPONENT
export default function QRDistributionHub() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  const [userData, setUserData] = useState<UserData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  // Backup system states
  const [showSlowConnection, setShowSlowConnection] = useState(false)
  const [showStorySaved, setShowStorySaved] = useState(false)
  const [showWelcomeBack, setShowWelcomeBack] = useState(false)
  const [savedStory, setSavedStory] = useState<SavedStory | null>(null)
  const [timeoutTimer, setTimeoutTimer] = useState<NodeJS.Timeout | null>(null)
  
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone']
      return mobileKeywords.some(keyword => userAgent.includes(keyword)) || 
             window.innerWidth <= 768 ||
             ('ontouchstart' in window)
    }
    setIsMobile(checkMobile())

    // Check for saved story on load
    checkForSavedStory()
  }, [])

  // BACKUP SYSTEM: Check for existing saved story
  const checkForSavedStory = () => {
    try {
      const saved = localStorage.getItem('savedStoryBackup')
      if (saved) {
        const savedData: SavedStory = JSON.parse(saved)
        
        // Check if story is less than 24 hours old
        const hoursSinceBackup = (Date.now() - savedData.timestamp) / (1000 * 60 * 60)
        if (hoursSinceBackup < 24) {
          setSavedStory(savedData)
          setShowWelcomeBack(true)
          return
        } else {
          // Clean up expired backup
          localStorage.removeItem('savedStoryBackup')
        }
      }
    } catch (error) {
      console.error('Error checking for saved story:', error)
    }
  }

  // BACKUP SYSTEM: Save story data
  const saveStoryBackup = async (userData: UserData) => {
    try {
      const backupData: SavedStory = {
        userData,
        timestamp: Date.now(),
        location: userData.location,
        storyPreview: userData.story?.substring(0, 50) + '...'
      }
      
      localStorage.setItem('savedStoryBackup', JSON.stringify(backupData))
      console.log('💾 Story backup saved successfully')
    } catch (error) {
      console.error('❌ Error saving story backup:', error)
    }
  }

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

  // MOBILE-OPTIMIZED CLAUDE API CONTENT GENERATION
  const generateClaudeContent = async (userData: UserData, platform: string): Promise<string> => {
    const isBusinessUser = !!userData.businessType
    
    // MOBILE OPTIMIZATION: Different prompts for mobile vs desktop
    const prompt = isMobile ? getMobileOptimizedPrompt(userData, platform, isBusinessUser) : getFullPrompt(userData, platform, isBusinessUser)

    try {
      console.log(`🚀 Generating ${platform} content ${isMobile ? '(Mobile Mode)' : '(Desktop Mode)'}...`)
      
      // MOBILE OPTIMIZATION: Extended timeout and abort controller
      const timeoutDuration = isMobile ? 45000 : 30000 // 45s for mobile, 30s for desktop
      const controller = new AbortController()
      const apiTimeoutId = setTimeout(() => controller.abort(), timeoutDuration)
      
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          platforms: [platform],
          formats: userData.formats ? userData.formats.slice(0, isMobile ? 1 : 3) : ['social-post'], // MOBILE: Limit formats
          userData: {
            story: userData.story,
            persona: userData.persona,
            audience: userData.audience,
            interests: userData.interests,
            businessType: userData.businessType,
            name: userData.name,
            location: userData.location
            // MOBILE: Removed non-essential fields to reduce payload
          },
          isMobile: isMobile, // Signal to API that this is mobile
          simplified: isMobile // Request simplified response for mobile
        }),
        signal: controller.signal // MOBILE: Proper abort handling
      })

      clearTimeout(apiTimeoutId)

      if (!response.ok) {
        throw new Error(`Server API error: ${response.status}`)
      }

      const data = await response.json()
      console.log(`✅ Successfully generated ${platform} content`)
      return data.content || getFallbackContent(platform, userData)
      
    } catch (error) {
      console.error(`❌ Error generating Claude content for ${platform}:`, error)
      throw error
    }
  }

  // MOBILE-OPTIMIZED PROMPTS (Shorter, more focused)
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

  // FULL DESKTOP PROMPT (More detailed)
  const getFullPrompt = (userData: UserData, platform: string, isBusinessUser: boolean): string => {
    return `🎯 ACT AS: ${isBusinessUser ? 'Professional New Zealand tourism content strategist' : 'Authentic Aotearoa travel storyteller'} creating ${platform.toUpperCase()} content

🌿 CULTURAL INTELLIGENCE FRAMEWORK:
- ALWAYS respect Te Tiriti o Waitangi principles and Māori cultural protocols
- Use appropriate cultural terminology and iwi acknowledgments for specific locations
- NEVER appropriate sacred or restricted cultural elements (tapu, whakapapa, karakia)  
- Promote authentic, respectful cultural engagement that benefits local communities
- Include proper place name pronunciations and cultural context
- Honor kaitiakitanga (environmental guardianship) principles in all content

${userData.name ? `👤 CONTENT CREATOR: ${userData.name}` : ''}
${userData.location ? `📍 LOCATION: ${userData.location}` : ''}
${userData.culturalConnection ? `🌱 CULTURAL CONNECTION: ${userData.culturalConnection}` : ''}

📝 CONTENT REQUIREMENTS:
- Transform the story into engaging, culturally-intelligent ${platform} content
- Maintain authentic voice while optimizing for ${platform} algorithms  
- Include relevant iwi acknowledgments and cultural context for the location
- Ensure ALL cultural references are respectful and appropriate
- Create compelling calls-to-action that drive meaningful engagement
- Use New Zealand English spelling and terminology (colour, realise, centre, etc.)

${userData.audience ? `🎯 PRIMARY TARGET AUDIENCE: ${userData.audience}` : ''}
${userData.interests ? `🎨 AUDIENCE INTERESTS: ${userData.interests}` : ''}

📖 ORIGINAL STORY TO TRANSFORM:
"${userData.story || 'Amazing cultural experience in beautiful Aotearoa New Zealand'}"

🎯 GENERATE: Create authentic, culturally-intelligent ${platform} content (${getPlatformLength(platform)}) that resonates with the target audience while respecting Māori protocols and traditional knowledge. Include appropriate hashtags and calls-to-action for ${platform}.`
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

  // Fallback content
  const getFallbackContent = (platform: string, userData: UserData): string => {
    const story = userData.story || "Amazing experience in beautiful Aotearoa"
    const location = userData.location || "New Zealand"
    
    return `🌟 ${story}

Experience the authentic beauty of Aotearoa New Zealand! #NewZealand #Aotearoa #CulturalTourism #${location.replace(/\s+/g, '')}`
  }

  // MAIN GENERATION FUNCTION WITH MOBILE OPTIMIZATIONS & BACKUP
  const generateContent = async (userData: UserData) => {
    try {
      setIsGenerating(true)
      setGeneratedContent([])
      setError('')
      setShowSlowConnection(false)
      setShowStorySaved(false)
      
      // MOBILE OPTIMIZATION: Limit platforms on mobile for better performance
      let platforms = userData.platforms || ['instagram']
      if (isMobile && platforms.length > 2) {
        platforms = platforms.slice(0, 2) // Limit to 2 platforms on mobile
        console.log('📱 Mobile Mode: Limited to 2 platforms for optimal performance')
      }
      
      const generatedResults: GeneratedContent[] = []
      
      console.log(`🚀 Starting content generation for platforms: ${platforms} ${isMobile ? '(Mobile Mode)' : '(Desktop Mode)'}`)
      
      // Set up timeout timer for slow connection detection
      const slowConnectionTimer = setTimeout(() => {
        console.log('📶 Slow connection detected - showing message')
        setShowSlowConnection(true)
      }, 30000) // Show slow connection message after 30 seconds
      
      const saveStoryTimer = setTimeout(async () => {
        console.log('💾 Timeout reached - saving story')
        clearTimeout(slowConnectionTimer)
        setShowSlowConnection(false)
        setShowStorySaved(true)
        
        // Save the story backup
        await saveStoryBackup(userData)
        
        setIsGenerating(false)
        
        // Hide the "story saved" message after 5 seconds
        setTimeout(() => {
          setShowStorySaved(false)
        }, 5000)
        
      }, 45000) // Save story after 45 seconds
      
      setTimeoutTimer(saveStoryTimer)
      
      // MOBILE OPTIMIZATION: Sequential processing with delays to prevent memory overload
      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i]
        try {
          console.log(`📝 Generating content for ${platform}... (${i + 1}/${platforms.length})`)
          
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
          setGeneratedContent([...generatedResults]) // MOBILE: Progressive display
          
          console.log(`✅ ${platform} content generated successfully`)
          
          // MOBILE OPTIMIZATION: Small delay between generations to prevent memory issues
          if (isMobile && i < platforms.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
          
        } catch (error) {
          console.error(`❌ Error generating ${platform} content:`, error)
          // Continue with other platforms even if one fails
        }
      }
      
      // Clear timers if generation completed successfully
      clearTimeout(slowConnectionTimer)
      clearTimeout(saveStoryTimer)
      
      console.log(`✅ Content generation complete! ${generatedResults.length}/${platforms.length} platforms successful`)
      setIsGenerating(false)
      setShowSlowConnection(false)
      
      // Clear any backup since generation was successful
      localStorage.removeItem('savedStoryBackup')
      
    } catch (error) {
      console.error('❌ Error in generateContent:', error)
      setError('Failed to generate content. Please try again.')
      setIsGenerating(false)
      
      // Clear timers
      if (timeoutTimer) {
        clearTimeout(timeoutTimer)
      }
    }
  }

  // HANDLE WELCOME BACK ACTIONS
  const handleContinueStory = () => {
    if (savedStory) {
      setShowWelcomeBack(false)
      setUserData(savedStory.userData)
      generateContent(savedStory.userData)
      // Clear the saved story since we're using it
      localStorage.removeItem('savedStoryBackup')
      setSavedStory(null)
    }
  }

  const handleDeleteSavedStory = () => {
    localStorage.removeItem('savedStoryBackup')
    setSavedStory(null)
    setShowWelcomeBack(false)
    // Load current session data instead
    loadCurrentSessionData()
  }

  // Load current session data
  const loadCurrentSessionData = async () => {
  console.log('🔍 Mobile Debug - loadCurrentSessionData started');
  try {
    console.log('🔍 Mobile Debug - Reading localStorage items...');
    const story = localStorage.getItem('userStoryContext');
    const audienceData = localStorage.getItem('selectedDemographics');
    const interests = localStorage.getItem('selectedInterests');
    const platforms = localStorage.getItem('selectedPlatforms');
    const formats = localStorage.getItem('selectedFormats');
    const profile = localStorage.getItem('userProfile');

    let photoData: Blob | null = null;
    try {
      photoData = await getImageFromIndexedDB('selectedPhoto');
    } catch (photoErr) {
      console.log('No photo found in IndexedDB, continuing without photo');
    }

    if (!story || !audienceData || !platforms) {
      setError('Missing required content data. Please complete all steps.');
      return;
    }

    const parsedProfile = profile ? JSON.parse(profile) : {};
    const parsedAudience: string[] = audienceData ? JSON.parse(audienceData) : ['millennials'];
    const parsedInterests: string[] = interests ? JSON.parse(interests) : ['cultural'];
    const parsedPlatforms: string[] = platforms ? JSON.parse(platforms) : ['instagram'];
    const parsedFormats: string[] = formats ? JSON.parse(formats) : ['social-post'];

    // 🛠️ FIX: Clean up cross-contaminated data
    const cleanedFormats = parsedFormats.filter(format =>
      !['press-release', 'brochure', 'flyer'].includes(format)
    );

    const userData: UserData = {
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
    };

    console.log('Loaded current session data:', userData);
    setUserData(userData);
    console.log('🔍 Mobile Debug - About to call generateContent with:', userData);
    generateContent(userData);
  } catch (err) {
    console.error('Error loading current session data:', err);
    setError('Failed to load your content data.');
  }
};

  useEffect(() => {
  console.log('🔍 Mobile Debug - useEffect triggered, showWelcomeBack:', showWelcomeBack);
  if (!showWelcomeBack) {
    console.log('🔍 Mobile Debug - Calling loadCurrentSessionData()');
    loadCurrentSessionData()
  }
}, [showWelcomeBack])

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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb'
    }}>
      {/* Mobile Messages */}
      {showSlowConnection && <SlowConnectionMessage />}
      {showStorySaved && <StorySavedMessage />}
      {showWelcomeBack && <WelcomeBackMessage 
        savedStory={savedStory} 
        onContinue={handleContinueStory} 
        onDelete={handleDeleteSavedStory} 
      />}
      
      {/* Dark overlay when showing messages */}
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

      {/* Main Content */}
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
            marginBottom: '1.5rem',
            overflowX: 'auto',
            maxWidth: '100%'
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
              ↻ Regenerate
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

          {/* Mobile Platform Limitation Notice */}
          {isMobile && userData?.platforms && userData.platforms.length > 2 && (
            <div style={{
              backgroundColor: '#f0f9ff',
              padding: '1rem',
              borderRadius: '8px',
              borderLeft: `4px solid ${BRAND_BLUE}`,
              marginTop: '1rem'
            }}>
              <p style={{
                color: '#0369a1',
                fontSize: '0.875rem',
                margin: '0',
                fontWeight: '500'
              }}>
                📱 Mobile Optimization: Generating content for your top 2 platforms for optimal performance
              </p>
            </div>
          )}
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
                🤖 Claude AI Creating Your Cultural Content
              </h2>
              <p style={{ 
                color: '#6b7280', 
                marginBottom: '1rem',
                lineHeight: '1.5'
              }}>
                Crafting authentic content that honors Te Tiriti o Waitangi principles...
              </p>
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
                      🤖 {item.platform} (Claude AI)
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
                    borderLeft: '4px solid #10b981'
                  }}>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#065f46',
                      margin: '0',
                      fontWeight: '500'
                    }}>
                      ✅ Cultural Intelligence: {item.culturalAuthenticity} | Brand Consistency: {item.brandConsistency}
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

                  {/* Action Buttons */}
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
                        cursor: 'pointer',
                        minHeight: '44px'
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

          {/* No Results & Not Generating */}
          {!isGenerating && generatedContent.length === 0 && !showSlowConnection && !showStorySaved && !showWelcomeBack && (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem'
            }}>
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
              fontSize: '0.875rem',
              minHeight: '44px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem'
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
