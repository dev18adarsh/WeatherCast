export interface CategoryScores {
  driving: number
  walking: number
  cycling: number
  trekking: number
  outdoorSports: number
  tourism: number
}

export interface RiskIndicator {
  label: string
  severity: 'low' | 'moderate' | 'high'
}

export interface HourInfo {
  time: string
  score: number
}

export interface TravelReadinessData {
  overallScore: number
  categories: CategoryScores
  safetyLevel: string
  safetyColor: string
  bestTimeToTravel: string
  roadCondition: string
  roadConditionColor: string
  outdoorComfort: string
  outdoorComfortColor: string
  rainRisk: string
  rainRiskColor: string
  travelTips: string[]
  risks: RiskIndicator[]
  bgFrom: string
  bgVia: string
  bgTo: string
}

function scoreVisibility(meters: number): number {
  if (meters >= 20000) return 1
  if (meters >= 10000) return 0.85
  if (meters >= 5000) return 0.6
  if (meters >= 2000) return 0.35
  if (meters >= 1000) return 0.15
  return 0
}

function scoreTemp(temp: number): number {
  if (temp >= 18 && temp <= 25) return 1
  if (temp >= 15 && temp < 18) return 0.8
  if (temp > 25 && temp <= 28) return 0.8
  if (temp >= 10 && temp < 15) return 0.55
  if (temp > 28 && temp <= 32) return 0.55
  if (temp >= 5 && temp < 10) return 0.3
  if (temp > 32 && temp <= 35) return 0.3
  if (temp < 5 || temp > 35) return 0.1
  return 0.5
}

function scoreRain(prob: number): number {
  if (prob <= 10) return 1
  if (prob <= 30) return 0.75
  if (prob <= 50) return 0.45
  if (prob <= 70) return 0.2
  return 0
}

function scoreWind(kmh: number): number {
  if (kmh <= 10) return 1
  if (kmh <= 20) return 0.75
  if (kmh <= 30) return 0.45
  if (kmh <= 40) return 0.2
  return 0
}

function scoreHumidity(pct: number): number {
  if (pct >= 30 && pct <= 60) return 1
  if ((pct >= 20 && pct < 30) || (pct > 60 && pct <= 75)) return 0.7
  if ((pct >= 10 && pct < 20) || (pct > 75 && pct <= 85)) return 0.35
  if (pct < 10 || pct > 85) return 0.1
  return 0.5
}

function scoreUV(uv: number): number {
  if (uv <= 2) return 1
  if (uv <= 5) return 0.8
  if (uv <= 7) return 0.5
  if (uv <= 10) return 0.3
  return 0.1
}

function estimateAQI(visibility: number, humidity: number, code: number): number {
  if (code >= 45 && code <= 48) return 0.15
  if (code >= 71 && code <= 86) return 0.2
  if (code >= 51 && code <= 67) return 0.5
  if (humidity >= 80 && visibility < 5000) return 0.3
  if (visibility >= 15000) return 0.95
  if (visibility >= 8000) return 0.75
  if (visibility >= 3000) return 0.5
  if (visibility >= 1000) return 0.3
  return 0.15
}

function computeCategoryScore(
  weights: { vis: number; temp: number; rain: number; wind: number; hum: number; uv: number; aqi: number },
  scores: { vis: number; temp: number; rain: number; wind: number; hum: number; uv: number; aqi: number },
): number {
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)
  return Math.round(
    ((scores.vis * weights.vis + scores.temp * weights.temp + scores.rain * weights.rain +
      scores.wind * weights.wind + scores.hum * weights.hum + scores.uv * weights.uv +
      scores.aqi * weights.aqi) / totalWeight) * 100,
  )
}

function getSafety(score: number): { level: string; color: string } {
  if (score >= 85) return { level: 'Excellent', color: '#4ade80' }
  if (score >= 70) return { level: 'Good', color: '#22d3ee' }
  if (score >= 55) return { level: 'Moderate', color: '#fbbf24' }
  if (score >= 35) return { level: 'Poor', color: '#fb923c' }
  return { level: 'Avoid Travel', color: '#ef4444' }
}

function getRoadCondition(rainProb: number, temp: number, visibility: number): { condition: string; color: string } {
  if (rainProb > 70) return { condition: 'Hazardous', color: '#ef4444' }
  if (rainProb > 40) return { condition: 'Poor', color: '#fb923c' }
  if (temp <= 0 && rainProb > 20) return { condition: 'Icy — Caution', color: '#fbbf24' }
  if (visibility < 2000) return { condition: 'Low Visibility', color: '#fbbf24' }
  if (visibility < 10000) return { condition: 'Moderate', color: '#22d3ee' }
  if (rainProb > 10) return { condition: 'Slightly Wet', color: '#22d3ee' }
  return { condition: 'Good', color: '#4ade80' }
}

