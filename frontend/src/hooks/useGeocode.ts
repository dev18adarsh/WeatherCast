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
    setLoading(true)
    setError(null)
    fetch(`/api/geocode?q=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((data) => {
        setResults(data.results ?? [])
      })
      .catch((e) => {
        setError(e.message)
        setResults([])
      })
      .finally(() => setLoading(false))
  }, [debouncedQuery])

  return { results, loading, error }
}
