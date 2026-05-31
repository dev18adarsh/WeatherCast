import { computeComfort } from '../../utils/weatherAnalytics'
import type { Anomaly } from '../../utils/weatherAnalytics'

interface Props {
  temperature: number
  humidity: number
  anomalies: Anomaly[]
}

export default function ComfortAnalysis({ temperature, humidity, anomalies }: Props) {
  const comfort = computeComfort(temperature, humidity)
  const severityColors = { low: 'bg-yellow-500/20 text-yellow-400', moderate: 'bg-orange-500/20 text-orange-400', high: 'bg-red-500/20 text-red-400' }
  const typeIcons = { hot: '🔥', cold: '🥶', windy: '💨', humid: '💧', dry: '🏜️', rainy: '🌧️' }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#1e293b" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="34"
              fill="none"
              stroke={comfort.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(Math.min(comfort.index, 40) / 40) * 213.6} 213.6`}
              transform="rotate(-90 40 40)"
              style={{ transition: 'stroke-dasharray 1s ease-out' }}
            />
            <text x="40" y="36" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">{comfort.index}</text>
            <text x="40" y="50" textAnchor="middle" fill="#64748b" fontSize="8">score</text>
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{comfort.label === 'Cold' ? '🥶' : comfort.label === 'Cool' ? '🧊' : comfort.label === 'Comfortable' ? '😊' : comfort.label === 'Warm' ? '🌤️' : comfort.label === 'Hot' ? '🥵' : '🔥'}</span>
            <span className="text-sm font-semibold text-white">{comfort.label}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{comfort.description}</p>
        </div>
      </div>

      {anomalies.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Weather Anomalies</p>
          {anomalies.slice(0, 3).map((a, i) => (
            <div key={i} className={`flex items-start gap-2 p-2 rounded-lg ${severityColors[a.severity]}`}>
              <span className="text-sm">{typeIcons[a.type]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium capitalize">{a.type} — {a.severity}</p>
                <p className="text-[10px] opacity-70">{a.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
