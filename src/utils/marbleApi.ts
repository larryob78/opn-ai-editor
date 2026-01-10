import { useSettingsStore } from '../stores/settingsStore'

const MARBLE_BASE_URL = 'https://platform.worldlabs.ai'

export type MarbleJobType = 'text2world' | 'image2world' | 'pano2world' | 'multi2world' | 'video2world'

export interface MarbleJobRequest {
  type: MarbleJobType
  prompt?: string
  imageUrl?: string
  imageUrls?: string[]
  videoUrl?: string
}

export interface MarbleJobStatus {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress?: number
  result?: {
    splatUrl?: string
    meshUrl?: string
    videoUrl?: string
  }
  error?: string
}

export class MarbleApiClient {
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || useSettingsStore.getState().marbleApiKey
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.apiKey) {
      throw new Error('Marble API key not configured. Please add your API key in Settings.')
    }

    const response = await fetch(`${MARBLE_BASE_URL}${endpoint}`, {
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

  async createJob(request: MarbleJobRequest): Promise<{ jobId: string }> {
    const endpoint = this.getEndpoint(request.type)
    const body = this.buildRequestBody(request)

    return this.request<{ jobId: string }>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  async getJobStatus(jobId: string): Promise<MarbleJobStatus> {
    return this.request<MarbleJobStatus>(`/api/jobs/${jobId}`)
  }

  async pollUntilComplete(
    jobId: string,
    onProgress?: (status: MarbleJobStatus) => void,
    pollInterval = 5000,
    timeout = 600000
  ): Promise<MarbleJobStatus> {
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

  async generateWorld(
    prompt: string,
    onProgress?: (status: MarbleJobStatus) => void
  ): Promise<MarbleJobStatus> {
    const { jobId } = await this.createJob({
      type: 'text2world',
      prompt,
    })

    return this.pollUntilComplete(jobId, onProgress)
  }

  async generateWorldFromImage(
    imageUrl: string,
    prompt?: string,
    onProgress?: (status: MarbleJobStatus) => void
  ): Promise<MarbleJobStatus> {
    const { jobId } = await this.createJob({
      type: 'image2world',
      imageUrl,
      prompt,
    })

    return this.pollUntilComplete(jobId, onProgress)
  }

  async generateWorldFromPanorama(
    imageUrl: string,
    onProgress?: (status: MarbleJobStatus) => void
  ): Promise<MarbleJobStatus> {
    const { jobId } = await this.createJob({
      type: 'pano2world',
      imageUrl,
    })

    return this.pollUntilComplete(jobId, onProgress)
  }

  private getEndpoint(type: MarbleJobType): string {
    const endpoints: Record<MarbleJobType, string> = {
      text2world: '/api/generate/text',
      image2world: '/api/generate/image',
      pano2world: '/api/generate/panorama',
      multi2world: '/api/generate/multi',
      video2world: '/api/generate/video',
    }
    return endpoints[type]
  }

  private buildRequestBody(request: MarbleJobRequest): Record<string, unknown> {
    const body: Record<string, unknown> = {}

    if (request.prompt) body.prompt = request.prompt
    if (request.imageUrl) body.imageUrl = request.imageUrl
    if (request.imageUrls) body.imageUrls = request.imageUrls
    if (request.videoUrl) body.videoUrl = request.videoUrl

    return body
  }
}

// Singleton instance
let marbleClient: MarbleApiClient | null = null

export function getMarbleClient(): MarbleApiClient {
  if (!marbleClient) {
    marbleClient = new MarbleApiClient()
  }
  return marbleClient
}

export function resetMarbleClient(): void {
  marbleClient = null
}
