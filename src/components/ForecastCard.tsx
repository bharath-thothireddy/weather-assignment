import React from 'react';
import { format, parseISO } from 'date-fns';
import { Droplets } from 'lucide-react';
import { getWeatherInfo } from '../lib/weather';

interface ForecastCardProps {
  dateStr: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  weatherCode: number;
  isToday?: boolean;
  isDarkMode?: boolean;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ dateStr, maxTemp, minTemp, precipitation, weatherCode, isToday, isDarkMode }) => {
  const { label, Icon } = getWeatherInfo(weatherCode);
  const dayName = isToday ? 'Today' : format(parseISO(dateStr), 'EEE');

  return (
    <div className={`glass p-4 text-center flex flex-col items-center justify-between transition-colors hover:bg-white/10 ${
      isToday ? (isDarkMode ? 'border-t-2 border-sky-500 bg-sky-500/5' : 'border-t-2 border-sky-500 bg-sky-500/10') : ''
    } ${!isDarkMode ? 'bg-white/50 border-white/60 shadow-xl' : ''}`}>
      <p className={`text-xs font-bold mb-2 uppercase ${isToday ? 'text-sky-500' : (!isDarkMode ? 'text-slate-500' : 'text-white/60')}`}>
        {dayName}
      </p>
      <div className="text-2xl my-2 text-sky-500 flex items-center justify-center">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <p className="font-bold text-lg mb-1">{Math.round(maxTemp)}°</p>
      <p className={`text-xs ${!isDarkMode ? 'text-slate-500' : 'text-white/40'}`}>{Math.round(minTemp)}°</p>
    </div>
  );
}
