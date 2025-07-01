'use client'
import React from "react"
import { useRouter } from "next/navigation"

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

const ResultPage: React.FC = () => {
  const router = useRouter()
  const [croppedUrl, setCroppedUrl] = React.useState<string>("")
  const [originalFileName, setOriginalFileName] = React.useState<string>("")

  React.useEffect(() => {
    // Get cropped image URL from localStorage
    if (typeof window !== "undefined") {
      const savedCroppedUrl = localStorage.getItem("croppedImageUrl") || ""
      const fileName = localStorage.getItem("photoFileName") || "cropped-image.jpg"
      setCroppedUrl(savedCroppedUrl)
      setOriginalFileName(fileName)
    }
  }, [])

  if (!croppedUrl) {
    return (
      <div style={{ 
        padding: 32, 
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9fafb"
      }}>
        <div>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</div>
          <h2 style={{ color: "#6b7280", marginBottom: "1rem", fontSize: '1.5rem' }}>
            No cropped image found
          </h2>
          <p style={{ color: "#9ca3af", marginBottom: "2rem" }}>
            Please go back and crop an image first
          </p>
          <button 
            onClick={() => router.push("/photo")}
            style={{ 
              fontSize: 18, 
              padding: "12px 24px",
              backgroundColor: BRAND_PURPLE,
              color: "white",
              border: "none",
              borderRadius: "0.75rem",
              cursor: "pointer",
              fontWeight: '600'
            }}
          >
            Start Over
          </button>
        </div>
      </div>
    )
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.download = originalFileName.replace(/\.[^/.]+$/, "") + '-cropped.jpg'
    link.href = croppedUrl
    link.click()
  }

  const handleStartOver = () => {
    // Clear all localStorage
    localStorage.removeItem("pendingImageUrl")
    localStorage.removeItem("croppedImageUrl")
    localStorage.removeItem("photoFileName")
    localStorage.removeItem("photoFileSize")
    router.push("/photo")
  }

  const handleContinueToWorkflow = () => {
    // Store cropped image for your existing workflow
    localStorage.setItem('uploadedPhoto', croppedUrl)
    localStorage.setItem('selectedPhotoIndex', 'uploadedPhoto')
    
    // Navigate to your existing Step 2 (story/persona)
    router.push("/dashboard/create/persona")
  }

  const handleCrop = () => {
    router.push("/photo/crop")
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'white'
    }}>
      {/* Header with Step Tracker */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1rem',
        borderBottom: '1px solid #f3f4f6'
      }}>
        {/* Step Tracker */}
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
            backgroundColor: '#10b981',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>✓</div>
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

        <h1 style={{
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          fontWeight: '700',
          color: '#1f2937',
          lineHeight: '1.2',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          🎉 Your Photo is Ready!
        </h1>
        
        <p style={{
          fontSize: 'clamp(1rem, 3vw, 1.25rem)',
          color: '#6b7280',
          textAlign: 'center',
          maxWidth: '600px'
        }}>
          Your image has been cropped with pixel-perfect accuracy
        </p>
      </div>

      <div style={{
        flex: 1,
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
        padding: '2rem 1rem'
      }}>
        {/* Success Message */}
        <div style={{
          backgroundColor: '#dcfce7',
          border: '1px solid #bbf7d0',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#15803d',
            marginBottom: '0.5rem'
          }}>
            ✨ Crop Complete!
          </h2>
          <p style={{
            color: '#166534',
            fontSize: '1rem',
            margin: 0
          }}>
            Your image has been processed using percentage-based coordinates for perfect accuracy across all devices
          </p>
        </div>
        
        {/* Cropped Image Display */}
        <div style={{ 
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            maxWidth: "600px", 
            margin: "0 auto",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            borderRadius: "1rem",
            overflow: "hidden",
            backgroundColor: '#f8fafc'
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
          
          {originalFileName && (
            <p style={{
              marginTop: '1rem',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              📁 {originalFileName.replace(/\.[^/.]+$/, "")}-cropped.jpg
            </p>
          )}
        </div>
        
        {/* Action Buttons */}
        <div style={{ 
          display: "flex", 
          gap: "1rem", 
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: '2rem'
        }}>
          <button 
            onClick={handleDownload}
            style={{ 
              fontSize: 'clamp(1rem, 3vw, 1.125rem)', 
              padding: "12px 24px",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "0.75rem",
              cursor: "pointer",
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            📥 Download Image
          </button>
          
          <button 
            onClick={handleCrop}
            style={{ 
              fontSize: 'clamp(1rem, 3vw, 1.125rem)', 
              padding: "12px 24px",
              backgroundColor: "#f59e0b",
              color: "white",
              border: "none",
              borderRadius: "0.75rem",
              cursor: "pointer",
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ✂️ Crop Again
          </button>
          
          <button 
            onClick={handleContinueToWorkflow}
            style={{ 
              fontSize: 'clamp(1.125rem, 3.5vw, 1.5rem)', 
              padding: "16px 32px",
              background: `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`,
              color: "white",
              border: "none",
              borderRadius: "1rem",
              cursor: "pointer",
              fontWeight: '700',
              boxShadow: '0 10px 25px rgba(107, 46, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ✨ Continue to Content Creation
          </button>
        </div>

        {/* Secondary Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <button 
            onClick={handleStartOver}
            style={{ 
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', 
              padding: "8px 16px",
              backgroundColor: "transparent",
              color: "#6b7280",
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: '500'
            }}
          >
            🔄 Start Over
          </button>
        </div>

        {/* Technical Info */}
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #0ea5e9',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#0369a1',
            marginBottom: '1rem'
          }}>
            🔧 Technical Details
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            fontSize: '0.875rem'
          }}>
            <div>
              <strong style={{ color: '#0369a1' }}>Coordinate System:</strong>
              <div style={{ color: '#374151' }}>Percentage-based (0-1)</div>
            </div>
            <div>
              <strong style={{ color: '#0369a1' }}>Architecture:</strong>
              <div style={{ color: '#374151' }}>Container Isolated</div>
            </div>
            <div>
              <strong style={{ color: '#0369a1' }}>Accuracy:</strong>
              <div style={{ color: '#374151' }}>Pixel-perfect</div>
            </div>
            <div>
              <strong style={{ color: '#0369a1' }}>Mobile Optimized:</strong>
              <div style={{ color: '#374151' }}>✅ Yes</div>
            </div>
          </div>
        </div>

        {/* Brand Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '1rem'
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
        <button
          onClick={() => router.push("/")}
          style={{
            color: '#6b7280',
            background: 'transparent',
            border: 'none',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            cursor: 'pointer'
          }}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  )
}

export default ResultPage
