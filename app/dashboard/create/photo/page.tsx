'use client'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { processImageWithPica, simpleFallbackProcessing } from '../../../utils/picaProcessor'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C' 
const BRAND_BLUE = '#11B3FF'

export default function PhotoFirst() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'camera'>('upload')
  const [uploading, setUploading] = useState(false)
  const [originalPhoto, setOriginalPhoto] = useState<File | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    try {
      setUploading(true)
      
      // Add small delay for iOS file readiness (Copilot's recommendation)
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Log file details for debugging
      console.log('File selected:', {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024 / 1024).toFixed(1)}MB`
      })
      
      try {
        // Try Pica processing first (mobile-optimized)
        const processed = await processImageWithPica(file)
        
        // Store processed image (no localStorage quota issues!)
        localStorage.setItem('selectedPhoto', processed.processedImage)
        setSelectedPhoto(processed.processedImage)
        setOriginalPhoto(file)
        
      } catch (picaError) {
        console.warn('Pica processing failed, trying fallback:', picaError)
        
        // Fallback to simple processing
        const fallback = await simpleFallbackProcessing(file)
        localStorage.setItem('selectedPhoto', fallback.processedImage)
        setSelectedPhoto(fallback.processedImage)
        
        if (fallback.fallback) {
          console.log('Using fallback processing')
        }
      }
      
    } catch (error) {
      console.error('All image processing failed:', error)
      
      // User-friendly error messages
      if (error instanceof Error && error.message.includes('HEIC')) {
        alert('iPhone HEIC photos are not supported. Please:\n1. Change your camera settings to JPEG, or\n2. Select a different photo')
      } else if (error instanceof Error && error.message.includes('too large')) {
        alert('Image is too large. Please choose a smaller photo (under 20MB).')
      } else {
        alert('Failed to process image. Please try:\n• A different photo\n• A smaller file size\n• JPEG or PNG format')
      }
    } finally {
      setUploading(false)
    }
  }

  const handleNext = () => {
    if (selectedPhoto) {
      // Store the photo and move to choice point
      window.location.href = '/dashboard/create/choice'
    } else {
      alert('Please add a photo before continuing.')
    }
  }

  const handleCameraCapture = () => {
    setUploadMethod('camera')
    cameraInputRef.current?.click()
  }

  const handleUpload = () => {
    setUploadMethod('upload')
    fileInputRef.current?.click()
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
          }}>2</div>
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

        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-4">
            Capture Your Amazing Moment
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            The only tourism app that works exactly how tourists actually behave: 
            <br />
            <span className="font-semibold text-gray-800">📸 See something amazing → Capture it → Share it professionally</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-8">

        {/* Photo Upload Area */}
        <div className="text-center w-full mb-12">
          {!selectedPhoto ? (
            <div className="max-w-2xl mx-auto">
              {/* Upload Options */}
              <div className="mb-8">
                <div className="inline-flex bg-gray-100 rounded-2xl p-2">
                  <button
                    type="button"
                    onClick={() => setUploadMethod('upload')}
                    className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                      uploadMethod === 'upload' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600'
                    }`}
                  >
                    <span className="mr-2">📁</span>
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMethod('camera')}
                    className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                      uploadMethod === 'camera' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600'
                    }`}
                  >
                    <span className="mr-2">📸</span>
                    Camera
                  </button>
                </div>
              </div>

              {/* Upload Zone */}
              <div 
                onClick={uploadMethod === 'camera' ? handleCameraCapture : handleUpload}
                className="border-3 border-dashed border-gray-300 rounded-3xl p-12 hover:border-gray-400 transition-all cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="text-6xl mb-6">📸</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                  {uploadMethod === 'camera' ? 'Take Photo' : 'Upload Your Photo'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {uploadMethod === 'camera' 
                    ? 'Capture the moment with your camera'
                    : 'Drop your amazing travel photo here or click to browse'
                  }
                </p>
                <button
                  disabled={uploading}
                  className={`px-8 py-4 rounded-2xl text-white font-semibold transition-all hover:scale-105 ${
                    uploading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'shadow-lg'
                  }`}
                  style={{ 
                    backgroundColor: uploading ? undefined : BRAND_PURPLE 
                  }}
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Processing...
                    </span>
                  ) : (
                    uploadMethod === 'camera' ? '📸 Open Camera' : '📁 Choose Photo'
                  )}
                </button>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Tips */}
              <div className="mt-8 text-sm text-gray-500">
                <p>💡 Tips: For best results, use JPEG or PNG format under 10MB</p>
              </div>
            </div>
          ) : (
            /* Photo Preview */
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <img 
                  src={selectedPhoto} 
                  alt="Your amazing photo" 
                  className="w-full max-h-96 object-cover rounded-3xl shadow-xl"
                />
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <span className="text-2xl">✅</span>
                  <span className="font-semibold">Perfect! Your photo is ready</span>
                </div>
                <p className="text-green-600 mt-2">
                  Now let's choose how you want to share this amazing moment
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedPhoto(null)
                  setPhotoFile(null)
                }}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                📸 Choose Different Photo
              </button>
            </div>
          )}
        </div>

        {/* Next Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleNext}
            disabled={!selectedPhoto || uploading}
            className={`text-2xl font-black px-12 py-4 rounded-2xl transition-all ${
              selectedPhoto && !uploading
                ? 'text-white shadow-2xl hover:scale-105 cursor-pointer' 
                : 'text-gray-400 bg-gray-200 cursor-not-allowed'
            }`}
            style={{
              background: selectedPhoto && !uploading
                ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                : undefined
            }}
          >
            Next: Choose Sharing Style →
          </button>
        </div>

        {/* Value Proposition */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Why Speak Click Send?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-2xl mb-2">📸</div>
              <p className="font-semibold text-gray-700">Photo First</p>
              <p className="text-gray-600">Works exactly how tourists think</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🤖</div>
              <p className="font-semibold text-gray-700">AI Enhanced</p>
              <p className="text-gray-600">Professional content creation</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🌍</div>
              <p className="font-semibold text-gray-700">Multi-Platform</p>
              <p className="text-gray-600">Share across 16+ platforms instantly</p>
            </div>
          </div>
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
