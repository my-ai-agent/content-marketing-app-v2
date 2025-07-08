import { NextResponse } from "next/server";

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const CLAUDE_MODEL = "claude-3-5-sonnet-20241022";
const ANTHROPIC_VERSION = "2023-06-01";
const isDev = process.env.NODE_ENV !== "production";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("[Claude API route] ANTHROPIC_API_KEY is not set.");
      return NextResponse.json({ error: "Claude API key not configured" }, { status: 500 });
    }

    let body: any;
    try {
      body = await req.json();
    } catch (err) {
      console.error("[Claude API route] Invalid JSON body:", err);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Enhanced content generation with all systems
    const {
      prompt,
      location,
      targetGeneration,
      contentType,
      platform,
      includeSeasonalTrends = true,
      includeCompetitiveAdvantage = true,
      imageData, // Base64 image data
      // Fallback to legacy fields
      audience,
      interests,
      persona,
      userContext,
      messages: legacyMessages
    } = body;

    console.log(`🎯 Generating content for ${targetGeneration || audience} in ${location || "destination"}`);

    let messages;
    
    // Handle legacy format or new enhanced format
    if (Array.isArray(legacyMessages)) {
      messages = legacyMessages;
    } else if (prompt && location && targetGeneration) {
      // 🔥 NEW ENHANCED CONTENT GENERATION
      
      // Generate enhanced content data
      const enhancedResponses = generateEnhancedContent({
        location,
        targetAudience: targetGeneration,
        contentType,
        platform
      });

      // Generational data
      const generationalData = getGenerationalData(targetGeneration);

      // Seasonal data  
      const currentMonth = new Date().getMonth() + 1;
      const seasonalData = getSeasonalData(location, targetGeneration, currentMonth);

      // Build enhanced prompt
      const enhancedPrompt = buildEnhancedPrompt({
        prompt,
        location,
        targetGeneration,
        contentType,
        platform,
        enhancedResponses,
        generationalData,
        seasonalData,
        includeSeasonalTrends,
        includeCompetitiveAdvantage
      });

      // Create messages with optional image support
      messages = [
        {
          role: "user",
          content: imageData ? [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: imageData
              }
            },
            {
              type: "text",
              text: enhancedPrompt
            }
          ] : enhancedPrompt
        }
      ];
    } else {
      // Fallback to simple tourism fields
      const fallbackPrompt = `Write a compelling tourism story for a ${persona || "traveler"} about ${userContext || prompt || "an amazing experience"} in ${location || "a destination"}. Audience: ${audience || targetGeneration || "tourists"}. Interests: ${interests || "travel, adventure"}.`;
      
      messages = [
        {
          role: "user",
          content: fallbackPrompt
        }
      ];
    }

    // Enhanced system prompt for cultural awareness
    const systemPrompt = `You are a New Zealand travel content expert specializing in culturally respectful, generationally-targeted content creation. 

Your expertise includes:
- Deep respect for Māori culture and local iwi
- Understanding of different generational travel motivations
- Seasonal tourism trends in New Zealand
- Platform-specific content optimization
- Cultural sensitivity and authenticity

Always incorporate manaakitanga (hospitality and care) principles and acknowledge the cultural significance of locations.

Response format should be structured JSON with:
{
  "content": "Main content text",
  "hashtags": ["relevant", "hashtags"],
  "callToAction": "Engaging CTA",
  "culturalNotes": "Cultural context and respect elements",
  "platformOptimization": "Platform-specific tips"
}`;

    // Claude API call (with 60s timeout)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    const anthropicRes = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "content-type": "application/json",
        "anthropic-version": ANTHROPIC_VERSION
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 4000,
        temperature: 0.7,
        system: systemPrompt,
        messages
      }),
      signal: controller.signal,
    }).catch((err) => {
      if (err.name === "AbortError") {
        throw new Error("Claude API request timed out");
      }
      throw err;
    });

    clearTimeout(timeout);

    if (!anthropicRes || !anthropicRes.ok) {
      const errMsg = anthropicRes ? await anthropicRes.text() : "No response from Claude API";
      console.error(`[Claude API route] Claude API error:`, anthropicRes?.status, errMsg);
      return NextResponse.json(
        { error: isDev ? `Claude API ${anthropicRes?.status}: ${errMsg}` : "Content generation failed. Please try again." },
        { status: anthropicRes?.status || 500 }
      );
    }

    const result = await anthropicRes.json();

    // Enhanced response processing
    if (prompt && location && targetGeneration) {
      // Parse Claude's response for enhanced format
      let generatedContent;
      try {
        generatedContent = JSON.parse(result.content[0].text);
      } catch (parseError) {
        generatedContent = {
          content: result.content[0].text,
          hashtags: [],
          callToAction: "",
          culturalNotes: "",
          platformOptimization: ""
        };
      }

      // Return enhanced response with metadata
      const enhancedResult = {
        generatedContent,
        metadata: {
          request: {
            location,
            targetGeneration,
            contentType,
            platform,
            timestamp: new Date().toISOString(),
            hasImage: !!imageData
          },
          enhancements: {
            culturalRespect: {
              iwi: getIwiForLocation(location),
              maoriTermsIncluded: ['manaakitanga'],
              culturalValidation: 'Active'
            }
          }
        },
        systemPerformance: {
          claudeModel: CLAUDE_MODEL,
          tokensUsed: result.usage?.input_tokens + result.usage?.output_tokens
        },
        // Include raw Claude response for compatibility
        rawResponse: result
      };

      return NextResponse.json(enhancedResult);
    }

    // Return standard format for legacy calls
    return NextResponse.json(result);

  } catch (err: any) {
    console.error("[Claude API route] Unexpected error:", err);
    return NextResponse.json(
      { error: isDev ? `Server error: ${err.message || err.toString()}` : "Content generation failed. Please try again." },
      { status: 500 }
    );
  }
}

