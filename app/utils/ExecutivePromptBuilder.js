// IMPLEMENTATION GUIDE: Executive Prompt Builder Integration
// Follow these steps to integrate the system across all 6 pages

// ===================================================================
// STEP 1: CREATE THE MAIN FILE
// ===================================================================
// File: /utils/ExecutivePromptBuilder.js
// Copy the complete ExecutivePromptBuilder class from the previous artifact

// ===================================================================
// STEP 2: UPDATE STORY PAGE (ALREADY DONE)
// ===================================================================
// File: /app/dashboard/create/story/page.tsx
// This is already updated in your current implementation

// ===================================================================
// STEP 3: UPDATE PHOTO PAGE 
// ===================================================================
// File: /app/dashboard/create/photo/page.tsx

// Add these imports at the top:
import ExecutivePromptBuilder from '../../../utils/ExecutivePromptBuilder'

// Add this in your component:
const promptBuilder = new ExecutivePromptBuilder()

// Update your handleNext function:
const handleNext = () => {
  if (uploadedPhoto) {
    // Save photo data to localStorage (existing)
    localStorage.setItem('uploadedPhoto', uploadedPhoto)
    
    // NEW: Update Executive Prompt Builder
    promptBuilder.updatePhotoData(
      selectedFile, // your photo file
      cropData,     // your crop data if available
      selectedFile?.name // filename
    )
    
    // Navigate to next step
    window.location.href = '/dashboard/create/story'
  }
}

// ===================================================================
// STEP 4: UPDATE DEMOGRAPHICS PAGE
// ===================================================================
// File: /app/dashboard/create/demographics/page.tsx

// Add these imports at the top:
import ExecutivePromptBuilder from '../../../utils/ExecutivePromptBuilder'

// Add this in your component:
const promptBuilder = new ExecutivePromptBuilder()

// Update your handleNext function:
const handleNext = () => {
  if (selectedDemographic) {
    // Save to localStorage (existing)
    localStorage.setItem('selectedDemographic', selectedDemographic)
    
    // NEW: Update Executive Prompt Builder
    promptBuilder.updateAudienceData(selectedDemographic)
    
    // Navigate to next step
    window.location.href = '/dashboard/create/interests'
  }
}

// ===================================================================
// STEP 5: UPDATE INTERESTS PAGE
// ===================================================================
// File: /app/dashboard/create/interests/page.tsx

// Add these imports at the top:
import ExecutivePromptBuilder from '../../../utils/ExecutivePromptBuilder'

// Add this in your component:
const promptBuilder = new ExecutivePromptBuilder()

// Update your handleNext function:
const handleNext = () => {
  if (selectedInterest) {
    // Save to localStorage (existing)
    localStorage.setItem('selectedInterest', selectedInterest)
    
    // NEW: Update Executive Prompt Builder
    promptBuilder.updateInterestsData(selectedInterest)
    
    // Navigate to next step
    window.location.href = '/dashboard/create/platform'
  }
}

// ===================================================================
// STEP 6: UPDATE PLATFORM PAGE
// ===================================================================
// File: /app/dashboard/create/platform/page.tsx

// Add these imports at the top:
import ExecutivePromptBuilder from '../../../utils/ExecutivePromptBuilder'

// Add this in your component:
const promptBuilder = new ExecutivePromptBuilder()

// Update your handleNext function:
const handleNext = () => {
  if (selectedPlatforms.length > 0 && selectedFormats.length > 0) {
    // Save to localStorage (existing)
    localStorage.setItem('selectedPlatforms', JSON.stringify(selectedPlatforms))
    localStorage.setItem('selectedFormats', JSON.stringify(selectedFormats))
    
    // NEW: Update Executive Prompt Builder
    promptBuilder.updatePlatformData(selectedPlatforms, selectedFormats)
    
    // Navigate to generation page
    window.location.href = '/dashboard/create/generate'
  }
}

// ===================================================================
// STEP 7: CREATE GENERATION PAGE
// ===================================================================
// File: /app/dashboard/create/generate/page.tsx

'use client'
import { useState, useEffect } from 'react'
import ExecutivePromptBuilder from '../../../utils/ExecutivePromptBuilder'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

