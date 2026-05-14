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

  const params = new URLSearchParams({
    latitude: latNum.toString(),
    longitude: lngNum.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max',
    hourly: 'temperature_2m,precipitation_probability,weather_code',
    timezone: 'auto',
    forecast_days: '7',
  })

  try {
    const response = await fetch(`${BASE_URL}/forecast?${params}`)
    if (!response.ok) throw new Error(`Open-Meteo API error: ${response.status}`)
    const data = await response.json()
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate')
    return res.json(data)
  } catch (err) {
    console.error('Weather API error:', err)
    return res.status(502).json({ error: 'Failed to fetch weather data' })
  }
}
