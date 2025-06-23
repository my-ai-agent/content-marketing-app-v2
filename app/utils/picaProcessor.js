// picaProcessor.js - Mobile-optimized image processing using Pica
import pica from 'pica';

const picaInstance = pica();

export const calculateDimensions = (originalWidth, originalHeight, maxWidth, maxHeight) => {
  const aspectRatio = originalWidth / originalHeight;
  
  // 🐞 DEBUG: Log calculation details
  console.log('🔍 calculateDimensions DEBUG:');
  console.log('Original:', originalWidth, 'x', originalHeight);
  console.log('Aspect ratio:', aspectRatio);
  console.log('Max constraints:', maxWidth, 'x', maxHeight);
  console.log('Is portrait?', originalHeight > originalWidth);
  
  let width = maxWidth;
  let height = maxWidth / aspectRatio;
  
  console.log('Initial calculation:', width, 'x', height);
  
  if (height > maxHeight) {
    height = maxHeight;
    width = maxHeight * aspectRatio;
    console.log('Adjusted for maxHeight:', width, 'x', height);
  }
  
  const result = { width: Math.round(width), height: Math.round(height) };
  console.log('Final dimensions:', result);
  
  return result;
};

export const processImageWithPica = async (file) => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select an image file (JPEG, PNG, etc.)');
    }
    
    // Check file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      throw new Error('Image too large. Please select a photo under 20MB.');
    }
    
    // Handle HEIC files (common on iPhone)
    if (file.type === 'image/heic' || file.type === 'image/heif') {
      throw new Error('HEIC format not supported. Please change your iPhone camera settings to JPEG or select a different photo.');
    }
    
    // Create image and canvas elements
    const img = new Image();
    const canvas = document.createElement('canvas');
    
    return new Promise((resolve, reject) => {
      img.onload = async () => {
        try {
          // 🐞 DEBUG: Log original image size
console.log('Original image size:', img.width, img.height);
          // Smart sizing based on file size and device capabilities
          let maxWidth, maxHeight, quality;
          
          if (file.size > 5 * 1024 * 1024) {
            // Large files: aggressive compression
            maxWidth = 800;
            maxHeight = 600;
            quality = 0.75;
          } else if (file.size > 2 * 1024 * 1024) {
            // Medium files: moderate compression
            maxWidth = 1000;
            maxHeight = 750;
            quality = 0.8;
          } else {
            // Small files: light compression
            maxWidth = 1200;
            maxHeight = 900;
            quality = 0.85;
          }
          
          // Calculate optimal dimensions
          const { width, height } = calculateDimensions(
            img.width, img.height, maxWidth, maxHeight
          );
          
          canvas.width = width;
          canvas.height = height;
          // 🐞 DEBUG: Log target canvas size
console.log('Target canvas size:', canvas.width, canvas.height);

// 🔧 FIX: Explicitly clear canvas (Copilot's key suggestion)
const ctx = canvas.getContext('2d');
ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Use Pica for mobile-optimized resizing
          await picaInstance.resize(img, canvas, {
            quality: 3, // 0-3 (highest quality for best mobile results)
            alpha: true,
            unsharpAmount: 80,
            unsharpRadius: 0.6,
            unsharpThreshold: 2
          });
          // 🐞 DEBUG: Visualize canvas (REMOVE after testing)
canvas.style.border = "2px solid red";
document.body.appendChild(canvas);
          
          // Convert to blob with appropriate quality
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to process image. Please try a different photo.'));
              return;
            }
            
            const reader = new FileReader();
            reader.onload = () => {
              // 🐞 DEBUG: Log base64 output
console.log('Base64 (first 100 chars):', reader.result.slice(0, 100));
console.log('Base64 length:', reader.result.length);
              const result = {
                processedImage: reader.result,
                originalSize: file.size,
                processedSize: blob.size,
                compressionRatio: ((file.size - blob.size) / file.size * 100).toFixed(1),
                dimensions: { width, height },
                originalDimensions: { width: img.width, height: img.height }
              };
              
              console.log('Pica processing successful:', {
                original: `${(result.originalSize / 1024 / 1024).toFixed(1)}MB`,
                processed: `${(result.processedSize / 1024).toFixed(0)}KB`,
                compression: `${result.compressionRatio}%`,
                size: `${width}x${height}`
              });
              
              resolve(result);
              // Remove debug canvas after processing
if (canvas.parentNode) {
  canvas.parentNode.removeChild(canvas);
}
            };
            
            reader.onerror = () => reject(new Error('Failed to read processed image'));
            reader.readAsDataURL(blob);
            
          }, 'image/jpeg', quality);
          
        } catch (picaError) {
          console.error('Pica resize failed:', picaError);
          reject(new Error('Image processing failed. Please try a smaller or different image.'));
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image. Please check the file format and try again.'));
      };
      
      // Load the image
      img.src = URL.createObjectURL(file);
      
    });
    
  } catch (error) {
    console.error('Image validation failed:', error);
    throw error;
  }
};

// Fallback function for when Pica fails
export const simpleFallbackProcessing = (file) => {
  return new Promise((resolve, reject) => {
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('Image too large for basic processing. Please choose a smaller image.'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        processedImage: reader.result,
        originalSize: file.size,
        processedSize: file.size,
        compressionRatio: '0',
        fallback: true
      });
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
};
