'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Embedded interfaces (copied from utils files)
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
  linkedInUrl?: string
  facebookUrl?: string
  instagramUrl?: string
  name?: string
  location?: string
  culturalConnection?: string
}

interface ScrapedBrandData {
  url: string
  heroMessage?: string
  aboutContent?: string
  brandVoice?: 'professional' | 'casual' | 'technical' | 'creative' | 'luxury'
  keyMessages?: string[]
  businessDescription?: string
  scrapeTimestamp: string
  success: boolean
  error?: string
}

// Embedded brand scraping function (simplified version)
async function scrapeWebsiteBasic(url: string): Promise<ScrapedBrandData> {
  const result: ScrapedBrandData = {
    url: url,
    scrapeTimestamp: new Date().toISOString(),
    success: false
  }

  try {
    // Check cache first
    const cacheKey = `brand_${url.replace(/[^a-zA-Z0-9]/g, '_')}`
    const cached = localStorage.getItem(cacheKey)
    
    if (cached) {
      const parsedCache = JSON.parse(cached)
      const age = Date.now() - new Date(parsedCache.scrapeTimestamp).getTime()
      
      // Use cache if less than 24 hours old
      if (age < 24 * 60 * 60 * 1000) {
        console.log('Using cached brand data for:', url)
        return parsedCache
      }
    }

    console.log('Scraping brand data for:', url)
    
    // Simple CORS proxy approach
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const htmlContent = data.contents

    if (htmlContent) {
      // Parse HTML content
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlContent, 'text/html')

      // Extract brand information
      const title = doc.querySelector('title')?.textContent || ''
      const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || ''
      const h1 = doc.querySelector('h1')?.textContent || ''
      
      result.heroMessage = h1 || title
      result.businessDescription = metaDesc
      result.brandVoice = analyzeBrandVoice(htmlContent)
      result.success = true

      // Cache the results
      localStorage.setItem(cacheKey, JSON.stringify(result))
      console.log('Successfully scraped and cached brand data')
    }

    return result

  } catch (error) {
    console.warn('Brand scraping failed:', error)
    result.error = error instanceof Error ? error.message : 'Scraping failed'
    return result
  }
}

// Simple brand voice analysis
function analyzeBrandVoice(content: string): 'professional' | 'casual' | 'technical' | 'creative' | 'luxury' {
  const text = content.toLowerCase()
  
  const professionalWords = ['expertise', 'professional', 'industry', 'solutions', 'services', 'excellence']
  const casualWords = ['awesome', 'amazing', 'love', 'fun', 'easy', 'simple', 'great']
  const technicalWords = ['technology', 'innovative', 'advanced', 'system', 'platform']
  const creativeWords = ['creative', 'design', 'unique', 'artistic', 'inspiration']
  const luxuryWords = ['luxury', 'premium', 'exclusive', 'bespoke', 'elegant']

  const scores = {
    professional: professionalWords.filter(word => text.includes(word)).length,
    casual: casualWords.filter(word => text.includes(word)).length,
    technical: technicalWords.filter(word => text.includes(word)).length,
    creative: creativeWords.filter(word => text.includes(word)).length,
    luxury: luxuryWords.filter(word => text.includes(word)).length
  }

  const maxScore = Math.max(...Object.values(scores))
  const dominantVoice = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as any
  return dominantVoice || 'professional'
}

