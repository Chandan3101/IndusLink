/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileCheck,
  Download,
  Building,
  Users,
  History,
  Settings,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Plus,
  Printer,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import type {
  RegisteredMaterial,
  BuyerSpecification,
  AuditTrailEvent,
  UserProfile,
} from '../../types/index.ts';
import { AnimatedHeading } from '../AnimatedHeading.tsx';

/**
 * EVIDENCE CENTER
 */
export const EvidenceCenterView: React.FC<{
  materials: RegisteredMaterial[];
}> = ({ materials }) => {
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const allDocs = materials.flatMap((m) =>
    m.documents.map((d) => ({ ...d, materialName: m.name, facility: m.sourceFacility }))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
            Quality Assurance & Regulatory Repository
          </span>
          <AnimatedHeading
            tag="h3"
            className="font-serif text-2xl font-semibold text-[var(--text-primary)]"
          >
            Evidence Center & Laboratory Assays
          </AnimatedHeading>
        </div>
        <button
          onClick={() => setActiveMessage('Upload Simulated: Drag & drop PDF or XRF test files to attach to this material stream.')}
          className="glow-button-emerald px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Certified Assay</span>
        </button>
      </div>

      {activeMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
          <span>{activeMessage}</span>
          <button
            onClick={() => setActiveMessage(null)}
            className="text-xs font-mono font-bold px-2 py-0.5 rounded hover:bg-emerald-500/20"
          >
            ✕
          </button>
        </div>
      )}

      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
        <strong>Mandatory Evidence Notice:</strong> Document uploaded — authenticity not independently verified.
      </div>

      <div className="data-table-container rounded-2xl glass-surface-elevated overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-black/10 dark:bg-white/5 text-[10px] font-mono text-[var(--text-secondary)] uppercase">
            <tr>
              <th className="p-4">Document Title</th>
              <th className="p-4">Document Type</th>
              <th className="p-4">Material / Stream</th>
              <th className="p-4">Accredited Issuer</th>
              <th className="p-4">Upload Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {allDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <td className="p-4 font-semibold text-[var(--text-primary)]">{doc.name}</td>
                <td className="p-4 font-mono text-[11px] text-zinc-400">{doc.type}</td>
                <td className="p-4 text-[var(--text-primary)]">{doc.materialName}</td>
                <td className="p-4 text-[var(--text-secondary)]">{doc.issuer}</td>
                <td className="p-4 font-mono text-[11px] text-zinc-400">{doc.uploadDate}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400">
                    ISO 17025 Verified
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setActiveMessage(`Viewing certified assay: ${doc.name} (Issued by ${doc.issuer})`)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-emerald-400"
                    title="View Document"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * REPORTS VIEW
 */
export const ReportsView: React.FC<{
  materials: RegisteredMaterial[];
  buyerSpecs: BuyerSpecification[];
}> = ({ materials, buyerSpecs }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
            Auditable Decision Output
          </span>
          <AnimatedHeading
            tag="h3"
            className="font-serif text-2xl font-semibold text-[var(--text-primary)]"
          >
            Traceable Engineering & Circularity Reports
          </AnimatedHeading>
        </div>
        <button
          onClick={() => window.print()}
          className="glow-button-emerald px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export Full Audit Pack</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: 'Technical Material Suitability Dossier',
            code: 'REP-MAT-2026-091',
            date: '2026-10-24',
            desc: 'Complete elemental breakdown, mineralogical phase scan, and ASTM C618 pozzolanic activity benchmarking for Rice Husk Ash.',
          },
          {
            title: 'Delivered Logistics & Carbon Abatement Scenario',
            code: 'REP-LCA-2026-042',
            date: '2026-10-22',
            desc: 'ISO 14044 certified comparative lifecycle report calculating net avoided emissions (-640 kg CO2e/t) against Ordinary Portland Cement.',
          },
          {
            title: 'Industrial Cluster Synergy Optimization Log',
            code: 'REP-OPT-2026-118',
            date: '2026-10-18',
            desc: 'Regional multi-facility routing analysis identifying 4 bilateral mineral exchanges with $148,000 annual logistics savings.',
          },
          {
            title: 'Regulatory End-of-Waste Verification Audit',
            code: 'REP-EOW-2026-003',
            date: '2026-10-14',
            desc: 'Statutory non-hazardous byproduct certificate compliance checklist for blast furnace slag and spent foundry sand.',
          },
        ].map((rep, idx) => (
          <div key={idx} className="glass-surface-elevated rounded-2xl p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 block">{rep.code} • {rep.date}</span>
                <h4 className="font-serif text-base font-semibold text-[var(--text-primary)]">{rep.title}</h4>
              </div>
              <button
                onClick={() => window.print()}
                className="p-1.5 rounded-lg glass-surface hover:bg-white/10 text-emerald-400"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{rep.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * FACILITIES VIEW
 */
export const FacilitiesView: React.FC = () => {
  const facilities = [
    { name: 'Apex Dover Thermal Generation Facility', city: 'Grand Rapids, MI', silos: '3 Dry Bulk Silos (2,400 t)', sector: 'Agriculture & Food' },
    { name: 'Great Lakes Integrated Blast Furnace Works', city: 'Gary, IN', silos: 'Pneumatic Dome (8,000 t)', sector: 'Mining & Metals' },
    { name: 'Holcim Bayside Coastal Blended Terminal', city: 'Port of Chicago, IL', silos: '4 Slipform Concrete Silos', sector: 'Construction' },
    { name: 'Valley Chemical Fertilizer Complex', city: 'Kalamazoo, MI', silos: 'Outdoor Covered Pad Stack', sector: 'Chemicals' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
          Asset Management
        </span>
        <AnimatedHeading
          tag="h3"
          className="font-serif text-2xl font-semibold text-[var(--text-primary)]"
        >
          Registered Industrial Facilities
        </AnimatedHeading>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facilities.map((fac, idx) => (
          <div key={idx} className="glass-surface-elevated rounded-2xl p-5 space-y-2">
            <span className="text-[10px] font-mono text-emerald-400 block">{fac.sector}</span>
            <h4 className="font-serif text-lg font-semibold text-[var(--text-primary)]">{fac.name}</h4>
            <p className="text-xs text-[var(--text-secondary)]">Location: {fac.city}</p>
            <div className="pt-2 text-xs text-[var(--text-secondary)] border-t border-black/5 dark:border-white/5">
              Storage Capacity: <strong className="text-[var(--text-primary)]">{fac.silos}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * AUDIT HISTORY VIEW
 */
export const AuditHistoryView: React.FC<{
  auditLogs: AuditTrailEvent[];
}> = ({ auditLogs }) => {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
          Traceable Governance Ledger
        </span>
        <AnimatedHeading
          tag="h3"
          className="font-serif text-2xl font-semibold text-[var(--text-primary)]"
        >
          Cryptographic Audit History
        </AnimatedHeading>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Immutable event log of every material registration, specification update, constraint failure, and authorized transaction.
        </p>
      </div>

      <div className="data-table-container rounded-2xl glass-surface-elevated overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-black/10 dark:bg-white/5 text-[10px] font-mono text-[var(--text-secondary)] uppercase">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Actor</th>
              <th className="p-4">Category</th>
              <th className="p-4">Action</th>
              <th className="p-4">Audit Details</th>
              <th className="p-4 font-mono">Ledger Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <td className="p-4 font-mono text-[11px] text-zinc-400 whitespace-nowrap">{log.timestamp}</td>
                <td className="p-4 font-medium text-[var(--text-primary)]">{log.actor}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/10 dark:bg-white/5 text-cyan-400">
                    {log.category}
                  </span>
                </td>
                <td className="p-4 font-semibold text-[var(--text-primary)]">{log.action}</td>
                <td className="p-4 text-[var(--text-secondary)] max-w-xs">{log.details}</td>
                <td className="p-4 font-mono text-[10px] text-zinc-500 whitespace-nowrap">{log.hash}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
