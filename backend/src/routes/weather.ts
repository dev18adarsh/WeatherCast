import { Router } from 'express'
import { fetchWeather } from '../services/openMeteo.js'

const router = Router()

router.get('/', async (req, res) => {
  const latRaw = req.query.lat
  const lngRaw = req.query.lng
  const lat = Array.isArray(latRaw) ? latRaw[0] : latRaw
  const lng = Array.isArray(lngRaw) ? lngRaw[0] : lngRaw
  if (!lat || !lng) {
    return res.status(400).json({ error: 'Parameters "lat" and "lng" are required' })
  }
  const latNum = parseFloat(lat)
  const lngNum = parseFloat(lng)
  if (isNaN(latNum) || isNaN(lngNum)) {
    return res.status(400).json({ error: '"lat" and "lng" must be valid numbers' })
  }
  try {
    const data = await fetchWeather(latNum, lngNum)
    res.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch weather data'
    console.error('Weather error:', message)
    res.status(502).json({ error: message })
  }
})

export default router
