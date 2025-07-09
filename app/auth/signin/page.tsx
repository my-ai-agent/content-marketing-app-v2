'use client'
import { useState } from 'react'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

export default function CulturalSignUpForm() {
  const [currentScreen, setCurrentScreen] = useState(1) // 1: Email/Password, 2: Profile, 3: Pepeha
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [profileData, setProfileData] = useState({
    name: '',
    role: '',
    website: '',
    location: '',
    storyLocation: '',
    userType: ''
  })
  const [pepehaData, setPepehaData] = useState({
    placeConnection: '',
    culturalBackground: '',
    generationalFocus: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const personaOptions = [
    { value: 'free-independent-traveller', label: 'Free & Independent Traveller' },
    { value: 'visiting-friends-family', label: 'Visiting Friends & Family' },
    { value: 'storyteller-writer', label: 'Storyteller/Writer' },
    { value: 'professional-business-owner', label: 'Professional/Business Owner' },
    { value: 'influencer-content-creator', label: 'Influencer/Content Creator' },
    { value: 'adventure-seeker', label: 'Adventure Seeker' },
    { value: 'female-traveller', label: 'Female Traveller' },
    { value: 'cultural-explorer', label: 'Cultural Explorer' },
    { value: 'eco-tourism-champion', label: 'Eco Tourism Champion' }
  ]

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validateAuthData = () => {
    const newErrors: any = {}
    
    if (!authData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(authData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!authData.password) {
      newErrors.password = 'Password is required'
    } else if (authData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!authData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (authData.password !== authData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateProfileData = () => {
    const newErrors: any = {}
    
    if (!profileData.name) newErrors.name = 'Name is required'
    if (!profileData.role) newErrors.role = 'Role is required'
    if (!profileData.location) newErrors.location = 'Location is required'
    if (!profileData.storyLocation) newErrors.storyLocation = 'Story location is required'
    if (!profileData.userType) newErrors.userType = 'Usage type is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const completeSignUp = async () => {
    setIsLoading(true)
    
    try {
      // Combine all registration data
      const completeProfile = {
        auth: {
          email: authData.email,
          // In real app, password would be hashed on backend
        },
        profile: profileData,
        pepeha: pepehaData,
        completedAt: new Date().toISOString()
      }
      
      // Store authentication data (simulate successful registration)
      localStorage.setItem('userToken', 'new-user-token-' + Date.now())
      localStorage.setItem('userProfile', JSON.stringify(completeProfile))
      
      // Redirect to dashboard
      window.location.href = '/dashboard'
      
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // Screen 1: Email & Password
  const AuthScreen = () => (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${BRAND_BLUE} 0%, ${BRAND_PURPLE} 100%)`,
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem', paddingTop: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: '700',
          marginBottom: '0.5rem',
          color: 'white'
        }}>
          Create Your Account
        </h1>
        <p style={{
          fontSize: '1rem',
          opacity: 0.9,
          maxWidth: '300px',
          margin: '0 auto',
          color: 'white'
        }}>
          Start with your email and password
        </p>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '400px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '2rem',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem'
        }}>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.75rem',
              fontSize: '0.9rem',
              color: 'white'
            }}>
              Email Address *
            </label>
            <input
              type="email"
              value={authData.email}
              onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: (errors as any).email ? '2px solid #ef4444' : 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1rem'
              }}
            />
            {(errors as any).email && (
              <div style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.email}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.75rem',
              fontSize: '0.9rem',
              color: 'white'
            }}>
              Password *
            </label>
            <input
              type="password"
              value={authData.password}
              onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Create a password (min 6 characters)"
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: errors.password ? '2px solid #ef4444' : 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1rem'
              }}
            />
            {(errors as any).password && (
              <div style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.password}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.75rem',
              fontSize: '0.9rem',
              color: 'white'
            }}>
              Confirm Password *
            </label>
            <input
              type="password"
              value={authData.confirmPassword}
              onChange={(e) => setAuthData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Confirm your password"
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: errors.confirmPassword ? '2px solid #ef4444' : 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1rem'
              }}
            />
            {(errors as any).confirmPassword && (
              <div style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.confirmPassword}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (validateAuthData()) {
                setCurrentScreen(2)
              }
            }}
            style={{
              width: '100%',
              background: `linear-gradient(45deg, ${BRAND_BLUE}, ${BRAND_PURPLE})`,
              color: 'white',
              fontSize: '1.125rem',
              fontWeight: '600',
              padding: '1rem 2rem',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            Continue to Profile →
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <button
            onClick={() => window.location.href = '/auth'}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ← Back to Options
          </button>
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        padding: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        marginTop: 'auto'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '1rem',
          fontWeight: '900'
        }}>
          <span style={{ color: BRAND_PURPLE }}>click</span>
          <span style={{ color: BRAND_ORANGE }}>speak</span>
          <span style={{ color: BRAND_BLUE }}>send</span>
        </div>
      </div>
    </div>
  )

  // Screen 2: Profile Data (reuse from our cultural onboarding)
  const ProfileScreen = () => (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${BRAND_BLUE} 0%, ${BRAND_PURPLE} 100%)`,
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem', paddingTop: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: '700',
          marginBottom: '0.5rem',
          color: 'white'
        }}>
          Your Profile
        </h1>
        <p style={{
          fontSize: '1rem',
          opacity: 0.9,
          maxWidth: '300px',
          margin: '0 auto',
          color: 'white'
        }}>
          Complete your profile for personalized content
        </p>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '400px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '2rem',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem'
        }}>
          
          {/* Profile form fields - same as our cultural onboarding */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.75rem',
              fontSize: '0.9rem',
              color: 'white'
            }}>
              Full Name *
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: errors.name ? '2px solid #ef4444' : 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1rem'
              }}
            />
            {(errors as any).name && (
              <div style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {(errors as any).name}
              </div>
            )}
          </div>

          {/* Role dropdown */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.75rem',
              fontSize: '0.9rem',
              color: 'white'
            }}>
              Your Role/Title *
            </label>
            <select
              value={profileData.role}
              onChange={(e) => setProfileData(prev => ({ ...prev, role: e.target.value }))}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: errors.role ? '2px solid #ef4444' : 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1rem',
                appearance: 'none'
              }}
            >
              <option value="" style={{ color: '#333' }}>Select your role...</option>
              {personaOptions.map((option) => (
                <option key={option.value} value={option.value} style={{ color: '#333' }}>
                  {option.label}
                </option>
              ))}
            </select>
            {(errors as any).role && (
              <div style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {(errors as any).role}
              </div>
            )}
          </div>

          {/* Continue with remaining form fields... */}
          {/* Website, Location, Story Location, User Type */}
          {/* (Same structure as cultural onboarding) */}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setCurrentScreen(1)}
              style={{
                flex: '0 0 auto',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>
            <button
              onClick={() => {
                if (validateProfileData()) {
                  setCurrentScreen(3)
                }
              }}
              style={{
                flex: 1,
                background: `linear-gradient(45deg, ${BRAND_BLUE}, ${BRAND_PURPLE})`,
                color: 'white',
                fontSize: '1.125rem',
                fontWeight: '600',
                padding: '1rem 2rem',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Screen 3: Pepeha (Optional) - same as our cultural onboarding
  const PepehaScreen = () => (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`,
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem'
    }}>
      {/* Pepeha form - same as cultural onboarding */}
      <div style={{ textAlign: 'center', marginBottom: '2rem', paddingTop: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏔️</div>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: '700',
          marginBottom: '0.5rem',
          color: 'white'
        }}>
          Kia ora Pepeha
        </h1>
        <p style={{
          fontSize: '1rem',
          opacity: 0.9,
          maxWidth: '300px',
          margin: '0 auto',
          color: 'white'
        }}>
          Help us create culturally respectful content (optional)
        </p>
      </div>

      {/* Pepeha form fields... */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '400px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '2rem',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem'
        }}>
          {/* Pepeha fields same as cultural onboarding */}
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={() => setCurrentScreen(2)}
              style={{
                flex: '0 0 auto',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>
            <button
              onClick={completeSignUp}
              disabled={isLoading}
              style={{
                flex: 1,
                background: `linear-gradient(45deg, ${BRAND_PURPLE}, ${BRAND_ORANGE})`,
                color: 'white',
                fontSize: '1.125rem',
                fontWeight: '600',
                padding: '1rem 2rem',
                borderRadius: '12px',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration →'}
            </button>
          </div>

          <button
            onClick={completeSignUp}
            disabled={isLoading}
            style={{
              background: 'transparent',
              color: 'rgba(255,255,255,0.7)',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              textDecoration: 'underline',
              width: '100%'
            }}
          >
            Skip Pepeha and Complete Registration
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {currentScreen === 1 && <AuthScreen />}
      {currentScreen === 2 && <ProfileScreen />}
      {currentScreen === 3 && <PepehaScreen />}
    </>
  )
}
