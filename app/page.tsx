'use client'

import { useState } from 'react'
import Link from 'next/link'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C' 
const BRAND_BLUE = '#11B3FF'

export default function Home() {
  const [showSignUp, setShowSignUp] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      
      {/* Log-In Button - Absolute Top Right */}
      {/* Fixed Log-In Button - Responsive positioning */}
      <button
        onClick={() => setShowSignUp(true)}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-10 px-3 py-2 md:px-6 md:py-2 rounded-lg font-medium transition-all hover:bg-blue-50 text-sm md:text-base"
        style={{ 
          backgroundColor: 'transparent',
          border: `2px solid ${BRAND_BLUE}`,
          color: BRAND_BLUE
        }}
      >
        Sign-In
      </button>

      {/* Text-Only Logo Header - Takes up 1/3 of page, Bold & Central */}
      <div className="flex flex-col justify-center items-center h-[33vh] text-center w-full">
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div style={{ 
            color: BRAND_PURPLE, 
            fontSize: 'clamp(4rem, 12vw, 10rem)', 
            fontWeight: '900',
            lineHeight: '0.9',
            marginBottom: '0.2rem'
          }}>speak</div>
          <div style={{ 
            color: BRAND_ORANGE, 
            fontSize: 'clamp(4rem, 12vw, 10rem)', 
            fontWeight: '900',
            lineHeight: '0.9',
            marginBottom: '0.2rem'
          }}>click</div>
          <div style={{ 
            color: BRAND_BLUE, 
            fontSize: 'clamp(4rem, 12vw, 10rem)', 
            fontWeight: '900',
            lineHeight: '0.9'
          }}>send</div>
        </div>
      </div>

      

      {/* Tagline - Centered */}
      <div style={{ textAlign: 'center', width: '100%', padding: '0 1rem', marginTop: '120px' }}>
      
        <p style={{ 
          fontSize: 'clamp(1.5rem, 4vw, 3rem)', 
          fontWeight: '700',
          color: '#374151',
          lineHeight: '1.2',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          Transform Your Single Story into 10 Different Platforms Instantly!
        </p>
      </div>

      {/* CTA Button - Perfectly Centered */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: '4rem' }}>
        <Link href="/dashboard/create">
          <button 
            style={{
              background: `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`,
              color: 'white',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: '900',
              padding: '1.5rem 3rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'block',
              margin: '0 auto'
            }}
            className="transition-all hover:scale-105"
          >
            START
          </button>
        </Link>
      </div>

      {/* Animated Platform Logos - 4 Sets Rotating */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%', 
        marginBottom: '2rem',
        height: '60px',
        position: 'relative'
      }}>
        {/* Set 1: Social Media Platforms */}
        <div 
          className="logo-set"
          style={{ 
            display: 'flex', 
            gap: '2.5rem', 
            alignItems: 'center',
            position: 'absolute',
            animationDelay: '0s'
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#1877F2" opacity="0.7">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#E4405F" opacity="0.7">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#0A66C2" opacity="0.7">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#1DA1F2" opacity="0.7">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        </div>

        {/* Set 2: Content Platforms */}
        <div 
          className="logo-set"
          style={{ 
            display: 'flex', 
            gap: '2.5rem', 
            alignItems: 'center',
            position: 'absolute',
            animationDelay: '4s'
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#FF0000" opacity="0.7">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#000000" opacity="0.7">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.987 11.987s11.987-5.367 11.987-11.987C24.003 5.367 18.637.001 12.017.001zM18.465 16.467c-.11.313-.32.593-.63.84-.31.245-.69.42-1.134.52-.445.1-.916.15-1.412.15-.496 0-.967-.05-1.412-.15-.444-.1-.824-.275-1.134-.52-.31-.247-.52-.527-.63-.84-.11-.313-.165-.654-.165-1.02 0-.366.055-.707.165-1.02.11-.313.32-.593.63-.84.31-.245.69-.42 1.134-.52.445-.1.916-.15 1.412-.15.496 0 .967.05 1.412.15.444.1.824.275 1.134.52.31.247.52.527.63.84.11.313.165.654.165 1.02 0 .366-.055.707-.165 1.02z"/>
          </svg>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#BD081C" opacity="0.7">
            <path d="M0 12c0 5.123 3.211 9.497 7.73 11.218-.11-.937-.227-2.482.025-3.566.217-.932 1.401-5.938 1.401-5.938s-.357-.715-.357-1.774c0-1.66.962-2.9 2.161-2.9 1.02 0 1.512.765 1.512 1.682 0 1.025-.653 2.557-.99 3.978-.281 1.189.597 2.159 1.769 2.159 2.123 0 3.756-2.239 3.756-5.471 0-2.861-2.056-4.86-4.991-4.86-3.398 0-5.393 2.549-5.393 5.184 0 1.027.395 2.127.889 2.726a.36.36 0 0 1 .083.343c-.091.378-.293 1.189-.332 1.355-.053.218-.173.265-.4.159-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-12C24.007 5.367 18.641.001 12.017.001z"/>
          </svg>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#666666" opacity="0.7">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169 1.858-.896 3.433-2.182 4.72-1.286 1.287-2.86 2.014-4.72 2.182-.63.057-1.265.086-1.904.086s-1.274-.029-1.904-.086c-1.858-.168-3.433-.895-4.72-2.182C.852 11.594.125 10.018-.043 8.16-.1 7.53-.129 6.895-.129 6.256s.029-1.274.086-1.904C.125 2.494.852.919 2.138-.368 3.425-1.655 4.999-2.382 6.857-2.55c.63-.057 1.265-.086 1.904-.086s1.274.029 1.904.086c1.858.168 3.433.895 4.72 2.182 1.286 1.287 2.013 2.861 2.182 4.72.057.63.086 1.265.086 1.904s-.029 1.274-.086 1.904z"/>
          </svg>
        </div>

        {/* Set 3: Professional Downloads */}
        <div 
          className="logo-set"
          style={{ 
            display: 'flex', 
            gap: '2.5rem', 
            alignItems: 'center',
            position: 'absolute',
            animationDelay: '8s'
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#DC3545" opacity="0.7">
            <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z"/>
            <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z"/>
          </svg>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#2B579A" opacity="0.7">
            <path d="M2.25 3.75A1.5 1.5 0 0 1 3.75 2.25h16.5A1.5 1.5 0 0 1 21.75 3.75v16.5A1.5 1.5 0 0 1 20.25 21.75H3.75A1.5 1.5 0 0 1 2.25 20.25V3.75zM5.25 6.75a.75.75 0 0 0-.75.75v1.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-.75-.75h-1.5zM10.5 6.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5zm0 3a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5zm0 3a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5zm0 3a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5z"/>
          </svg>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#EA4335" opacity="0.7">
            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819v9.273L12 8.183l6.545 4.91V3.82h3.819c.904 0 1.636.733 1.636 1.637z"/>
          </svg>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#FF6B35" opacity="0.7">
            <path d="M2.25 3.75A1.5 1.5 0 0 1 3.75 2.25h16.5A1.5 1.5 0 0 1 21.75 3.75v16.5A1.5 1.5 0 0 1 20.25 21.75H3.75A1.5 1.5 0 0 1 2.25 20.25V3.75zM12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zm-3.75 7.5a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0z"/>
          </svg>
        </div>

        {/* Set 4: Business Communications */}
        <div 
          className="logo-set"
          style={{ 
            display: 'flex', 
            gap: '2.5rem', 
            alignItems: 'center',
            position: 'absolute',
            animationDelay: '12s'
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#0F172A" opacity="0.7">
            <path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h15A1.5 1.5 0 0 1 21 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-15zM5.25 6.75a.75.75 0 0 0 0 1.5h13.5a.75.75 0 0 0 0-1.5H5.25zm0 3a.75.75 0 0 0 0 1.5h13.5a.75.75 0 0 0 0-1.5H5.25zm0 3a.75.75 0 0 0 0 1.5h13.5a.75.75 0 0 0 0-1.5H5.25zm0 3a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5z"/>
          </svg>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#1F2937" opacity="0.7">
            <path d="M15 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75H15.75a.75.75 0 0 1-.75-.75v-4.5zM3 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1-.75-.75v-4.5zM15 15.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75H15.75a.75.75 0 0 1-.75-.75v-4.5zM3 15.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1-.75-.75v-4.5z"/>
          </svg>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#374151" opacity="0.7">
            <path d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75zM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12zM3 17.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75z"/>
          </svg>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#F59E0B" opacity="0.7">
            <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67z"/>
            <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908z"/>
          </svg>
        </div>
      </div>

      <style jsx>{`
        .logo-set {
          animation: logoFadeRotate 16s infinite;
        }
        
        @keyframes logoFadeRotate {
          0%, 18.75% { opacity: 0.7; transform: translateY(0px); }
          25%, 43.75% { opacity: 0; transform: translateY(-10px); }
          50%, 68.75% { opacity: 0; transform: translateY(-10px); }
          75%, 93.75% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        
        .logo-set:nth-child(2) {
          animation-delay: 4s;
        }
        
        .logo-set:nth-child(3) {
          animation-delay: 8s;
        }
        
        .logo-set:nth-child(4) {
          animation-delay: 12s;
        }
      `}</style>

      {/* Spacer for bottom */}
      <div className="flex-1"></div>

      {/* Sign Up Modal */}
      {showSignUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: BRAND_PURPLE }}>
              Welcome Back
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSignUp(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                  </button>
                <Link href="/plans" className="flex-1">
  <button
    type="button"
    className="w-full px-4 py-3 rounded-xl text-white font-medium"
    style={{ backgroundColor: BRAND_PURPLE }}
    onClick={() => setShowSignUp(false)}
  >
    Sign Up
  </button>
</Link>
    
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
