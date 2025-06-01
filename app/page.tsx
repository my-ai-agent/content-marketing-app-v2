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
    <>
      {/* Sign Up Button - Top Right Corner */}
      <div className="fixed top-6 right-6 z-10">
        <button
          onClick={() => setShowSignUp(true)}
          className="px-6 py-3 rounded-lg font-medium transition-colors text-white"
          style={{ backgroundColor: BRAND_PURPLE }}
        >
          Sign Up
        </button>
      </div>

      {/* Main Content - Perfectly Centered */}
      <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
        
        {/* Robot Logo - Centered and Smaller */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/logos/1.png"
            alt="Speak Click Send Robot"
            width={150}
            height={150}
            priority
            className="max-w-full h-auto"
          />
        </div>

        {/* Tagline - Centered under logo */}
        <h1 
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 max-w-4xl leading-tight"
          style={{
            background: `linear-gradient(90deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 50%, ${BRAND_BLUE} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Transform your single story into 10 platform formats instantly!
        </h1>

        {/* START Button - Large, Centered, Mobile-Friendly */}
        <div className="flex justify-center">
          <Link href="/dashboard/create">
            <button 
              className="px-16 py-6 rounded-2xl text-white font-bold text-2xl md:text-3xl transition-all hover:scale-105 shadow-xl min-w-[280px] md:min-w-[320px]"
              style={{
                background: `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`,
              }}
            >
              START
            </button>
          </Link>
        </div>

      </main>

      {/* Sign Up Modal */}
      {showSignUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: BRAND_PURPLE }}>
              Sign Up
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSignUp(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: BRAND_PURPLE }}
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
