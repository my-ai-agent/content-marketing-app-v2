// Executive Prompt Builder System
// File: /utils/ExecutivePromptBuilder.js

class ExecutivePromptBuilder {
  constructor() {
    this.promptData = {
      persona: null,
      photo: null,
      story: null,
      audience: null,
      interests: null,
      platforms: null,
      isComplete: false,
      completionPercentage: 0,
      lastUpdated: null,
      promptVersion: '1.0'
    };
    
    this.initializeFromStorage();
  }

  initializeFromStorage() {
    try {
      const existingPrompt = localStorage.getItem('executivePrompt');
      if (existingPrompt) {
        const parsed = JSON.parse(existingPrompt);
        this.promptData = { ...this.promptData, ...parsed };
      }
      this.validateCompleteness();
    } catch (error) {
      console.error('Error initializing executive prompt:', error);
      this.resetPrompt();
    }
  }

  updatePersonaData(personaSelection, customPersonaText = '') {
    const userTypeDetails = this.getUserTypeDetails(personaSelection, customPersonaText);
    
    this.promptData.persona = {
      selectedType: personaSelection,
      customDescription: customPersonaText,
      userTypeTitle: userTypeDetails.title,
      contentGoals: userTypeDetails.contentGoals,
      writingStyle: userTypeDetails.writingStyle,
      ctaFocus: userTypeDetails.ctaFocus,
      tonePreference: userTypeDetails.tonePreference,
      targetMetrics: userTypeDetails.targetMetrics,
      timestamp: new Date().toISOString()
    };
    
    this.saveAndValidate();
    console.log('✅ Executive Prompt: Persona data updated');
    return this.validateCompleteness();
  }

  updatePhotoData(photoFile, cropData = null, fileName = null) {
    this.promptData.photo = {
      hasPhoto: !!photoFile,
      fileName: fileName || 'uploaded-photo',
      fileSize: photoFile ? photoFile.size : null,
      fileType: photoFile ? photoFile.type : null,
      cropData: cropData,
      visualElements: this.analyzePhotoForPrompt(photoFile),
      timestamp: new Date().toISOString()
    };
    
    this.saveAndValidate();
    console.log('✅ Executive Prompt: Photo data updated');
    return this.validateCompleteness();
  }

  updateStoryData(storyText) {
    const storyAnalysis = this.analyzeStoryContent(storyText);
    
    this.promptData.story = {
      originalText: storyText,
      wordCount: storyText.split(' ').length,
      extractedElements: {
        locations: storyAnalysis.locations,
        activities: storyAnalysis.activities,
        emotions: storyAnalysis.emotions,
        culturalElements: storyAnalysis.culturalElements,
        experienceType: storyAnalysis.experienceType
      },
      contentHooks: storyAnalysis.contentHooks,
      seoKeywords: storyAnalysis.seoKeywords,
      timestamp: new Date().toISOString()
    };
    
    this.saveAndValidate();
    console.log('✅ Executive Prompt: Story data updated with analysis');
    return this.validateCompleteness();
  }

  updateAudienceData(audienceSelection) {
    const audienceDetails = this.parseAudienceDetails(audienceSelection);
    
    this.promptData.audience = {
      selectedAudience: audienceSelection,
      demographics: audienceDetails.demographics,
      psychographics: audienceDetails.psychographics,
      motivations: audienceDetails.motivations,
      painPoints: audienceDetails.painPoints,
      preferredTone: audienceDetails.preferredTone,
      contentPreferences: audienceDetails.contentPreferences,
      consumptionHabits: audienceDetails.consumptionHabits,
      timestamp: new Date().toISOString()
    };
    
    this.saveAndValidate();
    console.log('✅ Executive Prompt: Audience data updated');
    return this.validateCompleteness();
  }

  updateInterestsData(interestsSelection) {
    const interestDetails = this.getInterestDetails(interestsSelection);
    
    this.promptData.interests = {
      primaryInterest: interestsSelection,
      contentFocus: interestDetails.contentFocus,
      keyThemes: interestDetails.keyThemes,
      hashtagSuggestions: interestDetails.hashtagSuggestions,
      relatedTopics: interestDetails.relatedTopics,
      visualElements: interestDetails.visualElements,
      callToActionTypes: interestDetails.callToActionTypes,
      timestamp: new Date().toISOString()
    };
    
    this.saveAndValidate();
    console.log('✅ Executive Prompt: Interests data updated');
    return this.validateCompleteness();
  }

