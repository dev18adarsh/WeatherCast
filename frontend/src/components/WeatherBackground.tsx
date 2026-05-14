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
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 0.4 + Math.random() * 0.4,
      height: 8 + Math.random() * 20,
      opacity: 0.15 + Math.random() * 0.5,
      heavy: Math.random() > 0.6,
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
            animation: `${d.heavy ? 'rain-heavy' : 'rain-fall'} ${d.duration}s linear ${d.delay}s infinite`,
            opacity: d.opacity,
            background: 'linear-gradient(to bottom, transparent, rgba(148,163,184,0.5), rgba(148,163,184,0.85))',
          }}
        />
      ))}
    </div>
  )
}

function RainSplashes() {
  const splashes = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 4,
      size: 2 + Math.random() * 4,
      duration: 0.4 + Math.random() * 0.4,
    })), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {splashes.map((s) => (
        <div
          key={s.id}
          className="absolute bottom-0 rounded-full bg-blue-200/40"
          style={{
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size * 1.5}px`,
            animation: `splash-up ${s.duration}s ease-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

function PuddleRipples() {
  const ripples = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: 5 + Math.random() * 90,
      bottom: 2 + Math.random() * 8,
      delay: Math.random() * 6,
      duration: 2 + Math.random() * 2,
      size: 10 + Math.random() * 20,
    })), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {ripples.map((r) => (
        <div
          key={r.id}
          className="absolute rounded-full border border-blue-300/20"
          style={{
            left: `${r.left}%`,
            bottom: `${r.bottom}%`,
            width: `${r.size}px`,
            height: `${r.size}px`,
            animation: `puddle-ripple ${r.duration}s ease-out ${r.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

function Mist() {
  const layers = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 4,
      height: 10 + Math.random() * 25,
      width: 20 + Math.random() * 30,
      opacity: 0.08 + Math.random() * 0.12,
    })), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {layers.map((m) => (
        <div
          key={m.id}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${m.left}%`,
            width: `${m.width}%`,
            height: `${m.height}%`,
            animation: `mist-rise ${m.duration}s ease-in-out ${m.delay}s infinite`,
            opacity: m.opacity,
            background: 'radial-gradient(ellipse at center, rgba(148,163,184,0.5), transparent)',
            filter: 'blur(20px)',
          }}
        />
      ))}
    </div>
  )
}

