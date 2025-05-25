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
            <h1 className="text-2xl font-bold text-gray-900">Content Marketing Pro</h1>
            <Link 
              href="/dashboard/settings"
              className="btn-primary"
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
            Cultural Story Multiplication Tool
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform one cultural story into 12 different formats to create multiple 
            revenue streams and reach wider audiences while maintaining cultural integrity.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Story Transformation</h3>
            <p className="text-gray-600">
              Convert your cultural narratives into engaging content across multiple platforms and formats.
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Cultural Integrity</h3>
            <p className="text-gray-600">
              Maintain authenticity and respect for cultural values while expanding your reach.
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Revenue Generation</h3>
            <p className="text-gray-600">
              Create multiple income streams from a single story through diverse content formats.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to multiply your cultural stories?
          </h3>
          <button 
  className="btn-primary text-lg px-8 py-3"
  onClick={() => alert('Get Started clicked! This will redirect to your signup/onboarding flow.')}
>
            Get Started
          </button>
        </div>
      </div>
    </main>
  )
}
