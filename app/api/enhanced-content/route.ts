import { NextResponse } from 'next/server'

// Generational Psychology Profiles for Content Generation
const generationalProfiles = {
  'Gen Z (1997-2012) - Digital natives prioritizing authenticity': {
    platforms: ['TikTok', 'Instagram', 'Snapchat'],
    contentStyle: 'authentic, visual, mobile-first, sustainable',
    decisionFactors: ['social proof', 'sustainability', 'authenticity', 'visual appeal'],
    communicationStyle: 'casual, direct, emoji-friendly, story-driven',
    valuePropositions: ['authenticity', 'sustainability', 'self-discovery', 'social impact'],
    contentFormats: ['short videos', 'Instagram stories', 'visual content', 'user-generated content'],
    callToActionStyle: 'urgent, FOMO-driven, community-focused'
  },
  'Millennials (1981-1996) - Experience-focused, cultural seekers': {
    platforms: ['Instagram', 'Facebook', 'YouTube'],
    contentStyle: 'experience-focused, research-backed, authentic, detailed',
    decisionFactors: ['reviews', 'authenticity', 'value', 'social sharing potential'],
    communicationStyle: 'conversational, informative, story-telling, experience-rich',
    valuePropositions: ['authentic experiences', 'personal growth', 'cultural immersion', 'memories'],
    contentFormats: ['long-form posts', 'detailed guides', 'experience stories', 'photo galleries'],
    callToActionStyle: 'experience-driven, value-focused, socially shareable'
  },
  'Gen X (1965-1980) - Family-focused, value-conscious': {
    platforms: ['Facebook', 'Email', 'Google Search'],
    contentStyle: 'practical, family-oriented, value-focused, informative',
    decisionFactors: ['safety', 'value', 'family-friendly', 'convenience'],
    communicationStyle: 'straightforward, practical, benefit-focused, trustworthy',
    valuePropositions: ['family bonding', 'practical benefits', 'value for money', 'convenience'],
    contentFormats: ['detailed articles', 'family guides', 'practical tips', 'comparison content'],
    callToActionStyle: 'benefit-focused, family-oriented, value-driven'
  },
  'Baby Boomers (1946-1964) - Comfort-seeking, knowledge-focused': {
    platforms: ['Email', 'Facebook', 'Traditional websites'],
    contentStyle: 'informative, comfortable, service-oriented, traditional',
    decisionFactors: ['comfort', 'service quality', 'reputation', 'expert guidance'],
    communicationStyle: 'formal, respectful, detailed, expert-led',
    valuePropositions: ['cultural enrichment', 'comfort', 'expert guidance', 'premium service'],
    contentFormats: ['detailed brochures', 'expert articles', 'testimonials', 'traditional marketing'],
    callToActionStyle: 'comfort-focused, service-oriented, expert-recommended'
  },
  'Multi-Generational Families - Mixed-age groups': {
    platforms: ['Facebook', 'WhatsApp', 'Email'],
    contentStyle: 'inclusive, flexible, memory-focused, adaptable',
    decisionFactors: ['inclusivity', 'flexibility', 'group appeal', 'accessibility'],
    communicationStyle: 'inclusive, warm, memory-focused, family-oriented',
    valuePropositions: ['shared memories', 'inclusive experiences', 'family bonding', 'accessibility'],
    contentFormats: ['family stories', 'inclusive content', 'accessibility guides', 'group activities'],
    callToActionStyle: 'inclusive, memory-focused, family-bonding'
  },
  'Business & Corporate Travellers - Professional efficiency-focused': {
    platforms: ['LinkedIn', 'Email', 'Professional networks'],
    contentStyle: 'professional, efficient, ROI-focused, networking-oriented',
    decisionFactors: ['efficiency', 'professional value', 'networking opportunities', 'ROI'],
    communicationStyle: 'professional, concise, benefit-focused, results-oriented',
    valuePropositions: ['professional development', 'business success', 'networking', 'efficiency'],
    contentFormats: ['professional case studies', 'ROI analysis', 'networking content', 'business benefits'],
    callToActionStyle: 'professional, ROI-focused, efficiency-driven'
  }
}

