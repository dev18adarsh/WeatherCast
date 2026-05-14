import { useState } from 'react'
import { Cloud } from 'lucide-react'
import SearchBar from './components/SearchBar'
import CurrentWeatherCard from './components/CurrentWeather'
import ForecastList from './components/ForecastList'
import LoadingSkeleton from './components/LoadingSkeleton'
import ErrorAlert from './components/ErrorAlert'
import EmptyState from './components/EmptyState'
import { useWeather } from './hooks/useWeather'
import WeatherBackground from './components/WeatherBackground'
import type { GeocodingResult } from './types'

export default function App() {
  const { data, loading, error, fetchWeather } = useWeather()
  const [selectedLoc, setSelectedLoc] = useState<GeocodingResult | null>(null)

  function handleSelect(loc: GeocodingResult) {
    setSelectedLoc(loc)
    fetchWeather(loc.latitude, loc.longitude, `${loc.name}, ${loc.country}`)
  }

  return (
    <div className="min-h-screen bg-slate-900/50 relative">
      {data && <WeatherBackground weatherCode={data.current.weather_code} />}
      <header className="border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-2">
          <Cloud className="w-6 h-6 text-blue-400" />
          <h1 className="text-lg font-semibold">Kimi's WeatherInfo (Made by Adarsh)</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <SearchBar onSelect={handleSelect} />

        {error && <ErrorAlert message={error} onDismiss={() => {}} />}

        {loading && <LoadingSkeleton />}

        {!loading && !error && !data && <EmptyState />}

        {!loading && data && (
          <>
            <CurrentWeatherCard data={data.current} locationName={data.locationName} />
            <ForecastList daily={data.daily} hourly={data.hourly} />
          </>
        )}
      </main>

      <footer className="border-t border-slate-800 py-4 text-center text-sm text-slate-500">
        Made by <span className="text-slate-300">Adarsh Kumar Pollai</span>
      </footer>
    </div>
  )
}
