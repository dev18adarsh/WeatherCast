import type { WeatherData } from '../types'
import { getWeatherCondition, getEmoji, getWindDirection, formatTemp } from './weatherCodes'

export type AssistantIntent =
  | 'greeting'
  | 'rain'
  | 'temperature'
  | 'wind'
  | 'humidity'
  | 'feels_like'
  | 'umbrella'
  | 'outdoor_activity'
  | 'best_time'
  | 'clothing'
  | 'general'
  | 'forecast'
  | 'mood'
  | 'unknown'

export interface AssistantMessage {
  role: 'user' | 'assistant'
  text: string
  intent?: AssistantIntent
}

function getTimeGreeting(): string {
  const h = new Date().getHours()
  if (h < 6) return 'Up late'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Good night'
}

function getWeatherMood(weatherCode: number, temp: number): string {
  const code = weatherCode
  if (code === 0 && temp > 25) return '☀️ Bright & Sunny'
  if (code === 0) return '☀️ Clear & Crisp'
  if (code <= 2 && temp > 22) return '⛅ Warm & Breezy'
  if (code <= 2) return '⛅ Mild & Pleasant'
  if (code === 3) return '☁️ Overcast & Calm'
  if (code <= 48) return '🌫️ Misty & Mysterious'
  if (code <= 57) return '🌦️ Light & Fresh'
  if (code <= 67) return '🌧️ Rainy & Cozy'
  if (code <= 77) return '❄️ Snowy & Serene'
  if (code <= 82) return '🌦️ Showery & Fresh'
  if (code <= 86) return '🌨️ Wintry'
  return '⛈️ Stormy & Dramatic'
}

function getTemperatureFeeling(temp: number): string {
  if (temp <= -5) return 'freezing cold'
  if (temp <= 2) return 'very cold'
  if (temp <= 10) return 'chilly'
  if (temp <= 15) return 'cool'
  if (temp <= 22) return 'pleasantly warm'
  if (temp <= 28) return 'warm'
  if (temp <= 35) return 'hot'
  return 'very hot'
}

function getRainDescription(prob: number, precip: number): string {
  if (prob <= 10 && precip === 0) return 'no rain expected'
  if (prob <= 30) return 'a slight chance of rain'
  if (prob <= 50) return 'a decent chance of rain'
  if (prob <= 70) return 'rain is likely'
  return 'rain is very likely'
}

function assessUV(uv: number): string {
  if (uv <= 2) return 'low'
  if (uv <= 5) return 'moderate'
  if (uv <= 7) return 'high'
  if (uv <= 10) return 'very high'
  return 'extreme'
}

function getBestTimeToday(hourly: WeatherData['hourly']): { time: string; reason: string } | null {
  const now = new Date().getHours()
    const remaining = hourly.time
      .map((t, i) => ({ hour: new Date(t).getHours(), idx: i }))
      .filter((h) => {
        const hour = h.hour
        if (hour >= now) return hour < now + 8
        return hour + 24 < now + 8
      })

  if (remaining.length === 0) return null

  let best = remaining[0]
  let bestScore = -Infinity

  for (const r of remaining) {
    const temp = hourly.temperature_2m[r.idx]
    const rain = hourly.precipitation_probability[r.idx] ?? 0
    const code = hourly.weather_code[r.idx]
    let score = 0
    if (temp >= 18 && temp <= 28) score += 30
    else if (temp >= 10 && temp <= 30) score += 15
    else score -= 10
    if (rain <= 20) score += 30
    else if (rain <= 50) score += 10
    else score -= 20
    if (code <= 2) score += 20
    else if (code === 3) score += 5
    else score -= 10
    if (score > bestScore) {
      bestScore = score
      best = r
    }
  }

  const hour = best.hour
  const period = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  const amPm = hour < 12 ? 'AM' : 'PM'

  let reason = ''
  const t = hourly.temperature_2m[best.idx]
  const r = hourly.precipitation_probability[best.idx] ?? 0
  if (t >= 18 && t <= 28 && r <= 20) reason = 'comfortable temperatures with low rain chance'
  else if (r <= 20) reason = 'low chance of rain'
  else if (t >= 18) reason = 'pleasant temperature'
  else reason = 'relatively comfortable conditions'

  return { time: `${hour12}${amPm} (${period})`, reason }
}

