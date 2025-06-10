'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Results() {
  const [activeTab, setActiveTab] = useState('');
  const [story, setStory] = useState('');
  const [demographics, setDemographics] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [formats, setFormats] = useState<string[]>([]);
  const [socialPlatforms, setSocialPlatforms] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{[key: string]: string}>({});

  // Publishing modal state
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState<string | null>(null);
  const [publishStep, setPublishStep] = useState<'setup' | 'preview' | 'success'>('setup');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [publishOption, setPublishOption] = useState<'now' | 'schedule'>('now');
  const [caption, setCaption] = useState<string>('');

  // Refresh version state
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [versionOptions, setVersionOptions] = useState<Array<{text: string, tone: string, words: number}>>([]);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);

  // Sample generated content
  const sampleGeneratedContent = {
    story: "Discover the hidden gems of Canterbury's wellness scene! From the therapeutic hot springs of Hanmer Springs to the tranquil meditation retreats nestled in the Southern Alps, our region offers the perfect escape for those seeking relaxation and renewal.\n\nWhether you're looking to unwind in luxury spa treatments, practice yoga with mountain views, or simply disconnect from the digital world, Canterbury has something special waiting for you. Come experience the peace and serenity that makes our corner of New Zealand truly magical."
  };

  // Platform data
  const platformData = {
    'facebook': {
      name: 'Facebook',
      icon: '📘',
      description: 'Post directly to your page',
      accounts: ['Your Business Page', 'Personal Profile', 'Community Group'],
      charLimit: 63206,
      features: ['hashtags', 'mentions', 'scheduling']
    },
    'instagram': {
      name: 'Instagram',
      icon: '📷',
      description: 'Stories & posts',
      accounts: ['@yourbusiness', '@personal_account'],
      charLimit: 2200,
      features: ['hashtags', 'mentions', 'stories']
    },
    'linkedin': {
      name: 'LinkedIn',
      icon: '💼',
      description: 'Professional network',
      accounts: ['Your Company Page', 'Personal Profile'],
      charLimit: 3000,
      features: ['hashtags', 'mentions', 'articles']
    },
    'twitter': {
      name: 'Twitter/X',
      icon: '🐦',
      description: 'Tweet thread',
      accounts: ['@yourbusiness', '@personal'],
      charLimit: 280,
      features: ['hashtags', 'mentions', 'threads']
    },
    'website': {
      name: 'Website',
      icon: '🌐',
      description: 'Embed/CMS integration',
      accounts: ['WordPress Site', 'Squarespace Site', 'Custom CMS'],
      charLimit: null,
      features: ['seo', 'formatting', 'scheduling']
    },
    'tiktok': {
      name: 'TikTok',
      icon: '🎵',
      description: 'Video content',
      accounts: ['@yourbusiness_tiktok'],
      charLimit: 4000,
      features: ['hashtags', 'mentions', 'sounds']
    },
    'youtube': {
      name: 'YouTube',
      icon: '📺',
      description: 'Video/Shorts',
      accounts: ['Your Channel', 'Business Channel'],
      charLimit: 5000,
      features: ['hashtags', 'thumbnails', 'scheduling']
    },
    'pinterest': {
      name: 'Pinterest',
      icon: '📌',
      description: 'Pins & boards',
      accounts: ['Business Account', 'Personal Account'],
      charLimit: 500,
      features: ['boards', 'hashtags', 'rich_pins']
    }
  };

  // Load all data from previous pages
  useEffect(() => {
    const savedStory = localStorage.getItem('currentStory') || '';
    const savedDemographics = JSON.parse(localStorage.getItem('selectedDemographics') || '[]');
    const savedInterests = JSON.parse(localStorage.getItem('selectedInterests') || '[]');
    const savedFormats = JSON.parse(localStorage.getItem('selectedFormats') || '[]');
    const savedSocialPlatforms = JSON.parse(localStorage.getItem('selectedSocialPlatforms') || '[]');

    setStory(savedStory || sampleGeneratedContent.story);
    setDemographics(savedDemographics);
    setInterests(savedInterests);
    setFormats(savedFormats);
    setSocialPlatforms(savedSocialPlatforms);
  }, []);

  // Format content for platform
  const formatContentForPlatform = (content: string, platform: string) => {
    const data = platformData[platform as keyof typeof platformData];
    let formatted = content;
    
    // Add platform-specific formatting
    switch(platform) {
      case 'instagram':
        formatted += '\n\n#canterbury #wellness #newzealand #spa #relaxation';
        break;
      case 'linkedin':
        formatted = formatted + '\n\n#WellnessTourism #Canterbury #NewZealand #BusinessTravel';
        break;
      case 'twitter':
        // Truncate for Twitter and add hashtags
        if (formatted.length > 200) {
          formatted = formatted.substring(0, 200) + '...';
        }
        formatted += '\n\n#Canterbury #Wellness #NZ';
        break;
      case 'facebook':
        formatted += '\n\nVisit our website to book your wellness getaway today!';
        break;
    }
    
    // Respect character limits
    if (data?.charLimit && formatted.length > data.charLimit) {
      formatted = formatted.substring(0, data.charLimit - 3) + '...';
    }
    
    return formatted;
  };

  // Handle platform publishing
  const handlePublishTo = (platform: string) => {
    setCurrentPlatform(platform);
    setPublishStep('setup');
    setSelectedAccount('');
    setPublishOption('now');
    setCaption(formatContentForPlatform(story, platform));
    setShowPublishModal(true);
  };

  // Handle publish confirmation
  const handleConfirmPublish = () => {
    if (publishStep === 'setup') {
      setPublishStep('preview');
    } else if (publishStep === 'preview') {
      setPublishStep('success');
      setTimeout(() => {
        setShowPublishModal(false);
        setPublishStep('setup');
      }, 3000);
    }
  };

  // Handle refresh version
  const handleRefreshVersion = () => {
    setVersionOptions([
      {
        text: "Escape to Canterbury's wellness paradise! Experience rejuvenating hot springs, mountain yoga sessions, and luxury spa treatments. From Hanmer Springs' healing waters to alpine meditation retreats, discover your perfect wellness getaway in New Zealand's most beautiful region.",
        tone: "Energetic & Inviting",
        words: 42
      },
      {
        text: "Transform your wellbeing in Canterbury! Our region's natural hot springs, world-class spas, and serene mountain retreats offer the ultimate relaxation experience. Reconnect with nature, restore your energy, and rediscover inner peace in Canterbury's wellness wonderland.",
        tone: "Inspirational & Calming",
        words: 40
      },
      {
        text: "Canterbury's wellness scene awaits! Indulge in therapeutic hot springs, mindful mountain yoga, and luxurious spa experiences. Whether seeking adventure or tranquility, our wellness destinations provide the perfect backdrop for renewal and rejuvenation.",
        tone: "Professional & Sophisticated",
        words: 36
      }
    ]);
    setShowRefreshModal(true);
  };

  // Handle version selection
  const handleSelectVersion = () => {
    if (versionOptions[selectedVersionIndex]) {
      setStory(versionOptions[selectedVersionIndex].text);
      setShowRefreshModal(false);
    }
  };

  // Download content
  const handleDownload = (type: string) => {
    const filename = `story-${type}-${Date.now()}`;
    const element = document.createElement('a');
    let content = story;
    let mimeType = 'text/plain';
    
    switch(type) {
      case 'pdf':
      case 'word':
      case 'txt':
        content = story;
        break;
      case 'email':
        content = `Subject: ${story.split('.')[0]}...\n\n${story}\n\nBest regards,\nYour Name`;
        break;
      case 'html':
        content = `<!DOCTYPE html><html><head><title>Story Content</title></head><body><h1>Your Story</h1><p>${story.replace(/\n\n/g, '</p><p>')}</p></body></html>`;
        mimeType = 'text/html';
        break;
      case 'json':
        content = JSON.stringify({
          story: story,
          metadata: {
            wordCount: story.trim().split(/\s+/).length,
            target: "Adults 25-65",
            interest: "Relaxation & Wellness",
            generated: new Date().toISOString()
          }
        }, null, 2);
        mimeType = 'application/json';
        break;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    element.href = url;
    element.download = `${filename}.${type === 'html' ? 'html' : type === 'json' ? 'json' : 'txt'}`;
    element.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = story.trim().split(/\s+/).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Step Tracker */}
        <div className="flex justify-center items-center mb-8 gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">1</div>
          <div className="w-16 h-1 bg-green-500"></div>
          <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">2</div>
          <div className="w-16 h-1 bg-green-500"></div>
          <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">3</div>
          <div className="w-16 h-1 bg-green-500"></div>
          <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">4</div>
          <div className="w-16 h-1 bg-green-500"></div>
          <div className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center font-semibold">5</div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">Review & Distribute</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Review your content and choose how to share it with your audience
          </p>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Story Preview */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Story</h2>
            <div className="bg-gray-50 rounded-xl p-6 mb-6 min-h-[200px] leading-relaxed text-gray-700">
              {story}
            </div>
            
            <div className="flex justify-between items-center mb-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
              <div>
                <strong>Target:</strong> Adults 25-65 | <strong>Interest:</strong> Relaxation & Wellness
              </div>
              <div>
                <strong>Length:</strong> {wordCount} words
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Link href="/dashboard/create" className="px-4 py-2 border-2 border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-colors font-medium">
                Edit Story
              </Link>
              <button 
                onClick={handleRefreshVersion}
                className="px-4 py-2 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-colors font-medium"
              >
                Refresh This Version
              </button>
            </div>
          </div>

          {/* Distribution Options */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Distribution Options</h2>
            
            {/* Platform Integrations */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">🔗</span>
                Platform Integrations
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(platformData).slice(0, 4).map(([key, platform]) => (
                  <button
                    key={key}
                    onClick={() => handlePublishTo(key)}
                    className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 text-center hover:border-blue-500 hover:bg-blue-100 transition-all transform hover:-translate-y-1 min-h-[90px] flex flex-col justify-center"
                  >
                    <div className="text-2xl mb-1">{platform.icon}</div>
                    <div className="font-semibold text-sm">{platform.name}</div>
                    <div className="text-xs text-gray-600">{platform.description.split(' ').slice(0, 2).join(' ')}</div>
                  </button>
                ))}
              </div>
              <div className="lg:hidden">
                <div className="grid grid-cols-2 gap-3 mt-3" id="morePlatformIntegrations">
                  {Object.entries(platformData).slice(4).map(([key, platform]) => (
                    <button
                      key={key}
                      onClick={() => handlePublishTo(key)}
                      className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 text-center hover:border-blue-500 hover:bg-blue-100 transition-all min-h-[90px] flex flex-col justify-center"
                    >
                      <div className="text-2xl mb-1">{platform.icon}</div>
                      <div className="font-semibold text-sm">{platform.name}</div>
                      <div className="text-xs text-gray-600">{platform.description.split(' ').slice(0, 2).join(' ')}</div>
                    </button>
                  ))}
                </div>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg mt-3 hover:bg-gray-700 transition-colors text-sm">
                  Show More Platforms
                </button>
              </div>
            </div>

            {/* Instant Downloads */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">⚡</span>
                Instant Downloads
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {key: 'pdf', icon: '📄', name: 'PDF', desc: 'Print ready'},
                  {key: 'word', icon: '📝', name: 'Word', desc: 'Editable'},
                  {key: 'image', icon: '🖼️', name: 'Image', desc: 'Social ready'},
                  {key: 'email', icon: '📧', name: 'Email', desc: 'Newsletter'}
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleDownload(item.key)}
                    className="bg-green-50 border-2 border-green-200 rounded-xl p-3 text-center hover:border-green-500 hover:bg-green-100 transition-all transform hover:-translate-y-1 min-h-[90px] flex flex-col justify-center"
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="font-semibold text-sm">{item.name}</div>
                    <div className="text-xs text-gray-600">{item.desc}</div>
                  </button>
                ))}
              </div>
              <div className="lg:hidden">
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {[
                    {key: 'html', icon: '🔗', name: 'HTML', desc: 'Web embed'},
                    {key: 'csv', icon: '📊', name: 'CSV', desc: 'Data export'},
                    {key: 'txt', icon: '📝', name: 'Text', desc: 'Plain text'},
                    {key: 'json', icon: '⚙️', name: 'JSON', desc: 'API format'}
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleDownload(item.key)}
                      className="bg-green-50 border-2 border-green-200 rounded-xl p-3 text-center hover:border-green-500 hover:bg-green-100 transition-all min-h-[90px] flex flex-col justify-center"
                    >
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className="font-semibold text-sm">{item.name}</div>
                      <div className="text-xs text-gray-600">{item.desc}</div>
                    </button>
                  ))}
                </div>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg mt-3 hover:bg-gray-700 transition-colors text-sm">
                  Show More Downloads
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link 
            href="/dashboard/create/interests"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium border-2 border-orange-500 order-2 sm:order-1"
          >
            ← Back to Audience Interests
          </Link>
          <button 
            onClick={() => {
              // Generate new version logic
              handleRefreshVersion();
            }}
            className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-all transform hover:-translate-y-1 font-semibold text-lg order-1 sm:order-2"
          >
            Generate New Version
          </button>
        </div>
      </div>

      {/* Logo */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-green-500 to-blue-500 bg-clip-text text-transparent">
          speak click send
        </h1>
      </div>

      {/* Publishing Modal */}
      {showPublishModal && currentPlatform && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gray-50 p-6 border-b flex items-center gap-4">
              <div className="text-3xl">{platformData[currentPlatform as keyof typeof platformData]?.icon}</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {platformData[currentPlatform as keyof typeof platformData]?.name}
                </h3>
                <p className="text-gray-600">
                  {platformData[currentPlatform as keyof typeof platformData]?.description}
                </p>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {publishStep === 'setup' && (
                <>
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-gray-700">Select Account/Page</h4>
                    <select 
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Choose account...</option>
                      {platformData[currentPlatform as keyof typeof platformData]?.accounts.map((account) => (
                        <option key={account} value={account}>{account}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={() => setPublishOption('now')}
                      className={`flex-1 p-3 border-2 rounded-lg text-center transition-all ${
                        publishOption === 'now' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-semibold text-sm">Publish Now</div>
                      <div className="text-xs text-gray-600">Post immediately</div>
                    </button>
                    <button
                      onClick={() => setPublishOption('schedule')}
                      className={`flex-1 p-3 border-2 rounded-lg text-center transition-all ${
                        publishOption === 'schedule' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-semibold text-sm">Schedule</div>
                      <div className="text-xs text-gray-600">Choose date & time</div>
                    </button>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-700">Caption/Content</h4>
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="w-full h-32 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                      placeholder="Add your caption, hashtags, and mentions..."
                    />
                  </div>
                </>
              )}
              
              {publishStep === 'preview' && (
                <>
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-gray-700">
                      Final Preview - {platformData[currentPlatform as keyof typeof platformData]?.name}
                    </h4>
                    <div className="bg-gray-50 border rounded-xl p-4 min-h-32 whitespace-pre-wrap text-sm leading-relaxed">
                      {caption}
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg mb-4 text-sm">
                    <div><strong>Publishing to:</strong> {selectedAccount}</div>
                    <div><strong>Timing:</strong> {publishOption === 'now' ? 'Immediately' : 'Scheduled'}</div>
                    <div><strong>Platform:</strong> {platformData[currentPlatform as keyof typeof platformData]?.name}</div>
                  </div>
                  
                  <p className="text-gray-600 text-sm">
                    ⚠️ This will publish your content to {platformData[currentPlatform as keyof typeof platformData]?.name}. 
                    Make sure you're ready to go live!
                  </p>
                </>
              )}
              
              {publishStep === 'success' && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4 animate-bounce">✅</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Successfully Published!</h3>
                  <p className="text-gray-600 mb-6">
                    Your content is now live on {platformData[currentPlatform as keyof typeof platformData]?.name}
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg text-left text-sm">
                    <div><strong>Published to:</strong> {selectedAccount}</div>
                    <div><strong>Platform:</strong> {platformData[currentPlatform as keyof typeof platformData]?.name}</div>
                    <div><strong>Time:</strong> {new Date().toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="bg-gray-50 p-6 border-t flex gap-4">
              <button
                onClick={() => setShowPublishModal(false)}
                className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPublish}
                disabled={publishStep === 'setup' && !selectedAccount}
                className="flex-1 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {publishStep === 'setup' ? 'Preview Post' : 
                 publishStep === 'preview' ? `Publish to ${platformData[currentPlatform as keyof typeof platformData]?.name}` : 
                 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refresh Version Modal */}
      {showRefreshModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">Choose Your Preferred Version</h3>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {versionOptions.map((version, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedVersionIndex(index)}
                  className={`border-2 rounded-xl p-4 mb-4 cursor-pointer transition-all ${
                    selectedVersionIndex === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="mb-2 leading-relaxed">{version.text}</div>
                  <div className="text-sm text-gray-600">
                    <strong>Tone:</strong> {version.tone} | <strong>Length:</strong> {version.words} words
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 p-6 border-t flex gap-4">
              <button
                onClick={() => setShowRefreshModal(false)}
                className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSelectVersion}
                className="flex-1 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600
