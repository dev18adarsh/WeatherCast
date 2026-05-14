import { lazy, Suspense, useRef, useState } from 'react'
import { Cloud, Globe } from 'lucide-react'
import SearchBar from './components/SearchBar'
import CurrentWeatherCard from './components/CurrentWeather'
import MusicSuggestionCard from './components/MusicSuggestionCard'
import OutfitRecommendation from './components/OutfitRecommendation'
import ActivitySuggestions from './components/ActivitySuggestions'
import TravelReadiness from './components/TravelReadiness'
import ForecastList from './components/ForecastList'
import LoadingSkeleton from './components/LoadingSkeleton'
import ErrorAlert from './components/ErrorAlert'
import EmptyState from './components/EmptyState'
import { useWeather } from './hooks/useWeather'
import WeatherBackground from './components/WeatherBackground'
import AssistantButton from './components/assistant/AssistantButton'
import { getMusicSuggestion } from './utils/musicSuggestions'
import WeatherAssistant from './components/assistant/WeatherAssistant'
import ShareButton from './components/share/ShareButton'
import ShareModal from './components/share/ShareModal'
import type { GeocodingResult } from './types'
import type { GlobeHandle } from './components/WeatherGlobe'
import type { CityWeather } from './data/worldCities'

const WeatherGlobe = lazy(() => import('./components/WeatherGlobe'))

function GlobeFallback() {
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-900 min-h-0">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading 3D globe...</p>
      </div>
    </div>
  )
}

export default function App() {
  const { data, loading, error, fetchWeather } = useWeather()
  const globeRef = useRef<GlobeHandle>(null)
  const [showGlobe, setShowGlobe] = useState(false)
  const [showAssistant, setShowAssistant] = useState(false)
  const [showShare, setShowShare] = useState(false)

  function handleSelect(loc: GeocodingResult) {
    fetchWeather(loc.latitude, loc.longitude, `${loc.name}, ${loc.country}`)
    globeRef.current?.flyTo(loc.latitude, loc.longitude)
  }

  function handleGlobeCitySelect(city: CityWeather) {
    fetchWeather(city.lat, city.lng, `${city.name}, ${city.country}`)
    setShowGlobe(false)
  }

  function getCurrentRainProb(): number {
    if (!data) return 0
    const now = new Date()
    const currentHour = now.getHours()
    const idx = data.hourly.time.findIndex((t) => new Date(t).getHours() === currentHour)
    if (idx === -1) return 0
    return data.hourly.precipitation_probability[idx] ?? 0
  }

  return (
    <div className="min-h-screen bg-slate-900 relative flex flex-col">
      {data && !showGlobe && <WeatherBackground weatherCode={data.current.weather_code} />}
      <header className="sticky top-0 z-40 glass border-b border-white/5 backdrop-blur-xl shrink-0">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-base font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Kimi's WeatherInfo
            </h1>
            <p className="text-[10px] text-slate-500 tracking-wider uppercase -mt-0.5">Made by Adarsh</p>
          </div>
          <button
            onClick={() => setShowGlobe((v) => !v)}
            className={`p-2 rounded-xl transition-all duration-300 ${
              showGlobe
                ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title={showGlobe ? 'Close globe' : '3D Earth Globe'}
            aria-label={showGlobe ? 'Close 3D globe view' : 'Open 3D globe view'}
          >
            <Globe className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      {showGlobe ? (
        <Suspense fallback={<GlobeFallback />}>
          <div className="flex-1 relative min-h-0 bg-slate-900">
            <WeatherGlobe ref={globeRef} onCitySelect={handleGlobeCitySelect} />
          </div>
        </Suspense>
      ) : (
        <>
          <main className="max-w-3xl mx-auto px-4 py-6 space-y-6 flex-1">
            <SearchBar onSelect={handleSelect} />

            {error && <ErrorAlert message={error} />}

            {loading && <LoadingSkeleton />}

            {!loading && !error && !data && <EmptyState />}

            {!loading && data && (
              <>
                <div className="animate-fade-in-up">
                  <div className="relative">
                    <CurrentWeatherCard data={data.current} locationName={data.locationName} />
                    {data && (
                      <div className="absolute top-4 right-4 z-10">
                        <ShareButton onClick={() => setShowShare(true)} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <MusicSuggestionCard weatherCode={data.current.weather_code} temperature={data.current.temperature_2m} />
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                  <OutfitRecommendation
                    temperature={data.current.temperature_2m}
                    feelsLike={data.current.apparent_temperature}
                    humidity={data.current.relative_humidity_2m}
                    windSpeed={data.current.wind_speed_10m}
                    uvIndex={data.current.uv_index}
                    weatherCode={data.current.weather_code}
                  />
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '0.18s' }}>
                  <ActivitySuggestions
                    temperature={data.current.temperature_2m}
                    humidity={data.current.relative_humidity_2m}
                    windSpeed={data.current.wind_speed_10m}
                    uvIndex={data.current.uv_index}
                    weatherCode={data.current.weather_code}
                    rainProbability={getCurrentRainProb()}
                  />
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '0.19s' }}>
                  <TravelReadiness
                    temperature={data.current.temperature_2m}
                    feelsLike={data.current.apparent_temperature}
                    humidity={data.current.relative_humidity_2m}
                    windSpeed={data.current.wind_speed_10m}
                    uvIndex={data.current.uv_index}
                    visibility={data.current.visibility}
                    weatherCode={data.current.weather_code}
                    rainProbability={getCurrentRainProb()}
                    hourlyTime={data.hourly.time}
                    hourlyTemp={data.hourly.temperature_2m}
                    hourlyRain={data.hourly.precipitation_probability}
                    hourlyCode={data.hourly.weather_code}
                  />
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <ForecastList daily={data.daily} hourly={data.hourly} />
                </div>
              </>
            )}
          </main>

          <footer className="glass border-t border-white/5 py-4 text-center text-xs text-slate-500 shrink-0">
            Made with <span className="text-red-400">&#9829;</span> by <span className="text-slate-300 font-medium">Adarsh Kumar Pollai</span>
          </footer>
        </>
      )}

      <AssistantButton
        onClick={() => setShowAssistant((v) => !v)}
        open={showAssistant}
        hasData={!!data}
      />

      {showAssistant && (
        <WeatherAssistant data={data} />
      )}

      {showShare && data && (
        <ShareModal
          data={data}
          musicMood={getMusicSuggestion(data.current.weather_code, data.current.temperature_2m).mood}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  )
}