// New Zealand Cultural Context
const nzCulturalContext = {
  locations: {
    'Christchurch': {
      iwi: 'Ngāi Tahu',
      culturalElements: ['Garden City', 'Māori heritage', 'Rebuild story', 'Canterbury Plains'],
      seasonalHighlights: ['Spring gardens', 'Winter skiing', 'Autumn colours', 'Summer festivals']
    },
    'Auckland': {
      iwi: 'Ngāti Whātua',
      culturalElements: ['City of Sails', 'Polynesian culture', 'Urban diversity', 'Harbour bridge'],
      seasonalHighlights: ['Summer beaches', 'Winter events', 'Spring blooms', 'Autumn wine']
    },
    'Wellington': {
      iwi: 'Te Āti Awa',
      culturalElements: ['Capital culture', 'Arts scene', 'Wellington wind', 'Craft beer'],
      seasonalHighlights: ['Summer festivals', 'Winter storms', 'Spring culture', 'Autumn theatre']
    },
    'Queenstown': {
      iwi: 'Ngāi Tahu',
      culturalElements: ['Adventure capital', 'Southern Alps', 'Lake Wakatipu', 'Gold mining history'],
      seasonalHighlights: ['Winter skiing', 'Summer adventures', 'Spring hiking', 'Autumn colours']
    }
  },
  maoriGreetings: ['Kia ora', 'Haere mai', 'Nau mai'],
  culturalValues: ['manaakitanga (hospitality)', 'whakapapa (connections)', 'taiao (environment)']
}

// Sophisticated content generation functions
function generateGenZContent(story: string, interests: string[], culturalContext: any) {
  const interestTags = interests?.map(i => `#${i.replace(/\s+/g, '')}`).join(' ') || '#Travel'
  
  return {
    social: `bestie listen up 👀

${story.toLowerCase().includes('tourism') ? 'this tourism thing' : 'this'} is actually giving main character energy

no cap - this isn't another corporate money grab
it's the sustainable travel moment we've been waiting for ✨

your future self will thank you
(and so will the planet) 🌍

${interestTags} #MainCharacterMoments #ActuallyMatters #NotSponsored`,

    detailed: `okay but why ${story.split(' ').slice(0, 3).join(' ').toLowerCase()} is the move:

🚫 zero greenwashing BS
✅ actually helps communities 
💯 your values + wanderlust aligned
📱 content that doesn't feel performative
🌱 climate anxiety? not here
💸 worth every penny (we know money's tight)

this is what conscious travel looks like when it's not cringe

finally - experiences that match our energy
no fake sustainability theater
just real impact + genuine connections

the kind of travel that heals instead of harming 🤍`,

    cta: `not to be dramatic but...
this could literally change everything

ready to be part of something that actually matters?

swipe up / link in bio
your feed (and soul) needs this 

💌 save this post for when you're ready to book
#NotAnAd #JustRealTalk #SustainableVibes`,

    dm: `hey!! 
saw you're into ${interests?.[0] || 'travel'} 👀

have you heard about ${story.split(' ').slice(0, 4).join(' ').toLowerCase()}??

it's giving everything we actually care about:
- zero corporate BS ✅
- actually sustainable ✅  
- supports real communities ✅
- won't break the bank ✅

dm me if you want the details
this is the travel moment we've been waiting for fr 💕`
  }
}
function generateMillennialContent(story: string, interests: string[], culturalContext: any) {
  return {
    social: `Just discovered ${story} and honestly, this is the kind of experience that creates those memories you'll be talking about for years 📸

The cultural immersion here is incredible - perfect for anyone who travels for the stories, not just the photos. This is going straight to the top of my bucket list ✨

#ExperienceTravel #CulturalImmersion #TravelStories #AuthenticExperiences`,

    detailed: `Why ${story} belongs on every Millennial's travel list:

🎯 AUTHENTIC CULTURAL EXPERIENCES - Real connections, not tourist traps
📚 INCREDIBLE STORYTELLING OPPORTUNITIES - Content that actually matters
💡 PERSONAL GROWTH THROUGH TRAVEL - Come back changed, not just tanned
🌟 INSTAGRAM-WORTHY WITH SUBSTANCE - Beautiful AND meaningful
📝 STORIES WORTH SHARING - Conversations that go beyond "nice weather"
💰 EXCELLENT VALUE - Experience-to-dollar ratio is unmatched

This isn't just a trip - it's a chapter in your personal journey. The kind of travel that reminds you why you started exploring in the first place.`,

    cta: `Ready to create memories that matter? 
Experience ${story} and add another incredible chapter to your travel story 📖✈️
Book now - your future self will thank you.`
  }
}

