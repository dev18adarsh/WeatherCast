export interface OutfitItem {
  item: string
  emoji: string
}

export interface OutfitSuggestion {
  top: OutfitItem
  bottom: OutfitItem
  footwear: OutfitItem
  accessories: OutfitItem[]
  extras: string[]
  comfort: {
    level: string
    emoji: string
    color: string
  }
  bgFrom: string
  bgVia: string
  bgTo: string
}

function isDaytime(): boolean {
  const h = new Date().getHours()
  return h >= 6 && h < 19
}

function isRain(code: number): boolean {
  return (code >= 51 && code <= 67) || (code >= 80 && code <= 82)
}

function isSnow(code: number): boolean {
  return (code >= 71 && code <= 77) || (code >= 85 && code <= 86)
}

function isThunderstorm(code: number): boolean {
  return code >= 95
}

function isFog(code: number): boolean {
  return code >= 45 && code <= 48
}

function isCloudy(code: number): boolean {
  return code >= 1 && code <= 3
}

export function getOutfitSuggestion(
  temp: number,
  feelsLike: number,
  humidity: number,
  wind: number,
  uv: number,
  code: number,
): OutfitSuggestion {
  const rain = isRain(code)
  const snow = isSnow(code)
  const storm = isThunderstorm(code)
  const fog = isFog(code)
  const cloudy = isCloudy(code)
  const clear = code === 0
  const day = isDaytime()

  let top: OutfitItem
  let bottom: OutfitItem
  let footwear: OutfitItem
  const accessories: OutfitItem[] = []
  const extras: string[] = []

  if (storm) {
    top = { item: 'Stay indoors if possible', emoji: '🏠' }
    bottom = { item: 'Indoor comfortable wear', emoji: '👖' }
    footwear = { item: 'Indoor slippers', emoji: '🩴' }
    extras.push('Postpone outdoor plans', 'Unplug electronics')
  } else if (temp >= 32) {
    top = { item: 'Tank top / Vest', emoji: '🎽' }
    bottom = { item: 'Shorts', emoji: '🩳' }
    footwear = { item: 'Sandals / Flip-flops', emoji: '🩴' }
    extras.push('Stay hydrated throughout the day', 'Avoid peak sun hours (12–4 PM)')
  } else if (temp >= 27) {
    top = { item: 'T-shirt', emoji: '👕' }
    bottom = { item: 'Shorts / Skirt', emoji: '🩳' }
    footwear = { item: 'Sneakers / Sandals', emoji: '👟' }
    extras.push('light and breathable fabrics recommended')
  } else if (temp >= 22) {
    top = { item: 'Light shirt / Blouse', emoji: '👔' }
    bottom = { item: 'Chinos / Cropped pants', emoji: '👖' }
    footwear = { item: 'Sneakers / Loafers', emoji: '👟' }
    extras.push('Perfect weather — dress comfortably')
  } else if (temp >= 18) {
    top = { item: 'Long sleeves / Light sweater', emoji: '👚' }
    bottom = { item: 'Jeans / Trousers', emoji: '👖' }
    footwear = { item: 'Closed shoes / Sneakers', emoji: '👟' }
    extras.push('Light layering works best')
  } else if (temp >= 12) {
    top = { item: 'Sweater / Hoodie', emoji: '🧥' }
    bottom = { item: 'Jeans / Warm pants', emoji: '👖' }
    footwear = { item: 'Boots / Warm shoes', emoji: '👢' }
    extras.push('Layer up — a jacket would help')
  } else if (temp >= 6) {
    top = { item: 'Jacket / Heavy sweater', emoji: '🧥' }
    bottom = { item: 'Thermal pants / Jeans', emoji: '👖' }
    footwear = { item: 'Winter boots', emoji: '👢' }
    extras.push('Wear thermal innerwear for extra warmth')
  } else {
    top = { item: 'Insulated winter coat', emoji: '🧥' }
    bottom = { item: 'Thermal lined pants', emoji: '👖' }
    footwear = { item: 'Insulated snow boots', emoji: '👢' }
    extras.push('Multiple layers essential', 'Cover exposed skin')
  }

  if (rain) {
    top = { item: 'Waterproof jacket', emoji: '🧥' }
    if (temp >= 22) {
      footwear = { item: 'Waterproof sandals', emoji: '🩴' }
    } else {
      footwear = { item: 'Waterproof boots', emoji: '👢' }
    }
    accessories.push({ item: 'Umbrella', emoji: '🌂' })
    extras.push('Carry a compact umbrella', 'Avoid cotton — it dries slowly')
  }

  if (snow) {
    top = { item: 'Insulated winter coat', emoji: '🧥' }
    bottom = { item: 'Snow pants / Thermal trousers', emoji: '👖' }
    footwear = { item: 'Snow boots (waterproof)', emoji: '👢' }
    extras.push('Watch for black ice on walkways', 'Keep hands covered')
  }

  if (wind >= 30) {
    extras.push('Secure loose items — strong winds expected')
  } else if (wind >= 20) {
    extras.unshift('Wind-resistant layer recommended')
  }

  if (clear && day) {
    if (uv >= 6) {
      accessories.push({ item: 'Sunscreen SPF 30+', emoji: '🧴' })
    }
    if (temp >= 20) {
      accessories.push({ item: 'Sunglasses', emoji: '🕶️' })
      accessories.push({ item: 'Cap', emoji: '🧢' })
    }
  }

  if (temp <= 10) {
    if (!accessories.some((a) => a.item.includes('Gloves'))) {
      accessories.push({ item: 'Gloves', emoji: '🧤' })
    }
    if (!accessories.some((a) => a.item.includes('Scarf'))) {
      accessories.push({ item: 'Scarf', emoji: '🧣' })
    }
  }

  if (snow || temp <= 5) {
    if (!accessories.some((a) => a.item.includes('Beanie'))) {
      accessories.push({ item: 'Beanie / Warm hat', emoji: '🧢' })
    }
  }

  if (humidity >= 70 && temp >= 22) {
    extras.push('High humidity — choose moisture-wicking fabrics', 'Stay cool with a portable fan')
  }

  if (fog) {
    extras.push('Reduced visibility — drive carefully with fog lights')
  }

  if (storm) {
    extras.push('Stay away from tall objects and open fields')
  }

  const comfort = getComfortLevel(feelsLike, humidity, wind, code)
  const { bgFrom, bgVia, bgTo } = getGradient(temp, code, day)

  return { top, bottom, footwear, accessories, extras, comfort, bgFrom, bgVia, bgTo }
}

