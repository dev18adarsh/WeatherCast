import { CalendarDays } from 'lucide-react'
import ForecastDay from './ForecastDay'
import type { DailyForecast, HourlyForecast } from '../types'

interface Props {
  daily: DailyForecast
  hourly: HourlyForecast
}

export default function ForecastList({ daily, hourly }: Props) {
  if (!daily.time.length) return null

  const hoursByDay: HourlyForecast[] = []
  for (let d = 0; d < daily.time.length; d++) {
    const dayStr = daily.time[d]
    const indices = hourly.time
      .map((t, i) => (t.startsWith(dayStr) ? i : -1))
      .filter((i) => i !== -1)
    hoursByDay.push({
      time: indices.map((i) => hourly.time[i]),
      temperature_2m: indices.map((i) => hourly.temperature_2m[i] ?? 0),
      relative_humidity_2m: indices.map((i) => hourly.relative_humidity_2m[i] ?? 0),
      apparent_temperature: indices.map((i) => hourly.apparent_temperature[i] ?? 0),
      precipitation_probability: indices.map((i) => hourly.precipitation_probability[i] ?? 0),
      weather_code: indices.map((i) => hourly.weather_code[i] ?? 0),
      wind_speed_10m: indices.map((i) => hourly.wind_speed_10m[i] ?? 0),
      uv_index: indices.map((i) => hourly.uv_index[i] ?? 0),
    })
  }

  return (
    <div className="space-y-2 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-blue-500/10">
          <CalendarDays className="w-4 h-4 text-blue-400" />
        </div>
        <h3 className="text-base font-bold text-slate-200 tracking-wide uppercase">7-Day Forecast</h3>
        <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-2" />
      </div>
      {daily.time.map((date, i) => (
        <ForecastDay
          key={date}
          dayIndex={i}
          date={date}
          maxTemp={daily.temperature_2m_max[i]}
          minTemp={daily.temperature_2m_min[i]}
          weatherCode={daily.weather_code[i]}
          precip={daily.precipitation_sum[i]}
          precipProb={daily.precipitation_probability_max[i]}
          wind={daily.wind_speed_10m_max[i]}
          hourly={hoursByDay[i]}
        />
      ))}
    </div>
  )
}