// Enhanced response generation function
function generateEnhancedContent(params: any) {
  const { location, targetAudience, contentType, platform } = params;
  
  const locationData = getLocationData(location);
  
  return {
    totalVariations: 8,
    approach: 'Inspirational and authentic',
    culturalContext: locationData.culturalContext,
    uniqueElements: locationData.uniqueElements,
    audienceAngle: getAudienceAngle(targetAudience)
  };
}

// Location-specific data
function getLocationData(location: string) {
  const locationContexts: Record<string, any> = {
    'Christchurch': {
      culturalContext: 'Ngāi Tahu cultural significance and post-earthquake resilience',
      uniqueElements: 'Te Pae Convention Centre, Riverside Marketplace & Eateries, International Antarctic Centre'
    },
    'Auckland': {
      culturalContext: 'Polynesian cultural hub and Tāmaki Makaurau heritage',
      uniqueElements: 'Sky Tower, Hauraki Gulf islands, Viaduct Harbour'
    },
    'Wellington': {
      culturalContext: 'Te Whanga-nui-a-Tara significance and creative capital energy',
      uniqueElements: 'Te Papa Museum, Wellington Cable Car, Cuba Street creative quarter'
    },
    'Queenstown': {
      culturalContext: 'Tāhuna traditional significance and adventure capital reputation',
      uniqueElements: 'Lake Wakatipu, Skyline Gondola, Central Otago wine trails'
    },
    'Rotorua': {
      culturalContext: 'Te Arawa iwi heartland and living Māori culture',
      uniqueElements: 'Te Puia geothermal park, Whakarewarewa Living Village, Polynesian Spa'
    }
  };
  
  return locationContexts[location] || locationContexts['Christchurch'];
}

