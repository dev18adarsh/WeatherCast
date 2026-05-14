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
    console.error('Weather error:', err)
    res.status(502).json({ error: 'Failed to fetch weather data' })
  }
})

export default router
