import { memo } from 'react'
import { Music, ExternalLink, Sparkles } from 'lucide-react'
import { getMusicSuggestion, getSpotifySearchUrl } from '../utils/musicSuggestions'

interface Props {
  weatherCode: number
  temperature: number
}

const MusicSuggestionCard = memo(function MusicSuggestionCard({ weatherCode, temperature }: Props) {
  const s = getMusicSuggestion(weatherCode, temperature)

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
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Mood Match</p>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">{s.mood}</h3>
            </div>
          </div>
          <span className="text-3xl drop-shadow-xl animate-float" role="img" aria-label={s.mood}>{s.emoji}</span>
        </div>

        <p className="text-sm text-white/70 leading-relaxed">{s.vibe}</p>

        <div className="flex flex-wrap gap-2">
          {s.genres.map((genre) => (
            <a
              key={genre}
              href={getSpotifySearchUrl(genre)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/90 bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 hover:scale-105 hover:border-white/20 transition-all duration-200 group/badge"
            >
              <Music className="w-3 h-3 shrink-0" />
              {genre}
              <ExternalLink className="w-2.5 h-2.5 opacity-0 -ml-1 group-hover/badge:opacity-100 group-hover/badge:ml-0.5 transition-all shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
})

export default MusicSuggestionCard
