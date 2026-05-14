# Kimi's WeatherInfo

A weather forecast app with a dark glassmorphism UI, animated weather backgrounds, and a mood-based music genre suggester. Built with React + Vite + Tailwind CSS (frontend) and Express (backend), powered by the free [Open-Meteo API](https://open-meteo.com/) — no API key required.

## Features

- **City search** — debounced geocoding dropdown via Open-Meteo
- **Current weather** — temperature, feels-like, humidity, wind, condition emoji
- **Mood & Music Suggestion** — based on weather, temperature, and time of day, suggests a mood, 2-3 genres, vibe text, and Spotify search links
- **7-day forecast** — daily high/low, precipitation probability, wind
- **Hourly charts** — expand any day to see temperature and precipitation trends (Recharts)
- **Animated backgrounds** — dynamic weather scenes (sun, rain, snow, clouds, fog, thunderstorm) with particle effects
- **Temperature color coding** — blue (cold) → green → yellow → orange → red (hot)
- **Glassmorphism design** — frosted glass cards with backdrop-blur, diffused borders, and glow effects
- **Entrance animations** — staggered fade-in-up for all cards
- **Responsive** — mobile-first, works on all screen sizes

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite 6, TypeScript, Tailwind CSS 3, Recharts, Lucide React, Inter (Google Fonts) |
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
├── api/                    # Vercel serverless functions
│   ├── weather.ts          # /api/weather?lat=&lng=
│   └── geocode.ts          # /api/geocode?q=
├── backend/                # Express dev server
│   └── src/
│       ├── index.ts
│       ├── routes/
│       └── services/
├── frontend/               # Vite + React SPA
│   └── src/
│       ├── components/
│       │   ├── SearchBar.tsx          # glass input + dropdown
│       │   ├── CurrentWeather.tsx     # temp, stats, emoji, glow
│       │   ├── MusicSuggestionCard.tsx # mood, genres, Spotify links
│       │   ├── ForecastList.tsx       # 7-day list
│       │   ├── ForecastDay.tsx        # expandable with hourly chart
│       │   ├── WeatherChart.tsx       # Recharts line + bar
│       │   ├── WeatherBackground.tsx  # animated particle scenes
│       │   ├── LoadingSkeleton.tsx    # pulse placeholders
│       │   ├── ErrorAlert.tsx         # dismissable error
│       │   └── EmptyState.tsx         # initial state prompt
│       ├── hooks/           # useWeather, useGeocode, useDebounce
│       └── utils/           # weatherCodes.ts, musicSuggestions.ts
├── vercel.json
└── package.json
```

## Music Mood Mappings

| Condition | Mood | Genres | Emoji |
|-----------|------|--------|-------|
| Thunderstorm | Intense | Rock, Phonk, Dark Synth | ⛈️ |
| Snow | Serene | Ambient, Classical, Soft Piano | ❄️ |
| Rain / Drizzle | Chill | Lo-fi, R&B, Jazz | ☔ |
| >32°C | Energetic | Summer Pop, Reggaeton, EDM | 🔥 |
| <15°C (non-clear) | Cozy | Acoustic, Soul, Soft Indie | 🧣 |
| Night + Clear | Dreamy | Chillhop, Synthwave, Slow Pop | 🌙 |
| Clear sky | Happy | Pop, Dance, Feel Good | ☀️ |
| Cloudy / Foggy | Laid Back | Indie, Chill Pop, Acoustic | ☁️ |

## Deploy to Vercel

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Select **Other** as Framework Preset
4. Vercel auto-detects settings from `vercel.json` — no additional config needed
