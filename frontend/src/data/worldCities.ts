export interface WorldCity {
  name: string
  country: string
  lat: number
  lng: number
}

export interface CityWeather extends WorldCity {
  temp: number
  weatherCode: number
  humidity: number
  wind: number
  time: string
}

export const WORLD_CITIES: WorldCity[] = [
  { name: 'New York', country: 'US', lat: 40.7128, lng: -74.006 },
  { name: 'Los Angeles', country: 'US', lat: 34.0522, lng: -118.2437 },
  { name: 'Chicago', country: 'US', lat: 41.8781, lng: -87.6298 },
  { name: 'Toronto', country: 'CA', lat: 43.6532, lng: -79.3832 },
  { name: 'Vancouver', country: 'CA', lat: 49.2827, lng: -123.1207 },
  { name: 'Mexico City', country: 'MX', lat: 19.4326, lng: -99.1332 },
  { name: 'São Paulo', country: 'BR', lat: -23.5505, lng: -46.6333 },
  { name: 'Buenos Aires', country: 'AR', lat: -34.6037, lng: -58.3816 },
  { name: 'Lima', country: 'PE', lat: -12.0464, lng: -77.0428 },
  { name: 'Rio de Janeiro', country: 'BR', lat: -22.9068, lng: -43.1729 },
  { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', country: 'FR', lat: 48.8566, lng: 2.3522 },
  { name: 'Berlin', country: 'DE', lat: 52.52, lng: 13.405 },
  { name: 'Moscow', country: 'RU', lat: 55.7558, lng: 37.6173 },
  { name: 'Rome', country: 'IT', lat: 41.9028, lng: 12.4964 },
  { name: 'Madrid', country: 'ES', lat: 40.4168, lng: -3.7038 },
  { name: 'Stockholm', country: 'SE', lat: 59.3293, lng: 18.0686 },
  { name: 'Tokyo', country: 'JP', lat: 35.6762, lng: 139.6503 },
  { name: 'Dubai', country: 'AE', lat: 25.2048, lng: 55.2708 },
  { name: 'Mumbai', country: 'IN', lat: 19.076, lng: 72.8777 },
  { name: 'Singapore', country: 'SG', lat: 1.3521, lng: 103.8198 },
  { name: 'Shanghai', country: 'CN', lat: 31.2304, lng: 121.4737 },
  { name: 'Bangkok', country: 'TH', lat: 13.7563, lng: 100.5018 },
  { name: 'Seoul', country: 'KR', lat: 37.5665, lng: 126.978 },
  { name: 'Beijing', country: 'CN', lat: 39.9042, lng: 116.4074 },
  { name: 'Istanbul', country: 'TR', lat: 41.0082, lng: 28.9784 },
  { name: 'Cairo', country: 'EG', lat: 30.0444, lng: 31.2357 },
  { name: 'Lagos', country: 'NG', lat: 6.5244, lng: 3.3792 },
  { name: 'Johannesburg', country: 'ZA', lat: -26.2041, lng: 28.0473 },
  { name: 'Nairobi', country: 'KE', lat: -1.2921, lng: 36.8219 },
  { name: 'Cape Town', country: 'ZA', lat: -33.9249, lng: 18.4241 },
  { name: 'Sydney', country: 'AU', lat: -33.8688, lng: 151.2093 },
  { name: 'Melbourne', country: 'AU', lat: -37.8136, lng: 144.9631 },
  { name: 'Auckland', country: 'NZ', lat: -36.8485, lng: 174.7633 },
]
