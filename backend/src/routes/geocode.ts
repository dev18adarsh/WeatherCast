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
    const message = err instanceof Error ? err.message : 'Failed to fetch geocoding data'
    console.error('Geocode error:', message)
    res.status(502).json({ error: message })
  }
})

export default router
