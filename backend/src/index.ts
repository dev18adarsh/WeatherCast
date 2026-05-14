import express from 'express'
import cors from 'cors'
import weatherRouter from './routes/weather.js'
import geocodeRouter from './routes/geocode.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/weather', weatherRouter)
app.use('/api/geocode', geocodeRouter)

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})

export default app
