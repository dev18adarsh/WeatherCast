import {
  Raindrops, RainSplashes, PuddleRipples, Mist,
  Snowflakes, SnowTrails, SunEffect, DustParticles,
  HeatShimmer, Birds, Clouds, WindStreaks, LightRays,
  Fog, FogWisps, Thunderstorm, StormDebris, AmbientStars,
} from './background/effects'

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
