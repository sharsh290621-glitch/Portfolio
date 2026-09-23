import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navigationLinks, designerBio } from '../data/projects';
import StudioMusicPlayer from './StudioMusicPlayer';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X } from 'lucide-react';

export default function PortfolioNavbar({ onSelectSection, onOpenProject }) {
  const [timeString, setTimeString] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();

  // Live time ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 md:px-8 py-2.5 sm:py-3 border-b border-studio-border/70 dark:border-studio-border-dark/80 bg-studio-bg/90 dark:bg-studio-bg-dark/90 backdrop-blur-md transition-colors"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs tracking-wider">
          {/* Left Brand Identity */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="font-bold text-studio-dark dark:text-studio-light-text font-sans tracking-tight text-sm hover:text-studio-blue dark:hover:text-studio-blue transition-colors flex items-center gap-2 group"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-studio-dark dark:bg-white group-hover:bg-studio-blue transition-colors" />
              <span>{designerBio.name}</span>
            </a>
            <span className="hidden xl:inline-block text-[10px] font-mono text-studio-muted dark:text-studio-muted-dark border-l border-studio-border dark:border-studio-border-dark pl-3 py-0.5">
              WORKSPACE OS v2.6
            </span>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-studio-card/80 dark:bg-studio-card-dark/80 border border-studio-border/60 dark:border-studio-border-dark rounded-full px-2 py-1 shadow-sm">
            {navigationLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.label === 'WORK') {
                    e.preventDefault();
                    if (onSelectSection) onSelectSection('work');
                  }
                }}
                className="px-3 py-1 text-studio-dark/80 dark:text-studio-light-text/80 hover:text-studio-blue dark:hover:text-studio-blue font-mono text-[11px] font-medium rounded-full hover:bg-white dark:hover:bg-studio-surface-dark transition-all flex items-center gap-1.5 group"
              >
                <span>{item.label}</span>
                {item.count && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-studio-border/60 dark:bg-studio-border-dark group-hover:bg-studio-blue group-hover:text-white transition-colors">
                    {item.count}
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* Right Tools: Music Player + Theme Toggle + Status + Clock */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Studio Slow Jazz Audio Player */}
            <StudioMusicPlayer />

            {/* Dark / Light Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-studio-card dark:bg-studio-card-dark border border-studio-border/70 dark:border-studio-border-dark text-studio-dark dark:text-studio-light-text hover:border-studio-blue hover:text-studio-blue transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark/light mode"
            >
              {isDark ? (
                <>
                  <Sun size={12} className="text-amber-400" />
                  <span className="hidden sm:inline-block font-mono text-[10px] font-semibold">LIGHT</span>
                </>
              ) : (
                <>
                  <Moon size={12} className="text-studio-dark" />
                  <span className="hidden sm:inline-block font-mono text-[10px] font-semibold">DARK</span>
                </>
              )}
            </button>

            {/* Availability Status */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-studio-card dark:bg-studio-card-dark border border-studio-border/60 dark:border-studio-border-dark">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-[10px] text-studio-dark dark:text-studio-light-text font-medium uppercase">
                {designerBio.status}
              </span>
            </div>

            {/* Local Clock */}
            <div className="hidden sm:flex font-mono text-[11px] text-studio-muted dark:text-studio-muted-dark items-center gap-1">
              <span>{timeString}</span>
              <span className="text-[9px] text-studio-subtle dark:text-studio-subtle-dark">LOCAL</span>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md border border-studio-border dark:border-studio-border-dark bg-white dark:bg-studio-surface-dark text-studio-dark dark:text-white lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-4 top-16 z-40 p-5 rounded-2xl bg-studio-bg dark:bg-studio-bg-dark border border-studio-border dark:border-studio-border-dark shadow-2xl lg:hidden"
          >
            <div className="flex flex-col gap-3 font-mono text-sm">
              <div className="text-[10px] text-studio-muted dark:text-studio-muted-dark uppercase tracking-widest pb-1 border-b border-studio-border dark:border-studio-border-dark flex items-center justify-between">
                <span>Navigation</span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-1 text-studio-blue"
                >
                  {isDark ? <Sun size={12} /> : <Moon size={12} />}
                  <span>{isDark ? 'LIGHT MODE' : 'DARK MODE'}</span>
                </button>
              </div>
              {navigationLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-3 rounded-lg hover:bg-white dark:hover:bg-studio-card-dark flex items-center justify-between text-studio-dark dark:text-white hover:text-studio-blue font-medium"
                >
                  <span>{item.label}</span>
                  {item.count && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-studio-border/60 dark:bg-studio-border-dark">
                      {item.count}
                    </span>
                  )}
                </a>
              ))}

              <div className="pt-3 border-t border-studio-border dark:border-studio-border-dark flex items-center justify-between text-xs text-studio-muted dark:text-studio-muted-dark">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Available for Q2/Q3 projects</span>
                </span>
                <span>{timeString}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
