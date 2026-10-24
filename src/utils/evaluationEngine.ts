/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConnectionState } from '../types/index.ts';

export interface PropertyEvaluationInput {
  name: string;
  min?: number;
  max?: number;
  val?: number | null;
  isHardRequirement: boolean;
  requiresLabVerification?: boolean;
}

export interface PropertyEvaluationResult {
  name: string;
  status: 'passed' | 'failed' | 'unknown' | 'lab_needed';
  isHardRequirement: boolean;
  message: string;
}

export interface DeliveredCostParams {
  baseMaterialPricePerTon: number;
  distanceKm: number;
  freightRatePerTonKm: number;
  preprocessingCostPerTon: number;
  qaTestingCostPerBatch: number;
  batchSizeTons: number;
  baselinePrimaryMaterialCostPerTon: number;
}

export interface DeliveredCostResult {
  freightCostPerTon: number;
  qaCostPerTon: number;
  totalDeliveredCostPerTon: number;
  deltaCostPerTon: number; // delivered - baseline (negative means savings)
  isEconomicallyViable: boolean;
}

export interface CarbonImpactParams {
  baselineEmissionsKgCO2e: number; // Emissions from using virgin primary material
  reuseProcessingEmissionsKgCO2e: number; // Emissions from preparing byproduct
  transportEmissionFactorKgPerTonKm: number; // e.g. 0.08 kg CO2e / ton-km for heavy freight
  distanceKm: number;
}

export interface CarbonImpactResult {
  transportEmissionsKgCO2e: number;
  totalReuseEmissionsKgCO2e: number;
  netAvoidedEmissionsKgCO2e: number; // baseline - totalReuse (positive means climate benefit)
  isEnvironmentallyBeneficial: boolean;
  breakEvenDistanceKm: number; // distance at which transport emissions cancel out benefits
}

/**
 * Evaluates a single technical material property against receiving specification bounds.
 */
export function evaluateProperty(input: PropertyEvaluationInput): PropertyEvaluationResult {
  if (input.val === null || input.val === undefined || Number.isNaN(input.val)) {
    return {
      name: input.name,
      status: 'unknown',
      isHardRequirement: input.isHardRequirement,
      message: 'Critical parameter unrecorded; batch assay or documentation missing.',
    };
  }

  if (input.requiresLabVerification) {
    return {
      name: input.name,
      status: 'lab_needed',
      isHardRequirement: input.isHardRequirement,
      message: 'Documented value within preliminary bounds, but standard mandates third-party laboratory verification.',
    };
  }

  if (input.min !== undefined && input.val < input.min) {
    return {
      name: input.name,
      status: 'failed',
      isHardRequirement: input.isHardRequirement,
      message: `Value ${input.val} fails minimum specification threshold of ${input.min}.`,
    };
  }

  if (input.max !== undefined && input.val > input.max) {
    return {
      name: input.name,
      status: 'failed',
      isHardRequirement: input.isHardRequirement,
      message: `Value ${input.val} exceeds maximum tolerance ceiling of ${input.max}.`,
    };
  }

  return {
    name: input.name,
    status: 'passed',
    isHardRequirement: input.isHardRequirement,
    message: `Value ${input.val} satisfies engineering tolerance window.`,
  };
}

/**
 * Calculates true delivered cost per ton accounting for haulage, batch QA, and preprocessing.
 */
export function calculateDeliveredCost(params: DeliveredCostParams): DeliveredCostResult {
  const freightCostPerTon = params.distanceKm * params.freightRatePerTonKm;
  const qaCostPerTon = params.batchSizeTons > 0 ? params.qaTestingCostPerBatch / params.batchSizeTons : 0;
  const totalDeliveredCostPerTon =
    params.baseMaterialPricePerTon +
    freightCostPerTon +
    params.preprocessingCostPerTon +
    qaCostPerTon;

  const deltaCostPerTon = totalDeliveredCostPerTon - params.baselinePrimaryMaterialCostPerTon;
  const isEconomicallyViable = totalDeliveredCostPerTon < params.baselinePrimaryMaterialCostPerTon;

  return {
    freightCostPerTon: Math.round(freightCostPerTon * 100) / 100,
    qaCostPerTon: Math.round(qaCostPerTon * 100) / 100,
    totalDeliveredCostPerTon: Math.round(totalDeliveredCostPerTon * 100) / 100,
    deltaCostPerTon: Math.round(deltaCostPerTon * 100) / 100,
    isEconomicallyViable,
  };
}

/**
 * Calculates net environmental impact against a defined virgin material baseline.
 */
