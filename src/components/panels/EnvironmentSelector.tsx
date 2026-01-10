import { useState } from 'react'
import { ENVIRONMENT_PRESETS } from '../../types'
import Spinner from '../ui/Spinner'

interface EnvironmentSelectorProps {
  onGenerate: (prompt: string) => Promise<void>
  isGenerating: boolean
}

export default function EnvironmentSelector({
  onGenerate,
  isGenerating,
}: EnvironmentSelectorProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [customPrompt, setCustomPrompt] = useState('')

  const handleGenerate = () => {
    const preset = ENVIRONMENT_PRESETS.find((p) => p.id === selectedPreset)
    const prompt = customPrompt.trim() || preset?.prompt || ''
    if (prompt) {
      onGenerate(prompt)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold text-zinc-300">Environment Presets</h3>

      {/* Preset Grid */}
      <div className="grid grid-cols-4 gap-2">
        {ENVIRONMENT_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => {
              setSelectedPreset(preset.id)
              setCustomPrompt('')
            }}
            className={`relative p-2 rounded-lg border transition-all ${
              selectedPreset === preset.id
                ? 'border-accent bg-accent/10'
                : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
            }`}
          >
            <div className="aspect-square rounded bg-zinc-700 mb-2 flex items-center justify-center overflow-hidden">
              {/* Placeholder gradient for preset thumbnail */}
              <div
                className="w-full h-full"
                style={{
                  background: getPresetGradient(preset.id),
                }}
              />
            </div>
            <p className="text-xs text-center text-zinc-300 truncate">{preset.name}</p>
            {selectedPreset === preset.id && (
              <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Custom Prompt */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-2">
          Custom Prompt (optional)
        </label>
        <textarea
          value={customPrompt}
          onChange={(e) => {
            setCustomPrompt(e.target.value)
            if (e.target.value) setSelectedPreset(null)
          }}
          placeholder="Describe your ideal environment..."
          rows={2}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-accent resize-none"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || (!selectedPreset && !customPrompt.trim())}
        className="w-full py-3 bg-accent hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <Spinner size="sm" />
            Generating Environment...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Generate Environment
          </>
        )}
      </button>
    </div>
  )
}

// Helper function to generate placeholder gradients for presets
function getPresetGradient(id: string): string {
  const gradients: Record<string, string> = {
    luxury: 'linear-gradient(135deg, #1a1a2e 0%, #4a3f35 100%)',
    natural: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
    golden: 'linear-gradient(135deg, #f97316 0%, #fcd34d 100%)',
    industrial: 'linear-gradient(135deg, #374151 0%, #6b7280 100%)',
    gallery: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
    moody: 'linear-gradient(135deg, #1f2937 0%, #4c1d95 100%)',
    beach: 'linear-gradient(135deg, #0ea5e9 0%, #fcd34d 100%)',
    dining: 'linear-gradient(135deg, #451a03 0%, #f97316 100%)',
  }
  return gradients[id] || 'linear-gradient(135deg, #3f3f46 0%, #52525b 100%)'
}
