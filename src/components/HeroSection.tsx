/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Factory, FileSpreadsheet, Cpu, Building2, CheckCircle2, AlertTriangle, HelpCircle, ShieldCheck, Activity } from 'lucide-react';
import { SectionId } from '../types/index.ts';

interface HeroSectionProps {
  onNavigate: (section: SectionId) => void;
  onOpenAccess: (mode: 'login' | 'start') => void;
}

interface FlowStep {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  details: {
    headline: string;
    description: string;
    sampleData: { label: string; value: string; status: 'verified' | 'warning' | 'pending' }[];
    technicalMetric: string;
  };
}

const FLOW_STEPS: FlowStep[] = [
  {
    id: 'source',
    number: '01',
    title: 'Source Facility',
    subtitle: 'Byproduct Point of Origin',
    icon: Factory,
    details: {
      headline: 'Process Lineage & Generation Parameters',
      description:
        'Continuous thermal biomass cogeneration unit producing secondary mineralized ash at 340 metric tons monthly. Sealed dry bulk silo storage.',
      sampleData: [
        { label: 'Facility Origin', value: 'Thermal Cogeneration Plant', status: 'verified' },
        { label: 'Generation Cadence', value: '340 t / month steady-state', status: 'verified' },
        { label: 'Feedstock Lineage', value: 'Oryza sativa husk hulling byproduct', status: 'verified' },
      ],
      technicalMetric: 'Combustion Temp: 680°C Controlled',
    },
  },
  {
    id: 'profile',
    number: '02',
    title: 'Material Profile',
    subtitle: 'Assay & Tolerance Dossier',
    icon: FileSpreadsheet,
    details: {
      headline: 'Elemental Assays & Missing Data Exposure',
      description:
        'Documented 89.4% SiO2 and 4.6% LOI. Crucially highlights that XRD crystalline quartz ratio is unverified, blocking algorithmic premature clearance.',
      sampleData: [
        { label: 'SiO2 Purity', value: '89.4% (XRF ASTM C114)', status: 'verified' },
        { label: 'Loss on Ignition (LOI)', value: '4.6% (Within <6% limit)', status: 'verified' },
        { label: 'XRD Amorphous Ratio', value: 'Assay Pending (Rietveld)', status: 'warning' },
      ],
      technicalMetric: 'Data Integrity: 2 Verified / 1 Missing',
    },
  },
  {
    id: 'engine',
    number: '03',
    title: 'Evaluation Engine',
    subtitle: 'Four-Dimensional Gate',
    icon: Cpu,
    details: {
      headline: 'Logistics Haulage & Lifecycle Carbon Engine',
      description:
        'Evaluates delivered cost ($48/t vs $90/t clinker baseline) and computes break-even haulage radius (7,200 km) where transport emissions equal process offsets.',
      sampleData: [
        { label: 'Haulage Distance', value: '85 km ($15.30 freight)', status: 'verified' },
        { label: 'Delivered Unit Cost', value: '$48.00 / ton delivered', status: 'verified' },
        { label: 'Net Carbon Delta', value: '-640 kg CO2e / ton substituted', status: 'verified' },
      ],
      technicalMetric: 'Economic Delta: +$42/t Net Margin',
    },
  },
  {
    id: 'target',
    number: '04',
    title: 'Receiving Application',
    subtitle: 'Engineering Process Tolerances',
    icon: Building2,
    details: {
      headline: 'Structural Engineering Specification Validation',
      description:
        'Candidate supplementary cementitious binder (SCM) for ASTM C618 concrete batching. Hard constraint requires lab verification of amorphous silica reactivity.',
      sampleData: [
        { label: 'Recipient Process', value: 'Blended Pozzolanic Cement', status: 'verified' },
        { label: 'Specification Limit', value: 'ASTM C618 Class N Standard', status: 'verified' },
        { label: 'Exchange Verdict', value: 'Additional Laboratory Testing Required', status: 'warning' },
      ],
      technicalMetric: 'Status: Actionable Lab Barrier',
    },
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onOpenAccess }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = FLOW_STEPS[activeStepIndex];

  return (
    <section
      id="home"
      aria-label="Home section"
      className="relative min-h-screen pt-28 pb-20 md:py-36 flex flex-col justify-center overflow-hidden scroll-mt-24 md:scroll-mt-32"
    >
      {/* Cinematic Liquid-Glass Background Environment */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Real Industrial Photography Backdrop */}
        <img
          src="/src/assets/images/hero_industrial_facility_1792836301559.jpg"
          alt="Modern sustainable heavy industrial facility architecture at evening twilight"
          className="w-full h-full object-cover object-center opacity-15 dark:opacity-20 scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Ambient Industrial Atmospheric Scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7F5F0]/85 via-[#F7F5F0]/60 to-[#F7F5F0] dark:from-[#0B0D11]/88 dark:via-[#0B0D11]/70 dark:to-[#0B0D11]" />

        {/* Liquid Glass Volumetric Burgundy & Metallic Blooms */}
        <div className="absolute top-1/4 left-1/4 w-[480px] h-[480px] bg-[#9D1738]/10 dark:bg-[#9D1738]/16 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] bg-[#C9AA79]/8 dark:bg-[#C9AA79]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-2/3 right-1/3 w-[360px] h-[360px] bg-[#38BDF8]/6 dark:bg-[#38BDF8]/8 blur-[110px] rounded-full pointer-events-none" />

        {/* Delicate Technical Grid Mesh */}
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Asymmetric Editorial Hierarchy (Col 6) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface text-xs font-semibold tracking-widest text-[#9D1738] dark:text-[#E899AA] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9D1738] dark:bg-[#E899AA] animate-pulse" aria-hidden="true" />
              <span>Industrial Resource Intelligence</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#15161A] dark:text-[#F8FAFC] text-balance leading-[1.1]">
              Turn Industrial Byproducts Into Valuable Resources.
            </h1>
            <p className="font-serif italic text-sm sm:text-base text-[#9D1738] dark:text-[#E899AA]">
              What one industry discards, another could put to use.
            </p>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#61646E] dark:text-[#94A3B8] leading-relaxed max-w-xl">
              Evaluate potential industrial resource exchanges through material compatibility, technical evidence, delivered cost, and environmental impact.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('explore')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold bg-[#9D1738] hover:bg-[#BE185D] text-[#F8FAFC] shadow-[0_0_20px_rgba(157,23,56,0.35)] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#9D1738]"
              >
                <span>Explore the Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenAccess('start')}
                className="px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold glass-surface text-[#15161A] dark:text-[#F8FAFC] hover:bg-black/5 dark:hover:bg-white/10 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738]"
              >
                Sign In / Get Started
              </button>
            </div>

            {/* Evidence Assurance Markers */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-black/5 dark:border-white/5 text-[11px] text-[#8E919B]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#9D1738]" />
                <span>Zero False Matches</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#C9AA79]" />
                <span>True Delivered Freight</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#91AAB8]" />
                <span>Traceable Evidence</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Immersive Liquid-Glass Evaluation Sequence Visual (Col 6) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="glass-surface-elevated rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-2xl transition-all">
              {/* Subtle top edge burgundy sheen */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#9D1738] to-transparent opacity-90" />

              <div className="flex items-center justify-between pb-4 mb-5 border-b border-black/8 dark:border-white/10">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#9D1738] dark:text-[#E899AA] uppercase block">
                    Dynamic Pathway Validation
                  </span>
                  <h2 className="font-serif text-lg sm:text-xl font-semibold text-[#15161A] dark:text-[#F8FAFC]">
                    Resource Evaluation Conduits
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-[#8E919B]">
                  Stage {activeStep.number} / 04
                </span>
              </div>

              {/* 4 Connected Liquid-Glass Nodes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 relative">
                {FLOW_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = activeStepIndex === idx;

                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveStepIndex(idx)}
                      className={`p-3 rounded-2xl text-left transition-all duration-300 relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738] ${
                        isActive
                          ? 'glass-surface-floating border-[#9D1738] dark:border-[#9D1738] ring-1 ring-[#9D1738]/50 shadow-[0_0_20px_rgba(157,23,56,0.25)]'
                          : 'glass-surface hover:border-[#9D1738]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`font-mono text-xs font-bold ${
                            isActive ? 'text-[#9D1738] dark:text-[#E899AA]' : 'text-[#8E919B]'
                          }`}
                        >
                          {step.number}
                        </span>
                        <Icon
                          className={`w-3.5 h-3.5 ${
                            isActive ? 'text-[#9D1738] dark:text-[#E899AA]' : 'text-[#8E919B]'
                          }`}
                        />
                      </div>
                      <h3 className="font-sans font-semibold text-xs text-[#15161A] dark:text-[#F8FAFC] leading-tight mb-0.5 break-words">
                        {step.title}
                      </h3>
                      <p className="text-[10px] text-[#94A3B8] leading-snug break-words">
                        {step.subtitle}
                      </p>

                      {/* Small Active Point */}
                      {isActive && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#9D1738]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Interactive Glass Inspection Card */}
              <div className="p-4 sm:p-5 rounded-2xl glass-surface space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-3">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#9D1738] dark:text-[#E899AA] block">
                      Active Node Specification
                    </span>
                    <h4 className="font-serif text-base sm:text-lg font-semibold text-[#15161A] dark:text-[#F8FAFC]">
                      {activeStep.details.headline}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-[#9D1738]/10 text-[#9D1738] dark:text-[#E899AA] border border-[#9D1738]/20 shrink-0">
                    {activeStep.details.technicalMetric}
                  </span>
                </div>

                <p className="text-xs text-[#61646E] dark:text-[#94A3B8] leading-relaxed">
                  {activeStep.details.description}
                </p>

                {/* Live Criteria Breakdown */}
                <div className="space-y-1.5 pt-1">
                  {activeStep.details.sampleData.map((item, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 text-xs"
                    >
                      <span className="text-[#94A3B8] leading-snug break-words">{item.label}</span>
                      <div className="flex items-start gap-1.5 min-w-0 sm:shrink-0">
                        <span className="font-mono font-medium text-[#15161A] dark:text-[#F8FAFC] text-[11px] leading-snug break-words min-w-0">
                          {item.value}
                        </span>
                        {item.status === 'verified' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                        {item.status === 'warning' && (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        )}
                        {item.status === 'pending' && (
                          <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
