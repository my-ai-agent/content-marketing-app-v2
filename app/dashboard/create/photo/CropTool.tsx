'use client'
import React, { useRef, useState, useEffect } from 'react'

interface CropToolProps {
  image: string
  onApply: (croppedUrl: string) => void
  onCancel: () => void
}

const CROP_SIZE = 256 // default crop box size

export default function CropTool({ image, onApply, onCancel }: CropToolProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0, size: CROP_SIZE })
  const [dragging, setDragging] = useState<null | { startX: number; startY: number; startCrop: typeof crop }>(null)
  const [imgDims, setImgDims] = useState({ width: 0, height: 0 })

  // Load image and center crop box
  useEffect(() => {
    const img = imgRef.current
    if (!img) return
    const handleLoad = () => {
      setImgDims({ width: img.naturalWidth, height: img.naturalHeight })
      // Center crop box
      setCrop({
        x: Math.max(0, Math.floor((img.naturalWidth - CROP_SIZE) / 2)),
        y: Math.max(0, Math.floor((img.naturalHeight - CROP_SIZE) / 2)),
        size: Math.min(CROP_SIZE, img.naturalWidth, img.naturalHeight)
      })
    }
    img.addEventListener('load', handleLoad)
    if (img.complete) handleLoad()
    return () => img.removeEventListener('load', handleLoad)
  }, [image])

  // Draw crop overlay and preview
  useEffect(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // Draw cropped region
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(
      img,
      crop.x, crop.y, crop.size, crop.size,
      0, 0, canvas.width, canvas.height
    )
  }, [crop, image])

  // Mouse/touch handlers for crop box move
  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    let pageX = 0, pageY = 0
    if ('touches' in e) {
      pageX = e.touches[0].pageX
      pageY = e.touches[0].pageY
    } else {
      pageX = e.pageX
      pageY = e.pageY
    }
    setDragging({ startX: pageX, startY: pageY, startCrop: { ...crop } })
    window.addEventListener('mousemove', onDragMove)
    window.addEventListener('mouseup', stopDrag)
    window.addEventListener('touchmove', onDragMove as any)
    window.addEventListener('touchend', stopDrag as any)
  }
  const onDragMove = (e: MouseEvent | TouchEvent) => {
    if (!dragging) return
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
    let newX = dragging.startCrop.x + dx
    let newY = dragging.startCrop.y + dy
    // Clamp crop box within image
    newX = Math.max(0, Math.min(imgDims.width - crop.size, newX))
    newY = Math.max(0, Math.min(imgDims.height - crop.size, newY))
    setCrop((c) => ({ ...c, x: newX, y: newY }))
  }
  const stopDrag = () => {
    setDragging(null)
    window.removeEventListener('mousemove', onDragMove)
    window.removeEventListener('mouseup', stopDrag)
    window.removeEventListener('touchmove', onDragMove as any)
    window.removeEventListener('touchend', stopDrag as any)
  }

  // Apply crop and return data URL
  const handleApply = () => {
    const img = imgRef.current
    if (!img) return
    const previewCanvas = document.createElement('canvas')
    previewCanvas.width = crop.size
    previewCanvas.height = crop.size
    const ctx = previewCanvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(
      img,
      crop.x, crop.y, crop.size, crop.size,
      0, 0, crop.size, crop.size
    )
    const url = previewCanvas.toDataURL('image/jpeg', 0.92)
    onApply(url)
  }

  return (
    <div style={{
      position: 'fixed',
      zIndex: 90,
      left: 0, top: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 8px 32px rgba(0,0,0,0.20)',
        maxWidth: 680
      }}>
        <h2 style={{ margin: 0, marginBottom: 12, fontWeight: 700 }}>Crop your photo</h2>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 24,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ position: 'relative', width: 320, height: 320, background: '#f4f4f4', borderRadius: 8, overflow: 'hidden' }}>
            <img
              ref={imgRef}
              src={image}
              alt="To crop"
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              draggable={false}
            />
            {/* Crop box overlay */}
            <div
              style={{
                position: 'absolute',
                left: `${(crop.x / imgDims.width) * 100}%`,
                top: `${(crop.y / imgDims.height) * 100}%`,
                width: `${(crop.size / imgDims.width) * 100}%`,
                height: `${(crop.size / imgDims.height) * 100}%`,
                border: '2px solid #6B2EFF',
                borderRadius: 6,
                boxSizing: 'border-box',
                cursor: 'move',
                background: 'rgba(107,46,255,0.10)',
                transition: dragging ? 'none' : 'box-shadow .15s'
              }}
              onMouseDown={startDrag}
              onTouchStart={startDrag}
            />
          </div>
          <div>
            <div style={{ marginBottom: 12, fontSize: 14, color: '#888' }}>Crop preview:</div>
            <canvas
              ref={canvasRef}
              width={128}
              height={128}
              style={{
                borderRadius: 8,
                border: '1px solid #eee',
                background: '#fafafa',
                width: 128,
                height: 128
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
          <button
            onClick={onCancel}
            style={{
              background: '#f3f4f6',
              color: '#6b7280',
              fontWeight: 600,
              border: 'none',
              borderRadius: 8,
              padding: '10px 28px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            style={{
              background: 'linear-gradient(45deg, #6B2EFF 0%, #FF7B1C 100%)',
              color: 'white',
              fontWeight: 800,
              border: 'none',
              borderRadius: 8,
              padding: '10px 32px',
              cursor: 'pointer'
            }}
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  )
}
