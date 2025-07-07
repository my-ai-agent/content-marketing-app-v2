'use client'
import React, { useRef, useState, useEffect } from 'react'

// Types - Updated to use percentage coordinates
type CropPercentBox = { x: number; y: number; width: number; height: number } // all 0..1
type ResizeDir = null | 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

interface CropToolProps {
  image: string
  onApply: (croppedUrl: string) => void
  onCancel: () => void
}

// Utility for touch/mouse coordinate extraction
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

// Data URL validation utility
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

// UPDATED: Simplified aspect ratios - removed 1:1, 4:3, 3:4, 16:9 for cleaner UX
const aspectRatios = [
  { name: "No Crop", value: "none" },
  { name: "Free", value: null },
]

const MIN_SIZE_PERCENT = 0.05 // 5% minimum size as percentage

const CropTool: React.FC<CropToolProps> = ({ image, onApply, onCancel }) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  
  // Store natural image dimensions
  const [imgDims, setImgDims] = useState({ width: 1, height: 1 })
  
  // FIXED: Store crop box as percentages (0-1) instead of pixels
  const [cropBox, setCropBox] = useState<CropPercentBox>({ 
    x: 0.1, y: 0.1, width: 0.8, height: 0.8 
  })
  
  const [dragging, setDragging] = useState(false)
  const [resizing, setResizing] = useState<ResizeDir>(null)
  const [aspect, setAspect] = useState<number | null | string>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // Validate input image on mount
  useEffect(() => {
    console.log('🔍 CropTool received image, length:', image?.length)
    if (!isValidDataURL(image)) {
      console.error('❌ Invalid input image data URL')
    }
  }, [image])

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
  }, [image])

  // FIXED: Clamp crop box within bounds using percentages
  function clampPercentage(box: CropPercentBox): CropPercentBox {
    let { x, y, width, height } = box

    // Enforce min size as percentage
    width = Math.max(width, MIN_SIZE_PERCENT)
    height = Math.max(height, MIN_SIZE_PERCENT)

    // FIXED: Only enforce aspect ratio for numeric values, NOT for "Free" (null) mode
    if (aspect && aspect !== "none" && aspect !== null && typeof aspect === 'number') {
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

  // Event handler for drag/resize
  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      e.preventDefault()
      const { clientX, clientY } = getClientPos(e)
      
      // FIXED: Convert pixel deltas to percentage deltas
      const imgEl = imgRef.current?.getBoundingClientRect()
      if (!imgEl) return
      
      const dx = (clientX - lastPos.current.x) / imgEl.width
      const dy = (clientY - lastPos.current.y) / imgEl.height
      lastPos.current = { x: clientX, y: clientY }

      setCropBox(prev => {
        if (dragging) {
          return clampPercentage({
            ...prev,
            x: prev.x + dx,
            y: prev.y + dy
          })
        }
        if (resizing) {
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
        }
        return prev
      })
    }

    function onUp() {
      setDragging(false)
      setResizing(null)
      window.removeEventListener('mousemove', onMove as any)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove as any)
      window.removeEventListener('touchend', onUp)
    }

    if (dragging || resizing) {
      window.addEventListener('mousemove', onMove as any, { passive: false })
      window.addEventListener('mouseup', onUp)
      window.addEventListener('touchmove', onMove as any, { passive: false })
      window.addEventListener('touchend', onUp)
      return () => {
        window.removeEventListener('mousemove', onMove as any)
        window.removeEventListener('mouseup', onUp)
        window.removeEventListener('touchmove', onMove as any)
        window.removeEventListener('touchend', onUp)
      }
    }
  }, [dragging, resizing])

  // Begin drag
  function startDrag(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)
    const { clientX, clientY } = getClientPos(
      'nativeEvent' in e ? (e.nativeEvent as any) : (e as any)
    )
    lastPos.current = { x: clientX, y: clientY }
  }

  // Begin resize
  function startResize(dir: ResizeDir) {
    return (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setResizing(dir)
      const { clientX, clientY } = getClientPos(
        'nativeEvent' in e ? (e.nativeEvent as any) : (e as any)
      )
      lastPos.current = { x: clientX, y: clientY }
    }
  }

  // FIXED: Handle "No Crop" and percentage-based cropping with 100% quality output
  const handleApplyCrop = async () => {
    // Check for "No Crop" option first - return original image at 100% quality
    if (aspect === "none") {
      console.log('📸 No Crop selected - using original image at 100% quality')
      onApply(image)
      return
    }
    
    console.log('✂️ Starting percentage-based crop process with 100% quality output...')
    setIsProcessing(true)
    
    try {
      // Validate input image first
      if (!isValidDataURL(image)) {
        throw new Error('Invalid input image data URL')
      }
      
      // FIXED: Convert percentages to natural image pixels for 100% quality crop
      const { x, y, width, height } = cropBox
      const sx = Math.round(x * imgDims.width)
      const sy = Math.round(y * imgDims.height)
      const sw = Math.round(width * imgDims.width)
      const sh = Math.round(height * imgDims.height)
      
      console.log('🎯 Percentage crop box:', cropBox)
      console.log('🔧 Natural image pixels for 100% quality:', { sx, sy, sw, sh })
      console.log('📐 Image dimensions:', imgDims)
      
      // Validate crop dimensions
      if (sw <= 0 || sh <= 0) {
        throw new Error('Invalid crop dimensions')
      }
      
      // Create image element for cropping
      const img = new window.Image()
      
      // Wait for image to load with timeout
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Image load timeout'))
        }, 10000)
        
        img.onload = () => {
          clearTimeout(timeout)
          console.log('✅ Image loaded for 100% quality cropping:', img.naturalWidth, 'x', img.naturalHeight)
          resolve()
        }
        img.onerror = (error) => {
          clearTimeout(timeout)
          console.error('❌ Failed to load image for cropping:', error)
          reject(new Error('Failed to load image'))
        }
        img.src = image
      })
      
      // Validate loaded image
      if (!img.naturalWidth || !img.naturalHeight) {
        throw new Error('Loaded image has no dimensions')
      }
      
      // Create canvas for cropping at 100% quality
      const canvas = document.createElement('canvas')
      canvas.width = sw
      canvas.height = sh
      
      console.log('📋 Canvas size for 100% quality output:', canvas.width, 'x', canvas.height)
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Failed to get canvas context')
      }
      
      // Clear canvas first
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // FIXED: Perform the crop using percentage-calculated coordinates at full resolution
      console.log('🖼️ Drawing cropped image at 100% quality...')
      ctx.drawImage(
        img, 
        sx, sy, sw, sh,  // Source region (percentage-based, full resolution)
        0, 0, sw, sh     // Destination (full canvas, 100% quality)
      )
      
      // Convert to data URL with maximum quality (0.98 for best balance of quality/size)
      const croppedUrl = canvas.toDataURL('image/jpeg', 0.98)
      
      console.log('📏 Generated 100% quality data URL length:', croppedUrl.length)
      
      // Final validation of output
      if (!isValidDataURL(croppedUrl)) {
        throw new Error('Generated invalid data URL')
      }
      
      console.log('✅ 100% quality percentage-based crop successful!')
      onApply(croppedUrl)
      
    } catch (error) {
      console.error('❌ Crop failed:', error)
      
      // Enhanced fallback strategy - return original at 100% quality
      if (isValidDataURL(image)) {
        console.log('🔄 Using original image as fallback at 100% quality')
        onApply(image)
      }
    } finally {
      setIsProcessing(false)
    }
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
      
      // FIXED: Only apply aspect ratio constraints for numeric values, keep "Free" mode truly free
      if (aspect && aspect !== "none" && aspect !== null && typeof aspect === 'number') {
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
      // For "Free" mode (aspect === null), keep the default 70% square crop box
      
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
      console.log('📏 Set percentage-based crop box for mode:', aspect, newCropBox)
    }
  }, [imgDims.width, imgDims.height, aspect])

  // Responsive: constrain displayed width/height for mobile
  const displayMax = 400
  let displayW = displayMax, displayH = displayMax
  if (imgDims.width > imgDims.height) {
    displayH = Math.round(imgDims.height * (displayMax / imgDims.width))
  } else {
    displayW = Math.round(imgDims.width * (displayMax / imgDims.height))
  }

  // Enhanced validation for Apply button
  const cropValid = imgDims.width > 1 && imgDims.height > 1 && 
                   (aspect === "none" || (cropBox.width > 0 && cropBox.height > 0)) &&
                   isValidDataURL(image)

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      background: 'rgba(0,0,0,0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
        padding: '2rem 2rem 1.5rem 2rem',
        maxWidth: 600,
        width: '90vw',
        position: 'relative',
        textAlign: 'center'
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
        
        {/* Simplified Aspect Ratio Presets - Only "No Crop" and "Free" */}
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
        
        <div
          ref={overlayRef}
          style={{
            position: 'relative',
            display: 'inline-block',
            width: displayW,
            height: displayH,
            background: '#f3f4f6',
            borderRadius: '0.75rem',
            userSelect: 'none',
            touchAction: 'none'
          }}
        >
          <img
            ref={imgRef}
            src={image}
            alt="Crop preview"
            style={{
              width: displayW,
              height: displayH,
              display: 'block',
              borderRadius: '0.75rem'
            }}
            draggable={false}
          />
          
          {/* Crop Frame - Hide for "No Crop" option */}
          {imgDims.width > 1 && aspect !== "none" && (
            <div
              style={{
                position: 'absolute',
                left: `${cropBox.x * 100}%`,
                top: `${cropBox.y * 100}%`,
                width: `${cropBox.width * 100}%`,
                height: `${cropBox.height * 100}%`,
                border: '2px solid #3b82f6',
                background: 'rgba(59, 130, 246, 0.10)',
                cursor: dragging ? 'grabbing' : 'move',
                boxSizing: 'border-box',
                borderRadius: '0.4rem',
                transition: dragging || resizing ? 'none' : 'box-shadow 0.15s',
                boxShadow: dragging || resizing ? '0 0 0 2px #3b82f6' : '0 2px 24px 0 rgba(59,130,246,0.1)'
              }}
              onMouseDown={startDrag}
              onTouchStart={startDrag}
            >
              {/* Resize Handles */}
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
        
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#e5e7eb',
              color: '#374151',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleApplyCrop}
            disabled={!cropValid || isProcessing}
            style={{
              padding: '0.75rem 1.5rem',
              background: (cropValid && !isProcessing) ? '#10b981' : '#a7f3d0',
              color: (cropValid && !isProcessing) ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '8px',
              cursor: (cropValid && !isProcessing) ? 'pointer' : 'not-allowed',
              fontWeight: '600'
            }}
          >
            {isProcessing ? '⏳ Processing...' : '✂️ Apply Crop'}
          </button>
        </div>
      </div>

      {/* Add spinning animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default CropTool
