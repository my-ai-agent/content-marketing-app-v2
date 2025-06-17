'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Results() {
  // State management
  const [story, setStory] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState<string | null>(null);
  const [publishStep, setPublishStep] = useState<'setup' | 'preview' | 'success'>('setup');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [publishOption, setPublishOption] = useState<'now' | 'schedule'>('now');
  const [caption, setCaption] = useState<string>('');
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [versionOptions, setVersionOptions] = useState<Array<{text: string, tone: string, words: number}>>([]);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);
  const [showMorePlatforms, setShowMorePlatforms] = useState(false);
  const [showMoreDownloads, setShowMoreDownloads] = useState(false);

  // Sample content
  const sampleStory = "Discover the hidden gems of Canterbury's wellness scene! From the therapeutic hot springs of Hanmer Springs to the tranquil meditation retreats nestled in the Southern Alps, our region offers the perfect escape for those seeking relaxation and renewal.\n\nWhether you're looking to unwind in luxury spa treatments, practice yoga with mountain views, or simply disconnect from the digital world, Canterbury has something special waiting for you. Come experience the peace and serenity that makes our corner of New Zealand truly magical.";

  // Platform data
  const platformData = {
    'facebook': { name: 'Facebook', icon: '📘', description: 'Direct post', accounts: ['Your Business Page', 'Personal Profile', 'Community Group'], charLimit: 63206 },
    'instagram': { name: 'Instagram', icon: '📷', description: 'Stories & posts', accounts: ['@yourbusiness', '@personal_account'], charLimit: 2200 },
    'linkedin': { name: 'LinkedIn', icon: '💼', description: 'Professional', accounts: ['Your Company Page', 'Personal Profile'], charLimit: 3000 },
    'website': { name: 'Website', icon: '🌐', description: 'Embed/CMS', accounts: ['WordPress Site', 'Squarespace Site', 'Custom CMS'], charLimit: null },
    'twitter': { name: 'Twitter/X', icon: '🐦', description: 'Tweet thread', accounts: ['@yourbusiness', '@personal'], charLimit: 280 },
    'tiktok': { name: 'TikTok', icon: '🎵', description: 'Video content', accounts: ['@yourbusiness_tiktok'], charLimit: 4000 },
    'youtube': { name: 'YouTube', icon: '📺', description: 'Video/Shorts', accounts: ['Your Channel', 'Business Channel'], charLimit: 5000 },
    'pinterest': { name: 'Pinterest', icon: '📌', description: 'Pins & boards', accounts: ['Business Account', 'Personal Account'], charLimit: 500 }
  };

  // Add responsive state
  const [isMobile, setIsMobile] = useState(false);

  // Load data on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStory = localStorage.getItem('currentStory') || sampleStory;
      setStory(savedStory);
      
      // Check if mobile
      const checkMobile = () => setIsMobile(window.innerWidth <= 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Format content for platform
  const formatContentForPlatform = (content: string, platform: string) => {
    let formatted = content;
    
    switch(platform) {
      case 'instagram':
        formatted += '\n\n#canterbury #wellness #newzealand #spa #relaxation';
        break;
      case 'linkedin':
        formatted += '\n\n#WellnessTourism #Canterbury #NewZealand #BusinessTravel';
        break;
      case 'twitter':
        if (formatted.length > 200) formatted = formatted.substring(0, 200) + '...';
        formatted += '\n\n#Canterbury #Wellness #NZ';
        break;
      case 'facebook':
        formatted += '\n\nVisit our website to book your wellness getaway today!';
        break;
    }
    
    const data = platformData[platform as keyof typeof platformData];
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

  // Handle refresh version with enhanced generational psychology
const handleRefreshVersion = async () => {
  try {
    // Get stored user selections
    const targetAudience = localStorage.getItem('selectedDemographic') || 'Gen Z (1997-2012) - Digital natives prioritizing authenticity';
    const interests = JSON.parse(localStorage.getItem('selectedInterests') || '["wellness", "relaxation"]');
    const originalStory = localStorage.getItem('currentStory') || story;

    // Call enhanced content API
    const response = await fetch('/api/enhanced-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        story: originalStory,
        targetAudience,
        interests,
        location: 'Christchurch'
      })
    });

    const data = await response.json();

    if (data.success && data.contentVariations) {
      // Transform API response into version options format
      const enhancedVersions = data.contentVariations.map((variation, index) => ({
        text: variation.content,
        tone: `${variation.style.replace(/_/g, ' ')} (${variation.platform})`,
        words: variation.content.trim().split(/\s+/).length
      }));

      // Add enhanced metadata
      setVersionOptions(enhancedVersions);
      
      // Store enhancement info for display
      const enhancementInfo = {
        targetAudience: data.targetAudience,
        profile: data.profile,
        culturalContext: data.culturalContext
      };
      localStorage.setItem('lastEnhancementInfo', JSON.stringify(enhancementInfo));
      
    } else {
      // Fallback to original versions if API fails
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
    }
    
    setShowRefreshModal(true);
    
  } catch (error) {
    console.error('Enhanced content generation failed:', error);
    // Fallback to original functionality
    setVersionOptions([
      {
        text: "Discover Canterbury's hidden wellness gems! From therapeutic hot springs to mountain meditation retreats, experience the perfect escape for relaxation and renewal in New Zealand's most beautiful region.",
        tone: "Energetic & Inviting",
        words: 30
      }
    ]);
    setShowRefreshModal(true);
  }
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
          metadata: { wordCount: story.trim().split(/\s+/).length, target: "Adults 25-65", interest: "Relaxation & Wellness", generated: new Date().toISOString() }
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Step Tracker */}
<div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',
  gap: '1rem',
  marginBottom: '3rem',
  width: '100%',
  maxWidth: '500px',
  margin: '0 auto 3rem auto'
}}>
  {[1, 2, 3, 4, 5].map((step, index) => (
    <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{
        width: '3rem',
        height: '3rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: step <= 4 ? '#10b981' : '#374151',
        color: 'white',
        fontSize: '1rem',
        fontWeight: '600',
        flexShrink: 0
      }}>
        {step}
      </div>
      
      {index < 4 && (
        <div style={{
          width: '4rem',
          height: '2px',
          backgroundColor: step < 5 ? '#10b981' : '#d1d5db',
          margin: '0 0.25rem'
        }} />
      )}
    </div>
  ))}
