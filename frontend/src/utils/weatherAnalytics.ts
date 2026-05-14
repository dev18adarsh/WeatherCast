import type { WeatherData, HourlyForecast, DailyForecast } from '../types'

export interface TrendPoint {
  label: string
  value: number
  time: string
}

export interface AnalyticsData {
  tempTrend: TrendPoint[]
  feelsLikeTrend: TrendPoint[]
  humidityTrend: TrendPoint[]
  rainTrend: TrendPoint[]
  windTrend: TrendPoint[]
  uvTrend: TrendPoint[]
  dailyHighs: TrendPoint[]
  dailyLows: TrendPoint[]
}

export interface ComfortMetric {
  index: number
  label: string
  color: string
  description: string
}

export interface Anomaly {
  type: 'hot' | 'cold' | 'windy' | 'humid' | 'dry' | 'rainy'
  severity: 'low' | 'moderate' | 'high'
  detail: string
}

export interface WeatherInsight {
  icon: string
  title: string
  description: string
  type: 'positive' | 'negative' | 'neutral' | 'warning'
}

function formatHour(time: string): string {
  const d = new Date(time)
  const h = d.getHours()
  const amPm = h >= 12 ? 'PM' : 'AM'
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${hour12}${amPm}`
}

function formatDay(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return d.toLocaleDateString('en-US', { weekday: 'short' })
}

export function computeAnalytics(hourly: HourlyForecast): AnalyticsData {
  const now = new Date()
  const currentHour = now.getHours()
  const next24 = hourly.time
    .map((t, i) => ({ time: t, idx: i }))
    .filter((h) => {
      const hour = new Date(h.time).getHours()
      return hour >= currentHour || (new Date(h.time).getDate() > now.getDate())
    })
    .slice(0, 24)

  const mapPoints = (extract: (idx: number) => number): TrendPoint[] =>
    next24.map((h) => ({
      label: formatHour(h.time),
      value: extract(h.idx),
      time: h.time,
    }))

  return {
    tempTrend: mapPoints((i) => hourly.temperature_2m[i]),
    feelsLikeTrend: mapPoints((i) => hourly.apparent_temperature[i] ?? hourly.temperature_2m[i]),
    humidityTrend: mapPoints((i) => hourly.relative_humidity_2m[i] ?? 50),
    rainTrend: mapPoints((i) => hourly.precipitation_probability[i] ?? 0),
    windTrend: mapPoints((i) => hourly.wind_speed_10m[i] ?? 0),
    uvTrend: mapPoints((i) => hourly.uv_index[i] ?? 0),
    dailyHighs: [],
    dailyLows: [],
  }
}

export function computeDailyTrends(daily: DailyForecast): {
  highs: TrendPoint[]
  lows: TrendPoint[]
  rainTotal: number
} {
  return {
    highs: daily.time.map((t, i) => ({
      label: formatDay(t),
      value: daily.temperature_2m_max[i],
      time: t,
    })),
    lows: daily.time.map((t, i) => ({
      label: formatDay(t),
      value: daily.temperature_2m_min[i],
      time: t,
    })),
    rainTotal: daily.precipitation_sum.reduce((a, b) => a + b, 0),
  }
}

export function computeComfort(temp: number, humidity: number): ComfortMetric {
  const index = temp - 0.55 * (1 - humidity / 100) * (temp - 14.5)

  if (index < 10) return { index: Math.round(index), label: 'Cold', color: '#38bdf8', description: 'Feels chilly — layer up!' }
  if (index < 15) return { index: Math.round(index), label: 'Cool', color: '#60a5fa', description: 'Mildly cool — a light jacket helps.' }
  if (index < 22) return { index: Math.round(index), label: 'Comfortable', color: '#4ade80', description: 'Pleasant conditions — enjoy!' }
  if (index < 27) return { index: Math.round(index), label: 'Warm', color: '#fbbf24', description: 'Getting warm — light clothing.' }
  if (index < 32) return { index: Math.round(index), label: 'Hot', color: '#fb923c', description: 'Quite hot — stay hydrated!' }
  return { index: Math.round(index), label: 'Very Hot', color: '#ef4444', description: 'Extreme heat — take precautions.' }
}

export function detectAnomalies(hourly: HourlyForecast, currentTemp: number, currentHumidity: number, currentWind: number): Anomaly[] {
  const anomalies: Anomaly[] = []
  const temps = hourly.temperature_2m
  const avg = temps.reduce((a, b) => a + b, 0) / temps.length
  const max = Math.max(...temps)
  const min = Math.min(...temps)

  if (currentTemp > avg + 8) anomalies.push({ type: 'hot', severity: currentTemp > avg + 12 ? 'high' : 'moderate', detail: `${Math.round(currentTemp)}° is significantly above the ${Math.round(avg)}° average` })
  if (currentTemp < avg - 8) anomalies.push({ type: 'cold', severity: currentTemp < avg - 12 ? 'high' : 'moderate', detail: `${Math.round(currentTemp)}° is well below the ${Math.round(avg)}° average` })
  if (max - min > 15) anomalies.push({ type: 'cold', severity: 'low', detail: `Wide temperature range today: ${Math.round(min)}° to ${Math.round(max)}°` })
  if (currentHumidity > 85) anomalies.push({ type: 'humid', severity: currentHumidity > 95 ? 'high' : 'moderate', detail: `Humidity at ${currentHumidity}% — very moist air` })
  if (currentHumidity < 20) anomalies.push({ type: 'dry', severity: 'moderate', detail: `Humidity at ${currentHumidity}% — unusually dry` })
  if (currentWind > 40) anomalies.push({ type: 'windy', severity: currentWind > 60 ? 'high' : 'moderate', detail: `Wind at ${currentWind} km/h — strong gusts` })

  return anomalies
}

export function generateInsights(
  analytics: AnalyticsData,
  daily: DailyForecast,
  currentTemp: number,
  currentHumidity: number,
  currentWind: number,
  currentUV: number
): WeatherInsight[] {
  const insights: WeatherInsight[] = []

  const temps = analytics.tempTrend.map((t) => t.value)
  const maxTemp = Math.max(...temps)
  const minTemp = Math.min(...temps)
  const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length

  if (maxTemp - minTemp < 5) {
    insights.push({ icon: '📊', title: 'Stable temperatures', description: `Temps staying within ${Math.round(minTemp)}–${Math.round(maxTemp)}° — a consistent day ahead.`, type: 'neutral' })
  } else {
    insights.push({ icon: '🌡️', title: 'Temperature range', description: `Ranging from ${Math.round(minTemp)}° to ${Math.round(maxTemp)}° today — plan accordingly.`, type: 'neutral' })
  }

  const rainPoints = analytics.rainTrend.filter((r) => r.value > 30)
  if (rainPoints.length > 6) {
    insights.push({ icon: '🌧️', title: 'Extended rain period', description: `Rain chances above 30% for ${rainPoints.length} hours — keep an umbrella handy.`, type: 'warning' })
  } else if (rainPoints.length > 0) {
    const peak = Math.max(...analytics.rainTrend.map((r) => r.value))
    insights.push({ icon: '🌦️', title: 'Intermittent rain', description: `Scattered rain chances up to ${peak}% — mostly dry with possible showers.`, type: 'neutral' })
  } else {
    insights.push({ icon: '☀️', title: 'Dry conditions', description: 'No significant rain expected — great for outdoor plans!', type: 'positive' })
  }

  const comfort = computeComfort(currentTemp, currentHumidity)
  insights.push({ icon: '😌', title: `Feels ${comfort.label}`, description: comfort.description, type: comfort.index < 15 || comfort.index > 30 ? 'warning' : 'positive' })

  const avgHumidity = analytics.humidityTrend.reduce((a, b) => a + b.value, 0) / analytics.humidityTrend.length
  if (avgHumidity > 70) {
    insights.push({ icon: '💧', title: 'High humidity', description: `Average humidity of ${Math.round(avgHumidity)}% — air feels heavy.`, type: 'negative' })
  } else if (avgHumidity < 35) {
    insights.push({ icon: '🏜️', title: 'Low humidity', description: `Average humidity of ${Math.round(avgHumidity)}% — dry air.`, type: 'neutral' })
  }

  const avgWind = analytics.windTrend.reduce((a, b) => a + b.value, 0) / analytics.windTrend.length
  if (avgWind > 25) {
    insights.push({ icon: '💨', title: 'Windy conditions', description: `Average wind of ${Math.round(avgWind)} km/h — hold onto your hat!`, type: 'warning' })
  } else if (avgWind < 5) {
    insights.push({ icon: '🍃', title: 'Calm winds', description: 'Light air movement — perfect for outdoor dining.', type: 'positive' })
  } else {
    insights.push({ icon: '🍃', title: 'Gentle breeze', description: `Pleasant wind at ${Math.round(avgWind)} km/h.`, type: 'positive' })
  }

  if (currentUV > 6) {
    insights.push({ icon: '☀️', title: 'High UV index', description: `UV at ${currentUV} — sunscreen and sunglasses recommended!`, type: 'warning' })
  } else if (currentUV < 3) {
    insights.push({ icon: '☁️', title: 'Low UV', description: 'Minimal UV exposure — no special protection needed.', type: 'positive' })
  }

  const weeklyRain = daily.precipitation_sum.reduce((a, b) => a + b, 0)
  if (weeklyRain > 30) {
    insights.push({ icon: '📈', title: 'Rainy week ahead', description: `Total ${weeklyRain.toFixed(1)}mm precipitation expected over the week.`, type: 'neutral' })
  }

  return insights.slice(0, 6)
}

export function getHottestPeriod(analytics: AnalyticsData): TrendPoint | null {
  if (analytics.tempTrend.length === 0) return null
  return analytics.tempTrend.reduce((a, b) => (a.value > b.value ? a : b))
}

export function getColdestPeriod(analytics: AnalyticsData): TrendPoint | null {
  if (analytics.tempTrend.length === 0) return null
  return analytics.tempTrend.reduce((a, b) => (a.value < b.value ? a : b))
}

export function getRainPattern(analytics: AnalyticsData): 'dry' | 'scattered' | 'steady' | 'heavy' {
  const rainValues = analytics.rainTrend.map((r) => r.value)
  const avg = rainValues.reduce((a, b) => a + b, 0) / rainValues.length
  const max = Math.max(...rainValues)
  const above30 = rainValues.filter((v) => v > 30).length

  if (avg < 10 && max < 30) return 'dry'
  if (above30 > 12) return max > 80 ? 'heavy' : 'steady'
  return 'scattered'
}
