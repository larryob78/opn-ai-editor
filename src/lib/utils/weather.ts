export interface WeatherData {
  temperatureC: number;
  feelsLikeC: number;
  description: string;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export type RiskLevel = 'GREEN' | 'AMBER' | 'RED';

/**
 * Fetch weather data from OpenWeather API
 */
export async function getWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error('OpenWeather API key is not configured');
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`OpenWeather API error: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    temperatureC: Math.round(data.main.temp * 10) / 10,
    feelsLikeC: Math.round(data.main.feels_like * 10) / 10,
    description: data.weather[0].description,
    condition: data.weather[0].main,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
  };
}

/**
 * Calculate risk level based on weather conditions
 */
export function calculateRiskLevel(weatherData: WeatherData): RiskLevel {
  const { temperatureC, feelsLikeC, condition, windSpeed } = weatherData;

  // RED: Extreme danger
  if (
    feelsLikeC <= 0 ||
    temperatureC <= 2 ||
    (temperatureC <= 5 && (condition === 'Rain' || condition === 'Snow'))
  ) {
    return 'RED';
  }

  // AMBER: Significant risk
  if (
    feelsLikeC <= 5 ||
    temperatureC <= 7 ||
    (temperatureC <= 10 && condition === 'Rain') ||
    windSpeed > 10
  ) {
    return 'AMBER';
  }

  // GREEN: Low risk
  return 'GREEN';
}

/**
 * Get risk level description
 */
export function getRiskDescription(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case 'RED':
      return 'EXTREME DANGER - Immediate response required';
    case 'AMBER':
      return 'SIGNIFICANT RISK - Response needed within 2 hours';
    case 'GREEN':
      return 'LOW RISK - Standard response';
    default:
      return 'Unknown risk level';
  }
}

/**
 * Get risk color for UI
 */
export function getRiskColor(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case 'RED':
      return 'bg-danger-500 text-white';
    case 'AMBER':
      return 'bg-warning-500 text-white';
    case 'GREEN':
      return 'bg-success-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}
