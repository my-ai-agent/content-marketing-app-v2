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
        
        // FIXED: Use proper method signature
        promptBuilder.updatePhotoData(pendingFile, undefined, pendingFile.name)
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
        
        // FIXED: Ensure proper data update
        if (pendingFile) {
          promptBuilder.updatePhotoData(pendingFile, undefined, pendingFile.name)
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

    // FIXED: Clear photo data properly
    if (promptBuilder.promptData.photo) {
      promptBuilder.promptData.photo = null
      promptBuilder.saveAndValidate()
    }
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

    // Clear photo data from Executive Prompt Builder
    if (promptBuilder.promptData.photo) {
      promptBuilder.promptData.photo = null
      promptBuilder.saveAndValidate()
    }
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

          setOriginalImage(
