import { useState } from 'react'
import { useProjectStore } from '../../stores/projectStore'
import type { Project, ProjectStage } from '../../types'

const stages: { id: ProjectStage; label: string; color: string }[] = [
  { id: 'inbox', label: 'Inbox', color: 'bg-blue-500' },
  { id: 'scanning', label: 'Scanning', color: 'bg-purple-500' },
  { id: 'generate', label: 'Generate', color: 'bg-yellow-500' },
  { id: 'composite', label: 'Composite', color: 'bg-orange-500' },
  { id: 'enhance', label: 'Enhance', color: 'bg-pink-500' },
  { id: 'delivered', label: 'Delivered', color: 'bg-green-500' },
]

export default function Pipeline() {
  const projects = useProjectStore((state) => state.projects)
  const moveProjectToStage = useProjectStore((state) => state.moveProjectToStage)
  const [draggedProject, setDraggedProject] = useState<Project | null>(null)
  const [dragOverStage, setDragOverStage] = useState<ProjectStage | null>(null)

  const getProjectsByStage = (stage: ProjectStage) =>
    projects.filter((p) => p.stage === stage)

  const handleDragStart = (project: Project) => {
    setDraggedProject(project)
  }

  const handleDragEnd = () => {
    setDraggedProject(null)
    setDragOverStage(null)
  }

  const handleDragOver = (e: React.DragEvent, stage: ProjectStage) => {
    e.preventDefault()
    setDragOverStage(stage)
  }

  const handleDrop = (stage: ProjectStage) => {
    if (draggedProject && draggedProject.stage !== stage) {
      moveProjectToStage(draggedProject.id, stage)
    }
    setDraggedProject(null)
    setDragOverStage(null)
  }

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Pipeline</h1>
        <p className="text-zinc-400 mt-1">Drag and drop projects between stages</p>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageProjects = getProjectsByStage(stage.id)
          const isOver = dragOverStage === stage.id

          return (
            <div
              key={stage.id}
              className="flex-shrink-0 w-72 flex flex-col"
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDrop={() => handleDrop(stage.id)}
              onDragLeave={() => setDragOverStage(null)}
            >
              {/* Column Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                <h3 className="text-sm font-semibold text-white">{stage.label}</h3>
                <span className="ml-auto px-2 py-0.5 bg-zinc-800 rounded-full text-xs text-zinc-400">
                  {stageProjects.length}
                </span>
              </div>

              {/* Column Content */}
              <div
                className={`flex-1 p-2 rounded-xl transition-colors ${
                  isOver
                    ? 'bg-accent/10 border-2 border-dashed border-accent'
                    : 'bg-zinc-800/30 border border-zinc-800'
                }`}
              >
                {stageProjects.length > 0 ? (
                  <div className="space-y-2">
                    {stageProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onDragStart={() => handleDragStart(project)}
                        onDragEnd={handleDragEnd}
                        isDragging={draggedProject?.id === project.id}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center min-h-[100px]">
                    <p className="text-xs text-zinc-500">No projects</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ProjectCard({
  project,
  onDragStart,
  onDragEnd,
  isDragging,
}: {
  project: Project
  onDragStart: () => void
  onDragEnd: () => void
  isDragging: boolean
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`p-3 bg-bg-card border border-zinc-700 rounded-lg cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'hover:border-zinc-600'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded bg-zinc-700 flex items-center justify-center text-sm font-medium text-white">
          {project.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{project.name}</p>
          <p className="text-xs text-zinc-400 truncate">{project.client}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className="px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-400 capitalize">
          {project.packageType}
        </span>
        <span className="px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-400">
          {project.productType}
        </span>
      </div>
    </div>
  )
}
