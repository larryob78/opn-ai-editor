import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Settings } from '../types'

interface SettingsState extends Settings {
  // Actions
  setMarbleApiKey: (key: string) => void
  setAkoolApiKey: (key: string) => void
  setEodTime: (time: string) => void
  setTheme: (theme: 'dark' | 'light') => void
  getEodDate: () => Date
  getTimeUntilEod: () => { hours: number; minutes: number; isUrgent: boolean }
}

const DEFAULT_EOD_TIME = '18:00'

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      marbleApiKey: '',
      akoolApiKey: '',
      eodTime: DEFAULT_EOD_TIME,
      theme: 'dark',

      setMarbleApiKey: (key) => {
        set({ marbleApiKey: key })
      },

      setAkoolApiKey: (key) => {
        set({ akoolApiKey: key })
      },

      setEodTime: (time) => {
        set({ eodTime: time })
      },

      setTheme: (theme) => {
        set({ theme })
      },

      getEodDate: () => {
        const [hours, minutes] = get().eodTime.split(':').map(Number)
        const eod = new Date()
        eod.setHours(hours, minutes, 0, 0)
        return eod
      },

      getTimeUntilEod: () => {
        const now = new Date()
        const eod = get().getEodDate()

        // If EOD has passed, return zeros
        if (now >= eod) {
          return { hours: 0, minutes: 0, isUrgent: true }
        }

        const diffMs = eod.getTime() - now.getTime()
        const diffMinutes = Math.floor(diffMs / (1000 * 60))
        const hours = Math.floor(diffMinutes / 60)
        const minutes = diffMinutes % 60

        return {
          hours,
          minutes,
          isUrgent: hours < 1,
        }
      },
    }),
    {
      name: 'stagekit-settings',
    }
  )
)
