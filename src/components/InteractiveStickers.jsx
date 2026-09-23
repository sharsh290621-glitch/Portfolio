import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PenTool, Pipette, Wand2, Check, Sparkles } from 'lucide-react';

export default function InteractiveStickers({ containerRef, isMobile = false }) {
  // State for interactive stickers
  const [copiedHex, setCopiedHex] = useState(false);
  const [kaomojiState, setKaomojiState] = useState(0);
  const [activeTool, setActiveTool] = useState('pen');
  const [phoneMessage, setPhoneMessage] = useState('1 NEW MSG');
  const [beachballSpin, setBeachballSpin] = useState(false);

  const kaomojiList = ['(¬_¬)', '(¬‿¬)', '(⌐■_■)', '(⊙_⊙)', '(ง •̀_•́)ง'];

  const handleCopyHex = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText('#0055FF').catch(() => {});
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 2000);
  };

  const handleKaomojiClick = (e) => {
    e.stopPropagation();
    setKaomojiState((prev) => (prev + 1) % kaomojiList.length);
  };

  const handlePhoneClick = (e) => {
    e.stopPropagation();
    const msgs = ['HELLO HARSH', 'LET’S CREATE', 'DESIGN TIME', '100% VIBES', 'MISSED CALL'];
    const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
    setPhoneMessage(randomMsg);
  };

  return (
    <>
      {/* 1. Kaomoji Sticker 1: (¬_¬) */}
      <motion.div
        drag={!isMobile}
        dragConstraints={containerRef}
        dragElastic={0.08}
        dragMomentum={true}
        whileHover={{ scale: 1.15, rotate: -8 }}
        whileDrag={{ scale: 1.25, cursor: 'grabbing', zIndex: 9999 }}
        onClick={handleKaomojiClick}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        style={{
          position: 'absolute',
          left: '21%',
          top: '53%',
          zIndex: 22,
          touchAction: isMobile ? 'auto' : 'none',
        }}
        className="cursor-pointer select-none font-mono text-xs sm:text-sm font-bold px-2.5 py-1 rounded-md bg-white/90 dark:bg-studio-card-dark/90 border border-studio-border/80 dark:border-studio-border-dark text-studio-dark dark:text-white shadow-subtle hover:shadow-md transition-shadow group"
        title="Click to change expression!"
      >
        <span>{kaomojiList[kaomojiState]}</span>
      </motion.div>

      {/* 2. Kaomoji Sticker 2: ^ ω ^ */}
      <motion.div
        drag={!isMobile}
        dragConstraints={containerRef}
        dragElastic={0.08}
        dragMomentum={true}
        whileHover={{ scale: 1.2, rotate: 6 }}
        whileDrag={{ scale: 1.25, cursor: 'grabbing', zIndex: 9999 }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        style={{
          position: 'absolute',
          right: '24%',
          top: '51%',
          zIndex: 22,
          touchAction: isMobile ? 'auto' : 'none',
        }}
        className="cursor-pointer select-none font-sans text-xs sm:text-sm font-bold px-2 py-0.5 rounded-full bg-studio-yellow border border-studio-yellow-border text-studio-dark shadow-subtle hover:shadow-md transition-all"
      >
        <span>^ ω ^</span>
      </motion.div>

      {/* 3. Kaomoji Sticker 3: { ^_^ } */}
      <motion.div
        drag={!isMobile}
        dragConstraints={containerRef}
        dragElastic={0.08}
        dragMomentum={true}
        whileHover={{ scale: 1.15, rotate: -4 }}
        whileDrag={{ scale: 1.25, cursor: 'grabbing', zIndex: 9999 }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        style={{
          position: 'absolute',
          left: '44%',
          bottom: '9%',
          zIndex: 22,
          touchAction: isMobile ? 'auto' : 'none',
        }}
        className="cursor-pointer select-none font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-white/80 dark:bg-studio-surface-dark border border-studio-border dark:border-studio-border-dark text-studio-dark dark:text-white shadow-subtle"
      >
        <span>&#123; ^_^ &#125;</span>
      </motion.div>

      {/* 4. Spinning Rainbow Beachball of Death */}
      <motion.div
        drag={!isMobile}
        dragConstraints={containerRef}
        dragElastic={0.08}
        dragMomentum={true}
        whileHover={{ scale: 1.25 }}
        whileDrag={{ scale: 1.35, cursor: 'grabbing', zIndex: 9999 }}
        onClick={() => setBeachballSpin(!beachballSpin)}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.65, duration: 0.5 }}
        style={{
          position: 'absolute',
          left: '31%',
          top: '22%',
          zIndex: 24,
          touchAction: isMobile ? 'auto' : 'none',
        }}
        className="cursor-pointer select-none group/pinwheel"
        title="Thinking... (Click to spin)"
      >
        <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden shadow-md border border-black/20 animate-spin [animation-duration:3s] group-hover/pinwheel:[animation-duration:0.8s]">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            {/* 6 colored pinwheel segments */}
            <path d="M50,50 L50,0 A50,50 0 0,1 93.3,25 Z" fill="#FF3B30" />
            <path d="M50,50 L93.3,25 A50,50 0 0,1 93.3,75 Z" fill="#FF9500" />
            <path d="M50,50 L93.3,75 A50,50 0 0,1 50,100 Z" fill="#FFCC00" />
            <path d="M50,50 L50,100 A50,50 0 0,1 6.7,75 Z" fill="#34C759" />
            <path d="M50,50 L6.7,75 A50,50 0 0,1 6.7,25 Z" fill="#007AFF" />
            <path d="M50,50 L6.7,25 A50,50 0 0,1 50,0 Z" fill="#AF52DE" />
            <circle cx="50" cy="50" r="12" fill="#FFFFFF" opacity="0.9" />
          </svg>
        </div>
      </motion.div>

      {/* 5. Retro Y2K Translucent Mobile Phone Sticker */}
      <motion.div
        drag={!isMobile}
        dragConstraints={containerRef}
        dragElastic={0.08}
        dragMomentum={true}
        whileHover={{ scale: 1.1, rotate: 14 }}
        whileDrag={{ scale: 1.2, cursor: 'grabbing', zIndex: 9999 }}
        onClick={handlePhoneClick}
        initial={{ opacity: 0, scale: 0.5, rotate: 12 }}
        animate={{ opacity: 1, scale: 1, rotate: 12 }}
        transition={{ delay: 0.75, duration: 0.5 }}
        style={{
          position: 'absolute',
          right: '9%',
          top: '48%',
          zIndex: 23,
          touchAction: isMobile ? 'auto' : 'none',
        }}
        className="cursor-pointer select-none w-14 sm:w-16 max-w-[64px] h-auto drop-shadow-xl group/phone"
        title="Retro Y2K Communicator • Click for message!"
      >
        <svg viewBox="0 0 80 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="phone-glass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#E0F2FE" stop-opacity="0.9" />
              <stop offset="50%" stop-color="#38BDF8" stop-opacity="0.75" />
              <stop offset="100%" stop-color="#0284C7" stop-opacity="0.9" />
            </linearGradient>
            <linearGradient id="screen-lcd" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#BAE6FD" />
              <stop offset="100%" stop-color="#7DD3FC" />
            </linearGradient>
          </defs>

          {/* Translucent Cyan Body */}
          <rect x="5" y="5" width="70" height="150" rx="20" fill="url(#phone-glass)" stroke="#0284C7" strokeWidth="2.5" />
          <rect x="8" y="8" width="64" height="144" rx="17" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />

          {/* Speaker grill */}
          <line x1="30" y1="18" x2="50" y2="18" stroke="#0369A1" strokeWidth="2.5" strokeLinecap="round" />

          {/* LCD Screen */}
          <rect x="15" y="28" width="50" height="42" rx="6" fill="url(#screen-lcd)" stroke="#0369A1" strokeWidth="1.5" />
          <text x="40" y="44" fontFamily="'JetBrains Mono', monospace" fontSize="6.5" fontWeight="bold" fill="#0C4A6E" textAnchor="middle">
            HARSH OS
          </text>
          <text x="40" y="58" fontFamily="'JetBrains Mono', monospace" fontSize="5.5" fontWeight="bold" fill="#0369A1" textAnchor="middle">
            {phoneMessage}
          </text>

          {/* Keypad Buttons */}
          <g fill="#FFFFFF" stroke="#0284C7" strokeWidth="0.8">
            <circle cx="40" cy="85" r="10" fill="#E0F2FE" />
            <circle cx="40" cy="85" r="4" fill="#0284C7" />

            <ellipse cx="25" cy="106" rx="6" ry="4" />
            <ellipse cx="40" cy="106" rx="6" ry="4" />
            <ellipse cx="55" cy="106" rx="6" ry="4" />

            <ellipse cx="25" cy="120" rx="6" ry="4" />
            <ellipse cx="40" cy="120" rx="6" ry="4" />
            <ellipse cx="55" cy="120" rx="6" ry="4" />

            <ellipse cx="25" cy="134" rx="6" ry="4" />
            <ellipse cx="40" cy="134" rx="6" ry="4" />
            <ellipse cx="55" cy="134" rx="6" ry="4" />
          </g>
        </svg>
      </motion.div>

      {/* 6. Photoshop Floating Mini Toolbar Widget */}
      <motion.div
        drag={!isMobile}
        dragConstraints={containerRef}
        dragElastic={0.08}
        dragMomentum={true}
        whileHover={{ scale: 1.05 }}
        whileDrag={{ scale: 1.15, cursor: 'grabbing', zIndex: 9999 }}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{
          position: 'absolute',
          left: '5%',
          top: '46%',
          zIndex: 21,
          touchAction: isMobile ? 'auto' : 'none',
        }}
        className="cursor-grab select-none p-1.5 rounded-xl bg-white/90 dark:bg-studio-surface-dark/95 border border-studio-border dark:border-studio-border-dark shadow-xl backdrop-blur-md flex flex-col gap-1 text-studio-dark dark:text-white"
        title="Photoshop Tool Palette (Click tool)"
      >
        <div className="w-full text-center pb-1 border-b border-studio-border/60 dark:border-studio-border-dark font-mono text-[8px] font-bold text-studio-muted">
          PS
        </div>
        <button
          type="button"
          onClick={() => setActiveTool('pen')}
          className={`p-1.5 rounded-lg transition-colors ${
            activeTool === 'pen' ? 'bg-studio-blue text-white shadow-sm' : 'hover:bg-studio-bg dark:hover:bg-studio-card-dark'
          }`}
          title="Pen Tool (P)"
        >
          <PenTool size={13} />
        </button>
        <button
          type="button"
          onClick={() => setActiveTool('wand')}
          className={`p-1.5 rounded-lg transition-colors ${
            activeTool === 'wand' ? 'bg-studio-blue text-white shadow-sm' : 'hover:bg-studio-bg dark:hover:bg-studio-card-dark'
          }`}
          title="Magic Wand (W)"
        >
          <Wand2 size={13} />
        </button>
        <button
          type="button"
          onClick={() => setActiveTool('eyedropper')}
          className={`p-1.5 rounded-lg transition-colors ${
            activeTool === 'eyedropper' ? 'bg-studio-blue text-white shadow-sm' : 'hover:bg-studio-bg dark:hover:bg-studio-card-dark'
          }`}
          title="Eyedropper / Pipette (I)"
        >
          <Pipette size={13} />
        </button>
      </motion.div>

      {/* 7. Interactive Pantone / Color Chip Swatch: #0055FF */}
      <motion.div
        drag={!isMobile}
        dragConstraints={containerRef}
        dragElastic={0.08}
        dragMomentum={true}
        whileHover={{ scale: 1.08, rotate: -3 }}
        whileDrag={{ scale: 1.18, cursor: 'grabbing', zIndex: 9999 }}
        onClick={handleCopyHex}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.85, duration: 0.5 }}
        style={{
          position: 'absolute',
          right: '7%',
          top: '78%',
          zIndex: 21,
          touchAction: isMobile ? 'auto' : 'none',
        }}
        className="cursor-pointer select-none w-20 sm:w-24 p-1.5 rounded-xl bg-white dark:bg-studio-surface-dark border border-studio-border dark:border-studio-border-dark shadow-xl backdrop-blur-md"
        title="Click to copy Electric Blue HEX!"
      >
        <div className="w-full h-11 rounded-lg bg-studio-blue shadow-inner flex items-center justify-center text-white">
          {copiedHex ? <Check size={13} className="animate-bounce" /> : <Sparkles size={11} className="opacity-75" />}
        </div>
        <div className="pt-1.5 px-0.5 font-mono text-[8px] leading-tight">
          <div className="font-bold text-studio-dark dark:text-white flex items-center justify-between">
            <span>#0055FF</span>
            {copiedHex && <span className="text-emerald-500 font-bold">COPIED</span>}
          </div>
          <div className="text-[7px] text-studio-muted dark:text-studio-muted-dark">ELECTRIC BLUE</div>
        </div>
      </motion.div>
    </>
  );
}
