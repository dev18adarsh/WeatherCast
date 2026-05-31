import { useMemo } from 'react'
import { getEmoji, getWeatherCondition } from '../../utils/weatherCodes'
import { getWeatherQuote, getMusicMoodLabel } from '../../utils/weatherQuotes'
import { useUnit } from '../../context/UnitContext'
import type { ThemeId, ThemePreset } from '../../utils/themePresets'
import { getTheme } from '../../utils/themePresets'
import type { WeatherData } from '../../types'

interface Props {
  data: WeatherData
  themeId: ThemeId
  musicMood: string | null
}

function DecorativeCircle({ color, size, top, left, blur = 60 }: { color: string; size: number; top: string; left: string; blur?: number }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        top,
        left,
        background: `radial-gradient(circle, ${color}0d, ${color}08, transparent)`,
        filter: `blur(${blur}px)`,
        transform: 'translate(-50%, -50%)',
      }}
    />
  )
}

function DecorativeGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%" className="opacity-[0.03]">
        <defs>
          <pattern id="cyber-grid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cyber-grid)" />
      </svg>
    </div>
  )
}

function DecorativeStars({ positions }: { positions: Array<{ width: number; height: number; top: string; left: string; opacity: number }> }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {positions.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: p.width,
            height: p.height,
            top: p.top,
            left: p.left,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  )
}

function DecorativeRainDrops({ positions }: { positions: Array<{ height: string; left: string; top: string; opacity: number }> }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {positions.map((p, i) => (
        <div
          key={i}
          className="absolute w-px"
          style={{
            height: p.height,
            left: p.left,
            top: p.top,
            opacity: p.opacity,
            background: 'linear-gradient(to bottom, rgba(129,140,248,0.4), transparent)',
            transform: `rotate(15deg)`,
          }}
        />
      ))}
    </div>
  )
}

export default function ShareCard({ data, themeId, musicMood }: Props) {
  const { formatTemp } = useUnit()
  const theme = getTheme(themeId)
  const condition = getWeatherCondition(data.current.weather_code)
  const emoji = getEmoji(data.current.weather_code)
  const quote = getWeatherQuote(data.current.weather_code, data.current.temperature_2m)
  const musicLabel = getMusicMoodLabel(musicMood)
  const locationParts = data.locationName.split(',').map((s) => s.trim())
  const city = locationParts[0] || data.locationName
  const country = locationParts[1] || ''
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })

  const starPositions = useMemo(() =>
    Array.from({ length: 15 }, () => ({
      width: 1 + Math.random() * 2,
      height: 1 + Math.random() * 2,
      top: `${Math.random() * 60}%`,
      left: `${Math.random() * 90 + 5}%`,
      opacity: 0.15 + Math.random() * 0.35,
    })), []
  )

  const rainPositions = useMemo(() =>
    Array.from({ length: 20 }, () => ({
      height: `${8 + Math.random() * 15}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 80}%`,
      opacity: 0.1 + Math.random() * 0.2,
    })), []
  )

  return (
    <div
      id="weather-share-card"
      style={{
        background: theme.gradient,
        width: '420px',
        minHeight: '560px',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', system-ui, sans-serif",
        borderRadius: '24px',
      }}
    >
      <DecorativeCircle color={theme.decorativeColor} size={300} top="5%" left="50%" />
      <DecorativeCircle color={theme.decorativeColor} size={200} top="80%" left="10%" blur={80} />
      <DecorativeCircle color={theme.accentColor} size={150} top="40%" left="85%" blur={70} />

      {themeId === 'night-aesthetic' && <DecorativeStars positions={starPositions} />}
      {themeId === 'cozy-rain' && <DecorativeRainDrops positions={rainPositions} />}
      {themeId === 'cyberpunk-weather' && <DecorativeGrid />}

      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: theme.secondaryText, fontWeight: 600, marginBottom: 4 }}>
              {theme.emoji} {theme.label}
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: theme.textColor, margin: 0, lineHeight: 1.2 }}>
              {city}
            </h2>
            {country && (
              <p style={{ fontSize: '12px', color: theme.secondaryText, margin: '2px 0 0', opacity: 0.7 }}>{country}</p>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', color: theme.textColor, fontWeight: 500 }}>{dateStr}</div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: '64px', lineHeight: 1, marginBottom: 8 }}>{emoji}</div>
          <div style={{ fontSize: '56px', fontWeight: 800, color: theme.textColor, lineHeight: 1, letterSpacing: '-2px' }}>
            {formatTemp(data.current.temperature_2m)}
          </div>
          <div style={{ fontSize: '16px', color: theme.secondaryText, fontWeight: 500, marginTop: 4 }}>
            {condition.label}
          </div>

          <div
            style={{
              marginTop: 20,
              padding: '12px 20px',
              background: theme.cardBg,
              borderRadius: 12,
              border: `1px solid ${theme.borderGlow}`,
              backdropFilter: 'blur(10px)',
              maxWidth: '80%',
            }}
          >
            <p style={{ fontSize: '13px', color: theme.textColor, fontStyle: 'italic', textAlign: 'center', margin: 0, lineHeight: 1.5, opacity: 0.9 }}>
              "{quote.text}"
            </p>
            <p style={{ fontSize: '11px', color: theme.secondaryText, textAlign: 'center', margin: '6px 0 0', opacity: 0.7 }}>
              — {quote.author}
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 16,
            borderTop: `1px solid ${theme.borderGlow}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: '18px' }}>🎵</div>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.secondaryText, opacity: 0.6 }}>Music Mood</div>
              <div style={{ fontSize: '12px', color: theme.textColor, fontWeight: 600 }}>{musicLabel}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect width="36" height="36" rx="6" fill={theme.cardBg} />
                <rect x="1" y="1" width="34" height="34" rx="5" stroke={theme.borderGlow} strokeWidth="0.5" />
                <text x="18" y="14" textAnchor="middle" fill={theme.textColor} fontSize="6" fontWeight="700" opacity="0.4">QR</text>
                <rect x="9" y="17" width="18" height="18" fill="none" stroke={theme.textColor} strokeWidth="1" opacity="0.3" rx="1" />
                <rect x="12" y="20" width="3" height="3" fill={theme.textColor} opacity="0.4" />
                <rect x="16" y="20" width="3" height="3" fill={theme.textColor} opacity="0.4" />
                <rect x="20" y="20" width="3" height="3" fill={theme.textColor} opacity="0.4" />
                <rect x="12" y="24" width="3" height="3" fill={theme.textColor} opacity="0.4" />
                <rect x="20" y="24" width="3" height="3" fill={theme.textColor} opacity="0.4" />
                <rect x="12" y="28" width="3" height="3" fill={theme.textColor} opacity="0.4" />
                <rect x="16" y="28" width="3" height="3" fill={theme.textColor} opacity="0.4" />
                <rect x="20" y="28" width="3" height="3" fill={theme.textColor} opacity="0.4" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.secondaryText, opacity: 0.6 }}>Shared from</div>
              <div style={{ fontSize: '11px', color: theme.textColor, fontWeight: 700 }}>WeatherCast 67</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
