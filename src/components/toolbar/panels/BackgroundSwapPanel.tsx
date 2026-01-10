import { useState } from 'react'
import { useToast } from '../../../stores/toastStore'
import Spinner from '../../ui/Spinner'

interface BackgroundSwapPanelProps {
  onClose: () => void
}

export default function BackgroundSwapPanel({ onClose }: BackgroundSwapPanelProps) {
  const [prompt, setPrompt] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const toast = useToast()

  const handleSwap = async () => {
    if (!prompt.trim() && !imageFile) {
      toast.error('Please enter a prompt or upload an image')
      return
    }

    setIsProcessing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // In a real implementation, this would call the Akool API
    setResult('/placeholder-result.jpg')
    toast.success('Background swapped successfully!')
    setIsProcessing(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPrompt('')
    }
  }

  const handleAccept = () => {
    toast.success('Result applied!')
    onClose()
  }

  const handleReject = () => {
    setResult(null)
  }

  if (result) {
    return (
      <div className="space-y-4">
        <div className="aspect-video bg-zinc-800 rounded-lg overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-zinc-500">
            [Result Preview]
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReject}
            className="flex-1 py-2 border border-zinc-600 text-zinc-300 rounded-lg font-medium hover:bg-zinc-800 transition-colors"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-2">
          Background Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value)
            setImageFile(null)
          }}
          placeholder="Describe the new background..."
          rows={2}
          disabled={isProcessing}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-accent resize-none disabled:opacity-50"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-zinc-700" />
        <span className="text-xs text-zinc-500">or</span>
        <div className="flex-1 h-px bg-zinc-700" />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-2">
          Upload Background Image
        </label>
        <label className={`block w-full p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          imageFile ? 'border-accent bg-accent/10' : 'border-zinc-700 hover:border-zinc-600'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isProcessing}
          />
          {imageFile ? (
            <span className="text-sm text-accent">{imageFile.name}</span>
          ) : (
            <span className="text-sm text-zinc-400">Click to upload image</span>
          )}
        </label>
      </div>

      <button
        onClick={handleSwap}
        disabled={isProcessing || (!prompt.trim() && !imageFile)}
        className="w-full py-3 bg-accent hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Spinner size="sm" />
            Processing...
          </>
        ) : (
          'Swap Background'
        )}
      </button>
    </div>
  )
}
