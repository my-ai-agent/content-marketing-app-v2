import Link from 'next/link'

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex space-x-4">
              <Link 
                href="/"
                className="text-gray-600 hover:text-gray-900"
              >
                Home
              </Link>
              <Link 
                href="/dashboard/settings"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Your Content Marketing Dashboard
          </h2>
          <p className="text-lg text-gray-600">
            Start creating and managing your cultural story content here.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Create New Story</h3>
            <p className="text-gray-600 mb-4">Start transforming your cultural narrative into multiple formats.</p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors">
              Create Story
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">My Stories</h3>
            <p className="text-gray-600 mb-4">View and manage your existing cultural stories.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
              View Stories
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Analytics</h3>
            <p className="text-gray-600 mb-4">Track performance across your content formats.</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
