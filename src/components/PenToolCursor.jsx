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
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          setInBounds(true);
          mouseX.set(e.clientX);
          mouseY.set(e.clientY);
        } else {
          setInBounds(false);
        }
      } else {
        setInBounds(true);
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setInBounds(false);

    window.addEventListener('mousemove', handleMouseMove);
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
      {/* Precision Tip Indicator Circle (Hot spot at 0,0) */}
      <div className="relative">
        <motion.div
          animate={{
            scale: isClicking ? 0.75 : 1,
            rotate: activeMode === 'rotate' ? -15 : 0,
          }}
          transition={{ duration: 0.1 }}
          className="relative -top-[1px] -left-[1px] filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]"
        >
          {/* Classic Photoshop Pen Tool SVG (Tip point anchored at top-left 0,0) */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Pen Nib Body (Metallic Gradient) */}
            <path
              d="M1 1 L11 4.5 L17 10.5 L10.5 17 L4.5 11 Z"
              fill="url(#pen-metal)"
              stroke="#0f172a"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Pen Shaft / Handle */}
            <path
              d="M10.5 17 L17 10.5 L24 17.5 C25.5 19 25.5 21.5 24 23 C22.5 24.5 20 24.5 18.5 23 L10.5 17 Z"
              fill="#1E293B"
              stroke="#0f172a"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Chrome Collar Band */}
            <path
              d="M10 16.5 L16.5 10 L17.5 11 L11 17.5 Z"
              fill="#94A3B8"
              stroke="#0f172a"
              strokeWidth="0.8"
            />
            {/* Center Slit Line */}
            <line
              x1="1"
              y1="1"
              x2="9"
              y2="9"
              stroke="#0f172a"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Breather Hole */}
            <circle cx="9.5" cy="9.5" r="1.3" fill="#0f172a" />
            
            {/* Tip Hot Spot Target (Pixel Precision) */}
            <circle cx="1" cy="1" r="0.8" fill="#0055FF" />

            <defs>
              <linearGradient id="pen-metal" x1="1" y1="1" x2="17" y2="17" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#E2E8F0" />
                <stop offset="70%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>
            </defs>
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
