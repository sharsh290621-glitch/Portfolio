import React, { useState } from 'react';
import Hero from './components/Hero';
import ProjectPreview from './components/ProjectPreview';
import { floatingObjectsData } from './data/projects';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ArrowUp } from 'lucide-react';

function PortfolioApp() {
  const [selectedProject, setSelectedProject] = useState(null);
  const { isDark } = useTheme();

  // Navigate to previous/next project in preview modal
  const handleNextProject = () => {
    if (!selectedProject) return;
    const currentIndex = floatingObjectsData.findIndex(
      (p) => p.id === selectedProject.id
    );
    const nextIndex = (currentIndex + 1) % floatingObjectsData.length;
    setSelectedProject(floatingObjectsData[nextIndex]);
  };

  const handlePrevProject = () => {
    if (!selectedProject) return;
    const currentIndex = floatingObjectsData.findIndex(
      (p) => p.id === selectedProject.id
    );
    const prevIndex =
      (currentIndex - 1 + floatingObjectsData.length) %
      floatingObjectsData.length;
    setSelectedProject(floatingObjectsData[prevIndex]);
  };

  const scrollToWork = () => {
    const workSection = document.getElementById('work-preview-boundary');
    if (workSection) {
      workSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-studio-bg dark:bg-studio-bg-dark text-studio-dark dark:text-studio-light-text selection:bg-studio-blue selection:text-white transition-colors duration-300">
      {/* Continuous Global Dot Grid & Noise Texture (Flows across the entire page without partitions) */}
      <div className="fixed inset-0 studio-grid-pattern pointer-events-none z-0" />
      <div className="fixed inset-0 studio-noise pointer-events-none opacity-40 dark:opacity-30 z-0" />

      {/* Main Page Content */}
      <div className="relative z-10">
        {/* 100vh Hero Interactive Digital Studio Workspace */}
        <Hero
          onSelectProject={(project) => setSelectedProject(project)}
          onExploreClick={scrollToWork}
        />

        {/* Seamless Continuous Work Section (No partition / No background breaks) */}
        <div
          id="work-preview-boundary"
          className="relative z-20 px-6 py-20 md:py-28 transition-colors duration-300"
        >
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-studio-surface-dark border border-studio-border dark:border-studio-border-dark font-mono text-[11px] text-studio-muted dark:text-studio-muted-dark shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-studio-blue animate-pulse" />
            <span>ARCHITECTURE READY FOR WORK SECTION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-studio-dark dark:text-white tracking-tight">
            Curated Works &amp; Case Studies
          </h2>

          <p className="text-studio-muted dark:text-studio-muted-dark font-sans max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Click any creative desktop object above or explore individual projects. The modular architecture is ready to attach full portfolio sections.
          </p>

          {/* Quick Grid of Project Quick Launchers */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {floatingObjectsData.slice(0, 4).map((proj) => (
              <button
                key={proj.id}
                type="button"
                onClick={() => setSelectedProject(proj)}
                className="p-3.5 rounded-xl bg-white dark:bg-studio-surface-dark border border-studio-border dark:border-studio-border-dark hover:border-studio-blue text-left transition-all hover:shadow-md group"
              >
                <div className="text-[10px] font-mono text-studio-muted dark:text-studio-muted-dark uppercase mb-1">
                  {proj.category}
                </div>
                <div className="font-bold text-xs sm:text-sm text-studio-dark dark:text-white group-hover:text-studio-blue transition-colors truncate">
                  {proj.title}
                </div>
              </button>
            ))}
          </div>

          <div className="pt-8 flex justify-center">
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 font-mono text-xs text-studio-muted dark:text-studio-muted-dark hover:text-studio-dark dark:hover:text-white transition-colors px-4 py-2 rounded-full border border-studio-border/60 dark:border-studio-border-dark bg-white dark:bg-studio-surface-dark shadow-sm"
            >
              <ArrowUp size={12} />
              <span>RETURN TO DESKTOP HERO</span>
            </button>
          </div>
          </div>
        </div>

        {/* Project Preview Modal */}
        {selectedProject && (
          <ProjectPreview
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onNext={handleNextProject}
            onPrev={handlePrevProject}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioApp />
    </ThemeProvider>
  );
}
