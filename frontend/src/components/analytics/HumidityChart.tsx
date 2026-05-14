import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import type { TrendPoint } from '../../utils/weatherAnalytics'

interface Props {
  data: TrendPoint[]
}

export default function HumidityChart({ data }: Props) {
  const chartData = data.map((d) => ({ label: d.label, value: d.value }))

  return (
    <ResponsiveContainer width="100%" height={140}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
        <XAxis dataKey="label" tick={{ fontSize: 8, fill: '#64748b' }} interval={4} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 8, fill: '#64748b' }} width={22} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#0f172a', border: '1px solid #ffffff15', borderRadius: 10, fontSize: 11 }}
          labelStyle={{ color: '#94a3b8' }}
          formatter={(value: number) => [`${value}%`, 'Humidity']}
        />
        <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} fill="url(#humidityGradient)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
