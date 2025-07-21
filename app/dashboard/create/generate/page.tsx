'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { generateMockContent, UserData } from '../../../../utils/claudePrompt'

export default function GeneratePage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)

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
          
          // User profile data
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
      console.log('🚀 Starting content generation...')
      
      // Generate content using your existing mock function
      const generatedContent = generateMockContent(data)
      
      console.log('✅ Content generated:', generatedContent)
      
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
            ? 'Creating culturally-intelligent content with AI...'
            : 'Your culturally-intelligent content is ready!'
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
            {userData?.businessType && (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                Analyzing brand voice from your digital presence
              </div>
            )}
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
              Generating platform-optimized content
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
              Creating QR codes for distribution
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
