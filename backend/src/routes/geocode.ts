import { Router } from 'express'
import { fetchGeocode } from '../services/openMeteo.js'

const router = Router()

router.get('/', async (req, res) => {
  const { q } = req.query
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Query parameter "q" is required' })
  }
  try {
    const data = await fetchGeocode(q)
    res.json(data)
  } catch (err) {
    console.error('Geocode error:', err)
    res.status(502).json({ error: 'Failed to fetch geocoding data' })
  }
})

export default router
