'use client'
import Link from 'next/link'
import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import ExecutivePromptBuilder from '../../../utils/ExecutivePromptBuilder'

// Dynamically import CropTool
const CropTool = dynamic(() => import('./CropTool'), { ssr: false })

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

// Smart downscaling configuration
const MAX_DIMENSION = 2048
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export default function PhotoUpload() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'camera'>('upload')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingMessage, setProcessingMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showCropModal, setShowCropModal] = useState(false)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [optimizedImage, setOptimizedImage] = useState<string | null>(null) // NEW: Optimized version
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  
  // Track crop completion state
  const [isCropCompleted, setIsCropCompleted] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Initialize Executive Prompt Builder
  const [promptBuilder] = useState(() => new ExecutivePromptBuilder())

  // NEW: Smart auto-downscaling function
  const autoOptimizeImage = async (imageDataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        console.log('🔍 Original image size:', img.width, 'x', img.height)
        
        // Check if downscaling is needed
        const needsDownscaling = img.width > MAX_DIMENSION || img.height > MAX_DIMENSION
        
        if (!needsDownscaling) {
          console.log('✅ Image size OK, no downscaling needed')
          resolve(imageDataUrl)
          return
        }
        
        // Calculate new dimensions maintaining aspect ratio
        const scale = Math.min(MAX_DIMENSION / img.width, MAX_DIMENSION / img.height)
        const newWidth = Math.round(img.width * scale)
        const newHeight = Math.round(img.height * scale)
        
        console.log('📐 Downscaling to:', newWidth, 'x', newHeight, 'Scale:', scale.toFixed(2))
        setProcessingMessage(`Optimizing ${img.width}x${img.height} → ${newWidth}x${newHeight}...`)
        
        // Create canvas for downscaling
        const canvas = document.createElement('canvas')
        canvas.width = newWidth
        canvas.height = newHeight
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }
        
        // High-quality downscaling
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        
        // Draw downscaled image
        ctx.drawImage(img, 0, 0, newWidth, newHeight)
        
        // Convert to optimized data URL
        const quality = img.width > 3000 ? 0.8 : 0.85 // More compression for very large images
        const optimizedUrl = canvas.toDataURL('image/jpeg', quality)
        
        console.log('✅ Auto-optimization complete')
        resolve(optimizedUrl)
      }
      
      img.onerror = () => {
        console.error('❌ Failed to load image for optimization')
        resolve(imageDataUrl) // Fallback to original
      }
      
      img.src = imageDataUrl
    })
  }

  // Enhanced file selection with auto-optimization
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📁 File selected')
    setError(null)
    setIsProcessing(true)
    setProcessingMessage('Loading image...')
    
    const file = e.target.files && e.target.files[0]
    if (!file) {
      setIsProcessing(false)
      return
    }

    try {
      // File size validation
      if (file.size > 20 * 1024 * 1024) { // 20MB limit
        throw new Error('File too large. Please use images under 20MB.')
      }

      let processedFile = file

      // Handle HEIC conversion
      if (file.type === "image/heic" || file.type === "image/heif" || 
          file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif")) {
        try {
          setProcessingMessage("Converting iPhone photo...")
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
        } catch (err) {
          throw new Error("Failed to convert iPhone photo. Please try a different file.")
        }
      }

      // Format validation
      if (!/image\/(jpeg|png|webp)/.test(processedFile.type)) {
        throw new Error('Unsupported format. Please use JPG, PNG, WebP, or iPhone photos.')
      }

      setPendingFile(processedFile)
      setPhotoFile(processedFile)
      setIsCropCompleted(false)

      // Read file as data URL
      setProcessingMessage('Reading image data...')
      const reader = new FileReader()
      
      reader.onload = async (ev) => {
        const result = ev.target?.result
        if (typeof result === 'string') {
          try {
            // AUTO-OPTIMIZATION: Downscale if needed
            setProcessingMessage('Optimizing for cropping...')
            const optimizedDataUrl = await autoOptimizeImage(result)
            
            // Store both versions
            setOriginalImage(result) // Keep original for reference
            setOptimizedImage(optimizedDataUrl) // Use optimized for cropping
            
            setProcessingMessage('Ready to crop!')
            
            // Brief pause to show success message
            setTimeout(() => {
              setShowCropModal(true)
              setProcessingMessage('')
              console.log('🖼️ Opening crop modal with optimized image')
            }, 500)
            
          } catch (err) {
            console.error('Optimization failed:', err)
            // Fallback: use original image
            setOriginalImage(result)
            setOptimizedImage(result)
            setShowCropModal(true)
            setProcessingMessage('')
          }
        }
      }

      reader.onerror = () => {
        throw new Error('Failed to read file')
      }
      
      reader.readAsDataURL(processedFile)

    } catch (error: any) {
      setError(error.message)
      console.error('File processing error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Apply crop with optimized image
  const handleCropApply = async (croppedUrl: string) => {
    console.log('🎯 Apply Crop clicked - processing cropped image')
    
    setShowCropModal(false)
    setIsProcessing(true)
    setProcessingMessage('Applying crop...')
    
    try {
      if (!croppedUrl.startsWith('data:image/')) {
        throw new Error('Invalid cropped image data')
      }
      
      setSelectedPhoto(croppedUrl)
      setIsCropCompleted(true)
      
      // Update Executive Prompt Builder
      if (pendingFile) {
        promptBuilder.updatePhotoData(pendingFile, undefined, pendingFile.name)
        console.log('✅ Photo data saved to Executive Prompt Builder')
      }
      
      setProcessingMessage('Crop applied successfully!')
      setTimeout(() => setProcessingMessage(''), 1000)
      
    } catch (err: any) {
      setError(`Failed to process cropped image: ${err?.message ?? ''}`)
      setIsCropCompleted(false)
      setSelectedPhoto(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCropCancel = () => {
    console.log('❌ Crop cancelled')
    setShowCropModal(false)
    setOriginalImage(null)
    setOptimizedImage(null)
    setPhotoFile(null)
    setPendingFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const handleContinueToNext = async () => {
    console.log('🚀 Continue to next page')
    
    if (!isCropCompleted || !selectedPhoto) {
      alert('Please crop your photo before continuing.')
      return
    }

    try {
      localStorage.setItem('selectedPhotoIndex', 'selectedPhoto')
      
      if (pendingFile) {
        localStorage.setItem('photoFileName', pendingFile.name)
        localStorage.setItem('photoFileSize', pendingFile.size.toString())
      }
      
      promptBuilder.updatePhotoData(pendingFile, undefined, pendingFile?.name || 'cropped-photo.jpg')
      console.log('✅ All photo data saved - navigating to story page')
      
      window.location.href = '/dashboard/create/story'
      
    } catch (error) {
      console.error('❌ Navigation error:', error)
      setError('Failed to save photo data. Please try again.')
    }
  }

  const handleSkip = async () => {
    console.log('⏭️ Skipping photo step')
    
    // Clear all data
    setSelectedPhoto(null)
    setPhotoFile(null)
    setOriginalImage(null)
    setOptimizedImage(null)
    setPendingFile(null)
    setIsCropCompleted(false)
    
    localStorage.removeItem('selectedPhotoIndex')
    localStorage.removeItem('photoFileName')
    localStorage.removeItem('photoFileSize')
    
    if (promptBuilder.promptData.photo) {
      promptBuilder.promptData.photo = null
      promptBuilder.saveAndValidate()
    }
    
    window.location.href = '/dashboard/create/story'
  }

  const handleRemovePhoto = () => {
    console.log('🗑️ Removing photo')
    
    setSelectedPhoto(null)
    setPhotoFile(null)
    setOriginalImage(null)
    setOptimizedImage(null)
    setPendingFile(null)
    setIsCropCompleted(false)
    
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
    
    if (promptBuilder.promptData.photo) {
      promptBuilder.promptData.photo = null
      promptBuilder.saveAndValidate()
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'white'
    }}>
      {/* Crop Modal - Using optimized image */}
      {showCropModal && optimizedImage && (
        <CropTool
          image={optimizedImage}
          onApply={handleCropApply}
          onCancel={handleCropCancel}
        />
      )}

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
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {[1,2,3,4,5,6].map((step) => (
            <div key={step} style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              backgroundColor: step === 1 ? '#10b981' : step === 2 ? '#1f2937' : '#e5e7eb',
              color: step <= 2 ? 'white' : '#9ca3af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              {step}
            </div>
          ))}
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          fontWeight: '700',
          color: '#1f2937',
          lineHeight: '1.2',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          Add Your Photo
        </h1>
      </div>

      <div style={{
        flex: '1',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
        padding: '2rem 1rem'
      }}>
        {/* Upload Method Toggle */}
        <div style={{ textAlign: 'center', width: '100%', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            backgroundColor: '#f3f4f6',
            borderRadius: '1rem',
            padding: '0.5rem'
          }}>
            <button
              type="button"
              onClick={() => setUploadMethod('upload')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: uploadMethod === 'upload' ? 'white' : 'transparent',
                color: uploadMethod === 'upload' ? '#1f2937' : '#6b7280',
                boxShadow: uploadMethod === 'upload' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)'
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>📂</span>
              Upload
            </button>
            <button
              type="button"
              onClick={() => setUploadMethod('camera')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: uploadMethod === 'camera' ? 'white' : 'transparent',
                color: uploadMethod === 'camera' ? '#1f2937' : '#6b7280',
                boxShadow: uploadMethod === 'camera' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)'
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>📷</span>
              Camera
            </button>
          </div>
        </div>

        {/* Photo Display Area */}
        <div style={{ textAlign: 'center', width: '100%', marginBottom: '3rem' }}>
          {!selectedPhoto ? (
            // Upload Area
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
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
              onClick={() => {
                if (!isProcessing) {
                  if (uploadMethod === 'upload') {
                    fileInputRef.current?.click()
                  } else {
                    cameraInputRef.current?.click()
                  }
                }
              }}
              onMouseEnter={(e) => {
                if (!isProcessing) {
                  const target = e.target as HTMLDivElement
                  target.style.borderColor = '#9ca3af'
                  target.style.backgroundColor = '#f5f5f5'
                }
              }}
              onMouseLeave={(e) => {
                if (!isProcessing) {
                  const target = e.target as HTMLDivElement
                  target.style.borderColor = '#d1d5db'
                  target.style.backgroundColor = '#fafafa'
                }
              }}
            >
              <div style={{ fontSize: 'clamp(3rem, 8vw, 4rem)', marginBottom: '1rem' }}>
                {isProcessing ? '⚙️' : (uploadMethod === 'upload' ? '📂' : '📷')}
              </div>
              <h3 style={{
                fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem',
                margin: '0 0 0.5rem 0'
              }}>
                {isProcessing ? 'Processing...' : (uploadMethod === 'upload' ? 'Upload a Photo' : 'Take a Photo')}
              </h3>
              <p style={{
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                color: '#6b7280',
                marginBottom: '1rem',
                padding: '0 1rem'
              }}>
                {isProcessing 
                  ? processingMessage || 'Please wait...'
                  : (uploadMethod === 'upload'
                    ? 'Click to browse your files or drag and drop'
                    : 'Click to open camera and capture a moment'
                  )
                }
              </p>
              <div style={{
                fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
                color: '#9ca3af'
              }}>
                {isProcessing ? '🔄 Auto-optimizing for best quality...' : 'Supports: JPG, PNG, HEIC, WebP'}
              </div>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                disabled={isProcessing}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                disabled={isProcessing}
              />
            </div>
          ) : (
            // Selected Photo Display
            <div style={{
              width: '100%',
              maxWidth: '500px',
              margin: '0 auto',
              position: 'relative'
            }}>
              <div style={{
                width: '100%',
                height: '300px',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#f3f4f6',
                border: isCropCompleted ? '3px solid #10b981' : '1px solid #e5e7eb'
              }}>
                <img
                  src={selectedPhoto}
                  alt="Selected photo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <button
                  onClick={handleRemovePhoto}
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
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
                
                {/* Success indicator */}
                {isCropCompleted && (
                  <div style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '1rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    ✅ Cropped & Ready
                  </div>
                )}
              </div>
              
              <div style={{
                marginTop: '1rem',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                color: '#6b7280'
              }}>
                {photoFile?.name && `📁 ${photoFile.name}`}
                {isCropCompleted && (
                  <div style={{ color: '#10b981', fontWeight: '600', marginTop: '0.5rem' }}>
                    Ready to continue to next step
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div style={{ marginTop: '1rem', color: 'red', fontWeight: 600 }}>
              {error}
            </div>
          )}
        </div>

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
            onClick={handleContinueToNext}
            disabled={!isCropCompleted || isProcessing}
            style={{
              background: (isCropCompleted && !isProcessing)
                ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                : '#e5e7eb',
              color: (isCropCompleted && !isProcessing) ? 'white' : '#9ca3af',
              fontSize: 'clamp(1.25rem, 4vw, 2rem)',
              fontWeight: '900',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: (isCropCompleted && !isProcessing) ? 'pointer' : 'not-allowed',
              boxShadow: (isCropCompleted && !isProcessing) ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            {isCropCompleted ? 'Continue →' : 'Crop Photo First'}
          </button>
        </div>

        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '1rem'
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
