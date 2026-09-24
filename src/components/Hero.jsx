import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroTypography from './HeroTypography';
import FloatingCanvas from './FloatingCanvas';
import PenToolCursor from './PenToolCursor';

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
      className="relative w-full h-screen min-h-[680px] max-h-[1200px] overflow-hidden flex flex-col justify-between bg-transparent transition-colors duration-300 select-none cursor-none"
    >
      {/* Photoshop Custom Pen Tool Cursor Follower */}
      <PenToolCursor containerRef={containerRef} activeMode={cursorMode} />

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
    </section>
  );
}
