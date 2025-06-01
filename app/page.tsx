'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Brand colors
const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

export default function Home() {
  const [showSignUp, setShowSignUp] = useState(false)

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6">
        <div className="flex justify-end">
          <button
            onClick={() => setShowSignUp(true)}
            className="px-6 py-2 rounded-lg font-medium text-white text-sm md:text-base transition-all hover:opacity-90"
            style={{ backgroundColor: BRAND_PURPLE }}
          >
            Log-In
          </button>
        </div>
      </div>

      {/* Main Content Container - Full Screen Centered */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20">
        
        {/* Logo Section - Perfectly Centered */}
        <div className="flex flex-col items-center mb-8 md:mb-12">
          {/* Robot Logo */}
          <div className="mb-4">
            <Image
              src="/logos/1.png"
              alt="Speak Click Send"
              width={120}
              height={120}
              priority
              className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36"
            />
          </div>
        </div>

        {/* Tagline Section */}
        <div className="text-center mb-12 md:mb-16 max-w-xs md:max-w-md lg:max-w-lg">
          <h1 
            className="text-lg md:text-xl lg:text-2xl font-bold leading-tight"
            style={{
              background: `linear-gradient(90deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 50%, ${BRAND_BLUE} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Transform Your Single Story into 10 Different Platform Formats Instantly!
          </h1>
        </div>

        {/* START Button - Large and Prominent */}
        <div className="w-full max-w-xs md:max-w-sm">
          <Link href="/dashboard/create" className="block">
            <button 
              className="w-full py-4 md:py-5 rounded-2xl text-white font-bold text-xl md:text-2xl transition-all hover:scale-105 active:scale-95 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`,
                minHeight: '60px'
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
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full mx-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: BRAND_PURPLE }}>
                Welcome Back
              </h2>
              <p className="text-gray-600 mt-2">Sign in to your account</p>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSignUp(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl text-white font-medium transition-all hover:opacity-90"
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