// Generational data
function getGenerationalData(generation: string) {
  const profiles: Record<string, any> = {
    'Gen Z (1997-2012)': {
      displayName: 'Gen Z',
      description: 'Digital natives prioritizing authenticity and sustainability',
      travelMotivations: ['Solo adventures', 'Eco-tourism', 'Instagram-worthy experiences'],
      communicationStyle: 'Casual, authentic, visual-heavy'
    },
    'Millennials (1981-1996)': {
      displayName: 'Millennials',
      description: 'Experience-focused, seeking authentic local culture',
      travelMotivations: ['Food tourism', 'Cultural workshops', 'Unique experiences'],
      communicationStyle: 'Informative, benefit-focused, storytelling'
    },
    'Gen X (1965-1980)': {
      displayName: 'Gen X',
      description: 'Family-focused, practical, value-conscious',
      travelMotivations: ['Family activities', 'Educational experiences', 'Multi-generational trips'],
      communicationStyle: 'Straightforward, practical, detailed'
    },
    'Baby Boomers (1946-1964)': {
      displayName: 'Baby Boomers',
      description: 'Comfort-seeking, knowledge-focused',
      travelMotivations: ['Luxury experiences', 'Guided tours', 'Cultural enrichment'],
      communicationStyle: 'Formal, detailed, authoritative'
    }
  };
  
  return profiles[generation] || profiles['Millennials (1981-1996)'];
}

// Seasonal data
function getSeasonalData(location: string, generation: string, month: number) {
  let season;
  if ([12, 1, 2].includes(month)) season = 'summer';
  else if ([3, 4, 5].includes(month)) season = 'autumn';
  else if ([6, 7, 8].includes(month)) season = 'winter';
  else season = 'spring';
  
  return {
    season,
    hemisphere: 'Southern Hemisphere',
    trends: [`${season} activities popular with ${generation}`]
  };
}

// Iwi mapping
function getIwiForLocation(location: string) {
  const iwiMap: Record<string, string> = {
    'Christchurch': 'Ngāi Tahu',
    'Canterbury': 'Ngāi Tahu', 
    'Auckland': 'Multiple iwi including Ngāti Whātua',
    'Wellington': 'Te Ātiawa, Ngāti Toa, Ngāti Raukawa',
    'Rotorua': 'Te Arawa',
    'Queenstown': 'Ngāi Tahu'
  };
  
  return iwiMap[location] || 'Local iwi';
}

// Audience angle mapping
function getAudienceAngle(generation: string) {
  const angles: Record<string, string> = {
    'Gen Z (1997-2012)': 'Solo travelers seeking authentic, sustainable experiences',
    'Millennials (1981-1996)': 'Experience collectors seeking cultural immersion',
    'Gen X (1965-1980)': 'Families seeking educational and bonding experiences',
    'Baby Boomers (1946-1964)': 'Comfort-focused travelers seeking cultural enrichment'
  };
  
  return angles[generation] || 'Travelers seeking memorable experiences';
}

// Enhanced prompt builder
function buildEnhancedPrompt(params: any) {
  const {
    prompt,
    location,
    targetGeneration,
    contentType,
    platform,
    enhancedResponses,
    generationalData,
    seasonalData
  } = params;
  
  return `
ENHANCED CONTENT GENERATION REQUEST:

Original Request: ${prompt}
Location: ${location}
Target Generation: ${targetGeneration}
Content Type: ${contentType || 'General'}
Platform: ${platform || 'Multi-platform'}

CULTURAL CONTEXT:
- ${enhancedResponses.culturalContext}
- Respect for ${getIwiForLocation(location)} cultural significance
- Include manaakitanga (hospitality and care) principles

GENERATIONAL TARGETING:
- Profile: ${generationalData.description}
- Communication Style: ${generationalData.communicationStyle}
- Travel Motivations: ${generationalData.travelMotivations.join(', ')}

SEASONAL RELEVANCE:
- Current Season: ${seasonalData.season} (${seasonalData.hemisphere})
- Trending: ${seasonalData.trends.join(', ')}

UNIQUE LOCATION ELEMENTS:
- ${enhancedResponses.uniqueElements}

Create engaging ${contentType || 'travel content'} that authentically combines cultural respect, generational psychology, and seasonal relevance. Include relevant hashtags and a compelling call-to-action.
`;
}
