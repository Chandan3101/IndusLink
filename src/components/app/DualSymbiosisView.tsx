/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Repeat,
  Factory,
  Layers,
  ArrowRight,
  TrendingDown,
  DollarSign,
  ShieldCheck,
  Plus,
  Send,
  CheckCircle2,
  MapPin,
  Activity,
} from 'lucide-react';
import type {
  RegisteredMaterial,
  BuyerSpecification,
  EnquiryRecord,
  OfferRecord,
  ClusterNode,
  AppNavTab,
} from '../../types/index.ts';
import { AnimatedHeading } from '../AnimatedHeading.tsx';

interface DualSymbiosisProps {
  materials: RegisteredMaterial[];
  buyerSpecs: BuyerSpecification[];
  enquiries: EnquiryRecord[];
  offers: OfferRecord[];
  clusterNodes: ClusterNode[];
  onNavigateTab: (tab: AppNavTab) => void;
  onOpenRegisterMaterial: () => void;
  onOpenCreateSpec: () => void;
}

export const DualSymbiosisView: React.FC<DualSymbiosisProps> = ({
  materials,
  buyerSpecs,
  enquiries,
  offers,
  clusterNodes,
  onNavigateTab,
  onOpenRegisterMaterial,
  onOpenCreateSpec,
}) => {
  const [activeSide, setActiveSide] = useState<'both' | 'outbound' | 'inbound'>('both');

  // Operational metrics
  const totalOutboundVolume = materials.reduce((acc, m) => acc + m.monthlyVolumeTons, 0);
  const totalInboundDemand = buyerSpecs.reduce((acc, s) => acc + s.monthlyDemandTons, 0);
  const activeOffersCount = offers.filter((o) => o.status === 'Pending Review').length;
  const activeEnquiriesCount = enquiries.filter((e) => e.status === 'Submitted' || e.status === 'Under Review').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <Repeat className="w-3.5 h-3.5" />
            <span>Integrated Dual Symbiosis Workspace</span>
          </div>
          <AnimatedHeading
            tag="h2"
            effect="unblurLines"
            className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]"
          >
            Closed-Loop Resource Management
          </AnimatedHeading>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Manage both secondary material supply streams and secondary raw material receiving requirements within a unified facility interface.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center p-1 rounded-xl glass-surface text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveSide('both')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSide === 'both'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Integrated View
          </button>
          <button
            onClick={() => setActiveSide('outbound')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSide === 'outbound'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Outbound Supply
          </button>
          <button
            onClick={() => setActiveSide('inbound')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSide === 'inbound'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Inbound Feedstock
          </button>
        </div>
      </div>

      {/* Operational Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-surface-elevated rounded-2xl p-4 sm:p-5 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Outbound Supply Volume</span>
            <Factory className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">
            {totalOutboundVolume.toLocaleString()} t/mo
          </div>
          <div className="text-[11px] text-zinc-400">
            Across {materials.length} registered byproduct streams
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-surface-elevated rounded-2xl p-4 sm:p-5 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Inbound Feedstock Demand</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">
            {totalInboundDemand.toLocaleString()} t/mo
          </div>
          <div className="text-[11px] text-zinc-400">
            Across {buyerSpecs.length} defined specifications
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-surface-elevated rounded-2xl p-4 sm:p-5 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Active Enquiries</span>
            <Send className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">
            {activeEnquiriesCount + activeOffersCount} Active
          </div>
          <div className="text-[11px] text-zinc-400">
            {activeEnquiriesCount} inbound · {activeOffersCount} quotations
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-surface-elevated rounded-2xl p-4 sm:p-5 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Facility Symbiosis Rate</span>
            <Activity className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            78.4%
          </div>
          <div className="text-[11px] text-zinc-400">
            Calculated circularity coefficient
          </div>
        </div>
      </div>

      {/* Dual Side-by-Side Columns */}
      <div className={`grid grid-cols-1 ${activeSide === 'both' ? 'lg:grid-cols-2' : ''} gap-6`}>
        {/* Outbound Streams (Seller side) */}
        {(activeSide === 'both' || activeSide === 'outbound') && (
          <div className="glass-surface-elevated rounded-3xl p-6 space-y-5 border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Factory className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                    Outbound Generated Streams (Supply)
                  </h3>
                  <span className="text-[11px] text-zinc-400">Byproducts ready for off-take</span>
                </div>
              </div>
              <button
                onClick={onOpenRegisterMaterial}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Stream</span>
              </button>
            </div>

            <div className="space-y-3">
              {materials.map((mat) => (
                <div
                  key={mat.id}
                  className="p-4 rounded-2xl glass-surface border border-white/5 space-y-2 hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-sm text-[var(--text-primary)]">{mat.name}</div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>{mat.sourceFacility}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {mat.monthlyVolumeTons} t/mo
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono text-zinc-400">
                    <span>Base Gate: ${mat.basePricePerTon}/t</span>
                    <span className="text-emerald-400">{mat.evidenceStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inbound Streams (Buyer side) */}
        {(activeSide === 'both' || activeSide === 'inbound') && (
          <div className="glass-surface-elevated rounded-3xl p-6 space-y-5 border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                    Inbound Feedstock Criteria (Demand)
                  </h3>
                  <span className="text-[11px] text-zinc-400">Receiving application specifications</span>
                </div>
              </div>
              <button
                onClick={onOpenCreateSpec}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 border border-blue-500/30 transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Define Criteria</span>
              </button>
            </div>

            <div className="space-y-3">
              {buyerSpecs.map((spec) => (
                <div
                  key={spec.id}
                  className="p-4 rounded-2xl glass-surface border border-white/5 space-y-2 hover:border-blue-500/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-sm text-[var(--text-primary)]">
                        {spec.targetApplication}
                      </div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-blue-400" />
                        <span>{spec.receivingFacility}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-blue-400">
                      {spec.monthlyDemandTons} t/mo
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono text-zinc-400">
                    <span>Ceiling Delivered: ${spec.maxDeliveredPricePerTon}/t</span>
                    <span>Replaces: {spec.virginBaselineMaterial}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
