'use client'
import React, { useRef, useState, useEffect } from 'react'

interface CropToolProps {
  image: string
  onApply: (croppedUrl: string) => void
  onCancel: () => void
}

const CROP_RATIOS = [
  { name: 'Facebook', ratio: 1.91, icon: '📘' },
  { name: 'Blog', ratio: 16/9, icon: '📝' },
  { name: 'Instagram', ratio: 1, icon: '📷' },
  { name: 'TikTok', ratio: 9/16, icon: '🎵' },
  { name: 'LinkedIn', ratio: 1.91, icon: '💼' },
  { name: 'Website', ratio: 16/9, icon: '🌐' },
  { name: 'Square', ratio: 1, icon: '⬜' },
  { name: 'Landscape', ratio: 16/9, icon: '🖼️' },
  { name: 'Portrait', ratio: 3/4, icon: '🖼️' },
  { name: 'Custom', ratio: null, icon: '✂️' }
]

export default function CropTool({ image, onApply, onCancel }: CropToolProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [selectedRatio, setSelectedRatio] = useState(CROP_RATIOS[0])
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 200, height: 200 })
  const [dragging, setDragging] = useState<{
    type: string
    startX: number
    startY: number
    startCrop: typeof crop
  } | null>(null)
  const [imgDims, setImgDims] = useState({ width: 0, height: 0, displayWidth: 0, displayHeight: 0 })

  // Calculate crop dimensions based on ratio
  const calculateCropFromRatio = (ratio: number | null, imgWidth: number, imgHeight: number) => {
    if (!ratio) return crop // Custom - keep current dimensions
    
    let width, height
    if (ratio === 1) {
      // Square - use minimum dimension
      const size = Math.min(imgWidth, imgHeight) * 0.8
      width = height = size
    } else if (ratio > 1) {
      // Landscape
      width = imgWidth * 0.8
      height = width / ratio
      if (height > imgHeight * 0.8) {
        height = imgHeight * 0.8
        width = height * ratio
      }
    } else {
      // Portrait
      height = imgHeight * 0.8
      width = height * ratio
      if (width > imgWidth * 0.8) {
        width = imgWidth * 0.8
        height = width / ratio
      }
    }
    
    return {
      x: Math.max(0, (imgWidth - width) / 2),
      y: Math.max(0, (imgHeight - height) / 2),
      width,
      height
    }
  }

  // Load image and set initial crop
  useEffect(() => {
    const img = imgRef.current
    if (!img) return
    
    const handleLoad = () => {
      const displayWidth = img.offsetWidth
      const displayHeight = img.offsetHeight
      const naturalWidth = img.naturalWidth
      const naturalHeight = img.naturalHeight
      
      setImgDims({
        width: naturalWidth,
        height: naturalHeight,
        displayWidth,
        displayHeight
      })
      
      // Set initial crop based on selected ratio
      const initialCrop = calculateCropFromRatio(selectedRatio.ratio, naturalWidth, naturalHeight)
      setCrop(initialCrop)
    }
    
    img.addEventListener('load', handleLoad)
    if (img.complete) handleLoad()
    return () => img.removeEventListener('load', handleLoad)
  }, [image])

  // Update crop when ratio changes
  useEffect(() => {
    if (imgDims.width > 0 && imgDims.height > 0) {
      const newCrop = calculateCropFromRatio(selectedRatio.ratio, imgDims.width, imgDims.height)
      setCrop(newCrop)
    }
  }, [selectedRatio, imgDims])

  // Draw crop preview
  useEffect(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img || crop.width === 0 || crop.height === 0) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw cropped region
    ctx.drawImage(
      img,
      crop.x, crop.y, crop.width, crop.height,
      0, 0, canvas.width, canvas.height
    )
  }, [crop, image])

  // Convert display coordinates to image coordinates
  const displayToImage = (displayX: number, displayY: number) => {
    const scaleX = imgDims.width / imgDims.displayWidth
    const scaleY = imgDims.height / imgDims.displayHeight
    return {
      x: displayX * scaleX,
      y: displayY * scaleY
    }
  }

  // Convert image coordinates to display coordinates
  const imageToDisplay = (imageX: number, imageY: number) => {
    const scaleX = imgDims.displayWidth / imgDims.width
    const scaleY = imgDims.displayHeight / imgDims.height
    return {
      x: imageX * scaleX,
      y: imageY * scaleY
    }
  }

  // Mouse/touch handlers
  const startDrag = (e: React.MouseEvent | React.TouchEvent, type: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    let pageX = 0, pageY = 0
    if ('touches' in e) {
      pageX = e.touches[0].pageX
      pageY = e.touches[0].pageY
    } else {
      pageX = e.pageX
      pageY = e.pageY
    }
    
    setDragging({ 
      type, 
      startX: pageX, 
      startY: pageY, 
      startCrop: { ...crop } 
    })
    
    window.addEventListener('mousemove', onDragMove)
    window.addEventListener('mouseup', stopDrag)
    window.addEventListener('touchmove', onDragMove as any)
    window.addEventListener('touchend', stopDrag as any)
  }

  const onDragMove = (e: MouseEvent | TouchEvent) => {
    if (!dragging || !containerRef.current) return
    
    let pageX = 0, pageY = 0
    if ('touches' in e && e.touches.length > 0) {
      pageX = e.touches[0].pageX
      pageY = e.touches[0].pageY
    } else if ('pageX' in e) {
      pageX = (e as MouseEvent).pageX
      pageY = (e as MouseEvent).pageY
    }
    
    const dx = pageX - dragging.startX
    const dy = pageY - dragging.startY
    
    // Convert to image coordinates
    const scaleX = imgDims.width / imgDims.displayWidth
    const scaleY = imgDims.height / imgDims.displayHeight
    const imageDx = dx * scaleX
    const imageDy = dy * scaleY
    
    if (dragging.type === 'move') {
      let newX = dragging.startCrop.x + imageDx
      let newY = dragging.startCrop.y + imageDy
      
      // Clamp within image bounds
      newX = Math.max(0, Math.min(imgDims.width - crop.width, newX))
      newY = Math.max(0, Math.min(imgDims.height - crop.height, newY))
      
      setCrop(c => ({ ...c, x: newX, y: newY }))
    } else if (dragging.type.startsWith('resize-') && selectedRatio.name === 'Custom') {
      const direction = dragging.type.split('-')[1]
      let newCrop = { ...dragging.startCrop }
      
      switch (direction) {
        case 'nw':
          newCrop.x = Math.max(0, dragging.startCrop.x + imageDx)
          newCrop.y = Math.max(0, dragging.startCrop.y + imageDy)
          newCrop.width = Math.max(50, dragging.startCrop.width - imageDx)
          newCrop.height = Math.max(50, dragging.startCrop.height - imageDy)
          break
        case 'ne':
          newCrop.y = Math.max(0, dragging.startCrop.y + imageDy)
          newCrop.width = Math.max(50, dragging.startCrop.width + imageDx)
          newCrop.height = Math.max(50, dragging.startCrop.height - imageDy)
          break
        case 'sw':
          newCrop.x = Math.max(0, dragging.startCrop.x + imageDx)
          newCrop.width = Math.max(50, dragging.startCrop.width - imageDx)
          newCrop.height = Math.max(50, dragging.startCrop.height + imageDy)
          break
        case 'se':
          newCrop.width = Math.max(50, dragging.startCrop.width + imageDx)
          newCrop.height = Math.max(50, dragging.startCrop.height + imageDy)
          break
        case 'n':
          newCrop.y = Math.max(0, dragging.startCrop.y + imageDy)
          newCrop.height = Math.max(50, dragging.startCrop.height - imageDy)
          break
        case 's':
          newCrop.height = Math.max(50, dragging.startCrop.height + imageDy)
          break
        case 'w':
          newCrop.x = Math.max(0, dragging.startCrop.x + imageDx)
          newCrop.width = Math.max(50, dragging.startCrop.width - imageDx)
          break
        case 'e':
          newCrop.width = Math.max(50, dragging.startCrop.width + imageDx)
          break
      }
      
      // Clamp within image bounds
      if (newCrop.x + newCrop.width > imgDims.width) {
        newCrop.width = imgDims.width - newCrop.x
      }
      if (newCrop.y + newCrop.height > imgDims.height) {
        newCrop.height = imgDims.height - newCrop.y
      }
      
      setCrop(newCrop)
    }
  }

  const stopDrag = () => {
    setDragging(null)
    window.removeEventListener('mousemove', onDragMove)
    window.removeEventListener('mouseup', stopDrag)
    window.removeEventListener('touchmove', onDragMove as any)
    window.removeEventListener('touchend', stopDrag as any)
  }

  // Apply crop
  const handleApply = () => {
    const img = imgRef.current
    if (!img) return
    
    const canvas = document.createElement('canvas')
    canvas.width = crop.width
    canvas.height = crop.height
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.drawImage(
      img,
      crop.x, crop.y, crop.width, crop.height,
      0, 0, crop.width, crop.height
    )
    
    const url = canvas.toDataURL('image/jpeg', 0.92)
    onApply(url)
  }

  // Get display crop for overlay
  const displayCrop = {
    x: (crop.x / imgDims.width) * imgDims.displayWidth,
    y: (crop.y / imgDims.height) * imgDims.displayHeight,
    width: (crop.width / imgDims.width) * imgDims.displayWidth,
    height: (crop.height / imgDims.height) * imgDims.displayHeight
  }

  return (
    <div style={{
      position: 'fixed',
      zIndex: 9999,
      left: 0, top: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h2 style={{ 
          margin: '0 0 1rem 0', 
          fontWeight: '700',
          fontSize: '1.5rem',
          color: '#1f2937'
        }}>
          Crop your photo
        </h2>
        
        {/* Ratio Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ 
            fontSize: '0.875rem', 
            color: '#6b7280', 
            marginBottom: '0.5rem',
            fontWeight: '600'
          }}>
            Choose crop ratio:
          </div>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            {CROP_RATIOS.map((ratio) => (
              <button
                key={ratio.name}
                onClick={() => setSelectedRatio(ratio)}
                style={{
                  background: selectedRatio.name === ratio.name ? '#6B2EFF' : '#f3f4f6',
                  color: selectedRatio.name === ratio.name ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <span>{ratio.icon}</span>
                <span>{ratio.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth < 768 ? 'column' : 'row',
          gap: '1.5rem',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Main crop area */}
          <div 
            ref={containerRef}
            style={{ 
              position: 'relative', 
              width: '400px', 
              height: '400px', 
              background: '#f9fafb', 
              borderRadius: '0.5rem', 
              overflow: 'hidden',
              border: '1px solid #e5e7eb'
            }}
          >
            <img
              ref={imgRef}
              src={image}
              alt="To crop"
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain', 
                display: 'block'
              }}
              draggable={false}
            />
            
            {/* Crop overlay */}
            {imgDims.displayWidth > 0 && (
              <>
                {/* Dark overlay outside crop area */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.5)',
                  pointerEvents: 'none'
                }} />
                
                {/* Clear crop area with resize handles */}
                <div style={{
                  position: 'absolute',
                  left: `${displayCrop.x}px`,
                  top: `${displayCrop.y}px`,
                  width: `${displayCrop.width}px`,
                  height: `${displayCrop.height}px`,
                  background: 'transparent',
                  border: '2px solid #6B2EFF',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                  cursor: 'move',
                  clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)'
                }}
                  onMouseDown={(e) => startDrag(e, 'move')}
                  onTouchStart={(e) => startDrag(e, 'move')}
                >
                  {/* Resize handles for custom ratio */}
                  {selectedRatio.name === 'Custom' && (
                    <>
                      {/* Corner handles */}
                      <div style={{
                        position: 'absolute',
                        top: '-6px', left: '-6px',
                        width: '12px', height: '12px',
                        background: '#6B2EFF', borderRadius: '50%',
                        cursor: 'nw-resize', border: '2px solid white'
                      }}
                        onMouseDown={(e) => startDrag(e, 'resize-nw')}
                        onTouchStart={(e) => startDrag(e, 'resize-nw')}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '-6px', right: '-6px',
                        width: '12px', height: '12px',
                        background: '#6B2EFF', borderRadius: '50%',
                        cursor: 'ne-resize', border: '2px solid white'
                      }}
                        onMouseDown={(e) => startDrag(e, 'resize-ne')}
                        onTouchStart={(e) => startDrag(e, 'resize-ne')}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: '-6px', left: '-6px',
                        width: '12px', height: '12px',
                        background: '#6B2EFF', borderRadius: '50%',
                        cursor: 'sw-resize', border: '2px solid white'
                      }}
                        onMouseDown={(e) => startDrag(e, 'resize-sw')}
                        onTouchStart={(e) => startDrag(e, 'resize-sw')}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: '-6px', right: '-6px',
                        width: '12px', height: '12px',
                        background: '#6B2EFF', borderRadius: '50%',
                        cursor: 'se-resize', border: '2px solid white'
                      }}
                        onMouseDown={(e) => startDrag(e, 'resize-se')}
                        onTouchStart={(e) => startDrag(e, 'resize-se')}
                      />
                      
                      {/* Side handles */}
                      <div style={{
                        position: 'absolute',
                        top: '50%', left: '-6px',
                        width: '12px', height: '12px',
                        background: '#6B2EFF', borderRadius: '50%',
                        cursor: 'w-resize', border: '2px solid white',
                        transform: 'translateY(-50%)'
                      }}
                        onMouseDown={(e) => startDrag(e, 'resize-w')}
                        onTouchStart={(e) => startDrag(e, 'resize-w')}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '50%', right: '-6px',
                        width: '12px', height: '12px',
                        background: '#6B2EFF', borderRadius: '50%',
                        cursor: 'e-resize', border: '2px solid white',
                        transform: 'translateY(-50%)'
                      }}
                        onMouseDown={(e) => startDrag(e, 'resize-e')}
                        onTouchStart={(e) => startDrag(e, 'resize-e')}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '-6px', left: '50%',
                        width: '12px', height: '12px',
                        background: '#6B2EFF', borderRadius: '50%',
                        cursor: 'n-resize', border: '2px solid white',
                        transform: 'translateX(-50%)'
                      }}
                        onMouseDown={(e) => startDrag(e, 'resize-n')}
                        onTouchStart={(e) => startDrag(e, 'resize-n')}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: '-6px', left: '50%',
                        width: '12px', height: '12px',
                        background: '#6B2EFF', borderRadius: '50%',
                        cursor: 's-resize', border: '2px solid white',
                        transform: 'translateX(-50%)'
                      }}
                        onMouseDown={(e) => startDrag(e, 'resize-s')}
                        onTouchStart={(e) => startDrag(e, 'resize-s')}
                      />
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Preview */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              marginBottom: '0.75rem', 
              fontSize: '0.875rem', 
              color: '#6b7280',
              fontWeight: '600'
            }}>
              Preview:
            </div>
            <canvas
              ref={canvasRef}
              width={150}
              height={150}
              style={{
                borderRadius: '0.5rem',
                border: '2px solid #e5e7eb',
                background: '#fafafa',
                width: '150px',
                height: '150px',
                objectFit: 'cover'
              }}
            />
            <div style={{
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              color: '#9ca3af'
            }}>
              {Math.round(crop.width)} × {Math.round(crop.height)}px
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginTop: '1.5rem',
          justifyContent: 'center'
        }}>
          <button
            onClick={onCancel}
            style={{
              background: '#f3f4f6',
              color: '#6b7280',
              fontWeight: '600',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            style={{
              background: 'linear-gradient(45deg, #6B2EFF 0%, #FF7B1C 100%)',
              color: 'white',
              fontWeight: '700',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.75rem 2rem',
              cursor: 'pointer',
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(107, 46, 255, 0.3)'
            }}
          >
            Apply Crop
          </button>
        </div>

        {/* Instructions */}
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: '#f0f9ff',
          border: '1px solid #0ea5e9',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: '#0369a1'
        }}>
          💡 <strong>Tips:</strong> Drag the crop area to move it. For custom ratio, drag the corner handle to resize.
        </div>
      </div>
    </div>
  )
}
