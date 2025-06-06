'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

export default function Home() {
  const [showSignUp, setShowSignUp] = useState(false)

  return (
    <main className="relative w-screen min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* Top-right Log-In/Sign-Up Button */}
      <div className="absolute top-6 right-6 z-30">
        <button
          onClick={() => setShowSignUp(true)}
          className="px-6 py-2 rounded-lg font-medium text-white text-base transition-all hover:opacity-90 bg-brand-purple shadow"
        >
          Log-In
        </button>
      </div>

      {/* Central Content */}
      <div className="flex-1 flex flex-col justify-center items-center w-full px-4 py-8">
        {/* Logo */}
        <Image
          src="/logos/1.png"
          alt="Speak Click Send"
          width={160}
          height={160}
          className="mb-8"
          priority
        />
        {/* Tagline */}
        <div className="text-center mb-12 w-full max-w-2xl">
          <h1
            className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight"
            style={{
              background: `linear-gradient(90deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 50%, ${BRAND_BLUE} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Transform Your Single Story into 10 Different Platform Formats Instantly!
          </h1>
        </div>
        {/* START Button */}
        <Link href="/dashboard/create" className="block w-full max-w-xs">
          <button
            className="w-full py-4 rounded-2xl text-white font-bold text-xl transition-all hover:scale-105 active:scale-95 shadow-lg bg-gradient-to-r from-brand-purple to-brand-orange"
            style={{ minHeight: '60px' }}
          >
            START
          </button>
        </Link>
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
    </main>
  )
}
