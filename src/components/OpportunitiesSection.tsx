/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  SAMPLE_CONNECTIONS,
  STATE_DEFINITIONS,
} from '../data/mockData.ts';
import {
  IndustrialSector,
  ConnectionState,
  MaterialConnection,
} from '../types/index.ts';
import {
  Info,
  ArrowRight,
  MapPin,
  X,
  Network,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  Building2,
  Sparkles,
} from 'lucide-react';

const SECTORS: ('All' | IndustrialSector)[] = [
  'All',
  'Manufacturing',
  'Construction',
  'Mining & Metals',
  'Agriculture & Food',
  'Chemicals',
  'Energy',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
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

export const OpportunitiesSection: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<'All' | IndustrialSector>('All');
  const [selectedState, setSelectedState] = useState<'All' | ConnectionState>('All');
  const [activeConnection, setActiveConnection] = useState<MaterialConnection | null>(null);

  const filteredConnections = SAMPLE_CONNECTIONS.filter((conn) => {
    const sectorMatch =
      selectedSector === 'All' ||
      conn.sourceSector === selectedSector ||
      conn.targetSector === selectedSector;
    const stateMatch = selectedState === 'All' || conn.connectionState === selectedState;
    return sectorMatch && stateMatch;
  });

  return (
    <section
      id="opportunities"
      aria-label="Opportunities section"
      className="relative min-h-screen py-28 md:py-36 border-t border-black/5 dark:border-white/5 transition-colors overflow-hidden scroll-mt-24 md:scroll-mt-32"
    >
      {/* Background Volumetric Blooms */}
      <div className="absolute top-1/4 right-1/10 w-[500px] h-[500px] bg-[#9D1738]/8 dark:bg-[#9D1738]/12 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/10 w-[420px] h-[420px] bg-[#C9AA79]/6 dark:bg-[#C9AA79]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface text-xs font-semibold tracking-widest text-[#9D1738] dark:text-[#E899AA] uppercase mb-3">
            <Network className="w-3.5 h-3.5" />
            <span>Cross-Industry Resource Intelligence</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-5xl font-medium tracking-tight text-[#15161A] dark:text-[#F8FAFC] leading-tight mb-4">
            “Resources can connect industries. Evidence determines what proceeds.”
          </h2>
          <p className="text-base sm:text-lg text-[#61646E] dark:text-[#94A3B8] leading-relaxed">
            Byproducts and secondary minerals create viable industrial symbiosis pathways only when physical assays, transportation economics, and regulatory bounds align.
          </p>
        </motion.div>

        {/* Evidence-Aware Connection State Banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 p-5 rounded-3xl glass-surface-elevated relative overflow-hidden shadow-lg"
        >
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-[#9D1738] dark:text-[#E899AA]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#15161A] dark:text-[#F8FAFC]">
              Five Evidence-Aware Connection States
            </span>
          </div>
          <p className="text-xs text-[#61646E] dark:text-[#94A3B8] mb-4 max-w-2xl">
            Candidate resource exchanges are classified by validation status. Missing laboratory data or hard constraint violations are explicitly surfaced.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
            {Object.entries(STATE_DEFINITIONS).map(([key, def]) => (
              <div
                key={key}
                className="flex items-start gap-2.5 p-3 rounded-xl glass-surface"
              >
                <span className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-[#9D1738] dark:bg-[#E899AA]" aria-hidden="true" />
                <div>
                  <span className="font-semibold text-[#15161A] dark:text-[#F8FAFC] block text-xs">
                    {def.label}
                  </span>
                  <span className="text-[11px] text-[#8E919B]">
                    {def.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sector Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-1.5 pb-2 sm:pb-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8E919B] mr-1 shrink-0">
              Sector:
            </span>
            {SECTORS.map((sector) => {
              const isSelected = selectedSector === sector;
              return (
                <button
                  key={sector}
                  onClick={() => setSelectedSector(sector)}
                  className={`min-h-11 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738] ${
                    isSelected
                      ? 'bg-[#9D1738] text-[#F8FAFC] shadow-[0_0_15px_rgba(157,23,56,0.35)]'
                      : 'glass-surface text-[#61646E] dark:text-[#94A3B8] hover:text-[#15161A] dark:hover:text-[#F8FAFC]'
                  }`}
                >
                  {sector}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8E919B] whitespace-nowrap">
              Showing {filteredConnections.length} evaluated pathways
            </span>
          </div>
        </div>

        {/* Liquid-Glass Connections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredConnections.map((conn) => {
            const stateDef = STATE_DEFINITIONS[conn.connectionState];

            return (
              <div
                key={conn.id}
                onClick={() => setActiveConnection(conn)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveConnection(conn);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Inspect connection: ${conn.sourceMaterial} to ${conn.targetApplication}`}
                className="group text-left glass-surface-elevated rounded-3xl p-6 transition-all duration-300 hover:border-[#9D1738]/50 hover:shadow-2xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738] flex flex-col justify-between relative overflow-hidden"
              >
                {/* Subtle top red glow line on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#9D1738] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Status Badge */}
                  <div className="mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold border ${stateDef.badge}`}
                    >
                      {stateDef.label}
                    </span>
                  </div>

                  {/* Material Flow Pathway */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="text-[11px] text-[#8E919B]">
                        Source: {conn.sourceSector}
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-[#15161A] dark:text-[#F8FAFC] leading-snug">
                        {conn.sourceMaterial}
                      </h3>
                      <p className="text-[11px] text-[#8E919B]">
                        {conn.sourceFacilityType}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 py-1 text-[#9D1738] dark:text-[#E899AA]">
                      <div className="h-px bg-black/8 dark:bg-white/10 flex-1" />
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      <div className="h-px bg-black/8 dark:bg-white/10 flex-1" />
                    </div>

                    <div>
                      <div className="text-[11px] text-[#8E919B]">
                        Target Recipient: {conn.targetSector}
                      </div>
                      <h4 className="font-sans text-sm font-semibold text-[#15161A] dark:text-[#F8FAFC]">
                        {conn.targetApplication}
                      </h4>
                      <p className="text-[11px] text-[#8E919B]">
                        {conn.receivingPlantType}
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-[#61646E] dark:text-[#94A3B8] leading-relaxed mb-4">
                    {conn.compatibilitySummary}
                  </p>
                </div>

                {/* Card Footer: Haulage & Cost */}
                <div className="border-t border-black/8 dark:border-white/10 pt-3.5 text-xs">
                  <div className="flex items-center justify-between text-[#8E919B] mb-1.5">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <MapPin className="w-3 h-3 text-[#9D1738]" />
                      <span>{conn.distanceKm} km freight</span>
                    </span>
                    <span className="font-mono font-bold text-[#15161A] dark:text-[#F8FAFC]">
                      ${conn.estDeliveredCostPerTon}/t delivered
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-mono text-[#9D1738] dark:text-[#E899AA] group-hover:underline flex items-center gap-1">
                      <span>Inspect laboratory dossier</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cinematic Eco-Cluster Graphic Strip */}
        <div className="relative rounded-3xl overflow-hidden glass-surface-elevated p-8 sm:p-12 shadow-2xl">
          <div className="absolute inset-0 -z-10 opacity-25 dark:opacity-30">
            <img
              src="/src/assets/images/industrial_cluster_landscape_1792836301667.jpg"
              alt="Aerial twilight view of interconnected industrial eco-park"
              className="w-full h-full object-cover filter blur-[1px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/90 to-transparent dark:from-[#101114] dark:via-[#101114]/90 dark:to-transparent" />
          </div>

          <div className="max-w-xl relative z-10">
            <span className="text-xs font-mono uppercase tracking-widest text-[#9D1738] dark:text-[#E899AA] block mb-2 font-semibold">
              Regional Ecosystem Synergy
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#15161A] dark:text-[#F8FAFC] mb-3 leading-tight">
              Physical co-location reduces the delivered cost penalty.
            </h3>
            <p className="text-xs sm:text-sm text-[#61646E] dark:text-[#94A3B8] leading-relaxed mb-6">
              Haulage emissions and transportation rates often determine whether an environmentally beneficial exchange is economically viable. IndusLink calculates the precise break-even radius for every material pair.
            </p>
            <div className="inline-flex items-center gap-3 text-xs font-mono font-semibold text-[#9D1738] dark:text-[#E899AA]">
              <span>ISO 14044 Lifecycle Boundaries</span>
              <span aria-hidden="true">·</span>
              <span>Point-to-Point Logistics Modeling</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Technical Connection Modal */}
      {activeConnection && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-conn-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="glass-surface-floating rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-left">
            <button
              onClick={() => setActiveConnection(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#61646E] dark:text-[#94A3B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738]"
              aria-label="Close dossier"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="mb-5 pr-8">
              <span
                className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold border mb-2.5 ${
                  STATE_DEFINITIONS[activeConnection.connectionState].badge
                }`}
              >
                {STATE_DEFINITIONS[activeConnection.connectionState].label}
              </span>
              <h3
                id="modal-conn-title"
                className="font-serif text-2xl font-semibold text-[#15161A] dark:text-[#F8FAFC]"
              >
                {activeConnection.sourceMaterial} → {activeConnection.targetApplication}
              </h3>
              <p className="text-xs text-[#8E919B]">
                {activeConnection.sourceSector} ({activeConnection.sourceFacilityType}) to {activeConnection.targetSector} ({activeConnection.receivingPlantType})
              </p>
            </div>

            {/* Critical Gap Banner */}
            <div className="p-4 rounded-2xl border border-amber-600/40 bg-amber-500/10 text-amber-950 dark:text-amber-200 text-xs mb-6">
              <span className="font-semibold block mb-0.5">Critical Verification Barrier:</span>
              <span>{activeConnection.criticalGap}</span>
            </div>

            {/* Engineering Property Tolerance Checklist */}
            <div className="mb-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#15161A] dark:text-[#F8FAFC] mb-3">
                Engineering Specification Tolerance Check
              </div>
              <div className="space-y-2.5">
                {activeConnection.propertyChecks.map((check, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl glass-surface text-xs"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-medium text-[#15161A] dark:text-[#F8FAFC]">
                        {check.name}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {check.status === 'passed' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                            PASSED
                          </span>
                        )}
                        {check.status === 'lab_needed' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                            LAB ASSAY REQUIRED
                          </span>
                        )}
                        {check.status === 'failed' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30">
                            SPEC FAILED
                          </span>
                        )}
                        {check.status === 'unknown' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                            DATA MISSING
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-[#8E919B] mb-1">
                      <div>Required: <span className="font-mono text-[#15161A] dark:text-[#F8FAFC]">{check.requiredRange}</span></div>
                      <div>Documented: <span className="font-mono text-[#15161A] dark:text-[#F8FAFC]">{check.documentedValue ?? 'None'}</span></div>
                    </div>
                    <p className="text-[11px] text-[#61646E] dark:text-[#94A3B8] italic">
                      {check.comment} {check.testStandard && `(${check.testStandard})`}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Economics & Emissions Waterfall */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
              <div className="p-4 rounded-2xl glass-surface">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E919B] block mb-1 font-semibold">
                  Delivered Economics
                </span>
                <div className="text-xl font-mono font-bold text-[#15161A] dark:text-[#F8FAFC] mb-1">
                  ${activeConnection.estDeliveredCostPerTon} / ton delivered
                </div>
                <p className="text-[11px] text-[#61646E] dark:text-[#94A3B8]">
                  {activeConnection.economicNotes}
                </p>
              </div>

              <div className="p-4 rounded-2xl glass-surface">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E919B] block mb-1 font-semibold">
                  Net Lifecycle Emissions
                </span>
                <div className="text-xl font-mono font-bold text-[#15161A] dark:text-[#F8FAFC] mb-1">
                  {activeConnection.netEmissionsKgCO2ePerTon} kg CO2e / ton
                </div>
                <p className="text-[11px] text-[#61646E] dark:text-[#94A3B8]">
                  {activeConnection.environmentalBaseline}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveConnection(null)}
                className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[#9D1738] hover:bg-[#BE185D] text-[#F8FAFC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738]"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
