'use client'

import Link from 'next/link'
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
    }, 3000) // Change every 3 seconds for better readability
    
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
      
      {/* CSS animation */}
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

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Brand Logo */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: '900',
          margin: '0',
          lineHeight: '0.9'
        }}>
          <span style={{ color: BRAND_PURPLE, display: 'block' }}>click</span>
          <span style={{ color: BRAND_ORANGE, display: 'block' }}>speak</span>
          <span style={{ color: BRAND_BLUE, display: 'block' }}>send</span>
        </h1>
        
        {/* NEW: Brand Differentiator */}
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: '25px',
          display: 'inline-block',
          boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
        }}>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
            fontWeight: '700',
            margin: '0',
            background: `linear-gradient(135deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 50%, ${BRAND_BLUE} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.5px'
          }}>
            🏆 World's #1 Photo-First Travel Storytelling App
          </p>
        </div>
      </div>

      {/* Updated Value Proposition */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: '700',
          color: '#2D3748',
          margin: '0 0 1rem 0',
          lineHeight: '1.2'
        }}>
          Transform Your Single Story + Photo into 16 Different Platforms Instantly!
        </h2>
        <p style={{
          fontSize: '1.2rem',
          color: '#4A5568',
          margin: '0',
          lineHeight: '1.5'
        }}>
          The only tourism app that works exactly how tourists actually behave: 📸 See something amazing → Capture it → Share it professionally
        </p>
      </div>

      {/* Fixed START Button - Routes to Photo Capture */}
      <Link 
        href="/dashboard/create/photo" 
        style={{
          background: `linear-gradient(135deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`,
          color: 'white',
          padding: '1.5rem 3rem',
          borderRadius: '50px',
          fontSize: '1.5rem',
          fontWeight: '700',
          textDecoration: 'none',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
          border: 'none',
          cursor: 'pointer',
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
      </Link>

      {/* Clean Platform Carousel */}
      <PlatformCarousel />

      {/* Subtitle */}
      <p style={{
        marginTop: '2rem',
        fontSize: '1rem',
        color: '#666',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        Photo-first tourism storytelling • AI-enhanced content • Multi-platform distribution • QR sharing ecosystem
      </p>
    </div>
  )
}
