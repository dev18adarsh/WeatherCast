import type { WeatherInsight as Insight } from '../../utils/weatherAnalytics'

interface Props {
  insights: Insight[]
}

const typeStyles = {
  positive: { bg: 'bg-green-500/10', border: 'border-green-500/20', icon: 'text-green-400' },
  negative: { bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'text-red-400' },
  neutral: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'text-blue-400' },
  warning: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: 'text-orange-400' },
}

export default function WeatherInsights({ insights }: Props) {
  if (insights.length === 0) return null

  return (
    <div className="space-y-2">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">AI Insights</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {insights.map((insight, i) => {
          const style = typeStyles[insight.type]
          return (
            <div
              key={i}
              className={`${style.bg} ${style.border} border rounded-xl p-3 transition-all duration-200 hover:scale-[1.02]`}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-lg">{insight.icon}</span>
                <div className="min-w-0">
                  <p className={`text-xs font-semibold ${style.icon}`}>{insight.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{insight.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
