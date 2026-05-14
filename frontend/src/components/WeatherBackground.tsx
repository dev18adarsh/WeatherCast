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
  const drops = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 0.5 + Math.random() * 0.5,
      height: 10 + Math.random() * 25,
      opacity: 0.2 + Math.random() * 0.5,
    })), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((d) => (
        <div
          key={d.id}
          className="absolute top-0 w-px"
          style={{
            left: `${d.left}%`,
            height: `${d.height}px`,
            animation: `rain-fall ${d.duration}s linear ${d.delay}s infinite`,
            opacity: d.opacity,
            background: 'linear-gradient(to bottom, transparent, rgba(148,163,184,0.6), rgba(148,163,184,0.9))',
          }}
        />
      ))}
    </div>
  )
}

function Snowflakes() {
  const flakes = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 5,
      size: 2 + Math.random() * 6,
      opacity: 0.3 + Math.random() * 0.6,
      drift: 20 + Math.random() * 40,
    })), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flakes.map((f) => (
        <div
          key={f.id}
          className="absolute rounded-full"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            animation: `snow-fall ${f.duration}s ease-in-out ${f.delay}s infinite`,
            opacity: f.opacity,
            background: f.size > 4 ? 'radial-gradient(circle at 30% 30%, #fff, #94a3b8)' : '#fff',
            boxShadow: f.size > 5 ? '0 0 4px rgba(255,255,255,0.3)' : 'none',
          }}
        />
      ))}
    </div>
  )
}

function SunEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-12 right-12 w-48 h-48">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-0.5 origin-bottom"
            style={{
              height: '80px',
              transform: `translate(-50%, -100%) rotate(${i * 22.5}deg)`,
              animation: 'sun-ray-rotate 20s linear infinite',
              background: `linear-gradient(to top, rgba(251,191,36,0.5), transparent)`,
            }}
          />
        ))}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400"
          style={{ animation: 'sun-pulse 3s ease-in-out infinite', boxShadow: '0 0 80px 30px rgba(251,191,36,0.3), 0 0 160px 60px rgba(251,191,36,0.1)' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/20 blur-xl" />
      </div>
    </div>
  )
}

function Clouds() {
  const clouds = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      top: 2 + Math.random() * 25,
      delay: Math.random() * 15,
      duration: 30 + Math.random() * 30,
      scale: 0.5 + Math.random() * 1,
      opacity: 0.15 + Math.random() * 0.3,
    })), [])

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
          <svg width="160" height="60" viewBox="0 0 160 60" fill="none">
            <ellipse cx="60" cy="45" rx="55" ry="15" fill="white" />
            <ellipse cx="40" cy="40" rx="35" ry="18" fill="white" />
            <ellipse cx="90" cy="38" rx="45" ry="20" fill="white" />
            <ellipse cx="110" cy="42" rx="35" ry="14" fill="white" />
            <ellipse cx="60" cy="32" rx="30" ry="16" fill="white" />
            <ellipse cx="85" cy="28" rx="25" ry="14" fill="white" />
          </svg>
        </div>
      ))}
    </div>
  )
}

function Fog() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute left-0 right-0"
          style={{
            top: `${20 + i * 18}%`,
            height: `${30 + i * 15}%`,
            animation: `fog-drift ${25 + i * 12}s ease-in-out ${i * 4}s infinite`,
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(148,163,184,${0.04 + i * 0.02}), transparent)`,
              filter: 'blur(40px)',
            }}
          />
        </div>
      ))}
    </div>
  )
}

function Thunderstorm() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <Raindrops />
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-white/90"
          style={{
            width: '2px',
            height: `${40 + Math.random() * 60}px`,
            top: '10%',
            left: `${20 + Math.random() * 60}%`,
            animation: `lightning-flash ${6 + i * 2}s ease-in-out ${i * 1.5}s infinite`,
            filter: 'blur(1px)',
            boxShadow: '0 0 20px 10px rgba(255,255,255,0.3)',
            transform: `rotate(${-5 + Math.random() * 10}deg)`,
          }}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.05), transparent 60%)',
          animation: 'thunder-rumble 8s ease-in-out infinite',
        }}
      />
    </div>
  )
}

function AmbientStars() {
  const stars = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      top: Math.random() * 40,
      left: Math.random() * 100,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 5,
      duration: 2 + Math.random() * 3,
      opacity: 0.2 + Math.random() * 0.4,
    })), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  )
}

function getGradient(type: WeatherType): string {
  switch (type) {
    case 'sunny':
      return 'bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-900'
    case 'cloudy':
      return 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900'
    case 'rainy':
      return 'bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950'
    case 'snowy':
      return 'bg-gradient-to-br from-slate-700 via-slate-600 to-blue-900/80'
    case 'foggy':
      return 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900'
    case 'thunderstorm':
      return 'bg-gradient-to-br from-gray-950 via-purple-950 to-slate-950'
  }
}

export default function WeatherBackground({ weatherCode }: Props) {
  const type = getWeatherType(weatherCode)

  return (
    <div className={`fixed inset-0 ${getGradient(type)} transition-all duration-1000 -z-10`}>
      <AmbientStars />
      {type === 'sunny' && <SunEffect />}
      {type === 'cloudy' && <Clouds />}
      {type === 'rainy' && <Raindrops />}
      {type === 'snowy' && <Snowflakes />}
      {type === 'foggy' && <Fog />}
      {type === 'thunderstorm' && <Thunderstorm />}
    </div>
  )
}
