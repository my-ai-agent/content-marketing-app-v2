// /app/utils/webScraper.ts
// Enhanced Multi-Platform Web scraping utility for brand voice analysis and content enhancement
// MOBILE/OFFLINE-SAFE REFACTOR

// --- Cache Abstraction with SSR Guard, Fallback, Error Handling ---
const isBrowser = typeof window !== "undefined";

const inMemoryCache: Record<string, any> = {};

function setCacheItem(key: string, value: any) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e: any) {
    // Storage full, quota, or private mode
    inMemoryCache[key] = value;
    if (
      e &&
      (e.name === "QuotaExceededError" ||
        e.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
        e.code === 22)
    ) {
      console.warn(`Quota exceeded for localStorage: ${key}`, e);
    } else {
      console.warn(`localStorage unavailable, using in-memory fallback for ${key}`, e);
    }
  }
}

function getCacheItem(key: string): any {
  if (!isBrowser) return undefined;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : inMemoryCache[key];
  } catch (e) {
    return inMemoryCache[key];
  }
}

// --- Fetch with Timeout ---
async function fetchWithTimeout(
  resource: RequestInfo,
  options: RequestInit = {},
  timeout = 20000 // 20s
): Promise<Response> {
  return Promise.race([
    fetch(resource, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeout)
    ),
  ]) as Promise<Response>;
}

// --- Interfaces (unchanged) ---
export interface ScrapedBrandData {
  url: string;
  heroMessage?: string;
  aboutContent?: string;
  brandVoice?: "professional" | "casual" | "technical" | "creative" | "luxury";
  keyMessages?: string[];
  businessDescription?: string;
  scrapeTimestamp: string;
  success: boolean;
  error?: string;
}

export interface MultiPlatformBrandData {
  website?: ScrapedBrandData;
  linkedin?: LinkedInData;
  facebook?: FacebookData;
  instagram?: InstagramData;
  consistency: ConsistencyAnalysis;
  overallBrandProfile: BrandProfile;
  cached: boolean;
  lastUpdated: string;
}

export interface LinkedInData {
  url: string;
  companyTone: "corporate" | "thought-leadership" | "industry-expert" | "networking";
  recentThemes: string[];
  professionalFocus: string[];
  contentStyle: "formal" | "professional-casual" | "authoritative";
  success: boolean;
  error?: string;
}

export interface FacebookData {
  url: string;
  communityEngagement: "high" | "medium" | "low";
  contentStyle: "community-focused" | "promotional" | "storytelling" | "event-driven";
  audienceInteraction: "conversational" | "informational" | "entertaining";
  postFrequency: "daily" | "weekly" | "occasional";
  success: boolean;
  error?: string;
}

export interface InstagramData {
  url: string;
  visualStyle: "professional" | "lifestyle" | "artistic" | "product-focused" | "behind-scenes";
  storytellingApproach: "visual-first" | "caption-heavy" | "hashtag-driven" | "story-focused";
  hashtagStrategy: string[];
  contentThemes: string[];
  success: boolean;
  error?: string;
}

export interface ConsistencyAnalysis {
  crossPlatformScore: number; // 0-100%
  brandVoiceAlignment: "high" | "medium" | "low";
  messagingConsistency: string;
  strengthAreas: string[];
  improvementAreas: string[];
}

export interface BrandProfile {
  dominantVoice: "professional" | "casual" | "technical" | "creative" | "luxury";
  primaryPersonality: string[];
  coreThemes: string[];
  targetAudience: string;
  recommendedContentStyle: string;
  culturalContext?: string;
}

export interface BrandAnalysis {
  tone: string;
  personality: string[];
  keyThemes: string[];
  targetAudience: string;
  contentStyle: string;
}

// --- Cache Keys and Duration ---
const SCRAPE_CACHE_KEY = "brandScrapeCache";
const MULTI_PLATFORM_CACHE_KEY = "multiPlatformBrandCache";
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days ms

