'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

interface UserProfile {
  profile: {
    name: string;
    role: string;
    website: string;
    location: string;
    storyLocation: string;
    userType: string;
  };
  pepeha?: {
    placeConnection: string;
    culturalBackground: string;
    generationalFocus: string;
  };
}

// Iwi mapping for cultural context
const getIwiForLocation = (location: string): string => {
  const iwiMapping: { [key: string]: string } = {
    'Auckland / Tāmaki Makaurau': 'Ngāti Whātua Ōrākei',
    'Wellington / Te Whanganui-a-Tara': 'Taranaki Whānui',
    'Christchurch / Ōtautahi': 'Ngāi Tahu',
    'Hamilton / Kirikiriroa': 'Tainui',
    'Tauranga / Tauranga Moana': 'Ngāi Te Rangi',
    'Napier / Ahuriri': 'Ngāti Kahungunu',
    'Dunedin / Ōtepoti': 'Ngāi Tahu',
    'Palmerston North / Papaioea': 'Rangitāne',
    'Nelson / Whakatū': 'Ngāti Kuia',
    'Rotorua / Te Rotorua-nui-a-Kahumatamomoe': 'Te Arawa',
    'New Plymouth / Ngāmotu': 'Taranaki',
    'Whangarei / Whangārei': 'Ngāti Whātua',
    'Invercargill / Waihōpai': 'Ngāi Tahu',
    'Gisborne / Tūranga-nui-a-Kiwa': 'Ngāti Porou',
    'Whanganui / Whanganui': 'Whanganui',
    'Queenstown / Tāhuna': 'Ngāi Tahu',
    'Canterbury / Waitaha': 'Ngāi Tahu',
    'Otago / Ō Tākou': 'Ngāi Tahu',
    'Waiheke Island / Waiheke': 'Ngāti Pāoa',
    'Stewart Island / Rakiura': 'Ngāi Tahu'
  };
  
  return iwiMapping[location] || 'Local iwi';
};

