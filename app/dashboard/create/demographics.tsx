'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Demographics() {
  const [selectedDemographics, setSelectedDemographics] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [story, setStory] = useState('');

  // Plan limits
  const currentPlan = 'free';
  const planLimits = {
    free: { demographics: 3, interests: 3 },
basic: { demographics: 3, interests: 3 },
professional: { demographics: 3, interests: 3 },
enterprise: { demographics: 6, interests: 6 }
  };
  const maxDemographics = planLimits[currentPlan as keyof typeof planLimits].demographics;
  const maxInterests = planLimits[currentPlan as keyof typeof planLimits].interests;

  // Load story from previous page
  useEffect(() => {
    const savedStory = localStorage.getItem('currentStory');
    if (savedStory) {
      setStory(savedStory);
    }
  }, []);

  const handleNext = () => {
    if (selectedDemographics.length > 0 && selectedInterests.length > 0) {
      // Save selections
      localStorage.setItem('selectedDemographics', JSON.stringify(selectedDemographics));
      localStorage.setItem('selectedInterests', JSON.stringify(selectedInterests));
      // Navigate to formats page
      window.location.href = '/dashboard/create/formats';
    } else {
      alert('Please select at least one demographic and one interest before continuing.');
    }
  };

  const handleBack = () => {
    window.location.href = '/dashboard/create';
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Step 2: Target Audience</h1>
          <Link
            href="/dashboard"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto px-4 mb-6">
        <div className="flex items-center">
          <div className="flex-1 bg-blue-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full w-2/3"></div>
          </div>
          <span className="ml-3 text-sm text-gray-600">Step 2 of 3</span>
        </div>
      </div>

      {/* Story Preview */}
      <div className="max-w-2xl mx-auto px-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Your Story Preview:</h3>
          <p className="text-sm text-blue-700 line-clamp-3">
            {story.substring(0, 150)}...
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white shadow rounded-lg p-6 space-y-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
  <img src="/logos/3.png" alt="Click" className="h-16 w-auto" />
</div>
<h2 className="text-lg font-medium text-gray-900 mb-2 text-center">
  Who Is Your Target Audience?
</h2>
            <p className="text-sm text-gray-600">
              Select demographics and interests to help us tailor your content for maximum engagement.
            </p>
          </div>

          {/* Demographics Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Demographics (Select up to {maxDemographics})
            </label>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">
                Selected: {selectedDemographics.length}/{maxDemographics}
              </span>
              {selectedDemographics.length >= maxDemographics && (
                <span className="text-xs text-orange-600 font-medium px-2 py-1 bg-orange-50 rounded">
                  Upgrade for more options
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3">
              {['Female Travellers', 'Families', 'Young Adults (18-35)', 'Business Travellers', 'Solo Travellers', 'Seniors (55+)'].map((demo) => (
                <label key={demo} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedDemographics.includes(demo)}
                    disabled={selectedDemographics.length >= maxDemographics && !selectedDemographics.includes(demo)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDemographics([...selectedDemographics, demo]);
                      } else {
                        setSelectedDemographics(selectedDemographics.filter(d => d !== demo));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="ml-3 text-sm text-gray-700 font-medium">{demo}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Interests Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Interests (Select up to {maxInterests})
            </label>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">
                Selected: {selectedInterests.length}/{maxInterests}
              </span>
              {selectedInterests.length >= maxInterests && (
                <span className="text-xs text-orange-600 font-medium px-2 py-1 bg-orange-50 rounded">
                  Upgrade for more options
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3">
              {['Cultural Experiences', 'Adventure & Outdoor Activities', 'Food & Wine', 'Relaxation & Wellness', 'History & Heritage', 'Photography & Social Media'].map((interest) => (
                <label key={interest} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedInterests.includes(interest)}
                    disabled={selectedInterests.length >= maxInterests && !selectedInterests.includes(interest)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedInterests([...selectedInterests, interest]);
                      } else {
                        setSelectedInterests(selectedInterests.filter(i => i !== interest));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="ml-3 text-sm text-gray-700 font-medium">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Plan Upgrade Prompt */}
          {(selectedDemographics.length >= maxDemographics || selectedInterests.length >= maxInterests) && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">🚀 Want More Options?</h3>
              <p className="text-sm text-blue-700 mb-3">
                Upgrade to Professional plan to select up to 5 demographics and 5 interests for more targeted content.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                **FREE PLAN** → Upgrade
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button
              onClick={handleBack}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              ← Back: Story
            </button>
            <button
              onClick={handleNext}
              disabled={selectedDemographics.length === 0 || selectedInterests.length === 0}
              className={`font-medium py-3 px-8 rounded-lg transition-colors ${
                selectedDemographics.length > 0 && selectedInterests.length > 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next: Formats →
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6 mb-4">
          **Speak Click Send** is another **CCC Marketing Pro™ Saas 2025**
        </p>
      </div>
    </main>
  )
}
