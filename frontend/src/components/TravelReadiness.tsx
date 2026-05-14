import { useState, useEffect } from 'react'
import {
  Car,
  Footprints,
  Bike,
  Mountain,
  Gamepad2,
  Landmark,
  MapPin,
  Lightbulb,
  ShieldAlert,
  Clock,
  Gauge,
  CloudRain,
  Thermometer,
} from 'lucide-react'
import { getTravelReadiness } from '../utils/travelReadiness'
import type { CategoryScores } from '../utils/travelReadiness'

interface Props {
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  uvIndex: number
  visibility: number
  weatherCode: number
  rainProbability: number
  hourlyTime: string[]
  hourlyTemp: number[]
  hourlyRain: number[]
  hourlyCode: number[]
}

const categoryMeta: { key: keyof CategoryScores; icon: typeof Car; label: string }[] = [
  { key: 'driving', icon: Car, label: 'Driving' },
  { key: 'walking', icon: Footprints, label: 'Walking' },
  { key: 'cycling', icon: Bike, label: 'Cycling' },
  { key: 'trekking', icon: Mountain, label: 'Trekking' },
  { key: 'outdoorSports', icon: Gamepad2, label: 'Sports' },
  { key: 'tourism', icon: Landmark, label: 'Tourism' },
]

function scoreColor(s: number): string {
  if (s >= 80) return '#4ade80'
  if (s >= 60) return '#22d3ee'
  if (s >= 40) return '#fbbf24'
  if (s >= 20) return '#fb923c'
  return '#ef4444'
}

const circumference = 2 * Math.PI * 54

export default function TravelReadiness({
  temperature,
  feelsLike,
  humidity,
  windSpeed,
  uvIndex,
  visibility,
  weatherCode,
  rainProbability,
  hourlyTime,
  hourlyTemp,
  hourlyRain,
  hourlyCode,
}: Props) {
  const [animatedScore, setAnimatedScore] = useState(0)

  const s = getTravelReadiness(
    temperature, feelsLike, humidity, windSpeed, uvIndex,
    visibility, weatherCode, rainProbability,
    hourlyTime, hourlyTemp, hourlyRain, hourlyCode,
  )

  useEffect(() => {
    let start = 0
    const duration = 1000
    const step = 16
    const totalSteps = duration / step
    let current = 0
    const timer = setInterval(() => {
      current++
      const progress = Math.min(current / totalSteps, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(eased * s.overallScore))
      if (progress >= 1) clearInterval(timer)
    }, step)
    return () => clearInterval(timer)
  }, [s.overallScore])

  const offset = circumference - (animatedScore / 100) * circumference

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 md:p-6 animate-fade-in-up group"
      style={{ background: `linear-gradient(135deg, ${s.bgFrom}, ${s.bgVia}, ${s.bgTo})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Travel</p>
              <h3 className="text-lg font-bold text-white">Readiness</h3>
            </div>
          </div>
          <span
            className="text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm border"
            style={{
              backgroundColor: `${s.safetyColor}22`,
              color: s.safetyColor,
              borderColor: `${s.safetyColor}44`,
            }}
          >
            {animatedScore}/100 · {s.safetyLevel}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="shrink-0 relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="white" strokeWidth="8" opacity="0.1" />
              <circle
                cx="60" cy="60" r="54"
                fill="none"
                stroke={s.safetyColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-white drop-shadow-lg">{animatedScore}</span>
              <span className="text-[9px] uppercase tracking-wider text-white/50">Score</span>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-2 w-full">
            {[
              { icon: Clock, label: 'Best Time', value: s.bestTimeToTravel, color: '#a78bfa' },
              { icon: Gauge, label: 'Road', value: s.roadCondition, color: s.roadConditionColor },
              { icon: Thermometer, label: 'Comfort', value: s.outdoorComfort, color: s.outdoorComfortColor },
              { icon: CloudRain, label: 'Rain Risk', value: s.rainRisk, color: s.rainRiskColor },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3 h-3" style={{ color }} />
                  <span className="text-[9px] uppercase tracking-wider text-white/40 font-medium">{label}</span>
                </div>
                <p className="text-[11px] font-semibold text-white/90 leading-tight truncate">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {categoryMeta.map(({ key, icon: Icon, label }) => {
            const sc = s.categories[key]
            return (
              <div key={key} className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 p-2.5 text-center hover:bg-white/10 transition-colors">
                <Icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: scoreColor(sc) }} />
                <p className="text-[10px] text-white/50 font-medium truncate">{label}</p>
                <p className="text-sm font-bold" style={{ color: scoreColor(sc) }}>{sc}</p>
                <div className="mt-1 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${sc}%`, backgroundColor: scoreColor(sc) }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {s.risks.length > 0 && (
          <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/40 font-medium">
              <ShieldAlert className="w-3 h-3" />
              Risk Indicators
            </div>
            <div className="flex flex-wrap gap-1.5">
              {s.risks.map((r, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border"
                  style={{
                    backgroundColor: r.severity === 'high' ? '#ef444422' : r.severity === 'moderate' ? '#fbbf2422' : '#4ade8022',
                    color: r.severity === 'high' ? '#ef4444' : r.severity === 'moderate' ? '#fbbf24' : '#4ade80',
                    borderColor: r.severity === 'high' ? '#ef444444' : r.severity === 'moderate' ? '#fbbf2444' : '#4ade8044',
                  }}
                >
                  {r.label}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/5 p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/40 font-medium">
            <Lightbulb className="w-3 h-3" />
            Travel Tips
          </div>
          <ul className="space-y-1">
            {s.travelTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-white/70">
                <span className="text-white/30 mt-0.5 shrink-0">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
