import { CloudSun } from 'lucide-react'

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
      <div className="glass rounded-full p-6 mb-6">
        <CloudSun className="w-12 h-12 text-blue-400/60" />
      </div>
      <h3 className="text-xl font-bold text-slate-300 mb-2">No weather data yet</h3>
      <p className="text-sm text-slate-500 text-center max-w-xs">
        Search for a city above to get the current weather and 7-day forecast.
      </p>
    </div>
  )
}
