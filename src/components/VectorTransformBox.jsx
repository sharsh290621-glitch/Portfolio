import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { RotateCw, Sparkles, RefreshCw } from 'lucide-react';

export default function VectorTransformBox({
  children,
  onWarpStateChange,
  onCursorModeChange,
}) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 260 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeHandle, setActiveHandle] = useState(null);
  const [isWarping, setIsWarping] = useState(false);

  // Corner delta offsets [x, y]
  const [corners, setCorners] = useState({
    tl: { x: 0, y: 0 },
    tr: { x: 0, y: 0 },
    br: { x: 0, y: 0 },
    bl: { x: 0, y: 0 },
  });

  const [rotation, setRotation] = useState(0);

  // Measure base dimensions of the typography box
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setDimensions({ width: rect.width, height: rect.height });
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Compute transform parameters from corner offsets
  const w = dimensions.width || 600;
  const h = dimensions.height || 260;

  // Quad coordinates in local space
  const pTL = { x: 0 + corners.tl.x, y: 0 + corners.tl.y };
  const pTR = { x: w + corners.tr.x, y: 0 + corners.tr.y };
  const pBR = { x: w + corners.br.x, y: h + corners.br.y };
  const pBL = { x: 0 + corners.bl.x, y: h + corners.bl.y };

  // Edge midpoints
  const pTC = { x: (pTL.x + pTR.x) / 2, y: (pTL.y + pTR.y) / 2 };
  const pBC = { x: (pBL.x + pBR.x) / 2, y: (pBL.y + pBR.y) / 2 };
  const pLC = { x: (pTL.x + pBL.x) / 2, y: (pTL.y + pBL.y) / 2 };
  const pRC = { x: (pTR.x + pBR.x) / 2, y: (pTR.y + pBR.y) / 2 };

  // Center & rotation stem pin (26px above top center)
  const pCenter = {
    x: (pTL.x + pTR.x + pBR.x + pBL.x) / 4,
    y: (pTL.y + pTR.y + pBR.y + pBL.y) / 4,
  };
  const pRot = { x: pTC.x, y: pTC.y - 28 };

  // Calculated Affine + Perspective Transformation for Children Text
  const scaleX = Math.max(0.4, 1 + ((corners.tr.x - corners.tl.x) + (corners.br.x - corners.bl.x)) / (2 * w));
  const scaleY = Math.max(0.4, 1 + ((corners.bl.y - corners.tl.y) + (corners.br.y - corners.tr.y)) / (2 * h));
  
  const skewX = Math.max(-45, Math.min(45, (((corners.tl.x + corners.tr.x) - (corners.bl.x + corners.br.x)) / (2 * h)) * 42));
  const skewY = Math.max(-45, Math.min(45, (((corners.tr.y + corners.br.y) - (corners.tl.y + corners.bl.y)) / (2 * w)) * 42));
  
  const transX = (corners.tl.x + corners.tr.x + corners.br.x + corners.bl.x) / 4;
  const transY = (corners.tl.y + corners.tr.y + corners.br.y + corners.bl.y) / 4;

  const persX = Math.max(-25, Math.min(25, ((corners.bl.x - corners.tl.x) - (corners.br.x - corners.tr.x)) * 0.08));
  const persY = Math.max(-25, Math.min(25, ((corners.tr.y - corners.tl.y) - (corners.br.y - corners.bl.y)) * 0.08));

  const isDeformed =
    Math.abs(corners.tl.x) > 3 ||
    Math.abs(corners.tl.y) > 3 ||
    Math.abs(corners.tr.x) > 3 ||
    Math.abs(corners.tr.y) > 3 ||
    Math.abs(corners.br.x) > 3 ||
    Math.abs(corners.br.y) > 3 ||
    Math.abs(corners.bl.x) > 3 ||
    Math.abs(corners.bl.y) > 3 ||
    Math.abs(rotation) > 1;

  // Handle Dragging
  const dragStartRef = useRef({ startMouseX: 0, startMouseY: 0, startCorners: null, startRot: 0 });

  const startHandleDrag = (handleKey, e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveHandle(handleKey);
    setIsWarping(true);

    if (onCursorModeChange) {
      if (handleKey === 'rot') onCursorModeChange('rotate');
      else onCursorModeChange('anchor');
    }

    dragStartRef.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startCorners: { ...corners },
      startRot: rotation,
    };

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - dragStartRef.current.startMouseX;
      const dy = moveEvent.clientY - dragStartRef.current.startMouseY;
      const initCorners = dragStartRef.current.startCorners;

      if (handleKey === 'rot') {
        // Calculate angle relative to center
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const angleRad = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX);
          const deg = (angleRad * 180) / Math.PI + 90;
          setRotation(deg);
        }
      } else if (handleKey === 'tl') {
        setCorners((prev) => ({
          ...prev,
          tl: { x: initCorners.tl.x + dx, y: initCorners.tl.y + dy },
        }));
      } else if (handleKey === 'tr') {
        setCorners((prev) => ({
          ...prev,
          tr: { x: initCorners.tr.x + dx, y: initCorners.tr.y + dy },
        }));
      } else if (handleKey === 'br') {
        setCorners((prev) => ({
          ...prev,
          br: { x: initCorners.br.x + dx, y: initCorners.br.y + dy },
        }));
      } else if (handleKey === 'bl') {
        setCorners((prev) => ({
          ...prev,
          bl: { x: initCorners.bl.x + dx, y: initCorners.bl.y + dy },
        }));
      } else if (handleKey === 'tc') {
        setCorners((prev) => ({
          ...prev,
          tl: { x: initCorners.tl.x + dx * 0.5, y: initCorners.tl.y + dy },
          tr: { x: initCorners.tr.x + dx * 0.5, y: initCorners.tr.y + dy },
        }));
      } else if (handleKey === 'bc') {
        setCorners((prev) => ({
          ...prev,
          bl: { x: initCorners.bl.x + dx * 0.5, y: initCorners.bl.y + dy },
          br: { x: initCorners.br.x + dx * 0.5, y: initCorners.br.y + dy },
        }));
      } else if (handleKey === 'lc') {
        setCorners((prev) => ({
          ...prev,
          tl: { x: initCorners.tl.x + dx, y: initCorners.tl.y + dy * 0.5 },
          bl: { x: initCorners.bl.x + dx, y: initCorners.bl.y + dy * 0.5 },
        }));
      } else if (handleKey === 'rc') {
        setCorners((prev) => ({
          ...prev,
          tr: { x: initCorners.tr.x + dx, y: initCorners.tr.y + dy * 0.5 },
          br: { x: initCorners.br.x + dx, y: initCorners.br.y + dy * 0.5 },
        }));
      }

      // Notify Doodle Eyes of active target handle position
      if (onWarpStateChange) {
        onWarpStateChange({
          isWarping: true,
          activeHandle: handleKey,
          handleScreenX: moveEvent.clientX,
          handleScreenY: moveEvent.clientY,
        });
      }
    };

    const handleMouseUp = () => {
      setActiveHandle(null);
      setIsWarping(false);
      if (onCursorModeChange) onCursorModeChange('pen');
      if (onWarpStateChange) onWarpStateChange({ isWarping: false });

      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Reset to default shape
  const handleReset = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCorners({
      tl: { x: 0, y: 0 },
      tr: { x: 0, y: 0 },
      br: { x: 0, y: 0 },
      bl: { x: 0, y: 0 },
    });
    setRotation(0);
    if (onWarpStateChange) onWarpStateChange({ isWarping: false });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        setIsHovered(true);
        if (onCursorModeChange) onCursorModeChange('anchor');
      }}
      onMouseLeave={() => {
        if (!isWarping) {
          setIsHovered(false);
          if (onCursorModeChange) onCursorModeChange('pen');
        }
      }}
      onDoubleClick={handleReset}
      className="relative select-none inline-block pointer-events-auto"
      style={{ perspective: 1000 }}
    >
      {/* 1. Solid Deformed Typography Subject */}
      <motion.div
        animate={{
          scaleX: scaleX,
          scaleY: scaleY,
          skewX: `${skewX}deg`,
          skewY: `${skewY}deg`,
          x: transX,
          y: transY,
          rotate: `${rotation}deg`,
          rotateX: `${persX}deg`,
          rotateY: `${persY}deg`,
        }}
        transition={{
          type: isWarping ? 'tween' : 'spring',
          duration: isWarping ? 0 : 0.45,
          stiffness: 320,
          damping: 24,
        }}
        className="relative z-10 will-change-transform transform-gpu"
        style={{
          transformOrigin: 'center center',
          filter: isWarping ? 'drop-shadow(0 15px 30px rgba(0,85,255,0.18))' : 'none',
        }}
      >
        {children}
      </motion.div>

      {/* 2. Photoshop Vector Path Stroked Box & Handles (SVG Overlay) */}
      <svg
        className="absolute -inset-10 w-[calc(100%+80px)] h-[calc(100%+80px)] pointer-events-none z-20 overflow-visible"
        style={{
          transform: `translate(${transX}px, ${transY}px) rotate(${rotation}deg)`,
          transformOrigin: `${w / 2 + 40}px ${h / 2 + 40}px`,
          transition: isWarping ? 'none' : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <g transform="translate(40, 40)">
          {/* Vector Bounding Box Polygon */}
          <polygon
            points={`${pTL.x},${pTL.y} ${pTR.x},${pTR.y} ${pBR.x},${pBR.y} ${pBL.x},${pBL.y}`}
            fill={isHovered || isWarping ? 'rgba(0, 85, 255, 0.04)' : 'transparent'}
            stroke="#0055FF"
            strokeWidth={isHovered || isWarping ? 1.5 : 1.2}
            strokeDasharray={isHovered || isWarping ? '4 3' : '3 3'}
            className="transition-colors duration-200"
          />

          {/* Rotation Stem Line & Top Pin */}
          <line
            x1={pTC.x}
            y1={pTC.y}
            x2={pRot.x}
            y2={pRot.y}
            stroke="#0055FF"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />
        </g>
      </svg>

      {/* 3. Interactive Vector Anchor Points (Positioned with DOM handles) */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          transform: `translate(${transX}px, ${transY}px) rotate(${rotation}deg)`,
          transformOrigin: 'center center',
          transition: isWarping ? 'none' : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Top-Left Corner Anchor */}
        <div
          onMouseDown={(e) => startHandleDrag('tl', e)}
          onMouseEnter={() => onCursorModeChange && onCursorModeChange('warp')}
          onMouseLeave={() => onCursorModeChange && onCursorModeChange('anchor')}
          style={{ transform: `translate(${pTL.x}px, ${pTL.y}px) translate(-50%, -50%)` }}
          className="absolute pointer-events-auto cursor-nwse-resize w-3.5 h-3.5 bg-white dark:bg-studio-dark border-2 border-studio-blue rounded-[2px] shadow-md hover:scale-125 transition-transform"
          title="Drag to Warp Top-Left"
        />

        {/* Top-Right Corner Anchor */}
        <div
          onMouseDown={(e) => startHandleDrag('tr', e)}
          onMouseEnter={() => onCursorModeChange && onCursorModeChange('warp')}
          onMouseLeave={() => onCursorModeChange && onCursorModeChange('anchor')}
          style={{ transform: `translate(${pTR.x}px, ${pTR.y}px) translate(-50%, -50%)` }}
          className="absolute pointer-events-auto cursor-nesw-resize w-3.5 h-3.5 bg-white dark:bg-studio-dark border-2 border-studio-blue rounded-[2px] shadow-md hover:scale-125 transition-transform"
          title="Drag to Warp Top-Right"
        />

        {/* Bottom-Right Corner Anchor */}
        <div
          onMouseDown={(e) => startHandleDrag('br', e)}
          onMouseEnter={() => onCursorModeChange && onCursorModeChange('warp')}
          onMouseLeave={() => onCursorModeChange && onCursorModeChange('anchor')}
          style={{ transform: `translate(${pBR.x}px, ${pBR.y}px) translate(-50%, -50%)` }}
          className="absolute pointer-events-auto cursor-nwse-resize w-3.5 h-3.5 bg-white dark:bg-studio-dark border-2 border-studio-blue rounded-[2px] shadow-md hover:scale-125 transition-transform"
          title="Drag to Warp Bottom-Right"
        />

        {/* Bottom-Left Corner Anchor */}
        <div
          onMouseDown={(e) => startHandleDrag('bl', e)}
          onMouseEnter={() => onCursorModeChange && onCursorModeChange('warp')}
          onMouseLeave={() => onCursorModeChange && onCursorModeChange('anchor')}
          style={{ transform: `translate(${pBL.x}px, ${pBL.y}px) translate(-50%, -50%)` }}
          className="absolute pointer-events-auto cursor-nesw-resize w-3.5 h-3.5 bg-white dark:bg-studio-dark border-2 border-studio-blue rounded-[2px] shadow-md hover:scale-125 transition-transform"
          title="Drag to Warp Bottom-Left"
        />

        {/* Top-Center Edge Midpoint */}
        <div
          onMouseDown={(e) => startHandleDrag('tc', e)}
          style={{ transform: `translate(${pTC.x}px, ${pTC.y}px) translate(-50%, -50%)` }}
          className="absolute pointer-events-auto cursor-ns-resize w-2.5 h-2.5 bg-studio-blue border border-white rounded-[1px] shadow-sm hover:scale-125 transition-transform"
          title="Drag to Stretch Top"
        />

        {/* Bottom-Center Edge Midpoint */}
        <div
          onMouseDown={(e) => startHandleDrag('bc', e)}
          style={{ transform: `translate(${pBC.x}px, ${pBC.y}px) translate(-50%, -50%)` }}
          className="absolute pointer-events-auto cursor-ns-resize w-2.5 h-2.5 bg-studio-blue border border-white rounded-[1px] shadow-sm hover:scale-125 transition-transform"
          title="Drag to Stretch Bottom"
        />

        {/* Left-Center Edge Midpoint */}
        <div
          onMouseDown={(e) => startHandleDrag('lc', e)}
          style={{ transform: `translate(${pLC.x}px, ${pLC.y}px) translate(-50%, -50%)` }}
          className="absolute pointer-events-auto cursor-ew-resize w-2.5 h-2.5 bg-studio-blue border border-white rounded-[1px] shadow-sm hover:scale-125 transition-transform"
          title="Drag to Stretch Left"
        />

        {/* Right-Center Edge Midpoint */}
        <div
          onMouseDown={(e) => startHandleDrag('rc', e)}
          style={{ transform: `translate(${pRC.x}px, ${pRC.y}px) translate(-50%, -50%)` }}
          className="absolute pointer-events-auto cursor-ew-resize w-2.5 h-2.5 bg-studio-blue border border-white rounded-[1px] shadow-sm hover:scale-125 transition-transform"
          title="Drag to Stretch Right"
        />

        {/* Rotation Pin */}
        <div
          onMouseDown={(e) => startHandleDrag('rot', e)}
          onMouseEnter={() => onCursorModeChange && onCursorModeChange('rotate')}
          onMouseLeave={() => onCursorModeChange && onCursorModeChange('anchor')}
          style={{ transform: `translate(${pRot.x}px, ${pRot.y}px) translate(-50%, -50%)` }}
          className="absolute pointer-events-auto cursor-grab w-3.5 h-3.5 bg-studio-blue border-2 border-white rounded-full shadow-md hover:scale-125 transition-transform flex items-center justify-center text-white"
          title="Drag to Rotate Name"
        >
          <div className="w-1 h-1 bg-white rounded-full" />
        </div>
      </div>

      {/* 4. Real-Time HUD Transform Badge (Photoshop Info Panel) */}
      <AnimatePresence>
        {(isWarping || (isHovered && isDeformed)) && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-11 left-1/2 -translate-x-1/2 z-40 pointer-events-none px-3 py-1 rounded-full bg-studio-dark/95 dark:bg-black/90 text-white border border-studio-blue/40 shadow-xl backdrop-blur-md flex items-center gap-2 font-mono text-[9px] tracking-wider whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-studio-blue animate-pulse" />
            <span className="text-studio-blue font-bold">WARP</span>
            <span>W: {Math.round(scaleX * 100)}%</span>
            <span>H: {Math.round(scaleY * 100)}%</span>
            <span>∠ {Math.round(rotation)}°</span>
            <span>Skew: {Math.round(skewX)}°</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Floating Reset Button Pill (When Mesh is Deformed) */}
      <AnimatePresence>
        {isDeformed && !isWarping && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: -6, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.85 }}
            onClick={handleReset}
            className="absolute -bottom-9 left-1/2 -translate-x-1/2 z-40 pointer-events-auto px-3.5 py-1 rounded-full bg-studio-card dark:bg-studio-card-dark border border-studio-blue/70 text-studio-blue hover:bg-studio-blue hover:text-white transition-all shadow-md flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-wider group"
            title="Click to reset typography shape (or double-click box)"
          >
            <RefreshCw size={10} className="group-hover:rotate-180 transition-transform duration-300" />
            <span>RESET SHAPE</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
