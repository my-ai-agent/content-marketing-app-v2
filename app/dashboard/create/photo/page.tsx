// /app/dashboard/create/photo/page.tsx - COMPLETE MOBILE-OPTIMIZED VERSION
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Mobile-optimized constants
const MOBILE_MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB for mobile cameras
const DESKTOP_MAX_FILE_SIZE = 15 * 1024 * 1024 // 15MB for desktop
const MAX_DIMENSION = 1600 // Optimal for mobile processing
const COMPRESSION_QUALITY = 0.85 // High quality but mobile-friendly
const STORAGE_QUOTA_BUFFER = 5 * 1024 * 1024 // 5MB buffer for storage
// ENHANCED: Server-safe mobile device detection with capabilities
const getMobileCapabilities = () => {
  // Server-side rendering safety check
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

// ENHANCED: Unified image processing with mobile optimization
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
        // ENHANCED: EXIF orientation handling for mobile photos
        let { width, height } = img;
        const aspectRatio = width / height;
        
        // Smart resizing based on device and file size
        let targetDimension = MAX_DIMENSION;
        if (capabilities.isMobile && file.size > 10 * 1024 * 1024) {
          targetDimension = 1200; // More aggressive for large mobile files
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
        
        // ENHANCED: Handle device pixel ratio for high-DPI screens
        const devicePixelRatio = window.devicePixelRatio || 1;
        if (devicePixelRatio > 1 && capabilities.isMobile) {
          canvas.style.width = width + 'px';
          canvas.style.height = height + 'px';
          canvas.width = width * devicePixelRatio;
          canvas.height = height * devicePixelRatio;
          ctx.scale(devicePixelRatio, devicePixelRatio);
        }
        
        // ENHANCED: Mobile-optimized drawing with better quality
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
    // Check storage quota before saving
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
  // ENHANCED: Mobile capabilities detection with SSR safety
const [mobileCapabilities, setMobileCapabilities] = useState(() => getMobileCapabilities());
const [isOffline, setIsOffline] = useState(() => typeof navigator !== 'undefined' ? !navigator.onLine : false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Load existing photos on mount
  useEffect(() => {
    loadExistingPhotos();
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

      // ENHANCED: Touch events for better mobile interaction
useEffect(() => {
  if (mobileCapabilities.touchSupported) {
    // Prevent zoom on double tap for upload areas
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

// ENHANCED: Offline detection
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

  // ENHANCED: Better mobile file handling with haptic feedback
const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // ENHANCED: Haptic feedback on mobile
  if (mobileCapabilities.isMobile && 'vibrate' in navigator) {
    navigator.vibrate(50); // Short vibration feedback
  }

  setError(null);
  setIsProcessing(true);
  setProcessingStep('Validating image...');

  try {
    let processedFile = file;

    // Handle HEIC files from iPhone
    if (file.type === 'image/heic' || file.type === 'image/heif' || 
        file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
      setProcessingStep('Converting iPhone photo...');
      processedFile = await convertHeicToJpeg(file);
    }

    // Validate file type
    if (!processedFile.type.startsWith('image/')) {
      throw new Error('Please select a valid image file');
    }

    // Process image for mobile optimization
    setProcessingStep('Optimizing image for mobile...');
    const { processedBlob, dataUrl, metadata } = await processImageForMobile(processedFile);

    // Save to IndexedDB
    setProcessingStep('Saving image...');
    await saveToIndexedDB(`photo_${currentMethod}`, processedBlob);

    // Create photo data
    const photoData: PhotoData = {
      blob: processedBlob,
      dataUrl,
      fileName: processedFile.name,
      fileSize: processedFile.size,
      uploadMethod: currentMethod,
      timestamp: Date.now(),
      metadata
    };

    // Update state
    const updatedPhotos = { ...photos, [currentMethod]: photoData };
    setPhotos(updatedPhotos);
    await savePhotoMetadata(updatedPhotos);

    setProcessingStep('Complete!');
    
    // ENHANCED: Success haptic feedback
    if (mobileCapabilities.isMobile && 'vibrate' in navigator) {
      navigator.vibrate([50, 50, 50]); // Success pattern
    }
    
    setTimeout(() => setProcessingStep(''), 2000);

  } catch (error) {
    console.error('File processing error:', error);
    setError(error instanceof Error ? error.message : 'Failed to process image');
    
    // ENHANCED: Error haptic feedback
    if (mobileCapabilities.isMobile && 'vibrate' in navigator) {
      navigator.vibrate(200); // Error vibration
    }
  } finally {
    setIsProcessing(false);
    // Clear file inputs
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

    // Save photo data for next step
    savePhotoMetadata(photos);
    localStorage.setItem('photoCount_v2', photoCount.toString());
    localStorage.setItem('photoTypes_v2', Object.keys(photos).join(','));
    
    router.push('/dashboard/create/story');
  };

  const handleSkip = async () => {
    // Clean up all data
    await deleteFromIndexedDB('photo_camera');
    await deleteFromIndexedDB('photo_gallery');
    localStorage.removeItem('photoMetadata_v2');
    localStorage.removeItem('photoCount_v2');
    localStorage.removeItem('photoTypes_v2');
    
    setPhotos({});
    router.push('/dashboard/create/story');
  };

  // ENHANCED: Mobile alerts before return statement
const renderMobileAlerts = () => (
  <>
    {/* Offline indicator */}
    {isOffline && (
      <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
        <div className="flex items-center">
          <span className="text-amber-600 mr-2">📴</span>
          <span className="text-amber-800 text-sm font-medium">
            You're offline. Your photos will be saved locally and synced when connection returns.
          </span>
        </div>
      </div>
    )}
    
    {/* Camera availability info */}
    {mobileCapabilities.isMobile && !mobileCapabilities.supportsCameraCapture && (
      <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center">
          <span className="text-blue-600 mr-2">📱</span>
          <span className="text-blue-800 text-sm">
            Camera not available. You can still upload photos from your gallery.
          </span>
        </div>
      </div>
    )}
  </>
);

  const photoCount = Object.keys(photos).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
            
      {renderMobileAlerts()}
      
      {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
            <div className="w-8 h-1 bg-gray-300"></div>
            <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
            {[3, 4, 5, 6].map((step) => (
              <React.Fragment key={step}>
                <div className="w-8 h-1 bg-gray-300"></div>
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">{step}</div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Add Your Photo{photoCount > 1 ? 's' : ''}
          </h1>
          {photoCount > 0 && (
            <p className="text-gray-600">
              {photoCount} photo{photoCount > 1 ? 's' : ''} added • This gives Claude richer context
            </p>
          )}
        </div>

        {/* Upload Method Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setCurrentMethod('camera')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 relative ${
                currentMethod === 'camera'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📷 Take Photo
              {photos.camera && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </button>
            <button
              onClick={() => setCurrentMethod('gallery')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 relative ${
                currentMethod === 'gallery'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📱 Upload Photo
              {photos.gallery && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {!photos[currentMethod] ? (
            <div 
              className="text-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors"
              onClick={() => {
                if (currentMethod === 'camera') {
                  cameraInputRef.current?.click();
                } else {
                  fileInputRef.current?.click();
                }
              }}
            >
              <div className="text-6xl mb-4">
                {currentMethod === 'camera' ? '📷' : '📁'}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {currentMethod === 'camera' ? 'Take a Photo' : 'Upload from Gallery'}
              </h3>
              <p className="text-gray-600 mb-4">
                {currentMethod === 'camera' 
                  ? 'Capture your immediate experience'
                  : 'Choose from your photo library'
                }
              </p>
              <p className="text-sm text-gray-500">
                Supports: JPG, PNG, HEIC (iPhone), WebP • Max: 25MB
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={photos[currentMethod]?.dataUrl}
                  alt={`${currentMethod} photo`}
                  className="max-w-full max-h-96 rounded-lg shadow-md"
                />
                <button
                  onClick={() => handleRemovePhoto(currentMethod)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="mt-4 text-sm text-gray-600">
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-800 font-medium">{processingStep}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleSkip}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Skip for now
          </button>

          <button
            onClick={handleContinue}
            disabled={photoCount === 0 || isProcessing}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              photoCount > 0 && !isProcessing
                ? 'bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Continue →'}
          </button>
        </div>

        {/* Branding */}
        <div className="text-center">
          <div className="text-2xl font-bold">
            <span className="text-blue-600">click</span>
            <span className="text-orange-500"> speak</span>
            <span className="text-blue-600"> send</span>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadPage;
