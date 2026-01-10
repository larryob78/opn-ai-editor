import { useState, useCallback } from 'react'
import { useAssetStore } from '../../stores/assetStore'
import type { Asset } from '../../types'

export default function Assets() {
  const assets = useAssetStore((state) => state.assets)
  const addAsset = useAssetStore((state) => state.addAsset)
  const deleteAsset = useAssetStore((state) => state.deleteAsset)
  const [filter, setFilter] = useState<'all' | 'scan' | 'model' | 'environment'>('all')
  const [isDragging, setIsDragging] = useState(false)

  const filteredAssets = assets.filter((a) => {
    if (filter === 'all') return true
    return a.type === filter
  })

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
        if (!['glb', 'gltf', 'ply', 'jpg', 'jpeg', 'png', 'hdr'].includes(ext || '')) {
          alert(`File ${file.name} is not a supported format`)
          return
        }

        const url = URL.createObjectURL(file)
        const type =
          ext === 'ply'
            ? 'scan'
            : ['hdr', 'jpg', 'jpeg', 'png'].includes(ext || '')
            ? 'environment'
            : 'model'

        addAsset({
          name: file.name,
          type,
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Assets</h1>
          <p className="text-zinc-400 mt-1">Manage your 3D models and environments</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 p-1 bg-zinc-800 rounded-lg">
          {(['all', 'scan', 'model', 'environment'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-accent text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : f}s
            </button>
          ))}
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`mb-6 p-8 border-2 border-dashed rounded-xl transition-colors ${
          isDragging
            ? 'border-accent bg-accent/10'
            : 'border-zinc-700 hover:border-zinc-600'
        }`}
      >
        <div className="text-center">
          <svg
            className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-accent' : 'text-zinc-500'}`}
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
          <p className="text-zinc-300 font-medium">Drop files to upload</p>
          <p className="text-sm text-zinc-500 mt-1">
            Supports .glb, .gltf, .ply, .hdr, .jpg, .png (max 100MB)
          </p>
        </div>
      </div>

      {/* Asset Grid */}
      {filteredAssets.length > 0 ? (
        <div className="flex-1 grid grid-cols-4 gap-4 overflow-y-auto">
          {filteredAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onDelete={() => deleteAsset(asset.id)}
              formatFileSize={formatFileSize}
              formatDate={formatDate}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <p className="text-lg font-medium text-zinc-300">No assets yet</p>
            <p className="text-sm text-zinc-500 mt-1">
              Upload your first 3D model or environment
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function AssetCard({
  asset,
  onDelete,
  formatFileSize,
  formatDate,
}: {
  asset: Asset
  onDelete: () => void
  formatFileSize: (bytes: number) => string
  formatDate: (date: Date) => string
}) {
  const typeColors = {
    scan: 'bg-purple-500/20 text-purple-400',
    model: 'bg-blue-500/20 text-blue-400',
    environment: 'bg-green-500/20 text-green-400',
  }

  return (
    <div className="bg-bg-card border border-zinc-700 rounded-xl overflow-hidden hover:border-zinc-600 transition-colors group">
      {/* Thumbnail */}
      <div className="aspect-square bg-zinc-800 relative">
        <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Type Badge */}
        <span
          className={`absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs font-medium capitalize ${typeColors[asset.type]}`}
        >
          {asset.type}
        </span>
      </div>
      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-medium text-white truncate">{asset.name}</p>
        <div className="flex items-center justify-between mt-1 text-xs text-zinc-500">
          <span>{formatFileSize(asset.fileSize)}</span>
          <span>{formatDate(asset.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}
