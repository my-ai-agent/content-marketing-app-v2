'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function CreateStory() {
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedSocialPlatforms, setSelectedSocialPlatforms] = useState<string[]>([]);
  // Optional: controlled form state for better practice (not strictly required for syntax, but prevents React warnings)
  const [story, setStory] = useState('');
  const [origin, setOrigin] = useState('');
  const [category, setCategory] = useState('');
  const [targetAudiences, setTargetAudiences] = useState<string[]>([]);
  const [integrityChecked, setIntegrityChecked] = useState(false);

  const currentPlan = 'free'; // This would come from user settings
  const planLimits = {
    free: { platforms: 3 },
    basic: { platforms: 3 }, 
    professional: { platforms: 5 },
    enterprise: { platforms: 7 }
  };
  const maxPlatforms = planLimits[currentPlan as keyof typeof planLimits].platforms;

  // All possible values
  const audienceOptions = [
    'Female Travellers', 'Seniors', 'Health & Pampering', 'Business Travellers',
    'Families', 'Cultural Interest', 'Adventure Seekers', 'Food & Wine Enthusiasts'
  ];

  const formatOptions = [
    'Social Media Posts', 'Blog Article', 'Video Script', 'Website Copy',
    'Email Newsletter', 'Press Release', 'Podcast Episode Outline'
  ];

  const socialPlatforms = ['Instagram', 'Facebook', 'Twitter', 'LinkedIn'];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Story</h1>
            <div className="flex space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Story Multiplication Tool
            </h2>
            <p className="text-sm text-gray-600">
              Transform your narrative into 7 different formats for maximum reach and revenue.
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Story Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Story
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                placeholder="Share your story, tradition, or narrative that you want to transform into multiple content formats..."
                value={story}
                onChange={e => setStory(e.target.value)}
              />
            </div>
            
            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {audienceOptions.map((audience) => (
                  <label key={audience} className="flex items-center">
                    <input
                      type="checkbox"
                      name="targetAudience"
                      value={audience}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={targetAudiences.includes(audience)}
                      onChange={e => {
                        if (e.target.checked) {
                          setTargetAudiences([...targetAudiences, audience]);
                        } else {
                          setTargetAudiences(targetAudiences.filter(a => a !== audience));
                        }
                      }}
                    />
                    <span className="ml-2 text-sm text-gray-700">{audience}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Content Formats */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Content Formats to Generate (Choose up to 7)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {formatOptions.map((format) => (
                  <label key={format} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <input 
                      type="checkbox" 
                      name="contentFormats"
                      value={format}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedFormats.includes(format)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFormats([...selectedFormats, format]);
                        } else {
                          setSelectedFormats(selectedFormats.filter(f => f !== format));
                          if (format === 'Social Media Posts') {
                            setSelectedSocialPlatforms([]);
                          }
                        }
                      }}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {format === 'Social Media Posts' ? (
                        <span className="group relative">
                          Social Media Posts 
                          <span className="ml-2 text-blue-500 text-base font-semibold">⬇️</span>
                          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                            Check this to select specific platforms below
                          </div>
                        </span>
                      ) : (
                        format
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Social Media Platform Selection */}
            {selectedFormats.includes('Social Media Posts') && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Select Social Media Platforms</h4>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">
                    Platforms selected: {selectedSocialPlatforms.length}/{maxPlatforms}
                  </span>
                  {selectedSocialPlatforms.length >= maxPlatforms && (
                    <span className="text-xs text-orange-600 font-medium">
                      Upgrade to select more platforms
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {socialPlatforms.map((platform) => (
                    <label key={platform} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        name="socialPlatforms"
                        value={platform}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        checked={selectedSocialPlatforms.includes(platform)}
                        disabled={selectedSocialPlatforms.length >= maxPlatforms && !selectedSocialPlatforms.includes(platform)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSocialPlatforms([...selectedSocialPlatforms, platform]);
                          } else {
                            setSelectedSocialPlatforms(selectedSocialPlatforms.filter(p => p !== platform));
                          }
                        }}
                      />
                      <span className="ml-2 text-sm text-gray-700">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Cultural Sensitivity */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Cultural Integrity Commitment</h3>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                  checked={integrityChecked}
                  onChange={e => setIntegrityChecked(e.target.checked)}
                />
                <span className="ml-2 text-sm text-yellow-700">
                  I will only share approved cultural stories and I commit to maintaining its integrity throughout all content adaptations.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <Link
                href="/dashboard"
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Save Draft
              </Link>
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors">
                Generate Content Formats
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
