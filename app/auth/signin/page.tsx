'use client'
import { useState } from 'react'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

export default function StreamlinedOnboarding() {
  const [currentScreen, setCurrentScreen] = useState(1) // 1: Profile, 2: Pepeha
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

  const completeSetup = () => {
    // Save both profile and pepeha data
    const completeProfile = {
      profile: profileData,
      pepeha: pepehaData,
      completedAt: new Date().toISOString()
    }
    localStorage.setItem('userProfile', JSON.stringify(completeProfile))
    
    // Redirect to dashboard
    window.location.href = '/dashboard'
  }

  // Profile Screen (First)
  const ProfileScreen = () => (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${BRAND_BLUE} 0%, ${BRAND_PURPLE} 100%)`,
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem', paddingTop: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: '700',
          marginBottom: '0.5rem',
          color: 'white'
        }}>
          Kia Ora (Welcome) Your Profile
        </h1>
        <p style={{
          fontSize: '1rem',
          opacity: 0.9,
          maxWidth: '300px',
          margin: '0 auto',
          color: 'white'
        }}>
          Please complete your one-off registration
        </p>
      </div>

      {/* Profile Form */}
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
          
          {/* Name */}
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
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1rem'
              }}
            />
          </div>

          {/* Role/Title */}
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
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1rem',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1rem'
              }}
            >
              <option value="" style={{ color: '#333' }}>Select your role...</option>
              {personaOptions.map((option) => (
                <option key={option.value} value={option.value} style={{ color: '#333' }}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Website */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.75rem',
              fontSize: '0.9rem',
              color: 'white'
            }}>
              Website
            </label>
            <input
              type="url"
              value={profileData.website}
              onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
              placeholder="https://yourwebsite.com (optional)"
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1rem'
              }}
            />
          </div>

          {/* Primary Location */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.75rem',
              fontSize: '0.9rem',
              color: 'white'
            }}>
              Primary Location *
            </label>
            <select
              value={profileData.location}
              onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1rem',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1rem'
              }}
            >
              <option value="" style={{ color: '#333' }}>Select your location...</option>
              <option value="auckland" style={{ color: '#333' }}>Auckland 'Tāmaki Makaurau'</option>
              <option value="wellington" style={{ color: '#333' }}>Wellington 'Te Whanganui-a-Tara'</option>
              <option value="christchurch" style={{ color: '#333' }}>Christchurch 'Ōtautahi'</option>
              <option value="queenstown" style={{ color: '#333' }}>Queenstown 'Tāhuna'</option>
              <option value="rotorua" style={{ color: '#333' }}>Rotorua 'Te Rotorua-nui-a-Kahumatamomoe'</option>
              <option value="tauranga" style={{ color: '#333' }}>Tauranga 'Tauranga Moana'</option>
              <option value="hamilton" style={{ color: '#333' }}>Hamilton 'Kirikiriroa'</option>
              <option value="napier" style={{ color: '#333' }}>Napier 'Ahuriri'</option>
              <option value="nelson" style={{ color: '#333' }}>Nelson 'Whakatū'</option>
              <option value="dunedin" style={{ color: '#333' }}>Dunedin 'Ōtepoti'</option>
              <option value="waiheke-island" style={{ color: '#333' }}>Waiheke Island 'Waiheke'</option>
              <option value="stewart-island" style={{ color: '#333' }}>Stewart Island 'Rakiura'</option>
              <option value="other-nz" style={{ color: '#333' }}>Other NZ location</option>
              <option value="international" style={{ color: '#333' }}>International</option>
            </select>
          </div>

          {/* Story Location */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.75rem',
              fontSize: '0.9rem',
              color: 'white'
            }}>
              Select your story location *
            </label>
            <select
              value={profileData.storyLocation}
              onChange={(e) => setProfileData(prev => ({ ...prev, storyLocation: e.target.value }))}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1rem',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1rem'
              }}
            >
              <option value="" style={{ color: '#333' }}>Select story location...</option>
              <option value="northland" style={{ color: '#333' }}>Northland 'Te Tai Tokerau'</option>
              <option value="auckland" style={{ color: '#333' }}>Auckland 'Tāmaki Makaurau'</option>
              <option value="waikato" style={{ color: '#333' }}>Waikato 'Waikato'</option>
              <option value="bay-of-plenty" style={{ color: '#333' }}>Bay of Plenty 'Te Moana-a-Toi'</option>
              <option value="hawkes-bay" style={{ color: '#333' }}>Hawke's Bay 'Te Matau-a-Māui'</option>
              <option value="wellington" style={{ color: '#333' }}>Wellington 'Te Whanganui-a-Tara'</option>
              <option value="marlborough" style={{ color: '#333' }}>Marlborough 'Te Tauihu-o-te-waka'</option>
              <option value="west-coast" style={{ color: '#333' }}>West Coast 'Te Tai Poutini'</option>
              <option value="canterbury" style={{ color: '#333' }}>Canterbury 'Waitaha'</option>
              <option value="otago" style={{ color: '#333' }}>Otago 'Ō Tākou'</option>
              <option value="southland" style={{ color: '#333' }}>Southland 'Murihiku'</option>
              <option value="waiheke-island" style={{ color: '#333' }}>Waiheke Island 'Waiheke'</option>
              <option value="stewart-island" style={{ color: '#333' }}>Stewart Island 'Rakiura'</option>
              <option value="chatham-islands" style={{ color: '#333' }}>Chatham Islands 'Rēkohu'</option>
              <option value="international" style={{ color: '#333' }}>International location</option>
            </select>
          </div>

          {/* User Type */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.75rem',
              fontSize: '0.9rem',
              color: 'white'
            }}>
              How will you use Click Speak Send? *
            </label>
            <select
              value={profileData.userType}
              onChange={(e) => setProfileData(prev => ({ ...prev, userType: e.target.value }))}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1rem',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1rem'
              }}
            >
              <option value="" style={{ color: '#333' }}>Select usage type...</option>
              <option value="business-marketing" style={{ color: '#333' }}>Business Marketing</option>
              <option value="personal-travel" style={{ color: '#333' }}>Personal Travel Stories</option>
              <option value="professional-content" style={{ color: '#333' }}>Professional Content Creation</option>
              <option value="cultural-education" style={{ color: '#333' }}>Cultural Education</option>
              <option value="tourism-promotion" style={{ color: '#333' }}>Tourism Promotion</option>
            </select>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setCurrentScreen(2)}
            disabled={!profileData.name || !profileData.role || !profileData.location || !profileData.storyLocation || !profileData.userType}
            style={{
              flex: 1,
              background: (profileData.name && profileData.role && profileData.location && profileData.storyLocation && profileData.userType)
                ? `linear-gradient(45deg, ${BRAND_BLUE}, ${BRAND_PURPLE})`
                : 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '1.125rem',
              fontWeight: '600',
              padding: '1rem 2rem',
              borderRadius: '12px',
              border: 'none',
              cursor: (profileData.name && profileData.role && profileData.location && profileData.storyLocation && profileData.userType) ? 'pointer' : 'not-allowed',
              boxShadow: (profileData.name && profileData.role && profileData.location && profileData.storyLocation && profileData.userType) ? '0 4px 15px rgba(0,0,0,0.2)' : 'none'
            }}
          >
            Continue →
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        marginTop: 'auto'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ color: BRAND_PURPLE, fontSize: '1rem', fontWeight: '900' }}>click</span>
          <span style={{ color: BRAND_ORANGE, fontSize: '1rem', fontWeight: '900' }}>speak</span>
          <span style={{ color: BRAND_BLUE, fontSize: '1rem', fontWeight: '900' }}>send</span>
        </div>
      </div>
    </div>
  )

  // Pepeha Screen (Second)
  const PepehaScreen = () => (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`,
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem'
    }}>
      {/* Header */}
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

      {/* Pepeha Form */}
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
          
          {/* Place Connection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.75rem',
              fontSize: '0.9rem',
              color: 'white'
            }}>
              Where do you feel most connected in New Zealand? 🌍
            </label>
            <select
              value={pepehaData.placeConnection}
              onChange={(e) => setPepehaData(prev => ({ ...prev, placeConnection: e.target.value }))}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1rem',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1rem'
              }}
            >
              <option value="" style={{ color: '#333' }}>Select your connection...</option>
              <option value="auckland" style={{ color: '#333' }}>Auckland 'Tāmaki Makaurau'</option>
              <option value="canterbury" style={{ color: '#333' }}>Canterbury 'Waitaha'</option>
              <option value="wellington" style={{ color: '#333' }}>Wellington 'Te Whanganui-a-Tara'</option>
              <option value="otago" style={{ color: '#333' }}>Otago 'Ō Tākou'</option>
              <option value="waikato" style={{ color: '#333' }}>Waikato 'Waikato'</option>
              <option value="bay-of-plenty" style={{ color: '#333' }}>Bay of Plenty 'Te Moana-a-Toi'</option>
              <option value="hawkes-bay" style={{ color: '#333' }}>Hawke's Bay 'Te Matau-a-Māui'</option>
              <option value="northland" style={{ color: '#333' }}>Northland 'Te Tai Tokerau'</option>
              <option value="west-coast" style={{ color: '#333' }}>West Coast 'Te Tai Poutini'</option>
              <option value="marlborough" style={{ color: '#333' }}>Marlborough 'Te Tauihu-o-te-waka'</option>
              <option value="waiheke-island" style={{ color: '#333' }}>Waiheke Island 'Waiheke'</option>
              <option value="stewart-island" style={{ color: '#333' }}>Stewart Island 'Rakiura'</option>
              <option value="other" style={{ color: '#333' }}>Other region</option>
            </select>
          </div>

          {/* Cultural Background */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.75rem',
              fontSize: '0.9rem',
              color: 'white'
            }}>
              What cultural heritage do you bring? 🌏
            </label>
            <select
              value={pepehaData.culturalBackground}
              onChange={(e) => setPepehaData(prev => ({ ...prev, culturalBackground: e.target.value }))}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1rem',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1rem'
              }}
            >
              <option value="" style={{ color: '#333' }}>Select your heritage...</option>
              <option value="maori" style={{ color: '#333' }}>Māori - Tangata whenua</option>
              <option value="pacific" style={{ color: '#333' }}>Pacific Islander</option>
              <option value="european" style={{ color: '#333' }}>European heritage</option>
              <option value="asian" style={{ color: '#333' }}>Asian heritage</option>
              <option value="mixed" style={{ color: '#333' }}>Mixed heritage</option>
              <option value="other-indigenous" style={{ color: '#333' }}>Other indigenous culture</option>
              <option value="prefer-not-say" style={{ color: '#333' }}>Prefer not to say</option>
            </select>
          </div>

          {/* Generational Focus */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.75rem',
              fontSize: '0.9rem',
              color: 'white'
            }}>
              Who do you want to connect with? 👥
            </label>
            <select
              value={pepehaData.generationalFocus}
              onChange={(e) => setPepehaData(prev => ({ ...prev, generationalFocus: e.target.value }))}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1rem',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1rem'
              }}
            >
              <option value="" style={{ color: '#333' }}>Select your audience...</option>
              <option value="gen-z" style={{ color: '#333' }}>Gen Z (1997-2012) - Digital natives</option>
              <option value="millennials" style={{ color: '#333' }}>Millennials (1981-1996) - Experience seekers</option>
              <option value="gen-x" style={{ color: '#333' }}>Gen X (1965-1980) - Quality focused</option>
              <option value="boomers" style={{ color: '#333' }}>Baby Boomers (1946-1964) - Heritage lovers</option>
              <option value="all-ages" style={{ color: '#333' }}>All generations</option>
            </select>
          </div>

          {/* Cultural Tip */}
          <div style={{
            background: 'rgba(34, 197, 94, 0.3)',
            borderRadius: '10px',
            padding: '1rem',
            fontSize: '0.875rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: 'white' }}>🌿 Cultural Intelligence</div>
            <div style={{ opacity: 0.9, color: 'white' }}>
              This helps us create content that respects local iwi, honors seasonal significance, and connects authentically with your chosen audience.
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
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
            onClick={completeSetup}
            style={{
              flex: 1,
              background: `linear-gradient(45deg, ${BRAND_PURPLE}, ${BRAND_ORANGE})`,
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
            Complete Setup →
          </button>
        </div>

        <button
          onClick={completeSetup}
          style={{
            background: 'transparent',
            color: 'rgba(255,255,255,0.7)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
            textDecoration: 'underline'
          }}
        >
          Skip Pepeha and Complete
        </button>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        marginTop: 'auto'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ color: BRAND_PURPLE, fontSize: '1rem', fontWeight: '900' }}>click</span>
          <span style={{ color: BRAND_ORANGE, fontSize: '1rem', fontWeight: '900' }}>speak</span>
          <span style={{ color: BRAND_BLUE, fontSize: '1rem', fontWeight: '900' }}>send</span>
        </div>
      </div>
    </div>
  )

  return currentScreen === 1 ? <ProfileScreen /> : <PepehaScreen />
}
