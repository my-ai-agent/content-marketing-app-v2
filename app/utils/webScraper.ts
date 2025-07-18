// /app/utils/webScraper.ts
// Web scraping utility for brand voice analysis and content enhancement

export interface ScrapedBrandData {
  url: string
  heroMessage?: string
  aboutContent?: string
  brandVoice?: 'professional' | 'casual' | 'technical' | 'creative' | 'luxury'
  keyMessages?: string[]
  businessDescription?: string
  scrapeTimestamp: string
  success: boolean
  error?: string
}

export interface BrandAnalysis {
  tone: string
  personality: string[]
  keyThemes: string[]
  targetAudience: string
  contentStyle: string
}

// Cache for scraped data (30-day expiry)
const SCRAPE_CACHE_KEY = 'brandScrapeCache'
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds

// Get cached scrape data
function getCachedScrapeData(url: string): ScrapedBrandData | null {
  try {
    const cache = localStorage.getItem(SCRAPE_CACHE_KEY)
    if (!cache) return null

    const parsed = JSON.parse(cache)
    const normalizedUrl = normalizeUrl(url)
    
    if (parsed[normalizedUrl]) {
      const cached = parsed[normalizedUrl]
      const age = Date.now() - new Date(cached.scrapeTimestamp).getTime()
      
      // Return cached data if less than 30 days old
      if (age < CACHE_DURATION) {
        return cached
      }
    }
    return null
  } catch (error) {
    console.warn('Error reading scrape cache:', error)
    return null
  }
}

// Cache scrape data
function cacheScrapeData(url: string, data: ScrapedBrandData): void {
  try {
    const cache = localStorage.getItem(SCRAPE_CACHE_KEY)
    const parsed = cache ? JSON.parse(cache) : {}
    const normalizedUrl = normalizeUrl(url)
    
    parsed[normalizedUrl] = data
    localStorage.setItem(SCRAPE_CACHE_KEY, JSON.stringify(parsed))
  } catch (error) {
    console.warn('Error caching scrape data:', error)
  }
}

// Normalize URL for consistent caching
function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
    return urlObj.hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return url.toLowerCase().replace(/^www\./, '')
  }
}

// Simple client-side content extraction (CORS-friendly approach)
export async function scrapeWebsiteBasic(url: string): Promise<ScrapedBrandData> {
  const normalizedUrl = normalizeUrl(url)
  
  // Check cache first
  const cached = getCachedScrapeData(url)
  if (cached) {
    console.log('Using cached brand data for:', normalizedUrl)
    return cached
  }

  const result: ScrapedBrandData = {
    url: normalizedUrl,
    scrapeTimestamp: new Date().toISOString(),
    success: false
  }

  try {
    // For client-side scraping, we'll use a CORS proxy approach
    // Note: In production, this should be done server-side
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const htmlContent = data.contents

    if (!htmlContent) {
      throw new Error('No content received from website')
    }

    // Parse HTML content
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')

    // Extract key content elements
    result.heroMessage = extractHeroMessage(doc)
    result.aboutContent = extractAboutContent(doc)
    result.businessDescription = extractBusinessDescription(doc)
    result.keyMessages = extractKeyMessages(doc)
    result.brandVoice = analyzeBrandVoice(doc)
    result.success = true

    // Cache the results
    cacheScrapeData(url, result)
    
    console.log('Successfully scraped brand data for:', normalizedUrl)
    return result

  } catch (error) {
    console.warn('Error scraping website:', error)
    result.error = error instanceof Error ? error.message : 'Unknown scraping error'
    result.success = false
    
    // Cache failed attempts to avoid repeated requests
    cacheScrapeData(url, result)
    return result
  }
}

// Extract hero/main message from homepage
function extractHeroMessage(doc: Document): string {
  const selectors = [
    'h1',
    '[class*="hero"] h1',
    '[class*="banner"] h1',
    '[class*="main"] h1',
    '[id*="hero"] h1',
    '.hero-title',
    '.main-title',
    '[class*="headline"]'
  ]

  for (const selector of selectors) {
    const element = doc.querySelector(selector)
    if (element && element.textContent) {
      const text = element.textContent.trim()
      if (text.length > 10 && text.length < 200) {
        return text
      }
    }
  }

  return ''
}