// --- SSR-Safe Cache API ---
function getCachedScrapeData(url: string): ScrapedBrandData | null {
  if (!isBrowser) return null;
  try {
    const cache = getCacheItem(SCRAPE_CACHE_KEY);
    if (!cache) return null;
    const normalizedUrl = normalizeUrl(url);

    if (cache[normalizedUrl]) {
      const cached: ScrapedBrandData = cache[normalizedUrl];
      const age = Date.now() - new Date(cached.scrapeTimestamp).getTime();
      if (age < CACHE_DURATION) return cached;
    }
    return null;
  } catch (error) {
    console.warn("Error reading scrape cache:", error);
    return null;
  }
}

function getCachedMultiPlatformData(cacheKey: string): MultiPlatformBrandData | null {
  if (!isBrowser) return null;
  try {
    const cache = getCacheItem(MULTI_PLATFORM_CACHE_KEY);
    if (!cache) return null;
    if (cache[cacheKey]) {
      const cached: MultiPlatformBrandData = cache[cacheKey];
      const age = Date.now() - new Date(cached.lastUpdated).getTime();
      if (age < CACHE_DURATION) return cached;
    }
    return null;
  } catch (error) {
    console.warn("Error reading multi-platform cache:", error);
    return null;
  }
}

function cacheScrapeData(url: string, data: ScrapedBrandData): void {
  if (!isBrowser) return;
  try {
    const cache = getCacheItem(SCRAPE_CACHE_KEY) || {};
    const normalizedUrl = normalizeUrl(url);
    cache[normalizedUrl] = data;
    setCacheItem(SCRAPE_CACHE_KEY, cache);
  } catch (error) {
    console.warn("Error caching scrape data:", error);
  }
}

function cacheMultiPlatformData(cacheKey: string, data: MultiPlatformBrandData): void {
  if (!isBrowser) return;
  try {
    const cache = getCacheItem(MULTI_PLATFORM_CACHE_KEY) || {};
    cache[cacheKey] = data;
    setCacheItem(MULTI_PLATFORM_CACHE_KEY, cache);
  } catch (error) {
    console.warn("Error caching multi-platform data:", error);
  }
}

function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
    return urlObj.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return url.toLowerCase().replace(/^www\./, "");
  }
}

// --- Scraping Functions (now mobile/SSR safe, with fetch timeout) ---

export async function scrapeWebsiteBasic(url: string): Promise<ScrapedBrandData> {
  const normalizedUrl = normalizeUrl(url);
  const cached = getCachedScrapeData(url);
  if (cached) {
    console.log("Using cached brand data for:", normalizedUrl);
    return cached;
  }

  const result: ScrapedBrandData = {
    url: normalizedUrl,
    scrapeTimestamp: new Date().toISOString(),
    success: false,
  };

  try {
    if (!isBrowser) {
      throw new Error("Web scraping only available in browser context.");
    }

    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetchWithTimeout(proxyUrl, { method: "GET", headers: { Accept: "application/json" } }, 20000);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    const htmlContent = data.contents;
    if (!htmlContent) throw new Error("No content received from website");

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    result.heroMessage = extractHeroMessage(doc);
    result.aboutContent = extractAboutContent(doc);
    result.businessDescription = extractBusinessDescription(doc);
    result.keyMessages = extractKeyMessages(doc);
    result.brandVoice = analyzeBrandVoice(doc);
    result.success = true;

    cacheScrapeData(url, result);
    console.log("Successfully scraped brand data for:", normalizedUrl);
    return result;
  } catch (error: any) {
    console.warn("Error scraping website:", error);
    result.error = error instanceof Error ? error.message : "Unknown scraping error";
    result.success = false;
    cacheScrapeData(url, result);
    return result;
  }
}

