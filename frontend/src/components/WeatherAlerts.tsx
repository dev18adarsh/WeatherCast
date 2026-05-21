import { AlertCircle, AlertTriangle, CloudRain, Wind, Sun } from 'lucide-react'
import type { WeatherData } from '../types'

interface Props {
  data: WeatherData
}

export default function WeatherAlerts({ data }: Props) {
  const alerts = []

  // UV Alert
  if (data.current.uv_index >= 8) {
    alerts.push({
      type: 'danger',
      icon: Sun,
      title: 'Extreme UV Index',
      message: 'UV levels are very high. Avoid sun exposure between 10am and 4pm.',
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20'
    })
  } else if (data.current.uv_index >= 6) {
    alerts.push({
      type: 'warning',
      icon: Sun,
      title: 'High UV Index',
      message: 'UV levels are high. Wear sunscreen and seek shade.',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20'
    })
  }

  // Wind Alert
  if (data.current.wind_speed_10m >= 50) {
    alerts.push({
      type: 'danger',
      icon: Wind,
      title: 'High Wind Warning',
      message: 'Dangerous wind speeds detected. Stay indoors if possible.',
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20'
    })
  } else if (data.current.wind_speed_10m >= 30) {
    alerts.push({
      type: 'warning',
      icon: Wind,
      title: 'Strong Winds',
      message: 'Strong winds may make outdoor activities difficult.',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    })
  }

  // Precipitation Alert
  const rainProb = data.daily.precipitation_probability_max[0]
  if (rainProb >= 80) {
    alerts.push({
      type: 'warning',
      icon: CloudRain,
      title: 'Heavy Rain Likely',
      message: `High chance (${rainProb}%) of precipitation today. Carry an umbrella.`,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20'
    })
  }

  if (alerts.length === 0) return null

  return (
    <div className="space-y-3">
      {alerts.map((alert, idx) => (
        <div 
          key={idx}
          className={`flex gap-4 p-4 rounded-2xl border ${alert.bg} ${alert.border} animate-fade-in-up`}
          style={{ animationDelay: `${idx * 0.1}s` }}
        >
          <div className={`p-2 rounded-xl h-fit ${alert.bg} ${alert.color}`}>
            <alert.icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              {alert.title}
              {alert.type === 'danger' && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {alert.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
