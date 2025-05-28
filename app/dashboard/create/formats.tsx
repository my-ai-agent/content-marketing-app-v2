'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Formats() {
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedSocialPlatforms, setSelectedSocialPlatforms] = useState<string[]>([]);
  const [story, setStory] = useState('');
  const [demographics, setDemographics] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  // Plan limits
  const currentPlan = 'free';
  const planLimits = {
    free: { platforms: 2, formats: 7 },
    basic: { platforms: 5, formats: 7 }, 
    professional: { platforms: 5, formats: 7 },
    enterprise: { platforms: 10, formats: 7 }
  };
  const maxPlatforms = planLimits[currentPlan as keyof typeof planLimits].platforms;
  const maxFormats = planLimits[currentPlan as keyof typeof planLimits].formats;

  const formatOptions = [
    { name: 'Social Media Posts', icon: '📱', desc: 'Instagram, Facebook, Twitter, LinkedIn' },
    { name: 'Blog Article', icon: '📝', desc: 'SEO-optimized long-form content' },
    { name: 'Video Script', icon: '🎥', desc: 'YouTube, TikTok, or promotional videos' },
    { name: 'Website Copy', icon: '🌐', desc: 'Homepage, about page, or landing page' },
    { name: 'Email Newsletter', icon: '📧', desc: 'Engaging email campaigns' },
    { name: 'Press Release', icon: '📰', desc: 'Professional media announcements' },
    { name: 'Podcast Episode Outline', icon: '🎙️', desc: 'Structured podcast content' }
  ];

  const socialPlatforms = [
    { name: 'Instagram', icon: '📷', color: 'bg-pink-100 text-pink-800' },
    { name: 'Facebook', icon: '👥', color: 'bg-blue-100 text-blue-800' },
    { name: 'Twitter', icon: '🐦', color: 'bg-sky-100 text-sky-800' },
    { name: 'LinkedIn', icon: '💼', color: 'bg-indigo-100 text-indigo-800' }
  ];

  // Load data from previous pages
  useEffect(() => {
    const savedStory = localStorage.getItem('currentStory');
    const savedDemographics = localStorage.getItem('selectedDemographics');
    const savedInterests = localStorage.getItem('selectedInterests');
    
    if (savedStory) setStory(savedStory);
    if (savedDemographics) setDemographics(JSON.parse(savedDemographics));
    if (savedInterests) setInterests(JSON.parse(savedInterests));
  }, []);

  const handleGenerate = () => {
    if (selectedFormats.length === 0) {
      alert('Please select at least one content format.');
      return;
    }
    
    if (selectedFormats.includes('Social Media Posts') && selectedSocialPlatforms.length === 0) {
      alert('Please select at least one social media platform.');
      return;
    }

    // Save all selections
    localStorage.setItem('selectedFormats', JSON.stringify(selectedFormats));
    localStorage.setItem('selectedSocialPlatforms', JSON.stringify(selectedSocialPlatforms));
    
    // Navigate to results page
    window.location.href = '/dashboard/create/results';
  };

  const handleBack = () => {
    window.location.href = '/dashboard/create/demographics';
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Step 3: Content Formats</h1>
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
            <div className="bg-blue-600 h-2 rounded-full w-full"></div>
          </div>
          <span className="ml-3 text-sm text-gray-600">Step 3 of 3</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="max-w-2xl mx-auto px-4 mb-6 space-y-3">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center">
            <span className="text-green-600 font-medium text-sm">✓ Story:</span>
            <span className="ml-2 text-green-700 text-sm truncate">{story.substring(0, 60)}...</span>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center">
            <span className="text-green-600 font-medium text-sm">✓ Audience:</span>
            <span className="ml-2 text-green-700 text-sm">
              {demographics.slice(0, 2).join(', ')}{demographics.length > 2 && ` +${demographics.length - 2} more`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
  <img src="/logos/3.png" alt="Click" className="h-16 w-auto" />
</div>
<h2 className="text-lg font-medium text-gray-900 mb-2 text-center">
  Choose Your Content Formats
</h2>
            <p className="text-sm text-gray-600">
              Select up to {maxFormats} formats to multiply your story across different platforms and audiences.
            </p>
          </div>

          {/* Content Formats Selection */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-700">
                Content Formats ({selectedFormats.length}/{maxFormats})
              </h3>
              {selectedFormats.length >= maxFormats && (
                <span className="text-xs text-orange-600 font-medium px-2 py-1 bg-orange-50 rounded">
                  Maximum reached
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {formatOptions.map((format) => (
                <label key={format.name} className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedFormats.includes(format.name)}
                    disabled={selectedFormats.length >= maxFormats && !selectedFormats.includes(format.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFormats([...selectedFormats, format.name]);
                      } else {
                        setSelectedFormats(selectedFormats.filter(f => f !== format.name));
                        if (format.name === 'Social Media Posts') {
                          setSelectedSocialPlatforms([]);
                        }
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1" 
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{format.icon}</span>
                      <span className="text-sm font-medium text-gray-900">{format.name}</span>
                      {format.name === 'Social Media Posts' && selectedFormats.includes(format.name) && (
                        <span className="ml-2 text-blue-500 text-xs">→ Select platforms below</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{format.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Social Media Platform Selection */}
          {selectedFormats.includes('Social Media Posts') && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-700">
                  Social Media Platforms ({selectedSocialPlatforms.length}/{maxPlatforms})
                </h3>
                {selectedSocialPlatforms.length >= maxPlatforms && (
                  <span className="text-xs text-orange-600 font-medium px-2 py-1 bg-orange-50 rounded">
                    Upgrade for more platforms
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {socialPlatforms.map((platform) => (
                  <label key={platform.name} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedSocialPlatforms.includes(platform.name)}
                      disabled={selectedSocialPlatforms.length >= maxPlatforms && !selectedSocialPlatforms.includes(platform.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSocialPlatforms([...selectedSocialPlatforms, platform.name]);
                        } else {
                          setSelectedSocialPlatforms(selectedSocialPlatforms.filter(p => p !== platform.name));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <div className="ml-3 flex items-center">
                      <span className="text-lg mr-2">{platform.icon}</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${platform.color}`}>
                        {platform.name}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Generation Preview */}
          {selectedFormats.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-blue-800 mb-2">🚀 Ready to Generate:</h3>
              <div className="text-sm text-blue-700">
                <p className="mb-1">✓ {selectedFormats.length} content format{selectedFormats.length > 1 ? 's' : ''}</p>
                {selectedSocialPlatforms.length > 0 && (
                  <p className="mb-1">✓ {selectedSocialPlatforms.length} social platform{selectedSocialPlatforms.length > 1 ? 's' : ''}</p>
                )}
                <p>✓ Targeting {demographics.length} demographic{demographics.length > 1 ? 's' : ''} + {interests.length} interest{interests.length > 1 ? 's' : ''}</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button
              onClick={handleBack}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              ← Back: Audience
            </button>
            <button
              onClick={handleGenerate}
              disabled={selectedFormats.length === 0}
              className={`font-medium py-3 px-8 rounded-lg transition-colors ${
                selectedFormats.length > 0
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              🚀 Generate Content
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
