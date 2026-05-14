import { useState } from 'react'
import { ChevronDown, ChevronUp, Droplets, Wind } from 'lucide-react'
import { getDayName, formatTemp, getWeatherCondition } from '../utils/weatherCodes'
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

export default function ForecastDay({
  dayIndex, date, maxTemp, minTemp, weatherCode,
  precip, precipProb, wind, hourly,
}: Props) {
  const [expanded, setExpanded] = useState(dayIndex === 0)
  const condition = getWeatherCondition(weatherCode)

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden transition-all">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-4 hover:bg-slate-750 transition-colors"
      >
        <div className="w-24 shrink-0">
          <p className="text-sm font-medium">{getDayName(date)}</p>
          <p className="text-xs text-slate-400">{date}</p>
        </div>
        <span className="text-2xl shrink-0">{condition.label === 'Clear sky' ? '☀️' : condition.label.includes('Cloud') || condition.label === 'Overcast' ? '☁️' : condition.label.includes('Rain') || condition.label.includes('Drizzle') ? '🌧️' : condition.label.includes('Snow') ? '❄️' : condition.label.includes('Fog') ? '🌫️' : condition.label === 'Thunderstorm' ? '⛈️' : '☀️'}</span>
        <div className="flex-1 text-right">
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-slate-400">{formatTemp(minTemp)}</span>
            <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-orange-400 rounded-full"
                style={{ width: `${Math.abs(maxTemp - minTemp) * 5 + 30}%`, marginLeft: `${Math.min(minTemp + 10, 0) * 5 + 50}%` }}
              />
            </div>
            <span className="text-sm font-medium">{formatTemp(maxTemp)}</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400 shrink-0">
          <span className="flex items-center gap-1"><Droplets className="w-3 h-3" />{precipProb}%</span>
          <span className="flex items-center gap-1"><Wind className="w-3 h-3" />{wind} km/h</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {expanded && hourly && (
        <div className="px-4 pb-4">
          <WeatherChart hourly={hourly} />
        </div>
      )}
    </div>
  )
}
