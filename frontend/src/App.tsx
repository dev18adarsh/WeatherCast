import { lazy, Suspense, useRef, useState, useEffect, useCallback } from 'react'
import { Cloud, Globe, BarChart3, Sparkles, Thermometer, Star } from 'lucide-react'
import SearchBar from './components/SearchBar'
import CurrentWeatherCard from './components/CurrentWeather'
import AirQualityCard from './components/AirQualityCard'
import MusicSuggestionCard from './components/MusicSuggestionCard'
import OutfitRecommendation from './components/OutfitRecommendation'
import ActivitySuggestions from './components/ActivitySuggestions'
import TravelReadiness from './components/TravelReadiness'
import ForecastList from './components/ForecastList'
import LoadingSkeleton from './components/LoadingSkeleton'
import ErrorAlert from './components/ErrorAlert'
import EmptyState from './components/EmptyState'
import FavoritesBar from './components/FavoritesBar'
import WeatherAlerts from './components/WeatherAlerts'
import { useWeather } from './hooks/useWeather'
import { useGeolocation } from './hooks/useGeolocation'
import { useFavorites } from './hooks/useFavorites'
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut'
import { useUnit } from './context/UnitContext'
import WeatherBackground from './components/WeatherBackground'
import AssistantButton from './components/assistant/AssistantButton'
import { getMusicSuggestion } from './utils/musicSuggestions'
import WeatherAssistant from './components/assistant/WeatherAssistant'
import ShareButton from './components/share/ShareButton'
import ShareModal from './components/share/ShareModal'
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard'
import type { GeocodingResult } from './types'
import type { GlobeHandle } from './components/WeatherGlobe'
import type { CityWeather } from './data/worldCities'

const WeatherGlobe = lazy(() => import('./components/WeatherGlobe'))

function GlobeFallback() {
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-900 min-h-0">
      <div className="text-center space-y-4">
        <div className="relative mx-auto w-12 h-12">
          <div className="absolute inset-0 border-2 border-blue-400/30 border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-1 border-2 border-purple-400/20 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-400" />
          </div>
        </div>
        <p className="text-sm text-slate-400">Loading 3D globe...</p>
      </div>
    </div>
  )
}

