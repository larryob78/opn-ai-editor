import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Asset, Transform, HarmonizeSettings } from '../types'

interface AssetState {
  assets: Asset[]
  selectedAsset: Asset | null
  harmonizeSettings: HarmonizeSettings
  transformMode: 'translate' | 'rotate' | 'scale'

  // Actions
  addAsset: (asset: Omit<Asset, 'id' | 'createdAt'>) => void
  updateAsset: (id: string, updates: Partial<Asset>) => void
  deleteAsset: (id: string) => void
  selectAsset: (asset: Asset | null) => void
  updateTransform: (id: string, transform: Partial<Transform>) => void
  setTransformMode: (mode: 'translate' | 'rotate' | 'scale') => void
  setHarmonizeSettings: (settings: Partial<HarmonizeSettings>) => void
  getAssetsByType: (type: Asset['type']) => Asset[]
  clearAssets: () => void
}

const defaultHarmonizeSettings: HarmonizeSettings = {
  light: 50,
  shadow: 50,
  reflection: 50,
  edge: 50,
  color: 50,
}

export const useAssetStore = create<AssetState>()(
  persist(
    (set, get) => ({
      assets: [],
      selectedAsset: null,
      harmonizeSettings: defaultHarmonizeSettings,
      transformMode: 'translate',

      addAsset: (assetData) => {
        const newAsset: Asset = {
          ...assetData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        }
        set((state) => ({
          assets: [...state.assets, newAsset],
        }))
      },

      updateAsset: (id, updates) => {
        set((state) => ({
          assets: state.assets.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
          selectedAsset:
            state.selectedAsset?.id === id
              ? { ...state.selectedAsset, ...updates }
              : state.selectedAsset,
        }))
      },

      deleteAsset: (id) => {
        set((state) => ({
          assets: state.assets.filter((a) => a.id !== id),
          selectedAsset:
            state.selectedAsset?.id === id ? null : state.selectedAsset,
        }))
      },

      selectAsset: (asset) => {
        set({ selectedAsset: asset })
      },

      updateTransform: (id, transformUpdates) => {
        set((state) => ({
          assets: state.assets.map((a) =>
            a.id === id
              ? { ...a, transform: { ...a.transform, ...transformUpdates } }
              : a
          ),
          selectedAsset:
            state.selectedAsset?.id === id
              ? {
                  ...state.selectedAsset,
                  transform: { ...state.selectedAsset.transform, ...transformUpdates },
                }
              : state.selectedAsset,
        }))
      },

      setTransformMode: (mode) => {
        set({ transformMode: mode })
      },

      setHarmonizeSettings: (settings) => {
        set((state) => ({
          harmonizeSettings: { ...state.harmonizeSettings, ...settings },
        }))
      },

      getAssetsByType: (type) => {
        return get().assets.filter((a) => a.type === type)
      },

      clearAssets: () => {
        set({ assets: [], selectedAsset: null })
      },
    }),
    {
      name: 'stagekit-assets',
      partialize: (state) => ({
        assets: state.assets,
        harmonizeSettings: state.harmonizeSettings,
      }),
    }
  )
)