function Snowflakes() {
  const flakes = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 4 + Math.random() * 6,
      size: 2 + Math.random() * 7,
      opacity: 0.2 + Math.random() * 0.7,
      drift: 20 + Math.random() * 50,
      wobble: Math.random() > 0.7,
    })), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flakes.map((f) => {
        const isLarge = f.size > 5
        return (
          <div
            key={f.id}
            className="absolute"
            style={{
              left: `${f.left}%`,
              animation: f.wobble
                ? `snow-fall ${f.duration}s ease-in-out ${f.delay}s infinite`
                : `snow-trail ${f.duration * 0.7}s linear ${f.delay}s infinite`,
            }}
          >
            <div
              className="rounded-full"
              style={{
                width: `${f.size}px`,
                height: `${f.size}px`,
                opacity: f.opacity,
                background: isLarge
                  ? 'radial-gradient(circle at 30% 30%, #fff, #cbd5e1)'
                  : '#fff',
                boxShadow: isLarge ? '0 0 6px rgba(255,255,255,0.3), 0 0 12px rgba(255,255,255,0.1)' : 'none',
                filter: isLarge ? 'blur(0.5px)' : 'none',
              }}
            />
            {isLarge && (
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white/60"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function SnowTrails() {
  const trails = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 3,
      height: 15 + Math.random() * 25,
      opacity: 0.1 + Math.random() * 0.2,
    })), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {trails.map((t) => (
        <div
          key={t.id}
          className="absolute top-0"
          style={{
            left: `${t.left}%`,
            width: '1px',
            height: `${t.height}px`,
            animation: `snow-trail ${t.duration}s linear ${t.delay}s infinite`,
            opacity: t.opacity,
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)',
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
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-0.5 origin-bottom"
            style={{
              height: '90px',
              transform: `translate(-50%, -100%) rotate(${i * 18}deg)`,
              animation: 'sun-ray-rotate 25s linear infinite',
              background: `linear-gradient(to top, rgba(251,191,36,${0.3 + Math.random() * 0.3}), transparent)`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(253,224,71,0.8), rgba(251,191,36,0.4), transparent)',
            animation: 'sun-pulse 3s ease-in-out infinite',
            boxShadow: '0 0 100px 40px rgba(251,191,36,0.3), 0 0 200px 80px rgba(251,191,36,0.1)',
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-white/20 blur-2xl" />
      </div>
    </div>
  )
}

function DustParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: 30 + Math.random() * 50,
      delay: Math.random() * 8,
      duration: 4 + Math.random() * 4,
      size: 1.5 + Math.random() * 2.5,
      opacity: 0.15 + Math.random() * 0.3,
    })), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `dust-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            opacity: p.opacity,
            background: 'radial-gradient(circle, rgba(251,191,36,0.6), transparent)',
          }}
        />
      ))}
    </div>
  )
}

function HeatShimmer() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute inset-x-0"
          style={{
            top: `${40 + i * 20}%`,
            height: '15%',
            animation: `heat-shimmer ${3 + i * 0.5}s ease-in-out ${i * 1}s infinite`,
            background: 'linear-gradient(180deg, transparent, rgba(251,191,36,0.03), transparent)',
            filter: 'blur(8px)',
          }}
        />
      ))}
    </div>
  )
}

function Birds() {
  const birds = useMemo(() =>
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      top: 8 + Math.random() * 15,
      delay: Math.random() * 12,
      duration: 10 + Math.random() * 8,
      size: 8 + Math.random() * 6,
    })), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {birds.map((b) => (
        <div
          key={b.id}
          className="absolute"
          style={{
            top: `${b.top}%`,
            animation: `bird-fly ${b.duration}s linear ${b.delay}s infinite`,
          }}
        >
          <svg width={b.size} height={b.size * 0.6} viewBox="0 0 20 12" fill="none">
            <path d="M1 6L7 2L10 6L13 2L19 6" stroke="rgba(30,64,175,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
      ))}
    </div>
  )
}

function Clouds() {
  const clouds = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      top: 2 + Math.random() * 25,
      delay: Math.random() * 20,
      duration: 25 + Math.random() * 35,
      scale: 0.4 + Math.random() * 1.1,
      opacity: 0.1 + Math.random() * 0.3,
      wide: Math.random() > 0.5,
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
          <svg width={c.wide ? 200 : 150} height="55" viewBox="0 0 160 55" fill="none">
            <ellipse cx="55" cy="42" rx="50" ry="13" fill="white" />
            <ellipse cx="35" cy="38" rx="32" ry="16" fill="white" />
            <ellipse cx="85" cy="35" rx="42" ry="18" fill="white" />
            <ellipse cx="105" cy="40" rx="30" ry="12" fill="white" />
            <ellipse cx="55" cy="28" rx="28" ry="14" fill="white" />
            <ellipse cx="80" cy="24" rx="22" ry="12" fill="white" />
            <ellipse cx="100" cy="30" rx="18" ry="10" fill="white" />
          </svg>
        </div>
      ))}
    </div>
  )
}

function WindStreaks() {
  const streaks = useMemo(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      top: 15 + Math.random() * 65,
      delay: Math.random() * 6,
      duration: 3 + Math.random() * 4,
      width: 30 + Math.random() * 60,
      opacity: 0.04 + Math.random() * 0.08,
    })), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {streaks.map((s) => (
        <div
          key={s.id}
          className="absolute h-px rounded-full"
          style={{
            top: `${s.top}%`,
            width: `${s.width}%`,
            animation: `wind-streak ${s.duration}s linear ${s.delay}s infinite`,
            opacity: s.opacity,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          }}
        />
      ))}
    </div>
  )
}

function LightRays() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute top-0"
          style={{
            left: `${15 + i * 25}%`,
            width: '30%',
            height: '100%',
            animation: `light-ray ${8 + i * 3}s ease-in-out ${i * 2}s infinite`,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.06), transparent 70%)',
            transformOrigin: 'top center',
            filter: 'blur(30px)',
          }}
        />
      ))}
    </div>
  )
}

function Fog() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute left-0 right-0"
          style={{
            top: `${15 + i * 16}%`,
            height: `${25 + i * 15}%`,
            animation: `fog-drift ${20 + i * 14}s ease-in-out ${i * 5}s infinite`,
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(148,163,184,${0.03 + i * 0.02}), transparent)`,
              filter: 'blur(50px)',
            }}
          />
        </div>
      ))}
    </div>
  )
}