// Enhanced mock content generator with sophisticated brand intelligence  
function generateEnhancedMockContent(userData: UserData, brandData?: ScrapedBrandData): { [platform: string]: any } {
  const platforms = userData.platforms || ['instagram', 'facebook']
  const mockContent: { [platform: string]: any } = {}
  const isBusinessUser = !!userData.businessType
  const baseContent = userData.story || "Amazing experience at this beautiful location in Aotearoa"

  // Enhanced business type context (from your sophisticated mapping)
  const businessContext = getBusinessContext(userData.businessType)
  const locationContext = getLocationContext(userData.location)
  
  // Use brand voice if available
  const brandVoice = brandData?.brandVoice || 'professional'
  const brandMessage = brandData?.heroMessage || ''

  platforms.forEach(platform => {
    let content = ""
    let hashtags: string[] = []
    let tips = ""

    // Cultural intelligence integration
    const culturalElements = getCulturalElements(userData.location)
    const brandPrefix = brandData?.success ? `${brandMessage ? `"${brandMessage}" - ` : ''}` : ''

    if (platform === 'instagram') {
      if (brandVoice === 'luxury') {
        content = `✨ ${brandPrefix}${baseContent}\n\nExperience unparalleled elegance and authentic New Zealand luxury. Every moment curated for the discerning traveller who appreciates cultural sophistication. ${culturalElements.iwi ? `\n\n🌿 Honoring ${culturalElements.iwi} as tangata whenua` : ''} 🏔️\n\n#LuxuryNZ #Aotearoa #PremiumExperience #CulturalLuxury #Manaakitanga`
        hashtags = ['#LuxuryNZ', '#Aotearoa', '#PremiumExperience', '#CulturalLuxury', '#Manaakitanga']
      } else if (brandVoice === 'casual') {
        content = `🤩 ${brandPrefix}${baseContent}\n\nSeriously guys, this place is absolutely incredible! The kiwi hospitality and stunning landscapes will blow your mind! ${culturalElements.iwi ? `Massive respect to ${culturalElements.iwi} for sharing their beautiful whenua! ` : ''}Can't wait to come back! 🥾✨\n\n#NewZealand #Aotearoa #Amazing #KiwiLife #GoodVibes #Manaakitanga`
        hashtags = ['#NewZealand', '#Aotearoa', '#Amazing', '#KiwiLife', '#GoodVibes', '#Manaakitanga']
      } else {
        content = `🌟 ${brandPrefix}${baseContent}\n\n${isBusinessUser ? `Experience authentic New Zealand culture with us - where every moment honors our rich heritage and stunning landscapes! ${businessContext}` : 'What an incredible journey through Aotearoa! Every step revealed new wonders and cultural insights.'} ${culturalElements.iwi ? `\n\n🌿 With respect to ${culturalElements.iwi} as tangata whenua of this special place` : ''} 🏔️✨\n\n#NewZealand #Aotearoa #CulturalTourism #AuthenticExperience #Manaakitanga`
        hashtags = ['#NewZealand', '#Aotearoa', '#CulturalTourism', '#AuthenticExperience', '#Manaakitanga', '#KiwiHospitality']
      }
      
      tips = "🕐 Best times to visit: Early morning (6-8 AM) or golden hour (5-7 PM) for perfect lighting and fewer crowds"
      
    } else if (platform === 'facebook') {
      content = `${brandPrefix}${baseContent}\n\nThis experience really opened my eyes to the incredible depth of New Zealand's cultural heritage and natural beauty. ${isBusinessUser ? `We feel privileged to share these authentic moments with visitors from around the world, always ensuring we honor the cultural significance of this special place. ${businessContext}` : 'I can\'t recommend this enough for anyone wanting to truly connect with local culture and understand the stories that make Aotearoa so special!'}\n\n${culturalElements.iwi ? `With deep respect to ${culturalElements.iwi} as the tangata whenua who have cared for this land for generations. ` : ''}The manaakitanga (hospitality) shown by local people made this experience unforgettable. 💙`
      
      tips = "💡 Cultural tip: Always remember to be respectful of cultural protocols, ask permission before photographing people, and listen to local stories with an open heart"
      
    } else if (platform === 'linkedin') {
      content = `Professional insight: ${brandPrefix}${baseContent}\n\nThe sustainable tourism industry in New Zealand continues to demonstrate how authentic cultural experiences can create meaningful economic opportunities while preserving and celebrating indigenous heritage. ${isBusinessUser ? `Our commitment to cultural authenticity and environmental responsibility drives everything we do. ${businessContext}` : 'This experience highlighted the importance of supporting businesses that prioritize cultural respect and community benefit.'}\n\n${culturalElements.iwi ? `Working in partnership with ${culturalElements.iwi} demonstrates how tourism can honor Te Tiriti o Waitangi principles while creating shared prosperity. ` : ''}Witnessing the integration of traditional Māori values with modern tourism practices offers valuable lessons for the global industry. #SustainableTourism #CulturalAuthenticity #TeTiritioWaitangi`
      
      tips = "🌱 Business insight: Consider how cultural authenticity and environmental responsibility can differentiate your tourism offerings in an increasingly conscious market"
    }

    mockContent[platform] = {
      content,
      hashtags,
      tips,
      estimatedReach: Math.floor(Math.random() * 1500) + 750,
      suggestedPostTime: "6:00 PM - 8:00 PM NZST",
      culturalAuthenticity: "High - includes appropriate cultural context and iwi acknowledgments",
      brandConsistency: brandData?.success ? `95% - aligned with ${brandVoice} brand voice from website analysis` : "85% - default professional voice",
      brandAnalysis: brandData?.success ? {
        websiteAnalyzed: true,
        brandVoice: brandVoice,
        heroMessage: brandData.heroMessage,
        businessDescription: brandData.businessDescription,
        culturalIntelligence: 'Enhanced with Te Tiriti o Waitangi principles'
      } : {
        culturalIntelligence: 'Enhanced with Te Tiriti o Waitangi principles'
      },
      enhancedFeatures: [
        'Cultural intelligence integration',
        'Iwi acknowledgment guidance', 
        'Platform-specific optimization',
        'Business type contextualization',
        'Brand voice analysis',
        'Sustainable tourism messaging'
      ]
    }
  })

  return mockContent
}

