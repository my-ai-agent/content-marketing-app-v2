'use client'
import Link from 'next/link'
import { useState, useRef } from 'react'

export default function CreateStory() {
  const [story, setStory] = useState('');
  const [inputMethod, setInputMethod] = useState<'write' | 'speak' | 'photo'>('write');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    let hasContent = false;
    let contentToSave = '';

    if (inputMethod === 'write' && story.trim()) {
      hasContent = true;
      contentToSave = story;
    } else if (inputMethod === 'photo' && (uploadedImage || imageCaption.trim())) {
      hasContent = true;
      contentToSave = imageCaption || 'Photo story';
      // Save image data
      if (uploadedImage) {
        localStorage.setItem('storyImage', uploadedImage);
      }
    } else if (inputMethod === 'speak' && story.trim()) {
      hasContent = true;
      contentToSave = story;
    }

    if (hasContent) {
      localStorage.setItem('currentStory', contentToSave);
      localStorage.setItem('storyInputMethod', inputMethod);
      window.location.href = '/dashboard/create/demographics';
    } else {
      alert('Please add your story content before continuing.');
    }
  };

  const handleSpeak = () => {
    alert('Voice recording feature coming soon!');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const getContentForNext = () => {
    switch (inputMethod) {
      case 'write':
        return story.trim();
      case 'speak':
        return story.trim();
      case 'photo':
        return uploadedImage || imageCaption.trim();
      default:
        return false;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Step 1: Your Story</h1>
          <Link
            href="/dashboard"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto px-4 mb-6">
        <div className="flex items-center">
          <div className="flex-1 bg-blue-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full w-1/3"></div>
          </div>
          <span className="ml-3 text-sm text-gray-600">Step 1 of 3</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              **Speak Click Send** - Share Your Story
            </h2>
            <p className="text-sm text-gray-600">
              Share your cultural story through writing, speaking, or with photos. Choose the method that feels most natural to you.
            </p>
          </div>

          {/* Input Method Toggle */}
          <div className="mb-6">
            <div className="grid grid-cols-3 bg-gray-100 rounded-lg p-1 gap-1">
              <button
                onClick={() => setInputMethod('write')}
                className={`py-3 px-3 rounded-md text-sm font-medium transition-colors ${
                  inputMethod === 'write'
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg mb-1">✍️</span>
                  <span>Write</span>
                </div>
              </button>
              <button
                onClick={() => setInputMethod('speak')}
                className={`py-3 px-3 rounded-md text-sm font-medium transition-colors ${
                  inputMethod === 'speak'
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg mb-1">🎤</span>
                  <span>Speak</span>
                </div>
              </button>
              <button
                onClick={() => setInputMethod('photo')}
                className={`py-3 px-3 rounded-md text-sm font-medium transition-colors ${
                  inputMethod === 'photo'
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg mb-1">📷</span>
                  <span>Photo</span>
                </div>
              </button>
            </div>
          </div>

          {/* Content Input Based on Method */}
          {inputMethod === 'write' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Original Story
              </label>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                rows={8}
                placeholder="Share your story, tradition, or narrative here. Be as detailed as you like - the more context you provide, the better we can adapt it for different audiences and platforms..."
              />
              <div className="mt-2 text-sm text-gray-500">
                {story.length} characters
              </div>
            </div>
          )}

          {inputMethod === 'speak' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voice Recording
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    🎤
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Record Your Story</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Click the button below to start recording your story. Our AI will transcribe and help you craft it for different platforms.
                  </p>
                </div>
                <button
                  onClick={handleSpeak}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  🔴 Start Recording
                </button>
                <p className="text-xs text-gray-500 mt-3">
                  Voice feature powered by real-time AI language interpretation
                </p>
              </div>
              
              {/* Transcribed text area for voice input */}
              {story && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transcribed Text (Edit if needed)
                  </label>
                  <textarea
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    rows={6}
                  />
                </div>
              )}
            </div>
          )}

          {inputMethod === 'photo' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo Story
              </label>
              
              {/* Photo Upload Area */}
              <div className="space-y-4">
                {!uploadedImage ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        📷
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Add a Photo to Your Story</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Upload an image that represents your cultural story
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={() => cameraInputRef.current?.click()}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                          📱 Take Photo
                        </button>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                          📁 Upload File
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        Supports JPG, PNG, HEIC (max 10MB)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Uploaded story"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Hidden file inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Caption Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Story Caption {uploadedImage ? '(Required)' : '(Optional)'}
                  </label>
                  <textarea
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    rows={4}
                    placeholder="Describe the cultural significance of this image, the story behind it, or the tradition it represents..."
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    {imageCaption.length} characters
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cultural Integrity Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-yellow-800 mb-1">Cultural Respect</h3>
            <p className="text-sm text-yellow-700">
              Please ensure your story and images respect cultural values and traditions. We're here to help you share authentic narratives responsibly.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Link
              href="/dashboard"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Save Draft
            </Link>
            <button
              onClick={handleNext}
              disabled={!getContentForNext()}
              className={`font-medium py-3 px-8 rounded-lg transition-colors ${
                getContentForNext()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next: Audience →
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6 mb-4">
          **Speak Click Send** is another **CCC Marketing Pro™ Saas 2025**
        </p>
      </div>
    </main>
  )
}