function FogWisps() {
  const wisps = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: 20 + Math.random() * 50,
      delay: Math.random() * 6,
      duration: 8 + Math.random() * 6,
      size: 30 + Math.random() * 50,
      opacity: 0.04 + Math.random() * 0.08,
    })), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {wisps.map((w) => (
        <div
          key={w.id}
          className="absolute rounded-full"
          style={{
            left: `${w.left}%`,
            top: `${w.top}%`,
            width: `${w.size}%`,
            height: `${w.size * 0.4}%`,
            animation: `fog-swirl ${w.duration}s ease-in-out ${w.delay}s infinite`,
            background: 'radial-gradient(ellipse at center, rgba(148,163,184,0.15), transparent)',
            filter: 'blur(30px)',
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
      <RainSplashes />
      <Mist />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(60,60,80,0.3), transparent 60%)',
          animation: 'thunder-rumble 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ animation: 'flash-overlay 4s ease-in-out infinite' }}
      />
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: '2px',
            height: `${50 + Math.random() * 80}px`,
            top: '5%',
            left: `${15 + Math.random() * 70}%`,
            animation: `lightning-flash ${4 + i * 2}s ease-in-out ${i * 1.2}s infinite`,
            filter: 'blur(1.5px)',
            boxShadow: '0 0 30px 15px rgba(255,255,255,0.4), 0 0 60px 30px rgba(255,255,255,0.1)',
            transform: `rotate(${-8 + Math.random() * 16}deg)`,
            background: 'linear-gradient(to bottom, #fff 30%, rgba(200,200,255,0.8), transparent)',
          }}
        >
          <div
            className="absolute top-[60%] left-1/2 w-1 h-12 origin-top"
            style={{
              transform: `rotate(${15 + Math.random() * 20}deg)`,
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)',
              filter: 'blur(0.5px)',
            }}
          />
          <div
            className="absolute top-[45%] left-1/2 w-0.5 h-8 origin-top"
            style={{
              transform: `rotate(${-15 - Math.random() * 15}deg)`,
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)',
            }}
          />
        </div>
      ))}
    </div>
  )
}

function StormDebris() {
  const debris = useMemo(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      top: 20 + Math.random() * 60,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 3,
      size: 2 + Math.random() * 4,
      opacity: 0.2 + Math.random() * 0.4,
    })), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {debris.map((d) => (
        <div
          key={d.id}
          className="absolute rounded-sm bg-slate-700/50"
          style={{
            top: `${d.top}%`,
            width: `${d.size}px`,
            height: `${d.size * 0.6}px`,
            animation: `debris-fly ${d.duration}s linear ${d.delay}s infinite`,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  )
}

function AmbientStars() {
  const stars = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      top: Math.random() * 45,
      left: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      delay: Math.random() * 6,
      duration: 2 + Math.random() * 4,
      opacity: 0.15 + Math.random() * 0.45,
    })), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animation: `tada ${s.duration}s ease-in-out ${s.delay}s infinite`,
            opacity: s.opacity,
            boxShadow: s.size > 2 ? `0 0 ${s.size}px rgba(255,255,255,0.3)` : 'none',
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
      {type === 'sunny' && (
        <>
          <SunEffect />
          <DustParticles />
          <HeatShimmer />
          <Birds />
        </>
      )}
      {type === 'cloudy' && (
        <>
          <Clouds />
          <WindStreaks />
          <LightRays />
        </>
      )}
      {type === 'rainy' && (
        <>
          <Raindrops />
          <RainSplashes />
          <PuddleRipples />
          <Mist />
          <WindStreaks />
        </>
      )}
      {type === 'snowy' && (
        <>
          <Snowflakes />
          <SnowTrails />
          <WindStreaks />
        </>
      )}
      {type === 'foggy' && (
        <>
          <Fog />
          <FogWisps />
          <LightRays />
        </>
      )}
      {type === 'thunderstorm' && (
        <>
          <Thunderstorm />
          <StormDebris />
        </>
      )}
    </div>
  )
}
