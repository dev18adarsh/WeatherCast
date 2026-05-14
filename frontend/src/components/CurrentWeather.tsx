import { Wind, Droplets, Thermometer, Sun, Moon, Cloud, CloudSun, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning } from 'lucide-react'
import type { CurrentWeather } from '../types'
import { getWeatherCondition, formatTemp } from '../utils/weatherCodes'

interface Props {
  data: CurrentWeather
  locationName: string
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Sun, Moon, Cloud, CloudSun, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning,
}

export default function CurrentWeatherCard({ data, locationName }: Props) {
  const condition = getWeatherCondition(data.weather_code)
  const Icon = iconMap[condition.icon] || Sun

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-2xl p-6 md:p-8 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-medium text-blue-200">{locationName}</h2>
          <div className="text-6xl font-light mt-2">{formatTemp(data.temperature_2m)}</div>
          <p className="text-blue-200 mt-1">Feels like {formatTemp(data.apparent_temperature)}</p>
        </div>
        <div className="text-center">
          <Icon className="w-16 h-16 text-blue-100" />
          <p className="text-sm text-blue-200 mt-1">{condition.label}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-blue-500/30">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-300" />
          <div>
            <p className="text-xs text-blue-300">Humidity</p>
            <p className="text-sm font-medium">{data.relative_humidity_2m}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-blue-300" />
          <div>
            <p className="text-xs text-blue-300">Wind</p>
            <p className="text-sm font-medium">{data.wind_speed_10m} km/h</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-blue-300" />
          <div>
            <p className="text-xs text-blue-300">Feels like</p>
            <p className="text-sm font-medium">{formatTemp(data.apparent_temperature)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
