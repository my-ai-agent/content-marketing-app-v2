'use client'

import Link from 'next/link'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

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

      {/* Platform Logos */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* Instagram */}
        <div style={{ 
          fontSize: '2.5rem',
          color: '#E4405F',
          textAlign: 'center'
        }}>
          📷
        </div>
        
        {/* Facebook */}
        <div style={{ 
          fontSize: '2.5rem',
          color: '#1877F2',
          textAlign: 'center'
        }}>
          📘
        </div>
        
        {/* LinkedIn */}
        <div style={{ 
          fontSize: '2.5rem',
          color: '#0A66C2',
          textAlign: 'center'
        }}>
          💼
        </div>
        
        {/* Email/More */}
        <div style={{ 
          fontSize: '2.5rem',
          color: '#718096',
          textAlign: 'center'
        }}>
          📧
        </div>
        
        {/* Plus More Indicator */}
        <div style={{
          fontSize: '1.2rem',
          color: '#718096',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          + 12 more platforms
        </div>
      </div>

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
