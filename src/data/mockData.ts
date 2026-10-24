/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  EvaluationDimension,
  ProductCapability,
  MaterialConnection,
  IndustrialSector,
  ConnectionState,
} from '../types/index.ts';

export const EVALUATION_DIMENSIONS: EvaluationDimension[] = [
  {
    id: 'compatibility',
    number: '01',
    title: 'Material Compatibility',
    headline: 'Physical and chemical fitness across process boundaries.',
    coreQuestion: 'Is the material technically suitable for the proposed application?',
    description:
      'Compare documented batch chemistry, morphology, and particle distributions against recipient tolerances. Hard constraints immediately prevent improper reuse.',
    evidenceChecklist: [
      'Chemical assay (XRF / ICP-OES elemental breakdown)',
      'Mineralogical phase confirmation (XRD amorphous vs crystalline)',
      'Physical grading (sieve analysis, Blaine fineness, bulk density)',
      'Contaminant bounds (chlorides, heavy metals, volatile organics)',
    ],
    operationalPrinciple:
      'A generic material name is never sufficient. Compatibility is evaluated strictly on verified parameter bounds.',
  },
  {
    id: 'cost',
    number: '02',
    title: 'True Delivered Cost',
    headline: 'Total economic footprint beyond gate price.',
    coreQuestion: 'Does the exchange make economic sense after all relevant costs?',
    description:
      'Calculates origin gate price, specialized haulage, moisture penalties, pre-processing, handling, and amortized quality assurance testing against virgin market alternatives.',
    evidenceChecklist: [
      'Point-to-point freight rates with backhaul optimization',
      'Drying and calcining thermal energy requirements',
      'Milling, sieving, and batch homogenization expenses',
      'Batch-certified laboratory QA testing overhead per delivered ton',
    ],
    operationalPrinciple:
      'A byproduct free at the gate is rarely free delivered. Economics must demonstrate genuine cost viability.',
  },
  {
    id: 'environmental',
    number: '03',
    title: 'Net Environmental Impact',
    headline: 'Traceable carbon and lifecycle benefits against a verified baseline.',
    coreQuestion: 'Could reuse provide an environmental benefit compared with a defined baseline?',
    description:
      'Evaluates net emissions deltas: avoided virgin extraction and landfill diversion minus the emissions from conditioning, processing, and freight transport.',
    evidenceChecklist: [
      'Explicit reference virgin material baseline specification (e.g. CEM I vs CEM II/B-V)',
      'Distance break-even calculation where haulage emissions erode savings',
      'Processing energy intensity (kWh/t electricity and MJ/t thermal)',
      'Full scope 1, 2, and 3 accounting boundaries according to ISO 14044',
    ],
    operationalPrinciple:
      'Never claim green credentials without disclosing the baseline comparator and transport burden.',
  },
  {
    id: 'evidence',
    number: '04',
    title: 'Evidence & Uncertainty',
    headline: 'Exposing assumptions, missing assays, and required verification.',
    coreQuestion: 'Is there enough reliable evidence to justify the next step?',
    description:
      'Distinguishes self-reported claims from third-party certified assays. Exposes gaps in data, sample vintage, and outstanding regulatory validation.',
    evidenceChecklist: [
      'Chain-of-custody documentation and batch sampling date',
      'Accredited laboratory test certificates (ISO 17025)',
      'Batch-to-batch variation confidence intervals',
      'Outstanding regulatory leachate thresholds (TCLP / EN 12457)',
    ],
    operationalPrinciple:
      'Uncertainty is not hidden behind an opaque score. Every gap is highlighted as an explicit action item.',
  },
];

