import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import type { TrendPoint } from '../../utils/weatherAnalytics'

interface Props {
  highs: TrendPoint[]
  lows: TrendPoint[]
}

export default function DailyTrendCard({ highs, lows }: Props) {
  const combined = highs.map((h, i) => ({
    label: h.label,
    high: h.value,
    low: lows[i] !== undefined ? lows[i].value : h.value,
  }))

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={combined}>
        <defs>
          <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#f97316" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
        <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 9, fill: '#64748b' }} width={25} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#0f172a', border: '1px solid #ffffff15', borderRadius: 10, fontSize: 11 }}
          labelStyle={{ color: '#94a3b8' }}
        />
        <Area type="monotone" dataKey="high" stroke="#f97316" strokeWidth={2.5} fill="url(#highGradient)" dot={false} />
        <Area type="monotone" dataKey="low" stroke="#38bdf8" strokeWidth={2} fill="url(#lowGradient)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