export function calculateCarbonImpact(params: CarbonImpactParams): CarbonImpactResult {
  const transportEmissionsKgCO2e = params.distanceKm * params.transportEmissionFactorKgPerTonKm;
  const totalReuseEmissionsKgCO2e = params.reuseProcessingEmissionsKgCO2e + transportEmissionsKgCO2e;
  const netAvoidedEmissionsKgCO2e = params.baselineEmissionsKgCO2e - totalReuseEmissionsKgCO2e;

  // Break-even distance where transport emissions would wipe out process savings
  const allowableTransportEmissions = params.baselineEmissionsKgCO2e - params.reuseProcessingEmissionsKgCO2e;
  const breakEvenDistanceKm =
    allowableTransportEmissions > 0 && params.transportEmissionFactorKgPerTonKm > 0
      ? Math.round(allowableTransportEmissions / params.transportEmissionFactorKgPerTonKm)
      : 0;

  return {
    transportEmissionsKgCO2e: Math.round(transportEmissionsKgCO2e * 100) / 100,
    totalReuseEmissionsKgCO2e: Math.round(totalReuseEmissionsKgCO2e * 100) / 100,
    netAvoidedEmissionsKgCO2e: Math.round(netAvoidedEmissionsKgCO2e * 100) / 100,
    isEnvironmentallyBeneficial: netAvoidedEmissionsKgCO2e > 0,
    breakEvenDistanceKm,
  };
}

/**
 * Classifies the evidence-aware connection state.
 * IndusLink fundamental principle: never assume match without proof.
 */
export function determineConnectionState(results: PropertyEvaluationResult[]): ConnectionState {
  // 1. Any hard requirement failure immediately renders the exchange unsuitable
  const hasHardFailure = results.some((r) => r.isHardRequirement && r.status === 'failed');
  if (hasHardFailure) {
    return 'UNSUITABLE_HARD_FAIL';
  }

  // 2. Any missing data for critical parameters blocks compatibility verification
  const hasMissingData = results.some((r) => r.status === 'unknown');
  if (hasMissingData) {
    return 'DATA_MISSING';
  }

  // 3. Any outstanding lab verification requirements
  const hasLabPending = results.some((r) => r.status === 'lab_needed');
  if (hasLabPending) {
    return 'TESTING_REQUIRED';
  }

  // 4. Non-critical failures or partial fits
  const hasAnyFailure = results.some((r) => r.status === 'failed');
  if (hasAnyFailure) {
    return 'COMPATIBILITY_UNVERIFIED';
  }

  // 5. All parameters evaluated and satisfied
  return 'POTENTIAL_IDENTIFIED';
}

/**
 * Calculates normalized scroll progress ratio (0 to 1).
 */
export function calculateScrollProgress(scrollY: number, scrollHeight: number, clientHeight: number): number {
  const maxScroll = scrollHeight - clientHeight;
  if (maxScroll <= 0) return 0;
  return Math.min(1, Math.max(0, scrollY / maxScroll));
}

import { WhatIfParameters, WhatIfResults } from '../types/index.ts';

/**
 * Calculates What-If economic and carbon scenario metrics transparently.
 */
export function calculateWhatIfScenario(params: WhatIfParameters): WhatIfResults {
  const freightRatePerTonKm = 0.18;
  const baseGatePrice = 15;
  const qaCostPerTon = 3.5;
  const baselineCostPerTon = 90;

  const freightCostPerTon = Math.round(params.distanceKm * freightRatePerTonKm * 100) / 100;
  const totalDeliveredCostPerTon =
    Math.round((baseGatePrice + freightCostPerTon + params.preprocessingCostPerTon + qaCostPerTon) * 100) / 100;
  const netDeliveredSavingsPerTon = Math.round((baselineCostPerTon - totalDeliveredCostPerTon) * 100) / 100;
  const grossAnnualEconomicDelta = Math.round(netDeliveredSavingsPerTon * params.annualTonnage);

  // Carbon metrics
  const transportEmissionFactor = 0.082; // kg CO2e / ton-km
  const baselineVirginEmissions = 720; // kg CO2e / ton virgin primary feedstock
  const processEmissions = Math.round(params.preprocessingCostPerTon * 1.6 * 10) / 10;
  const transportEmissionsPerTonKg = Math.round(params.distanceKm * transportEmissionFactor * 10) / 10;
  const netAvoidedCO2ePerTonKg =
    Math.round((baselineVirginEmissions - (transportEmissionsPerTonKg + processEmissions)) * 10) / 10;
  const annualNetCO2eDeltaTons = Math.round((netAvoidedCO2ePerTonKg * params.annualTonnage) / 1000);

  const allowableTransportKg = baselineVirginEmissions - processEmissions;
  const breakEvenDistanceKm =
    allowableTransportKg > 0 ? Math.round(allowableTransportKg / transportEmissionFactor) : 0;

  return {
    freightCostPerTon,
    totalDeliveredCostPerTon,
    baselineCostPerTon,
    netDeliveredSavingsPerTon,
    grossAnnualEconomicDelta,
    transportEmissionsPerTonKg,
    netAvoidedCO2ePerTonKg,
    annualNetCO2eDeltaTons,
    breakEvenDistanceKm,
    isEconomicallyViable: netDeliveredSavingsPerTon > 0,
    isCarbonFavorable: netAvoidedCO2ePerTonKg > 0,
  };
}