function getOutdoorComfort(feelsLike: number, humidity: number): { comfort: string; color: string } {
  if (feelsLike >= 18 && feelsLike <= 26) return { comfort: 'Very Comfortable', color: '#4ade80' }
  if (feelsLike >= 15 && feelsLike < 18) return { comfort: 'Comfortable', color: '#22d3ee' }
  if (feelsLike > 26 && feelsLike <= 30) return { comfort: 'Comfortable', color: '#22d3ee' }
  if (feelsLike >= 10 && feelsLike < 15) return { comfort: 'Tolerable', color: '#fbbf24' }
  if (feelsLike > 30 && feelsLike <= 35) return { comfort: 'Tolerable', color: '#fbbf24' }
  if (humidity >= 75 && feelsLike >= 24) return { comfort: 'Sticky', color: '#fb923c' }
  if (feelsLike < 10 || feelsLike > 35) return { comfort: 'Uncomfortable', color: '#ef4444' }
  return { comfort: 'Moderate', color: '#fbbf24' }
}

function getRainRisk(prob: number, code: number): { risk: string; color: string } {
  if (code >= 95) return { risk: 'Severe Storm', color: '#ef4444' }
  if (prob >= 70 || (code >= 51 && code <= 67)) return { risk: 'High', color: '#ef4444' }
  if (prob >= 40) return { risk: 'Moderate', color: '#fb923c' }
  if (prob >= 15) return { risk: 'Slight', color: '#fbbf24' }
  return { risk: 'Low', color: '#4ade80' }
}

export function getTravelReadiness(
  temp: number,
  feelsLike: number,
  humidity: number,
  wind: number,
  uv: number,
  visibility: number,
  code: number,
  rainProb: number,
  hourlyTime: string[],
  hourlyTemp: number[],
  hourlyRain: number[],
  hourlyCode: number[],
): TravelReadinessData {
  const sVis = scoreVisibility(visibility)
  const sTemp = scoreTemp(temp)
  const sRain = scoreRain(rainProb)
  const sWind = scoreWind(wind)
  const sHum = scoreHumidity(humidity)
  const sUV = scoreUV(uv)
  const sAQI = estimateAQI(visibility, humidity, code)

  const scores = { vis: sVis, temp: sTemp, rain: sRain, wind: sWind, hum: sHum, uv: sUV, aqi: sAQI }

  const overallWeights = { vis: 15, temp: 20, rain: 20, wind: 15, hum: 10, uv: 10, aqi: 10 }
  const overallScore = computeCategoryScore(overallWeights, scores)

  const categories: CategoryScores = {
    driving: computeCategoryScore({ vis: 25, temp: 15, rain: 20, wind: 15, hum: 10, uv: 5, aqi: 10 }, scores),
    walking: computeCategoryScore({ vis: 10, temp: 25, rain: 20, wind: 10, hum: 10, uv: 20, aqi: 5 }, scores),
    cycling: computeCategoryScore({ vis: 10, temp: 20, rain: 20, wind: 25, hum: 10, uv: 10, aqi: 5 }, scores),
    trekking: computeCategoryScore({ vis: 25, temp: 20, rain: 15, wind: 15, hum: 10, uv: 10, aqi: 5 }, scores),
    outdoorSports: computeCategoryScore({ vis: 10, temp: 20, rain: 25, wind: 20, hum: 5, uv: 15, aqi: 5 }, scores),
    tourism: computeCategoryScore({ vis: 15, temp: 25, rain: 15, wind: 10, hum: 10, uv: 20, aqi: 5 }, scores),
  }

  const safety = getSafety(overallScore)
  const road = getRoadCondition(rainProb, temp, visibility)
  const comfort = getOutdoorComfort(feelsLike, humidity)
  const rainRisk = getRainRisk(rainProb, code)

  const { bestTime } = findBestTravelTime(hourlyTime, hourlyTemp, hourlyRain, hourlyCode)

  const risks: RiskIndicator[] = []
  if (rainRisk.risk === 'High' || rainRisk.risk === 'Severe Storm') risks.push({ label: `Rain: ${rainRisk.risk}`, severity: 'high' })
  else if (rainRisk.risk === 'Moderate') risks.push({ label: 'Rain likely', severity: 'moderate' })
  if (visibility < 3000) risks.push({ label: 'Low visibility', severity: 'high' })
  else if (visibility < 10000) risks.push({ label: 'Reduced visibility', severity: 'moderate' })
  if (wind >= 35) risks.push({ label: 'Strong winds', severity: 'high' })
  else if (wind >= 25) risks.push({ label: 'Windy', severity: 'moderate' })
  if (temp >= 35) risks.push({ label: 'Extreme heat', severity: 'high' })
  else if (temp >= 32) risks.push({ label: 'High heat', severity: 'moderate' })
  if (temp <= 0) risks.push({ label: 'Freezing temps', severity: 'high' })
  if (uv >= 8) risks.push({ label: 'High UV', severity: 'moderate' })
  if (road.condition === 'Icy — Caution') risks.push({ label: 'Icy roads', severity: 'high' })

  const travelTips = generateTips(temp, feelsLike, humidity, wind, uv, visibility, code, rainProb, overallScore)

  const { bgFrom, bgVia, bgTo } = getGradient(overallScore)

  return {
    overallScore,
    categories,
    safetyLevel: safety.level,
    safetyColor: safety.color,
    bestTimeToTravel: bestTime,
    roadCondition: road.condition,
    roadConditionColor: road.color,
    outdoorComfort: comfort.comfort,
    outdoorComfortColor: comfort.color,
    rainRisk: rainRisk.risk,
    rainRiskColor: rainRisk.color,
    travelTips,
    risks,
    bgFrom,
    bgVia,
    bgTo,
  }
}

