/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { SectionId } from '../types/index.ts';
import {
  Compass,
  Cpu,
  DollarSign,
  Leaf,
  ShieldCheck,
  Network,
  ArrowRight,
  Lock,
  Shield,
} from 'lucide-react';
import { AnimatedHeading } from './AnimatedHeading.tsx';

interface ExploreSectionProps {
  onNavigate: (section: SectionId) => void;
  onOpenAccess: (mode: 'login' | 'start') => void;
}

export const ExploreSection: React.FC<ExploreSectionProps> = ({ onNavigate, onOpenAccess }) => {
  // Six distinct, compact entry points as strictly requested
  const entryPoints = [
    {
      title: 'Discover Materials',
      desc: 'Browse qualified byproduct streams by chemistry and radius.',
      icon: Compass,
    },
    {
      title: 'Assess Compatibility',
      desc: 'Verify engineering tolerances against receiving specs.',
      icon: Cpu,
    },
    {
      title: 'Calculate Delivered Cost',
      desc: 'Model gate price, freight, and testing amortized per ton.',
      icon: DollarSign,
    },
    {
      title: 'Compare Environmental Impact',
      desc: 'Measure net emissions against virgin material baselines.',
      icon: Leaf,
    },
    {
      title: 'Review Evidence',
      desc: 'Audit ISO 17025 test certificates and data gaps.',
      icon: ShieldCheck,
    },
    {
      title: 'Optimize Resource Flows',
      desc: 'Solve regional multi-facility symbiosis routing.',
      icon: Network,
    },
  ];

  return (
    <section
      id="platform"
      aria-label="Platform section"
      className="relative min-h-[90vh] py-20 md:py-28 border-t border-white/5 flex flex-col justify-between scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-16">
        {/* Section 4 — Platform Header */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Platform</span>
            </div>
            <AnimatedHeading
              tag="h2"
              className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[#F8FAFC] leading-tight"
            >
              Industrial Intelligence. One Workspace.
            </AnimatedHeading>
          </motion.div>

          {/* Six Distinct, Compact Entry Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {entryPoints.map((point, idx) => {
              const Icon = point.icon;
              return (
                <div
                  key={idx}
                  onClick={() => onOpenAccess('start')}
                  className="glass-surface-elevated rounded-2xl p-5 border border-white/10 hover:border-emerald-500/40 transition-all shadow-md cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center ring-1 ring-emerald-500/20 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-semibold text-[#F8FAFC]">
                        {point.title}
                      </h3>
                      <p className="text-xs text-zinc-300 leading-relaxed mt-1">
                        {point.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-emerald-400 font-mono">
                    <span>Launch Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to Action Banner */}
          <div className="glass-surface-elevated rounded-3xl p-8 sm:p-10 text-center max-w-2xl mx-auto space-y-5 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80" />

            <div className="space-y-1.5">
              <AnimatedHeading
                tag="h3"
                className="font-serif text-2xl sm:text-3xl font-semibold text-[#F8FAFC]"
              >
                One organization. Buy, sell, or both.
              </AnimatedHeading>
              <p className="text-xs text-zinc-300 max-w-md mx-auto">
                Connect secondary mineral and chemical streams to industrial off-takers with verified technical evidence.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => onOpenAccess('start')}
                className="glow-button-emerald px-7 py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2"
              >
                <span>Explore Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-400 pt-2">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> Confidential Data Protection
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-blue-400" /> ISO 17025 Certified
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 pt-8 pb-6 text-xs text-zinc-400">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-serif font-bold text-base text-[#F8FAFC]">
              <span>IndusLink</span>
              <span className="text-xs text-zinc-500 font-sans font-normal">· Industrial Resource Intelligence</span>
            </div>

            <nav aria-label="Footer Navigation" className="flex items-center gap-5 text-xs font-medium">
              <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors">
                Hero
              </button>
              <button onClick={() => onNavigate('problem')} className="hover:text-emerald-400 transition-colors">
                The Problem
              </button>
              <button onClick={() => onNavigate('how-it-works')} className="hover:text-emerald-400 transition-colors">
                How It Works
              </button>
              <button onClick={() => onNavigate('platform')} className="hover:text-emerald-400 transition-colors">
                Platform
              </button>
            </nav>

            <div className="text-[11px] text-zinc-400">
              © 2026 IndusLink. Verifiable industrial resource intelligence.
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};
