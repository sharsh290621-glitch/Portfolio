import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function PenToolCursor({ containerRef, activeMode = 'pen', isVisible = true }) {
  const [inBounds, setInBounds] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Snappy smooth spring tracking
  const springConfig = { damping: 30, stiffness: 450, mass: 0.1 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Check if cursor is over the navbar, about-showreel section, or any modal
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const isOverNavbar = target?.closest('header') || e.clientY < 56;
      const isOverShowreel = target?.closest('#about-showreel') || false;
      const isOverModal = target?.closest('[role="dialog"]') || target?.closest('.z-50') || false;

      if (isOverNavbar || isOverShowreel || isOverModal) {
        setInBounds(false);
        return;
      }

      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          // Additional check: if cursor is within showreel element bounding box that overlaps hero
          const showreelEl = document.getElementById('about-showreel');
          if (showreelEl) {
            const sRect = showreelEl.getBoundingClientRect();
            if (
              e.clientX >= sRect.left &&
              e.clientX <= sRect.right &&
              e.clientY >= sRect.top &&
              e.clientY <= sRect.bottom
            ) {
              setInBounds(false);
              return;
            }
          }

          setInBounds(true);
          mouseX.set(e.clientX);
          mouseY.set(e.clientY);
        } else {
          setInBounds(false);
        }
      } else {
        setInBounds(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setInBounds(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [containerRef, mouseX, mouseY]);

  if (!isVisible || !inBounds) return null;

  return (
    <motion.div
      style={{
        x: cursorX,
        y: cursorY,
        position: 'fixed',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: 99999,
      }}
      className="hidden md:block will-change-transform"
    >
      {/* Precision Tip Hot Spot anchored exactly at top center (12px offset) */}
      <div className="relative -left-[12px] top-0">
        <motion.div
          animate={{
            scale: isClicking ? 0.78 : 1,
            rotate: activeMode === 'rotate' ? -15 : 0,
          }}
          transition={{ duration: 0.1 }}
          className="relative filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]"
        >
          {/* Iconic Upright Photoshop Vector Pen Nib (User Reference #2) */}
          <svg
            width="24"
            height="31"
            viewBox="0 0 24 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Pen Nib Body with high-contrast fill & crisp stroke */}
            <path
              d="M12 0.5 L0.5 14.5 L4 20.5 L20 20.5 L23.5 14.5 Z"
              fill="#0F172A"
              stroke="#FFFFFF"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />

            {/* Vertical Center Slit */}
            <line
              x1="12"
              y1="0.5"
              x2="12"
              y2="12.5"
              stroke="#FFFFFF"
              strokeWidth="1.3"
              strokeLinecap="round"
            />

            {/* Circular Breather Hole */}
            <circle cx="12" cy="13.8" r="2.2" fill="#FFFFFF" />

            {/* Collar Tier 1 */}
            <rect
              x="1.8"
              y="21.5"
              width="20.4"
              height="3.8"
              rx="1.2"
              fill="#0F172A"
              stroke="#FFFFFF"
              strokeWidth="1.3"
            />

            {/* Collar Tier 2 (Base) */}
            <rect
              x="3.8"
              y="26.2"
              width="16.4"
              height="3.8"
              rx="1.2"
              fill="#0F172A"
              stroke="#FFFFFF"
              strokeWidth="1.3"
            />

            {/* Active Pixel Precision Tip Indicator */}
            <circle cx="12" cy="0.8" r="1.1" fill="#0055FF" />
          </svg>

          {/* Mode Sub-Badge (Anchor ^ / Plus + / Rotate ⟲ / Warp ❖) */}
          {activeMode === 'anchor' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-2 top-2 bg-studio-blue text-white rounded-full w-3.5 h-3.5 flex items-center justify-center font-mono text-[8px] font-black shadow-sm"
            >
              ^
            </motion.div>
          )}

          {activeMode === 'add' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-2 top-2 bg-emerald-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center font-mono text-[9px] font-black shadow-sm"
            >
              +
            </motion.div>
          )}

          {activeMode === 'rotate' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-2 top-2 bg-studio-yellow text-studio-dark rounded-full w-3.5 h-3.5 flex items-center justify-center font-mono text-[8px] font-black shadow-sm"
            >
              ⟲
            </motion.div>
          )}

          {activeMode === 'warp' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-2 top-2 bg-purple-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center font-mono text-[8px] font-black shadow-sm"
            >
              ❖
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
