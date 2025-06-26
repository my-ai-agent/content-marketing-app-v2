// Create file: /app/api/generate-content/route.ts
import { NextRequest, NextResponse } from 'next/server'

// Types
interface ContentGenerationRequest {
  audience: string
  interests: string
  persona: string
  userContext?: string
  location?: string
}

interface UsageLog {
  userId: string
  status: 'success' | 'error' | 'limit_exceeded'
  responseTime: number
  timestamp: string
  errorMessage?: string
  tier: string
  tokensUsed?: number
}

// Claude API Configuration
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY

// Click Speak Send Tier Limits
const TIER_LIMITS = {
  basic: { storiesPerMonth: 10, maxTokens: 2000 },
  professional: { storiesPerMonth: 50, maxTokens: 3000 },
  enterprise: { storiesPerMonth: -1, maxTokens: 4000 } // -1 = unlimited
}

// Enhanced Tourism-Focused Persona Prompts
const getPersonaPrompt = (persona: string) => {
  const prompts = {
    professional: {
      tone: "informative, authoritative, genuine and customer experience-focused",
      style: "visitor/tourism industry expert and business owner",
      language: "Use professional and engaging terminology, focus on customer/visitor value, include clear call-to-action hooks",
      structure: "Lead with key visitor benefits, provide expert insights and cultural context, conclude with compelling recommendations that drive tourism engagement",
      example: "Write as a tourism industry expert who deeply understands visitor needs and cultural significance, speaks with authority about authentic experiences, and focuses on delivering exceptional customer value.",
      culturalFocus: "Emphasize authentic cultural experiences, educational value, and responsible tourism that benefits local communities",
      businessObjective: "Drive qualified tourism bookings while showcasing genuine cultural respect and expertise"
    },
    casual: {
      tone: "friendly, engaging, culturally respectful and environment custodianship, genuine",
      style: "first-time traveller, travel influencer, storyteller, content writer",
      language: "Use conversational and accessible language, personal anecdotes, community-building phrases, and environmentally conscious terminology",
      structure: "Tell an authentic personal story, share genuine experiences and cultural insights, create emotional connection with readers while promoting responsible travel",
      example: "Write as a passionate storyteller who respects local cultures, cares deeply about environmental sustainability, and wants to inspire others to travel mindfully and authentically.",
      culturalFocus: "Show deep respect for Māori culture and traditions, promote sustainable tourism practices, and encourage meaningful cultural exchange",
      businessObjective: "Build community engagement and inspire authentic, responsible travel experiences"
    },
    impulsive: {
      tone: "positive, warm, genuine, excited and high-energy",
      style: "enthusiastic adventure seeker and experience collector",
      language: "Use energetic and inspiring expressions, emotional reactions, excitement-inducing language, and authentic enthusiasm while maintaining cultural respect",
      structure: "Lead with genuine excitement about discovery, build energy through personal revelation, inspire immediate action while emphasizing cultural significance",
      example: "Write as an adventure seeker who finds genuine joy in cultural discovery, respects local traditions, and can't contain their enthusiasm for sharing authentic experiences with others.",
      culturalFocus: "Express excitement about cultural learning and authentic experiences while maintaining appropriate respect for sacred traditions",
      businessObjective: "Create viral-worthy content that drives immediate interest in authentic cultural tourism experiences"
    }
  }
  return prompts[persona as keyof typeof prompts] || prompts.casual
}

