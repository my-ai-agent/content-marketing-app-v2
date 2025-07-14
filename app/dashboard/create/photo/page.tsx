'use client'
import Link from 'next/link'
import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Camera, Globe, ImageIcon } from 'lucide-react'

// Dynamically import CropTool in case it uses browser APIs at the module level
const CropTool = dynamic(() => import('./CropTool'), { ssr: false })

// Simple IndexedDB helper
const saveToIndexedDB = async (key: string, data: any) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ClickSpeakSendDB', 1)
    
    request.onerror = () => reject(request.error)
    
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['photos'], 'readwrite')
      const store = transaction.objectStore('photos')
      store.put({ id: key, data })
      
      transaction.oncomplete = () => resolve(true)
      transaction.onerror = () => reject(transaction.error)
    }
    
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains('photos')) {
        db.createObjectStore('photos', { keyPath: 'id' })
      }
    }
  })
}

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

export type PhotoType = 'experience' | 'business' | 'reference'

export default function PhotoUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showCrop, setShowCrop] = useState(false)
  const [photoType, setPhotoType] = useState<PhotoType | null>(null)
  const [showTypeSelection, setShowTypeSelection] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const photoTypeOptions = [
    {
      type: 'experience' as PhotoType,
      icon: Camera,
      title: 'Experience Photo',
      description: 'Your personal travel or tourism experience photo',
      aiHelp: 'Claude will analyse your experience and create authentic, engaging content that captures your personal journey and cultural encounters.'
    },
    {
      type: 'business' as PhotoType,
      icon: Globe,
      title: 'Business Website Image',
      description: 'Landing page, hero image, or marketing material from your business website',
      aiHelp: 'Claude will analyse your brand visual elements and create content that maintains brand consistency while adding cultural intelligence and authentic storytelling.'
    },
    {
      type: 'reference' as PhotoType,
      icon: ImageIcon,
      title: 'Reference/Inspiration Image',
      description: 'Social media post, competitor content, or inspirational material to guide content style',
      aiHelp: 'Claude will analyse the visual style and messaging approach, then create original content inspired by successful patterns while maintaining your unique voice.'
    }
  ]

  const handlePhotoTypeSelection = (type: PhotoType) => {
    setPhotoType(type)
    setShowTypeSelection(false)
    // Store photo type for later Claude prompt enhancement
    localStorage.setItem('photoType', type)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setShowCrop(true)
    }
  }

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    try {
      // Save to IndexedDB
      await saveToIndexedDB('userPhoto', croppedImageBlob)
      
      // Save to localStorage for immediate access
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        localStorage.setItem('userPhoto', base64)
        localStorage.setItem('photoType', photoType || 'experience')
      }
      reader.readAsDataURL(croppedImageBlob)
      
      // Continue to next step
      // Note: This would typically route to the next step in your flow
      console.log('Photo saved successfully with type:', photoType)
      
    } catch (error) {
      console.error('Error saving photo:', error)
      alert('Error saving photo. Please try again.')
    }
  }

  const changePhotoType = () => {
    setShowTypeSelection(true)
    setPhotoType(null)
    setSelectedFile(null)
    setPreviewUrl(null)
    setShowCrop(false)
  }

  if (showTypeSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center space-x-2 mb-4">
              {[1,2,3,4,5,6].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === 1 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Choose Your Photo Type</h1>
            <p className="text-gray-600 mt-2">Select the type of image you'd like to share for optimal AI content creation</p>
          </div>

          {/* Photo Type Options */}
          <div className="space-y-4">
            {photoTypeOptions.map((option) => {
              const IconComponent = option.icon
              return (
                <button
                  key={option.type}
                  onClick={() => handlePhotoTypeSelection(option.type)}
                  className="w-full p-6 bg-white rounded-xl shadow-sm border-2 border-gray-100 hover:border-purple-300 hover:shadow-md transition-all duration-200 text-left"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-2">{option.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-blue-700">
                          <strong>AI Enhancement:</strong> {option.aiHelp}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Link 
              href="/dashboard"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              ← Back
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (showCrop && selectedFile && previewUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center space-x-2 mb-4">
              {[1,2,3,4,5,6].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === 1 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Crop Your {photoType === 'experience' ? 'Experience' : photoType === 'business' ? 'Business' : 'Reference'} Photo</h1>
            <button 
              onClick={changePhotoType}
              className="text-purple-600 text-sm mt-2 hover:underline"
            >
              Change photo type
            </button>
          </div>

          {/* Crop Tool */}
          <CropTool
            imageUrl={previewUrl}
            onCropComplete={handleCropComplete}
            onCancel={() => {
              setShowCrop(false)
              setSelectedFile(null)
              setPreviewUrl(null)
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-2 mb-4">
            {[1,2,3,4,5,6].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === 1 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Upload Your {photoType === 'experience' ? 'Experience' : photoType === 'business' ? 'Business' : 'Reference'} Photo
          </h1>
          <button 
            onClick={changePhotoType}
            className="text-purple-600 text-sm mt-2 hover:underline"
          >
            Change photo type
          </button>
        </div>

        {/* Photo Type Context */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          {photoType === 'experience' && (
            <div className="flex items-center space-x-3">
              <Camera className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-800">Experience Photo Selected</h3>
                <p className="text-sm text-gray-600">Claude will create authentic content from your personal travel experience</p>
              </div>
            </div>
          )}
          {photoType === 'business' && (
            <div className="flex items-center space-x-3">
              <Globe className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-800">Business Content Selected</h3>
                <p className="text-sm text-gray-600">Claude will maintain brand consistency while adding cultural intelligence</p>
              </div>
            </div>
          )}
          {photoType === 'reference' && (
            <div className="flex items-center space-x-3">
              <ImageIcon className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-800">Reference Content Selected</h3>
                <p className="text-sm text-gray-600">Claude will create original content inspired by successful patterns</p>
              </div>
            </div>
          )}
        </div>

        {/* Upload Options */}
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture={photoType === 'experience' ? 'environment' : undefined}
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <button
            onClick={handleCameraCapture}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            📸 {photoType === 'experience' ? 'Take Photo' : 'Upload Photo'}
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 bg-white text-gray-700 rounded-xl font-medium border-2 border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200"
          >
            📁 Choose from Gallery
          </button>
        </div>

        {/* AI Enhancement Preview */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 mb-2">🤖 AI Enhancement Preview</h3>
          <p className="text-sm text-blue-700">
            {photoType === 'experience' && "Your experience photo will be analysed for location, activities, and cultural elements to create compelling, authentic travel content."}
            {photoType === 'business' && "Your business image will be analysed for brand colours, style, and messaging to create content that aligns with your existing marketing materials."}
            {photoType === 'reference' && "Your reference image will be analysed for successful patterns, style elements, and engagement tactics to inspire original content creation."}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button 
            onClick={changePhotoType}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            ← Change Type
          </button>
        </div>
      </div>
    </div>
  )
}
