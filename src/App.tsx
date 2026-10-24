/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { SectionId } from './types/index.ts';
import { Navigation } from './components/Navigation.tsx';
import { ScrollProgressBar } from './components/ScrollProgressBar.tsx';
import { RibbedStructureCanvas } from './components/RibbedStructureCanvas.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { EvaluationSection } from './components/EvaluationSection.tsx';
import { OpportunitiesSection } from './components/OpportunitiesSection.tsx';
import { ExploreSection } from './components/ExploreSection.tsx';
import { AccessModal } from './components/AccessModal.tsx';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [accessMode, setAccessMode] = useState<'login' | 'start'>('start');

  // Synchronize dark mode class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Section scroll tracking via IntersectionObserver
  useEffect(() => {
    const sections: SectionId[] = ['home', 'evaluation', 'opportunities', 'explore'];
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        {
          rootMargin: '-30% 0px -50% 0px',
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const handleNavigate = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    }
  };

  const handleOpenAccess = (mode: 'login' | 'start') => {
    setAccessMode(mode);
    setIsAccessModalOpen(true);
  };

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-300 relative">
        {/* Continuous 4-Section 3D Ribbed Structure (Fixed Global WebGL Layer) */}
        <RibbedStructureCanvas />

        {/* Subtle Top Viewport Scroll Progress Bar */}
        <ScrollProgressBar />

        {/* Floating Pill Navigation */}
        <Navigation
          activeSection={activeSection}
          onNavigate={handleNavigate}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          onOpenAccess={handleOpenAccess}
        />

        {/* Connected 4-Section Narrative */}
        <main>
          <HeroSection onNavigate={handleNavigate} onOpenAccess={handleOpenAccess} />
          <EvaluationSection />
          <OpportunitiesSection />
          <ExploreSection onNavigate={handleNavigate} onOpenAccess={handleOpenAccess} />
        </main>

        {/* Access & Early Evaluation Portal Dialog */}
        <AccessModal
          isOpen={isAccessModalOpen}
          onClose={() => setIsAccessModalOpen(false)}
          initialMode={accessMode}
        />
      </div>
    </MotionConfig>
  );
}
