import { useState } from 'react'
import { useToast } from '../../../stores/toastStore'
import Spinner from '../../ui/Spinner'

interface ImageUpscalePanelProps {
  onClose: () => void
}

export default function ImageUpscalePanel(_props: ImageUpscalePanelProps) {
  const [scale, setScale] = useState<2 | 4>(2)
  const [isProcessing, setIsProcessing] = useState(false)
  const toast = useToast()

  // Mock current resolution
  const currentWidth = 1920
  const currentHeight = 1080

  const outputWidth = currentWidth * scale
  const outputHeight = currentHeight * scale

  const handleUpscale = async () => {
    setIsProcessing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // In a real implementation, this would:
    // 1. Take a screenshot of the current canvas
    // 2. Send it to the Akool upscale API
    // 3. Download the result

    toast.success(`Image upscaled to ${outputWidth}x${outputHeight}!`)
    setIsProcessing(false)

    // Trigger download (mock)
    // In real implementation, would download the actual upscaled image
  }

  return (
    <div className="space-y-4">
      {/* Current Resolution */}
      <div className="p-3 bg-zinc-800/50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Current Resolution</span>
          <span className="text-white font-mono">{currentWidth} × {currentHeight}</span>
        </div>
      </div>

      {/* Scale Selector */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-2">
          Upscale Factor
        </label>
        <div className="flex gap-2">
          {([2, 4] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScale(s)}
              disabled={isProcessing}
              className={`flex-1 py-3 rounded-lg border font-semibold transition-colors ${
                scale === s
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-600 disabled:opacity-50'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Output Resolution */}
      <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-accent">Output Resolution</span>
          <span className="text-white font-mono font-semibold">{outputWidth} × {outputHeight}</span>
        </div>
      </div>

      {/* Upscale Button */}
      <button
        onClick={handleUpscale}
        disabled={isProcessing}
        className="w-full py-3 bg-accent hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Spinner size="sm" />
            Upscaling...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Upscale
          </>
        )}
      </button>
    </div>
  )
}
