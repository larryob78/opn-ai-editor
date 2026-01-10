import { useAssetStore } from '../../stores/assetStore'

export default function PropertiesPanel() {
  const selectedAsset = useAssetStore((state) => state.selectedAsset)
  const updateTransform = useAssetStore((state) => state.updateTransform)
  const harmonizeSettings = useAssetStore((state) => state.harmonizeSettings)
  const setHarmonizeSettings = useAssetStore((state) => state.setHarmonizeSettings)

  if (!selectedAsset) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <p className="text-sm text-zinc-400">Select an asset to edit properties</p>
        </div>
      </div>
    )
  }

  const handlePositionChange = (axis: 0 | 1 | 2, value: number) => {
    const newPosition = [...selectedAsset.transform.position] as [number, number, number]
    newPosition[axis] = value
    updateTransform(selectedAsset.id, { position: newPosition })
  }

  const handleRotationChange = (axis: 0 | 1 | 2, value: number) => {
    const newRotation = [...selectedAsset.transform.rotation] as [number, number, number]
    newRotation[axis] = value
    updateTransform(selectedAsset.id, { rotation: newRotation })
  }

  const handleScaleChange = (value: number) => {
    updateTransform(selectedAsset.id, { scale: value })
  }

  const NumberInput = ({
    label,
    value,
    onChange,
    min = -100,
    max = 100,
    step = 0.1,
  }: {
    label: string
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
    step?: number
  }) => (
    <div className="flex items-center gap-2">
      <span className="w-4 text-xs font-medium text-zinc-500">{label}</span>
      <input
        type="number"
        value={value.toFixed(2)}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        className="flex-1 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm text-white text-center focus:outline-none focus:border-accent"
      />
    </div>
  )

  const Slider = ({
    label,
    value,
    onChange,
    min = 0,
    max = 100,
  }: {
    label: string
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400">{label}</span>
        <span className="text-xs text-white">{Math.round(value)}%</span>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        className="w-full"
      />
    </div>
  )

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-zinc-700">
        <h2 className="text-sm font-semibold text-zinc-300 mb-1">Properties</h2>
        <p className="text-xs text-zinc-500 truncate">{selectedAsset.name}</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Transform Section */}
        <section>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Transform
          </h3>

          <div className="space-y-4">
            {/* Position */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">Position</label>
              <div className="grid grid-cols-3 gap-2">
                <NumberInput
                  label="X"
                  value={selectedAsset.transform.position[0]}
                  onChange={(v) => handlePositionChange(0, v)}
                />
                <NumberInput
                  label="Y"
                  value={selectedAsset.transform.position[1]}
                  onChange={(v) => handlePositionChange(1, v)}
                />
                <NumberInput
                  label="Z"
                  value={selectedAsset.transform.position[2]}
                  onChange={(v) => handlePositionChange(2, v)}
                />
              </div>
            </div>

            {/* Rotation */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">Rotation</label>
              <div className="grid grid-cols-3 gap-2">
                <NumberInput
                  label="X"
                  value={selectedAsset.transform.rotation[0]}
                  onChange={(v) => handleRotationChange(0, v)}
                  min={-360}
                  max={360}
                />
                <NumberInput
                  label="Y"
                  value={selectedAsset.transform.rotation[1]}
                  onChange={(v) => handleRotationChange(1, v)}
                  min={-360}
                  max={360}
                />
                <NumberInput
                  label="Z"
                  value={selectedAsset.transform.rotation[2]}
                  onChange={(v) => handleRotationChange(2, v)}
                  min={-360}
                  max={360}
                />
              </div>
            </div>

            {/* Scale */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-zinc-400">Scale</label>
                <span className="text-xs text-white">
                  {Math.round(selectedAsset.transform.scale * 100)}%
                </span>
              </div>
              <input
                type="range"
                value={selectedAsset.transform.scale * 100}
                onChange={(e) => handleScaleChange(Number(e.target.value) / 100)}
                min={10}
                max={200}
                className="w-full"
              />
            </div>
          </div>
        </section>

        {/* Harmonize Section */}
        <section>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Harmonize
          </h3>

          <div className="space-y-4">
            <Slider
              label="Light Matching"
              value={harmonizeSettings.light}
              onChange={(v) => setHarmonizeSettings({ light: v })}
            />
            <Slider
              label="Shadow Intensity"
              value={harmonizeSettings.shadow}
              onChange={(v) => setHarmonizeSettings({ shadow: v })}
            />
            <Slider
              label="Reflection Amount"
              value={harmonizeSettings.reflection}
              onChange={(v) => setHarmonizeSettings({ reflection: v })}
            />
            <Slider
              label="Edge Softness"
              value={harmonizeSettings.edge}
              onChange={(v) => setHarmonizeSettings({ edge: v })}
            />
            <Slider
              label="Color Matching"
              value={harmonizeSettings.color}
              onChange={(v) => setHarmonizeSettings({ color: v })}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
