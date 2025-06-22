// imageProcessor.js - Smart multi-quality image processing for tourism app

export const compressImage = (file, maxWidth, maxHeight, quality) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate optimal dimensions maintaining aspect ratio
      const { width, height } = calculateDimensions(img.width, img.height, maxWidth, maxHeight);
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to blob with quality setting
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const calculateDimensions = (originalWidth, originalHeight, maxWidth, maxHeight) => {
  const aspectRatio = originalWidth / originalHeight;
  
  let width = maxWidth;
  let height = maxWidth / aspectRatio;
  
  if (height > maxHeight) {
    height = maxHeight;
    width = maxHeight * aspectRatio;
  }
  
  return { width: Math.round(width), height: Math.round(height) };
};

export const processImage = async (file) => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Invalid file type. Please select an image.');
    }
    
    // Check file size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      throw new Error('File too large. Please select an image under 15MB.');
    }
    
    // Smart compression based on file size
    let flowImage, displayImage;
    
    if (file.size > 2 * 1024 * 1024) { // Over 2MB
      // High-res image: Create compressed version for app flow
      flowImage = await compressImage(file, 800, 600, 0.75);    // ~400KB for flow
      displayImage = await compressImage(file, 1200, 900, 0.8); // ~600KB for display
    } else {
      // Already small: Use as-is for flow
      flowImage = file;
      displayImage = await compressImage(file, 1200, 900, 0.8);
    }
    
    // Always create thumbnail for preview
    const thumbnail = await compressImage(file, 300, 200, 0.6); // ~50KB
    
    // Extract metadata
    const metadata = {
      originalSize: file.size,
      originalName: file.name,
      isHighRes: file.size > 2 * 1024 * 1024,
      flowImageSize: flowImage.size,
      timestamp: new Date().toISOString()
    };
    
    return {
      thumbnail: await blobToDataURL(thumbnail),
      flowImage: await blobToDataURL(flowImage),     // For app navigation
      displayImage: await blobToDataURL(displayImage), // For preview
      original: file,                                // Keep for high-res needs
      metadata
    };
    
  } catch (error) {
    console.error('Image processing failed:', error);
    throw error;
  }
};

export const blobToDataURL = (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

export const dataURLToBlob = (dataURL) => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

export const downloadImage = (dataURL, filename = 'high-res-image.jpg') => {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Platform-specific image optimization
export const platformSpecs = {
  facebook: { width: 1200, height: 630, quality: 0.85 },
  instagram: { width: 1080, height: 1080, quality: 0.9 },
  twitter: { width: 1200, height: 675, quality: 0.85 },
  linkedin: { width: 1200, height: 627, quality: 0.85 },
  email: { width: 600, height: 400, quality: 0.75 },
  pinterest: { width: 1000, height: 1500, quality: 0.9 },
  youtube: { width: 1280, height: 720, quality: 0.9 },
  tiktok: { width: 1080, height: 1920, quality: 0.9 },
  whatsapp: { width: 800, height: 600, quality: 0.8 },
  telegram: { width: 800, height: 600, quality: 0.8 },
  reddit: { width: 1200, height: 630, quality: 0.85 },
  discord: { width: 1200, height: 630, quality: 0.85 },
  medium: { width: 1000, height: 600, quality: 0.85 },
  wordpress: { width: 1200, height: 630, quality: 0.85 },
  pressRelease: { useOriginal: true, downloadable: true },
  website: { width: 1920, height: 1080, quality: 0.9 }
};

export const optimizeForPlatform = async (imageDataURL, platform) => {
  const spec = platformSpecs[platform];
  
  if (!spec) {
    console.warn(`No specification found for platform: ${platform}`);
    return imageDataURL;
  }
  
  if (spec.useOriginal) {
    return {
      image: imageDataURL,
      downloadable: spec.downloadable,
      note: "High-resolution image available for download"
    };
  }
  
  // Convert dataURL back to blob for processing
  const blob = dataURLToBlob(imageDataURL);
  const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
  
  // Compress to platform specifications
  const optimized = await compressImage(file, spec.width, spec.height, spec.quality);
  return await blobToDataURL(optimized);
};
