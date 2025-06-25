
import React, { useRef, useState, useEffect } from 'react'

// Types
type CropBox = { x: number; y: number; width: number; height: number }
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

const CropTool: React.FC<CropToolProps> = ({ image, onApply, onCancel }) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [imgDims, setImgDims] = useState({ width: 1, height: 1 })
  const [cropBox, setCropBox] = useState<CropBox>({ x: 40, y: 40, width: 200, height: 200 })
  const [dragging, setDragging] = useState(false)
  const [resizing, setResizing] = useState<ResizeDir>(null)
  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // Set image dimensions on load
  useEffect(() => {
    const img = imgRef.current
    if (img) {
      const setDims = () => setImgDims({ width: img.naturalWidth, height: img.naturalHeight })
      img.onload = setDims
      // If already loaded (cache), trigger manually
      if (img.complete) setDims()
    }
  }, [image])

  // Clamp crop box within image
  function clamp(box: CropBox): CropBox {
    const min = 40
    let { x, y, width, height } = box
    if (width < min) width = min
    if (height < min) height = min
    if (x < 0) x = 0
    if (y < 0) y = 0
    if (x + width > imgDims.width) x = imgDims.width - width
    if (y + height > imgDims.height) y = imgDims.height - height
    return { x, y, width, height }
  }

  // Event handler for drag/resize
  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      e.preventDefault()
      const { clientX, clientY } = getClientPos(e)
      let dx = clientX - lastPos.current.x
      let dy = clientY - lastPos.current.y
      lastPos.current = { x: clientX, y: clientY }

      setCropBox(prev => {
        if (dragging) {
          return clamp({
            ...prev,
            x: prev.x + dx,
            y: prev.y + dy
          })
        }
        if (resizing) {
          let { x, y, width, height } = prev
          switch (resizing) {
            case 'n':
              y += dy; height -= dy; break
            case 's':
              height += dy; break
            case 'e':
              width += dx; break
            case 'w':
              x += dx; width -= dx; break
            case 'ne':
              y += dy; height -= dy; width += dx; break
            case 'nw':
              y += dy; height -= dy; x += dx; width -= dx; break
            case 'se':
              width += dx; height += dy; break
            case 'sw':
              x += dx; width -= dx; height += dy; break
          }
          return clamp({ x, y, width, height })
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

    // Only attach listeners if dragging/resizing
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Convert displayed crop box to natural image pixels
  function getCropPixels() {
    const display = overlayRef.current?.getBoundingClientRect()
    const imgEl = imgRef.current?.getBoundingClientRect()
    if (!display || !imgEl) return cropBox
    const scaleX = imgDims.width / imgEl.width
    const scaleY = imgDims.height / imgEl.height
    return {
      x: Math.round((cropBox.x - (imgEl.left - display.left)) * scaleX),
      y: Math.round((cropBox.y - (imgEl.top - display.top)) * scaleY),
      width: Math.round(cropBox.width * scaleX),
      height: Math.round(cropBox.height * scaleY)
    }
  }

  // Defensive cropping and validation
  async function handleApplyCrop() {
    const { x, y, width, height } = getCropPixels()
    // Defensive: don't allow zero or negative crop
    if (width <= 0 || height <= 0) {
      onApply('')
      return
    }
    const img = new window.Image()
    img.src = image

    try {
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })
    } catch {
      onApply('')
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      onApply('')
      return
    }
    ctx.drawImage(img, x, y, width, height, 0, 0, width, height)
    const croppedUrl = canvas.toDataURL('image/jpeg', 0.95)
    if (!croppedUrl.startsWith('data:image/')) {
      onApply('')
      return
    }
    onApply(croppedUrl)
  }

  // Set crop box to centered default on first image load
  useEffect(() => {
    const img = imgRef.current
    if (img && img.naturalWidth && img.naturalHeight) {
      const w = Math.round(img.naturalWidth * 0.7)
      const h = Math.round(img.naturalHeight * 0.7)
      setCropBox({
        x: Math.round((img.naturalWidth - w) / 2),
        y: Math.round((img.naturalHeight - h) / 2),
        width: w,
        height: h
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgDims.width, imgDims.height, image])

  // Responsive: constrain displayed width/height for mobile
  const displayMax = 400
  let displayW = displayMax, displayH = displayMax
  if (imgDims.width > imgDims.height) {
    displayH = Math.round(imgDims.height * (displayMax / imgDims.width))
  } else {
    displayW = Math.round(imgDims.width * (displayMax / imgDims.height))
  }

  // Only enable Apply if the crop is valid and image is loaded
  const cropValid = imgDims.width > 0 && imgDims.height > 0 && cropBox.width > 0 && cropBox.height > 0

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
          {/* Crop Frame */}
          <div
            style={{
              position: 'absolute',
              left: cropBox.x * (displayW / imgDims.width),
              top: cropBox.y * (displayH / imgDims.height),
              width: cropBox.width * (displayW / imgDims.width),
              height: cropBox.height * (displayH / imgDims.height),
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
                  width: 18,
                  height: 18,
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
            style={{
              padding: '0.75rem 1.5rem',
              background: cropValid ? '#10b981' : '#a7f3d0',
              color: cropValid ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '8px',
              cursor: cropValid ? 'pointer' : 'not-allowed',
              fontWeight: '600'
            }}
            disabled={!cropValid}
          >
            ✂️ Apply Crop
          </button>
        </div>
      </div>
    </div>
  )
}

export default CropTool
