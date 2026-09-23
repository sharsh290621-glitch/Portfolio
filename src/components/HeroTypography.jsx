import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { designerBio } from '../data/projects';
import DoodleEyes from './DoodleEyes';
import VectorTransformBox from './VectorTransformBox';

export default function HeroTypography({ onExploreClick, onAboutClick, onCursorModeChange }) {
  const [warpState, setWarpState] = useState(null);

  return (
    <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto pointer-events-none select-none">
      {/* Top Folio Pill */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-studio-card dark:bg-studio-card-dark border border-studio-border/90 dark:border-studio-border-dark shadow-subtle mb-3 sm:mb-4 transition-colors"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-studio-dark dark:bg-studio-blue" />
        <span className="font-mono text-[10px] sm:text-[11px] font-medium tracking-widest text-studio-muted dark:text-studio-muted-dark uppercase">
          FOLIO 2026 • ORIGINAL WORKS
        </span>
      </motion.div>

      {/* Interactive Doodle Eyes (Centered above name, tracks cursor & warp) */}
      <div className="mb-1 sm:mb-2 flex justify-center">
        <DoodleEyes warpState={warpState} />
      </div>

      {/* Photoshop Pen Tool Vector Transform Bounding Box with Draggable Anchor Points */}
      <VectorTransformBox
        onWarpStateChange={setWarpState}
        onCursorModeChange={onCursorModeChange}
      >
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-[108px] xl:text-[124px] leading-[0.84] tracking-tight text-studio-dark dark:text-studio-light-text text-center select-none transition-colors px-3 py-1 cursor-default"
        >
          <span className="block hover:text-studio-blue transition-colors duration-300">
            HARSH
          </span>
          <span className="block hover:text-studio-blue transition-colors duration-300 mt-1 sm:mt-2">
            SHAH
          </span>
        </motion.h1>
      </VectorTransformBox>

      {/* Subtitle / Role with Wide Spaced Typography */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 sm:mt-8 font-mono text-xs sm:text-sm font-bold tracking-[0.24em] text-studio-dark dark:text-white uppercase transition-colors"
      >
        MULTIDISCIPLINARY DESIGNER
      </motion.div>

      {/* Editorial Bio Line */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="mt-3 text-sm sm:text-base md:text-lg font-medium text-studio-muted dark:text-studio-muted-dark font-sans transition-colors"
      >
        I design visuals, interfaces and experiences.
      </motion.p>

      {/* Dual CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="mt-7 sm:mt-9 flex items-center gap-3 sm:gap-4 pointer-events-auto"
      >
        {/* Primary Button */}
        <button
          type="button"
          onClick={onExploreClick}
          className="group inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-studio-dark dark:bg-studio-blue text-white font-mono text-xs font-semibold tracking-wider transition-all duration-300 hover:bg-studio-blue dark:hover:bg-studio-blue-dark hover:shadow-lg hover:shadow-studio-blue/25 active:scale-95"
        >
          <span>EXPLORE WORK</span>
          <ArrowUpRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </button>

        {/* Secondary Button */}
        <button
          type="button"
          onClick={onAboutClick || onExploreClick}
          className="group inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white dark:bg-studio-card-dark border border-studio-border dark:border-studio-border-dark text-studio-dark dark:text-white font-mono text-xs font-semibold tracking-wider transition-all duration-300 hover:border-studio-blue hover:text-studio-blue hover:shadow-sm active:scale-95"
        >
          <span>ABOUT ME</span>
          <ArrowUpRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </button>
      </motion.div>
    </div>
  );
}
