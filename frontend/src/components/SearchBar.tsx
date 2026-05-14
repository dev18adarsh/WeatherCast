import { Search, MapPin, Loader2, X, Clock } from 'lucide-react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useGeocode } from '../hooks/useGeocode'
import type { GeocodingResult } from '../types'

interface Props {
  onSelect: (loc: GeocodingResult) => void
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

export default function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [recents, setRecents] = useState<GeocodingResult[]>(getRecent)
  const { results, loading } = useGeocode(query)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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
    if (!focused && query.length === 0) setOpen(false)
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

  return (
    <div ref={ref} className="relative w-full max-w-xl mx-auto animate-fade-in-up">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition duration-500" />
        <div className="relative flex items-center">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { setFocused(true); if (query.length === 0 && recents.length > 0) setOpen(true) }}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a city..."
            className="w-full pl-12 pr-12 py-3.5 glass rounded-xl text-white placeholder-slate-400 focus:outline-none transition"
          />
          {loading ? (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5 animate-spin z-10" />
          ) : query ? (
            <button
              onClick={clear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>

      {showRecents && (
        <ul className="absolute z-50 mt-2 w-full glass rounded-xl overflow-hidden shadow-2xl border border-white/10 animate-fade-in">
          <li className="px-4 py-2 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Recent</li>
          {recents.map((loc, idx) => (
            <li
              key={loc.id}
              onClick={() => select(loc)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-white/5 last:border-0 ${
                idx === activeIndex ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <Clock className="w-4 h-4 text-slate-500 shrink-0" />
              <div>
                <div className="text-sm font-medium">{loc.name}</div>
                <div className="text-xs text-slate-400">{loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}</div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showResults && (
        <ul className="absolute z-50 mt-2 w-full glass rounded-xl overflow-hidden shadow-2xl border border-white/10 animate-fade-in">
          {results.map((loc, idx) => (
            <li
              key={loc.id}
              onClick={() => select(loc)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-white/5 last:border-0 ${
                idx === activeIndex ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <div className="text-sm font-medium">{highlightMatch(loc.name, query)}</div>
                <div className="text-xs text-slate-400">{loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}</div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showNoResults && (
        <div className="absolute z-50 mt-2 w-full glass rounded-xl overflow-hidden shadow-2xl border border-white/10 animate-fade-in px-4 py-6 text-center">
          <p className="text-sm text-slate-400">No cities found for "<span className="text-slate-300">{query}</span>"</p>
        </div>
      )}
    </div>
  )
}
