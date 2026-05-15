function SkeletonBar({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer bg-[length:200%_100%]" />
      <div className="h-full w-full bg-slate-700/20" />
    </div>
  )
}

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="glass-strong rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-slate-600" />
          <SkeletonBar className="h-3 w-36" />
        </div>
        <SkeletonBar className="h-14 w-28 mb-2" />
        <SkeletonBar className="h-3 w-24" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 glass rounded-xl p-3">
              <SkeletonBar className="w-9 h-9 rounded-lg shrink-0" />
              <div className="space-y-1.5 flex-1">
                <SkeletonBar className="h-2 w-12" />
                <SkeletonBar className="h-3 w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <SkeletonBar className="h-4 w-32 mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass rounded-xl p-4 flex items-center gap-4">
            <SkeletonBar className="h-4 w-16" />
            <SkeletonBar className="h-8 w-8 rounded-full shrink-0" />
            <SkeletonBar className="flex-1 h-3" />
          </div>
        ))}
      </div>
    </div>
  )
}
