import { Router } from 'express'
import { fetchWeather } from '../services/openMeteo.js'

const router = Router()

router.get('/', async (req, res) => {
  const { lat, lng } = req.query
  if (!lat || !lng) {
    return res.status(400).json({ error: 'Parameters "lat" and "lng" are required' })
  }
  const latNum = parseFloat(lat as string)
  const lngNum = parseFloat(lng as string)
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
