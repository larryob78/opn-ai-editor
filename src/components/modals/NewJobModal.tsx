import { useState } from 'react'
import { PACKAGES } from '../../types'

interface NewJobModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    client: string
    productType: string
    package: string
    notes: string
  }) => void
}

export default function NewJobModal({ isOpen, onClose, onSubmit }: NewJobModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    productType: '',
    package: 'standard',
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Project name is required'
    if (!formData.client.trim()) newErrors.client = 'Client name is required'
    if (!formData.productType.trim()) newErrors.productType = 'Product type is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
      setFormData({
        name: '',
        client: '',
        productType: '',
        package: 'standard',
        notes: '',
      })
      setErrors({})
    }
  }

  const selectedPackage = PACKAGES.find((p) => p.id === formData.package)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-bg-card border border-zinc-700 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700">
          <h2 className="text-lg font-semibold">New Project Brief</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent ${
                errors.name ? 'border-red-500' : 'border-zinc-700'
              }`}
              placeholder="e.g., Nike Air Max Hero Shot"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Client */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">
              Client *
            </label>
            <input
              type="text"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent ${
                errors.client ? 'border-red-500' : 'border-zinc-700'
              }`}
              placeholder="e.g., Nike Inc."
            />
            {errors.client && <p className="mt-1 text-xs text-red-500">{errors.client}</p>}
          </div>

          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">
              Product Type *
            </label>
            <input
              type="text"
              value={formData.productType}
              onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
              className={`w-full px-3 py-2 bg-zinc-800 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent ${
                errors.productType ? 'border-red-500' : 'border-zinc-700'
              }`}
              placeholder="e.g., Footwear, Electronics, Cosmetics"
            />
            {errors.productType && <p className="mt-1 text-xs text-red-500">{errors.productType}</p>}
          </div>

          {/* Package Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Package
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, package: pkg.id })}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    formData.package === pkg.id
                      ? 'border-accent bg-accent/10'
                      : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{pkg.name}</span>
                    <span className="text-accent font-semibold">${pkg.price}</span>
                  </div>
                  <span className="text-xs text-zinc-400">{pkg.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              placeholder="Any special requirements or notes..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-zinc-700 text-zinc-300 rounded-lg font-medium hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-accent hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
            >
              Create Project • ${selectedPackage?.price}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
