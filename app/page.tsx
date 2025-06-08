'use client'

import { useState } from 'react'
import Link from 'next/link'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C' 
const BRAND_BLUE = '#11B3FF'

export default function Home() {
  const [showSignUp, setShowSignUp] = useState(false)

  return (
    <main className="h-screen w-screen bg-white flex flex-col relative overflow-hidden">
      
      {/* Log-In Button - Absolute Top Right */}
      <button
        onClick={() => setShowSignUp(true)}
        className="absolute top-6 right-6 z-10 px-6 py-2 rounded-lg font-medium text-white"
        style={{ backgroundColor: BRAND_PURPLE }}
      >
        Log-In
      </button>

      {/* Main Content - Flex 1 for Perfect Centering */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        
        {/* Logo - Using standard img tag for debugging */}
        <div className="mb-8 flex justify-center">
          <img
            src="/logos/1.png"
            alt="Speak Click Send"
            className="w-24 h-24 md:w-32 md:h-32 max-w-full h-auto"
            onError={(e) => {
              console.error('Logo failed to load:', e);
              // Fallback to a different logo if needed
              e.currentTarget.src = '/logos/2.png';
            }}
          />
        </div>

        {/* Tagline */}
        <h1 
          className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-12 leading-tight max-w-4xl"
          style={{
            background: `linear-gradient(90deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 50%, ${BRAND_BLUE} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Transform Your Single Story into 10 Different Platform Formats Instantly!
        </h1>

        {/* START Button */}
        <div className="flex justify-center">
          <Link href="/dashboard/create">
            <button 
              className="px-12 py-4 rounded-xl text-white font-bold text-xl transition-all hover:scale-105 shadow-lg"
              style={{
                background: `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`,
              }}
            >
              START
            </button>
          </Link>
        </div>

      </div>

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
    </main>
  )
}
