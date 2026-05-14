export type WeatherCondition = {
  label: string
  icon: string
}

export function getWeatherCondition(code: number): WeatherCondition {
  if (code === 0) return { label: 'Clear sky', icon: 'Sun' }
  if (code <= 2) return { label: 'Partly cloudy', icon: 'CloudSun' }
  if (code === 3) return { label: 'Overcast', icon: 'Cloud' }
  if (code <= 48) return { label: 'Foggy', icon: 'CloudFog' }
  if (code <= 57) return { label: 'Drizzle', icon: 'CloudDrizzle' }
  if (code <= 67) return { label: 'Rain', icon: 'CloudRain' }
  if (code <= 77) return { label: 'Snow', icon: 'CloudSnow' }
  if (code <= 82) return { label: 'Rain showers', icon: 'CloudRain' }
  if (code <= 86) return { label: 'Snow showers', icon: 'CloudSnow' }
  return { label: 'Thunderstorm', icon: 'CloudLightning' }
}

export function getDayName(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return date.toLocaleDateString('en-US', { weekday: 'long' })
}

export function formatTemp(temp: number): string {
  return `${Math.round(temp)}°`
}

export function formatTime(timeStr: string): string {
  const date = new Date(timeStr)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
}

export function getWindDirection(speed: number): string {
  if (speed < 5) return 'Calm'
  if (speed < 15) return 'Light breeze'
  if (speed < 25) return 'Moderate'
  if (speed < 35) return 'Strong'
  return 'Very strong'
}
