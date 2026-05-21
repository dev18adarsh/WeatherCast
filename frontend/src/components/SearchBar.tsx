import { Search, MapPin, Loader2, X, Clock, History, Star } from 'lucide-react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useGeocode } from '../hooks/useGeocode'
import type { GeocodingResult } from '../types'

interface Props {
  onSelect: (loc: GeocodingResult) => void
  onFavorite?: (loc: GeocodingResult) => void
  isFavorite?: (id: number) => boolean
}

const STORAGE_KEY = 'weatherRecentSearches'
const MAX_RECENT = 5

function getRecent(): GeocodingResult[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function addRecent(loc: GeocodingResult) {
  const recents = getRecent().filter((r) => r.id !== loc.id)
  recents.unshift(loc)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recents.slice(0, MAX_RECENT)))
}

function highlightMatch(text: string, query: string) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-blue-300 font-semibold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  )
}

export default function SearchBar({ onSelect, onFavorite, isFavorite }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [recents, setRecents] = useState<GeocodingResult[]>(getRecent)
  const { results, loading } = useGeocode(query)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mouseOnList = useRef(false)

  const showRecents = open && query.length === 0 && recents.length > 0
  const showResults = open && query.length >= 2
  const showNoResults = open && query.length >= 2 && !loading && results.length === 0
  const items = query.length >= 2 ? results : recents
  const totalItems = items.length

  useEffect(() => {
    if (query.length >= 2) {
      setOpen(true)
      setActiveIndex(-1)
    }
  }, [results, query.length])

  useEffect(() => {
    if (!focused && query.length === 0 && !mouseOnList.current) setOpen(false)
  }, [focused, query.length])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = useCallback((loc: GeocodingResult) => {
    addRecent(loc)
    setRecents(getRecent())
    onSelect(loc)
    setQuery(`${loc.name}, ${loc.country}`)
    setOpen(false)
    setActiveIndex(-1)
    inputRef.current?.blur()
  }, [onSelect])

  const clear = useCallback(() => {
    setQuery('')
    setOpen(false)
    setActiveIndex(-1)
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1))
    } else if (e.key === 'Enter' && activeIndex >= 0 && activeIndex < totalItems) {
      e.preventDefault()
      select(items[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
      inputRef.current?.blur()
    }
  }, [open, activeIndex, totalItems, items, select])

  const handleClearRecent = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    localStorage.removeItem(STORAGE_KEY)
    setRecents([])
  }, [])

  return (
    <div ref={ref} className="relative w-full max-w-xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-focus-within:opacity-100 blur-xl transition-all duration-700" />
        <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/20 group-focus-within:border-blue-400/40 transition-all duration-500">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 z-10 transition-colors duration-300 group-focus-within:text-blue-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { setFocused(true); if (query.length === 0 && recents.length > 0) setOpen(true) }}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a city..."
            className="w-full pl-14 pr-14 py-4 bg-transparent rounded-2xl text-white placeholder-slate-500 focus:outline-none text-[15px] tracking-wide"
          />
          {loading ? (
            <div className="absolute right-5 top-1/2 -translate-y-1/2 z-10">
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
            </div>
          ) : query ? (
              <button
                onClick={clear}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-all duration-300 z-10 p-1 rounded-lg hover:bg-white/10"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
          ) : null}
        </div>
      </div>

      {showRecents && (
              <ul
                onMouseEnter={() => { mouseOnList.current = true }}
                onMouseLeave={() => { mouseOnList.current = false }}
                className="absolute z-50 mt-3 w-full bg-slate-800/90 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-white/10 animate-fade-in-up"
              >
                <li className="px-5 py-3 flex items-center justify-between gap-2 border-b border-white/5">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-[0.15em] font-semibold">
                    <History className="w-3 h-3" />
                    Recent
                  </div>
                  <button
                    onMouseDown={handleClearRecent}
                    className="text-[9px] text-slate-500 hover:text-red-400 uppercase tracking-wider font-bold transition-colors"
                  >
                    Clear All
                  </button>
                </li>
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {recents.map((loc, idx) => (
              <li
                key={loc.id}
                onMouseDown={(e) => { e.preventDefault(); select(loc) }}
                className={`flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-all duration-200 border-b border-white/[0.03] last:border-0 relative overflow-hidden ${
                  idx === activeIndex
                    ? 'bg-blue-500/15'
                    : 'hover:bg-white/[0.06]'
                }`}
              >
                <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 ${
                  idx === activeIndex ? 'bg-blue-500/20 text-blue-300' : 'bg-white/5 text-slate-500'
                }`}>
                  <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white truncate">{loc.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}</div>
                </div>
                {idx === 0 && (
                  <span className="ml-auto text-[9px] text-blue-400/60 uppercase tracking-wider font-medium shrink-0">Last</span>
                )}
              </li>
            ))}
          </div>
        </ul>
      )}

      {showResults && (
        <ul
          onMouseEnter={() => { mouseOnList.current = true }}
          onMouseLeave={() => { mouseOnList.current = false }}
          className="absolute z-50 mt-3 w-full bg-slate-800/90 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-white/10 animate-fade-in-up"
        >
          <li className="px-5 py-3 flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-[0.15em] font-semibold border-b border-white/5">
            <MapPin className="w-3 h-3" />
            Results ({results.length})
          </li>
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {results.map((loc, idx) => (
              <li
                key={loc.id}
                onMouseDown={(e) => { e.preventDefault(); select(loc) }}
                className={`flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-all duration-200 border-b border-white/[0.03] last:border-0 relative overflow-hidden ${
                  idx === activeIndex
                    ? 'bg-blue-500/15'
                    : 'hover:bg-white/[0.06]'
                }`}
              >
                <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 ${
                  idx === activeIndex ? 'bg-blue-500/20 text-blue-300' : 'bg-white/5 text-blue-400'
                }`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white truncate">{highlightMatch(loc.name, query)}</div>
                  <div className="text-[11px] text-slate-400 truncate">{loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}</div>
                </div>
                <div className="ml-auto flex items-center gap-2 shrink-0">
                  {onFavorite && (
                    <button
                      onMouseDown={(e) => { e.stopPropagation(); e.preventDefault() }}
                      onClick={(e) => { e.stopPropagation(); onFavorite(loc) }}
                      className={`p-1 rounded-lg transition-all ${
                        isFavorite?.(loc.id) ? 'text-yellow-400' : 'text-slate-600 hover:text-yellow-400'
                      }`}
                      aria-label={isFavorite?.(loc.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star className="w-3.5 h-3.5" fill={isFavorite?.(loc.id) ? 'currentColor' : 'none'} />
                    </button>
                  )}
                  <span className="text-[10px] text-slate-600">
                    {loc.latitude.toFixed(1)}°N
                  </span>
                </div>
              </li>
            ))}
          </div>
        </ul>
      )}

      {showNoResults && (
        <div className="absolute z-50 mt-3 w-full bg-slate-800/90 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-white/10 animate-fade-in-up px-5 py-8 text-center">
          <div className="w-10 h-10 mx-auto mb-3 rounded-2xl bg-white/5 flex items-center justify-center">
            <Search className="w-5 h-5 text-slate-500" />
          </div>
          <p className="text-sm text-slate-400">
            No cities found for "<span className="text-slate-300 font-medium">{query}</span>"
          </p>
          <p className="text-[11px] text-slate-600 mt-1.5">Try a different search term</p>
        </div>
      )}
    </div>
  )
}
