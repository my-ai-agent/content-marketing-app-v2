'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getPlanLimits } from '../../../config/plans'

export default function Formats() {
  const userPlan = 'free'
  const planLimits = getPlanLimits(userPlan)
  const maxFormats = planLimits.platforms

  const [selectedFormat, setSelectedFormat] = useState('')
  const [selectedSocialPlatform, setSelectedSocialPlatform] = useState('')
  const [story, setStory] = useState('')
  const [demographic, setDemographic] = useState('')
  const [interest, setInterest] = useState('')

  useEffect(() => {
    setStory(localStorage.getItem('currentStory') || '')
    const demoArr = JSON.parse(localStorage.getItem('selectedDemographics') || '[]')
    const interestArr = JSON.parse(localStorage.getItem('selectedInterests') || '[]')
    setDemographic(demoArr[0] || '')
    setInterest(interestArr[0] || '')
  }, [])

  const formatOptions = [
    'Social Media Posts', 'Blog Article', 'Video Script', 'Website Copy', 'Email Newsletter', 'Press Release', 'Podcast Episode Outline'
  ]
  const socialPlatforms = ['Instagram', 'Facebook', 'Twitter', 'LinkedIn']

  const handleGenerate = () => {
    if (!selectedFormat) {
      alert('Please select a content format.')
      return
    }
    if (selectedFormat === 'Social Media Posts' && !selectedSocialPlatform) {
      alert('Please select a social media platform.')
      return
    }
    localStorage.setItem('selectedFormats', JSON.stringify([selectedFormat]))
    localStorage.setItem('selectedSocialPlatforms', JSON.stringify([selectedSocialPlatform]))
    window.location.href = '/dashboard/create/results'
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-md w-full mx-auto p-4 flex-1 flex flex-col justify-center">
        <h1 className="text-xl font-bold mb-4 text-center">Step 4: Content Format</h1>
        <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-2">
          Select a Content Format
        </label>
        <select
          id="format"
          className="w-full rounded-lg border border-gray-300 p-3 text-base mb-4"
          value={selectedFormat}
          onChange={e => setSelectedFormat(e.target.value)}
        >
          <option value="">Choose one...</option>
          {formatOptions.map(format => (
            <option key={format} value={format}>{format}</option>
          ))}
        </select>

        {selectedFormat === 'Social Media Posts' && (
          <>
            <label htmlFor="social" className="block text-sm font-medium text-gray-700 mb-2">
              Select a Social Platform
            </label>
            <select
              id="social"
              className="w-full rounded-lg border border-gray-300 p-3 text-base mb-4"
              value={selectedSocialPlatform}
              onChange={e => setSelectedSocialPlatform(e.target.value)}
            >
              <option value="">Choose one...</option>
              {socialPlatforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </>
        )}

        <button
          onClick={handleGenerate}
          disabled={!selectedFormat || (selectedFormat === 'Social Media Posts' && !selectedSocialPlatform)}
          className={`w-full py-3 rounded-lg text-white font-bold transition ${
            selectedFormat && (selectedFormat !== 'Social Media Posts' || selectedSocialPlatform)
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Generate Content
        </button>
        <div className="mt-6 text-xs text-gray-500 text-center">
          {story && `Story Preview: ${story.substring(0, 50)}...`}<br />
          {demographic && `Demographic: ${demographic}`}<br />
          {interest && `Interest: ${interest}`}
        </div>
      </div>
    </main>
  )
}
