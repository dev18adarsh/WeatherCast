import { useState, useCallback } from 'react'
import type { GeocodingResult } from '../types'

const STORAGE_KEY = 'weatherFavorites'
const MAX_FAVORITES = 8

interface Favorite extends GeocodingResult {
  addedAt: number
}

function load(): Favorite[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function save(favs: Favorite[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(favs)) } catch {}
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>(load)

  const add = useCallback((loc: GeocodingResult) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === loc.id)) return prev
      if (prev.length >= MAX_FAVORITES) return prev
      const next = [...prev, { ...loc, addedAt: Date.now() }]
      save(next)
      return next
    })
  }, [])

  const remove = useCallback((id: number) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.id !== id)
      save(next)
      return next
    })
  }, [])

  const isFavorite = useCallback((id: number) => {
    return favorites.some((f) => f.id === id)
  }, [favorites])

  return { favorites, add, remove, isFavorite }
}
