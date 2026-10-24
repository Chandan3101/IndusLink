/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowRight, Info, CheckCircle2, AlertTriangle, Scale, Truck, Leaf, Activity } from 'lucide-react';
import { CLUSTER_SYNERGY_NODES } from '../../data/mockData.ts';

/**
 * 1. Industrial Resource Network Graph
 */
export const IndustrialNetworkGraph: React.FC<{
  onSelectNode?: (nodeId: string) => void;
  selectedNodeId?: string;
}> = ({ onSelectNode, selectedNodeId }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes = [
    { id: 'node-cogen', x: 120, y: 90, label: 'Apex Cogen', sub: 'Biomass Energy', color: '#10b981' },
    { id: 'node-steel', x: 380, y: 70, label: 'Great Lakes Steel', sub: 'Slag Generator', color: '#3b82f6' },
    { id: 'node-cement', x: 260, y: 220, label: 'Holcim Terminal', sub: 'Pozzolan Off-taker', color: '#8b5cf6' },
    { id: 'node-foundry', x: 80, y: 290, label: 'Midwest Foundry', sub: 'Molding Sand', color: '#f59e0b' },
    { id: 'node-paving', x: 390, y: 310, label: 'Asphalt Paving', sub: 'Sub-base Off-taker', color: '#ec4899' },
  ];

  const links = [
    { from: 'node-cogen', to: 'node-cement', stream: 'Rice Husk Ash (85 km)', color: '#10b981' },
    { from: 'node-steel', to: 'node-cement', stream: 'GGBFS Slag (140 km)', color: '#3b82f6' },
    { from: 'node-foundry', to: 'node-paving', stream: 'Spent Sand (60 km)', color: '#f59e0b' },
    { from: 'node-cogen', to: 'node-steel', stream: 'Process Steam', color: '#60a5fa' },
  ];

  return (
    <div className="relative w-full rounded-2xl glass-surface p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-black/5 dark:border-white/5">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#10b981] block">
            Multi-Facility Resource Flow Topography
          </span>
          <h4 className="font-serif text-sm font-semibold text-[var(--text-primary)]">
            Industrial Resource Network
          </h4>
        </div>
        <span className="text-[10px] font-mono text-[var(--text-secondary)]">
          4 Active Exchanges • 2 Planned
        </span>
      </div>

      <div className="relative w-full aspect-[16/9] min-h-[260px] bg-slate-900/90 dark:bg-black/40 border border-slate-800/40 dark:border-white/5 rounded-xl overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 480 360" className="w-full h-full select-none">
          <defs>
            <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Links */}
          {links.map((link, idx) => {
            const source = nodes.find((n) => n.id === link.from)!;
            const target = nodes.find((n) => n.id === link.to)!;
            const isHovered = hoveredNode === link.from || hoveredNode === link.to;

            return (
              <g key={idx}>
                {/* Connecting Line */}
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={isHovered ? '#10b981' : link.color}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  strokeDasharray="4 3"
                  opacity={isHovered ? 0.9 : 0.45}
                  className="transition-all duration-300"
                />
                {/* Flow animation packet */}
                <circle r="3.5" fill="#ffffff" filter="url(#glowFilter)">
                  <animateMotion
                    path={`M ${source.x} ${source.y} L ${target.x} ${target.y}`}
                    dur={`${2.8 + idx * 0.4}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredNode === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer group"
                onClick={() => onSelectNode?.(node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Pulse Ring */}
                {(isSelected || isHovered) && (
                  <circle
                    r="24"
                    fill="none"
                    stroke={node.color}
                    strokeWidth="1.5"
                    opacity="0.4"
                    className="animate-ping"
                  />
                )}
                {/* Outer Ring */}
                <circle
                  r={isSelected ? 18 : 15}
                  fill="rgba(11, 13, 17, 0.9)"
                  stroke={isSelected ? '#ffffff' : node.color}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  filter="url(#glowFilter)"
                  className="transition-all duration-200"
                />
                {/* Center Core */}
                <circle r="5" fill={node.color} />
                {/* Label text */}
                <text
                  y={isSelected ? 28 : 25}
                  textAnchor="middle"
                  className="font-sans text-[10px] font-semibold fill-white drop-shadow"
                >
                  {node.label}
                </text>
                <text
                  y={isSelected ? 39 : 36}
                  textAnchor="middle"
                  className="font-mono text-[8px] fill-zinc-400"
                >
                  {node.sub}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 text-[11px] text-[var(--text-secondary)] border-t border-black/5 dark:border-white/5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" /> Generator
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" /> Receiver
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#3b82f6]" /> Prosumer
          </span>
        </div>
        <span className="font-mono text-[10px]">Deterministic route distance calculations</span>
      </div>
    </div>
  );
};

/**
 * 2. Delivered Cost Waterfall Chart
 */
export const CostWaterfallChart: React.FC<{
  gatePrice: number;
  freightCost: number;
  processingCost: number;
  qaCost: number;
  totalDelivered: number;
  baselinePrice: number;
}> = ({ gatePrice, freightCost, processingCost, qaCost, totalDelivered, baselinePrice }) => {
  const savings = baselinePrice - totalDelivered;
  const maxVal = Math.max(baselinePrice, totalDelivered) * 1.15;

  const steps = [
    { label: 'Origin Gate', cost: gatePrice, running: gatePrice, color: 'bg-zinc-500' },
    { label: 'Freight (85 km)', cost: freightCost, running: gatePrice + freightCost, color: 'bg-blue-500' },
    { label: 'Conditioning', cost: processingCost, running: gatePrice + freightCost + processingCost, color: 'bg-amber-500' },
    { label: 'Batch QA', cost: qaCost, running: totalDelivered, color: 'bg-emerald-600' },
  ];

  return (
    <div className="glass-surface rounded-2xl p-4">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-black/5 dark:border-white/5">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#10b981] block">
            True Cost Engine Breakdown
          </span>
          <h4 className="font-serif text-sm font-semibold text-[var(--text-primary)]">
            Delivered Cost per Metric Ton vs Virgin Baseline
          </h4>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full font-mono text-[11px] font-bold ${
            savings > 0
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}
        >
          {savings > 0 ? `-$${savings.toFixed(2)}/t Net Margin` : `+$${Math.abs(savings).toFixed(2)}/t Premium`}
        </span>
      </div>

      <div className="space-y-3">
        {/* Waterfall Components */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {steps.map((s, idx) => (
            <div key={idx} className="p-2 rounded-xl bg-black/10 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <span className="text-[10px] text-[var(--text-secondary)] block truncate">{s.label}</span>
              <span className="font-mono text-xs font-bold text-[var(--text-primary)] block mt-0.5">
                ${s.cost.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Comparative Bars */}
        <div className="space-y-2 pt-2">
          {/* Delivered Cost Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-[var(--text-secondary)]">Total Delivered Cost</span>
              <span className="font-mono text-emerald-400 font-bold">${totalDelivered.toFixed(2)} / ton</span>
            </div>
            <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${(totalDelivered / maxVal) * 100}%` }}
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
              />
            </div>
          </div>

          {/* Virgin Baseline Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-[var(--text-secondary)]">Virgin Primary Benchmark (OPC CEM I)</span>
              <span className="font-mono text-zinc-400">${baselinePrice.toFixed(2)} / ton</span>
            </div>
            <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${(baselinePrice / maxVal) * 100}%` }}
                className="h-full bg-zinc-600 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-[var(--text-secondary)] mt-3 pt-2 border-t border-black/5 dark:border-white/5">
        *Amortizes $400 accredited ISO 17025 batch testing fee across 100 t minimum shipment with 85 km backhaul freight rate ($0.18/t-km).
      </p>
    </div>
  );
};

/**
 * 3. Net Environmental Break-Even Radius Chart
 */
export const CarbonBreakEvenChart: React.FC<{
  distanceKm: number;
  breakEvenKm: number;
  netAvoidedCO2ePerTonKg: number;
}> = ({ distanceKm, breakEvenKm, netAvoidedCO2ePerTonKg }) => {
  const percentage = Math.min(100, Math.round((distanceKm / breakEvenKm) * 100));

  return (
    <div className="glass-surface rounded-2xl p-4">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/5 dark:border-white/5">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#10b981] block">
            ISO 14044 Lifecycle Scenario
          </span>
          <h4 className="font-serif text-sm font-semibold text-[var(--text-primary)]">
            Haulage Distance vs Net Emissions Break-Even
          </h4>
        </div>
        <span className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          {netAvoidedCO2ePerTonKg > 0 ? `-${netAvoidedCO2ePerTonKg} kg CO2e / ton` : 'Neutral'}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-[var(--text-secondary)]">Current Distance ({distanceKm} km)</span>
          <span className="font-mono text-xs text-[var(--text-secondary)]">
            Break-Even Ceiling: <strong className="text-[var(--text-primary)]">{breakEvenKm.toLocaleString()} km</strong>
          </span>
        </div>

        {/* Visual Track */}
        <div className="relative w-full h-4 bg-black/25 rounded-full overflow-hidden p-0.5">
          <div
            style={{ width: `${Math.max(4, percentage)}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[10px]">
          <div className="p-2 rounded-lg bg-black/10 dark:bg-white/5">
            <span className="text-[var(--text-secondary)] block">Displaced Virgin Kiln</span>
            <span className="font-mono font-bold text-emerald-400">-720 kg CO2e</span>
          </div>
          <div className="p-2 rounded-lg bg-black/10 dark:bg-white/5">
            <span className="text-[var(--text-secondary)] block">Pre-processing Energy</span>
            <span className="font-mono font-bold text-amber-400">+58 kg CO2e</span>
          </div>
          <div className="p-2 rounded-lg bg-black/10 dark:bg-white/5">
            <span className="text-[var(--text-secondary)] block">Transport Burden</span>
            <span className="font-mono font-bold text-blue-400">+{(distanceKm * 0.082).toFixed(1)} kg CO2e</span>
          </div>
        </div>
      </div>
    </div>
  );
};
