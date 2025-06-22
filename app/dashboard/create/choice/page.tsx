'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C' 
const BRAND_BLUE = '#11B3FF'

export default function ChoicePoint() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [userChoice, setUserChoice] = useState<'quick' | 'enhanced' | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Load photo from previous step
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const photo = localStorage.getItem('selectedPhoto')
      if (photo) {
        setSelectedPhoto(photo)
      }

      const checkMobile = () => setIsMobile(window.innerWidth <= 768)
      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const handleQuickPath = () => {
    localStorage.setItem('userChoice', 'quick')
    window.location.href = '/dashboard/create/caption'
  }

  const handleEnhancedPath = () => {
    localStorage.setItem('userChoice', 'enhanced')
    window.location.href = '/dashboard/create/story'
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* Header with Step Tracker */}
      <div className="flex flex-col justify-center items-center p-8 border-b border-gray-200">

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
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#10b981' }}></div>
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
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#e5e7eb' }}></div>
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
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#e5e7eb' }}></div>
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
          <div style={{ width: '2.5rem', height: '2px', backgroundColor: '#e5e7eb' }}></div>
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
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 text-center">
          How would you like to share this?
        </h1>
        <p className="text-lg text-gray-600 text-center mt-4 max-w-2xl">
          Choose the perfect way to share your amazing photo with the world
        </p>
      </div>

      {/* Photo Preview */}
      {selectedPhoto && (
        <div className="flex justify-center p-8">
          <div className="max-w-md w-full">
            <img 
              src={selectedPhoto} 
              alt="Your amazing moment" 
              className="w-full h-64 object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>
      )}

      {/* Choice Options */}
      <div className="flex-1 max-w-6xl mx-auto w-full p-8">
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-8' : 'grid-cols-2 gap-12'} mb-12`}>
          
          {/* Quick Caption Option */}
          <div 
            onClick={handleQuickPath}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-3xl p-8 cursor-pointer hover:border-blue-400 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="text-center">
              <div className="text-6xl mb-6">⚡</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Caption</h2>
              <p className="text-lg text-gray-600 mb-6">
                Perfect for "in-the-moment" sharing
              </p>
              
              <div className="bg-white rounded-2xl p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">What you get:</h3>
                <ul className="text-left text-gray-600 space-y-2">
                  <li>• Single sentence acknowledgment</li>
                  <li>• Location + moment recognition</li>
                  <li>• Instant social sharing</li>
                  <li>• Auto-optimized for major platforms</li>
                </ul>
              </div>

              <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1">
                  <span className="text-blue-500">⏱️</span>
                  30 seconds
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-500">📱</span>
                  Perfect for mobile
                </span>
              </div>

              <div className="bg-blue-100 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800 italic">
                  "Sarah @ Milford Sound - breathtaking sunset over the fjords"
                </p>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-4 px-8 rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 group-hover:scale-105">
                Share Instantly ⚡
              </button>
            </div>
          </div>

          {/* Enhanced Story Option */}
          <div 
            onClick={handleEnhancedPath}
            className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-3xl p-8 cursor-pointer hover:border-purple-400 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="text-center">
              <div className="text-6xl mb-6">✨</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Enhanced Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Professional content for maximum impact
              </p>
              
              <div className="bg-white rounded-2xl p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">What you get:</h3>
                <ul className="text-left text-gray-600 space-y-2">
                  <li>• Rich storytelling experience</li>
                  <li>• Demographics & targeting</li>
                  <li>• AI-enhanced with Claude</li>
                  <li>• 16+ platform optimization</li>
                  <li>• QR code generation</li>
                </ul>
              </div>

              <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1">
                  <span className="text-purple-500">⏱️</span>
                  3-5 minutes
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-orange-500">🤖</span>
                  AI-powered
                </span>
              </div>

              <div className="bg-purple-100 rounded-xl p-4 mb-6">
                <p className="text-sm text-purple-800 italic">
                  "Today's helicopter tour over Milford Sound revealed why this is considered one of the world's most beautiful places..."
                </p>
              </div>

              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 group-hover:scale-105">
                Create Professional Story ✨
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-center">
          <Link href="/dashboard/create" className="text-gray-600 font-semibold hover:text-gray-900 flex items-center gap-2">
            ← Back to Photo
          </Link>
        </div>
      </div>

      {/* Logo */}
      <div className="text-center pt-8 pb-6">
        <h1 className="text-2xl font-black">
          <span style={{ color: BRAND_PURPLE }}>speak</span>
          <span style={{ color: BRAND_ORANGE }}> click</span>
          <span style={{ color: BRAND_BLUE }}> send</span>
        </h1>
      </div>
    </div>
  )
}
