import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { formatTime, formatTemp, getWeatherCondition } from '../utils/weatherCodes'
import type { HourlyForecast } from '../types'

interface Props {
  hourly: HourlyForecast
}

export default function WeatherChart({ hourly }: Props) {
  const data = hourly.time.map((t, i) => ({
    time: formatTime(t),
    temp: hourly.temperature_2m[i],
    precip: hourly.precipitation_probability[i],
  }))

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-slate-400 mb-2">Temperature (°C)</p>
        <ResponsiveContainer width="100%" height={130}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={3} />
            <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 10, fill: '#94a3b8' }} width={30} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value: number) => [`${Math.round(value)}°C`, 'Temperature']}
            />
            <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div>
        <p className="text-xs text-slate-400 mb-2">Precipitation Probability (%)</p>
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={3} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} width={30} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value: number) => [`${value}%`, 'Precip chance']}
            />
            <Bar dataKey="precip" fill="#60a5fa" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
