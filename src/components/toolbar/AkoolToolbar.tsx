import { useState } from 'react'
import { useAssetStore } from '../../stores/assetStore'
import BackgroundSwapPanel from './panels/BackgroundSwapPanel'
import ImageUpscalePanel from './panels/ImageUpscalePanel'

type ToolType = 'faceSwap' | 'avatar' | 'videoGen' | 'background' | 'lipSync' | 'upscale' | null

const tools = [
  { id: 'faceSwap' as const, label: 'FaceSwap', icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'avatar' as const, label: 'Avatar', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
  { id: 'videoGen' as const, label: 'VideoGen', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
  { id: 'background' as const, label: 'Background', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'lipSync' as const, label: 'LipSync', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
  { id: 'upscale' as const, label: 'Upscale', icon: 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' },
]

export default function AkoolToolbar() {
  const [activeTool, setActiveTool] = useState<ToolType>(null)
  const selectedAsset = useAssetStore((state) => state.selectedAsset)

  const handleToolClick = (toolId: ToolType) => {
    if (activeTool === toolId) {
      setActiveTool(null)
    } else {
      setActiveTool(toolId)
    }
  }

  const renderPanel = () => {
    switch (activeTool) {
      case 'background':
        return <BackgroundSwapPanel onClose={() => setActiveTool(null)} />
      case 'upscale':
        return <ImageUpscalePanel onClose={() => setActiveTool(null)} />
      default:
        return (
          <div className="text-center py-8">
            <p className="text-zinc-400 text-sm">Coming soon</p>
          </div>
        )
    }
  }

  return (
    <div className="relative">
      {/* Active Panel */}
      {activeTool && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-bg-card border border-zinc-700 rounded-xl shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700">
            <h3 className="text-sm font-semibold">
              {tools.find((t) => t.id === activeTool)?.label}
            </h3>
            <button
              onClick={() => setActiveTool(null)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            {renderPanel()}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-center gap-2 p-3 bg-bg-card/80 backdrop-blur-sm border-t border-zinc-700">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleToolClick(tool.id)}
            disabled={!selectedAsset && tool.id !== 'upscale'}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
              activeTool === tool.id
                ? 'bg-accent text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tool.icon} />
            </svg>
            <span className="text-xs font-medium">{tool.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
