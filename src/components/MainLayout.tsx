import { useState, type ReactNode } from 'react'

interface MainLayoutProps {
  leftPanel?: ReactNode
  centerPanel: ReactNode
  rightPanel?: ReactNode
  bottomPanel?: ReactNode
}

export default function MainLayout({
  leftPanel,
  centerPanel,
  rightPanel,
  bottomPanel,
}: MainLayoutProps) {
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-bg-dark">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        {leftPanel && (
          <div
            className={`relative flex-shrink-0 transition-all duration-300 ${
              leftCollapsed ? 'w-0' : 'w-[280px]'
            }`}
          >
            <div
              className={`absolute inset-0 bg-bg-card border-r border-zinc-800 overflow-hidden ${
                leftCollapsed ? 'invisible' : 'visible'
              }`}
            >
              <div className="h-full overflow-y-auto">{leftPanel}</div>
            </div>
            {/* Collapse Toggle */}
            <button
              onClick={() => setLeftCollapsed(!leftCollapsed)}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-12 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-r-lg flex items-center justify-center transition-colors"
            >
              <svg
                className={`w-4 h-4 text-zinc-400 transition-transform ${
                  leftCollapsed ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Center Panel */}
        <div className="flex-1 relative bg-bg-dark bg-grid-pattern bg-grid overflow-hidden">
          {centerPanel}
        </div>

        {/* Right Panel */}
        {rightPanel && (
          <div
            className={`relative flex-shrink-0 transition-all duration-300 ${
              rightCollapsed ? 'w-0' : 'w-[300px]'
            }`}
          >
            <div
              className={`absolute inset-0 bg-bg-card border-l border-zinc-800 overflow-hidden ${
                rightCollapsed ? 'invisible' : 'visible'
              }`}
            >
              <div className="h-full overflow-y-auto">{rightPanel}</div>
            </div>
            {/* Collapse Toggle */}
            <button
              onClick={() => setRightCollapsed(!rightCollapsed)}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-6 h-12 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-l-lg flex items-center justify-center transition-colors"
            >
              <svg
                className={`w-4 h-4 text-zinc-400 transition-transform ${
                  rightCollapsed ? '' : 'rotate-180'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Panel */}
      {bottomPanel && (
        <div className="flex-shrink-0 bg-bg-card border-t border-zinc-800">
          {bottomPanel}
        </div>
      )}
    </div>
  )
}
