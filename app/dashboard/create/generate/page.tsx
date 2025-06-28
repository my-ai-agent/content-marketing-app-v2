'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ExecutivePromptBuilder from '../../../utils/ExecutivePromptBuilder'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

export default function GenerateContent() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)
  const [executivePrompt, setExecutivePrompt] = useState<string>('')
  const [promptData, setPromptData] = useState<any>(null)
  const [error, setError] = useState<string>('')

  // Initialize and load Executive Prompt data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const promptBuilder = new ExecutivePromptBuilder()
        const data = promptBuilder.exportPromptData()
        setPromptData(data)
        
        // Generate the executive prompt
        const prompt = promptBuilder.generateClaudePrompt()
        setExecutivePrompt(prompt)
        
        console.log('📋 Executive Prompt Builder Data:', data)
        console.log('🎯 Generated Executive Prompt:', prompt)
      } catch (error) {
        console.error('Error initializing Executive Prompt Builder:', error)
        setError('Error loading your content data. Please try refreshing the page.')
      }
    }
  }, [])

  // Simulate content generation (replace with actual Claude API call)
  const handleGenerate = async () => {
    setIsGenerating(true)
    setError('')
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock generated content based on the prompt data
      const mockContent = generateMockContent(promptData)
      setGeneratedContent(mockContent)
      
      console.log('✅ Content generated successfully')
    } catch (err) {
      setError('Failed to generate content. Please try again.')
      console.error('❌ Generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate mock content based on collected data
  const generateMockContent = (data: any) => {
    if (!data) return null
    
    const persona = data.persona?.userType || 'content creator'
    const platforms = data.platforms?.selectedPlatforms || ['Instagram']
    const formats = data.platforms?.selectedFormats || ['Social Post']
    const audience = data.audience?.selectedAudience || 'Millennials'
    const story = data.story?.content || 'Amazing travel experience'
    
    return {
      platforms: platforms.map((platform: string) => ({
        name: platform,
        content: {
          caption: `🌟 ${story.substring(0, 100)}...\n\nPerfect for ${audience} who love authentic experiences! \n\n#Travel #Tourism #${platform.replace(/\s+/g, '')} #NewZealand`,
          hashtags: platform === 'Instagram' ? ['#Travel', '#Tourism', '#NewZealand', '#Adventure', '#Culture'] : ['#Travel', '#Tourism'],
          callToAction: persona === 'Tourism Business Owner' ? 'Book your experience today!' : 'Tag someone who needs to see this!',
          engagementTips: `Optimized for ${platform} - Post at peak engagement times for ${audience}`
        }
      })),
      formats: formats.map((format: string) => ({
        name: format,
        content: format === 'Blog Article' 
          ? `# ${story.substring(0, 50)}...\n\nDiscover the magic of New Zealand through authentic experiences that resonate with ${audience}...`
          : `Ready-to-use ${format} content optimized for your audience`
      })),
      metrics: {
        estimatedReach: '2,500-5,000 people',
        engagementRate: '4.2-6.8%',
        optimalPostTime: 'Weekdays 7-9am, Weekends 10am-2pm'
      }
    }
  }

  const handleStartOver = () => {
    if (typeof window !== 'undefined') {
      const promptBuilder = new ExecutivePromptBuilder()
      promptBuilder.resetPrompt()
      window.location.href = '/dashboard/create/photo'
    }
  }

  const handleNewContent = () => {
    setGeneratedContent(null)
    setError('')
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'white'
    }}>
      
      {/* Header with Step Tracker */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1rem',
        borderBottom: '1px solid #f3f4f6'
      }}>
        
        {/* Step Tracker - All steps completed */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {[1,2,3,4,5,6].map((step) => (
            <div key={step} style={{
              width: '2rem', height: '2rem', borderRadius: '50%',
              backgroundColor: '#10b981', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.875rem', fontWeight: '600'
            }}>{step}</div>
          ))}
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
          Generate Content
        </h1>
        
        <p style={{
          fontSize: 'clamp(1rem, 3vw, 1.25rem)',
          color: '#6b7280',
          textAlign: 'center',
          maxWidth: '600px'
        }}>
          Your AI-powered tourism content is ready to be created!
        </p>
      </div>

      <div style={{
        flex: 1,
        maxWidth: '1000px',
        margin: '0 auto',
        width: '100%',
        padding: '2rem 1rem'
      }}>

        {/* Data Summary Section */}
        {promptData && (
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '1rem'
            }}>
              📋 Your Content Brief
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              {promptData.persona && (
                <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
                  <div style={{ fontWeight: '600', color: '#6b46c1' }}>Creator Type</div>
                  <div style={{ color: '#374151' }}>{promptData.persona.userType || 'Content Creator'}</div>
                </div>
              )}
              
              {promptData.audience && (
                <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
                  <div style={{ fontWeight: '600', color: '#059669' }}>Target Audience</div>
                  <div style={{ color: '#374151' }}>{promptData.audience.selectedAudience || 'Not specified'}</div>
                </div>
              )}
              
              {promptData.platforms && (
                <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
                  <div style={{ fontWeight: '600', color: '#dc2626' }}>Platforms</div>
                  <div style={{ color: '#374151' }}>
                    {promptData.platforms.selectedPlatforms?.join(', ') || 'Not specified'}
                  </div>
                </div>
              )}
              
              {promptData.platforms && (
                <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
                  <div style={{ fontWeight: '600', color: '#ea580c' }}>Formats</div>
                  <div style={{ color: '#374151' }}>
                    {promptData.platforms.selectedFormats?.join(', ') || 'Not specified'}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generate Button or Results */}
        {!generatedContent ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem'
          }}>
            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '2rem'
              }}>
                {error}
              </div>
            )}
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              style={{
                background: isGenerating 
                  ? '#e5e7eb' 
                  : `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`,
                color: isGenerating ? '#9ca3af' : 'white',
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                fontWeight: '900',
                padding: '2rem 4rem',
                borderRadius: '1.5rem',
                border: 'none',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                boxShadow: isGenerating ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.3s ease',
                marginBottom: '2rem'
              }}
            >
              {isGenerating ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    border: '3px solid #f3f4f6',
                    borderTop: '3px solid #9ca3af',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Generating Amazing Content...
                </div>
              ) : (
                '🚀 Generate My Content'
              )}
            </button>
            
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Click to generate culturally-sensitive, platform-optimized content using AI
            </p>
          </div>
        ) : (
          /* Generated Content Display */
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937'
              }}>
                ✨ Your Generated Content
              </h2>
              
              <button
                onClick={handleNewContent}
                style={{
                  background: BRAND_BLUE,
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Generate New Version
              </button>
            </div>

            {/* Platform Content */}
            <div style={{
              display: 'grid',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              {generatedContent.platforms?.map((platform: any, index: number) => (
                <div key={index} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  backgroundColor: 'white'
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    📱 {platform.name} Content
                  </h3>
                  
                  <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {platform.content.caption}
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    fontSize: '0.875rem'
                  }}>
                    <div>
                      <strong style={{ color: '#374151' }}>Call to Action:</strong>
                      <div style={{ color: '#6b7280' }}>{platform.content.callToAction}</div>
                    </div>
                    <div>
                      <strong style={{ color: '#374151' }}>Engagement Tips:</strong>
                      <div style={{ color: '#6b7280' }}>{platform.content.engagementTips}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Metrics */}
            {generatedContent.metrics && (
              <div style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #0ea5e9',
                borderRadius: '1rem',
                padding: '1.5rem'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#0369a1',
                  marginBottom: '1rem'
                }}>
                  📊 Expected Performance
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#0369a1' }}>Estimated Reach</div>
                    <div style={{ color: '#374151' }}>{generatedContent.metrics.estimatedReach}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#0369a1' }}>Engagement Rate</div>
                    <div style={{ color: '#374151' }}>{generatedContent.metrics.engagementRate}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#0369a1' }}>Optimal Post Time</div>
                    <div style={{ color: '#374151' }}>{generatedContent.metrics.optimalPostTime}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginTop: '2rem'
        }}>
          <button
            onClick={handleStartOver}
            style={{
              background: '#f3f4f6',
              color: '#6b7280',
              fontSize: '1rem',
              fontWeight: '600',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            🔄 Start Over
          </button>
          
          <Link href="/dashboard" style={{
            background: BRAND_PURPLE,
            color: 'white',
            fontSize: '1rem',
            fontWeight: '600',
            padding: '1rem 2rem',
            borderRadius: '1rem',
            textDecoration: 'none',
            display: 'inline-block'
          }}>
            📊 View Dashboard
          </Link>
        </div>

        {/* Cultural Values Footer */}
        <div style={{
          textAlign: 'center',
          padding: '2rem 1rem',
          marginTop: '2rem',
          borderTop: '1px solid #f3f4f6',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          <div style={{ marginBottom: '0.5rem' }}>
            🌺 Generated with respect for Mātauranga Māori and cultural values
          </div>
          <div>
            Supporting sustainable and culturally-conscious tourism storytelling
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
