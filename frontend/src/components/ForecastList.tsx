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
      temperature_2m: indices.map((i) => hourly.temperature_2m[i]),
      precipitation_probability: indices.map((i) => hourly.precipitation_probability[i]),
      weather_code: indices.map((i) => hourly.weather_code[i]),
    })
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold mb-3">7-Day Forecast</h3>
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