export default function App() {
  const { data, loading, error, fetchWeather } = useWeather()
  const globeRef = useRef<GlobeHandle>(null)
  const geo = useGeolocation()
  const { favorites, add: addFavorite, remove: removeFavorite, isFavorite } = useFavorites()
  const { unit, toggle: toggleUnit, formatTemp } = useUnit()

  const [showGlobe, setShowGlobe] = useState(false)
  const [showAssistant, setShowAssistant] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)

  const geoFetched = useRef(false)

  useEffect(() => {
    if (geo.lat != null && geo.lng != null && !geoFetched.current) {
      geoFetched.current = true
      fetchWeather(geo.lat, geo.lng, 'My Location')
    }
  }, [geo.lat, geo.lng, fetchWeather])

  useKeyboardShortcut('k', () => {
    const input = document.querySelector<HTMLInputElement>('input[type="text"][placeholder*="Search"]')
    input?.focus()
  })

  const handleSelect = useCallback((loc: GeocodingResult) => {
    fetchWeather(loc.latitude, loc.longitude, `${loc.name}, ${loc.country}`)
    globeRef.current?.flyTo(loc.latitude, loc.longitude)
  }, [fetchWeather])

  const handleGlobeCitySelect = useCallback((city: CityWeather) => {
    fetchWeather(city.lat, city.lng, `${city.name}, ${city.country}`)
    setShowGlobe(false)
  }, [fetchWeather])

  const handleFavorite = useCallback((loc: GeocodingResult) => {
    if (isFavorite(loc.id)) {
      removeFavorite(loc.id)
    } else {
      addFavorite(loc)
    }
  }, [isFavorite, removeFavorite, addFavorite])

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
      <div className="fixed inset-0 pointer-events-none -z-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.12)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(139,92,246,0.08)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(6,182,212,0.06)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.03)_0%,_transparent_70%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px]" />
      </div>
      {data && !showGlobe && <WeatherBackground weatherCode={data.current.weather_code} />}
      <header className="sticky top-0 z-40 glass border-b border-white/[0.05] backdrop-blur-xl shrink-0 before:absolute before:inset-x-0 before:bottom-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-blue-500/40 before:to-transparent">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-lg opacity-70 animate-glow-pulse" />
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25 transition-transform duration-300 hover:scale-110">
              <Cloud className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent drop-shadow-sm tracking-tight">
                WeatherCast 67
              </h1>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
            </div>
            <p className="flex items-center gap-1 text-[10px] text-slate-500 tracking-wider uppercase -mt-0.5">
              <Sparkles className="w-2.5 h-2.5 text-blue-400/60" />
              {unit === 'imperial' ? '°F · mph' : '°C · km/h'}
            </p>
          </div>
          <button
            onClick={toggleUnit}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300"
            title={`Switch to ${unit === 'metric' ? '°F' : '°C'}`}
            aria-label={`Switch to ${unit === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
          >
            <Thermometer className="w-5 h-5" aria-hidden="true" />
            <span className="text-[9px] font-bold block -mt-1">{unit === 'metric' ? '°C' : '°F'}</span>
          </button>
          {data && !showGlobe && (
            <button
              onClick={() => setShowAnalytics((v) => !v)}
              className={`p-2 rounded-xl transition-all duration-300 ${
                showAnalytics
                  ? 'bg-green-500/20 text-green-400 shadow-lg shadow-green-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              title={showAnalytics ? 'Close analytics' : 'Weather Analytics'}
              aria-label={showAnalytics ? 'Close analytics' : 'Open weather analytics'}
            >
              <BarChart3 className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
          <button
            onClick={() => setShowGlobe((v) => !v)}
            className={`p-2 rounded-xl transition-all duration-300 ${
              showGlobe
                ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title={showGlobe ? 'Close globe' : '3D Earth Globe (Ctrl+G)'}
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
            <div className="space-y-3">
              <SearchBar
                onSelect={handleSelect}
                onFavorite={handleFavorite}
                isFavorite={isFavorite}
              />
              <div className="text-[10px] text-slate-600 text-center -mt-1">
                Press <kbd className="px-1 py-0.5 rounded bg-white/10 text-slate-400 font-mono text-[9px]">Ctrl+K</kbd> to search
              </div>
              <FavoritesBar
                favorites={favorites}
                onSelect={handleSelect}
                onRemove={removeFavorite}
                isFavorite={isFavorite}
              />
            </div>

            {showAnalytics && data && (
              <div className="animate-fade-in-up">
                <AnalyticsDashboard data={data} />
              </div>
            )}

            {!showAnalytics && (
            <>
            {error && <ErrorAlert message={error} />}

            {loading && <LoadingSkeleton />}

            {!loading && !error && !data && <EmptyState onCityClick={handleSelect} />}

            {!loading && data && (
              <>
                <div className="animate-fade-in-up">
                  <div className="relative">
                    <CurrentWeatherCard
                      data={data.current}
                      locationName={data.locationName}
                      sunrise={data.daily.sunrise[0]}
                      sunset={data.daily.sunset[0]}
                    />
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                      {data && (
                        <button
                          onClick={() => {
                            const fakeLoc: GeocodingResult = {
                              id: data.locationName.charCodeAt(0) * 1000 + Math.round(data.current.temperature_2m),
                              name: data.locationName.split(',')[0],
                              latitude: 0,
                              longitude: 0,
                              country: data.locationName.split(', ')[1] || '',
                              country_code: '',
                            }
                            handleFavorite(fakeLoc)
                          }}
                          className={`p-2 rounded-xl transition-all duration-300 ${
                            false
                              ? 'text-yellow-400 bg-yellow-500/20'
                              : 'text-slate-400 hover:text-yellow-400 hover:bg-white/10'
                          }`}
                          title="Add to favorites"
                          aria-label="Add to favorites"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}
                      <ShareButton onClick={() => setShowShare(true)} />
                    </div>
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
            </>
            )}
          </main>

          <footer className="glass border-t border-white/[0.05] py-4 text-center text-xs text-slate-500 shrink-0 relative before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-blue-500/30 before:to-transparent">
            <span className="text-slate-600">Crafted with</span> <span className="text-red-400 animate-breathe inline-block">&#9829;</span> <span className="text-slate-600">by</span> <span className="font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Adarsh Kumar Pollai</span>
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
