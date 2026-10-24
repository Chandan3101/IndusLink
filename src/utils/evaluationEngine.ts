/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ConnectionState } from '../types/index.ts';

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

import type { WhatIfParameters, WhatIfResults } from '../types/index.ts';

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

import type {
  RegisteredMaterial,
  BuyerSpecification,
  MaterialBatch,
  ClusterNode,
} from '../types/index.ts';

/**
 * Calculates straight-line great-circle distance between two geographic coordinates in kilometers.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export interface DetailedCandidateAssessment {
  state: ConnectionState;
  stateLabel: string;
  isHardConstraintViolated: boolean;
  missingCriticalProperties: string[];
  pendingLabStandards: string[];
  propertyEvaluations: PropertyEvaluationResult[];
  economicDeliveredCost: DeliveredCostResult;
  environmentalImpact: CarbonImpactResult;
  decisionExplanation: string[];
  actionRequired: string;
}

/**
 * Evaluates candidate material against buyer specification using 7-step deterministic pipeline.
 */
export function evaluateCandidateAgainstSpec(
  material: RegisteredMaterial,
  spec: BuyerSpecification,
  distanceKm: number
): DetailedCandidateAssessment {
  const propertyEvaluations: PropertyEvaluationResult[] = [];
  const missingCritical: string[] = [];
  const pendingStandards: string[] = [];
  const explanation: string[] = [];

  // Step 1: Evaluate required chemical and physical bounds
  spec.requiredProperties.forEach((req) => {
    const reqName = req.name.toLowerCase();
    const matProp = material.properties.find((p) => {
      const pName = p.name.toLowerCase();
      return pName === reqName || pName.includes(reqName) || reqName.includes(pName);
    });
    const val = matProp?.value ?? null;
    const isLabPending =
      matProp?.value === null &&
      matProp.testStandard.toLowerCase().includes('xrd');

    const result = evaluateProperty({
      name: req.name,
      min: req.min,
      max: req.max,
      val,
      isHardRequirement: req.isHardRequirement,
      requiresLabVerification: isLabPending,
    });

    propertyEvaluations.push(result);

    if (result.status === 'unknown') {
      missingCritical.push(`${req.name} (${req.requiredStandard || 'Assay needed'})`);
    } else if (result.status === 'lab_needed') {
      pendingStandards.push(`${req.name} (${req.requiredStandard || 'Laboratory proof required'})`);
    }
  });

  // Step 2: Evaluate critical contaminants
  spec.criticalContaminantLimits.forEach((contaminant) => {
    const cName = contaminant.name.toLowerCase();
    const matProp = material.properties.find((p) => {
      const pName = p.name.toLowerCase();
      return (
        (pName.includes('radium') && cName.includes('rad')) ||
        (pName.includes('chloride') && cName.includes('chlor')) ||
        (pName.includes('lead') && cName.includes('lead')) ||
        (pName.includes('cadmium') && cName.includes('cad')) ||
        pName === cName ||
        pName.includes(cName) ||
        cName.includes(pName)
      );
    });
    const val = matProp?.value ?? null;
    if (val !== null && val > contaminant.maxLimit) {
      propertyEvaluations.push({
        name: contaminant.name,
        status: 'failed',
        isHardRequirement: true,
        message: `Contaminant value ${val} ${contaminant.unit} exceeds statutory/technical limit of ${contaminant.maxLimit} ${contaminant.unit}.`,
      });
    }
  });

  // Step 3: Compute Delivered Economics
  const economicDeliveredCost = calculateDeliveredCost({
    baseMaterialPricePerTon: material.basePricePerTon,
    distanceKm,
    freightRatePerTonKm: 0.18,
    preprocessingCostPerTon: 12,
    qaTestingCostPerBatch: 400,
    batchSizeTons: 100,
    baselinePrimaryMaterialCostPerTon: spec.virginBaselineCostPerTon,
  });

  // Step 4: Compute Environmental Scenario
  const environmentalImpact = calculateCarbonImpact({
    baselineEmissionsKgCO2e: spec.virginBaselineEmissionsKgCO2e,
    reuseProcessingEmissionsKgCO2e: 45,
    transportEmissionFactorKgPerTonKm: 0.082,
    distanceKm,
  });

  // Step 5: Determine Connection State
  const state = determineConnectionState(propertyEvaluations);

  let stateLabel = 'Potential Application Identified';
  let actionRequired = 'Proceed with commercial sampling protocol and logistics scheduling.';

  if (state === 'UNSUITABLE_HARD_FAIL') {
    stateLabel = 'Application Unsuitable (Hard Requirement Failed)';
    actionRequired = 'Hard barrier breached; reject candidate or evaluate alternative low-spec applications.';
    explanation.push('Critical chemical ceiling or safety boundary exceeded; disqualifies usage without major beneficiation.');
  } else if (state === 'DATA_MISSING') {
    stateLabel = 'Critical Material Data Missing';
    actionRequired = `Dossier incomplete: ${missingCritical.join(', ')}. Upload accredited assays before re-evaluating.`;
    explanation.push('Unknown Data Guard engaged: Algorithmic approval frozen because essential engineering bounds lack assay evidence.');
  } else if (state === 'TESTING_REQUIRED') {
    stateLabel = 'Additional Laboratory Testing Required';
    actionRequired = `Pending physical standard testing: ${pendingStandards.join(', ')}.`;
    explanation.push('Preliminary parameters comply with ranges, but certified lab verification (e.g. XRD crystalline scan) is pending.');
  } else if (state === 'COMPATIBILITY_UNVERIFIED') {
    stateLabel = 'Compatibility Not Yet Verified';
    actionRequired = 'Verify non-critical property tolerances with facility process engineer.';
    explanation.push('Minor tolerance deviations noted; secondary parameter verification required.');
  } else {
    explanation.push('All documented parameters satisfy engineering limits with positive delivered economic and carbon savings.');
  }

  return {
    state,
    stateLabel,
    isHardConstraintViolated: state === 'UNSUITABLE_HARD_FAIL',
    missingCriticalProperties: missingCritical,
    pendingLabStandards: pendingStandards,
    propertyEvaluations,
    economicDeliveredCost,
    environmentalImpact,
    decisionExplanation: explanation,
    actionRequired,
  };
}