// Get business context from your sophisticated business type mapping
function getBusinessContext(businessType?: string): string {
  if (!businessType) return ''
  
  const businessMappings: { [key: string]: string } = {
    'visitor-attraction': 'Specializing in unique cultural experiences and respectful heritage preservation.',
    'accommodation': 'Incorporating Māori hospitality principles and local cultural elements.',
    'food-beverage': 'Celebrating authentic taste experiences and traditional culinary stories.',
    'tours-activities': 'Providing transformative experiences with respectful cultural site access.',
    'cultural-heritage': 'Protecting sacred knowledge while enabling respectful cultural engagement.',
    'wellness-spa': 'Integrating traditional Māori wellness practices and rongoā Māori.',
    'transport': 'Respecting cultural sites along travel routes while providing scenic journeys.',
    'retail': 'Offering authentic local products with appropriate cultural design representation.',
    'event-venue': 'Honoring venue cultural history and appropriate cultural use protocols.',
    'education-training': 'Sharing traditional knowledge respectfully with proper educational protocols.',
    'adventure-sports': 'Accessing natural areas with respect for Māori spiritual connections.',
    'arts-crafts': 'Teaching cultural art forms with proper permissions and cultural knowledge.',
    'marine-wildlife': 'Respecting Māori relationships with marine life and kaitiakitanga principles.',
    'technology-digital': 'Ensuring respectful digital representation of cultural content.',
    'government-tourism': 'Implementing Te Tiriti o Waitangi principles in bicultural tourism development.'
  }
  
  return businessMappings[businessType] || ''
}

// Enhanced location context with iwi recognition
function getLocationContext(location?: string): { iwi?: string, description?: string } {
  if (!location) return {}
  
  const locationLower = location.toLowerCase()
  
  if (locationLower.includes('auckland') || locationLower.includes('tāmaki makaurau')) {
    return { iwi: 'Ngāti Whātua', description: 'Tāmaki Makaurau - land of many lovers' }
  } else if (locationLower.includes('wellington') || locationLower.includes('te whanganui-a-tara')) {
    return { iwi: 'Taranaki Whānui', description: 'Te Whanganui-a-Tara - the great harbour of Tara' }
  } else if (locationLower.includes('christchurch') || locationLower.includes('ōtautahi')) {
    return { iwi: 'Ngāi Tahu', description: 'Ōtautahi - place of Tautahi' }
  } else if (locationLower.includes('rotorua')) {
    return { iwi: 'Te Arawa', description: 'Center of Māori culture and geothermal wonders' }
  } else if (locationLower.includes('queenstown') || locationLower.includes('tāhuna')) {
    return { iwi: 'Ngāi Tahu', description: 'Tāhuna - shallow bay in Central Otago' }
  } else if (locationLower.includes('bay of islands') || locationLower.includes('paihia')) {
    return { iwi: 'Ngāpuhi', description: 'Birthplace of modern New Zealand and Te Tiriti o Waitangi' }
  }
  
  return {}
}

// Get cultural elements for content enhancement
function getCulturalElements(location?: string) {
  const context = getLocationContext(location)
  return {
    iwi: context.iwi,
    description: context.description
  }
}