// Build Claude Prompt
const buildClaudePrompt = (data: ContentGenerationRequest): string => {
  const persona = getPersonaPrompt(data.persona)
  
  return `You are a professional tourism content creator specializing in New Zealand cultural storytelling with deep respect for Māori heritage.

CONTENT CREATION BRIEF:
- TARGET AUDIENCE: ${data.audience}
- AUDIENCE INTERESTS: ${data.interests}
- LOCATION: ${data.location || 'Auckland, New Zealand'}
- USER CONTEXT: ${data.userContext || 'Cultural tourism experience'}

WRITING PERSONA & STYLE:
- VOICE: ${persona.style}
- TONE: ${persona.tone}
- LANGUAGE STYLE: ${persona.language}
- STRUCTURE: ${persona.structure}

CULTURAL GUIDELINES:
- Show deep respect for Māori culture and traditions
- Use culturally appropriate language when discussing indigenous experiences
- Focus on authentic, educational tourism that benefits local communities
- Avoid cultural appropriation or superficial treatment of sacred traditions

Create compelling tourism content that:
1. Matches the specified writing persona and tone perfectly
2. Appeals specifically to the target audience's demographics and interests
3. Tells an engaging story about this New Zealand cultural experience
4. Highlights the significance and respect for Māori heritage
5. Includes appropriate tourism call-to-action

Please respond with a JSON object containing:
{
  "mainStory": "250-300 word compelling narrative",
  "socialMedia": {
    "instagram": "120-150 word caption with 8-10 hashtags",
    "facebook": "80-100 word engagement-focused post",
    "linkedin": "100-120 word professional excerpt",
    "twitter": "280 character compelling tweet"
  },
  "qrSummary": "40-50 word concise summary for QR sharing",
  "hashtags": ["array", "of", "10-15", "relevant", "hashtags"],
  "callToAction": "Strong tourism engagement prompt"
}`
}

// Enhanced Usage Tracking with Persona Analytics
const logUsage = async (log: UsageLog & { 
  personaUsed?: string,
  contentQuality?: 'high' | 'medium' | 'low',
  culturalSensitivity?: 'appropriate' | 'needs_review'
}) => {
  try {
    // Enhanced logging for persona effectiveness tracking
    console.log('📊 ENHANCED USAGE LOG:', JSON.stringify({
      ...log,
      personaMetrics: {
        persona: log.personaUsed || 'unknown',
        effectiveness: log.contentQuality || 'pending_review',
        culturalCheck: log.culturalSensitivity || 'pending_review'
      }
    }, null, 2))
    
    // TODO: Replace with your database storage
    // This will help you optimize persona prompts over time
    // await db.usageLogs.create({ data: { ...log, personaMetrics: {...} } })
    
  } catch (error) {
    console.error('Failed to log enhanced usage:', error)
  }
}

const getUserTier = async (userId: string): Promise<string> => {
  // TODO: Replace with your user tier lookup
  // For now, return 'basic' as default
  // const user = await db.users.findUnique({ where: { id: userId } })
  // return user?.tier || 'basic'
  
  console.log('🔍 Getting tier for user:', userId)
  return 'basic' // Default for testing
}

const getUserUsage = async (userId: string): Promise<number> => {
  // TODO: Replace with your usage tracking
  // Get current month usage count
  // const usage = await db.usageLogs.count({
  //   where: {
  //     userId,
  //     timestamp: { gte: startOfMonth }
  //   }
  // })
  
  console.log('📈 Getting usage for user:', userId)
  return 0 // Default for testing
}

const checkUsageLimit = (tier: string, currentUsage: number): boolean => {
  const limit = TIER_LIMITS[tier as keyof typeof TIER_LIMITS]?.storiesPerMonth || 10
  return limit === -1 || currentUsage < limit
}

// Extract user ID from request (implement based on your auth system)
const getUserId = (request: NextRequest): string => {
  // TODO: Extract from your authentication system
  // const token = request.headers.get('authorization')
  // const userId = verifyToken(token)
  
  // For testing, generate a simple ID
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  return `user_${ip.split('.')[0]}_${Date.now()}`
}

