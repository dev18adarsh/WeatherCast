import { useState, useEffect } from 'react'

interface GeoState {
  lat: number | null
  lng: number | null
  error: string | null
  loading: boolean
  denied: boolean
}

const STORAGE_KEY = 'weatherGeoPermission'

export function useGeolocation(): GeoState & { request: () => void } {
  const [state, setState] = useState<GeoState>(() => ({
    lat: null,
    lng: null,
    error: null,
    loading: false,
    denied: (() => {
      try { return localStorage.getItem(STORAGE_KEY) === 'denied' } catch { return false }
    })(),
  }))

  useEffect(() => {
    const asked = (() => {
      try { return localStorage.getItem(STORAGE_KEY) !== null } catch { return false }
    })()
    if (!asked && 'geolocation' in navigator) {
      request()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function request() {
    if (!('geolocation' in navigator)) {
      setState((s) => ({ ...s, error: 'Geolocation not supported', denied: true }))
      return
    }

    setState((s) => ({ ...s, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          error: null,
          loading: false,
          denied: false,
        })
        try { localStorage.removeItem(STORAGE_KEY) } catch {}
      },
      (err) => {
        const denied = err.code === err.PERMISSION_DENIED
        setState({
          lat: null,
          lng: null,
          error: denied ? 'Location access denied' : 'Could not get location',
          loading: false,
          denied,
        })
        if (denied) {
          try { localStorage.setItem(STORAGE_KEY, 'denied') } catch {}
        }
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    )
  }

  return { ...state, request }
}
