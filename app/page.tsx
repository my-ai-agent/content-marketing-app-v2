'use client'

import { useState, useEffect } from 'react'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

// Platform showcase with real platform names and colors
const platformSets = [
  [
    { name: 'Instagram', color: '#E4405F', icon: '📷' },
    { name: 'Facebook', color: '#1877F2', icon: '📘' },
    { name: 'LinkedIn', color: '#0A66C2', icon: '💼' },
    { name: 'Email', color: '#718096', icon: '📧' }
  ],
  [
    { name: 'TikTok', color: '#000000', icon: '🎵' },
    { name: 'YouTube', color: '#FF0000', icon: '📺' },
    { name: 'Twitter/X', color: '#1DA1F2', icon: '🐦' },
    { name: 'Pinterest', color: '#BD081C', icon: '📌' }
  ],
  [
    { name: 'Website', color: '#718096', icon: '🌐' },
    { name: 'PDF', color: '#DC2626', icon: '📄' },
    { name: 'Blog Post', color: '#059669', icon: '📝' },
    { name: 'Word Doc', color: '#2563EB', icon: '💻' }
  ]
]

// Clean Platform Carousel Component
function PlatformCarousel() {
  const [currentSetIndex, setCurrentSetIndex] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSetIndex((prevIndex) => (prevIndex + 1) % platformSets.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])
  
  const currentPlatforms = platformSets[currentSetIndex]
  
  return (
    <div style={{
      display: 'flex',
      gap: '2rem',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80px'
    }}>
      {currentPlatforms.map((platform, index) => (
        <div
          key={`${currentSetIndex}-${index}`}
          style={{
            textAlign: 'center',
            transition: 'all 0.6s ease',
            opacity: 1,
            transform: 'translateY(0)',
            animation: `slideInFade 0.6s ease-in-out`
          }}
        >
          <div style={{ 
            fontSize: '2.5rem',
            marginBottom: '0.25rem',
            color: platform.color
          }}>
            {platform.icon}
          </div>
          <div style={{ 
            fontSize: '0.8rem', 
            color: '#4A5568', 
            fontWeight: '600',
            whiteSpace: 'nowrap'
          }}>
            {platform.name}
          </div>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes slideInFade {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

// User Menu Component for Authenticated Users
function UserMenu({ userName, userProfile }: { userName: string; userProfile: any }) {
  const [showDropdown, setShowDropdown] = useState(false)

  const handleDashboard = () => {
    window.location.href = '/dashboard'
  }

  const handleProfile = () => {
    window.location.href = '/profile'
  }

  const handleSignOut = () => {
    // Clear authentication data
    localStorage.removeItem('userToken')
    localStorage.removeItem('userProfile')
    window.location.reload() // Refresh to show sign-in state
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: `linear-gradient(45deg, ${BRAND_BLUE}, ${BRAND_PURPLE})`,
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '25px',
          fontSize: '1rem',
          fontWeight: '600',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}
      >
        <span>👤</span>
        <span>{userName}</span>
        <span style={{ fontSize: '0.8rem' }}>▼</span>
      </button>

      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '0.5rem',
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          overflow: 'hidden',
          minWidth: '200px',
          zIndex: 1000
        }}>
          <button
            onClick={handleDashboard}
            style={{
              display: 'block',
              width: '100%',
              padding: '1rem 1.5rem',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '0.9rem',
              color: '#333',
              borderBottom: '1px solid #f0f0f0'
            }}
          >
            📊 Dashboard
          </button>
          <button
            onClick={handleProfile}
            style={{
              display: 'block',
              width: '100%',
              padding: '1rem 1.5rem',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '0.9rem',
              color: '#333',
              borderBottom: '1px solid #f0f0f0'
            }}
          >
            ⚙️ Profile Settings
          </button>
          <button
            onClick={handleSignOut}
            style={{
              display: 'block',
              width: '100%',
              padding: '1rem 1.5rem',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '0.9rem',
              color: '#dc2626'
            }}
          >
            🚪 Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

export default function AuthenticatedHome() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)

  // Authentication check on component mount
  useEffect(() => {
    const checkAuthentication = () => {
      try {
        // Check for user token and profile
        const userToken = localStorage.getItem('userToken')
        const userProfileData = localStorage.getItem('userProfile')
        
        if (userToken && userProfileData) {
          const profile = JSON.parse(userProfileData)
          setUserProfile(profile)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Authentication check failed:', error)
        // Clear invalid data
        localStorage.removeItem('userToken')
        localStorage.removeItem('userProfile')
      }
      setIsLoading(false)
    }

    checkAuthentication()
  }, [])

  const handleSignIn = () => {
    window.location.href = '/auth'
  }

  const handleStart = () => {
    window.location.href = '/dashboard/create/photo'
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#4A5568' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header Navigation - Conditional based on auth status */}
      <header style={{
        width: '100%',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
      }}>
        {isAuthenticated ? (
          // Authenticated User - Show user menu
          <UserMenu 
            userName={userProfile?.profile?.name || 'User'} 
            userProfile={userProfile} 
          />
        ) : (
          // Non-authenticated User - Show Sign In button
          <button
            onClick={handleSignIn}
            style={{
              background: `linear-gradient(45deg, ${BRAND_BLUE}, ${BRAND_PURPLE})`,
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'
            }}
          >
            Sign In
          </button>
        )}
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}>
        {/* Brand Logo */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: '900',
            margin: '0 0 1rem 0',
            lineHeight: '0.9'
          }}>
            <span style={{ color: BRAND_PURPLE, display: 'block' }}>click</span>
            <span style={{ color: BRAND_ORANGE, display: 'block' }}>speak</span>
            <span style={{ color: BRAND_BLUE, display: 'block' }}>send</span>
          </h1>
        </div>

        {/* Personalized Welcome for Authenticated Users */}
        {isAuthenticated && userProfile && (
          <div style={{
            background: 'rgba(255,255,255,0.8)',
            borderRadius: '15px',
            padding: '1.5rem',
            marginBottom: '2rem',
            maxWidth: '500px'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: BRAND_PURPLE,
              marginBottom: '0.5rem'
            }}>
              Kia ora, {userProfile.profile?.name}! 👋
            </h3>
            <p style={{
              color: '#4A5568',
              fontSize: '0.9rem',
              margin: 0
            }}>
              Ready to create more culturally-intelligent content?
            </p>
          </div>
        )}

        {/* Value Proposition */}
        <div style={{ marginBottom: '3rem', maxWidth: '800px' }}>
          <h2 style={{
            fontSize: 'clamp(1.25rem, 4vw, 2rem)',
            fontWeight: '700',
            color: '#2D3748',
            margin: '0 0 1rem 0',
            lineHeight: '1.2'
          }}>
            {isAuthenticated 
              ? 'Create Your Next Story + Photo into Global Platforms!'
              : 'Transform Your Single Story + Photo into Global Platforms Instantly!'
            }
          </h2>
        </div>

        {/* START Button */}
        <button
          onClick={handleStart}
          style={{
            background: `linear-gradient(135deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`,
            color: 'white',
            padding: '1.5rem 3rem',
            borderRadius: '50px',
            fontSize: '1.5rem',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '4rem'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)'
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'
          }}
        >
          START
        </button>

        {/* Platform Carousel */}
        <PlatformCarousel />
      </main>

      {/* Footer */}
      <footer style={{
        padding: '2rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        background: 'rgba(255, 255, 255, 0.5)'
      }}>
        <p style={{
          color: '#718096',
          fontSize: '0.9rem',
          margin: 0
        }}>
          The world's first culturally-intelligent content creation platform
        </p>
      </footer>
    </div>
  )
}
