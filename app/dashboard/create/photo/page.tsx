// /app/dashboard/create/photo/page.tsx - BRAND CONSISTENT VERSION
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

// Standardized Brand Logo Component
const BrandLogo = ({ size = 'default', layout = 'inline' }: { size?: 'default' | 'large', layout?: 'stacked' | 'inline' }) => (
  <div style={{ 
    display: layout === 'stacked' ? 'block' : 'flex',
    textAlign: 'center',
    alignItems: 'center',
    gap: layout === 'inline' ? '0.25rem' : '0'
  }}>
    <span style={{ 
      color: BRAND_PURPLE, 
      fontSize: size === 'large' ? 'clamp(2rem, 8vw, 3.5rem)' : 'clamp(1rem, 2.5vw, 1.25rem)',
      fontWeight: '900',
      display: layout === 'stacked' ? 'block' : 'inline',
      lineHeight: '0.9'
    }}>click</span>
    <span style={{ 
      color: BRAND_ORANGE, 
      fontSize: size === 'large' ? 'clamp(2rem, 8vw, 3.5rem)' : 'clamp(1rem, 2.5vw, 1.25rem)',
      fontWeight: '900',
      display: layout === 'stacked' ? 'block' : 'inline',
      lineHeight: '0.9'
    }}>speak</span>
    <span style={{ 
      color: BRAND_BLUE, 
      fontSize: size === 'large' ? 'clamp(2rem, 8vw, 3.5rem)' : 'clamp(1rem, 2.5vw, 1.25rem)',
      fontWeight: '900',
      display: layout === 'stacked' ? 'block' : 'inline',
      lineHeight: '0.9'
    }}>send</span>
  </div>
)

// Standardized Primary Button Component
const PrimaryButton = ({ 
  onClick, 
  children, 
  disabled = false, 
  size = 'default',
  style = {} 
}: { 
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
  size?: 'default' | 'large'
  style?: React.CSSProperties 
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      background: disabled 
        ? '#e5e7eb' 
        : `linear-gradient(135deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`,
      color: disabled ? '#9ca3af' : 'white',
      padding: size === 'large' ? '1.25rem 2.5rem' : '0.75rem 1.5rem',
      borderRadius: size === 'large' ? '1rem' : '0.75rem',
      fontSize: size === 'large' ? '1.25rem' : '1rem',
      fontWeight: '700',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      boxShadow: disabled ? 'none' : '0 4px 15px rgba(107, 46, 255, 0.2)',
      transition: 'all 0.3s ease',
      ...style
    }}
    onMouseOver={(e) => {
      if (!disabled) {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(107, 46, 255, 0.3)'
      }
    }}
    onMouseOut={(e) => {
      if (!disabled) {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(107, 46, 255, 0.2)'
      }
    }}
  >
    {children}
  </button>
)

// Standardized Step Tracker Component
const StepTracker = ({ currentStep }: { currentStep: number }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: '0.5rem', 
    marginBottom: '1.5rem' 
  }}>
    {[1, 2, 3, 4, 5, 6].map((step) => (
      <div key={step} style={{ 
        width: '2rem', 
        height: '2rem', 
        borderRadius: '50%', 
        backgroundColor: step < currentStep ? BRAND_ORANGE : (step === currentStep ? BRAND_PURPLE : '#e5e7eb'),
        color: step <= currentStep ? 'white' : '#9ca3af',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: '0.875rem', 
        fontWeight: '600',
        transition: 'all 0.3s ease'
      }}>
        {step}
      </div>
    ))}
  </div>
)

// Mobile-optimized constants
const MOBILE_MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB for mobile cameras
const DESKTOP_MAX_FILE_SIZE = 15 * 1024 * 1024 // 15MB for desktop
const MAX_DIMENSION = 1600 // Optimal for mobile processing
const COMPRESSION_QUALITY = 0.85 // High quality but mobile-friendly
const STORAGE_QUOTA_BUFFER = 5 * 1024 * 1024 // 5MB buffer for storage

