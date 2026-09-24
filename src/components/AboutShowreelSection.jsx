import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  X,
  Sparkles
} from 'lucide-react';

export default function AboutShowreelSection({ onOpenProject }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCinemaActive, setIsCinemaActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(24); // simulated 24s showreel
  const [currentTime, setCurrentTime] = useState(0);

  const videoContainerRef = useRef(null);
  const videoFrameRef = useRef(null);
  const videoElementRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  const synthGainRef = useRef(null);

  // Motion values for the floating "play video" glass pill button
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.1 };
  const pillX = useSpring(mouseX, springConfig);
  const pillY = useSpring(mouseY, springConfig);

  // Web Audio procedural ambient sound synthesizer for showreel
  const startAudio = () => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        audioContextRef.current = new AudioCtx();

        // Master Gain
        const masterGain = audioContextRef.current.createGain();
        masterGain.gain.setValueAtTime(0.14, audioContextRef.current.currentTime);
        masterGain.connect(audioContextRef.current.destination);
        synthGainRef.current = masterGain;

        // Ambient Bass Drone (F# / 92.5Hz)
        const osc1 = audioContextRef.current.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(92.5, audioContextRef.current.currentTime);

        const oscGain = audioContextRef.current.createGain();
        oscGain.gain.setValueAtTime(0.08, audioContextRef.current.currentTime);
        osc1.connect(oscGain);
        oscGain.connect(masterGain);
        osc1.start();

        // Shimmer filter
        const filter = audioContextRef.current.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, audioContextRef.current.currentTime);
        oscGain.connect(filter);
        filter.connect(masterGain);
      }

      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      if (synthGainRef.current) {
        synthGainRef.current.gain.setTargetAtTime(
          isMuted ? 0 : 0.15,
          audioContextRef.current.currentTime,
          0.15
        );
      }
    } catch (err) {
      // Audio policy fallback
    }
  };

  const stopAudio = () => {
    if (synthGainRef.current && audioContextRef.current) {
      synthGainRef.current.gain.setTargetAtTime(
        0,
        audioContextRef.current.currentTime,
        0.2
      );
    }
  };

  // Center the pill by default
  useEffect(() => {
    if (!isHovered && videoFrameRef.current) {
      const rect = videoFrameRef.current.getBoundingClientRect();
      mouseX.set(rect.width / 2);
      mouseY.set(rect.height / 2);
    }
  }, [isHovered, mouseX, mouseY]);

  // Handle mouse move inside video frame for cursor follower
  const handleMouseMove = (e) => {
    if (videoFrameRef.current) {
      const rect = videoFrameRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  };

  // Click handler: Starts playback with audio, activates cinema blur, and removes play button
  const handleFrameClick = (e) => {
    e.stopPropagation();

    if (!hasStarted) {
      // First click: activate cinema blur, start from beginning with audio, hide play button
      setHasStarted(true);
      setIsCinemaActive(true);
      setCurrentTime(0);
      setProgress(0);
      setIsPlaying(true);
      setIsMuted(false);
      startAudio();

      if (videoElementRef.current) {
        videoElementRef.current.currentTime = 0;
        videoElementRef.current.muted = false;
        videoElementRef.current.play().catch(() => {});
      }
    } else {
      // Subsequent click: toggle play/pause
      const nextPlaying = !isPlaying;
      setIsPlaying(nextPlaying);
      if (nextPlaying) {
        if (!isMuted) startAudio();
        if (videoElementRef.current) videoElementRef.current.play().catch(() => {});
      } else {
        stopAudio();
        if (videoElementRef.current) videoElementRef.current.pause();
      }
    }
  };

  // Close cinema mode on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCinemaActive) {
        setIsCinemaActive(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCinemaActive]);

  // Track fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Procedural 60FPS Cinematic Showreel Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let angle = 0;

    const particles = Array.from({ length: 48 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 450,
      radius: Math.random() * 2.5 + 0.8,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: (Math.random() - 0.5) * 1.5,
      color: Math.random() > 0.5 ? '#0055FF' : '#38BDF8',
      alpha: Math.random() * 0.7 + 0.3,
    }));

    const render = () => {
      if (isPlaying) {
        angle += 0.02;
        setCurrentTime((prev) => {
          const next = prev + 0.016;
          return next >= duration ? 0 : next;
        });
        setProgress((prev) => {
          const next = prev + 0.07;
          return next >= 100 ? 0 : next;
        });
      } else {
        // Idle gentle rotation when paused
        angle += 0.003;
      }

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Deep dark cinematic background
      ctx.fillStyle = '#080811';
      ctx.fillRect(0, 0, w, h);

      // Radial center glow
      const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, w * 0.45);
      glow.addColorStop(0, 'rgba(0, 85, 255, 0.25)');
      glow.addColorStop(0.5, 'rgba(56, 189, 248, 0.08)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Kinetic Perspective Grid in 3D
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 50) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y <= h; y += 40) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // Kinetic Orbital Rings
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle * 0.4);

      // Ring 1 (Electric Blue)
      ctx.beginPath();
      ctx.ellipse(0, 0, 160, 65, angle * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = '#0055FF';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Ring 2 (Cyan Accent)
      ctx.beginPath();
      ctx.ellipse(0, 0, 130, 48, -angle * 1.2, 0, Math.PI * 2);
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Ring 3 (Magenta / Pink Accents)
      ctx.beginPath();
      ctx.ellipse(0, 0, 95, 95, angle * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = '#FF2A54';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center Core Orb
      const orbGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 36);
      orbGrad.addColorStop(0, '#FFFFFF');
      orbGrad.addColorStop(0.3, '#38BDF8');
      orbGrad.addColorStop(0.8, '#0055FF');
      orbGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 36, 0, Math.PI * 2);
      ctx.fill();

      // Bold Typography in Video Center
      ctx.restore();
      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = "900 32px 'Unbounded', sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 85, 255, 0.8)';
      ctx.shadowBlur = 18;
      ctx.fillText('HARSH SHAH', cx, cy - 8);

      ctx.fillStyle = '#94A3B8';
      ctx.font = "700 11px 'JetBrains Mono', monospace";
      ctx.letterSpacing = '4px';
      ctx.fillText('DIRECTOR • DESIGNER • MOTION', cx, cy + 24);
      ctx.restore();

      // Floating Particles
      particles.forEach((p) => {
        if (isPlaying) {
          p.x += p.speedX;
          p.y += p.speedY;
        } else {
          p.x += p.speedX * 0.2;
          p.y += p.speedY * 0.2;
        }
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, duration]);

  // Video Controls
  const togglePlay = (e) => {
    e?.stopPropagation();
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      if (!isMuted) startAudio();
      if (videoElementRef.current) videoElementRef.current.play().catch(() => {});
    } else {
      stopAudio();
      if (videoElementRef.current) videoElementRef.current.pause();
    }
  };

  const toggleMute = (e) => {
    e?.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      stopAudio();
    } else {
      startAudio();
    }
    if (videoElementRef.current) {
      videoElementRef.current.muted = nextMuted;
    }
  };

  const toggleFullscreen = (e) => {
    e?.stopPropagation();
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    setProgress(ratio * 100);
    setCurrentTime(ratio * duration);
    if (videoElementRef.current && videoElementRef.current.duration) {
      videoElementRef.current.currentTime = ratio * videoElementRef.current.duration;
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `0${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <>
      {/* Background Cinematic Blur Backdrop Overlay when Playing / Active */}
      <AnimatePresence>
        {isCinemaActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsCinemaActive(false);
            }}
            className="fixed inset-0 z-40 bg-black/75 backdrop-blur-xl cursor-pointer"
          >
            {/* Top Exit Cinema Button */}
            <div className="absolute top-5 right-6 sm:top-7 sm:right-8 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs backdrop-blur-md transition-all shadow-lg select-none">
              <X size={14} />
              <span>EXIT FOCUS</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section
        id="about-showreel"
        className={`relative w-full pt-0 pb-16 sm:pb-24 -mt-24 sm:-mt-32 md:-mt-40 flex flex-col items-center justify-center select-none transition-all duration-500 ${
          isCinemaActive ? 'z-50' : 'z-20'
        }`}
      >
        {/* Featured Showreel Video Frame (60-70% Viewport Width, peeking into hero fold) */}
        <div className="w-full max-w-4xl lg:max-w-5xl px-4 sm:px-6">
          <motion.div
            ref={videoContainerRef}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`group relative rounded-2xl overflow-hidden bg-studio-dark border border-studio-border dark:border-studio-border-dark shadow-2xl transition-all duration-500 ${
              isCinemaActive
                ? 'ring-2 ring-studio-blue/80 shadow-[0_0_90px_rgba(0,85,255,0.35)]'
                : isHovered
                ? 'border-studio-blue/80 shadow-[0_25px_70px_rgba(0,85,255,0.22)]'
                : 'hover:border-studio-blue/50'
            } ${isFullscreen ? 'w-screen h-screen rounded-none border-none' : ''}`}
          >
            {/* macOS Studio Titlebar */}
            <div className="relative z-30 px-4 py-2.5 bg-studio-dark/95 border-b border-white/10 flex items-center justify-between backdrop-blur-md">
              {/* Traffic Lights */}
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/20" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/20" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/20" />
                <span className="ml-2 hidden sm:inline-block font-mono text-[10px] text-white/60 tracking-wider">
                  HARSH SHAH // SHOWREEL • ABOUT ME • 2026
                </span>
              </div>

              {/* Right Status Badges */}
              <div className="flex items-center gap-3">
                {/* Soundwave Indicator */}
                {!isMuted && isPlaying && (
                  <div className="flex items-center gap-0.5 h-3 px-1.5 py-0.5 rounded bg-studio-blue/30 border border-studio-blue/40">
                    <span className="w-0.5 h-full bg-studio-blue animate-pulse" />
                    <span className="w-0.5 h-2 bg-sky-300 animate-pulse [animation-delay:0.15s]" />
                    <span className="w-0.5 h-3 bg-studio-blue animate-pulse [animation-delay:0.3s]" />
                    <span className="w-0.5 h-1.5 bg-sky-300 animate-pulse [animation-delay:0.45s]" />
                  </div>
                )}

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 text-[9px] font-mono text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>4K • 60 FPS</span>
                </div>
              </div>
            </div>

            {/* Video Container (16:9 Aspect Ratio) */}
            <div
              ref={videoFrameRef}
              onClick={handleFrameClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onMouseMove={handleMouseMove}
              className={`relative w-full overflow-hidden ${
                !hasStarted ? 'cursor-none' : 'cursor-pointer'
              } ${isFullscreen ? 'h-[calc(100vh-42px)]' : 'aspect-video'}`}
            >
              {/* Real HTML5 Video if available */}
              <video
                ref={videoElementRef}
                src="/videos/about-me.mp4"
                poster="/mock/images/motion-study-poster.svg"
                loop
                playsInline
                muted={isMuted}
                className="absolute inset-0 w-full h-full object-cover hidden"
              />

              {/* Cinematic Procedural 60FPS Canvas */}
              <canvas
                ref={canvasRef}
                width={800}
                height={450}
                className="w-full h-full object-cover block"
              />

              {/* Persistent Glass Pill "▶ play video" Cursor Follower (Disappears once user clicks / starts video) */}
              <AnimatePresence>
                {!hasStarted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.25 } }}
                    style={{
                      x: pillX,
                      y: pillY,
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      pointerEvents: 'none',
                      zIndex: 40,
                    }}
                    className="will-change-transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <motion.div
                      whileTap={{ scale: 0.92 }}
                      className="relative flex items-center gap-2.5 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-b from-white/35 via-black/55 to-black/85 backdrop-blur-xl border border-white/60 shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.7)] group-hover:border-white transition-colors"
                    >
                      {/* Curved Gloss Reflection Highlight */}
                      <div className="absolute inset-x-2 top-0.5 h-1/2 rounded-t-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none opacity-80" />

                      {/* White Play Icon Triangle */}
                      <Play size={13} className="fill-white text-white filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />

                      {/* Text "play video" */}
                      <span className="font-sans text-xs sm:text-sm font-semibold tracking-wide text-white filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] whitespace-nowrap">
                        play video
                      </span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Controls Overlay (Always accessible once started or on hover) */}
              <div
                className={`absolute inset-x-0 bottom-0 z-30 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2 transition-opacity duration-300 ${
                  hasStarted ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
                }`}
              >
                {/* Interactive Scrubber Timeline */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSeek(e);
                  }}
                  className="w-full h-1.5 hover:h-2.5 bg-white/20 rounded-full overflow-hidden cursor-pointer transition-all relative group/scrubber"
                >
                  <div
                    className="h-full bg-studio-blue rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/scrubber:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Action Buttons & Timecode */}
                <div className="flex items-center justify-between text-white font-mono text-xs pt-1">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1.5"
                      title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                    >
                      {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      <span className="text-[10px] hidden sm:inline">
                        {isMuted ? 'MUTED' : 'AUDIO ON'}
                      </span>
                    </button>

                    <span className="text-white/70 text-[11px]">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    >
                      {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
