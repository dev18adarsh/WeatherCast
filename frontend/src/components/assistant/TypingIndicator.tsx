export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 px-4 py-2">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
        AI
      </div>
      <div className="glass rounded-2xl rounded-tl-none px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '200ms' }} />
          <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '400ms' }} />
        </div>
      </div>
    </div>
  )
}
