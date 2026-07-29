import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

interface WeatherChartProps {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
  isDarkMode: boolean;
}

export function WeatherChart({ daily, isDarkMode }: WeatherChartProps) {
  if (!daily || !daily.time) return null;

  const data = daily.time.map((t, i) => ({
    name: format(parseISO(t), 'MMM d'),
    max: daily.temperature_2m_max[i],
    min: daily.temperature_2m_min[i],
  }));

  const textColor = isDarkMode ? '#e2e8f0' : '#475569';
  const gridColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  return (
    <div className="w-full h-64 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke={textColor} tick={{fill: textColor}} tickLine={false} axisLine={false} />
          <YAxis stroke={textColor} tick={{fill: textColor}} tickLine={false} axisLine={false} />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
              borderRadius: '0.75rem',
              border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
              color: isDarkMode ? '#fff' : '#000',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            itemStyle={{ color: isDarkMode ? '#e2e8f0' : '#1e293b' }}
          />
          <Area type="monotone" dataKey="max" name="High (°C)" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorMax)" />
          <Area type="monotone" dataKey="min" name="Low (°C)" stroke="#6366f1" fillOpacity={1} fill="url(#colorMin)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
