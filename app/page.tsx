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
      <button
        onClick={() => setShowSignUp(true)}
        className="absolute top-6 right-6 z-10 px-6 py-2 rounded-lg font-medium transition-all hover:bg-blue-50"
        style={{ 
          backgroundColor: 'transparent',
          border: `3px solid ${BRAND_BLUE}`,
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
      </div>,

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
{/* Animated Platform Logos */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%', 
        marginBottom: '2rem',
        height: '60px' 
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          alignItems: 'center',
          opacity: 0.7,
          animation: 'logoFade 16s infinite'
        }}>
          <div style={{ fontSize: '32px' }}>📘</div>
          <div style={{ fontSize: '32px' }}>📷</div>
          <div style={{ fontSize: '32px' }}>💼</div>
          <div style={{ fontSize: '32px' }}>🐦</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes logoFade {
          0%, 20% { opacity: 0.7; }
          25%, 45% { opacity: 0; }
          50%, 70% { opacity: 0.7; }
          75%, 95% { opacity: 0; }
          100% { opacity: 0.7; }
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
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl text-white font-medium"
                  style={{ backgroundColor: BRAND_PURPLE }}
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
