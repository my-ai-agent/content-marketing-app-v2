'use client'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Enhanced IndexedDB helper for multiple photos
const DB_NAME = 'PhotoAppDB'
const STORE_NAME = 'photos'

function saveImageToIndexedDB(key: string, data: Blob): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME)
    }
    req.onerror = () => reject(req.error)
    req.onsuccess = () => {
      const db = req.result
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).put(data, key)
      tx.oncomplete = () => {
        db.close()
        resolve()
      }
      tx.onerror = () => reject(tx.error)
    }
  })
}

function removeImageFromIndexedDB(key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onerror = () => reject(req.error)
    req.onsuccess = () => {
      const db = req.result
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).delete(key)
      tx.oncomplete = () => {
        db.close()
        resolve()
      }
      tx.onerror = () => reject(tx.error)
    }
  })
}

function getImageFromIndexedDB(key: string): Promise<Blob | null> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onerror = () => reject(req.error)
    req.onsuccess = () => {
      const db = req.result
      const tx = db.transaction(STORE_NAME, 'readonly')
      const getReq = tx.objectStore(STORE_NAME).get(key)
      
      getReq.onsuccess = () => {
        db.close()
        resolve(getReq.result || null)
      }
      getReq.onerror = () => {
        db.close()
        reject(getReq.error)
      }
    }
  })
}

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

// Compression config for mobile-optimized, localStorage/IndexedDB safe
const MAX_WIDTH = 1280
const MAX_HEIGHT = 1280
const OUTPUT_QUALITY = 0.80

interface PhotoData {
  blob: Blob
  url: string
  fileName: string
  fileSize: number
  uploadMethod: 'camera' | 'gallery' | 'upload'
  timestamp: number
}

