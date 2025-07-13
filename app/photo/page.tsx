'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { saveImageBlob, resizeDataUrl, dataURLtoBlob } from '@/lib/imageStorage'
import { Camera, Upload, Globe, Image as ImageIcon } from 'lucide-react'

const PhotoUploadPage: React.FC = () => {
  const router = useRouter()
  const [selectedPhoto, setSelectedPhoto] = useState<string>('')
  const [photoType, setPhotoType] = useState<'experience' | 'business' | 'reference'>('experience')
  const [processing, setProcessing] = useState(false)
  const [showTypeSelection, setShowTypeSelection] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const photoTypeOptions = [
    {
      type: 'experience' as const,
      icon: Camera,
      title: '📸 Experience Photo',
      description: 'Your personal travel/tourism experience photo',
      examples: 'Holiday snaps, cultural moments, adventure activities',
      aiHelp: 'AI will create content based on your authentic experience'
    },
    {
      type: 'business' as const,
      icon: Globe,
      title: '🏢 Business Website Image',
      description: 'Landing page, hero image, or marketing material',
      examples: 'Website headers, brochure images, professional photos',
      aiHelp: 'AI will align content with your existing brand messaging'
    },
    {
      type: 'reference' as const,
      icon: ImageIcon,
      title: '🎨 Reference/Inspiration Image',
      description: 'Social media post, competitor content, or inspiration',
      examples: 'Instagram posts, successful campaigns, style references',
      aiHelp: 'AI will create content inspired by successful examples'
    }
  ]

  const handleFileSelect = async (file: File) => {
    if (!file) return

    setProcessing(true)
    
    try {
      // Convert to data URL for display
      const reader = new FileReader()
      reader.onload = async (e) => {
        const result = e.target?.result as string
        setSelectedPhoto(result)
        
        try {
          // Store ORIGINAL image for cropping using IndexedDB
          const resizedDataUrl = await resizeDataUrl(result, 1600)
          const resizedBlob = dataURLtoBlob(resizedDataUrl)
          await saveImageBlob('pendingImage', resizedBlob)
          localStorage.removeItem('croppedImageUrl') // Clear any previous crops
          
          // Store photo type for later use in content generation
          localStorage.setItem('photoType', photoType)
        } catch (error) {
          console.error('Error storing image in IndexedDB:', error)
          // Fallback to localStorage for compatibility
          localStorage.setItem('pendingImageUrl', result)
          localStorage.removeItem('croppedImageUrl')
          localStorage.setItem('photoType', photoType)
        }
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

  const handlePhotoTypeSelect = (type: 'experience' | 'business' | 'reference') => {
    setPhotoType(type)
    setShowTypeSelection(false)
  }

  const selectedOption = photoTypeOptions.find(option => option.type === photoType)

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
          <p className="text-gray-600">
            Choose the type of image you're uploading to help AI create the most relevant content
          </p>
        </div>

        {/* Photo Type Selection */}
        {showTypeSelection && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Choose Your Photo Type
            </h2>
            
            <div className="space-y-4">
              {photoTypeOptions.map((option) => {
                const IconComponent = option.icon
                return (
                  <div
                    key={option.type}
                    onClick={() => handlePhotoTypeSelect(option.type)}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-purple-300 ${
                      photoType === option.type
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${
                        photoType === option.type ? 'bg-purple-500' : 'bg-gray-100'
                      }`}>
                        <IconComponent 
                          size={24} 
                          className={photoType === option.type ? 'text-white' : 'text-gray-600'} 
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800 mb-1">
                          {option.title}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {option.description}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          <strong>Examples:</strong> {option.examples}
                        </p>
                        <p className="text-sm text-purple-600 font-medium">
                          💡 {option.aiHelp}
                        </p>
                      </div>
                      
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        photoType === option.type
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {photoType === option.type && (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowTypeSelection(false)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Continue with {selectedOption?.title}
              </button>
            </div>
          </div>
        )}

        {/* Selected Photo Type Info */}
        {!showTypeSelection && !selectedPhoto && selectedOption && (
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <selectedOption.icon size={20} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{selectedOption.title}</h3>
                <p className="text-sm text-gray-600">{selectedOption.description}</p>
              </div>
              <button
                onClick={() => setShowTypeSelection(true)}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Change
              </button>
            </div>
          </div>
        )}

        {/* Upload Area */}
        {!showTypeSelection && !selectedPhoto && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                📁
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Upload Your {selectedOption?.title}
              </h3>
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
                {photoType === 'experience' && (
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
                )}
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
        )}

        {/* Preview Area */}
        {!showTypeSelection && selectedPhoto && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Photo Preview</h3>
                <div className="flex items-center space-x-2">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {selectedOption?.title}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedPhoto('')
                      setShowTypeSelection(true)
                    }}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    Change Type
                  </button>
                </div>
              </div>
              <img
                src={selectedPhoto}
                alt="Selected photo"
                className="max-w-full max-h-96 mx-auto rounded-lg shadow-md"
              />
              <p className="text-sm text-gray-500 mt-2">Original image ready for cropping</p>
            </div>

            {/* AI Enhancement Preview */}
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">🤖 AI Content Enhancement</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>✅ Visual analysis for content alignment</p>
                {photoType === 'business' && <p>✅ Brand voice consistency analysis</p>}
                {photoType === 'reference' && <p>✅ Successful content pattern analysis</p>}
                <p>✅ Cultural authenticity validation</p>
                <p>✅ Platform-specific optimisation</p>
                <p>✅ New Zealand English compliance</p>
              </div>
            </div>
          </div>
        )}

        {/* Context Based on Photo Type */}
        {!showTypeSelection && selectedPhoto && (
          <>
            {photoType === 'business' && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">🏢 Business Content Enhancement</h4>
                <p className="text-sm text-blue-700">
                  AI will analyse your business image to understand your brand style, messaging, and visual identity. 
                  Generated content will align with your existing marketing materials for consistent brand voice.
                </p>
              </div>
            )}

            {photoType === 'reference' && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">🎨 Reference-Based Creation</h4>
                <p className="text-sm text-green-700">
                  AI will analyse the style, tone, and approach of your reference image to create similar 
                  high-performing content while maintaining cultural authenticity and your unique voice.
                </p>
              </div>
            )}

            {photoType === 'experience' && (
              <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">📸 Authentic Experience Content</h4>
                <p className="text-sm text-purple-700">
                  AI will analyse your personal experience photo to create authentic, emotionally resonant content 
                  that captures the genuine spirit of your New Zealand cultural tourism moment.
                </p>
              </div>
            )}
          </>
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
            disabled={!selectedPhoto || processing || showTypeSelection}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              selectedPhoto && !processing && !showTypeSelection
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