export function detectIntent(query: string): AssistantIntent {
  const q = query.toLowerCase().trim()

  const greetings = ['hi', 'hello', 'hey', 'greetings', 'yo', 'sup', 'good morning', 'good afternoon', 'good evening', 'howdy']
  if (greetings.some((g) => q === g || q.startsWith(g + ' ') || q.startsWith(g + '!'))) return 'greeting'

  if (/\b(rain|raining|rainy|precip|precipitation|shower|drizzle|raindrop|wet)\b/.test(q)) return 'rain'
  if (/\b(umbrella|raincoat|rain jacket)\b/.test(q)) return 'umbrella'
  if (/\b(temp|temperature|hot|cold|warm|cool|chilly|freezing|degrees|°)\b/.test(q)) return 'temperature'
  if (/\b(wind|windy|breeze|breezy|gust)\b/.test(q)) return 'wind'
  if (/\b(humid|humidity|muggy|damp|stuffy)\b/.test(q)) return 'humidity'
  if (/\b(feel|feels like|feeling|apparent)\b/.test(q)) return 'feels_like'
  if (/\b(sport|exercise|run|jog|walk|outdoor|hike|bike|cycling|golf|tennis|football|soccer)\b/.test(q)) return 'outdoor_activity'
  if (/\b(best time|when should|good time|recommend.*time|what time)\b/.test(q)) return 'best_time'
  if (/\b(wear|clothes|clothing|dress|jacket|coat|sweater|shirt|outfit)\b/.test(q)) return 'clothing'
  if (/\b(forecast|today|tomorrow|week|upcoming|next day)\b/.test(q)) return 'forecast'
  if (/\b(mood|vibe|vibes|energy|feeling|cozy|atmosphere)\b/.test(q)) return 'mood'
  if (/\b(weather|how is|what'?s|tell me|about|condition|outside|look)\b/.test(q)) return 'general'

  return 'general'
}

function generateRainResponse(data: WeatherData): string {
  const today = data.daily
  const rainProb = today.precipitation_probability_max[0] ?? 0
  const precip = today.precipitation_sum[0] ?? 0
  const desc = getRainDescription(rainProb, precip)
  const currentHour = new Date().getHours()
  const hourlyRain = data.hourly.precipitation_probability
  const nextHours = hourlyRain.slice(currentHour, currentHour + 6).filter((r) => r !== undefined)
  const peakRain = Math.max(...nextHours, 0)

  let response = getEmoji(data.current.weather_code) + ' '
  if (rainProb <= 10) {
    response += `No rain in sight! ${desc}. You're good to go without an umbrella.`
  } else if (rainProb <= 30) {
    response += `Light chance of rain at ${rainProb}% — mostly dry but a stray shower isn't impossible.`
  } else if (rainProb <= 60) {
    response += `Rain is possible today (${rainProb}% chance). ${precip > 0 ? `Expected precipitation: ${precip}mm. ` : ''}Keep an eye on the sky!`
  } else {
    response += `Rain is quite likely today (${rainProb}% chance). ${precip > 0 ? `Expect about ${precip}mm of precipitation. ` : ''}`
    if (peakRain > 70) response += 'Some heavier bursts expected in the next few hours.'
    response += ' 🌂 Definitely grab an umbrella!'
  }

  const currentCode = data.current.weather_code
  if (currentCode >= 95) response += ' ⛈️ There may also be thunderstorms — stay indoors if possible.'
  else if (currentCode >= 61 && currentCode <= 67) response += ' Light to moderate rain is currently falling.'

  return response
}

function generateUmbrellaResponse(data: WeatherData): string {
  const rainProb = data.daily.precipitation_probability_max[0] ?? 0
  const currentCode = data.current.weather_code

  if (currentCode >= 61 || rainProb > 50) {
    return '☔ Yes, absolutely carry an umbrella! ' +
      (currentCode >= 61 ? 'It\'s raining right now.' : `There's a ${rainProb}% chance of rain today.`) +
      ' Better safe than soggy!'
  }
  if (rainProb > 25) {
    return `🌂 Might be worth bringing a compact umbrella — there's a ${rainProb}% chance of rain. Just in case!`
  }
    return `☀️ No umbrella needed today! The chance of rain is only ${rainProb}%. Enjoy the dry weather!`
}

function generateTemperatureResponse(data: WeatherData): string {
  const temp = data.current.temperature_2m
  const feel = getTemperatureFeeling(temp)
  const condition = getWeatherCondition(data.current.weather_code)
  const high = data.daily.temperature_2m_max[0]
  const low = data.daily.temperature_2m_min[0]

  let response = `${getEmoji(data.current.weather_code)} It's currently ${formatTemp(temp)} — ${feel}. `
  response += `The condition is "${condition.label}" today. `

  if (high !== undefined && low !== undefined) {
    response += `Today's range: ${formatTemp(low)} to ${formatTemp(high)}. `
  }

  if (temp <= 0) response += '🥶 Very cold — bundle up with layers, gloves and a warm coat!'
  else if (temp <= 10) response += '🧥 Quite chilly — a jacket or sweater is recommended.'
  else if (temp <= 18) response += '🧶 Comfortable but slightly cool — a light jacket should do.'
  else if (temp <= 25) response += '👕 Perfect temperature — light clothing works great!'
  else if (temp <= 32) response += '🫠 Warm out there — stay hydrated and wear breathable fabrics.'
  else response += '🥵 Extremely hot! Stay indoors during peak hours, drink plenty of water, and wear sunscreen.'

  return response
}

function generateFeelsLikeResponse(data: WeatherData): string {
  const temp = data.current.temperature_2m
  const feels = data.current.apparent_temperature
  const diff = Math.round(feels - temp)

  let response = `🌡️ The air temperature is ${formatTemp(temp)}, but it feels like ${formatTemp(feels)} outside. `

  if (Math.abs(diff) <= 1) {
    response += 'It feels pretty much exactly like the actual temperature — no wind chill or humidity effects to speak of.'
  } else if (diff < -3) {
    response += `That's ${Math.abs(diff)}° colder than the actual temp — wind chill is making it feel harsher. 🥶`
  } else if (diff < 0) {
    response += `Slightly cooler due to wind or moisture in the air.`
  } else if (diff > 5) {
    response += `That's ${diff}° warmer than the actual temp — humidity is making it feel much hotter! 🥵`
  } else {
    response += `Humidity is making it feel a bit warmer.`
  }

  if (data.current.relative_humidity_2m > 70) response += ' High humidity is the main factor here.'
  else if (data.current.wind_speed_10m > 30) response += ' Strong winds are dropping the feels-like temperature significantly.'

  return response
}

function generateWindResponse(data: WeatherData): string {
  const wind = data.current.wind_speed_10m
  const dir = getWindDirection(wind)

  let response = `${getEmoji(data.current.weather_code)} Wind is currently at ${wind} km/h — ${dir.toLowerCase()}. `

  if (wind <= 5) response += '🌬️ Calm conditions — barely a breeze.'
  else if (wind <= 15) response += '🍃 A light breeze — pleasant for a walk.'
  else if (wind <= 25) response += '💨 Moderate winds — noticeable but manageable.'
  else if (wind <= 35) response += '🌪️ Strong winds — hold onto your hat! Outdoor activities might be challenging.'
  else response += '🌀 Very strong winds! Caution advised if you\'re driving or cycling.'

  const maxWind = data.daily.wind_speed_10m_max[0]
  if (maxWind !== undefined && maxWind > wind) {
    response += ` Winds could gust up to ${maxWind} km/h later today.`
  }

  return response
}

function generateHumidityResponse(data: WeatherData): string {
  const h = data.current.relative_humidity_2m
  const temp = data.current.temperature_2m

  let response = `💧 Humidity is at ${h}%. `
  if (h <= 30) {
    response += 'Very dry air — your skin and sinuses might feel it. Stay hydrated!'
  } else if (h <= 45) {
    response += 'Comfortable humidity levels — not too dry, not too sticky.'
  } else if (h <= 60) {
    response += 'Moderate humidity — feels fine for most activities.'
  } else if (h <= 75) {
    response += 'Getting humid — air feels a bit heavy, especially if it\'s warm.'
  } else {
    response += 'High humidity — the air feels thick and sticky. '
    if (temp > 25) response += 'This makes the heat feel more oppressive. ☀️🥵'
    else response += 'May feel clammy and uncomfortable.'
  }

  return response
}

function generateOutdoorActivityResponse(data: WeatherData): string {
  const temp = data.current.temperature_2m
  const wind = data.current.wind_speed_10m
  const rainProb = data.daily.precipitation_probability_max[0] ?? 0
  const code = data.current.weather_code
  const condition = getWeatherCondition(code)

  let score = 100
  if (temp < 0 || temp > 38) score -= 40
  else if (temp < 5 || temp > 32) score -= 25
  else if (temp < 10 || temp > 28) score -= 10
  if (wind > 40) score -= 30
  else if (wind > 25) score -= 15
  else if (wind > 15) score -= 5
  if (rainProb > 70) score -= 40
  else if (rainProb > 40) score -= 20
  else if (rainProb > 20) score -= 5
  if (code >= 95) score -= 60
  else if (code >= 61) score -= 40
  else if (code >= 51) score -= 15

  score = Math.max(0, Math.min(100, score))

  let response = `${getEmoji(code)} Outdoor activity score: **${score}/100**. `
  response += `Currently ${condition.label.toLowerCase()}, ${formatTemp(temp)}. `

  if (score >= 80) response += '🌟 Perfect conditions for sports and outdoor activities! Go for it!'
  else if (score >= 60) response += '👍 Generally good for most activities — just keep an eye on the weather.'
  else if (score >= 40) response += '⚠️ Conditions are mixed — some activities might be okay, but check the details below.'
  else response += '❌ Not ideal for outdoor activities today — consider indoor alternatives.'

  const warnings: string[] = []
  if (temp > 35) warnings.push('extreme heat')
  if (temp < 0) warnings.push('freezing temperatures')
  if (rainProb > 60) warnings.push('high rain chance')
  if (wind > 30) warnings.push('strong winds')
  if (code >= 95) warnings.push('thunderstorm risk')
  if (data.current.uv_index > 7) warnings.push('very high UV — bring sunscreen')

  if (warnings.length > 0) {
    response += ` ⚠️ Note: ${warnings.join(', ')}.`
  }

  return response
}

function generateBestTimeResponse(data: WeatherData): string {
  const best = getBestTimeToday(data.hourly)
  const currentRain = data.daily.precipitation_probability_max[0] ?? 0
  const condition = getWeatherCondition(data.current.weather_code)

  let response = `${getEmoji(data.current.weather_code)} `

  if (best) {
    response += `The best time to go outside today is around **${best.time}** — ${best.reason}.`
  } else {
    if (currentRain > 70) response += 'Rain expected throughout the day. If you must go out, wait for a lull in the showers.'
    else if (condition.label.includes('Thunderstorm')) response += 'Thunderstorms are active — safest to stay indoors until they pass.'
    else response += 'Hard to pinpoint an ideal window — conditions are quite variable today.'
  }

  const code = data.current.weather_code
  const temp = data.current.temperature_2m
  if (code === 0 && temp >= 18 && temp <= 28) {
    response += ' ☀️ Honestly, right now is a great time with clear skies and pleasant temps!'
  }

  return response
}

function generateClothingResponse(data: WeatherData): string {
  const temp = data.current.temperature_2m
  const feels = data.current.apparent_temperature
  const rainProb = data.daily.precipitation_probability_max[0] ?? 0
  const wind = data.current.wind_speed_10m
  const code = data.current.weather_code
  const uv = data.current.uv_index

  let outfit = ''
  if (temp <= -5) outfit = '🧊 Thermal layers, heavy winter coat, gloves, scarf, and a warm hat. Insulated boots recommended.'
  else if (temp <= 2) outfit = '🧥 Heavy winter coat, sweater, gloves, and warm trousers. Don\'t forget a scarf!'
  else if (temp <= 10) outfit = '🧶 Warm jacket or thick hoodie with layers underneath. Jeans or trousers work well.'
  else if (temp <= 15) outfit = '🧥 Light jacket or sweater — a hoodie is perfect for this weather.'
  else if (temp <= 22) outfit = '👕 T-shirt with a light cardigan or flannel — comfortable and versatile.'
  else if (temp <= 28) outfit = '👚 Light clothing — t-shirt, shorts or skirt. Stay cool!'
  else if (temp <= 35) outfit = '🩳 Light, breathable fabrics — shorts, tank top, sun hat. Stay in the shade!'
  else outfit = '🩱 Minimal, loose clothing. Avoid dark colors. Stay in AC as much as possible!'

  let response = `${outfit} `

  if (rainProb > 40 || code >= 61) {
    response += '☔ Rain gear advised — bring a waterproof jacket or umbrella.'
  }
  if (wind > 25) {
    response += '💨 Wind-resistant outer layer recommended.'
  }
  if (uv > 5) {
    response += '🧴 Don\'t forget sunscreen and sunglasses — UV is ' + assessUV(uv) + ' today.'
  }
  if (Math.abs(feels - temp) > 3) {
    response += ` 🌡️ Remember it feels like ${formatTemp(feels)}, so dress for that rather than the actual temp.`
  }

  return response
}

function generateGeneralResponse(data: WeatherData): string {
  const condition = getWeatherCondition(data.current.weather_code)
  const temp = data.current.temperature_2m
  const feels = data.current.apparent_temperature
  const humidity = data.current.relative_humidity_2m
  const wind = data.current.wind_speed_10m
  const rainProb = data.daily.precipitation_probability_max[0] ?? 0
  const high = data.daily.temperature_2m_max[0]
  const low = data.daily.temperature_2m_min[0]

  let response = `${getEmoji(data.current.weather_code)} Here's your weather snapshot for **${data.locationName}**:\n\n`
  response += `🌡️ Currently **${formatTemp(temp)}** (feels like ${formatTemp(feels)}) — ${getTemperatureFeeling(temp)}.\n`
  response += `☁️ ${condition.label} — ${getRainDescription(rainProb, data.daily.precipitation_sum[0] ?? 0)}.\n`
  response += `💧 Humidity: ${humidity}% | 💨 Wind: ${wind} km/h (${getWindDirection(wind).toLowerCase()})`

  if (high !== undefined && low !== undefined) {
    response += `\n📊 Today's range: ${formatTemp(low)} – ${formatTemp(high)}`
  }

  const mood = getWeatherMood(data.current.weather_code, temp)
  response += `\n\n🎭 Weather vibe: ${mood}`

  if (data.current.uv_index > 6) response += '\n☀️ UV is high — sunscreen recommended!'
  if (rainProb > 50) response += '\n🌂 Don\'t forget your umbrella!'

  return response
}

function generateForecastResponse(data: WeatherData): string {
  const days = data.daily
  let response = `📅 Here's the forecast for **${data.locationName}**:\n\n`

  for (let i = 0; i < Math.min(days.time.length, 3); i++) {
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : new Date(days.time[i]).toLocaleDateString('en-US', { weekday: 'long' })
    const cond = getWeatherCondition(days.weather_code[i])
    const emoji = getEmoji(days.weather_code[i])
    response += `${emoji} **${dayName}**: ${cond.label}, ${formatTemp(days.temperature_2m_min[i])} – ${formatTemp(days.temperature_2m_max[i])}, ${days.precipitation_probability_max[i]}% rain\n`
  }

  response += `\n💡 ${generateTip(data)}`
  return response
}

function generateGreetingResponse(data: WeatherData | null): string {
  const greeting = getTimeGreeting()
  const mood = data ? getWeatherMood(data.current.weather_code, data.current.temperature_2m) : '🌤️'
  const location = data ? ` in **${data.locationName}**` : ''

  let response = `👋 **${greeting}!** Welcome to Kimi's Weather Assistant${location}.\n\n`
  if (data) {
    response += `${mood} — ${getTemperatureFeeling(data.current.temperature_2m)} ${data.locationName ? 'out there' : ''}.\n\n`
    response += `I can help you with:\n`
    response += `🌡️ Temperature & feels-like\n🌧️ Rain chances & umbrella advice\n💨 Wind & humidity\n🏃 Outdoor activity scores\n👕 Clothing recommendations\n📅 Forecasts\n\nWhat would you like to know?`
  } else {
    response += `I can help you with weather-related questions! Just search for a city and ask me anything about the weather.`
  }

  return response
}

function generateMoodResponse(data: WeatherData): string {
  const mood = getWeatherMood(data.current.weather_code, data.current.temperature_2m)
  const temp = data.current.temperature_2m
  const humidity = data.current.relative_humidity_2m
  const code = data.current.weather_code

  let response = `🎭 Today's weather mood: **${mood}**\n\n`

  if (code === 0 && temp > 22) {
    response += 'Perfect day to go outside, grab some coffee, and soak in the sunshine. Productive vibes! ☕'
  } else if (code === 0) {
    response += 'Crisp and clear — great for a morning walk or outdoor exercise. Fresh energy! 🌅'
  } else if (code <= 2 && temp > 20) {
    response += 'Warm with a light breeze — easygoing, relaxed vibes. Perfect for a picnic! 🧺'
  } else if (code <= 2) {
    response += 'Pleasant with passing clouds — balanced energy, good for both focus and relaxation. 😌'
  } else if (code === 3) {
    response += 'Overcast and calm — cozy indoor energy. Good day for reading or coding by the window. 📚'
  } else if (code <= 48) {
    response += 'Misty and mysterious — artsy, introspective vibes. Great for photography or journaling. 🎨'
  } else if (code <= 67) {
    response += 'Rainy and cozy — perfect for music, movies, or a nap with the sound of rain. 🎵☕'
  } else if (code <= 77) {
    response += 'Snowy and serene — magical, quiet energy. Hot chocolate weather! ☕❄️'
  } else if (code >= 95) {
    response += 'Dramatic thunderstorm energy — intense but exciting. Best enjoyed from indoors. ⚡'
  } else {
    response += 'Mixed conditions — flexible energy. Adaptable to whatever you\'re up to. 🎯'
  }

  if (temp < 10) response += '\n\n🥶 A bit cold — warm drinks and cozy blankets recommended.'
  if (humidity > 75) response += '\n\n💧 Air feels heavy — maybe stay in and keep things low-key.'

  return response
}

function generateTip(data: WeatherData): string {
  const temp = data.current.temperature_2m
  const rainProb = data.daily.precipitation_probability_max[0] ?? 0
  const wind = data.current.wind_speed_10m
  const uv = data.current.uv_index
  const code = data.current.weather_code

  const tips: string[] = []
  if (rainProb > 50) tips.push('🌂 Carry an umbrella')
  if (temp > 30) tips.push('🥤 Stay hydrated')
  if (temp < 5) tips.push('🧤 Wear warm layers')
  if (uv > 6) tips.push('🧴 Apply sunscreen')
  if (wind > 30) tips.push('🧥 Secure loose items outdoors')
  if (code >= 95) tips.push('⛈️ Stay indoors — thunderstorms nearby')

  return tips.length > 0 ? tips.join(' | ') : '☀️ Great weather — enjoy your day!'
}

export function generateAutoInsights(data: WeatherData): string[] {
  const insights: string[] = []
  const temp = data.current.temperature_2m
  const feels = data.current.apparent_temperature
  const rainProb = data.daily.precipitation_probability_max[0] ?? 0
  const wind = data.current.wind_speed_10m
  const code = data.current.weather_code

  if (rainProb > 60) insights.push(`🌧️ ${rainProb}% rain chance today — umbrella recommended`)
  else if (rainProb <= 10) insights.push('☀️ No rain expected today')

  if (temp > 30) insights.push(`🥵 ${formatTemp(temp)} — very hot, stay hydrated`)
  else if (temp < 5) insights.push(`🥶 ${formatTemp(temp)} — quite cold, dress warmly`)
  else if (temp >= 18 && temp <= 25 && rainProb <= 20) insights.push('🌟 Perfect weather today!')

  if (Math.abs(feels - temp) > 4) insights.push(`🌡️ Feels like ${formatTemp(feels)} (${feels > temp ? 'warmer' : 'cooler'} than actual)`)

  if (wind > 30) insights.push(`💨 Strong winds at ${wind} km/h`)

  if (code >= 95) insights.push('⛈️ Thunderstorm activity — stay safe indoors')

  if (code === 0) insights.push('☀️ Clear skies — great visibility')

  if (insights.length === 0) insights.push('🌤️ Mild conditions today')

  return insights.slice(0, 3)
}

export function generateResponse(query: string, data: WeatherData | null): { text: string; intent: AssistantIntent } {
  const intent = detectIntent(query)

  if (!data) {
    if (intent === 'greeting') return { text: generateGreetingResponse(null), intent }
    return {
      text: '👋 Hi! I\'d love to help, but I need some weather data first. Try searching for a city above, then ask me anything about the weather!',
      intent,
    }
  }

  let text: string
  switch (intent) {
    case 'greeting':
      text = generateGreetingResponse(data)
      break
    case 'rain':
      text = generateRainResponse(data)
      break
    case 'umbrella':
      text = generateUmbrellaResponse(data)
      break
    case 'temperature':
      text = generateTemperatureResponse(data)
      break
    case 'feels_like':
      text = generateFeelsLikeResponse(data)
      break
    case 'wind':
      text = generateWindResponse(data)
      break
    case 'humidity':
      text = generateHumidityResponse(data)
      break
    case 'outdoor_activity':
      text = generateOutdoorActivityResponse(data)
      break
    case 'best_time':
      text = generateBestTimeResponse(data)
      break
    case 'clothing':
      text = generateClothingResponse(data)
      break
    case 'forecast':
      text = generateForecastResponse(data)
      break
    case 'mood':
      text = generateMoodResponse(data)
      break
    case 'general':
    default:
      text = generateGeneralResponse(data)
      break
  }

  return { text, intent }
}

export function getQuickQuestions(data: WeatherData | null): string[] {
  const questions = [
    'Will it rain today?',
    'Should I carry an umbrella?',
    'What\'s the temperature?',
  ]

  if (!data) return questions

  const hour = new Date().getHours()
  if (hour >= 6 && hour <= 10) {
    questions.push('Good morning weather?')
  } else {
    questions.push('Best time to go outside?')
  }

  questions.push('Good for sports?')
  questions.push('What should I wear?')
  questions.push('How does it feel outside?')

  if (data.current.wind_speed_10m > 20) {
    questions.push('Is it windy?')
  }

  return questions.slice(0, 6)
}

export function getAssistantGreeting(data: WeatherData | null): string {
  return `👋 ${getTimeGreeting()}! ${data ? `${getWeatherMood(data.current.weather_code, data.current.temperature_2m)} out there. Ask me anything!` : 'Search a city to get started.'}`
}
