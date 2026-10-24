/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SectionId = 'home' | 'evaluation' | 'opportunities' | 'explore';

export type ConnectionState =
  | 'POTENTIAL_IDENTIFIED'
  | 'COMPATIBILITY_UNVERIFIED'
  | 'DATA_MISSING'
  | 'TESTING_REQUIRED'
  | 'UNSUITABLE_HARD_FAIL';

export interface StateDefinition {
  state: ConnectionState;
  label: string;
  badgeStyle: string;
  summary: string;
  borderStyle: string;
}

export type IndustrialSector =
  | 'Manufacturing'
  | 'Construction'
  | 'Mining & Metals'
  | 'Agriculture & Food'
  | 'Chemicals'
  | 'Energy';

export interface PropertyCheck {
  name: string;
  requiredRange: string;
  documentedValue: string | null;
  status: 'passed' | 'failed' | 'unknown' | 'lab_needed';
  testStandard?: string;
  comment: string;
}

export interface MaterialConnection {
  id: string;
  sourceMaterial: string;
  sourceSector: IndustrialSector;
  sourceFacilityType: string;
  targetApplication: string;
  targetSector: IndustrialSector;
  receivingPlantType: string;
  connectionState: ConnectionState;
  stateLabel: string;
  compatibilitySummary: string;
  distanceKm: number;
  estDeliveredCostPerTon: number;
  primaryMaterialBaselineCostPerTon: number;
  netEmissionsKgCO2ePerTon: number; // negative means savings over baseline
  criticalGap: string;
  propertyChecks: PropertyCheck[];
  economicNotes: string;
  environmentalBaseline: string;
  confidenceRating: 'High' | 'Medium' | 'Low' | 'Inconclusive';
}

export interface EvaluationDimension {
  id: string;
  number: string;
  title: string;
  headline: string;
  coreQuestion: string;
  description: string;
  evidenceChecklist: string[];
  operationalPrinciple: string;
}

export interface ProductCapability {
  id: string;
  number: string;
  title: string;
  tagline: string;
  triggerCondition: string;
  algorithmicMechanism: string;
  traceableOutput: string;
}

export interface IllustrativeMaterialScenario {
  id: string;
  title: string;
  subtitle: string;
  originIndustry: string;
  candidateApplication: string;
  materialIdentity: string;
  knownProperties: { name: string; value: string; standard?: string }[];
  missingProperties: { name: string; reasonNeeded: string }[];
  applicationRequirements: { requirement: string; tolerance: string }[];
  transportProcessingNotes: string;
  requiredTesting: string[];
  evaluationStatus: string;
}

export interface WhatIfParameters {
  distanceKm: number;
  preprocessingCostPerTon: number;
  annualTonnage: number;
}

export interface WhatIfResults {
  freightCostPerTon: number;
  totalDeliveredCostPerTon: number;
  baselineCostPerTon: number;
  netDeliveredSavingsPerTon: number;
  grossAnnualEconomicDelta: number;
  transportEmissionsPerTonKg: number;
  netAvoidedCO2ePerTonKg: number;
  annualNetCO2eDeltaTons: number;
  breakEvenDistanceKm: number;
  isEconomicallyViable: boolean;
  isCarbonFavorable: boolean;
}
