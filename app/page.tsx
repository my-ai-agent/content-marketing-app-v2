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

      {/* Main Content - Better Space Proportions */}
      <div className="flex-1 flex flex-col">
        
        {/* Logo Section - Top 1/3 of Page */}
        <div className="flex-1 flex items-center justify-center max-h-[33vh] pt-8">
          <img
            src="/logos/1.png"
            alt="Speak Click Send"
            className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 max-w-full h-auto"
            onError={(e) => {
              console.error('Logo failed to load:', e);
              e.currentTarget.src = '/logos/2.png';
            }}
          />
        </div>

        {/* Content Section - Bottom 2/3 of Page */}
        <div className="flex-[2] flex flex-col justify-center px-6 pb-8">
          
          {/* Tagline - Large, Accessible Font */}
          <div className="w-full flex justify-center mb-12">
            <h1 
              className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center leading-tight max-w-5xl px-4"
              style={{
                background: `linear-gradient(90deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 50%, ${BRAND_BLUE} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: '1.2'
              }}
            >
              Transform Your Single Story into 10 Different Platform Formats Instantly!
            </h1>
          </div>

          {/* START Button - 5x Larger and Centered */}
          <div className="w-full flex justify-center">
            <Link href="/dashboard/create" className="w-full max-w-md px-6">
              <button 
                className="w-full py-8 rounded-2xl text-white font-bold text-3xl md:text-4xl lg:text-5xl transition-all hover:scale-105 shadow-xl"
                style={{
                  background: `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`,
                  minHeight: '120px'
                }}
              >
                START
              </button>
            </Link>
          </div>

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
