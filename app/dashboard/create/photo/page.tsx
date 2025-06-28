'use client'
import Link from 'next/link'
import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import ExecutivePromptBuilder from '../../../utils/ExecutivePromptBuilder'

// Dynamically import CropTool in case it uses browser APIs at the module level
const CropTool = dynamic(() => import('./CropTool'), { ssr: false })

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

export default function PhotoUpload() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'camera'>('upload')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCropModal, setShowCropModal] = useState(false)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  // Initialize Executive Prompt Builder
  const [promptBuilder] = useState(() => new ExecutivePromptBuilder())

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

  // On file selection, show crop modal with loaded image (as data URL)
  const handleCropApply = async (croppedUrl: string) => {
    setShowCropModal(false)
    setIsProcessing(true)
    try {
      if (!croppedUrl.startsWith('data:image/')) {
        throw new Error('Invalid cropped image data')
      }
      const compressedBlob = await compressWithPica(croppedUrl)
      await saveImageToIndexedDB('selectedPhoto', compressedBlob)
      setSelectedPhoto(croppedUrl)
      if (pendingFile) {
        localStorage.setItem('photoFileName', pendingFile.name)
        localStorage.setItem('photoFileSize', pendingFile.size.toString())
        // TypeScript-safe usage: string | null
        promptBuilder.updatePhotoData(pendingFile, undefined, pendingFile.name ?? null)
        console.log('✅ Photo data saved to Executive Prompt Builder')
      }
    } catch (err: any) {
      setError(`Failed to process cropped image. ${err?.message ?? ''} Please try again.`)
      setSelectedPhoto(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCropCancel = () => {
    setShowCropModal(false)
    setOriginalImage(null)
    setPhotoFile(null)
    setPendingFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const handleNext = async () => {
    setError(null)
    if (selectedPhoto) {
      try {
        localStorage.setItem('selectedPhotoIndex', 'selectedPhoto')
        // TypeScript-safe usage: string | null
        if (pendingFile) {
          promptBuilder.updatePhotoData(pendingFile, undefined, pendingFile.name ?? null)
        }
        console.log('🚀 Moving to Story step with photo data captured')
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
    setOriginalImage(null)
    setPendingFile(null)
    localStorage.removeItem('selectedPhotoIndex')
    localStorage.removeItem('photoFileName')
    localStorage.removeItem('photoFileSize')
    await removeImageFromIndexedDB('selectedPhoto')

    // NEW: Update Executive Prompt Builder with no-photo data
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
    console.log('⏭️ Skipping photo - proceeding with text-only content')

    window.location.href = '/dashboard/create/story'
  }

  const handleRemovePhoto = async () => {
    setSelectedPhoto(null)
    setPhotoFile(null)
    setOriginalImage(null)
    setPendingFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
    await removeImageFromIndexedDB('selectedPhoto')
    localStorage.removeItem('selectedPhotoIndex')
    localStorage.removeItem('photoFileName')
    localStorage.removeItem('photoFileSize')

    // NEW: Clear photo data from Executive Prompt Builder
    promptBuilder.promptData.photo = null
    promptBuilder.saveAndValidate()
    console.log('🔄 Photo cleared from Executive Prompt Builder')
  }

  // File select handler with dynamic heic2any import
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

    setPendingFile(processedFile);
    setPhotoFile(processedFile);

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const result = ev.target?.result;
      if (typeof result === 'string') {
        try {
          // Pre-compress large images for better crop performance
          const img = new Image();
          img.src = result;

          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });

          let finalImageUrl = result;
          const MAX_DISPLAY_SIZE = 2048;

          // Pre-compress if image is very large
          if (img.naturalWidth > MAX_DISPLAY_SIZE || img.naturalHeight > MAX_DISPLAY_SIZE) {
            setError("Optimizing large photo for editing...");

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const scale = Math.min(
              MAX_DISPLAY_SIZE / img.naturalWidth,
              MAX_DISPLAY_SIZE / img.naturalHeight
            );

            canvas.width = Math.round(img.naturalWidth * scale);
            canvas.height = Math.round(img.naturalHeight * scale);

            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            finalImageUrl = canvas.toDataURL('image/jpeg', 0.85);
            setError(null);
          }

          setOriginalImage(finalImageUrl);
          setShowCropModal(true);
        } catch (err) {
          setError('Failed to process image. Please try a smaller file or different format.');
        }
      } else {
        setError('Failed to read file');
      }
    };

    reader.onerror = () => setError('Failed to read file');
    reader.readAsDataURL(processedFile);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'white'
    }}>
      {/* Crop Modal */}
      {showCropModal && originalImage && (
        <CropTool
          image={originalImage}
          onApply={handleCropApply}
          onCancel={handleCropCancel}
        />
      )}

      {/* Header with Step Tracker Only */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1rem',
        borderBottom: '1px solid #f3f4f6'
      }}>
        {/* Step Tracker - Updated to 6 steps */}
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
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#10b981' }}></div>
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
        {/* Title */}
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
            className={selectedPhoto ? "transition-all hover:scale-105" : ""}
          >
            Next →
          </button>
        </div>
        {/* Logo - Brand Reinforcement - Deactivated */}
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