function getComfortLevel(
  feelsLike: number,
  humidity: number,
  wind: number,
  code: number,
): { level: string; emoji: string; color: string } {
  if (code >= 95) return { level: 'Stormy', emoji: '⛈️', color: '#8b5cf6' }
  if (feelsLike >= 38) return { level: 'Very Hot', emoji: '🥵', color: '#ef4444' }
  if (feelsLike >= 30) return { level: 'Hot', emoji: '☀️', color: '#fb923c' }
  if (feelsLike >= 26 && humidity >= 70) return { level: 'Humid', emoji: '💦', color: '#14b8a6' }
  if (feelsLike >= 26) return { level: 'Slightly Hot', emoji: '🌤️', color: '#fbbf24' }
  if (feelsLike >= 18) return { level: 'Comfortable', emoji: '😊', color: '#4ade80' }
  if (wind >= 35) return { level: 'Windy', emoji: '💨', color: '#818cf8' }
  if (feelsLike >= 10) return { level: 'Slightly Cold', emoji: '🙂', color: '#60a5fa' }
  if (feelsLike >= 0) return { level: 'Cold', emoji: '🥶', color: '#38bdf8' }
  return { level: 'Freezing', emoji: '🧊', color: '#818cf8' }
}

function getGradient(temp: number, code: number, day: boolean): { bgFrom: string; bgVia: string; bgTo: string } {
  if (code >= 95) return { bgFrom: '#2e1065', bgVia: '#312e81', bgTo: '#0f172a' }
  if (code >= 51 && code <= 67) return { bgFrom: '#1e3a5f', bgVia: '#1e293b', bgTo: '#312e81' }
  if (code >= 71 && code <= 86) return { bgFrom: '#334155', bgVia: '#1e3a5f', bgTo: '#1e1b4b' }
  if (code >= 45 && code <= 48) return { bgFrom: '#475569', bgVia: '#334155', bgTo: '#1f2937' }
  if (temp >= 32) return { bgFrom: '#9a3412', bgVia: '#dc2626', bgTo: '#ca8a04' }
  if (temp >= 27) return { bgFrom: '#c2410c', bgVia: '#ea580c', bgTo: '#d97706' }
  if (temp >= 18) return { bgFrom: '#047857', bgVia: '#0d9488', bgTo: '#0369a1' }
  if (temp >= 10) return { bgFrom: '#075985', bgVia: '#1e40af', bgTo: '#312e81' }
  if (temp >= 0) return { bgFrom: '#1e3a5f', bgVia: '#1e293b', bgTo: '#0f172a' }
  return { bgFrom: '#111827', bgVia: '#0f172a', bgTo: '#020617' }
}