export const PRODUCT_CAPABILITIES: ProductCapability[] = [
  {
    id: 'unknown-data-guard',
    number: '01',
    title: 'Unknown Data Guard',
    tagline: 'Prevents algorithmic optimism when vital parameters are absent.',
    triggerCondition: 'Critical chemical assay or regulatory parameter unrecorded in material dossier.',
    algorithmicMechanism:
      'Freezes compatibility clearance immediately; categorizes connection as DATA MISSING rather than calculating an assumed favorable score.',
    traceableOutput: 'Mandatory testing checklist specifying required laboratory standard before downstream modeling.',
  },
  {
    id: 'explainable-matching',
    number: '02',
    title: 'Explainable Matching',
    tagline: 'Transparent boundary analysis rather than black-box AI scores.',
    triggerCondition: 'User inspects potential exchange between byproduct and industrial receiving specification.',
    algorithmicMechanism:
      'Evaluates each required engineering parameter individually, displaying explicit pass, marginal, or fail status alongside tolerance boundaries.',
    traceableOutput: 'Multi-parameter tolerance matrix with highlighted limiting factors.',
  },
  {
    id: 'true-cost-engine',
    number: '03',
    title: 'True Cost Engine',
    tagline: 'Real logistics, conditioning, and batch QA amortized per delivered ton.',
    triggerCondition: 'Geographic and handling parameters inputted for candidate origin-destination pair.',
    algorithmicMechanism:
      'Models freight density, bulk transport mode, moisture freight tax, pre-grinding energy, and regulatory QA amortized across delivered tonnage.',
    traceableOutput: 'Delivered cost waterfall breakdown compared to primary virgin benchmark price.',
  },
  {
    id: 'net-environmental-impact',
    number: '04',
    title: 'Net Environmental Impact',
    tagline: 'Baseline-anchored lifecycle carbon and resource accounting.',
    triggerCondition: 'Byproduct substitution proposed for high-carbon virgin feedstock.',
    algorithmicMechanism:
      'Subtracts processing thermal/electrical footprint and road/rail transport emissions from displaced virgin production baseline.',
    traceableOutput: 'Net avoided kg CO2e per ton with explicit break-even radius radius mapping.',
  },
  {
    id: 'alternative-use-discovery',
    number: '05',
    title: 'Alternative-Use Discovery',
    tagline: 'Finds secondary applications when prime application fails constraints.',
    triggerCondition: 'Primary application rejected due to impurity, particle size, or moisture bounds.',
    algorithmicMechanism:
      'Searches cross-industry tolerance databases for lower-specification applications (e.g. soil stabilization vs refractory aggregate).',
    traceableOutput: 'Ranked alternative technical use cases with required pre-treatment summaries.',
  },
  {
    id: 'supply-reliability-monitor',
    number: '06',
    title: 'Supply Reliability Monitor',
    tagline: 'Evaluates seasonal batch variability and shutdown dependencies.',
    triggerCondition: 'Continuous process industry assessing byproduct feedstock consistency.',
    algorithmicMechanism:
      'Correlates generation volume with source production cycles, planned turnaround outages, and historical quality variance.',
    traceableOutput: 'Buffer storage sizing requirement and seasonal availability forecast.',
  },
  {
    id: 'reuse-readiness-passport',
    number: '07',
    title: 'Reuse Readiness Passport',
    tagline: 'Standardized digital dossier verifying material lineage and hazards.',
    triggerCondition: 'Material batches staged for multi-facility transfer or commercial procurement.',
    algorithmicMechanism:
      'Compiles certified lab reports, safety data sheets, regulatory waste codes, and handling protocols into an immutable record.',
    traceableOutput: 'Auditable Technical Passport compliant with circular procurement audits.',
  },
  {
    id: 'evidence-trail',
    number: '08',
    title: 'Evidence Trail',
    tagline: 'Every conclusion cites its underlying measurement standard and date.',
    triggerCondition: 'Audit review or internal engineering evaluation.',
    algorithmicMechanism:
      'Binds each evaluation decision directly to testing lab certificates, published industry standards (ASTM, EN, ISO), and date-stamped batches.',
    traceableOutput: 'Traceable proof lineage with clickable verification sources.',
  },
  {
    id: 'what-if-simulator',
    number: '09',
    title: 'What-If Simulator',
    tagline: 'Model pre-treatment investments before spending capital.',
    triggerCondition: 'Material requires pre-processing (calcining, dewatering, beneficiation) to qualify.',
    algorithmicMechanism:
      'Simulates impact of installing on-site rotary drying, magnetic separation, or micronization on downstream delivered economics.',
    traceableOutput: 'Capex payback curve vs expanded recipient market value.',
  },
  {
    id: 'cluster-optimizer',
    number: '10',
    title: 'Industrial Cluster Optimizer',
    tagline: 'Identifies co-located multi-facility resource synergies.',
    triggerCondition: 'Multiple industrial facilities located within shared geographic perimeter.',
    algorithmicMechanism:
      'Solves multi-commodity routing for thermal steam, secondary mineral streams, and bulk aggregates to minimize aggregate logistics haulage.',
    traceableOutput: 'Cluster synergy map showing bilateral and tripartite material symbiosis pathways.',
  },
];

