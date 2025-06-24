'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

// ---- CropTool Component ----
type CropBox = { x: number; y: number; width: number; height: number };

function CropTool({
  image,
  onCropComplete,
  onCancel,
}: {
  image: string;
  onCropComplete: (croppedUrl: string) => void;
  onCancel: () => void;
}) {
  const [cropBox, setCropBox] = useState<CropBox>({ x: 50, y: 50, width: 200, height: 200 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Center crop box on image load
  function handleImageLoad() {
    if (imgRef.current) {
      const img = imgRef.current;
      setCropBox({
        x: img.width * 0.1,
        y: img.height * 0.1,
        width: img.width * 0.8,
        height: img.height * 0.8,
      });
    }
  }

  // Apply crop and output data URL
  function handleApplyCrop() {
    if (!canvasRef.current || !imgRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;
    canvas.width = cropBox.width;
    canvas.height = cropBox.height;
    ctx?.drawImage(
      img,
      cropBox.x,
      cropBox.y,
      cropBox.width,
      cropBox.height,
      0,
      0,
      cropBox.width,
      cropBox.height,
    );
    const croppedUrl = canvas.toDataURL('image/jpeg', 0.9);
    onCropComplete(croppedUrl);
  }

  // Drag crop box logic
  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    setDragStart({ x: e.clientX - cropBox.x, y: e.clientY - cropBox.y });
    window.addEventListener('mousemove', handleMouseMove as any);
    window.addEventListener('mouseup', handleMouseUp as any);
  }

  function handleMouseMove(e: MouseEvent) {
    if (dragStart) {
      setCropBox((prev) => ({
        ...prev,
        x: Math.max(0, e.clientX - dragStart.x),
        y: Math.max(0, e.clientY - dragStart.y),
      }));
    }
  }

  function handleMouseUp() {
    setDragStart(null);
    window.removeEventListener('mousemove', handleMouseMove as any);
    window.removeEventListener('mouseup', handleMouseUp as any);
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img
        ref={imgRef}
        src={image}
        alt="Crop preview"
        style={{ maxWidth: '100%', maxHeight: '400px', display: 'block' }}
        onLoad={handleImageLoad}
      />
      {/* Crop Box Overlay */}
      <div
        style={{
          position: 'absolute',
          border: '2px dashed #3b82f6',
          left: cropBox.x,
          top: cropBox.y,
          width: cropBox.width,
          height: cropBox.height,
          cursor: 'move',
          background: 'rgba(59,130,246,0.1)',
        }}
        onMouseDown={handleMouseDown}
      />
      {/* Hidden canvas for crop */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div style={{ marginTop: 24, display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button
          onClick={onCancel}
          style={{
            background: '#e5e7eb',
            color: '#374151',
            border: 'none',
            borderRadius: 8,
            padding: '0.75rem 1.5rem',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleApplyCrop}
          style={{
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '0.75rem 1.5rem',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Apply Crop
        </button>
      </div>
    </div>
  );
}

// ---- Main Results Page ----
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
  const [versionOptions, setVersionOptions] = useState<Array<{ text: string; tone: string; words: number }>>([]);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);
  const [showMorePlatforms, setShowMorePlatforms] = useState(false);
  const [showMoreDownloads, setShowMoreDownloads] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeURL, setQRCodeURL] = useState<string>('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  // Crop state
  const [showCropModal, setShowCropModal] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  // Platform info
  const platformData = {
    facebook: {
      name: 'Facebook',
      icon: '📘',
      description: 'Direct post',
      accounts: ['Your Business Page', 'Personal Profile', 'Community Group'],
      charLimit: 63206,
    },
    instagram: {
      name: 'Instagram',
      icon: '📷',
      description: 'Stories & posts',
      accounts: ['@yourbusiness', '@personal_account'],
      charLimit: 2200,
    },
    linkedin: {
      name: 'LinkedIn',
      icon: '💼',
      description: 'Professional',
      accounts: ['Your Company Page', 'Personal Profile'],
      charLimit: 3000,
    },
    website: {
      name: 'Website',
      icon: '🌐',
      description: 'Embed/CMS',
      accounts: ['WordPress Site', 'Squarespace Site', 'Custom CMS'],
      charLimit: null,
    },
    twitter: {
      name: 'Twitter/X',
      icon: '🐦',
      description: 'Tweet thread',
      accounts: ['@yourbusiness', '@personal'],
      charLimit: 280,
    },
    tiktok: {
      name: 'TikTok',
      icon: '🎵',
      description: 'Video content',
      accounts: ['@yourbusiness_tiktok'],
      charLimit: 4000,
    },
    youtube: {
      name: 'YouTube',
      icon: '📺',
      description: 'Video/Shorts',
      accounts: ['Your Channel', 'Business Channel'],
      charLimit: 5000,
    },
    pinterest: {
      name: 'Pinterest',
      icon: '📌',
      description: 'Pins & boards',
      accounts: ['Business Account', 'Personal Account'],
      charLimit: 500,
    },
  };

  const [isMobile, setIsMobile] = useState(false);

  // On mount: retrieve story/photo, set mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setStory(localStorage.getItem('currentStory') || '');
      const savedPhoto = localStorage.getItem('selectedPhoto');
      if (savedPhoto) setSelectedPhoto(savedPhoto);
      const checkMobile = () => setIsMobile(window.innerWidth <= 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Content formatting per platform
  function formatContentForPlatform(content: string, platform: string) {
    let formatted = content;
    switch (platform) {
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
  }

  // Handle platform publishing
  function handlePublishTo(platform: string) {
    setCurrentPlatform(platform);
    setPublishStep('setup');
    setSelectedAccount('');
    setPublishOption('now');
    setCaption(formatContentForPlatform(story, platform));
    setShowPublishModal(true);
  }

  // Handle publish confirmation
  function handleConfirmPublish() {
    if (publishStep === 'setup') {
      setPublishStep('preview');
    } else if (publishStep === 'preview') {
      setPublishStep('success');
      setTimeout(() => {
        setShowPublishModal(false);
        setPublishStep('setup');
      }, 3000);
    }
  }

  // Handle version refresh (simulate)
  async function handleRefreshVersion() {
    try {
      const storedDemo = localStorage.getItem('selectedDemographics');
      const targetAudience = storedDemo ? JSON.parse(storedDemo)[0] : 'Gen Z (1997-2012) - Digital natives prioritizing authenticity';
      const interests = JSON.parse(localStorage.getItem('selectedInterests') || '["wellness", "relaxation"]');
      const originalStory = localStorage.getItem('currentStory') || story;
      // Mock API response
      const data = {
        success: true,
        contentVariations: [
          { content: originalStory, style: 'engaging', platform: 'Instagram' },
          { content: originalStory + ' (business style)', style: 'professional', platform: 'LinkedIn' },
        ],
        targetAudience,
        profile: '',
        culturalContext: '',
      };
      if (data.success && data.contentVariations) {
        const enhancedVersions = data.contentVariations.map((variation: any) => ({
          text: variation.content,
          tone: `${variation.style.replace(/_/g, ' ')} (${variation.platform})`,
          words: variation.content.trim().split(/\s+/).length,
        }));
        setVersionOptions(enhancedVersions);
      }
      setShowRefreshModal(true);
    } catch (error) {
      setShowRefreshModal(true);
    }
  }

  function handleSelectVersion() {
    if (versionOptions[selectedVersionIndex]) {
      setStory(versionOptions[selectedVersionIndex].text);
      setShowRefreshModal(false);
    }
  }

  // QR Code Generation
  async function handleGenerateQR() {
    setIsGeneratingQR(true);
    try {
      const storyId = Date.now().toString();
      const storyData = {
        story: story,
        photo: selectedPhoto,
        demographic: localStorage.getItem('selectedDemographics'),
        interests: localStorage.getItem('selectedInterests'),
        created: new Date().toISOString(),
      };
      localStorage.setItem(`story_${storyId}`, JSON.stringify(storyData));
      const baseURL = window.location.origin;
      const landingPageURL = `${baseURL}/story/${storyId}`;
      let qrURL = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(
        landingPageURL,
      )}&choe=UTF-8`;
      try {
        const testResponse = await fetch(qrURL, { method: 'HEAD' });
        if (!testResponse.ok) throw new Error('Primary QR service unavailable');
        setQRCodeURL(qrURL);
      } catch {
        const fallbackURL = `https://qr-code-styling.com/api/qr-code?data=${encodeURIComponent(
          landingPageURL,
        )}&size=300&format=png`;
        setQRCodeURL(fallbackURL);
      }
      setShowQRModal(true);
    } catch (error) {
      alert('Failed to generate QR code. Please try again.');
    } finally {
      setIsGeneratingQR(false);
    }
  }

  // Download content (simulate)
  function handleDownload(type: string) {
    const filename = `story-${type}-${Date.now()}`;
    const element = document.createElement('a');
    let content = story;
    let mimeType = 'text/plain';
    switch (type) {
      case 'email':
        content = `Subject: ${story.split('.')[0]}...\n\n${story}\n\nBest regards,\nYour Name`;
        break;
      case 'html':
        content = `<!DOCTYPE html><html><head><title>Story Content</title></head><body><h1>Your Story</h1><p>${story.replace(
          /\n\n/g,
          '</p><p>',
        )}</p></body></html>`;
        mimeType = 'text/html';
        break;
      case 'json':
        content = JSON.stringify(
          {
            story: story,
            metadata: {
              wordCount: story.trim().split(/\s+/).length,
              target: 'Adults 25-65',
              interest: 'Relaxation & Wellness',
              generated: new Date().toISOString(),
            },
          },
          null,
          2,
        );
        mimeType = 'application/json';
        break;
    }
    alert(
      `✅ Downloaded: ${filename}\n\nCheck your Downloads folder or browser's download notification.`,
    );
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    element.href = url;
    element.download = `${filename}.${type === 'html' ? 'html' : type === 'json' ? 'json' : 'txt'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
  }

  // ---- Main Render ----
  const wordCount = story.trim().split(/\s+/).length;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Step Tracker */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '3rem',
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto 3rem auto',
          }}
        >
          {[1, 2, 3, 4, 5].map((step, index) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: step <= 4 ? '#10b981' : '#374151',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  flexShrink: 0,
                }}
              >
                {step}
              </div>
              {index < 4 && (
                <div
                  style={{
                    width: '2.5rem',
                    height: '2px',
                    backgroundColor: step < 5 ? '#10b981' : '#d1d5db',
                    margin: '0 0.25rem',
                  }}
                />
              )}
            </div>
          ))}
        </div>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1
            style={{
              fontSize: '3rem',
              fontWeight: '700',
              color: 'white',
              marginBottom: '1rem',
            }}
          >
            Review & Distribute
          </h1>
          <p
            style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Review your content and choose how to share it with your audience
          </p>
        </div>
        {/* Content Area */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '3rem',
            marginBottom: '3rem',
          }}
        >
          {/* Story Preview */}
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1f2937' }}>
              Your Story
            </h2>
            {/* Photo Display + Crop integration */}
            {selectedPhoto && (
              <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <img
                  src={croppedImage || selectedPhoto}
                  alt="Story photo"
                  style={{
                    width: '100%',
                    maxHeight: '300px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <button
                  onClick={() => setShowCropModal(true)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: 12,
                    background: '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '0.3rem 0.8rem',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  }}
                  title="Crop Photo"
                >
                  ✂️ Crop
                </button>
              </div>
            )}
            <div
              style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                lineHeight: '1.6',
                color: '#374151',
                minHeight: '200px',
                whiteSpace: 'pre-wrap',
              }}
            >
              {story}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                padding: '1rem',
                background: '#f1f5f9',
                borderRadius: '8px',
                fontSize: '0.9rem',
              }}
            >
              <div>
                <strong>Target:</strong> Adults 25-65 |{' '}
                <strong>Interest:</strong> Relaxation & Wellness
              </div>
              <div>
                <strong>Length:</strong> {wordCount} words
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link
                href="/dashboard/create"
                style={{
                  padding: '0.5rem 1rem',
                  border: '2px solid #10b981',
                  background: 'white',
                  color: '#10b981',
                  borderRadius: '8px',
                  fontWeight: '500',
                  textDecoration: 'none',
                }}
              >
                Edit Story
              </Link>
              <button
                onClick={handleRefreshVersion}
                style={{
                  padding: '0.5rem 1rem',
                  border: '2px solid #f97316',
                  background: 'white',
                  color: '#f97316',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Refresh This Version
              </button>
            </div>
          </div>
          {/* Distribution Options */}
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#1f2937' }}>
              Distribution Options
            </h2>
            {/* Universal QR Code */}
            <div style={{ marginBottom: '2rem' }}>
              <h3
                style={{
                  fontSize: '1.2rem',
                  color: '#374151',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span
                  style={{
                    background: '#f59e0b',
                    color: 'white',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                  }}
                >
                  📱
                </span>
                Universal QR Code
              </h3>
              <div
                style={{
                  background: '#fef3c7',
                  border: '2px solid #f59e0b',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
                <h4
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem',
                  }}
                >
                  Tell Your Story, Instantly!
                </h4>
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: '#6b7280',
                    marginBottom: '1.5rem',
                  }}
                >
                  Generate a QR code that gives tourists access to all 16 platform and format options
                </p>
                <button
                  onClick={handleGenerateQR}
                  disabled={isGeneratingQR}
                  style={{
                    background: isGeneratingQR
                      ? '#d1d5db'
                      : 'linear-gradient(45deg, #f59e0b 0%, #ef4444 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '8px',
                    cursor: isGeneratingQR ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                  }}
                >
                  {isGeneratingQR ? '🔄 Generating...' : '📱 Generate QR Code'}
                </button>
              </div>
            </div>
            {/* Platform Integrations */}
            <div style={{ marginBottom: '2rem' }}>
              <h3
                style={{
                  fontSize: '1.2rem',
                  color: '#374151',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                  }}
                >
                  🔗
                </span>
                Platform Integrations
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '0.75rem',
                }}
              >
                {Object.entries(platformData)
                  .slice(0, showMorePlatforms ? 8 : 3)
                  .map(([key, platform]) => (
                    <div
                      key={key}
                      onClick={() => handlePublishTo(key)}
                      style={{
                        background: '#eff6ff',
                        border: '2px solid #3b82f6',
                        borderRadius: '12px',
                        padding: '0.75rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                        {platform.icon}
                      </div>
                      <div
                        style={{
                          fontWeight: '600',
                          marginBottom: '0.1rem',
                          fontSize: '0.85rem',
                        }}
                      >
                        {platform.name}
                      </div>
                      <div
                        style={{
                          fontSize: '0.7rem',
                          color: '#6b7280',
                          lineHeight: '1.2',
                        }}
                      >
                        {platform.description}
                      </div>
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
                    transition: 'all 0.2s ease',
                  }}
                >
                  {showMorePlatforms ? '← Show Less Platforms' : 'More Platforms →'}
                </button>
              )}
            </div>
            {/* Instant Downloads */}
            <div>
              <h3
                style={{
                  fontSize: '1.2rem',
                  color: '#374151',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span
                  style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                  }}
                >
                  ⚡
                </span>
                Instant Downloads
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '0.75rem',
                }}
              >
                {[
                  { key: 'pdf', icon: '📄', name: 'PDF', desc: 'Print ready' },
                  { key: 'word', icon: '📝', name: 'Word', desc: 'Editable' },
                  { key: 'blog', icon: '✍️', name: 'Blog Post', desc: 'SEO optimized' },
                  { key: 'email', icon: '📧', name: 'Email', desc: 'Newsletter' },
                  { key: 'press', icon: '📰', name: 'Press Release', desc: 'Media format' },
                  { key: 'staff', icon: '👥', name: 'Staff News', desc: 'Internal comms' },
                  { key: 'board', icon: '📋', name: 'Board Report', desc: 'Executive summary' },
                  { key: 'stakeholder', icon: '🤝', name: 'Stakeholder Letter', desc: 'Partner comms' },
                ]
                  .slice(0, showMoreDownloads ? 8 : 3)
                  .map((item) => (
                    <div
                      key={item.key}
                      onClick={() => handleDownload(item.key)}
                      style={{
                        background: '#ecfdf5',
                        border: '2px solid #10b981',
                        borderRadius: '12px',
                        padding: '0.75rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{item.icon}</div>
                      <div
                        style={{
                          fontWeight: '600',
                          marginBottom: '0.1rem',
                          fontSize: '0.85rem',
                        }}
                      >
                        {item.name}
                      </div>
                      <div
                        style={{
                          fontSize: '0.7rem',
                          color: '#6b7280',
                          lineHeight: '1.2',
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  ))}
              </div>
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
                  transition: 'all 0.2s ease',
                }}
              >
                {showMoreDownloads ? '← Show Less Downloads' : 'More Downloads →'}
              </button>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2rem',
            gap: '1rem',
          }}
        >
          <Link
            href="/dashboard/create/interests"
            style={{
              background: '#f97316',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: '500',
              textDecoration: 'none',
            }}
          >
            ← Back to Audience Interests
          </Link>
          <button
            onClick={handleRefreshVersion}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
            }}
          >
            Generate New Version
          </button>
        </div>
      </div>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem 0' }}>
        <h1
          style={{
            fontSize: '2rem',
            background: 'linear-gradient(45deg, #f97316, #10b981, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700',
          }}
        >
          click speak send
        </h1>
      </div>
      {/* --- Modals --- */}
      {/* Crop Modal */}
      {showCropModal && selectedPhoto && (
        <div
          style={{
            position: 'fixed',
            zIndex: 2002,
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              padding: 32,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              textAlign: 'center',
              maxWidth: 450,
              width: '90%',
            }}
          >
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Crop Your Photo</h3>
            <CropTool
              image={selectedPhoto}
              onCropComplete={(croppedUrl) => {
                setCroppedImage(croppedUrl);
                setShowCropModal(false);
              }}
              onCancel={() => setShowCropModal(false)}
            />
          </div>
        </div>
      )}
      {/* Publish Modal */}
      {showPublishModal && currentPlatform && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div
              style={{
                background: '#f8fafc',
                padding: '1.5rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div style={{ fontSize: '2rem' }}>
                {platformData[currentPlatform as keyof typeof platformData]?.icon}
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#1f2937', fontSize: '1.2rem' }}>
                  {platformData[currentPlatform as keyof typeof platformData]?.name}
                </h3>
                <p
                  style={{
                    margin: '0.25rem 0 0 0',
                    color: '#6b7280',
                    fontSize: '0.9rem',
                  }}
                >
                  {platformData[currentPlatform as keyof typeof platformData]?.description}
                </p>
              </div>
            </div>
            <div style={{ padding: '1.5rem', maxHeight: '50vh', overflowY: 'auto' }}>
              {publishStep === 'setup' && (
                <>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4
                      style={{
                        margin: '0 0 0.75rem 0',
                        color: '#374151',
                        fontSize: '1rem',
                      }}
                    >
                      Select Account/Page
                    </h4>
                    <select
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        marginBottom: 12,
                      }}
                    >
                      <option value="">Choose account...</option>
                      {platformData[currentPlatform as keyof typeof platformData]?.accounts.map(
                        (account) => (
                          <option key={account} value={account}>
                            {account}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div
                      onClick={() => setPublishOption('now')}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        border: publishOption === 'now' ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: publishOption === 'now' ? '#eff6ff' : 'white',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: '600',
                          color: '#374151',
                          fontSize: '0.9rem',
                          marginBottom: '0.25rem',
                        }}
                      >
                        Publish Now
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        Post immediately
                      </div>
                    </div>
                    <div
                      onClick={() => setPublishOption('schedule')}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        border:
                          publishOption === 'schedule'
                            ? '2px solid #3b82f6'
                            : '2px solid #e2e8f0',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: publishOption === 'schedule' ? '#eff6ff' : 'white',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: '600',
                          color: '#374151',
                          fontSize: '0.9rem',
                          marginBottom: '0.25rem',
                        }}
                      >
                        Schedule
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        Choose date & time
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4
                      style={{
                        margin: '0 0 0.75rem 0',
                        color: '#374151',
                        fontSize: '1rem',
                      }}
                    >
                      Caption/Content
                    </h4>
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      style={{
                        width: '100%',
                        height: '100px',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                      }}
                    />
                  </div>
                </>
              )}
              {publishStep === 'preview' && (
                <>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4
                      style={{
                        margin: '0 0 0.75rem 0',
                        color: '#374151',
                        fontSize: '1rem',
                      }}
                    >
                      Final Preview -{' '}
                      {platformData[currentPlatform as keyof typeof platformData]?.name}
                    </h4>
                    <div
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '1rem',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: '#374151',
                        minHeight: '120px',
                      }}
                    >
                      {caption}
                    </div>
                  </div>
                  <div
                    style={{
                      background: '#fef3c7',
                      padding: '1rem',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                    }}
                  >
                    <div>
                      <strong>Publishing to:</strong> {selectedAccount}
                    </div>
                    <div>
                      <strong>Timing:</strong>{' '}
                      {publishOption === 'now' ? 'Immediately' : 'Scheduled'}
                    </div>
                    <div>
                      <strong>Platform:</strong>{' '}
                      {platformData[currentPlatform as keyof typeof platformData]?.name}
                    </div>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                    ⚠️ This will publish your content to{' '}
                    {platformData[currentPlatform as keyof typeof platformData]?.name}. Make
                    sure you're ready!
                  </p>
                </>
              )}
              {publishStep === 'success' && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                  <h3
                    style={{
                      margin: '1rem 0 0.5rem 0',
                      color: '#1f2937',
                    }}
                  >
                    Successfully Published!
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                    Your content is now live on{' '}
                    {platformData[currentPlatform as keyof typeof platformData]?.name}
                  </p>
                  <div
                    style={{
                      background: '#ecfdf5',
                      padding: '1rem',
                      borderRadius: '8px',
                      textAlign: 'left',
                    }}
                  >
                    <div>
                      <strong>Published to:</strong> {selectedAccount}
                    </div>
                    <div>
                      <strong>Platform:</strong>{' '}
                      {platformData[currentPlatform as keyof typeof platformData]?.name}
                    </div>
                    <div>
                      <strong>Time:</strong> {new Date().toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              style={{
                background: '#f8fafc',
                padding: '1.5rem',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                gap: '1rem',
              }}
            >
              <button
                onClick={() => setShowPublishModal(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  background: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPublish}
                disabled={publishStep === 'setup' && !selectedAccount}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  background:
                    publishStep === 'setup' && !selectedAccount ? '#d1d5db' : '#10b981',
                  color: publishStep === 'setup' && !selectedAccount ? '#888' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor:
                    publishStep === 'setup' && !selectedAccount
                      ? 'not-allowed'
                      : 'pointer',
                  fontWeight: '600',
                }}
              >
                {publishStep === 'setup'
                  ? 'Preview Post'
                  : publishStep === 'preview'
                  ? `Publish to ${
                      platformData[currentPlatform as keyof typeof platformData]?.name
                    }`
                  : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Refresh Version Modal */}
      {showRefreshModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, color: '#1f2937', fontSize: '1.2rem' }}>
                Choose Your Preferred Version
              </h3>
            </div>
            <div style={{ padding: '1.5rem', maxHeight: '50vh', overflowY: 'auto' }}>
              {versionOptions.map((version, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedVersionIndex(index)}
                  style={{
                    background: selectedVersionIndex === index ? '#eff6ff' : '#f8fafc',
                    border:
                      selectedVersionIndex === index
                        ? '2px solid #3b82f6'
                        : '2px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>
                    {version.text}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    <strong>Tone:</strong> {version.tone} | <strong>Length:</strong>{' '}
                    {version.words} words
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                background: '#f8fafc',
                padding: '1.5rem',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                gap: '1rem',
              }}
            >
              <button
                onClick={() => setShowRefreshModal(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  background: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSelectVersion}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Use This Version
              </button>
            </div>
          </div>
        </div>
      )}
      {/* QR Code Modal */}
      {showQRModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1002,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              maxWidth: '400px',
              width: '90%',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div
              style={{
                background: '#fef3c7',
                padding: '1.5rem',
                borderBottom: '1px solid #f59e0b',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
              <h3 style={{ margin: 0, color: '#374151', fontSize: '1.2rem' }}>
                Your Universal QR Code
              </h3>
              <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
                Scan to access all 16 platform options
              </p>
            </div>
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              {qrCodeURL && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <img
                    src={qrCodeURL}
                    alt="QR Code"
                    style={{
                      width: '200px',
                      height: '200px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                </div>
              )}
              <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                Print this QR code on brochures, business cards, or signs. Tourists can scan
                to instantly access and share your story across all platforms!
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => {
                    // Download QR code
                    const link = document.createElement('a');
                    link.href = qrCodeURL;
                    link.download = 'story-qr-code.png';
                    link.click();
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  📥 Download QR
                </button>
                <button
                  onClick={() => setShowQRModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    background: '#e5e7eb',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
