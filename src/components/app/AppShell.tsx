/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  FileSpreadsheet,
  Layers,
  FileCheck,
  Cpu,
  Repeat,
  DollarSign,
  Leaf,
  Activity,
  Sliders,
  Network,
  Send,
  CheckCircle,
  FileText,
  Building,
  Users,
  History,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Sun,
  Moon,
  LogOut,
  ArrowLeft,
  X,
  Menu,
  Scale,
  Shield,
  HelpCircle,
} from 'lucide-react';
import type {
  AppNavTab,
  WorkspaceMode,
  UserProfile,
  RegisteredMaterial,
  BuyerSpecification,
  EnquiryRecord,
  OfferRecord,
  AuditTrailEvent,
  ClusterNode,
} from '../../types/index.ts';
import {
  BuyerOverview,
  MaterialDiscoveryView,
  BuyerSpecificationBuilder,
  MatchAssessmentModal,
  CandidateComparisonView,
  BuyerEnquiriesView,
} from './BuyerViews.tsx';
import {
  SellerOverview,
  ByproductRegistrationWizard,
  MaterialPassportView,
  PotentialBuyerDiscoveryView,
  SellerEnquiriesView,
} from './SellerViews.tsx';
import { IntelligenceHub } from './IntelligenceViews.tsx';
import {
  EvidenceCenterView,
  ReportsView,
  FacilitiesView,
  AuditHistoryView,
} from './AdminViews.tsx';
import { LifeVaultSidebar } from './LifeVaultSidebar.tsx';
import { DualSymbiosisView } from './DualSymbiosisView.tsx';

