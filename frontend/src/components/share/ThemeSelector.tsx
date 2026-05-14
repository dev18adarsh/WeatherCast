import type { ThemeId, ThemePreset } from '../../utils/themePresets'
import { themes } from '../../utils/themePresets'

interface Props {
  selected: ThemeId
  onSelect: (id: ThemeId) => void
}

export default function ThemeSelector({ selected, onSelect }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Theme</p>
      <div className="grid grid-cols-2 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onSelect(theme.id)}
            className={`relative rounded-xl p-3 text-left transition-all duration-200 overflow-hidden ${
              selected === theme.id
                ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900 scale-[1.02]'
                : 'hover:scale-[1.02]'
            }`}
            style={{ background: theme.gradient }}
          >
            {selected === theme.id && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <div className="text-lg mb-1">{theme.emoji}</div>
            <div className="text-xs font-semibold" style={{ color: theme.textColor }}>{theme.label}</div>
            <div className="text-[10px] mt-0.5" style={{ color: theme.secondaryText, opacity: 0.7 }}>{theme.id.replace('-', ' ')}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
