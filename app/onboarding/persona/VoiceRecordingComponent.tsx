import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Pause, Square, RotateCcw, Volume2, Edit3 } from 'lucide-react';

const VoiceRecordingComponent = ({ onStoryChange, currentStory = '' }) => {
  const [inputMode, setInputMode] = useState('write'); // 'speak' or 'write'
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef(null);
  const intervalRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Check if speech recognition is supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(prev => prev + finalTranscript);
        // Update parent component with the story
        onStoryChange(transcript + finalTranscript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
        setIsPaused(false);
        stopAudioLevel();
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      stopAudioLevel();
    };
  }, [onStoryChange]);

  // Timer for recording
  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRecording, isPaused]);

  // Audio level monitoring
  const startAudioLevel = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const microphone = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      microphone.connect(analyserRef.current);
      
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average);
          
          if (isRecording) {
            requestAnimationFrame(updateAudioLevel);
          }
        }
      };
      
      updateAudioLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopAudioLevel = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setAudioLevel(0);
  };

  const startRecording = () => {
    if (recognitionRef.current && isSupported) {
      setTranscript('');
      setRecordingTime(0);
      setIsRecording(true);
      setIsPaused(false);
      recognitionRef.current.start();
      startAudioLevel();
    }
  };

  const pauseRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsPaused(true);
      stopAudioLevel();
    }
  };

  const resumeRecording = () => {
    if (recognitionRef.current && isPaused) {
      recognitionRef.current.start();
      setIsPaused(false);
      startAudioLevel();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopAudioLevel();
    }
  };

  const clearRecording = () => {
    setTranscript('');
    setRecordingTime(0);
    onStoryChange('');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    onStoryChange(value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Mode Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">How would you like to share your story?</h3>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setInputMode('write')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
              inputMode === 'write' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Edit3 size={20} />
            Write Your Story
          </button>
          
          {isSupported && (
            <button
              onClick={() => setInputMode('speak')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                inputMode === 'speak' 
                  ? 'border-green-500 bg-green-50 text-green-700' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Volume2 size={20} />
              Speak Your Story
            </button>
          )}
        </div>
        
        {!isSupported && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              Voice recording is not supported in your browser. Please use the write option instead.
            </p>
          </div>
        )}
      </div>

      {/* Write Mode */}
      {inputMode === 'write' && (
        <div className="space-y-4">
          <textarea
            value={currentStory}
            onChange={handleTextChange}
            placeholder="Share your cultural tourism story here... What made this experience special? What cultural insights did you gain? How did it connect you to the local community?"
            className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={6}
          />
          <div className="text-sm text-gray-500">
            {currentStory.length}/1000 characters
          </div>
        </div>
      )}

      {/* Speak Mode */}
      {inputMode === 'speak' && isSupported && (
        <div className="space-y-4">
          {/* Recording Controls */}
          <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Mic size={20} />
                Start Recording
              </button>
            ) : (
              <div className="flex items-center gap-4">
                {!isPaused ? (
                  <button
                    onClick={pauseRecording}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    <Pause size={16} />
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={resumeRecording}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Play size={16} />
                    Resume
                  </button>
                )}
                
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Square size={16} />
                  Stop
                </button>
              </div>
            )}
            
            {(isRecording || transcript) && (
              <button
                onClick={clearRecording}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <RotateCcw size={16} />
                Clear
              </button>
            )}
          </div>

          {/* Recording Status */}
          {isRecording && (
            <div className="flex items-center justify-center gap-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-700 font-medium">
                  {isPaused ? 'Recording Paused' : 'Recording...'}
                </span>
              </div>
              <span className="text-red-600 font-mono">{formatTime(recordingTime)}</span>
              
              {/* Audio Level Indicator */}
              <div className="flex items-center gap-1">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-4 rounded-full transition-colors ${
                      audioLevel > i * 25 ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Transcript Display */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Your Story (Speech-to-Text)
            </label>
            <div className="w-full min-h-40 p-4 border border-gray-300 rounded-lg bg-gray-50">
              {transcript || (
                <span className="text-gray-500 italic">
                  Your spoken words will appear here...
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {transcript.length}/1000 characters
            </div>
          </div>

          {/* Recording Tips */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Recording Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Speak clearly and at a moderate pace</li>
              <li>• Pause briefly between sentences</li>
              <li>• Find a quiet environment for best results</li>
              <li>• You can pause and resume recording anytime</li>
            </ul>
          </div>
        </div>
      )}

      {/* Story Prompts */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h4 className="font-medium text-amber-800 mb-2">Story Prompts to Get You Started:</h4>
        <div className="text-sm text-amber-700 space-y-1">
          <p>• What cultural tradition or ceremony did you witness?</p>
          <p>• How did local people welcome you into their community?</p>
          <p>• What surprised you most about the local culture?</p>
          <p>• What food, music, or art form touched your heart?</p>
          <p>• How did this experience change your perspective?</p>
        </div>
      </div>
    </div>
  );
};

export default VoiceRecordingComponent;