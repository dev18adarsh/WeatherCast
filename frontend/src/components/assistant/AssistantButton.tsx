import { MessageCircle, Sparkles } from 'lucide-react'

interface Props {
  onClick: () => void
  open: boolean
  hasData: boolean
}

export default function AssistantButton({ onClick, open, hasData }: Props) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl shadow-2xl transition-all duration-300 
        hover:scale-105 active:scale-95 group
        ${open
          ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-blue-500/30'
          : 'bg-gradient-to-br from-blue-500 to-purple-500 hover:shadow-blue-500/40 shadow-black/30'
        }`}
      aria-label="Toggle weather assistant"
    >
      {open ? (
        <Sparkles className="w-6 h-6 text-white" />
      ) : (
        <MessageCircle className="w-6 h-6 text-white" />
      )}

      {!open && !hasData && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-slate-900" />
      )}

      {!open && (
        <span className="absolute -top-1 -right-1 w-3 h-3">
          <span className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-75" />
          <span className="absolute inset-0 bg-amber-400 rounded-full" />
        </span>
      )}
    </button>
  )
}
