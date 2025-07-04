'use client';

import React, { useState, useRef } from 'react';
import { Mic, MicOff, Play, Pause, Square, RotateCcw, Volume2, Edit3 } from 'lucide-react';

interface VoiceRecordingProps {
  onStoryChange: (story: string) => void;
  currentStory?: string;
}

const VoiceRecordingComponent: React.FC<VoiceRecordingProps> = ({ onStoryChange, currentStory = '' }) => {
  const [inputMode, setInputMode] = useState<'write' | 'speak'>('write'); // 'speak' or 'write'
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [recordingTimeMs, setRecordingTimeMs] = useState<number>(0);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Check if speech recognition is supported
  React.useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        setIsPaused(false);
      };
    }
  }, []);

  const startRecording = async () => {
    if (!isSupported) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Set up audio context for visualization
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      source.connect(analyserRef.current);

      setIsRecording(true);
      setIsPaused(false);
      recognitionRef.current.start();

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTimeMs(prev => prev + 100);
      }, 100);

      // Start audio level monitoring
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
        }
        if (isRecording) {
          requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();

    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTimeMs(0);
    setAudioLevel(0);
    
    // Update the story with the transcript
    if (transcript) {
      onStoryChange(transcript);
    }
  };

  const pauseRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (recognitionRef.current && isPaused) {
      recognitionRef.current.start();
      setIsPaused(false);
    }
  };

  const resetRecording = () => {
    stopRecording();
    setTranscript('');
    setRecordingTimeMs(0);
  };

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setTranscript(value);
    onStoryChange(value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Share Your Story</h3>
        
        {/* Input Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
          <button
            onClick={() => setInputMode('write')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              inputMode === 'write' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Edit3 className="inline-block w-4 h-4 mr-2" />
            Write
          </button>
          <button
            onClick={() => setInputMode('speak')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              inputMode === 'speak' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            disabled={!isSupported}
          >
            <Mic className="inline-block w-4 h-4 mr-2" />
            Speak
          </button>
        </div>

        {!isSupported && inputMode === 'speak' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
            <p className="text-sm text-yellow-800">
              Voice recording is not supported in your browser. Please use the write mode or try a different browser.
            </p>
          </div>
        )}
      </div>

      {inputMode === 'write' ? (
        <div>
          <textarea
            value={transcript || currentStory}
            onChange={handleTextAreaChange}
            placeholder="Tell us your story..."
            className="w-full h-40 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Recording Controls */}
          <div className="flex items-center justify-center space-x-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={!isSupported}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-full transition-colors"
              >
                <Mic className="w-5 h-5" />
                <span>Start Recording</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                {!isPaused ? (
                  <button
                    onClick={pauseRecording}
                    className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button
                    onClick={resumeRecording}
                    className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full"
                  >
                    <Play className="w-4 h-4" />
                    <span>Resume</span>
                  </button>
                )}
                
                <button
                  onClick={stopRecording}
                  className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full"
                >
                  <Square className="w-4 h-4" />
                  <span>Stop</span>
                </button>
                
                <button
                  onClick={resetRecording}
                  className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            )}
          </div>

          {/* Recording Status */}
          {isRecording && (
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>{isPaused ? 'Paused' : 'Recording'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4" />
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${Math.min(audioLevel, 100)}%` }}
                  ></div>
                </div>
              </div>
              <span>{formatTime(recordingTimeMs)}</span>
            </div>
          )}

          {/* Transcript Display */}
          {transcript && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Transcript:</h4>
              <div className="bg-gray-50 p-3 rounded-md border">
                <p className="text-sm text-gray-800">{transcript}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceRecordingComponent;