import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts'
import type { TrendPoint } from '../../utils/weatherAnalytics'

interface Props {
  data: TrendPoint[]
}

export default function RainChart({ data }: Props) {
  const chartData = data.map((d) => ({ label: d.label, value: d.value }))

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
        <XAxis dataKey="label" tick={{ fontSize: 8, fill: '#64748b' }} interval={4} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 8, fill: '#64748b' }} width={22} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#0f172a', border: '1px solid #ffffff15', borderRadius: 10, fontSize: 11 }}
          labelStyle={{ color: '#94a3b8' }}
          formatter={(value: number) => [`${value}%`, 'Rain Probability']}
        />
        <ReferenceLine y={50} stroke="#475569" strokeDasharray="3 3" strokeWidth={1} />
        <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={8}>
          {chartData.map((entry, idx) => (
            <Cell key={idx} fill={entry.value > 70 ? '#ef4444' : entry.value > 40 ? '#f59e0b' : '#60a5fa'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
