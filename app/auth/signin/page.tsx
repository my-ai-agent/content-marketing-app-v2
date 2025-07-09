'use client'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C'
const BRAND_BLUE = '#11B3FF'

export default function AuthOptionsPage() {
  const handleFreeTrial = () => {
    window.location.href = '/'
  }

  const handleViewPlans = () => {
    window.location.href = '/plans'
  }

  const handleSignIn = () => {
    window.location.href = '/auth/signin'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${BRAND_BLUE} 0%, ${BRAND_PURPLE} 100%)`,
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Simple Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: '700',
          marginBottom: '1rem',
          color: 'white'
        }}>
          Kia ora (Welcome)
        </h1>
        <p style={{
          fontSize: '1rem',
          opacity: 0.9,
          maxWidth: '350px',
          margin: '0 auto',
          color: 'white'
        }}>
          Please select from the following sign-in options
        </p>
      </div>

      {/* Three Button Options */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '400px',
        margin: '0 auto',
        width: '100%',
        gap: '1.5rem'
      }}>
        
        {/* Free 7-Day Trial Button */}
        <button
          onClick={handleFreeTrial}
          title="Start creating content immediately with no account required. Perfect for testing our platform."
          style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '2rem',
            border: '2px solid rgba(255,255,255,0.2)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            fontSize: '1rem',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚀</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'white' }}>
            Free 7-Day Trial
          </h3>
          <p style={{ opacity: 0.9, fontSize: '0.9rem', margin: 0, color: 'white' }}>
            Test our platform immediately - no account required
          </p>
        </button>

        {/* New User (View Plans) Button */}
        <button
          onClick={handleViewPlans}
          title="Explore our pricing plans: Starter ($47), Professional ($147), Enterprise ($547). All include 7-day free trial."
          style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '2rem',
            border: '2px solid rgba(255,255,255,0.2)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            fontSize: '1rem',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💎</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'white' }}>
            New User (View Plans)
          </h3>
          <p style={{ opacity: 0.9, fontSize: '0.9rem', margin: 0, color: 'white' }}>
            Explore plans and create your cultural profile
          </p>
        </button>

        {/* Sign In (Existing Client) Button */}
        <button
          onClick={handleSignIn}
          title="Already have an account? Sign in with your email and password to access your dashboard."
          style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '2rem',
            border: '2px solid rgba(255,255,255,0.2)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            fontSize: '1rem',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔑</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'white' }}>
            Sign In (Existing Client)
          </h3>
          <p style={{ opacity: 0.9, fontSize: '0.9rem', margin: 0, color: 'white' }}>
            Access your account and continue creating
          </p>
        </button>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '2rem',
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
}
