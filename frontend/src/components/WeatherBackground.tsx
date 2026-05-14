import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Raindrops, RainSplashes, PuddleRipples, Mist,
  Snowflakes, SnowTrails, SunEffect, DustParticles,
  HeatShimmer, Birds, Clouds, WindStreaks, LightRays,
  Fog, FogWisps, Thunderstorm, StormDebris, AmbientStars,
  MoonGlow, ShootingStars, AuroraBorealis, SunsetGlow,
  EnhancedLightning, FogOverlay,
} from './background/effects'

type TimeOfDay = 'night' | 'sunrise' | 'morning' | 'afternoon' | 'sunset' | 'dusk'
type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'foggy' | 'thunderstorm'

interface Props {
  weatherCode: number
}

function getTimeOfDay(): TimeOfDay {
  const h = new Date().getHours()
  if (h >= 6 && h <= 7) return 'sunrise'
  if (h >= 8 && h <= 11) return 'morning'
  if (h >= 12 && h <= 16) return 'afternoon'
  if (h >= 17 && h <= 18) return 'sunset'
  if (h === 19) return 'dusk'
  return 'night'
}

function getWeatherType(code: number): WeatherType {
  if (code === 0) return 'sunny'
  if (code <= 3) return 'cloudy'
  if (code <= 48) return 'foggy'
  if (code <= 67) return 'rainy'
  if (code <= 77) return 'snowy'
  if (code <= 86) return 'snowy'
  return 'thunderstorm'
}

interface GradientSet {
  gradient: string
  label: string
}

function getGradient(type: WeatherType, time: TimeOfDay): GradientSet {
  if (type === 'thunderstorm') {
    return { gradient: 'bg-gradient-to-br from-gray-950 via-purple-950 to-slate-950', label: 'storm' }
  }
  if (type === 'foggy') {
    return { gradient: 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900', label: 'fog' }
  }
  if (type === 'rainy') {
    return { gradient: 'bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950', label: 'rain' }
  }
  if (type === 'snowy') {
    return { gradient: 'bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900/70', label: 'snow' }
  }

  switch (time) {
    case 'night':
      return {
        gradient: type === 'cloudy'
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950'
          : 'bg-gradient-to-br from-[#0b0b2b] via-[#1a1040] to-[#0d0d30]',
        label: 'night',
      }
    case 'sunrise':
      return {
        gradient: 'bg-gradient-to-br from-[#ff7e5f] via-[#feb47b] to-[#ffe29f]',
        label: 'sunrise',
      }
    case 'sunset':
      return {
        gradient: type === 'cloudy'
          ? 'bg-gradient-to-br from-[#ff6b6b] via-[#c56cf0] to-[#2c3e50]'
          : 'bg-gradient-to-br from-[#f77062] via-[#fe5196] to-[#4834d4]',
        label: 'sunset',
      }
    case 'dusk':
      return {
        gradient: 'bg-gradient-to-br from-[#2c3e50] via-[#4ca1af] to-[#c56cf0]',
        label: 'dusk',
      }
    default:
      return type === 'cloudy'
        ? { gradient: 'bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800', label: 'cloudy' }
        : { gradient: 'bg-gradient-to-br from-[#2193b0] via-[#4facfe] to-[#00f2fe]', label: 'clear' }
  }
}

function getSkyOverlay(type: WeatherType, time: TimeOfDay): React.ReactNode {
  if (type === 'thunderstorm') return null
  if (type === 'rainy' || type === 'foggy') return null
  if (type === 'snowy') return null

  if (time === 'sunrise') {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-amber-300/10 via-orange-400/5 to-transparent pointer-events-none" />
    )
  }
  if (time === 'sunset') {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-pink-400/10 via-purple-400/8 to-transparent pointer-events-none" />
    )
  }
  if (time === 'dusk') {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/8 via-purple-500/5 to-transparent pointer-events-none" />
    )
  }
  if (time === 'night') {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-indigo-900/10 to-transparent pointer-events-none" />
    )
  }
  return null
}

export default function WeatherBackground({ weatherCode }: Props) {
  const type = getWeatherType(weatherCode)
  const time = getTimeOfDay()
  const { gradient } = getGradient(type, time)
  const prevGradient = useRef(gradient)
  const [visibleGradient, setVisibleGradient] = useState(gradient)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    if (prevGradient.current !== gradient) {
      setTransitioning(true)
      const timeout = setTimeout(() => {
        setVisibleGradient(gradient)
        prevGradient.current = gradient
        setTransitioning(false)
      }, 50)
      return () => clearTimeout(timeout)
    }
    prevGradient.current = gradient
  }, [gradient])

  const weatherKey = useMemo(() => `${type}-${time}`, [type, time])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className={`absolute inset-0 transition-[background] duration-1000 ease-in-out ${visibleGradient}`}
      />

      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          transitioning ? 'opacity-0' : 'opacity-100'
        }`}
        key={weatherKey}
      >
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          <AmbientStars />
          {time === 'night' && type !== 'thunderstorm' && (
            <>
              {type === 'sunny' || type === 'cloudy' ? (
                <>
                  <MoonGlow phase={new Date().getDate() % 8} />
                  <ShootingStars />
                  {(type === 'sunny' && getTemperatureEstimate(weatherCode) < 5) && <AuroraBorealis />}
                </>
              ) : null}
            </>
          )}
          {time === 'sunset' && (type === 'sunny' || type === 'cloudy') && <SunsetGlow />}
          {time === 'sunrise' && (type === 'sunny' || type === 'cloudy') && (
            <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-orange-400/10 via-amber-400/5 to-transparent pointer-events-none" />
          )}
        </div>

        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          {type === 'sunny' && time !== 'night' && (
            <>
              <SunEffect />
              {time !== 'sunset' && time !== 'dusk' && <DustParticles />}
              {time === 'afternoon' || time === 'morning' ? <HeatShimmer /> : null}
              {time === 'morning' || time === 'afternoon' ? <Birds /> : null}
            </>
          )}
          {type === 'cloudy' && (
            <>
              <Clouds />
              <WindStreaks />
              {(time === 'morning' || time === 'afternoon' || time === 'dusk') && <LightRays />}
            </>
          )}
        </div>

        <div className="absolute inset-0" style={{ zIndex: 2 }}>
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
              <FogOverlay />
              <LightRays />
            </>
          )}
          {type === 'thunderstorm' && (
            <>
              <Thunderstorm />
              <StormDebris />
              <EnhancedLightning />
            </>
          )}
        </div>

        {getSkyOverlay(type, time)}
      </div>
    </div>
  )
}

function getTemperatureEstimate(code: number): number {
  if (code === 0) return 20
  if (code <= 2) return 15
  if (code === 3) return 10
  return 5
}
