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
      // Store selection and navigate
      localStorage.setItem('selectedDemographic', selectedDemographic)
      // Navigate to next step
    }
  }

  const selectedProfile = demographics.find(d => d.id === selectedDemographic)
  const hoveredData = demographics.find(d => d.id === hoveredProfile)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= 3 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 5 && <div className="w-8 h-0.5 bg-gray-300 ml-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Target Audience</h1>
          <p className="text-gray-600">Who is your story for?</p>
        </div>

        {/* Enhanced Demographics Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {demographics.map((profile) => (
            <div
              key={profile.id}
              className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedDemographic === profile.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={() => setSelectedDemographic(profile.id)}
              onMouseEnter={() => setHoveredProfile(profile.id)}
              onMouseLeave={() => setHoveredProfile(null)}
            >
              {/* Profile Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{profile.label}</h3>
                  <p className="text-sm text-gray-600 mb-2">{profile.description}</p>
                </div>
                {selectedDemographic === profile.id && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>

              {/* Key Traits */}
              <div className="flex flex-wrap gap-1 mb-3">
                {profile.keyTraits.slice(0, 3).map((trait, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                  >
                    {trait}
                  </span>
                ))}
              </div>

              {/* Travel Style Preview */}
              <p className="text-xs text-gray-500 italic">
                {profile.travelStyle.split(',')[0]}...
              </p>

              {/* Hover Tooltip */}
              {hoveredProfile === profile.id && (
                <div className="absolute z-10 top-full left-0 right-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-700">Motivation: </span>
                      <span className="text-xs text-gray-600">{profile.motivation}</span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-700">Platforms: </span>
                      <span className="text-xs text-gray-600">{profile.platforms.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-700">Budget: </span>
                      <span className="text-xs text-gray-600">{profile.budgetRange}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Selection Summary */}
        {selectedProfile && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-green-800 mb-2">Selected: {selectedProfile.label}</h3>
            <p className="text-sm text-green-700 mb-2">{selectedProfile.description}</p>
            <div className="text-xs text-green-600">
              <strong>Key Decision Factors:</strong> {selectedProfile.decisionFactors.join(', ')}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            disabled={!selectedDemographic}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              selectedDemographic
                ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white hover:from-purple-700 hover:to-orange-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next →
          </button>
        </div>

        {/* Educational Note */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 text-blue-600 mr-2">💡</div>
            <h4 className="font-medium text-blue-800">Why Generational Targeting Works Better</h4>
          </div>
          <p className="text-sm text-blue-700">
            Instead of basic age ranges, we use psychological profiles based on shared formative experiences. 
            This creates more accurate messaging that resonates with your audience's values and communication preferences.
          </p>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <Link href="/dashboard/create/photo" className="text-gray-500 hover:text-gray-700">
            ← Back to Photo
          </Link>
        </div>
      </div>
    </div>
  )
}
