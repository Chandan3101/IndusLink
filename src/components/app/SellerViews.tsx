/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Factory,
  Plus,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Send,
  Eye,
  Download,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  HelpCircle,
  FileSpreadsheet,
  QrCode,
  Calendar,
  Building2,
} from 'lucide-react';
import type {
  RegisteredMaterial,
  MaterialBatch,
  EnquiryRecord,
  OfferRecord,
  BuyerSpecification,
  IndustrialSector,
} from '../../types/index.ts';
import { AnimatedHeading } from '../AnimatedHeading.tsx';

interface SellerViewsProps {
  materials: RegisteredMaterial[];
  buyerSpecs: BuyerSpecification[];
  enquiries: EnquiryRecord[];
  offers: OfferRecord[];
  onRegisterMaterial: (material: RegisteredMaterial) => void;
  onCreateOffer: (offer: Omit<OfferRecord, 'id' | 'issuedDate'>) => void;
}

/**
 * 8.1 SELLER OVERVIEW
 */
export const SellerOverview: React.FC<
  SellerViewsProps & { onNavigateTab: (tab: any) => void }
> = ({ materials, enquiries, offers, onNavigateTab }) => {
  const totalVolumeTons = materials.reduce((acc, m) => acc + m.monthlyVolumeTons, 0);
  const totalAvailableTons = materials.reduce((acc, m) => acc + m.availableInventoryTons, 0);
  const pendingInquiries = enquiries.filter((e) => e.status === 'Submitted' || e.status === 'Under Review');

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-surface rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#10b981] to-transparent opacity-90" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Seller Workspace • Industrial Producer Dossier Management</span>
            </div>
            <AnimatedHeading
              tag="h2"
              className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]"
            >
              Byproduct Streams, Batches & Technical Passports
            </AnimatedHeading>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl mt-1">
              Register secondary mineral and chemical streams, manage certified batch assays, review inbound buyer enquiries, and publish verifiable Digital Material Passports.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('register')}
              className="glow-button-emerald px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Byproduct</span>
            </button>
            <button
              onClick={() => onNavigateTab('passport')}
              className="glass-surface px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              View Passports
            </button>
          </div>
        </div>

        {/* 4 Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-black/5 dark:border-white/5">
          <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            <span className="text-xs text-[var(--text-secondary)] block">Registered Streams</span>
            <span className="font-mono text-2xl font-bold text-[var(--text-primary)] mt-1 block">
              {materials.length}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 block font-medium">Catalogued byproduct streams</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            <span className="text-xs text-[var(--text-secondary)] block">Monthly Generation</span>
            <span className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
              {totalVolumeTons.toLocaleString()} t
            </span>
            <span className="text-[10px] text-[var(--text-secondary)] mt-1 block">Steady-state monthly generation</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            <span className="text-xs text-[var(--text-secondary)] block">Available Silo Inventory</span>
            <span className="font-mono text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 block">
              {totalAvailableTons.toLocaleString()} t
            </span>
            <span className="text-[10px] text-[var(--text-secondary)] mt-1 block">Ready for immediate dispatch</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            <span className="text-xs text-[var(--text-secondary)] block">Inbound Enquiries</span>
            <span className="font-mono text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 block">
              {pendingInquiries.length}
            </span>
            <span className="text-[10px] text-amber-600/90 dark:text-amber-400/80 mt-1 block font-medium">Awaiting technical quote</span>
          </div>
        </div>
      </div>

      {/* Registered Streams Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
            Registered Byproduct Streams
          </h3>
          <span className="text-xs text-[var(--text-secondary)]">Evidence completeness & batches</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((mat) => (
            <div
              key={mat.id}
              className="glass-surface-elevated rounded-2xl p-5 space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {mat.sourceSector}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                    {mat.batches.length} Batches
                  </span>
                </div>

                <h4 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                  {mat.name}
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                  {mat.sourceFacility} • {mat.locationCity}
                </p>

                <div className="my-3 p-3 rounded-xl bg-black/10 dark:bg-white/5 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Generation Volume:</span>
                    <strong className="font-mono text-[var(--text-primary)]">{mat.monthlyVolumeTons} t / mo</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Available Inventory:</span>
                    <strong className="font-mono text-emerald-400">{mat.availableInventoryTons} t</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Base Gate Price:</span>
                    <strong className="font-mono text-zinc-300">${mat.basePricePerTon} / ton</strong>
                  </div>
                </div>

                {/* Evidence Status */}
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dossier: <strong className="text-[var(--text-primary)]">{mat.evidenceStatus}</strong></span>
                </div>
              </div>

              <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-[var(--text-secondary)]">Updated: {mat.lastUpdated}</span>
                <button
                  onClick={() => onNavigateTab('passport')}
                  className="text-xs text-emerald-400 font-semibold hover:text-emerald-300 flex items-center gap-1"
                >
                  <span>Material Passport</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * 8.2 BYPRODUCT REGISTRATION WIZARD
 */
