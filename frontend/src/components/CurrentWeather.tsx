import { memo } from 'react'
import { Wind, Droplets, Thermometer } from 'lucide-react'
import type { CurrentWeather } from '../types'
import { getWeatherCondition, formatTemp, getTempColor, getEmoji } from '../utils/weatherCodes'

interface Props {
  data: CurrentWeather
  locationName: string
}

const CurrentWeatherCard = memo(function CurrentWeatherCard({ data, locationName }: Props) {
  const condition = getWeatherCondition(data.weather_code)
  const tempColor = getTempColor(data.temperature_2m)

  return (
    <div className="glass-strong rounded-2xl p-6 md:p-8 animate-fade-in-up relative overflow-hidden group">
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl transition-all duration-1000 group-hover:scale-150"
        style={{ background: `radial-gradient(circle, ${tempColor}44, transparent)` }}
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-glow-pulse" style={{ backgroundColor: tempColor }} />
              <h2 className="text-lg font-medium text-slate-300">{locationName}</h2>
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className="text-7xl font-extrabold tracking-tight transition-colors duration-500"
                style={{ color: tempColor }}
              >
                {formatTemp(data.temperature_2m)}
              </span>
              <span className="text-2xl text-slate-500">C</span>
            </div>
            <p className="text-slate-400">Feels like {formatTemp(data.apparent_temperature)}</p>
          </div>
            <div className="text-center animate-float">
            <div className="text-6xl mb-2 drop-shadow-2xl" role="img" aria-label={condition.label}>{getEmoji(data.weather_code)}</div>
            <p className="text-sm text-slate-300 font-medium">{condition.label}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
          {[
            { icon: Droplets, label: 'Humidity', value: `${data.relative_humidity_2m}%`, color: '#38bdf8' },
            { icon: Wind, label: 'Wind', value: `${data.wind_speed_10m} km/h`, color: '#a78bfa' },
            { icon: Thermometer, label: 'Feels like', value: formatTemp(data.apparent_temperature), color: tempColor },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-3 glass rounded-xl p-3 group/stat hover:scale-[1.02] transition-transform">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}22` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">{label}</p>
                <p className="text-sm font-semibold text-slate-200">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

export default CurrentWeatherCard
