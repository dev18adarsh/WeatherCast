import { useState, useRef, useEffect } from 'react'
import { Search, MapPin, Loader2 } from 'lucide-react'
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
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(loc: GeocodingResult) {
    onSelect(loc)
    setQuery(`${loc.name}, ${loc.country}`)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 animate-spin" />}
      </div>
      {open && (
        <ul className="absolute z-50 mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
          {results.map((loc) => (
            <li
              key={loc.id}
              onClick={() => handleSelect(loc)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-700 transition-colors"
            >
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <div className="text-sm font-medium">{loc.name}</div>
                <div className="text-xs text-slate-400">
                  {loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