interface AppShellProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSwitchUser: (userId: string) => void;
  onExitToLanding: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  materials: RegisteredMaterial[];
  buyerSpecs: BuyerSpecification[];
  enquiries: EnquiryRecord[];
  offers: OfferRecord[];
  auditLogs: AuditTrailEvent[];
  clusterNodes: ClusterNode[];
  onAddMaterial: (mat: RegisteredMaterial) => void;
  onAddBuyerSpec: (spec: BuyerSpecification) => void;
  onSubmitEnquiry: (enquiry: Omit<EnquiryRecord, 'id' | 'inquiryDate' | 'status' | 'auditHistory'>) => void;
  onCreateOffer: (offer: Omit<OfferRecord, 'id' | 'issuedDate'>) => void;
  onAcceptOffer: (offerId: string) => void;
  onDeclineOffer: (offerId: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  onExitToLanding,
  isDark,
  onToggleTheme,
  materials,
  buyerSpecs,
  enquiries,
  offers,
  auditLogs,
  clusterNodes,
  onAddMaterial,
  onAddBuyerSpec,
  onSubmitEnquiry,
  onCreateOffer,
  onAcceptOffer,
  onDeclineOffer,
}) => {
  const [activeTab, setActiveTab] = useState<AppNavTab>('dashboard');
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>(currentUser.workspace);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Assessment modal state
  const [assessingPair, setAssessingPair] = useState<{
    material: RegisteredMaterial;
    spec: BuyerSpecification;
  } | null>(null);

  // Compare selection state
  const [comparedMaterialIds, setComparedMaterialIds] = useState<string[]>([]);

  const handleToggleCompare = (materialId: string) => {
    setComparedMaterialIds((prev) =>
      prev.includes(materialId) ? prev.filter((id) => id !== materialId) : [...prev, materialId]
    );
  };

  return (
    <div className="min-h-screen bg-transparent text-[var(--text-primary)] flex overflow-x-hidden relative z-10">
      {/* LifeVault-Inspired Collapsible Animated Sidebar */}
      <LifeVaultSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        currentUser={currentUser}
        allUsers={allUsers}
        onSwitchUser={onSwitchUser}
        onExitToLanding={onExitToLanding}
        isMobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Floating Rounded Top Header Bar */}
        <header className="sticky top-2 sm:top-3 z-30 mx-3 sm:mx-6 my-2 rounded-2xl glass-surface-elevated border border-slate-200/80 dark:border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 shadow-lg backdrop-blur-2xl transition-all duration-300">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl glass-surface text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Current Workspace Switcher Pill */}
            <div className="flex items-center p-1 rounded-xl glass-surface text-xs font-semibold">
              <button
                onClick={() => setWorkspaceMode('buyer')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  workspaceMode === 'buyer'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-[var(--text-secondary)] hover:text-slate-950 dark:hover:text-[var(--text-primary)]'
                }`}
              >
                Buyer View
              </button>
              <button
                onClick={() => setWorkspaceMode('seller')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  workspaceMode === 'seller'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-[var(--text-secondary)] hover:text-slate-950 dark:hover:text-[var(--text-primary)]'
                }`}
              >
                Seller View
              </button>
              <button
                onClick={() => setWorkspaceMode('both')}
                className={`hidden sm:inline-block px-3 py-1 rounded-lg transition-all ${
                  workspaceMode === 'both'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-[var(--text-secondary)] hover:text-slate-950 dark:hover:text-[var(--text-primary)]'
                }`}
              >
                Dual Symbiosis
              </button>
            </div>
          </div>

          {/* Quick Actions & Demo Account Switcher */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Demo Account Quick Switcher */}
            <select
              value={currentUser.id}
              onChange={(e) => onSwitchUser(e.target.value)}
              className="hidden lg:block px-3 py-1.5 rounded-xl glass-surface text-xs font-medium text-slate-800 dark:text-[var(--text-primary)] border border-slate-200/80 dark:border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              title="Switch demo persona"
            >
              {allUsers.map((u) => (
                <option key={u.id} value={u.id} className="bg-white text-slate-900 dark:bg-zinc-900 dark:text-white">
                  Demo Org: {u.organization} ({u.organizationType})
                </option>
              ))}
            </select>

            {/* Quick Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-xl glass-surface text-slate-600 dark:text-[var(--text-secondary)] hover:text-slate-950 dark:hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Search Materials & Specifications (Cmd+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications */}
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl glass-surface text-slate-600 dark:text-[var(--text-secondary)] hover:text-slate-950 dark:hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl glass-surface text-slate-600 dark:text-[var(--text-secondary)] hover:text-slate-950 dark:hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Notifications Drawer with Pop Animation */}
        {notificationsOpen && (
          <div className="absolute top-16 right-4 sm:right-6 w-80 glass-surface-floating rounded-2xl p-4 shadow-2xl z-50 space-y-3 dropdown-pop-animation text-left border border-slate-200/80 dark:border-white/10">
            <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
              <span className="font-semibold text-xs text-[var(--text-primary)]">Notifications</span>
              <button onClick={() => setNotificationsOpen(false)} className="text-slate-400 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-800 dark:text-blue-300">
                <strong>New Formal Quotation:</strong> Prairie Horizon issued quote for Class F Fly Ash.
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300">
                <strong>Unknown Data Guard:</strong> Lab XRD verification pending on Rice Husk Ash.
              </div>
            </div>
          </div>
        )}

        {/* Quick Search Modal with Pop Animation */}
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 dark:bg-black/75 backdrop-blur-md">
            <div className="glass-surface-floating rounded-3xl max-w-xl w-full p-5 space-y-4 shadow-2xl dialog-pop-animation border border-slate-200/90 dark:border-white/10">
              <div className="flex items-center gap-2.5 pb-2 border-b border-black/5 dark:border-white/5">
                <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type to search materials, specifications, facilities, or standards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-[var(--text-primary)] placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus-visible:outline-none"
                />
                <button onClick={() => setSearchOpen(false)} className="text-slate-400 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 pt-1 text-xs">
                <span className="text-[10px] font-mono text-slate-400 dark:text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Quick Links</span>
                <div
                  onClick={() => {
                    setActiveTab('discover');
                    setSearchOpen(false);
                  }}
                  className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <span className="font-medium text-slate-800 dark:text-zinc-200">Rice Husk Ash (Biomass Combustion Ash)</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">Material</span>
                </div>
                <div
                  onClick={() => {
                    setActiveTab('matching');
                    setSearchOpen(false);
                  }}
                  className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <span className="font-medium text-slate-800 dark:text-zinc-200">Marine Infrastructure SCM Specification</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 text-[10px] font-semibold">Specification</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Workspace Content Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* DASHBOARD ROUTE */}
          {activeTab === 'dashboard' && (
            workspaceMode === 'both' ? (
              <DualSymbiosisView
                materials={materials}
                buyerSpecs={buyerSpecs}
                enquiries={enquiries}
                offers={offers}
                clusterNodes={clusterNodes}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenRegisterMaterial={() => setActiveTab('registry')}
                onOpenCreateSpec={() => setActiveTab('registry')}
              />
            ) : workspaceMode === 'seller' ? (
              <SellerOverview
                materials={materials}
                buyerSpecs={buyerSpecs}
                enquiries={enquiries}
                offers={offers}
                onRegisterMaterial={onAddMaterial}
                onCreateOffer={onCreateOffer}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            ) : (
              <BuyerOverview
                materials={materials}
                buyerSpecs={buyerSpecs}
                enquiries={enquiries}
                offers={offers}
                onAddSpecification={onAddBuyerSpec}
                onSubmitEnquiry={onSubmitEnquiry}
                onAcceptOffer={onAcceptOffer}
                onDeclineOffer={onDeclineOffer}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )
          )}

          {/* DEDICATED BUYER WORKSPACE ROUTE */}
          {activeTab === 'buyer_overview' && (
            <BuyerOverview
              materials={materials}
              buyerSpecs={buyerSpecs}
              enquiries={enquiries}
              offers={offers}
              onAddSpecification={onAddBuyerSpec}
              onSubmitEnquiry={onSubmitEnquiry}
              onAcceptOffer={onAcceptOffer}
              onDeclineOffer={onDeclineOffer}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* DEDICATED SELLER WORKSPACE ROUTE */}
          {activeTab === 'seller_overview' && (
            <SellerOverview
              materials={materials}
              buyerSpecs={buyerSpecs}
              enquiries={enquiries}
              offers={offers}
              onRegisterMaterial={onAddMaterial}
              onCreateOffer={onCreateOffer}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* DISCOVER MATERIALS ROUTE */}
          {activeTab === 'discover' && (
            <MaterialDiscoveryView
              materials={materials}
              buyerSpecs={buyerSpecs}
              enquiries={enquiries}
              offers={offers}
              onAddSpecification={onAddBuyerSpec}
              onSubmitEnquiry={onSubmitEnquiry}
              onAcceptOffer={onAcceptOffer}
              onDeclineOffer={onDeclineOffer}
              onSelectForAssessment={(mat, spec) => setAssessingPair({ material: mat, spec })}
              onToggleCompare={handleToggleCompare}
              comparedMaterialIds={comparedMaterialIds}
            />
          )}

          {/* REGISTRY / SPEC BUILDER ROUTE */}
          {activeTab === 'registry' && (
            workspaceMode === 'seller' ? (
              <ByproductRegistrationWizard
                onSaveMaterial={(mat) => {
                  onAddMaterial(mat);
                  setActiveTab('dashboard');
                }}
                onCancel={() => setActiveTab('dashboard')}
              />
            ) : (
              <BuyerSpecificationBuilder
                onSaveSpec={(spec) => {
                  onAddBuyerSpec(spec);
                  setActiveTab('dashboard');
                }}
                onCancel={() => setActiveTab('dashboard')}
              />
            )
          )}

          {/* PASSPORT ROUTE */}
          {activeTab === 'passport' && (
            <MaterialPassportView materials={materials} />
          )}

          {/* BATCHES ROUTE */}
          {activeTab === 'batches' && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
                Active Material Batches & Silo Storage
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {materials.flatMap((m) =>
                  m.batches.map((b) => (
                    <div key={b.id} className="glass-surface-elevated rounded-2xl p-5 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono text-emerald-400 block">{m.name}</span>
                          <h4 className="font-mono text-base font-bold text-[var(--text-primary)]">{b.batchNumber}</h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400">
                          {b.status}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Quantity: <strong>{b.quantityTons} tons</strong> • Produced on {b.productionDate}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">Storage: {b.storageCondition}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* INTELLIGENCE SUITE ROUTE */}
          {[
            'matching',
            'alternative_uses',
            'cost_engine',
            'environmental',
            'reliability',
            'what_if',
            'cluster_optimizer',
          ].includes(activeTab) && (
            <IntelligenceHub
              materials={materials}
              buyerSpecs={buyerSpecs}
              auditLogs={auditLogs}
              clusterNodes={clusterNodes}
              initialActiveEngine={
                activeTab === 'matching'
                  ? 'explainable_matching'
                  : activeTab === 'alternative_uses'
                  ? 'alternative_uses'
                  : activeTab === 'cost_engine'
                  ? 'true_cost'
                  : activeTab === 'environmental'
                  ? 'environmental'
                  : activeTab === 'reliability'
                  ? 'reliability'
                  : activeTab === 'what_if'
                  ? 'what_if'
                  : 'cluster_optimizer'
              }
            />
          )}

          {/* ENQUIRIES ROUTE */}
          {activeTab === 'enquiries' && (
            workspaceMode === 'seller' ? (
              <SellerEnquiriesView
                enquiries={enquiries}
                offers={offers}
                onCreateOffer={onCreateOffer}
              />
            ) : (
              <BuyerEnquiriesView
                enquiries={enquiries}
                offers={offers}
                onAcceptOffer={onAcceptOffer}
                onDeclineOffer={onDeclineOffer}
              />
            )
          )}

          {/* OFFERS ROUTE */}
          {activeTab === 'offers' && (
            <BuyerEnquiriesView
              enquiries={enquiries}
              offers={offers}
              onAcceptOffer={onAcceptOffer}
              onDeclineOffer={onDeclineOffer}
            />
          )}

          {/* APPROVALS ROUTE */}
          {activeTab === 'approvals' && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
                Reviews, Technical Clearance & Approvals
              </h3>
              <div className="p-4 rounded-2xl glass-surface space-y-2 text-xs">
                <span className="font-semibold block text-[var(--text-primary)]">Human-in-the-Loop Governance:</span>
                <p className="text-[var(--text-secondary)]">
                  Algorithmic compatibility clearance requires sign-off from both the generating facility chemical engineer and the recipient plant QA director before shipment allocation.
                </p>
              </div>
            </div>
          )}

          {/* ADMINISTRATION ROUTES */}
          {activeTab === 'evidence_center' && (
            <EvidenceCenterView materials={materials} />
          )}

          {activeTab === 'reports' && (
            <ReportsView materials={materials} buyerSpecs={buyerSpecs} />
          )}

          {activeTab === 'facilities' && (
            <FacilitiesView />
          )}

          {activeTab === 'audit_log' && (
            <AuditHistoryView auditLogs={auditLogs} />
          )}

          {activeTab === 'team' && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
                Organization Team & Role Permissions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {allUsers.map((u) => (
                  <div key={u.id} className="glass-surface-elevated rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-mono text-emerald-400 block">{u.role.toUpperCase()}</span>
                    <h4 className="font-serif text-base font-semibold text-[var(--text-primary)]">{u.name}</h4>
                    <p className="text-xs text-[var(--text-secondary)]">{u.title}</p>
                    <span className="text-[11px] text-zinc-400 block">{u.email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="glass-surface-elevated rounded-2xl p-6 max-w-xl space-y-4 text-xs">
              <h3 className="font-serif text-xl font-semibold text-[var(--text-primary)]">
                Platform Preferences & Security
              </h3>
              <div className="space-y-2">
                <label className="block text-[var(--text-secondary)] font-semibold">Active Organization Context</label>
                <div className="p-3 rounded-xl glass-surface text-[var(--text-primary)] font-bold">
                  {currentUser.organization} ({currentUser.organizationType})
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[var(--text-secondary)] font-semibold">Compliance Regulatory Boundary</label>
                <div className="p-3 rounded-xl glass-surface text-[var(--text-primary)]">
                  US EPA SW-846 / ASTM C618 / ISO 17025 Accredited
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MATCH ASSESSMENT MODAL */}
      {assessingPair && (
        <MatchAssessmentModal
          material={assessingPair.material}
          spec={assessingPair.spec}
          onClose={() => setAssessingPair(null)}
          onInitiateEnquiry={(mat, spec) => {
            onSubmitEnquiry({
              buyerOrg: currentUser.organization,
              sellerOrg: mat.sourceFacility,
              materialName: mat.name,
              materialId: mat.id,
              specificationId: spec.id,
              requestedTonnage: spec.monthlyDemandTons,
              targetDeliveryDate: '2026-11-20',
              deliveryLocation: spec.deliveryLocation,
              message: `Initiating technical off-take inquiry for ${spec.monthlyDemandTons} tons of ${mat.name} for ${spec.targetApplication}. Please confirm loading window and latest batch assay.`,
              logisticsArrangedBy: 'Buyer',
            });
            setActiveTab('enquiries');
          }}
        />
      )}

      {/* FLOATING COMPARE TRAY */}
      {comparedMaterialIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 glass-surface-floating rounded-full px-5 py-2.5 shadow-2xl border border-emerald-500/40 flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-200">
          <span className="text-xs font-semibold text-[var(--text-primary)]">
            {comparedMaterialIds.length} Materials Selected for Benchmark
          </span>
          <button
            onClick={() => setActiveTab('matching')}
            className="glow-button-emerald px-4 py-1.5 rounded-full text-xs font-semibold"
          >
            Open Side-by-Side Comparison
          </button>
          <button
            onClick={() => setComparedMaterialIds([])}
            className="p-1 rounded-full text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
