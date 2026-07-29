import React from 'react';
import { Lightbulb } from 'lucide-react';

interface SmartInsightsProps {
  recommendations: string[];
  isDarkMode?: boolean;
}

export function SmartInsights({ recommendations, isDarkMode }: SmartInsightsProps) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div>
      <h2 className="text-xs uppercase tracking-widest text-sky-500 font-bold mb-4">Smart Insights</h2>
      <div className="space-y-4">
        {recommendations.map((rec, idx) => {
          // Assign random border colors to simulate the design
          const borderColors = ['border-amber-500', 'border-sky-500', 'border-emerald-500', 'border-indigo-500'];
          const borderColor = borderColors[idx % borderColors.length];
          return (
            <div key={idx} className={`p-4 rounded-xl border-l-4 ${borderColor} ${isDarkMode ? 'glass-dark' : 'bg-white/50 border border-white/60 shadow-md'}`}>
              <p className={`text-sm font-semibold mb-1 ${!isDarkMode ? 'text-slate-800' : 'text-white'}`}>Insight #{idx + 1}</p>
              <p className={`text-xs leading-relaxed ${!isDarkMode ? 'text-slate-600' : 'text-white/60'}`}>{rec}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
