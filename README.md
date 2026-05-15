# WeatherCast 67

A premium weather forecast app with dark glassmorphism UI, animated weather backgrounds, and a mood-based music genre suggester. Built with React + Vite + Tailwind CSS (frontend) and Express (backend), powered by the free [Open-Meteo API](https://open-meteo.com/) — no API key required.

## Features

- **City search** — debounced geocoding dropdown via Open-Meteo with recent searches
- **Current weather** — temperature, feels-like, humidity, wind, condition emoji with live clock
- **Mood & Music Suggestion** — based on weather, temperature, and time of day, suggests a mood, 2-3 genres, vibe text, and Spotify search links
- **Outfit Recommendation** — AI-powered clothing suggestions based on weather conditions
- **Activity Suggestions** — personalized activity ideas matching current weather
- **Travel Readiness** — travel safety score with hourly breakdown
- **7-day forecast** — daily high/low, precipitation probability, wind with expandable hourly charts
- **Weather Analytics** — temperature trends, UV index, wind radar, comfort index, and precipitation analysis
- **3D Interactive Globe** — explore weather across world cities on a 3D globe (Cesium)
- **AI Weather Assistant** — ask questions about weather data conversationally
- **Share Cards** — generate beautiful branded weather share images
- **Animated backgrounds** — dynamic weather scenes (sun, rain, snow, clouds, fog, thunderstorm, aurora, shooting stars) with particle effects
- **Temperature color coding** — blue (cold) → green → yellow → orange → red (hot)
- **Premium glassmorphism design** — frosted glass cards with backdrop-blur, diffused borders, animated gradient accents, and subtle noise texture
- **Entrance animations** — staggered fade-in-up with shine effects on cards
- **Responsive** — mobile-first, works on all screen sizes

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite 6, TypeScript, Tailwind CSS 3, Recharts, Lucide React, Cesium, Inter (Google Fonts) |
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
│       │   ├── SearchBar.tsx
│       │   ├── CurrentWeather.tsx
│       │   ├── MusicSuggestionCard.tsx
│       │   ├── OutfitRecommendation.tsx
│       │   ├── ActivitySuggestions.tsx
│       │   ├── TravelReadiness.tsx
│       │   ├── ForecastList.tsx
│       │   ├── ForecastDay.tsx
│       │   ├── WeatherChart.tsx
│       │   ├── WeatherBackground.tsx
│       │   ├── WeatherGlobe.tsx
│       │   ├── LoadingSkeleton.tsx
│       │   ├── ErrorAlert.tsx
│       │   └── EmptyState.tsx
│       │   ├── assistant/      # AI chat assistant
│       │   ├── analytics/      # Weather analytics dashboard
│       │   ├── background/     # Particle effect components
│       │   └── share/          # Share card generation
│       ├── hooks/
│       ├── utils/
│       └── data/
├── vercel.json
└── package.json
```

## Deploy to Vercel

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Select **Other** as Framework Preset
4. Vercel auto-detects settings from `vercel.json` — no additional config needed
