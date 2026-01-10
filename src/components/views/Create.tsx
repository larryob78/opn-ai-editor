import { useState, Suspense, lazy } from 'react'
import MainLayout from '../MainLayout'
import AssetLibrary from '../panels/AssetLibrary'
import PropertiesPanel from '../panels/PropertiesPanel'
import EnvironmentSelector from '../panels/EnvironmentSelector'
import HarmonizeButton from '../canvas/HarmonizeButton'
import AkoolToolbar from '../toolbar/AkoolToolbar'
import ExportModal from '../modals/ExportModal'
import Spinner from '../ui/Spinner'
import { useToast } from '../../stores/toastStore'
import type { ImageExportOptions, VideoExportOptions } from '../../types'

// Lazy load the 3D scene for better performance
const Scene = lazy(() => import('../canvas/Scene'))

export default function Create() {
  const [showEnvironments, setShowEnvironments] = useState(false)
  const [isGeneratingEnv, setIsGeneratingEnv] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const toast = useToast()

  const handleGenerateEnvironment = async (_prompt: string) => {
    setIsGeneratingEnv(true)

    // Simulate API call to Marble with the prompt
    // In real implementation: await getMarbleClient().generateWorld(prompt)
    await new Promise((resolve) => setTimeout(resolve, 5000))

    toast.success('Environment generated successfully!')
    setIsGeneratingEnv(false)
    setShowEnvironments(false)
  }

  const handleExportImage = async (options: ImageExportOptions) => {
    // In a real implementation, this would capture the canvas
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success(`Image exported as ${options.format.toUpperCase()} at ${options.resolution}`)
  }

  const handleExportVideo = async (options: VideoExportOptions) => {
    // In a real implementation, this would render an orbit video
    await new Promise((resolve) => setTimeout(resolve, 3000))
    toast.success(`Video exported: ${options.duration}s ${options.animationType} animation`)
  }

  const CenterPanel = (
    <div className="h-full flex flex-col">
      {/* Canvas Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-bg-card/50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEnvironments(!showEnvironments)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              showEnvironments
                ? 'bg-accent text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <svg
              className="w-4 h-4 inline-block mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Environments
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExportModal(true)}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Environment Selector Dropdown */}
      {showEnvironments && (
        <div className="border-b border-zinc-800 bg-bg-card">
          <EnvironmentSelector
            onGenerate={handleGenerateEnvironment}
            isGenerating={isGeneratingEnv}
          />
        </div>
      )}

      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-bg-dark">
              <div className="text-center">
                <Spinner size="lg" className="mx-auto mb-4" />
                <p className="text-sm text-zinc-400">Loading 3D Scene...</p>
              </div>
            </div>
          }
        >
          <Scene />
        </Suspense>
      </div>

      {/* Harmonize Button */}
      <HarmonizeButton />
    </div>
  )

  const BottomPanel = <AkoolToolbar />

  return (
    <>
      <MainLayout
        leftPanel={<AssetLibrary />}
        centerPanel={CenterPanel}
        rightPanel={<PropertiesPanel />}
        bottomPanel={BottomPanel}
      />
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExportImage={handleExportImage}
        onExportVideo={handleExportVideo}
      />
    </>
  )
}
