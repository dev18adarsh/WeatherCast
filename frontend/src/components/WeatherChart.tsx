import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { formatTime } from '../utils/weatherCodes'
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
        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
          Temperature
        </p>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
            <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748b' }} interval={3} axisLine={false} tickLine={false} />
            <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 9, fill: '#64748b' }} width={25} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#0f172a', border: '1px solid #ffffff15', borderRadius: 10, fontSize: 11, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value: number) => [`${Math.round(value)}°C`, null]}
            />
            <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-300 inline-block" />
          Precipitation
        </p>
        <ResponsiveContainer width="100%" height={70}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
            <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748b' }} interval={3} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#64748b' }} width={25} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#0f172a', border: '1px solid #ffffff15', borderRadius: 10, fontSize: 11, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value: number) => [`${value}%`, null]}
            />
            <Bar dataKey="precip" fill="#60a5fa" radius={[3, 3, 0, 0]} opacity={0.7} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
