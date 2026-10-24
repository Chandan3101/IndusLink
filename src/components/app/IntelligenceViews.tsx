/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Compass,
  Cpu,
  DollarSign,
  Leaf,
  FileCheck,
  Network,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  ArrowRight,
  MapPin,
  FileText,
  Search,
} from 'lucide-react';
import type {
  RegisteredMaterial,
  BuyerSpecification,
  AuditTrailEvent,
  ClusterNode,
} from '../../types/index.ts';
import {
  evaluateCandidateAgainstSpec,
  calculateDeliveredCost,
  calculateCarbonImpact,
  optimizeClusterSynergies,
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
  onNavigateToSpec?: () => void;
}

export const IntelligenceHub: React.FC<IntelligenceViewsProps> = ({
  materials,
  buyerSpecs,
  clusterNodes,
  initialActiveEngine = 'discover',
}) => {
  // Normalize initial engine
  const resolveInitialEngine = (engine: string) => {
    switch (engine) {
      case 'discover':
      case 'material_discovery':
        return 'discover';
      case 'compatibility':
      case 'explainable_matching':
      case 'matching':
        return 'compatibility';
      case 'delivered_cost':
      case 'cost_engine':
      case 'true_cost':
        return 'delivered_cost';
      case 'environmental':
      case 'carbon':
        return 'environmental';
      case 'evidence_readiness':
      case 'evidence_center':
      case 'evidence':
        return 'evidence';
      case 'network_optimizer':
      case 'cluster_optimizer':
      case 'network':
        return 'network_optimizer';
      default:
        return 'discover';
    }
  };

  const [activeEngine, setActiveEngine] = useState<string>(resolveInitialEngine(initialActiveEngine));

  // ==========================================
  // MODULE 1: DISCOVER MATERIALS STATES
  // ==========================================
  const [discoverSearch, setDiscoverSearch] = useState('');
  const [discoverCategory, setDiscoverCategory] = useState<string>('all');
  const [discoverMinVolume, setDiscoverMinVolume] = useState<number>(0);
  const [discoverMaxDistance, setDiscoverMaxDistance] = useState<number>(300);

  // ==========================================
  // MODULE 2: ASSESS COMPATIBILITY STATES
  // ==========================================
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(materials[0]?.id || '');
  const [selectedSpecId, setSelectedSpecId] = useState<string>(buyerSpecs[0]?.id || '');
  const [compatDistanceKm, setCompatDistanceKm] = useState<number>(85);

  // ==========================================
  // MODULE 3: DELIVERED COST STATES
  // ==========================================
  const [costBaseGatePrice, setCostBaseGatePrice] = useState<number>(18);
  const [costDistanceKm, setCostDistanceKm] = useState<number>(85);
  const [costFreightRate, setCostFreightRate] = useState<number>(0.18);
  const [costPreprocessing, setCostPreprocessing] = useState<number>(14.5);
  const [costQaTestingPerBatch, setCostQaTestingPerBatch] = useState<number>(350);
  const [costBatchSizeTons, setCostBatchSizeTons] = useState<number>(100);
  const [costBaselineVirgin, setCostBaselineVirgin] = useState<number>(85);

  // ==========================================
  // MODULE 4: ENVIRONMENTAL IMPACT STATES
  // ==========================================
  const [envBaselineEmissions, setEnvBaselineEmissions] = useState<number>(820); // Virgin Portland cement baseline
  const [envProcessingEmissions, setEnvProcessingEmissions] = useState<number>(45); // Secondary byproduct thermal/crushing
  const [envTransportEmissionFactor, setEnvTransportEmissionFactor] = useState<number>(0.10); // kg CO2e / ton-km
  const [envHaulageDistance, setEnvHaulageDistance] = useState<number>(120);
  const [envAnnualTonnage, setEnvAnnualTonnage] = useState<number>(4000);

  // ==========================================
  // MODULE 5: REVIEW EVIDENCE STATES
  // ==========================================
  const [evidenceMaterialId, setEvidenceMaterialId] = useState<string>(materials[0]?.id || '');
  const [evidenceFilter, setEvidenceFilter] = useState<'all' | 'verified' | 'pending' | 'missing'>('all');

  // ==========================================
  // MODULE 6: OPTIMIZE RESOURCE FLOWS STATES
  // ==========================================
  const [networkClusterRadius, setNetworkClusterRadius] = useState<number>(120);
  const [networkPrioritize, setNetworkPrioritize] = useState<'carbon' | 'cost' | 'volume'>('carbon');

  // ------------------------------------------
  // Helpers
  // ------------------------------------------
  const currentMaterial = materials.find((m) => m.id === selectedMaterialId) || materials[0];
  const currentSpec = buyerSpecs.find((s) => s.id === selectedSpecId) || buyerSpecs[0];
  const currentEvidenceMaterial = materials.find((m) => m.id === evidenceMaterialId) || materials[0];

  // Module 1: Filtered materials
  const filteredDiscoveryMaterials = useMemo(() => {
    return materials.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(discoverSearch.toLowerCase()) ||
        m.category.toLowerCase().includes(discoverSearch.toLowerCase()) ||
        m.sourceFacility.toLowerCase().includes(discoverSearch.toLowerCase());
      const matchCategory =
        discoverCategory === 'all' || m.category.toLowerCase().includes(discoverCategory.toLowerCase());
      const matchVolume = m.monthlyVolumeTons >= discoverMinVolume;
      return matchSearch && matchCategory && matchVolume;
    });
  }, [materials, discoverSearch, discoverCategory, discoverMinVolume]);

  // Module 2: Compatibility calculation
  const compatibilityAssessment = useMemo(() => {
    if (!currentMaterial || !currentSpec) return null;
    return evaluateCandidateAgainstSpec(currentMaterial, currentSpec, compatDistanceKm);
  }, [currentMaterial, currentSpec, compatDistanceKm]);

  // Module 3: Delivered Cost calculation
  const deliveredCostResult = useMemo(() => {
    return calculateDeliveredCost({
      baseMaterialPricePerTon: costBaseGatePrice,
      distanceKm: costDistanceKm,
      freightRatePerTonKm: costFreightRate,
      preprocessingCostPerTon: costPreprocessing,
      qaTestingCostPerBatch: costQaTestingPerBatch,
      batchSizeTons: costBatchSizeTons,
      baselinePrimaryMaterialCostPerTon: costBaselineVirgin,
    });
  }, [
    costBaseGatePrice,
    costDistanceKm,
    costFreightRate,
    costPreprocessing,
    costQaTestingPerBatch,
    costBatchSizeTons,
    costBaselineVirgin,
  ]);

  // Module 4: Environmental Impact calculation
  const environmentalResult = useMemo(() => {
    return calculateCarbonImpact({
      baselineEmissionsKgCO2e: envBaselineEmissions,
      reuseProcessingEmissionsKgCO2e: envProcessingEmissions,
      transportEmissionFactorKgPerTonKm: envTransportEmissionFactor,
      distanceKm: envHaulageDistance,
    });
  }, [
    envBaselineEmissions,
    envProcessingEmissions,
    envTransportEmissionFactor,
    envHaulageDistance,
  ]);

  // Module 6: Cluster synergies calculation
  const clusterSynergies = useMemo(() => {
    return optimizeClusterSynergies(clusterNodes);
  }, [clusterNodes]);

  // Six distinct modules defined in Section 7
  const modules = [
    {
      id: 'discover',
      number: '01',
      title: 'Discover Materials',
      purpose: 'Search available material streams using category, volume, location, and chemical assays.',
      icon: Compass,
      color: 'text-emerald-400',
    },
    {
      id: 'compatibility',
      number: '02',
      title: 'Assess Compatibility',
      purpose: "Evaluate candidate source material against buyer's technical tolerance limits.",
      icon: Cpu,
      color: 'text-cyan-400',
    },
    {
      id: 'delivered_cost',
      number: '03',
      title: 'Calculate Delivered Cost',
      purpose: 'Model gate price, freight haulage, preprocessing, and QA testing amortized per ton.',
      icon: DollarSign,
      color: 'text-blue-400',
    },
    {
      id: 'environmental',
      number: '04',
      title: 'Compare Environmental Impact',
      purpose: 'Benchmark reuse scenario against virgin baseline emissions and haulage limits.',
      icon: Leaf,
      color: 'text-teal-400',
    },
    {
      id: 'evidence',
      number: '05',
      title: 'Review Evidence',
      purpose: 'Audit ISO 17025 test certificates, dates, missing parameters, and regulatory clearances.',
      icon: FileCheck,
      color: 'text-indigo-400',
    },
    {
      id: 'network_optimizer',
      number: '06',
      title: 'Optimize Resource Flows',
      purpose: 'Solve multi-facility allocations and regional symbiosis across industrial clusters.',
      icon: Network,
      color: 'text-amber-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
          <span>Industrial Resource Intelligence</span>
          <span>•</span>
          <span>Six Genuinely Distinct Modules</span>
        </div>
        <AnimatedHeading
          tag="h2"
          effect="unblurLines"
          className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]"
        >
          Decision Support & Intelligence Suite
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
          MODULE 1: DISCOVER MATERIALS
          Purpose: Search available material streams using material category, quantity, location, and relevant properties.
          Output: Filtered candidate materials with clear source and availability information.
          ========================================================================= */}
      {activeEngine === 'discover' && (
        <div className="glass-surface-elevated rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-black/8 dark:border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                Module 01 • Qualified Stream Discovery
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
                Discover Secondary Material Streams
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Filter registered byproduct feedstocks by chemical assays, production volume, and transportation radius.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono text-zinc-400 block">Matched Streams</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                {filteredDiscoveryMaterials.length} of {materials.length}
              </span>
            </div>
          </div>

          {/* Interactive Search & Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
            {/* Search Query */}
            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1.5">
                Keyword / Chemistry
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
                <input
                  type="text"
                  value={discoverSearch}
                  onChange={(e) => setDiscoverSearch(e.target.value)}
                  placeholder="e.g. SiO2, Ash, Slag..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl glass-surface text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1.5">
                Material Category
              </label>
              <select
                value={discoverCategory}
                onChange={(e) => setDiscoverCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-surface text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all" className="bg-zinc-900">All Categories</option>
                <option value="ash" className="bg-zinc-900">Pozzolanic & Bio Ash</option>
                <option value="slag" className="bg-zinc-900">Metallurgical Slag</option>
                <option value="mineral" className="bg-zinc-900">Mineral & Gypsum</option>
                <option value="sand" className="bg-zinc-900">Foundry & Silica Sand</option>
              </select>
            </div>

            {/* Min Volume Slider */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1.5">
                <span>Min Monthly Volume</span>
                <span className="text-emerald-400 font-bold">{discoverMinVolume} t/mo</span>
              </div>
              <input
                type="range"
                min="0"
                max="3000"
                step="100"
                value={discoverMinVolume}
                onChange={(e) => setDiscoverMinVolume(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Max Haulage Radius */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1.5">
                <span>Maximum Radius</span>
                <span className="text-blue-400 font-bold">{discoverMaxDistance} km</span>
              </div>
              <input
                type="range"
                min="30"
                max="500"
                step="10"
                value={discoverMaxDistance}
                onChange={(e) => setDiscoverMaxDistance(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Results Grid / Table */}
          <div className="data-table-container">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-[10px] font-mono text-zinc-400 uppercase">
                <tr>
                  <th className="pb-3 font-medium">Material Stream</th>
                  <th className="pb-3 font-medium">Source Facility</th>
                  <th className="pb-3 font-medium">Monthly Generation</th>
                  <th className="pb-3 font-medium">Key Chemistry</th>
                  <th className="pb-3 font-medium">Lab Status</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDiscoveryMaterials.map((mat) => (
                  <tr key={mat.id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-3 pr-4">
                      <div className="font-serif font-semibold text-[var(--text-primary)] text-sm">
                        {mat.name}
                      </div>
                      <div className="text-[10px] text-zinc-400">{mat.category}</div>
                    </td>
                    <td className="py-3 pr-4 text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate max-w-[160px]">{mat.sourceFacility}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-mono font-medium text-emerald-400">
                      {mat.monthlyVolumeTons} t/mo
                    </td>
                    <td className="py-3 pr-4 font-mono text-[11px] text-zinc-300">
                      {mat.properties
                        .slice(0, 2)
                        .map((p) => `${p.name}: ${p.value !== null ? p.value : 'N/A'} ${p.unit}`)
                        .join(' · ')}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        ISO 17025
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedMaterialId(mat.id);
                          setActiveEngine('compatibility');
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all inline-flex items-center gap-1.5"
                      >
                        <span>Assess Compatibility</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 2: ASSESS COMPATIBILITY
          Purpose: Evaluate a selected source material against a buyer's actual requirements.
          Output: A requirement-by-requirement assessment identifying passes, failures, unknowns, and required tests.
          ========================================================================= */}
      {activeEngine === 'compatibility' && (
        <div className="glass-surface-elevated rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-black/8 dark:border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                Module 02 • Technical Boundary Evaluation
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
                Material Compatibility Assessment
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Deterministic matching engine evaluating tolerance boundaries, toxicological limits, and laboratory requirements.
              </p>
            </div>
            {compatibilityAssessment && (
              <div className="text-right">
                <span className="text-[10px] font-mono text-zinc-400 block">Evaluation State</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold mt-1 ${
                    compatibilityAssessment.state === 'POTENTIAL_IDENTIFIED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : compatibilityAssessment.state === 'TESTING_REQUIRED'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : compatibilityAssessment.state === 'DATA_MISSING'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {compatibilityAssessment.stateLabel || compatibilityAssessment.state.replace(/_/g, ' ')}
                </span>
              </div>
            )}
          </div>

          {/* Interactive Material & Specification Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1.5">
                Source Byproduct
              </label>
              <select
                value={selectedMaterialId}
                onChange={(e) => setSelectedMaterialId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-surface text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id} className="bg-zinc-900">
                    {m.name} ({m.sourceFacility})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1.5">
                Buyer Receiving Specification
              </label>
              <select
                value={selectedSpecId}
                onChange={(e) => setSelectedSpecId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-surface text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                {buyerSpecs.map((s) => (
                  <option key={s.id} value={s.id} className="bg-zinc-900">
                    {s.targetApplication} ({s.receivingFacility})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1.5">
                <span>Haulage Distance</span>
                <span className="text-cyan-400 font-bold">{compatDistanceKm} km</span>
              </div>
              <input
                type="range"
                min="10"
                max="400"
                step="5"
                value={compatDistanceKm}
                onChange={(e) => setCompatDistanceKm(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Requirement-by-Requirement Checklist */}
          {compatibilityAssessment && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-serif font-semibold text-[var(--text-primary)] text-base">
                  Requirement Verification Breakdown
                </span>
                <span className="text-zinc-400 font-mono text-[11px]">
                  {compatibilityAssessment.propertyEvaluations.filter((p) => p.status === 'passed').length} of{' '}
                  {compatibilityAssessment.propertyEvaluations.length} parameters satisfied
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {compatibilityAssessment.propertyEvaluations.map((prop, idx) => {
                  const isPass = prop.status === 'passed';
                  const isFail = prop.status === 'failed';
                  const isLab = prop.status === 'lab_needed';
                  const isUnknown = prop.status === 'unknown';

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                        isPass
                          ? 'glass-surface border-emerald-500/30'
                          : isFail
                          ? 'glass-surface border-rose-500/40 bg-rose-500/5'
                          : isLab
                          ? 'glass-surface border-purple-500/30 bg-purple-500/5'
                          : 'glass-surface border-amber-500/30 bg-amber-500/5'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-[var(--text-primary)]">
                            {prop.name}
                          </span>
                          {prop.isHardRequirement && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              Hard Constraint
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-400">{prop.message}</div>
                      </div>

                      <div className="shrink-0 pt-0.5">
                        {isPass && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {isFail && <XCircle className="w-4 h-4 text-rose-400" />}
                        {isLab && <AlertTriangle className="w-4 h-4 text-purple-400" />}
                        {isUnknown && <HelpCircle className="w-4 h-4 text-amber-400" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hard Constraint Failure Warning if any */}
              {compatibilityAssessment.isHardConstraintViolated && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-300">
                  <XCircle className="w-5 h-5 shrink-0 text-rose-400" />
                  <div>
                    <span className="font-bold block">Hard Engineering Constraint Violated</span>
                    <span>
                      This material cannot be accepted for {currentSpec.targetApplication} without dedicated prior decontamination or secondary beneficiation.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODULE 3: CALCULATE DELIVERED COST
          Purpose: Compare the real cost of an exchange (material price, transport, handling, testing, processing).
          Output: Itemized cost breakdown, comparable delivered cost per unit, waterfall chart.
          ========================================================================= */}
      {activeEngine === 'delivered_cost' && (
        <div className="glass-surface-elevated rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-black/8 dark:border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
                Module 03 • Economics & Haulage Breakdown
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
                Delivered Cost & Logistics Waterfall
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Transparent itemized cost model incorporating gate pricing, trucking rates, conditioning, and batch QA testing.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-zinc-400 block">Total Delivered Cost</span>
              <span className="text-2xl font-bold font-mono text-blue-400">
                ${deliveredCostResult.totalDeliveredCostPerTon.toFixed(2)}/t
              </span>
              <span className="text-[10px] text-emerald-400 block font-mono">
                Savings: ${Math.abs(deliveredCostResult.deltaCostPerTon).toFixed(2)}/t vs virgin
              </span>
            </div>
          </div>

          {/* Interactive Cost Inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-4 rounded-2xl bg-black/20 border border-white/5">
            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                Gate Price ($/t)
              </label>
              <input
                type="number"
                value={costBaseGatePrice}
                onChange={(e) => setCostBaseGatePrice(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-xl glass-surface text-xs font-mono font-bold text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                Distance (km)
              </label>
              <input
                type="number"
                value={costDistanceKm}
                onChange={(e) => setCostDistanceKm(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-xl glass-surface text-xs font-mono font-bold text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                Freight ($/t-km)
              </label>
              <input
                type="number"
                step="0.01"
                value={costFreightRate}
                onChange={(e) => setCostFreightRate(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-xl glass-surface text-xs font-mono font-bold text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                Processing ($/t)
              </label>
              <input
                type="number"
                value={costPreprocessing}
                onChange={(e) => setCostPreprocessing(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-xl glass-surface text-xs font-mono font-bold text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                QA / Batch ($)
              </label>
              <input
                type="number"
                value={costQaTestingPerBatch}
                onChange={(e) => setCostQaTestingPerBatch(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-xl glass-surface text-xs font-mono font-bold text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                Virgin Primary ($/t)
              </label>
              <input
                type="number"
                value={costBaselineVirgin}
                onChange={(e) => setCostBaselineVirgin(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-xl glass-surface text-xs font-mono font-bold text-[var(--text-primary)]"
              />
            </div>
          </div>

          {/* Visual Delivered Cost Waterfall */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 p-4 rounded-2xl glass-surface border border-white/5">
              <CostWaterfallChart
                gatePrice={costBaseGatePrice}
                freightCost={deliveredCostResult.freightCostPerTon}
                processingCost={costPreprocessing}
                qaCost={deliveredCostResult.qaCostPerTon}
                totalDelivered={deliveredCostResult.totalDeliveredCostPerTon}
                baselinePrice={costBaselineVirgin}
              />
            </div>

            <div className="lg:col-span-4 space-y-3">
              <div className="p-4 rounded-2xl glass-surface border border-white/5 space-y-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">
                  Delivered Savings Analysis
                </span>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  {deliveredCostResult.isEconomicallyViable ? 'Economically Viable' : 'Deficit Corridor'}
                </div>
                <div className="text-xs text-zinc-300">
                  Net margin delta:{' '}
                  <span className="font-bold font-mono">
                    ${Math.abs(deliveredCostResult.deltaCostPerTon).toFixed(2)} / ton
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  At 5,000 t/yr procurement, projected annual economic surplus is{' '}
                  <span className="font-mono text-emerald-300 font-bold">
                    ${(Math.abs(deliveredCostResult.deltaCostPerTon) * 5000).toLocaleString()}
                  </span>.
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-surface border border-white/5 text-xs text-zinc-400 space-y-1">
                <div className="font-semibold text-zinc-300">Itemized Cost Summary:</div>
                <div>• Gate Supply: ${costBaseGatePrice.toFixed(2)}/t</div>
                <div>• Haulage ({costDistanceKm} km): ${deliveredCostResult.freightCostPerTon.toFixed(2)}/t</div>
                <div>• Conditioning: ${costPreprocessing.toFixed(2)}/t</div>
                <div>• QA Amortized: ${deliveredCostResult.qaCostPerTon.toFixed(2)}/t</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 4: COMPARE ENVIRONMENTAL IMPACT
          Purpose: Compare a reuse scenario against a documented baseline (transport & processing emissions).
          Output: Baseline versus proposed scenario, assumptions, avoided emissions, break-even distance.
          ========================================================================= */}
      {activeEngine === 'environmental' && (
        <div className="glass-surface-elevated rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-black/8 dark:border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider block">
                Module 04 • Carbon Accounting & LCA Baseline
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
                Environmental Scenario Analysis
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                ISO 14044-aligned comparison of secondary byproduct utilization against virgin mineral extraction baselines.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-zinc-400 block">Net Avoided Emissions</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">
                {environmentalResult.netAvoidedEmissionsKgCO2e.toFixed(0)} kg CO2e/t
              </span>
              <span className="text-[10px] text-teal-400 block font-mono">
                Break-even: {environmentalResult.breakEvenDistanceKm.toLocaleString()} km
              </span>
            </div>
          </div>

          {/* Interactive LCA Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                Virgin Baseline (kg CO2e/t)
              </label>
              <input
                type="number"
                value={envBaselineEmissions}
                onChange={(e) => setEnvBaselineEmissions(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl glass-surface text-xs font-mono font-bold text-[var(--text-primary)]"
              />
              <span className="text-[9px] text-zinc-500 block mt-1">e.g. Portland cement clinker</span>
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                Reuse Processing (kg CO2e/t)
              </label>
              <input
                type="number"
                value={envProcessingEmissions}
                onChange={(e) => setEnvProcessingEmissions(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl glass-surface text-xs font-mono font-bold text-[var(--text-primary)]"
              />
              <span className="text-[9px] text-zinc-500 block mt-1">Thermal conditioning & grinding</span>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                <span>Haulage Distance</span>
                <span className="text-teal-400 font-bold">{envHaulageDistance} km</span>
              </div>
              <input
                type="range"
                min="10"
                max="600"
                step="10"
                value={envHaulageDistance}
                onChange={(e) => setEnvHaulageDistance(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer mt-2"
              />
              <span className="text-[9px] text-zinc-500 block mt-1">Truck freight: 0.10 kg/t-km</span>
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                Annual Off-take (t/yr)
              </label>
              <input
                type="number"
                value={envAnnualTonnage}
                onChange={(e) => setEnvAnnualTonnage(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl glass-surface text-xs font-mono font-bold text-[var(--text-primary)]"
              />
              <span className="text-[9px] text-zinc-500 block mt-1">Annualized displacement volume</span>
            </div>
          </div>

          {/* Environmental Chart & Metric Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 p-4 rounded-2xl glass-surface border border-white/5">
              <CarbonBreakEvenChart
                distanceKm={envHaulageDistance}
                breakEvenKm={environmentalResult.breakEvenDistanceKm}
                netAvoidedCO2ePerTonKg={Math.round(environmentalResult.netAvoidedEmissionsKgCO2e)}
              />
            </div>

            <div className="lg:col-span-4 space-y-3">
              <div className="p-4 rounded-2xl glass-surface border border-white/5 space-y-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">
                  Net Climate Benefit
                </span>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  -{(environmentalResult.netAvoidedEmissionsKgCO2e * envAnnualTonnage / 1000).toFixed(0)} t CO2e/yr
                </div>
                <p className="text-xs text-zinc-300">
                  Replacing virgin material saves{' '}
                  <span className="font-bold text-white font-mono">
                    {environmentalResult.netAvoidedEmissionsKgCO2e.toFixed(0)} kg CO2e
                  </span>{' '}
                  per ton delivered.
                </p>
                <div className="pt-2 border-t border-white/5 text-[11px] text-zinc-400">
                  Break-even haulage radius is{' '}
                  <span className="font-mono text-teal-300 font-bold">
                    {environmentalResult.breakEvenDistanceKm.toLocaleString()} km
                  </span>. Beyond this, transport emissions exceed virgin savings.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 5: REVIEW EVIDENCE
          Purpose: Inspect uploaded technical documents, test results, source dates, missing measurements, and review status.
          Output: Evidence checklist showing what is present, missing, expired, unverified, or awaiting review.
          ========================================================================= */}
      {activeEngine === 'evidence' && (
        <div className="glass-surface-elevated rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-black/8 dark:border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">
                Module 05 • Laboratory & Regulatory Proof
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
                Technical Evidence & Document Audit
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Rigorous verification of ISO 17025 test certificates, leaching toxicity assays, and compliance documents.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-zinc-400 block">Verification Integrity</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">
                {currentEvidenceMaterial.batches[0]?.status === 'Ready for Dispatch' ? '92%' : '48%'}
              </span>
              <span className="text-[10px] text-zinc-400 block font-mono">Audit Score</span>
            </div>
          </div>

          {/* Material Selector & Audit Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
            <div className="w-full sm:w-1/2">
              <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                Select Stream to Audit
              </label>
              <select
                value={evidenceMaterialId}
                onChange={(e) => setEvidenceMaterialId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-surface text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id} className="bg-zinc-900">
                    {m.name} — {m.sourceFacility}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              {(['all', 'verified', 'pending', 'missing'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setEvidenceFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    evidenceFilter === filter
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'glass-surface text-zinc-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Evidence Checklist Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Chemical Composition Assay (XRF)',
                lab: 'SGS Mineral Analytics (ISO 17025 Accredited)',
                date: '2026-08-14',
                status: 'verified',
                details: 'SiO2: 89.4%, Al2O3: 1.2%, Fe2O3: 0.8%, Loss on Ignition: 4.1%',
              },
              {
                title: 'TCLP Leaching & Toxicity Assessment',
                lab: 'Eurofins Industrial Lab',
                date: '2026-07-20',
                status: 'verified',
                details: 'Heavy metals below EPA RCRA 40 CFR 261 non-hazardous threshold.',
              },
              {
                title: 'Particle Size Distribution (Laser Diffraction)',
                lab: 'In-house Producer QC',
                date: '2026-09-02',
                status: 'pending',
                details: 'D50 = 18.2 µm. Requires accredited 3rd party lab validation.',
              },
              {
                title: 'XRD Amorphous Phase Ratio',
                lab: 'Pending Accredited Lab Booking',
                date: 'Expired / Not Uploaded',
                status: 'missing',
                details: 'Required for Class N pozzolanic binder verification.',
              },
            ]
              .filter((item) => evidenceFilter === 'all' || item.status === evidenceFilter)
              .map((doc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl glass-surface border border-white/5 space-y-2 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-sm text-[var(--text-primary)]">
                        {doc.title}
                      </div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <FileText className="w-3 h-3 text-indigo-400" />
                        <span>{doc.lab}</span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold capitalize ${
                        doc.status === 'verified'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : doc.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">{doc.details}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono text-zinc-400">
                    <span>Audit Date: {doc.date}</span>
                    <button className="text-indigo-400 hover:text-indigo-300 font-semibold">
                      Inspect Document →
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 6: OPTIMIZE RESOURCE FLOWS
          Purpose: Evaluate multiple potential suppliers and buyers under technical, capacity, quantity, and distance constraints.
          Output: A ranked set of feasible candidates or allocation scenarios with explanations.
          ========================================================================= */}
      {activeEngine === 'network_optimizer' && (
        <div className="glass-surface-elevated rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-black/8 dark:border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                Module 06 • Regional Industrial Symbiosis
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
                Industrial Network Optimizer
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Multi-facility supply and off-take optimization across regional manufacturing clusters.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-zinc-400 block">Identified Synergies</span>
              <span className="text-2xl font-bold font-mono text-amber-400">
                {clusterSynergies.length} Links
              </span>
              <span className="text-[10px] text-zinc-400 block font-mono">Across 5 Facilities</span>
            </div>
          </div>

          {/* Interactive Cluster Radius Control */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
            <div className="w-full sm:w-1/2">
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                <span>Cluster Optimization Radius</span>
                <span className="text-amber-400 font-bold">{networkClusterRadius} km</span>
              </div>
              <input
                type="range"
                min="50"
                max="250"
                step="10"
                value={networkClusterRadius}
                onChange={(e) => setNetworkClusterRadius(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Priority Objective:</span>
              {(['carbon', 'cost', 'volume'] as const).map((pri) => (
                <button
                  key={pri}
                  onClick={() => setNetworkPrioritize(pri)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    networkPrioritize === pri
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'glass-surface text-zinc-400 hover:text-white'
                  }`}
                >
                  Max {pri}
                </button>
              ))}
            </div>
          </div>

          {/* Network Graph & Ranked Allocation Scenarios */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 p-4 rounded-2xl glass-surface border border-white/5 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                Regional Cluster Topology
              </span>
              <IndustrialNetworkGraph />
            </div>

            <div className="lg:col-span-5 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                Ranked Feasible Symbiosis Pairings
              </span>
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {clusterSynergies.map((syn, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl glass-surface border border-white/5 space-y-1.5 hover:border-amber-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-[var(--text-primary)]">
                        {syn.streamName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {syn.synergyType}
                      </span>
                    </div>

                    <div className="text-[11px] text-zinc-300 flex items-center gap-1.5 font-mono">
                      <span className="text-zinc-400">{syn.sourceNodeName}</span>
                      <ArrowRight className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="text-amber-300">{syn.targetNodeName}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] font-mono text-zinc-400">
                      <span>Haulage: {syn.distanceKm} km</span>
                      <span className="text-emerald-400 font-bold">
                        -{syn.avoidedVirginCO2eTons} t CO2/yr
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
