/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Building2,
  FileCheck,
  Scale,
  Leaf,
  Plus,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  Send,
  Eye,
  Layers,
  Sparkles,
  ArrowUpDown,
  X,
} from 'lucide-react';
import type {
  RegisteredMaterial,
  BuyerSpecification,
  EnquiryRecord,
  OfferRecord,
  IndustrialSector,
  ConnectionState,
} from '../../types/index.ts';
import {
  evaluateCandidateAgainstSpec,
  calculateHaversineDistance,
  DetailedCandidateAssessment,
} from '../../utils/evaluationEngine.ts';
import { CostWaterfallChart, CarbonBreakEvenChart } from './Visualizations.tsx';
import { AnimatedHeading } from '../AnimatedHeading.tsx';

interface BuyerViewsProps {
  materials: RegisteredMaterial[];
  buyerSpecs: BuyerSpecification[];
  enquiries: EnquiryRecord[];
  offers: OfferRecord[];
  onAddSpecification: (spec: BuyerSpecification) => void;
  onSubmitEnquiry: (enquiry: Omit<EnquiryRecord, 'id' | 'inquiryDate' | 'status' | 'auditHistory'>) => void;
  onAcceptOffer: (offerId: string) => void;
  onDeclineOffer: (offerId: string) => void;
}

/**
 * 7.1 BUYER OVERVIEW
 */
export const BuyerOverview: React.FC<
  BuyerViewsProps & { onNavigateTab: (tab: any) => void }
