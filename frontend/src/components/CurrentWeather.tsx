import { memo, useState, useEffect } from 'react'
import { Wind, Droplets, Thermometer, Eye, Sunrise, Sunset } from 'lucide-react'
import type { CurrentWeather } from '../types'
import { getWeatherCondition, formatTemp, getTempColor, getEmoji } from '../utils/weatherCodes'

interface Props {
  data: CurrentWeather
  locationName: string
  sunrise?: string
  sunset?: string
}

function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="text-xs text-slate-500 tabular-nums">
      {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
    </span>
  )
}

function formatTime(isoString?: string) {
  if (!isoString) return '--:--'
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

const CurrentWeatherCard = memo(function CurrentWeatherCard({ data, locationName, sunrise, sunset }: Props) {
  const condition = getWeatherCondition(data.weather_code)
  const tempColor = getTempColor(data.temperature_2m)

  return (
    <div className="glass-strong rounded-2xl p-6 md:p-8 animate-fade-in-up relative overflow-hidden group card-shine">
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl transition-all duration-1000 group-hover:scale-150"
        style={{ background: `radial-gradient(circle, ${tempColor}44, transparent)` }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-10 blur-3xl transition-all duration-1000 group-hover:scale-150"
        style={{ background: `radial-gradient(circle, ${tempColor}33, transparent)` }}
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-glow-pulse" style={{ backgroundColor: tempColor }} />
              <h2 className="text-lg font-medium text-slate-200 truncate max-w-[200px] sm:max-w-none">{locationName}</h2>
              <LiveClock />
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className="text-7xl font-extrabold tracking-tight transition-colors duration-500 drop-shadow-lg"
                style={{ color: tempColor }}
              >
                {formatTemp(data.temperature_2m)}
              </span>
              <span className="text-2xl text-slate-500 font-light">°C</span>
            </div>
            <p className="text-slate-400">Feels like <span style={{ color: tempColor }}>{formatTemp(data.apparent_temperature)}</span></p>
          </div>
          <div className="text-center">
            <div className="text-6xl mb-1 drop-shadow-2xl animate-float" role="img" aria-label={condition.label}>{getEmoji(data.weather_code)}</div>
            <p className="text-sm text-slate-300 font-medium">{condition.label}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-6 pt-6 border-t border-white/10">
          {[
            { icon: Droplets, label: 'Humidity', value: `${data.relative_humidity_2m}%`, color: '#38bdf8' },
            { icon: Wind, label: 'Wind', value: `${data.wind_speed_10m} km/h`, color: '#a78bfa' },
            { icon: Thermometer, label: 'Feels like', value: formatTemp(data.apparent_temperature), color: tempColor },
            { icon: Eye, label: 'Visibility', value: data.visibility >= 10000 ? 'Excellent' : data.visibility >= 5000 ? 'Good' : 'Low', color: '#34d399' },
            { icon: Sunrise, label: 'Sunrise', value: formatTime(sunrise), color: '#fbbf24' },
            { icon: Sunset, label: 'Sunset', value: formatTime(sunset), color: '#f87171' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-2 sm:gap-3 glass rounded-xl p-2.5 sm:p-3 group/stat hover:scale-[1.03] transition-all duration-200">
              <div className="p-1.5 sm:p-2 rounded-lg shrink-0" style={{ backgroundColor: `${color}22` }}>
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color }} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500 truncate">{label}</p>
                <p className="text-xs sm:text-sm font-semibold text-slate-200 truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

export default CurrentWeatherCard
