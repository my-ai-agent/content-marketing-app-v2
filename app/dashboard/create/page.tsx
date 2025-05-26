import Link from 'next/link'
'use client'
import { useState } from 'react'
export default function CreateStory() {
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
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
              Transform your cultural narrative into 12 different formats for maximum reach and revenue.
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
                {['Children', 'Youth', 'Adults', 'Elders', 'Educators', 'Tourists', 'Local Community', 'Global Audience'].map((audience) => (
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
                Select Content Formats to Generate (Choose up to 12)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'Blog Post', 'Social Media Series', 'Children\'s Book', 'Documentary Script',
                  'Podcast Episodes', 'Workshop Curriculum', 'Art Installation', 'Mobile App',
                  'Board Game', 'Theatrical Performance', 'Digital Experience', 'Educational Video'
                ].map((format) => (
                  <label key={format} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">{format}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cultural Sensitivity */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Cultural Integrity Commitment</h3>
              <label className="flex items-start">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1" />
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
  disabled={isGenerating}
  className={`${isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white font-medium py-3 px-8 rounded-lg transition-colors`}
>
  {isGenerating ? 'Generating...' : 'Generate Content Formats'}
</button>
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
          </div>
        </div>
      </div>
    </main>
  )
}
