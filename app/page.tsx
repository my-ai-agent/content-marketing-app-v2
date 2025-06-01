'use client'

import { useState } from 'react'
import Image from 'next/image'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

export default function Home() {
  const [showSignUp, setShowSignUp] = useState(false)

  return (
    <main className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-xl flex flex-col items-center justify-center px-4">
        {/* Large Centered Logo */}
        <Image
          src="/logo.png"
          alt="Speak Click Send"
          width={220}
          height={220}
          priority
          className="mb-8"
        />
        {/* Prominent Tagline */}
        <h2
          className="font-bold text-center mb-12 text-2xl sm:text-3xl md:text-4xl leading-snug"
          style={{
            background: `linear-gradient(90deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 50%, ${BRAND_BLUE} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Transform your single story into 10 platform formats instantly!
        </h2>
        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-6 w-full">
          <button
            className="w-full text-2xl font-bold py-5 rounded-2xl shadow-none transition bg-gradient-to-r from-brand-purple to-brand-orange hover:opacity-90 text-white mb-2"
            onClick={() => window.location.href = '/dashboard/create'}
          >
            START
          </button>
          <button
            className="w-full border-none bg-brand-purple text-white text-lg font-medium py-3 rounded-xl transition hover:bg-[#5730bf]"
            onClick={() => setShowSignUp(true)}
          >
            Sign Up
          </button>
        </div>
        {/* Sign Up Modal */}
        {showSignUp && (
          <SignUpModal onClose={() => setShowSignUp(false)} />
        )}
      </div>
    </main>
  )
}

function SignUpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-lg flex flex-col items-center">
        <h3 className="text-2xl font-bold mb-4 text-brand-purple">Sign Up</h3>
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
            className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple text-lg"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple text-lg"
          />
          <button
            type="submit"
            className="w-full bg-brand-purple text-white font-semibold py-3 rounded-xl text-lg hover:bg-[#5730bf] transition"
          >
            Create Account
          </button>
        </form>
        <button
          className="mt-4 text-brand-purple underline text-sm"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
