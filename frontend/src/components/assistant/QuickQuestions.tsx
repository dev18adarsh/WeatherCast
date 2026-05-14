interface QuickQuestionsProps {
  questions: string[]
  onSelect: (q: string) => void
  disabled: boolean
}

export default function QuickQuestions({ questions, onSelect, disabled }: QuickQuestionsProps) {
  if (questions.length === 0) return null

  return (
    <div className="px-4 py-3 border-t border-white/5">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-2.5">
        Suggested questions
      </p>
      <div className="flex flex-wrap gap-1.5">
        {questions.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            disabled={disabled}
            className="px-3 py-1.5 rounded-xl text-xs bg-white/[0.04] hover:bg-white/[0.08] 
              border border-white/5 hover:border-white/10 text-slate-400 hover:text-slate-200
              transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}
