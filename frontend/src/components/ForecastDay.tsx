import { memo, lazy, Suspense, useState } from 'react'
import { ChevronDown, ChevronUp, Droplets, Wind } from 'lucide-react'
import { getDayName, getTempColor, getEmoji } from '../utils/weatherCodes'
import { useUnit } from '../context/UnitContext'
import type { HourlyForecast } from '../types'

const WeatherChart = lazy(() => import('./WeatherChart'))

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
  const { formatTemp, formatSpeed } = useUnit()
  const maxColor = getTempColor(maxTemp)
  const minColor = getTempColor(minTemp)
  const isToday = dayIndex === 0

  return (
    <div
      className={`glass rounded-xl overflow-hidden transition-all duration-300 animate-fade-in-up hover:shadow-lg hover:shadow-black/20 card-shine ${
        isToday ? 'ring-1 ring-blue-500/30' : ''
      }`}
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
            <div className="relative w-20 sm:w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="absolute inset-0 rounded-full transition-all duration-700"
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
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10"><Droplets className="w-3 h-3 text-blue-400" />{precipProb}%</span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-500/10"><Wind className="w-3 h-3 text-purple-400" />{formatSpeed(wind)}</span>
        </div>
        <div className="p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>
      {expanded && hourly && (
        <div className="px-4 pb-4 border-t border-white/5 pt-4 animate-fade-in">
          <Suspense fallback={<div className="h-[200px] flex items-center justify-center"><div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /></div>}>
            <WeatherChart hourly={hourly} />
          </Suspense>
        </div>
      )}
    </div>
  )
})

export default ForecastDay