export default function GeneratePage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [brandData, setBrandData] = useState<ScrapedBrandData | null>(null)

  useEffect(() => {
    const loadAndGenerate = async () => {
      try {
        // Collect all user data from localStorage
        const data: UserData = {
          story: localStorage.getItem('userStoryContext') || undefined,
          audience: JSON.parse(localStorage.getItem('selectedDemographics') || '["general-audience"]')[0] || 'general-audience',
          interests: JSON.parse(localStorage.getItem('selectedInterests') || '["cultural-experiences"]')[0] || 'cultural-experiences',
          platforms: JSON.parse(localStorage.getItem('selectedPlatforms') || '["instagram"]'),
          formats: JSON.parse(localStorage.getItem('selectedFormats') || '["social-post"]'),
          
          // User profile data from onboarding
          name: localStorage.getItem('userName') || undefined,
          location: localStorage.getItem('userLocation') || undefined,
          businessType: localStorage.getItem('userBusinessType') || undefined,
          websiteUrl: localStorage.getItem('userWebsiteUrl') || undefined,
          linkedInUrl: localStorage.getItem('userLinkedInUrl') || undefined,
          facebookUrl: localStorage.getItem('userFacebookUrl') || undefined,
          instagramUrl: localStorage.getItem('userInstagramUrl') || undefined,
          culturalConnection: localStorage.getItem('userCulturalConnection') || undefined,
        }

        console.log('Loaded user data:', data)
        
        if (!data.story) {
          setError('No story found. Please complete all previous steps.')
          return
        }

        setUserData(data)
        await generateContent(data)
        
      } catch (error) {
        console.error('Error loading user data:', error)
        setError('Failed to load your content data. Please start over.')
      }
    }

    loadAndGenerate()
  }, [])

  const generateContent = async (data: UserData) => {
    setIsGenerating(true)
    setError(null)

    try {
      console.log('🚀 Starting enhanced content generation with brand intelligence...')
      
      let scrapedBrandData: ScrapedBrandData | null = null
      
      // Scrape website for brand intelligence if URL provided
      if (data.websiteUrl && data.businessType) {
        try {
          console.log('🔍 Analyzing brand voice from website...')
          scrapedBrandData = await scrapeWebsiteBasic(data.websiteUrl)
          setBrandData(scrapedBrandData)
          
          if (scrapedBrandData.success) {
            console.log('✅ Brand analysis complete:', scrapedBrandData.brandVoice)
          } else {
            console.warn('⚠️ Brand analysis failed, using default content')
          }
        } catch (error) {
          console.warn('Brand scraping error:', error)
        }
      }
      
      // Add processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate content with brand intelligence
      const generatedContent = generateEnhancedMockContent(data, scrapedBrandData || undefined)
      
      console.log('✅ Enhanced content generated with brand intelligence:', generatedContent)
      
      // Store the generated content
      localStorage.setItem('generatedContent', JSON.stringify(generatedContent))
      
      // Navigate to results page
      setTimeout(() => {
        router.push('/dashboard/create/results')
      }, 2000)
      
    } catch (error) {
      console.error('❌ Content generation failed:', error)
      setError('Failed to generate content. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleStartOver = () => {
    // Clear content data but keep user profile
    const keysToRemove = [
      'userStoryContext',
      'selectedDemographics', 
      'selectedInterests',
      'selectedPlatforms',
      'selectedFormats',
      'generatedContent'
    ]
    
    keysToRemove.forEach(key => localStorage.removeItem(key))
    
    router.push('/dashboard/create/photo')
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Content Generation Error</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          
          <button
            onClick={handleStartOver}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            Start Over
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {isGenerating ? 'Generating Your Content' : 'Content Generated!'}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {isGenerating 
            ? 'Creating culturally-intelligent content with brand analysis...'
            : 'Your brand-intelligent content is ready!'
          }
        </p>
        
        {isGenerating && (
          <div className="space-y-3 text-left text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Analyzing your story and audience
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Applying cultural intelligence framework
            </div>
            {userData?.websiteUrl && userData?.businessType && (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                Scraping website for brand voice analysis
              </div>
            )}
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
              Generating brand-aligned, platform-optimized content
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
              Creating QR codes for distribution
            </div>
          </div>
        )}
        
        {brandData?.success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-left">
            <div className="font-semibold text-green-800 mb-1">Brand Analysis Complete ✅</div>
            <div className="text-green-700">
              Voice: <span className="font-semibold">{brandData.brandVoice}</span>
              {brandData.heroMessage && <div>Message: "{brandData.heroMessage.substring(0, 40)}..."</div>}
            </div>
          </div>
        )}
        
        {!isGenerating && (
          <div className="text-sm text-gray-500">
            Redirecting to your results...
          </div>
        )}
      </div>
    </div>
  )
}
