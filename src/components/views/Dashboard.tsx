import { useProjectStore } from '../../stores/projectStore'
import type { ProjectStage } from '../../types'

const stageLabels: Record<ProjectStage, string> = {
  inbox: 'Inbox',
  scanning: 'Scanning',
  generate: 'Generate',
  composite: 'Composite',
  enhance: 'Enhance',
  delivered: 'Delivered',
}

export default function Dashboard() {
  const projects = useProjectStore((state) => state.projects)

  // Calculate stats
  const activeProjects = projects.filter((p) => p.stage !== 'delivered').length
  const deliveredThisWeek = projects.filter((p) => {
    if (p.stage !== 'delivered') return false
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return new Date(p.updatedAt) > weekAgo
  }).length

  // Mock revenue data
  const totalRevenue = projects.reduce((sum, p) => {
    const prices: Record<string, number> = {
      basic: 299,
      standard: 599,
      premium: 999,
      enterprise: 2499,
    }
    return sum + (prices[p.packageType] || 0)
  }, 0)

  const avgMargin = 68 // Mock average margin percentage

  // Get today's deliverables
  const todaysDeliverables = projects.filter((p) => {
    return p.stage === 'enhance' || p.stage === 'composite'
  })

  // Get projects by stage for mini kanban
  const getProjectsByStage = (stage: ProjectStage) =>
    projects.filter((p) => p.stage === stage)

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-400 mt-1">Overview of your production pipeline</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Active Projects"
            value={activeProjects.toString()}
            icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            trend={`${projects.length} total`}
          />
          <StatCard
            label="Delivered This Week"
            value={deliveredThisWeek.toString()}
            icon="M5 13l4 4L19 7"
            trend="On track"
            trendUp
          />
          <StatCard
            label="Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            trend="This month"
          />
          <StatCard
            label="Avg Margin"
            value={`${avgMargin}%`}
            icon="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            trend="+2% from last month"
            trendUp
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Mini Kanban */}
          <div className="col-span-2 bg-bg-card border border-zinc-800 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-zinc-300 mb-4">Pipeline Overview</h2>
            <div className="grid grid-cols-6 gap-2">
              {(Object.keys(stageLabels) as ProjectStage[]).map((stage) => {
                const stageProjects = getProjectsByStage(stage)
                return (
                  <div key={stage} className="text-center">
                    <div className="text-xs text-zinc-500 mb-2">{stageLabels[stage]}</div>
                    <div className="h-20 bg-zinc-800/50 rounded-lg p-2 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {stageProjects.length}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Today's Deliverables */}
          <div className="bg-bg-card border border-zinc-800 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-zinc-300 mb-4">Today's Deliverables</h2>
            {todaysDeliverables.length > 0 ? (
              <div className="space-y-2">
                {todaysDeliverables.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded bg-zinc-700 flex items-center justify-center text-xs font-medium">
                      {project.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{project.name}</p>
                      <p className="text-xs text-zinc-500">{project.client}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-zinc-500">No deliverables due today</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-bg-card border border-zinc-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4">Recent Projects</h2>
          {projects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-zinc-500 border-b border-zinc-700">
                    <th className="pb-3 font-medium">Project</th>
                    <th className="pb-3 font-medium">Client</th>
                    <th className="pb-3 font-medium">Stage</th>
                    <th className="pb-3 font-medium">Package</th>
                    <th className="pb-3 font-medium">Updated</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {projects.slice(0, 5).map((project) => (
                    <tr key={project.id} className="border-b border-zinc-800">
                      <td className="py-3 text-white">{project.name}</td>
                      <td className="py-3 text-zinc-400">{project.client}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-300">
                          {stageLabels[project.stage]}
                        </span>
                      </td>
                      <td className="py-3 text-zinc-400 capitalize">{project.packageType}</td>
                      <td className="py-3 text-zinc-500">
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-zinc-500">No projects yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  trend,
  trendUp,
}: {
  label: string
  value: string
  icon: string
  trend?: string
  trendUp?: boolean
}) {
  return (
    <div className="bg-bg-card border border-zinc-800 rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-zinc-500">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
          <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
          </svg>
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      {trend && (
        <div className={`text-xs ${trendUp ? 'text-green-500' : 'text-zinc-500'}`}>
          {trend}
        </div>
      )}
    </div>
  )
}
