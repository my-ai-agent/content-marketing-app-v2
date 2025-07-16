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
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb'
    }}>
      
      {/* Main Content Container - 600px Mobile-First */}
      <div style={{ 
        flex: '1', 
        maxWidth: '600px', 
        margin: '0 auto', 
        width: '100%', 
        padding: '1rem' 
      }}>

        {/* Header Navigation - Inside 600px container */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <Link href="/" style={{
            color: '#6b7280',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Home
          </Link>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{
              backgroundColor: planBadgeColor.includes('blue') ? '#2563eb' : 
                             planBadgeColor.includes('green') ? '#16a34a' : '#9333ea',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px'
            }}>
              {planDisplayName} PLAN
            </span>
            {isTrialActive && (
              <span style={{
                backgroundColor: '#eab308',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '0.25rem 0.5rem',
                borderRadius: '9999px'
              }}>
                TRIAL
              </span>
            )}
          </div>
        </div>

        {/* Trial Banner - Same width as content */}
        {isTrialActive && (
          <div style={{
            backgroundColor: '#fefce8',
            borderLeft: '4px solid #facc15',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '0.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <p style={{
                fontSize: '0.875rem',
                color: '#a16207',
                margin: '0'
              }}>
                <strong>7-day Free trial active!</strong> No credit card required during trial.
              </p>
            </div>
            <Link 
              href="/dashboard/billing"
              style={{
                backgroundColor: '#d97706',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: '500',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                transition: 'background-color 0.2s'
              }}
            >
              Choose Plan
            </Link>
          </div>
        )}
        
        {/* Welcome + Stats Combined Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '0.5rem',
            textAlign: 'center'
          }}>
            Welcome back!
          </h2>
          <p style={{
            color: '#6b7280',
            textAlign: 'center',
            fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
            marginBottom: '2rem'
          }}>
            Ready to create and multiply your stories? 
            {currentPlan && (
              <span style={{ marginLeft: '0.25rem' }}>
                Create up to <strong>{currentPlan.limits.storiesPerWeek === -1 ? 'unlimited' : currentPlan.limits.storiesPerWeek}</strong> stories per week.
              </span>
            )}
          </p>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem'
          }}>
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#111827'
              }}>0</div>
              <div style={{
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>Total Stories</div>
              <div style={{
                fontSize: '0.75rem',
                color: '#9ca3af',
                marginTop: '0.25rem'
              }}>
                Limit: {currentPlan?.limits.storiesPerWeek === -1 ? 'Unlimited' : `${currentPlan?.limits.storiesPerWeek}/week`}
              </div>
            </div>
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#3b82f6'
              }}>0</div>
              <div style={{
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>Active QR Codes</div>
              <div style={{
                fontSize: '0.75rem',
                color: '#9ca3af',
                marginTop: '0.25rem'
              }}>
                Limit: {currentPlan?.limits.qrCodesActive === -1 ? 'Unlimited' : currentPlan?.limits.qrCodesActive}
              </div>
            </div>
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#10b981'
              }}>0</div>
              <div style={{
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>QR Code Scans</div>
              <div style={{
                fontSize: '0.75rem',
                color: '#9ca3af',
                marginTop: '0.25rem'
              }}>This week</div>
            </div>
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#8b5cf6'
              }}>0</div>
              <div style={{
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>Total Engagement</div>
              <div style={{
                fontSize: '0.75rem',
                color: '#9ca3af',
                marginTop: '0.25rem'
              }}>All time</div>
            </div>
          </div>
        </div>

          {/* View Stories */}
          <Link href="/dashboard/stories" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
              e.currentTarget.style.borderColor = '#10b981'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{
                  backgroundColor: '#d1fae5',
                  padding: '0.75rem',
                  borderRadius: '50%',
                  marginRight: '0.75rem'
                }}>
                  <svg style={{ width: '1.5rem', height: '1.5rem', color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: '0'
                }}>
                  My Stories
                </h3>
              </div>
              <p style={{
                color: '#6b7280',
                marginBottom: '0.75rem',
                lineHeight: '1.5'
              }}>
                View, edit, and manage all your stories in one place.
              </p>
              <div style={{
                fontSize: '0.875rem',
                color: '#10b981',
                fontWeight: '500'
              }}>
                Access your QR codes and analytics →
              </div>
            </div>
          </Link>

          {/* Analytics */}
          <Link href="/dashboard/analytics" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
              e.currentTarget.style.borderColor = '#8b5cf6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{
                  backgroundColor: '#ede9fe',
                  padding: '0.75rem',
                  borderRadius: '50%',
                  marginRight: '0.75rem'
                }}>
                  <svg style={{ width: '1.5rem', height: '1.5rem', color: '#8b5cf6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: '0'
                }}>
                  Analytics
                </h3>
              </div>
              <p style={{
                color: '#6b7280',
                marginBottom: '0.75rem',
                lineHeight: '1.5'
              }}>
                Track QR code scans, engagement, and story performance.
              </p>
              <div style={{
                fontSize: '0.875rem',
                color: '#8b5cf6',
                fontWeight: '500'
              }}>
                {currentPlan?.limits.analyticsLevel} analytics available →
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity - Enhanced as Create New Story */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{
            padding: '1.5rem 1.5rem 0 1.5rem',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 1.5rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                backgroundColor: '#dbeafe',
                padding: '0.5rem',
                borderRadius: '50%'
              }}>
                <svg style={{ width: '1.25rem', height: '1.25rem', color: '#3b82f6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              Create New Story
            </h3>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{
              textAlign: 'center',
              padding: '2rem 0'
            }}>
              <div style={{
                color: '#9ca3af',
                fontSize: '1.125rem',
                marginBottom: '1rem'
              }}>No stories created yet</div>
              <p style={{
                color: '#6b7280',
                marginBottom: '1.5rem',
                maxWidth: '400px',
                margin: '0 auto 1.5rem auto',
                lineHeight: '1.5'
              }}>
                Create your first story and generate QR codes for universal distribution to all platforms. 
                Perfect for tourism businesses to share experiences instantly!
              </p>
              <Link 
                href="/dashboard/create/photo"
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontWeight: '600',
                  padding: '1rem 2rem',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1.125rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6'
                }}
              >
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create New Story</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Logo */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          paddingTop: '2rem'
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div style={{ 
              color: '#6B2EFF', 
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', 
              fontWeight: '900',
              display: 'inline'
            }}>click</div>
            <div style={{ 
              color: '#FF7B1C', 
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', 
              fontWeight: '900',
              display: 'inline',
              marginLeft: '0.25rem'
            }}>speak</div>
            <div style={{ 
              color: '#11B3FF', 
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', 
              fontWeight: '900',
              display: 'inline',
              marginLeft: '0.25rem'
            }}>send</div>
          </Link>
        </div>

      </div>
    </div>
  )
}