  updatePlatformData(platforms, formats) {
    const platformSpecs = platforms.map(platform => ({
      platform: platform,
      requirements: this.getPlatformRequirements(platform),
      bestPractices: this.getPlatformBestPractices(platform),
      characterLimits: this.getPlatformLimits(platform),
      hashtagGuidelines: this.getPlatformHashtagRules(platform)
    }));

    const formatSpecs = formats.map(format => ({
      format: format,
      specifications: this.getFormatSpecifications(format),
      structure: this.getFormatStructure(format),
      guidelines: this.getFormatGuidelines(format)
    }));

    this.promptData.platforms = {
      selectedPlatforms: platforms,
      selectedFormats: formats,
      platformSpecifications: platformSpecs,
      formatSpecifications: formatSpecs,
      crossPlatformStrategy: this.generateCrossPlatformStrategy(platforms, formats),
      contentVariations: this.planContentVariations(platforms, formats),
      timestamp: new Date().toISOString()
    };
    
    this.saveAndValidate();
    console.log('✅ Executive Prompt: Platform/Format data updated');
    return this.validateCompleteness();
  }

  analyzeStoryContent(storyText) {
    const text = storyText.toLowerCase();
    
    return {
      locations: this.extractLocations(text),
      activities: this.extractActivities(text),
      emotions: this.extractEmotions(text),
      culturalElements: this.extractCulturalElements(text),
      experienceType: this.identifyExperienceType(text),
      contentHooks: this.generateContentHooks(storyText),
      seoKeywords: this.extractSEOKeywords(text)
    };
  }

  extractLocations(text) {
    const nzLocations = [
      'rotorua', 'auckland', 'wellington', 'queenstown', 'christchurch',
      'whakarewarewa', 'tongariro', 'milford sound', 'bay of islands',
      'waitomo', 'franz josef', 'mount cook', 'taupo', 'hobbiton',
      'fiordland', 'marlborough', 'coromandel', 'abel tasman'
    ];
    
    const internationalLocations = [
      'paris', 'london', 'tokyo', 'new york', 'sydney', 'bangkok',
      'rome', 'barcelona', 'amsterdam', 'bali', 'iceland', 'norway'
    ];
    
    const allLocations = [...nzLocations, ...internationalLocations];
    return allLocations.filter(location => text.includes(location));
  }

  extractActivities(text) {
    const activities = [
      'hiking', 'thermal', 'geyser', 'cultural', 'adventure', 'scenic',
      'wildlife', 'photography', 'dining', 'wine', 'spa', 'museum',
      'kayaking', 'skiing', 'bungee', 'skydiving', 'fishing', 'sailing',
      'cycling', 'walking', 'shopping', 'festival', 'concert', 'art'
    ];
    
    return activities.filter(activity => text.includes(activity));
  }

  extractEmotions(text) {
    const emotions = [
      'amazing', 'incredible', 'breathtaking', 'peaceful', 'exciting',
      'inspiring', 'magical', 'unforgettable', 'stunning', 'beautiful',
      'awe-inspiring', 'relaxing', 'thrilling', 'memorable', 'spectacular'
    ];
    
    return emotions.filter(emotion => text.includes(emotion));
  }

  extractCulturalElements(text) {
    const culturalKeywords = [
      'māori', 'maori', 'hangi', 'haka', 'wharenui', 'marae', 'pounamu',
      'iwi', 'tangata whenua', 'te reo', 'cultural', 'traditional',
      'indigenous', 'heritage', 'spiritual', 'ceremony', 'ritual'
    ];
    
    return culturalKeywords.filter(cultural => text.includes(cultural));
  }

