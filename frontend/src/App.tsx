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

  function handleSelect(loc: GeocodingResult) {
    fetchWeather(loc.latitude, loc.longitude, `${loc.name}, ${loc.country}`)
  }

  return (
    <div className="min-h-screen relative">
      {data && <WeatherBackground weatherCode={data.current.weather_code} />}
      <header className="sticky top-0 z-40 glass border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Kimi's WeatherInfo
            </h1>
            <p className="text-[10px] text-slate-500 tracking-wider uppercase -mt-0.5">Made by Adarsh</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <SearchBar onSelect={handleSelect} />

        {error && <ErrorAlert message={error} />}

        {loading && <LoadingSkeleton />}

        {!loading && !error && !data && <EmptyState />}

        {!loading && data && (
          <>
            <div className="animate-fade-in-up">
              <CurrentWeatherCard data={data.current} locationName={data.locationName} />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <ForecastList daily={data.daily} hourly={data.hourly} />
            </div>
          </>
        )}
      </main>

      <footer className="glass border-t border-white/5 py-4 text-center text-xs text-slate-500">
        Made with <span className="text-red-400">&#9829;</span> by <span className="text-slate-300 font-medium">Adarsh Kumar Pollai</span>
      </footer>
    </div>
  )
}
