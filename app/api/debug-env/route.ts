// /app/api/debug-env/route.ts - CoPilot's Debug Endpoint
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Security: Only show in development or with special header
    const isDev = process.env.NODE_ENV === 'development'
    const debugHeader = request.headers.get('x-debug-auth')
    
    if (!isDev && debugHeader !== 'debug-claude-api') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    // Show all environment variables related to Claude/Anthropic
    const claudeEnvVars = Object.fromEntries(
      Object.entries(process.env).filter(([key]) =>
        key.includes('CLAUDE') || key.includes('ANTHROPIC')
      )
    )

    // Show keys with partial masking for security
    const maskedEnvVars = Object.fromEntries(
      Object.entries(claudeEnvVars).map(([key, value]) => [
        key,
        value ? `${value.slice(0, 15)}...[${value.length} chars]` : 'undefined'
      ])
    )

    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      claudeEnvVars: maskedEnvVars,
      totalEnvVars: Object.keys(process.env).length,
      vercelRegion: process.env.VERCEL_REGION || 'unknown',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
