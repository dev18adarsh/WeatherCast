import { Search, MapPin, Loader2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useGeocode } from '../hooks/useGeocode'
import type { GeocodingResult } from '../types'

interface Props {
  onSelect: (loc: GeocodingResult) => void
}

export default function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const { results, loading } = useGeocode(query)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(results.length > 0)
  }, [results])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative w-full max-w-xl mx-auto animate-fade-in-up">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition duration-500" />
        <div className="relative flex items-center">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a city..."
            className="w-full pl-12 pr-4 py-3.5 glass rounded-xl text-white placeholder-slate-400 focus:outline-none transition"
          />
          {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5 animate-spin z-10" />}
        </div>
      </div>
      {open && (
        <ul className="absolute z-50 mt-2 w-full glass rounded-xl overflow-hidden shadow-2xl border-white/10 animate-fade-in">
          {results.map((loc) => (
            <li
              key={loc.id}
              onClick={() => { onSelect(loc); setQuery(`${loc.name}, ${loc.country}`); setOpen(false) }}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer glass-hover transition-colors border-b border-white/5 last:border-0"
            >
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <div className="text-sm font-medium">{loc.name}</div>
                <div className="text-xs text-slate-400">{loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
