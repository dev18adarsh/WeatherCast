export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="glass-strong rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-slate-600" />
          <div className="h-3 bg-slate-700/50 rounded w-36" />
        </div>
        <div className="h-14 bg-slate-700/30 rounded w-28 mb-2" />
        <div className="h-3 bg-slate-700/30 rounded w-24" />
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 glass rounded-xl p-3">
              <div className="w-9 h-9 rounded-lg bg-slate-700/30" />
              <div className="space-y-1.5">
                <div className="h-2 bg-slate-700/30 rounded w-12" />
                <div className="h-3 bg-slate-700/30 rounded w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-700/30 rounded w-32 mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="h-4 bg-slate-700/30 rounded w-16" />
            <div className="h-8 w-8 bg-slate-700/30 rounded-full" />
            <div className="flex-1 h-3 bg-slate-700/30 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
