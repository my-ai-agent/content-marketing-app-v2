'use client'
import React, { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Types - Percentage-based coordinates (Copilot's solution)
type CropPercentBox = { x: number; y: number; width: number; height: number } // all 0..1
type ResizeDir = null | 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

// Utility for touch/mouse coordinate extraction (Your existing code)
function getClientPos(e: MouseEvent | TouchEvent) {
  let clientX = 0, clientY = 0
  if ('touches' in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  } else if ('clientX' in e) {
    clientX = (e as MouseEvent).clientX
    clientY = (e as MouseEvent).clientY
  }
  return { clientX, clientY }
}

// Data URL validation utility (Your existing code)
function isValidDataURL(dataUrl: string): boolean {
  if (!dataUrl || typeof dataUrl !== 'string') return false
  if (!dataUrl.startsWith('data:image/')) return false
  
  const base64Part = dataUrl.split(',')[1]
  if (!base64Part || base64Part.length < 100) {
    console.warn('⚠️ Data URL too short, likely invalid:', dataUrl.length)
    return false
  }
  
  return true
}

// Your existing handles configuration
const handles = [
  { dir: 'n', top: -8, left: '50%', cursor: 'ns-resize', style: { transform: 'translate(-50%, -50%)' } },
  { dir: 's', top: '100%', left: '50%', cursor: 'ns-resize', style: { transform: 'translate(-50%, 50%)' } },
  { dir: 'e', top: '50%', left: '100%', cursor: 'ew-resize', style: { transform: 'translate(50%, -50%)' } },
  { dir: 'w', top: '50%', left: -8, cursor: 'ew-resize', style: { transform: 'translate(-50%, -50%)' } },
  { dir: 'ne', top: -8, left: '100%', cursor: 'nesw-resize', style: { transform: 'translate(50%, -50%)' } },
  { dir: 'nw', top: -8, left: -8, cursor: 'nwse-resize', style: { transform: 'translate(-50%, -50%)' } },
  { dir: 'se', top: '100%', left: '100%', cursor: 'nwse-resize', style: { transform: 'translate(50%, 50%)' } },
  { dir: 'sw', top: '100%', left: -8, cursor: 'nesw-resize', style: { transform: 'translate(-50%, 50%)' } },
] as const

// Your existing aspect ratios (including "No Crop")
const aspectRatios = [
  { name: "No Crop", value: "none" },
  { name: "Free", value: null },
  { name: "1:1", value: 1 },
  { name: "4:3", value: 4 / 3 },
  { name: "3:4", value: 3 / 4 },
  { name: "16:9", value: 16 / 9 },
]

const MIN_SIZE_PERCENT = 0.05 // 5% minimum size as percentage

// Enhanced CropTool Component (Your UX + Copilot's Coordinates)
const CropTool: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const router = useRouter()
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Store natural image dimensions
  const [imgDims, setImgDims] = useState({ width: 1, height: 1 })
  const [displayDims, setDisplayDims] = useState({ width: 1, height: 1 })
  
  // COPILOT'S FIX: Store crop box as percentages (0-1) instead of pixels
  const [cropBox, setCropBox] = useState<CropPercentBox>({ 
    x: 0.1, y: 0.1, width: 0.8, height: 0.8 
  })
  
  const [dragging, setDragging] = useState(false)
  const [resizing, setResizing] = useState<ResizeDir>(null)
  const [aspect, setAspect] = useState<number | null | string>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [draggingState, setDraggingState] = useState<null | { startX: number; startY: number; startCrop: CropPercentBox }>(null)
  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // Update displayDims when image or container is rendered (Copilot's approach)
  useEffect(() => {
    function updateDims() {
      if (imgRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDisplayDims({ width: rect.width, height: rect.height })
      }
    }
    updateDims()
    window.addEventListener("resize", updateDims)
    return () => window.removeEventListener("resize", updateDims)
  }, [imageUrl])

  // Set image dimensions on load
  useEffect(() => {
    const img = imgRef.current
    if (img) {
      const setDims = () => {
        console.log('🖼️ Image loaded:', img.naturalWidth, 'x', img.naturalHeight)
        setImgDims({ width: img.naturalWidth, height: img.naturalHeight })
      }
      img.onload = setDims
      img.onerror = () => {
        console.error('❌ Failed to load image in CropTool')
      }
      if (img.complete && img.naturalWidth > 0) setDims()
    }
  }, [imageUrl])

  // COPILOT'S FIX: Clamp crop box within bounds using percentages
  function clampPercentage(box: CropPercentBox): CropPercentBox {
    let { x, y, width, height } = box

    // Enforce min size as percentage
    width = Math.max(width, MIN_SIZE_PERCENT)
    height = Math.max(height, MIN_SIZE_PERCENT)

    // Enforce aspect ratio if set (only for numeric values)
    if (aspect && aspect !== "none" && typeof aspect === 'number') {
      const currentAspect = width / height
      if (Math.abs(currentAspect - aspect) > 0.01) {
        if (currentAspect > aspect) {
          width = height * aspect
        } else {
          height = width / aspect
        }
      }
    }

    // Clamp to bounds (percentages 0-1)
    x = Math.max(0, Math.min(1 - width, x))
    y = Math.max(0, Math.min(1 - height, y))
    
    // Final validation
    if (x + width > 1) width = 1 - x
    if (y + height > 1) height = 1 - y
    
    return { x, y, width, height }
  }

  // COPILOT'S FIX: Drag and resize logic using percentage coordinates
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const pointer = "touches" in e ? e.touches[0] : (e as React.MouseEvent)
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const px = (pointer.clientX - rect.left) / rect.width
    const py = (pointer.clientY - rect.top) / rect.height
    setDraggingState({ startX: px, startY: py, startCrop: { ...cropBox } })
  }

  const [draggingState, setDragging] = useState<null | { startX: number; startY: number; startCrop: CropPercentBox }>(null)

  const handlePointerMove = React.useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!draggingState && !resizing) return
      const pointer = "touches" in e && e.touches.length > 0 ? e.touches[0] : "clientX" in e ? (e as MouseEvent) : null
      if (!pointer || !containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const px = (pointer.clientX - rect.left) / rect.width
      const py = (pointer.clientY - rect.top) / rect.height
      
      if (draggingState) {
        const dx = px - draggingState.startX
        const dy = py - draggingState.startY
        let newCrop = {
          x: Math.max(0, Math.min(1 - cropBox.width, draggingState.startCrop.x + dx)),
          y: Math.max(0, Math.min(1 - cropBox.height, draggingState.startCrop.y + dy)),
          width: cropBox.width,
          height: cropBox.height,
        }
        setCropBox(clampPercentage(newCrop))
      }
      
      if (resizing) {
        // Convert pixel deltas to percentage deltas for resizing
        const dx = (pointer.clientX - lastPos.current.x) / rect.width
        const dy = (pointer.clientY - lastPos.current.y) / rect.height
        lastPos.current = { x: pointer.clientX, y: pointer.clientY }

        setCropBox(prev => {
          let { x, y, width, height } = prev
          switch (resizing) {
            case 'n':
              y += dy
              height -= dy
              break
            case 's':
              height += dy
              break
            case 'e':
              width += dx
              break
            case 'w':
              x += dx
              width -= dx
              break
            case 'ne':
              y += dy
              height -= dy
              width += dx
              break
            case 'nw':
              y += dy
              height -= dy
              x += dx
              width -= dx
              break
            case 'se':
              width += dx
              height += dy
              break
            case 'sw':
              x += dx
              width -= dx
              height += dy
              break
          }
          return clampPercentage({ x, y, width, height })
        })
      }
    },
    [draggingState, resizing, cropBox.width, cropBox.height]
  )

  const handlePointerUp = React.useCallback(() => {
    setDraggingState(null)
    setResizing(null)
  }, [])

  // Bind/unbind events when dragging or resizing
  React.useEffect(() => {
    if (draggingState || resizing) {
      window.addEventListener("mousemove", handlePointerMove, { passive: false })
      window.addEventListener("touchmove", handlePointerMove, { passive: false })
      window.addEventListener("mouseup", handlePointerUp)
      window.addEventListener("touchend", handlePointerUp)
      return () => {
        window.removeEventListener("mousemove", handlePointerMove)
        window.removeEventListener("touchmove", handlePointerMove)
        window.removeEventListener("mouseup", handlePointerUp)
        window.removeEventListener("touchend", handlePointerUp)
      }
    }
  }, [draggingState, resizing, handlePointerMove, handlePointerUp])

  // Begin resize
  function startResize(dir: ResizeDir) {
    return (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setResizing(dir)
      const pointer = "touches" in e ? e.touches[0] : (e as React.MouseEvent)
      lastPos.current = { x: pointer.clientX, y: pointer.clientY }
    }
  }

  // COPILOT'S ARCHITECTURE: Apply crop using percentage coordinates
  const handleApply = async () => {
    // Check for "No Crop" option first
    if (aspect === "none") {
      console.log('📸 No Crop selected - using original image')
      localStorage.setItem("croppedImageUrl", imageUrl)
      router.push("/photo/results")
      return
    }
    
    console.log('✂️ Starting percentage-based crop process...')
    setIsProcessing(true)
    
    try {
      // Validate input image
      if (!isValidDataURL(imageUrl)) {
        throw new Error('Invalid input image data URL')
      }
      
      // COPILOT'S FIX: Convert percentages to natural image pixels
      const { x, y, width, height } = cropBox
      const sx = Math.round(x * imgDims.width)
      const sy = Math.round(y * imgDims.height)
      const sw = Math.round(width * imgDims.width)
      const sh = Math.round(height * imgDims.height)
      
      console.log('🎯 Percentage crop box:', cropBox)
      console.log('🔧 Natural image pixels:', { sx, sy, sw, sh })
      console.log('📐 Image dimensions:', imgDims)
      
      // Validate crop dimensions
      if (sw <= 0 || sh <= 0) {
        throw new Error('Invalid crop dimensions')
      }
      
      // Create image element for cropping
      const img = new window.Image()
      
      // Wait for image to load
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Image load timeout')), 10000)
        
        img.onload = () => {
          clearTimeout(timeout)
          console.log('✅ Image loaded for cropping:', img.naturalWidth, 'x', img.naturalHeight)
          resolve()
        }
        img.onerror = (error) => {
          clearTimeout(timeout)
          console.error('❌ Failed to load image for cropping:', error)
          reject(new Error('Failed to load image'))
        }
        img.src = imageUrl
      })
      
      // COPILOT'S FIX: Create canvas with exact crop dimensions
      const canvas = document.createElement('canvas')
      canvas.width = sw
      canvas.height = sh
      
      console.log('📋 Canvas size:', canvas.width, 'x', canvas.height)
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Failed to get canvas context')
      }
      
      // COPILOT'S FIX: Draw only the cropped region
      console.log('🖼️ Drawing cropped image...')
      ctx.drawImage(
        img, 
        sx, sy, sw, sh,  // Source region (percentage-calculated)
        0, 0, sw, sh     // Destination (full canvas)
      )
      
      // Convert to data URL
      const croppedUrl = canvas.toDataURL('image/jpeg', 0.95)
      
      console.log('📏 Generated data URL length:', croppedUrl.length)
      
      // Final validation
      if (!isValidDataURL(croppedUrl)) {
        throw new Error('Generated invalid data URL')
      }
      
      console.log('✅ Percentage-based crop successful!')
      
      // Store result and navigate to results page
      localStorage.setItem("croppedImageUrl", croppedUrl)
      router.push("/photo/results")
      
    } catch (error) {
      console.error('❌ Crop failed:', error)
      
      // Fallback: use original image
      if (isValidDataURL(imageUrl)) {
        console.log('🔄 Using original image as fallback')
        localStorage.setItem("croppedImageUrl", imageUrl)
        router.push("/photo/results")
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  // Set crop box to centered default when aspect ratio changes
  useEffect(() => {
    // Handle "No Crop" - hide crop box
    if (aspect === "none") {
      return
    }
    
    if (imgDims.width > 1 && imgDims.height > 1) {
      let w = 0.7 // 70% width as percentage
      let h = 0.7 // 70% height as percentage
      
      if (aspect && aspect !== "none" && typeof aspect === 'number') {
        // Adjust for aspect ratio while keeping as percentages
        const imgAspect = imgDims.width / imgDims.height
        if (imgAspect > aspect) {
          // Image is wider than desired aspect
          h = w / aspect * (imgDims.width / imgDims.height)
          if (h > 0.9) {
            h = 0.9
            w = h * aspect * (imgDims.height / imgDims.width)
          }
        } else {
          // Image is taller than desired aspect
          w = h * aspect * (imgDims.width / imgDims.height)
          if (w > 0.9) {
            w = 0.9
            h = w / aspect * (imgDims.height / imgDims.width)
          }
        }
      }
      
      // Ensure minimum size
      w = Math.max(w, MIN_SIZE_PERCENT)
      h = Math.max(h, MIN_SIZE_PERCENT)
      
      const newCropBox = {
        x: (1 - w) / 2, // Center horizontally
        y: (1 - h) / 2, // Center vertically
        width: w,
        height: h
      }
      
      setCropBox(newCropBox)
      console.log('📏 Set percentage-based crop box:', newCropBox)
    }
  }, [imgDims.width, imgDims.height, aspect])

  // Enhanced validation for Apply button
  const cropValid = imgDims.width > 1 && imgDims.height > 1 && 
                   (aspect === "none" || (cropBox.width > 0 && cropBox.height > 0)) &&
                   isValidDataURL(imageUrl)

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "#111c",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      touchAction: "none",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 100,
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderRadius: '1rem 1rem 0 0',
        padding: '1rem',
        width: '90vw',
        maxWidth: '600px',
        textAlign: 'center',
        boxShadow: '0 8px 40px rgba(0,0,0,0.2)'
      }}>
        <div style={{
          fontWeight: 700,
          fontSize: '1.25rem',
          marginBottom: '1rem',
          color: '#1f2937'
        }}>Crop Your Photo</div>
        
        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            marginBottom: '1rem',
            padding: '0.5rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.25rem'
          }}>
            Debug: Percentage crop {cropBox.x.toFixed(2)},{cropBox.y.toFixed(2)} {cropBox.width.toFixed(2)}×{cropBox.height.toFixed(2)} | Valid: {cropValid ? '✅' : '❌'}
          </div>
        )}
        
        {/* Your Aspect Ratio Presets */}
        <div style={{ marginBottom: "1rem" }}>
          {aspectRatios.map(opt => (
            <button
              key={opt.name}
              onClick={() => setAspect(opt.value)}
              style={{
                fontWeight: aspect === opt.value ? 700 : 400,
                background: aspect === opt.value ? "#10b981" : "#e5e7eb",
                color: aspect === opt.value ? "white" : "#374151",
                border: "none",
                borderRadius: "6px",
                padding: "0.5rem 1rem",
                marginRight: "0.5rem",
                marginBottom: "0.25rem",
                cursor: "pointer"
              }}
            >
              {opt.name}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Area - Copilot's Clean Container */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          maxWidth: "90vw",
          maxHeight: "60vh",
          aspectRatio: `${imgDims.width}/${imgDims.height}`,
          background: "#222",
          borderRadius: 0,
          touchAction: "none"
        }}
      >
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Crop"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            maxHeight: "60vh",
            maxWidth: "90vw",
            objectFit: "contain",
            background: "#111",
          }}
          draggable={false}
        />
        
        {/* Crop Frame - Hide for "No Crop" option */}
        {imgDims.width > 1 && aspect !== "none" && (
          <div
            style={{
              position: "absolute",
              left: `${cropBox.x * 100}%`,
              top: `${cropBox.y * 100}%`,
              width: `${cropBox.width * 100}%`,
              height: `${cropBox.height * 100}%`,
              border: "2px solid #3b82f6",
              borderRadius: 8,
              boxSizing: "border-box",
              background: "rgba(59,130,246,0.07)",
              touchAction: "none",
              zIndex: 2,
              cursor: draggingState ? 'grabbing' : 'move'
            }}
            onMouseDown={handlePointerDown}
            onTouchStart={handlePointerDown}
          >
            {/* Your Resize Handles */}
            {handles.map(handle => (
              <div
                key={handle.dir}
                style={{
                  position: 'absolute',
                  top: handle.top,
                  left: handle.left,
                  width: 24,
                  height: 24,
                  background: '#3b82f6',
                  borderRadius: '50%',
                  border: '2px solid white',
                  cursor: handle.cursor,
                  ...handle.style
                }}
                onMouseDown={startResize(handle.dir as ResizeDir)}
                onTouchStart={startResize(handle.dir as ResizeDir)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{
        background: 'white',
        borderRadius: '0 0 1rem 1rem',
        padding: '1rem',
        width: '90vw',
        maxWidth: '600px',
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        boxShadow: '0 8px 40px rgba(0,0,0,0.2)'
      }}>
        <button
          onClick={handleCancel}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#e5e7eb',
            color: '#374151',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          disabled={!cropValid || isProcessing}
          style={{
            padding: '0.75rem 1.5rem',
            background: (cropValid && !isProcessing) ? '#10b981' : '#a7f3d0',
            color: (cropValid && !isProcessing) ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '8px',
            cursor: (cropValid && !isProcessing) ? 'pointer' : 'not-allowed',
            fontWeight: '600',
            fontSize: '1rem'
          }}
        >
          {isProcessing ? '⏳ Processing...' : '✂️ Apply Crop'}
        </button>
      </div>
    </div>
  )
}

// Main Crop Page Component
const CropPage: React.FC = () => {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState<string>("")

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedImage = localStorage.getItem("pendingImageUrl") || ""
      setImageUrl(savedImage)
    }
  }, [])

  if (!imageUrl) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666',
        background: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
          <div>No image to crop. Please upload an image first.</div>
          <button 
            onClick={() => router.push('/photo')}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Back to Upload
          </button>
        </div>
      </div>
    )
  }

  return <CropTool imageUrl={imageUrl} />
}

export default CropPage
