import type { VercelRequest, VercelResponse } from '@vercel/node'

const BASE_URL = 'https://api.open-meteo.com/v1'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { lat, lng } = req.query

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Parameters "lat" and "lng" are required' })
  }

  const latNum = parseFloat(lat as string)
  const lngNum = parseFloat(lng as string)

  if (isNaN(latNum) || isNaN(lngNum)) {
    return res.status(400).json({ error: '"lat" and "lng" must be valid numbers' })
  }

  const weatherParams = new URLSearchParams({
    latitude: latNum.toString(),
    longitude: lngNum.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index,visibility',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset',
    hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,uv_index',
    timezone: 'auto',
    forecast_days: '7',
  })

  const aqParams = new URLSearchParams({
    latitude: latNum.toString(),
    longitude: lngNum.toString(),
    current: 'european_aqi,us_aqi,pm10,pm2_5',
    timezone: 'auto',
  })

  try {
    const [weatherResponse, aqResponse] = await Promise.all([
      fetch(`${BASE_URL}/forecast?${weatherParams}`),
      fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${aqParams}`)
    ])

    if (!weatherResponse.ok) {
      const body = await weatherResponse.json().catch(() => ({}))
      throw new Error(body.reason || `Open-Meteo API error: ${weatherResponse.status}`)
    }
    if (!aqResponse.ok) {
      const body = await aqResponse.json().catch(() => ({}))
      throw new Error(body.reason || `Air Quality API error: ${aqResponse.status}`)
    }

    const weatherData = await weatherResponse.json()
    const aqData = await aqResponse.json()

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate')
    return res.json({
      ...weatherData,
      current: {
        ...weatherData.current,
        air_quality: aqData.current
      }
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch weather data'
    console.error('Weather API error:', message)
    return res.status(502).json({ error: message })
  }
}
