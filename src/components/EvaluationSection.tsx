/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import {
  EVALUATION_DIMENSIONS,
  PRODUCT_CAPABILITIES,
} from '../data/mockData.ts';
import {
  CheckCircle2,
  ChevronRight,
  Shield,
  Layers,
  Scale,
  TrendingDown,
  Sparkles,
  ArrowRight,
  FileCheck,
  Activity,
  Cpu,
  Network,
  Radio,
  Sliders,
  Database,
  BarChart3,
} from 'lucide-react';

type TelemetryMode = 'chemistry' | 'logistics' | 'carbon' | 'evidence';

interface StreamPacket {
  label: string;
  value: string;
  benchmark: string;
  status: 'passed' | 'warning' | 'pending';
  variance: string;
}

const TELEMETRY_DATA: Record<TelemetryMode, { title: string; subtitle: string; packets: StreamPacket[]; conduitActive: string }> = {
  chemistry: {
    title: 'Multi-Parameter Chemical Tolerance Matrix',
    subtitle: 'Continuous spectral comparison against recipient kiln & binder constraints',
    conduitActive: 'XRF / XRD Mineralogical Assay Channel Active',
    packets: [
      { label: 'SiO2 Reactive Glass Phase', value: '89.4%', benchmark: '>= 85.0% spec', status: 'passed', variance: '+4.4% tolerance margin' },
      { label: 'Loss on Ignition (LOI)', value: '4.6%', benchmark: '<= 6.0% ceiling', status: 'passed', variance: '-1.4% safe delta' },
      { label: 'Cristobalite / Quartz Crystalline', value: 'Unverified', benchmark: '<= 1.0% limit', status: 'warning', variance: 'Mandatory XRD pending' },
      { label: 'Water-Soluble Chloride (Cl-)', value: '0.04%', benchmark: '<= 0.10% max', status: 'passed', variance: 'Corrosion-safe' },
    ],
  },
  logistics: {
    title: 'True Delivered Cost Waterfall Vector',
    subtitle: 'Point-to-point spatial routing, backhaul logistics & batch QA amortization',
    conduitActive: 'Geospatial Freight & Conditioning Engine Active',
    packets: [
      { label: 'Origin Gate Procurement', value: '$15.00 / t', benchmark: '$0–$25 baseline', status: 'passed', variance: 'Contracted gate rate' },
      { label: 'Haulage Freight Vector (85 km)', value: '$15.30 / t', benchmark: '$0.18 / t-km', status: 'passed', variance: 'Backhaul optimized' },
      { label: 'Micronizing & Silo Drying', value: '$14.20 / t', benchmark: 'Thermal conditioning', status: 'passed', variance: 'Rotary dryer electric' },
      { label: 'Delivered Net Economic Delta', value: '$48.00 / t', benchmark: '$90.00 / t clinker', status: 'passed', variance: '-$42.00 / t net margin' },
    ],
  },
  carbon: {
    title: 'ISO 14044 Lifecycle Carbon Accounting',
    subtitle: 'Scope 1, 2, and 3 accounting boundaries compared with virgin extraction',
    conduitActive: 'Boundary Carbon Invariant Prover Active',
    packets: [
      { label: 'Avoided Clinker Extraction', value: '-720 kg CO2e / t', benchmark: 'Displaced CEM I', status: 'passed', variance: 'Virgin kiln offset' },
      { label: 'Conditioning Energy Footprint', value: '+58 kg CO2e / t', benchmark: 'Thermal calciner', status: 'passed', variance: 'Grid factor: 0.38 kg/kWh' },
      { label: 'Freight Transport Footprint', value: '+7.0 kg CO2e / t', benchmark: '85 km heavy diesel', status: 'passed', variance: '0.082 kg CO2e / t-km' },
      { label: 'Net Lifecycle Carbon Abatement', value: '-655 kg CO2e / t', benchmark: 'Verified net credit', status: 'passed', variance: 'Break-even: 7,800 km' },
    ],
  },
  evidence: {
    title: 'Traceable Audit Trail & Uncertainty Registry',
    subtitle: 'Chain-of-custody documentation, ISO 17025 accredited proofs, and open gaps',
    conduitActive: 'Immutable Evidence Ledger Stream Active',
    packets: [
      { label: 'Batch Sampling Vintage', value: '14 Days Ago', benchmark: 'Monthly cadence', status: 'passed', variance: 'Chain-of-custody verified' },
      { label: 'Accredited Lab Assay (XRF)', value: 'ISO 17025 Certified', benchmark: 'Mandatory standard', status: 'passed', variance: 'Certificate #XRF-89211' },
      { label: 'Radioactivity Assay (Ra-226)', value: 'Pending Gamma Spec', benchmark: '<= 160 Bq/kg limit', status: 'warning', variance: 'Lab booking confirmed' },
      { label: 'Regulatory Non-Waste Ruling', value: 'EoW Article 6 Met', benchmark: 'End-of-Waste criteria', status: 'passed', variance: 'Statutory compliance' },
    ],
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export const EvaluationSection: React.FC = () => {
  const [activeDimensionId, setActiveDimensionId] = useState(EVALUATION_DIMENSIONS[0].id);
  const [selectedCapabilityId, setSelectedCapabilityId] = useState(PRODUCT_CAPABILITIES[0].id);
  const [telemetryMode, setTelemetryMode] = useState<TelemetryMode>('chemistry');

  const activeDimension =
    EVALUATION_DIMENSIONS.find((d) => d.id === activeDimensionId) || EVALUATION_DIMENSIONS[0];

  const selectedCapability =
    PRODUCT_CAPABILITIES.find((c) => c.id === selectedCapabilityId) || PRODUCT_CAPABILITIES[0];

  const currentTelemetry = TELEMETRY_DATA[telemetryMode];

  return (
    <section
      id="evaluation"
      aria-label="Evaluation section"
      className="relative min-h-screen py-28 md:py-36 border-t border-black/5 dark:border-white/5 transition-colors overflow-hidden"
    >
      {/* Background Volumetric Glows */}
      <div className="absolute top-1/4 left-1/10 w-[480px] h-[480px] bg-[#9D1738]/8 dark:bg-[#9D1738]/14 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-[420px] h-[420px] bg-[#C9AA79]/6 dark:bg-[#C9AA79]/10 blur-[110px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Staggered Fade */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface text-xs font-semibold tracking-widest text-[#9D1738] dark:text-[#E899AA] uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9D1738] dark:bg-[#E899AA]" aria-hidden="true" />
            <span>Four-Dimensional Verification Framework</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-5xl font-medium tracking-tight text-[#15161A] dark:text-[#F4F1EC] leading-tight mb-4">
            “From material data to informed decisions.”
          </h2>
          <p className="text-base sm:text-lg text-[#61646E] dark:text-[#A6A8B0] leading-relaxed">
            Every potential exchange must stand up to technical, economic, and environmental scrutiny.
          </p>
        </motion.div>

        {/* Four Distinctive Glass Modules with Framer Motion Staggered Reveal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-24">
          {/* Module Selector Rail (Col 5) with Framer Motion Stagger */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-5 space-y-3"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-[#8E919B] px-1 mb-2">
              Primary Verification Pillars
            </div>
            {EVALUATION_DIMENSIONS.map((dim) => {
              const isActive = activeDimensionId === dim.id;
              return (
                <motion.button
                  key={dim.id}
                  variants={cardVariants}
                  onClick={() => {
                    setActiveDimensionId(dim.id);
                    // Harmonize telemetry mode with selected dimension
                    if (dim.id === 'compatibility') setTelemetryMode('chemistry');
                    if (dim.id === 'cost') setTelemetryMode('logistics');
                    if (dim.id === 'environmental') setTelemetryMode('carbon');
                    if (dim.id === 'evidence') setTelemetryMode('evidence');
                  }}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all duration-300 relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738] ${
                    isActive
                      ? 'glass-surface-elevated border-[#9D1738] dark:border-[#9D1738] shadow-[0_0_25px_rgba(157,23,56,0.22)]'
                      : 'glass-surface hover:bg-black/5 dark:hover:bg-white/5 opacity-85 hover:opacity-100'
                  }`}
                >
                  {/* Active top line */}
                  {isActive && (
                    <motion.div
                      layoutId="active-dimension-pill"
                      className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#9D1738] to-transparent"
                    />
                  )}

                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-[#9D1738] dark:text-[#E899AA]">
                      DIMENSION {dim.number}
                    </span>
                    <span className="text-[11px] font-mono text-[#8E919B]">
                      0{dim.number}/04
                    </span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#15161A] dark:text-[#F4F1EC] mb-1">
                    {dim.title}
                  </h3>

                  <p className="text-xs text-[#61646E] dark:text-[#A6A8B0] line-clamp-2 leading-relaxed">
                    {dim.headline}
                  </p>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Active Glass Deep Dive Showcase (Col 7) with AnimatePresence */}
          <div className="lg:col-span-7 glass-surface-elevated rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-2xl">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#9D1738] to-transparent opacity-80" />

            {/* Background lab photo visible through frosted layers */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-15 dark:opacity-20 pointer-events-none rounded-tr-3xl overflow-hidden">
              <img
                src="/src/assets/images/material_lab_analysis_1792836301927.jpg"
                alt="Precision material laboratory instrumentation"
                className="w-full h-full object-cover filter blur-xs"
                referrerPolicy="no-referrer"
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeDimension.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 space-y-6"
              >
                <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#9D1738]/10 text-[#9D1738] dark:text-[#E899AA] border border-[#9D1738]/20">
                  Core Investigation #{activeDimension.number}
                </div>

                {/* Core Question Headline */}
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#15161A] dark:text-[#F4F1EC] leading-snug">
                  “{activeDimension.coreQuestion}”
                </h3>

                <p className="text-sm text-[#61646E] dark:text-[#A6A8B0] leading-relaxed">
                  {activeDimension.description}
                </p>

                {/* Governing Operational Principle */}
                <div className="p-4 sm:p-5 rounded-2xl glass-surface border-black/10 dark:border-white/10">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#9D1738] dark:text-[#E899AA] block mb-1 font-semibold">
                    Governing Principle
                  </span>
                  <p className="text-xs sm:text-sm italic font-serif text-[#15161A] dark:text-[#F4F1EC]">
                    “{activeDimension.operationalPrinciple}”
                  </p>
                </div>

                {/* Required Evidence Audit Trail */}
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#15161A] dark:text-[#F4F1EC] block mb-3">
                    Required Evidence Audit Trail
                  </span>
                  <ul className="space-y-2.5">
                    {activeDimension.evidenceChecklist.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-[#61646E] dark:text-[#A6A8B0]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#9D1738] dark:text-[#E899AA] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* NEW SIGNATURE VISUAL: Live Evaluation Network Data Visualizer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mb-28 glass-surface-elevated rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Top accent glow line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#9D1738] to-transparent opacity-90" />

          {/* Header of Network Visualizer */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-black/8 dark:border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#9D1738] dark:text-[#E899AA] uppercase tracking-wider mb-1">
                <Radio className="w-3.5 h-3.5 animate-pulse text-[#9D1738]" />
                <span>Live Resource Intelligence Data Stream</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#15161A] dark:text-[#F4F1EC]">
                Multi-Vector Evaluation Conduit
              </h3>
            </div>

            {/* Network Channel Mode Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-surface overflow-x-auto scrollbar-none">
              {(['chemistry', 'logistics', 'carbon', 'evidence'] as TelemetryMode[]).map((mode) => {
                const isSelected = telemetryMode === mode;
                const labels: Record<TelemetryMode, string> = {
                  chemistry: 'Chemistry Vector',
                  logistics: 'Logistics Vector',
                  carbon: 'Carbon Balance',
                  evidence: 'Audit Registry',
                };
                return (
                  <button
                    key={mode}
                    onClick={() => setTelemetryMode(mode)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738] ${
                      isSelected
                        ? 'bg-[#9D1738] text-[#F4F1EC] shadow-[0_0_12px_rgba(157,23,56,0.35)]'
                        : 'text-[#61646E] dark:text-[#A6A8B0] hover:text-[#15161A] dark:hover:text-[#F4F1EC]'
                    }`}
                  >
                    {labels[mode]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Network Conduit Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col (5): Visual Network Topology Diagram (SVG with Live Pulse Animation) */}
            <div className="lg:col-span-5 p-5 rounded-2xl glass-surface relative flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-full flex items-center justify-between text-[11px] font-mono text-[#8E919B] mb-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Pipeline Active</span>
                </span>
                <span className="text-[#9D1738] dark:text-[#E899AA]">{currentTelemetry.conduitActive}</span>
              </div>

              {/* Animated SVG Network Mesh */}
              <div className="relative w-full aspect-4/3 max-w-sm flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Background Network Conduits */}
                  <line x1="60" y1="60" x2="260" y2="60" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="60" y1="180" x2="260" y2="180" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="60" y1="60" x2="60" y2="180" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="260" y1="60" x2="260" y2="180" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="60" y1="60" x2="260" y2="180" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" />
                  <line x1="60" y1="180" x2="260" y2="60" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" />

                  {/* Dynamic Glowing Burgundy Connection Line */}
                  <motion.line
                    x1="60"
                    y1="60"
                    x2="160"
                    y2="120"
                    stroke="#9D1738"
                    strokeWidth="2.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.line
                    x1="160"
                    y1="120"
                    x2="260"
                    y2="180"
                    stroke="#9D1738"
                    strokeWidth="2.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5, ease: 'linear' }}
                  />

                  {/* Center Intelligence Hub */}
                  <circle cx="160" cy="120" r="32" fill="#15161A" stroke="#9D1738" strokeWidth="2" className="dark:fill-[#1E171E]" />
                  <circle cx="160" cy="120" r="42" stroke="#9D1738" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Corner Node 1: Chemical Assay */}
                  <g className="cursor-pointer" onClick={() => setTelemetryMode('chemistry')}>
                    <circle cx="60" cy="60" r="22" fill={telemetryMode === 'chemistry' ? '#9D1738' : '#221C22'} stroke="#9D1738" strokeWidth="1.5" />
                    <text x="60" y="64" textAnchor="middle" fill="#F4F1EC" fontSize="10" fontFamily="monospace" fontWeight="bold">XRF</text>
                  </g>

                  {/* Corner Node 2: Delivered Haulage */}
                  <g className="cursor-pointer" onClick={() => setTelemetryMode('logistics')}>
                    <circle cx="260" cy="60" r="22" fill={telemetryMode === 'logistics' ? '#9D1738' : '#221C22'} stroke="#C9AA79" strokeWidth="1.5" />
                    <text x="260" y="64" textAnchor="middle" fill="#F4F1EC" fontSize="10" fontFamily="monospace" fontWeight="bold">USD</text>
                  </g>

                  {/* Corner Node 3: Carbon LCA */}
                  <g className="cursor-pointer" onClick={() => setTelemetryMode('carbon')}>
                    <circle cx="60" cy="180" r="22" fill={telemetryMode === 'carbon' ? '#9D1738' : '#221C22'} stroke="#10B981" strokeWidth="1.5" />
                    <text x="60" y="184" textAnchor="middle" fill="#F4F1EC" fontSize="10" fontFamily="monospace" fontWeight="bold">CO2</text>
                  </g>

                  {/* Corner Node 4: Proof Ledger */}
                  <g className="cursor-pointer" onClick={() => setTelemetryMode('evidence')}>
                    <circle cx="260" cy="180" r="22" fill={telemetryMode === 'evidence' ? '#9D1738' : '#221C22'} stroke="#91AAB8" strokeWidth="1.5" />
                    <text x="260" y="184" textAnchor="middle" fill="#F4F1EC" fontSize="10" fontFamily="monospace" fontWeight="bold">ISO</text>
                  </g>

                  {/* Center Node Title */}
                  <text x="160" y="123" textAnchor="middle" fill="#F4F1EC" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                    GATE
                  </text>
                </svg>
              </div>

              <div className="text-[11px] text-[#8E919B] text-center mt-2">
                Click nodes to switch evaluation telemetry conduits
              </div>
            </div>

            {/* Right Col (7): Live Telemetry Data Feed Stream */}
            <div className="lg:col-span-7 space-y-4">
              <div className="border-b border-black/8 dark:border-white/10 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#9D1738] dark:text-[#E899AA] block font-semibold">
                  Channel Specification
                </span>
                <h4 className="font-serif text-xl sm:text-2xl font-semibold text-[#15161A] dark:text-[#F4F1EC]">
                  {currentTelemetry.title}
                </h4>
                <p className="text-xs text-[#61646E] dark:text-[#A6A8B0] mt-0.5">
                  {currentTelemetry.subtitle}
                </p>
              </div>

              {/* Data Packets Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={telemetryMode}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {currentTelemetry.packets.map((pkt, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl glass-surface flex flex-col justify-between space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#8E919B] truncate">{pkt.label}</span>
                        {pkt.status === 'passed' && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        )}
                        {pkt.status === 'warning' && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        )}
                        {pkt.status === 'pending' && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                        )}
                      </div>

                      <div>
                        <div className="font-mono text-base font-bold text-[#15161A] dark:text-[#F4F1EC]">
                          {pkt.value}
                        </div>
                        <div className="text-[11px] text-[#61646E] dark:text-[#A6A8B0]">
                          Baseline: <span className="font-mono">{pkt.benchmark}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-black/5 dark:border-white/5 text-[10px] font-mono text-[#9D1738] dark:text-[#E899AA] truncate">
                        {pkt.variance}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Ten Core Capabilities Section with Framer Motion Stagger */}
        <div className="border-t border-black/8 dark:border-white/10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
          >
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#9D1738] dark:text-[#E899AA] uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explainable Intelligence Architecture</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-4xl font-semibold text-[#15161A] dark:text-[#F4F1EC]">
                “Intelligence that explains its reasoning.”
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#8E919B] max-w-md">
              Ten auditable capabilities that reject black-box matching in favor of verified tolerance bounds, freight math, and lifecycle physics.
            </p>
          </motion.div>

          {/* Interactive Liquid-Glass Capability Selector & Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Capability Navigation Rail (Col 5) with Stagger */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-[480px] overflow-y-auto pr-1"
            >
              {PRODUCT_CAPABILITIES.map((cap) => {
                const isSelected = selectedCapabilityId === cap.id;
                return (
                  <motion.button
                    key={cap.id}
                    variants={cardVariants}
                    onClick={() => setSelectedCapabilityId(cap.id)}
                    className={`text-left p-3.5 rounded-xl transition-all text-xs flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738] ${
                      isSelected
                        ? 'glass-surface-elevated border-[#9D1738] text-[#15161A] dark:text-[#F4F1EC] font-semibold shadow-md'
                        : 'glass-surface text-[#61646E] dark:text-[#A6A8B0] hover:text-[#15161A] dark:hover:text-[#F4F1EC]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="font-mono text-[11px] font-bold text-[#9D1738] dark:text-[#E899AA]">
                        {cap.number}.
                      </span>
                      <span className="truncate">{cap.title}</span>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                        isSelected ? 'text-[#9D1738] dark:text-[#E899AA] translate-x-1' : 'opacity-30'
                      }`}
                    />
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Selected Capability Glass Explanatory Panel (Col 7) with AnimatePresence */}
            <div className="lg:col-span-7 glass-surface-elevated rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCapability.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-center justify-between border-b border-black/8 dark:border-white/10 pb-3.5 mb-5">
                    <span className="font-mono text-xs font-semibold text-[#9D1738] dark:text-[#E899AA]">
                      CAPABILITY {selectedCapability.number} / 10
                    </span>
                    <span className="text-[11px] font-mono text-[#8E919B]">
                      Algorithmic Guarantee
                    </span>
                  </div>

                  <h4 className="font-serif text-2xl font-semibold text-[#15161A] dark:text-[#F4F1EC] mb-1.5">
                    {selectedCapability.title}
                  </h4>
                  <p className="text-xs sm:text-sm font-medium text-[#9D1738] dark:text-[#E899AA] mb-6">
                    {selectedCapability.tagline}
                  </p>

                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="p-4 rounded-xl glass-surface">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E919B] block mb-1 font-semibold">
                        Trigger Condition
                      </span>
                      <p className="text-[#15161A] dark:text-[#F4F1EC] leading-relaxed">
                        {selectedCapability.triggerCondition}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl glass-surface">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E919B] block mb-1 font-semibold">
                        Algorithmic Mechanism
                      </span>
                      <p className="text-[#61646E] dark:text-[#A6A8B0] leading-relaxed">
                        {selectedCapability.algorithmicMechanism}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 pt-4 border-t border-black/8 dark:border-white/10 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-[#8E919B]">
                  Auditable Deliverable:
                </span>
                <span className="font-semibold text-[#15161A] dark:text-[#F4F1EC] text-right max-w-sm truncate">
                  {selectedCapability.traceableOutput}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
