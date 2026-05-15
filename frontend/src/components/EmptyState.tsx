import { CloudSun, Search } from 'lucide-react'

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-in-up">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-breathe" />
        <div className="glass rounded-full p-6 relative">
          <CloudSun className="w-14 h-14 text-blue-400/80" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Welcome to WeatherCast</h3>
      <p className="text-sm text-slate-400 text-center max-w-sm leading-relaxed">
        Search for a city above to get current weather conditions, 
        7-day forecast, and AI-powered insights.
      </p>
      <div className="flex items-center gap-2 mt-6 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-500">
        <Search className="w-3 h-3" />
        Try searching "New York", "Tokyo", "London"...
      </div>
    </div>
  )
}
