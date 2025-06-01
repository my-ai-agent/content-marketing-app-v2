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
    <main className="min-h-screen flex flex-col justify-center items-center bg-white px-4">
      {/* Logo Centered */}
      <div className="flex flex-col items-center mt-12 mb-8">
        <Image
          src="/logo.png"
          alt="Speak Click Send"
          width={160}
          height={160}
          priority
        />
        {/* Tagline */}
        <h2
          className="font-bold text-center mt-6 text-2xl sm:text-3xl"
          style={{
            background: `linear-gradient(90deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 50%, ${BRAND_BLUE} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Transform your single story into 10 platform formats instantly!
        </h2>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col items-center gap-6 w-full max-w-xs">
        <button
          className="w-full text-xl font-bold py-4 rounded-2xl shadow-none transition bg-gradient-to-r from-[#6B2EFF] to-[#FF7B1C] hover:opacity-90 text-white"
          onClick={() => window.location.href = '/dashboard/create'}
        >
          START
        </button>
        <button
          className="w-full border-none bg-[#6B2EFF] text-white text-lg font-medium py-3 rounded-xl transition hover:bg-[#5730bf]"
          onClick={() => setShowSignUp(true)}
        >
          Sign Up
        </button>
      </div>

      {/* Sign Up Modal */}
      {showSignUp && (
        <SignUpModal onClose={() => setShowSignUp(false)} />
      )}
    </main>
  )
}

function SignUpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-lg flex flex-col items-center">
        <h3 className="text-2xl font-bold mb-4 text-[#6B2EFF]">Sign Up</h3>
        <form
          className="w-full flex flex-col gap-4"
          onSubmit={e => {
            e.preventDefault()
            // handle submission here
            onClose()
          }}
        >
          <input
            type="text"
            name="name"
            required
            placeholder="Full Name"
            className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6B2EFF] text-lg"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6B2EFF] text-lg"
          />
          <button
            type="submit"
            className="w-full bg-[#6B2EFF] text-white font-semibold py-3 rounded-xl text-lg hover:bg-[#5730bf] transition"
          >
            Create Account
          </button>
        </form>
        <button
          className="mt-4 text-[#6B2EFF] underline text-sm"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
