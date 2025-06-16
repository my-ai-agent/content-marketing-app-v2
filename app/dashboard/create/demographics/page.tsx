'use client'

import Link from 'next/link'
import { useState } from 'react'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

// Enhanced demographic interface
interface DemographicProfile {
  id: string
  label: string
  description: string
  travelStyle: string
  platforms: string[]
  motivation: string
  keyTraits: string[]
  budgetRange: string
  decisionFactors: string[]
}

// Rich generational psychology data
const demographics: DemographicProfile[] = [
  {
    id: 'gen-z',
    label: 'Gen Z (1997-2012)',
    description: 'Digital natives prioritizing authenticity & sustainability',
    travelStyle: 'Solo adventures, eco-tourism, Instagram-worthy experiences',
    platforms: ['TikTok', 'Instagram', 'Snapchat'],
    motivation: 'Self-discovery and social impact',
    keyTraits: ['Mobile-first', 'Authentic', 'Sustainable', 'Visual'],
    budgetRange: 'Budget-conscious, value-seeking',
    decisionFactors: ['Social proof', 'Sustainability', 'Authenticity', 'Visual appeal']
  },
  {
    id: 'millennials',
    label: 'Millennials (1981-1996)', 
    description: 'Experience-focused, digitally savvy, authenticity-seeking',
    travelStyle: 'Cultural immersion, food tourism, unique experiences',
    platforms: ['Instagram', 'Facebook', 'YouTube'],
    motivation: 'Authentic experiences and personal growth',
    keyTraits: ['Experience-driven', 'Research-heavy', 'Social', 'Quality-focused'],
    budgetRange: 'Mid-range, experience over luxury',
    decisionFactors: ['Reviews', 'Authenticity', 'Value', 'Social sharing potential']
  },
  {
    id: 'gen-x',
    label: 'Gen X (1965-1980)',
    description: 'Family-focused, practical, value-conscious decision makers',
    travelStyle: 'Family adventures, educational travel, multi-generational trips',
    platforms: ['Facebook', 'Email', 'Google Search'],
    motivation: 'Family bonding and practical benefits',
    keyTraits: ['Family-oriented', 'Practical', 'Value-conscious', 'Thorough'],
    budgetRange: 'Value-focused, quality for family',
    decisionFactors: ['Safety', 'Value', 'Family-friendly', 'Convenience']
  },
  {
    id: 'boomers',
    label: 'Baby Boomers (1946-1964)',
    description: 'Comfort-seeking, knowledge-focused, service-oriented',
    travelStyle: 'Luxury experiences, guided tours, cultural enrichment',
    platforms: ['Email', 'Facebook', 'Traditional websites'],
    motivation: 'Cultural enrichment and comfort',
    keyTraits: ['Comfort-focused', 'Service-oriented', 'Traditional', 'Knowledge-seeking'],
    budgetRange: 'Premium, comfort and service focused',
    decisionFactors: ['Comfort', 'Service quality', 'Reputation', 'Expert guidance']
  },
  {
    id: 'families',
    label: 'Multi-Generational Families',
    description: 'Mixed-age groups with diverse needs and preferences',
    travelStyle: 'Inclusive activities, varied accommodation, flexible itineraries',
    platforms: ['Facebook', 'WhatsApp', 'Email'],
    motivation: 'Creating shared memories across generations',
    keyTraits: ['Inclusive', 'Flexible', 'Diverse needs', 'Memory-focused'],
    budgetRange: 'Varied, depending on group composition',
    decisionFactors: ['Inclusivity', 'Flexibility', 'Group appeal', 'Accessibility']
  },
  {
    id: 'business',
    label: 'Business & Corporate Travellers',
    description: 'Professional travelers seeking efficiency and networking',
    travelStyle: 'Premium accommodations, efficient transport, networking events',
    platforms: ['LinkedIn', 'Email', 'Professional networks'],
    motivation: 'Professional development and business success',
    keyTraits: ['Efficiency-focused', 'Professional', 'Time-conscious', 'ROI-driven'],
    budgetRange: 'Premium, ROI-justified expenses',
    decisionFactors: ['Efficiency', 'Professional value', 'Networking opportunities', 'ROI']
  }
]

export default function Demographics() {
  const [selectedDemographic, setSelectedDemographic] = useState<string>('')
  const [hoveredProfile, setHoveredProfile] = useState<string | null>(null)

  const handleNext = () => {
    if (selectedDemographic) {
      localStorage.setItem('selectedDemographic', selectedDemographic)
      window.location.href = '/dashboard/create/interests'
    }
  }

  const selectedProfile = demographics.find(d => d.id === selectedDemographic)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                  step <= 3 
                    ? 'bg-green-500 text-white border-green-500' 
                    : step === 4 
                    ? 'bg-gray-600 text-white border-gray-600' 
                    : 'bg-gray-200 text-gray-400 border-gray-200'
                }`}>
                  {step}
                </div>
                {index < 4 && <div className="w-8 h-0.5 bg-gray-300 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Target Audience</h1>
          <p className="text-xl text-gray-600">Who is your story for?</p>
        </div>

        {/* Enhanced Demographics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {demographics.map((profile) => (
            <div
              key={profile.id}
              className={`relative bg-white rounded-xl p-6 border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedDemographic === profile.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedDemographic(profile.id)}
              onMouseEnter={() => setHoveredProfile(profile.id)}
              onMouseLeave={() => setHoveredProfile(null)}
            >
              {/* Profile Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{profile.label}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{profile.description}</p>
                </div>
                {selectedDemographic === profile.id && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>

              {/* Key Traits */}
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.keyTraits.map((trait, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                  >
                    {trait}
                  </span>
                ))}
              </div>

              {/* Travel Style Preview */}
              <div className="border-t border-gray-100 pt-3">
                <p className="text-sm text-gray-500 italic">
                  <span className="font-medium">Travel Style:</span> {profile.travelStyle.split(',')[0]}...
                </p>
              </div>

              {/* Hover Tooltip */}
              {hoveredProfile === profile.id && (
                <div className="absolute z-20 top-full left-0 right-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-xl">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Motivation: </span>
                      <span className="text-sm text-gray-600">{profile.motivation}</span>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Top Platforms: </span>
                      <span className="text-sm text-gray-600">{profile.platforms.slice(0, 2).join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Budget Style: </span>
                      <span className="text-sm text-gray-600">{profile.budgetRange}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Selection Summary */}
        {selectedProfile && (
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Selected: {selectedProfile.label}
                </h3>
                <p className="text-green-700 mb-3">{selectedProfile.description}</p>
                <div className="text-sm text-green-600">
                  <strong>Key Decision Factors:</strong> {selectedProfile.decisionFactors.slice(0, 3).join(', ')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reminder */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-center">
          <p className="text-blue-700 text-sm">
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Select one target audience for the most effective messaging
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleNext}
            disabled={!selectedDemographic}
            className={`px-8 py-4 rounded-lg font-medium text-lg transition-all ${
              selectedDemographic
                ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white hover:from-purple-700 hover:to-orange-600 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next →
          </button>
        </div>

        {/* Educational Note */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="text-2xl mr-3">💡</div>
            <div>
              <h4 className="font-bold text-purple-800 text-lg mb-2">Why Generational Targeting Works Better</h4>
              <p className="text-purple-700 leading-relaxed">
                Instead of basic age ranges, we use psychological profiles based on shared formative experiences. 
                This creates more accurate messaging that resonates with your audience's values and communication preferences.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Link 
            href="/dashboard/create/photo" 
            className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Photo
          </Link>
        </div>
      </div>
    </div>
  )
}
