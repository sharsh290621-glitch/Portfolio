import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function DoodleEyes({ className = '', warpState = null }) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isWinking, setIsWinking] = useState(false);

  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const [leftPupil, setLeftPupil] = useState({ x: 0, y: 0 });
  const [rightPupil, setRightPupil] = useState({ x: 0, y: 0 });
  const [eyebrowTilt, setEyebrowTilt] = useState(0);

  // Calculate Eye Pupil movement tracking cursor or active warp handle
  useEffect(() => {
    const handleMouseMove = (e) => {
      const targetX = warpState?.isWarping && warpState.handleScreenX ? warpState.handleScreenX : e.clientX;
      const targetY = warpState?.isWarping && warpState.handleScreenY ? warpState.handleScreenY : e.clientY;

      const getPupilOffset = (eyeElement) => {
        if (!eyeElement) return { x: 0, y: 0 };
        const rect = eyeElement.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const deltaX = targetX - eyeCenterX;
        const deltaY = targetY - eyeCenterY;
        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.min(Math.hypot(deltaX, deltaY), 600);

        // Maximum pupil displacement in oval socket
        const maxRadiusX = 9.5;
        const maxRadiusY = 12.5;
        const factor = Math.min(distance / 200, 1);

        return {
          x: Math.cos(angle) * maxRadiusX * factor,
          y: Math.sin(angle) * maxRadiusY * factor,
        };
      };

      const left = getPupilOffset(leftEyeRef.current);
      const right = getPupilOffset(rightEyeRef.current);
      setLeftPupil(left);
      setRightPupil(right);

      // Eyebrow tilt
      const normalizedX = (targetX / window.innerWidth - 0.5) * 2;
      setEyebrowTilt(warpState?.isWarping ? -8 : normalizedX * 4);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [warpState]);

  // Periodic natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
    }, 3800 + Math.random() * 2500);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleEyeClick = (e) => {
    e.stopPropagation();
    setIsWinking(true);
    setTimeout(() => setIsWinking(false), 450);
  };

  return (
    <motion.div
      onClick={handleEyeClick}
      initial={{ opacity: 0, scale: 0.7, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`relative inline-flex items-center justify-center cursor-pointer pointer-events-auto select-none group/eyes ${className}`}
      title="Click to wink!"
    >
      <svg
        viewBox="0 0 160 90"
        className="w-24 sm:w-28 md:w-32 h-auto overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Left Eyebrow */}
          <path
            d="M20,18 C28,8 48,8 60,18"
            fill="none"
            stroke="#111111"
            className="dark:stroke-white transition-colors"
            strokeWidth="5.5"
            style={{
              transformOrigin: '40px 14px',
              transform: `rotate(${eyebrowTilt - 3}deg)`,
              transition: 'transform 0.1s ease-out',
            }}
          />

          {/* Right Eyebrow */}
          <path
            d="M100,18 C112,8 132,8 140,18"
            fill="none"
            stroke="#111111"
            className="dark:stroke-white transition-colors"
            strokeWidth="5.5"
            style={{
              transformOrigin: '120px 14px',
              transform: `rotate(${eyebrowTilt + 3}deg)`,
              transition: 'transform 0.1s ease-out',
            }}
          />

          {/* Left Eye Sclera (Outer oval) */}
          <g ref={leftEyeRef} transform="translate(42, 54)">
            <ellipse
              cx="0"
              cy="0"
              rx="24"
              ry={isBlinking || isWinking ? 2 : 32}
              fill="#FFFFFF"
              stroke="#111111"
              className="dark:stroke-white transition-all duration-75"
              strokeWidth="5"
            />
            {/* Left Eye Pupil */}
            {!isBlinking && !isWinking && (
              <g transform={`translate(${leftPupil.x}, ${leftPupil.y})`}>
                <circle cx="0" cy="0" r="10.5" fill="#111111" className="dark:fill-white" />
                <circle cx="-3" cy="-3.5" r="2.8" fill="#FFFFFF" className="dark:fill-[#111111]" />
              </g>
            )}
          </g>

          {/* Right Eye Sclera (Outer oval) */}
          <g ref={rightEyeRef} transform="translate(118, 54)">
            <ellipse
              cx="0"
              cy="0"
              rx="24"
              ry={isBlinking ? 2 : 32}
              fill="#FFFFFF"
              stroke="#111111"
              className="dark:stroke-white transition-all duration-75"
              strokeWidth="5"
            />
            {/* Right Eye Pupil */}
            {!isBlinking && (
              <g transform={`translate(${rightPupil.x}, ${rightPupil.y})`}>
                <circle cx="0" cy="0" r="10.5" fill="#111111" className="dark:fill-white" />
                <circle cx="-3" cy="-3.5" r="2.8" fill="#FFFFFF" className="dark:fill-[#111111]" />
              </g>
            )}
          </g>
        </g>
      </svg>
    </motion.div>
  );
}
