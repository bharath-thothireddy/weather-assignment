export interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms: number;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  country: string;
  admin1?: string; // State/Province
}

export interface WeatherForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current_weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time: string;
  };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
}

export interface AppState {
  isDarkMode: boolean;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  location: GeocodingResult | null;
  weatherData: WeatherForecastResponse | null;
}
