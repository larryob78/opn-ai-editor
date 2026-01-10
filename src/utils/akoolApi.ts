import { useSettingsStore } from '../stores/settingsStore'

const AKOOL_BASE_URL = 'https://openapi.akool.com/api/open/v3'

export type AkoolToolType =
  | 'faceSwap'
  | 'talkingAvatar'
  | 'videoGenerate'
  | 'backgroundSwap'
  | 'lipSync'
  | 'imageUpscale'

export interface AkoolJobStatus {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress?: number
  result?: string
  error?: string
}

export class AkoolApiClient {
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || useSettingsStore.getState().akoolApiKey
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.apiKey) {
      throw new Error('Akool API key not configured. Please add your API key in Settings.')
    }

    const response = await fetch(`${AKOOL_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }))
      throw new Error(error.message || `API error: ${response.status}`)
    }

    return response.json()
  }

  async getJobStatus(jobId: string): Promise<AkoolJobStatus> {
    return this.request<AkoolJobStatus>(`/job/${jobId}`)
  }

  async pollUntilComplete(
    jobId: string,
    onProgress?: (status: AkoolJobStatus) => void,
    pollInterval = 3000,
    timeout = 300000
  ): Promise<AkoolJobStatus> {
    const startTime = Date.now()

    while (true) {
      const status = await this.getJobStatus(jobId)
      onProgress?.(status)

      if (status.status === 'completed' || status.status === 'failed') {
        return status
      }

      if (Date.now() - startTime > timeout) {
        throw new Error('Job timed out')
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval))
    }
  }

  // Face Swap
  async faceSwap(
    sourceImageUrl: string,
    targetImageUrl: string,
    onProgress?: (status: AkoolJobStatus) => void
  ): Promise<AkoolJobStatus> {
    const response = await this.request<{ jobId: string }>('/faceswap/highres/create', {
      method: 'POST',
      body: JSON.stringify({
        sourceImage: sourceImageUrl,
        targetImage: targetImageUrl,
      }),
    })

    return this.pollUntilComplete(response.jobId, onProgress)
  }

  // Background Swap
  async backgroundSwap(
    imageUrl: string,
    options: { prompt?: string; backgroundImageUrl?: string },
    onProgress?: (status: AkoolJobStatus) => void
  ): Promise<AkoolJobStatus> {
    const response = await this.request<{ jobId: string }>('/background/create', {
      method: 'POST',
      body: JSON.stringify({
        image: imageUrl,
        prompt: options.prompt,
        backgroundImage: options.backgroundImageUrl,
      }),
    })

    return this.pollUntilComplete(response.jobId, onProgress)
  }

  // Image Upscale
  async imageUpscale(
    imageUrl: string,
    scale: 2 | 4,
    onProgress?: (status: AkoolJobStatus) => void
  ): Promise<AkoolJobStatus> {
    const response = await this.request<{ jobId: string }>('/upscale/create', {
      method: 'POST',
      body: JSON.stringify({
        image: imageUrl,
        scale,
      }),
    })

    return this.pollUntilComplete(response.jobId, onProgress)
  }

  // Talking Avatar
  async talkingAvatar(
    avatarImageUrl: string,
    audioUrl: string,
    onProgress?: (status: AkoolJobStatus) => void
  ): Promise<AkoolJobStatus> {
    const response = await this.request<{ jobId: string }>('/avatar/create', {
      method: 'POST',
      body: JSON.stringify({
        avatarImage: avatarImageUrl,
        audio: audioUrl,
      }),
    })

    return this.pollUntilComplete(response.jobId, onProgress)
  }

  // Video Generate
  async videoGenerate(
    imageUrl: string,
    options: { duration?: number; motion?: string },
    onProgress?: (status: AkoolJobStatus) => void
  ): Promise<AkoolJobStatus> {
    const response = await this.request<{ jobId: string }>('/video/create', {
      method: 'POST',
      body: JSON.stringify({
        image: imageUrl,
        duration: options.duration || 4,
        motion: options.motion || 'auto',
      }),
    })

    return this.pollUntilComplete(response.jobId, onProgress)
  }

  // Lip Sync
  async lipSync(
    videoUrl: string,
    audioUrl: string,
    onProgress?: (status: AkoolJobStatus) => void
  ): Promise<AkoolJobStatus> {
    const response = await this.request<{ jobId: string }>('/lipsync/create', {
      method: 'POST',
      body: JSON.stringify({
        video: videoUrl,
        audio: audioUrl,
      }),
    })

    return this.pollUntilComplete(response.jobId, onProgress)
  }
}

// Singleton instance
let akoolClient: AkoolApiClient | null = null

export function getAkoolClient(): AkoolApiClient {
  if (!akoolClient) {
    akoolClient = new AkoolApiClient()
  }
  return akoolClient
}

export function resetAkoolClient(): void {
  akoolClient = null
}
