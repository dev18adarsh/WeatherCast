import { Wind, AlertTriangle, ShieldCheck, Activity } from 'lucide-react'
import type { AirQuality } from '../types'

interface Props {
  aqi: AirQuality
}

export default function AirQualityCard({ aqi }: Props) {
  const getAQIInfo = (val: number) => {
    if (val <= 50) return { label: 'Good', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: ShieldCheck, desc: 'Air quality is satisfactory.' }
    if (val <= 100) return { label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: Activity, desc: 'Acceptable quality.' }
    if (val <= 150) return { label: 'Unhealthy for Sensitive Groups', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: AlertTriangle, desc: 'Sensitive groups may experience health effects.' }
    if (val <= 200) return { label: 'Unhealthy', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertTriangle, desc: 'Health effects can be expected.' }
    return { label: 'Very Unhealthy', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: AlertTriangle, desc: 'Health alert: serious effects.' }
  }

  const info = getAQIInfo(aqi.us_aqi)

  return (
    <div className={`p-5 rounded-2xl border ${info.bg} ${info.border} backdrop-blur-xl transition-all duration-300 hover:scale-[1.01]`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${info.bg} ${info.color}`}>
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Air Quality</h3>
            <p className={`text-[10px] font-medium uppercase tracking-wider ${info.color}`}>{info.label}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-white">{aqi.us_aqi}</span>
          <span className="text-[10px] text-slate-500 block -mt-1 uppercase">US AQI</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        {info.desc}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">PM2.5</p>
          <p className="text-sm font-bold text-white">{aqi.pm2_5.toFixed(1)} <span className="text-[10px] font-normal text-slate-500">µg/m³</span></p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">PM10</p>
          <p className="text-sm font-bold text-white">{aqi.pm10.toFixed(1)} <span className="text-[10px] font-normal text-slate-500">µg/m³</span></p>
        </div>
      </div>
    </div>
  )
}
