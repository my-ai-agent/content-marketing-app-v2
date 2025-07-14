'use client'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { Camera, Globe, ImageIcon } from 'lucide-react'

// Simple IndexedDB helper (inline, no 3rd party dependency)
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

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

// Compression config for mobile-optimized, localStorage/IndexedDB safe
const MAX_WIDTH = 1280
const MAX_HEIGHT = 1280
const OUTPUT_QUALITY = 0.80

export type PhotoType = 'experience' | 'business' | 'reference'

export default function PhotoUpload() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'camera'>('upload')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [photoType, setPhotoType] = useState<PhotoType | null>(null)
  const [showTypeSelection, setShowTypeSelection] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const photoTypeOptions = [
    {
      type: 'experience' as PhotoType,
      icon: Camera,
      title: 'Experience Photo',
      description: 'Your personal travel or tourism experience photo',
      aiHelp: 'Claude will analyse your experience and create authentic, engaging content that captures your personal journey and cultural encounters.'
    },
    {
      type: 'business' as PhotoType,
      icon: Globe,
      title: 'Business Website Image',
      description: 'Landing page, hero image, or marketing material from your business website',
      aiHelp: 'Claude will analyse your brand visual elements and create content that maintains brand consistency while adding cultural intelligence and authentic storytelling.'
    },
    {
      type: 'reference' as PhotoType,
      icon: ImageIcon,
      title: 'Reference/Inspiration Image',
      description: 'Social media post, competitor content, or inspirational material to guide content style',
      aiHelp: 'Claude will analyse the visual style and messaging approach, then create original content inspired by successful patterns while maintaining your unique voice.'
    }
  ]

  const handlePhotoTypeSelection = (type: PhotoType) => {
    setPhotoType(type)
    setShowTypeSelection(false)
    // Store photo type for later Claude prompt enhancement
    localStorage.setItem('photoType', type)
  }

  const changePhotoType = () => {
    setShowTypeSelection(true)
    setPhotoType(null)
    setSelectedPhoto(null)
    setPhotoFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
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

  const handleNext = async () => {
    setError(null)
    if (selectedPhoto) {
      try {
        localStorage.setItem('selectedPhotoIndex', 'selectedPhoto')
        localStorage.setItem('photoType', photoType || 'experience')
        window.location.href = '/dashboard/create/story'
      } catch {
        setError('Failed to save photo. Storage quota may be exceeded.')
      }
    } else {
      alert('Please select a photo before continuing.')
    }
  }

  const handleSkip = async () => {
    setError(null)
    setSelectedPhoto(null)
    setPhotoFile(null)
    localStorage.removeItem('selectedPhotoIndex')
    localStorage.removeItem('photoFileName')
    localStorage.removeItem('photoFileSize')
    localStorage.removeItem('photoType')
    await removeImageFromIndexedDB('selectedPhoto')
    window.location.href = '/dashboard/create/story'
  }

  const handleRemovePhoto = async () => {
    setSelectedPhoto(null)
    setPhotoFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
    await removeImageFromIndexedDB('selectedPhoto')
    localStorage.removeItem('selectedPhotoIndex')
    localStorage.removeItem('photoFileName')
    localStorage.removeItem('photoFileSize')
  }

  // Simplified file select handler - direct to compression and save
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // File size limit (10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Please use images under 10MB.');
      return;
    }

    let processedFile = file;

    // Handle HEIC/HEIF conversion with dynamic import
    if (
      file.type === "image/heic" || file.type === "image/heif" ||
      file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif")
    ) {
      try {
        setError("Converting iPhone photo, please wait...");
        const heic2any = (await import("heic2any")).default;
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8
        }) as Blob;

        processedFile = new File([convertedBlob],
          file.name.replace(/\.heic$/i, ".jpg"),
          { type: "image/jpeg" }
        );
        setError(null);
      } catch (err) {
        setError("Failed to convert iPhone photo. Please try a different file.");
        return;
      }
    }

    // Check supported formats (after conversion, processedFile.type may have changed)
    if (!/image\/(jpeg|png|webp)/.test(processedFile.type)) {
      setError('Unsupported format. Please use JPG, PNG, WebP, or iPhone photos.');
      return;
    }

    setPhotoFile(processedFile);

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const result = ev.target?.result;
      if (typeof result === 'string') {
        try {
          // Compress and save directly - no crop step
          setError("Processing image...");
          const compressedBlob = await compressWithPica(result);
          await saveImageToIndexedDB('selectedPhoto', compressedBlob);
          setSelectedPhoto(result);
          
          // Save file metadata
          localStorage.setItem('photoFileName', processedFile.name);
          localStorage.setItem('photoFileSize', processedFile.size.toString());
          localStorage.setItem('photoType', photoType || 'experience');
          
          setError(null);
        } catch (err) {
          setError('Failed to process image. Please try a smaller file or different format.');
          setSelectedPhoto(null);
        }
      } else {
        setError('Failed to read file');
      }
    };

    reader.onerror = () => setError('Failed to read file');
    reader.readAsDataURL(processedFile);
  };

  // Photo Type Selection Screen
  if (showTypeSelection) {
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
              backgroundColor: '#e5e7eb',
              color: '#9ca3af',
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
          
          <h1 style={{
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            fontWeight: '700',
            color: '#1f2937',
            lineHeight: '1.2',
            marginBottom: '0.5rem',
            textAlign: 'center'
          }}>
            Choose Your Photo Type
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 3vw, 1.25rem)',
            color: '#6b7280',
            textAlign: 'center',
            margin: '0'
          }}>
            Select the type of image you'd like to share for optimal AI content creation
          </p>
        </div>

        <div style={{
          flex: '1',
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%',
          padding: '2rem 1rem'
        }}>
          {/* Photo Type Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
            {photoTypeOptions.map((option) => {
              const IconComponent = option.icon
              return (
                <button
                  key={option.type}
                  onClick={() => handlePhotoTypeSelection(option.type)}
                  style={{
                    width: '100%',
                    padding: '2rem',
                    backgroundColor: 'white',
                    borderRadius: '1.5rem',
                    border: '2px solid #f3f4f6',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = BRAND_PURPLE
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#f3f4f6'
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <IconComponent style={{ width: '1.5rem', height: '1.5rem', color: BRAND_PURPLE }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                        fontWeight: '700',
                        color: '#1f2937',
                        marginBottom: '0.5rem',
                        margin: '0 0 0.5rem 0'
                      }}>
                        {option.title}
                      </h3>
                      <p style={{
                        fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                        color: '#6b7280',
                        marginBottom: '1rem',
                        margin: '0 0 1rem 0'
                      }}>
                        {option.description}
                      </p>
                      <div style={{
                        backgroundColor: '#f0f9ff',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        border: '1px solid #e0f2fe'
                      }}>
                        <p style={{
                          fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                          color: '#0c4a6e',
                          fontWeight: '600',
                          margin: '0'
                        }}>
                          🤖 AI Enhancement: {option.aiHelp}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
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

  // Main Photo Upload Screen (after type selection)
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

        {/* Title with Photo Type Context */}
        <h1 style={{
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          fontWeight: '700',
          color: '#1f2937',
          lineHeight: '1.2',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          Add Your {photoType === 'experience' ? 'Experience' : photoType === 'business' ? 'Business' : 'Reference'} Photo
        </h1>
        <button 
          onClick={changePhotoType}
          style={{
            color: BRAND_PURPLE,
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            fontWeight: '600',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Change photo type
        </button>
      </div>

      <div style={{
        flex: '1',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
        padding: '2rem 1rem'
      }}>
        {/* Photo Type Context Banner */}
        <div style={{
          backgroundColor: '#f0f9ff',
          padding: '1.5rem',
          borderRadius: '1rem',
          marginBottom: '2rem',
          border: '1px solid #e0f2fe'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {photoType === 'experience' && <Camera style={{ width: '1.5rem', height: '1.5rem', color: BRAND_PURPLE }} />}
            {photoType === 'business' && <Globe style={{ width: '1.5rem', height: '1.5rem', color: BRAND_PURPLE }} />}
            {photoType === 'reference' && <ImageIcon style={{ width: '1.5rem', height: '1.5rem', color: BRAND_PURPLE }} />}
            <div>
              <h3 style={{
                fontSize: 'clamp(1.125rem, 3vw, 1.25rem)',
                fontWeight: '700',
                color: '#0c4a6e',
                margin: '0 0 0.25rem 0'
              }}>
                {photoType === 'experience' && 'Experience Photo Selected'}
                {photoType === 'business' && 'Business Content Selected'}  
                {photoType === 'reference' && 'Reference Content Selected'}
              </h3>
              <p style={{
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                color: '#0c4a6e',
                margin: '0'
              }}>
                {photoType === 'experience' && 'Claude will create authentic content from your personal travel experience'}
                {photoType === 'business' && 'Claude will maintain brand consistency while adding cultural intelligence'}
                {photoType === 'reference' && 'Claude will create original content inspired by successful patterns'}
              </p>
            </div>
          </div>
        </div>

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

        {/* Photo Upload Area */}
        <div style={{ textAlign: 'center', width: '100%', marginBottom: '3rem' }}>
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
                  src={selectedPhoto}
                  alt="Selected photo"
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
                {photoFile?.name && `📁 ${photoFile.name}`}
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
            disabled={!selectedPhoto || isProcessing}
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
        <button 
          onClick={changePhotoType}
          style={{
            color: '#6b7280',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)'
          }}
        >
          ← Change Photo Type
        </button>
      </div>
    </div>
  )
}
