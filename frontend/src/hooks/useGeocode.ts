import { useState, useEffect } from 'react'
import { useDebounce } from './useDebounce'
import type { GeocodingResult } from '../types'

export function useGeocode(query: string) {
  const debouncedQuery = useDebounce(query, 400)
  const [results, setResults] = useState<GeocodingResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([])
      return
    }
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    fetch(`/api/geocode?q=${encodeURIComponent(debouncedQuery)}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((data) => {
        setResults(data.results ?? [])
      })
      .catch((e) => {
        if (e.name === 'AbortError') return
        setError(e.message)
        setResults([])
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [debouncedQuery])

  return { results, loading, error }
}
