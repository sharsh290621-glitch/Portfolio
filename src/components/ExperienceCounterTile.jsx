import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function ExperienceCounterTile({
  startDate = '2023-12-01T00:00:00',
  isHovered = false,
  width = 210,
}) {
  const [timeData, setTimeData] = useState({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
    formattedString: '00y 000d 00h 00s',
  });

  useEffect(() => {
    const start = new Date(startDate).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const diffMs = Math.max(0, now - start);

      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const years = Math.floor(totalDays / 365.25);
      const remainingDays = Math.floor(totalDays % 365.25);
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      const pad = (n, len = 2) => String(n).padStart(len, '0');
      const formattedString = `${pad(years)}y ${pad(remainingDays)}d ${pad(hours)}h ${pad(seconds)}s`;

      setTimeData({
        years,
        days: remainingDays,
        hours,
        minutes,
        seconds,
        totalDays,
        formattedString,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div
      className={`group relative rounded-xl border border-studio-border dark:border-studio-border-dark bg-white/95 dark:bg-studio-surface-dark/95 backdrop-blur-md shadow-window dark:shadow-window-dark overflow-hidden transition-all duration-300 select-none ${
        isHovered
          ? 'shadow-window-hover border-studio-blue/70 dark:border-studio-blue/70 ring-1 ring-studio-blue/20'
          : ''
      }`}
      style={{ width: typeof width === 'number' ? `${width}px` : width }}
    >
      {/* Top Studio Titlebar */}
      <div className="flex items-center justify-between px-2.5 py-1.5 bg-studio-card dark:bg-studio-card-dark border-b border-studio-border/70 dark:border-studio-border-dark/70">
        {/* macOS Traffic Dots */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
          <div className="w-2 h-2 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
          <div className="w-2 h-2 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
        </div>

        {/* Title */}
        <div className="flex items-center gap-1 px-1">
          <Clock size={9} className="text-studio-blue" />
          <span className="font-mono text-[9px] font-bold text-studio-dark dark:text-white tracking-wide uppercase">
            Total Experience
          </span>
        </div>

        {/* Live Status Indicator */}
        <div className="flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[7px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>LIVE</span>
        </div>
      </div>

      {/* Main Single Counter Display */}
      <div className="p-2.5 bg-gradient-to-b from-transparent to-studio-blue/[0.03] dark:to-studio-blue/[0.06] flex flex-col items-center justify-center gap-1">
        <div className="w-full py-1.5 px-2 rounded-lg bg-studio-dark/5 dark:bg-black/40 border border-studio-border/60 dark:border-white/10 flex items-center justify-center">
          <span className="font-mono text-xs sm:text-[13px] font-black tracking-tight text-studio-blue dark:text-sky-300 drop-shadow-sm whitespace-nowrap">
            {timeData.formattedString}
          </span>
        </div>

        {/* Minimal Footnote */}
        <div className="flex items-center justify-between w-full px-1 text-[7.5px] font-mono text-studio-muted dark:text-studio-muted-dark">
          <span>SINCE DEC 01, 2023</span>
          <span className="font-semibold text-studio-dark dark:text-white">{timeData.totalDays} DAYS</span>
        </div>
      </div>
    </div>
  );
}
