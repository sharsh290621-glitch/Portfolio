import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function MockVideo({
  src,
  poster,
  title = 'Motion Study',
  category = 'Motion Graphics',
  autoPlay = true,
  className = '',
  aspectRatio = '16/10'
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Animated Kinetic Canvas simulation for high-FPS motion graphics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let angle = 0;
    
    // Seed particles
    const particles = Array.from({ length: 24 }, () => ({
      x: Math.random() * 300,
      y: Math.random() * 180,
      radius: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 1.2,
      speedY: (Math.random() - 0.5) * 1.2,
      color: Math.random() > 0.4 ? '#0055FF' : '#FF2A54'
    }));

    const isAfterEffects = title.toLowerCase().includes('after') || category.toLowerCase().includes('graphics');

    const render = () => {
      if (!isPlaying) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.fillStyle = isAfterEffects ? '#120824' : '#07070D';
      ctx.fillRect(0, 0, w, h);

      angle += 0.03;

      if (isAfterEffects) {
        // After Effects Bezier Velocity Curve Animation
        ctx.strokeStyle = '#281545';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 20; x < w - 20; x += 30) {
          ctx.moveTo(x, 20);
          ctx.lineTo(x, h - 20);
        }
        for (let y = 20; y < h - 20; y += 25) {
          ctx.moveTo(20, y);
          ctx.lineTo(w - 20, y);
        }
        ctx.stroke();

        // Dynamic Bezier Wave
        const waveY1 = cy + Math.sin(angle) * 45;
        const waveY2 = cy - Math.cos(angle * 1.2) * 50;

        ctx.strokeStyle = '#9933FF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(25, cy + 30);
        ctx.bezierCurveTo(cx - 40, waveY1, cx + 40, waveY2, w - 25, cy - 30);
        ctx.stroke();

        // Control points
        ctx.fillStyle = '#FFCC00';
        ctx.beginPath();
        ctx.arc(cx - 40, waveY1, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FF3366';
        ctx.beginPath();
        ctx.arc(cx + 40, waveY2, 4, 0, Math.PI * 2);
        ctx.fill();

        // Keyframe pulses
        const keyframeX = cx + Math.sin(angle * 1.5) * 80;
        ctx.fillStyle = '#00D4FF';
        ctx.beginPath();
        ctx.arc(keyframeX, cy, 5, 0, Math.PI * 2);
        ctx.fill();

      } else {
        // 3D Gyroscope & Topology Rings (Motion Study)
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle * 0.6);

        // Outer Ring
        ctx.beginPath();
        ctx.ellipse(0, 0, 68, 28, angle, 0, Math.PI * 2);
        ctx.strokeStyle = '#0055FF';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Counter Ring
        ctx.beginPath();
        ctx.ellipse(0, 0, 58, 22, -angle * 1.4, 0, Math.PI * 2);
        ctx.strokeStyle = '#00D4FF';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Inner Dashed Core
        ctx.beginPath();
        ctx.ellipse(0, 0, 42, 42, angle * 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = '#FF2A54';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Glow Center
        const radGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 20);
        radGrad.addColorStop(0, '#FFFFFF');
        radGrad.addColorStop(0.5, '#0055FF');
        radGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // Particle dots
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 10) p.x = w - 10;
        if (p.x > w - 10) p.x = 10;
        if (p.y < 10) p.y = h - 10;
        if (p.y > h - 10) p.y = 10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Progress calculation
      setProgress((prev) => (prev >= 100 ? 0 : prev + 0.4));

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, title, category]);

  const togglePlay = (e) => {
    e?.stopPropagation();
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play().catch(() => {});
    }
  };

  const toggleMute = (e) => {
    e?.stopPropagation();
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return (
    <div
      className={`relative w-full h-full bg-studio-dark overflow-hidden group select-none ${className}`}
      style={{ aspectRatio: aspectRatio || '16/10' }}
    >
      {/* Real HTML5 Video element if valid video provided and loaded */}
      {src ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover hidden"
        />
      ) : null}

      {/* Procedural Canvas Motion Graphic */}
      <canvas
        ref={canvasRef}
        width={300}
        height={188}
        className="w-full h-full object-cover block"
      />

      {/* Motion Watermark Pill Top-Left */}
      <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[7px] font-mono text-white/90">
        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
        <span>60 FPS</span>
      </div>

      {/* Bottom Floating Control Bar on Hover */}
      <div className="absolute inset-x-0 bottom-0 z-20 p-1.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {/* Progress Bar */}
        <div className="w-full h-0.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
          <div
            className="h-full bg-studio-blue transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Micro Controls */}
        <div className="flex items-center justify-between text-white text-[8px] font-mono pt-0.5">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={togglePlay}
              className="p-0.5 rounded hover:bg-white/20 text-white transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={8} /> : <Play size={8} />}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="p-0.5 rounded hover:bg-white/20 text-white transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={8} /> : <Volume2 size={8} />}
            </button>
            <span className="text-white/60 text-[7px]">00:0{Math.floor(progress / 20)}</span>
          </div>

          <span className="text-[7px] tracking-wider uppercase text-white/70 truncate max-w-[80px]">
            {category}
          </span>
        </div>
      </div>
    </div>
  );
}
