import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project, ProjectStage } from '../types'

interface ProjectState {
  projects: Project[]
  currentProject: Project | null

  // Actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  setCurrentProject: (project: Project | null) => void
  moveProjectToStage: (id: string, stage: ProjectStage) => void
  getProjectsByStage: (stage: ProjectStage) => Project[]
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,

      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({
          projects: [...state.projects, newProject],
        }))
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? { ...p, ...updates, updatedAt: new Date() }
              : p
          ),
          currentProject:
            state.currentProject?.id === id
              ? { ...state.currentProject, ...updates, updatedAt: new Date() }
              : state.currentProject,
        }))
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProject:
            state.currentProject?.id === id ? null : state.currentProject,
        }))
      },

      setCurrentProject: (project) => {
        set({ currentProject: project })
      },

      moveProjectToStage: (id, stage) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? { ...p, stage, updatedAt: new Date() }
              : p
          ),
        }))
      },

      getProjectsByStage: (stage) => {
        return get().projects.filter((p) => p.stage === stage)
      },
    }),
    {
      name: 'stagekit-projects',
      partialize: (state) => ({
        projects: state.projects,
      }),
    }
  )
)
