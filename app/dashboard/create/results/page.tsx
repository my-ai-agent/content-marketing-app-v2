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

export default function QRDistributionHub() {
  const [isGenerating, setIsGenerating] = useState(true)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  const [userData, setUserData] = useState<UserData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

useEffect(() => {
  const checkMobile = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone']
    return mobileKeywords.some(keyword => userAgent.includes(keyword)) || 
           window.innerWidth <= 768 ||
           ('ontouchstart' in window)
  }
  setIsMobile(checkMobile())
}, [])

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

  // IMPROVED CLAUDE API CONTENT GENERATION - SERVER-SIDE
  const generateClaudeContent = async (userData: UserData, platform: string): Promise<string> => {
    const isBusinessUser = !!userData.businessType
    
    // Generate culturally-intelligent prompt
    const prompt = `🎯 ACT AS: ${isBusinessUser ? 'Professional New Zealand tourism content strategist' : 'Authentic Aotearoa travel storyteller'} creating ${platform.toUpperCase()} content

🌿 CULTURAL INTELLIGENCE FRAMEWORK:
- ALWAYS respect Te Tiriti o Waitangi principles and Māori cultural protocols
- Use appropriate cultural terminology and iwi acknowledgments for specific locations
- NEVER appropriate sacred or restricted cultural elements (tapu, whakapapa, karakia)  
- Promote authentic, respectful cultural engagement that benefits local communities
- Include proper place name pronunciations and cultural context
- Honor kaitiakitanga (environmental guardianship) principles in all content

${userData.name ? `👤 CONTENT CREATOR: ${userData.name}` : ''}
${userData.location ? `📍 LOCATION: ${userData.location} ${getLocationContext(userData.location)}` : ''}
${userData.culturalConnection ? `🌱 CULTURAL CONNECTION: ${userData.culturalConnection}` : ''}

${isBusinessUser && userData.businessType ? getBusinessContext(userData.businessType) : getPersonalContext(userData.persona || 'cultural-explorer')}

📱 ${platform.toUpperCase()} PLATFORM OPTIMIZATION:
${getPlatformOptimization(platform)}

📝 CONTENT REQUIREMENTS:
- Transform the story into engaging, culturally-intelligent ${platform} content
- Maintain authentic voice while optimizing for ${platform} algorithms  
- Include relevant iwi acknowledgments and cultural context for the location
- Ensure ALL cultural references are respectful and appropriate
- Create compelling calls-to-action that drive meaningful engagement
- Use New Zealand English spelling and terminology (colour, realise, centre, etc.)
- Include specific location details with proper Māori place names where appropriate

${userData.audience ? `🎯 PRIMARY TARGET AUDIENCE: ${userData.audience}` : ''}
${userData.interests ? `🎨 AUDIENCE INTERESTS: ${userData.interests}` : ''}

📖 ORIGINAL STORY TO TRANSFORM:
"${userData.story || 'Amazing cultural experience in beautiful Aotearoa New Zealand'}"

${userData.photo ? '📸 VISUAL CONTEXT: Photo(s) provided showing the experience/location - use visual elements to enhance storytelling' : ''}

🎯 GENERATE: Create authentic, culturally-intelligent ${platform} content (${getPlatformLength(platform)}) that resonates with the target audience while respecting Māori protocols and traditional knowledge. Include appropriate hashtags and calls-to-action for ${platform}.`

    try {
      console.log(`🚀 Generating ${platform} content with server-side Claude API...`)
      
      // Call our server-side API endpoint instead of direct Claude API
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          platforms: [platform],
          formats: userData.formats || ['social-post'],
          userData: {
            story: userData.story,
            persona: userData.persona,
            audience: userData.audience,
            interests: userData.interests,
            businessType: userData.businessType,
            name: userData.name,
            location: userData.location
          }
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Server API error: ${response.status} - ${errorText}`)
        throw new Error(`Server API error: ${response.status}`)
      }

      const data = await response.json()
      console.log(`✅ Successfully generated ${platform} content`)
      return data.content || getImprovedFallbackContent(platform, userData)
      
    } catch (error) {
      console.error(`❌ Error generating Claude content for ${platform}:`, error)
      return getImprovedFallbackContent(platform, userData)
    }
  }

  // Helper functions for prompt generation
  const getLocationContext = (location: string): string => {
    const locationLower = location.toLowerCase()
    
    if (locationLower.includes('auckland') || locationLower.includes('tāmaki makaurau')) {
      return '(Tāmaki Makaurau - land of many lovers, traditional home of Ngāti Whātua)'
    } else if (locationLower.includes('wellington') || locationLower.includes('te whanganui-a-tara')) {
      return '(Te Whanganui-a-Tara - the great harbour of Tara, traditional home of Taranaki Whānui)'
    } else if (locationLower.includes('christchurch') || locationLower.includes('ōtautahi')) {
      return '(Ōtautahi - place of Tautahi, traditional home of Ngāi Tahu)'
    } else if (locationLower.includes('rotorua')) {
      return '(Traditional home of Te Arawa iwi, center of Māori culture and geothermal wonders)'
    } else if (locationLower.includes('queenstown') || locationLower.includes('tāhuna')) {
      return '(Tāhuna - shallow bay, traditional area of Ngāi Tahu in Central Otago)'
    }
    
    return ''
  }

  const getBusinessContext = (businessType: string): string => {
    const businessContexts: { [key: string]: string } = {
      'visitor-attraction': `🏢 BUSINESS CONTEXT:
- Business Type: Visitor Attraction
- Industry Focus: unique cultural experiences and visitor journey
- Core Expertise: cultural storytelling and heritage preservation
- Audience Value Proposition: authentic cultural immersion and learning
- Cultural Responsibility: respectful representation of indigenous stories and protocols`,
      'accommodation': `🏢 BUSINESS CONTEXT:
- Business Type: Accommodation
- Industry Focus: hospitality excellence and guest experience
- Core Expertise: comfort, service quality, and local connections
- Audience Value Proposition: memorable stays and local insider knowledge
- Cultural Responsibility: incorporation of local cultural elements and Māori hospitality principles`,
      'food-beverage': `🏢 BUSINESS CONTEXT:
- Business Type: Food & Beverage
- Industry Focus: culinary journey and local flavors
- Core Expertise: food quality, local sourcing, and cultural cuisine
- Audience Value Proposition: authentic taste experiences and cultural food stories
- Cultural Responsibility: respect for traditional recipes and indigenous food practices`
    }
    
    return businessContexts[businessType] || `🏢 BUSINESS CONTEXT: Professional ${businessType.replace('-', ' ')} service provider`
  }

  const getPersonalContext = (persona: string): string => {
    const personalContexts: { [key: string]: string } = {
      'cultural-explorer': `🎭 PERSONAL CONTEXT:
- Creator Voice: curious and respectful cultural learner
- Content Focus: deep cultural connections and meaningful experiences
- Storytelling Style: thoughtful reflection and cultural appreciation`,
      'adventure-seeker': `🎭 PERSONAL CONTEXT:
- Creator Voice: enthusiastic and bold experience sharer
- Content Focus: exciting discoveries and personal challenges
- Storytelling Style: energetic storytelling with inspirational calls to action`,
      'content-creator': `🎭 PERSONAL CONTEXT:
- Creator Voice: creative and engaging digital storyteller
- Content Focus: visual narratives and shareable moments
- Storytelling Style: platform-optimized content with strong visual elements`
    }
    
    return personalContexts[persona] || personalContexts['cultural-explorer']
  }

  const getPlatformOptimization = (platform: string): string => {
    const optimizations: { [key: string]: string } = {
      'instagram': `- Content Style: visual-first storytelling with engaging captions
- Target Length: 125-150 words
- Communication Tone: authentic and inspiring
- Hashtag Strategy: 8-12 relevant hashtags
- Call to Action: encourage engagement and shares`,
      'facebook': `- Content Style: community-focused narrative with personal connection
- Target Length: 150-200 words
- Communication Tone: conversational and relatable
- Engagement Approach: encourage comments and discussion
- Call to Action: drive meaningful interactions`,
      'linkedin': `- Content Style: professional storytelling with industry insights
- Target Length: 200-300 words
- Communication Tone: authoritative yet personable
- Value Proposition: provide business value and networking opportunities
- Call to Action: encourage professional connections`,
      'website': `- Content Style: SEO-optimized informative content
- Target Length: 200-400 words
- Communication Tone: professional and trustworthy
- Value Proposition: provide comprehensive information and clear value proposition
- Call to Action: drive conversions and inquiries`
    }
    
    return optimizations[platform] || optimizations['instagram']
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

  // IMPROVED FALLBACK CONTENT - Uses actual user story
  const getImprovedFallbackContent = (platform: string, userData: UserData): string => {
    const isBusinessUser = !!userData.businessType
    const userStory = userData.story || "Amazing experience in beautiful Aotearoa"
    const location = userData.location || "New Zealand"
    
    if (platform === 'instagram') {
      return `🌟 ${userStory}

${isBusinessUser ? 
        'Experience authentic New Zealand culture with us - where every moment honors our rich heritage and stunning landscapes! 🏔️' : 
        'What an incredible journey through Aotearoa! Every step revealed new wonders and cultural insights. 🥾✨'
      }

#NewZealand #Aotearoa #CulturalTourism #AuthenticExperience #Manaakitanga #${location.replace(/\s+/g, '')}`
    } else if (platform === 'facebook') {
      return `${userStory}

This experience really opened my eyes to the incredible depth of New Zealand's cultural heritage and natural beauty. ${isBusinessUser ? 
        'We feel privileged to share these authentic moments with visitors from around the world, always ensuring we honor the cultural significance of this special place.' : 
        'I can\'t recommend this enough for anyone wanting to truly connect with local culture and understand the stories that make Aotearoa so special!'
      }

The manaakitanga (hospitality) shown by local people made this experience unforgettable. 💙`
    } else if (platform === 'linkedin') {
      return `Professional insight: ${userStory}

The sustainable tourism industry in New Zealand continues to demonstrate how authentic cultural experiences can create meaningful economic opportunities while preserving and celebrating indigenous heritage. ${isBusinessUser ? 
        'Our commitment to cultural authenticity and environmental responsibility drives everything we do.' : 
        'This experience highlighted the importance of supporting businesses that prioritize cultural respect and community benefit.'
      }

Witnessing the integration of traditional Māori values with modern tourism practices offers valuable lessons for the global industry. #SustainableTourism #CulturalAuthenticity`
    }
    
    return `🌟 ${userStory}

Experience the authentic beauty of Aotearoa New Zealand! #NewZealand #CulturalTourism #Manaakitanga`
  }

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Load data using the ACTUAL localStorage keys from each step
        const story = localStorage.getItem('userStoryContext')
        const audienceData = localStorage.getItem('selectedDemographics')
        const interests = localStorage.getItem('selectedInterests')
        const platforms = localStorage.getItem('selectedPlatforms')
        const formats = localStorage.getItem('selectedFormats')
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

        console.log('Loaded user data:', userData)
        setUserData(userData)
        generateContent(userData)
      } catch (err) {
        console.error('Error loading user data:', err)
        setError('Failed to load your content data.')
        setIsGenerating(false)
      }
    }
    loadUserData()
  const generateContent = async (userData: UserData) => {
  // Complex parallel processing that hangs on mobile
  const contentPromises = orderedPlatforms.map(async (platform) => {
    // Multiple simultaneous API calls
  });
  await Promise.all(contentPromises); // ❌ This overwhelms mobile
};
          return platformContent;
        } catch (error) {
          console.error(`❌ Error generating ${platform} content:`, error);
          return null;
        }
      });

      // Wait for all to complete in background
      const allContent = await Promise.all(contentPromises);
      const successfulContent = allContent.filter(content => content !== null);
      
      console.log(`✅ All content generation complete! ${successfulContent.length}/${platforms.length} platforms successful`);
      setIsGenerating(false);
      
    } catch (err) {
      console.error('Content generation error:', err);
      setError('Failed to generate your content. Please try again.');
      setIsGenerating(false);
    }
  };

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

          {/* Header Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h1 style={{
              fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
              fontWeight: '700',
              color: '#111827',
              margin: '0',
              flex: '1',
              minWidth: '200px'
            }}>
              Your AI-Generated Content
            </h1>
            
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap'
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
                  fontSize: '0.875rem',
                  minWidth: '44px',
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
                minWidth: '44px',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
                🤖 Claude AI Creating Your Cultural Content
              </h2>
              <p style={{ 
                color: '#6b7280', 
                marginBottom: '1rem',
                lineHeight: '1.5'
              }}>
                Claude is crafting authentic content based on your story that honors Te Tiriti o Waitangi principles and respects local culture...
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
                  🧠 AI Cultural Intelligence: Ensuring content respects mātauranga Māori and uses your actual story
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
                      Scan to share this AI-generated content
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

          {/* Progressive Display Message */}
          {isGenerating && generatedContent.length > 0 && (
            <div style={{
              backgroundColor: '#f0f9ff',
              padding: '1rem',
              borderRadius: '8px',
              borderLeft: `4px solid ${BRAND_BLUE}`,
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <p style={{ 
                color: '#0369a1', 
                fontWeight: '500',
                margin: '0',
                fontSize: '0.875rem'
              }}>
                📱 Progressive Display: {generatedContent.length} platform(s) ready, generating remaining content...
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
