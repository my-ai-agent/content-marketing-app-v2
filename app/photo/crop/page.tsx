'use client'

import React, { useState, useRef, useLayoutEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { saveImageBlob, dataURLtoBlob, resizeDataUrl } from '@/lib/imageStorage'

type CropPercentBox = {
  x: number // 0-1
  y: number // 0-1  
  width: number // 0-1
  height: number // 0-1
}

const MAX_IMG_DIM = 1600; // Resize before storage for quota safety
const CROPPED_IMAGE_KEY = 'croppedImageBlob';

const CropPage: React.FC = () => {
  const router = useRouter()
  
  // Image and crop state
  const [imageDataUrl, setImageDataUrl] = useState<string>('')
  const [naturalDimensions, setNaturalDimensions] = useState({ width: 0, height: 0 })
  const [cropBox, setCropBox] = useState<CropPercentBox>({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 })
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Container and interaction state
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeHandle, setResizeHandle] = useState<string>('')
  const [activeRatio, setActiveRatio] = useState<string>('Free')

  // Load image from localStorage on mount
  useLayoutEffect(() => {
    const storedImage = localStorage.getItem('uploadedImage')
    if (storedImage) {
      setImageDataUrl(storedImage)
      
      const img = new window.Image()
      img.onload = () => setNaturalDimensions({ width: img.naturalWidth, height: img.naturalHeight })
      img.src = storedImage
    }
  }, [])

  // Update container size on layout changes
  useLayoutEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerSize({ width: rect.width, height: rect.height })
      }
    }

    updateContainerSize()
    window.addEventListener('resize', updateContainerSize)
    return () => window.removeEventListener('resize', updateContainerSize)
  }, [imageDataUrl])

  // Aspect ratio configurations
  const aspectRatios = [
    { name: 'No Crop', ratio: null, description: 'Keep original dimensions' },
    { name: 'Free', ratio: 0, description: 'Custom crop area' },
    { name: '1:1', ratio: 1, description: 'Square - Instagram posts' },
    { name: '4:5', ratio: 4/5, description: 'Portrait - Instagram posts' },
    { name: '9:16', ratio: 9/16, description: 'Vertical - Stories/Reels' },
    { name: '16:9', ratio: 16/9, description: 'Landscape - YouTube' }
  ]

  // Clamp crop box to container bounds with aspect ratio
  const clamp = useCallback((box: CropPercentBox, aspectRatio?: number): CropPercentBox => {
    let { x, y, width, height } = box

    // Apply aspect ratio constraint if specified
    if (aspectRatio && aspectRatio > 0) {
      height = width / aspectRatio
    }

    // Clamp to bounds
    if (x + width > 1) x = 1 - width
    if (y + height > 1) y = 1 - height
    if (x < 0) x = 0
    if (y < 0) y = 0
    if (width > 1) width = 1
    if (height > 1) height = 1

    return { x, y, width, height }
  }, [])

  // Handle aspect ratio selection
  const handleAspectRatio = useCallback((ratioName: string, ratio: number | null) => {
    setActiveRatio(ratioName)
    
    if (ratio === null) return // No Crop
    
    // Start with fresh base crop for each ratio change
    const baseCrop = { x: 0.1, y: 0.1, width: 0.8, height: 0.8 }
    
    if (ratio === 0) {
      // Free mode - use base crop as-is
      setCropBox(baseCrop)
    } else {
      // Apply specific aspect ratio to base crop
      const newCrop = clamp(baseCrop, ratio)
      setCropBox(newCrop)
    }
  }, [clamp])

  // Mouse/touch event handlers
  const getEventPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    if (!containerRef.current) return { x: 0, y: 0 }
    
    const rect = containerRef.current.getBoundingClientRect()
    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height
    }
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const pos = getEventPos(e)
    const target = e.target as HTMLElement
    
    if (target.dataset.handle) {
      setIsResizing(true)
      setResizeHandle(target.dataset.handle)
    } else {
      setIsDragging(true)
    }
    
    setDragStart(pos)
  }, [getEventPos])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const pos = getEventPos(e)
    const deltaX = pos.x - dragStart.x
    const deltaY = pos.y - dragStart.y

    if (isDragging) {
      setCropBox(prev => clamp({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
        width: prev.width,
        height: prev.height
      }, activeRatio === 'Free' ? 0 : aspectRatios.find(r => r.name === activeRatio)?.ratio))
      
      setDragStart(pos)
    } else if (isResizing && resizeHandle) {
      setCropBox(prev => {
        let newBox = { ...prev }
        
        switch (resizeHandle) {
          case 'nw':
            newBox.width += newBox.x - pos.x
            newBox.height += newBox.y - pos.y
            newBox.x = pos.x
            newBox.y = pos.y
            break
          case 'ne':
            newBox.width = pos.x - newBox.x
            newBox.height += newBox.y - pos.y
            newBox.y = pos.y
            break
          case 'sw':
            newBox.width += newBox.x - pos.x
            newBox.height = pos.y - newBox.y
            newBox.x = pos.x
            break
          case 'se':
            newBox.width = pos.x - newBox.x
            newBox.height = pos.y - newBox.y
            break
        }

        return clamp(newBox, activeRatio === 'Free' ? 0 : aspectRatios.find(r => r.name === activeRatio)?.ratio)
      })
      
      setDragStart(pos)
    }
  }, [isDragging, isResizing, resizeHandle, dragStart, getEventPos, clamp, activeRatio, aspectRatios])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeHandle('')
  }, [])

  // Apply crop and save to IndexedDB
  const handleApplyCrop = useCallback(async () => {
    if (!imageDataUrl || !naturalDimensions.width || !naturalDimensions.height) return

    setIsProcessing(true)
    console.log('🎯 Starting crop process...')

    try {
      // Convert percentage crop box to pixel coordinates
      const pixelCrop = {
        x: Math.round(cropBox.x * naturalDimensions.width),
        y: Math.round(cropBox.y * naturalDimensions.height),
        width: Math.round(cropBox.width * naturalDimensions.width),
        height: Math.round(cropBox.height * naturalDimensions.height)
      }

      console.log('🎯 Percentage crop box:', cropBox)
      console.log('🔧 Natural image pixels:', naturalDimensions)
      console.log('🔧 Pixel crop coordinates:', pixelCrop)

      // Create canvas and apply crop
      const canvas = document.createElement('canvas')
      canvas.width = pixelCrop.width
      canvas.height = pixelCrop.height
      
      const ctx = canvas.getContext('2d')!
      const img = new window.Image()
      
      await new Promise((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(
            img,
            pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
            0, 0, pixelCrop.width, pixelCrop.height
          )
          resolve(void 0)
        }
        img.onerror = reject
        img.src = imageDataUrl
      })

      // Get cropped image as data URL
      let croppedDataUrl = canvas.toDataURL('image/jpeg', 0.8)
      console.log('🔧 Initial crop size:', (croppedDataUrl.length / 1024 / 1024).toFixed(2), 'MB')

      // Resize if too large (for storage efficiency)
      if (pixelCrop.width > MAX_IMG_DIM || pixelCrop.height > MAX_IMG_DIM) {
        console.log('🔧 Resizing large crop for storage...')
        croppedDataUrl = await resizeDataUrl(croppedDataUrl, MAX_IMG_DIM)
        console.log('🔧 Resized crop size:', (croppedDataUrl.length / 1024 / 1024).toFixed(2), 'MB')
      }

      // Convert to Blob and save to IndexedDB
      const blob = dataURLtoBlob(croppedDataUrl)
      await saveImageBlob(CROPPED_IMAGE_KEY, blob)

      console.log('✅ Percentage-based crop successful!')
      router.push('/photo/results')
      
    } catch (error) {
      console.error('❌ Crop process failed:', error)
      alert('Failed to process image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }, [imageDataUrl, naturalDimensions, cropBox, router])

  // Handle "Continue with Original"
  const handleContinueOriginal = useCallback(async () => {
    if (!imageDataUrl) return

    setIsProcessing(true)
    console.log('🎯 Continuing with original image...')

    try {
      // Resize original if needed
      let processedDataUrl = imageDataUrl
      if (naturalDimensions.width > MAX_IMG_DIM || naturalDimensions.height > MAX_IMG_DIM) {
        console.log('🔧 Resizing original for storage...')
        processedDataUrl = await resizeDataUrl(imageDataUrl, MAX_IMG_DIM)
      }

      // Convert to Blob and save to IndexedDB
      const blob = dataURLtoBlob(processedDataUrl)
      await saveImageBlob(CROPPED_IMAGE_KEY, blob)

      console.log('✅ Original image saved successfully!')
      router.push('/photo/results')
      
    } catch (error) {
      console.error('❌ Failed to save original:', error)
      alert('Failed to process image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }, [imageDataUrl, naturalDimensions, router])

  if (!imageDataUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 mb-4">No image found</div>
          <Link href="/photo" className="text-blue-600 hover:text-blue-800 underline">
            ← Back to Upload
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Crop Your Photo</h1>
              <p className="text-gray-600 mt-1">Select the perfect crop for your content</p>
            </div>
            <Link href="/photo" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Crop Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div 
                ref={containerRef}
                className="relative w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden cursor-move select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Background Image */}
                <img
                  src={imageDataUrl}
                  alt="Crop preview"
                  className="w-full h-full object-contain"
                  draggable={false}
                />

                {/* Crop Overlay */}
                {containerSize.width > 0 && (
                  <>
                    {/* Dark overlay outside crop area */}
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-40 pointer-events-none"
                      style={{
                        clipPath: `polygon(
                          0% 0%, 
                          ${cropBox.x * 100}% 0%, 
                          ${cropBox.x * 100}% ${cropBox.y * 100}%, 
                          ${(cropBox.x + cropBox.width) * 100}% ${cropBox.y * 100}%, 
                          ${(cropBox.x + cropBox.width) * 100}% 0%, 
                          100% 0%, 
                          100% 100%, 
                          ${(cropBox.x + cropBox.width) * 100}% 100%, 
                          ${(cropBox.x + cropBox.width) * 100}% ${(cropBox.y + cropBox.height) * 100}%, 
                          ${cropBox.x * 100}% ${(cropBox.y + cropBox.height) * 100}%, 
                          ${cropBox.x * 100}% 100%, 
                          0% 100%
                        )`
                      }}
                    />

                    {/* Crop box border */}
                    <div
                      className="absolute border-2 border-white shadow-lg pointer-events-none"
                      style={{
                        left: `${cropBox.x * 100}%`,
                        top: `${cropBox.y * 100}%`,
                        width: `${cropBox.width * 100}%`,
                        height: `${cropBox.height * 100}%`
                      }}
                    />

                    {/* Resize handles */}
                    {['nw', 'ne', 'sw', 'se'].map((handle) => (
                      <div
                        key={handle}
                        data-handle={handle}
                        className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-pointer hover:bg-blue-50 transition-colors"
                        style={{
                          left: `${(cropBox.x + (handle.includes('e') ? cropBox.width : 0)) * 100}%`,
                          top: `${(cropBox.y + (handle.includes('s') ? cropBox.height : 0)) * 100}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Crop Controls */}
          <div className="space-y-6">
            {/* Aspect Ratios */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Crop Ratios</h3>
              <div className="space-y-3">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.name}
                    onClick={() => handleAspectRatio(ratio.name, ratio.ratio)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      activeRatio === ratio.name
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-medium">{ratio.name}</div>
                    <div className="text-sm opacity-75">{ratio.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                {activeRatio === 'No Crop' ? (
                  <button
                    onClick={handleContinueOriginal}
                    disabled={isProcessing}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    {isProcessing ? 'Processing...' : 'Continue with Original'}
                  </button>
                ) : (
                  <button
                    onClick={handleApplyCrop}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    {isProcessing ? 'Processing...' : 'Apply Crop'}
                  </button>
                )}
                
                <Link
                  href="/photo"
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors text-center block"
                >
                  Start Over
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CropPage