> = ({ materials, buyerSpecs, enquiries, offers, onNavigateTab }) => {
  const activeEnquiries = enquiries.filter((e) => e.status !== 'Declined');
  const pendingOffers = offers.filter((o) => o.status === 'Pending Review');

  return (
    <div className="space-y-6">
      {/* Top Banner with Real Metrics */}
      <div className="glass-surface rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#10b981] to-transparent opacity-90" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Buyer Workspace • Off-taker Procurement</span>
            </div>
            <AnimatedHeading
              tag="h2"
              className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]"
            >
              Secondary Feedstock Intelligence & Procurement
            </AnimatedHeading>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl mt-1">
              Evaluate candidate byproduct streams against strict engineering tolerances, delivered freight economics, and traceable environmental evidence.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('spec_builder')}
              className="glow-button-emerald px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Material Requirement</span>
            </button>
            <button
              onClick={() => onNavigateTab('discover')}
              className="glass-surface px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Discover Byproducts
            </button>
          </div>
        </div>

        {/* 4 Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-black/5 dark:border-white/5">
          <div className="p-3.5 rounded-2xl bg-black/10 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <span className="text-xs text-[var(--text-secondary)] block">Active Specifications</span>
            <span className="font-mono text-2xl font-bold text-[var(--text-primary)] mt-1 block">
              {buyerSpecs.length}
            </span>
            <span className="text-[10px] text-emerald-400 mt-1 block">Active receiving criteria</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/10 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <span className="text-xs text-[var(--text-secondary)] block">Available Streams</span>
            <span className="font-mono text-2xl font-bold text-emerald-400 mt-1 block">
              {materials.length}
            </span>
            <span className="text-[10px] text-[var(--text-secondary)] mt-1 block">Registered industrial candidates</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/10 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <span className="text-xs text-[var(--text-secondary)] block">Active Enquiries</span>
            <span className="font-mono text-2xl font-bold text-blue-400 mt-1 block">
              {activeEnquiries.length}
            </span>
            <span className="text-[10px] text-[var(--text-secondary)] mt-1 block">Under technical & supplier review</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/10 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <span className="text-xs text-[var(--text-secondary)] block">Pending Quotations</span>
            <span className="font-mono text-2xl font-bold text-amber-400 mt-1 block">
              {pendingOffers.length}
            </span>
            <span className="text-[10px] text-amber-400/80 mt-1 block">Awaiting commercial decision</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Active Specifications & Candidate Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Specifications (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
              Active Material Requirements & Tolerances
            </h3>
            <span className="text-xs text-[var(--text-secondary)]">Strict boundary evaluation</span>
          </div>

          <div className="space-y-3">
            {buyerSpecs.map((spec) => (
              <div
                key={spec.id}
                className="glass-surface-elevated rounded-2xl p-4 sm:p-5 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                      {spec.sector} • {spec.deliveryCadence}
                    </span>
                    <h4 className="font-serif text-base font-semibold text-[var(--text-primary)]">
                      {spec.title}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    Target: {spec.monthlyDemandTons} t/mo
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] mb-3">
                  Delivered to <strong>{spec.deliveryLocation}</strong>. Replaces{' '}
                  <span className="text-[var(--text-primary)]">{spec.virginBaselineMaterial}</span> (baseline: ${spec.virginBaselineCostPerTon}/t).
                </p>

                {/* Hard Requirements Chips */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-black/5 dark:border-white/5">
                  {spec.requiredProperties.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/10 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[var(--text-secondary)]"
                    >
                      {p.name}: {p.min !== undefined ? `>=${p.min}` : ''}
                      {p.max !== undefined ? `<=${p.max}` : ''} {p.unit}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Missing-Evidence Alerts & Open Enquiries (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
              Evidence & Workflow Action Items
            </h3>
            <span className="text-xs text-amber-400 font-mono">Unknown Data Guard</span>
          </div>

          <div className="glass-surface-elevated rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200 block font-sans">Lab Testing Required on Candidate Stream</strong>
                <p className="text-amber-300/80 text-[11px] mt-0.5">
                  Rice Husk Ash dossier satisfies preliminary chemistry, but requires independent XRD Rietveld assay before structural concrete clearance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
              <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-blue-200 block font-sans">Quotation Ready for Review</strong>
                <p className="text-blue-300/80 text-[11px] mt-0.5">
                  Prairie Horizon Thermal has issued a formal quote for 800 t of Class F Fly Ash ($36/t delivered vs $110/t baseline).
                </p>
                <button
                  onClick={() => onNavigateTab('enquiries')}
                  className="mt-2 text-[11px] text-blue-400 font-semibold underline hover:text-blue-300"
                >
                  Review Offer & Audit Terms →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 7.2 MATERIAL DISCOVERY & CANDIDATE MATCHING
 */
export const MaterialDiscoveryView: React.FC<
  BuyerViewsProps & {
    onSelectForAssessment: (material: RegisteredMaterial, spec: BuyerSpecification) => void;
    onToggleCompare: (materialId: string) => void;
    comparedMaterialIds: string[];
  }
> = ({
  materials,
  buyerSpecs,
  onSelectForAssessment,
  onToggleCompare,
  comparedMaterialIds,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedPhysicalState, setSelectedPhysicalState] = useState<string>('All');
  const [selectedSpecId, setSelectedSpecId] = useState<string>(buyerSpecs[0]?.id || '');
  const [maxDistance, setMaxDistance] = useState<number>(300);

  const activeSpec = buyerSpecs.find((s) => s.id === selectedSpecId) || buyerSpecs[0];

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.generatingProcess.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sourceFacility.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'All' || m.sourceSector === selectedSector;
    const matchesState = selectedPhysicalState === 'All' || m.physicalState === selectedPhysicalState;

    const distance = activeSpec
      ? calculateHaversineDistance(
          m.coordinates.lat,
          m.coordinates.lng,
          activeSpec.coordinates.lat,
          activeSpec.coordinates.lng
        )
      : 0;
    const matchesDistance = distance <= maxDistance;

    return matchesSearch && matchesSector && matchesState && matchesDistance;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="glass-surface rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-xl font-semibold text-[var(--text-primary)]">
              Material Discovery & Candidate Assessment
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Filter by engineering tolerances against target specification:
            </p>
          </div>

          {/* Active Specification Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[var(--text-secondary)] whitespace-nowrap">Evaluating Against:</span>
            <select
              value={selectedSpecId}
              onChange={(e) => setSelectedSpecId(e.target.value)}
              className="px-3 py-1.5 rounded-xl glass-surface-floating text-xs font-semibold text-[var(--text-primary)] border border-black/10 dark:border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {buyerSpecs.map((s) => (
                <option key={s.id} value={s.id} className="bg-zinc-900 text-white">
                  {s.title} ({s.targetApplication})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar & Multi-Facet Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-2 border-t border-black/5 dark:border-white/5">
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by material chemistry, process, or facility..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl glass-surface text-xs text-[var(--text-primary)] placeholder-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            />
          </div>

          <div className="lg:col-span-3">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-surface text-xs text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <option value="All" className="bg-zinc-900 text-white">All Industrial Sectors</option>
              <option value="Agriculture & Food" className="bg-zinc-900 text-white">Agriculture & Food</option>
              <option value="Mining & Metals" className="bg-zinc-900 text-white">Mining & Metals</option>
              <option value="Chemicals" className="bg-zinc-900 text-white">Chemicals</option>
              <option value="Manufacturing" className="bg-zinc-900 text-white">Manufacturing</option>
              <option value="Energy" className="bg-zinc-900 text-white">Energy</option>
            </select>
          </div>

          <div className="lg:col-span-4 flex items-center gap-2">
            <span className="text-[11px] font-mono text-[var(--text-secondary)] whitespace-nowrap">
              Max Radius: {maxDistance} km
            </span>
            <input
              type="range"
              min="30"
              max="500"
              step="10"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map((mat) => {
          const dist = activeSpec
            ? calculateHaversineDistance(
                mat.coordinates.lat,
                mat.coordinates.lng,
                activeSpec.coordinates.lat,
                activeSpec.coordinates.lng
              )
            : 0;

          const assessment = activeSpec
            ? evaluateCandidateAgainstSpec(mat, activeSpec, dist)
            : null;

          const isCompared = comparedMaterialIds.includes(mat.id);

          return (
            <div
              key={mat.id}
              className="glass-surface-elevated rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all shadow-md group relative"
            >
              <div>
                {/* Status Badge & Checkbox */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                      assessment?.state === 'POTENTIAL_IDENTIFIED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : assessment?.state === 'TESTING_REQUIRED'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : assessment?.state === 'DATA_MISSING'
                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {assessment?.stateLabel}
                  </span>

                  <label className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isCompared}
                      onChange={() => onToggleCompare(mat.id)}
                      className="rounded accent-emerald-500"
                    />
                    <span>Compare</span>
                  </label>
                </div>

                <h4 className="font-serif text-lg font-semibold text-[var(--text-primary)] group-hover:text-emerald-400 transition-colors">
                  {mat.name}
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                  {mat.sourceFacility} • {mat.locationCity} ({dist} km haulage)
                </p>

                {/* Economic & Environmental Summary */}
                {assessment && (
                  <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-black/10 dark:bg-white/5 text-[11px]">
                    <div>
                      <span className="text-[var(--text-secondary)] block text-[10px]">Delivered Cost</span>
                      <strong className="font-mono text-emerald-400 font-bold block">
                        ${assessment.economicDeliveredCost.totalDeliveredCostPerTon}/t
                      </strong>
                      <span className="text-[9px] text-[var(--text-secondary)]">
                        (Delta: ${assessment.economicDeliveredCost.deltaCostPerTon}/t)
                      </span>
                    </div>

                    <div>
                      <span className="text-[var(--text-secondary)] block text-[10px]">Net Carbon Avoided</span>
                      <strong className="font-mono text-teal-400 font-bold block">
                        {assessment.environmentalImpact.netAvoidedEmissionsKgCO2e} kg/t
                      </strong>
                      <span className="text-[9px] text-[var(--text-secondary)]">
                        Break-even: {assessment.environmentalImpact.breakEvenDistanceKm} km
                      </span>
                    </div>
                  </div>
                )}

                {/* Explanation Bullet */}
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {assessment?.decisionExplanation[0]}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                  {mat.monthlyVolumeTons} t/mo available
                </span>

                <button
                  onClick={() => onSelectForAssessment(mat, activeSpec)}
                  className="glow-button-emerald px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>Evaluate Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 7.3 BUYER SPECIFICATION BUILDER
 */
export const BuyerSpecificationBuilder: React.FC<{
  onSaveSpec: (spec: BuyerSpecification) => void;
  onCancel: () => void;
}> = ({ onSaveSpec, onCancel }) => {
  const [title, setTitle] = useState('');
  const [targetApplication, setTargetApplication] = useState('');
  const [sector, setSector] = useState<IndustrialSector>('Construction');
  const [receivingFacility, setReceivingFacility] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [monthlyDemandTons, setMonthlyDemandTons] = useState(500);
  const [virginBaselineMaterial, setVirginBaselineMaterial] = useState('');
  const [virginBaselineCostPerTon, setVirginBaselineCostPerTon] = useState(90);
  const [virginBaselineEmissionsKgCO2e, setVirginBaselineEmissionsKgCO2e] = useState(750);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetApplication) return;

    const newSpec: BuyerSpecification = {
      id: `spec-${Date.now()}`,
      title,
      targetApplication,
      sector,
      receivingFacility: receivingFacility || 'Primary Processing Terminal',
      deliveryLocation: deliveryLocation || 'Regional Rail Siding',
      coordinates: { lat: 41.8781, lng: -87.6298 },
      monthlyDemandTons,
      maxDeliveredPricePerTon: virginBaselineCostPerTon * 0.85,
      virginBaselineMaterial: virginBaselineMaterial || 'Standard Primary Feedstock',
      virginBaselineCostPerTon,
      virginBaselineEmissionsKgCO2e,
      deliveryCadence: 'Weekly bulk',
      requiredProperties: [
        { name: 'Primary Reactive Phase', min: 80.0, unit: '%', isHardRequirement: true },
        { name: 'Moisture / LOI Loss', max: 5.0, unit: '%', isHardRequirement: true },
      ],
      criticalContaminantLimits: [
        { name: 'Chloride Ion (Cl-)', maxLimit: 0.1, unit: '%', standard: 'EN 196-2' },
      ],
      mandatoryEvidence: ['Accredited ISO 17025 Assay', 'Safety Data Sheet'],
      createdDate: new Date().toISOString().split('T')[0],
      active: true,
    };

    onSaveSpec(newSpec);
  };

  return (
    <div className="glass-surface-elevated rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
      <div className="border-b border-black/5 dark:border-white/5 pb-4">
        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
          Engineering Specification Builder
        </span>
        <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
          Define Material Receiving Criteria
        </h3>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Specify exact chemical tolerances, virgin benchmark baselines, and non-negotiable hard barriers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">
              Specification Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Marine Port Concrete Pozzolan SCM"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-surface text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">
              Target Industrial Application *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Supplementary Cementitious Binder"
              value={targetApplication}
              onChange={(e) => setTargetApplication(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-surface text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">
              Industrial Sector
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value as IndustrialSector)}
              className="w-full px-3 py-2 rounded-xl glass-surface text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <option value="Construction" className="bg-zinc-900 text-white">Construction</option>
              <option value="Manufacturing" className="bg-zinc-900 text-white">Manufacturing</option>
              <option value="Mining & Metals" className="bg-zinc-900 text-white">Mining & Metals</option>
              <option value="Chemicals" className="bg-zinc-900 text-white">Chemicals</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">
              Monthly Off-take Demand (Tons)
            </label>
            <input
              type="number"
              min="50"
              max="50000"
              value={monthlyDemandTons}
              onChange={(e) => setMonthlyDemandTons(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl glass-surface text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">
              Delivery Point / Plant City
            </label>
            <input
              type="text"
              placeholder="e.g. Chicago Port Terminal"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-surface text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            />
          </div>
        </div>

        {/* Virgin Comparator Baseline */}
        <div className="p-4 rounded-2xl bg-black/10 dark:bg-white/5 space-y-3">
          <span className="font-semibold text-[var(--text-primary)] block">
            Virgin Baseline Comparator (For Delivered Cost & Carbon Offset Validation)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-[var(--text-secondary)] mb-1">
                Displaced Virgin Material
              </label>
              <input
                type="text"
                placeholder="e.g. Ordinary Portland Cement (CEM I)"
                value={virginBaselineMaterial}
                onChange={(e) => setVirginBaselineMaterial(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-surface text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[var(--text-secondary)] mb-1">
                Virgin Market Cost ($ / ton)
              </label>
              <input
                type="number"
                min="10"
                max="1000"
                value={virginBaselineCostPerTon}
                onChange={(e) => setVirginBaselineCostPerTon(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl glass-surface text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[var(--text-secondary)] mb-1">
                Virgin Embodied Carbon (kg CO2e / ton)
              </label>
              <input
                type="number"
                min="0"
                max="5000"
                value={virginBaselineEmissionsKgCO2e}
                onChange={(e) => setVirginBaselineEmissionsKgCO2e(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl glass-surface text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl glass-surface text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="glow-button-emerald px-5 py-2.5 rounded-xl font-semibold text-xs"
          >
            Save Receiving Specification
          </button>
        </div>
      </form>
    </div>
  );
};

/**
 * 7.4 MATCH ASSESSMENT MODAL / DETAILED DOSSIER VIEW
 */
export const MatchAssessmentModal: React.FC<{
  material: RegisteredMaterial;
  spec: BuyerSpecification;
  onClose: () => void;
  onInitiateEnquiry: (material: RegisteredMaterial, spec: BuyerSpecification) => void;
}> = ({ material, spec, onClose, onInitiateEnquiry }) => {
  const distanceKm = calculateHaversineDistance(
    material.coordinates.lat,
    material.coordinates.lng,
    spec.coordinates.lat,
    spec.coordinates.lng
  );

  const assessment = evaluateCandidateAgainstSpec(material, spec, distanceKm);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="glass-surface-floating rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <span>Explainable Deterministic Assessment</span>
            <span>•</span>
            <span>7-Step Verification</span>
          </div>
          <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
            {material.name} vs {spec.title}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Haulage distance: {distanceKm} km • Recipient site: {spec.deliveryLocation}
          </p>
        </div>

        {/* Verdict Banner */}
        <div
          className={`p-4 rounded-2xl border ${
            assessment.state === 'POTENTIAL_IDENTIFIED'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : assessment.state === 'TESTING_REQUIRED'
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
              : assessment.state === 'DATA_MISSING'
              ? 'bg-orange-500/10 border-orange-500/30 text-orange-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            {assessment.state === 'POTENTIAL_IDENTIFIED' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {assessment.state === 'TESTING_REQUIRED' && <HelpCircle className="w-5 h-5 text-blue-400" />}
            {assessment.state === 'DATA_MISSING' && <AlertTriangle className="w-5 h-5 text-orange-400" />}
            {assessment.state === 'UNSUITABLE_HARD_FAIL' && <XCircle className="w-5 h-5 text-red-400" />}
            <span>Verdict: {assessment.stateLabel}</span>
          </div>
          <p className="text-xs mt-1 leading-relaxed opacity-90">{assessment.actionRequired}</p>
        </div>

        {/* Property Comparison Table */}
        <div className="space-y-3">
          <h4 className="font-serif text-base font-semibold text-[var(--text-primary)]">
            1. Multi-Parameter Chemical & Physical Tolerance Matrix
          </h4>

          <div className="data-table-container rounded-xl border border-black/5 dark:border-white/5 overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-black/10 dark:bg-white/5 text-[10px] font-mono text-[var(--text-secondary)] uppercase">
                <tr>
                  <th className="p-3">Parameter</th>
                  <th className="p-3">Required Tolerance</th>
                  <th className="p-3">Documented Assay</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Evaluation Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {assessment.propertyEvaluations.map((p, idx) => (
                  <tr key={idx} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="p-3 font-semibold text-[var(--text-primary)]">{p.name}</td>
                    <td className="p-3 font-mono text-zinc-400">Engineering Bound</td>
                    <td className="p-3 font-mono font-medium text-[var(--text-primary)]">
                      {material.properties.find((mp) => mp.name.toLowerCase().includes(p.name.toLowerCase().split(' ')[0]))?.value ?? 'Unrecorded'}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          p.status === 'passed'
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : p.status === 'lab_needed'
                            ? 'text-blue-400 bg-blue-500/10'
                            : p.status === 'unknown'
                            ? 'text-orange-400 bg-orange-500/10'
                            : 'text-red-400 bg-red-500/10'
                        }`}
                      >
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-[var(--text-secondary)]">{p.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* True Cost & Carbon Visualizations Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CostWaterfallChart
            gatePrice={material.basePricePerTon}
            freightCost={assessment.economicDeliveredCost.freightCostPerTon}
            processingCost={12}
            qaCost={assessment.economicDeliveredCost.qaCostPerTon}
            totalDelivered={assessment.economicDeliveredCost.totalDeliveredCostPerTon}
            baselinePrice={spec.virginBaselineCostPerTon}
          />

          <CarbonBreakEvenChart
            distanceKm={distanceKm}
            breakEvenKm={assessment.environmentalImpact.breakEvenDistanceKm}
            netAvoidedCO2ePerTonKg={assessment.environmentalImpact.netAvoidedEmissionsKgCO2e}
          />
        </div>

        {/* Traceable Evidence & Modal Footer Actions */}
        <div className="pt-4 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[11px] text-[var(--text-secondary)]">
            Verified with Element Materials Laboratory ISO 17025 certificate hash.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl glass-surface text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onInitiateEnquiry(material, spec);
              }}
              className="glow-button-emerald px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Formal Technical Enquiry</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 7.5 CANDIDATE COMPARISON VIEW
 */
export const CandidateComparisonView: React.FC<{
  comparedMaterials: RegisteredMaterial[];
  activeSpec: BuyerSpecification;
  onRemoveFromCompare: (id: string) => void;
}> = ({ comparedMaterials, activeSpec, onRemoveFromCompare }) => {
  if (comparedMaterials.length === 0) {
    return (
      <div className="glass-surface rounded-2xl p-8 text-center space-y-3">
        <Scale className="w-10 h-10 text-zinc-500 mx-auto" />
        <h4 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
          No Candidates Selected for Side-by-Side Comparison
        </h4>
        <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
          Navigate to Material Discovery and check "Compare" on 2 or more materials to benchmark chemical assays, delivered costs, and net emissions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
            Candidate Benchmark Matrix
          </span>
          <h3 className="font-serif text-xl font-semibold text-[var(--text-primary)]">
            Side-by-Side Comparison ({comparedMaterials.length} Streams)
          </h3>
        </div>
        <span className="text-xs text-[var(--text-secondary)]">
          Target Spec: <strong>{activeSpec.title}</strong>
        </span>
      </div>

      <div className="data-table-container rounded-2xl glass-surface overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-black/10 dark:bg-white/5 text-[10px] font-mono text-[var(--text-secondary)] uppercase">
            <tr>
              <th className="p-4 w-1/4">Evaluation Dimension</th>
              {comparedMaterials.map((mat) => (
                <th key={mat.id} className="p-4 w-1/3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--text-primary)] text-xs">{mat.name}</span>
                    <button
                      onClick={() => onRemoveFromCompare(mat.id)}
                      className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
                      title="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            <tr>
              <td className="p-4 font-semibold text-[var(--text-secondary)]">Facility & Location</td>
              {comparedMaterials.map((m) => (
                <td key={m.id} className="p-4 text-[var(--text-primary)] font-medium">
                  {m.sourceFacility} ({m.locationCity})
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-[var(--text-secondary)]">Generation Frequency</td>
              {comparedMaterials.map((m) => (
                <td key={m.id} className="p-4 font-mono text-zinc-300">
                  {m.generationFrequency} ({m.monthlyVolumeTons} t/mo)
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-[var(--text-secondary)]">Evidence Dossier Status</td>
              {comparedMaterials.map((m) => (
                <td key={m.id} className="p-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/10 dark:bg-white/5 text-emerald-400">
                    {m.evidenceStatus}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-[var(--text-secondary)]">Origin Gate Base Price</td>
              {comparedMaterials.map((m) => (
                <td key={m.id} className="p-4 font-mono font-bold text-zinc-300">
                  ${m.basePricePerTon.toFixed(2)} / ton
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-[var(--text-secondary)]">Est. Delivered Cost</td>
              {comparedMaterials.map((m) => {
                const dist = calculateHaversineDistance(
                  m.coordinates.lat,
                  m.coordinates.lng,
                  activeSpec.coordinates.lat,
                  activeSpec.coordinates.lng
                );
                const evalResult = evaluateCandidateAgainstSpec(m, activeSpec, dist);
                return (
                  <td key={m.id} className="p-4 font-mono font-bold text-emerald-400 text-sm">
                    ${evalResult.economicDeliveredCost.totalDeliveredCostPerTon} / ton
                    <span className="block text-[10px] text-[var(--text-secondary)] font-normal">
                      ({dist} km haulage)
                    </span>
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-[var(--text-secondary)]">Net Carbon Avoided</td>
              {comparedMaterials.map((m) => {
                const dist = calculateHaversineDistance(
                  m.coordinates.lat,
                  m.coordinates.lng,
                  activeSpec.coordinates.lat,
                  activeSpec.coordinates.lng
                );
                const evalResult = evaluateCandidateAgainstSpec(m, activeSpec, dist);
                return (
                  <td key={m.id} className="p-4 font-mono font-bold text-teal-400">
                    {evalResult.environmentalImpact.netAvoidedEmissionsKgCO2e} kg CO2e / ton
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * 7.6 BUYER ENQUIRIES & OFFERS VIEW
 */
export const BuyerEnquiriesView: React.FC<{
  enquiries: EnquiryRecord[];
  offers: OfferRecord[];
  onAcceptOffer: (offerId: string) => void;
  onDeclineOffer: (offerId: string) => void;
}> = ({ enquiries, offers, onAcceptOffer, onDeclineOffer }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
            Traceable Commercial Workflow
          </span>
          <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
            Technical Enquiries & Formal Quotations
          </h3>
        </div>
      </div>

      {/* Received Offers Section */}
      <div className="space-y-3">
        <h4 className="font-serif text-base font-semibold text-[var(--text-primary)]">
          Incoming Supplier Quotations ({offers.length})
        </h4>

        {offers.length === 0 ? (
          <div className="p-4 rounded-xl glass-surface text-xs text-[var(--text-secondary)]">
            No active supplier quotes pending review.
          </div>
        ) : (
          <div className="space-y-3">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="glass-surface-elevated rounded-2xl p-5 border hover:border-emerald-500/30 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
                      Quotation #{offer.id} • Valid until {offer.validityExpiryDate}
                    </span>
                    <h5 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                      {offer.materialName} ({offer.offeredTonnage} tons)
                    </h5>
                    <span className="text-xs text-[var(--text-secondary)]">Issued by {offer.sellerOrg}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[var(--text-secondary)] block">Offered Delivered Price</span>
                    <span className="font-mono text-xl font-bold text-emerald-400">
                      ${offer.totalDeliveredPricePerTon.toFixed(2)} / ton
                    </span>
                    <span className="text-[10px] text-zinc-400 block font-mono">
                      (${offer.gatePricePerTon} gate + ${offer.estimatedFreightPerTon} freight)
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/10 dark:bg-white/5 text-xs text-[var(--text-secondary)]">
                  <strong>Commercial Terms:</strong> {offer.terms}
                </div>

                {offer.status === 'Pending Review' ? (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/5 dark:border-white/5">
                    <button
                      onClick={() => onDeclineOffer(offer.id)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold glass-surface text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Decline Offer
                    </button>
                    <button
                      onClick={() => onAcceptOffer(offer.id)}
                      className="glow-button-emerald px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accept & Execute Off-take Agreement</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-right text-xs font-mono font-bold text-emerald-400 pt-1">
                    Status: {offer.status.toUpperCase()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submitted Enquiries History */}
      <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5">
        <h4 className="font-serif text-base font-semibold text-[var(--text-primary)]">
          Submitted Buyer Enquiries ({enquiries.length})
        </h4>

        <div className="space-y-3">
          {enquiries.map((enq) => (
            <div key={enq.id} className="glass-surface rounded-2xl p-4 sm:p-5 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                    Enquiry #{enq.id} • {enq.inquiryDate}
                  </span>
                  <h5 className="font-semibold text-sm text-[var(--text-primary)]">
                    {enq.materialName} ({enq.requestedTonnage} tons)
                  </h5>
                  <span className="text-xs text-[var(--text-secondary)]">Sent to: {enq.sellerOrg}</span>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    enq.status === 'Offer Issued'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {enq.status.toUpperCase()}
                </span>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic bg-black/10 dark:bg-white/5 p-3 rounded-xl">
                "{enq.message}"
              </p>

              {enq.sellerNotes && (
                <div className="text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                  <strong>Seller Response:</strong> {enq.sellerNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
