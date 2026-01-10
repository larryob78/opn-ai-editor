import { useState } from 'react'
import type { ImageExportOptions, VideoExportOptions } from '../../types'
import Spinner from '../ui/Spinner'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  onExportImage: (options: ImageExportOptions) => Promise<void>
  onExportVideo: (options: VideoExportOptions) => Promise<void>
}

type TabType = 'image' | 'video' | 'web3d'

export default function ExportModal({
  isOpen,
  onClose,
  onExportImage,
  onExportVideo,
}: ExportModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('image')
  const [isExporting, setIsExporting] = useState(false)

  // Image options
  const [imageFormat, setImageFormat] = useState<'png' | 'jpg'>('png')
  const [imageResolution, setImageResolution] = useState<'1x' | '2x' | '4x'>('2x')
  const [imageQuality, setImageQuality] = useState(90)

  // Video options
  const [videoDuration, setVideoDuration] = useState<3 | 5 | 10>(5)
  const [animationType, setAnimationType] = useState<'orbit' | 'zoom' | 'pan'>('orbit')

  if (!isOpen) return null

  const handleExport = async () => {
    setIsExporting(true)
    try {
      if (activeTab === 'image') {
        await onExportImage({
          format: imageFormat,
          resolution: imageResolution,
          quality: imageQuality,
        })
      } else if (activeTab === 'video') {
        await onExportVideo({
          duration: videoDuration,
          animationType: animationType,
        })
      }
      onClose()
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'image', label: 'Image' },
    { id: 'video', label: 'Video' },
    { id: 'web3d', label: 'Web 3D' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-bg-card border border-zinc-700 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700">
          <h2 className="text-lg font-semibold">Export</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'image' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Format</label>
                <div className="flex gap-2">
                  {(['png', 'jpg'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => setImageFormat(format)}
                      className={`flex-1 py-2 rounded-lg border font-medium text-sm uppercase transition-colors ${
                        imageFormat === format
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Resolution</label>
                <div className="flex gap-2">
                  {(['1x', '2x', '4x'] as const).map((res) => (
                    <button
                      key={res}
                      onClick={() => setImageResolution(res)}
                      className={`flex-1 py-2 rounded-lg border font-medium text-sm transition-colors ${
                        imageResolution === res
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              {imageFormat === 'jpg' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-zinc-400">Quality</label>
                    <span className="text-sm text-white">{imageQuality}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={imageQuality}
                    onChange={(e) => setImageQuality(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'video' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Duration</label>
                <div className="flex gap-2">
                  {([3, 5, 10] as const).map((dur) => (
                    <button
                      key={dur}
                      onClick={() => setVideoDuration(dur)}
                      className={`flex-1 py-2 rounded-lg border font-medium text-sm transition-colors ${
                        videoDuration === dur
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      {dur}s
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Animation</label>
                <div className="flex gap-2">
                  {(['orbit', 'zoom', 'pan'] as const).map((anim) => (
                    <button
                      key={anim}
                      onClick={() => setAnimationType(anim)}
                      className={`flex-1 py-2 rounded-lg border font-medium text-sm capitalize transition-colors ${
                        animationType === anim
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      {anim}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'web3d' && (
            <div className="py-8 text-center">
              <p className="text-zinc-400 text-sm">
                Export as a self-contained HTML file with embedded 3D viewer
              </p>
              <p className="text-zinc-500 text-xs mt-2">Coming soon</p>
            </div>
          )}

          <button
            onClick={handleExport}
            disabled={isExporting || activeTab === 'web3d'}
            className="w-full mt-6 py-3 bg-accent hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <Spinner size="sm" />
                Exporting...
              </>
            ) : (
              'Export'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
