import Link from 'next/link'
import { PLANS } from '../config/plans';

export default function Dashboard() {
  // ...existing logic
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
      {/* ...rest of dashboard */}
    </main>
  )
}
