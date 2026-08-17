import React, { useState } from 'react';
import { AlertCircle, Pause, Play, ChevronRight } from 'lucide-react';

interface BreakingNewsTickerProps {
  items: string[];
  onSelectTickerItem?: (headline: string) => void;
}

export const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({
  items,
  onSelectTickerItem
}) => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="bg-[#B91C1C] text-white border-b-2 border-red-900 shadow-md">
      <div className="max-w-7xl mx-auto flex items-stretch overflow-hidden">
        
        {/* Ticker Badge Label */}
        <div className="bg-white text-[#B91C1C] font-black px-3 sm:px-4 py-2 flex items-center gap-1.5 shrink-0 z-10 uppercase tracking-wider text-[11px] sm:text-xs rounded-r-md my-1 ml-2 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-700"></span>
          </span>
          <AlertCircle className="w-3.5 h-3.5 text-[#B91C1C] hidden sm:inline" />
          <span>Breaking News</span>
        </div>

        {/* Ticker Continuous Content Container */}
        <div className="relative flex-1 overflow-hidden py-2 flex items-center">
          <div 
            className={`whitespace-nowrap flex items-center ${isPaused ? '' : 'animate-ticker'}`}
            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
          >
            {/* Duplicate list to create seamless infinite marquee */}
            {[...items, ...items].map((item, idx) => (
              <span
                key={idx}
                onClick={() => onSelectTickerItem?.(item)}
                className="inline-flex items-center gap-2 px-6 text-xs sm:text-sm font-semibold text-slate-100 hover:text-amber-200 cursor-pointer transition font-sans-marathi"
              >
                <span className="text-amber-400 font-bold">🔴</span>
                <span>{item}</span>
                <span className="text-red-400 text-xs ml-4">|</span>
              </span>
            ))}
          </div>
        </div>

        {/* Play / Pause Toggle Button */}
        <div className="bg-red-800 shrink-0 flex items-center px-2 z-10 border-l border-red-900">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 text-red-200 hover:text-white rounded hover:bg-red-900 transition"
            title={isPaused ? "सुरू करा" : "थांबवा"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>
    </div>
  );
};
