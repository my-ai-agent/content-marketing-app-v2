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
  const [isGenerating, setIsGenerating] = useState(true);

  // Sample generated content
  const [generatedContent, setGeneratedContent] = useState<{[key: string]: string}>({});

  // Load all data from previous pages
  useEffect(() => {
    const savedStory = localStorage.getItem('currentStory') || '';
    const savedDemographics = JSON.parse(localStorage.getItem('selectedDemographics') || '[]');
    const savedInterests = JSON.parse(localStorage.getItem('selectedInterests') || '[]');
    const savedFormats = JSON.parse(localStorage.getItem('selectedFormats') || '[]');
    const savedSocialPlatforms = JSON.parse(localStorage.getItem('selectedSocialPlatforms') || '[]');
    
    setStory(savedStory);
    setDemographics(savedDemographics);
    setInterests(savedInterests);
    setFormats(savedFormats);
    setSocialPlatforms(savedSocialPlatforms);
    
    // Set first format as active tab
    if (savedFormats.length > 0) {
      setActiveTab(savedFormats[0]);
    }

    // Simulate content generation
    setTimeout(() => {
      const mockContent: {[key: string]: string} = {};
      
      savedFormats.forEach((format: string) => {
        if (format === 'Social Media Posts') {
          savedSocialPlatforms.forEach((platform: string) => {
            mockContent[`${format} - ${platform}`] = generateMockContent(format, platform, savedStory);
          });
        } else {
          mockContent[format] = generateMockContent(format, '', savedStory);
        }
      });
      
      setGeneratedContent(mockContent);
      setIsGenerating(false);
    }, 3000);
  }, []);

  const generateMockContent = (format: string, platform: string, storyText: string) => {
    const storyPreview = storyText.substring(0, 100);
    
    switch (format) {
      case 'Social Media Posts':
        switch (platform) {
          case 'Instagram':
            return `🌟 ${storyPreview}...\n\nExperience authentic cultural stories that connect hearts across the world. ✨\n\n#CulturalTourism #AuthenticTravel #Stories #Culture\n\n📸 Share your story with us!`;
          case 'Facebook':
            return `${storyPreview}...\n\nThis story represents the beautiful cultural heritage that makes our community unique. Every tradition has a tale to tell, and every tale deserves to be shared with respect and authenticity.\n\nWhat cultural stories inspire you? Share in the comments below! 👇`;
          case 'Twitter':
            return `${storyPreview}... 🧵\n\nAuthentic cultural stories matter. They connect us, inspire us, and remind us of our shared humanity.\n\n#CulturalHeritage #Storytelling`;
          case 'LinkedIn':
            return `Cultural storytelling in tourism: ${storyPreview}...\n\nIn today's interconnected world, authentic cultural narratives drive meaningful travel experiences. This story demonstrates how traditional values can create lasting connections with modern audiences.\n\nKey insights:\n• Cultural authenticity builds trust\n• Stories create emotional connections\n• Respect for heritage drives sustainable tourism`;
          default:
            return `${storyPreview}...`;
        }
      case 'Blog Article':
        return `# Discovering Cultural Heritage: ${storyPreview}\n\n## Introduction\n\n${storyPreview}... This remarkable story showcases the rich cultural tapestry that defines our heritage and connects us to generations past.\n\n## The Story\n\n[Full story content would be expanded here with SEO-optimized sections]\n\n## Cultural Significance\n\nThis narrative represents more than just a tale – it embodies the values, traditions, and wisdom of our ancestors.\n\n## Conclusion\n\nCultural stories like this remind us of the importance of preserving our heritage while sharing it responsibly with the world.`;
      case 'Video Script':
        return `[SCENE 1 - OPENING]\n\nNARRATOR (V.O.): ${storyPreview}...\n\n[Visual: Establishing shots of cultural setting]\n\n[SCENE 2 - STORY DEVELOPMENT]\n\nNARRATOR: Every culture has stories that define who we are...\n\n[Visual: Close-ups of cultural elements mentioned in story]\n\n[SCENE 3 - CONCLUSION]\n\nNARRATOR: These stories connect us across time and space, reminding us of our shared humanity.\n\n[END SCREEN: Call to action]`;
      case 'Website Copy':
        return `# Experience Authentic Cultural Stories\n\n${storyPreview}...\n\nAt [Your Business], we believe every cultural story deserves to be told with respect, authenticity, and care. Our mission is to connect travelers with genuine cultural experiences that honor tradition while creating meaningful memories.\n\n## Why Choose Us?\n\n- Authentic cultural narratives\n- Respectful storytelling approach\n- Deep community connections\n- Sustainable tourism practices\n\n[Call to Action Button: Explore Our Stories]`;
      case 'Email Newsletter':
        return `Subject: A Cultural Story That Will Touch Your Heart\n\n---\n\nDear Cultural Explorer,\n\n${storyPreview}...\n\nThis week, we're sharing a story that beautifully illustrates the power of cultural heritage to bring people together. It's a reminder of why we do what we do – preserving and sharing the stories that make our world so wonderfully diverse.\n\nRead the full story and discover how you can experience this culture firsthand.\n\n[CTA: Read More]\n\nWith respect and gratitude,\nThe Cultural Stories Team`;
      case 'Press Release':
        return `FOR IMMEDIATE RELEASE\n\nLocal Cultural Initiative Showcases Heritage Through Authentic Storytelling\n\n[Location, Date] – ${storyPreview}... This initiative represents a growing movement to preserve and share cultural heritage through responsible tourism and authentic storytelling.\n\nThe program focuses on:\n- Authentic cultural representation\n- Community involvement\n- Sustainable tourism development\n- Heritage preservation\n\nFor more information, contact: [Contact Details]`;
      case 'Podcast Episode Outline':
        return `Episode Title: "Cultural Stories That Connect Us"\n\nINTRO (0-2 min)\n- Welcome and episode introduction\n- Brief context about cultural storytelling\n\nMAIN STORY (2-15 min)\n- ${storyPreview}...\n- Deep dive into the cultural significance\n- Interview segments (if applicable)\n\nCULTURAL CONTEXT (15-25 min)\n- Historical background\n- Modern relevance\n- Community impact\n\nCONCLUSION (25-30 min)\n- Key takeaways\n- How listeners can engage respectfully\n- Next episode preview`;
      default:
        return `Generated content for ${format}:\n\n${storyPreview}...`;
    }
  };

  const getAllTabs = () => {
    const tabs: string[] = [];
    formats.forEach(format => {
      if (format === 'Social Media Posts') {
        socialPlatforms.forEach(platform => {
          tabs.push(`${format} - ${platform}`);
        });
      } else {
        tabs.push(format);
      }
    });
    return tabs;
  };

  const handlePublish = () => {
    alert('Publishing feature coming soon! Your content has been saved to drafts.');
  };

  const handleEdit = (contentKey: string, newContent: string) => {
    setGeneratedContent(prev => ({
      ...prev,
      [contentKey]: newContent
    }));
  };

  if (isGenerating) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">🚀 Generating Your Content...</h2>
          <p className="text-gray-600">Creating {formats.length} formats tailored to your audience</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>✓ Analyzing your story</p>
            <p>✓ Optimizing for {demographics.length} demographics</p>
            <p>✓ Customizing for {interests.length} interests</p>
          </div>
        </div>
      </main>
    );
  }

  const allTabs = getAllTabs();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center justify-center mb-4">
  <img src="/logos/4.png" alt="Send" className="h-16 w-auto" />
