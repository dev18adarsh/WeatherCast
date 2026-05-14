import { AlertCircle, X } from 'lucide-react'

interface Props {
  message: string
  onDismiss?: () => void
}

export default function ErrorAlert({ message, onDismiss }: Props) {
  return (
    <div className="flex items-start gap-3 bg-red-900/40 border border-red-800 rounded-xl p-4 text-red-200">
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
      <p className="text-sm flex-1">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 hover:text-red-100 transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
