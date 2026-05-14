export type ThemeId = 'cozy-rain' | 'sunny-vibes' | 'night-aesthetic' | 'cyberpunk-weather'

export interface ThemePreset {
  id: ThemeId
  label: string
  emoji: string
  gradient: string
  accentColor: string
  textColor: string
  secondaryText: string
  cardBg: string
  borderGlow: string
  decorativeColor: string
  fontStyle?: string
}

export const themes: ThemePreset[] = [
  {
    id: 'cozy-rain',
    label: 'Cozy Rain',
    emoji: '🌧️',
    gradient: 'linear-gradient(145deg, #1a1a3e 0%, #2d1b69 40%, #1a1a3e 100%)',
    accentColor: '#818cf8',
    textColor: '#f1f5f9',
    secondaryText: '#94a3b8',
    cardBg: 'rgba(255, 255, 255, 0.06)',
    borderGlow: 'rgba(129, 140, 248, 0.2)',
    decorativeColor: '#6366f1',
  },
  {
    id: 'sunny-vibes',
    label: 'Sunny Vibes',
    emoji: '☀️',
    gradient: 'linear-gradient(145deg, #f59e0b 0%, #f97316 40%, #fb923c 100%)',
    accentColor: '#fbbf24',
    textColor: '#1c1917',
    secondaryText: '#44403c',
    cardBg: 'rgba(255, 255, 255, 0.15)',
    borderGlow: 'rgba(251, 191, 36, 0.3)',
    decorativeColor: '#f59e0b',
  },
  {
    id: 'night-aesthetic',
    label: 'Night Aesthetic',
    emoji: '🌙',
    gradient: 'linear-gradient(145deg, #020024 0%, #090979 40%, #1a0533 100%)',
    accentColor: '#c084fc',
    textColor: '#f8fafc',
    secondaryText: '#a5b4fc',
    cardBg: 'rgba(255, 255, 255, 0.04)',
    borderGlow: 'rgba(192, 132, 252, 0.2)',
    decorativeColor: '#a855f7',
  },
  {
    id: 'cyberpunk-weather',
    label: 'Cyberpunk',
    emoji: '🌆',
    gradient: 'linear-gradient(145deg, #0a0a0a 0%, #1a0033 30%, #0a0020 70%, #001a1a 100%)',
    accentColor: '#ff006e',
    textColor: '#00fff5',
    secondaryText: '#ff006e',
    cardBg: 'rgba(255, 255, 255, 0.03)',
    borderGlow: 'rgba(255, 0, 110, 0.3)',
    decorativeColor: '#00fff5',
  },
]

export function getTheme(id: ThemeId): ThemePreset {
  return themes.find((t) => t.id === id) || themes[0]
}

export function getRandomTheme(): ThemePreset {
  return themes[Math.floor(Math.random() * themes.length)]
}