// Extract about/description content
function extractAboutContent(doc: Document): string {
  const selectors = [
    '[class*="about"]',
    '[id*="about"]',
    '[class*="description"]',
    '[class*="intro"]',
    '.lead',
    '.subtitle',
    'meta[name="description"]'
  ]

  for (const selector of selectors) {
    const element = doc.querySelector(selector)
    if (element) {
      let text = ''
      
      if (element.tagName === 'META') {
        text = element.getAttribute('content') || ''
      } else {
        text = element.textContent?.trim() || ''
      }
      
      if (text.length > 20 && text.length < 500) {
        return text
      }
    }
  }

  return ''
}

// Extract business description from meta tags and content
function extractBusinessDescription(doc: Document): string {
  // Try meta description first
  const metaDesc = doc.querySelector('meta[name="description"]')
  if (metaDesc) {
    const content = metaDesc.getAttribute('content')
    if (content && content.length > 20) {
      return content.trim()
    }
  }

  // Try first paragraph
  const firstP = doc.querySelector('p')
  if (firstP && firstP.textContent) {
    const text = firstP.textContent.trim()
    if (text.length > 20 && text.length < 300) {
      return text
    }
  }

  return ''
}

// Extract key marketing messages
function extractKeyMessages(doc: Document): string[] {
  const messages: string[] = []
  
  // Look for headings that might contain key messages
  const headings = doc.querySelectorAll('h2, h3, .feature-title, [class*="benefit"]')
  
  headings.forEach(heading => {
    const text = heading.textContent?.trim()
    if (text && text.length > 5 && text.length < 100) {
      messages.push(text)
    }
  })

  return messages.slice(0, 5) // Limit to top 5 messages
}

// Analyze brand voice from content
function analyzeBrandVoice(doc: Document): 'professional' | 'casual' | 'technical' | 'creative' | 'luxury' {
  const allText = doc.body?.textContent?.toLowerCase() || ''
  
  // Professional indicators
  const professionalWords = ['expertise', 'professional', 'industry', 'solutions', 'services', 'excellence', 'quality']
  const professionalCount = professionalWords.filter(word => allText.includes(word)).length

  // Casual indicators
  const casualWords = ['awesome', 'amazing', 'love', 'fun', 'easy', 'simple', 'great', 'cool']
  const casualCount = casualWords.filter(word => allText.includes(word)).length

  // Technical indicators
  const technicalWords = ['technology', 'innovative', 'advanced', 'system', 'platform', 'integration', 'optimization']
  const technicalCount = technicalWords.filter(word => allText.includes(word)).length

  // Creative indicators
  const creativeWords = ['creative', 'design', 'unique', 'artistic', 'imagination', 'inspiration', 'vision']
  const creativeCount = creativeWords.filter(word => allText.includes(word)).length

  // Luxury indicators
  const luxuryWords = ['luxury', 'premium', 'exclusive', 'bespoke', 'elegant', 'sophisticated', 'exceptional']
  const luxuryCount = luxuryWords.filter(word => allText.includes(word)).length

  // Determine dominant voice
  const scores = {
    professional: professionalCount,
    casual: casualCount,
    technical: technicalCount,
    creative: creativeCount,
    luxury: luxuryCount
  }

  const maxScore = Math.max(...Object.values(scores))
  const dominantVoice = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as any

  return dominantVoice || 'professional'
}

