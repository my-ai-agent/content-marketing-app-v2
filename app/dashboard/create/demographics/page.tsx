'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getPlanLimits } from '../../../config/plans'

export default function Demographics() {
  const userPlan = 'free'
  const planLimits = getPlanLimits(userPlan)
  const maxDemographics = planLimits.demographics

  const [selectedDemographic, setSelectedDemographic] = useState('')
  const [story, setStory] = useState('')

  useEffect(() => {
    const savedStory = localStorage.getItem('currentStory')
    if (savedStory) setStory(savedStory)
  }, [])

  const allDemographics = [
    'Female Travellers', 'Families', 'Young Adults (18-35)', 'Business Travellers', 'Solo Travellers', 'Seniors (55+)' 
  ]

  const handleNext = () => {
    if (!selectedDemographic) {
      alert('Please select a demographic before continuing.')
      return
    }
    localStorage.setItem('selectedDemographics', JSON.stringify([selectedDemographic]))
    window.location.href = '/dashboard/create/interests'
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-md w-full mx-auto p-4 flex-1 flex flex-col justify-center">
        <h1 className="text-xl font-bold mb-4 text-center">Step 2: Target Audience</h1>
        <label htmlFor="demographic" className="block text-sm font-medium text-gray-700 mb-2">
          Select a Demographic
        </label>
        <select
          id="demographic"
          className="w-full rounded-lg border border-gray-300 p-3 text-base mb-4"
          value={selectedDemographic}
          onChange={e => setSelectedDemographic(e.target.value)}
        >
          <option value="">Choose one...</option>
          {allDemographics.map(demo => (
            <option key={demo} value={demo}>{demo}</option>
          ))}
        </select>
        <button
          onClick={handleNext}
          disabled={!selectedDemographic}
          className={`w-full py-3 rounded-lg text-white font-bold transition ${
            selectedDemographic
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Next: Interests →
        </button>
        <p className="mt-6 text-xs text-gray-500 text-center">
          {story && `Preview: ${story.substring(0, 60)}...`}
        </p>
      </div>
    </main>
  )
}
