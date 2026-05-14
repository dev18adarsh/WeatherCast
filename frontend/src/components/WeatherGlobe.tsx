import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import Globe from 'globe.gl'
import * as THREE from 'three'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { WebGLRenderer, Scene } from 'three'
import { WORLD_CITIES, type CityWeather } from '../data/worldCities'
import { X, Loader2 } from 'lucide-react'

const CACHE_KEY = 'globeCityWeather'
const CACHE_TTL = 5 * 60 * 1000
const CONCURRENCY = 6

function getCachedCities(): CityWeather[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) { sessionStorage.removeItem(CACHE_KEY); return null }
    return data
  } catch { return null }
}

function setCachedCities(data: CityWeather[]) {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() })) } catch { /* quota exceeded */ }
}

async function fetchWithConcurrency<T>(items: T[], fn: (item: T) => Promise<CityWeather | null>): Promise<CityWeather[]> {
  const results: (CityWeather | null)[] = []
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const batch = items.slice(i, i + CONCURRENCY)
    const batchResults = await Promise.all(batch.map(fn))
    results.push(...batchResults)
  }
  return results.filter((r): r is CityWeather => r !== null)
}

interface Props {
  onCitySelect?: (city: CityWeather) => void
}

export interface GlobeHandle {
  flyTo: (lat: number, lng: number, label?: string) => void
}

const EARTH_URL = '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
const BUMP_URL = '//unpkg.com/three-globe/example/img/earth-topology.png'
const SKY_URL = '//unpkg.com/three-globe/example/img/night-sky.png'
const CLOUD_URL = '//unpkg.com/three-globe/example/img/earth-water.png'

function weatherEmoji(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 2) return '⛅'
  if (code === 3) return '☁️'
  if (code <= 48) return '🌫️'
  if (code <= 57) return '🌦️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '❄️'
  if (code <= 82) return '🌦️'
  if (code <= 86) return '🌨️'
  return '⛈️'
}

function markerColor(code: number): string {
  if (code === 0) return '#fbbf24'
  if (code <= 2) return '#fbbf24'
  if (code <= 48) return '#94a3b8'
  if (code <= 67) return '#38bdf8'
  if (code <= 77) return '#e2e8f0'
  if (code <= 86) return '#e2e8f0'
  return '#a78bfa'
}

function weatherLabel(code: number): string {
  if (code === 0) return 'Clear'
  if (code <= 2) return 'Cloudy'
  if (code === 3) return 'Overcast'
  if (code <= 48) return 'Fog'
  if (code <= 67) return 'Rain'
  if (code <= 77) return 'Snow'
  if (code <= 86) return 'Snow'
  return 'Storm'
}

function formatLocalTime(timeStr: string): string {
  try {
    const d = new Date(timeStr)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  } catch {
    return '--'
  }
}

