'use client';

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { PLANS } from '../config/plans'

export default function Dashboard() {
  // In a real app, this would come from user authentication/database
  const [userPlan, setUserPlan] = useState('starter'); // Default to starter
  const [isTrialActive, setIsTrialActive] = useState(true); // Track if in trial period

  const currentPlan = PLANS[userPlan];
  const planDisplayName = currentPlan?.name.toUpperCase() || 'STARTER';

  // Determine plan badge color
  const getPlanBadgeColor = (planId: string) => {
    switch(planId) {
      case 'starter':
        return 'bg-blue-600';
      case 'professional':
        return 'bg-green-600';
      case 'enterprise':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  const planBadgeColor = getPlanBadgeColor(userPlan);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <div className="flex items-center space-x-2">
                <span 
                  className={`${planBadgeColor} text-white text-xs font-bold px-3 py-1 rounded-full cursor-default`}
                  aria-label="Current Plan"
                >
                  {planDisplayName} PLAN
                </span>
                {isTrialActive && (
                  <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    TRIAL
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trial Banner */}
      {isTrialActive && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>7-day free trial active!</strong> You're currently on the {currentPlan?.name} plan. 
                  No credit card required during trial.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Link 
                href="/dashboard/billing"
                className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium px-3 py-2 rounded-md transition-colors"
              >
                Choose Plan
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600">
            Ready to create and multiply your stories? 
            {currentPlan && (
              <span className="ml-1">
                Create up to <strong>{currentPlan.limits.storiesPerWeek === -1 ? 'unlimited' : currentPlan.limits.storiesPerWeek}</strong> stories per week.
              </span>
            )}
          </p>
        </div>

        {/* Plan Overview Card */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">{currentPlan?.name} Plan</h3>
              <p className="text-blue-100 mt-1">{currentPlan?.description}</p>
              <div className="mt-3 flex items-center space-x-4 text-sm">
                <span>📖 {currentPlan?.limits.storiesPerWeek === -1 ? 'Unlimited' : currentPlan?.limits.storiesPerWeek} stories/week</span>
                <span>📱 Universal QR distribution</span>
                {currentPlan?.limits.schedulingFeatures && <span>📅 Scheduling enabled</span>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${currentPlan?.limits.price}/mo</div>
              {isTrialActive && <div className="text-sm text-blue-200">Free during trial</div>}
              {!isTrialActive && (
                <Link 
                  href="/dashboard/billing"
                  className="mt-2 bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors inline-block"
                >
                  Manage Plan
                </Link>
              )}
            </div>
          </div>
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
              <div className="mt-3 text-sm text-blue-600 font-medium">
                Generate QR codes for universal distribution →
              </div>
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
              <p className="text-gray-600">View, edit, and manage all your stories in one place.</p>
              <div className="mt-3 text-sm text-green-600 font-medium">
                Access your QR codes and analytics →
              </div>
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
              <p className="text-gray-600">Track QR code scans, engagement, and story performance.</p>
              <div className="mt-3 text-sm text-purple-600 font-medium">
                {currentPlan?.limits.analyticsLevel} analytics available →
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Total Stories</div>
            <div className="text-xs text-gray-400 mt-1">
              Limit: {currentPlan?.limits.storiesPerWeek === -1 ? 'Unlimited' : `${currentPlan?.limits.storiesPerWeek}/week`}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Active QR Codes</div>
            <div className="text-xs text-gray-400 mt-1">
              Limit: {currentPlan?.limits.qrCodesActive === -1 ? 'Unlimited' : currentPlan?.limits.qrCodesActive}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">QR Code Scans</div>
            <div className="text-xs text-gray-400 mt-1">This week</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Total Engagement</div>
            <div className="text-xs text-gray-400 mt-1">All time</div>
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
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Create your first story and generate QR codes for universal distribution to all platforms. 
                Perfect for tourism businesses to share experiences instantly!
              </p>
              <Link 
                href="/dashboard/create"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors inline-flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Your First Story</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
