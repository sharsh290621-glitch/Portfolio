import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

const DOODLE_QUOTES = [
  'MAKE GOOD SHIT! 🚀',
  "I'm Harsh's desk buddy! 👋",
  'Design is thinking made visual.',
  'Pixels + Motion = Magic ✨',
  'Chilling with slow jazz 🎷',
  'Drag me anywhere on your desk!',
  'Nice cursor moves! 👀'
];

export default function DoodleBuddy({ containerRef, isMobile = false }) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showSpeech, setShowSpeech] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHappy, setIsHappy] = useState(false);

  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const [leftPupilPos, setLeftPupilPos] = useState({ x: 0, y: 0 });
  const [rightPupilPos, setRightPupilPos] = useState({ x: 0, y: 0 });

  // Calculate Eye Pupil tracking towards mouse cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      const calculatePupilOffset = (eyeElement) => {
        if (!eyeElement) return { x: 0, y: 0 };
        const rect = eyeElement.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const deltaX = e.clientX - eyeCenterX;
        const deltaY = e.clientY - eyeCenterY;
        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.min(Math.hypot(deltaX, deltaY), 300);

        // Maximum pupil displacement within eye socket (5.5px)
        const maxRadius = 5.5;
        const radius = (distance / 300) * maxRadius;

        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
        };
      };

      setLeftPupilPos(calculatePupilOffset(leftEyeRef.current));
      setRightPupilPos(calculatePupilOffset(rightEyeRef.current));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Natural Blinking Cycle
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 4000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsHappy(true);
    setQuoteIndex((prev) => (prev + 1) % DOODLE_QUOTES.length);
    setShowSpeech(true);
    setTimeout(() => setIsHappy(false), 800);
    setTimeout(() => setShowSpeech(false), 3500);
  };

  return (
    <motion.div
      drag={!isMobile}
      dragConstraints={containerRef}
      dragElastic={0.08}
      dragMomentum={true}
      whileDrag={{ scale: 1.12, cursor: 'grabbing', zIndex: 9999 }}
      whileHover={{ scale: 1.06, cursor: 'grab' }}
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.6, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute',
        right: '18%',
        bottom: '16%',
        zIndex: 25,
        touchAction: isMobile ? 'auto' : 'none',
      }}
      className="select-none will-change-transform group/doodle"
    >
      {/* Speech Bubble Popover */}
      <AnimatePresence>
        {showSpeech && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.85 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-full bg-studio-dark text-white dark:bg-white dark:text-studio-dark font-mono text-[10px] font-bold shadow-xl border border-white/20 dark:border-studio-border pointer-events-none z-50 flex items-center gap-1.5"
          >
            <span>{DOODLE_QUOTES[quoteIndex]}</span>
            {/* Bubble arrow */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-studio-dark dark:bg-white rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Doodle Mascot SVG Body */}
      <div className="relative w-24 sm:w-28 h-auto drop-shadow-lg group-hover/doodle:drop-shadow-2xl transition-all">
        <svg viewBox="0 0 110 110" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="doodle-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0055FF" />
              <stop offset="100%" stop-color="#003CBD" />
            </linearGradient>
            <linearGradient id="doodle-belly-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#FFFFFF" />
              <stop offset="100%" stop-color="#EDF2F7" />
            </linearGradient>
          </defs>

          {/* Little Antenna with glowing tip */}
          <line x1="55" y1="20" x2="55" y2="8" stroke="#111111" className="dark:stroke-white" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="55" cy="7" r="5" fill="#FFBD2E" stroke="#111111" className="dark:stroke-white" strokeWidth="2" />

          {/* Little Feet */}
          <ellipse cx="40" cy="100" rx="10" ry="5" fill="#111111" className="dark:fill-white" />
          <ellipse cx="70" cy="100" rx="10" ry="5" fill="#111111" className="dark:fill-white" />

          {/* Main Rounded Character Body */}
          <rect
            x="20"
            y="20"
            width="70"
            height="78"
            rx="35"
            fill="url(#doodle-body-grad)"
            stroke="#111111"
            className="dark:stroke-white"
            strokeWidth="3.5"
          />

          {/* White Belly Patch */}
          <rect
            x="32"
            y="52"
            width="46"
            height="40"
            rx="20"
            fill="url(#doodle-belly-grad)"
            stroke="#111111"
            className="dark:stroke-white"
            strokeWidth="2"
          />

          {/* Left Eye Socket */}
          <g ref={leftEyeRef} transform="translate(38, 38)">
            <ellipse
              cx="0"
              cy="0"
              rx="10"
              ry={isBlinking ? 1 : 12}
              fill="#FFFFFF"
              stroke="#111111"
              className="dark:stroke-white"
              strokeWidth="3"
            />
            {/* Eye Pupil following cursor */}
            {!isBlinking && (
              <g transform={`translate(${leftPupilPos.x}, ${leftPupilPos.y})`}>
                <circle cx="0" cy="0" r="5" fill="#111111" />
                <circle cx="-1.5" cy="-1.5" r="1.5" fill="#FFFFFF" />
              </g>
            )}
          </g>

          {/* Right Eye Socket */}
          <g ref={rightEyeRef} transform="translate(72, 38)">
            <ellipse
              cx="0"
              cy="0"
              rx="10"
              ry={isBlinking ? 1 : 12}
              fill="#FFFFFF"
              stroke="#111111"
              className="dark:stroke-white"
              strokeWidth="3"
            />
            {/* Eye Pupil following cursor */}
            {!isBlinking && (
              <g transform={`translate(${rightPupilPos.x}, ${rightPupilPos.y})`}>
                <circle cx="0" cy="0" r="5" fill="#111111" />
                <circle cx="-1.5" cy="-1.5" r="1.5" fill="#FFFFFF" />
              </g>
            )}
          </g>

          {/* Cute Rosy Cheeks */}
          <ellipse cx="28" cy="48" rx="4" ry="2.5" fill="#FF5F56" opacity="0.8" />
          <ellipse cx="82" cy="48" rx="4" ry="2.5" fill="#FF5F56" opacity="0.8" />

          {/* Cute Mouth */}
          {isHappy ? (
            <path d="M47,56 Q55,67 63,56" fill="#FF5F56" stroke="#111111" className="dark:stroke-white" strokeWidth="2.5" strokeLinecap="round" />
          ) : (
            <path d="M49,58 Q55,64 61,58" fill="none" stroke="#111111" className="dark:stroke-white" strokeWidth="2.5" strokeLinecap="round" />
          )}

          {/* Little Hands */}
          <ellipse cx="18" cy="58" rx="5" ry="7" fill="#0055FF" stroke="#111111" className="dark:stroke-white" strokeWidth="2.5" transform="rotate(15 18 58)" />
          <ellipse cx="92" cy="58" rx="5" ry="7" fill="#0055FF" stroke="#111111" className="dark:stroke-white" strokeWidth="2.5" transform="rotate(-15 92 58)" />
        </svg>

        {/* Mascot Micro Label Badge on Hover */}
        <div className="mt-1 text-center font-mono text-[8px] font-bold text-studio-dark dark:text-white bg-white/80 dark:bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-studio-border dark:border-studio-border-dark opacity-0 group-hover/doodle:opacity-100 transition-opacity">
          DESK BUDDY • CLICK ME
        </div>
      </div>
    </motion.div>
  );
}
