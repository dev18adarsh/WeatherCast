import { memo, useState } from 'react'
import { ChevronDown, ChevronUp, Droplets, Wind } from 'lucide-react'
import { getDayName, formatTemp, getTempColor, getEmoji } from '../utils/weatherCodes'
import WeatherChart from './WeatherChart'
import type { HourlyForecast } from '../types'

interface Props {
  dayIndex: number
  date: string
  maxTemp: number
  minTemp: number
  weatherCode: number
  precip: number
  precipProb: number
  wind: number
  hourly: HourlyForecast | null
}

const ForecastDay = memo(function ForecastDay({
  dayIndex, date, maxTemp, minTemp, weatherCode,
  precip, precipProb, wind, hourly,
}: Props) {
  const [expanded, setExpanded] = useState(dayIndex === 0)
  const maxColor = getTempColor(maxTemp)
  const minColor = getTempColor(minTemp)

  return (
    <div
      className="glass rounded-xl overflow-hidden transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${dayIndex * 0.08}s` }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-4 glass-hover transition-all"
      >
        <div className="w-24 shrink-0 text-left">
          <p className="text-sm font-semibold text-slate-200">{getDayName(date)}</p>
          <p className="text-[11px] text-slate-500">{date}</p>
        </div>
        <span className="text-2xl shrink-0 drop-shadow-lg">{getEmoji(weatherCode)}</span>
        <div className="flex-1">
          <div className="flex items-center justify-end gap-2">
            <span className="text-xs font-medium" style={{ color: minColor }}>{formatTemp(minTemp)}</span>
            <div className="relative w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="absolute inset-0 rounded-full transition-all duration-500"
                style={{
                  background: `linear-gradient(to right, ${minColor}, ${maxColor})`,
                  width: `${Math.abs(maxTemp - minTemp) * 4 + 30}%`,
                  left: `${Math.min(Math.max(minTemp / 50 * 100, 0), 70)}%`,
                }}
              />
            </div>
            <span className="text-sm font-bold" style={{ color: maxColor }}>{formatTemp(maxTemp)}</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500 shrink-0">
          <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-blue-400" />{precipProb}%</span>
          <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-purple-400" />{wind}</span>
        </div>
        <div className="p-1 rounded-full bg-white/5">
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>
      {expanded && hourly && (
        <div className="px-4 pb-4 border-t border-white/5 pt-4 animate-fade-in">
          <WeatherChart hourly={hourly} />
        </div>
      )}
    </div>
  )
})

export default ForecastDay