export const STATE_DEFINITIONS: Record<ConnectionState, { label: string; badge: string; desc: string }> = {
  POTENTIAL_IDENTIFIED: {
    label: 'Potential Application Identified',
    badge: 'border-[#7F011F] text-[#7F011F] bg-[#7F011F]/5 dark:border-[#C21841] dark:text-[#F5EBD0] dark:bg-[#7F011F]/20',
    desc: 'Preliminary requirements satisfied based on available documentation. Detailed technical validation must follow.',
  },
  COMPATIBILITY_UNVERIFIED: {
    label: 'Compatibility Not Yet Verified',
    badge: 'border-amber-700 text-amber-900 bg-amber-500/10 dark:border-amber-400 dark:text-amber-200',
    desc: 'Initial parameters documented, but critical tolerance matching against specific receiving process is incomplete.',
  },
  DATA_MISSING: {
    label: 'Critical Material Data Missing',
    badge: 'border-orange-700 text-orange-900 bg-orange-500/10 dark:border-orange-400 dark:text-orange-200',
    desc: 'Mandatory chemical or physical properties are absent. Evaluation blocked until assay provided.',
  },
  TESTING_REQUIRED: {
    label: 'Additional Laboratory Testing Required',
    badge: 'border-blue-700 text-blue-900 bg-blue-500/10 dark:border-blue-400 dark:text-blue-200',
    desc: 'Sample exceeds desk bounds, but standard requires specialized third-party XRD, pozzolanic, or leachate testing.',
  },
  UNSUITABLE_HARD_FAIL: {
    label: 'Application Unsuitable (Hard Requirement Failed)',
    badge: 'border-red-800 text-red-950 bg-red-500/10 dark:border-red-500 dark:text-red-200',
    desc: 'A non-negotiable engineering tolerance (e.g. chloride threshold or radioactive nuclide limit) was breached.',
  },
};

