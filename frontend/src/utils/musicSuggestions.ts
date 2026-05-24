export type MusicMood = {
  mood: string
  genres: string[]
  vibe: string
  emoji: string
  bgFrom: string
  bgVia: string
  bgTo: string
  spotifyColor: string
}

function isNight(): boolean {
  const h = new Date().getHours()
  return h < 6 || h >= 19
}

export function getMusicSuggestion(weatherCode: number, temp: number): MusicMood {
  const night = isNight()

  if (weatherCode >= 95) {
    return {
      mood: 'Intense',
      genres: ['Rock', 'Phonk', 'Dark Synth'],
      vibe: 'Electric tension in the air — let the storm fuel your energy.',
      emoji: '⛈️',
      bgFrom: '#4c1d95',
      bgVia: '#0f172a',
      bgTo: '#111827',
      spotifyColor: '#8b5cf6',
    }
  }

  if (weatherCode >= 71 && weatherCode <= 86) {
    return {
      mood: 'Serene',
      genres: ['Ambient', 'Classical', 'Soft Piano'],
      vibe: 'Quiet snowfall — time to wrap up warm and drift away.',
      emoji: '❄️',
      bgFrom: '#475569',
      bgVia: '#1e3a5f',
      bgTo: '#1e1b4b',
      spotifyColor: '#94a3b8',
    }
  }

  if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
    return {
      mood: 'Chill',
      genres: ['Lo-fi', 'R&B', 'Jazz'],
      vibe: 'Rain tapping on the window — perfect for a cozy, mellow session.',
      emoji: '☔',
      bgFrom: '#1e3a5f',
      bgVia: '#1e293b',
      bgTo: '#312e81',
      spotifyColor: '#3b82f6',
    }
  }

  if (temp > 32) {
    return {
      mood: 'Energetic',
      genres: ['Summer Pop', 'Reggaeton', 'EDM'],
      vibe: 'Scorching heat — crank up the energy and feel the fire.',
      emoji: '🔥',
      bgFrom: '#ea580c',
      bgVia: '#dc2626',
      bgTo: '#ca8a04',
      spotifyColor: '#f97316',
    }
  }

  if (temp < 15 && weatherCode !== 0 && !(night && weatherCode === 0)) {
    return {
      mood: 'Cozy',
      genres: ['Acoustic', 'Soul', 'Soft Indie'],
      vibe: 'A little chilly out — warm up with something heartfelt.',
      emoji: '🧣',
      bgFrom: '#78350f',
      bgVia: '#7c2d12',
      bgTo: '#292524',
      spotifyColor: '#d97706',
    }
  }

  if (night && weatherCode === 0) {
    return {
      mood: 'Dreamy',
      genres: ['Chillhop', 'Synthwave', 'Slow Pop'],
      vibe: 'City lights under a clear sky — late-night drives and good vibes.',
      emoji: '🌙',
      bgFrom: '#312e81',
      bgVia: '#4c1d95',
      bgTo: '#0f172a',
      spotifyColor: '#6366f1',
    }
  }

  if (weatherCode === 0) {
    return {
      mood: 'Happy',
      genres: ['Pop', 'Dance', 'Feel Good'],
      vibe: 'Sunshine and good energy — let the good times roll.',
      emoji: '☀️',
      bgFrom: '#eab308',
      bgVia: '#fb923c',
      bgTo: '#fb7185',
      spotifyColor: '#eab308',
    }
  }

  return {
    mood: 'Laid Back',
    genres: ['Indie', 'Chill Pop', 'Acoustic'],
    vibe: 'Cloudy skies and calm air — a relaxed soundtrack for the day.',
    emoji: '☁️',
    bgFrom: '#475569',
    bgVia: '#334155',
    bgTo: '#1f2937',
    spotifyColor: '#64748b',
  }
}

export function getSpotifySearchUrl(genre: string): string {
  return `https://open.spotify.com/search/${encodeURIComponent(genre + ' music')}`
}
