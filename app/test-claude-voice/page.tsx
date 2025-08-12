'use client'
import { useState, useRef } from 'react'

export default function TestClaudeVoice() {
  const [isRecording, setIsRecording] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        setAudioBlob(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const runTest = async () => {
    if (!audioBlob) {
      alert('Please record audio first')
      return
    }

    setIsProcessing(true)
    
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)
      if (imageFile) {
        formData.append('image', imageFile)
      }

      const response = await fetch('/api/test-claude-voice', {
        method: 'POST',
        body: formData
      })

      const results = await response.json()
      setTestResults(results)
    } catch (error) {
      console.error('Test failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🧪 Claude Voice Recognition Test</h1>
      
      {/* Image Upload */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>📸 Upload Test Image (Optional)</h3>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
      </div>

      {/* Audio Recording */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>🎤 Record Test Audio</h3>
        <p>Say: "Standing here at Ko Tāne on the beautiful Avon River, I'm witnessing the ancient art of waka navigation brought to life by our tīpuna who crossed Te Moananui-a-Kiwa..."</p>
        
        <button
          onClick={isRecording ? stopRecording : startRecording}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            backgroundColor: isRecording ? '#ef4444' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          {isRecording ? '🛑 Stop Recording' : '🎤 Start Recording'}
        </button>
        
        {audioBlob && <p>✅ Audio recorded successfully!</p>}
      </div>

      {/* Run Test */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={runTest}
          disabled={!audioBlob || isProcessing}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            backgroundColor: '#6B2EFF',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: audioBlob ? 'pointer' : 'not-allowed',
            opacity: audioBlob ? 1 : 0.5
          }}
        >
          {isProcessing ? '⏳ Testing...' : '🧪 Run Claude Test'}
        </button>
      </div>

      {/* Results */}
      {testResults && (
        <div style={{ backgroundColor: '#f0f9ff', padding: '2rem', borderRadius: '1rem' }}>
          <h3>📊 Test Results</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            
            <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem' }}>
              <h4>🔊 Claude Audio Only:</h4>
              <p>{testResults.audioOnly?.transcription || 'No result'}</p>
              <small>Confidence: {testResults.audioOnly?.confidence || 'N/A'}%</small>
            </div>

            {testResults.audioWithImage && (
              <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem' }}>
                <h4>🖼️ Claude Audio + Image:</h4>
                <p>{testResults.audioWithImage?.transcription || 'No result'}</p>
                <small>Confidence: {testResults.audioWithImage?.confidence || 'N/A'}%</small>
              </div>
            )}

            <div style={{ backgroundColor: '#dcfce7', padding: '1rem', borderRadius: '0.5rem' }}>
              <h4>📈 Analysis:</h4>
              <p>{testResults.analysis || 'Analysis pending'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
