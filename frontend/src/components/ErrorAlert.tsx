import { AlertCircle, X } from 'lucide-react'
import { useState } from 'react'

interface Props {
  message: string
}

export default function ErrorAlert({ message }: Props) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  return (
    <div className="flex items-start gap-3 glass border border-red-500/20 rounded-xl p-4 animate-fade-in">
      <div className="p-1 rounded-lg bg-red-500/10">
        <AlertCircle className="w-4 h-4 text-red-400" />
      </div>
      <p className="text-sm text-red-300 flex-1">{message}</p>
      <button onClick={() => setDismissed(true)} className="shrink-0 hover:text-red-200 transition-colors" aria-label="Dismiss error">
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  )
}
