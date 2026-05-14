import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts'
import type { TrendPoint } from '../../utils/weatherAnalytics'

interface Props {
  data: TrendPoint[]
}

function getUVColor(value: number): string {
  if (value <= 2) return '#4ade80'
  if (value <= 5) return '#fbbf24'
  if (value <= 7) return '#fb923c'
  if (value <= 10) return '#ef4444'
  return '#dc2626'
}

export default function UVChart({ data }: Props) {
  const chartData = data.map((d) => ({ label: d.label, value: d.value }))

  return (
    <div>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
          <XAxis dataKey="label" tick={{ fontSize: 8, fill: '#64748b' }} interval={4} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 11]} tick={{ fontSize: 8, fill: '#64748b' }} width={22} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #ffffff15', borderRadius: 10, fontSize: 11 }}
            labelStyle={{ color: '#94a3b8' }}
            formatter={(value: number) => [`${value}`, 'UV Index']}
          />
          <ReferenceLine y={3} stroke="#475569" strokeDasharray="3 3" strokeWidth={1} />
          <ReferenceLine y={6} stroke="#475569" strokeDasharray="3 3" strokeWidth={1} />
          <ReferenceLine y={8} stroke="#475569" strokeDasharray="3 3" strokeWidth={1} />
          <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={8}>
            {chartData.map((entry, idx) => (
              <rect key={idx} fill={getUVColor(entry.value)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-3 mt-2 text-[9px] text-slate-500">
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-400" /> Low</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-yellow-400" /> Moderate</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-orange-400" /> High</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-400" /> Very High</div>
      </div>
    </div>
  )
}
