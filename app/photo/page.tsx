'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { saveImageBlob, resizeDataUrl } from '@/lib/imageStorage'

const PhotoUploadPage: React.FC = () => {
  const router = useRouter()
  const [selectedPhoto, setSelectedPhoto] = useState<string>('')
  const [processing, setProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    setProcessing(true)
    
    try {
      // Convert to data URL without compression for upload display
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setSelectedPhoto(result)
        
        // Store ORIGINAL image for cropping
        const resizedDataUrl = await resizeDataUrl(result, 1600)
await saveImageBlob('pendingImage', resizedDataUrl)
localStorage.removeItem('croppedImageUrl')
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error processing file:', error)
      alert('Error processing image. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleContinue = () => {
    if (selectedPhoto) {
      router.push('/photo/crop')
    }
  }

  const handleSkip = () => {
    // Skip photo upload and continue to next step
    router.push('/dashboard/create/persona') // Adjust path as needed
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
            {[2, 3, 4, 5, 6].map((step) => (
              <React.Fragment key={step}>
                <div className="w-8 h-1 bg-gray-300"></div>
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {step}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Add Your Photo</h1>
        </div>

        {/* Upload Area */}
        {!selectedPhoto ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                📁
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload a Photo</h3>
              <p className="text-gray-600 mb-6">Click to browse your files or drag and drop</p>
              <p className="text-sm text-gray-500">Supports: JPG, PNG, HEIC, WebP</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  disabled={processing}
                >
                  📁 Upload
                </button>
                <button
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.setAttribute('capture', 'environment')
                      fileInputRef.current.click()
                    }
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  disabled={processing}
                >
                  📷 Camera
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        ) : (
          /* Preview Area */
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <img
                src={selectedPhoto}
                alt="Selected photo"
                className="max-w-full max-h-96 mx-auto rounded-lg shadow-md"
              />
              <p className="text-sm text-gray-500 mt-2">Original image ready for cropping</p>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handleSkip}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Skip for now
          </button>

          <button
            onClick={handleContinue}
            disabled={!selectedPhoto || processing}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              selectedPhoto && !processing
                ? 'bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {processing ? 'Processing...' : 'Continue →'}
          </button>
        </div>

        {/* Branding */}
        <div className="text-center mt-8">
          <div className="text-2xl font-bold">
            <span className="text-blue-600">click</span>
            <span className="text-orange-500"> speak</span>
            <span className="text-blue-600"> send</span>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PhotoUploadPage
