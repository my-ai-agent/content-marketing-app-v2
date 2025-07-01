'use client'
import React from "react";
import { useRouter } from "next/navigation";

// This is a simplified photo upload page
const PhotoUploadPage: React.FC = () => {
  const router = useRouter();
  const [file, setFile] = React.useState<File | null>(null);
  const [imgUrl, setImgUrl] = React.useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const imageDataUrl = String(ev.target?.result);
        setImgUrl(imageDataUrl);
        // Save to localStorage or app state for the /crop page
        localStorage.setItem("pendingImageUrl", imageDataUrl);
        router.push("/photo/crop");
      };
      reader.readAsDataURL(f);
    }
  };

  return (
    <div style={{ 
      padding: 32, 
      textAlign: "center",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", color: "#1f2937" }}>
        Add Your Photo
      </h1>
      
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ 
          fontSize: 18, 
          marginTop: 24,
          padding: "1rem",
          border: "2px dashed #d1d5db",
          borderRadius: "0.5rem",
          cursor: "pointer"
        }}
      />
      
      {imgUrl && (
        <div style={{ marginTop: "2rem" }}>
          <img 
            src={imgUrl} 
            alt="Preview" 
            style={{ 
              maxWidth: 320, 
              maxHeight: 320,
              borderRadius: 10,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
            }} 
          />
          <p style={{ marginTop: "1rem", color: "#6b7280" }}>
            Proceeding to crop tool...
          </p>
        </div>
      )}
    </div>
  );
};

export default PhotoUploadPage;
