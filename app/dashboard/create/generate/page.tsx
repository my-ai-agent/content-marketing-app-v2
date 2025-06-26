'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

type GeneratedContent = any // Replace with your expected shape if known

export default function AIContentGeneration() {
  const [isGenerating, setIsGenerating] = useState(true)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    generateContent()
    // Cleanup on unmount
    return () => {
      if (progressRef.current) clearInterval(progressRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const simulateProgress = () => {
    setProgress(0)
    if (progressRef.current) clearInterval(progressRef.current)
    progressRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev
        return prev + 10
      })
    }, 1000)
  }

  const generateContent = async () => {
    setIsGenerating(true)
    setError(null)
    setGeneratedContent(null)
    simulateProgress()

    try {
      // Get stored data from previous steps
      const audience = localStorage.getItem('selectedAudience') || 'General tourism audience'
      const interests = localStorage.getItem('selectedInterests') || 'Cultural experiences'
      const persona = localStorage.getItem('userPersona') || 'casual'
      const userContext = localStorage.getItem('userStoryContext') || 'Amazing cultural experience'

      // All relevant fields for Claude
      const payload = {
        messages: [
          {
            role: "user",
            content: `Write a compelling tourism story for a ${persona} about ${userContext} in Auckland, New Zealand. Audience: ${audience}. Interests: ${interests}.`
          }
        ]
      }

      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (progressRef.current) clearInterval(progressRef.current)
      setProgress(100)

      if (!response.ok) {
        let errorData: any = {}
        try { errorData = await response.json() } catch {}
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      // Store generated content
      localStorage.setItem('generatedContent', JSON.stringify(data))
      setGeneratedContent(data)
      setTimeout(() => setIsGenerating(false), 1000)
    } catch (err: any) {
      if (progressRef.current) clearInterval(progressRef.current)
      setProgress(100)
      setError(err?.message || 'Failed to generate content')
      setIsGenerating(false)
    }
  }

  const handleRetry = () => {
    if (isGenerating) return
    setProgress(0)
    generateContent()
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`,
      color: 'white'
    }}>
      {/* Header with Step Tracker */}
      <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          {[1,2,3,4,5].map(step => (
            <div key={step} style={{
              width: '2rem', height: '2rem', borderRadius: '50%',
              backgroundColor: step <= 4 ? '#10b981' : step === 5 ? BRAND_ORANGE : '#ffffff40',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.875rem', fontWeight: '600'
            }}>
              {step}
            </div>
          ))}
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: '700', marginBottom: '1rem' }}>
          ✨ Creating Your Tourism Story
        </h1>
        <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', opacity: 0.9 }}>
          AI is crafting compelling content based on your photo and audience preferences
        </p>
      </div>

      {/* Content Generation Area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        {isGenerating && !error ? (
          <div style={{ textAlign: 'center', maxWidth: '600px' }}>
            {/* Progress Animation */}
            <div style={{ 
              width: '120px', height: '120px', margin: '0 auto 2rem',
              borderRadius: '50%', border: '8px solid rgba(255,255,255,0.2)',
              borderTop: '8px solid white', animation: 'spin 1s linear infinite'
            }} />
            {/* Progress Bar */}
            <div style={{ 
              width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '4px', marginBottom: '1rem', overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress}%`, height: '100%', backgroundColor: 'white',
                borderRadius: '4px', transition: 'width 0.5s ease'
              }} />
            </div>
            <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
              {progress < 30 ? '📸 Analyzing your photo and preferences...' :
               progress < 60 ? '🎯 Understanding your audience...' :
               progress < 90 ? '✍️ Crafting your personalized story...' :
               '🎉 Finalizing your tourism content...'}
            </p>
            <p style={{ opacity: 0.8 }}>
              Professional AI content generation in progress...
            </p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', maxWidth: '600px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Generation Failed</h2>
            <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
              {error}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={handleRetry}
                style={{
                  padding: '1rem 2rem', fontSize: '1.25rem', fontWeight: '600',
                  backgroundColor: isGenerating ? 'rgba(255,255,255,0.4)' : 'white',
                  color: BRAND_PURPLE, borderRadius: '1rem',
                  border: 'none', cursor: isGenerating ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}
                disabled={isGenerating}
              >
                Try Again
              </button>
              <Link href="/dashboard/create/interests" style={{
                display: 'inline-block', padding: '1rem 2rem', fontSize: '1.25rem',
                fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white',
                borderRadius: '1rem', textDecoration: 'none'
              }}>
                ← Back
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Story Created Successfully!</h2>
            <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
              Your AI-powered tourism content is ready for review and distribution
            </p>
            <Link href="/dashboard/create/results" style={{
              display: 'inline-block', padding: '1rem 2rem', fontSize: '1.25rem',
              fontWeight: '600', backgroundColor: 'white', color: BRAND_PURPLE,
              borderRadius: '1rem', textDecoration: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}>
              Review Your Story →
            </Link>
          </div>
        )}
      </div>
      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ color: BRAND_PURPLE, fontSize: '1.25rem', fontWeight: '900' }}>click</span>
          <span style={{ color: BRAND_ORANGE, fontSize: '1.25rem', fontWeight: '900' }}>speak</span>
          <span style={{ color: BRAND_BLUE, fontSize: '1.25rem', fontWeight: '900' }}>send</span>
        </div>
      </div>
    </div>
  )
}