  identifyExperienceType(text) {
    if (text.includes('luxury') || text.includes('spa') || text.includes('fine dining')) {
      return 'luxury';
    }
    if (text.includes('adventure') || text.includes('hiking') || text.includes('extreme')) {
      return 'adventure';
    }
    if (text.includes('cultural') || text.includes('māori') || text.includes('traditional')) {
      return 'cultural';
    }
    if (text.includes('family') || text.includes('kids') || text.includes('children')) {
      return 'family';
    }
    if (text.includes('romantic') || text.includes('couple') || text.includes('honeymoon')) {
      return 'romantic';
    }
    return 'general';
  }

  generateContentHooks(storyText) {
    const hooks = [];
    const text = storyText.toLowerCase();
    
    if (text.includes('first time')) hooks.push('First-time experience angle');
    if (text.includes('hidden') || text.includes('secret')) hooks.push('Hidden gem discovery');
    if (text.includes('local') || text.includes('authentic')) hooks.push('Authentic local experience');
    if (text.includes('unexpected') || text.includes('surprised')) hooks.push('Unexpected discovery');
    if (text.includes('perfect') || text.includes('ideal')) hooks.push('Perfect moment/timing');
    
    return hooks;
  }

  extractSEOKeywords(text) {
    const commonTourismKeywords = [
      'new zealand', 'travel', 'tourism', 'destination', 'experience',
      'adventure', 'cultural', 'scenic', 'natural', 'unique'
    ];
    
    const extractedLocations = this.extractLocations(text);
    const extractedActivities = this.extractActivities(text);
    
    return [...commonTourismKeywords, ...extractedLocations, ...extractedActivities]
      .filter(keyword => text.includes(keyword));
  }

  getUserTypeDetails(personaType, customText = '') {
    const personaMap = {
      'tourism-business-owner': {
        title: 'Tourism Business Owner',
        contentGoals: 'Lead generation, customer acquisition, bookings, brand credibility',
        writingStyle: 'Professional, persuasive, action-oriented, trustworthy',
        ctaFocus: 'Book now, Contact us, Learn more, Get quote',
        tonePreference: 'Authoritative yet approachable, confident',
        targetMetrics: 'Conversion rate, booking inquiries, website traffic'
      },
      'content-creator': {
        title: 'Travel Content Creator',
        contentGoals: 'Audience engagement, social reach, portfolio building, brand partnerships',
        writingStyle: 'Engaging, descriptive, storytelling-focused, relatable',
        ctaFocus: 'Follow, Share, Save, Comment, Tag friends',
        tonePreference: 'Creative, inspiring, authentic',
        targetMetrics: 'Engagement rate, followers, shares, saves'
      },
      'travel-enthusiast': {
        title: 'Travel Enthusiast',
        contentGoals: 'Experience sharing, inspiration, community building, personal memories',
        writingStyle: 'Personal, authentic, enthusiastic, conversational',
        ctaFocus: 'Explore, Discover, Experience, Share your story',
        tonePreference: 'Passionate, genuine, friendly',
        targetMetrics: 'Community engagement, inspiration impact, personal satisfaction'
      },
      'other': {
        title: 'Custom Content Creator',
        contentGoals: customText || 'Unique content creation goals',
        writingStyle: 'Personalized based on custom description',
        ctaFocus: 'Custom calls-to-action based on goals',
        tonePreference: 'Adapted to user\'s specific needs',
        targetMetrics: 'Custom success metrics based on goals'
      }
    };

    return personaMap[personaType] || personaMap['content-creator'];
  }

  parseAudienceDetails(audience) {
    const audienceMap = {
      'Millennials (1981-1996) - Experience-focused, cultural seekers': {
        demographics: 'Ages 27-42, tech-savvy, experience-oriented',
        psychographics: 'Values authenticity, cultural immersion, sustainable travel',
        motivations: 'Instagram-worthy moments, cultural learning, work-life balance',
        painPoints: 'Budget constraints, time limitations, overtourism concerns',
        preferredTone: 'Authentic, inspiring, relatable',
        contentPreferences: 'Visual storytelling, behind-the-scenes, cultural insights',
        consumptionHabits: 'Mobile-first, social media driven, peer recommendations'
      },
      'Gen Z (1997-2012) - Digital natives prioritizing authenticity': {
        demographics: 'Ages 11-26, true digital natives, socially conscious',
        psychographics: 'Prioritizes authenticity, social justice, environmental consciousness',
        motivations: 'Authentic experiences, social impact, personal growth',
        painPoints: 'Limited budget, climate concerns, social anxiety',
        preferredTone: 'Genuine, casual, socially aware',
        contentPreferences: 'Short-form video, authentic stories, diverse perspectives',
        consumptionHabits: 'TikTok and Instagram focused, values peer authenticity'
      }
    };

    return audienceMap[audience] || {
      demographics: 'General traveler demographic',
      psychographics: 'Values authentic travel experiences',
      motivations: 'Memorable experiences and cultural exploration',
      painPoints: 'Planning complexity and budget considerations',
      preferredTone: 'Friendly and informative',
      contentPreferences: 'Practical information and inspiring stories',
      consumptionHabits: 'Multi-platform social media engagement'
    };
  }