export default forwardRef<GlobeHandle, Props>(function WeatherGlobe({ onCitySelect }, ref) {
  const containerRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<any>(null)
  const cloudRef = useRef<THREE.Mesh | null>(null)
  const resizeRef = useRef<() => void>(() => {})

  const [cities, setCities] = useState<CityWeather[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState<CityWeather | null>(null)
  const [hoveredCity, setHoveredCity] = useState<CityWeather | null>(null)

  useImperativeHandle(ref, () => ({
    flyTo: (lat: number, lng: number) => {
      if (globeRef.current) {
        globeRef.current.pointOfView({ lat, lng, altitude: 1.5 }, 1000)
        const match = cities.find((c) => Math.abs(c.lat - lat) < 2 && Math.abs(c.lng - lng) < 2)
        if (match) setSelectedCity(match)
      }
    },
  }))

  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      const cached = getCachedCities()
      if (cached) {
        setCities(cached)
        setLoading(false)
        return
      }

      const results = await fetchWithConcurrency(WORLD_CITIES, async (city) => {
        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
          const res = await fetch(url)
          const data = await res.json()
          return {
            ...city,
            temp: Math.round(data.current.temperature_2m),
            weatherCode: data.current.weather_code,
            humidity: data.current.relative_humidity_2m,
            wind: data.current.wind_speed_10m,
            time: data.current.time,
          } as CityWeather
        } catch {
          return null
        }
      })

      if (!cancelled) {
        setCachedCities(results)
        setCities(results)
        setLoading(false)
      }
    }

    fetchAll()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!containerRef.current || loading) return

    const w = containerRef.current.clientWidth
    const h = containerRef.current.clientHeight

    const globe = new Globe(containerRef.current)
      .globeImageUrl(EARTH_URL)
      .bumpImageUrl(BUMP_URL)
      .backgroundImageUrl(SKY_URL)
      .atmosphereColor('#3b82f6')
      .atmosphereAltitude(0.15)
      .width(w)
      .height(h)

    const g = globe as unknown as {
      htmlElementsData: (data: CityWeather[]) => typeof g
      htmlElement: (fn: (d: CityWeather) => HTMLElement) => typeof g
      onHtmlElementHover: (fn: (d: CityWeather | null) => void) => typeof g
      onHtmlElementClick: (fn: (d: CityWeather) => void) => typeof g
      controls: () => OrbitControls
      renderer: () => WebGLRenderer
      scene: () => Scene
      width: (w: number) => typeof g
      height: (h: number) => typeof g
      pointOfView: (pov: { lat: number; lng: number; altitude: number }, ms?: number) => void
    }

    g.htmlElementsData(cities)
    g.htmlElement((d: CityWeather) => {
      const el = document.createElement('div')
      el.style.cssText = `
        pointer-events: auto; cursor: pointer;
        display: flex; flex-direction: column; align-items: center; gap: 2px;
        transition: transform 0.3s ease;
        filter: drop-shadow(0 0 8px ${markerColor(d.weatherCode)}88);
      `
      const dot = document.createElement('div')
      dot.style.cssText = `
        width: 10px; height: 10px; border-radius: 50%;
        background: ${markerColor(d.weatherCode)};
        box-shadow: 0 0 12px ${markerColor(d.weatherCode)}, 0 0 24px ${markerColor(d.weatherCode)}66;
        transition: all 0.3s ease;
      `
      const label = document.createElement('div')
      label.style.cssText = `
        font-size: 10px; font-weight: 600; color: white;
        text-shadow: 0 1px 4px rgba(0,0,0,0.8);
        padding: 1px 6px; border-radius: 4px;
        background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
        white-space: nowrap; opacity: 0;
        transition: opacity 0.2s ease;
      `
      label.textContent = `${d.name} ${d.temp}°`
      label.className = 'globe-marker-label'
      el.appendChild(dot)
      el.appendChild(label)
      return el
    })
    g.onHtmlElementHover((d: CityWeather | null) => {
      setHoveredCity(d)
      const container = containerRef.current
      if (container) {
        container.style.cursor = d ? 'pointer' : 'grab'
      }
    })
    g.onHtmlElementClick((d: CityWeather) => {
      setSelectedCity(d)
      if (onCitySelect) onCitySelect(d)
    })

    globeRef.current = g
    const controls = g.controls()
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.6
    controls.enableZoom = true
    controls.zoomSpeed = 0.8

    const renderer = g.renderer()
    if (renderer) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    const scene = g.scene()
    if (scene) {
      const textureLoader = new THREE.TextureLoader()
      textureLoader.load(CLOUD_URL, (texture: THREE.Texture) => {
        const geometry = new THREE.SphereGeometry(1.008, 64, 64)
        const material = new THREE.MeshPhongMaterial({
          map: texture,
          transparent: true,
          opacity: 0.25,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
        const clouds = new THREE.Mesh(geometry, material)
        scene.add(clouds)
        cloudRef.current = clouds
      })
    }

    function onResize() {
      if (!containerRef.current) return
      g.width(containerRef.current.clientWidth)
      g.height(containerRef.current.clientHeight)
    }
    resizeRef.current = onResize
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      if (cloudRef.current) {
        scene?.remove(cloudRef.current)
      }
      const ctrl = g.controls()
      ctrl.dispose?.()
      const r = g.renderer()
      r?.dispose?.()
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
      globeRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  useEffect(() => {
    if (!globeRef.current || cities.length === 0) return
    globeRef.current.htmlElementsData(cities)
  }, [cities])

  useEffect(() => {
    let rafId: number

    function animateClouds() {
      if (cloudRef.current) {
        cloudRef.current.rotation.y += 0.0003
      }
      rafId = requestAnimationFrame(animateClouds)
    }
    animateClouds()
    return () => cancelAnimationFrame(rafId)
  }, [loading])

  return (
    <>
      <div ref={containerRef} className="w-full h-full relative" style={{ cursor: 'grab' }} />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-10">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
            <p className="text-sm text-slate-400">Loading weather data...</p>
          </div>
        </div>
      )}

      {hoveredCity && !selectedCity && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-2xl animate-fade-in">
            <span className="text-xl">{weatherEmoji(hoveredCity.weatherCode)}</span>
            <div>
              <p className="text-sm font-bold text-white">{hoveredCity.name}, {hoveredCity.country}</p>
              <p className="text-xs text-slate-400">{hoveredCity.temp}°C · {formatLocalTime(hoveredCity.time)} · {weatherLabel(hoveredCity.weatherCode)}</p>
            </div>
          </div>
        </div>
      )}

      {selectedCity && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[calc(100%-2rem)] max-w-md animate-fade-in-up">
          <div className="glass-strong rounded-2xl p-5 shadow-2xl border border-white/10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl">
                  {weatherEmoji(selectedCity.weatherCode)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{selectedCity.name}</p>
                  <p className="text-[11px] text-slate-400">{selectedCity.country} · {formatLocalTime(selectedCity.time)}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCity(null)}
                className="text-slate-500 hover:text-white transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="glass rounded-xl p-2.5 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Temp</p>
                <p className="text-lg font-bold text-white">{selectedCity.temp}°C</p>
              </div>
              <div className="glass rounded-xl p-2.5 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Condition</p>
                <p className="text-sm font-medium text-white">{weatherLabel(selectedCity.weatherCode)}</p>
              </div>
              <div className="glass rounded-xl p-2.5 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Humidity</p>
                <p className="text-sm font-medium text-white">{selectedCity.humidity}%</p>
              </div>
              <div className="glass rounded-xl p-2.5 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Wind</p>
                <p className="text-sm font-medium text-white">{selectedCity.wind} km/h</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
})
