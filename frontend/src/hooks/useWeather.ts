import { useState, useCallback } from 'react'
import type { WeatherData, WeatherResponse } from '../types'

export function useWeather() {
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = useCallback(async (lat: number, lng: number, locationName: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `HTTP ${res.status}`)
      }
      const json: WeatherResponse = await res.json()
      setData({ ...json, locationName })
    } catch (e: any) {
      setError(e.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, fetchWeather }
}
