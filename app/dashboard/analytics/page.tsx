'use client'
import Link from 'next/link'
import { useState } from 'react'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

export default function BusinessIntelligenceDashboard() {
  const [selectedAnalytics, setSelectedAnalytics] = useState<'platform' | 'user' | 'messaging'>('platform')

  // Sample analytics data
  const analyticsData = {
    platform: {
      title: 'Platform Analytics',
      metrics: [
        { label: 'Content Distribution', value: 'LinkedIn 45% | Instagram 30% | Facebook 25%', icon: '📊' },
        { label: 'Engagement Rates', value: 'LinkedIn 8.5% | Instagram 12.3% | Facebook 6.7%', icon: '💫' },
        { label: 'Photo Type Performance', value: 'Experience 60% | Gallery 25% | Website 15%', icon: '📸' },
        { label: 'Format Preferences', value: 'Blog Article 40% | Social Post 35% | Video Script 25%', icon: '📝' },
        { label: 'Platform ROI', value: 'LinkedIn $2.80 | Instagram $1.95 | Facebook $1.45 per $1 spent', icon: '💰' }
      ]
    },
    user: {
      title: 'User Analytics',
      metrics: [
        { label: 'Total Active Users', value: '1,247 tourism professionals', icon: '👥' },
        { label: 'Regional Distribution', value: 'New Zealand 68% | International 32%', icon: '🌏' },
        { label: 'User Types', value: 'Tourism Business 45% | Marketing Team 30% | Content Creators 25%', icon: '🏢' },
        { label: 'Cultural Engagement', value: '89% use cultural intelligence features actively', icon: '🌿' },
        { label: 'Premium Adoption', value: '34% upgrade to paid plans within 30 days', icon: '⭐' }
      ]
    },
    messaging: {
      title: 'Messaging Analytics',
      metrics: [
        { label: 'Cultural Authenticity Score', value: '94% average across all generated content', icon: '🎯' },
        { label: 'Iwi Acknowledgment Rate', value: '78% of content includes proper acknowledgments', icon: '🪶' },
        { label: 'NZ English Compliance', value: '96% authentic New Zealand vocabulary usage', icon: '🇳🇿' },
        { label: 'Deployment Efficiency', value: '98% successful content deployment rate', icon: '🚀' },
        { label: 'Content Quality Improvement', value: '73% increase in engagement vs original content', icon: '📈' },
        { label: 'Time Savings', value: '85% reduction in content creation time', icon: '⏰' }
      ]
    }
  }

  const currentData = analyticsData[selectedAnalytics]

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'white'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1rem',
        borderBottom: '1px solid #f3f4f6'
      }}>
        {/* Navigation */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          display: 'flex',
          gap: '1rem'
        }}>
          <Link
            href="/dashboard"
            style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: 'clamp(0.875rem, 2vw, 1rem)'
            }}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/analytics"
            style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: 'clamp(0.875rem, 2vw, 1rem)'
            }}
          >
            Analytics
          </Link>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          fontWeight: '700',
          color: '#1f2937',
          lineHeight: '1.2',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          Business Intelligence
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 3vw, 1.25rem)',
          color: '#6b7280',
          textAlign: 'center',
          margin: '0'
        }}>
          AI Coaching Analytics for Tourism Businesses
        </p>
      </div>

      <div style={{
        flex: '1',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
        padding: '2rem 1rem'
      }}>
        {/* Analytics Method Toggle - 3 buttons */}
        <div style={{ textAlign: 'center', width: '100%', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            backgroundColor: '#f3f4f6',
            borderRadius: '1rem',
            padding: '0.5rem'
          }}>
            <button
              type="button"
              onClick={() => setSelectedAnalytics('platform')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedAnalytics === 'platform' ? 'white' : 'transparent',
                color: selectedAnalytics === 'platform' ? '#1f2937' : '#6b7280',
                boxShadow: selectedAnalytics === 'platform' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)'
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>📊</span>
              Platform Analytics
            </button>
            <button
              type="button"
              onClick={() => setSelectedAnalytics('user')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedAnalytics === 'user' ? 'white' : 'transparent',
                color: selectedAnalytics === 'user' ? '#1f2937' : '#6b7280',
                boxShadow: selectedAnalytics === 'user' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)'
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>👥</span>
              User Analytics
            </button>
            <button
              type="button"
              onClick={() => setSelectedAnalytics('messaging')}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedAnalytics === 'messaging' ? 'white' : 'transparent',
                color: selectedAnalytics === 'messaging' ? '#1f2937' : '#6b7280',
                boxShadow: selectedAnalytics === 'messaging' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)'
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>💬</span>
              Messaging Analytics
            </button>
          </div>
        </div>

        {/* Analytics Display Area */}
        <div style={{ textAlign: 'center', width: '100%', marginBottom: '3rem' }}>
          <div style={{
            width: '100%',
            maxWidth: '600px',
            border: '2px solid #e5e7eb',
            borderRadius: '1.5rem',
            backgroundColor: '#fafafa',
            margin: '0 auto',
            padding: '2rem',
            minHeight: '400px'
          }}>
            {/* Category Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: '700',
                color: '#1f2937',
                margin: '0 0 0.5rem 0'
              }}>
                {currentData.title}
              </h2>
              <div style={{
                width: '60px',
                height: '4px',
                backgroundColor: selectedAnalytics === 'platform' ? BRAND_PURPLE : 
                                selectedAnalytics === 'user' ? BRAND_ORANGE : BRAND_BLUE,
                borderRadius: '2px',
                margin: '0 auto'
              }}></div>
            </div>

            {/* Metrics Grid */}
            <div style={{
              display: 'grid',
              gap: '1.5rem',
              gridTemplateColumns: '1fr'
            }}>
              {currentData.metrics.map((metric, index) => (
                <div key={index} style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'left',
                  border: '1px solid #f3f4f6'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem'
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      flexShrink: 0
                    }}>
                      {metric.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                        fontWeight: '600',
                        color: '#1f2937',
                        margin: '0 0 0.5rem 0'
                      }}>
                        {metric.label}
                      </h3>
                      <p style={{
                        fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                        color: '#6b7280',
                        margin: '0',
                        lineHeight: '1.4'
                      }}>
                        {metric.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Insights Footer */}
            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              backgroundColor: selectedAnalytics === 'platform' ? '#f3f4f6' : 
                               selectedAnalytics === 'user' ? '#fff7ed' : '#eff6ff',
              borderRadius: '0.75rem',
              border: `1px solid ${selectedAnalytics === 'platform' ? '#e5e7eb' : 
                                   selectedAnalytics === 'user' ? '#fed7aa' : '#dbeafe'}`
            }}>
              <p style={{
                fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
                color: selectedAnalytics === 'platform' ? '#6b7280' : 
                       selectedAnalytics === 'user' ? '#c2410c' : '#1e40af',
                margin: '0',
                fontWeight: '500'
              }}>
                {selectedAnalytics === 'platform' && '📈 Platform performance shows strong LinkedIn engagement for B2B tourism content'}
                {selectedAnalytics === 'user' && '🎯 User growth concentrated in premium tourism operators seeking cultural authenticity'}
                {selectedAnalytics === 'messaging' && '✨ Cultural intelligence features driving 73% better content performance'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          width: '100%',
          marginBottom: '1rem'
        }}>
          <button
            style={{
              background: '#f3f4f6',
              color: '#6b7280',
              fontSize: 'clamp(1rem, 3vw, 1.25rem)',
              fontWeight: '600',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Export Report
          </button>
          <button
            style={{
              background: `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`,
              color: 'white',
              fontSize: 'clamp(1.25rem, 4vw, 2rem)',
              fontWeight: '900',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.2s'
            }}
          >
            View Details →
          </button>
        </div>

        {/* Logo - Brand Reinforcement */}
        <div style={{
          textAlign: 'center',
          marginBottom: '1rem',
          paddingTop: '0'
        }}>
          <div style={{
            color: BRAND_PURPLE,
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            fontWeight: '900',
            display: 'inline'
          }}>click</div>
          <div style={{
            color: BRAND_ORANGE,
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            fontWeight: '900',
            display: 'inline',
            marginLeft: '0.25rem'
          }}>speak</div>
          <div style={{
            color: BRAND_BLUE,
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            fontWeight: '900',
            display: 'inline',
            marginLeft: '0.25rem'
          }}>send</div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={{
        padding: '1.5rem',
        textAlign: 'center',
        borderTop: '1px solid #f3f4f6'
      }}>
        <Link
          href="/dashboard"
          style={{
            color: '#6b7280',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)'
          }}
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
