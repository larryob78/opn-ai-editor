// Project types
export interface Project {
  id: string
  name: string
  client: string
  productType: string
  packageType: string
  notes: string
  stage: ProjectStage
  thumbnail?: string
  createdAt: Date
  updatedAt: Date
}

export type ProjectStage =
  | 'inbox'
  | 'scanning'
  | 'generate'
  | 'composite'
  | 'enhance'
  | 'delivered'

// Asset types
export interface Asset {
  id: string
  name: string
  type: AssetType
  url: string
  thumbnail?: string
  fileSize: number
  createdAt: Date
  transform: Transform
}

export type AssetType = 'scan' | 'environment' | 'model'

export interface Transform {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
}

// Harmonize settings
export interface HarmonizeSettings {
  light: number
  shadow: number
  reflection: number
  edge: number
  color: number
}

// Environment preset
export interface EnvironmentPreset {
  id: string
  name: string
  thumbnail: string
  prompt: string
}

// Toast notification
export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

// Settings
export interface Settings {
  marbleApiKey: string
  akoolApiKey: string
  eodTime: string // Format: "HH:MM"
  theme: 'dark' | 'light'
}

// Export options
export interface ImageExportOptions {
  format: 'png' | 'jpg'
  resolution: '1x' | '2x' | '4x'
  quality: number // 1-100 for JPG
}

export interface VideoExportOptions {
  duration: 3 | 5 | 10
  animationType: 'orbit' | 'zoom' | 'pan'
}

// Akool API types
export interface AkoolJob {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  type: 'faceSwap' | 'talkingAvatar' | 'videoGenerate' | 'backgroundSwap' | 'lipSync' | 'imageUpscale'
  result?: string
  error?: string
}

// Marble API types
export interface MarbleJob {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  type: 'text2world' | 'image2world' | 'pano2world'
  result?: {
    splatUrl?: string
    meshUrl?: string
    videoUrl?: string
  }
  error?: string
}

// Package types for pricing
export interface Package {
  id: string
  name: string
  price: number
  description: string
}

export const PACKAGES: Package[] = [
  { id: 'basic', name: 'Basic', price: 299, description: '3 shots, 24hr turnaround' },
  { id: 'standard', name: 'Standard', price: 599, description: '6 shots, same-day delivery' },
  { id: 'premium', name: 'Premium', price: 999, description: '12 shots, rush delivery + video' },
  { id: 'enterprise', name: 'Enterprise', price: 2499, description: 'Unlimited shots, dedicated support' },
]

// Environment presets
export const ENVIRONMENT_PRESETS: EnvironmentPreset[] = [
  { id: 'luxury', name: 'Luxury Interior', thumbnail: '/presets/luxury.jpg', prompt: 'Luxurious modern interior with marble floors, soft ambient lighting, and elegant furniture' },
  { id: 'natural', name: 'Natural Studio', thumbnail: '/presets/natural.jpg', prompt: 'Clean natural photography studio with soft daylight, white cyclorama background' },
  { id: 'golden', name: 'Golden Hour', thumbnail: '/presets/golden.jpg', prompt: 'Outdoor scene during golden hour, warm sunset lighting, soft shadows' },
  { id: 'industrial', name: 'Industrial Loft', thumbnail: '/presets/industrial.jpg', prompt: 'Industrial loft space with exposed brick, steel beams, large windows' },
  { id: 'gallery', name: 'Art Gallery', thumbnail: '/presets/gallery.jpg', prompt: 'Minimalist art gallery with white walls, track lighting, polished concrete floor' },
  { id: 'moody', name: 'Moody Night', thumbnail: '/presets/moody.jpg', prompt: 'Dramatic nighttime scene with neon accents, deep shadows, urban atmosphere' },
  { id: 'beach', name: 'Beach Resort', thumbnail: '/presets/beach.jpg', prompt: 'Tropical beach resort, turquoise water, palm trees, bright sunny day' },
  { id: 'dining', name: 'Fine Dining', thumbnail: '/presets/dining.jpg', prompt: 'Upscale restaurant interior, candlelit tables, warm ambient lighting' },
]
