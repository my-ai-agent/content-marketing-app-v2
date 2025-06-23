'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { processImageWithPica, simpleFallbackProcessing } from '../../../utils/picaProcessor'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

export default function PhotoCapture() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      
      // Add small delay for iOS file readiness
      await new Promise(resolve => setTimeout(resolve, 100))

      try {
        // Try Pica processing first (mobile-optimized)
        const processed = await processImageWithPica(file)
        
        // Store processed image (no localStorage quota issues!)
        localStorage.setItem('selectedPhoto', processed.processedImage)
        setSelectedPhoto(processed.processedImage)
        setPhotoFile(file)
      } catch (picaError) {
        console.warn('Pica processing failed, trying fallback:', picaError)
        // Fallback to simple processing
        const fallback = await simpleFallbackProcessing(file)
        localStorage.setItem('selectedPhoto', fallback.processedImage)
        setSelectedPhoto(fallback.processedImage)
        setPhotoFile(file)
      }
    } catch (error) {
      console.error('All image processing failed:', error)
      if (error instanceof Error && error.message.includes('HEIC')) {
        alert('iPhone HEIC photos are not supported. Please:\n1. Change your camera settings to JPEG, or\n2. Select a different photo')
      } else if (error instanceof Error && error.message.includes('too large')) {
        alert('Image is too large. Please choose a smaller photo (under 20MB).')
      } else {
        alert('Failed to process image. Please try:\n• A different photo\n• A smaller file size\n• JPEG or PNG format')
      }
    } finally {
      setUploading(false)
    }
  }

  const handleNext = () => {
    if (selectedPhoto && caption.trim()) {
      // Store caption for later use
      localStorage.setItem('photoCaption', caption.trim())
      localStorage.setItem('userStory', caption.trim()) // Basic story starts with caption
    }
  }

  const isReadyToNext = selectedPhoto && caption.trim().length > 0

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Progress Indicator */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            backgroundColor: BRAND_PURPLE, 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>1</div>
          <div style={{ width: '3rem', height: '2px', backgroundColor: '#ddd' }}></div>
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            backgroundColor: '#ddd', 
            color: '#999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>2</div>
          <div style={{ width: '3rem', height: '2px', backgroundColor: '#ddd' }}></div>
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            backgroundColor: '#ddd', 
            color: '#999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>3</div>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '800',
            color: '#2D3748',
            margin: '0 0 1rem 0'
          }}>
            Capture Your Amazing Moment
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#4A5568',
            margin: '0',
            lineHeight: '1.6'
          }}>
            The only tourism app that works exactly how tourists actually behave:<br/>
            📸 <strong>See something amazing</strong> → <strong>Capture it</strong> → <strong>Share it professionally</strong>
          </p>
        </div>

        {/* Photo Upload Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          {!selectedPhoto ? (
            <>
              {/* Upload Options */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    backgroundColor: BRAND_ORANGE,
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '25px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    opacity: uploading ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  📁 Upload
                </button>
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    backgroundColor: BRAND_BLUE,
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '25px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    opacity: uploading ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  📷 Camera
                </button>
              </div>

              {/* Upload Area */}
              <div style={{
                border: '3px dashed #CBD5E0',
                borderRadius: '12px',
                padding: '3rem 2rem',
                textAlign: 'center',
                backgroundColor: '#F7FAFC'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📸</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2D3748', margin: '0 0 0.5rem 0' }}>
                  Upload Your Photo
                </h3>
                <p style={{ color: '#718096', margin: '0 0 1.5rem 0' }}>
                  Drop your amazing travel photo here or click to browse
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    backgroundColor: BRAND_PURPLE,
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 2rem',
                    borderRadius: '25px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    opacity: uploading ? 0.7 : 1
                  }}
                >
                  {uploading ? 'Processing...' : '📁 Choose Photo'}
                </button>
              </div>

              <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#718096', marginTop: '1rem' }}>
                💡 Tips: For best results, use JPEG or PNG format under 10MB
              </p>
            </>
          ) : (
            /* Photo Preview */
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2D3748', margin: '0 0 1rem 0' }}>
                Your Amazing Photo
              </h3>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <img 
  src={selectedPhoto} 
  alt="Your amazing photo" 
  className="w-full max-h-96 object-cover rounded-3xl shadow-xl"
/>
              </div>
              <button
                onClick={() => {
                  setSelectedPhoto(null)
                  setPhotoFile(null)
                  setCaption('')
                }}
                style={{
                  backgroundColor: '#E2E8F0',
                  color: '#4A5568',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                🔄 Change Photo
              </button>
            </div>
          )}

          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
          />
        </div>

        {/* LinkedIn-Style Caption Section - Only show when photo is selected */}
        {selectedPhoto && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '1.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2D3748', margin: '0 0 1rem 0' }}>
              📝 Add a caption
            </h3>
            
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption... (e.g., Amazing day at Milford Sound)"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #E2E8F0',
                borderRadius: '12px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = BRAND_PURPLE}
              onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
            />
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '0.5rem',
              fontSize: '0.9rem',
              color: '#718096'
            }}>
              <span>{caption.length} characters</span>
              <span>Keep it simple and authentic!</span>
            </div>
          </div>
        )}
        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link 
            href="/"
            style={{
              color: '#718096',
              textDecoration: 'none',
              fontSize: '1rem',
              padding: '0.75rem 1.5rem'
            }}
          >
            ← Back to Home
          </Link>

          {isReadyToNext ? (
            <Link
              href="/dashboard/create/demographics"
              onClick={handleNext}
              style={{
                background: `linear-gradient(135deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`,
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '25px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: '600',
                boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Next: Choose Demographics →
            </Link>
          ) : (
            <button
              disabled
              style={{
                backgroundColor: '#E2E8F0',
                color: '#A0AEC0',
                padding: '1rem 2rem',
                borderRadius: '25px',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'not-allowed'
              }}
            >
              Next: Choose Demographics →
            </button>
          )}
        </div>

        {/* Brand Logo Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '3rem',
          padding: '1rem'
        }}>
          <div style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: '900',
            lineHeight: '0.9'
          }}>
            <span style={{ color: BRAND_PURPLE }}>click</span>{' '}
            <span style={{ color: BRAND_ORANGE }}>speak</span>{' '}
            <span style={{ color: BRAND_BLUE }}>send</span>
          </div>
        </div>
      </div>
    </div>
  )
}
