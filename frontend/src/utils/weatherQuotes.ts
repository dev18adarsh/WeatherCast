interface QuoteEntry {
  text: string
  author: string
  conditions: ('sunny' | 'cloudy' | 'rainy' | 'snowy' | 'foggy' | 'thunderstorm' | 'night')[]
  tempRange?: [number, number]
}

const quotes: QuoteEntry[] = [
  {
    text: 'Sunshine is a welcome guest everywhere.',
    author: 'Russian Proverb',
    conditions: ['sunny'],
  },
  {
    text: 'Wherever you go, no matter what the weather, always bring your own sunshine.',
    author: 'Anthony J. D\'Angelo',
    conditions: ['sunny', 'cloudy'],
  },
  {
    text: 'Some people feel the rain. Others just get wet.',
    author: 'Bob Marley',
    conditions: ['rainy'],
  },
  {
    text: 'Life isn\'t about waiting for the storm to pass. It\'s about learning to dance in the rain.',
    author: 'Vivian Greene',
    conditions: ['rainy', 'thunderstorm'],
  },
  {
    text: 'A rainy day is the perfect time for a walk in the woods.',
    author: 'Rachel Carson',
    conditions: ['rainy'],
  },
  {
    text: 'There is no such thing as bad weather, only different kinds of good weather.',
    author: 'John Ruskin',
    conditions: ['sunny', 'cloudy', 'rainy', 'snowy', 'foggy'],
  },
  {
    text: 'Snowflakes are kisses from heaven.',
    author: 'Unknown',
    conditions: ['snowy'],
  },
  {
    text: 'In the midst of winter, I found there was, within me, an invincible summer.',
    author: 'Albert Camus',
    conditions: ['snowy', 'foggy'],
  },
  {
    text: 'Clouds come floating into my life, no longer to carry rain or usher storm, but to add color to my sunset sky.',
    author: 'Rabindranath Tagore',
    conditions: ['cloudy', 'sunny'],
  },
  {
    text: 'The fog is lifting — a new day is beginning.',
    author: 'Unknown',
    conditions: ['foggy'],
  },
  {
    text: 'I love the smell of rain in the air.',
    author: 'Unknown',
    conditions: ['rainy'],
  },
  {
    text: 'Nature is full of genius, full of the divinity; so that not a snowflake escapes its fashioning hand.',
    author: 'Henry David Thoreau',
    conditions: ['snowy'],
  },
  {
    text: 'The best thing one can do when it\'s raining is to let it rain.',
    author: 'Henry Wadsworth Longfellow',
    conditions: ['rainy', 'thunderstorm'],
  },
  {
    text: 'To be interested in the changing seasons is a happier state of mind than to be hopelessly in love with spring.',
    author: 'George Santayana',
    conditions: ['sunny', 'cloudy', 'rainy', 'snowy', 'foggy'],
  },
  {
    text: 'Storms make trees take deeper roots.',
    author: 'Dolly Parton',
    conditions: ['thunderstorm', 'rainy'],
  },
  {
    text: 'Every cloud has a silver lining.',
    author: 'John Milton',
    conditions: ['cloudy', 'rainy', 'foggy'],
  },
  {
    text: 'Let the rain kiss you. Let the rain wash away all the pain of yesterday.',
    author: 'Langston Hughes',
    conditions: ['rainy'],
  },
  {
    text: 'A sky full of stars — the universe reminding you that you are part of something beautiful.',
    author: 'Unknown',
    conditions: ['night'],
  },
  {
    text: 'The stars are the street lights of eternity.',
    author: 'Unknown',
    conditions: ['night'],
  },
  {
    text: 'Under the stars, no one is a stranger.',
    author: 'Unknown',
    conditions: ['night'],
  },
  {
    text: 'There is a kind of beauty in imperfection.',
    author: 'Conrad Hall',
    conditions: ['foggy', 'cloudy', 'rainy'],
  },
]

function getWeatherConditionType(code: number): QuoteEntry['conditions'][number] {
  if (code === 0) return 'sunny'
  if (code <= 2) return 'cloudy'
  if (code === 3) return 'cloudy'
  if (code <= 48) return 'foggy'
  if (code <= 67) return 'rainy'
  if (code <= 77) return 'snowy'
  if (code <= 86) return 'snowy'
  if (code >= 95) return 'thunderstorm'
  return 'cloudy'
}

const usedQuotes = new Set<number>()

export function getWeatherQuote(weatherCode: number, temp: number): { text: string; author: string } {
  const type = getWeatherConditionType(weatherCode)
  const hour = new Date().getHours()
  const isNight = hour < 6 || hour >= 20

  const valid = quotes.filter((q) => {
    const matchCondition = q.conditions.includes(type) || (isNight && q.conditions.includes('night'))
    const matchTemp = !q.tempRange || (temp >= q.tempRange[0] && temp <= q.tempRange[1])
    return matchCondition && matchTemp
  })

  if (valid.length === 0) {
    return {
      text: 'Weather is the ultimate conversation starter.',
      author: 'Unknown',
    }
  }

  const available = valid.filter((_, i) => !usedQuotes.has(i))
  const pool = available.length > 0 ? available : valid
  const idx = Math.floor(Math.random() * pool.length)
  const globalIdx = quotes.indexOf(pool[idx])

  if (usedQuotes.size >= quotes.length) usedQuotes.clear()
  if (globalIdx >= 0) usedQuotes.add(globalIdx)

  return { text: pool[idx].text, author: pool[idx].author }
}

export function getMusicMoodLabel(mood: string | null): string {
  const moods: Record<string, string> = {
    energetic: 'Energetic / EDM',
    chill: 'Chill / Lo-fi',
    focused: 'Deep Focus',
    relaxed: 'Ambient / Relax',
    happy: 'Happy / Pop',
    melancholy: 'Melancholy / Indie',
  }
  return mood ? moods[mood] || 'Mixed Vibes' : 'Mixed Vibes'
}
