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
    // Mark as completed
    setCompletedPlatforms(prev => [...prev, platform])
    setPlatformContent(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        isCompleted: true
      }
    }))
    
    // Simulate API call
    alert(`Content sent to ${platform}! 🚀`)
  }

  const handleMorePlatforms = () => {
    alert('Upgrade to access Instagram, LinkedIn, TikTok and more! 🚀')
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Generating Your Content...</h2>
            <p className="text-gray-600 mb-4">Creating platform-optimized versions of your story</p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>✓ Analyzing your story</p>
              <p>✓ Optimizing for your target audience</p>
              <p>✓ Formatting for each platform</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header with Logo and Step Tracker */}
      <div className="flex flex-col justify-center items-center py-8 border-b border-gray-100">
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

        {/* Step Tracker */}
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">1</div>
          <div className="w-10 h-0.5 bg-green-500"></div>
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">2</div>
          <div className="w-10 h-0.5 bg-green-500"></div>
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">3</div>
          <div className="w-10 h-0.5 bg-green-500"></div>
          <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">4</div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Review & Distribute</h1>
        <p className="text-gray-600 text-center max-w-2xl">Your AI-generated content is ready. Review each platform and send when perfect.</p>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {/* Generated Story Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Generated Story</h2>
            <button className="text-gray-600 hover:text-gray-800 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              ✏️ Edit Story
            </button>
          </div>
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-gray-700 leading-relaxed">
            {story || "Your story will appear here..."}
          </div>
        </div>

        {/* Platform Distribution Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Chosen Platform Distribution</h2>
            <div className="text-sm text-gray-500">
              {completedPlatforms.length} of {Object.keys(platforms).length} platforms completed
            </div>
          </div>

          {/* Platform Tabs */}
          <div className="flex gap-2 mb-6 border-b-2 border-gray-100 overflow-x-auto">
            {Object.keys(platforms).map((platform) => (
              <button
                key={platform}
                onClick={() => setActivePlatform(platform)}
                className={`flex flex-col items-center gap-2 px-5 py-4 rounded-t-lg transition-all min-w-[120px] relative ${
                  activePlatform === platform
                    ? 'bg-white border-b-3 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                } ${completedPlatforms.includes(platform) ? 'bg-green-50' : ''}`}
              >
                {completedPlatforms.includes(platform) && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                )}
                <div className="text-2xl">{platforms[platform as keyof typeof platforms].icon}</div>
                <div className="text-sm font-medium">{platform}</div>
              </button>
            ))}
            
            {/* More Platforms Button */}
            <button
              onClick={handleMorePlatforms}
              className="flex flex-col items-center gap-1.5 px-5 py-4 rounded-lg border-2 border-dashed border-yellow-300 bg-gradient-to-br from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300 transition-all min-w-[120px] relative ml-2"
            >
              <div className="absolute top-2 right-2 w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                +3
              </div>
              <div className="text-2xl">✨</div>
              <div className="text-xs font-semibold text-yellow-800 text-center leading-tight">More Platforms</div>
            </button>
          </div>

          {/* Active Platform Content */}
          {activePlatform && platformContent[activePlatform] && (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-xl">
                    {platforms[activePlatform as keyof typeof platforms].icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{activePlatform} Post</h3>
                    <p className="text-sm text-gray-500">{platforms[activePlatform as keyof typeof platforms].description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${
                    getCharacterStatus(activePlatform) === 'optimal' ? 'text-green-600' :
                    getCharacterStatus(activePlatform) === 'acceptable' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {platformContent[activePlatform].charCount}/{platforms[activePlatform as keyof typeof platforms].optimal.max} chars
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                    getCharacterStatus(activePlatform) === 'optimal' ? 'bg-green-100 text-green-700' :
                    getCharacterStatus(activePlatform) === 'acceptable' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    Optimal: {platforms[activePlatform as keyof typeof platforms].optimal.min}-{platforms[activePlatform as keyof typeof platforms].optimal.max}
                  </div>
                </div>
              </div>

              <textarea
                value={platformContent[activePlatform].content}
                onChange={(e) => handleEditContent(activePlatform, e.target.value)}
                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed resize-none"
                placeholder="Generated content will appear here..."
              />

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => {
                    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
                    if (textarea) {
                      // Simple edit mode - could expand this
                      textarea.focus()
                    }
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  ✏️ Edit This Version
                </button>
                <button
                  onClick={() => handleSendToPlatform(activePlatform)}
                  disabled={completedPlatforms.includes(activePlatform)}
                  className={`font-medium py-3 px-6 rounded-lg transition-colors ${
                    completedPlatforms.includes(activePlatform)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {completedPlatforms.includes(activePlatform) ? '✅ Sent' : '📤 Send to ' + activePlatform}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <Link
            href="/create/interests"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            ← Back to Interests
          </Link>
          <div className="flex gap-3">
            <button
              onClick={() => {
                localStorage.setItem('platformContent', JSON.stringify(platformContent))
                alert('All content saved as drafts! 💾')
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              💾 Save All Drafts
            </button>
            <Link
              href="/dashboard"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              ✅ Complete
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-gray-500 text-sm border-t border-gray-100">
        <strong>Speak Click Send</strong> is another <strong>CCC Marketing Pro™ SaaS 2025</strong>
      </div>
    </div>
  )
}
