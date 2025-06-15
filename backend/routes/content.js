// routes/content.js - Content generation with Claude API
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Initialize Claude API client
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Your exact plan structure from config/plans.ts
const PLANS = {
  free: {
    id: 'free',
    name: 'Free Forever',
    limits: {
      storiesPerWeek: 1,
      platforms: 2,
      price: 0
    },
    features: ['1 story per week - forever free', '2 social platforms', 'All 8 download formats']
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    limits: {
      storiesPerWeek: 5,
      platforms: 3,
      price: 97
    },
    features: ['5 stories per week', '3 social platforms', 'All 8 download formats']
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    limits: {
      storiesPerWeek: 5,
      platforms: 5,
      price: 197
    },
    features: ['5 stories per week', '5 social platforms', 'Advanced targeting'],
    popular: true
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    limits: {
      storiesPerWeek: -1,
      platforms: 10,
      price: 497
    },
    features: ['Unlimited stories', '10+ platforms', 'Team collaboration']
  }
};

// Platform-specific content specifications
const PLATFORM_SPECS = {
  facebook: {
    maxLength: 2000,
    tone: 'casual and engaging',
    features: 'Use emojis, ask questions, encourage sharing'
  },
  instagram: {
    maxLength: 2200,
    tone: 'visual and inspiring',
    features: 'Include relevant hashtags, story-driven, visual focus'
  },
  linkedin: {
    maxLength: 1300,
    tone: 'professional and insightful',
    features: 'Industry insights, professional language, networking focus'
  },
  twitter: {
    maxLength: 280,
    tone: 'concise and punchy',
    features: 'Thread-ready, hashtags, engaging hooks'
  },
  youtube: {
    maxLength: 5000,
    tone: 'descriptive and engaging',
    features: 'Video description format, timestamps, call-to-action'
  },
  pinterest: {
    maxLength: 500,
    tone: 'inspiring and actionable',
    features: 'Pin-worthy, keyword-rich, DIY/how-to focus'
  }
};

// Audience targeting profiles (from your app)
const AUDIENCE_PROFILES = {
  'Female Travelers': 'Women who love to explore, seeking authentic experiences and safety tips',
  'Families': 'Parents planning family-friendly activities and destinations',
  'Young Adults (18-35)': 'Adventure-seeking millennials and Gen Z, budget-conscious',
  'Business Travelers': 'Professionals seeking efficient, productive travel solutions',
  'Solo Travellers': 'Independent explorers wanting unique, self-guided experiences',
  'Mature Travelers': 'Experienced travelers (50+) seeking comfort and cultural depth'
};

// Interest categories (from your app)
const INTEREST_TARGETING = {
  'Cultural Experiences': 'Museums, heritage sites, traditional arts, local customs',
  'Adventure & Outdoor Activities': 'Hiking, sports, extreme activities, nature exploration',
  'Food & Wine': 'Culinary tours, local cuisine, wine tasting, food festivals',
  'Relaxation & Wellness': 'Spas, meditation, wellness retreats, peaceful destinations',
  'History & Heritage': 'Historical sites, archaeological locations, cultural monuments',
  'Photography & Social Media': 'Instagram-worthy spots, photography tips, social sharing',
  'Gardens & Nature': 'Botanical gardens, natural parks, wildlife, eco-tourism',
  'Arts & Creative Experiences': 'Art galleries, workshops, creative classes, festivals'
};

// Main content generation endpoint
router.post('/generate', async (req, res) => {
  try {
    const {
      originalStory,
      targetAudience,
      primaryInterest,
      platforms = ['facebook', 'instagram'],
      sessionId,
      userId = 'guest',
      planId = 'free'
    } = req.body;

    // Validation
    if (!originalStory || !targetAudience || !primaryInterest) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['originalStory', 'targetAudience', 'primaryInterest']
      });
    }

    // Check plan limits
    const userPlan = PLANS[planId] || PLANS.free;
    if (platforms.length > userPlan.limits.platforms) {
      return res.status(402).json({
        error: 'Platform limit exceeded',
        planLimit: userPlan.limits.platforms,
        requested: platforms.length,
        upgradeMessage: `Upgrade to ${planId === 'free' ? 'Basic' : 'higher'} plan for more platforms`
      });
    }

    console.log(`🎯 Generating content for: ${targetAudience} interested in ${primaryInterest}`);

    // Step 1: Create enhanced master story
    const masterStory = await generateMasterStory(originalStory, targetAudience, primaryInterest);
    
    // Step 2: Generate platform-specific versions
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

    const result = {
      sessionId: sessionId || uuidv4(),
      masterStory,
      platformContent,
      downloads,
      metadata: {
        originalLength: originalStory.length,
        targetAudience,
        primaryInterest,
        generatedAt: new Date().toISOString(),
        platforms: platforms,
        planId,
        planName: userPlan.name
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

// Generate enhanced master story using Claude
async function generateMasterStory(originalStory, audience, interest) {
  const prompt = `You are a professional content creator. Take this original story and enhance it for ${AUDIENCE_PROFILES[audience]} who are interested in ${INTEREST_TARGETING[interest]}.

Original story: "${originalStory}"

Create an enhanced, polished version that:
- Maintains the core message and authenticity
- Adds relevant details that would appeal to ${audience}
- Incorporates ${interest} elements naturally
- Is engaging and well-structured
- Stays true to the original tone but makes it more compelling

Keep it between 200-400 words. Focus on storytelling quality.`;

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

// Generate platform-specific content
async function generatePlatformContent(masterStory, platform, audience, interest) {
  const spec = PLATFORM_SPECS[platform];
  
  const prompt = `Transform this story for ${platform.toUpperCase()} targeting ${audience} interested in ${interest}.

Master story: "${masterStory}"

Platform requirements:
- Maximum ${spec.maxLength} characters
- Tone: ${spec.tone}
- Features: ${spec.features}

Create engaging ${platform} content that fits the platform's style and audience expectations.`;

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
    maxLength: spec.maxLength
  };
}

// Generate PDF content
async function generatePDFContent(masterStory, audience, interest) {
  const prompt = `Create a professional PDF document version of this story for ${audience} interested in ${interest}.

Story: "${masterStory}"

Format as:
- Compelling title
- Executive summary (2-3 sentences)
- Main content with clear sections
- Key takeaways or action items

Target length: 500-800 words.`;

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1200,
    messages: [{ role: "user", content: prompt }]
  });

  return {
    content: message.content[0].text.trim(),
    format: 'pdf',
    wordCount: message.content[0].text.split(' ').length
  };
}