function generateGenXContent(story: string, interests: string[], culturalContext: any) {
  return {
    social: `Found the perfect family experience with ${story}! 👨‍👩‍👧‍👦

Finally, something that works for everyone - from teens to grandparents. Great value, safe environment, and the kids actually want to put their phones down. Win-win-win!

#FamilyTravel #MultiGenerational #ValueTravel #FamilyMemories`,

    detailed: `Why ${story} is perfect for families:

👨‍👩‍👧‍👦 ACTIVITIES FOR ALL AGES - Teens won't be bored, grandparents won't be overwhelmed
💰 EXCELLENT VALUE FOR MONEY - Transparent pricing, no hidden costs
🛡️ SAFE AND FAMILY-FRIENDLY - Thoroughly vetted for family groups
🎯 EDUCATIONAL OPPORTUNITIES - Kids learn while having fun
📍 CONVENIENT LOGISTICS - Easy coordination, minimal stress
🏆 CREATES LASTING FAMILY MEMORIES - The kind kids remember as adults

Planning family travel that actually works? This is it. No compromises needed.`,

    cta: `Give your family an experience they'll treasure forever.
Book ${story} now and create those priceless family moments 👨‍👩‍👧‍👦✈️
Limited family-friendly dates available.`
  }
}

function generateBoomerContent(story: string, interests: string[], culturalContext: any) {
  return {
    social: `Thoroughly enjoyed our recent experience with ${story}. The attention to detail, expert guidance, and comfortable arrangements made this a truly memorable journey.

Highly recommended for those who appreciate quality travel experiences with proper service standards.`,

    detailed: `What makes ${story} exceptional for discerning travelers:

🏆 PREMIUM SERVICE AND COMFORT - Every detail attended to with care
👨‍🏫 EXPERT LOCAL GUIDES - Deep knowledge and genuine passion for the region
🎓 RICH CULTURAL AND HISTORICAL CONTEXT - Learn the real stories behind the places
🛏️ COMFORTABLE ACCOMMODATIONS - Quality lodging that meets high standards
🍽️ EXCELLENT DINING EXPERIENCES - Authentic local cuisine, properly prepared
🚌 CONVENIENT TRANSPORTATION - Comfortable, reliable, and well-maintained
📞 DEDICATED SUPPORT THROUGHOUT - Personal attention when you need it

Travel with confidence and comfort. This is how travel should be.`,

    cta: `Experience travel the way it was meant to be.
Reserve your spot for ${story} and enjoy the journey in comfort and style.
Contact our travel specialists for personalized service. 🌟`
  }
}

function generateCulturalContent(story: string, culturalContext: any) {
  if (!culturalContext) return null
  
  return `Kia ora! ${story} offers an authentic New Zealand experience in ${culturalContext.iwi} territory. 

Discover ${culturalContext.culturalElements.join(', ')} while respecting the rich cultural heritage of Aotearoa. Our approach honors ${nzCulturalContext.culturalValues.join(', ')}, ensuring every visitor gains genuine appreciation for local culture.

Experience ${culturalContext.seasonalHighlights.join(', ')} with the guidance of those who know this land best. This is more than sightseeing - it's cultural connection with respect and authenticity at its heart.

Haere mai - you are welcome here. 🇳🇿`
}

