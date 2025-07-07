'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { X, RotateCcw, Download } from 'lucide-react'

interface CropToolProps {
  imageUrl: string
  onClose: () => void
  onCropComplete: (croppedImageUrl: string) => void
}

interface CropBox {
  x: number
  y: number
  width: number
  height: number
}

interface ImageDimensions {
  width: number
  height: number
}

const ASPECT_RATIOS = [
  { label: 'Free', value: null },
  { label: 'Square', value: 1 },
  { label: '4:3', value: 4/3 },
  { label: '16:9', value: 16/9 },
  { label: '3:4', value: 3/4 },
  { label: '9:16', value: 9/16 },
  { label: 'No Crop', value: 'none' }
]

const MIN_SIZE_PERCENT = 0.1

export default function CropTool({ imageUrl, onClose, onCropComplete }: CropToolProps) {
  const [cropBox, setCropBox] = useState<CropBox>({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragType, setDragType] = useState<'move' | 'resize' | null>(null)
  const [resizeHandle, setResizeHandle] = useState<string>('')
  const [aspect, setAspect] = useState<number | null | 'none'>(1)
  const [imgDims, setImgDims] = useState<ImageDimensions>({ width: 0, height: 0 })
  const [rotation, setRotation] = useState(0)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Load image and set dimensions
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImgDims({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.src = imageUrl
  }, [imageUrl])

  // Update crop box when aspect ratio changes
  useEffect(() => {
    if (imgDims.width === 0 || imgDims.height === 0) return
    if (aspect === 'none') return

    let w = cropBox.width
    let h = cropBox.height

    if (aspect !== null) {
      // Calculate crop box based on aspect ratio
      const imageAspect = imgDims.width / imgDims.height

      if (imageAspect > aspect) {
        // Image is wider than desired aspect
        h = Math.min(0.9, imgDims.height / imgDims.width * aspect)
        w = h * aspect * (imgDims.width / imgDims.height)
        if (w > 0.9) {
          w = 0.9
          h = w / aspect * (imgDims.height / imgDims.width)
        }
      } else {
        // Image is taller than desired aspect
        w = h * aspect * (imgDims.width / imgDims.height)
        if (w > 0.9) {
          w = 0.9
          h = w / aspect * (imgDims.height / imgDims.width)
        }
      }

      // Ensure minimum size
      w = Math.max(w, MIN_SIZE_PERCENT)
      h = Math.max(h, MIN_SIZE_PERCENT)
    } else {
      // For "Free" mode (aspect === null), start with a perfect square
      w = 0.5
      h = 0.5
    }

    const newCropBox = {
      x: (1 - w) / 2,
      y: (1 - h) / 2,
      width: w,
      height: h
    }

    setCropBox(newCropBox)
  }, [imgDims.width, imgDims.height, aspect])

  const handleAspectChange = (newAspect: number | null | 'none') => {
    setAspect(newAspect)
  }

  const constrainCropBox = useCallback((box: CropBox): CropBox => {
    let { x, y, width, height } = box

    width = Math.max(width, MIN_SIZE_PERCENT)
    height = Math.max(height, MIN_SIZE_PERCENT)

    x = Math.max(0, Math.min(x, 1 - width))
    y = Math.max(0, Math.min(y, 1 - height))

    if (aspect !== null && aspect !== 'none') {
      const currentAspect = width / height
      const targetAspect = aspect
      
      if (Math.abs(currentAspect - targetAspect) > 0.01) {
        if (currentAspect > targetAspect) {
          width = height * targetAspect
        } else {
          height = width / targetAspect
        }
        
        if (x + width > 1) {
          width = 1 - x
          height = width / targetAspect
        }
        if (y + height > 1) {
          height = 1 - y
          width = height * targetAspect
        }
      }
    }

    return { x, y, width, height }
  }, [aspect])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (aspect === 'none') return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    setDragStart({ x: e.clientX, y: e.clientY })
    setIsDragging(true)

    const handleSize = 0.02
    const { x: cropX, y: cropY, width: cropW, height: cropH } = cropBox

    const handles = [
      { name: 'nw', x: cropX, y: cropY },
      { name: 'ne', x: cropX + cropW, y: cropY },
      { name: 'sw', x: cropX, y: cropY + cropH },
      { name: 'se', x: cropX + cropW, y: cropY + cropH },
      { name: 'n', x: cropX + cropW/2, y: cropY },
      { name: 's', x: cropX + cropW/2, y: cropY + cropH },
      { name: 'w', x: cropX, y: cropY + cropH/2 },
      { name: 'e', x: cropX + cropW, y: cropY + cropH/2 }
    ]

    const clickedHandle = handles.find(handle => 
      Math.abs(x - handle.x) < handleSize && Math.abs(y - handle.y) < handleSize
    )

    if (clickedHandle) {
      setDragType('resize')
      setResizeHandle(clickedHandle.name)
    } else if (x >= cropX && x <= cropX + cropW && y >= cropY && y <= cropY + cropH) {
      setDragType('move')
    }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || aspect === 'none') return

    const deltaX = (e.clientX - dragStart.x) * 0.001
    const deltaY = (e.clientY - dragStart.y) * 0.001

    if (dragType === 'move') {
      const newCropBox = constrainCropBox({
        x: cropBox.x + deltaX,
        y: cropBox.y + deltaY,
        width: cropBox.width,
        height: cropBox.height
      })
      setCropBox(newCropBox)
    } else if (dragType === 'resize') {
      let newBox = { ...cropBox }

      switch (resizeHandle) {
        case 'se':
          newBox.width += deltaX
          newBox.height += deltaY
          break
        case 'sw':
          newBox.x += deltaX
          newBox.width -= deltaX
          newBox.height += deltaY
          break
        case 'ne':
          newBox.width += deltaX
          newBox.y += deltaY
          newBox.height -= deltaY
          break
        case 'nw':
          newBox.x += deltaX
          newBox.width -= deltaX
          newBox.y += deltaY
          newBox.height -= deltaY
          break
        case 'n':
          newBox.y += deltaY
          newBox.height -= deltaY
          break
        case 's':
          newBox.height += deltaY
          break
        case 'w':
          newBox.x += deltaX
          newBox.width -= deltaX
          break
        case 'e':
          newBox.width += deltaX
          break
      }

      setCropBox(constrainCropBox(newBox))
    }

    setDragStart({ x: e.clientX, y: e.clientY })
  }, [isDragging, dragStart, dragType, resizeHandle, cropBox, constrainCropBox, aspect])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setDragType(null)
    setResizeHandle('')
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleCrop = async () => {
    if (!imageRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = imageRef.current
    
    if (aspect === 'none') {
      // No crop - just rotate if needed
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)
      ctx.restore()
    } else {
      // Calculate crop dimensions
      const cropWidth = Math.floor(cropBox.width * img.naturalWidth)
      const cropHeight = Math.floor(cropBox.height * img.naturalHeight)
      const cropX = Math.floor(cropBox.x * img.naturalWidth)
      const cropY = Math.floor(cropBox.y * img.naturalHeight)

      canvas.width = cropWidth
      canvas.height = cropHeight

      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      
      ctx.drawImage(
        img,
        cropX, cropY, cropWidth, cropHeight,
        -cropWidth / 2, -cropHeight / 2, cropWidth, cropHeight
      )
      ctx.restore()
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        onCropComplete(url)
      }
    }, 'image/jpeg', 0.95)
  }

  const renderCropOverlay = () => {
    if (aspect === 'none') return null

    const { x, y, width, height } = cropBox
    const left = `${x * 100}%`
    const top = `${y * 100}%`
    const w = `${width * 100}%`
    const h = `${height * 100}%`

    return (
      <>
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
        <div 
          className="absolute border-2 border-white shadow-lg pointer-events-none"
          style={{ left, top, width: w, height: h }}
        />
        {['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e'].map(handle => {
          let handleLeft = '0%'
          let handleTop = '0%'
          let transform = ''
          
          switch (handle) {
            case 'nw':
              handleLeft = left
              handleTop = top
              transform = 'translate(-50%, -50%)'
              break
            case 'ne':
              handleLeft = `calc(${left} + ${w})`
              handleTop = top
              transform = 'translate(-50%, -50%)'
              break
            case 'sw':
              handleLeft = left
              handleTop = `calc(${top} + ${h})`
              transform = 'translate(-50%, -50%)'
              break
            case 'se':
              handleLeft = `calc(${left} + ${w})`
              handleTop = `calc(${top} + ${h})`
              transform = 'translate(-50%, -50%)'
              break
            case 'n':
              handleLeft = `calc(${left} + ${w} / 2)`
              handleTop = top
              transform = 'translate(-50%, -50%)'
              break
            case 's':
              handleLeft = `calc(${left} + ${w} / 2)`
              handleTop = `calc(${top} + ${h})`
              transform = 'translate(-50%, -50%)'
              break
            case 'w':
              handleLeft = left
              handleTop = `calc(${top} + ${h} / 2)`
              transform = 'translate(-50%, -50%)'
              break
            case 'e':
              handleLeft = `calc(${left} + ${w})`
              handleTop = `calc(${top} + ${h} / 2)`
              transform = 'translate(-50%, -50%)'
              break
          }
          
          return (
            <div
              key={handle}
              className="absolute w-3 h-3 bg-white border border-gray-400 cursor-pointer z-10"
              style={{
                left: handleLeft,
                top: handleTop,
                transform
              }}
            />
          )
        })}
      </>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Crop Image</h2>
            <button
              type="button"
              className="p-2 rounded hover:bg-gray-100 transition"
              aria-label="Close"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Aspect ratio buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.label}
                type="button"
                className={`px-4 py-2 rounded font-medium text-sm border transition
                  ${aspect === ratio.value
                    ? 'bg-green-600 text-white border-green-600 shadow'
                    : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'}
                `}
                onClick={() => handleAspectChange(ratio.value)}
              >
                {ratio.label}
              </button>
            ))}
          </div>

          {/* Image container */}
          <div
            className="relative bg-gray-100 rounded-lg overflow-hidden mb-4"
            style={{ height: '400px', userSelect: 'none', cursor: aspect === 'none' ? 'default' : (isDragging ? 'grabbing' : 'grab') }}
            onMouseDown={handleMouseDown}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Crop preview"
              className="w-full h-full object-contain pointer-events-none select-none"
              style={{ transform: `rotate(${rotation}deg)` }}
              draggable={false}
            />
            {renderCropOverlay()}
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              className="flex items-center px-4 py-2 rounded border border-gray-200 bg-white hover:bg-gray-100 text-gray-800 transition"
              onClick={handleRotate}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Rotate
            </button>
            
            <div className="flex gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded border border-gray-200 bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex items-center px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                onClick={handleCrop}
              >
                <Download className="w-4 h-4 mr-2" />
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}
