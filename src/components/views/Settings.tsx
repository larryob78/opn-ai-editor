import { useState } from 'react'
import { useSettingsStore } from '../../stores/settingsStore'
import { useToast } from '../../stores/toastStore'

export default function Settings() {
  const settings = useSettingsStore()
  const toast = useToast()

  const [marbleKey, setMarbleKey] = useState(settings.marbleApiKey)
  const [akoolKey, setAkoolKey] = useState(settings.akoolApiKey)
  const [eodTime, setEodTime] = useState(settings.eodTime)
  const [showMarbleKey, setShowMarbleKey] = useState(false)
  const [showAkoolKey, setShowAkoolKey] = useState(false)

  const handleSave = () => {
    settings.setMarbleApiKey(marbleKey)
    settings.setAkoolApiKey(akoolKey)
    settings.setEodTime(eodTime)
    toast.success('Settings saved successfully!')
  }

  const maskApiKey = (key: string) => {
    if (!key) return ''
    if (key.length <= 8) return '••••••••'
    return key.slice(0, 4) + '••••••••' + key.slice(-4)
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-zinc-400 mt-1">Configure your STAGEKIT PRO preferences</p>
        </div>

        {/* API Keys Section */}
        <section className="bg-bg-card border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">API Keys</h2>
          <p className="text-sm text-zinc-400 mb-6">
            Configure your API keys for external services. Keys are stored locally and never sent to our servers.
          </p>

          <div className="space-y-6">
            {/* Marble API Key */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                World Labs Marble API Key
              </label>
              <div className="relative">
                <input
                  type={showMarbleKey ? 'text' : 'password'}
                  value={showMarbleKey ? marbleKey : marbleKey ? maskApiKey(marbleKey) : ''}
                  onChange={(e) => {
                    if (showMarbleKey) {
                      setMarbleKey(e.target.value)
                    }
                  }}
                  onFocus={() => setShowMarbleKey(true)}
                  placeholder="Enter your Marble API key..."
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-accent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowMarbleKey(!showMarbleKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showMarbleKey ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                Get your API key from{' '}
                <a href="https://platform.worldlabs.ai" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  platform.worldlabs.ai
                </a>
              </p>
            </div>

            {/* Akool API Key */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Akool API Key
              </label>
              <div className="relative">
                <input
                  type={showAkoolKey ? 'text' : 'password'}
                  value={showAkoolKey ? akoolKey : akoolKey ? maskApiKey(akoolKey) : ''}
                  onChange={(e) => {
                    if (showAkoolKey) {
                      setAkoolKey(e.target.value)
                    }
                  }}
                  onFocus={() => setShowAkoolKey(true)}
                  placeholder="Enter your Akool API key..."
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-accent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowAkoolKey(!showAkoolKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showAkoolKey ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                Get your API key from{' '}
                <a href="https://akool.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  akool.com
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="bg-bg-card border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Preferences</h2>

          <div className="space-y-6">
            {/* EOD Time */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                End of Day Time
              </label>
              <input
                type="time"
                value={eodTime}
                onChange={(e) => setEodTime(e.target.value)}
                className="w-48 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-accent"
              />
              <p className="text-xs text-zinc-500 mt-2">
                The countdown timer in the header will count down to this time
              </p>
            </div>

            {/* Theme Toggle */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Theme
              </label>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-accent text-white rounded-lg font-medium"
                  disabled
                >
                  Dark
                </button>
                <button
                  className="px-4 py-2 bg-zinc-800 text-zinc-400 rounded-lg font-medium cursor-not-allowed"
                  disabled
                >
                  Light (Coming Soon)
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-3 bg-accent hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
        >
          Save Settings
        </button>

        {/* Version Info */}
        <div className="text-center text-sm text-zinc-500">
          <p>STAGEKIT PRO v1.0.0</p>
          <p className="mt-1">Built with React, Three.js, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  )
}