export const ByproductRegistrationWizard: React.FC<{
  onSaveMaterial: (material: RegisteredMaterial) => void;
  onCancel: () => void;
}> = ({ onSaveMaterial, onCancel }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Biomass Combustion Ash');
  const [form, setForm] = useState('');
  const [generatingProcess, setGeneratingProcess] = useState('');
  const [sourceFacility, setSourceFacility] = useState('');
  const [sourceSector, setSourceSector] = useState<IndustrialSector>('Agriculture & Food');
  const [physicalState, setPhysicalState] = useState<'Solid' | 'Slurry' | 'Granular' | 'Powder'>('Powder');
  const [monthlyVolumeTons, setMonthlyVolumeTons] = useState(300);
  const [basePricePerTon, setBasePricePerTon] = useState(15);
  const [locationCity, setLocationCity] = useState('');
  const [documentName, setDocumentName] = useState('');

  const handleFinish = () => {
    if (!name || !generatingProcess) return;

    const newMaterial: RegisteredMaterial = {
      id: `mat-${Date.now()}`,
      name,
      category,
      form: form || 'Fine industrial mineral powder',
      generatingProcess,
      sourceFacility: sourceFacility || 'Main Industrial Complex',
      sourceSector,
      physicalState,
      monthlyVolumeTons,
      availableInventoryTons: Math.round(monthlyVolumeTons * 1.5),
      generationFrequency: 'Continuous',
      basePricePerTon,
      locationCity: locationCity || 'Detroit, MI',
      coordinates: { lat: 42.3314, lng: -83.0458 },
      evidenceStatus: documentName ? 'Complete (ISO 17025)' : 'Partial (Pending XRD)',
      published: true,
      readinessScore: documentName ? 85 : 60,
      lastUpdated: new Date().toISOString().split('T')[0],
      isDemo: false,
      documents: documentName
        ? [
            {
              id: `doc-${Date.now()}`,
              name: documentName,
              type: 'Lab Assay (XRF/XRD)',
              uploadDate: new Date().toISOString().split('T')[0],
              size: '1.8 MB',
              issuer: 'Accredited Analytical Laboratory',
              verified: true,
            },
          ]
        : [],
      batches: [
        {
          id: `batch-${Date.now()}`,
          batchNumber: `BATCH-${new Date().getFullYear()}-01`,
          materialId: `mat-${Date.now()}`,
          productionDate: new Date().toISOString().split('T')[0],
          quantityTons: monthlyVolumeTons,
          storageCondition: 'Covered bulk silo',
          samplingDate: new Date().toISOString().split('T')[0],
          laboratoryCertId: 'CERT-ACCRED-001',
          keyAssays: [
            { name: 'Major Oxide Ratio', value: '85.4', unit: '%', compliant: true },
            { name: 'Loss on Ignition', value: '4.2', unit: '%', compliant: true },
          ],
          status: 'Ready for Dispatch',
        },
      ],
      properties: [
        { name: 'Major Reactive Oxide', value: 85.4, unit: '%', testStandard: 'ASTM C114', isHardConstraint: true },
        { name: 'Loss on Ignition (LOI)', value: 4.2, unit: '%', testStandard: 'ASTM C311', isHardConstraint: true },
        { name: 'Chloride Content', value: 0.05, unit: '%', testStandard: 'EN 196-2', isHardConstraint: true },
      ],
    };

    onSaveMaterial(newMaterial);
  };

  return (
    <div className="glass-surface-elevated rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-black/5 dark:border-white/5 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
            Step {step} of 3 • Guided Registration
          </span>
          <span className="text-xs font-mono text-[var(--text-secondary)]">Stage-Gate Verification</span>
        </div>
        <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
          Register Secondary Industrial Stream
        </h3>
      </div>

      {step === 1 && (
        <div className="space-y-4 text-xs">
          <h4 className="font-semibold text-sm text-[var(--text-primary)]">1. Material Identity & Origin</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Byproduct Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Micronized Bio-Ash / Copper Slag"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-surface text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Material Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-surface text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">
              Generating Process & Origin *
            </label>
            <textarea
              rows={2}
              required
              placeholder="Describe origin process (e.g. fixed-bed biomass gasification at 700°C)..."
              value={generatingProcess}
              onChange={(e) => setGeneratingProcess(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-surface text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Generating Facility
              </label>
              <input
                type="text"
                placeholder="e.g. Apex Bio-Energy Unit"
                value={sourceFacility}
                onChange={(e) => setSourceFacility(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-surface text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Sector
              </label>
              <select
                value={sourceSector}
                onChange={(e) => setSourceSector(e.target.value as IndustrialSector)}
                className="w-full px-3 py-2 rounded-xl glass-surface text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <option value="Agriculture & Food" className="bg-zinc-900 text-white">Agriculture & Food</option>
                <option value="Mining & Metals" className="bg-zinc-900 text-white">Mining & Metals</option>
                <option value="Chemicals" className="bg-zinc-900 text-white">Chemicals</option>
                <option value="Energy" className="bg-zinc-900 text-white">Energy</option>
                <option value="Manufacturing" className="bg-zinc-900 text-white">Manufacturing</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Physical Form
              </label>
              <select
                value={physicalState}
                onChange={(e) => setPhysicalState(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl glass-surface text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <option value="Powder" className="bg-zinc-900 text-white">Dry Powder</option>
                <option value="Granular" className="bg-zinc-900 text-white">Granular Solid</option>
                <option value="Slurry" className="bg-zinc-900 text-white">Filter Cake / Slurry</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 text-xs">
          <h4 className="font-semibold text-sm text-[var(--text-primary)]">2. Supply Details & Pricing</h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Monthly Volume (Tons)
              </label>
              <input
                type="number"
                min="10"
                max="50000"
                value={monthlyVolumeTons}
                onChange={(e) => setMonthlyVolumeTons(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl glass-surface text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Base Gate Price ($ / ton)
              </label>
              <input
                type="number"
                min="0"
                max="500"
                value={basePricePerTon}
                onChange={(e) => setBasePricePerTon(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl glass-surface text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--text-primary)] mb-1">
                Facility City & State
              </label>
              <input
                type="text"
                placeholder="e.g. Grand Rapids, MI"
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-surface text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/10 dark:bg-white/5 space-y-2">
            <span className="font-semibold text-[var(--text-primary)] block">Standard Properties Configured</span>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Default baseline includes SiO2/Oxide fraction (ASTM C114), LOI loss (ASTM C311), and water-soluble chloride (EN 196-2).
            </p>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 text-xs">
          <h4 className="font-semibold text-sm text-[var(--text-primary)]">3. Supporting Evidence & Verification</h4>

          {/* Mandatory Disclaiming Banner */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
            <strong>Mandatory Evidence Notice:</strong>
            <p className="text-[11px] mt-0.5">Document uploaded — authenticity not independently verified.</p>
          </div>

          <div>
            <label className="block font-semibold text-[var(--text-primary)] mb-1">
              Upload Laboratory Assay or Safety Sheet (Simulated Verification)
            </label>
            <input
              type="text"
              placeholder="e.g. Certified_XRF_Mineral_Assay_2026.pdf"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-surface text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            />
          </div>

          <div className="p-4 rounded-xl border border-dashed border-black/15 dark:border-white/15 text-center py-6 space-y-2">
            <Upload className="w-8 h-8 text-zinc-400 mx-auto" />
            <span className="text-[11px] text-[var(--text-secondary)] block">
              Drag and drop certified ISO 17025 test reports, SDS, or End-of-Waste permits
            </span>
            <button
              type="button"
              onClick={() => setDocumentName('Accredited_Elemental_XRF_Report_Oct2026.pdf')}
              className="text-[11px] text-emerald-400 underline font-semibold"
            >
              Attach Sample Accredited Assay
            </button>
          </div>
        </div>
      )}

      {/* Wizard Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
        <button
          type="button"
          onClick={step === 1 ? onCancel : () => setStep(step - 1)}
          className="px-4 py-2 rounded-xl glass-surface text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </button>

        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="glow-button-emerald px-5 py-2 rounded-xl text-xs font-semibold"
          >
            Next Step →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            className="glow-button-emerald px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Publish Byproduct Dossier</span>
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * 8.3 MATERIAL PASSPORT VIEW
 */
export const MaterialPassportView: React.FC<{
  materials: RegisteredMaterial[];
}> = ({ materials }) => {
  const [selectedMaterialId, setSelectedMaterialId] = useState(materials[0]?.id || '');
  const material = materials.find((m) => m.id === selectedMaterialId) || materials[0];

  if (!material) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
            Digital Product Passport
          </span>
          <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
            Traceable Material Passport
          </h3>
        </div>

        {/* Stream Selector */}
        <select
          value={selectedMaterialId}
          onChange={(e) => setSelectedMaterialId(e.target.value)}
          className="px-3 py-1.5 rounded-xl glass-surface-floating text-xs font-semibold text-[var(--text-primary)] border border-black/10 dark:border-white/10"
        >
          {materials.map((m) => (
            <option key={m.id} value={m.id} className="bg-zinc-900 text-white">
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* Passport Certificate Card */}
      <div className="glass-surface-elevated rounded-3xl p-6 sm:p-8 space-y-6 border border-emerald-500/20 relative">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <QrCode className="w-5 h-5 text-emerald-400" />
              <span className="font-mono text-xs text-emerald-400 font-bold uppercase">
                PASSPORT-ID: IL-{material.id.toUpperCase()}
              </span>
            </div>
            <h4 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
              {material.name}
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Generating Facility: <strong>{material.sourceFacility}</strong> • {material.locationCity}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl glass-surface text-xs font-semibold flex items-center gap-1.5 text-[var(--text-primary)] hover:bg-white/10"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Dossier (PDF)</span>
            </button>
          </div>
        </div>

        {/* Process Lineage & Batches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-3">
            <h5 className="font-semibold text-sm text-[var(--text-primary)]">
              Process Lineage & Physical State
            </h5>
            <div className="p-4 rounded-2xl bg-black/10 dark:bg-white/5 space-y-2">
              <p className="text-[var(--text-secondary)]">
                <strong>Generating Process:</strong> {material.generatingProcess}
              </p>
              <p className="text-[var(--text-secondary)]">
                <strong>Physical State:</strong> {material.physicalState} ({material.form})
              </p>
              <p className="text-[var(--text-secondary)]">
                <strong>Monthly Available Volume:</strong> {material.monthlyVolumeTons} metric tons
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="font-semibold text-sm text-[var(--text-primary)]">
              Supporting Evidence Attachments
            </h5>
            <div className="space-y-2">
              {material.documents.length === 0 ? (
                <div className="p-3 rounded-xl bg-black/10 dark:bg-white/5 text-zinc-400 text-xs">
                  No documents attached yet.
                </div>
              ) : (
                material.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl bg-black/10 dark:bg-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[var(--text-primary)] block">{doc.name}</span>
                      <span className="text-[10px] text-[var(--text-secondary)]">
                        {doc.type} • {doc.size}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Verified
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Assays Table */}
        <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5">
          <h5 className="font-semibold text-sm text-[var(--text-primary)]">
            Certified Chemical & Physical Assay Tolerances
          </h5>

          <div className="data-table-container rounded-xl border border-black/5 dark:border-white/5 overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-black/10 dark:bg-white/5 text-[10px] font-mono text-[var(--text-secondary)] uppercase">
                <tr>
                  <th className="p-3">Assayed Parameter</th>
                  <th className="p-3">Documented Value</th>
                  <th className="p-3">Unit</th>
                  <th className="p-3">Test Standard</th>
                  <th className="p-3">Constraint Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {material.properties.map((p, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-semibold text-[var(--text-primary)]">{p.name}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">
                      {p.value !== null ? p.value : 'Pending Lab Assay'}
                    </td>
                    <td className="p-3 font-mono text-zinc-400">{p.unit}</td>
                    <td className="p-3 text-[var(--text-secondary)]">{p.testStandard}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          p.isHardConstraint
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-zinc-500/10 text-zinc-400'
                        }`}
                      >
                        {p.isHardConstraint ? 'HARD BARRIER' : 'STANDARD'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 8.4 POTENTIAL BUYER DISCOVERY & REVERSE MATCHING
 */
export const PotentialBuyerDiscoveryView: React.FC<{
  materials: RegisteredMaterial[];
  buyerSpecs: BuyerSpecification[];
  onInitiateQuote: (enquiryId: string) => void;
}> = ({ materials, buyerSpecs }) => {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
          Demand Discovery Engine
        </span>
        <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
          Potential Off-taker Applications & Match Compatibility
        </h3>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Explore recipient industries and plant specifications that match your registered byproduct parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {buyerSpecs.map((spec) => (
          <div
            key={spec.id}
            className="glass-surface-elevated rounded-2xl p-5 space-y-3 hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                  {spec.sector} • Off-taker Demand
                </span>
                <h4 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                  {spec.title}
                </h4>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                {spec.monthlyDemandTons} t/mo
              </span>
            </div>

            <p className="text-xs text-[var(--text-secondary)]">
              Application: <strong className="text-[var(--text-primary)]">{spec.targetApplication}</strong>. Delivery at {spec.deliveryLocation}.
            </p>

            <div className="p-3 rounded-xl bg-black/10 dark:bg-white/5 text-xs text-[var(--text-secondary)] space-y-1">
              <div>
                <strong>Replaces:</strong> {spec.virginBaselineMaterial} (${spec.virginBaselineCostPerTon}/t baseline)
              </div>
              <div>
                <strong>Mandatory Standards:</strong> {spec.mandatoryEvidence.join(', ')}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] text-[var(--text-secondary)]">Tolerance verification active</span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <span>Assess Compatibility</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 8.5 SELLER ENQUIRIES & OFFERS VIEW
 */
export const SellerEnquiriesView: React.FC<{
  enquiries: EnquiryRecord[];
  offers: OfferRecord[];
  onCreateOffer: (offer: Omit<OfferRecord, 'id' | 'issuedDate'>) => void;
}> = ({ enquiries, offers, onCreateOffer }) => {
  const [activeEnquiryId, setActiveEnquiryId] = useState<string | null>(null);
  const [gatePrice, setGatePrice] = useState(16);
  const [freightCost, setFreightCost] = useState(20);
  const [terms, setTerms] = useState('Net 30 days. Batch assay certificate delivered with each shipment.');

  const activeEnquiry = enquiries.find((e) => e.id === activeEnquiryId);

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEnquiry) return;

    onCreateOffer({
      enquiryId: activeEnquiry.id,
      sellerOrg: activeEnquiry.sellerOrg,
      buyerOrg: activeEnquiry.buyerOrg,
      materialName: activeEnquiry.materialName,
      offeredTonnage: activeEnquiry.requestedTonnage,
      gatePricePerTon: gatePrice,
      estimatedFreightPerTon: freightCost,
      totalDeliveredPricePerTon: gatePrice + freightCost,
      validityExpiryDate: '2026-11-30',
      terms,
      status: 'Pending Review',
    });

    setActiveEnquiryId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
          Inbound Demand Workflow
        </span>
        <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
          Inbound Buyer Enquiries & Quotations
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enquiries List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <h4 className="font-serif text-base font-semibold text-[var(--text-primary)]">
            Inbound Enquiries from Verified Off-takers
          </h4>

          {enquiries.map((enq) => (
            <div
              key={enq.id}
              className={`glass-surface-elevated rounded-2xl p-5 space-y-3 border transition-all ${
                activeEnquiryId === enq.id ? 'border-emerald-500 ring-1 ring-emerald-500/50' : 'hover:border-emerald-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                    Enquiry #{enq.id} • {enq.inquiryDate}
                  </span>
                  <h5 className="font-serif text-base font-semibold text-[var(--text-primary)]">
                    {enq.materialName} ({enq.requestedTonnage} tons)
                  </h5>
                  <span className="text-xs text-[var(--text-secondary)]">From: {enq.buyerOrg}</span>
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

              <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                <span className="text-[11px] text-[var(--text-secondary)]">
                  Target Date: <strong>{enq.targetDeliveryDate}</strong>
                </span>

                <button
                  onClick={() => setActiveEnquiryId(enq.id)}
                  className="glow-button-emerald px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>Issue Formal Quote</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quotation Generator Form (5 cols) */}
        <div className="lg:col-span-5">
          {activeEnquiry ? (
            <div className="glass-surface-floating rounded-2xl p-5 space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                  Generate Quotation
                </span>
                <h4 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                  Quote for {activeEnquiry.buyerOrg}
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Stream: {activeEnquiry.materialName} ({activeEnquiry.requestedTonnage} tons)
                </p>
              </div>

              <form onSubmit={handleCreateOffer} className="space-y-3">
                <div>
                  <label className="block font-semibold text-[var(--text-primary)] mb-1">
                    Gate Price ($ / ton)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={gatePrice}
                    onChange={(e) => setGatePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl glass-surface text-[var(--text-primary)]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[var(--text-primary)] mb-1">
                    Estimated Freight Haulage ($ / ton)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={freightCost}
                    onChange={(e) => setFreightCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl glass-surface text-[var(--text-primary)]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-black/10 dark:bg-white/5">
                  <div className="flex justify-between text-xs font-bold text-[var(--text-primary)]">
                    <span>Total Delivered Quote:</span>
                    <span className="font-mono text-emerald-400">${gatePrice + freightCost} / ton</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[var(--text-primary)] mb-1">
                    Terms & Quality Conditions
                  </label>
                  <textarea
                    rows={2}
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-surface text-[var(--text-primary)]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveEnquiryId(null)}
                    className="w-1/2 py-2 rounded-xl glass-surface text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 glow-button-emerald py-2 rounded-xl font-semibold"
                  >
                    Transmit Offer
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="glass-surface rounded-2xl p-6 text-center space-y-2 text-xs text-[var(--text-secondary)]">
              <Send className="w-8 h-8 text-zinc-500 mx-auto" />
              <p>Select an enquiry on the left to configure and issue an auditable quotation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
