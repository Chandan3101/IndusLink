/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sun, Moon, ArrowUpRight, Menu, X } from 'lucide-react';
import { SectionId } from '../types/index.ts';

interface NavigationProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenAccess: (mode: 'login' | 'start') => void;
}

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'home', label: 'HOME' },
  { id: 'evaluation', label: 'EVALUATION' },
  { id: 'opportunities', label: 'OPPORTUNITIES' },
  { id: 'explore', label: 'EXPLORE' },
];

export const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  onNavigate,
  isDark,
  onToggleTheme,
  onOpenAccess,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);

  const handlePrev = () => {
    const newIdx = Math.max(0, currentIndex - 1);
    onNavigate(SECTIONS[newIdx].id);
  };

  const handleNext = () => {
    const newIdx = Math.min(SECTIONS.length - 1, currentIndex + 1);
    onNavigate(SECTIONS[newIdx].id);
  };

  return (
    <header className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none transition-all duration-300">
      <nav
        aria-label="Main Navigation"
        className={`pointer-events-auto flex items-center gap-1.5 sm:gap-2.5 px-3 py-1.5 sm:py-2 rounded-full glass-surface-floating transition-all duration-300 max-w-full relative ${
          isScrolled ? 'shadow-2xl' : 'shadow-lg'
        }`}
      >
        {/* Brand Mark & Simple Emblem */}
        <button
          onClick={() => {
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738]"
          title="IndusLink — Home"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#9D1738] to-[#680C23] text-[#F4F1EC] flex items-center justify-center font-bold text-[10px] tracking-tight shadow-sm ring-1 ring-white/20">
            IL
          </div>
          <span className="font-serif font-bold text-sm tracking-wider text-[#15161A] dark:text-[#F4F1EC] hidden min-[440px]:inline">
            IndusLink
          </span>
        </button>

        {/* Vertical divider */}
        <div className="w-px h-4 bg-black/10 dark:bg-white/15 shrink-0" aria-hidden="true" />

        {/* Section Navigation with Prev/Next Steppers and Active Indicator */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738]"
            aria-label="Previous section"
            title="Previous section"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-[#61646E] dark:text-[#A6A8B0]" />
          </button>

          {/* Desktop Section Selector */}
          <div className="hidden sm:flex items-center gap-1">
            {SECTIONS.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => onNavigate(section.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative px-3 py-1 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738] whitespace-nowrap ${
                    isActive
                      ? 'bg-[#9D1738] text-[#F4F1EC] shadow-[0_0_15px_rgba(157,23,56,0.4)]'
                      : 'text-[#61646E] dark:text-[#A6A8B0] hover:text-[#15161A] dark:hover:text-[#F4F1EC] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {section.label}
                </button>
              );
            })}
          </div>

          {/* Mobile Current Active Section Label */}
          <div className="sm:hidden px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wider bg-[#9D1738] text-[#F4F1EC] uppercase">
            {SECTIONS[currentIndex]?.label || 'HOME'}
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === SECTIONS.length - 1}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738]"
            aria-label="Next section"
            title="Next section"
          >
            <ChevronRight className="w-3.5 h-3.5 text-[#61646E] dark:text-[#A6A8B0]" />
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-black/10 dark:bg-white/15 shrink-0" aria-hidden="true" />

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#61646E] dark:text-[#A6A8B0] hover:text-[#9D1738] dark:hover:text-[#F4F1EC] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738] shrink-0"
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
          )}
        </button>

        {/* Actions: Log In & Get Started */}
        <div className="hidden md:flex items-center gap-1.5 shrink-0 ml-1">
          <button
            onClick={() => onOpenAccess('login')}
            className="px-3 py-1 text-xs font-medium text-[#61646E] dark:text-[#A6A8B0] hover:text-[#15161A] dark:hover:text-[#F4F1EC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738] whitespace-nowrap"
          >
            Log In
          </button>

          <button
            onClick={() => onOpenAccess('start')}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#9D1738] hover:bg-[#B81D43] text-[#F4F1EC] shadow-sm hover:shadow-[0_0_15px_rgba(157,23,56,0.4)] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738] whitespace-nowrap"
          >
            <span>Get Started</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Mobile Menu Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#61646E] dark:text-[#A6A8B0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738]"
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </nav>

      {/* Animated Mobile Glass Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-4 right-4 pointer-events-auto glass-surface-floating rounded-2xl p-5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2 mb-4">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  onNavigate(section.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-colors ${
                  activeSection === section.id
                    ? 'bg-[#9D1738] text-[#F4F1EC]'
                    : 'text-[#61646E] dark:text-[#A6A8B0] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-black/10 dark:border-white/10">
            <button
              onClick={() => {
                onOpenAccess('login');
                setMobileMenuOpen(false);
              }}
              className="py-2 rounded-xl text-xs font-medium text-center border border-black/10 dark:border-white/10 text-[#15161A] dark:text-[#F4F1EC]"
            >
              Log In
            </button>
            <button
              onClick={() => {
                onOpenAccess('start');
                setMobileMenuOpen(false);
              }}
              className="py-2 rounded-xl text-xs font-semibold text-center bg-[#9D1738] text-[#F4F1EC]"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