export default function PhotoUpload() {
  // Multiple photo storage
  const router = useRouter()
  const [photos, setPhotos] = useState<{
    camera?: PhotoData
    gallery?: PhotoData
    upload?: PhotoData
  }>({})
  
  const [currentUploadMethod, setCurrentUploadMethod] = useState<'camera' | 'gallery' | 'upload'>('gallery')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const uploadInputRef = useRef<HTMLInputElement>(null)

  // Load existing photos on component mount
  useEffect(() => {
    loadExistingPhotos()
  }, [])

  const loadExistingPhotos = async () => {
    try {
      // Load photo metadata from localStorage
      const photoMetadata = localStorage.getItem('photoMetadata')
      if (photoMetadata) {
        const metadata = JSON.parse(photoMetadata)
        const loadedPhotos: typeof photos = {}
        
        // Load each photo from IndexedDB
        for (const [type, data] of Object.entries(metadata)) {
          const blob = await getImageFromIndexedDB(`photo_${type}`)
          if (blob && typeof data === 'object' && data !== null) {
            loadedPhotos[type as keyof typeof photos] = {
              blob,
              url: URL.createObjectURL(blob),
              fileName: (data as any).fileName || 'Unknown',
              fileSize: (data as any).fileSize || 0,
              uploadMethod: (data as any).uploadMethod || type as 'camera' | 'gallery' | 'upload',
              timestamp: (data as any).timestamp || Date.now()
            }
          }
        }
        
        setPhotos(loadedPhotos)
      }
    } catch (err) {
      console.error('Failed to load existing photos:', err)
    }
  }

  // Compress image using pica, loaded dynamically
  const compressWithPica = async (imgSrc: string): Promise<Blob> => {
    setIsProcessing(true)
    setError(null)
    try {
      const picaModule = await import('pica')
      const picaInstance = picaModule.default()
      const img = document.createElement('img')
      img.src = imgSrc

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = (err) => reject(new Error('Image load failed'))
      })

      if (!img.naturalWidth || !img.naturalHeight) {
        throw new Error('Image has invalid dimensions')
      }

      let { width, height } = img
      let scale = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height, 1)
      let newW = Math.round(width * scale)
      let newH = Math.round(height * scale)
      const inputCanvas = document.createElement('canvas')
      inputCanvas.width = width
      inputCanvas.height = height
      const inputCtx = inputCanvas.getContext('2d')
      if (!inputCtx) throw new Error('Could not get canvas context')
      inputCtx.drawImage(img, 0, 0)
      const outputCanvas = document.createElement('canvas')
      outputCanvas.width = newW
      outputCanvas.height = newH
      await picaInstance.resize(inputCanvas, outputCanvas)
      const blob = await picaInstance.toBlob(outputCanvas, 'image/jpeg', OUTPUT_QUALITY)
      URL.revokeObjectURL(img.src)
      return blob
    } finally {
      setIsProcessing(false)
    }
  }

  const savePhotoMetadata = (updatedPhotos: typeof photos) => {
    // Save metadata (without blobs) to localStorage
    const metadata: any = {}
    Object.entries(updatedPhotos).forEach(([type, photoData]) => {
      if (photoData) {
        metadata[type] = {
          fileName: photoData.fileName,
          fileSize: photoData.fileSize,
          uploadMethod: photoData.uploadMethod,
          timestamp: photoData.timestamp
        }
      }
    })
    localStorage.setItem('photoMetadata', JSON.stringify(metadata))
  }

  const handleNext = async () => {
    setError(null)
    const photoCount = Object.keys(photos).length
    
    if (photoCount > 0) {
      try {
        // Save all photos metadata for Claude integration
        savePhotoMetadata(photos)
        
        // Store photo count for Claude prompt enhancement
        localStorage.setItem('photoCount', photoCount.toString())
        localStorage.setItem('photoTypes', Object.keys(photos).join(','))
        
        window.location.href = '/dashboard/create/story'
      } catch {
        setError('Failed to save photos. Storage quota may be exceeded.')
      }
    } else {
      alert('Please add at least one photo before continuing.')
    }
  }

  const handleSkip = async () => {
    setError(null)
    
    // Clear all photos
    for (const type of ['camera', 'gallery', 'upload']) {
      await removeImageFromIndexedDB(`photo_${type}`)
    }
    
    // Clear localStorage
    localStorage.removeItem('photoMetadata')
    localStorage.removeItem('photoCount')
    localStorage.removeItem('photoTypes')
    
    setPhotos({})
    router.push('/dashboard/create/story')
  }

  const handleRemovePhoto = async (type: 'camera' | 'gallery' | 'upload') => {
    // Remove from IndexedDB
    await removeImageFromIndexedDB(`photo_${type}`)
    
    // Remove from state
    const updatedPhotos = { ...photos }
    if (updatedPhotos[type]) {
      URL.revokeObjectURL(updatedPhotos[type]!.url)
      delete updatedPhotos[type]
    }
    setPhotos(updatedPhotos)
    
    // Update metadata
    savePhotoMetadata(updatedPhotos)
    
    // Clear file inputs
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
    if (uploadInputRef.current) uploadInputRef.current.value = ''
  }

  // Enhanced file select handler for multiple photo storage
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files && e.target.files[0]
    if (!file) return

    // File size limit (10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024
    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Please use images under 10MB.')
      return
    }

    let processedFile = file

    // Handle HEIC/HEIF conversion with dynamic import
    if (
      file.type === "image/heic" || file.type === "image/heif" ||
      file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif")
    ) {
      try {
        setError("Converting iPhone photo, please wait...")
        const heic2any = (await import("heic2any")).default
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8
        }) as Blob

        processedFile = new File([convertedBlob],
          file.name.replace(/\.heic$/i, ".jpg"),
          { type: "image/jpeg" }
        )
        setError(null)
      } catch (err) {
        setError("Failed to convert iPhone photo. Please try a different file.")
        return
      }
    }

    // Check supported formats
    if (!/image\/(jpeg|png|webp)/.test(processedFile.type)) {
      setError('Unsupported format. Please use JPG, PNG, WebP, or iPhone photos.')
      return
    }

    const reader = new FileReader()
    reader.onload = async (ev) => {
      const result = ev.target?.result
      if (typeof result === 'string') {
        try {
          setError("Processing image...")
          const compressedBlob = await compressWithPica(result)
          
          // Save to IndexedDB with type-specific key
          await saveImageToIndexedDB(`photo_${currentUploadMethod}`, compressedBlob)
          
          // Create photo data object
          const photoData: PhotoData = {
            blob: compressedBlob,
            url: result,
            fileName: processedFile.name,
            fileSize: processedFile.size,
            uploadMethod: currentUploadMethod,
            timestamp: Date.now()
          }
          
          // Update state with new photo
          const updatedPhotos = {
            ...photos,
            [currentUploadMethod]: photoData
          }
          setPhotos(updatedPhotos)
          
          // Save metadata
          savePhotoMetadata(updatedPhotos)
          
          setError(null)
        } catch (err) {
          setError('Failed to process image. Please try a smaller file or different format.')
        }
      } else {
        setError('Failed to read file')
      }
    }

    reader.onerror = () => setError('Failed to read file')
    reader.readAsDataURL(processedFile)
  }

  const photoCount = Object.keys(photos).length
  const hasPhotos = photoCount > 0

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'white'
    }}>
      {/* Header with Step Tracker */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1rem',
        borderBottom: '1px solid #f3f4f6'
      }}>
        {/* Step Tracker */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>1</div>
          
          <div style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            backgroundColor: '#1f2937',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>2</div>
          
          <div style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            backgroundColor: '#e5e7eb',
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>3</div>
          
          <div style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            backgroundColor: '#e5e7eb',
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>4</div>
          
          <div style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            backgroundColor: '#e5e7eb',
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>5</div>
          
          <div style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            backgroundColor: '#e5e7eb',
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>6</div>
        </div>
        
        {/* Title with photo count */}
        <h1 style={{
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          fontWeight: '700',
          color: '#1f2937',
          lineHeight: '1.2',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          Add Your Photo{photoCount > 1 ? 's' : ''}
        </h1>
        
        {photoCount > 0 && (
          <p style={{
            fontSize: '1rem',
            color: '#6b7280',
            textAlign: 'center'
          }}>
            {photoCount} photo{photoCount > 1 ? 's' : ''} added • This gives Claude richer context for your content
          </p>
        )}
      </div>

      <div style={{
        flex: '1',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
        padding: '2rem 1rem'
      }}>
        {/* Upload Method Toggle - 3 buttons */}
        <div style={{ textAlign: 'center', width: '100%', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            backgroundColor: '#f3f4f6',
            borderRadius: '1rem',
            padding: '0.5rem'
          }}>
            <button
              type="button"
              onClick={() => setCurrentUploadMethod('camera')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentUploadMethod === 'camera' ? 'white' : 'transparent',
                color: currentUploadMethod === 'camera' ? '#1f2937' : '#6b7280',
                boxShadow: currentUploadMethod === 'camera' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                position: 'relative'
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>📷</span>
              Camera
              {photos.camera && (
                <div style={{
                  position: 'absolute',
                  top: '-0.25rem',
                  right: '-0.25rem',
                  width: '1rem',
                  height: '1rem',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  fontSize: '0.75rem',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>✓</div>
              )}
            </button>
            <button
              type="button"
              onClick={() => setCurrentUploadMethod('gallery')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentUploadMethod === 'gallery' ? 'white' : 'transparent',
                color: currentUploadMethod === 'gallery' ? '#1f2937' : '#6b7280',
                boxShadow: currentUploadMethod === 'gallery' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                position: 'relative'
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>📱</span>
              Gallery
              {photos.gallery && (
                <div style={{
                  position: 'absolute',
                  top: '-0.25rem',
                  right: '-0.25rem',
                  width: '1rem',
                  height: '1rem',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  fontSize: '0.75rem',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>✓</div>
              )}
            </button>
            <button
              type="button"
              onClick={() => setCurrentUploadMethod('upload')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentUploadMethod === 'upload' ? 'white' : 'transparent',
                color: currentUploadMethod === 'upload' ? '#1f2937' : '#6b7280',
                boxShadow: currentUploadMethod === 'upload' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                position: 'relative'
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>🌐</span>
              Upload
              {photos.upload && (
                <div style={{
                  position: 'absolute',
                  top: '-0.25rem',
                  right: '-0.25rem',
                  width: '1rem',
                  height: '1rem',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  fontSize: '0.75rem',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>✓</div>
              )}
            </button>
          </div>
        </div>

        {/* Photo Upload Area or Gallery */}
        <div style={{ textAlign: 'center', width: '100%', marginBottom: '3rem' }}>
          {!photos[currentUploadMethod] ? (
            <div style={{
              width: '100%',
              maxWidth: '500px',
              height: '300px',
              border: '2px dashed #d1d5db',
              borderRadius: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              backgroundColor: '#fafafa',
              margin: '0 auto',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
              onClick={() => {
                if (currentUploadMethod === 'camera') {
                  cameraInputRef.current?.click()
                } else if (currentUploadMethod === 'gallery') {
                  fileInputRef.current?.click()
                } else {
                  uploadInputRef.current?.click()
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#9ca3af'
                e.currentTarget.style.backgroundColor = '#f5f5f5'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db'
                e.currentTarget.style.backgroundColor = '#fafafa'
              }}
            >
              <div style={{ fontSize: 'clamp(3rem, 8vw, 4rem)', marginBottom: '1rem' }}>
                {currentUploadMethod === 'camera' ? '📷' : currentUploadMethod === 'gallery' ? '📂' : '🌐'}
              </div>
              <h3 style={{
                fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem',
                margin: '0 0 0.5rem 0'
              }}>
                {currentUploadMethod === 'camera' ? 'Take a Photo' : currentUploadMethod === 'gallery' ? 'Upload from Gallery' : 'Upload Website Image'}
              </h3>
              <p style={{
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                color: '#6b7280',
                marginBottom: '1rem',
                padding: '0 1rem'
              }}>
                {currentUploadMethod === 'camera'
                  ? 'Capture your immediate experience'
                  : currentUploadMethod === 'gallery'
                  ? 'Personal curated travel content'
                  : 'Business website or marketing content'
                }
              </p>
              <div style={{
                fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
                color: '#9ca3af'
              }}>
                💡 Tip: Add multiple photos for richer AI content
              </div>
              
              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <input
                ref={uploadInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div style={{
              width: '100%',
              maxWidth: '500px',
              margin: '0 auto',
              position: 'relative'
            }}>
              <div style={{
                width: '100%',
                maxHeight: '70vh',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src={photos[currentUploadMethod]?.url}
                  alt={`${currentUploadMethod} photo`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '70vh',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: '1.5rem'
                  }}
                />
                <button
                  onClick={() => handleRemovePhoto(currentUploadMethod)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                  }}
                >
                  ✕
                </button>
              </div>
              <div style={{
                marginTop: '1rem',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                color: '#6b7280'
              }}>
                📁 {photos[currentUploadMethod]?.fileName}
              </div>
              <div style={{
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                color: '#9ca3af'
              }}>
                {currentUploadMethod === 'camera' ? '📷 Immediate Experience' : 
                 currentUploadMethod === 'gallery' ? '📱 Personal Content' : 
                 '🌐 Business Content'} • Added {new Date(photos[currentUploadMethod]?.timestamp || 0).toLocaleTimeString()}
              </div>
            </div>
          )}
          
          {isProcessing && (
            <div style={{ marginTop: '1rem', color: BRAND_PURPLE, fontWeight: 600 }}>
              Processing image, please wait...
            </div>
          )}
          {error && (
            <div style={{ marginTop: '1rem', color: 'red', fontWeight: 600 }}>
              {error}
            </div>
          )}
        </div>

        {/* Photo Gallery Overview (when user has multiple photos) */}
        {hasPhotos && (
          <div style={{
            marginBottom: '2rem',
            padding: '1rem',
            backgroundColor: '#f0f9ff',
            borderRadius: '1rem',
            border: `1px solid ${BRAND_BLUE}`
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '0.75rem',
              textAlign: 'center'
            }}>
              📸 Your Photo Collection ({photoCount})
            </h3>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              {Object.entries(photos).map(([type, photoData]) => (
                <div key={type} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#374151',
                  border: '1px solid #e5e7eb'
                }}>
                  <span style={{ marginRight: '0.5rem' }}>
                    {type === 'camera' ? '📷' : type === 'gallery' ? '📱' : '🌐'}
                  </span>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </div>
              ))}
            </div>
            <p style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              textAlign: 'center',
              marginTop: '0.75rem',
              marginBottom: 0
            }}>
              🤖 Claude will use all photos to create richer, more contextual content
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          width: '100%',
          marginBottom: '1rem'
        }}>
          <button
            onClick={handleSkip}
            style={{
              background: '#f3f4f6',
              color: '#6b7280',
              fontSize: 'clamp(1rem, 3vw, 1.25rem)',
              fontWeight: '600',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Skip for now
          </button>
          <button
            onClick={handleNext}
            disabled={!hasPhotos || isProcessing}
            style={{
              background: hasPhotos
                ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                : '#e5e7eb',
              color: hasPhotos ? 'white' : '#9ca3af',
              fontSize: 'clamp(1.25rem, 4vw, 2rem)',
              fontWeight: '900',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: hasPhotos ? 'pointer' : 'not-allowed',
              boxShadow: hasPhotos ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Continue →
          </button>
        </div>
        
        {/* Logo - Brand Reinforcement */}
        <div style={{
          textAlign: 'center',
          marginBottom: '1rem',
          paddingTop: '0'
        }}>
          <div style={{
            color: BRAND_PURPLE,
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            fontWeight: '900',
            display: 'inline'
          }}>click</div>
          <div style={{
            color: BRAND_ORANGE,
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            fontWeight: '900',
            display: 'inline',
            marginLeft: '0.25rem'
          }}>speak</div>
          <div style={{
            color: BRAND_BLUE,
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            fontWeight: '900',
            display: 'inline',
            marginLeft: '0.25rem'
          }}>send</div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div style={{
        padding: '1.5rem',
        textAlign: 'center',
        borderTop: '1px solid #f3f4f6'
      }}>
        <Link
          href="/"
          style={{
            color: '#6b7280',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)'
          }}
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
