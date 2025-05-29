export type PlatformType = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok'

export interface PublishRequest {
  content: string
  platforms: PlatformType[]
  scheduledAt?: string // ISO datetime
  images?: string[]    // base64 strings or URLs
}

export interface PublishResult {
  platform: PlatformType
  success: boolean
  message?: string
  postUrl?: string
}
