import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  const qRaw = req.query.q
  const q = Array.isArray(qRaw) ? qRaw[0] : qRaw

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Query parameter "q" is required' })
  }

  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`
    )
    if (!response.ok) throw new Error(`Geocoding API error: ${response.status}`)
    const data = await response.json()
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
    return res.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch geocoding data'
    console.error('Geocoding API error:', message)
    return res.status(502).json({ error: message })
  }
}
