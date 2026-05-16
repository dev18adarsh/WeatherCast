import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type Unit = 'metric' | 'imperial'

interface UnitContextValue {
  unit: Unit
  toggle: () => void
  formatTemp: (celsius: number) => string
  formatSpeed: (kmh: number) => string
  formatVisibility: (meters: number) => string
  formatPrecip: (mm: number) => string
}

const STORAGE_KEY = 'weatherUnit'

const UnitContext = createContext<UnitContextValue | null>(null)

function celsiusToFahrenheit(c: number): number {
  return Math.round(c * 9 / 5 + 32)
}

function kmhToMph(kmh: number): number {
  return Math.round(kmh * 0.621371)
}

function metersToMiles(m: number): number {
  return m / 1609.344
}

function mmToInches(mm: number): number {
  return mm / 25.4
}

export function UnitProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<Unit>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'metric' || stored === 'imperial') return stored
    } catch {}
    return 'metric'
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, unit) } catch {}
  }, [unit])

  function toggle() {
    setUnit((u) => (u === 'metric' ? 'imperial' : 'metric'))
  }

  function formatTemp(celsius: number): string {
    if (unit === 'imperial') return `${celsiusToFahrenheit(celsius)}°F`
    return `${Math.round(celsius)}°C`
  }

  function formatSpeed(kmh: number): string {
    if (unit === 'imperial') return `${kmhToMph(kmh)} mph`
    return `${Math.round(kmh)} km/h`
  }

  function formatVisibility(meters: number): string {
    if (unit === 'imperial') {
      const miles = metersToMiles(meters)
      return miles >= 1 ? `${miles.toFixed(1)} mi` : `${Math.round(meters * 3.28084)} ft`
    }
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`
  }

  function formatPrecip(mm: number): string {
    if (unit === 'imperial') return `${mmToInches(mm).toFixed(2)} in`
    return `${mm.toFixed(1)} mm`
  }

  return (
    <UnitContext.Provider value={{ unit, toggle, formatTemp, formatSpeed, formatVisibility, formatPrecip }}>
      {children}
    </UnitContext.Provider>
  )
}

export function useUnit(): UnitContextValue {
  const ctx = useContext(UnitContext)
  if (!ctx) throw new Error('useUnit must be used within UnitProvider')
  return ctx
}