</div>
<h1 className="text-xl font-bold text-gray-900 text-center">Generated Content</h1>
          <Link
            href="/dashboard"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* Success Banner */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-green-600 text-xl mr-3">✅</span>
            <div>
              <h3 className="text-sm font-medium text-green-800">Content Successfully Generated!</h3>
              <p className="text-sm text-green-700">
                Your story has been transformed into {allTabs.length} different formats. Click each tab to review and edit.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs and Editor */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {allTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content Editor */}
          <div className="p-6">
            {activeTab && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{activeTab}</h3>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedContent[activeTab] || '');
                        alert('Content copied to clipboard!');
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={handlePublish}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      📤 Publish
                    </button>
                  </div>
                </div>
                
                <textarea
                  value={generatedContent[activeTab] || ''}
                  onChange={(e) => handleEdit(activeTab, e.target.value)}
                  className="w-full h-64 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                  placeholder="Generated content will appear here..."
                />
                
                <div className="mt-3 text-xs text-gray-500">
                  Character count: {(generatedContent[activeTab] || '').length}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6 pb-6">
          <Link
            href="/dashboard/create/formats"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            ← Edit Formats
          </Link>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                // Save all content
                localStorage.setItem('generatedContent', JSON.stringify(generatedContent));
                alert('All content saved as drafts!');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              💾 Save All Drafts
            </button>
            <Link
              href="/dashboard"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              ✅ Complete
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mb-4">
          **Speak Click Send** is another **CCC Marketing Pro™ Saas 2025**
        </p>
      </div>
    </main>
  )
}