// Server-safe mobile device detection with capabilities
const getMobileCapabilities = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      isMobile: false,
      isIOS: false,
      isAndroid: false,
      hasCamera: false,
      touchSupported: false,
      supportsFileAPI: false,
      supportsCanvas: false,
      supportsCameraCapture: false
    };
  }

  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);
  const hasCamera = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
  const touchSupported = 'ontouchstart' in window;
  
  return {
    isMobile,
    isIOS,
    isAndroid,
    hasCamera,
    touchSupported,
    supportsFileAPI: 'File' in window && 'FileReader' in window,
    supportsCanvas: !!document.createElement('canvas').getContext,
    supportsCameraCapture: hasCamera && isMobile
  };
};

// Unified image processing with mobile optimization
const processImageForMobile = async (file: File): Promise<{
  processedBlob: Blob;
  dataUrl: string;
  metadata: {
    originalSize: number;
    processedSize: number;
    compressionRatio: number;
    dimensions: { width: number; height: number };
  };
}> => {
  return new Promise((resolve, reject) => {
    const capabilities = getMobileCapabilities();
    const maxFileSize = capabilities.isMobile ? MOBILE_MAX_FILE_SIZE : DESKTOP_MAX_FILE_SIZE;
    
    if (file.size > maxFileSize) {
      reject(new Error(`Image too large. Maximum size: ${Math.round(maxFileSize / 1024 / 1024)}MB`));
      return;
    }

    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas not supported'));
      return;
    }

    img.onload = () => {
      try {
        let { width, height } = img;
        const aspectRatio = width / height;
        
        let targetDimension = MAX_DIMENSION;
        if (capabilities.isMobile && file.size > 10 * 1024 * 1024) {
          targetDimension = 1200;
        }
        
        if (width > targetDimension || height > targetDimension) {
          if (width > height) {
            width = targetDimension;
            height = Math.round(targetDimension / aspectRatio);
          } else {
            height = targetDimension;
            width = Math.round(targetDimension * aspectRatio);
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const devicePixelRatio = window.devicePixelRatio || 1;
        if (devicePixelRatio > 1 && capabilities.isMobile) {
          canvas.style.width = width + 'px';
          canvas.style.height = height + 'px';
          canvas.width = width * devicePixelRatio;
          canvas.height = height * devicePixelRatio;
          ctx.scale(devicePixelRatio, devicePixelRatio);
        }
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to process image'));
            return;
          }
          
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            const compressionRatio = Math.round(((file.size - blob.size) / file.size) * 100);
            
            resolve({
              processedBlob: blob,
              dataUrl,
              metadata: {
                originalSize: file.size,
                processedSize: blob.size,
                compressionRatio,
                dimensions: { width, height }
              }
            });
          };
          reader.onerror = () => reject(new Error('Failed to read processed image'));
          reader.readAsDataURL(blob);
        }, 'image/jpeg', COMPRESSION_QUALITY);
        
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Enhanced IndexedDB with mobile optimization
const DB_NAME = 'tourism-photos-v2';
const STORE_NAME = 'photos';
const DB_VERSION = 2;

const initDB = async () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

const saveToIndexedDB = async (key: string, data: Blob): Promise<void> => {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage || 0;
      const quota = estimate.quota || 0;
      
      if (used + data.size + STORAGE_QUOTA_BUFFER > quota) {
        throw new Error('Storage quota exceeded. Please free up space and try again.');
      }
    }
    
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    await new Promise<void>((resolve, reject) => {
      const request = store.put(data, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    
    db.close();
  } catch (error) {
    console.error('IndexedDB save failed:', error);
    throw error;
  }
};

const getFromIndexedDB = async (key: string): Promise<Blob | null> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    const result = await new Promise<Blob | null>((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
    
    db.close();
    return result;
  } catch (error) {
    console.error('IndexedDB get failed:', error);
    return null;
  }
};

const deleteFromIndexedDB = async (key: string): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    await new Promise<void>((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    
    db.close();
  } catch (error) {
    console.error('IndexedDB delete failed:', error);
  }
};

// Handle HEIC conversion for iPhone photos
const convertHeicToJpeg = async (file: File): Promise<File> => {
  try {
    const heic2any = (await import('heic2any')).default;
    const convertedBlob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.9
    }) as Blob;
    
    return new File([convertedBlob], file.name.replace(/\.heic$/i, '.jpg'), {
      type: 'image/jpeg'
    });
  } catch (error) {
    throw new Error('Failed to convert iPhone photo. Please try a different image.');
  }
};

interface PhotoData {
  blob: Blob;
  dataUrl: string;
  fileName: string;
  fileSize: number;
  uploadMethod: 'camera' | 'gallery';
  timestamp: number;
  metadata: {
    originalSize: number;
    processedSize: number;
    compressionRatio: number;
    dimensions: { width: number; height: number };
  };
}

const PhotoUploadPage: React.FC = () => {
  const router = useRouter();
  const [photos, setPhotos] = useState<{ camera?: PhotoData; gallery?: PhotoData }>({});
  const [currentMethod, setCurrentMethod] = useState<'camera' | 'gallery'>('gallery');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [mobileCapabilities, setMobileCapabilities] = useState(() => getMobileCapabilities());
  const [isOffline, setIsOffline] = useState(() => typeof navigator !== 'undefined' ? !navigator.onLine : false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Load existing photos on mount
  useEffect(() => {
    loadExistingPhotos();
  }, []);

  // Touch events for better mobile interaction
  useEffect(() => {
    if (mobileCapabilities.touchSupported) {
      const preventDefault = (e: TouchEvent) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      };
      
      document.addEventListener('touchstart', preventDefault, { passive: false });
      
      return () => {
        document.removeEventListener('touchstart', preventDefault);
      };
    }
  }, [mobileCapabilities.touchSupported]);

  // Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadExistingPhotos = async () => {
    try {
      const photoMetadata = localStorage.getItem('photoMetadata_v2');
      if (!photoMetadata) return;
      
      const metadata = JSON.parse(photoMetadata);
      const loadedPhotos: typeof photos = {};
      
      for (const [type, data] of Object.entries(metadata)) {
        if ((type === 'camera' || type === 'gallery') && data) {
          const blob = await getFromIndexedDB(`photo_${type}`);
          if (blob) {
            loadedPhotos[type as keyof typeof photos] = {
              blob,
              dataUrl: URL.createObjectURL(blob),
              fileName: (data as any).fileName || 'Unknown',
              fileSize: (data as any).fileSize || 0,
              uploadMethod: (data as any).uploadMethod || type as 'camera' | 'gallery',
              timestamp: (data as any).timestamp || Date.now(),
              metadata: (data as any).metadata || {
                originalSize: 0,
                processedSize: blob.size,
                compressionRatio: 0,
                dimensions: { width: 0, height: 0 }
              }
            };
          }
        }
      }
      
      setPhotos(loadedPhotos);
    } catch (error) {
      console.error('Failed to load existing photos:', error);
    }
  };

  const savePhotoMetadata = (updatedPhotos: typeof photos) => {
    const metadata: any = {};
    Object.entries(updatedPhotos).forEach(([type, photoData]) => {
      if (photoData) {
        metadata[type] = {
          fileName: photoData.fileName,
          fileSize: photoData.fileSize,
          uploadMethod: photoData.uploadMethod,
          timestamp: photoData.timestamp,
          metadata: photoData.metadata
        };
      }
    });
    localStorage.setItem('photoMetadata_v2', JSON.stringify(metadata));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (mobileCapabilities.isMobile && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }

    setError(null);
    setIsProcessing(true);
    setProcessingStep('Validating image...');

    try {
      let processedFile = file;

      if (file.type === 'image/heic' || file.type === 'image/heif' || 
          file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
        setProcessingStep('Converting iPhone photo...');
        processedFile = await convertHeicToJpeg(file);
      }

      if (!processedFile.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
      }

      setProcessingStep('Optimizing image for mobile...');
      const { processedBlob, dataUrl, metadata } = await processImageForMobile(processedFile);

      setProcessingStep('Saving image...');
      await saveToIndexedDB(`photo_${currentMethod}`, processedBlob);

      const photoData: PhotoData = {
        blob: processedBlob,
        dataUrl,
        fileName: processedFile.name,
        fileSize: processedFile.size,
        uploadMethod: currentMethod,
        timestamp: Date.now(),
        metadata
      };

      const updatedPhotos = { ...photos, [currentMethod]: photoData };
      setPhotos(updatedPhotos);
      await savePhotoMetadata(updatedPhotos);

      setProcessingStep('Complete!');

      if (mobileCapabilities.isMobile && 'vibrate' in navigator) {
        navigator.vibrate([50, 50, 50]);
      }
      
      setTimeout(() => setProcessingStep(''), 2000);

    } catch (error) {
      console.error('File processing error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process image');

      if (mobileCapabilities.isMobile && 'vibrate' in navigator) {
        navigator.vibrate(200);
      }
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = async (type: 'camera' | 'gallery') => {
    await deleteFromIndexedDB(`photo_${type}`);
    
    const updatedPhotos = { ...photos };
    if (updatedPhotos[type]) {
      URL.revokeObjectURL(updatedPhotos[type]!.dataUrl);
      delete updatedPhotos[type];
    }
    
    setPhotos(updatedPhotos);
    savePhotoMetadata(updatedPhotos);
  };

  const handleContinue = () => {
    const photoCount = Object.keys(photos).length;
    if (photoCount === 0) {
      setError('Please add at least one photo before continuing');
      return;
    }

    savePhotoMetadata(photos);
    localStorage.setItem('photoCount_v2', photoCount.toString());
    localStorage.setItem('photoTypes_v2', Object.keys(photos).join(','));
    
    router.push('/dashboard/create/story');
  };

  const handleSkip = async () => {
    await deleteFromIndexedDB('photo_camera');
    await deleteFromIndexedDB('photo_gallery');
    localStorage.removeItem('photoMetadata_v2');
    localStorage.removeItem('photoCount_v2');
    localStorage.removeItem('photoTypes_v2');
    
    setPhotos({});
    router.push('/dashboard/create/story');
  };

  const renderMobileAlerts = () => (
    <>
      {isOffline && (
        <div style={{
          marginBottom: '1rem',
          background: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '0.75rem',
          padding: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#d97706', marginRight: '0.5rem' }}>📴</span>
            <span style={{ color: '#92400e', fontSize: '0.875rem', fontWeight: '500' }}>
              You're offline. Your photos will be saved locally and synced when connection returns.
            </span>
          </div>
        </div>
      )}
      
      {mobileCapabilities.isMobile && !mobileCapabilities.supportsCameraCapture && (
        <div style={{
          marginBottom: '1rem',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '0.75rem',
          padding: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: BRAND_BLUE, marginRight: '0.5rem' }}>📱</span>
            <span style={{ color: '#1e40af', fontSize: '0.875rem' }}>
              Camera not available. You can still upload photos from your gallery.
            </span>
          </div>
        </div>
      )}
    </>
  );

  const photoCount = Object.keys(photos).length;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            
        {renderMobileAlerts()}
        
        {/* Header with Step Tracker */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '2rem 1rem',
          marginBottom: '2rem'
        }}>
          <StepTracker currentStep={2} />
          
          <h1 style={{ 
            fontSize: 'clamp(2rem, 6vw, 3rem)', 
            fontWeight: '700',
            color: '#1f2937',
            lineHeight: '1.2',
            marginBottom: '0rem',
            textAlign: 'center'
          }}>
            Add Your Photo{photoCount > 1 ? 's' : ''}
          </h1>
          {photoCount > 0 && (
            <p style={{ 
              fontSize: '1.125rem',
              color: '#6b7280',
              margin: '1rem 0 0 0',
              textAlign: 'center'
            }}>
              {photoCount} photo{photoCount > 1 ? 's' : ''} added • This gives Claude richer context
            </p>
          )}
        </div>

        {/* Upload Method Toggle */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '2rem' 
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '0.75rem',
            padding: '0.25rem',
            display: 'flex',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <button
              onClick={() => setCurrentMethod('camera')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                backgroundColor: currentMethod === 'camera' ? 'white' : 'transparent',
                color: currentMethod === 'camera' ? '#1f2937' : '#6b7280',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: currentMethod === 'camera' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                position: 'relative'
              }}
            >
              📷 Take Photo
              {photos.camera && (
                <div style={{
                  position: 'absolute',
                  top: '-0.25rem',
                  right: '-0.25rem',
                  width: '1rem',
                  height: '1rem',
                  backgroundColor: BRAND_ORANGE,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: 'white', fontSize: '0.75rem' }}>✓</span>
                </div>
              )}
            </button>
            <button
              onClick={() => setCurrentMethod('gallery')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                backgroundColor: currentMethod === 'gallery' ? 'white' : 'transparent',
                color: currentMethod === 'gallery' ? '#1f2937' : '#6b7280',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: currentMethod === 'gallery' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                position: 'relative'
              }}
            >
              📱 Upload Photo
              {photos.gallery && (
                <div style={{
                  position: 'absolute',
                  top: '-0.25rem',
                  right: '-0.25rem',
                  width: '1rem',
                  height: '1rem',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: 'white', fontSize: '0.75rem' }}>✓</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Upload Area */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          {!photos[currentMethod] ? (
            <div 
              style={{
                textAlign: 'center',
                cursor: 'pointer',
                border: '2px dashed #d1d5db',
                borderRadius: '1rem',
                padding: '2rem',
                transition: 'all 0.2s',
                backgroundColor: 'rgba(255, 255, 255, 0.5)'
              }}
              onClick={() => {
                if (currentMethod === 'camera') {
                  cameraInputRef.current?.click();
                } else {
                  fileInputRef.current?.click();
                }
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = BRAND_PURPLE;
                e.currentTarget.style.backgroundColor = 'rgba(107, 46, 255, 0.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                {currentMethod === 'camera' ? '📷' : '📁'}
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700', 
                color: '#1f2937', 
                marginBottom: '0.5rem' 
              }}>
                {currentMethod === 'camera' ? 'Take a Photo' : 'Upload from Gallery'}
              </h3>
              <p style={{ 
                fontSize: '1rem', 
                color: '#6b7280', 
                marginBottom: '1rem',
                lineHeight: '1.5'
              }}>
                {currentMethod === 'camera' 
                  ? 'Capture your immediate experience'
                  : 'Choose from your photo library'
                }
              </p>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                Supports: JPG, PNG, HEIC (iPhone), WebP • Max: 25MB
              </p>
              
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
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={photos[currentMethod]?.dataUrl}
                  alt={`${currentMethod} photo`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    borderRadius: '1rem',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                  }}
                />
                <button
                  onClick={() => handleRemovePhoto(currentMethod)}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    width: '2rem',
                    height: '2rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#ef4444';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  ✕
                </button>
              </div>
              <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                <p>📁 {photos[currentMethod]?.fileName}</p>
                <p>
                  📊 {Math.round(photos[currentMethod]?.metadata.originalSize! / 1024 / 1024 * 10) / 10}MB → {Math.round(photos[currentMethod]?.metadata.processedSize! / 1024)}KB
                  ({photos[currentMethod]?.metadata.compressionRatio}% smaller)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '1rem',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: '1.5rem',
                height: '1.5rem',
                border: `2px solid ${BRAND_BLUE}`,
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginRight: '0.75rem'
              }}></div>
              <span style={{ color: '#1e40af', fontWeight: '600' }}>{processingStep}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '1rem',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <p style={{ color: '#dc2626', fontWeight: '600', margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <button
            onClick={handleSkip}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '2px solid #e5e7eb',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#9ca3af';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            Skip for now
          </button>

          <PrimaryButton
            onClick={handleContinue}
            disabled={photoCount === 0 || isProcessing}
            size="large"
          >
            {isProcessing ? 'Processing...' : 'Continue →'}
          </PrimaryButton>
        </div>

        {/* Logo */}
<div style={{ 
  textAlign: 'center', 
  marginBottom: '2rem',
  paddingTop: '2rem'
}}>
  <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
    <BrandLogo />
  </Link>
</div>        
          
        {/* Back to Home */}
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PhotoUploadPage;
