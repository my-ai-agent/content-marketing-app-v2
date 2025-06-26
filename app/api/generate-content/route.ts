import { NextResponse } from "next/server";

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const CLAUDE_MODEL = "claude-3-opus-20240229";
const ANTHROPIC_VERSION = "2023-06-01";
const isDev = process.env.NODE_ENV !== "production";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      console.error("[Claude API route] CLAUDE_API_KEY is not set.");
      return NextResponse.json({ error: "Claude API key not configured" }, { status: 500 });
    }

    let body: any;
    try {
      body = await req.json();
    } catch (err) {
      console.error("[Claude API route] Invalid JSON body:", err);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Accept tourism fields, but fallback if client sends messages array
    let messages;
    if (Array.isArray(body.messages)) {
      messages = body.messages;
    } else {
      // Construct prompt from tourism fields
      const { audience, interests, persona, userContext, location } = body;
      const prompt = `Write a compelling tourism story for a ${persona || "traveler"} about ${userContext || "an amazing experience"} in ${location || "a destination"}. Audience: ${audience || "tourists"}. Interests: ${interests || "travel, adventure"}.`;
      messages = [
        {
          role: "user",
          content: prompt
        }
      ];
    }

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
    return NextResponse.json(result);

  } catch (err: any) {
    console.error("[Claude API route] Unexpected error:", err);
    return NextResponse.json(
      { error: isDev ? `Server error: ${err.message || err.toString()}` : "Content generation failed. Please try again." },
      { status: 500 }
    );
  }
}
