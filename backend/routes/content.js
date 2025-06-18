// routes/content.js - Content generation with Claude API
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Initialize Claude API client
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Updated plan structure matching config/plans.ts
const PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'Get consistent with professional tourism content',
    limits: {
      storiesPerWeek: 2,
      qrCodesActive: 5,
      imageStorage: 500,
      demographics: 4,
      lifestyles: 4,
      users: 1,
      schedulingFeatures: false,
      analyticsLevel: 'basic',
      photoAttribution: true,
      price: 47,
      trialDays: 7
    },
    features: ['2 professional stories per week', 'Universal QR distribution', 'Basic analytics']
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Set your week\'s content on Monday, then focus on your guests',
    limits: {
      storiesPerWeek: 7,
      qrCodesActive: 25,
      imageStorage: 2000,
      demographics: 6,
      lifestyles: 6,
      users: 3,
      schedulingFeatures: true,
      analyticsLevel: 'advanced',
      photoAttribution: true,
      price: 147,
      trialDays: 7
    },
    features: ['7 stories per week (daily content)', 'Week scheduler', 'Advanced analytics'],
    popular: true
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Complete tourism marketing ecosystem for large operations',
    limits: {
      storiesPerWeek: -1,
      qrCodesActive: -1,
      imageStorage: -1,
      demographics: 6,
      lifestyles: 6,
      users: -1,
      schedulingFeatures: true,
      analyticsLevel: 'premium',
      photoAttribution: true,
      price: 547,
      trialDays: 7
    },
    features: ['Unlimited stories', 'White-label QR pages', 'Premium analytics']
  }
};

// Helper functions for plan validation
const getPlanLimits = (planId) => {
  return PLANS[planId]?.limits || PLANS.starter.limits;
};

const canCreateStory = (planId, storiesThisWeek) => {
  const limits = getPlanLimits(planId);
  return limits.storiesPerWeek === -1 || storiesThisWeek < limits.storiesPerWeek;
};

const canCreateQRCode = (planId, currentActiveQRs) => {
  const limits = getPlanLimits(planId);
  return limits.qrCodesActive === -1 || currentActiveQRs < limits.qrCodesActive;
};

// Platform-specific content specifications (updated for QR code distribution)
const PLATFORM_SPECS = {
  facebook: {
    maxLength: 2000,
    tone: 'casual and engaging',
    features: 'Use emojis, ask questions, encourage sharing',
    qrOptimized: 'Include QR code call-to-action for more details'
  },
  instagram: {
    maxLength: 2200,
    tone: 'visual and inspiring',
    features: 'Include relevant hashtags, story-driven, visual focus',
    qrOptimized: 'Perfect for Stories with QR code stickers'
  },
  linkedin: {
    maxLength: 1300,
    tone: 'professional and insightful',
    features: 'Industry insights, professional language, networking focus',
    qrOptimized: 'Professional QR code sharing for business networks'
  },
  twitter: {
    maxLength: 280,
    tone: 'concise and punchy',
    features: 'Thread-ready, hashtags, engaging hooks',
    qrOptimized: 'QR code perfect for threads and viral sharing'
  },
  website: {
    maxLength: 5000,
    tone: 'authoritative and comprehensive',
    features: 'SEO-optimized, detailed content, call-to-action',
    qrOptimized: 'QR codes drive traffic to full website content'
  },
  tiktok: {
    maxLength: 2200,
    tone: 'trend-aware and entertaining',
    features: 'Gen Z language, trending sounds, viral potential',
    qrOptimized: 'QR codes in video descriptions for engagement'
  }
};

// Updated audience targeting profiles for tourism focus
const AUDIENCE_PROFILES = {
  'Gen Z Digital Natives': 'Tech-savvy travelers (1997-2012) prioritizing authenticity, sustainability, and social sharing',
  'Millennial Experience Seekers': 'Experience-focused travelers (1981-1996) valuing unique adventures and Instagram-worthy moments',
  'Gen X Practical Realists': 'Family-focused travelers (1965-1980) seeking quality experiences with practical value',
  'Baby Boomer Traditionalists': 'Mature travelers (1946-1964) preferring comfort, service, and cultural depth'
};

