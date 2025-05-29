'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Interests() {
  const [selectedInterest, setSelectedInterest] = useState('')

  const allInterests = [
    'Cultural Experiences', 'Adventure & Outdoor Activities', 'Food & Wine', 'Relaxation & Wellness', 'History & Heritage', 'Photography & Social Media'
  ]

  const handleNext = () => {
    if (!selectedInterest) {
      alert('Please select an interest before continuing.')
      return
    }
    localStorage.setItem('selectedInterests', JSON.stringify([selectedInterest]))
    window.location.href = '/dashboard/create/formats'
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-md w-full mx-auto p-4 flex-1 flex flex-col justify-center">
        <h1 className="text-xl font-bold mb-4 text-center">Step 3: Audience Interest</h1>
        <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-2">
          Select an Interest
        </label>
        <select
          id="interest"
          className="w-full rounded-lg border border-gray-300 p-3 text-base mb-4"
          value={selectedInterest}
          onChange={e => setSelectedInterest(e.target.value)}
        >
          <option value="">Choose one...</option>
          {allInterests.map(interest => (
            <option key={interest} value={interest}>{interest}</option>
          ))}
        </select>
        <button
          onClick={handleNext}
          disabled={!selectedInterest}
          className={`w-full py-3 rounded-lg text-white font-bold transition ${
            selectedInterest
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Next: Formats →
        </button>
      </div>
    </main>
  )
}