  getInterestDetails(interest) {
    const interestMap = {
      'Adventure & Outdoor Activities': {
        contentFocus: 'Adrenaline activities, outdoor exploration, physical challenges',
        keyThemes: 'Adventure, challenge, nature, adrenaline, exploration',
        hashtagSuggestions: ['#Adventure', '#Outdoor', '#Adrenaline', '#Explore', '#NatureLovers'],
        relatedTopics: ['Hiking trails', 'Extreme sports', 'Wildlife encounters', 'Scenic landscapes'],
        visualElements: 'Action shots, scenic vistas, equipment, before/after moments',
        callToActionTypes: 'Book adventure, Try extreme activities, Explore outdoors'
      },
      'Cultural Experiences & Heritage': {
        contentFocus: 'Cultural immersion, traditional practices, historical significance',
        keyThemes: 'Culture, heritage, tradition, authenticity, learning',
        hashtagSuggestions: ['#Culture', '#Heritage', '#Traditional', '#Authentic', '#MāoriCulture'],
        relatedTopics: ['Traditional ceremonies', 'Historical sites', 'Cultural performances', 'Local crafts'],
        visualElements: 'Cultural artifacts, traditional dress, ceremonies, historical sites',
        callToActionTypes: 'Learn about culture, Experience traditions, Respect heritage'
      }
    };

    return interestMap[interest] || {
      contentFocus: 'General travel interests and experiences',
      keyThemes: 'Travel, exploration, experiences, adventure',
      hashtagSuggestions: ['#Travel', '#Explore', '#Adventure', '#Experience'],
      relatedTopics: ['Local attractions', 'Travel tips', 'Cultural experiences'],
      visualElements: 'Travel moments, scenic views, cultural experiences',
      callToActionTypes: 'Explore destination, Book experience, Discover more'
    };
  }

  getPlatformRequirements(platform) {
    const requirements = {
      'Instagram': 'Visual storytelling focus, 15-20 relevant hashtags, engaging captions under 2200 characters',
      'Facebook': 'Encourage community engagement, use storytelling format, include event/location tags',
      'Blog': 'SEO-optimized headings and structure, internal linking opportunities, comprehensive storytelling 800-1200 words'
    };

    return requirements[platform] || 'Platform-optimized content following best practices for engagement and reach';
  }

  getPlatformBestPractices(platform) {
    const practices = {
      'Instagram': 'Post during peak hours, use location tags, engage with comments quickly',
      'Facebook': 'Post when audience is most active, encourage meaningful conversations',
      'Blog': 'Publish consistently, optimize for featured snippets, include internal links'
    };

    return practices[platform] || 'Follow platform-specific best practices for optimal engagement and reach';
  }

  getPlatformLimits(platform) {
    const limits = {
      'Instagram': 'Caption: 2200 characters, Hashtags: 30 max (15-20 recommended)',
      'Facebook': 'Post: 63,206 characters (500 recommended)',
      'Blog': 'Title: 60 characters for SEO, Meta description: 160 characters, Content: 800-1200 words optimal'
    };

    return limits[platform] || 'Standard platform character and content limits apply';
  }