// Tourism-specific interest categories
const INTEREST_TARGETING = {
  'Cultural Experiences': 'Museums, heritage sites, traditional arts, local customs, cultural immersion',
  'Adventure & Outdoor Activities': 'Hiking, extreme sports, nature exploration, adrenaline experiences',
  'Food & Wine': 'Culinary tours, local cuisine, wine tasting, cooking classes, food festivals',
  'Relaxation & Wellness': 'Spas, meditation retreats, wellness experiences, peaceful destinations',
  'History & Heritage': 'Historical sites, archaeological locations, cultural monuments, heritage trails',
  'Photography & Social Media': 'Instagram-worthy spots, photography workshops, social sharing opportunities'
};

// Main content generation endpoint
router.post('/generate', async (req, res) => {
  try {
    const {
      originalStory,
      targetAudience,
      primaryInterest,
      platforms = ['linkedin', 'facebook'], // Default to universal platforms
      sessionId,
      userId = 'guest',
      planId = 'starter', // Default to starter instead of free
      storiesThisWeek = 0,
      activeQRCodes = 0
    } = req.body;

    // Validation
    if (!originalStory || !targetAudience || !primaryInterest) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['originalStory', 'targetAudience', 'primaryInterest']
      });
    }

    // Check story creation limits
    if (!canCreateStory(planId, storiesThisWeek)) {
      const userPlan = PLANS[planId] || PLANS.starter;
      return res.status(402).json({
        error: 'Weekly story limit exceeded',
        planLimit: userPlan.limits.storiesPerWeek,
        currentUsage: storiesThisWeek,
        upgradeMessage: `Upgrade to ${planId === 'starter' ? 'Professional' : 'Enterprise'} for more stories per week`
      });
    }

    // Note: With QR code system, platform restrictions are less relevant
    // But we can still validate for direct API posting features
    const userPlan = PLANS[planId] || PLANS.starter;
    
    console.log(`🎯 Generating content for: ${targetAudience} interested in ${primaryInterest}`);
    console.log(`📱 Plan: ${userPlan.name} (${planId})`);

    // Step 1: Create enhanced master story with tourism focus
    const masterStory = await generateMasterStory(originalStory, targetAudience, primaryInterest);
    
    // Step 2: Generate platform-specific versions (for QR code distribution)
    const platformContent = {};
    for (const platform of platforms) {
      platformContent[platform] = await generatePlatformContent(masterStory, platform, targetAudience, primaryInterest);
    }

    // Step 3: Generate ALL download formats (available to all plans)
    const downloads = {
      pdf: await generatePDFContent(masterStory, targetAudience, primaryInterest),
      word: await generateWordContent(masterStory, targetAudience, primaryInterest),
      blogPost: await generateBlogContent(masterStory, targetAudience, primaryInterest),
      email: await generateEmailContent(masterStory, targetAudience, primaryInterest),
      pressRelease: await generatePressReleaseContent(masterStory, targetAudience, primaryInterest),
      staffNews: await generateStaffNewsContent(masterStory, targetAudience, primaryInterest),
      boardReport: await generateBoardReportContent(masterStory, targetAudience, primaryInterest),
      stakeholderLetter: await generateStakeholderLetterContent(masterStory, targetAudience, primaryInterest)
    };

    // Step 4: Generate QR code data (new feature)
    const qrCodeData = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      story: masterStory,
      platforms: platformContent,
      downloads: downloads,
      metadata: {
        targetAudience,
        primaryInterest,
        planId,
        userId
      }
    };

    const result = {
      sessionId: sessionId || uuidv4(),
      masterStory,
      platformContent,
      downloads,
      qrCode: {
        id: qrCodeData.id,
        url: `${process.env.BASE_URL || 'https://yourdomain.com'}/qr/${qrCodeData.id}`,
        data: qrCodeData
      },
      metadata: {
        originalLength: originalStory.length,
        targetAudience,
        primaryInterest,
        generatedAt: new Date().toISOString(),
        platforms: platforms,
        planId,
        planName: userPlan.name,
        planLimits: userPlan.limits,
        qrCodeEnabled: true
      }
    };

    res.json(result);

  } catch (error) {
    console.error('Content generation error:', error);
    res.status(500).json({
      error: 'Content generation failed',
      message: error.message
    });
  }
});

