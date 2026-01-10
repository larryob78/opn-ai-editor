import { useState, useCallback } from 'react'
import { useAssetStore } from '../../stores/assetStore'
import type { Asset } from '../../types'

export default function AssetLibrary() {
  const assets = useAssetStore((state) => state.assets)
  const selectedAsset = useAssetStore((state) => state.selectedAsset)
  const selectAsset = useAssetStore((state) => state.selectAsset)
  const addAsset = useAssetStore((state) => state.addAsset)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const scans = assets.filter((a) => a.type === 'scan' || a.type === 'model')
  const environments = assets.filter((a) => a.type === 'environment')

  const filteredScans = scans.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredEnvironments = environments.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      files.forEach((file) => {
        if (file.size > 100 * 1024 * 1024) {
          alert(`File ${file.name} exceeds 100MB limit`)
          return
        }

        const ext = file.name.split('.').pop()?.toLowerCase()
        if (!['glb', 'gltf', 'ply'].includes(ext || '')) {
          alert(`File ${file.name} is not a supported format`)
          return
        }

        const url = URL.createObjectURL(file)
        addAsset({
          name: file.name,
          type: ext === 'ply' ? 'scan' : 'model',
          url,
          fileSize: file.size,
          transform: {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: 1,
          },
        })
      })
    },
    [addAsset]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const AssetCard = ({ asset }: { asset: Asset }) => (
    <button
      onClick={() => selectAsset(asset)}
      className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
        selectedAsset?.id === asset.id
          ? 'bg-accent/20 border border-accent'
          : 'bg-zinc-800/50 border border-transparent hover:border-zinc-600'
      }`}
    >
      <div className="w-12 h-12 rounded bg-zinc-700 flex items-center justify-center text-zinc-400">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>
      <div className="flex-1 text-left overflow-hidden">
        <p className="text-sm font-medium text-white truncate">{asset.name}</p>
        <p className="text-xs text-zinc-400">{formatFileSize(asset.fileSize)}</p>
      </div>
    </button>
  )

  const EmptyState = ({ type }: { type: string }) => (
    <div className="py-6 text-center">
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-zinc-800 flex items-center justify-center">
        <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <p className="text-sm text-zinc-400">No {type} yet</p>
      <p className="text-xs text-zinc-500 mt-1">Drag & drop files below</p>
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-700">
        <h2 className="text-sm font-semibold text-zinc-300 mb-3">Asset Library</h2>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets..."
            className="w-full pl-9 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Asset Lists */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 3D Scans Section */}
        <section>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            3D Scans
          </h3>
          {filteredScans.length > 0 ? (
            <div className="space-y-2">
              {filteredScans.map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          ) : (
            <EmptyState type="scans" />
          )}
        </section>

        {/* Environments Section */}
        <section>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            Environments
          </h3>
          {filteredEnvironments.length > 0 ? (
            <div className="space-y-2">
              {filteredEnvironments.map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          ) : (
            <EmptyState type="environments" />
          )}
        </section>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`m-4 p-4 border-2 border-dashed rounded-lg transition-colors ${
          isDragging
            ? 'border-accent bg-accent/10'
            : 'border-zinc-700 hover:border-zinc-600'
        }`}
      >
        <div className="text-center">
          <svg
            className={`w-8 h-8 mx-auto mb-2 ${isDragging ? 'text-accent' : 'text-zinc-500'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-xs text-zinc-400">
            Drop <span className="text-zinc-300">.glb, .gltf, .ply</span> files
          </p>
          <p className="text-xs text-zinc-500 mt-1">Max 100MB</p>
        </div>
      </div>
    </div>
  )
}
