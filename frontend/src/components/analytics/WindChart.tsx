import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import type { TrendPoint } from '../../utils/weatherAnalytics'

interface Props {
  data: TrendPoint[]
}

export default function WindChart({ data }: Props) {
  const chartData = data.map((d) => ({ label: d.label, value: d.value }))

  return (
    <ResponsiveContainer width="100%" height={140}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
        <XAxis dataKey="label" tick={{ fontSize: 8, fill: '#64748b' }} interval={4} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 8, fill: '#64748b' }} width={22} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#0f172a', border: '1px solid #ffffff15', borderRadius: 10, fontSize: 11 }}
          labelStyle={{ color: '#94a3b8' }}
          formatter={(value: number) => [`${value} km/h`, 'Wind']}
        />
        <Area type="monotone" dataKey="value" stroke="#a78bfa" strokeWidth={2} fill="url(#windGradient)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
