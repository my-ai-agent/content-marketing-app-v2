'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cropper from 'react-easy-crop'
import { getImageBlob, saveImageBlob, dataURLtoBlob } from '@/lib/imageStorage'

const PhotoCropPage: React.FC = () => {
  const router = useRouter()
  const [imageSrc, setImageSrc] = useState<string>('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [showCropper, setShowCropper] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load image from IndexedDB
  useEffect(() => {
    const loadImage = async () => {
      try {
        const imageBlob = await getImageBlob('pendingImage')
        if (imageBlob) {
          const dataUrl = URL.createObjectURL(imageBlob)
          setImageSrc(dataUrl)
        } else {
          // Fallback to localStorage
          const fallbackImage = localStorage.getItem('pendingImageUrl')
          if (fallbackImage) {
            setImageSrc(fallbackImage)
          }
        }
      } catch (error) {
        console.error('Error loading image:', error)
        // Fallback to localStorage
        const fallbackImage = localStorage.getItem('pendingImageUrl')
        if (fallbackImage) {
          setImageSrc(fallbackImage)
        }
      } finally {
        setLoading(false)
      }
    }

    loadImage()
  }, [])

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createCroppedImage = async () => {
    if (!croppedAreaPixels || !imageSrc) return null

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const image = new Image()

    return new Promise<string>((resolve) => {
      image.onload = () => {
        canvas.width = croppedAreaPixels.width
        canvas.height = croppedAreaPixels.height

        ctx?.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        )

        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      image.src = imageSrc
    })
  }

  const handleNoCrop = async () => {
    try {
      // Save original image as cropped result
      const imageBlob = await getImageBlob('pendingImage')
      if (imageBlob) {
        await saveImageBlob('croppedImage', imageBlob)
      } else {
        // Fallback: convert from localStorage
        const fallbackImage = localStorage.getItem('pendingImageUrl')
        if (fallbackImage) {
          const blob = dataURLtoBlob(fallbackImage)
          await saveImageBlob('croppedImage', blob)
        }
      }
      localStorage.setItem('croppedImageUrl', imageSrc) // For compatibility
      router.push('/story')
    } catch (error) {
      console.error('Error saving original image:', error)
      // Fallback to localStorage
      localStorage.setItem('croppedImageUrl', imageSrc)
      router.push('/story')
    }
  }

  const handleApplyCrop = async () => {
    try {
      const croppedDataUrl = await createCroppedImage()
      if (croppedDataUrl) {
        // Save cropped image to IndexedDB
        const croppedBlob = dataURLtoBlob(croppedDataUrl)
        await saveImageBlob('croppedImage', croppedBlob)
        localStorage.setItem('croppedImageUrl', croppedDataUrl) // For compatibility
        router.push('/story')
      }
    } catch (error) {
      console.error('Error creating cropped image:', error)
    }
  }

  const handleBack = () => {
    router.push('/photo')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  if (!imageSrc) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-600 mb-4">No image found</div>
          <button
            onClick={handleBack}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress indicator */}
      <div className="flex justify-center pt-8 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
            1
          </div>
          <div className="w-8 h-1 bg-green-500"></div>
          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
            2
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

      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Crop Your Photo</h1>
          <p className="text-gray-600">Focus on what matters most in your story</p>
        </div>

        {/* Simple choice buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setShowCropper(false)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              !showCropper
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            No Crop
          </button>
          <button
            onClick={() => setShowCropper(true)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              showCropper
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Free Crop
          </button>
        </div>

        {/* Image display area */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {showCropper ? (
            <div className="relative h-96 w-full">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                style={{
                  containerStyle: {
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                  },
                }}
              />
            </div>
          ) : (
            <div className="text-center">
              <img
                src={imageSrc}
                alt="Original photo"
                className="max-w-full max-h-96 mx-auto rounded-lg shadow-md"
              />
              <p className="text-sm text-gray-500 mt-4">Original image - no cropping applied</p>
            </div>
          )}
        </div>

        {/* Zoom control for cropper */}
        {showCropper && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zoom: {zoom.toFixed(1)}x
            </label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            ← Back
          </button>

          <button
            onClick={showCropper ? handleApplyCrop : handleNoCrop}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white rounded-lg font-medium transition-colors"
          >
            Continue →
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
      </div>
    </div>
  )
}

export default PhotoCropPage
