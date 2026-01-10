import { useState } from 'react'
import { useAssetStore } from '../../stores/assetStore'
import { useToast } from '../../stores/toastStore'
import Spinner from '../ui/Spinner'

export default function HarmonizeButton() {
  const [isProcessing, setIsProcessing] = useState(false)
  const selectedAsset = useAssetStore((state) => state.selectedAsset)
  const harmonizeSettings = useAssetStore((state) => state.harmonizeSettings)
  const toast = useToast()

  const handleHarmonize = async () => {
    if (!selectedAsset) {
      toast.error('Please select an asset to harmonize')
      return
    }

    setIsProcessing(true)

    // Simulate harmonization processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real implementation, this would:
    // 1. Analyze the environment lighting direction and color
    // 2. Adjust product material properties to match
    // 3. Generate contact shadows
    // 4. Apply ambient occlusion

    toast.success('Harmonization complete!')
    setIsProcessing(false)
  }

  return (
    <div className="flex items-center gap-4 p-4">
      <button
        onClick={handleHarmonize}
        disabled={isProcessing || !selectedAsset}
        className="flex-1 py-4 bg-accent hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-400 text-white rounded-xl font-semibold text-lg transition-all shadow-glow hover:shadow-glow-lg disabled:shadow-none flex items-center justify-center gap-3"
      >
        {isProcessing ? (
          <>
            <Spinner size="md" className="border-white/30 border-t-white" />
            <span>Harmonizing...</span>
          </>
        ) : (
          <>
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <span>HARMONIZE</span>
          </>
        )}
      </button>

      {/* Quick Settings */}
      <div className="flex gap-2">
        <SettingsPreview
          label="L"
          value={harmonizeSettings.light}
          color="text-yellow-500"
        />
        <SettingsPreview
          label="S"
          value={harmonizeSettings.shadow}
          color="text-zinc-400"
        />
        <SettingsPreview
          label="R"
          value={harmonizeSettings.reflection}
          color="text-blue-400"
        />
      </div>
    </div>
  )
}

function SettingsPreview({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex flex-col items-center justify-center">
      <span className={`text-xs font-medium ${color}`}>{label}</span>
      <span className="text-xs text-zinc-400">{Math.round(value)}</span>
    </div>
  )
}