</div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '700', color: 'white', marginBottom: '1rem' }}>Review & Distribute</h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '600px', margin: '0 auto' }}>
            Review your content and choose how to share it with your audience
          </p>
        </div>

        {/* Content Area */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          {/* Story Preview */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1f2937' }}>Your Story</h2>
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', lineHeight: '1.6', color: '#374151', minHeight: '200px', whiteSpace: 'pre-wrap' }}>
              {story}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.9rem', color: '#64748b' }}>
              <div><strong>Target:</strong> Adults 25-65 | <strong>Interest:</strong> Relaxation & Wellness</div>
              <div><strong>Length:</strong> {wordCount} words</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link href="/dashboard/create" style={{ padding: '0.5rem 1rem', border: '2px solid #10b981', background: 'white', color: '#10b981', borderRadius: '8px', fontWeight: '500', textDecoration: 'none' }}>
                Edit Story
              </Link>
              <button onClick={handleRefreshVersion} style={{ padding: '0.5rem 1rem', border: '2px solid #f97316', background: 'white', color: '#f97316', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>
                Refresh This Version
              </button>
            </div>
          </div>

          {/* Distribution Options */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#1f2937' }}>Distribution Options</h2>
            
            {/* Platform Integrations */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#374151', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ background: '#3b82f6', color: 'white', padding: '0.25rem', borderRadius: '4px', fontSize: '0.8rem' }}>🔗</span>
                Platform Integrations
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
                {Object.entries(platformData).slice(0, showMorePlatforms ? 8 : 3).map(([key, platform]) => (
                  <div key={key} onClick={() => handlePublishTo(key)} style={{ background: '#eff6ff', border: '2px solid #3b82f6', borderRadius: '12px', padding: '0.75rem', textAlign: 'center', cursor: 'pointer', minHeight: '90px', display: 'flex', flexDirection: 'column', justifyContent: 'center', transition: 'all 0.3s ease' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{platform.icon}</div>
                    <div style={{ fontWeight: '600', marginBottom: '0.1rem', fontSize: '0.85rem' }}>{platform.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', lineHeight: '1.2' }}>{platform.description}</div>
                  </div>
                ))}
              </div>

              {Object.keys(platformData).length > 4 && (
                <button
                  onClick={() => setShowMorePlatforms(!showMorePlatforms)}
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    border: '2px dashed #3b82f6',
                    borderRadius: '8px',
                    background: 'white',
                    color: '#3b82f6',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {showMorePlatforms ? '← Show Less Platforms' : 'More Platforms →'}
                </button>
              )}
            </div>

            {/* Instant Downloads */}
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#374151', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ background: '#10b981', color: 'white', padding: '0.25rem', borderRadius: '4px', fontSize: '0.8rem' }}>⚡</span>
                Instant Downloads
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
                {[
  {key: 'pdf', icon: '📄', name: 'PDF', desc: 'Print ready'},
  {key: 'word', icon: '📝', name: 'Word', desc: 'Editable'},
  {key: 'blog', icon: '✍️', name: 'Blog Post', desc: 'SEO optimized'},
  {key: 'email', icon: '📧', name: 'Email', desc: 'Newsletter'},
  {key: 'press', icon: '📰', name: 'Press Release', desc: 'Media format'},
  {key: 'staff', icon: '👥', name: 'Staff News', desc: 'Internal comms'},
  {key: 'board', icon: '📋', name: 'Board Report', desc: 'Executive summary'},
  {key: 'stakeholder', icon: '🤝', name: 'Stakeholder Letter', desc: 'Partner comms'}
].slice(0, showMoreDownloads ? 8 : 3).map((item) => (
                  <div key={item.key} onClick={() => handleDownload(item.key)} style={{ background: '#ecfdf5', border: '2px solid #10b981', borderRadius: '12px', padding: '0.75rem', textAlign: 'center', cursor: 'pointer', minHeight: '90px', display: 'flex', flexDirection: 'column', justifyContent: 'center', transition: 'all 0.3s ease' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{item.icon}</div>
                    <div style={{ fontWeight: '600', marginBottom: '0.1rem', fontSize: '0.85rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', lineHeight: '1.2' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
              {[
                {key: 'pdf', icon: '📄', name: 'PDF', desc: 'Print ready'},
                {key: 'word', icon: '📝', name: 'Word', desc: 'Editable'},
                {key: 'image', icon: '🖼️', name: 'Image', desc: 'Social ready'},
                {key: 'email', icon: '📧', name: 'Email', desc: 'Newsletter'}
              ].length > 3 && (
                <button
                  onClick={() => setShowMoreDownloads(!showMoreDownloads)}
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    border: '2px dashed #0ea5e9',
                    borderRadius: '8px',
                    background: 'white',
                    color: '#0ea5e9',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {showMoreDownloads ? '← Show Less Downloads' : 'More Downloads →'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', gap: '1rem' }}>
          <Link href="/dashboard/create/interests" style={{ background: '#f97316', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '500', textDecoration: 'none' }}>
            ← Back to Audience Interests
          </Link>
          <button onClick={handleRefreshVersion} style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1.1rem' }}>
            Generate New Version
          </button>
        </div>
      </div>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem 0' }}>
        <h1 style={{ fontSize: '2rem', background: 'linear-gradient(45deg, #f97316, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '700' }}>
          speak click send
        </h1>
      </div>

      {/* Publishing Modal */}
      {showPublishModal && currentPlatform && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.6)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '20px', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}>
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>{platformData[currentPlatform as keyof typeof platformData]?.icon}</div>
              <div>
                <h3 style={{ margin: 0, color: '#1f2937', fontSize: '1.2rem' }}>{platformData[currentPlatform as keyof typeof platformData]?.name}</h3>
                <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.9rem' }}>{platformData[currentPlatform as keyof typeof platformData]?.description}</p>
              </div>
            </div>
            
            <div style={{ padding: '1.5rem', maxHeight: '50vh', overflowY: 'auto' }}>
              {publishStep === 'setup' && (
                <>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ margin: '0 0 0.75rem 0', color: '#374151', fontSize: '1rem' }}>Select Account/Page</h4>
                    <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', background: 'white' }}>
                      <option value="">Choose account...</option>
                      {platformData[currentPlatform as keyof typeof platformData]?.accounts.map((account) => (
                        <option key={account} value={account}>{account}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div onClick={() => setPublishOption('now')} style={{ flex: 1, padding: '0.75rem', border: publishOption === 'now' ? '2px solid #3b82f6' : '2px solid #e2e8f0', borderRadius: '8px', background: publishOption === 'now' ? '#eff6ff' : 'white', cursor: 'pointer', textAlign: 'center' }}>
                      <div style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Publish Now</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Post immediately</div>
                    </div>
                    <div onClick={() => setPublishOption('schedule')} style={{ flex: 1, padding: '0.75rem', border: publishOption === 'schedule' ? '2px solid #3b82f6' : '2px solid #e2e8f0', borderRadius: '8px', background: publishOption === 'schedule' ? '#eff6ff' : 'white', cursor: 'pointer', textAlign: 'center' }}>
                      <div style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Schedule</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Choose date & time</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ margin: '0 0 0.75rem 0', color: '#374151', fontSize: '1rem' }}>Caption/Content</h4>
                    <textarea value={caption} onChange={(e) => setCaption(e.target.value)} style={{ width: '100%', height: '100px', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.9rem', resize: 'vertical' }} placeholder="Add your caption, hashtags, and mentions..." />
                  </div>
                </>
              )}
              
              {publishStep === 'preview' && (
                <>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ margin: '0 0 0.75rem 0', color: '#374151', fontSize: '1rem' }}>Final Preview - {platformData[currentPlatform as keyof typeof platformData]?.name}</h4>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', fontSize: '0.9rem', lineHeight: '1.5', color: '#374151', minHeight: '120px', whiteSpace: 'pre-wrap' }}>{caption}</div>
                  </div>
                  
                  <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    <div><strong>Publishing to:</strong> {selectedAccount}</div>
                    <div><strong>Timing:</strong> {publishOption === 'now' ? 'Immediately' : 'Scheduled'}</div>
                    <div><strong>Platform:</strong> {platformData[currentPlatform as keyof typeof platformData]?.name}</div>
                  </div>
                  
                  <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>⚠️ This will publish your content to {platformData[currentPlatform as keyof typeof platformData]?.name}. Make sure you&apos;re ready to go live!</p>
                </>
              )}
              
              {publishStep === 'success' && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                  <h3 style={{ margin: '1rem 0 0.5rem 0', color: '#1f2937' }}>Successfully Published!</h3>
                  <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Your content is now live on {platformData[currentPlatform as keyof typeof platformData]?.name}</p>
                  <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '8px', textAlign: 'left' }}>
                    <div><strong>Published to:</strong> {selectedAccount}</div>
                    <div><strong>Platform:</strong> {platformData[currentPlatform as keyof typeof platformData]?.name}</div>
                    <div><strong>Time:</strong> {new Date().toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '1rem' }}>
              <button onClick={() => setShowPublishModal(false)} style={{ flex: 1, padding: '0.75rem 1rem', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '1rem' }}>Cancel</button>
              <button onClick={handleConfirmPublish} disabled={publishStep === 'setup' && !selectedAccount} style={{ flex: 1, padding: '0.75rem 1rem', background: publishStep === 'setup' && !selectedAccount ? '#9ca3af' : '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: publishStep === 'setup' && !selectedAccount ? 'not-allowed' : 'pointer', fontWeight: '500', fontSize: '1rem' }}>
                {publishStep === 'setup' ? 'Preview Post' : publishStep === 'preview' ? `Publish to ${platformData[currentPlatform as keyof typeof platformData]?.name}` : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refresh Version Modal */}
      {showRefreshModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '20px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, color: '#1f2937', fontSize: '1.2rem' }}>Choose Your Preferred Version</h3>
            </div>
            
            <div style={{ padding: '1.5rem', maxHeight: '50vh', overflowY: 'auto' }}>
              {versionOptions.map((version, index) => (
                <div key={index} onClick={() => setSelectedVersionIndex(index)} style={{ background: selectedVersionIndex === index ? '#eff6ff' : '#f8fafc', border: selectedVersionIndex === index ? '2px solid #3b82f6' : '2px solid #e2e8f0', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', cursor: 'pointer' }}>
                  <div style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>{version.text}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}><strong>Tone:</strong> {version.tone} | <strong>Length:</strong> {version.words} words</div>
                </div>
              ))}
            </div>
            
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '1rem' }}>
              <button onClick={() => setShowRefreshModal(false)} style={{ flex: 1, padding: '0.75rem 1rem', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '1rem' }}>Cancel</button>
              <button onClick={handleSelectVersion} style={{ flex: 1, padding: '0.75rem 1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '1rem' }}>Use This Version</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
