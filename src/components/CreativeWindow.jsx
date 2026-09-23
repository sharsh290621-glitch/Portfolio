import React from 'react';
import { Maximize2, ExternalLink } from 'lucide-react';

export default function CreativeWindow({
  title,
  category,
  children,
  onExpand,
  onClose,
  isHovered = false,
  className = '',
  width = 190,
  aspectRatio = '16/10',
}) {
  return (
    <div
      className={`group relative rounded-lg sm:rounded-xl border border-studio-border dark:border-studio-border-dark bg-white dark:bg-studio-surface-dark shadow-window dark:shadow-window-dark overflow-hidden transition-all duration-200 ${
        isHovered ? 'shadow-window-hover border-studio-blue/60 dark:border-studio-blue/60' : ''
      } ${className}`}
      style={{ width: typeof width === 'number' ? `${width}px` : width }}
    >
      {/* Window Titlebar */}
      <div className="flex items-center justify-between px-2.5 py-1.5 bg-studio-card dark:bg-studio-card-dark border-b border-studio-border/70 dark:border-studio-border-dark/70 select-none transition-colors">
        {/* Three Control Traffic Dots */}
        <div className="flex items-center gap-1 group/dots flex-shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onClose) onClose();
            }}
            className="w-2 h-2 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:opacity-80 flex items-center justify-center transition-all"
            aria-label="Close window"
          >
            <span className="opacity-0 group-hover/dots:opacity-100 text-[6px] text-[#7A130F] font-bold leading-none select-none">
              ×
            </span>
          </button>
          <div className="w-2 h-2 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onExpand) onExpand();
            }}
            className="w-2 h-2 rounded-full bg-[#27C93F] border border-[#1AAB29] hover:opacity-80 flex items-center justify-center transition-all"
            aria-label="Zoom / Expand window"
          >
            <span className="opacity-0 group-hover/dots:opacity-100 text-[5px] text-[#0D6319] font-bold leading-none select-none">
              +
            </span>
          </button>
        </div>

        {/* Window Title & Category */}
        <div className="flex items-center gap-1.5 px-1.5 min-w-0 flex-1 justify-center">
          <span className="font-mono text-[9px] font-semibold text-studio-dark dark:text-studio-light-text truncate tracking-tight">
            {title}
          </span>
        </div>

        {/* Window Corner Quick Action */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {category && (
            <span className="hidden sm:inline-block font-mono text-[7px] font-medium px-1 py-0.2 rounded bg-studio-border/50 dark:bg-studio-border-dark text-studio-muted dark:text-studio-muted-dark">
              {category}
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onExpand) onExpand();
            }}
            className="text-studio-muted dark:text-studio-muted-dark hover:text-studio-blue p-0.5 rounded transition-colors"
            title="Expand view"
          >
            <Maximize2 size={9} />
          </button>
        </div>
      </div>

      {/* Window Body / Content Screen */}
      <div className="relative w-full overflow-hidden bg-studio-dark/5 dark:bg-black/40">
        <div
          className="w-full relative"
          style={{ aspectRatio: aspectRatio || '16/10' }}
        >
          {children}
        </div>
      </div>

      {/* Bottom Status Bar on Hover */}
      <div className="px-2.5 py-0.5 bg-studio-card/90 dark:bg-studio-card-dark/90 border-t border-studio-border/50 dark:border-studio-border-dark/50 flex items-center justify-between text-[8px] font-mono text-studio-muted dark:text-studio-muted-dark transition-colors">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-studio-blue" />
          <span>{category || 'PROJECT'}</span>
        </span>
        <span className="text-studio-blue opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 font-medium">
          <span>EXPAND</span>
          <ExternalLink size={7} />
        </span>
      </div>
    </div>
  );
}
