import { useMemo } from 'react'

interface Props {
  weatherCode: number
}

type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'foggy' | 'thunderstorm'

function getWeatherType(code: number): WeatherType {
  if (code === 0) return 'sunny'
  if (code <= 3) return 'cloudy'
  if (code <= 48) return 'foggy'
  if (code <= 57) return 'rainy'
  if (code <= 67) return 'rainy'
  if (code <= 77) return 'snowy'
  if (code <= 82) return 'rainy'
  if (code <= 86) return 'snowy'
  return 'thunderstorm'
}

function Raindrops() {
  const drops = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 0.6 + Math.random() * 0.6,
      height: 12 + Math.random() * 20,
      opacity: 0.3 + Math.random() * 0.4,
    }))
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((d) => (
        <div
          key={d.id}
          className="absolute top-0 w-0.5 bg-gradient-to-b from-transparent via-blue-300/60 to-blue-400/80"
          style={{
            left: `${d.left}%`,
            height: `${d.height}px`,
            animation: `rain-fall ${d.duration}s linear ${d.delay}s infinite`,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  )
}

function Snowflakes() {
  const flakes = useMemo(() => {
    return Array.from({ length: 45 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 4,
      size: 3 + Math.random() * 6,
      opacity: 0.4 + Math.random() * 0.5,
    }))
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flakes.map((f) => (
        <div
          key={f.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            animation: `snow-fall ${f.duration}s ease-in-out ${f.delay}s infinite`,
            opacity: f.opacity,
          }}
        />
      ))}
    </div>
  )
}

function SunEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-16 right-16 w-32 h-32">
        <div
          className="w-full h-full rounded-full bg-yellow-400 absolute top-0 left-0"
          style={{ animation: 'sun-pulse 3s ease-in-out infinite' }}
        />
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 h-16 -translate-y-1/2 origin-bottom"
            style={{
              transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
              animation: 'sun-ray-rotate 12s linear infinite',
            }}
          >
            <div className="w-full h-8 bg-gradient-to-t from-yellow-400/40 to-transparent rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

function Clouds() {
  const clouds = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      top: 5 + Math.random() * 20,
      delay: Math.random() * 10,
      duration: 25 + Math.random() * 20,
      scale: 0.6 + Math.random() * 0.8,
      opacity: 0.3 + Math.random() * 0.3,
    }))
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {clouds.map((c) => (
        <div
          key={c.id}
          className="absolute"
          style={{
            top: `${c.top}%`,
            animation: `cloud-drift ${c.duration}s linear ${c.delay}s infinite`,
            opacity: c.opacity,
            transform: `scale(${c.scale})`,
          }}
        >
          <div className="relative w-32 h-14">
            <div className="absolute bottom-0 left-4 w-24 h-10 bg-white/20 rounded-full" />
            <div className="absolute bottom-2 left-0 w-14 h-8 bg-white/20 rounded-full" />
            <div className="absolute bottom-2 right-0 w-16 h-9 bg-white/20 rounded-full" />
            <div className="absolute bottom-4 left-6 w-10 h-6 bg-white/20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

function Fog() {
  const layers = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      top: 30 + i * 20,
      delay: i * 5,
      duration: 30 + i * 10,
      height: 40 + i * 20,
      opacity: 0.1 + i * 0.05,
    }))
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {layers.map((l) => (
        <div
          key={l.id}
          className="absolute left-0 right-0 bg-gradient-to-r from-transparent via-slate-300/10 to-transparent"
          style={{
            top: `${l.top}%`,
            height: `${l.height}%`,
            animation: `fog-drift ${l.duration}s ease-in-out ${l.delay}s infinite`,
            opacity: l.opacity,
          }}
        />
      ))}
    </div>
  )
}

function Thunderstorm() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <Raindrops />
      <div
        className="absolute inset-0 bg-white"
        style={{ animation: 'lightning-flash 8s ease-in-out infinite' }}
      />
      <div
        className="absolute inset-0"
        style={{ animation: 'thunder-rumble 8s ease-in-out infinite' }}
      />
    </div>
  )
}

function getGradient(type: WeatherType): string {
  switch (type) {
    case 'sunny':
      return 'from-blue-500 via-blue-400 to-yellow-300'
    case 'cloudy':
      return 'from-slate-700 via-slate-600 to-slate-500'
    case 'rainy':
      return 'from-slate-800 via-blue-900 to-slate-700'
    case 'snowy':
      return 'from-slate-600 via-slate-500 to-blue-400/30'
    case 'foggy':
      return 'from-slate-700 via-slate-600 to-slate-500'
    case 'thunderstorm':
      return 'from-slate-900 via-purple-950 to-slate-800'
  }
}

export default function WeatherBackground({ weatherCode }: Props) {
  const type = getWeatherType(weatherCode)

  return (
    <div className={`fixed inset-0 bg-gradient-to-br ${getGradient(type)} transition-all duration-1000 -z-10`}>
      {type === 'sunny' && <SunEffect />}
      {type === 'cloudy' && <Clouds />}
      {type === 'rainy' && <Raindrops />}
      {type === 'snowy' && <Snowflakes />}
      {type === 'foggy' && <Fog />}
      {type === 'thunderstorm' && <Thunderstorm />}
    </div>
  )
}