export interface SupplyReliabilityMetrics {
  consistencyScore: number; // 0-100%
  meanBatchQuantity: number;
  variationCoefficient: number; // std dev / mean
  monthlyCoverageRatio: number; // available / demand
  recommendedBufferDays: number;
  recommendedStorageCapacityTons: number;
  seasonalityRisk: 'Low (Continuous Baseload)' | 'Medium (Batch Campaign)' | 'High (Weather Dependent)';
}

/**
 * Calculates supply reliability and storage buffering from recorded production batches.
 */
export function calculateSupplyReliability(
  batches: MaterialBatch[],
  monthlyDemandTons: number,
  frequency: 'Continuous' | 'Batch Campaign' | 'Seasonal Campaign'
): SupplyReliabilityMetrics {
  if (batches.length === 0) {
    return {
      consistencyScore: 50,
      meanBatchQuantity: 0,
      variationCoefficient: 0,
      monthlyCoverageRatio: 0,
      recommendedBufferDays: 45,
      recommendedStorageCapacityTons: Math.round(monthlyDemandTons * 1.5),
      seasonalityRisk: 'High (Weather Dependent)',
    };
  }

  const quantities = batches.map((b) => b.quantityTons);
  const sum = quantities.reduce((a, b) => a + b, 0);
  const mean = sum / quantities.length;
  const variance =
    quantities.reduce((acc, q) => acc + Math.pow(q - mean, 2), 0) / quantities.length;
  const stdDev = Math.sqrt(variance);
  const cv = mean > 0 ? stdDev / mean : 0;

  let bufferDays = 30;
  let seasonalityRisk: SupplyReliabilityMetrics['seasonalityRisk'] = 'Low (Continuous Baseload)';

  if (frequency === 'Seasonal Campaign') {
    bufferDays = 60;
    seasonalityRisk = 'High (Weather Dependent)';
  } else if (frequency === 'Batch Campaign') {
    bufferDays = 45;
    seasonalityRisk = 'Medium (Batch Campaign)';
  }

  const consistencyScore = Math.max(10, Math.min(100, Math.round((1 - cv * 0.5) * 100)));
  const monthlyCoverageRatio = monthlyDemandTons > 0 ? Math.round((sum / monthlyDemandTons) * 100) / 100 : 1;
  const recommendedStorageCapacityTons = Math.round((monthlyDemandTons / 30) * bufferDays);

  return {
    consistencyScore,
    meanBatchQuantity: Math.round(mean),
    variationCoefficient: Math.round(cv * 100) / 100,
    monthlyCoverageRatio,
    recommendedBufferDays: bufferDays,
    recommendedStorageCapacityTons,
    seasonalityRisk,
  };
}

export interface ClusterSynergyOpportunity {
  sourceNodeId: string;
  sourceNodeName: string;
  targetNodeId: string;
  targetNodeName: string;
  streamName: string;
  distanceKm: number;
  annualExchangeTonnage: number;
  estAnnualLogisticsSavingsUSD: number;
  avoidedVirginCO2eTons: number;
  synergyType: 'Bilateral Mineral Reuse' | 'Industrial Steam Symbiosis' | 'Aggregated Secondary Logistics';
}

/**
 * Computes localized industrial cluster synergy exchanges to minimize regional transport.
 */
export function optimizeClusterSynergies(nodes: ClusterNode[]): ClusterSynergyOpportunity[] {
  const opportunities: ClusterSynergyOpportunity[] = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      const generator = nodes[i];
      const receiver = nodes[j];

      // Check if generator produces what receiver demands
      generator.byproductsGenerated.forEach((byproduct) => {
        const matchingFeedstock = receiver.feedstocksDemanded.find((demand) =>
          demand.toLowerCase().includes(byproduct.toLowerCase().split(' ')[0]) ||
          byproduct.toLowerCase().includes(demand.toLowerCase().split(' ')[0])
        );

        if (matchingFeedstock) {
          const dist = calculateHaversineDistance(
            generator.lat,
            generator.lng,
            receiver.lat,
            receiver.lng
          );

          // Only consider viable regional proximity <= 350 km
          if (dist <= 350) {
            const annualTonnage = 4200;
            // Baseline long-haul 450 km virgin vs localized short-haul
            const savedKm = Math.max(40, 450 - dist);
            const savedLogistics = Math.round(savedKm * 0.18 * annualTonnage);
            const avoidedCO2e = Math.round((savedKm * 0.082 * annualTonnage) / 1000);

            opportunities.push({
              sourceNodeId: generator.id,
              sourceNodeName: generator.name,
              targetNodeId: receiver.id,
              targetNodeName: receiver.name,
              streamName: byproduct,
              distanceKm: dist,
              annualExchangeTonnage: annualTonnage,
              estAnnualLogisticsSavingsUSD: savedLogistics,
              avoidedVirginCO2eTons: avoidedCO2e,
              synergyType: 'Bilateral Mineral Reuse',
            });
          }
        }
      });
    }
  }

  return opportunities;
}



