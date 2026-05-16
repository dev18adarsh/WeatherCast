import { CloudSun, Search, MapPin } from 'lucide-react'
import type { GeocodingResult } from '../types'

const POPULAR: { name: string; lat: number; lng: number; country: string }[] = [
  { name: 'New York', lat: 40.7128, lng: -74.006, country: 'United States' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan' },
  { name: 'London', lat: 51.5074, lng: -0.1278, country: 'United Kingdom' },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, country: 'France' },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708, country: 'UAE' },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia' },
]

interface Props {
  onCityClick?: (loc: GeocodingResult) => void
}

export default function EmptyState({ onCityClick }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-in-up">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-cyan-400/20 rounded-full blur-xl animate-float" />
        <div className="glass-strong rounded-full p-6 relative">
          <CloudSun className="w-14 h-14 text-blue-400" />
        </div>
      </div>
      <h3 className="text-2xl font-extrabold bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent mb-2">
        Welcome to WeatherCast 67
      </h3>
      <p className="text-sm text-slate-400 text-center max-w-md leading-relaxed">
        Search for a city above to get current weather conditions, 
        7-day forecast, and AI-powered insights.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
        {POPULAR.map((city) => (
          <button
            key={city.name}
            onClick={() => onCityClick?.({ id: 0, name: city.name, latitude: city.lat, longitude: city.lng, country: city.country, country_code: '', admin1: '' })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-slate-400 hover:bg-white/[0.08] hover:text-slate-300 hover:border-white/[0.12] transition-all duration-200 cursor-pointer"
          >
            <MapPin className="w-2.5 h-2.5 text-blue-400/50" />
            {city.name}
          </button>
        ))}
      </div>
    </div>
  )
}
