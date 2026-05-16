import { Star, MapPin, X } from 'lucide-react'
import type { GeocodingResult } from '../types'

interface Props {
  favorites: GeocodingResult[]
  onSelect: (loc: GeocodingResult) => void
  onRemove: (id: number) => void
  isFavorite: (id: number) => boolean
  currentId?: number
}

export default function FavoritesBar({ favorites, onSelect, onRemove, isFavorite, currentId }: Props) {
  if (favorites.length === 0) return null

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
      <Star className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
      {favorites.map((fav) => (
        <div
          key={fav.id}
          className={`group flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
            fav.id === currentId
              ? 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300'
              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
          }`}
          onClick={() => onSelect(fav)}
        >
          <MapPin className="w-2.5 h-2.5" />
          <span className="truncate max-w-[80px]">{fav.name}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(fav.id) }}
            className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
            aria-label={`Remove ${fav.name} from favorites`}
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