// New endpoint for QR code validation
router.post('/validate-qr-creation', async (req, res) => {
  try {
    const { planId, activeQRCodes = 0 } = req.body;
    
    const canCreate = canCreateQRCode(planId, activeQRCodes);
    const limits = getPlanLimits(planId);
    
    res.json({
      allowed: canCreate,
      currentUsage: activeQRCodes,
      limit: limits.qrCodesActive === -1 ? 'unlimited' : limits.qrCodesActive,
      remaining: limits.qrCodesActive === -1 ? 'unlimited' : Math.max(0, limits.qrCodesActive - activeQRCodes)
    });
  } catch (error) {
    res.status(500).json({ error: 'Validation failed', message: error.message });
  }
});

// Enhanced master story generation with tourism focus
async function generateMasterStory(originalStory, audience, interest) {
  const prompt = `You are a professional tourism content creator. Take this original story and enhance it for ${AUDIENCE_PROFILES[audience]} who are interested in ${INTEREST_TARGETING[interest]}.

Original story: "${originalStory}"

Create an enhanced, polished version that:
- Maintains the core message and authenticity
- Adds relevant tourism details that would appeal to ${audience}
- Incorporates ${interest} elements naturally
- Includes sensory details and emotional connections
- Is engaging and well-structured for tourism marketing
- Stays true to the original tone but makes it more compelling
- Optimized for QR code sharing and viral potential

Keep it between 200-400 words. Focus on storytelling quality that works across multiple platforms.`;

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1000,
    messages: [{
      role: "user",
      content: prompt
    }]
  });

  return message.content[0].text.trim();
}

// Generate platform-specific content optimized for QR distribution
async function generatePlatformContent(masterStory, platform, audience, interest) {
  const spec = PLATFORM_SPECS[platform];
  
  const prompt = `Transform this tourism story for ${platform.toUpperCase()} targeting ${audience} interested in ${interest}.

Master story: "${masterStory}"

Platform requirements:
- Maximum ${spec.maxLength} characters
- Tone: ${spec.tone}
- Features: ${spec.features}
- QR Code Optimization: ${spec.qrOptimized}

Create engaging ${platform} content that:
- Fits the platform's style and audience expectations
- Includes subtle call-to-action for QR code scanning
- Maintains tourism appeal and authenticity
- Optimized for sharing and engagement

Return only the platform-optimized content.`;

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 800,
    messages: [{
      role: "user",
      content: prompt
    }]
  });

  return {
    content: message.content[0].text.trim(),
    platform: platform,
    characterCount: message.content[0].text.length,
    maxLength: spec.maxLength,
    qrOptimized: true
  };
}

// Keep all the existing format generation functions (generatePDFContent, etc.) 
// but add tourism focus to the prompts...

// Generate PDF content with tourism focus
async function generatePDFContent(masterStory, audience, interest) {
  const prompt = `Create a professional tourism PDF document version of this story for ${audience} interested in ${interest}.

Story: "${masterStory}"

Format as tourism marketing material with:
- Compelling title that captures the experience
- Executive summary highlighting key attractions
- Main content with clear sections about the experience
- Practical information (when relevant)
- Call-to-action for bookings or more information

Target length: 500-800 words. Focus on tourism value and experience.`;

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1200,
    messages: [{ role: "user", content: prompt }]
  });

  return {
    content: message.content[0].text.trim(),
    format: 'pdf',
    wordCount: message.content[0].text.split(' ').length,
    tourismFocused: true
  };
}

// Generate Word document content with tourism focus
async function generateWordContent(masterStory, audience, interest) {
  const prompt = `Create an editable tourism Word document version of this story for ${audience} interested in ${interest}.

Story: "${masterStory}"

Format with clear heading structure for tourism marketing:
- Title and subtitle
- Experience overview
- Key highlights and attractions
- Visitor information section
- Contact and booking details placeholder

Target length: 400-600 words. Easy to edit for different tourism businesses.`;

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }]
  });

  return {
    content: message.content[0].text.trim(),
    format: 'word',
    wordCount: message.content[0].text.split(' ').length,
    tourismFocused: true
  };
}

// Continue with other format functions... (keeping similar tourism focus)
// generateBlogContent, generateEmailContent, generatePressReleaseContent, etc.
// [Include all the remaining functions with tourism-focused prompts]

// Get available plans endpoint (updated)
router.get('/plans', (req, res) => {
  res.json({
    plans: Object.values(PLANS),
    metadata: {
      currency: 'USD',
      billingPeriod: 'monthly',
      trialPeriod: 7,
      qrCodeEnabled: true,
      platformsIncluded: Object.keys(PLATFORM_SPECS)
    }
  });
});

module.exports = router;
