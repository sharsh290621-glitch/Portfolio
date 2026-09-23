import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CreativeWindow from './CreativeWindow';
import MockVideo from './MockVideo';
import { Folder, ExternalLink } from 'lucide-react';

export default function FloatingObject({
  item,
  index = 0,
  mouseX,
  mouseY,
  onSelect,
  isMobile = false,
  prefersReducedMotion = false,
  containerRef,
  isAnyHovered = false,
  isThisHovered = false,
  onHoverStart,
  onHoverEnd,
}) {
  const [isDragging, setIsDragging] = useState(false);

  // Parallax offset (applied on inner wrapper, subtle physical response)
  const parallaxX = prefersReducedMotion || isMobile ? 0 : mouseX * (item.parallaxFactor || 1) * 12;
  const parallaxY = prefersReducedMotion || isMobile ? 0 : mouseY * (item.parallaxFactor || 1) * 12;

  // Staggered entrance initial vector
  const entranceDelay = 0.25 + index * 0.07;
  const initialVectorX = (index % 2 === 0 ? -1 : 1) * (20 + (index % 4) * 10);
  const initialVectorY = index < 4 ? -20 : 20;

  // Render object content according to type
  const renderContent = () => {
    switch (item.type) {
      case 'window-video':
        return (
          <CreativeWindow
            title={item.windowTitle || item.title}
            category={item.category}
            width={item.width || 175}
            aspectRatio={item.aspectRatio || '16/10'}
            isHovered={isThisHovered}
            onExpand={() => onSelect(item)}
          >
            <MockVideo
              src={item.video}
              poster={item.image}
              title={item.title}
              category={item.category}
            />
          </CreativeWindow>
        );

      case 'window-ui':
      case 'window-image':
        return (
          <CreativeWindow
            title={item.windowTitle || item.title}
            category={item.category}
            width={item.width || 185}
            aspectRatio={item.aspectRatio || '16/10'}
            isHovered={isThisHovered}
            onExpand={() => onSelect(item)}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover block pointer-events-none select-none"
              loading="lazy"
            />
          </CreativeWindow>
        );

      case 'graphic-poster':
        return (
          <div
            className={`group relative rounded-lg border border-studio-border bg-studio-dark shadow-window overflow-hidden transition-all duration-300 ${
              isThisHovered ? 'shadow-window-hover border-studio-blue/60' : ''
            }`}
            style={{ width: `${item.width || 130}px` }}
          >
            <div className="relative w-full" style={{ aspectRatio: '1/1.41' }}>
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover block pointer-events-none select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                <span className="font-mono text-[7px] text-white/80 uppercase tracking-widest bg-black/60 backdrop-blur-sm self-start px-1.5 py-0.5 rounded">
                  {item.category}
                </span>
                <span className="font-mono text-[8px] text-white font-semibold flex items-center justify-between">
                  <span className="truncate">{item.title}</span>
                  <ExternalLink size={9} className="text-studio-blue flex-shrink-0" />
                </span>
              </div>
            </div>
          </div>
        );

      case 'sticky-note':
        return (
          <div
            className="relative cursor-pointer transition-transform duration-300 select-none"
            style={{ width: `${item.width || 115}px` }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-auto block pointer-events-none select-none drop-shadow-md"
            />
          </div>
        );

      case 'folder':
        return (
          <div
            className="group relative flex flex-col items-center cursor-pointer transition-transform duration-300 select-none"
            style={{ width: `${item.width || 115}px` }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-auto block pointer-events-none select-none drop-shadow-md group-hover:drop-shadow-xl transition-all"
            />
            {/* Desktop-style folder label badge */}
            <div className="mt-1 px-2 py-0.5 rounded-md bg-studio-dark/85 backdrop-blur-md text-white font-mono text-[9px] font-semibold tracking-wide flex items-center gap-1 shadow-sm group-hover:bg-studio-blue transition-colors">
              <Folder size={10} className="text-sky-300" />
              <span>{item.title}</span>
            </div>
          </div>
        );

      default:
        return (
          <CreativeWindow
            title={item.title}
            category={item.category}
            width={item.width || 180}
            onExpand={() => onSelect(item)}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover block pointer-events-none"
            />
          </CreativeWindow>
        );
    }
  };

  // Determine scale and visual focus (blur out other tiles, pop this tile forward)
  const isBlurred = isAnyHovered && !isThisHovered;
  const activeScale = isThisHovered ? 1.45 : 1.0;

  return (
    <motion.div
      drag={!isMobile}
      dragConstraints={containerRef}
      dragElastic={0.08}
      dragMomentum={true}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => {
        setTimeout(() => setIsDragging(false), 50);
      }}
      onClick={() => {
        if (!isDragging && onSelect) {
          onSelect(item);
        }
      }}
      initial={{
        opacity: 0,
        x: initialVectorX,
        y: initialVectorY,
        rotate: (item.rotation || 0) * 1.2,
      }}
      animate={{
        opacity: isBlurred ? 0.35 : 1,
        rotate: isThisHovered ? 0 : item.rotation || 0,
        scale: isBlurred ? 0.94 : activeScale,
        filter: isBlurred
          ? 'blur(3.5px) brightness(0.92)'
          : isThisHovered
          ? 'blur(0px) drop-shadow(0 30px 60px rgba(0,0,0,0.3))'
          : 'blur(0px)',
      }}
      transition={{
        opacity: { duration: 0.25, ease: 'easeOut' },
        scale: { type: 'spring', stiffness: 280, damping: 22 },
        rotate: { type: 'spring', stiffness: 240, damping: 20 },
        filter: { duration: 0.2, ease: 'easeOut' },
        default: { duration: 0.6, delay: entranceDelay, ease: [0.16, 1, 0.3, 1] },
      }}
      whileDrag={{
        scale: 1.25,
        rotate: (item.rotation || 0) + 3,
        zIndex: 9999,
        cursor: 'grabbing',
        filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.35))',
        transition: { duration: 0.15 },
      }}
      onMouseEnter={() => {
        if (onHoverStart) onHoverStart(item.id);
      }}
      onMouseLeave={() => {
        if (onHoverEnd) onHoverEnd(item.id);
      }}
      style={{
        position: 'absolute',
        left: `${item.x}%`,
        top: `${item.y}%`,
        zIndex: isThisHovered || isDragging ? 9999 : item.zIndex || 10,
        touchAction: isMobile ? 'auto' : 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        transformOrigin: 'center center',
      }}
      className="select-none will-change-transform"
    >
      {/* Static / Parallax Layer (No continuous oscillating idle float) */}
      <motion.div
        animate={
          prefersReducedMotion || isMobile
            ? {}
            : {
                x: parallaxX,
                y: parallaxY,
              }
        }
        transition={{
          x: { type: 'spring', stiffness: 100, damping: 20 },
          y: { type: 'spring', stiffness: 100, damping: 20 },
        }}
        className="relative"
      >
        {renderContent()}

        {/* Floating Metadata Pill on Hover */}
        {isThisHovered && !isDragging && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none whitespace-nowrap px-2.5 py-0.5 rounded-full bg-studio-dark text-white font-mono text-[8px] shadow-xl flex items-center gap-1.5 border border-white/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-studio-blue" />
            <span className="font-semibold">{item.title}</span>
            <span className="text-white/40">•</span>
            <span className="text-white/80">{item.category}</span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
