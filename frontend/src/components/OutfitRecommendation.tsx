import { Sparkles, Shirt, Footprints, Backpack, Lightbulb, Gauge } from 'lucide-react'
import { getOutfitSuggestion } from '../utils/outfitSuggestions'

interface Props {
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  uvIndex: number
  weatherCode: number
}

export default function OutfitRecommendation({
  temperature,
  feelsLike,
  humidity,
  windSpeed,
  uvIndex,
  weatherCode,
}: Props) {
  const s = getOutfitSuggestion(temperature, feelsLike, humidity, windSpeed, uvIndex, weatherCode)

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 md:p-6 animate-fade-in-up group"
      style={{ background: `linear-gradient(135deg, ${s.bgFrom}, ${s.bgVia}, ${s.bgTo})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
              <Shirt className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Outfit</p>
              <h3 className="text-lg font-bold text-white">Recommendation</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm bg-white/10 border border-white/10"
              style={{ color: s.comfort.color }}
            >
              {s.comfort.emoji} {s.comfort.level}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 p-3.5 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider text-white/40 font-medium">
              <Shirt className="w-3 h-3" />
              Top
            </div>
            <div className="text-2xl">{s.top.emoji}</div>
            <div className="text-xs text-white/80 font-medium leading-tight">{s.top.item}</div>
          </div>

          <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 p-3.5 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider text-white/40 font-medium">
              <Footprints className="w-3 h-3" />
              Bottom
            </div>
            <div className="text-2xl">{s.bottom.emoji}</div>
            <div className="text-xs text-white/80 font-medium leading-tight">{s.bottom.item}</div>
          </div>

          <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 p-3.5 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider text-white/40 font-medium">
              <Footprints className="w-3 h-3" />
              Shoes
            </div>
            <div className="text-2xl">{s.footwear.emoji}</div>
            <div className="text-xs text-white/80 font-medium leading-tight">{s.footwear.item}</div>
          </div>
        </div>

        {s.accessories.length > 0 && (
          <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/40 font-medium">
              <Backpack className="w-3 h-3" />
              Accessories
            </div>
            <div className="flex flex-wrap gap-2">
              {s.accessories.map((a, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/90 bg-white/10 backdrop-blur-sm border border-white/10"
                >
                  {a.emoji} {a.item}
                </span>
              ))}
            </div>
          </div>
        )}

        {s.extras.length > 0 && (
          <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/40 font-medium">
              <Lightbulb className="w-3 h-3" />
              Tips
            </div>
            <ul className="space-y-1.5">
              {s.extras.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-white/70">
                  <span className="text-white/30 mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