export default function GenerateContent() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState(null)
  const [promptData, setPromptData] = useState(null)
  const [error, setError] = useState(null)

  const promptBuilder = new ExecutivePromptBuilder()

  useEffect(() => {
    // Load and validate prompt data
    const validation = promptBuilder.validateCompleteness()
    setPromptData(promptBuilder.promptData)
    
    if (!validation.isComplete) {
      setError(`Missing required data: ${validation.missingSections.join(', ')}`)
    }
  }, [])

  const handleGenerate = async () => {
    try {
      setIsGenerating(true)
      setError(null)

      // Generate the Claude prompt
      const claudePrompt = promptBuilder.generateClaudePrompt()
      
      // TODO: Send to Claude API
      // const response = await sendToClaudeAPI(claudePrompt)
      // setGeneratedContent(response)
      
      // For now, show the prompt
      console.log('Generated Claude Prompt:', claudePrompt)
      setGeneratedContent({
        prompt: claudePrompt,
        // Mock content for demonstration
        instagram: "🌋 Standing in the heart of Whakarewarewa thermal village, I witnessed something magical...",
        blog: "# Discovering the Ancient Thermal Wonders of Rotorua\n\nIn the heart of New Zealand's North Island..."
      })
      
    } catch (err) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEdit = (platform, content) => {
    // TODO: Implement content editing
    console.log('Edit content for', platform, content)
  }

  const handleExport = (platform, content) => {
    // TODO: Implement content export
    console.log('Export content for', platform, content)
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
        {/* Step Tracker - All 6 steps completed */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '0.5rem', 
          marginBottom: '1.5rem' 
        }}>
          {[1, 2, 3, 4, 5, 6].map((step, index) => (
            <>
              <div key={step} style={{ 
                width: '2rem', 
                height: '2rem', 
                borderRadius: '50%', 
                backgroundColor: '#10b981', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '0.875rem', 
                fontWeight: '600' 
              }}>{step}</div>
              {index < 5 && <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#10b981' }}></div>}
            </>
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
      </div>

      <div style={{ 
        flex: '1', 
        maxWidth: '900px', 
        margin: '0 auto', 
        width: '100%', 
        padding: '2rem 1rem' 
      }}>

        {/* Summary Section */}
        {promptData && (
          <div style={{
            backgroundColor: '#f9fafb',
            border: '2px solid #e5e7eb',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
              Content Brief Summary
            </h3>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              <div>
                <strong>Creator Type:</strong> {promptData.persona?.userTypeTitle || 'Not selected'}
              </div>
              <div>
                <strong>Target Audience:</strong> {promptData.audience?.selectedAudience || 'Not selected'}
              </div>
              <div>
                <strong>Primary Interest:</strong> {promptData.interests?.primaryInterest || 'Not selected'}
              </div>
              <div>
                <strong>Platforms:</strong> {promptData.platforms?.selectedPlatforms?.join(', ') || 'Not selected'}
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '2px solid #fca5a5',
            borderRadius: '1rem',
            padding: '1rem',
            marginBottom: '2rem',
            color: '#dc2626'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Generate Button */}
        {!generatedContent && (
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || error}
              style={{
                background: (!isGenerating && !error) 
                  ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                  : '#e5e7eb',
                color: (!isGenerating && !error) ? 'white' : '#9ca3af',
                fontSize: 'clamp(1.25rem, 4vw, 2rem)',
                fontWeight: '900',
                padding: '1.5rem 3rem',
                borderRadius: '1rem',
                border: 'none',
                cursor: (!isGenerating && !error) ? 'pointer' : 'not-allowed',
                boxShadow: (!isGenerating && !error) ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {isGenerating ? 'Generating Content...' : 'Generate Content ✨'}
            </button>
          </div>
        )}

        {/* Generated Content Display */}
        {generatedContent && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
              Generated Content
            </h2>
            
            {/* Content for each platform */}
            {promptData?.platforms?.selectedPlatforms?.map(platform => (
              <div key={platform} style={{
                backgroundColor: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginBottom: '1rem'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{platform}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(platform, generatedContent[platform.toLowerCase()])}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#f3f4f6',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleExport(platform, generatedContent[platform.toLowerCase()])}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: BRAND_PURPLE,
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      Export
                    </button>
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#f9fafb',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  lineHeight: '1.5'
                }}>
                  {generatedContent[platform.toLowerCase()] || 'Content will be generated here...'}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Logo */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '1rem',
          paddingTop: '2rem'
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
    </div>
  )
}

// ===================================================================
// STEP 8: ADD PROGRESS TRACKING (OPTIONAL)
// ===================================================================
// Add this to any page to show progress:

const [promptProgress, setPromptProgress] = useState(0)

useEffect(() => {
  const handleProgress = (event) => {
    setPromptProgress(event.detail.percentage)
  }
  
  window.addEventListener('promptProgress', handleProgress)
  return () => window.removeEventListener('promptProgress', handleProgress)
}, [])

// Display progress:
{promptProgress > 0 && (
  <div style={{ marginBottom: '1rem' }}>
    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
      Content Brief: {promptProgress}% Complete
    </div>
    <div style={{ 
      width: '100%', 
      height: '4px', 
      backgroundColor: '#e5e7eb', 
      borderRadius: '2px' 
    }}>
      <div style={{ 
        width: `${promptProgress}%`, 
        height: '100%', 
        backgroundColor: BRAND_PURPLE, 
        borderRadius: '2px',
        transition: 'width 0.3s ease'
      }} />
    </div>
  </div>
)}

// ===================================================================
// STEP 9: CLAUDE API INTEGRATION (FUTURE)
// ===================================================================
// Function to send prompt to Claude API:

async function sendToClaudeAPI(prompt) {
  try {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    })
    
    if (!response.ok) {
      throw new Error('Failed to generate content')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Claude API Error:', error)
    throw error
  }
}

// API Route: /pages/api/claude.js or /app/api/claude/route.js
export async function POST(request) {
  try {
    const { prompt } = await request.json()
    
    // Call Claude API here
    // const claudeResponse = await anthropic.messages.create({...})
    
    return Response.json({ 
      success: true,
      content: claudeResponse // Generated content
    })
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
