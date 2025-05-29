import Link from 'next/link'
import { PLANS } from '../config/plans';

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img src="/logos/1.png" alt="Speak Click Send" className="h-8 w-auto mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <span 
                className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full ml-2 cursor-default"
                aria-label="Current Plan"
              >
                FREE PLAN
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600">Ready to create and multiply your cultural stories?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Create New Story */}
          <Link href="/dashboard/create" className="block">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-blue-300">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">Create New Story</h3>
              </div>
              <p className="text-gray-600">Start with your story and multiply it across multiple platforms and formats.</p>
            </div>
          </Link>

          {/* View Stories */}
          <Link href="/dashboard/stories" className="block">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-green-300">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">My Stories</h3>
              </div>
              <p className="text-gray-600">View, edit, and manage all your cultural stories in one place.</p>
            </div>
          </Link>

          {/* Analytics */}
          <Link href="/dashboard/analytics" className="block">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-purple-300">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">Analytics</h3>
              </div>
              <p className="text-gray-600">Track performance, engagement, and cultural impact of your stories.</p>
            </div>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Total Stories</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Content Formats</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Published</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No stories created yet</div>
              <Link 
                href="/dashboard/create"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Create Your First Story
              </Link>
            </div>
          </div>
        </div>

        {/* Settings Quick Access */}
        <div className="mt-8 text-center">
          <Link 
            href="/dashboard/settings" 
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Account Settings →
          </Link>
        </div>

      </div>
    </main>
  )
}
