// Photo Page: /app/dashboard/create/photo/page.tsx
'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import ExecutivePromptBuilder from '../../../utils/ExecutivePromptBuilder'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

export default function PhotoCapture() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [promptProgress, setPromptProgress] = useState(0)
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const [promptBuilder] = useState(() => new ExecutivePromptBuilder())

  useEffect(() => {
    const existingPhoto = localStorage.getItem('uploadedPhoto')
    if (existingPhoto) {
      setUploadedPhoto(existingPhoto)
    }

    const handleProgress = (event: CustomEvent) => {
      setPromptProgress(event.detail.percentage)
    }
    
    window.addEventListener('promptProgress', handleProgress)
    
    const validation = promptBuilder.validateCompleteness()
    setPromptProgress(validation.completionPercentage)
    
    return () => window.removeEventListener('promptProgress', handleProgress)
  }, [promptBuilder])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    setIsProcessing(true)
    setSelectedFile(file)

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.')
      setIsProcessing(false)
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Please select an image smaller than 10MB.')
      setIsProcessing(false)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      setUploadedPhoto(imageUrl)
      
      localStorage.setItem('uploadedPhoto', imageUrl)
      localStorage.setItem('photoFileName', file.name)
      localStorage.setItem('photoFileSize', file.size.toString())
      
      promptBuilder.updatePhotoData(file, null, file.name)
      
      setIsProcessing(false)
      console.log('✅ Photo processed and saved to Executive Prompt Builder')
    }
    reader.readAsDataURL(file)
  }

  const handleCameraCapture = () => {
    cameraInputRef.current?.click()
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleNext = () => {
    if (uploadedPhoto) {
      if (selectedFile) {
        promptBuilder.updatePhotoData(selectedFile, null, selectedFile.name)
      }
      
      console.log('🚀 Moving to Story step with photo data captured')
      window.location.href = '/dashboard/create/story'
    } else {
      alert('Please upload a photo before continuing.')
    }
  }

  const handleSkip = () => {
    promptBuilder.promptData.photo = {
      hasPhoto: false,
      fileName: 'no-photo-placeholder',
      fileSize: 0,
      visualElements: {
        hasPhoto: false,
        suggestedVisualElements: 'Text-based content without photo',
        photoDescription: 'User chose to proceed without photo'
      },
      timestamp: new Date().toISOString()
    }
    promptBuilder.saveAndValidate()
    
    console.log('⏭️ Skipping photo step - proceeding with text-only content')
    window.location.href = '/dashboard/create/story'
  }

  const handleRetake = () => {
    setUploadedPhoto(null)
    setSelectedFile(null)
    localStorage.removeItem('uploadedPhoto')
    localStorage.removeItem('photoFileName') 
    localStorage.removeItem('photoFileSize')
    
    promptBuilder.promptData.photo = null
    promptBuilder.saveAndValidate()
    
    console.log('🔄 Photo cleared from Executive Prompt Builder')
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      backgroundColor: 'white'
    }}>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '2rem 1rem',
        borderBottom: '1px solid #f3f4f6'
      }}>

        {promptProgress > 0 && (
          <div style={{ 
            width: '100%', 
            maxWidth: '600px', 
            marginBottom: '1rem' 
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <span style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280', 
                fontWeight: '500' 
              }}>
                Content Brief Progress
              </span>
              <span style={{ 
                fontSize: '0.875rem', 
                color: BRAND_PURPLE, 
                fontWeight: '600' 
              }}>
                {promptProgress}%
              </span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '6px', 
              backgroundColor: '#e5e7eb', 
              borderRadius: '3px' 
            }}>
              <div style={{ 
                width: `${promptProgress}%`, 
                height: '100%', 
                background: `linear-gradient(90deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`,
                borderRadius: '3px',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        )}

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
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#e5e7eb' }}></div>
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
          }}>2</div>
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#e5e7eb' }}></div>
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
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#e5e7eb' }}></div>
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
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#e5e7eb' }}></div>
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
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#e5e7eb' }}></div>
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
          maxWidth: '600px'
        }}>
          Upload a photo that captures your tourism experience. This will be the visual foundation for your content.
        </p>
      </div>

      <div style={{ 
        flex: '1', 
        maxWidth: '800px', 
        margin: '0 auto', 
        width: '100%', 
        padding: '2rem 1rem' 
      }}>

        <div style={{ textAlign: 'center', width: '100%', marginBottom: '3rem' }}>
          
          {!uploadedPhoto ? (
            <div style={{
              width: '100%',
              maxWidth: '500px',
              margin: '0 auto',
              position: 'relative'
            }}>
              <div style={{
                width: '100%',
                minHeight: '400px',
                border: '3px dashed #d1d5db',
                borderRadius: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fafafa',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={handleUploadClick}
              onMouseEnter={(e) => {
                const target = e.target as HTMLDivElement
                target.style.borderColor = BRAND_PURPLE
                target.style.backgroundColor = '#f8f9ff'
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLDivElement
                target.style.borderColor = '#d1d5db'
                target.style.backgroundColor = '#fafafa'
              }}
              >
                <div style={{
                  fontSize: 'clamp(3rem, 8vw, 4rem)',
                  marginBottom: '1rem',
                  opacity: 0.6
                }}>
                  📸
                </div>
                
                <h3 style={{
                  fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Drop your photo here
                </h3>
                
                <p style={{
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                  color: '#9ca3af',
                  marginBottom: '2rem'
                }}>
                  or click to browse files
                </p>

                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUploadClick()
                    }}
                    style={{
                      background: `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`,
                      color: 'white',
                      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                      fontWeight: '600',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '1rem',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    📁 Upload File
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCameraCapture()
                    }}
                    style={{
                      background: 'white',
                      color: BRAND_PURPLE,
                      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                      fontWeight: '600',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '1rem',
                      border: `2px solid ${BRAND_PURPLE}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    📷 Take Photo
                  </button>
                </div>

                {isProcessing && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    Processing image...
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{
              width: '100%',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <div style={{
                borderRadius: '1.5rem',
                overflow: 'hidden',
                border: '3px solid #10b981',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                marginBottom: '1rem'
              }}>
                <img 
                  src={uploadedPhoto} 
                  alt="Your uploaded photo" 
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    display: 'block' 
                  }}
                />
              </div>
              
              <button
                onClick={handleRetake}
                style={{
                  background: 'transparent',
                  color: '#6b7280',
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                  fontWeight: '500',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '1rem',
                  border: '2px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLButtonElement
                  target.style.borderColor = '#d1d5db'
                  target.style.backgroundColor = '#f9fafb'
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLButtonElement
                  target.style.borderColor = '#e5e7eb'
                  target.style.backgroundColor = 'transparent'
                }}
              >
                🔄 Choose Different Photo
              </button>
            </div>
          )}
        </div>

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
            disabled={!uploadedPhoto}
            style={{
              background: uploadedPhoto 
                ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                : '#e5e7eb',
              color: uploadedPhoto ? 'white' : '#9ca3af',
              fontSize: 'clamp(1.25rem, 4vw, 2rem)',
              fontWeight: '900',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: uploadedPhoto ? 'pointer' : 'not-allowed',
              boxShadow: uploadedPhoto ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Continue →
          </button>
        </div>

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
  )
}
