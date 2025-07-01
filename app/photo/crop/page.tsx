'use client'
import React, { useRef, useState, useLayoutEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type CropPercentBox = { x: number; y: number; width: number; height: number }; // all 0..1

interface CropToolProps {
  imageUrl: string; // data URL or public URL
  aspect?: number | null; // e.g., 1, 4/3, null for free
  onCrop: (croppedUrl: string) => void;
  onCancel: () => void;
}

const DEFAULT_ASPECTS = [
  { name: "Free", value: null },
  { name: "1:1", value: 1 },
  { name: "4:3", value: 4 / 3 },
  { name: "3:4", value: 3 / 4 },
  { name: "16:9", value: 16 / 9 },
];

const MIN_SIZE = 0.08; // as percent (8% of image)

const CropTool: React.FC<CropToolProps> = ({ imageUrl, aspect, onCrop, onCancel }) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [imgNatural, setImgNatural] = useState<{ width: number; height: number }>({ width: 1, height: 1 });
  const [displayDims, setDisplayDims] = useState<{ width: number; height: number }>({ width: 1, height: 1 });

  // Crop box as percent of image (0..1)
  const [crop, setCrop] = useState<CropPercentBox>({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 });
  const [dragging, setDragging] = useState<null | { startX: number; startY: number; startCrop: CropPercentBox }>(null);

  // Update displayDims when image or container is rendered
  useLayoutEffect(() => {
    function updateDims() {
      if (imgRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDisplayDims({ width: rect.width, height: rect.height });
      }
    }
    updateDims();
    window.addEventListener("resize", updateDims);
    return () => window.removeEventListener("resize", updateDims);
  }, [imageUrl]);

  // On image load, set natural size
  const handleImgLoad = () => {
    if (imgRef.current) {
      setImgNatural({ width: imgRef.current.naturalWidth, height: imgRef.current.naturalHeight });
    }
  };

  // Drag and resize logic: works for both mouse and touch
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pointer = "touches" in e ? e.touches[0] : (e as React.MouseEvent);
    const rect = containerRef.current!.getBoundingClientRect();
    const px = (pointer.clientX - rect.left) / rect.width;
    const py = (pointer.clientY - rect.top) / rect.height;
    setDragging({ startX: px, startY: py, startCrop: { ...crop } });
  };
  const handlePointerMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      const pointer =
        "touches" in e && e.touches.length > 0 ? e.touches[0] : "clientX" in e ? (e as MouseEvent) : null;
      if (!pointer || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const px = (pointer.clientX - rect.left) / rect.width;
      const py = (pointer.clientY - rect.top) / rect.height;
      const dx = px - dragging.startX;
      const dy = py - dragging.startY;
      let newCrop = {
        x: Math.max(0, Math.min(1 - crop.width, dragging.startCrop.x + dx)),
        y: Math.max(0, Math.min(1 - crop.height, dragging.startCrop.y + dy)),
        width: crop.width,
        height: crop.height,
      };
      setCrop(newCrop);
    },
    [dragging, crop.width, crop.height]
  );
  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);
  // Bind/unbind events when dragging
  React.useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handlePointerMove, { passive: false });
      window.addEventListener("touchmove", handlePointerMove, { passive: false });
      window.addEventListener("mouseup", handlePointerUp);
      window.addEventListener("touchend", handlePointerUp);
      return () => {
        window.removeEventListener("mousemove", handlePointerMove);
        window.removeEventListener("touchmove", handlePointerMove);
        window.removeEventListener("mouseup", handlePointerUp);
        window.removeEventListener("touchend", handlePointerUp);
      };
    }
  }, [dragging, handlePointerMove, handlePointerUp]);

  // Apply crop: convert percent to natural, create canvas
  const handleApply = async () => {
    const { x, y, width, height } = crop;
    const sx = Math.round(x * imgNatural.width);
    const sy = Math.round(y * imgNatural.height);
    const sw = Math.round(width * imgNatural.width);
    const sh = Math.round(height * imgNatural.height);

    const img = document.createElement("img");
    img.src = imageUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    onCrop(canvas.toDataURL("image/jpeg", 0.95));
  };

  // Render crop box as absolute overlay
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#111c",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        touchAction: "none",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: "relative",
          maxWidth: "95vw",
          maxHeight: "70vh",
          aspectRatio: `${imgNatural.width}/${imgNatural.height}`,
          background: "#222",
          borderRadius: 14,
        }}
      >
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Crop"
          onLoad={handleImgLoad}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            borderRadius: 14,
            maxHeight: "70vh",
            maxWidth: "95vw",
            objectFit: "contain",
            background: "#111",
          }}
        />
        {/* Crop box as overlay */}
        <div
          style={{
            position: "absolute",
            left: `${crop.x * 100}%`,
            top: `${crop.y * 100}%`,
            width: `${crop.width * 100}%`,
            height: `${crop.height * 100}%`,
            border: "2px solid #3b82f6",
            borderRadius: 8,
            boxSizing: "border-box",
            background: "rgba(59,130,246,0.07)",
            touchAction: "none",
            zIndex: 2,
          }}
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
        >
          {/* Handles can be added here for resizing */}
        </div>
      </div>
      {/* Action buttons */}
      <div style={{ position: "absolute", bottom: 32, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 16 }}>
        <button onClick={onCancel} style={{ fontSize: 18, padding: "10px 24px", background: "#eee", border: "none", borderRadius: 8 }}>Cancel</button>
        <button onClick={handleApply} style={{ fontSize: 18, padding: "10px 24px", background: "#10b981", color: "#fff", border: "none", borderRadius: 8 }}>Apply Crop</button>
      </div>
    </div>
  );
};

// ====== Dedicated Crop Page Example ======

const CropPage: React.FC = () => {
  const router = useRouter();
  // In production, load imageUrl from router query or app state
  // Here we use a placeholder:
  const [imageUrl, setImageUrl] = useState<string>("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedImage = localStorage.getItem("pendingImageUrl") || "";
      setImageUrl(savedImage);
    }
  }, []);

  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);

  const handleCrop = (url: string) => {
    setCroppedUrl(url);
    // Save, upload, or route to result page as needed
    localStorage.setItem("croppedImageUrl", url);
    router.push("/photo/results");
  };

  const handleCancel = () => {
    router.back();
  };

  if (!imageUrl) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        No image to crop. Please upload an image first.
      </div>
    );
  }

  return (
    <CropTool imageUrl={imageUrl} aspect={null} onCrop={handleCrop} onCancel={handleCancel} />
  );
};

export default CropPage;