export default function TellYourStory() {
  const [story, setStory] = useState('')
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [storyLocation, setStoryLocation] = useState('')

  // Location options for story context
  const locationOptions = [
    'Auckland / Tāmaki Makaurau',
    'Wellington / Te Whanganui-a-Tara', 
    'Christchurch / Ōtautahi',
    'Hamilton / Kirikiriroa',
    'Tauranga / Tauranga Moana',
    'Napier / Ahuriri',
    'Dunedin / Ōtepoti',
    'Palmerston North / Papaioea',
    'Nelson / Whakatū',
    'Rotorua / Te Rotorua-nui-a-Kahumatamomoe',
    'New Plymouth / Ngāmotu',
    'Whangarei / Whangārei',
    'Invercargill / Waihōpai',
    'Gisborne / Tūranga-nui-a-Kiwa',
    'Whanganui / Whanganui',
    'Queenstown / Tāhuna',
    'Canterbury / Waitaha',
    'Otago / Ō Tākou',
    'Waiheke Island / Waiheke',
    'Stewart Island / Rakiura'
  ];

  useEffect(() => {
    // Get cultural profile from registration
    const userProfileData = localStorage.getItem('userProfile')
    if (userProfileData) {
      try {
        const profile = JSON.parse(userProfileData)
        setUserProfile(profile)
        // Pre-populate story location with user's registered location
        setStoryLocation(profile.profile?.storyLocation || profile.profile?.location || '')
      } catch (error) {
        console.error('Failed to parse user profile:', error)
      }
    }

    // Get the uploaded photo to display as reference
    const photoData = localStorage.getItem('uploadedPhoto')
    if (photoData) {
      setUploadedPhoto(photoData)
    }

    // Get any existing story
    const existingStory = localStorage.getItem('userStoryContext')
    if (existingStory) {
      setStory(existingStory)
    }

    // Get existing story location
    const existingStoryLocation = localStorage.getItem('storyLocation')
    if (existingStoryLocation) {
      setStoryLocation(existingStoryLocation)
    }
  }, [])

  const handleNext = () => {
    if (story.trim() && storyLocation) {
      localStorage.setItem('userStoryContext', story.trim())
      localStorage.setItem('storyLocation', storyLocation)
      window.location.href = '/dashboard/create/demographics'
    } else {
      alert('Please tell us about your photo and select the story location before continuing.')
    }
  }

  const handleSkip = () => {
    localStorage.setItem('userStoryContext', 'Amazing cultural experience in New Zealand')
    localStorage.setItem('storyLocation', userProfile?.profile?.location || 'Auckland / Tāmaki Makaurau')
    window.location.href = '/dashboard/create/demographics'
  }

  const storyLocationIwi = storyLocation ? getIwiForLocation(storyLocation) : '';

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

        {/* Step Tracker */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '0.5rem', 
          marginBottom: '1.5rem' 
        }}>
          <div style={{ 
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
          }}>1</div>
          
          <div style={{ 
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
          }}>2</div>
          
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            backgroundColor: '#e5e7eb', 
            color: '#9ca3af', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.875rem', 
            fontWeight: '600' 
          }}>3</div>
          
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            backgroundColor: '#e5e7eb', 
            color: '#9ca3af', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.875rem', 
            fontWeight: '600' 
          }}>4</div>
          
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            backgroundColor: '#e5e7eb', 
            color: '#9ca3af', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.875rem', 
            fontWeight: '600' 
          }}>5</div>

          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            backgroundColor: '#e5e7eb', 
            color: '#9ca3af', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.875rem', 
            fontWeight: '600' 
          }}>6</div>
        </div>

        {/* Title with Cultural Greeting */}
        <h1 style={{ 
          fontSize: 'clamp(2rem, 6vw, 4rem)', 
          fontWeight: '700',
          color: '#1f2937',
          lineHeight: '1.2',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          Tell Your Story
        </h1>
        {userProfile && (
          <p style={{ 
            color: BRAND_PURPLE, 
            textAlign: 'center', 
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            fontWeight: '600',
            marginBottom: '0.5rem'
          }}>
            Kia ora, {userProfile.profile.name}! 🌿
          </p>
        )}
        <p style={{ 
          color: '#6b7280', 
          textAlign: 'center', 
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Share your story with cultural intelligence and manaakitanga
        </p>
      </div>

      <div style={{ 
        flex: '1', 
        maxWidth: '900px', 
        margin: '0 auto', 
        width: '100%', 
        padding: '2rem 1rem' 
      }}>

        {/* Cultural Context Display */}
        {userProfile && (
          <div style={{
            backgroundColor: '#f0f9ff',
            border: '2px solid #0284c7',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#0c4a6e',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🏛️ Your Cultural Profile
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              fontSize: '0.875rem'
            }}>
              <div>
                <span style={{ fontWeight: '600', color: '#0c4a6e' }}>Role:</span>
                <span style={{ marginLeft: '0.5rem', color: '#374151' }}>
                  {userProfile.profile.role}
                </span>
              </div>
              <div>
                <span style={{ fontWeight: '600', color: '#0c4a6e' }}>Location:</span>
                <span style={{ marginLeft: '0.5rem', color: '#374151' }}>
                  {userProfile.profile.location}
                </span>
              </div>
              {userProfile.pepeha?.culturalBackground && (
                <div>
                  <span style={{ fontWeight: '600', color: '#0c4a6e' }}>Heritage:</span>
                  <span style={{ marginLeft: '0.5rem', color: '#374151' }}>
                    {userProfile.pepeha.culturalBackground}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Photo Reference */}
        {uploadedPhoto && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: '2rem' 
          }}>
            <div style={{
              borderRadius: '1rem',
              overflow: 'hidden',
              border: '3px solid #e5e7eb',
              maxWidth: '300px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <img 
                src={uploadedPhoto} 
                alt="Your uploaded photo" 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  display: 'block' 
                }}
              />
            </div>
          </div>
        )}

        {/* Story Location Selection */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{
            display: 'block',
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.75rem'
          }}>
            📍 Where was this photo taken?
          </label>
          
          <select
            value={storyLocation}
            onChange={(e) => setStoryLocation(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              backgroundColor: 'white',
              color: '#374151',
              outline: 'none',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
              marginBottom: '0.5rem'
            }}
            onFocus={(e) => e.target.style.borderColor = BRAND_PURPLE}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          >
            <option value="">Select location...</option>
            {locationOptions.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          {storyLocationIwi && (
            <p style={{
              fontSize: '0.875rem',
              color: '#059669',
              marginTop: '0.5rem',
              fontWeight: '500'
            }}>
              🌿 Honoring {storyLocationIwi} as tangata whenua of this place
            </p>
          )}
        </div>

        {/* Story Input */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{
            display: 'block',
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.75rem'
          }}>
            What's the story behind this photo? ✨
          </label>
          
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Share your experience... What made this moment special? What happened here? How did this place make you feel?"
            style={{
              width: '100%',
              minHeight: '200px',
              padding: '1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '1rem',
              fontSize: '1rem',
              lineHeight: '1.5',
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => e.target.style.borderColor = BRAND_PURPLE}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
          
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginTop: '0.5rem'
          }}>
            Your cultural profile helps AI create content that honors iwi traditions and resonates with your chosen audience
          </p>
        </div>

        {/* Navigation Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleSkip}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '500',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '2px solid #e5e7eb',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#9ca3af'
              e.currentTarget.style.color = '#374151'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.color = '#6b7280'
            }}
          >
            Skip for now
          </button>

          <button
            onClick={handleNext}
            disabled={!story.trim() || !storyLocation}
            style={{
              background: (story.trim() && storyLocation)
                ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                : '#e5e7eb',
              color: (story.trim() && storyLocation) ? 'white' : '#9ca3af',
              fontSize: '1.25rem',
              fontWeight: '700',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              border: 'none',
              cursor: (story.trim() && storyLocation) ? 'pointer' : 'not-allowed',
              boxShadow: (story.trim() && storyLocation) ? '0 4px 15px rgba(107, 46, 255, 0.3)' : 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (story.trim() && storyLocation) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(107, 46, 255, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (story.trim() && storyLocation) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(107, 46, 255, 0.3)'
              }
            }}
          >
            Continue →
          </button>
        </div>

        {/* Cultural Intelligence Value Proposition */}
        <div style={{
          backgroundColor: '#dcfce7',
          border: '1px solid #bbf7d0',
          borderRadius: '1rem',
          padding: '1.5rem',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🌿</span>
          <span style={{ 
            color: '#15803d', 
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            fontWeight: '500'
          }}>
            Cultural intelligence ensures your content respects iwi traditions and connects authentically with your audience
          </span>
        </div>

        {/* Logo */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          paddingTop: '2rem'
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
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
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={{ 
        padding: '1.5rem', 
        textAlign: 'center',
        borderTop: '1px solid #f3f4f6'
      }}>
        <Link 
          href="/dashboard/create/photo"
          style={{ 
            color: '#6b7280', 
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)'
          }}
        >
          ← Back to Photo
        </Link>
      </div>
    </div>
  )
}
