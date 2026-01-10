import { useCallback } from 'react'
import type { ImageExportOptions, VideoExportOptions } from '../types'

export function useCanvasExport() {
  // Note: This hook should be used within a component that is inside the Canvas
  // For now, we'll provide utility functions that can work with a canvas element

  const captureCanvas = useCallback(
    (canvas: HTMLCanvasElement, options: ImageExportOptions): string => {
      const { format, resolution, quality } = options

      // Create a temporary canvas for scaling
      const tempCanvas = document.createElement('canvas')
      const ctx = tempCanvas.getContext('2d')
      if (!ctx) throw new Error('Failed to get canvas context')

      const scale = resolution === '1x' ? 1 : resolution === '2x' ? 2 : 4
      tempCanvas.width = canvas.width * scale
      tempCanvas.height = canvas.height * scale

      // Draw scaled image
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height)

      // Convert to data URL
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg'
      const qualityValue = format === 'jpg' ? quality / 100 : undefined

      return tempCanvas.toDataURL(mimeType, qualityValue)
    },
    []
  )

  const downloadImage = useCallback(
    (dataUrl: string, filename: string) => {
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    []
  )

  const exportImage = useCallback(
    async (canvas: HTMLCanvasElement, options: ImageExportOptions, projectName: string) => {
      const dataUrl = captureCanvas(canvas, options)
      const extension = options.format
      const filename = `${projectName}_${options.resolution}.${extension}`
      downloadImage(dataUrl, filename)
    },
    [captureCanvas, downloadImage]
  )

  return {
    captureCanvas,
    downloadImage,
    exportImage,
  }
}

export function useVideoExport() {
  const captureVideoFrames = useCallback(
    async (
      canvas: HTMLCanvasElement,
      options: VideoExportOptions,
      onFrame: (frameIndex: number, totalFrames: number) => void
    ): Promise<Blob> => {
      const { duration } = options
      const fps = 30
      const totalFrames = duration * fps

      // Check if MediaRecorder is supported
      if (!MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        throw new Error('Video recording not supported in this browser')
      }

      const stream = canvas.captureStream(fps)
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000, // 5 Mbps
      })

      const chunks: Blob[] = []

      return new Promise((resolve, reject) => {
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data)
          }
        }

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' })
          resolve(blob)
        }

        recorder.onerror = () => {
          reject(new Error('Recording failed'))
        }

        recorder.start()

        // Record for the specified duration
        let frameIndex = 0
        const frameInterval = setInterval(() => {
          frameIndex++
          onFrame(frameIndex, totalFrames)

          if (frameIndex >= totalFrames) {
            clearInterval(frameInterval)
            recorder.stop()
          }
        }, 1000 / fps)
      })
    },
    []
  )

  const downloadVideo = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [])

  const exportVideo = useCallback(
    async (
      canvas: HTMLCanvasElement,
      options: VideoExportOptions,
      projectName: string,
      onProgress: (progress: number) => void
    ): Promise<void> => {
      const blob = await captureVideoFrames(canvas, options, (frame, total) => {
        onProgress(Math.round((frame / total) * 100))
      })

      const filename = `${projectName}_${options.duration}s_${options.animationType}.webm`
      downloadVideo(blob, filename)
    },
    [captureVideoFrames, downloadVideo]
  )

  return {
    captureVideoFrames,
    downloadVideo,
    exportVideo,
  }
}
