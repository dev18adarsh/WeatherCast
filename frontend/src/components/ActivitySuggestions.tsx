import { useState } from 'react'
import { Sparkles, Sun, CloudSun, Zap, MapPin } from 'lucide-react'
import { getActivitySuggestions, CATEGORIES, type CategoryId } from '../utils/activitySuggestions'

interface Props {
  temperature: number
  humidity: number
  windSpeed: number
  uvIndex: number
  weatherCode: number
  rainProbability: number
}

const typeColors: Record<string, string> = {
  outdoor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20',
  indoor: 'bg-blue-500/20 text-blue-300 border-blue-500/20',
  productivity: 'bg-amber-500/20 text-amber-300 border-amber-500/20',
  relaxation: 'bg-purple-500/20 text-purple-300 border-purple-500/20',
}

const typeLabels: Record<string, string> = {
  outdoor: 'Outside',
  indoor: 'Indoor',
  productivity: 'Productive',
  relaxation: 'Relax',
}

export default function ActivitySuggestions({
  temperature,
  humidity,
  windSpeed,
  uvIndex,
  weatherCode,
  rainProbability,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('fitness')

  const s = getActivitySuggestions(temperature, humidity, windSpeed, uvIndex, weatherCode, rainProbability)
  const activities = s.categories[activeCategory]

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 md:p-6 animate-fade-in-up group"
      style={{ background: `linear-gradient(135deg, ${s.bgFrom}, ${s.bgVia}, ${s.bgTo})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Activity</p>
              <h3 className="text-lg font-bold text-white">Suggestions</h3>
            </div>
          </div>
          <span className="text-2xl drop-shadow-xl">{s.energyEmoji}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 p-3 flex items-center gap-3">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <CloudSun className="w-4 h-4 text-yellow-300" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-wider text-white/40 font-medium">Best Time</p>
              <p className="text-xs text-white/80 font-medium leading-tight truncate">{s.bestTimeToGoOutside}</p>
            </div>
          </div>

          <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 p-3 flex items-center gap-3">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Sun className="w-4 h-4 text-orange-300" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] uppercase tracking-wider text-white/40 font-medium">Score</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${s.suitabilityScore}%`,
                      background: s.suitabilityScore >= 70
                        ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                        : s.suitabilityScore >= 40
                          ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                          : 'linear-gradient(90deg, #fb923c, #ef4444)',
                    }}
                  />
                </div>
                <span className="text-xs font-bold text-white/80 shrink-0">{s.suitabilityScore}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 p-3 flex items-center gap-3">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4" style={{ color: s.energyColor }} />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-white/40 font-medium">Energy Mood</p>
              <p className="text-xs font-bold" style={{ color: s.energyColor }}>{s.energyMood}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
                activeCategory === cat.id
                  ? 'bg-white/20 text-white border-white/20 shadow-lg'
                  : 'bg-white/5 text-white/60 border-white/5 hover:bg-white/10 hover:text-white/80'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {activities.map((a, i) => (
            <div
              key={`${a.name}-${i}`}
              className="group/card rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 p-3.5 hover:bg-white/10 hover:scale-[1.03] hover:border-white/20 transition-all duration-200 cursor-default"
            >
              <div className="text-2xl mb-1.5 text-center">{a.emoji}</div>
              <p className="text-xs font-medium text-white/90 text-center leading-tight truncate">{a.name}</p>
              <div className="mt-1.5 flex justify-center">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-medium uppercase tracking-wider border ${typeColors[a.type]}`}>
                  {typeLabels[a.type]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
