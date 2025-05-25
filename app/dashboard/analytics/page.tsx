import Link from 'next/link'

export default function Analytics() {
  // Sample analytics data (in real app, this would come from analytics service)
  const analytics = {
    totalViews: 15750,
    totalShares: 1240,
    totalRevenue: 8950,
    conversionRate: 12.5,
    topStories: [
      { title: "Pacific Navigation Stories", views: 5200, formats: 12, revenue: 3800 },
      { title: "The Legend of Tangaroa", views: 4100, formats: 8, revenue: 2900 },
      { title: "Māori Weaving Traditions", views: 3450, formats: 10, revenue: 1850 },
      { title: "Haka Cultural Significance", views: 3000, formats: 7, revenue: 400 }
    ],
    formatPerformance: [
      { format: "Blog Posts", views: 4200, engagement: 85, revenue: 1200 },
      { format: "Social Media", views: 3800, engagement: 92, revenue: 800 },
      { format: "Educational Videos", views: 2900, engagement: 78, revenue: 2100 },
      { format: "Podcasts", views: 2100, engagement: 88, revenue: 1800 },
      { format: "Workshops", views: 1500, engagement: 95, revenue: 2400 },
      { format: "Digital Experiences", views: 1250, engagement: 82, revenue: 650 }
    ],
    monthlyTrends: [
      { month: "Jan", views: 2100, revenue: 1200 },
      { month: "Feb", views: 2800, revenue: 1650 },
      { month: "Mar", views: 3200, revenue: 1900 },
      { month: "Apr", views: 2900, revenue: 1700 },
      { month: "May", views: 4650, revenue: 2500 }
    ]
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">Content Analytics</h1>
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
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.totalViews.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Views</div>
              </div>
              <div className="text-green-500 text-sm">↗ +15%</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.totalShares.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Shares</div>
              </div>
              <div className="text-green-500 text-sm">↗ +28%</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">${analytics.totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
              <div className="text-green-500 text-sm">↗ +22%</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.conversionRate}%</div>
                <div className="text-sm text-gray-600">Conversion Rate</div>
              </div>
              <div className="text-green-500 text-sm">↗ +5%</div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Trends */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h3>
            <div className="space-y-4">
              {analytics.monthlyTrends.map((month) => (
                <div key={month.month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium text-gray-600">{month.month}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium text-gray-900">{month.views.toLocaleString()} views</div>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(month.views / 5000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-green-600">${month.revenue.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Stories */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Stories</h3>
            <div className="space-y-4">
              {analytics.topStories.map((story, index) => (
                <div key={story.title} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-bold text-gray-500">#{index + 1}</div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{story.title}</div>
                      <div className="text-xs text-gray-500">{story.views.toLocaleString()} views • {story.formats} formats</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-green-600">${story.revenue.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Format Performance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Format Performance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Format</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Views</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Engagement</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Performance</th>
                </tr>
              </thead>
              <tbody>
                {analytics.formatPerformance.map((format) => (
                  <tr key={format.format} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{format.format}</td>
                    <td className="py-3 px-4 text-gray-600">{format.views.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">{format.engagement}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${format.engagement}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-green-600">${format.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        format.engagement >= 90 ? 'bg-green-100 text-green-800' :
                        format.engagement >= 80 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {format.engagement >= 90 ? 'Excellent' :
                         format.engagement >= 80 ? 'Good' : 'Needs Work'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cultural Impact Metrics */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cultural Impact & Reach</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">47</div>
              <div className="text-sm text-gray-600">Countries Reached</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
              <div className="text-sm text-gray-600">Languages Translated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">89%</div>
              <div className="text-sm text-gray-600">Cultural Accuracy Score</div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="mt-8 flex justify-end space-x-4">
          <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Export CSV
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Generate Report
          </button>
        </div>
      </div>
    </main>
  )
}
