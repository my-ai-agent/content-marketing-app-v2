'use client'
import React, { useState, useRef } from 'react'

interface MultiInputProps {
  value: string
  onChange: (val: string) => void
}

export default function MultiInput({ value, onChange }: MultiInputProps) {
  const [tab, setTab] = useState<'write' | 'speak' | 'photo'>('write')
  const [recording, setRecording] = useState(false)
  const recognitionRef = useRef<any>(null)

  // Voice input
  const startRecording = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.lang = 'en-US'
      recognition.continuous = false
      recognition.interimResults = false
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        onChange(transcript)
        setRecording(false)
      }
      recognition.onerror = () => setRecording(false)
      recognitionRef.current = recognition
      recognition.start()
      setRecording(true)
    } else {
      alert('Speech recognition not supported in this browser.')
    }
  }
  const stopRecording = () => {
    recognitionRef.current?.stop()
    setRecording(false)
  }

  // Photo input
  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Placeholder: Add image compression/optimization here
    const reader = new FileReader()
    reader.onloadend = () => {
      onChange((reader.result as string) || '')
    }
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <div className="flex space-x-2 mb-3">
        <button
          onClick={() => setTab('write')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold ${tab === 'write' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
        >✍️ Write</button>
        <button
          onClick={() => setTab('speak')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold ${tab === 'speak' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
        >🎤 Speak</button>
        <button
          onClick={() => setTab('photo')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold ${tab === 'photo' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
        >📸 Photo</button>
      </div>
      {tab === 'write' && (
        <textarea
          className="w-full h-32 rounded-lg border border-gray-300 p-3 text-base"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Share your story, tradition, or narrative here..."
        />
      )}
      {tab === 'speak' && (
        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`w-full py-3 rounded-lg text-white font-bold ${
              recording ? 'bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {recording ? 'Stop Recording' : 'Start Recording'}
          </button>
          <div className="text-xs text-gray-500">{recording ? 'Listening...' : 'Press and speak your story.'}</div>
        </div>
      )}
      {tab === 'photo' && (
        <div>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="w-full"
            onChange={handlePhoto}
          />
          <div className="text-xs text-gray-500 mt-2">Take a photo or upload from gallery. (Images are compressed automatically.)</div>
        </div>
      )}
    </div>
  )
}
