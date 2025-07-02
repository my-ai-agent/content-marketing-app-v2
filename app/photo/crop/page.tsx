'use client'

import React, { useState, useRef, useLayoutEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type CropPercentBox = {
  x: number      // 0..1
  y: number      // 0..1  
  width: number  // 0..1
  height: number // 0..1
}

interface ImageDimensions {
  width: number
  height: number
}

const CropTool: React.FC = () => {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState<string>('')
  const [cropBox, setCropBox] = useState<CropPercentBox>({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 })
  const [aspect, setAspect] = useState<number | null | string>(null)
  const [processing, setProcessing] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [resizing, setResizing] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [imgDims, setImgDims] = useState<ImageDimensions>({ width: 0, height: 0 })

  // Load image from localStorage
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const pendingImage = localStorage.getItem('pendingImageUrl')
      if (pendingImage) {
        setImageUrl(pendingImage)
      } else {
        router.push('/photo')
      }
    }
  }, [router])

  const handleImageLoad = useCallback(() => {
    if (imgRef.current) {
      const { naturalWidth, naturalHeight } = imgRef.current
      setImgDims({ width: naturalWidth, height: naturalHeight })
      console.log(`🎯 Image loaded: ${naturalWidth} x ${naturalHeight}`)
    }
  }, [])

  const aspectRatios = [
    { label: 'No Crop', value: 'none' },
    { label: 'Free', value: null },
    { label: '1:1', value: 1 },
    { label: '4:5', value: 4/5 },
    { label: '9:16', value: 9/16 },
    { label: '16:9', value: 16/9 }
  ]

  const clamp = useCallback((box: CropPercentBox, aspectRatio: number | null | string): CropPercentBox => {
    let { x, y, width, height } = box

    // Clamp to 0-1 bounds first
    x = Math.max(0, Math.min(1, x))
    y = Math.max(0, Math.min(1, y))
    width = Math.max(0.1, Math.min(1, width))
    height = Math.max(0.1, Math.min(1, height))

    // Ensure crop box stays within image bounds
    if (x + width > 1) {
      if (width <= 1) {
        x = 1 - width
      } else {
        width = 1
        x = 0
      }
    }
    
    if (y + height > 1) {
      if (height <= 1) {
        y = 1 - height
      } else {
        height = 1
        y = 0
      }
    }

    // Apply aspect ratio ONLY if it's a number (not null for "Free" or "none" for "No Crop")
    if (typeof aspectRatio === 'number' && aspectRatio > 0) {
      const currentAspect = width / height
      if (Math.abs(currentAspect - aspectRatio) > 0.01) {
        if (currentAspect > aspectRatio) {
          // Too wide, reduce width
          width = height * aspectRatio
        } else {
          // Too tall, reduce height
          height = width / aspectRatio
        }
        
        // Re-clamp after aspect ratio adjustment
        if (x + width > 1) {
          width = 1 - x
          height = width / aspectRatio
        }
        if (y + height > 1) {
          height = 1 - y
          width = height * aspectRatio
        }
      }
    }

    return { x, y, width, height }
  }, [])

  const handleAspectChange = useCallback((newAspect: number | null | string) => {
    setAspect(newAspect)
    
    if (newAspect === 'none') {
      // For "No Crop", set crop box to full image
      setCropBox({ x: 0, y: 0, width: 1, height: 1 })
    } else if (newAspect === null) {
      // For "Free", reset to landscape rectangle to differentiate from 1:1
      setCropBox({ x: 0.1, y: 0.25, width: 0.8, height: 0.5 })
    } else {
      // For specific aspect ratios, always start with a fresh standard crop box
      // This prevents the shrinking cascade effect
      const baseCrop = { x: 0.1, y: 0.1, width: 0.8, height: 0.8 }
      const targetAspect = newAspect as number
      
      // Calculate dimensions that fit the aspect ratio within the base crop area
      let newWidth = baseCrop.width
      let newHeight = baseCrop.height
      
      const baseAspect = newWidth / newHeight
      
      if (baseAspect > targetAspect) {
        // Base is too wide, adjust width to match target aspect
        newWidth = newHeight * targetAspect
      } else {
        // Base is too tall, adjust height to match target aspect  
        newHeight = newWidth / targetAspect
      }
      
      // Center the crop box in the image
      const newX = 0.5 - newWidth / 2
      const newY = 0.5 - newHeight / 2
      
      setCropBox(clamp({ x: newX, y: newY, width: newWidth, height: newHeight }, newAspect))
    }
  }, [clamp])

  const getCoordinatesFromEvent = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 }
    
    const rect = containerRef.current.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    const x = (clientX - rect.left) / rect.width
    const y = (clientY - rect.top) / rect.height
    
    return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) }
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent, action: string) => {
    e.preventDefault()
    e.stopPropagation()
    const coords = getCoordinatesFromEvent(e)
    
    if (action === 'drag') {
      setDragging(true)
      setDragOffset({
        x: coords.x - cropBox.x,
        y: coords.y - cropBox.y
      })
    } else {
      setResizing(action)
    }
  }, [cropBox, getCoordinatesFromEvent])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging && !resizing) return
    
    const coords = getCoordinatesFromEvent(e)
    
    if (dragging) {
      const newX = coords.x - dragOffset.x
      const newY = coords.y - dragOffset.y
      setCropBox(prev => clamp({ ...prev, x: newX, y: newY }, aspect))
    }
    
    if (resizing) {
      setCropBox(prev => {
        let newBox = { ...prev }
        
        if (resizing.includes('right')) {
          newBox.width = Math.max(0.1, coords.x - prev.x)
        }
        if (resizing.includes('left')) {
          const newWidth = Math.max(0.1, prev.x + prev.width - coords.x)
          newBox.x = prev.x + prev.width - newWidth
          newBox.width = newWidth
        }
        if (resizing.includes('bottom')) {
          newBox.height = Math.max(0.1, coords.y - prev.y)
        }
        if (resizing.includes('top')) {
          const newHeight = Math.max(0.1, prev.y + prev.height - coords.y)
          newBox.y = prev.y + prev.height - newHeight
          newBox.height = newHeight
        }
        
        return clamp(newBox, aspect)
      })
    }
  }, [dragging, resizing, dragOffset, aspect, clamp, getCoordinatesFromEvent])

  const handleMouseUp = useCallback(() => {
    setDragging(false)
    setResizing(null)
  }, [])

  const handleApplyCrop = useCallback(async () => {
    if (!imageUrl || !imgRef.current) return

    // Check for "No Crop" option first
    if (aspect === 'none') {
      console.log('📸 No Crop selected - using original image')
      localStorage.setItem('croppedImageUrl', imageUrl)
      router.push('/photo/results')
      return
    }

    setProcessing(true)

    try {
      console.log('🎯 Percentage crop box:', cropBox)
      
      // Convert percentage crop box to natural image pixels
      const sx = Math.round(cropBox.x * imgDims.width)
      const sy = Math.round(cropBox.y * imgDims.height)
      const sw = Math.round(cropBox.width * imgDims.width)
      const sh = Math.round(cropBox.height * imgDims.height)
      
      console.log('🔧 Natural image pixels:', { sx, sy, sw, sh })

      // Create canvas for crop
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas context not available')

      // Set canvas to crop size
      canvas.width = sw
      canvas.height = sh

      // Create image for cropping
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          // Draw cropped portion
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh)
          
          // Convert to data URL
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
          
          // Store result
          localStorage.setItem('croppedImageUrl', dataUrl)
          
          console.log('✅ Percentage-based crop successful!')
          resolve()
        }
        img.onerror = reject
        img.src = imageUrl
      })

      router.push('/photo/results')
      
    } catch (error) {
      console.error('❌ Crop failed:', error)
      alert('Crop failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }, [imageUrl, cropBox, imgDims, aspect, router])

  if (!imageUrl) {
    return <div className="p-8 text-center">Loading image...</div>
  }

  if (aspect === 'none') {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="bg-white p-4 flex justify-between items-center">
          <Link href="/photo" className="text-blue-600 hover:text-blue-800">
            ← Back
          </Link>
          <h2 className="text-lg font-semibold">No Crop Selected</h2>
          <div></div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center text-white">
            <img 
              src={imageUrl} 
              alt="Original" 
              className="max-w-full max-h-96 mx-auto mb-4 rounded-lg"
            />
            <p className="mb-6">Using original image without cropping</p>
            <button
              onClick={handleApplyCrop}
              disabled={processing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 transition-colors"
            >
              {processing ? 'Processing...' : 'Continue with Original'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex justify-between items-center">
        <Link href="/photo" className="text-blue-600 hover:text-blue-800">
          ← Back
        </Link>
        <h2 className="text-lg font-semibold">Crop Your Photo</h2>
        <div></div>
      </div>

      {/* Aspect Ratio Controls */}
      <div className="bg-white border-b p-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {aspectRatios.map((ratio) => (
            <button
              key={ratio.label}
              onClick={() => handleAspectChange(ratio.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                aspect === ratio.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {ratio.label}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Area */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={containerRef}
          className="absolute inset-0 flex items-center justify-center"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={imgRef}
            src={imageUrl}
            alt="Crop preview"
            onLoad={handleImageLoad}
            className="max-w-full max-h-full object-contain select-none"
            draggable={false}
          />
          
          {/* Crop Overlay */}
          <div className="absolute inset-0">
            {/* Crop Box */}
            <div
              className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-10 cursor-move"
              style={{
                left: `${cropBox.x * 100}%`,
                top: `${cropBox.y * 100}%`,
                width: `${cropBox.width * 100}%`,
                height: `${cropBox.height * 100}%`,
              }}
              onMouseDown={(e) => handleMouseDown(e, 'drag')}
            >
              {/* Corner Resize Handles */}
              {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((handle) => (
                <div
                  key={handle}
                  className={`absolute w-3 h-3 bg-blue-500 border border-white cursor-${handle.includes('left') ? (handle.includes('top') ? 'nw' : 'sw') : (handle.includes('top') ? 'ne' : 'se')}-resize`}
                  style={{
                    top: handle.includes('top') ? '-6px' : 'auto',
                    bottom: handle.includes('bottom') ? '-6px' : 'auto',
                    left: handle.includes('left') ? '-6px' : 'auto',
                    right: handle.includes('right') ? '-6px' : 'auto',
                  }}
                  onMouseDown={(e) => handleMouseDown(e, handle)}
                />
              ))}
              
              {/* Edge Handles */}
              {['top', 'right', 'bottom', 'left'].map((edge) => (
                <div
                  key={edge}
                  className={`absolute bg-blue-500 cursor-${edge === 'top' || edge === 'bottom' ? 'ns' : 'ew'}-resize`}
                  style={{
                    top: edge === 'top' ? '-2px' : edge === 'bottom' ? 'auto' : '25%',
                    bottom: edge === 'bottom' ? '-2px' : edge === 'top' ? 'auto' : '25%',
                    left: edge === 'left' ? '-2px' : edge === 'right' ? 'auto' : '25%',
                    right: edge === 'right' ? '-2px' : edge === 'left' ? 'auto' : '25%',
                    width: edge === 'left' || edge === 'right' ? '4px' : '50%',
                    height: edge === 'top' || edge === 'bottom' ? '4px' : '50%',
                  }}
                  onMouseDown={(e) => handleMouseDown(e, edge)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-white p-4 border-t">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push('/photo')}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyCrop}
            disabled={processing}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
          >
            {processing ? 'Processing...' : 'Apply Crop'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CropPage() {
  return <CropTool />
}
