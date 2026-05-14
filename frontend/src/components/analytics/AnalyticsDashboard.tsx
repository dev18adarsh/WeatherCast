import { useMemo } from 'react'
import {
  Thermometer, Droplets, CloudRain, Wind, Sun, BarChart3,
  Activity, TrendingUp, ArrowUp, ArrowDown, Clock,
} from 'lucide-react'
import type { WeatherData } from '../../types'
import {
  computeAnalytics,
  computeDailyTrends,
  detectAnomalies,
  generateInsights,
  getHottestPeriod,
  getColdestPeriod,
  getRainPattern,
} from '../../utils/weatherAnalytics'
import AnalyticsCard from './AnalyticsCard'
import TempTrendChart from './TempTrendChart'
import HumidityChart from './HumidityChart'
import RainChart from './RainChart'
import WindChart from './WindChart'
import UVChart from './UVChart'
import ComfortAnalysis from './ComfortAnalysis'
import WeatherInsights from './WeatherInsights'
import DailyTrendCard from './DailyTrendCard'

interface Props {
  data: WeatherData
}

export default function AnalyticsDashboard({ data }: Props) {
  const analytics = useMemo(() => computeAnalytics(data.hourly), [data.hourly])
  const dailyTrends = useMemo(() => computeDailyTrends(data.daily), [data.daily])
  const anomalies = useMemo(
    () => detectAnomalies(data.hourly, data.current.temperature_2m, data.current.relative_humidity_2m, data.current.wind_speed_10m),
    [data]
  )
  const insights = useMemo(
    () => generateInsights(analytics, data.daily, data.current.temperature_2m, data.current.relative_humidity_2m, data.current.wind_speed_10m, data.current.uv_index),
    [analytics, data]
  )
  const hottest = useMemo(() => getHottestPeriod(analytics), [analytics])
  const coldest = useMemo(() => getColdestPeriod(analytics), [analytics])
  const rainPattern = useMemo(() => getRainPattern(analytics), [analytics])

  const statCards = [
    {
      label: 'Current',
      value: `${Math.round(data.current.temperature_2m)}°`,
      sub: `Feels ${Math.round(data.current.apparent_temperature)}°`,
      icon: Thermometer,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
    },
    {
      label: 'Humidity',
      value: `${data.current.relative_humidity_2m}%`,
      sub: anomalies.some((a) => a.type === 'humid') ? 'Above normal' : 'Normal range',
      icon: Droplets,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
    },
    {
      label: 'Wind',
      value: `${Math.round(data.current.wind_speed_10m)} km/h`,
      sub: data.current.wind_speed_10m > 25 ? 'Windy' : 'Calm',
      icon: Wind,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      label: 'UV Index',
      value: `${data.current.uv_index}`,
      sub: data.current.uv_index <= 2 ? 'Low' : data.current.uv_index <= 5 ? 'Moderate' : data.current.uv_index <= 7 ? 'High' : 'Very High',
      icon: Sun,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
    },
  ]

  const rainPatternMeta = {
    dry: { label: 'Dry', emoji: '☀️', color: 'text-green-400' },
    scattered: { label: 'Scattered', emoji: '🌦️', color: 'text-yellow-400' },
    steady: { label: 'Steady', emoji: '🌧️', color: 'text-orange-400' },
    heavy: { label: 'Heavy', emoji: '⛈️', color: 'text-red-400' },
  }[rainPattern]

  const weeklyRainTotal = data.daily.precipitation_sum.reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-5">
      <WeatherInsights insights={insights} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((card) => (
          <div key={card.label} className={`${card.bg} ${card.border} border rounded-xl p-3.5 transition-all duration-200 hover:scale-[1.02]`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">{card.label}</span>
              <card.icon className={`w-3.5 h-3.5 ${card.color}`} />
            </div>
            <p className="text-lg font-bold text-white">{card.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <AnalyticsCard title="Temperature Trend" accent="blue" icon={<Thermometer className="w-4 h-4" />}>
            <TempTrendChart data={analytics.tempTrend} feelsLikeData={analytics.feelsLikeTrend} />
            <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-500">
              {hottest && (
                <div className="flex items-center gap-1">
                  <ArrowUp className="w-3 h-3 text-red-400" />
                  Peak {hottest.label}: {Math.round(hottest.value)}°
                </div>
              )}
              {coldest && (
                <div className="flex items-center gap-1">
                  <ArrowDown className="w-3 h-3 text-blue-400" />
                  Low {coldest.label}: {Math.round(coldest.value)}°
                </div>
              )}
            </div>
          </AnalyticsCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <AnalyticsCard title="Humidity" accent="cyan" icon={<Droplets className="w-4 h-4" />}>
              <HumidityChart data={analytics.humidityTrend} />
            </AnalyticsCard>
            <AnalyticsCard title="Wind Speed" accent="purple" icon={<Wind className="w-4 h-4" />}>
              <WindChart data={analytics.windTrend} />
            </AnalyticsCard>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <AnalyticsCard title="Rain Probability" accent="orange" icon={<CloudRain className="w-4 h-4" />}>
              <RainChart data={analytics.rainTrend} />
              <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                <span>{rainPatternMeta.emoji} <span className={rainPatternMeta.color}>{rainPatternMeta.label}</span></span>
                <span>Week total: {weeklyRainTotal.toFixed(1)}mm</span>
              </div>
            </AnalyticsCard>
            <AnalyticsCard title="UV Index" accent="orange" icon={<Sun className="w-4 h-4" />}>
              <UVChart data={analytics.uvTrend} />
            </AnalyticsCard>
          </div>
        </div>

        <div className="space-y-5">
          <AnalyticsCard title="Weekly Trend" accent="green" icon={<BarChart3 className="w-4 h-4" />}>
            <DailyTrendCard highs={dailyTrends.highs} lows={dailyTrends.lows} />
          </AnalyticsCard>

          <AnalyticsCard title="Comfort Score" accent="green" icon={<Activity className="w-4 h-4" />}>
            <ComfortAnalysis
              temperature={data.current.temperature_2m}
              humidity={data.current.relative_humidity_2m}
              anomalies={anomalies}
            />
          </AnalyticsCard>

          <AnalyticsCard title="Quick Stats" accent="pink" icon={<TrendingUp className="w-4 h-4" />}>
            <div className="space-y-2.5">
              {[
                { label: 'High today', value: `${Math.round(data.daily.temperature_2m_max[0])}°`, icon: ArrowUp, color: 'text-orange-400' },
                { label: 'Low today', value: `${Math.round(data.daily.temperature_2m_min[0])}°`, icon: ArrowDown, color: 'text-blue-400' },
                { label: 'Rain chance', value: `${data.daily.precipitation_probability_max[0]}%`, icon: CloudRain, color: 'text-cyan-400' },
                { label: 'Wind max', value: `${data.daily.wind_speed_10m_max[0]} km/h`, icon: Wind, color: 'text-purple-400' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <stat.icon className={`w-3 h-3 ${stat.color}`} />
                    <span className="text-xs text-slate-400">{stat.label}</span>
                  </div>
                  <span className="text-xs font-semibold text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          </AnalyticsCard>
        </div>
      </div>
    </div>
  )
}
