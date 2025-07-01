import React, { useRef, useState, useEffect } from 'react';

// Types
type CropBox = { x: number; y: number; width: number; height: number };
type ResizeDir = null | 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

// "none" for No Crop, null for Free, number for locked ratios
type AspectValue = number | null | 'none';

interface CropToolProps {
  image: string;
  onApply: (croppedUrl: string) => void;
  onCancel: () => void;
}

// Utility for touch/mouse coordinate extraction
function getClientPos(e: MouseEvent | TouchEvent) {
  let clientX = 0,
    clientY = 0;
  if ('touches' in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else if ('clientX' in e) {
    clientX = (e as MouseEvent).clientX;
    clientY = (e as MouseEvent).clientY;
  }
  return { clientX, clientY };
}

// Data URL validation utility
function isValidDataURL(dataUrl: string): boolean {
  if (!dataUrl || typeof dataUrl !== 'string') return false;
  if (!dataUrl.startsWith('data:image/')) return false;
  const base64Part = dataUrl.split(',')[1];
  if (!base64Part || base64Part.length < 100) {
    console.warn('⚠️ Data URL too short, likely invalid:', dataUrl.length);
    return false;
  }
  return true;
}

// Validate crop dimensions
function validateCropDimensions(crop: CropBox, imgDims: { width: number; height: number }): boolean {
  if (crop.width <= 0 || crop.height <= 0) {
    console.error('❌ Invalid crop dimensions:', crop);
    return false;
  }
  if (crop.x < 0 || crop.y < 0) {
    console.error('❌ Invalid crop position:', crop);
    return false;
  }
  if (crop.x + crop.width > imgDims.width || crop.y + crop.height > imgDims.height) {
    console.error('❌ Crop extends beyond image bounds:', crop, imgDims);
    return false;
  }
  return true;
}

const handles = [
  { dir: 'n', top: -8, left: '50%', cursor: 'ns-resize', style: { transform: 'translate(-50%, -50%)' } },
  { dir: 's', top: '100%', left: '50%', cursor: 'ns-resize', style: { transform: 'translate(-50%, 50%)' } },
  { dir: 'e', top: '50%', left: '100%', cursor: 'ew-resize', style: { transform: 'translate(50%, -50%)' } },
  { dir: 'w', top: '50%', left: -8, cursor: 'ew-resize', style: { transform: 'translate(-50%, -50%)' } },
  { dir: 'ne', top: -8, left: '100%', cursor: 'nesw-resize', style: { transform: 'translate(50%, -50%)' } },
  { dir: 'nw', top: -8, left: -8, cursor: 'nwse-resize', style: { transform: 'translate(-50%, -50%)' } },
  { dir: 'se', top: '100%', left: '100%', cursor: 'nwse-resize', style: { transform: 'translate(50%, 50%)' } },
  { dir: 'sw', top: '100%', left: -8, cursor: 'nesw-resize', style: { transform: 'translate(-50%, 50%)' } },
] as const;

// Social media aspect ratios + free + "No Crop"
const aspectRatios: { name: string; value: AspectValue }[] = [
  { name: "No Crop", value: "none" },
  { name: "Free", value: null },
  { name: "1:1", value: 1 },
  { name: "4:3", value: 4 / 3 },
  { name: "3:4", value: 3 / 4 },
  { name: "16:9", value: 16 / 9 },
];

const MIN_SIZE = 40;

const isNumberAspect = (aspect: AspectValue): aspect is number =>
  typeof aspect === 'number' && !isNaN(aspect) && isFinite(aspect);

const CropTool: React.FC<CropToolProps> = ({ image, onApply, onCancel }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [imgDims, setImgDims] = useState<{ width: number; height: number }>({ width: 1, height: 1 });
  const [cropBox, setCropBox] = useState<CropBox>({ x: 40, y: 40, width: 200, height: 200 });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState<ResizeDir>(null);
  const [aspect, setAspect] = useState<AspectValue>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Validate input image on mount
  useEffect(() => {
    console.log('🔍 CropTool received image, length:', image?.length);
    if (!isValidDataURL(image)) {
      console.error('❌ Invalid input image data URL');
    }
  }, [image]);

  // Set image dimensions on load
  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      const setDims = () => {
        console.log('🖼️ Image loaded:', img.naturalWidth, 'x', img.naturalHeight);
        console.log('🖼️ Display size:', img.offsetWidth, 'x', img.offsetHeight);
        setImgDims({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onload = setDims;
      img.onerror = () => {
        console.error('❌ Failed to load image in CropTool');
      };
      if (img.complete && img.naturalWidth > 0) setDims();
    }
  }, [image]);

  // Clamp crop box within image and aspect ratio
  function clamp(box: CropBox): CropBox {
    let { x, y, width, height } = box;

    // Enforce min size
    width = Math.max(width, MIN_SIZE);
    height = Math.max(height, MIN_SIZE);

    // Enforce aspect ratio if set and is a number
    if (isNumberAspect(aspect)) {
      if (width / height > aspect) {
        width = Math.round(height * aspect);
      } else {
        height = Math.round(width / aspect);
      }
    }

    // Clamp to bounds
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x + width > imgDims.width) x = Math.max(0, imgDims.width - width);
    if (y + height > imgDims.height) y = Math.max(0, imgDims.height - height);

    // Final validation
    if (x + width > imgDims.width) width = imgDims.width - x;
    if (y + height > imgDims.height) height = imgDims.height - y;

    return { x, y, width, height };
  }

  // Event handler for drag/resize
  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      e.preventDefault();
      const { clientX, clientY } = getClientPos(e);
      let dx = clientX - lastPos.current.x;
      let dy = clientY - lastPos.current.y;
      lastPos.current = { x: clientX, y: clientY };

      setCropBox((prev) => {
        if (dragging) {
          return clamp({
            ...prev,
            x: prev.x + dx,
            y: prev.y + dy,
          });
        }
        if (resizing) {
          let { x, y, width, height } = prev;
          switch (resizing) {
            case 'n':
              y += dy;
              height -= dy;
              break;
            case 's':
              height += dy;
              break;
            case 'e':
              width += dx;
              break;
            case 'w':
              x += dx;
              width -= dx;
              break;
            case 'ne':
              y += dy;
              height -= dy;
              width += dx;
              break;
            case 'nw':
              y += dy;
              height -= dy;
              x += dx;
              width -= dx;
              break;
            case 'se':
              width += dx;
              height += dy;
              break;
            case 'sw':
              x += dx;
              width -= dx;
              height += dy;
              break;
          }
          return clamp({ x, y, width, height });
        }
        return prev;
      });
    }

    function onUp() {
      setDragging(false);
      setResizing(null);
      window.removeEventListener('mousemove', onMove as any);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove as any);
      window.removeEventListener('touchend', onUp);
    }

    // Only attach listeners if dragging/resizing
    if (dragging || resizing) {
      window.addEventListener('mousemove', onMove as any, { passive: false });
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchmove', onMove as any, { passive: false });
      window.addEventListener('touchend', onUp);
      return () => {
        window.removeEventListener('mousemove', onMove as any);
        window.removeEventListener('mouseup', onUp);
        window.removeEventListener('touchmove', onMove as any);
        window.removeEventListener('touchend', onUp);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, resizing]);

  // Begin drag
  function startDrag(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
    const { clientX, clientY } = getClientPos(
      'nativeEvent' in e ? (e.nativeEvent as any) : (e as any)
    );
    lastPos.current = { x: clientX, y: clientY };
  }

  // Begin resize
  function startResize(dir: ResizeDir) {
    return (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setResizing(dir);
      const { clientX, clientY } = getClientPos(
        'nativeEvent' in e ? (e.nativeEvent as any) : (e as any)
      );
      lastPos.current = { x: clientX, y: clientY };
    };
  }

  // Convert displayed crop box to natural image pixels
  function getCropPixels(): CropBox {
    const imgEl = imgRef.current?.getBoundingClientRect();
    if (!imgEl) {
      console.error('❌ Missing image element bounds');
      return cropBox;
    }
    if (imgEl.width <= 0 || imgEl.height <= 0) {
      console.error('❌ Image element has zero dimensions');
      return cropBox;
    }
    const scaleX = imgDims.width / imgEl.width;
    const scaleY = imgDims.height / imgEl.height;
    console.log('🔧 FIXED Scale factors:', { scaleX, scaleY });
    console.log('🔧 Display crop box:', cropBox);
    console.log('🔧 Natural image dims:', imgDims);
    console.log('🔧 Displayed image dims:', { width: imgEl.width, height: imgEl.height });
    const pixels = {
      x: Math.round(cropBox.x * scaleX),
      y: Math.round(cropBox.y * scaleY),
      width: Math.round(cropBox.width * scaleX),
      height: Math.round(cropBox.height * scaleY),
    };
    console.log('🎯 CALCULATED CROP PIXELS:', pixels);
    console.log('🎯 This should match your visual selection!');
    return pixels;
  }

  // Handle "No Crop" option - return original image without processing
  const handleApplyCrop = async () => {
    if (aspect === "none") {
      console.log('📸 No Crop selected - using original image');
      onApply(image);
      return;
    }

    console.log('✂️ Starting crop process...');
    setIsProcessing(true);

    try {
      if (!isValidDataURL(image)) {
        throw new Error('Invalid input image data URL');
      }

      const cropPixels = getCropPixels();
      const { x, y, width, height } = cropPixels;

      console.log('📊 Crop parameters:', { x, y, width, height, imgDims });

      if (!validateCropDimensions(cropPixels, imgDims)) {
        throw new Error('Invalid crop dimensions');
      }

      if (!imgDims.width || !imgDims.height || imgDims.width < 1 || imgDims.height < 1) {
        console.error('❌ Invalid image dimensions:', imgDims);
        throw new Error('Invalid image dimensions');
      }

      const img = new window.Image();
      if (!image.startsWith('data:')) {
        img.crossOrigin = 'anonymous';
      }

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Image load timeout'));
        }, 10000);

        img.onload = () => {
          clearTimeout(timeout);
          console.log('✅ Image loaded for cropping:', img.naturalWidth, 'x', img.naturalHeight);
          resolve();
        };
        img.onerror = (error) => {
          clearTimeout(timeout);
          console.error('❌ Failed to load image for cropping:', error);
          reject(new Error('Failed to load image'));
        };
        img.src = image;
      });

      if (!img.naturalWidth || !img.naturalHeight) {
        throw new Error('Loaded image has no dimensions');
      }

      let finalWidth = Math.max(1, Math.min(width, img.naturalWidth - x));
      let finalHeight = Math.max(1, Math.min(height, img.naturalHeight - y));
      const finalX = Math.max(0, Math.min(x, img.naturalWidth - 1));
      const finalY = Math.max(0, Math.min(y, img.naturalHeight - 1));

      // Only do aspect math if aspect is a number
      if (isNumberAspect(aspect)) {
        const currentAspect = finalWidth / finalHeight;
        if (Math.abs(currentAspect - aspect) > 0.01) {
          if (currentAspect > aspect) {
            finalWidth = Math.round(finalHeight * aspect);
          } else {
            finalHeight = Math.round(finalWidth / aspect);
          }
        }
      }

      console.log('🔧 Final crop parameters:', {
        x: finalX,
        y: finalY,
        width: finalWidth,
        height: finalHeight,
        aspectRatio: aspect,
        finalAspect: finalWidth / finalHeight,
      });

      const canvas = document.createElement('canvas');
      canvas.width = finalWidth;
      canvas.height = finalHeight;

      console.log('📋 Canvas size:', canvas.width, 'x', canvas.height);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Perform the crop with validated parameters
      console.log('🖼️ Drawing cropped image...');
      try {
        ctx.drawImage(
          img,
          finalX,
          finalY,
          finalWidth,
          finalHeight,
          0,
          0,
          canvas.width,
          canvas.height
        );
      } catch (drawError) {
        console.error('❌ Canvas drawImage failed:', drawError);
        throw new Error('Failed to draw image on canvas');
      }

      const croppedUrl = canvas.toDataURL('image/jpeg', 0.95);

      console.log('📏 Generated data URL length:', croppedUrl.length);
      console.log('📋 Data URL preview:', croppedUrl.substring(0, 100) + '...');

      if (!isValidDataURL(croppedUrl)) {
        throw new Error('Generated invalid data URL');
      }

      console.log('✅ Crop successful!');
      onApply(croppedUrl);

    } catch (error) {
      console.error('❌ Crop failed:', error);

      // Fallback
      if (isValidDataURL(image)) {
        console.log('🔄 Using original image as fallback');
        onApply(image);
      } else {
        console.log('🆘 Creating emergency fallback image');
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const gradient = ctx.createLinearGradient(0, 0, 300, 200);
          gradient.addColorStop(0, '#f3f4f6');
          gradient.addColorStop(1, '#e5e7eb');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 300, 200);

          ctx.fillStyle = '#6b7280';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Image Processing Error', 150, 90);
          ctx.font = '12px sans-serif';
          ctx.fillText('Please try uploading a different image', 150, 120);

          const fallbackUrl = canvas.toDataURL('image/jpeg', 0.8);
          onApply(fallbackUrl);
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Set crop box to centered default on first image load or aspect ratio change
  useEffect(() => {
    if (aspect === "none") {
      return;
    }

    if (imgDims.width > 1 && imgDims.height > 1) {
      let w = Math.round(imgDims.width * 0.7);
      let h = Math.round(imgDims.height * 0.7);

      if (isNumberAspect(aspect)) {
        if (w / h > aspect) {
          w = Math.round(h * aspect);
        } else {
          h = Math.round(w / aspect);
        }
      }

      w = Math.max(w, MIN_SIZE);
      h = Math.max(h, MIN_SIZE);

      const newCropBox = {
        x: Math.round((imgDims.width - w) / 2),
        y: Math.round((imgDims.height - h) / 2),
        width: w,
        height: h,
      };

      setCropBox(newCropBox);
      console.log('📏 Set default crop box:', newCropBox);
    }
  }, [imgDims.width, imgDims.height, aspect]);

  // Responsive: constrain displayed width/height for mobile
  const displayMax = 400;
  let displayW = displayMax,
    displayH = displayMax;
  if (imgDims.width > imgDims.height) {
    displayH = Math.round(imgDims.height * (displayMax / imgDims.width));
  } else {
    displayW = Math.round(imgDims.width * (displayMax / imgDims.height));
  }

  // Enhanced validation for Apply button
  const cropValid =
    imgDims.width > 1 &&
    imgDims.height > 1 &&
    (aspect === "none" || (cropBox.width > 0 && cropBox.height > 0)) &&
    isValidDataURL(image);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
          padding: '2rem 2rem 1.5rem 2rem',
          maxWidth: 600,
          width: '90vw',
          position: 'relative',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: '1.25rem',
            marginBottom: '1rem',
            color: '#1f2937',
          }}
        >
          Crop Your Photo
        </div>

        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <div
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              marginBottom: '1rem',
              padding: '0.5rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.25rem',
            }}
          >
            Debug: Img {imgDims.width}×{imgDims.height} | Crop {cropBox.width}×{cropBox.height} | Valid: {cropValid ? '✅' : '❌'}
          </div>
        )}

        {/* Aspect Ratio Presets */}
        <div style={{ marginBottom: "1rem" }}>
          {aspectRatios.map((opt) => (
            <button
              key={opt.name}
              onClick={() => setAspect(opt.value)}
              style={{
                fontWeight: aspect === opt.value ? 700 : 400,
                background: aspect === opt.value ? "#10b981" : "#e5e7eb",
                color: aspect === opt.value ? "white" : "#374151",
                border: "none",
                borderRadius: "6px",
                padding: "0.5rem 1rem",
                marginRight: "0.5rem",
                marginBottom: "0.25rem",
                cursor: "pointer",
              }}
            >
              {opt.name}
            </button>
          ))}
        </div>

        <div
          ref={overlayRef}
          style={{
            position: 'relative',
            display: 'inline-block',
            width: displayW,
            height: displayH,
            background: '#f3f4f6',
            borderRadius: '0.75rem',
            userSelect: 'none',
            touchAction: 'none',
          }}
        >
          <img
            ref={imgRef}
            src={image}
            alt="Crop preview"
            style={{
              width: displayW,
              height: displayH,
              display: 'block',
              borderRadius: '0.75rem',
            }}
            draggable={false}
          />

          {/* Crop Frame - Hide for "No Crop" option */}
          {imgDims.width > 1 && aspect !== "none" && (
            <div
              style={{
                position: 'absolute',
                left: (cropBox.x / imgDims.width) * displayW,
                top: (cropBox.y / imgDims.height) * displayH,
                width: (cropBox.width / imgDims.width) * displayW,
                height: (cropBox.height / imgDims.height) * displayH,
                border: '2px solid #3b82f6',
                background: 'rgba(59, 130, 246, 0.10)',
                cursor: dragging ? 'grabbing' : 'move',
                boxSizing: 'border-box',
                borderRadius: '0.4rem',
                transition: dragging || resizing ? 'none' : 'box-shadow 0.15s',
                boxShadow: dragging || resizing ? '0 0 0 2px #3b82f6' : '0 2px 24px 0 rgba(59,130,246,0.1)',
              }}
              onMouseDown={startDrag}
              onTouchStart={startDrag}
            >
              {/* Resize Handles */}
              {handles.map(
                (handle) =>
                  aspect !== "none" && (
                    <div
                      key={handle.dir}
                      style={{
                        position: 'absolute',
                        top: handle.top,
                        left: handle.left,
                        width: 24,
                        height: 24,
                        background: '#3b82f6',
                        borderRadius: '50%',
                        border: '2px solid white',
                        cursor: handle.cursor,
                        ...handle.style,
                      }}
                      onMouseDown={startResize(handle.dir as ResizeDir)}
                      onTouchStart={startResize(handle.dir as ResizeDir)}
                    />
                  )
              )}
            </div>
          )}
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#e5e7eb',
              color: '#374151',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleApplyCrop}
            disabled={!cropValid || isProcessing}
            style={{
              padding: '0.75rem 1.5rem',
              background: cropValid && !isProcessing ? '#10b981' : '#a7f3d0',
              color: cropValid && !isProcessing ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '8px',
              cursor: cropValid && !isProcessing ? 'pointer' : 'not-allowed',
              fontWeight: 600,
            }}
          >
            {isProcessing ? '⏳ Processing...' : '✂️ Apply Crop'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropTool;
