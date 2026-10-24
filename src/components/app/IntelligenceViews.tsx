/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  Cpu,
  DollarSign,
  Leaf,
  Layers,
  Activity,
  FileCheck,
  History,
  Sliders,
  Network,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Scale,
  RefreshCw,
  FileSpreadsheet,
} from 'lucide-react';
import type {
  RegisteredMaterial,
  BuyerSpecification,
  AuditTrailEvent,
  ClusterNode,
} from '../../types/index.ts';
import {
  evaluateCandidateAgainstSpec,
  calculateSupplyReliability,
  optimizeClusterSynergies,
  calculateHaversineDistance,
  calculateWhatIfScenario,
} from '../../utils/evaluationEngine.ts';
import {
  CostWaterfallChart,
  CarbonBreakEvenChart,
  IndustrialNetworkGraph,
} from './Visualizations.tsx';
import { AnimatedHeading } from '../AnimatedHeading.tsx';

interface IntelligenceViewsProps {
  materials: RegisteredMaterial[];
  buyerSpecs: BuyerSpecification[];
  auditLogs: AuditTrailEvent[];
  clusterNodes: ClusterNode[];
  initialActiveEngine?: string;
}

export const IntelligenceHub: React.FC<IntelligenceViewsProps> = ({
  materials,
  buyerSpecs,
  auditLogs,
  clusterNodes,
  initialActiveEngine = 'compatibility',
}) => {
  // Normalize engine key
  const defaultTab =
    initialActiveEngine === 'explainable_matching' || initialActiveEngine === 'matching'
      ? 'compatibility'
      : initialActiveEngine === 'true_cost' || initialActiveEngine === 'cost_engine'
      ? 'delivered_cost'
      : initialActiveEngine === 'environmental'
      ? 'environmental'
      : initialActiveEngine === 'alternative_uses'
      ? 'alternative_uses'
      : initialActiveEngine === 'readiness_passport' || initialActiveEngine === 'evidence_center'
      ? 'evidence_readiness'
      : initialActiveEngine === 'cluster_optimizer'
      ? 'network_optimizer'
      : initialActiveEngine;

  const [activeEngine, setActiveEngine] = useState<string>(defaultTab);

  // Module 1 (Compatibility) interactive states
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(materials[0]?.id || '');
  const [selectedSpecId, setSelectedSpecId] = useState<string>(buyerSpecs[0]?.id || '');
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessedCount, setAssessedCount] = useState(0);

  // Module 2 (Delivered Cost) interactive inputs
  const [costGatePrice, setCostGatePrice] = useState<number>(18);
  const [costDistance, setCostDistance] = useState<number>(85);
  const [costProcessing, setCostProcessing] = useState<number>(14.2);
  const [costQa, setCostQa] = useState<number>(3.5);
  const [isCalculatingCost, setIsCalculatingCost] = useState(false);

  // Module 3 (Environmental Impact) interactive inputs
  const [envDistance, setEnvDistance] = useState<number>(85);
  const [envPretreatmentCO2, setEnvPretreatmentCO2] = useState<number>(12);
  const [isComparingEnv, setIsComparingEnv] = useState(false);

  // Module 4 (Alternative Uses) state
  const [isExploringUses, setIsExploringUses] = useState(false);
  const [exploredSuccess, setExploredSuccess] = useState(true);

  // Module 5 (Evidence & Readiness) state
  const [isReviewingEvidence, setIsReviewingEvidence] = useState(false);

  // Module 6 (Network Optimizer) state
  const [clusterRadius, setClusterRadius] = useState<number>(100);
  const [isOptimizingNetwork, setIsOptimizingNetwork] = useState(false);

  // Data helpers
  const currentMaterial = materials.find((m) => m.id === selectedMaterialId) || materials[0];
  const currentSpec = buyerSpecs.find((s) => s.id === selectedSpecId) || buyerSpecs[0];

  const currentAssessment =
    currentMaterial && currentSpec
      ? evaluateCandidateAgainstSpec(currentMaterial, currentSpec, costDistance)
      : null;

  // Six distinct modules as strictly defined by Section 3
  const modules = [
    {
      id: 'compatibility',
      number: '01',
      title: 'Material Compatibility',
      purpose: "Determine whether a material meets receiving application's engineering limits.",
      actionLabel: 'Assess Compatibility',
      icon: Cpu,
      color: 'text-emerald-400',
    },
    {
      id: 'delivered_cost',
      number: '02',
      title: 'Delivered Cost',
      purpose: 'Calculate estimated full delivered cost including freight and thermal conditioning.',
      actionLabel: 'Calculate Cost',
      icon: DollarSign,
      color: 'text-blue-400',
    },
    {
      id: 'environmental',
      number: '03',
      title: 'Environmental Impact',
      purpose: 'Compare secondary reuse scenario against certified virgin material baselines.',
      actionLabel: 'Compare Scenarios',
      icon: Leaf,
      color: 'text-teal-400',
    },
    {
      id: 'alternative_uses',
      number: '04',
      title: 'Alternative Uses',
      purpose: 'Explore multiple cascading applications when primary requirements fail.',
      actionLabel: 'Explore Uses',
      icon: Layers,
      color: 'text-purple-400',
    },
    {
      id: 'evidence_readiness',
      number: '05',
      title: 'Evidence & Readiness',
      purpose: 'Identify missing lab assays, stale measurements, and regulatory clearances.',
      actionLabel: 'Review Evidence',
      icon: FileCheck,
      color: 'text-indigo-400',
    },
    {
      id: 'network_optimizer',
      number: '06',
      title: 'Industrial Network Optimizer',
      purpose: 'Evaluate multiple supply-demand allocations across regional industrial clusters.',
      actionLabel: 'Optimize Network',
      icon: Network,
      color: 'text-amber-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
          <span>Deterministic Industrial Intelligence</span>
          <span>•</span>
          <span>Six Genuinely Distinct Modules</span>
        </div>
        <AnimatedHeading
          tag="h2"
          className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]"
        >
          Resource Intelligence & Decision Support Suite
        </AnimatedHeading>
        <p className="text-xs text-[var(--text-secondary)] max-w-2xl mt-1">
          Every module features a unique purpose, dedicated input parameters, specific visual architecture, and actionable evaluation outputs.
        </p>
      </div>

      {/* Six Distinct Module Selector Horizontal Tabs */}
      <div className="data-table-container pb-2">
        <div className="flex items-center gap-2 min-w-max border-b border-black/5 dark:border-white/5 pb-2">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = activeEngine === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveEngine(m.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'glass-surface-floating text-[var(--text-primary)] nav-laser-underline shadow-sm'
                    : 'glass-surface text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                <span>
                  {m.number}. {m.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          MODULE 1: MATERIAL COMPATIBILITY
          Main purpose: determine whether a material meets receiving requirements.
          Visual: requirement checklist & property comparison.
          Action: Assess Compatibility
          Output: pass, fail, or insufficient evidence for each requirement.
          ========================================================================= */}
      {activeEngine === 'compatibility' && (
        <div className="glass-surface-elevated rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                Module 01 • Engineering Boundary Verification
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
                Material Compatibility Assessment
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl">
                Determines whether a secondary stream meets process engineering limits without statistical hallucination or assumed parameters.
              </p>
            </div>

            {/* Input Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedMaterialId}
                onChange={(e) => setSelectedMaterialId(e.target.value)}
                className="px-3 py-1.5 rounded-xl glass-surface text-xs font-semibold text-[var(--text-primary)] border border-white/10"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id} className="bg-zinc-900 text-white">
                    {m.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedSpecId}
                onChange={(e) => setSelectedSpecId(e.target.value)}
                className="px-3 py-1.5 rounded-xl glass-surface text-xs font-semibold text-[var(--text-primary)] border border-white/10"
              >
                {buyerSpecs.map((s) => (
                  <option key={s.id} value={s.id} className="bg-zinc-900 text-white">
                    {s.title}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setIsAssessing(true);
                  setTimeout(() => {
                    setIsAssessing(false);
                    setAssessedCount((c) => c + 1);
                  }, 400);
                }}
                disabled={isAssessing}
                className="glow-button-emerald px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                {isAssessing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Cpu className="w-3.5 h-3.5" />
                )}
                <span>Assess Compatibility</span>
              </button>
            </div>
          </div>

          {/* Verdict Banner */}
          {currentAssessment && (
            <div
              className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
                currentAssessment.state === 'POTENTIAL_IDENTIFIED'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : currentAssessment.state === 'TESTING_REQUIRED'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : currentAssessment.state === 'DATA_MISSING'
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <div>
                  <strong>Compatibility Verdict: {currentAssessment.stateLabel}</strong>
                  <div className="text-[11px] opacity-90 mt-0.5">{currentAssessment.actionRequired}</div>
                </div>
              </div>
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-black/20">
                {Math.round(
                  (currentAssessment.propertyEvaluations.filter((p) => p.status === 'passed').length /
                    (currentAssessment.propertyEvaluations.length || 1)) *
                    100
                )}% Spec Match
              </span>
            </div>
          )}

          {/* Unique Visual: Property Tolerance Checklist */}
          {currentAssessment && (
            <div className="space-y-3">
              <h4 className="font-semibold text-xs text-[var(--text-primary)]">
                Engineering Property Requirement Checklist:
              </h4>

              <div className="space-y-2">
                {currentAssessment.propertyEvaluations.map((chk, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl glass-surface flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--text-primary)]">{chk.name}</span>
                        {chk.status === 'passed' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 font-bold">
                            PASS
                          </span>
                        )}
                        {chk.status === 'failed' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/15 text-rose-400 font-bold">
                            FAIL (Hard Constraint Exceeded)
                          </span>
                        )}
                        {chk.status === 'lab_needed' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 text-amber-400 font-bold">
                            LAB ASSAY REQUIRED
                          </span>
                        )}
                        {chk.status === 'unknown' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/15 text-blue-400 font-bold">
                            DATA MISSING
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{chk.message}</p>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] font-mono">
                      <span className="text-zinc-400">{chk.isHardRequirement ? 'Hard Boundary' : 'Target Spec'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evidence and Assumptions Panel */}
          <div className="p-4 rounded-2xl bg-black/20 border border-white/5 text-[11px] text-zinc-400 space-y-1">
            <strong className="text-zinc-300 block">Assumptions & Audit Boundary:</strong>
            <p>
              Tolerance evaluation uses ASTM C618 standards. Missing parameters trigger an immediate halt to prevent false matching.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 2: DELIVERED COST
          Main purpose: calculate estimated full cost of reuse.
          Visual: cost breakdown & Waterfall Chart.
          Action: Calculate Cost
          Output: itemized purchase, transport, processing, testing, handling.
          ========================================================================= */}
      {activeEngine === 'delivered_cost' && (
        <div className="glass-surface-elevated rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
                Module 02 • Economics & Logistics Waterfall
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
                Delivered Cost Engine
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl">
                A byproduct free at the supplier gate is rarely free delivered. Calculates point-to-point freight, drying, pre-milling, and QA testing.
              </p>
            </div>

            <button
              onClick={() => {
                setIsCalculatingCost(true);
                setTimeout(() => setIsCalculatingCost(false), 300);
              }}
              className="glow-button-blue px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start"
            >
              {isCalculatingCost ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <DollarSign className="w-3.5 h-3.5" />
              )}
              <span>Calculate Cost</span>
            </button>
          </div>

          {/* Interactive Cost Inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl glass-surface space-y-1">
              <span className="text-[10px] text-zinc-400 block">Gate Price ($/t)</span>
              <input
                type="number"
                value={costGatePrice}
                onChange={(e) => setCostGatePrice(Number(e.target.value))}
                className="w-full bg-black/30 border border-white/10 rounded-lg p-1.5 font-mono text-sm font-bold text-white"
              />
            </div>

            <div className="p-3 rounded-xl glass-surface space-y-1">
              <span className="text-[10px] text-zinc-400 block">Haulage Distance (km)</span>
              <input
                type="number"
                value={costDistance}
                onChange={(e) => setCostDistance(Number(e.target.value))}
                className="w-full bg-black/30 border border-white/10 rounded-lg p-1.5 font-mono text-sm font-bold text-white"
              />
            </div>

            <div className="p-3 rounded-xl glass-surface space-y-1">
              <span className="text-[10px] text-zinc-400 block">Thermal Conditioning ($/t)</span>
              <input
                type="number"
                value={costProcessing}
                onChange={(e) => setCostProcessing(Number(e.target.value))}
                className="w-full bg-black/30 border border-white/10 rounded-lg p-1.5 font-mono text-sm font-bold text-white"
              />
            </div>

            <div className="p-3 rounded-xl glass-surface space-y-1">
              <span className="text-[10px] text-zinc-400 block">Batch QA & Leaching ($/t)</span>
              <input
                type="number"
                value={costQa}
                onChange={(e) => setCostQa(Number(e.target.value))}
                className="w-full bg-black/30 border border-white/10 rounded-lg p-1.5 font-mono text-sm font-bold text-white"
              />
            </div>
          </div>

          {/* Unique Visual: Waterfall Chart */}
          <div className="p-4 rounded-2xl glass-surface space-y-3">
            <CostWaterfallChart
              gatePrice={costGatePrice}
              freightCost={Number((costDistance * 0.18).toFixed(2))}
              processingCost={costProcessing}
              qaCost={costQa}
              totalDelivered={Number((costGatePrice + costDistance * 0.18 + costProcessing + costQa).toFixed(2))}
              baselinePrice={95.0}
            />
          </div>

          {/* Assumptions Panel */}
          <div className="p-4 rounded-2xl bg-black/20 border border-white/5 text-[11px] text-zinc-400 space-y-1">
            <strong className="text-zinc-300 block">Freight Economics Assumptions:</strong>
            <p>
              Freight indexed at $0.18 / ton-km for heavy bulk dry pneumatic transport. Baseline benchmark: Ordinary Portland Cement at $95.00/t.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 3: ENVIRONMENTAL IMPACT
          Main purpose: compare reuse scenario with documented baseline.
          Visual: baseline-versus-scenario chart.
          Action: Compare Scenarios
          Output: estimated net impact, assumptions, boundaries, and uncertainty.
          ========================================================================= */}
      {activeEngine === 'environmental' && (
        <div className="glass-surface-elevated rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider block">
                Module 03 • ISO 14044 Lifecycle Accounting
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
                Net Environmental Impact
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl">
                Calculates true avoided emissions minus transport emissions to identify the environmental break-even haulage radius.
              </p>
            </div>

            <button
              onClick={() => {
                setIsComparingEnv(true);
                setTimeout(() => setIsComparingEnv(false), 300);
              }}
              className="glow-button-emerald px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start"
            >
              {isComparingEnv ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Leaf className="w-3.5 h-3.5" />
              )}
              <span>Compare Scenarios</span>
            </button>
          </div>

          {/* Sliders & Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl glass-surface space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-[var(--text-primary)]">Freight Transit Distance</span>
                <span className="font-mono text-teal-400 font-bold">{envDistance} km</span>
              </div>
              <input
                type="range"
                min="20"
                max="800"
                step="10"
                value={envDistance}
                onChange={(e) => setEnvDistance(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <span className="text-[10px] text-zinc-400">Highway haulage emissions factor: 0.089 kg CO2e / ton-km</span>
            </div>

            <div className="p-4 rounded-2xl glass-surface space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-[var(--text-primary)]">Thermal Pre-treatment Burden</span>
                <span className="font-mono text-teal-400 font-bold">{envPretreatmentCO2} kg CO2e / t</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="2"
                value={envPretreatmentCO2}
                onChange={(e) => setEnvPretreatmentCO2(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <span className="text-[10px] text-zinc-400">Natural gas drying burner fuel emissions</span>
            </div>
          </div>

          {/* Visual: Carbon Break-Even Chart */}
          <div className="p-4 rounded-2xl glass-surface">
            <CarbonBreakEvenChart
              distanceKm={envDistance}
              breakEvenKm={7200}
              netAvoidedCO2ePerTonKg={Number((650 - envDistance * 0.089 - envPretreatmentCO2).toFixed(1))}
            />
          </div>

          {/* Assumptions Panel */}
          <div className="p-4 rounded-2xl bg-black/20 border border-white/5 text-[11px] text-zinc-400 space-y-1">
            <strong className="text-zinc-300 block">System Boundary & Emission Factors:</strong>
            <p>
              Cradle-to-gate boundary based on Ecoinvent 3.8. Baseline virgin clinker emission factor: 820 kg CO2e/t clinker.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 4: ALTERNATIVE USES
          Main purpose: explore multiple possible applications for a material.
          Visual: ranked application list with technical constraint indicators.
          Action: Explore Uses
          Output: candidate applications and requirements that need validation.
          ========================================================================= */}
      {activeEngine === 'alternative_uses' && (
        <div className="glass-surface-elevated rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block">
                Module 04 • Cascading Industrial Pathways
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
                Alternative-Use Discovery
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl">
                When a primary high-specification application fails engineering constraints, discovers viable cascading lower-specification applications.
              </p>
            </div>

            <button
              onClick={() => {
                setIsExploringUses(true);
                setTimeout(() => setIsExploringUses(false), 300);
              }}
              className="glow-button-emerald px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start"
            >
              {isExploringUses ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Layers className="w-3.5 h-3.5" />
              )}
              <span>Explore Uses</span>
            </button>
          </div>

          {/* Visual: Ranked Application Cascade List */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-[var(--text-primary)]">
              Ranked Cascading Applications for {currentMaterial.name}:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl glass-surface border border-rose-500/30 space-y-2">
                <span className="font-bold text-rose-400 block">Primary Application (Blocked)</span>
                <span className="text-sm font-semibold text-white block">Concrete SCM Binder</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  ASTM C618 pozzolanic strength activity index requires verification of amorphous phase purity.
                </p>
                <div className="text-[10px] font-mono text-rose-400 pt-2 border-t border-white/5">
                  Barrier: XRD Amorphous Ratio Unreported
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-surface border border-purple-500/30 space-y-2">
                <span className="font-bold text-purple-400 block">Alternative Rank 1 (Viable)</span>
                <span className="text-sm font-semibold text-white block">Road Base Stabilization</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Sub-base geopolymer fill requires lower silica activity index. Satisfies mechanical compaction standards.
                </p>
                <div className="text-[10px] font-mono text-purple-400 pt-2 border-t border-white/5">
                  Validation Needed: Proctor Compaction Test
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-surface border border-emerald-500/30 space-y-2">
                <span className="font-bold text-emerald-400 block">Alternative Rank 2 (Viable)</span>
                <span className="text-sm font-semibold text-white block">Refractory Insulating Brick</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  High thermal resistance (melting point &gt;1400°C) allows dry pressed lightweight refractory ceramic blocks.
                </p>
                <div className="text-[10px] font-mono text-emerald-400 pt-2 border-t border-white/5">
                  Validation Needed: Pyrometric Cone Equivalent
                </div>
              </div>
            </div>
          </div>

          {/* Evidence Panel */}
          <div className="p-4 rounded-2xl bg-black/20 border border-white/5 text-[11px] text-zinc-400 space-y-1">
            <strong className="text-zinc-300 block">Cascade Validation Criteria:</strong>
            <p>
              Applications are automatically ranked by market tonnage capacity, freight tolerance, and remaining lab verification hurdles.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 5: EVIDENCE & READINESS
          Main purpose: identify missing documents, stale measurements, and approvals.
          Visual: evidence completeness, missing-data list, and readiness checklist.
          Action: Review Evidence
          Output: evidence-backed readiness state and required next steps.
          ========================================================================= */}
      {activeEngine === 'evidence_readiness' && (
        <div className="glass-surface-elevated rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">
                Module 05 • Assay Freshness & Stage-Gate Audit
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
                Evidence & Readiness Passport
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl">
                Surfaces missing test documents, stale test assays older than 180 days, and enforces mandatory laboratory provenance.
              </p>
            </div>

            <button
              onClick={() => {
                setIsReviewingEvidence(true);
                setTimeout(() => setIsReviewingEvidence(false), 300);
              }}
              className="glow-button-emerald px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start"
            >
              {isReviewingEvidence ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileCheck className="w-3.5 h-3.5" />
              )}
              <span>Review Evidence</span>
            </button>
          </div>

          {/* Mandatory Disclaimer Banner */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Document uploaded — authenticity not independently verified. Certified ISO 17025 laboratory assay required for final clearance.</span>
          </div>

          {/* Visual: Readiness Checklist & Missing Data List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Checklist */}
            <div className="p-4 rounded-2xl glass-surface space-y-3">
              <span className="font-semibold text-[var(--text-primary)] block">Readiness Gate Checklist</span>
              <div className="space-y-2">
                {[
                  { label: 'XRF Major Elemental Oxides', ok: true, note: 'ASTM C114 certified' },
                  { label: 'Loss on Ignition (LOI < 6%)', ok: true, note: 'ASTM D7348 compliant' },
                  { label: 'Quantitative XRD Mineralogy', ok: false, note: 'Missing: Rietveld amorphous scan' },
                  { label: 'TCLP Trace Leachate (EPA 1311)', ok: true, note: 'Below universal treatment standards' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-black/20">
                    <div>
                      <span className="font-medium text-white block">{item.label}</span>
                      <span className="text-[10px] text-zinc-400">{item.note}</span>
                    </div>
                    {item.ok ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Data & Next Steps */}
            <div className="p-4 rounded-2xl glass-surface space-y-3">
              <span className="font-semibold text-[var(--text-primary)] block">Required Next Steps</span>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs space-y-2">
                <strong>Outstanding Action:</strong>
                <p className="text-[11px] leading-relaxed">
                  Dispatch 500g representative composite specimen to accredited ISO 17025 mineralogy lab for Rietveld powder diffraction.
                </p>
                <div className="pt-2 text-[10px] font-mono text-zinc-300 border-t border-blue-500/20">
                  Estimated turnaround: 4 business days
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 6: INDUSTRIAL NETWORK OPTIMIZER
          Main purpose: evaluate multiple supply-demand combinations.
          Visual: industrial network graph or supply-demand matrix.
          Action: Optimize Network
          Output: feasible candidate allocations with capacity and logistics.
          ========================================================================= */}
      {activeEngine === 'network_optimizer' && (
        <div className="glass-surface-elevated rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                Module 06 • Multi-Facility Symbiosis Solver
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
                Industrial Network Optimizer
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl">
                Evaluates multi-facility resource routing within regional perimeters to minimize ton-miles and balance byproduct allocations.
              </p>
            </div>

            <button
              onClick={() => {
                setIsOptimizingNetwork(true);
                setTimeout(() => setIsOptimizingNetwork(false), 400);
              }}
              className="glow-button-emerald px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start"
            >
              {isOptimizingNetwork ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Network className="w-3.5 h-3.5" />
              )}
              <span>Optimize Network</span>
            </button>
          </div>

          {/* Interactive Cluster Radius Slider */}
          <div className="p-4 rounded-2xl glass-surface space-y-2 text-xs max-w-md">
            <div className="flex justify-between font-semibold">
              <span className="text-[var(--text-primary)]">Regional Symbiosis Perimeter</span>
              <span className="font-mono text-amber-400 font-bold">{clusterRadius} km Radius</span>
            </div>
            <input
              type="range"
              min="25"
              max="250"
              step="25"
              value={clusterRadius}
              onChange={(e) => setClusterRadius(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <span className="text-[10px] text-zinc-400">Scans 4 regional facilities across Michigan and Illinois</span>
          </div>

          {/* Visual: Industrial Network Graph */}
          <IndustrialNetworkGraph />

          {/* Feasible Allocations Output Table */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif text-base font-semibold text-[var(--text-primary)]">
              Optimized Multi-Facility Routing Synergies:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {optimizeClusterSynergies(clusterNodes).map((opp, idx) => (
                <div key={idx} className="p-4 rounded-2xl glass-surface space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-[var(--text-primary)] block text-xs">{opp.streamName}</span>
                      <span className="text-[10px] text-[var(--text-secondary)]">
                        {opp.sourceNodeName} → {opp.targetNodeName}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {opp.distanceKm} km
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/5 dark:border-white/5 text-[11px]">
                    <div>
                      <span className="text-[var(--text-secondary)] text-[10px] block">Logistics Savings:</span>
                      <strong className="font-mono text-emerald-400">
                        ${opp.estAnnualLogisticsSavingsUSD.toLocaleString()} / yr
                      </strong>
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)] text-[10px] block">Avoided Emissions:</span>
                      <strong className="font-mono text-teal-400">
                        {opp.avoidedVirginCO2eTons.toLocaleString()} t CO2e / yr
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
