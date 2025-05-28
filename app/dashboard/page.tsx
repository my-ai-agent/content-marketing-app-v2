'use client'
import Link from 'next/link'

const PLAN_LIMITS = {
  free: { storiesPerWeek: 1, platforms: 2, users: 2 },
  basic: { storiesPerWeek: 5, platforms: 3, users: 2 },
  professional: { storiesPerWeek: 5, platforms: 5, users: 2 },
  enterprise: { storiesPerWeek: 999, platforms: 7, users: 5 }
};

export default function Dashboard() {
  const currentPlan = 'free';
  const storiesThisWeek = 0;
  const planLimits = PLAN_LIMITS[currentPlan as keyof typeof PLAN_LIMITS];
  const canCreateStory = storiesThisWeek < planLimits.storiesPerWeek;
  
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
              <Link 
                href="/"
                className="text-gray-600 hover:text-gray-900"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-blue-800 capitalize">**FREE PLAN**</h3>
              <p className="text-sm text-blue-600">
                {storiesThisWeek} of {planLimits.storiesPerWeek === 999 ? 'unlimited' : planLimits.storiesPerWeek} stories used this week • {planLimits.platforms} platforms available
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-32 bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${planLimits.storiesPerWeek === 999 ? 20 : (storiesThisWeek / planLimits.storiesPerWeek) * 100}%` }}
                ></div>
              </div>
              {currentPlan === 'free' && (
                <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-1 px-3 rounded">
                  **FREE PLAN**
                </button>
              )}
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
            Start creating and managing your story content here.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
            <h3 className="text-xl font-semibold mb-3">Create New Story</h3>
            <p className="text-gray-600 mb-4">Start transforming your narrative into multiple formats.</p>
            <Link
              href={canCreateStory ? "/dashboard/create" : "#"}
              className={`${
                canCreateStory 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-gray-400 cursor-not-allowed"
              } text-white font-medium py-2 px-4 rounded transition-colors inline-block text-center`}
              onClick={(e) => {
                if (!canCreateStory) {
                  e.preventDefault();
                  alert(`You've reached your ${planLimits.storiesPerWeek} story limit for this week. Upgrade to create more stories.`);
                }
              }}
            >
              Create Story {!canCreateStory && '(Limit Reached)'}
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
            <h3 className="text-xl font-semibold mb-3">My Stories</h3>
            <p className="text-gray-600 mb-4">View and manage your existing stories.</p>
            <Link
              href="/dashboard/stories"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors inline-block text-center"
            >
              View Stories
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
            <h3 className="text-xl font-semibold mb-3">Analytics</h3>
            <Link
              href="/dashboard/analytics"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors inline-block text-center"
            >
              View Analytics
            </Link>
          </div>
        </div>
        
        <p className="text-center text-gray-600 mt-8">**Speak Click Send** is another **CCC Marketing Pro™ Saas 2025**</p>
      </div>
    </main>
  )
}
