import { Share2 } from 'lucide-react'

interface Props {
  onClick: () => void
  disabled?: boolean
}

export default function ShareButton({ onClick, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium
        bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/20
        text-blue-400 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-500/30
        transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <Share2 className="w-3.5 h-3.5" />
      Share
    </button>
  )
}
