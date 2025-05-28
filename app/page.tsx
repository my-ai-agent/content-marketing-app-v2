'use client'
// Force redeploy to include settings page
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">CCC-Content Marketing Pro™</h1>
            <Link 
              href="/dashboard/settings"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Story Multiplication Tool
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Speak Click Send transforms one story into 10 different platform formats in an instant!
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Story Transformation</h3>
            <p className="text-gray-600">
              Transform your story narratives into content suitable for various media platforms and formats.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Cultural Integrity</h3>
            <p className="text-gray-600">
              Be genuine and respect cultural values as you grow your audience.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Revenue Generation</h3>
            <p className="text-gray-600">
              Create multiple income streams from a single story
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to multiply your stories?
          </h3>
          <Link 
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg px-8 py-3 rounded-lg transition-colors inline-block"
          >
            Get Started
          </Link>
        </div>
        <p className="text-center text-gray-600 mt-8">**Speak Click Send** is another CCC Marketing Pro™ Tourism Saas</p>
      </div>
    </main>
  )
}