// Analyze brand personality and themes
export function analyzeBrandPersonality(scrapedData: ScrapedBrandData): BrandAnalysis {
  const allContent = [
    scrapedData.heroMessage,
    scrapedData.aboutContent,
    scrapedData.businessDescription,
    ...(scrapedData.keyMessages || [])
  ].filter(Boolean).join(' ').toLowerCase()

  // Determine tone characteristics
  let tone = 'professional and trustworthy'
  if (scrapedData.brandVoice === 'casual') tone = 'friendly and approachable'
  if (scrapedData.brandVoice === 'technical') tone = 'expert and informative'
  if (scrapedData.brandVoice === 'creative') tone = 'innovative and inspiring'
  if (scrapedData.brandVoice === 'luxury') tone = 'premium and sophisticated'

  // Extract personality traits
  const personality: string[] = []
  if (allContent.includes('family') || allContent.includes('tradition')) personality.push('family-oriented')
  if (allContent.includes('sustain') || allContent.includes('eco')) personality.push('environmentally conscious')
  if (allContent.includes('local') || allContent.includes('community')) personality.push('community-focused')
  if (allContent.includes('innovat') || allContent.includes('modern')) personality.push('innovative')
  if (allContent.includes('authentic') || allContent.includes('genuine')) personality.push('authentic')

  // Extract key themes
  const themes: string[] = []
  if (allContent.includes('tourism') || allContent.includes('travel')) themes.push('tourism and travel')
  if (allContent.includes('culture') || allContent.includes('heritage')) themes.push('cultural heritage')
  if (allContent.includes('experience') || allContent.includes('adventure')) themes.push('experiential')
  if (allContent.includes('service') || allContent.includes('hospitality')) themes.push('service excellence')

  // Determine target audience
  let targetAudience = 'general public'
  if (allContent.includes('business') || allContent.includes('corporate')) targetAudience = 'business clients'
  if (allContent.includes('family') || allContent.includes('children')) targetAudience = 'families'
  if (allContent.includes('luxury') || allContent.includes('premium')) targetAudience = 'luxury market'

  // Determine content style
  let contentStyle = 'informative and engaging'
  if (scrapedData.brandVoice === 'casual') contentStyle = 'conversational and relatable'
  if (scrapedData.brandVoice === 'luxury') contentStyle = 'elegant and aspirational'
  if (scrapedData.brandVoice === 'technical') contentStyle = 'detailed and authoritative'

  return {
    tone,
    personality: personality.length > 0 ? personality : ['professional'],
    keyThemes: themes.length > 0 ? themes : ['quality service'],
    targetAudience,
    contentStyle
  }
}

// Generate enhanced prompt context from scraped data
export function generateBrandContext(scrapedData: ScrapedBrandData): string {
  if (!scrapedData.success) {
    return '' // Return empty context if scraping failed
  }

  const analysis = analyzeBrandPersonality(scrapedData)
  
  let context = `\nBRAND CONTEXT from ${scrapedData.url}:\n`
  
  if (scrapedData.heroMessage) {
    context += `- Main message: "${scrapedData.heroMessage}"\n`
  }
  
  if (scrapedData.businessDescription) {
    context += `- Business description: "${scrapedData.businessDescription}"\n`
  }
  
  context += `- Brand voice: ${scrapedData.brandVoice}\n`
  context += `- Tone: ${analysis.tone}\n`
  context += `- Personality: ${analysis.personality.join(', ')}\n`
  context += `- Key themes: ${analysis.keyThemes.join(', ')}\n`
  context += `- Target audience: ${analysis.targetAudience}\n`
  context += `- Content style: ${analysis.contentStyle}\n`
  
  if (scrapedData.keyMessages && scrapedData.keyMessages.length > 0) {
    context += `- Key messages: ${scrapedData.keyMessages.join(', ')}\n`
  }
  
  context += `\nPlease ensure the generated content matches this brand voice and messaging style.\n`
  
  return context
}

// Test function for development
export async function testWebsiteScraping(url: string): Promise<void> {
  console.log('Testing website scraping for:', url)
  
  const result = await scrapeWebsiteBasic(url)
  console.log('Scrape result:', result)
  
  if (result.success) {
    const analysis = analyzeBrandPersonality(result)
    console.log('Brand analysis:', analysis)
    
    const context = generateBrandContext(result)
    console.log('Generated context:', context)
  }
}
