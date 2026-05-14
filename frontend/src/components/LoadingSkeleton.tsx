export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-slate-800 rounded-2xl p-6 md:p-8">
        <div className="h-4 bg-slate-700 rounded w-40 mb-4" />
        <div className="h-12 bg-slate-700 rounded w-24 mb-2" />
        <div className="h-4 bg-slate-700 rounded w-32" />
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="h-3 bg-slate-700 rounded w-16 mb-2" />
              <div className="h-4 bg-slate-700 rounded w-12" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-5 bg-slate-700 rounded w-40 mb-3" />
        {[...Array(7)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-xl p-4 flex items-center gap-4">
            <div className="h-4 bg-slate-700 rounded w-20" />
            <div className="h-8 bg-slate-700 rounded w-8" />
            <div className="flex-1 h-4 bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
