import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts'
import type { TrendPoint } from '../../utils/weatherAnalytics'

interface Props {
  data: TrendPoint[]
  feelsLikeData: TrendPoint[]
}

export default function TempTrendChart({ data, feelsLikeData }: Props) {
  const combined = data.map((d, i) => ({
    label: d.label,
    temp: d.value,
    feelsLike: feelsLikeData[i]?.value,
  }))

  const avg = combined.reduce((a, b) => a + b.temp, 0) / combined.length

  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={combined}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="feelsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
          <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#64748b' }} interval={3} axisLine={false} tickLine={false} />
          <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 9, fill: '#64748b' }} width={30} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #ffffff15', borderRadius: 10, fontSize: 11, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <ReferenceLine y={avg} stroke="#475569" strokeDasharray="4 4" strokeWidth={1} />
          <Area type="monotone" dataKey="feelsLike" stroke="#a78bfa" strokeWidth={1.5} fill="url(#feelsGradient)" dot={false} strokeDasharray="4 3" />
          <Area type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={2.5} fill="url(#tempGradient)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 rounded bg-blue-400" />
          Temperature
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 rounded bg-purple-400" />
          Feels Like
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 rounded bg-slate-600 border-dashed" />
          Average
        </div>
      </div>
    </div>
  )
}