export async function POST(request: Request) {
  try {
    const { 
      story, 
      targetAudience, 
      interests, 
      platforms,
      location = 'Christchurch',
      contentType = 'social_media_post'
    } = await request.json()

    // Get generational profile
    const profile = generationalProfiles[targetAudience as keyof typeof generationalProfiles]
    
    if (!profile) {
      return NextResponse.json({ error: 'Invalid target audience' }, { status: 400 })
    }

    // Get cultural context
    const culturalContext = nzCulturalContext.locations[location as keyof typeof nzCulturalContext.locations] || null

    // Generate sophisticated content based on generational psychology
    let contentVariations = []

    switch (targetAudience) {
      case 'Gen Z (1997-2012) - Digital natives prioritizing authenticity':
        const genZContent = generateGenZContent(story, interests, culturalContext)
        contentVariations = [
          { platform: 'TikTok/Instagram', content: genZContent.social, style: 'authentic_casual', targetFactors: ['authenticity', 'sustainability'] },
          { platform: 'Blog/Long-form', content: genZContent.detailed, style: 'values_driven', targetFactors: ['social_impact', 'authenticity'] },
          { platform: 'Call-to-Action', content: genZContent.cta, style: 'urgent_authentic', targetFactors: ['FOMO', 'values_alignment'] }
        ]
        break

      case 'Millennials (1981-1996) - Experience-focused, cultural seekers':
        const millennialContent = generateMillennialContent(story, interests, culturalContext)
        contentVariations = [
          { platform: 'Instagram/Facebook', content: millennialContent.social, style: 'experience_storytelling', targetFactors: ['authenticity', 'shareability'] },
          { platform: 'Blog/Email', content: millennialContent.detailed, style: 'detailed_experiential', targetFactors: ['value', 'personal_growth'] },
          { platform: 'Conversion', content: millennialContent.cta, style: 'memory_focused', targetFactors: ['experience_value', 'future_self'] }
        ]
        break

      case 'Gen X (1965-1980) - Family-focused, value-conscious':
        const genXContent = generateGenXContent(story, interests, culturalContext)
        contentVariations = [
          { platform: 'Facebook/Email', content: genXContent.social, style: 'family_practical', targetFactors: ['value', 'family_appeal'] },
          { platform: 'Detailed Guide', content: genXContent.detailed, style: 'practical_benefits', targetFactors: ['safety', 'convenience', 'value'] },
          { platform: 'Family CTA', content: genXContent.cta, style: 'family_memory_focused', targetFactors: ['family_bonding', 'lasting_memories'] }
        ]
        break

      case 'Baby Boomers (1946-1964) - Comfort-seeking, knowledge-focused':
        const boomerContent = generateBoomerContent(story, interests, culturalContext)
        contentVariations = [
          { platform: 'Email/Facebook', content: boomerContent.social, style: 'respectful_quality', targetFactors: ['quality', 'service'] },
          { platform: 'Detailed Brochure', content: boomerContent.detailed, style: 'premium_informative', targetFactors: ['comfort', 'expertise', 'quality'] },
          { platform: 'Premium CTA', content: boomerContent.cta, style: 'service_oriented', targetFactors: ['premium_service', 'personal_attention'] }
        ]
        break

      default:
        // Fallback for other audiences
        contentVariations = [
          { platform: 'General', content: `Experience ${story} - a memorable journey awaits!`, style: 'general', targetFactors: ['general_appeal'] }
        ]
    }

    // Add cultural content if available
    if (culturalContext) {
      const culturalContent = generateCulturalContent(story, culturalContext)
      if (culturalContent) {
        contentVariations.push({
          platform: 'Cultural/Educational',
          content: culturalContent,
          style: 'culturally_informed',
          targetFactors: ['cultural_respect', 'local_knowledge', 'authenticity']
        })
      }
    }

    return NextResponse.json({
      success: true,
      targetAudience,
      profile: {
        platforms: profile.platforms,
        contentStyle: profile.contentStyle,
        valuePropositions: profile.valuePropositions,
        communicationStyle: profile.communicationStyle,
        decisionFactors: profile.decisionFactors
      },
      culturalContext,
      contentVariations,
      enhancementNote: 'Content generated using sophisticated generational psychology and cultural awareness'
    })

  } catch (error) {
    console.error('Enhanced content generation error:', error)
    return NextResponse.json({ error: 'Failed to generate enhanced content' }, { status: 500 })
  }
  // Enhanced download format content generator - 3 versions per format
function generateDownloadVersions(story: string, targetAudience: string, interests: string[], format: string) {
  const profile = generationalProfiles[targetAudience as keyof typeof generationalProfiles]
  const storyTitle = story.split('.')[0] || story.substring(0, 50)
  const companyName = "Your Company Name" // Can be customized later
  const today = new Date().toLocaleDateString('en-NZ', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  switch(format) {
    case 'blog':
      return [
        { tone: 'Professional & SEO-Optimized', content: generateBlogPost(story, storyTitle, profile, interests, 'professional') },
{ tone: 'Casual & Engaging', content: generateBlogPost(story, storyTitle, profile, interests, 'casual') },
{ tone: 'Expert Authority', content: generateBlogPost(story, storyTitle, profile, interests, 'authority') }
      ]
    
    case 'press':
      return [
        { tone: 'Standard Press Release', content: generatePressRelease(story, storyTitle, companyName, today) },
        { tone: 'Executive Announcement', content: generatePressRelease(story, storyTitle, companyName, today) },
        { tone: 'Media-Friendly', content: generatePressRelease(story, storyTitle, companyName, today) }
      ]
    
    case 'email':
      return [
        { tone: 'Professional Newsletter', content: generateEmailNewsletter(story, storyTitle, profile) },
        { tone: 'Personal & Direct', content: generateEmailNewsletter(story, storyTitle, profile) },
        { tone: 'Action-Oriented', content: generateEmailNewsletter(story, storyTitle, profile) }
      ]
    
    case 'staff':
      return [
        { tone: 'Formal Announcement', content: generateStaffNews(story, storyTitle, today) },
        { tone: 'Team-Friendly', content: generateStaffNews(story, storyTitle, today) },
        { tone: 'Motivational', content: generateStaffNews(story, storyTitle, today) }
      ]
    
    case 'board':
      return [
        { tone: 'Executive Summary', content: generateBoardReport(story, storyTitle, today) },
        { tone: 'Strategic Analysis', content: generateBoardReport(story, storyTitle, today) },
        { tone: 'Performance Focus', content: generateBoardReport(story, storyTitle, today) }
      ]
    
    case 'stakeholder':
      return [
        { tone: 'Partnership Focus', content: generateStakeholderLetter(story, storyTitle, companyName, today) },
        { tone: 'Business Update', content: generateStakeholderLetter(story, storyTitle, companyName, today) },
        { tone: 'Relationship Building', content: generateStakeholderLetter(story, storyTitle, companyName, today) }
      ]
    
    case 'pdf':
      return [
        { tone: 'Document Format', content: generatePDFContent(story, storyTitle, profile) },
        { tone: 'Presentation Style', content: generatePDFContent(story, storyTitle, profile) },
        { tone: 'Report Format', content: generatePDFContent(story, storyTitle, profile) }
      ]
    
    case 'word':
      return [
        { tone: 'Professional Document', content: generateWordContent(story, storyTitle, profile) },
        { tone: 'Collaborative Draft', content: generateWordContent(story, storyTitle, profile) },
        { tone: 'Template Ready', content: generateWordContent(story, storyTitle, profile) }
      ]
    
    default:
      return [
        { tone: 'Standard', content: story },
        { tone: 'Enhanced', content: story },
        { tone: 'Professional', content: story }
      ]
  }
}

function generateBlogPost(story: string, title: string, profile: any, interests: string[], tone: string) {
  const keywords = interests?.join(', ') || 'business, innovation, growth'
  const readingTime = Math.ceil(story.split(' ').length / 200)
  
  switch(tone) {
    case 'professional':
      return `# ${title}: A Comprehensive Industry Analysis

**Meta Description:** In-depth analysis of ${title.toLowerCase()} and its strategic implications for business growth and industry transformation.

**Keywords:** ${keywords}, industry analysis, strategic planning, business intelligence

**Reading Time:** ${readingTime} minutes

## Executive Overview

${story.split('.')[0]}. This development represents a paradigm shift in industry standards and operational excellence.

## Strategic Analysis

${story.split('.').slice(1, 3).map((sentence, index) => `### ${index + 1}. Strategic Implication\n\n${sentence.trim()}.`).join('\n\n')}

## Market Impact Assessment

The implications of this announcement extend across multiple sectors:

- **Immediate Market Response:** Enhanced competitive positioning
- **Long-term Strategic Value:** Sustainable growth opportunities  
- **Operational Excellence:** Process optimization potential
- **Stakeholder Alignment:** Improved value proposition delivery

## Implementation Framework

${story.split('.').slice(-2).join('.')}

## Conclusion

This development establishes new industry benchmarks and creates significant opportunities for organizations prepared to adapt and innovate.

**Tags:** #${interests?.map(i => i.replace(/\s+/g, '')).join(' #') || 'Business #Strategy #Growth'}

---
*Professional Analysis | Published ${new Date().toLocaleDateString('en-NZ')} | ${readingTime} min read*`

    case 'casual':
      return `# ${title} - Here's What You Need to Know! 🚀

**Meta Description:** Breaking down ${title.toLowerCase()} in simple terms - what it means, why it matters, and how it affects you.

**Keywords:** ${keywords}, explained simply, what this means, industry update

**Reading Time:** ${readingTime} minutes

## The Big News 📢

${story.split('.')[0]}. And honestly? This is pretty exciting stuff.

## Why This Matters to You

Let's break this down into bite-sized pieces:

${story.split('.').slice(1, 3).map((sentence, index) => `**${index + 1}. ${sentence.trim().split(' ').slice(0, 4).join(' ')}...**\n\n${sentence.trim()}. Pretty cool, right?`).join('\n\n')}

## What's Next? 🤔

${story.split('.').slice(-2).join('.')}

Think of it this way - this isn't just another announcement. It's actually a game-changer that opens up new possibilities for everyone involved.

## The Bottom Line

${title} is more than just news - it's a signal that things are moving in the right direction. Whether you're directly involved or just interested in industry trends, this is definitely worth paying attention to.

**What do you think?** Drop a comment and let us know your thoughts!

**Tags:** #${interests?.map(i => i.replace(/\s+/g, '')).join(' #') || 'Industry #News #Updates'}

---
*Easy read | ${new Date().toLocaleDateString('en-NZ')} | ${readingTime} minutes*`

    case 'authority':
      return `# ${title}: Expert Analysis and Industry Implications

**Meta Description:** Authoritative expert analysis of ${title.toLowerCase()} - comprehensive insights from industry leaders on market transformation.

**Keywords:** ${keywords}, expert analysis, industry leadership, market trends, professional insights

**Reading Time:** ${readingTime} minutes

## Industry Expert Perspective

As industry leaders, we recognize that ${story.split('.')[0]}. This announcement signals a fundamental shift in how we approach ${interests?.[0] || 'business operations'}.

## Professional Assessment

Based on our extensive experience in this sector, several key factors emerge:

${story.split('.').slice(1, 4).map((sentence, index) => `### Key Factor ${index + 1}: ${sentence.trim().split(' ').slice(0, 6).join(' ')}\n\n${sentence.trim()}. Our analysis indicates this will drive significant value creation across the industry.`).join('\n\n')}

## Expert Recommendations

Drawing from decades of industry experience, we recommend:

1. **Immediate Assessment:** Evaluate current positioning relative to these developments
2. **Strategic Alignment:** Ensure organizational readiness for emerging opportunities  
3. **Competitive Advantage:** Leverage these changes to strengthen market position
4. **Long-term Planning:** Integrate these developments into strategic roadmaps

## Industry Leadership Perspective

${story.split('.').slice(-2).join('.')}

From our position as industry thought leaders, we view this as a defining moment that will separate forward-thinking organizations from those that fail to adapt.

## Conclusion

The expertise and insights shared here reflect our commitment to industry leadership and professional excellence. Organizations that act on these insights will be best positioned for sustained success.

**Professional Tags:** #${interests?.map(i => i.replace(/\s+/g, '')).join(' #') || 'IndustryLeadership #ProfessionalInsights #MarketAnalysis'}

---
*Expert Analysis | Industry Leadership | ${new Date().toLocaleDateString('en-NZ')} | ${readingTime} min read*`

    default:
      return generateBlogPost(story, title, profile, interests, 'professional')
  }
}

function generatePressRelease(story: string, title: string, company: string, date: string) {
  return `FOR IMMEDIATE RELEASE

${company}
Contact: [Your Name]
Phone: [Your Phone]
Email: [Your Email]
Website: [Your Website]

${date}

${title.toUpperCase()}

${story.split('.')[0]}.

LOCATION – ${date} – ${story}

"${story.split('"')[1] || story.split('.')[1]?.trim()}," said [Spokesperson Name], [Title] at ${company}. "${story.split('"')[3] || 'This represents a significant milestone for our industry and we look forward to the positive impact it will have.'}"

About ${company}:
${company} is a leading organization committed to excellence and innovation. Founded on principles of quality and customer service, we continue to drive positive change in our industry.

For more information about this announcement, please contact:
[Contact Name]
[Title]
[Phone Number]
[Email Address]

###

Note to editors: For additional information, news and perspectives from ${company}, please visit [Website URL]. High-resolution images and additional resources are available upon request.`
}

function generateEmailNewsletter(story: string, title: string, profile: any) {
  const tone = profile?.communicationStyle || 'professional and engaging'
  
  return `Subject: ${title} – Important Update

Preview Text: ${story.substring(0, 100)}...

---

Hi [First Name],

${profile?.communicationStyle?.includes('casual') ? 'Hope you\'re doing well!' : 'I hope this message finds you well.'}

${story.split('.')[0]}. I wanted to share this important update with you because it directly impacts our industry and your interests.

**What's Happening:**
${story.split('.').slice(0, 3).map((sentence, index) => `• ${sentence.trim()}`).join('\n')}

**Why This Matters to You:**
${profile ? `As someone focused on ${profile.valuePropositions?.[0] || 'growth and innovation'}, this development offers new opportunities for ${profile.valuePropositions?.[1] || 'success'}.` : 'This development opens up new possibilities for growth and success.'}

**Next Steps:**
${story.split('.').slice(-2).join('.')}

${profile?.communicationStyle?.includes('casual') ? 'Let me know what you think!' : 'I welcome your thoughts and feedback on this development.'}

Best regards,
[Your Name]
[Your Title]
[Your Company]

---

P.S. ${profile?.communicationStyle?.includes('casual') ? 'Don\'t forget to share this with your network if you found it valuable!' : 'Please feel free to forward this to colleagues who might find this information valuable.'}

[Unsubscribe] | [Update Preferences] | [View in Browser]`
}

function generateStaffNews(story: string, title: string, date: string) {
  return `STAFF BULLETIN

Date: ${date}
Subject: ${title}

Dear Team,

I'm pleased to share some important news that will impact our organization and the work we do together.

**Key Update:**
${story}

**What This Means for Our Team:**
• Enhanced opportunities for professional development
• Alignment with industry best practices
• Strengthened position in the marketplace
• Potential for new initiatives and projects

**Immediate Actions:**
• Please review this information and consider how it relates to your role
• Discuss with your team leader if you have questions
• Look for upcoming training or information sessions
• Stay tuned for more detailed implementation plans

**Your Role:**
Your continued dedication and professionalism are essential as we navigate these exciting developments. We appreciate your ongoing commitment to excellence.

If you have any questions or need clarification, please don't hesitate to reach out to your supervisor or HR.

Thank you for your attention to this important update.

Best regards,
[Leadership Team]

---
Internal Communication - Please do not forward outside the organization`
}

function generateBoardReport(story: string, title: string, date: string) {
  return `BOARD REPORT

Date: ${date}
Subject: ${title}

EXECUTIVE SUMMARY

${story.split('.')[0]}. This development represents a strategic opportunity for organizational growth and market positioning.

KEY POINTS:
${story.split('.').slice(1, 4).map((sentence, index) => `${index + 1}. ${sentence.trim()}`).join('\n')}

STRATEGIC IMPLICATIONS:
• Market Position: Enhanced competitive advantage
• Financial Impact: Positive long-term outlook
• Operational Excellence: Improved efficiency opportunities
• Stakeholder Value: Increased engagement and satisfaction

RISK ASSESSMENT:
• Implementation risks are manageable with proper planning
• Market response appears favorable
• Resource allocation within acceptable parameters

RECOMMENDED ACTIONS:
1. Approve strategic alignment with this development
2. Allocate appropriate resources for implementation
3. Monitor progress through established KPIs
4. Communicate benefits to key stakeholders

FINANCIAL OVERVIEW:
Investment required: [To be determined]
Expected ROI: [Projected positive impact]
Timeline: [Implementation phases as outlined]

CONCLUSION:
This initiative aligns with our strategic objectives and positions the organization for continued success. Board approval and support are recommended.

Prepared by: [Executive Team]
Review Date: ${date}

---
CONFIDENTIAL - Board Use Only`
}

function generateStakeholderLetter(story: string, title: string, company: string, date: string) {
  return `${company}
[Address Line 1]
[Address Line 2]
[City, State, Postal Code]

${date}

Dear Valued Stakeholder,

I am writing to inform you of an important development that will positively impact our organization and our continued partnership.

${story}

**Strategic Benefits:**
This development aligns perfectly with our mission and values, offering several key advantages:
• Enhanced service delivery capabilities
• Strengthened market position
• Improved operational efficiency
• Greater value creation for all stakeholders

**Your Partnership:**
Your continued support and partnership remain invaluable to our success. This development further solidifies our commitment to excellence and innovation in everything we do.

**Looking Ahead:**
We are excited about the opportunities this creates and look forward to sharing our progress with you. We will continue to keep you informed as we implement these positive changes.

Thank you for your ongoing trust and partnership. Should you have any questions or require additional information, please do not hesitate to contact me directly.

With sincere appreciation,

[Your Name]
[Your Title]
${company}

[Phone Number]
[Email Address]

---
This communication contains important information regarding our strategic direction and partnerships.`
}

function generatePDFContent(story: string, title: string, profile: any) {
  return `${title.toUpperCase()}

${new Date().toLocaleDateString('en-NZ')}

${story}

${profile ? `
TARGET AUDIENCE: ${profile.contentStyle}
KEY MESSAGES: ${profile.valuePropositions?.join(', ')}
COMMUNICATION STYLE: ${profile.communicationStyle}
` : ''}

---

This document contains important information for distribution and reference.

Generated by Speak Click Send - Professional Content Creation
www.speakclicksend.com`
}

function generateWordContent(story: string, title: string, profile: any) {
  return `${title}

Document Type: Professional Communication
Date: ${new Date().toLocaleDateString('en-NZ')}
Generated: ${new Date().toLocaleTimeString('en-NZ')}

CONTENT:

${story}

${profile ? `
AUDIENCE PROFILE:
Content Style: ${profile.contentStyle}
Communication Style: ${profile.communicationStyle}
Value Propositions: ${profile.valuePropositions?.join(', ')}
Platform Focus: ${profile.platforms?.join(', ')}
` : ''}

DOCUMENT NOTES:
- This content is optimized for ${profile?.platforms?.[0] || 'multiple platforms'}
- ${profile ? `Tone: ${profile.communicationStyle}` : 'Professional tone throughout'}
- Ready for customization and branding
- Generated using advanced content optimization

---
Created with Speak Click Send
Professional Content Generation Platform`
}
}