function findBestTravelTime(
  times: string[],
  temps: number[],
  rains: number[],
  codes: number[],
): { bestTime: string } {
  const now = new Date()
  const currentHour = now.getHours()
  const todayStr = now.toISOString().slice(0, 10)

  let bestIdx = -1
  let bestScore = -1

  for (let i = 0; i < times.length && i < 24; i++) {
    const t = new Date(times[i])
    if (t.toISOString().slice(0, 10) !== todayStr) continue
    const h = t.getHours()
    if (h < currentHour) continue

    const tempScore = scoreTemp(temps[i] ?? 20)
    const rainScore = scoreRain(rains[i] ?? 0)
    let codeScore = 1
    const c = codes[i] ?? 0
    if (c >= 95) codeScore = 0
    else if ((c >= 51 && c <= 67) || (c >= 80 && c <= 82)) codeScore = 0.2
    else if (c >= 71 && c <= 86) codeScore = 0.3
    else if (c >= 45 && c <= 48) codeScore = 0.4

    const score = tempScore * 0.3 + rainScore * 0.5 + codeScore * 0.2
    if (score > bestScore) {
      bestScore = score
      bestIdx = i
    }
  }

  if (bestIdx === -1) {
    return { bestTime: 'Check forecast for better conditions' }
  }

  const bestHour = new Date(times[bestIdx]).getHours()
  const period = bestHour < 12 ? 'morning' : bestHour < 17 ? 'afternoon' : 'evening'
  const formatted = bestHour === 0 ? '12 AM' : bestHour < 12 ? `${bestHour} AM` : bestHour === 12 ? '12 PM' : `${bestHour - 12} PM`

  return { bestTime: `${formatted} (${period})` }
}

function generateTips(
  temp: number,
  feelsLike: number,
  humidity: number,
  wind: number,
  uv: number,
  visibility: number,
  code: number,
  rainProb: number,
  score: number,
): string[] {
  const tips: string[] = []

  if (score >= 85) tips.push('Perfect travel weather — enjoy your day outdoors!')
  else if (score >= 70) tips.push('Good conditions for most travel plans.')
  else if (score >= 55) tips.push('Conditions are moderate — plan accordingly.')
  else if (score >= 35) tips.push('Not ideal — consider postponing non-essential travel.')
  else tips.push('Weather is risky — avoid unnecessary travel.')

  if (rainProb > 50) tips.push('Carry an umbrella or raincoat.')
  if (wind >= 30) tips.push('Secure loose items and drive carefully.')
  if (visibility < 5000) tips.push('Use fog lights and drive slowly.')
  if (temp >= 32) tips.push('Stay hydrated and wear sunscreen.')
  if (temp <= 5) tips.push('Dress warmly and watch for ice.')
  if (uv >= 7) tips.push('Apply SPF 30+ sunscreen before heading out.')
  if (humidity >= 75) tips.push('Slight humidity detected — wear breathable clothing.')
  if (code >= 95) tips.push('Severe thunderstorm — stay indoors.')
  if (feelsLike !== temp && Math.abs(feelsLike - temp) > 5) {
    if (feelsLike < temp) tips.push('It feels colder than the actual temperature — dress warmer.')
    else tips.push('It feels hotter than the actual temperature — stay cool.')
  }

  return tips
}

function getGradient(score: number): { bgFrom: string; bgVia: string; bgTo: string } {
  if (score >= 80) return { bgFrom: '#065f46', bgVia: '#047857', bgTo: '#0d9488' }
  if (score >= 60) return { bgFrom: '#0e7490', bgVia: '#0d9488', bgTo: '#0369a1' }
  if (score >= 40) return { bgFrom: '#92400e', bgVia: '#a16207', bgTo: '#854d0e' }
  if (score >= 20) return { bgFrom: '#7c2d12', bgVia: '#9a3412', bgTo: '#92400e' }
  return { bgFrom: '#7f1d1d', bgVia: '#991b1b', bgTo: '#7f1d1d' }
}
