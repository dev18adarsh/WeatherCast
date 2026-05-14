# WeatherCast

A weather forecast app built with React + Vite + Tailwind CSS (frontend) and Express (backend), powered by the free [Open-Meteo API](https://open-meteo.com/) — no API key required.

## Features

- **City search** — debounced geocoding dropdown via Open-Meteo
- **Current weather** — temperature, feels-like, humidity, wind, condition icon
- **7-day forecast** — daily high/low, precipitation probability, wind
- **Hourly charts** — expand any day to see temperature and precipitation trends (Recharts)
- **Dark theme** — default dark UI, responsive mobile-first design
- **Full state coverage** — loading skeletons, error alerts, empty states

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite 6, TypeScript, Tailwind CSS 3, Recharts, Lucide React |
| Backend | Express 4, TypeScript, tsx (dev) |
| API | [Open-Meteo](https://open-meteo.com/) — free, open-source, no key |
| Deployment | Vercel (static frontend + serverless functions) |

## Quick Start

```bash
npm install
npm run install:all
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:3001`

## Project Structure

```
Weather/
├── api/                # Vercel serverless functions
│   ├── weather.ts      # /api/weather?lat=&lng=
│   └── geocode.ts      # /api/geocode?q=
├── backend/            # Express dev server
│   └── src/
│       ├── index.ts
│       ├── routes/
│       └── services/
├── frontend/           # Vite + React SPA
│   └── src/
│       ├── components/ # SearchBar, CurrentWeather, ForecastList, ForecastDay, WeatherChart, etc.
│       ├── hooks/      # useWeather, useGeocode, useDebounce
│       └── utils/      # weatherCodes.ts (WMO code mapping)
├── vercel.json
└── package.json
```

## Deploy to Vercel

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Vercel auto-detects `vercel.json` — no additional config needed
