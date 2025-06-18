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
      localStorage.setItem('currentStory', story.trim())
      localStorage.setItem('storyInputMethod', inputMethod)
      window.location.href = '/dashboard/create/photo'
    } else {
      alert('Please share your story before continuing.')
    }
  }

  const handleRecord = () => {
    alert('Voice recording feature coming soon!')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* Header with Step Tracker */}
      <div className="flex flex-col justify-center items-center p-8 border-b border-gray-200">

        {/* Step Tracker - Mobile Responsive */}
        <div className="flex justify-center items-center gap-1 sm:gap-2 mb-6 px-4 overflow-hidden">
          {/* Step 1 */}
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs sm:text-sm font-semibold">
            1
          </div>
          
          {/* Line 1-2 */}
          <div className="w-6 sm:w-10 h-0.5 bg-gray-300"></div>
          
          {/* Step 2 */}
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs sm:text-sm font-semibold">
            2
          </div>
          
          {/* Line 2-3 */}
          <div className="w-6 sm:w-10 h-0.5 bg-gray-300"></div>
          
          {/* Step 3 */}
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs sm:text-sm font-semibold">
            3
          </div>
          
          {/* Line 3-4 */}
          <div className="w-6 sm:w-10 h-0.5 bg-gray-300"></div>
          
          {/* Step 4 */}
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs sm:text-sm font-semibold">
            4
          </div>
          
          {/* Line 4-5 */}
          <div className="w-6 sm:w-10 h-0.5 bg-gray-300"></div>
          
          {/* Step 5 */}
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs sm:text-sm font-semibold">
            5
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 text-center">
          Create Your Story
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-8">

        {/* Input Method Toggle */}
        <div className="text-center w-full mb-8">
          <div className="inline-flex bg-gray-100 rounded-2xl p-2">
            <button
              type="button"
              onClick={() => setInputMethod('type')}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                inputMethod === 'type' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600'
              }`}
            >
              <span className="mr-2">📝</span>
              Write
            </button>
            <button
              type="button"
              onClick={() => setInputMethod('record')}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                inputMethod === 'record' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600'
              }`}
            >
              <span className="mr-2">🎤</span>
              Record
            </button>
          </div>
        </div>

        {/* Story Input Area */}
        <div className="text-center w-full mb-12">
          {inputMethod === 'type' ? (
            <div className="max-w-3xl mx-auto">
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Write your unique story here, or copy and paste from your existing notes..."
                className="w-full h-48 p-6 border-2 border-gray-200 rounded-3xl text-lg resize-none outline-none font-sans leading-relaxed focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
              {story && (
                <div className="text-sm text-gray-500 mt-3 text-right">
                  {story.length} characters
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto h-48 border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center bg-gray-50">
              <div className="text-5xl mb-4">🎤</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Record Your Story
              </h3>
              <button
                onClick={handleRecord}
                className="px-6 py-3 rounded-2xl text-white font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: BRAND_PURPLE }}
              >
                Start Recording
              </button>
            </div>
          )}
        </div>

        {/* Next Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleNext}
            disabled={!story.trim()}
            className={`text-2xl font-black px-8 py-4 rounded-2xl transition-all ${
              story.trim() 
                ? 'text-white shadow-2xl hover:scale-105 cursor-pointer' 
                : 'text-gray-400 bg-gray-200 cursor-not-allowed'
            }`}
            style={{
              background: story.trim() 
                ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                : undefined
            }}
          >
            Next →
          </button>
        </div>

        {/* Logo */}
        <div className="text-center pt-8">
          <Link href="/" className="inline-block text-xl font-black">
            <span style={{ color: BRAND_PURPLE }}>speak</span>
            <span style={{ color: BRAND_ORANGE }}> click</span>
            <span style={{ color: BRAND_BLUE }}> send</span>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-6 text-center border-t border-gray-200">
        <Link href="/" className="text-gray-600 font-semibold hover:text-gray-900">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