// Generate Word document content
async function generateWordContent(masterStory, audience, interest) {
  const prompt = `Create an editable Word document version of this story for ${audience} interested in ${interest}.

Story: "${masterStory}"

Format with clear heading structure and sections for easy editing. Target length: 400-600 words.`;

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }]
  });

  return {
    content: message.content[0].text.trim(),
    format: 'word',
    wordCount: message.content[0].text.split(' ').length
  };
}

// Generate blog post content
async function generateBlogContent(masterStory, audience, interest) {
  const prompt = `Transform this story into an SEO-optimized blog post for ${audience} interested in ${interest}.

Story: "${masterStory}"

Create a blog post with:
- SEO-friendly title with keywords
- Engaging introduction
- Clear section headings
- Conclusion with call-to-action

600-900 words.`;

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }]
  });

  return {
    content: message.content[0].text.trim(),
    format: 'blog',
    wordCount: message.content[0].text.split(' ').length
  };
}

// Generate email newsletter content
async function generateEmailContent(masterStory, audience, interest) {
  const prompt = `Create an email newsletter version of this story for ${audience} interested in ${interest}.

Story: "${masterStory}"

Format as newsletter with compelling subject line and clear call-to-action. 300-500 words.`;

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }]
  });

  return {
    content: message.content[0].text.trim(),
    format: 'email',
    wordCount: message.content[0].text.split(' ').length
  };
}

// Generate press release content
async function generatePressReleaseContent(masterStory, audience, interest) {
  const prompt = `Transform this story into a professional press release format.

Story: "${masterStory}"

Create press release with:
- Compelling headline
- Dateline and introduction
- Quote from spokesperson
- Company boilerplate
- Contact information placeholder

400-600 words.`;

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }]
  });

  return {
    content: message.content[0].text.trim(),
    format: 'pressRelease',
    wordCount: message.content[0].text.split(' ').length
  };
}

// Generate staff news content
async function generateStaffNewsContent(masterStory, audience, interest) {
  const prompt = `Transform this story into internal staff news format.

Story: "${masterStory}"

Create staff communication with:
- Clear, engaging headline
- Context for internal audience
- Action items or next steps
- Encouraging tone

300-500 words.`;

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }]
  });

  return {
    content: message.content[0].text.trim(),
    format: 'staffNews',
    wordCount: message.content[0].text.split(' ').length
  };
}

// Generate board report content
async function generateBoardReportContent(masterStory, audience, interest) {
  const prompt = `Transform this story into executive board report format.

Story: "${masterStory}"

Create board report with:
- Executive summary
- Key metrics or outcomes
- Strategic implications
- Recommendations

500-700 words.`;

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1200,
    messages: [{ role: "user", content: prompt }]
  });

  return {
    content: message.content[0].text.trim(),
    format: 'boardReport',
    wordCount: message.content[0].text.split(' ').length
  };
}

// Generate stakeholder letter content
async function generateStakeholderLetterContent(masterStory, audience, interest) {
  const prompt = `Transform this story into stakeholder communication letter.

Story: "${masterStory}"

Create stakeholder letter with:
- Personal greeting
- Context and background
- Impact and benefits
- Partnership appreciation
- Professional closing

400-600 words.`;

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }]
  });

  return {
    content: message.content[0].text.trim(),
    format: 'stakeholderLetter',
    wordCount: message.content[0].text.split(' ').length
  };
}

// Get available plans
router.get('/plans', (req, res) => {
  res.json(Object.values(PLANS));
});

module.exports = router;
