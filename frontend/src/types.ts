export interface GeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  country_code: string
  admin1?: string
}

export interface CurrentWeather {
  temperature_2m: number
  relative_humidity_2m: number
  apparent_temperature: number
  weather_code: number
  wind_speed_10m: number
}

export interface DailyForecast {
  time: string[]
  weather_code: number[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  precipitation_sum: number[]
  precipitation_probability_max: number[]
  wind_speed_10m_max: number[]
}

export interface HourlyForecast {
  time: string[]
  temperature_2m: number[]
  precipitation_probability: number[]
  weather_code: number[]
}

export interface WeatherResponse {
  current: CurrentWeather
  daily: DailyForecast
  hourly: HourlyForecast
}

export type WeatherData = {
  current: CurrentWeather
  daily: DailyForecast
  hourly: HourlyForecast
  locationName: string
}
