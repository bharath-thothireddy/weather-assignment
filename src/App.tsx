import React, { useState, useEffect } from 'react';
import { Search, MapPin, Moon, Sun, Loader2 } from 'lucide-react';
import { WeatherGlobe } from './components/WeatherGlobe';
import { WeatherChart } from './components/WeatherChart';
import { ForecastCard } from './components/ForecastCard';
import { SmartInsights } from './components/SmartInsights';
import { getWeatherInfo, generateRecommendations } from './lib/weather';
import { GeocodingResult, WeatherForecastResponse } from './types';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [location, setLocation] = useState<GeocodingResult | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherForecastResponse | null>(null);

  // Toggle dark mode classes on html
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Initial load for a default city (e.g. London)
  useEffect(() => {
    handleSearch('London');
  }, []);

  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Geocoding API
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
      if (!geoRes.ok) throw new Error('Failed to fetch location data');
      
      const geoData = await geoRes.json();
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City not found. Please try again.');
      }
      
      const loc = geoData.results[0];
      setLocation(loc);
      
      // 2. Weather API
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`);
      if (!weatherRes.ok) throw new Error('Failed to fetch weather data');
      
      const wData = await weatherRes.json();
      setWeatherData(wData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLocation(null);
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const currentWeatherInfo = weatherData?.current_weather 
    ? getWeatherInfo(weatherData.current_weather.weathercode)
    : null;

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row overflow-x-hidden lg:overflow-hidden p-4 sm:p-6 gap-6 font-sans
      ${isDarkMode 
        ? 'bg-[#0f172a] weather-gradient text-white' 
        : 'bg-gradient-to-br from-blue-50 via-sky-100 to-indigo-100 text-slate-900'
      }`}
    >
      {/* Left Sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-6 h-auto lg:h-full shrink-0">
        <div className={`glass p-6 flex flex-col h-full ${!isDarkMode ? 'bg-white/40 border-white/40 shadow-xl' : ''}`}>
          
          {/* Header & Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/30 text-white">
              <CloudSunIcon />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Weather AI</h1>
          </div>
          
          {/* Search */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search city..."
              className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all text-sm ${!isDarkMode ? 'bg-white/60 text-slate-900 border-slate-200 placeholder-slate-500' : 'text-white'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Search className={`absolute left-3.5 top-3.5 ${!isDarkMode ? 'text-slate-400' : 'text-white/40'}`} size={18} />
            <button 
              onClick={() => handleSearch()}
              className="absolute right-2 top-2 p-1.5 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            </button>
          </div>

          {/* Smart Insights */}
          <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar">
            {weatherData && <SmartInsights recommendations={generateRecommendations(weatherData.daily)} isDarkMode={isDarkMode} />}
            
            {/* Error State */}
            {error && (
              <div className={`mt-4 p-4 rounded-xl border text-sm ${!isDarkMode ? 'bg-red-50 border-red-200 text-red-600' : 'bg-red-500/20 border-red-500/50 text-red-200'}`}>
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Day / Night Mode Toggle */}
          <div className={`mt-6 pt-6 border-t flex items-center justify-between ${!isDarkMode ? 'border-slate-200' : 'border-white/10'}`}>
            <span className={`text-xs ${!isDarkMode ? 'text-slate-500' : 'text-white/40'}`}>Day / Night Mode</span>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-12 h-6 rounded-full relative p-1 transition-colors ${!isDarkMode ? 'bg-slate-300' : 'bg-white/10'}`}
            >
              <div className={`w-4 h-4 rounded-full shadow-lg transition-transform duration-300 ${!isDarkMode ? 'bg-white translate-x-0' : 'bg-sky-400 shadow-sky-400/50 translate-x-6'}`}></div>
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Dashboard */}
      <div className="flex-1 flex flex-col gap-6 h-auto lg:h-full lg:overflow-y-auto hide-scrollbar">
        {!error && location && weatherData && (
          <>
            {/* Top Row: Current Stats & Globe */}
            <div className="flex flex-col lg:flex-row gap-6 items-stretch">
              <div className={`flex-1 glass p-8 relative overflow-hidden flex flex-col justify-between ${isDarkMode ? 'glow-blue' : 'bg-white/50 border-white/60 shadow-xl'}`}>
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  {currentWeatherInfo && <currentWeatherInfo.Icon size={160} strokeWidth={1} />}
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-4xl font-bold">{location.name}</h2>
                      <p className="text-sky-500 font-medium">{location.country}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-6xl font-light">
                        {Math.round(weatherData.current_weather.temperature)}°<span className={`text-3xl ${!isDarkMode ? 'text-slate-400' : 'text-white/40'}`}>C</span>
                      </div>
                      <p className={`text-sm ${!isDarkMode ? 'text-slate-500' : 'text-white/60'}`}>{currentWeatherInfo?.label}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 mt-8">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                      <span className="text-sm">Wind: {weatherData.current_weather.windspeed} km/h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                      <span className="text-sm">High: {Math.round(weatherData.daily.temperature_2m_max[0])}°</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      <span className="text-sm">Low: {Math.round(weatherData.daily.temperature_2m_min[0])}°</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`w-full lg:w-64 glass p-6 flex flex-col items-center justify-center relative overflow-hidden ${!isDarkMode ? 'bg-white/50 border-white/60 shadow-xl' : ''}`}>
                <WeatherGlobe latitude={location.latitude} longitude={location.longitude} />
                <p className={`mt-4 text-xs font-bold uppercase tracking-widest ${!isDarkMode ? 'text-slate-400' : 'text-white/40'}`}>Geolocation Focus</p>
                <p className="text-sm font-semibold">{location.latitude.toFixed(4)}° N, {location.longitude.toFixed(4)}° E</p>
              </div>
            </div>

            {/* Middle Row: Forecast Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
              {weatherData.daily.time.map((time, idx) => (
                <ForecastCard
                  key={time}
                  dateStr={time}
                  maxTemp={weatherData.daily.temperature_2m_max[idx]}
                  minTemp={weatherData.daily.temperature_2m_min[idx]}
                  precipitation={weatherData.daily.precipitation_sum[idx]}
                  weatherCode={weatherData.daily.weathercode[idx]}
                  isToday={idx === 0}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>

            {/* Bottom Row: Analytics Chart */}
            <div className={`flex-1 glass p-6 overflow-hidden min-h-[300px] flex flex-col ${!isDarkMode ? 'bg-white/50 border-white/60 shadow-xl' : ''}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-sky-500">Temperature Trend (7 Days)</h3>
                <div className={`flex gap-4 text-xs ${!isDarkMode ? 'text-slate-500' : 'text-white/60'}`}>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-sky-500"></div> Max Temp
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div> Min Temp
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <WeatherChart daily={weatherData.daily} isDarkMode={isDarkMode} />
              </div>
            </div>
            
          </>
        )}
      </div>
      
      {/* Hide scrollbar styles in global css later, or inline here */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

function CloudSunIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v2"></path>
      <path d="M12 20v2"></path>
      <path d="m4.93 4.93 1.41 1.41"></path>
      <path d="m17.66 17.66 1.41 1.41"></path>
      <path d="M2 12h2"></path>
      <path d="M20 12h2"></path>
      <path d="m6.34 17.66-1.41 1.41"></path>
      <path d="m19.07 4.93-1.41 1.41"></path>
      <path d="M15.54 11.4a5 5 0 1 0-7.07 7.07"></path>
      <path d="M16 19h2a3 3 0 0 0 0-6h-1"></path>
    </svg>
  );
}