export const SAMPLE_CONNECTIONS: MaterialConnection[] = [
  {
    id: 'conn-1',
    sourceMaterial: 'Rice Husk Ash (Controlled Incineration)',
    sourceSector: 'Agriculture & Food',
    sourceFacilityType: 'Biomass Cogeneration Power Unit',
    targetApplication: 'Supplementary Cementitious Material (SCM)',
    targetSector: 'Construction',
    receivingPlantType: 'Blended Cement Batching Plant',
    connectionState: 'TESTING_REQUIRED',
    stateLabel: 'Additional Laboratory Testing Required',
    compatibilitySummary:
      'High silica content (91.2%), but amorphous phase confirmation requires rigorous XRD analysis to verify no cristobalite formed above 750°C.',
    distanceKm: 85,
    estDeliveredCostPerTon: 48,
    primaryMaterialBaselineCostPerTon: 95,
    netEmissionsKgCO2ePerTon: -640,
    criticalGap: 'ASTM C618 Pozzolanic Activity Index & Amorphous Phase Ratio (XRD)',
    propertyChecks: [
      {
        name: 'SiO2 Purity',
        requiredRange: '>= 85.0%',
        documentedValue: '91.2%',
        status: 'passed',
        testStandard: 'XRF ASTM C114',
        comment: 'High reactive silica potential documented.',
      },
      {
        name: 'Amorphous Phase Ratio',
        requiredRange: '>= 85.0%',
        documentedValue: 'Pending XRD',
        status: 'lab_needed',
        testStandard: 'Rietveld Refinement XRD',
        comment: 'Uncontrolled kiln spikes can induce crystalline quartz/cristobalite.',
      },
      {
        name: 'Loss on Ignition (LOI)',
        requiredRange: '<= 6.0%',
        documentedValue: '4.8%',
        status: 'passed',
        testStandard: 'ASTM C311',
        comment: 'Residual unburned carbon within acceptable limit for air-entraining agents.',
      },
      {
        name: 'Chloride Content',
        requiredRange: '<= 0.10%',
        documentedValue: '0.04%',
        status: 'passed',
        testStandard: 'EN 196-2',
        comment: 'Safe against steel rebar corrosion.',
      },
    ],
    economicNotes: 'Delivered at $48/t vs $95/t Ordinary Portland Cement baseline; positive 49% unit margin.',
    environmentalBaseline: 'Displaces 0.82t CEM I clinker per ton substituted, saving ~640 kg CO2e net of haulage.',
    confidenceRating: 'Medium',
  },
  {
    id: 'conn-2',
    sourceMaterial: 'Ground Granulated Blast Furnace Slag (GGBFS)',
    sourceSector: 'Mining & Metals',
    sourceFacilityType: 'Integrated Steel Mill (Blast Furnace)',
    targetApplication: 'High-Durability Marine Concrete Binder',
    targetSector: 'Construction',
    receivingPlantType: 'Precast Coastal Infrastructure Fabrication',
    connectionState: 'POTENTIAL_IDENTIFIED',
    stateLabel: 'Potential Application Identified',
    compatibilitySummary:
      'Fully characterized vitreous calcium aluminosilicate with verified glass content (>92%) and low chloride permeability.',
    distanceKm: 140,
    estDeliveredCostPerTon: 62,
    primaryMaterialBaselineCostPerTon: 110,
    netEmissionsKgCO2ePerTon: -780,
    criticalGap: 'Final supplier delivery schedule and silo moisture protection audit',
    propertyChecks: [
      {
        name: 'Glass (Vitreous) Content',
        requiredRange: '>= 90.0%',
        documentedValue: '94.5%',
        status: 'passed',
        testStandard: 'Microscopy BS 6699',
        comment: 'Rapid quenching confirms high hydraulic reactivity.',
      },
      {
        name: 'Blaine Specific Surface Area',
        requiredRange: '>= 400 m²/kg',
        documentedValue: '435 m²/kg',
        status: 'passed',
        testStandard: 'EN 196-6',
        comment: 'Fineness meets early strength development requirements.',
      },
      {
        name: 'Sulfide Sulfur (S²⁻)',
        requiredRange: '<= 2.0%',
        documentedValue: '0.85%',
        status: 'passed',
        testStandard: 'ASTM C989',
        comment: 'Safe within standard limits.',
      },
    ],
    economicNotes: 'Delivered at $62/t (including $28/t road freight) vs $110/t marine cement baseline.',
    environmentalBaseline: 'Avoids 780 kg CO2e/t compared to 100% Ordinary Portland Cement mix.',
    confidenceRating: 'High',
  },
  {
    id: 'conn-3',
    sourceMaterial: 'Phosphogypsum Cake (Dihydrate)',
    sourceSector: 'Chemicals',
    sourceFacilityType: 'Phosphoric Acid Fertilizer Complex',
    targetApplication: 'Wallboard Gypsum Plaster Manufacture',
    targetSector: 'Manufacturing',
    receivingPlantType: 'Plasterboard Continuous Calcinator',
    connectionState: 'UNSUITABLE_HARD_FAIL',
    stateLabel: 'Application Unsuitable (Hard Requirement Failed)',
    compatibilitySummary:
      'Natural radionuclide concentration (Radium-226) exceeds building interior radiation safety limit (220 Bq/kg vs max 160 Bq/kg allowable).',
    distanceKm: 45,
    estDeliveredCostPerTon: 22,
    primaryMaterialBaselineCostPerTon: 68,
    netEmissionsKgCO2ePerTon: -40,
    criticalGap: 'Exceeds IAEA / EPA interior residential specific activity limits for Ra-226',
    propertyChecks: [
      {
        name: 'CaSO4·2H2O Purity',
        requiredRange: '>= 90.0%',
        documentedValue: '93.2%',
        status: 'passed',
        testStandard: 'ASTM C471M',
        comment: 'Chemical gypsum equivalence verified.',
      },
      {
        name: 'Radium-226 Activity',
        requiredRange: '<= 160 Bq/kg',
        documentedValue: '220 Bq/kg',
        status: 'failed',
        testStandard: 'Gamma Spectrometry ISO 18589',
        comment: 'Hard fail: Exceeds building materials radiation safety ceiling.',
      },
      {
        name: 'Residual P2O5 Impurity',
        requiredRange: '<= 0.5%',
        documentedValue: '0.92%',
        status: 'failed',
        testStandard: 'Spectrophotometry',
        comment: 'Retards setting time beyond continuous line tolerances.',
      },
    ],
    economicNotes: 'Attractive $22/t gate price cannot offset regulatory and product liability disqualification.',
    environmentalBaseline: 'Emissions savings irrelevant due to radiological non-compliance.',
    confidenceRating: 'High',
  },
  {
    id: 'conn-4',
    sourceMaterial: 'Spent Foundry Sand (Green Sand)',
    sourceSector: 'Manufacturing',
    sourceFacilityType: 'Ferrous Engine Casting Foundry',
    targetApplication: 'Bituminous Asphalt Sub-Base Aggregate',
    targetSector: 'Construction',
    receivingPlantType: 'Highway Asphalt Mixing Plant',
    connectionState: 'DATA_MISSING',
    stateLabel: 'Critical Material Data Missing',
    compatibilitySummary:
      'Physical grain sizing compatible with fine aggregate replacement, but heavy metal leachate (TCLP for lead & cadmium) assay is missing from dossier.',
    distanceKm: 60,
    estDeliveredCostPerTon: 18,
    primaryMaterialBaselineCostPerTon: 32,
    netEmissionsKgCO2ePerTon: -18,
    criticalGap: 'Toxicity Characteristic Leaching Procedure (TCLP) for Pb, Cd, and Cr',
    propertyChecks: [
      {
        name: 'Grain Size Distribution',
        requiredRange: 'AASHTO M29 Grade',
        documentedValue: 'Passes #4 to #200 mesh',
        status: 'passed',
        testStandard: 'ASTM C136',
        comment: 'Compatible with asphalt fine filler fraction.',
      },
      {
        name: 'Bentonite Binder Content',
        requiredRange: '<= 8.0%',
        documentedValue: '5.2%',
        status: 'passed',
        testStandard: 'Methylene Blue Test',
        comment: 'Clay fraction low enough to prevent moisture stripping.',
      },
      {
        name: 'Heavy Metals Leaching (TCLP)',
        requiredRange: 'EPA SW-846 Table 1',
        documentedValue: null,
        status: 'unknown',
        testStandard: 'EPA Method 1311',
        comment: 'Missing: Environmental authority mandates leachate proof before roadway placement.',
      },
    ],
    economicNotes: 'Sub-base delivered cost $18/t vs $32/t quarried sand; pending environmental clearance.',
    environmentalBaseline: 'Conserves virgin river sand extraction; avoids foundry disposal hauling.',
    confidenceRating: 'Low',
  },
  {
    id: 'conn-5',
    sourceMaterial: 'Coal Combustion Fly Ash (Class F)',
    sourceSector: 'Energy',
    sourceFacilityType: 'Pulverized Coal Thermal Power Station',
    targetApplication: 'Structural Geopolymer Concrete',
    targetSector: 'Construction',
    receivingPlantType: 'Geopolymer Precast Sleeper Yard',
    connectionState: 'POTENTIAL_IDENTIFIED',
    stateLabel: 'Potential Application Identified',
    compatibilitySummary:
      'Low calcium Class F fly ash with high aluminosilicate glass network, ideal for alkali-activated geopolymeric polymerization.',
    distanceKm: 110,
    estDeliveredCostPerTon: 36,
    primaryMaterialBaselineCostPerTon: 90,
    netEmissionsKgCO2ePerTon: -720,
    criticalGap: 'Alkali activator dosage optimization and 28-day curing humidity trial',
    propertyChecks: [
      {
        name: 'SiO2 + Al2O3 + Fe2O3',
        requiredRange: '>= 70.0%',
        documentedValue: '84.2%',
        status: 'passed',
        testStandard: 'ASTM C618 Class F',
        comment: 'High sum of reactive oxides verified.',
      },
      {
        name: 'Free Calcium Oxide (CaO)',
        requiredRange: '<= 10.0%',
        documentedValue: '3.1%',
        status: 'passed',
        testStandard: 'ASTM C114',
        comment: 'Low free lime prevents flash setting during geopolymer mixing.',
      },
      {
        name: 'Loss on Ignition (LOI)',
        requiredRange: '<= 5.0%',
        documentedValue: '2.8%',
        status: 'passed',
        testStandard: 'ASTM C311',
        comment: 'Low carbon prevents surfactant adsorption.',
      },
    ],
    economicNotes: 'Delivered at $36/t; geopolymer concrete yields 32% net binder cost reduction.',
    environmentalBaseline: 'Replaces virgin Portland cement completely, yielding ~720 kg net CO2e reduction per ton.',
    confidenceRating: 'High',
  },
  {
    id: 'conn-6',
    sourceMaterial: 'Copper Smelter Slag (Granulated)',
    sourceSector: 'Mining & Metals',
    sourceFacilityType: 'Primary Copper Flash Smelter',
    targetApplication: 'Industrial Abrasive Blasting Grit',
    targetSector: 'Manufacturing',
    receivingPlantType: 'Shipyard Surface Preparation Unit',
    connectionState: 'COMPATIBILITY_UNVERIFIED',
    stateLabel: 'Compatibility Not Yet Verified',
    compatibilitySummary:
      'High hardness (Mohs 7.0), but crystalline silica dusting threshold and zinc trace concentration require comparative verification against ISO 11126-3.',
    distanceKm: 210,
    estDeliveredCostPerTon: 75,
    primaryMaterialBaselineCostPerTon: 130,
    netEmissionsKgCO2ePerTon: -55,
    criticalGap: 'Free crystalline silica percentage (<1.0% required for worker health)',
    propertyChecks: [
      {
        name: 'Mohs Hardness',
        requiredRange: '>= 6.5',
        documentedValue: '7.0',
        status: 'passed',
        testStandard: 'Mohs Scratch Test',
        comment: 'High cutting efficiency confirmed.',
      },
      {
        name: 'Free Crystalline Silica',
        requiredRange: '<= 1.0%',
        documentedValue: '1.4%',
        status: 'failed',
        testStandard: 'NIOSH 7500 XRD',
        comment: 'Slightly exceeds occupational health threshold; requires re-sieving.',
      },
      {
        name: 'Water-Soluble Chlorides',
        requiredRange: '<= 25 ppm',
        documentedValue: '12 ppm',
        status: 'passed',
        testStandard: 'ISO 11127-7',
        comment: 'Will not promote flash rusting on blast-cleaned naval steel.',
      },
    ],
    economicNotes: 'Longer transport distance ($42 freight) still yields viable $75/t delivered vs $130 garnet.',
    environmentalBaseline: 'Replaces mined garnet sand, reducing quarry disturbance footprint.',
    confidenceRating: 'Medium',
  },
];

