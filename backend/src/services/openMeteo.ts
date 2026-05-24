const BASE_URL = 'https://api.open-meteo.com/v1'

export async function fetchGeocode(query: string) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Geocoding API error: ${res.status}`)
  return res.json()
}

export async function fetchWeather(lat: number, lng: number) {
  const weatherParams = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index,visibility',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset',
    hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,uv_index',
    timezone: 'auto',
    forecast_days: '7',
  })

  const aqParams = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    current: 'european_aqi,us_aqi,pm10,pm2_5',
    timezone: 'auto',
  })

  const [weatherRes, aqRes] = await Promise.all([
    fetch(`${BASE_URL}/forecast?${weatherParams}`),
    fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${aqParams}`)
  ])

  if (!weatherRes.ok) {
    const body = await weatherRes.json().catch(() => ({}))
    throw new Error(body.reason || `Weather API error: ${weatherRes.status}`)
  }
  if (!aqRes.ok) {
    const body = await aqRes.json().catch(() => ({}))
    throw new Error(body.reason || `Air Quality API error: ${aqRes.status}`)
  }

  const weatherData = await weatherRes.json()
  const aqData = await aqRes.json()

  return {
    ...weatherData,
    current: {
      ...weatherData.current,
      air_quality: aqData.current
    }
  }
}
