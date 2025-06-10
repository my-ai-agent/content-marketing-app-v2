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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedPhoto(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNext = () => {
    if (selectedPhoto) {
      // Save photo data to localStorage
      localStorage.setItem('selectedPhoto', selectedPhoto)
      if (photoFile) {
        localStorage.setItem('photoFileName', photoFile.name)
        localStorage.setItem('photoFileSize', photoFile.size.toString())
      }
      window.location.href = '/dashboard/create/demographics'
    } else {
      alert('Please select a photo before continuing.')
    }
  }

  const handleSkip = () => {
    // Clear any existing photo data and continue
    localStorage.removeItem('selectedPhoto')
    localStorage.removeItem('photoFileName')
    localStorage.removeItem('photoFileSize')
    window.location.href = '/dashboard/create/demographics'
  }

  const handleRemovePhoto = () => {
    setSelectedPhoto(null)
    setPhotoFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = ''
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      backgroundColor: 'white', 
      position: 'relative' 
    }}>
      
      {/* Step Indicator - Top Right */}
      <div style={{ 
        position: 'absolute', 
        top: '1.5rem', 
        right: '1.5rem', 
        zIndex: '10' 
      }}>
        <div style={{ 
          color: '#6b7280', 
          fontWeight: '600',
          fontSize: 'clamp(0.875rem, 2vw, 1rem)'
        }}>
          Step 2 of 5
        </div>
      </div>

      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '25vh', 
        textAlign: 'center', 
        width: '100%' 
      }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div style={{ 
              color: BRAND_PURPLE, 
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
              fontWeight: '900',
              lineHeight: '0.9',
              marginBottom: '0.2rem',
              display: 'inline'
            }}>speak</div>
            <div style={{ 
              color: BRAND_ORANGE, 
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
              fontWeight: '900',
              lineHeight: '0.9',
              marginBottom: '0.2rem',
              display: 'inline',
              marginLeft: '0.25rem'
            }}>click</div>
            <div style={{ 
              color: BRAND_BLUE, 
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
              fontWeight: '900',
              lineHeight: '0.9',
              display: 'inline',
              marginLeft: '0.25rem'
            }}>send</div>
          </Link>
        </div>
      </div>

      {/* Title Section */}
      <div style={{ textAlign: 'center', width: '100%', padding: '0 1rem' }}>
        <h1 style={{ 
          fontSize: 'clamp(2rem, 6vw, 4rem)', 
          fontWeight: '700',
          color: '#1f2937',
          lineHeight: '1.2',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          Add Your Photo
        </h1>
        <p style={{ 
          color: '#6b7280', 
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          marginTop: '1rem',
          maxWidth: '600px',
          margin: '1rem auto 0 auto'
        }}>
          Capture the moment or upload an inspiring photo to enhance your story
        </p>
      </div>

      {/* Spacing */}
      <div style={{ height: '2rem' }}></div>

      {/* Upload Method Toggle */}
      <div style={{ textAlign: 'center', width: '100%', padding: '0 1rem' }}>
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

      {/* Spacing */}
      <div style={{ height: '2rem' }}></div>

      {/* Photo Upload Area */}
      <div style={{ textAlign: 'center', width: '100%', padding: '0 1rem' }}>
        {!selectedPhoto ? (
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
            if (uploadMethod === 'upload') {
              fileInputRef.current?.click()
            } else {
              cameraInputRef.current?.click()
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
              {uploadMethod === 'upload' ? '📂' : '📷'}
            </div>
            <h3 style={{ 
              fontSize: 'clamp(1.125rem, 3vw, 1.5rem)', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '0.5rem',
              margin: '0 0 0.5rem 0'
            }}>
              {uploadMethod === 'upload' ? 'Upload a Photo' : 'Take a Photo'}
            </h3>
            <p style={{ 
              fontSize: 'clamp(0.875rem, 2vw, 1rem)', 
              color: '#6b7280',
              marginBottom: '1rem',
              padding: '0 1rem'
            }}>
              {uploadMethod === 'upload' 
                ? 'Click to browse your files or drag and drop'
                : 'Click to open camera and capture a moment'
              }
            </p>
            <div style={{ 
              fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)', 
              color: '#9ca3af' 
            }}>
              Supports: JPG, PNG, HEIC, WebP
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
              height: '300px',
              borderRadius: '1.5rem',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#f3f4f6'
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
            </div>
            <div style={{ 
              marginTop: '1rem',
              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              color: '#6b7280'
            }}>
              {photoFile?.name && `📁 ${photoFile.name}`}
            </div>
          </div>
        )}
      </div>

      {/* Spacing */}
      <div style={{ height: '3rem' }}></div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '1rem',
        width: '100%', 
        marginBottom: '2rem',
        padding: '0 1rem'
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
          disabled={!selectedPhoto}
          style={{
            background: selectedPhoto 
              ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
              : '#e5e7eb',
            color: selectedPhoto ? 'white' : '#9ca3af',
            fontSize: 'clamp(1.25rem, 4vw, 2rem)',
            fontWeight: '900',
            padding: '1rem 2rem',
            borderRadius: '1rem',
            border: 'none',
            cursor: selectedPhoto ? 'pointer' : 'not-allowed',
            boxShadow: selectedPhoto ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
            transition: 'all 0.2s'
          }}
          className={selectedPhoto ? "transition-all hover:scale-105" : ""}
        >
          Next →
        </button>
      </div>

      {/* Bottom Navigation */}
      <div style={{ 
        padding: '1.5rem', 
        textAlign: 'center',
        borderTop: '1px solid #f3f4f6'
      }}>
        <Link 
          href="/dashboard/create"
          style={{ 
            color: '#6b7280', 
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)'
          }}
        >
          ← Back to Create Story
        </Link>
      </div>

      {/* Spacer for bottom */}
      <div style={{ flex: '1' }}></div>
    </div>
  )
}
