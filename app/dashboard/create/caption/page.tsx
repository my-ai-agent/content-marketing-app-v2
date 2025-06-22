'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C' 
const BRAND_BLUE = '#11B3FF'

export default function QuickCaption() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Load photo from previous steps
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const photo = localStorage.getItem('selectedPhoto')
      if (photo) {
        setSelectedPhoto(photo)
      } else {
        // Redirect back if no photo
        window.location.href = '/dashboard/create/photo'
      }
    }
  }, [])

  const handleNext = async () => {
    if (!caption.trim()) {
      alert('Please add a caption before continuing.')
      return
    }

    setIsProcessing(true)
    
    try {
      // Store the caption and user choice
      localStorage.setItem('quickCaption', caption.trim())
      localStorage.setItem('userChoice', 'quick')
      localStorage.setItem('currentStory', caption.trim()) // For compatibility with results page
      
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Go directly to results (skip demographics for quick path)
      window.location.href = '/dashboard/create/results'
      
    } catch (error) {
      console.error('Error processing caption:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEnhancedPath = () => {
    // Save current caption as starting point for enhanced story
    if (caption.trim()) {
      localStorage.setItem('storyStart', caption.trim())
    }
    window.location.href = '/dashboard/create/story'
  }

  const getSuggestions = () => {
    const suggestions = [
      "Amazing day at [Location]",
      "[Your name] @ [Location] - unforgettable moment",
      "Breathtaking views at [Location]",
      "Perfect day exploring [Location]",
      "Living my best life at [Location]",
      "Incredible experience at [Location]"
    ]
    return suggestions
  }

  const applySuggestion = (suggestion: string) => {
    setCaption(suggestion)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* Header with Step Tracker */}
      <div className="flex flex-col justify-center items-center p-8 border-b border-gray-200">

        {/* Step Tracker */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
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
          }}>1</div>
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#10b981' }}></div>
          <div style={{
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
          }}>2</div>
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#10b981' }}></div>
          <div style={{
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
          }}>3</div>
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#e5e7eb' }}></div>
          <div style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            backgroundColor: '#e5e7eb',
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>4</div>
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#e5e7eb' }}></div>
          <div style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            backgroundColor: '#e5e7eb',
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>5</div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 text-center">
          Quick Caption
        </h1>
        <p className="text-lg text-gray-600 text-center mt-4 max-w-2xl">
          Add a simple caption and share instantly across all platforms
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Photo Preview */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Amazing Photo</h2>
            {selectedPhoto && (
              <div className="mb-6">
                <img 
                  src={selectedPhoto} 
                  alt="Your travel moment" 
                  className="w-full max-h-96 object-cover rounded-2xl shadow-lg"
                />
              </div>
            )}
            
            {/* Quick Stats */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="font-semibold text-blue-900 mb-4">⚡ Quick Share Benefits</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✅</span>
                  <span className="text-blue-800">Instant sharing to major platforms</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✅</span>
                  <span className="text-blue-800">Auto-optimized for mobile sharing</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✅</span>
                  <span className="text-blue-800">Perfect for "in-the-moment" posts</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-blue-500">⏱️</span>
                  <span className="text-blue-800">Takes just 30 seconds</span>
                </div>
              </div>
            </div>
          </div>

          {/* Caption Input */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Your Caption</h2>
            
            {/* Caption Input */}
            <div className="mb-6">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Amazing day at Milford Sound..."
                className="w-full h-32 p-4 border-2 border-gray-200 rounded-2xl text-lg resize-none outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                maxLength={200}
              />
              <div className="text-right text-sm text-gray-500 mt-2">
                {caption.length}/200 characters
              </div>
            </div>

            {/* Caption Suggestions */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-3">💡 Quick Ideas:</h3>
              <div className="grid grid-cols-1 gap-2">
                {getSuggestions().map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => applySuggestion(suggestion)}
                    className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Primary: Quick Share */}
              <button
                onClick={handleNext}
                disabled={!caption.trim() || isProcessing}
                className={`w-full text-xl font-bold py-4 px-8 rounded-2xl transition-all ${
                  caption.trim() && !isProcessing
                    ? 'text-white shadow-lg hover:scale-105 cursor-pointer' 
                    : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                }`}
                style={{
                  background: caption.trim() && !isProcessing
                    ? `linear-gradient(45deg, ${BRAND_BLUE} 0%, #10b981 100%)`
                    : undefined
                }}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Processing...
                  </span>
                ) : (
                  '⚡ Share Instantly'
                )}
              </button>

              {/* Secondary: Upgrade to Enhanced */}
              <button
                onClick={handleEnhancedPath}
                className="w-full py-3 px-6 border-2 border-purple-200 text-purple-700 font-semibold rounded-2xl hover:border-purple-400 hover:bg-purple-50 transition-all"
              >
                ✨ Want a professional story instead?
              </button>
            </div>

            {/* Platform Preview */}
            <div className="mt-8 bg-gray-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-800 mb-4">📱 Will be shared to:</h3>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span>📘</span>
                  <span>Facebook</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📷</span>
                  <span>Instagram</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🐦</span>
                  <span>Twitter</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💼</span>
                  <span>LinkedIn</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📱</span>
                  <span>QR Code</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <span>Email</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
          <Link href="/dashboard/create/choice" className="text-gray-600 font-semibold hover:text-gray-900">
            ← Back to Choice
          </Link>
          
          <div className="text-center">
            <Link href="/" className="inline-block text-xl font-black">
              <span style={{ color: BRAND_PURPLE }}>speak</span>
              <span style={{ color: BRAND_ORANGE }}> click</span>
              <span style={{ color: BRAND_BLUE }}> send</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