  getPlatformHashtagRules(platform) {
    const rules = {
      'Instagram': 'Use 15-20 hashtags, mix popular and niche tags, include location hashtags',
      'Facebook': 'Use 1-2 hashtags maximum, focus on branded hashtags',
      'Blog': 'Use hashtag-style keywords in content, focus on SEO keywords'
    };

    return rules[platform] || 'Use relevant, searchable hashtags appropriate for the platform';
  }

  getFormatSpecifications(format) {
    const specifications = {
      'Social Post': 'Engaging hook in first line, clear value proposition, relevant hashtags, strong CTA',
      'Blog Article': 'SEO-optimized structure with H1/H2/H3 headings, compelling introduction, detailed body content',
      'Email Newsletter': 'Subject line optimization, personal greeting, scannable content with bullet points'
    };

    return specifications[format] || 'Format-optimized content structure with clear messaging and appropriate CTAs';
  }

  getFormatStructure(format) {
    const structures = {
      'Social Post': 'Hook → Value/Story → Call-to-Action → Hashtags',
      'Blog Article': 'Title → Introduction → Main Content (H2 sections) → Conclusion → CTA',
      'Email Newsletter': 'Subject Line → Personal Greeting → Main Content → CTA → Signature'
    };

    return structures[format] || 'Standard content structure with introduction, main content, and call-to-action';
  }

  getFormatGuidelines(format) {
    const guidelines = {
      'Social Post': 'Keep mobile-friendly, use emojis strategically, encourage engagement',
      'Blog Article': 'Write for SEO and readers, use internal links, include images',
      'Email Newsletter': 'Personalize content, segment audience, optimize for mobile'
    };

    return guidelines[format] || 'Follow format best practices for maximum impact and audience engagement';
  }

  generateCrossPlatformStrategy(platforms, formats) {
    return {
      contentRepurposing: 'Adapt core message for each platform while maintaining consistency',
      messagingConsistency: 'Maintain core message while adapting tone and format for each platform',
      timingStrategy: 'Stagger posts across platforms for maximum reach without audience overlap',
      engagementApproach: 'Tailor engagement style to platform norms while maintaining brand voice'
    };
  }

  planContentVariations(platforms, formats) {
    const variations = [];
    platforms.forEach(platform => {
      formats.forEach(format => {
        variations.push({
          platform: platform,
          format: format,
          adaptation: `Optimize ${format} content for ${platform} audience behavior and engagement patterns`
        });
      });
    });
    return variations;
  }

  analyzePhotoForPrompt(photoFile) {
    return {
      hasPhoto: !!photoFile,
      suggestedVisualElements: 'Include photo in content strategy',
      photoDescription: 'User-uploaded photo enhances storytelling'
    };
  }

  validateCompleteness() {
    const requiredSections = ['story', 'audience', 'interests', 'platforms'];
    const completedSections = requiredSections.filter(section =>
      this.promptData[section] !== null && this.promptData[section] !== undefined
    );

    const isComplete = completedSections.length === requiredSections.length;
    const completionPercentage = Math.round((completedSections.length / requiredSections.length) * 100);

    this.promptData.isComplete = isComplete;
    this.promptData.completionPercentage = completionPercentage;
    this.promptData.missingSections = requiredSections.filter(section =>
      this.promptData[section] === null || this.promptData[section] === undefined
    );

    this.notifyCompletionStatus(completionPercentage, isComplete);

    return { isComplete, completionPercentage, completedSections, missingSections: this.promptData.missingSections };
  }