export async function scrapeMultiPlatformBrand(
  websiteUrl?: string,
  linkedInUrl?: string,
  facebookUrl?: string,
  instagramUrl?: string
): Promise<MultiPlatformBrandData> {
  // Create cache key from all URLs
  const cacheKey = `multi_${[websiteUrl, linkedInUrl, facebookUrl, instagramUrl]
    .filter(Boolean)
    .map((url) => normalizeUrl(url || ""))
    .join("_")}`;

  const cached = getCachedMultiPlatformData(cacheKey);
  if (cached) {
    console.log("Using cached multi-platform data");
    return { ...cached, cached: true };
  }

  const result: MultiPlatformBrandData = {
    consistency: {
      crossPlatformScore: 0,
      brandVoiceAlignment: "low",
      messagingConsistency: "Unable to analyze",
      strengthAreas: [],
      improvementAreas: [],
    },
    overallBrandProfile: {
      dominantVoice: "professional",
      primaryPersonality: [],
      coreThemes: [],
      targetAudience: "general audience",
      recommendedContentStyle: "professional and informative",
    },
    cached: false,
    lastUpdated: new Date().toISOString(),
  };

  try {
    const promises = [];
    if (websiteUrl) promises.push(scrapeWebsiteBasic(websiteUrl));
    if (linkedInUrl) promises.push(scrapeLinkedInBasic(linkedInUrl));
    if (facebookUrl) promises.push(scrapeFacebookBasic(facebookUrl));
    if (instagramUrl) promises.push(scrapeInstagramBasic(instagramUrl));

    const results = await Promise.allSettled(promises);

    let index = 0;
    if (websiteUrl) {
      const websiteResult = results[index++];
      if (websiteResult.status === "fulfilled") {
        result.website = websiteResult.value as ScrapedBrandData;
      }
    }
    if (linkedInUrl) {
      const linkedInResult = results[index++];
      if (linkedInResult.status === "fulfilled") {
        result.linkedin = linkedInResult.value as LinkedInData;
      }
    }
    if (facebookUrl) {
      const facebookResult = results[index++];
      if (facebookResult.status === "fulfilled") {
        result.facebook = facebookResult.value as FacebookData;
      }
    }
    if (instagramUrl) {
      const instagramResult = results[index++];
      if (instagramResult.status === "fulfilled") {
        result.instagram = instagramResult.value as InstagramData;
      }
    }

    result.consistency = analyzeConsistency(result);
    result.overallBrandProfile = generateOverallBrandProfile(result);

    cacheMultiPlatformData(cacheKey, result);

    console.log("Successfully completed multi-platform brand analysis");
    return result;
  } catch (error) {
    console.warn("Error in multi-platform scraping:", error);
    return result;
  }
}

// --- Social Platform Scraping ---
async function scrapeLinkedInBasic(url: string): Promise<LinkedInData> {
  const result: LinkedInData = {
    url: normalizeUrl(url),
    companyTone: "corporate",
    recentThemes: [],
    professionalFocus: [],
    contentStyle: "formal",
    success: false,
  };

  try {
    if (!isBrowser) throw new Error("LinkedIn scraping only in browser context.");
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetchWithTimeout(proxyUrl, {}, 20000);
    if (response.ok) {
      const data = await response.json();
      const content = data.contents?.toLowerCase() || "";
      if (content.includes("innovation") || content.includes("thought leader")) {
        result.companyTone = "thought-leadership";
      } else if (content.includes("industry") || content.includes("expert")) {
        result.companyTone = "industry-expert";
      } else if (content.includes("network") || content.includes("connect")) {
        result.companyTone = "networking";
      }
      if (content.includes("sustain")) result.recentThemes.push("sustainability");
      if (content.includes("digital")) result.recentThemes.push("digital transformation");
      if (content.includes("culture")) result.recentThemes.push("company culture");
      result.success = true;
    }
  } catch (error) {
    result.error = error instanceof Error ? error.message : "LinkedIn scraping failed";
  }
  return result;
}

async function scrapeFacebookBasic(url: string): Promise<FacebookData> {
  const result: FacebookData = {
    url: normalizeUrl(url),
    communityEngagement: "medium",
    contentStyle: "community-focused",
    audienceInteraction: "conversational",
    postFrequency: "weekly",
    success: false,
  };

  try {
    if (!isBrowser) throw new Error("Facebook scraping only in browser context.");
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetchWithTimeout(proxyUrl, {}, 20000);
    if (response.ok) {
      const data = await response.json();
      const content = data.contents?.toLowerCase() || "";
      if (content.includes("event") || content.includes("happening")) {
        result.contentStyle = "event-driven";
      } else if (content.includes("story") || content.includes("share")) {
        result.contentStyle = "storytelling";
      } else if (content.includes("sale") || content.includes("offer")) {
        result.contentStyle = "promotional";
      }
      result.success = true;
    }
  } catch (error) {
    result.error = error instanceof Error ? error.message : "Facebook scraping failed";
  }
  return result;
}

