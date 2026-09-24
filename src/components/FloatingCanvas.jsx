import React, { useState, useEffect, useRef } from 'react';
import FloatingObject from './FloatingObject';
import InteractiveStickers from './InteractiveStickers';
import { floatingObjectsData } from '../data/projects';

export default function FloatingCanvas({ onSelectProject, onHoverTileChange }) {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  // Check reduced motion preference & viewport size
  useEffect(() => {
    const mediaQueryMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQueryMotion.matches);

    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQueryMotion.addEventListener('change', handleMotionChange);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      mediaQueryMotion.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Global mouse position tracking with normalization (-1 to +1)
  const handleMouseMove = (e) => {
    if (prefersReducedMotion || isMobile) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const normX = (clientX / innerWidth - 0.5) * 2;
    const normY = (clientY / innerHeight - 0.5) * 2;
    setMousePos({ x: normX, y: normY });
  };

  const handleHoverStart = (id) => {
    setHoveredId(id);
    if (onHoverTileChange) onHoverTileChange(id);
  };

  const handleHoverEnd = (id) => {
    setHoveredId((current) => (current === id ? null : current));
    if (onHoverTileChange) onHoverTileChange(null);
  };

  // Filter objects for mobile if needed
  const visibleObjects = isMobile
    ? floatingObjectsData.filter((obj) => obj.mobileVisible)
    : floatingObjectsData;

  const isAnyHovered = hoveredId !== null;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 top-14 sm:top-16 w-full h-[calc(100%-4rem)] overflow-hidden pointer-events-auto"
    >
      {/* Floating Creative Objects Layer */}
      {visibleObjects.map((item, index) => (
        <FloatingObject
          key={item.id}
          item={item}
          index={index}
          mouseX={mousePos.x}
          mouseY={mousePos.y}
          onSelect={onSelectProject}
          isMobile={isMobile}
          prefersReducedMotion={prefersReducedMotion}
          containerRef={containerRef}
          isAnyHovered={isAnyHovered}
          isThisHovered={hoveredId === item.id}
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
        />
      ))}

      {/* Interactive Design Stickers & Kaomoji Artifacts */}
      <InteractiveStickers containerRef={containerRef} isMobile={isMobile} />
    </div>
  );
}
