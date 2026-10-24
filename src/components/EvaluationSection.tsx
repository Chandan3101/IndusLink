/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  Scale,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { AnimatedHeading } from './AnimatedHeading.tsx';

export const EvaluationSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(2);

  // Concise 5-step sequence as specified in Section 3
  const steps = [
    { num: '01', title: 'Register Material', desc: 'Define byproduct stream properties and monthly generation.' },
    { num: '02', title: 'Validate Evidence', desc: 'Identify assay gaps, test certificates, and compliance boundaries.' },
    { num: '03', title: 'Assess Compatibility', desc: 'Evaluate tolerance limits against receiving buyer specifications.' },
    { num: '04', title: 'Compare Cost & Impact', desc: 'Calculate haulage waterfall, gate pricing, and net carbon abatement.' },
    { num: '05', title: 'Review Opportunity', desc: 'Structure off-take terms and transmit verified commercial proposals.' },
  ];

  return (
    <div className="space-y-24 py-20 border-t border-white/5">
      {/* =========================================================================
          SECTION 2 — THE PROBLEM
          ========================================================================= */}
      <section id="problem" aria-label="The Problem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>The Challenge</span>
          </div>
          <AnimatedHeading
            tag="h2"
            effect="unblurLines"
            className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[#F8FAFC] leading-tight"
          >
            Potential Value. Hidden Complexity.
          </AnimatedHeading>
        </motion.div>

        {/* Three compact cards: 1 short sentence each */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Material Uncertainty */}
          <div className="glass-surface-elevated rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/10 hover:border-emerald-500/40 transition-all shadow-lg group">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 ring-1 ring-emerald-500/20 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#F8FAFC] mb-2">
                Material Uncertainty
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Material properties and test evidence may be incomplete or unverified.
              </p>
            </div>
            <div className="pt-4 mt-5 border-t border-white/5 text-[11px] font-mono text-zinc-400">
              Flags missing assay parameters
            </div>
          </div>

          {/* Card 2: Hidden Logistics Costs */}
          <div className="glass-surface-elevated rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/10 hover:border-blue-500/40 transition-all shadow-lg group">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 ring-1 ring-blue-500/20 group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#F8FAFC] mb-2">
                Hidden Logistics Costs
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Transport, handling, and preprocessing directly dictate delivered viability.
              </p>
            </div>
            <div className="pt-4 mt-5 border-t border-white/5 text-[11px] font-mono text-zinc-400">
              Calculates delivered cost waterfall
            </div>
          </div>

          {/* Card 3: Unverified Environmental Benefits */}
          <div className="glass-surface-elevated rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/10 hover:border-teal-500/40 transition-all shadow-lg group">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-5 ring-1 ring-teal-500/20 group-hover:scale-105 transition-transform">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#F8FAFC] mb-2">
                Unverified Environmental Benefits
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Defensible lifecycle baselines are needed to prevent greenwashing.
              </p>
            </div>
            <div className="pt-4 mt-5 border-t border-white/5 text-[11px] font-mono text-zinc-400">
              ISO 14044 baseline carbon accounting
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — HOW IT WORKS
          Sequence: Register Material → Validate Evidence → Assess Compatibility → Compare Cost & Impact → Review Opportunity
          ========================================================================= */}
      <section id="how-it-works" aria-label="How It Works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Process Sequence</span>
          </div>
          <AnimatedHeading
            tag="h2"
            effect="unblurLines"
            className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[#F8FAFC] leading-tight"
          >
            From Material to Verified Decision.
          </AnimatedHeading>
        </motion.div>

        {/* Visually connected 5-step sequence */}
        <div className="glass-surface-elevated rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80" />

          {/* Process Track */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 relative z-10">
            {steps.map((step, idx) => {
              const isSelected = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 rounded-2xl text-left transition-all relative ${
                    isSelected
                      ? 'glass-surface-floating border-emerald-400 ring-1 ring-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                      : 'glass-surface hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-mono text-xs font-bold ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`}>
                      {step.num}
                    </span>
                    {idx < steps.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-600 hidden lg:block" />
                    )}
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-[#F8FAFC] mb-1">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    {step.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Step Details Bar */}
          <div className="mt-6 pt-5 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="font-mono text-emerald-400 font-semibold uppercase">Active Stage:</span>
              <span className="font-semibold text-[#F8FAFC]">
                {steps[activeStep].num} — {steps[activeStep].title}
              </span>
              <span className="text-zinc-500">·</span>
              <span className="text-zinc-400">{steps[activeStep].desc}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Traceable Audit Trail</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
