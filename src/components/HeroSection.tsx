/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Activity, CheckCircle2 } from 'lucide-react';
import { SectionId } from '../types/index.ts';
import { AnimatedHeading } from './AnimatedHeading.tsx';

interface HeroSectionProps {
  onNavigate: (section: SectionId) => void;
  onOpenAccess: (mode: 'login' | 'start') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAccess }) => {
  const [activeNode, setActiveNode] = useState<'source' | 'logistics' | 'receiving'>('source');

  const nodeDetails = {
    source: {
      tag: '01 Origin',
      title: 'Biomass Cogeneration Ash',
      meta: '340 t/mo · 89.4% SiO2 · pH 10.4',
      status: 'ISO 17025 Verified',
    },
    logistics: {
      tag: '02 Corridor',
      title: 'Delivered Freight Analysis',
      meta: '85 km · $15.30/t · -640 kg CO2e/t net',
      status: 'Break-even 7,200 km',
    },
    receiving: {
      tag: '03 Off-taker',
      title: 'Class N Pozzolan Specification',
      meta: 'ASTM C618 batching · 30% clinker offset',
      status: 'Engineering Limits Passed',
    },
  };

  return (
    <section
      id="home"
      aria-label="Hero section"
      className="relative min-h-[90vh] pt-28 pb-16 md:py-32 flex flex-col justify-center overflow-hidden scroll-mt-24"
    >
      {/* Ambient Visual Backdrop */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <img
          src="/src/assets/images/hero_industrial_facility_1792836301559.jpg"
          alt="Modern industrial processing facility"
          className="w-full h-full object-cover object-center opacity-10 dark:opacity-15 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D0F]/90 via-[#0B0D0F]/80 to-[#0B0D0F]" />
        <div className="absolute top-1/4 left-1/4 w-[420px] h-[420px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[380px] h-[380px] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Hero Editorial Core */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface text-xs font-semibold tracking-widest text-emerald-400 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>INDUSTRIAL RESOURCE INTELLIGENCE</span>
            </div>

            {/* Headline with Skew-In text engine */}
            <AnimatedHeading
              tag="h1"
              effect="skew"
              className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#F8FAFC] leading-[1.1] text-balance"
            >
              Turn Industrial Byproducts Into Valuable Resources.
            </AnimatedHeading>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed max-w-xl">
              Discover reuse opportunities. Validate material compatibility. Compare delivered costs and environmental impact.
            </p>

            {/* Actions: Primary & Secondary */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="cta-discover-button"
                onClick={() => onOpenAccess('start')}
                className="glow-button-emerald flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold active:scale-[0.98] transition-all"
              >
                <span>Explore Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="cta-signin-button"
                onClick={() => onOpenAccess('login')}
                className="px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold glass-surface text-[#F8FAFC] hover:bg-white/10 active:scale-[0.98] transition-all"
              >
                Sign In
              </button>
            </div>

            {/* Evidence markers */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero False Matches</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Delivered Economics</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>ISO 17025 Traceable</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Premium Material-Flow Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-6"
          >
            <div className="glass-surface-elevated rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-2xl border border-white/10">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80" />

              <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase block">
                    Verified Byproduct Stream
                  </span>
                  <AnimatedHeading
                    tag="h2"
                    effect="softFocus"
                    className="font-serif text-lg sm:text-xl font-semibold text-[#F8FAFC]"
                  >
                    Continuous Secondary Synergies
                  </AnimatedHeading>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Active Corridor
                </span>
              </div>

              {/* 3-Step Interactive Material-Flow Diagram */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { id: 'source', num: '01', label: 'Origin Stream', sub: 'Rice Husk Ash' },
                  { id: 'logistics', num: '02', label: 'Delivered Corridor', sub: '85 km Freight' },
                  { id: 'receiving', num: '03', label: 'Off-taker Plant', sub: 'Blended Cement' },
                ].map((step) => {
                  const isActive = activeNode === step.id;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveNode(step.id as any)}
                      className={`p-3 rounded-2xl text-left transition-all ${
                        isActive
                          ? 'glass-surface-floating border-emerald-400 ring-1 ring-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                          : 'glass-surface hover:border-white/20'
                      }`}
                    >
                      <span className={`font-mono text-xs font-bold block ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`}>
                        {step.num}
                      </span>
                      <span className="font-semibold text-xs text-[#F8FAFC] block truncate mt-0.5">
                        {step.label}
                      </span>
                      <span className="text-[10px] text-zinc-400 block truncate">
                        {step.sub}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Flow Conduit Info */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] uppercase text-emerald-400">
                    {nodeDetails[activeNode].tag}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {nodeDetails[activeNode].status}
                  </span>
                </div>

                <div className="font-serif text-lg font-semibold text-[#F8FAFC]">
                  {nodeDetails[activeNode].title}
                </div>

                <div className="font-mono text-xs text-zinc-300">
                  {nodeDetails[activeNode].meta}
                </div>

                {/* Animated Material Stream Progress Conduit */}
                <div className="relative pt-2">
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative">
                    <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 rounded-full animate-pulse w-3/4" />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400 mt-1.5">
                    <span>Generation: 340 t/mo</span>
                    <span>Delivered: $48/t</span>
                    <span>Target: 500 t/mo</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
