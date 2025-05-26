'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function CreateStory() {
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    culturalIntegrity: false,
    selectedFormats: [] as string[]
  });

  const canGenerate = formData.culturalIntegrity && formData.selectedFormats.length > 0;

  const generateContent = async () => {
    setIsGenerating(true);
    
    // Simulate content generation (replace with real API call later)
    setTimeout(() => {
      const mockContent = {
        blogPost: "This is a generated blog post about your cultural story...",
        socialMedia: "🌟 Share your cultural story! #CulturalHeritage #Storytelling",
        email: "Subject: Your Cultural Story\n\nDear Reader,\n\nWe're excited to share this meaningful cultural narrative..."
      };
      setGeneratedContent(mockContent);
      setIsGenerating(false);
    }, 2000);
  };

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
              Cultural Story Multiplication Tool
            </h2>
            <p className="text-sm text-gray-600">
              Transform your cultural narrative into 10 different formats for maximum reach and revenue.
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Story Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Cultural Story
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                placeholder="Share your cultural story, tradition, or narrative that you want to transform into multiple content formats..."
              />
            </div>

            {/* Story Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cultural Origin
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Māori, Pacific Islander, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Category
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select category...</option>
                  <option value="tradition">Traditional Practice</option>
                  <option value="legend">Legend/Myth</option>
                  <option value="family">Family Story</option>
                  <option value="historical">Historical Event</option>
                  <option value="wisdom">Cultural Wisdom</option>
                  <option value="celebration">Celebration/Festival</option>
                </select>
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Female Travellers', 'Seniors', 'Health & Pampering', 'Business Travellers', 'Families', 'Cultural Interest', 'Adventure Seekers', 'Food & Wine Enthusiasts'].map((audience) => (
                  <label key={audience} className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">{audience}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Content Formats */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Content Formats to Generate (Choose up to 10)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'LinkedIn', 'Facebook', 'Blog', 'Instagram', 'Press Release', 'General Letter', 'Twitter',
                  'Board Report', 'Staff Meeting Agenda', 'Stakeholder PR Newsletter'
                ].map((format) => (
                  <label key={format} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.selectedFormats.includes(format)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, selectedFormats: [...formData.selectedFormats, format]});
                        } else {
                          setFormData({...formData, selectedFormats: formData.selectedFormats.filter(f => f !== format)});
                        }
                      }}
                    />
                    <span className="ml-2 text-sm text-gray-700">{format}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cultural Sensitivity */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Cultural Integrity Commitment</h3>
              <label className="flex items-start">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                  checked={formData.culturalIntegrity}
                  onChange={(e) => setFormData({...formData, culturalIntegrity: e.target.checked})}
                />
                <span className="ml-2 text-sm text-yellow-700">
                  I confirm that I have the right to share this cultural story and commit to maintaining its integrity and respect throughout all content adaptations.
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
              <button 
                onClick={generateContent}
                disabled={isGenerating || !canGenerate}
                className={`${isGenerating || !canGenerate ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white font-medium py-3 px-8 rounded-lg transition-colors`}
              >
                {isGenerating ? 'Generating...' : !canGenerate ? 'Complete Form First' : 'Generate Content Formats'}
              </button>
            </div>
          </div>
        </div>

        {/* Generated Content Results */}
        {generatedContent && (
          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Generated Content</h3>
            
            {/* Blog Post */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-semibold mb-2">Blog Post</h4>
              <p className="text-gray-700 mb-4">{generatedContent.blogPost}</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={() => navigator.clipboard.writeText(generatedContent.blogPost)}>
                Copy to Clipboard
              </button>
            </div>

            {/* Social Media */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-semibold mb-2">Social Media</h4>
              <p className="text-gray-700 mb-4">{generatedContent.socialMedia}</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={() => navigator.clipboard.writeText(generatedContent.socialMedia)}>
                Copy to Clipboard
              </button>
            </div>

            {/* Email */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="font-semibold mb-2">Email</h4>
              <p className="text-gray-700 mb-4 whitespace-pre-line">{generatedContent.email}</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={() => navigator.clipboard.writeText(generatedContent.email)}>
                Copy to Clipboard
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
