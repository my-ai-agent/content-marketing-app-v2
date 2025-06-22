// culturalIntelligence.js - Subtle cultural awareness for tourism content

export const generateClaudePrompt = (context) => {
  const { photo, userContent, userChoice, demographics, location = "New Zealand" } = context;
  
  // Base prompt for cultural intelligence
  const basePrompt = `
TOURISM CONTENT ENHANCEMENT:

Context: Tourism content creation for ${location}
Photo: [User's travel photo attached]
Content Type: ${userChoice === 'quick' ? 'Quick Caption' : 'Enhanced Story'}
Content: "${userContent}"
${demographics ? `Target Audience: ${demographics}` : ''}

Please enhance this tourism content with:
- Natural storytelling that respects local culture
- Appropriate tone for ${userChoice === 'quick' ? 'social media caption' : 'professional travel narrative'}
- ${userChoice === 'quick' ? 'Single sentence format' : 'Rich, engaging story format'}
- Subtle cultural context awareness (not overwhelming)
- Platform optimization for tourism sharing
${demographics ? '- Content tailored to target demographic' : ''}

Guidelines:
- Keep cultural references authentic but not forced
- Focus on the tourist experience and emotions
- Ensure content is respectful and inclusive
- ${userChoice === 'quick' ? 'Keep it concise and shareable' : 'Create compelling narrative for professional use'}
- Make it engaging for potential visitors to the region

Please provide enhanced content that a tourist would be proud to share.
  `;

  return basePrompt.trim();
};

export const getCulturalContext = (location) => {
  const contexts = {
    'New Zealand': {
      respectfulLanguage: ['experience', 'journey', 'discover', 'connect'],
      culturalElements: ['natural beauty', 'landscapes', 'hospitality', 'adventure'],
      avoidTerms: ['conquered', 'untouched', 'primitive'],
      suggestedTone: 'respectful appreciation for nature and culture'
    },
    'Australia': {
      respectfulLanguage: ['explore', 'appreciate', 'witness', 'enjoy'],
      culturalElements: ['diverse landscapes', 'unique wildlife', 'coastal beauty'],
      avoidTerms: ['wild', 'untamed', 'empty'],
      suggestedTone: 'celebration of natural diversity and adventure'
    },
    'Canada': {
      respectfulLanguage: ['experience', 'discover', 'embrace', 'appreciate'],
      culturalElements: ['wilderness', 'natural beauty', 'cultural diversity'],
      avoidTerms: ['wilderness conquered', 'empty lands'],
      suggestedTone: 'respect for nature and multicultural heritage'
    }
    // Add more locations as needed
  };

  return contexts[location] || contexts['New Zealand']; // Default to New Zealand
};

export const enhanceContentWithCulturalAwareness = (content, location = "New Zealand") => {
  const context = getCulturalContext(location);
  
  // Simple enhancement rules (non-AI fallback)
  let enhanced = content;
  
  // Replace potentially insensitive terms
  context.avoidTerms.forEach(term => {
    const respectfulAlternative = context.respectfulLanguage[0];
    enhanced = enhanced.replace(new RegExp(term, 'gi'), respectfulAlternative);
  });
  
  return enhanced;
};

export const getDemographicPromptAddition = (demographics) => {
  if (!demographics) return '';
  
  const demographicPrompts = {
    'Gen Z (1997-2012)': 'Use authentic, genuine language that values real experiences over perfection. Include elements that would resonate on social platforms.',
    'Millennials (1981-1996)': 'Focus on experiential value and cultural authenticity. Emphasize personal growth and meaningful connections.',
    'Gen X (1965-1980)': 'Balance adventure with comfort. Highlight family-friendly aspects and practical value.',
    'Baby Boomers (1946-1964)': 'Emphasize comfort, safety, and enriching experiences. Focus on cultural and historical significance.',
    'Multi-Generational Families': 'Highlight experiences that appeal to all ages. Emphasize shared memories and inclusive activities.',
    'Business & Corporate Travellers': 'Focus on efficiency, professional quality, and networking opportunities.'
  };
  
  return demographicPrompts[demographics] || '';
};

export const getPlatformOptimizationHint = (userChoice) => {
  if (userChoice === 'quick') {
    return `
Platform optimization for quick sharing:
- Instagram: Hashtag-friendly, visual storytelling
- Facebook: Engaging and shareable with friends
- Twitter: Concise and impactful
- TikTok: Authentic and moment-focused
    `;
  } else {
    return `
Platform optimization for enhanced content:
- LinkedIn: Professional travel insights
- Blog posts: Rich storytelling and detailed experiences
- Travel websites: Comprehensive destination information
- Press releases: Media-ready professional content
- Email newsletters: Engaging travel narratives
    `;
  }
};

export const createClaudeEnhancementPrompt = (context) => {
  const basePrompt = generateClaudePrompt(context);
  const demographicAddition = getDemographicPromptAddition(context.demographics);
  const platformHint = getPlatformOptimizationHint(context.userChoice);
  
  return `${basePrompt}

${demographicAddition}

${platformHint}

Please provide culturally intelligent, tourism-focused content that respects local heritage while creating compelling travel narrative.`;
};

export const formatForClaudeInterface = (context) => {
  const prompt = createClaudeEnhancementPrompt(context);
  
  // Prepare data for Claude interface
  return {
    prompt,
    photoData: context.photo,
    userChoice: context.userChoice,
    originalContent: context.userContent,
    enhancementLevel: context.userChoice === 'quick' ? 'caption' : 'professional'
  };
};
