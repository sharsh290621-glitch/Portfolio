import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc, X } from 'lucide-react';
import { brunoMarsPlaylist } from '../data/projects';

export default function StudioMusicPlayer({ className = '' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [realAudioActive, setRealAudioActive] = useState(false);

  // Quirky Bruno Mars Vibe Popup
  const [showQuirkyPopup, setShowQuirkyPopup] = useState(true);

  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const chordIntervalRef = useRef(null);
  const masterGainRef = useRef(null);

  const currentTrack = brunoMarsPlaylist[currentTrackIndex];

  // Web Audio Fallback Synthesizer
  const startSynthFallback = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : 0.18, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      const chordProgression = [
        [currentTrack.rootFreqs[0], currentTrack.rootFreqs[1], currentTrack.rootFreqs[2], currentTrack.rootFreqs[3]],
        [currentTrack.rootFreqs[0] * 1.122, currentTrack.rootFreqs[1] * 1.122, currentTrack.rootFreqs[2] * 1.122, currentTrack.rootFreqs[3] * 1.122],
        [currentTrack.rootFreqs[0] * 1.26, currentTrack.rootFreqs[1] * 1.26, currentTrack.rootFreqs[2] * 1.26, currentTrack.rootFreqs[3] * 1.26],
        [currentTrack.rootFreqs[0] * 1.414, currentTrack.rootFreqs[1] * 1.33, currentTrack.rootFreqs[2] * 1.414, currentTrack.rootFreqs[3] * 1.33],
      ];

      let step = 0;

      const playSoulStab = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const now = ctx.currentTime;
        const freqs = chordProgression[step % chordProgression.length];
        step++;

        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = idx === 0 ? 'triangle' : idx === 1 ? 'sine' : 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);

          osc.frequency.exponentialRampToValueAtTime(freq * 1.003, now + 0.8);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.997, now + 1.8);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1600, now);
          filter.frequency.exponentialRampToValueAtTime(450, now + 2.8);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.08 / (idx + 1), now + 0.12);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(masterGain);

          osc.start(now + idx * 0.02);
          osc.stop(now + 3.5);
        });
      };

      playSoulStab();
      chordIntervalRef.current = setInterval(playSoulStab, 3200);
    } catch (e) {
      console.warn('Web Audio error:', e);
    }
  };

  const stopSynthFallback = () => {
    if (chordIntervalRef.current) {
      clearInterval(chordIntervalRef.current);
      chordIntervalRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try {
        audioCtxRef.current.suspend();
      } catch (e) {}
    }
  };

  // Play audio (MP3 or Synth)
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setRealAudioActive(true);
          stopSynthFallback();
        })
        .catch(() => {
          setRealAudioActive(false);
          startSynthFallback();
        });
    } else {
      startSynthFallback();
    }
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    stopSynthFallback();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!isPlaying) {
      playAudio();
    } else {
      pauseAudio();
    }
  };

  // Autoplay on site load (or on first user interaction)
  useEffect(() => {
    const attemptAutoplay = () => {
      playAudio();
    };

    const timeout = setTimeout(attemptAutoplay, 800);

    const handleFirstInteraction = () => {
      if (!isPlaying) {
        playAudio();
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    // Auto-dismiss quirky popup after 12 seconds
    const popupTimer = setTimeout(() => {
      setShowQuirkyPopup(false);
    }, 12000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(popupTimer);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  const handleNextTrack = () => {
    pauseAudio();
    setCurrentTrackIndex((prev) => (prev + 1) % brunoMarsPlaylist.length);
    setProgress(0);
    setTimeout(() => {
      playAudio();
    }, 150);
  };

  const handlePrevTrack = () => {
    pauseAudio();
    setCurrentTrackIndex((prev) => (prev - 1 + brunoMarsPlaylist.length) % brunoMarsPlaylist.length);
    setProgress(0);
    setTimeout(() => {
      playAudio();
    }, 150);
  };

  const toggleMute = (e) => {
    e?.stopPropagation();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (audioRef.current) {
      audioRef.current.muted = newMuted;
    }
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(
        newMuted ? 0 : 0.18,
        audioCtxRef.current.currentTime
      );
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(pct);
    }
  };

  // Synth progress timer
  useEffect(() => {
    let timer;
    if (isPlaying && !realAudioActive) {
      timer = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.4));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, realAudioActive]);

  useEffect(() => {
    return () => {
      pauseAudio();
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Hidden HTML5 Audio Element for Real MP3 Playback */}
      <audio
        ref={audioRef}
        src={currentTrack.audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNextTrack}
        preload="metadata"
      />

      {/* Quirky Personality Popup: "can mute it if you want but sure my vibe is like bruno" */}
      <AnimatePresence>
        {showQuirkyPopup && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute top-11 right-0 z-50 whitespace-nowrap px-3 py-1.5 rounded-full bg-studio-dark/95 dark:bg-white/95 text-white dark:text-studio-dark font-mono text-[9px] font-semibold shadow-xl border border-studio-blue/80 flex items-center gap-2 backdrop-blur-md"
          >
            <span className="text-amber-400">🎷</span>
            <span>can mute it if you want, but yeah my vibe is like bruno 🕶️</span>
            
            {/* Quick Mute Action in popup */}
            <button
              type="button"
              onClick={toggleMute}
              className="px-1.5 py-0.5 rounded bg-studio-blue/20 hover:bg-studio-blue text-white dark:text-studio-dark hover:text-white transition-colors text-[8px] font-bold"
            >
              {isMuted ? 'UNMUTE' : 'MUTE'}
            </button>

            {/* Dismiss X */}
            <button
              type="button"
              onClick={() => setShowQuirkyPopup(false)}
              className="p-0.5 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Dismiss"
            >
              <X size={11} />
            </button>

            {/* Little pointer triangle */}
            <div className="absolute -top-1 right-12 w-2 h-2 bg-studio-dark dark:bg-white border-l border-t border-studio-blue rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Music Player Capsule Bar */}
      <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-studio-card/95 dark:bg-studio-card-dark/95 border border-studio-border dark:border-studio-border-dark shadow-sm text-xs font-mono select-none transition-colors">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-studio-blue text-white shadow-sm scale-105'
              : 'bg-studio-dark dark:bg-white text-white dark:text-studio-dark hover:bg-studio-blue dark:hover:bg-studio-blue dark:hover:text-white'
          }`}
          aria-label={isPlaying ? 'Pause music' : 'Play Bruno Mars'}
          title={isPlaying ? 'Pause Bruno Mars' : 'Play Bruno Mars music'}
        >
          {isPlaying ? <Pause size={10} /> : <Play size={10} className="ml-0.5" />}
        </button>

        {/* Animated Soundwave Visualizer Bars */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 cursor-pointer px-1 py-0.5 rounded hover:bg-white/60 dark:hover:bg-studio-surface-dark transition-colors"
        >
          <div className="flex items-end gap-0.5 h-3.5 w-4">
            <span
              className={`w-0.5 rounded-full bg-studio-blue transition-all ${
                isPlaying && !isMuted ? 'animate-[bounce_0.8s_infinite] h-3' : 'h-1 bg-studio-muted dark:bg-studio-muted-dark'
              }`}
            />
            <span
              className={`w-0.5 rounded-full bg-studio-blue transition-all ${
                isPlaying && !isMuted ? 'animate-[bounce_1.1s_infinite_0.2s] h-3.5' : 'h-2 bg-studio-muted dark:bg-studio-muted-dark'
              }`}
            />
            <span
              className={`w-0.5 rounded-full bg-studio-blue transition-all ${
                isPlaying && !isMuted ? 'animate-[bounce_0.9s_infinite_0.4s] h-2.5' : 'h-1 bg-studio-muted dark:bg-studio-muted-dark'
              }`}
            />
            <span
              className={`w-0.5 rounded-full bg-studio-blue transition-all ${
                isPlaying && !isMuted ? 'animate-[bounce_1.2s_infinite_0.1s] h-3.5' : 'h-1.5 bg-studio-muted dark:bg-studio-muted-dark'
              }`}
            />
          </div>

          <div className="flex flex-col text-left max-w-[115px] sm:max-w-[170px]">
            <span className="text-[10px] font-semibold text-studio-dark dark:text-studio-light-text truncate leading-tight">
              {currentTrack.title}
            </span>
            <span className="text-[8px] text-studio-muted dark:text-studio-muted-dark truncate leading-tight">
              {isPlaying ? (isMuted ? 'Muted 🔇' : 'Bruno Mars • Silk Sonic') : 'Bruno Mars Radio'}
            </span>
          </div>
        </div>

        {/* Track Controls */}
        <div className="flex items-center gap-1 pl-1 border-l border-studio-border/60 dark:border-studio-border-dark">
          <button
            type="button"
            onClick={handlePrevTrack}
            className="p-1 rounded text-studio-muted dark:text-studio-muted-dark hover:text-studio-dark dark:hover:text-white hover:bg-white dark:hover:bg-studio-surface-dark transition-colors"
            title="Previous track"
          >
            <SkipBack size={10} />
          </button>
          <button
            type="button"
            onClick={handleNextTrack}
            className="p-1 rounded text-studio-muted dark:text-studio-muted-dark hover:text-studio-dark dark:hover:text-white hover:bg-white dark:hover:bg-studio-surface-dark transition-colors"
            title="Next track"
          >
            <SkipForward size={10} />
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className="p-1 rounded text-studio-muted dark:text-studio-muted-dark hover:text-studio-dark dark:hover:text-white hover:bg-white dark:hover:bg-studio-surface-dark transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={10} className="text-red-500" /> : <Volume2 size={10} />}
          </button>
        </div>
      </div>

      {/* Expanded Bruno Mars Playlist Card Popover */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="absolute top-11 right-0 z-50 w-76 sm:w-80 p-3.5 rounded-2xl bg-white dark:bg-studio-surface-dark border border-studio-border dark:border-studio-border-dark shadow-2xl font-mono text-xs"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-studio-border/60 dark:border-studio-border-dark">
              <span className="font-semibold text-studio-dark dark:text-studio-light-text flex items-center gap-1.5 text-[11px]">
                <Disc size={13} className={isPlaying ? 'animate-spin text-studio-blue' : 'text-studio-muted'} />
                <span>BRUNO MARS PLAYLIST</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-studio-blue/10 text-studio-blue font-bold">
                4 HITS
              </span>
            </div>

            <div className="space-y-1.5">
              {brunoMarsPlaylist.map((track, idx) => {
                const isActive = idx === currentTrackIndex;
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => {
                      setCurrentTrackIndex(idx);
                      playAudio();
                    }}
                    className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-studio-blue/10 dark:bg-studio-blue/20 border border-studio-blue/30 text-studio-blue'
                        : 'hover:bg-studio-bg dark:hover:bg-studio-card-dark text-studio-dark dark:text-studio-light-text'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="font-semibold text-[10px] truncate">{track.title}</div>
                      <div className="text-[8px] text-studio-muted dark:text-studio-muted-dark truncate">
                        {track.artist} • {track.style}
                      </div>
                    </div>
                    <span className="text-[9px] text-studio-muted dark:text-studio-muted-dark flex-shrink-0">
                      {track.duration}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-2 border-t border-studio-border/60 dark:border-studio-border-dark flex items-center justify-between text-[8px] text-studio-muted dark:text-studio-muted-dark">
              <span>{realAudioActive ? '● PLAYING ORIGINAL MP3' : isPlaying ? '● SOUL SYNTH RUNNING' : '○ PAUSED'}</span>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-studio-blue hover:underline font-medium"
              >
                CLOSE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
