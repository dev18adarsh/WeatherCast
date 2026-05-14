import { useEffect, useState } from 'react'
import type { AssistantMessage as AMessage } from '../../utils/weatherAssistant'

interface Props {
  message: AMessage
}

function parseText(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
    }
    return part.split('\n').map((line, j) => (
      <span key={`${i}-${j}`}>
        {j > 0 && <br />}
        {line}
      </span>
    ))
  })
}

function TypewriterText({ text, speed = 25 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const lines = text.split('\n')

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        setDone(true)
        clearInterval(timer)
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  if (!done) {
    return <span className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{displayed}<span className="animate-pulse text-blue-400">▌</span></span>
  }

  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => (
        <p key={i} className="text-slate-300 text-sm leading-relaxed">{parseText(line)}</p>
      ))}
    </div>
  )
}

export default function AssistantMessage({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex items-start gap-2.5 px-4 py-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      {isUser ? (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-[10px] text-white font-bold shrink-0 mt-0.5 shadow-lg shadow-blue-500/20">
          U
        </div>
      ) : (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[9px] text-white font-bold shrink-0 mt-0.5 shadow-lg shadow-purple-500/20">
          AI
        </div>
      )}

      <div
        className={`max-w-[85%] ${
          isUser
            ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/10 rounded-2xl rounded-tr-none'
            : 'glass rounded-2xl rounded-tl-none'
        } px-4 py-3`}
      >
        {isUser ? (
          <p className="text-sm text-white">{message.text}</p>
        ) : (
          <TypewriterText text={message.text} />
        )}
      </div>
    </div>
  )
}
