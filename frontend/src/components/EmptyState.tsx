import { CloudSun } from 'lucide-react'

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
      <CloudSun className="w-20 h-20 mb-4 text-slate-600" />
      <h3 className="text-lg font-medium text-slate-400 mb-2">No weather data yet</h3>
      <p className="text-sm text-slate-500 text-center max-w-xs">
        Search for a city to get the current weather and 7-day forecast.
      </p>
    </div>
  )
}
