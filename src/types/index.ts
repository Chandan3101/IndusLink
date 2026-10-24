/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SectionId =
  | 'home'
  | 'problem'
  | 'how-it-works'
  | 'platform'
  | 'evaluation'
  | 'opportunities'
  | 'explore';

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

export type WorkspaceMode = 'buyer' | 'seller' | 'both';

export type AppNavTab =
  | 'dashboard'
  | 'discover'
  | 'registry'
  | 'batches'
  | 'passport'
  | 'matching'
  | 'alternative_uses'
  | 'cost_engine'
  | 'environmental'
  | 'reliability'
  | 'what_if'
  | 'cluster_optimizer'
  | 'enquiries'
  | 'offers'
  | 'approvals'
  | 'buyer_overview'
  | 'seller_overview'
  | 'evidence_center'
  | 'reports'
  | 'facilities'
  | 'team'
  | 'audit_log'
  | 'settings';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  title: string;
  organization: string;
  organizationType: 'Producer / Seller' | 'Off-taker / Buyer' | 'Integrated Dual Facility';
  role: 'admin' | 'engineer' | 'procurement' | 'auditor';
  workspace: WorkspaceMode;
  facility: string;
  avatarInitials: string;
}

export interface AttachedDocument {
  id: string;
  name: string;
  type: 'Lab Assay (XRF/XRD)' | 'Safety Data Sheet (SDS)' | 'End-of-Waste Certificate' | 'TCLP Leachate Report' | 'Technical Spec Sheet';
  uploadDate: string;
  size: string;
  issuer: string;
  verified: boolean;
  notes?: string;
}

export interface MaterialBatch {
  id: string;
  batchNumber: string;
  materialId: string;
  productionDate: string;
  quantityTons: number;
  storageCondition: string;
  samplingDate: string;
  laboratoryCertId: string;
  keyAssays: { name: string; value: string; unit: string; compliant: boolean }[];
  status: 'Ready for Dispatch' | 'In Testing' | 'Allocated' | 'Quarantine';
}

export interface RegisteredMaterial {
  id: string;
  name: string;
  category: string;
  form: string; // e.g. Fine powder, granular slag, filter cake
  generatingProcess: string;
  sourceFacility: string;
  sourceSector: IndustrialSector;
  physicalState: 'Solid' | 'Slurry' | 'Granular' | 'Powder';
  monthlyVolumeTons: number;
  availableInventoryTons: number;
  generationFrequency: 'Continuous' | 'Batch Campaign' | 'Seasonal Campaign';
  basePricePerTon: number;
  locationCity: string;
  coordinates: { lat: number; lng: number };
  evidenceStatus: 'Complete (ISO 17025)' | 'Partial (Pending XRD)' | 'Missing Leachate';
  documents: AttachedDocument[];
  batches: MaterialBatch[];
  properties: {
    name: string;
    value: number | null;
    unit: string;
    testStandard: string;
    isHardConstraint: boolean;
  }[];
  published: boolean;
  readinessScore: number; // 0-100%
  lastUpdated: string;
  isDemo: boolean;
}

export interface BuyerSpecification {
  id: string;
  title: string;
  targetApplication: string;
  sector: IndustrialSector;
  receivingFacility: string;
  deliveryLocation: string;
  coordinates: { lat: number; lng: number };
  monthlyDemandTons: number;
  maxDeliveredPricePerTon: number;
  virginBaselineMaterial: string;
  virginBaselineCostPerTon: number;
  virginBaselineEmissionsKgCO2e: number;
  deliveryCadence: 'Weekly bulk' | 'Bi-weekly pneumatic tanker' | 'Monthly rail car';
  requiredProperties: {
    name: string;
    min?: number;
    max?: number;
    unit: string;
    isHardRequirement: boolean;
    requiredStandard?: string;
  }[];
  criticalContaminantLimits: {
    name: string;
    maxLimit: number;
    unit: string;
    standard: string;
  }[];
  mandatoryEvidence: string[];
  createdDate: string;
  active: boolean;
}

export interface EnquiryRecord {
  id: string;
  buyerOrg: string;
  sellerOrg: string;
  materialName: string;
  materialId: string;
  specificationId?: string;
  requestedTonnage: number;
  targetDeliveryDate: string;
  deliveryLocation: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Offer Issued' | 'Accepted' | 'Declined';
  inquiryDate: string;
  message: string;
  offeredPricePerTon?: number;
  sellerNotes?: string;
  logisticsArrangedBy: 'Buyer' | 'Seller' | 'Shared Third-Party';
  auditHistory: { date: string; action: string; actor: string }[];
}

export interface OfferRecord {
  id: string;
  enquiryId: string;
  sellerOrg: string;
  buyerOrg: string;
  materialName: string;
  offeredTonnage: number;
  gatePricePerTon: number;
  estimatedFreightPerTon: number;
  totalDeliveredPricePerTon: number;
  validityExpiryDate: string;
  terms: string;
  status: 'Pending Review' | 'Accepted' | 'Declined' | 'Expired';
  issuedDate: string;
}

export interface AuditTrailEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  category: 'Material' | 'Assessment' | 'Enquiry' | 'Offer' | 'Security';
  details: string;
  hash: string;
}

export interface ClusterNode {
  id: string;
  name: string;
  sector: IndustrialSector;
  type: 'Generator' | 'Receiver' | 'Prosumer';
  location: string;
  lat: number;
  lng: number;
  byproductsGenerated: string[];
  feedstocksDemanded: string[];
  activeSynergiesCount: number;
}

