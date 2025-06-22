'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const BRAND_PURPLE = '#6B2EFF'
const BRAND_ORANGE = '#FF7B1C' 
const BRAND_BLUE = '#11B3FF'

export default function EnhancedStory() {
  const [story, setStory] = useState('')
  const [inputMethod, setInputMethod] = useState<'type' | 'record'>('type')
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)

  // Load photo and any existing caption from previous steps
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const photo = localStorage.getItem('selectedPhoto')
      const startingContent = localStorage.getItem('storyStart') || localStorage.getItem('quickCaption') || ''
      
      if (photo) {
        setSelectedPhoto(photo)
      } else {
        // Redirect back if no photo
        window.location.href = '/dashboard/create/photo'
      }
      
      if (startingContent) {
        setStory(startingContent)
        localStorage.removeItem('storyStart') // Clean up
      }
    }
  }, [])

  const handleRecord = () => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser. Please use Chrome, Safari, or Edge, or switch to Write mode.');
      return;
    }

    if (isRecording) {
      // Stop recording
      if (recognition) {
        recognition.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const newRecognition = new SpeechRecognition();
      
      newRecognition.continuous = true;
      newRecognition.interimResults = true;
      newRecognition.lang = 'en-US'; // Can be made dynamic for tourists
      
      let finalTranscript = story; // Keep existing story content
      
      newRecognition.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        setStory(finalTranscript + interimTranscript);
      };
      
      newRecognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        
        if (event.error === 'no-speech') {
          alert('No speech detected. Please try again and speak clearly.');
        } else if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access and try again.');
        } else {
          alert('Speech recognition error. Please try again or use Write mode.');
        }
      };
      
      newRecognition.onend = () => {
        setIsRecording(false);
      };
      
      setRecognition(newRecognition);
      newRecognition.start();
      setIsRecording(true);
    }
  };

  const handleNext = () => {
    if (story.trim()) {
      localStorage.setItem('currentStory', story.trim())
      localStorage.setItem('storyInputMethod', inputMethod)
      localStorage.setItem('userChoice', 'enhanced')
      window.location.href = '/dashboard/create/demographics'
    } else {
      alert('Please share your story before continuing.')
    }
  }

  const handleClaudeEnhancement = () => {
    if (!story.trim()) {
      alert('Please write your story first, then we can enhance it with Claude AI.');
      return;
    }

    // Store current story for Claude enhancement
    localStorage.setItem('currentStory', story.trim())
    localStorage.setItem('userChoice', 'enhanced')
    
    // Create tourism-specific prompt for Claude
    const tourismPrompt = `
TOURISM CONTENT ENHANCEMENT:
Photo: [Travel photo attached]
Basic Story: "${story}"
Location: New Zealand Tourism
Enhancement Level: Professional

Please enhance this tourism story with:
- Compelling narrative for social media and professional sharing
- Platform-specific versions (Instagram, Facebook, LinkedIn, Email)
- Tourism marketing best practices
- Cultural sensitivity and authentic storytelling
- Call-to-action for potential visitors
- Professional quality suitable for tourism industry use

Create content that would make other travelers want to visit this location.
    `;

    // Open Claude with the tourism enhancement prompt
    const claudeUrl = `https://claude.ai?prompt=${encodeURIComponent(tourismPrompt)}`;
    window.open(claudeUrl, '_blank');
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
          Create Your Enhanced Story
        </h1>
        <p className="text-lg text-gray-600 text-center mt-4 max-w-2xl">
          Tell the full story of your amazing experience with professional AI enhancement
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full p-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Photo Preview */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Amazing Photo</h2>
            {selectedPhoto && (
              <div className="mb-6">
                <img 
                  src={selectedPhoto} 
                  alt="Your travel moment" 
                  className="w-full max-h-96 object-cover rounded-2xl shadow-lg"
                />
              </div>
            )}
            
            {/* Enhanced Story Benefits */}
            <div className="bg-purple-50 rounded-2xl p-6">
              <h3 className="font-semibold text-purple-900 mb-4">✨ Enhanced Story Benefits</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✅</span>
                  <span className="text-purple-800">Professional AI enhancement with Claude</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✅</span>
                  <span className="text-purple-800">Optimized for 16+ platforms</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✅</span>
                  <span className="text-purple-800">Demographics targeting</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✅</span>
                  <span className="text-purple-800">QR code generation</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✅</span>
                  <span className="text-purple-800">Cultural intelligence integration</span>
                </div>
              </div>
            </div>
          </div>

          {/* Story Creation */}
          <div>
            {/* Input Method Toggle */}
            <div className="text-center w-full mb-8">
              <div className="inline-flex bg-gray-100 rounded-2xl p-2">
                <button
                  type="button"
                  onClick={() => setInputMethod('type')}
                  className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                    inputMethod === 'type' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600'
                  }`}
                >
                  <span className="mr-2">📝</span>
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setInputMethod('record')}
                  className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                    inputMethod === 'record' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600'
                  }`}
                >
                  <span className="mr-2">🎤</span>
                  Record
                </button>
              </div>
            </div>

            {/* Story Input Area */}
            <div className="text-center w-full mb-8">
              {inputMethod === 'type' ? (
                <div>
                  <textarea
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    placeholder="Tell the full story of your amazing experience here... What made this moment special? What would make others want to visit this place?"
                    className="w-full h-64 p-6 border-2 border-gray-200 rounded-3xl text-lg resize-none outline-none font-sans leading-relaxed focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                  />
                  {story && (
                    <div className="text-sm text-gray-500 mt-3 text-right">
                      {story.length} characters | {story.trim().split(/\s+/).length} words
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-64 border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center bg-gray-50">
                  <div className="text-5xl mb-4">🎤</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    Record Your Story
                  </h3>
                  <button
                    onClick={handleRecord}
                    className={`px-6 py-3 rounded-2xl text-white font-semibold transition-all hover:scale-105 ${
                      isRecording ? 'animate-pulse' : ''
                    }`}
                    style={{ backgroundColor: isRecording ? '#ef4444' : BRAND_PURPLE }}
                  >
                    {isRecording ? '🔴 Stop Recording' : '🎤 Start Recording'}
                  </button>
                  {story && (
                    <div className="mt-4 text-sm text-gray-600 text-center max-w-md">
                      <p className="italic">"{story.substring(0, 100)}..."</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Claude Enhancement Button */}
            {story.trim() && (
              <div className="mb-6">
                <button
                  onClick={handleClaudeEnhancement}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 px-8 rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all hover:scale-105 shadow-lg"
                >
                  ✨ Enhance with Claude AI
                </button>
                <p className="text-sm text-gray-600 text-center mt-2">
                  Get professional tourism content enhancement with world-class AI
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Primary: Continue with current story */}
              <button
                onClick={handleNext}
                disabled={!story.trim()}
                className={`w-full text-xl font-black px-8 py-4 rounded-2xl transition-all ${
                  story.trim() 
                    ? 'text-white shadow-2xl hover:scale-105 cursor-pointer' 
                    : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                }`}
                style={{
                  background: story.trim() 
                    ? `linear-gradient(45deg, ${BRAND_PURPLE} 0%, ${BRAND_ORANGE} 100%)`
                    : undefined
                }}
              >
                Next: Choose Demographics →
              </button>

              {/* Secondary: Back to quick path */}
              <Link 
                href="/dashboard/create/caption"
                className="block w-full py-3 px-6 text-center border-2 border-blue-200 text-blue-700 font-semibold rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                ⚡ Switch to Quick Caption instead
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
          <Link href="/dashboard/create/choice" className="text-gray-600 font-semibold hover:text-gray-900">
            ← Back to Choice
          </Link>
          
          <div className="text-center">
            <Link href="/" className="inline-block text-xl font-black">
              <span style={{ color: BRAND_PURPLE }}>speak</span>
              <span style={{ color: BRAND_ORANGE }}> click</span>
              <span style={{ color: BRAND_BLUE }}> send</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
