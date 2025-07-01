'use client'
import React from "react";
import { useRouter } from "next/navigation";

const ResultPage: React.FC = () => {
  const router = useRouter();
  const [croppedUrl, setCroppedUrl] = React.useState<string>("");

  React.useEffect(() => {
    // Get cropped image URL from localStorage or app state
    if (typeof window !== "undefined") {
      const savedCroppedUrl = localStorage.getItem("croppedImageUrl") || "";
      setCroppedUrl(savedCroppedUrl);
    }
  }, []);

  if (!croppedUrl) {
    return (
      <div style={{ 
        padding: 32, 
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div>
          <h2 style={{ color: "#6b7280", marginBottom: "1rem" }}>No cropped image found</h2>
          <button 
            onClick={() => router.push("/photo")}
            style={{ 
              fontSize: 18, 
              padding: "10px 24px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer"
            }}
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = 'cropped-image.jpg';
    link.href = croppedUrl;
    link.click();
  };

  const handleStartOver = () => {
    // Clear localStorage
    localStorage.removeItem("pendingImageUrl");
    localStorage.removeItem("croppedImageUrl");
    router.push("/photo");
  };

  const handleContinue = () => {
    // Navigate to your existing workflow
    // You can customize this to integrate with your 6-step process
    router.push("/dashboard/create/persona");
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
      <h2 style={{ 
        fontSize: "1.5rem", 
        marginBottom: "2rem", 
        color: "#1f2937" 
      }}>
        🎉 Your Cropped Photo
      </h2>
      
      <div style={{ 
        maxWidth: "500px", 
        marginBottom: "2rem",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        borderRadius: "1rem",
        overflow: "hidden"
      }}>
        <img 
          src={croppedUrl} 
          alt="Cropped result" 
          style={{ 
            width: "100%", 
            height: "auto",
            display: "block"
          }} 
        />
      </div>
      
      <div style={{ 
        display: "flex", 
        gap: "1rem", 
        flexWrap: "wrap",
        justifyContent: "center"
      }}>
        <button 
          onClick={handleDownload}
          style={{ 
            fontSize: 16, 
            padding: "12px 24px",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer"
          }}
        >
          📥 Download
        </button>
        
        <button 
          onClick={handleContinue}
          style={{ 
            fontSize: 16, 
            padding: "12px 24px",
            backgroundColor: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer"
          }}
        >
          ✨ Continue to Content Creation
        </button>
        
        <button 
          onClick={handleStartOver}
          style={{ 
            fontSize: 16, 
            padding: "12px 24px",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer"
          }}
        >
          🔄 Start Over
        </button>
      </div>

      <p style={{ 
        marginTop: "2rem", 
        color: "#6b7280", 
        fontSize: "0.875rem",
        maxWidth: "400px"
      }}>
        Your image has been cropped using percentage-based coordinates for pixel-perfect accuracy on all devices.
      </p>
    </div>
  );
};

export default ResultPage;
