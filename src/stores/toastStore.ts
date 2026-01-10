import { create } from 'zustand'
import type { Toast } from '../types'

interface ToastState {
  toasts: Toast[]

  // Actions
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (toastData) => {
    const id = crypto.randomUUID()
    const toast: Toast = {
      ...toastData,
      id,
      duration: toastData.duration ?? 3000,
    }

    set((state) => ({
      toasts: [...state.toasts, toast],
    }))

    // Auto-remove after duration
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, toast.duration)
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },

  clearToasts: () => {
    set({ toasts: [] })
  },
}))

// Convenience hook for triggering toasts
export const useToast = () => {
  const addToast = useToastStore((state) => state.addToast)

  return {
    success: (message: string) => addToast({ message, type: 'success' }),
    error: (message: string) => addToast({ message, type: 'error' }),
    info: (message: string) => addToast({ message, type: 'info' }),
  }
}
