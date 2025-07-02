'use client'

import React, { useState, useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const ResultsPage: React.FC = () => {
  const router = useRouter()
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const cropped = localStorage.getItem('croppedImageUrl') || sessionStorage.getItem('croppedImageUrl')
      if (cropped) {
        setCroppedImageUrl(cropped)
      } else {
        // No cropped image found, redirect to photo upload
        router.push('/photo')
        return
      }
      setLoading(false)
    }
  }, [router])

  const handleDownloadImage = () => {
    if (!croppedImageUrl) return

    const link = document.createElement('a')
    link.href = croppedImageUrl
    link.download = `cropped-image-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCropAgain = () => {
    router.push('/photo/crop')
  }

  const handleContinueToContent = () => {
    // Navigate to next step in your 6-step workflow
    router.push('/dashboard/create/persona') // Your existing workflow path
  }

  const handleStartOver = () => {
    // Clear all stored images and start fresh
    localStorage.removeItem('pendingImageUrl')
    localStorage.removeItem('croppedImageUrl')
    router.push('/photo')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cropped image...</p>
        </div>
      </div>
    )
  }

  if (!croppedImageUrl) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No cropped image found.</p>
          <button
            onClick={() => router.push('/photo')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Upload New Photo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
            <div className="w-8 h-1 bg-green-500"></div>
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              ✓
            </div>
            {[3, 4, 5, 6].map((step) => (
              <React.Fragment key={step}>
                <div className="w-8 h-1 bg-gray-300"></div>
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {step}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Photo is Ready!</h1>
          <p className="text-gray-600">Your image has been cropped with pixel-perfect accuracy</p>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="text-2xl mr-3">✨</div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">Crop Complete!</h3>
              <p className="text-green-700 mt-1">
                Your image has been processed using percentage-based coordinates for perfect accuracy across all devices
              </p>
            </div>
          </div>
        </div>

        {/* Cropped Image Display */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <img
              src={croppedImageUrl}
              alt="Cropped result"
              className="max-w-full h-auto mx-auto rounded-lg shadow-md mb-4"
              style={{ maxHeight: '400px' }}
            />
            <p className="text-sm text-gray-500 mb-6">
              📁 {`cropped-image-${Date.now()}.jpg`}
            </p>
            
            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleDownloadImage}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  📥 Download Image
                </button>
                <button
                  onClick={handleCropAgain}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  ✂️ Crop Again
                </button>
              </div>
              
              <div className="pt-4">
                <button
                  onClick={handleContinueToContent}
                  className="w-full bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors flex items-center justify-center gap-2"
                >
                  ✨ Continue to Content Creation
                </button>
              </div>
              
              <div className="pt-2">
                <button
                  onClick={handleStartOver}
                  className="text-gray-500 hover:text-gray-700 font-medium"
                >
                  🔄 Start Over
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="text-center">
          <div className="text-2xl font-bold mb-8">
            <span className="text-blue-600">click</span>
            <span className="text-orange-500"> speak</span>
            <span className="text-blue-600"> send</span>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResultsPage
