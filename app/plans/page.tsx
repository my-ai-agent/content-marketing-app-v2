'use client';

import { useState } from 'react';
import Link from 'next/link';

const BRAND_PURPLE = '#6B2EFF';
const BRAND_ORANGE = '#FF7B1C'; 
const BRAND_BLUE = '#11B3FF';

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState('professional');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 47,
      description: 'Get consistent with professional tourism content',
      features: [
        '2 professional stories per week',
        'Unlimited images per story',
        '500MB storage with auto-compression',
        'Photo attribution & location tags',
        'Universal QR distribution to all platforms',
        'Basic QR scan analytics',
        '7-day free trial'
      ],
      color: BRAND_BLUE,
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 147,
      description: 'Set your week\'s content on Monday, then focus on your guests',
      features: [
        '7 stories per week (daily professional content)',
        'Unlimited images per story',
        '2GB storage with smart compression',
        'Week scheduler - "Set and Smile"',
        'Advanced QR analytics & engagement tracking',
        'All generational psychology profiles',
        'Small team collaboration (3 users)',
        '7-day free trial'
      ],
      color: BRAND_PURPLE,
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 547,
      description: 'Complete tourism marketing ecosystem for large operations',
      features: [
        'Unlimited stories and content generation',
        'Unlimited images and storage',
        'Month scheduler with bulk operations',
        'Premium analytics dashboard with exports',
        'White-label QR landing pages',
        'Unlimited team collaboration',
        'Priority support with dedicated account manager',
        'API access for custom integrations',
        '7-day free trial'
      ],
      color: BRAND_ORANGE,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="text-2xl font-bold">
                <span style={{ color: BRAND_PURPLE }}>speak</span>
                <span style={{ color: BRAND_ORANGE }}>click</span>
                <span style={{ color: BRAND_BLUE }}>send</span>
              </div>
            </Link>
            <Link 
              href="/"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start your 7-day free trial on any plan. Transform your tourism business with 
            professional content that works across all platforms.
          </p>
          <div className="mt-6 inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>7-day free trial • No credit card required</span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
              } ${
                selectedPlan === plan.id ? 'ring-2 ring-blue-400' : ''
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold" style={{ color: plan.color }}>
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>

                <div className="text-sm text-gray-500 mb-6">
                  Start with 7-day free trial
                </div>
              </div>

              {/* Features List */}
              <div className="px-8 pb-8">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="px-8 pb-8">
                <Link href="/dashboard">
                  <button
                    className="w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: selectedPlan === plan.id ? plan.color : 'transparent',
                      color: selectedPlan === plan.id ? 'white' : plan.color,
                      border: `2px solid ${plan.color}`
                    }}
                  >
                    {selectedPlan === plan.id ? 'Start Free Trial' : 'Select Plan'}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Ready to transform your tourism content marketing?
          </p>
          <Link href="/dashboard">
            <button
              className="px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 text-white"
              style={{
                background: `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)'
              }}
            >
              Start Your Free Trial →
            </button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 font-medium">7-Day Free Trial</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span className="text-gray-700 font-medium">Cancel Anytime</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 font-medium">Email Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
