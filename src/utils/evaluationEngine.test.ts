/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateProperty,
  calculateDeliveredCost,
  calculateCarbonImpact,
  determineConnectionState,
  calculateScrollProgress,
  calculateWhatIfScenario,
  PropertyEvaluationResult,
} from './evaluationEngine.ts';

test('evaluateProperty handles missing data as unknown', () => {
  const result = evaluateProperty({
    name: 'SiO2 Purity',
    min: 80,
    val: null,
    isHardRequirement: true,
  });
  assert.equal(result.status, 'unknown');
  assert.equal(result.isHardRequirement, true);
});

test('evaluateProperty flags failure when value exceeds ceiling', () => {
  const result = evaluateProperty({
    name: 'Loss on Ignition (LOI)',
    max: 6.0,
    val: 8.5,
    isHardRequirement: true,
  });
  assert.equal(result.status, 'failed');
});

test('evaluateProperty flags lab verification required', () => {
  const result = evaluateProperty({
    name: 'Amorphous Phase Ratio (XRD)',
    min: 85,
    val: 89,
    isHardRequirement: true,
    requiresLabVerification: true,
  });
  assert.equal(result.status, 'lab_needed');
});

test('calculateDeliveredCost calculates haulage and testing amortized cost', () => {
  const cost = calculateDeliveredCost({
    baseMaterialPricePerTon: 15,
    distanceKm: 120,
    freightRatePerTonKm: 0.25, // $30 freight
    preprocessingCostPerTon: 10,
    qaTestingCostPerBatch: 500,
    batchSizeTons: 100, // $5 QA
    baselinePrimaryMaterialCostPerTon: 80,
  });

  assert.equal(cost.freightCostPerTon, 30);
  assert.equal(cost.qaCostPerTon, 5);
  assert.equal(cost.totalDeliveredCostPerTon, 60); // 15 + 30 + 10 + 5
  assert.equal(cost.deltaCostPerTon, -20); // 60 - 80 = -$20 savings
  assert.equal(cost.isEconomicallyViable, true);
});

test('calculateCarbonImpact computes break-even haulage distance', () => {
  const lca = calculateCarbonImpact({
    baselineEmissionsKgCO2e: 800, // Ordinary Portland Cement baseline
    reuseProcessingEmissionsKgCO2e: 80,
    transportEmissionFactorKgPerTonKm: 0.1,
    distanceKm: 200, // 20 kg transport
  });

  assert.equal(lca.transportEmissionsKgCO2e, 20);
  assert.equal(lca.totalReuseEmissionsKgCO2e, 100);
  assert.equal(lca.netAvoidedEmissionsKgCO2e, 700);
  assert.equal(lca.isEnvironmentallyBeneficial, true);
  // Break-even distance = (800 - 80) / 0.1 = 7200 km
  assert.equal(lca.breakEvenDistanceKm, 7200);
});

test('determineConnectionState prioritizes hard failure over missing data', () => {
  const results: PropertyEvaluationResult[] = [
    { name: 'Chlorides', status: 'failed', isHardRequirement: true, message: 'Excess chlorides' },
    { name: 'Moisture', status: 'unknown', isHardRequirement: false, message: 'Missing' },
  ];
  assert.equal(determineConnectionState(results), 'UNSUITABLE_HARD_FAIL');
});

test('determineConnectionState returns DATA_MISSING when critical parameter absent', () => {
  const results: PropertyEvaluationResult[] = [
    { name: 'pH Level', status: 'passed', isHardRequirement: false, message: 'OK' },
    { name: 'Heavy Metals (TCLP)', status: 'unknown', isHardRequirement: true, message: 'Missing' },
  ];
  assert.equal(determineConnectionState(results), 'DATA_MISSING');
});

test('determineConnectionState returns TESTING_REQUIRED when pending lab proof exists', () => {
  const results: PropertyEvaluationResult[] = [
    { name: 'Grain size', status: 'passed', isHardRequirement: false, message: 'OK' },
    { name: 'Pozzolanic Reactivity', status: 'lab_needed', isHardRequirement: true, message: 'Lab test required' },
  ];
  assert.equal(determineConnectionState(results), 'TESTING_REQUIRED');
});

test('calculateScrollProgress computes clamped 0 to 1 progress ratio', () => {
  assert.equal(calculateScrollProgress(0, 2000, 1000), 0);
  assert.equal(calculateScrollProgress(500, 2000, 1000), 0.5);
  assert.equal(calculateScrollProgress(1000, 2000, 1000), 1);
  assert.equal(calculateScrollProgress(1500, 2000, 1000), 1); // clamped max
  assert.equal(calculateScrollProgress(-50, 2000, 1000), 0); // clamped min
  assert.equal(calculateScrollProgress(100, 1000, 1000), 0); // zero scrollable height
});

test('calculateWhatIfScenario computes delivered cost and break-even radius', () => {
  const result = calculateWhatIfScenario({
    distanceKm: 100,
    preprocessingCostPerTon: 20,
    annualTonnage: 5000,
  });

  // Freight = 100 * 0.18 = $18
  assert.equal(result.freightCostPerTon, 18);
  // Total = 15 + 18 + 20 + 3.5 = $56.5
  assert.equal(result.totalDeliveredCostPerTon, 56.5);
  // Savings vs 90 = 90 - 56.5 = $33.5
  assert.equal(result.netDeliveredSavingsPerTon, 33.5);
  assert.equal(result.grossAnnualEconomicDelta, 33.5 * 5000);
  assert.equal(result.isEconomicallyViable, true);
  assert.equal(result.isCarbonFavorable, true);
  assert.ok(result.breakEvenDistanceKm > 1000);
});


