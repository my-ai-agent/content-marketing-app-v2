'use client'
import Link from 'next/link'
import { useState } from 'react'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C' 
const BRAND_BLUE = '#11B3FF'

export default function CreateStory() {
  const [story, setStory] = useState('')
  const [inputMethod, setInputMethod] = useState<'type' | 'record'>('type')

  const handleNext = () => {
    if (story.trim()) {
      // Save story to localStorage for now
      localStorage.setItem('currentStory', story.trim())
      localStorage.setItem('storyInputMethod', inputMethod)
      // Navigate to Step 2 (Select Platforms)
      window.location.href = '/dashboard/create/platforms'
    } else {
      alert('Please share your story before continuing.')
    }
  }

  const handleRecord = () => {
    alert('Voice recording feature coming soon!')
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      
      {/* Clean Header with Logo and Step Indicator */}
      <div className="flex justify-between items-center p-6">
        <Link href="/" className="flex items-center">
          <div style={{ 
            color: BRAND_PURPLE, 
            fontSize: '1.5rem', 
            fontWeight: '900' 
          }}>speak</div>
          <div style={{ 
            color: BRAND_ORANGE, 
            fontSize: '1.5rem', 
            fontWeight: '900',
            marginLeft: '0.25rem'
          }}>click</div>
          <div style={{ 
            color: BRAND_BLUE, 
            fontSize: '1.5rem', 
            fontWeight: '900',
            marginLeft: '0.25rem'
          }}>send</div>
        </Link>
        
        <div className="text-gray-500 font-medium">
          Step 1 of 4
        </div>
      </div>

      {/* Main Content - Centered and Clean */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 pb-20">
        
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 style={{ 
            fontSize: 'clamp(2rem, 5vw, 3rem)', 
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Create Your Story
          </h1>
        </div>

        {/* Input Method Toggle - Simple */}
        <div className="mb-8 flex bg-gray-100 rounded-xl p-2">
          <button
            type="button"
            onClick={() => setInputMethod('type')}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              inputMethod === 'type'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="mr-2">📝</span>
            Type
          </button>
          <button
            type="button"
            onClick={() => setInputMethod('record')}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              inputMethod === 'record'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="mr-2">🎤</span>
            Record
          </button>
        </div>

        {/* Story Input Area - Large and Clean */}
        <div className="w-full max-w-2xl">
          {inputMethod === 'type' ? (
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Share your unique story here..."
              className="w-full h-64 p-6 border-2 border-gray-200 rounded-2xl text-lg resize-none focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            />
          ) : (
            <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center">
              <div className="text-center">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎤</div>
                <h3 className="text-xl font-medium text-gray-700 mb-4">Record Your Story</h3>
                <button
                  onClick={handleRecord}
                  className="px-8 py-4 rounded-xl text-white font-medium transition-all hover:scale-105"
                  style={{ backgroundColor: BRAND_PURPLE }}
                >
                  Start Recording
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  Voice recording feature coming soon
                </p>
              </div>
            </div>
          )}
          
          {/* Character Count - Subtle */}
          {inputMethod === 'type' && story && (
            <div className="text-right text-sm text-gray-400 mt-3">
              {story.length} characters
            </div>
          )}
        </div>

        {/* Next Button - Prominent */}
        <div className="mt-12">
          <button
            onClick={handleNext}
            disabled={!story.trim()}
            className={`px-12 py-4 rounded-2xl font-bold text-xl transition-all ${
              story.trim()
                ? 'text-white hover:scale-105 shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            style={{
              background: story.trim() 
                ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                : undefined,
              backgroundColor: !story.trim() ? '#e5e7eb' : undefined
            }}
          >
            Next →
          </button>
        </div>

      </div>

      {/* Bottom Navigation - Minimal */}
      <div className="p-6 border-t border-gray-100">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <Link 
            href="/"
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            ← Back to Home
          </Link>
          <div className="text-sm text-gray-400">
            Save draft feature coming soon
          </div>
        </div>
      </div>

    </main>
  )
}
