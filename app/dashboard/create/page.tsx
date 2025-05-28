'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function CreateStory() {
  const [story, setStory] = useState('');
  const [canSpeak, setCanSpeak] = useState(false);

  const handleNext = () => {
    if (story.trim()) {
      // Store story in localStorage for next page
      localStorage.setItem('currentStory', story);
      // Navigate to demographics page
      window.location.href = '/dashboard/create/demographics';
    } else {
      alert('Please enter your story before continuing.');
    }
  };

  const handleSpeak = () => {
    // Voice recording functionality to be implemented
    alert('Voice recording feature coming soon!');
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Step 1: Your Story</h1>
          <Link
            href="/dashboard"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto px-4 mb-6">
        <div className="flex items-center">
          <div className="flex-1 bg-blue-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full w-1/3"></div>
          </div>
          <span className="ml-3 text-sm text-gray-600">Step 1 of 3</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              **Speak Click Send** - Share Your Story
            </h2>
            <p className="text-sm text-gray-600">
              Write or speak your original story that you want to transform into multiple content formats.
            </p>
          </div>

          {/* Input Method Toggle */}
          <div className="mb-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCanSpeak(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  !canSpeak 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ✍️ Write
              </button>
              <button
                onClick={() => setCanSpeak(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  canSpeak 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🎤 Speak
              </button>
            </div>
          </div>

          {/* Story Input */}
          {!canSpeak ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Original Story
              </label>
              <textarea
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                rows={8}
                placeholder="Share your story, tradition, or narrative here. Be as detailed as you like - the more context you provide, the better we can adapt it for different audiences and platforms..."
                value={story}
                onChange={e => setStory(e.target.value)}
              />
              <div className="mt-2 text-sm text-gray-500">
                {story.length} characters
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voice Recording
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    🎤
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Record Your Story</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Click the button below to start recording your story. Our AI will transcribe and help you craft it for different platforms.
                  </p>
                </div>
                <button
                  onClick={handleSpeak}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  🔴 Start Recording
                </button>
                <p className="text-xs text-gray-500 mt-3">
                  Voice feature powered by real-time AI language interpretation
                </p>
              </div>
            </div>
          )}

          {/* Cultural Integrity Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-yellow-800 mb-1">Cultural Respect</h3>
            <p className="text-sm text-yellow-700">
              Please ensure your story respects cultural values and traditions. We're here to help you share authentic narratives responsibly.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Link
              href="/dashboard"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Save Draft
            </Link>
            <button
              onClick={handleNext}
              disabled={!story.trim()}
              className={`font-medium py-3 px-8 rounded-lg transition-colors ${
                story.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next: Audience →
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6 mb-4">
          **Speak Click Send** is another **CCC Marketing Pro™ Saas 2025**
        </p>
      </div>
    </main>
  )
}
