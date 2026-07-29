import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Moon
} from 'lucide-react';
import React from 'react';

export function getWeatherInfo(code: number, isNight: boolean = false): { label: string; Icon: React.ElementType } {
  switch (code) {
    case 0:
      return { label: 'Clear sky', Icon: isNight ? Moon : Sun };
    case 1:
    case 2:
    case 3:
      return { label: 'Partly cloudy', Icon: Cloud };
    case 45:
    case 48:
      return { label: 'Fog', Icon: CloudFog };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return { label: 'Drizzle', Icon: CloudDrizzle };
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return { label: 'Rain', Icon: CloudRain };
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return { label: 'Snow', Icon: CloudSnow };
    case 80:
    case 81:
    case 82:
      return { label: 'Rain showers', Icon: CloudRain };
    case 95:
    case 96:
    case 99:
      return { label: 'Thunderstorm', Icon: CloudLightning };
    default:
      return { label: 'Unknown', Icon: isNight ? Moon : Sun };
  }
}

export function generateRecommendations(daily: any): string[] {
  if (!daily || !daily.time || daily.time.length === 0) return [];
  
  const recommendations = [];
  
  // Analyze next 7 days
  let hasHighPrecipitation = false;
  let hasHotDays = false;
  let hasColdDays = false;
  let hasClearMildDays = false;
  
  for (let i = 0; i < daily.time.length; i++) {
    const maxTemp = daily.temperature_2m_max[i];
    const precip = daily.precipitation_sum[i];
    const code = daily.weathercode[i];
    
    if (precip > 5) hasHighPrecipitation = true;
    if (maxTemp > 30) hasHotDays = true;
    if (maxTemp < 5) hasColdDays = true;
    if (precip === 0 && maxTemp >= 18 && maxTemp <= 25 && (code === 0 || code === 1 || code === 2)) {
      hasClearMildDays = true;
    }
  }
  
  if (hasHighPrecipitation) {
    recommendations.push("Carry an umbrella and plan indoor activities for upcoming rainy days.");
  }
  if (hasHotDays) {
    recommendations.push("Hot weather ahead — stay hydrated and wear sunscreen.");
  }
  if (hasColdDays) {
    recommendations.push("Chilly temperatures expected. Dress warmly and wear layers.");
  }
  if (hasClearMildDays) {
    recommendations.push("Great weather approaching for outdoor activities!");
  }
  
  if (recommendations.length === 0) {
    recommendations.push("Typical seasonal weather expected. Stay prepared for minor changes.");
  }
  
  return recommendations;
}
