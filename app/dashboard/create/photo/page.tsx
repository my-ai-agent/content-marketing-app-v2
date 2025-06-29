'use client'
import Link from 'next/link'
import { useState, useRef } from 'react'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

export default function PhotoUpload() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'camera'>('upload')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingMessage, setProcessingMessage] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Simple file selection with basic optimization
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📁 File selected')
    setIsProcessing(true)
    setProcessingMessage('Loading image...')
    
    const file = e.target.files && e.target.files[0]
    if (!file) {
      setIsProcessing(false)
      return
    }

    try {
      // Basic validation
      if (file.size > 10 * 1024 * 1024) {
        alert('File too large. Please use images under 10MB.')
        setIsProcessing(false)
        return
      }

      // Format validation
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.')
        setIsProcessing(false)
        return
      }

      setPhotoFile(file)
      setProcessingMessage('Processing image...')

      // Simple file reading
      const reader = new FileReader()
      
      reader.onload = (ev) => {
        const result = ev.target?.result
        if (typeof result === 'string') {
          setSelectedPhoto(result)
          setProcessingMessage('Photo ready!')
          
          // Store in localStorage (simple approach)
          try {
            localStorage.setItem('userPhoto', result)
            localStorage.setItem('userPhotoName', file.name)
            console.log('✅ Photo saved successfully')
          } catch (err) {
            console.log('⚠️ LocalStorage full, but photo still ready')
          }
          
          setTimeout(() => setProcessingMessage(''), 1000)
        }
      }

      reader.onerror = () => {
        alert('Failed to read file. Please try again.')
      }
      
      reader.readAsDataURL(file)

    } catch (error) {
      console.error('File processing error:', error)
      alert('Failed to process image. Please try a different photo.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleContinue = () => {
    console.log('🚀 Continue to next page')
    
    if (!selectedPhoto) {
      alert('Please select a photo first.')
      return
    }

    // Simple navigation - no complex data handling
    window.location.href = '/dashboard/create/story'
  }

  const handleSkip = () => {
    console.log('⏭️ Skipping photo step')
    
    // Clear any stored photo data
    localStorage.removeItem('userPhoto')
    localStorage.removeItem('userPhotoName')
    
    // Go to next step
    window.location.href = '/dashboard/create/story'
  }

  const handleRemovePhoto = () => {
    console.log('🗑️ Removing photo')
    
    setSelectedPhoto(null)
    setPhotoFile(null)
    
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
    
    // Clear stored data
    localStorage.removeItem('userPhoto')
    localStorage.removeItem('userPhotoName')
  }

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

        <p style={{
          fontSize: 'clamp(1rem, 3vw, 1.25rem)',
          color: '#6b7280',
          textAlign: 'center',
          maxWidth: '600px',
          margin: 0
        }}>
          Upload your amazing travel photo - we'll handle the rest!
        </p>
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
                Supports: JPG, PNG, HEIC, WebP (under 10MB)
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
                border: '3px solid #10b981'
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
                  ✅ Photo Ready
                </div>
              </div>
              
              <div style={{
                marginTop: '1rem',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                color: '#6b7280'
              }}>
                {photoFile?.name && `📁 ${photoFile.name}`}
                <div style={{ color: '#10b981', fontWeight: '600', marginTop: '0.5rem' }}>
                  Ready to continue to next step
                </div>
              </div>
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
            onClick={handleContinue}
            disabled={!selectedPhoto || isProcessing}
            style={{
              background: (selectedPhoto && !isProcessing)
                ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                : '#e5e7eb',
              color: (selectedPhoto && !isProcessing) ? 'white' : '#9ca3af',
              fontSize: 'clamp(1.25rem, 4vw, 2rem)',
              fontWeight: '900',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: (selectedPhoto && !isProcessing) ? 'pointer' : 'not-allowed',
              boxShadow: (selectedPhoto && !isProcessing) ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            {selectedPhoto ? 'Continue →' : 'Upload Photo First'}
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