// Main API Handler
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let userId = 'anonymous'
  
  try {
    // Extract user info
    userId = getUserId(request)
    
    // Parse request data
    const data: ContentGenerationRequest = await request.json()
    
    // Validate required fields
    if (!data.audience || !data.interests || !data.persona) {
      await logUsage({
        userId,
        status: 'error',
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        errorMessage: 'Missing required fields',
        tier: 'unknown'
      })
      
      return NextResponse.json(
        { error: 'Missing required fields: audience, interests, or persona' },
        { status: 400 }
      )
    }

    // Check Claude API key
    if (!CLAUDE_API_KEY) {
      await logUsage({
        userId,
        status: 'error',
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        errorMessage: 'Claude API key not configured',
        tier: 'system'
      })
      
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 500 }
      )
    }

    // Get user tier and check usage limits
    const userTier = await getUserTier(userId)
    const currentUsage = await getUserUsage(userId)
    
    if (!checkUsageLimit(userTier, currentUsage)) {
      await logUsage({
        userId,
        status: 'limit_exceeded',
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        tier: userTier
      })
      
      return NextResponse.json(
        { 
          error: `Usage limit reached for ${userTier} tier. Please upgrade or try next month.`,
          tier: userTier,
          limit: TIER_LIMITS[userTier as keyof typeof TIER_LIMITS]?.storiesPerMonth
        },
        { status: 429 }
      )
    }

    // Build prompt and call Claude
    const prompt = buildClaudePrompt(data)
    const maxTokens = TIER_LIMITS[userTier as keyof typeof TIER_LIMITS]?.maxTokens || 2000

    console.log('🧠 Calling Claude API for user:', userId, 'tier:', userTier)

    const claudeResponse = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!claudeResponse.ok) {
      const errorData = await claudeResponse.text()
      console.error('❌ Claude API error:', errorData)
      
      await logUsage({
        userId,
        status: 'error',
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        errorMessage: `Claude API error: ${claudeResponse.status}`,
        tier: userTier
      })
      
      return NextResponse.json(
        { error: 'Failed to generate content. Please try again.' },
        { status: 500 }
      )
    }

    const claudeData = await claudeResponse.json()
    const generatedContent = claudeData.content[0].text
    const tokensUsed = claudeData.usage?.output_tokens || 0

    // Try to parse JSON response from Claude
    let structuredContent
    try {
      structuredContent = JSON.parse(generatedContent)
    } catch {
      // Fallback if Claude doesn't return JSON
      structuredContent = {
        mainStory: generatedContent,
        socialMedia: {
          instagram: "Generated content - reformatting...",
          facebook: "Generated content - reformatting...",
          linkedin: "Generated content - reformatting...",
          twitter: "Generated content - reformatting..."
        },
        qrSummary: "Amazing New Zealand cultural experience!",
        hashtags: ["#NewZealand", "#MaoriCulture", "#Tourism", "#CulturalExperience"],
        callToAction: "Experience authentic New Zealand culture today!"
      }
    }

    // Log successful generation with enhanced metrics
    await logUsage({
      userId,
      status: 'success',
      responseTime: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      tier: userTier,
      tokensUsed,
      personaUsed: data.persona,
      contentQuality: 'high', // TODO: Implement content quality scoring
      culturalSensitivity: 'appropriate' // TODO: Implement cultural sensitivity check
    })

    // Return response with metadata
    const response = {
      content: structuredContent,
      metadata: {
        persona: data.persona,
        audience: data.audience,
        interests: data.interests,
        timestamp: new Date().toISOString(),
        tier: userTier,
        usageCount: currentUsage + 1,
        limit: TIER_LIMITS[userTier as keyof typeof TIER_LIMITS]?.storiesPerMonth
      }
    }

    console.log('✅ Content generated successfully for user:', userId)
    return NextResponse.json(response)

  } catch (error) {
    console.error('💥 Content generation error:', error)
    
    await logUsage({
      userId,
      status: 'error',
      responseTime: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      tier: 'unknown'
    })
    
    return NextResponse.json(
      { error: 'Internal server error during content generation' },
      { status: 500 }
    )
  }
}