  generateClaudePrompt() {
    if (!this.promptData.isComplete) {
      throw new Error(`Executive Prompt incomplete. Missing: ${this.promptData.missingSections.join(', ')}`);
    }

    const prompt = `
# TOURISM CONTENT CREATION BRIEF

## CONTENT CREATOR CONTEXT
**Creator Type:** ${this.promptData.persona?.userTypeTitle || 'Content Creator'}
**Content Goals:** ${this.promptData.persona?.contentGoals || 'Engaging content creation'}
**Writing Style:** ${this.promptData.persona?.writingStyle || 'Engaging and authentic'}
**Preferred CTAs:** ${this.promptData.persona?.ctaFocus || 'Engage and explore'}
**Tone Preference:** ${this.promptData.persona?.tonePreference || 'Friendly and inspiring'}
${this.promptData.persona?.customDescription ? `**Custom Focus:** ${this.promptData.persona.customDescription}` : ''}

## CULTURAL GUIDELINES
- **CRITICAL:** Always respect Mātauranga Māori (Māori knowledge systems) and cultural protocols
- Use culturally appropriate language when referencing Māori places, experiences, and concepts
- Promote sustainable and ethical tourism practices that benefit local communities
- Acknowledge tangata whenua (people of the land) when discussing New Zealand destinations
${this.promptData.story?.extractedElements?.culturalElements?.length > 0 ? 
  `- **Cultural Elements Present:** ${this.promptData.story.extractedElements.culturalElements.join(', ')}` : ''}

## STORY CONTEXT
**Original Experience:**
${this.promptData.story?.originalText || 'Amazing travel experience to be shared'}

**Extracted Story Elements:**
${this.promptData.story?.extractedElements?.locations?.length > 0 ? 
  `- **Locations:** ${this.promptData.story.extractedElements.locations.join(', ')}` : ''}
${this.promptData.story?.extractedElements?.activities?.length > 0 ? 
  `- **Activities:** ${this.promptData.story.extractedElements.activities.join(', ')}` : ''}
${this.promptData.story?.extractedElements?.emotions?.length > 0 ? 
  `- **Emotional Tone:** ${this.promptData.story.extractedElements.emotions.join(', ')}` : ''}

## TARGET AUDIENCE ANALYSIS
**Primary Audience:** ${this.promptData.audience?.selectedAudience || 'Travel enthusiasts'}
**Demographics:** ${this.promptData.audience?.demographics || 'General travel audience'}
**Motivations:** ${this.promptData.audience?.motivations || 'Memorable travel experiences'}
**Preferred Tone:** ${this.promptData.audience?.preferredTone || 'Friendly and informative'}

## CONTENT FOCUS & INTERESTS
**Primary Interest:** ${this.promptData.interests?.primaryInterest || 'General travel experiences'}
**Key Themes:** ${this.promptData.interests?.keyThemes?.join(', ') || 'Travel and exploration'}
**Suggested Hashtags:** ${this.promptData.interests?.hashtagSuggestions?.join(' ') || '#Travel #Explore #NewZealand'}

## PLATFORM & FORMAT REQUIREMENTS
**Target Platforms:** ${this.promptData.platforms?.selectedPlatforms?.join(', ') || 'Social media platforms'}
**Content Formats:** ${this.promptData.platforms?.selectedFormats?.join(', ') || 'Engaging content formats'}

## CONTENT CREATION INSTRUCTIONS
Please generate comprehensive, ready-to-publish content that transforms this travel story into powerful, engaging material for ${this.promptData.platforms?.selectedPlatforms?.join(', ') || 'multiple platforms'}. Each piece should be culturally sensitive, audience-targeted, and optimized for maximum engagement while respecting Mātauranga Māori and promoting ethical tourism practices.

---
*Generated by Click Speak Send Executive Prompt Builder v${this.promptData.promptVersion}*
`;

    return prompt.trim();
  }

  saveAndValidate() {
    this.promptData.lastUpdated = new Date().toISOString();
    localStorage.setItem('executivePrompt', JSON.stringify(this.promptData));
    return this.validateCompleteness();
  }

  resetPrompt() {
    this.promptData = {
      persona: null,
      photo: null,
      story: null,
      audience: null,
      interests: null,
      platforms: null,
      isComplete: false,
      completionPercentage: 0,
      lastUpdated: null,
      promptVersion: '1.0'
    };
    localStorage.removeItem('executivePrompt');
    console.log('🔄 Executive Prompt Builder reset');
  }

  notifyCompletionStatus(percentage, isComplete) {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('promptProgress', {
        detail: { 
          percentage, 
          isComplete, 
          promptData: this.promptData,
          readyForGeneration: isComplete
        }
      });
      window.dispatchEvent(event);
    }
  }

  exportPromptData() {
    return {
      promptData: this.promptData,
      generatedPrompt: this.promptData.isComplete ? this.generateClaudePrompt() : null,
      validationStatus: this.validateCompleteness()
    };
  }
}

export default ExecutivePromptBuilder;
