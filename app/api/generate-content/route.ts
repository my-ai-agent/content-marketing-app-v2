import { NextResponse } from "next/server";

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const CLAUDE_MODEL = "claude-3-opus-20240229"; // Change if you use a different model
const ANTHROPIC_VERSION = "2023-06-01"; // Update if Claude requires a newer version

const isDev = process.env.NODE_ENV !== "production";

export async function POST(req: Request) {
  try {
    // Enhanced environment check & logging
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      console.error("[Claude API route] CLAUDE_API_KEY is not set in environment variables.");
      return NextResponse.json(
        { error: "Claude API key not configured" },
        { status: 500 }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch (err) {
      console.error("[Claude API route] Invalid JSON body:", err);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Validate the prompt or required fields
    if (!body || !body.messages || !Array.isArray(body.messages)) {
      console.error("[Claude API route] Missing required Claude 'messages' param:", body);
      return NextResponse.json(
        { error: "Missing or invalid Claude messages parameter" },
        { status: 400 }
      );
    }

    // Prepare Claude API request
    const anthropicRes = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "content-type": "application/json",
        "anthropic-version": ANTHROPIC_VERSION
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        ...body
      })
    });

    // Handle non-200 responses from Claude API
    if (!anthropicRes.ok) {
      const errMsg = await anthropicRes.text();
      console.error(
        `[Claude API route] Claude API error:`,
        anthropicRes.status,
        errMsg
      );
      // Only show Claude error details in dev, not prod
      return NextResponse.json(
        {
          error: isDev
            ? `Claude API ${anthropicRes.status}: ${errMsg}`
            : "Content generation failed. Please try again."
        },
        { status: anthropicRes.status }
      );
    }

    const result = await anthropicRes.json();
    return NextResponse.json(result);
  } catch (err: any) {
    // Log the full error on the server, sanitize for client in prod
    console.error("[Claude API route] Unexpected error:", err);
    return NextResponse.json(
      {
        error: isDev
          ? `Server error: ${err.message || err.toString()}`
          : "Content generation failed. Please try again."
      },
      { status: 500 }
    );
  }
}
