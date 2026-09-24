import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import MockVideo from './MockVideo';
import ExperienceCounterTile from './ExperienceCounterTile';

export default function ProjectPreview({ project, onClose, onNext, onPrev }) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-studio-bg dark:bg-studio-bg-dark rounded-2xl border border-studio-border dark:border-studio-border-dark shadow-2xl overflow-hidden flex flex-col z-10"
        >
          {/* Window Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-studio-card dark:bg-studio-card-dark border-b border-studio-border dark:border-studio-border-dark select-none">
            {/* Window Dots */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:opacity-80 transition-opacity"
                aria-label="Close modal"
              />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
              <span className="ml-3 font-mono text-xs text-studio-muted dark:text-studio-muted-dark font-medium">
                {project.windowTitle || `${project.title} — PREVIEW`}
              </span>
            </div>

            {/* Quick Actions & Close */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-studio-border/60 dark:bg-studio-border-dark text-studio-dark dark:text-white uppercase font-semibold">
                {project.category}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-md text-studio-muted dark:text-studio-muted-dark hover:text-studio-dark dark:hover:text-white hover:bg-studio-border/40 dark:hover:bg-studio-border-dark transition-colors"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto flex-1 p-5 sm:p-7 space-y-6">
            {/* Visual Media Showcase */}
            <div className="w-full rounded-xl overflow-hidden border border-studio-border/80 dark:border-studio-border-dark bg-studio-dark/5 dark:bg-black/40 shadow-inner">
              {project.video ? (
                <MockVideo
                  src={project.video}
                  poster={project.image}
                  title={project.title}
                  category={project.category}
                  aspectRatio="16/10"
                />
              ) : project.type === 'experience-counter' ? (
                <div className="w-full py-8 flex items-center justify-center bg-studio-card dark:bg-studio-card-dark">
                  <ExperienceCounterTile
                    startDate={project.startDate || '2024-12-01T00:00:00'}
                    width={320}
                    isHovered={true}
                  />
                </div>
              ) : (
                <div className="w-full flex items-center justify-center p-2 bg-studio-card dark:bg-studio-card-dark">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="max-h-[380px] w-auto object-contain rounded-lg shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Project Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Left 2 Cols: Title & Description */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-baseline gap-3">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-studio-dark dark:text-studio-light-text">
                    {project.title}
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-studio-muted dark:text-studio-muted-dark leading-relaxed font-sans">
                  {project.description}
                </p>

                {/* Tags */}
                {project.tags && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] px-2.5 py-1 rounded-md bg-white dark:bg-studio-card-dark border border-studio-border dark:border-studio-border-dark text-studio-dark dark:text-white font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Col: Metadata Sidebar */}
              <div className="p-4 rounded-xl bg-studio-card dark:bg-studio-card-dark border border-studio-border/80 dark:border-studio-border-dark font-mono text-xs space-y-3">
                <div>
                  <div className="text-[10px] text-studio-muted dark:text-studio-muted-dark uppercase tracking-wider mb-0.5">
                    Client / Type
                  </div>
                  <div className="font-semibold text-studio-dark dark:text-studio-light-text">
                    {project.client || 'Harsh Shah Studio'}
                  </div>
                </div>

                <div className="border-t border-studio-border/60 dark:border-studio-border-dark pt-2.5">
                  <div className="text-[10px] text-studio-muted dark:text-studio-muted-dark uppercase tracking-wider mb-0.5">
                    Timeline
                  </div>
                  <div className="font-semibold text-studio-dark dark:text-studio-light-text">
                    {project.year || '2026'}
                  </div>
                </div>

                <div className="border-t border-studio-border/60 dark:border-studio-border-dark pt-2.5">
                  <div className="text-[10px] text-studio-muted dark:text-studio-muted-dark uppercase tracking-wider mb-0.5">
                    Status
                  </div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Archived &amp; Published</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Bar */}
          <div className="px-5 py-3 bg-studio-card dark:bg-studio-card-dark border-t border-studio-border dark:border-studio-border-dark flex items-center justify-between">
            <div className="flex items-center gap-2">
              {onPrev && (
                <button
                  type="button"
                  onClick={onPrev}
                  className="px-3 py-1.5 rounded-md border border-studio-border dark:border-studio-border-dark bg-white dark:bg-studio-surface-dark text-studio-dark dark:text-white hover:text-studio-blue font-mono text-[11px] flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft size={12} />
                  <span>PREV</span>
                </button>
              )}
              {onNext && (
                <button
                  type="button"
                  onClick={onNext}
                  className="px-3 py-1.5 rounded-md border border-studio-border dark:border-studio-border-dark bg-white dark:bg-studio-surface-dark text-studio-dark dark:text-white hover:text-studio-blue font-mono text-[11px] flex items-center gap-1 transition-colors"
                >
                  <span>NEXT</span>
                  <ArrowRight size={12} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-md bg-studio-dark dark:bg-studio-blue text-white font-mono text-[11px] font-medium hover:bg-studio-blue dark:hover:bg-studio-blue-dark transition-colors"
            >
              CLOSE PREVIEW
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