import { IllustrativeMaterialScenario } from '../types/index.ts';

export const ILLUSTRATIVE_SCENARIOS: IllustrativeMaterialScenario[] = [
  {
    id: 'rice-husk',
    title: 'Rice Husk & Rice Husk Ash',
    subtitle: 'Bio-Agricultural Stream vs Calcined Inorganic SCM',
    originIndustry: 'Agriculture & Food Processing (Paddy Milling)',
    candidateApplication: 'Supplementary Cementitious Material (ASTM C618) & Bio-Insulation',
    materialIdentity: 'Raw Rice Husk (Organic biomass) vs Rice Husk Ash (Thermally treated pozzolan)',
    knownProperties: [
      { name: 'Bulk Density (Raw Husk)', value: '110 kg/m³', standard: 'ASTM D2854' },
      { name: 'Silica Content (Ash)', value: '89.4% SiO2', standard: 'XRF ASTM C114' },
      { name: 'Loss on Ignition (LOI)', value: '4.6%', standard: 'ASTM C311' },
    ],
    missingProperties: [
      { name: 'Amorphous Phase Ratio (XRD)', reasonNeeded: 'Verify crystallization did not occur above 750°C' },
      { name: 'Leachable Potassium (K2O)', reasonNeeded: 'Prevent alkali-silica reaction (ASR) in concrete' },
    ],
    applicationRequirements: [
      { requirement: 'Amorphous Silica Fraction', tolerance: '>= 85.0% reactive phase' },
      { requirement: 'LOI (Carbon Residue)', tolerance: '<= 6.0% max limit' },
      { requirement: 'Particle Fineness (d50)', tolerance: '<= 15 µm after micronization' },
    ],
    transportProcessingNotes:
      'Raw husk freight costs exceed calorific value beyond 60 km due to low density (~110 kg/m³). Requires local pelletizing or on-site controlled calcining before shipment.',
    requiredTesting: [
      'X-ray Diffraction (XRD) Rietveld quantitative mineralogy',
      'ASTM C618 Strength Activity Index at 7 and 28 days',
      'Air entrainment agent adsorption titration',
    ],
    evaluationStatus: 'Testing Required: Pending XRD verification of non-hazardous amorphous phase',
  },
  {
    id: 'stone-fines',
    title: 'Stone-Processing Fines',
    subtitle: 'Wet Diamond-Gang Saw Slurry vs Dry Crushed Quarry Dust',
    originIndustry: 'Metals & Mining / Stone Masonry Fabrication',
    candidateApplication: 'Engineered Ceramic Tiles & Flowable Backfill Grout',
    materialIdentity: 'Mineral Sludge Fines (Micro-particulate quartz/feldspar/calcite slurry)',
    knownProperties: [
      { name: 'Particle Size Distribution', value: '88% < 45 µm', standard: 'Laser Diffraction ISO 13320' },
      { name: 'Calcium Carbonate Equivalent', value: '42.1%', standard: 'Acid Digestion' },
      { name: 'Specific Gravity', value: '2.68 g/cm³', standard: 'ASTM C188' },
    ],
    missingProperties: [
      {
        name: 'Coagulant / Flocculant Residue',
        reasonNeeded: 'Determine if polymers in dewatering filter press interfere with ceramic firing',
      },
      {
        name: 'Saw Blade Diamond Segment Metal Wear (Fe, Co, Cu)',
        reasonNeeded: 'Assess discoloration risk in glazed ceramics',
      },
    ],
    applicationRequirements: [
      { requirement: 'Moisture Content As-Delivered', tolerance: '<= 12.0% (filter cake)' },
      { requirement: 'Transition Metal Contaminants (Fe2O3)', tolerance: '<= 1.5% max for white tile bodies' },
      { requirement: 'Slurry Viscosity Modifier', tolerance: 'Neutral rheology impact' },
    ],
    transportProcessingNotes:
      'High moisture (35% in raw lagoon sludge) imposes severe moisture freight tax. Thermal drying requires 220 kWh/t equivalent, making mechanical chamber filter press mandatory at origin.',
    requiredTesting: [
      'ICP-MS trace heavy metal wear analysis',
      'Thermogravimetric Analysis (TGA) for organic polymer burn-off',
      'Pilot tile extrusion and shrinkage firing trial',
    ],
    evaluationStatus: 'Critical Data Missing: Flocculant chemistry and saw blade metal trace undocumented',
  },
  {
    id: 'industrial-ash',
    title: 'Industrial Combustion Ash',
    subtitle: 'Pulverized Coal Fly Ash (Class F) vs Biomass Gasifier Ash',
    originIndustry: 'Energy & Thermal Power Generation',
    candidateApplication: 'Alkali-Activated Geopolymer Structural Precast Elements',
    materialIdentity: 'Inorganic Vitreous Aluminosilicate Glass Spheres (Fly Ash Class F)',
    knownProperties: [
      { name: 'Reactive Glass Phase', value: '74.2%', standard: 'Quantitative XRD' },
      { name: 'Sum of Oxides (SiO2 + Al2O3 + Fe2O3)', value: '86.5%', standard: 'ASTM C618' },
      { name: 'Free CaO Content', value: '2.4%', standard: 'ASTM C114' },
    ],
    missingProperties: [
      {
        name: 'Radioactive Nuclide Activity (Ra-226, Th-232, K-40)',
        reasonNeeded: 'Ensure interior radiation safety compliance for residential precast',
      },
      {
        name: 'Water-Soluble Chloride Concentration',
        reasonNeeded: 'Verify corrosion risk on internal prestressing tendons',
      },
    ],
    applicationRequirements: [
      { requirement: 'Loss on Ignition (LOI)', tolerance: '<= 4.0% for alkaline polymer mix' },
      { requirement: 'Blaine Specific Surface Area', tolerance: '>= 320 m²/kg' },
      { requirement: 'Activity Index with 8M NaOH Activator', tolerance: '>= 35 MPa 28-day compressive strength' },
    ],
    transportProcessingNotes:
      'Pneumatic bulk tanker road transport required to prevent moisture contact and premature hydration. Economically viable within 180 km radius against virgin CEM I baseline.',
    requiredTesting: [
      'High-resolution Gamma Spectrometry for natural radioactivity',
      'ASTM C1202 rapid chloride permeability benchmark',
      'Isothermal calorimetry for geopolymerization activation energy',
    ],
    evaluationStatus: 'Potential Identified: Highly favorable aluminosilicate balance; pending radiation clearance',
  },
];

