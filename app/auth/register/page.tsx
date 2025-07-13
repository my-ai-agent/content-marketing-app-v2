'use client'
import { useState } from 'react'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

export default function WorkingRegistrationForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: {[key: string]: string} = {}
    
    if (!email) newErrors.email = 'Email required'
    if (!password) newErrors.password = 'Password required'
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords must match'
    if (!privacyConsent) newErrors.privacyConsent = 'Privacy consent is required to use Click Speak Send'
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      // Registration successful
      const userProfile = {
        auth: { email },
        profile: { name: 'Test User', role: 'cultural-explorer', location: 'Auckland / Tāmaki Makaurau' },
        privacy: { consentGiven: true, consentDate: new Date().toISOString() },
        completedAt: new Date().toISOString()
      }
      
      localStorage.setItem('userToken', 'new-user-token-' + Date.now())
      localStorage.setItem('userProfile', JSON.stringify(userProfile))
      
      window.location.href = '/dashboard'
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${BRAND_BLUE} 0%, ${BRAND_PURPLE} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#333',
            marginBottom: '0.5rem'
          }}>
            Create Account
          </h1>
          <p style={{ color: '#666' }}>Start your free trial</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#333'
            }}>
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
            {errors.email && <div style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>{errors.email}</div>}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#333'
            }}>
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
            {errors.password && <div style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>{errors.password}</div>}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#333'
            }}>
              Confirm Password *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
            {errors.confirmPassword && <div style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>{errors.confirmPassword}</div>}
          </div>

          // Replace the Privacy Consent Section (around line 95-125) with this:

{/* Privacy Consent Section */}
<div style={{
  marginBottom: '2rem',
  padding: '1rem',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  border: '1px solid #e2e8f0'
}}>
  <div style={{
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px'
  }}>
    <input
      type="checkbox"
      id="privacyConsent"
      checked={privacyConsent}
      onChange={(e) => {
        setPrivacyConsent(e.target.checked)
        if (errors.privacyConsent) {
          setErrors(prev => ({ ...prev, privacyConsent: '' }))
        }
      }}
      style={{
        marginTop: '2px',
        width: '18px',
        height: '18px',
        accentColor: BRAND_PURPLE,
        cursor: 'pointer'
      }}
      required
    />
    <div style={{ flex: 1 }}>
      <label htmlFor="privacyConsent" style={{
        fontSize: '0.9rem',
        lineHeight: '1.4',
        color: '#374151',
        cursor: 'pointer',
        display: 'block'
      }}>
        I consent to my story/photo being used for AI content generation, and understand that this will be deleted from AI's memory after processing.
      </label>
      {errors.privacyConsent && (
        <p style={{
          color: '#ef4444',
          fontSize: '0.8rem',
          marginTop: '0.5rem',
          margin: '0.5rem 0 0 0'
        }}>
          {errors.privacyConsent}
        </p>
      )}
    </div>
  </div>
</div>

          <button
            type="submit"
            style={{
              width: '100%',
              background: `linear-gradient(45deg, ${BRAND_PURPLE}, ${BRAND_ORANGE})`,
              color: 'white',
              fontSize: '18px',
              fontWeight: '600',
              padding: '14px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            Create Account
          </button>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => window.location.href = '/auth'}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              ← Back to Options
            </button>
          </div>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          fontSize: '1.2rem',
          fontWeight: '900'
        }}>
          <span style={{ color: BRAND_PURPLE }}>click</span>
          <span style={{ color: BRAND_ORANGE }}> speak</span>
          <span style={{ color: BRAND_BLUE }}> send</span>
        </div>
      </div>
    </div>
  )
}
