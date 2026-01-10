import { useEffect, useState } from 'react'
import { useSettingsStore } from '../stores/settingsStore'
import type { ViewType } from '../App'

interface HeaderProps {
  activeView: ViewType
  onViewChange: (view: ViewType) => void
  onNewBrief: () => void
}

const navItems: { id: ViewType; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'create', label: 'Create' },
  { id: 'assets', label: 'Assets' },
  { id: 'settings', label: 'Settings' },
]

export default function Header({ activeView, onViewChange, onNewBrief }: HeaderProps) {
  const getTimeUntilEod = useSettingsStore((state) => state.getTimeUntilEod)
  const [eodTime, setEodTime] = useState(getTimeUntilEod())

  useEffect(() => {
    const interval = setInterval(() => {
      setEodTime(getTimeUntilEod())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [getTimeUntilEod])

  const formatTime = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  return (
    <header className="h-16 bg-bg-dark/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center font-bold text-white text-sm shadow-glow">
          SK
        </div>
        <span className="font-semibold text-lg tracking-tight">STAGEKIT PRO</span>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeView === item.id
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* EOD Timer & New Brief Button */}
      <div className="flex items-center gap-4">
        {/* EOD Timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <span className="text-xs text-zinc-400">EOD</span>
          <span
            className={`font-mono text-sm font-semibold ${
              eodTime.isUrgent ? 'text-red-500' : 'text-white'
            }`}
          >
            {formatTime(eodTime.hours, eodTime.minutes)}
          </span>
          {eodTime.isUrgent && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </div>

        {/* New Brief Button */}
        <button
          onClick={onNewBrief}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition-all shadow-glow hover:shadow-glow-lg"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Brief
        </button>
      </div>
    </header>
  )
}
