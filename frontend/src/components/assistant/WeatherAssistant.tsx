import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, Send, X, Mic, Sparkles } from 'lucide-react'
import type { WeatherData } from '../../types'
import {
  generateResponse,
  getQuickQuestions,
  generateAutoInsights,
} from '../../utils/weatherAssistant'
import AssistantMessage from './AssistantMessage'
import QuickQuestions from './QuickQuestions'
import TypingIndicator from './TypingIndicator'
import type { AssistantMessage as AMessage } from '../../utils/weatherAssistant'

interface Props {
  data: WeatherData | null
}

export default function WeatherAssistant({ data }: Props) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<AMessage[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [quickQuestions, setQuickQuestions] = useState<string[]>([])
  const [insights, setInsights] = useState<string[]>([])
  const [listening, setListening] = useState(false)
  const [showInsights, setShowInsights] = useState(true)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const initialized = useRef(false)

  useEffect(() => {
    if (data) {
      setQuickQuestions(getQuickQuestions(data))
      setInsights(generateAutoInsights(data))
    }
  }, [data])

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight
      }
    })
  }, [])

  useEffect(() => {
    if (open && !initialized.current) {
      initialized.current = true
      const greeting = data
        ? generateResponse('hello', data)
        : { text: '👋 Hi! Search for a city and I\'ll help you with the weather!', intent: 'greeting' as const }
      setMessages([{ role: 'assistant', text: greeting.text, intent: 'greeting' }])
    }
    scrollToBottom()
  }, [open, data, scrollToBottom])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  async function handleSend(text: string) {
    const q = text.trim()
    if (!q) return

    setMessages((prev) => [...prev, { role: 'user', text: q }])
    setInput('')
    setThinking(true)

    await new Promise((r) => setTimeout(r, 400 + Math.random() * 600))

    const response = generateResponse(q, data)
    setMessages((prev) => [...prev, { role: 'assistant', text: response.text, intent: response.intent }])
    setThinking(false)
    setShowInsights(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(input)
    }
  }

  function handleQuickSelect(q: string) {
    handleSend(q)
  }

  async function handleVoice() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      handleSend('voice-input')
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    setListening(true)

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setListening(false)
      setTimeout(() => handleSend(transcript), 200)
    }

    recognition.onerror = () => {
      setListening(false)
    }

    recognition.start()
  }

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-end sm:justify-end pointer-events-none">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto" onClick={() => setOpen(false)} />

      <div
        className="relative pointer-events-auto w-full sm:w-[400px] sm:max-w-[calc(100vw-2rem)] 
          h-[85vh] sm:h-[600px] sm:max-h-[calc(100vh-8rem)] sm:mb-4 sm:mr-4 
          glass rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-black/40 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 px-4 py-3 border-b border-white/5 flex items-center gap-3 bg-slate-900/50 backdrop-blur-xl">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white">Weather Assistant</h3>
            <p className="text-[10px] text-slate-500">Powered by live data</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {data && showInsights && insights.length > 0 && (
          <div className="shrink-0 px-4 py-2.5 border-b border-white/5 bg-blue-500/5">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shrink-0" />
              {insights.map((insight, i) => (
                <span key={i} className="text-xs text-slate-300">{insight}</span>
              ))}
            </div>
          </div>
        )}

        <div
          ref={listRef}
          className="flex-1 overflow-y-auto py-3 space-y-1 custom-scrollbar"
        >
          {messages.map((msg, i) => (
            <AssistantMessage key={i} message={msg} />
          ))}
          {thinking && <TypingIndicator />}

          {messages.length === 0 && !thinking && (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 border border-blue-500/10">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-base font-semibold text-white mb-1">Weather Assistant</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Ask me anything about the weather — rain, temperature, what to wear, or when to go out!
              </p>
            </div>
          )}
        </div>

        <div className="shrink-0">
          <QuickQuestions
            questions={quickQuestions}
            onSelect={handleQuickSelect}
            disabled={thinking}
          />

          <div className="px-4 py-3 border-t border-white/5">
            <div className="flex items-center gap-2 glass rounded-xl px-3 py-1.5">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={thinking ? 'Thinking...' : listening ? 'Listening...' : 'Ask about the weather...'}
                disabled={thinking}
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none min-w-0 disabled:opacity-50"
              />
              <button
                onClick={handleVoice}
                disabled={thinking}
                className={`p-1.5 rounded-lg transition-all ${
                  listening
                    ? 'text-red-400 bg-red-500/20 animate-pulse'
                    : 'text-slate-500 hover:text-white hover:bg-white/10'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || thinking}
                className="p-1.5 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