async function scrapeInstagramBasic(url: string): Promise<InstagramData> {
  const result: InstagramData = {
    url: normalizeUrl(url),
    visualStyle: "professional",
    storytellingApproach: "visual-first",
    hashtagStrategy: [],
    contentThemes: [],
    success: false,
  };

  try {
    if (!isBrowser) throw new Error("Instagram scraping only in browser context.");
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetchWithTimeout(proxyUrl, {}, 20000);
    if (response.ok) {
      const data = await response.json();
      const content = data.contents?.toLowerCase() || "";
      if (content.includes("lifestyle") || content.includes("behind")) {
        result.visualStyle = "lifestyle";
      } else if (content.includes("product") || content.includes("showcase")) {
        result.visualStyle = "product-focused";
      } else if (content.includes("art") || content.includes("creative")) {
        result.visualStyle = "artistic";
      }
      const hashtagMatches = content.match(/#\w+/g);
      if (hashtagMatches) {
        result.hashtagStrategy = hashtagMatches.slice(0, 10);
      }
      result.success = true;
    }
  } catch (error) {
    result.error = error instanceof Error ? error.message : "Instagram scraping failed";
  }
  return result;
}

// --- Helper functions ---

function extractHeroMessage(doc: Document): string {
  const selectors = [
    "h1",
    '[class*="hero"] h1',
    '[class*="banner"] h1',
    '[class*="main"] h1',
    '[id*="hero"] h1',
    ".hero-title",
    ".main-title",
    '[class*="headline"]',
  ];

  for (const selector of selectors) {
    const element = doc.querySelector(selector);
    if (element && element.textContent) {
      const text = element.textContent.trim();
      if (text.length > 10 && text.length < 200) {
        return text;
      }
    }
  }

  return "";
}

function extractAboutContent(doc: Document): string {
  const selectors = [
    '[class*="about"]',
    '[id*="about"]',
    '[class*="description"]',
    '[class*="intro"]',
    ".lead",
    ".subtitle",
    'meta[name="description"]',
  ];

  for (const selector of selectors) {
    const element = doc.querySelector(selector);
    if (element) {
      let text = "";

      if (element.tagName === "META") {
        text = element.getAttribute("content") || "";
      } else {
        text = element.textContent?.trim() || "";
      }

      if (text.length > 20 && text.length < 500) {
        return text;
      }
    }
  }

  return "";
}

function extractBusinessDescription(doc: Document): string {
  const metaDesc = doc.querySelector('meta[name="description"]');
  if (metaDesc) {
    const content = metaDesc.getAttribute("content");
    if (content && content.length > 20) {
      return content.trim();
    }
  }

  const firstP = doc.querySelector("p");
  if (firstP && firstP.textContent) {
    const text = firstP.textContent.trim();
    if (text.length > 20 && text.length < 300) {
      return text;
    }
  }

  return "";
}

function extractKeyMessages(doc: Document): string[] {
  const messages: string[] = [];
  const headings = doc.querySelectorAll(
    "h2, h3, .feature-title, [class*='benefit']"
  );

  headings.forEach((heading) => {
    const text = heading.textContent?.trim();
    if (text && text.length > 5 && text.length < 100) {
      messages.push(text);
    }
  });

  return messages.slice(0, 5);
}

function analyzeBrandVoice(
  doc: Document
): "professional" | "casual" | "technical" | "creative" | "luxury" {
  const allText = doc.body?.textContent?.toLowerCase() || "";

  const professionalWords = [
    "expertise",
    "professional",
    "industry",
    "solutions",
    "services",
    "excellence",
    "quality",
  ];
  const professionalCount = professionalWords.filter((word) =>
    allText.includes(word)
  ).length;

  const casualWords = [
    "awesome",
    "amazing",
    "love",
    "fun",
    "easy",
    "simple",
    "great",
    "cool",
  ];
  const casualCount = casualWords.filter((word) =>
    allText.includes(word)
  ).length;

  const technicalWords = [
    "technology",
    "innovative",
    "advanced",
    "system",
    "platform",
    "integration",
    "optimization",
  ];
  const technicalCount = technicalWords.filter((word) =>
    allText.includes(word)
  ).length;

  const creativeWords = [
    "creative",
    "design",
    "unique",
    "artistic",
    "imagination",
    "inspiration",
    "vision",
  ];
  const creativeCount = creativeWords.filter((word) =>
    allText.includes(word)
  ).length;

  const luxuryWords = [
    "luxury",
    "premium",
    "exclusive",
    "bespoke",
    "elegant",
    "sophisticated",
    "exceptional",
  ];
  const luxuryCount = luxuryWords.filter((word) =>
    allText.includes(word)
  ).length;

  const scores = {
    professional: professionalCount,
    casual: casualCount,
    technical: technicalCount,
    creative: creativeCount,
    luxury: luxuryCount,
  };

  const maxScore = Math.max(...Object.values(scores));
  const dominantVoice = Object.entries(scores).find(
    ([_, score]) => score === maxScore
  )?.[0] as any;

  return dominantVoice || "professional";
}

export function analyzeBrandPersonality(
  scrapedData: ScrapedBrandData
): BrandAnalysis {
  const allContent = [
    scrapedData.heroMessage,
    scrapedData.aboutContent,
    scrapedData.businessDescription,
    ...(scrapedData.keyMessages || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  let tone = "professional and trustworthy";
  if (scrapedData.brandVoice === "casual") tone = "friendly and approachable";
  if (scrapedData.brandVoice === "technical") tone = "expert and informative";
  if (scrapedData.brandVoice === "creative") tone = "innovative and inspiring";
  if (scrapedData.brandVoice === "luxury") tone = "premium and sophisticated";

  const personality: string[] = [];
  if (allContent.includes("family") || allContent.includes("tradition"))
    personality.push("family-oriented");
  if (allContent.includes("sustain") || allContent.includes("eco"))
    personality.push("environmentally conscious");
  if (allContent.includes("local") || allContent.includes("community"))
    personality.push("community-focused");
  if (allContent.includes("innovat") || allContent.includes("modern"))
    personality.push("innovative");
  if (allContent.includes("authentic") || allContent.includes("genuine"))
    personality.push("authentic");

  const themes: string[] = [];
  if (allContent.includes("tourism") || allContent.includes("travel"))
    themes.push("tourism and travel");
  if (allContent.includes("culture") || allContent.includes("heritage"))
    themes.push("cultural heritage");
  if (allContent.includes("experience") || allContent.includes("adventure"))
    themes.push("experiential");
  if (allContent.includes("service") || allContent.includes("hospitality"))
    themes.push("service excellence");

  let targetAudience = "general public";
  if (allContent.includes("business") || allContent.includes("corporate"))
    targetAudience = "business clients";
  if (allContent.includes("family") || allContent.includes("children"))
    targetAudience = "families";
  if (allContent.includes("luxury") || allContent.includes("premium"))
    targetAudience = "luxury market";

  let contentStyle = "informative and engaging";
  if (scrapedData.brandVoice === "casual")
    contentStyle = "conversational and relatable";
  if (scrapedData.brandVoice === "luxury")
    contentStyle = "elegant and aspirational";
  if (scrapedData.brandVoice === "technical")
    contentStyle = "detailed and authoritative";

  return {
    tone,
    personality: personality.length > 0 ? personality : ["professional"],
    keyThemes: themes.length > 0 ? themes : ["quality service"],
    targetAudience,
    contentStyle,
  };
}

function analyzeConsistency(data: MultiPlatformBrandData): ConsistencyAnalysis {
  const platforms = [
    data.website,
    data.linkedin,
    data.facebook,
    data.instagram,
  ].filter(Boolean);

  if (platforms.length < 2) {
    return {
      crossPlatformScore: 0,
      brandVoiceAlignment: "low",
      messagingConsistency: "Insufficient data for analysis",
      strengthAreas: [],
      improvementAreas: ["Add more platform data for comprehensive analysis"],
    };
  }

  let consistencyScore = 85;
  const strengthAreas: string[] = [];
  const improvementAreas: string[] = [];

  const brandVoices = platforms
    .filter((p): p is ScrapedBrandData => p != null && "brandVoice" in p && p.success)
    .map((p) => p.brandVoice)
    .filter((voice): voice is NonNullable<typeof voice> => voice != null);

  if (brandVoices.length > 1) {
    const uniqueVoices = new Set(brandVoices);
    if (uniqueVoices.size === 1) {
      consistencyScore += 10;
      strengthAreas.push("Consistent brand voice across platforms");
    } else {
      consistencyScore -= 15;
      improvementAreas.push("Brand voice varies across platforms");
    }
  }

  if (data.linkedin?.success) {
    if (data.linkedin.companyTone === "thought-leadership") {
      consistencyScore += 5;
      strengthAreas.push("Strong LinkedIn professional presence");
    }
  }

  if (data.instagram?.success) {
    if (
      data.instagram.visualStyle === "professional" ||
      data.instagram.visualStyle === "lifestyle"
    ) {
      consistencyScore += 5;
      strengthAreas.push("Engaging Instagram visual content");
    }
  }

  let alignment: "high" | "medium" | "low" = "low";
  if (consistencyScore >= 90) alignment = "high";
  else if (consistencyScore >= 75) alignment = "medium";

  return {
    crossPlatformScore: Math.min(100, Math.max(0, consistencyScore)),
    brandVoiceAlignment: alignment,
    messagingConsistency: `${consistencyScore}% brand consistency across ${platforms.length} platforms`,
    strengthAreas,
    improvementAreas,
  };
}

function generateOverallBrandProfile(
  data: MultiPlatformBrandData
): BrandProfile {
  const profile: BrandProfile = {
    dominantVoice: "professional",
    primaryPersonality: [],
    coreThemes: [],
    targetAudience: "general audience",
    recommendedContentStyle: "professional and informative",
  };

  if (data.website?.success) {
    profile.dominantVoice = data.website.brandVoice || "professional";
    const analysis = analyzeBrandPersonality(data.website);
    profile.primaryPersonality = analysis.personality;
    profile.coreThemes = analysis.keyThemes;
    profile.targetAudience = analysis.targetAudience;
    profile.recommendedContentStyle = analysis.contentStyle;
  }

  if (data.linkedin?.success) {
    if (data.linkedin.companyTone === "thought-leadership") {
      profile.primaryPersonality.push("industry leader");
    }
    profile.coreThemes.push(...data.linkedin.recentThemes);
  }

  if (data.instagram?.success) {
    profile.coreThemes.push(...data.instagram.contentThemes);
    if (data.instagram.visualStyle === "lifestyle") {
      profile.primaryPersonality.push("lifestyle-focused");
    }
  }

  profile.primaryPersonality = Array.from(new Set(profile.primaryPersonality));
  profile.coreThemes = Array.from(new Set(profile.coreThemes));

  return profile;
}

export function generateBrandContext(scrapedData: ScrapedBrandData): string {
  if (!scrapedData.success) {
    return "";
  }

  const analysis = analyzeBrandPersonality(scrapedData);

  let context = `\nBRAND CONTEXT from ${scrapedData.url}:\n`;

  if (scrapedData.heroMessage) {
    context += `- Main message: "${scrapedData.heroMessage}"\n`;
  }
  if (scrapedData.businessDescription) {
    context += `- Business description: "${scrapedData.businessDescription}"\n`;
  }
  context += `- Brand voice: ${scrapedData.brandVoice}\n`;
  context += `- Tone: ${analysis.tone}\n`;
  context += `- Personality: ${analysis.personality.join(", ")}\n`;
  context += `- Key themes: ${analysis.keyThemes.join(", ")}\n`;
  context += `- Target audience: ${analysis.targetAudience}\n`;
  context += `- Content style: ${analysis.contentStyle}\n`;

  if (scrapedData.keyMessages && scrapedData.keyMessages.length > 0) {
    context += `- Key messages: ${scrapedData.keyMessages.join(", ")}\n`;
  }

  context += `\nPlease ensure the generated content matches this brand voice and messaging style.\n`;

  return context;
}

export function generateMultiPlatformContext(
  data: MultiPlatformBrandData
): string {
  let context = "\n=== MULTI-PLATFORM BRAND INTELLIGENCE ===\n";

  context += `\nOVERALL BRAND PROFILE:\n`;
  context += `- Dominant voice: ${data.overallBrandProfile.dominantVoice}\n`;
  context += `- Personality: ${data.overallBrandProfile.primaryPersonality.join(
    ", "
  )}\n`;
  context += `- Core themes: ${data.overallBrandProfile.coreThemes.join(", ")}\n`;
  context += `- Target audience: ${data.overallBrandProfile.targetAudience}\n`;
  context += `- Recommended style: ${data.overallBrandProfile.recommendedContentStyle}\n`;

  context += `\nBRAND CONSISTENCY ANALYSIS:\n`;
  context += `- Cross-platform score: ${data.consistency.crossPlatformScore}%\n`;
  context += `- Voice alignment: ${data.consistency.brandVoiceAlignment}\n`;
  context += `- Strengths: ${data.consistency.strengthAreas.join(", ")}\n`;
  if (data.consistency.improvementAreas.length > 0) {
    context += `- Areas for improvement: ${data.consistency.improvementAreas.join(", ")}\n`;
  }

  if (data.website?.success) {
    context += `\nWEBSITE BRAND VOICE:\n`;
    context += generateBrandContext(data.website);
  }

  if (data.linkedin?.success) {
    context += `\nLINKEDIN PROFESSIONAL PRESENCE:\n`;
    context += `- Company tone: ${data.linkedin.companyTone}\n`;
    context += `- Content style: ${data.linkedin.contentStyle}\n`;
    context += `- Professional focus: ${data.linkedin.professionalFocus.join(
      ", "
    )}\n`;
    context += `- Recent themes: ${data.linkedin.recentThemes.join(", ")}\n`;
  }

  if (data.facebook?.success) {
    context += `\nFACEBOOK COMMUNITY ENGAGEMENT:\n`;
    context += `- Content style: ${data.facebook.contentStyle}\n`;
    context += `- Audience interaction: ${data.facebook.audienceInteraction}\n`;
    context += `- Community engagement: ${data.facebook.communityEngagement}\n`;
    context += `- Post frequency: ${data.facebook.postFrequency}\n`;
  }

  if (data.instagram?.success) {
    context += `\nINSTAGRAM VISUAL STORYTELLING:\n`;
    context += `- Visual style: ${data.instagram.visualStyle}\n`;
    context += `- Storytelling approach: ${data.instagram.storytellingApproach}\n`;
    context += `- Content themes: ${data.instagram.contentThemes.join(", ")}\n`;
    if (data.instagram.hashtagStrategy.length > 0) {
      context += `- Popular hashtags: ${data.instagram.hashtagStrategy
        .slice(0, 5)
        .join(", ")}\n`;
    }
  }

  context += `\n=== CONTENT GENERATION INSTRUCTIONS ===\n`;
  context += `Based on this multi-platform analysis, ensure the generated content:\n`;
  context += `1. Maintains ${data.consistency.crossPlatformScore}% brand consistency\n`;
  context += `2. Reflects the ${data.overallBrandProfile.dominantVoice} brand voice\n`;
  context += `3. Targets ${data.overallBrandProfile.targetAudience}\n`;
  context += `4. Uses ${data.overallBrandProfile.recommendedContentStyle} content style\n`;

  if (data.overallBrandProfile.culturalContext) {
    context += `5. Respects cultural context: ${data.overallBrandProfile.culturalContext}\n`;
  }

  context += `\nThis multi-platform intelligence should result in content that feels authentically aligned with the brand's established voice across all digital touchpoints.\n`;

  return context;
}

export function addCulturalContext(
  brandProfile: BrandProfile,
  location: string
): BrandProfile {
  const enhanced = { ...brandProfile };

  if (
    location.toLowerCase().includes("auckland") ||
    location.toLowerCase().includes("tāmaki makaurau")
  ) {
    enhanced.culturalContext =
      "Auckland/Tāmaki Makaurau - Multicultural urban center with Māori heritage";
  } else if (
    location.toLowerCase().includes("wellington") ||
    location.toLowerCase().includes("te whanganui-a-tara")
  ) {
    enhanced.culturalContext =
      "Wellington/Te Whanganui-a-Tara - Creative capital with strong cultural institutions";
  } else if (
    location.toLowerCase().includes("christchurch") ||
    location.toLowerCase().includes("ōtautahi")
  ) {
    enhanced.culturalContext =
      "Christchurch/Ōtautahi - Resilient garden city with Canterbury heritage";
  } else if (
    location.toLowerCase().includes("new zealand") ||
    location.toLowerCase().includes("aotearoa")
  ) {
    enhanced.culturalContext =
      "Aotearoa New Zealand - Bicultural nation honoring Māori and Pākehā heritage";
  }

  if (
    enhanced.coreThemes.some(
      (theme) => theme.includes("cultural") || theme.includes("heritage")
    )
  ) {
    enhanced.primaryPersonality.push("culturally aware");
  }

  return enhanced;
}

export function generatePlatformOptimization(
  data: MultiPlatformBrandData,
  targetPlatform: string
): string {
  let optimization = `\n=== ${targetPlatform.toUpperCase()} OPTIMIZATION ===\n`;

  switch (targetPlatform.toLowerCase()) {
    case "instagram":
      optimization += `INSTAGRAM-SPECIFIC GUIDANCE:\n`;
      if (data.instagram?.success) {
        optimization += `- Match current visual style: ${data.instagram.visualStyle}\n`;
        optimization += `- Use storytelling approach: ${data.instagram.storytellingApproach}\n`;
        if (data.instagram.hashtagStrategy.length > 0) {
          optimization += `- Include relevant hashtags: ${data.instagram.hashtagStrategy
            .slice(0, 3)
            .join(" ")}\n`;
        }
      }
      optimization += `- Focus on visual storytelling with engaging captions\n`;
      optimization += `- Use high-quality, mobile-optimized images\n`;
      optimization += `- Include call-to-action for engagement\n`;
      break;

    case "facebook":
      optimization += `FACEBOOK-SPECIFIC GUIDANCE:\n`;
      if (data.facebook?.success) {
        optimization += `- Match community engagement style: ${data.facebook.contentStyle}\n`;
        optimization += `- Use audience interaction approach: ${data.facebook.audienceInteraction}\n`;
      }
      optimization += `- Create shareable, community-focused content\n`;
      optimization += `- Encourage comments and discussion\n`;
      optimization += `- Include local community relevance\n`;
      break;

    case "linkedin":
      optimization += `LINKEDIN-SPECIFIC GUIDANCE:\n`;
      if (data.linkedin?.success) {
        optimization += `- Match professional tone: ${data.linkedin.companyTone}\n`;
        optimization += `- Use content style: ${data.linkedin.contentStyle}\n`;
        optimization += `- Focus on themes: ${data.linkedin.recentThemes.join(", ")}\n`;
      }
      optimization += `- Emphasize professional expertise and industry insights\n`;
      optimization += `- Include business value proposition\n`;
      optimization += `- Target decision-makers and industry professionals\n`;
      break;

    case "website":
      optimization += `WEBSITE-SPECIFIC GUIDANCE:\n`;
      if (data.website?.success) {
        optimization += `- Match established brand voice: ${data.website.brandVoice}\n`;
        optimization += `- Reflect key messages: ${data.website.keyMessages?.join(", ")}\n`;
      }
      optimization += `- Maintain SEO-friendly, informative content\n`;
      optimization += `- Include clear value proposition\n`;
      optimization += `- Optimize for conversion and user journey\n`;
      break;

    default:
      optimization += `GENERAL PLATFORM GUIDANCE:\n`;
      optimization += `- Maintain ${data.overallBrandProfile.dominantVoice} brand voice\n`;
      optimization += `- Target ${data.overallBrandProfile.targetAudience}\n`;
      optimization += `- Use ${data.overallBrandProfile.recommendedContentStyle} style\n`;
  }

  optimization += `\nBrand consistency score: ${data.consistency.crossPlatformScore}%\n`;

  return optimization;
}

export async function testMultiPlatformScraping(
  websiteUrl?: string,
  linkedInUrl?: string,
  facebookUrl?: string,
  instagramUrl?: string
): Promise<void> {
  console.log("Testing multi-platform scraping...");

  const result = await scrapeMultiPlatformBrand(
    websiteUrl,
    linkedInUrl,
    facebookUrl,
    instagramUrl
  );
  console.log("Multi-platform result:", result);

  const context = generateMultiPlatformContext(result);
  console.log("Generated context:", context);

  if (websiteUrl) {
    const instagramOptimization = generatePlatformOptimization(result, "instagram");
    console.log("Instagram optimization:", instagramOptimization);
  }
}

// Legacy compatibility exports
export { scrapeWebsiteBasic as scrapeWebsite };
export { generateBrandContext as generateEnhancedPrompt };
