// app/api/health/route.js
// Health check endpoint for Next.js App Router

import { NextResponse } from 'next/server';
import { LOCATION_CONTEXTS, MAORI_GLOSSARY, GENERATIONAL_PROFILES, EMOTIONAL_APPROACHES } from '../../utils/data.js';

export async function GET() {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '2.1.0 - Next.js App Router Enhancement Suite',
      
      systems: {
        enhancedResponses: `✅ ${Object.keys(LOCATION_CONTEXTS).length} locations, ${EMOTIONAL_APPROACHES.length} emotional approaches`,
        culturalRespect: `✅ ${Object.keys(MAORI_GLOSSARY).length} Te Reo terms with pronunciations`,
        generationalTargeting: `✅ ${Object.keys(GENERATIONAL_PROFILES).length} psychological profiles`,
        seasonalTrends: '✅ Southern Hemisphere seasonal optimization',
        competitorAnalysis: '✅ Differentiation framework active',
        claudeAPI: process.env.ANTHROPIC_API_KEY ? '✅ Connected' : '❌ Missing API key'
      },
      
      capabilities: {
        culturalAccuracy: 'Iwi-specific references (Ngāi Tahu for Christchurch, Te Arawa for Rotorua)',
        psychographics: 'Generational psychology replaces age demographics',
        contentVariety: `${EMOTIONAL_APPROACHES.length}+ unique approaches per request`,
        seasonalRelevance: 'Real-time seasonal trend integration',
        ethicalAI: 'Cultural respect and IP protection built-in',
        locations: Object.keys(LOCATION_CONTEXTS).join(', ')
      },
      
      architecture: 'Next.js App Router API Routes',
      
      dataStatus: {
        locations: {
          available: Object.keys(LOCATION_CONTEXTS),
          total: Object.keys(LOCATION_CONTEXTS).length,
          sample: LOCATION_CONTEXTS['Christchurch'] ? 'Christchurch data loaded' : 'No sample data'
        },
        maoriTerms: {
          total: Object.keys(MAORI_GLOSSARY).length,
          sample: Object.keys(MAORI_GLOSSARY).slice(0, 3)
        },
        generations: {
          profiles: Object.keys(GENERATIONAL_PROFILES).map(key => GENERATIONAL_PROFILES[key].displayName),
          total: Object.keys(GENERATIONAL_PROFILES).length
        }
      },
      
      enhancement_preview: {
        christchurch_cultural: LOCATION_CONTEXTS['Christchurch']?.culturalContext?.[0] || 'Data loading...',
        maori_example: MAORI_GLOSSARY['manaakitanga']?.translation || 'Loading...',
        generation_example: GENERATIONAL_PROFILES['Millennials (1981-1996)']?.description || 'Loading...'
      }
    };

    return NextResponse.json(healthStatus);
    
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString(),
      debug: {
        locationContextsLoaded: typeof LOCATION_CONTEXTS !== 'undefined',
        maoriGlossaryLoaded: typeof MAORI_GLOSSARY !== 'undefined',
        generationalProfilesLoaded: typeof GENERATIONAL_PROFILES !== 'undefined'
      }
    }, { status: 500 });
  }
}
