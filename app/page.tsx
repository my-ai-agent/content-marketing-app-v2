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
        className="absolute top-6 right-6 z-10 px-6 py-2 rounded-lg font-medium text-white"
        style={{ backgroundColor: BRAND_PURPLE }}
      >
        Log-In
      </button>

      {/* Text-Only Logo Header - Enlarged & Centralized */}
      <div className="text-center mt-16 mb-12">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold leading-tight">
          <span style={{ color: BRAND_PURPLE }}>speak</span>
          <br />
          <span style={{ color: BRAND_ORANGE }}>click</span>
          <br />
          <span style={{ color: BRAND_BLUE }}>send</span>
        </h1>
      </div>

      {/* Tagline */}
      <div className="text-center mb-12 px-4">
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
          Transform Your Single Story into 10 Different Platform Formats Instantly!
        </p>
      </div>

      {/* CTA Button - Copilot's Proven Centering */}
      <div className="flex justify-center mb-16">
        <Link href="/dashboard/create">
          <button 
            className="px-12 py-6 rounded-2xl text-white font-black text-4xl sm:text-5xl md:text-6xl transition-all hover:scale-105 shadow-2xl"
            style={{
              background: `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
            }}
          >
            START
          </button>
        </Link>
      </div>

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
