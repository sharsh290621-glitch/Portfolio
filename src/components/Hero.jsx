import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PortfolioNavbar from './PortfolioNavbar';
import HeroTypography from './HeroTypography';
import FloatingCanvas from './FloatingCanvas';
import PenToolCursor from './PenToolCursor';
import { Mouse, ArrowDown } from 'lucide-react';

export default function Hero({ onSelectProject, onExploreClick }) {
  const containerRef = useRef(null);
  const [hoveredTileId, setHoveredTileId] = useState(null);
  const [cursorMode, setCursorMode] = useState('pen');

  // Scroll-linked transition effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.94]);
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, -40]);
  const canvasDrift = useTransform(scrollYProgress, [0, 0.8], [1, 1.15]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full h-screen min-h-[680px] max-h-[1200px] overflow-hidden flex flex-col justify-between bg-studio-bg dark:bg-studio-bg-dark transition-colors duration-300 select-none cursor-none"
    >
      {/* Photoshop Custom Pen Tool Cursor Follower */}
      <PenToolCursor containerRef={containerRef} activeMode={cursorMode} />

      {/* Fixed/Sticky Top Navigation with Music Player & Theme Toggle */}
      <PortfolioNavbar onSelectSection={onExploreClick} onOpenProject={onSelectProject} />

      {/* Interactive Creative Desktop Canvas */}
      <motion.div
        style={{ scale: canvasDrift, opacity: heroOpacity }}
        className="absolute inset-0 w-full h-full"
      >
        <FloatingCanvas
          onSelectProject={onSelectProject}
          onHoverTileChange={(id) => setHoveredTileId(id)}
        />
      </motion.div>

      {/* Central Identity Typography Layer with Pen Tool Vector Transform Box */}
      <div className="relative w-full h-full flex items-center justify-center pt-16 pb-12 z-20 pointer-events-none">
        <motion.div
          style={{ scale: heroScale, y: heroY, opacity: heroOpacity }}
          className="w-full"
        >
          <HeroTypography
            onExploreClick={onExploreClick}
            onCursorModeChange={setCursorMode}
          />
        </motion.div>
      </div>

      {/* Bottom Workspace Status & Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.8 }}
        style={{ opacity: heroOpacity }}
        className="relative z-30 px-6 py-4 flex items-center justify-between font-mono text-[10px] text-studio-muted dark:text-studio-muted-dark pointer-events-none"
      >
        {/* Left Drag/Interact Hint */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-studio-blue" />
          <span className="uppercase tracking-widest text-studio-dark dark:text-studio-light-text font-medium">
            CREATIVE DESKTOP
          </span>
          <span className="text-studio-subtle dark:text-studio-subtle-dark">• DRAG TILES &amp; BUDDY FREELY</span>
        </div>

        {/* Center/Right Scroll Cue */}
        <button
          type="button"
          onClick={onExploreClick}
          className="pointer-events-auto mx-auto sm:mx-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-studio-card/90 dark:bg-studio-card-dark/90 border border-studio-border dark:border-studio-border-dark hover:border-studio-blue text-studio-dark dark:text-studio-light-text hover:text-studio-blue transition-all shadow-sm group"
        >
          <Mouse size={11} className="group-hover:translate-y-0.5 transition-transform" />
          <span className="tracking-wider uppercase font-semibold">SCROLL TO EXPLORE</span>
          <ArrowDown size={10} className="group-hover:translate-y-0.5 transition-transform" />
        </button>

        {/* Right Corner Coordinates / Version */}
        <div className="hidden sm:block text-right text-studio-subtle dark:text-studio-subtle-dark">
          <span>WORKSPACE OS // HARSH SHAH STUDIO</span>
        </div>
      </motion.div>
    </section>
  );
}
