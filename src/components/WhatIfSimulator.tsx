/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WhatIfParameters } from '../types/index.ts';
import { calculateWhatIfScenario } from '../utils/evaluationEngine.ts';
import { Sliders, RotateCcw, TrendingDown, DollarSign, Leaf, Gauge, AlertCircle } from 'lucide-react';

const DEFAULT_PARAMS: WhatIfParameters = {
  distanceKm: 85,
  preprocessingCostPerTon: 18,
  annualTonnage: 4500,
};

export const WhatIfSimulator: React.FC = () => {
  const [params, setParams] = useState<WhatIfParameters>(DEFAULT_PARAMS);

  const results = calculateWhatIfScenario(params);

  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
  };

  return (
    <div className="glass-surface-elevated rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden transition-all duration-300">
      {/* Top red accent glow line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#9D1738] to-transparent opacity-80" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-[#9D1738] dark:text-[#E899AA] uppercase mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Feasibility Exploration</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#15161A] dark:text-[#F8FAFC]">
            What-If Scenario Simulator
          </h3>
          <p className="text-xs sm:text-sm text-[#61646E] dark:text-[#94A3B8] max-w-xl mt-1">
            Simulate how haulage distance, conditioning costs, and batch volume shift delivered economics and net carbon abatement.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="min-h-11 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#61646E] dark:text-[#94A3B8] hover:text-[#15161A] dark:hover:text-[#F8FAFC] border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors self-start md:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738]"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders Input Rail (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-4 rounded-2xl glass-surface space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#15161A] dark:text-[#F8FAFC] flex items-center justify-between">
              <span>Simulation Controls</span>
              <span className="text-[11px] font-mono text-[#9D1738] dark:text-[#E899AA]">Hypothetical Variables</span>
            </div>

            {/* Slider 1: Distance */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="text-[#61646E] dark:text-[#94A3B8] font-medium">One-Way Haulage Distance</label>
                <span className="font-mono font-bold text-[#15161A] dark:text-[#F8FAFC] text-sm">
                  {params.distanceKm} km
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="600"
                step="5"
                value={params.distanceKm}
                onChange={(e) => setParams({ ...params, distanceKm: Number(e.target.value) })}
                className="w-full accent-[#9D1738] cursor-pointer"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-1 text-[10px] font-mono text-[#8E919B] leading-snug">
                <span>10 km (Local)</span>
                <span>300 km (Regional)</span>
                <span>600 km (Inter-State)</span>
              </div>
            </div>

            {/* Slider 2: Preprocessing Cost */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="text-[#61646E] dark:text-[#94A3B8] font-medium">Pre-Treatment & Conditioning</label>
                <span className="font-mono font-bold text-[#15161A] dark:text-[#F8FAFC] text-sm">
                  ${params.preprocessingCostPerTon} / ton
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="75"
                step="1"
                value={params.preprocessingCostPerTon}
                onChange={(e) => setParams({ ...params, preprocessingCostPerTon: Number(e.target.value) })}
                className="w-full accent-[#9D1738] cursor-pointer"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-1 text-[10px] font-mono text-[#8E919B] leading-snug">
                <span>$0 (As-is)</span>
                <span>$35 (Drying / Micronizing)</span>
                <span>$75 (High Beneficiation)</span>
              </div>
            </div>

            {/* Slider 3: Annual Volume */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="text-[#61646E] dark:text-[#94A3B8] font-medium">Annual Material Exchange Volume</label>
                <span className="font-mono font-bold text-[#15161A] dark:text-[#F8FAFC] text-sm">
                  {params.annualTonnage.toLocaleString()} tons / yr
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="25000"
                step="500"
                value={params.annualTonnage}
                onChange={(e) => setParams({ ...params, annualTonnage: Number(e.target.value) })}
                className="w-full accent-[#9D1738] cursor-pointer"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-1 text-[10px] font-mono text-[#8E919B] leading-snug">
                <span>500 t (Batch Pilot)</span>
                <span>10,000 t (Commercial)</span>
                <span>25,000 t (Base-Load)</span>
              </div>
            </div>
          </div>

          {/* Model Constraints Notice */}
          <div className="p-3.5 rounded-xl border border-amber-600/30 bg-amber-500/5 text-xs text-amber-900 dark:text-amber-200/90 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Assumed Baseline Parameters:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Assumes virgin primary feedstock baseline of $90/ton and 720 kg CO2e/t clinker equivalent. Road freight modeled at $0.18/t-km with $3.50/t amortized ISO 17025 QA testing overhead.
            </p>
          </div>
        </div>

        {/* Live Calculation Glass Results (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* KPI 1: Delivered Cost per Ton */}
            <div className="p-5 rounded-2xl glass-surface relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#61646E] dark:text-[#94A3B8] mb-2">
                <span className="uppercase font-mono text-[10px]">Delivered Price</span>
                <DollarSign className="w-4 h-4 text-[#C9AA79]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-[#15161A] dark:text-[#F8FAFC]">
                  ${results.totalDeliveredCostPerTon.toFixed(2)}
                  <span className="text-xs font-normal text-[#8E919B] ml-1">/ ton</span>
                </div>
                <div className="text-xs mt-1">
                  {results.isEconomicallyViable ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      -${Math.abs(results.netDeliveredSavingsPerTon).toFixed(2)} vs virgin baseline
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      +${Math.abs(results.netDeliveredSavingsPerTon).toFixed(2)} cost penalty
                    </span>
                  )}
                </div>
              </div>
              <div className="text-[11px] text-[#8E919B] pt-2 border-t border-black/5 dark:border-white/5 mt-3">
                Freight: ${results.freightCostPerTon} · Prep: ${params.preprocessingCostPerTon} · QA: $3.50
              </div>
            </div>

            {/* KPI 2: Annual Economic Delta */}
            <div className="p-5 rounded-2xl glass-surface relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#61646E] dark:text-[#94A3B8] mb-2">
                <span className="uppercase font-mono text-[10px]">Annual Financial Impact</span>
                <TrendingDown className="w-4 h-4 text-[#9D1738]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-[#15161A] dark:text-[#F8FAFC]">
                  {results.grossAnnualEconomicDelta >= 0 ? '+' : ''}$
                  {(results.grossAnnualEconomicDelta / 1000).toFixed(1)}k
                  <span className="text-xs font-normal text-[#8E919B] ml-1">/ yr</span>
                </div>
                <div className="text-xs mt-1 text-[#61646E] dark:text-[#94A3B8]">
                  Across {params.annualTonnage.toLocaleString()} metric tons delivered
                </div>
              </div>
              <div className="text-[11px] text-[#8E919B] pt-2 border-t border-black/5 dark:border-white/5 mt-3">
                Status: {results.isEconomicallyViable ? 'Economically Justified' : 'Cost Non-Viable'}
              </div>
            </div>

            {/* KPI 3: Net Avoided CO2e */}
            <div className="p-5 rounded-2xl glass-surface relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#61646E] dark:text-[#94A3B8] mb-2">
                <span className="uppercase font-mono text-[10px]">Carbon Abatement</span>
                <Leaf className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-[#15161A] dark:text-[#F8FAFC]">
                  {results.netAvoidedCO2ePerTonKg > 0 ? '+' : ''}
                  {results.netAvoidedCO2ePerTonKg.toFixed(0)}
                  <span className="text-xs font-normal text-[#8E919B] ml-1">kg CO2e / t</span>
                </div>
                <div className="text-xs mt-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  {results.annualNetCO2eDeltaTons.toLocaleString()} t CO2e total net savings / yr
                </div>
              </div>
              <div className="text-[11px] text-[#8E919B] pt-2 border-t border-black/5 dark:border-white/5 mt-3">
                Transport footprint: {results.transportEmissionsPerTonKg} kg CO2e / t
              </div>
            </div>

            {/* KPI 4: Haulage Break-Even Limit */}
            <div className="p-5 rounded-2xl glass-surface relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#61646E] dark:text-[#94A3B8] mb-2">
                <span className="uppercase font-mono text-[10px]">Carbon Break-Even Distance</span>
                <Gauge className="w-4 h-4 text-[#91AAB8]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-[#15161A] dark:text-[#F8FAFC]">
                  {results.breakEvenDistanceKm}
                  <span className="text-xs font-normal text-[#8E919B] ml-1">km radius</span>
                </div>
                <div className="text-xs mt-1 text-[#61646E] dark:text-[#94A3B8]">
                  Distance where freight footprint cancels savings
                </div>
              </div>
              <div className="text-[11px] text-[#8E919B] pt-2 border-t border-black/5 dark:border-white/5 mt-3">
                Current haulage: {((params.distanceKm / results.breakEvenDistanceKm) * 100).toFixed(0)}% of ceiling
              </div>
            </div>
          </div>

          {/* Transparent Formula Bar */}
          <div className="p-4 rounded-xl glass-surface text-xs space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#9D1738] dark:text-[#E899AA] block font-semibold">
              Delivered Cost Formula
            </span>
            <div className="font-mono text-[11px] text-[#15161A] dark:text-[#F8FAFC] bg-black/[0.03] dark:bg-white/[0.04] p-2.5 rounded-lg break-words">
              DeliveredCost = GatePrice($15) + (Distance({params.distanceKm}km) × $0.18) + Prep(${params.preprocessingCostPerTon}) + QA($3.50) = ${results.totalDeliveredCostPerTon}/t
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
