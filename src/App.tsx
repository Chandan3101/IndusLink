/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import type {
  SectionId,
  RegisteredMaterial,
  BuyerSpecification,
  EnquiryRecord,
  OfferRecord,
  AuditTrailEvent,
  UserProfile,
} from './types/index.ts';
import {
  DEMO_USERS,
  INITIAL_REGISTERED_MATERIALS,
  INITIAL_BUYER_SPECS,
  INITIAL_ENQUIRIES,
  INITIAL_OFFERS,
  INITIAL_AUDIT_LOGS,
  CLUSTER_SYNERGY_NODES,
} from './data/mockData.ts';
import { Navigation } from './components/Navigation.tsx';
import { ScrollProgressBar } from './components/ScrollProgressBar.tsx';
import { RibbedStructureCanvas } from './components/RibbedStructureCanvas.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { EvaluationSection } from './components/EvaluationSection.tsx';
import { ExploreSection } from './components/ExploreSection.tsx';
import { AccessModal } from './components/AccessModal.tsx';
import { AppShell } from './components/app/AppShell.tsx';
import { EyesPointer } from './components/EyesPointer.tsx';
import { useLenis } from './utils/useLenis.ts';

export default function App() {
  const [viewMode, setViewMode] = useState<'public' | 'app'>('public');
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [accessMode, setAccessMode] = useState<'login' | 'start'>('start');

  // Multi-entity Platform State
  const [currentUserId, setCurrentUserId] = useState<string>('user-buyer');
  const [materials, setMaterials] = useState<RegisteredMaterial[]>(INITIAL_REGISTERED_MATERIALS);
  const [buyerSpecs, setBuyerSpecs] = useState<BuyerSpecification[]>(INITIAL_BUYER_SPECS);
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>(INITIAL_ENQUIRIES);
  const [offers, setOffers] = useState<OfferRecord[]>(INITIAL_OFFERS);
  const [auditLogs, setAuditLogs] = useState<AuditTrailEvent[]>(INITIAL_AUDIT_LOGS);

  const currentUser = DEMO_USERS.find((u) => u.id === currentUserId) || DEMO_USERS[0];

  // Smooth Lenis scroll on public landing page
  useLenis(viewMode === 'public');

  // Synchronize dark mode class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Section scroll tracking via IntersectionObserver (when in public mode)
  useEffect(() => {
    if (viewMode !== 'public') return;

    const sections: SectionId[] = ['home', 'problem', 'how-it-works', 'platform'];
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        {
          rootMargin: '-30% 0px -50% 0px',
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [viewMode]);

  const handleNavigate = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    }
  };

  const handleOpenAccess = (mode: 'login' | 'start') => {
    setAccessMode(mode);
    setIsAccessModalOpen(true);
  };

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleAddMaterial = (mat: RegisteredMaterial) => {
    setMaterials((prev) => [mat, ...prev]);
    const event: AuditTrailEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: currentUser.name,
      action: 'Registered New Byproduct Stream',
      category: 'Material',
      details: `Material ${mat.name} registered with ${mat.monthlyVolumeTons} t/mo volume at ${mat.sourceFacility}.`,
      hash: `0x${Math.random().toString(16).substring(2, 10)}`,
    };
    setAuditLogs((prev) => [event, ...prev]);
  };

  const handleAddBuyerSpec = (spec: BuyerSpecification) => {
    setBuyerSpecs((prev) => [spec, ...prev]);
    const event: AuditTrailEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: currentUser.name,
      action: 'Created Buyer Specification',
      category: 'Assessment',
      details: `Defined receiving criteria for ${spec.targetApplication} (Demand: ${spec.monthlyDemandTons} t/mo).`,
      hash: `0x${Math.random().toString(16).substring(2, 10)}`,
    };
    setAuditLogs((prev) => [event, ...prev]);
  };

  const handleSubmitEnquiry = (enquiryData: Omit<EnquiryRecord, 'id' | 'inquiryDate' | 'status' | 'auditHistory'>) => {
    const newEnq: EnquiryRecord = {
      ...enquiryData,
      id: `enq-${Date.now().toString().slice(-4)}`,
      inquiryDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      auditHistory: [
        {
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          action: 'Technical Enquiry Transmitted to Supplier',
          actor: currentUser.name,
        },
      ],
    };
    setEnquiries((prev) => [newEnq, ...prev]);
    const event: AuditTrailEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: currentUser.name,
      action: 'Submitted Off-take Inquiry',
      category: 'Enquiry',
      details: `Enquiry #${newEnq.id} transmitted to ${newEnq.sellerOrg} for ${newEnq.requestedTonnage} tons ${newEnq.materialName}.`,
      hash: `0x${Math.random().toString(16).substring(2, 10)}`,
    };
    setAuditLogs((prev) => [event, ...prev]);
  };

  const handleCreateOffer = (offerData: Omit<OfferRecord, 'id' | 'issuedDate'>) => {
    const newOffer: OfferRecord = {
      ...offerData,
      id: `off-${Date.now().toString().slice(-4)}`,
      issuedDate: new Date().toISOString().split('T')[0],
    };
    setOffers((prev) => [newOffer, ...prev]);

    // Update parent enquiry status
    setEnquiries((prev) =>
      prev.map((e) => (e.id === offerData.enquiryId ? { ...e, status: 'Offer Issued' } : e))
    );

    const event: AuditTrailEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: currentUser.name,
      action: 'Issued Formal Commercial Quotation',
      category: 'Offer',
      details: `Quote #${newOffer.id} delivered price: $${newOffer.totalDeliveredPricePerTon}/t for ${newOffer.offeredTonnage} tons.`,
      hash: `0x${Math.random().toString(16).substring(2, 10)}`,
    };
    setAuditLogs((prev) => [event, ...prev]);
  };

  const handleAcceptOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'Accepted' } : o))
    );
    const event: AuditTrailEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: currentUser.name,
      action: 'Accepted Supplier Quotation',
      category: 'Offer',
      details: `Offer #${offerId} accepted and authorized for commercial logistics dispatch.`,
      hash: `0x${Math.random().toString(16).substring(2, 10)}`,
    };
    setAuditLogs((prev) => [event, ...prev]);
  };

  const handleDeclineOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'Declined' } : o))
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[var(--bg-page)]/75 text-[var(--text-primary)] transition-colors duration-300 relative">
        {/* Continuous 3D Ribbed Structure (Fixed Global WebGL Layer visible across landing and authenticated app) */}
        <RibbedStructureCanvas className={viewMode === 'app' ? 'opacity-80 transition-opacity duration-700' : 'opacity-100 transition-opacity duration-700'} />

        {/* Pointer eyes tracking effect (disabled on touch/reduced-motion, native cursor preserved) */}
        <EyesPointer />
        {viewMode === 'app' ? (
          /* =========================================================================
             AUTHENTICATED APPLICATION PLATFORM WORKSPACE
             ========================================================================= */
          <AppShell
            currentUser={currentUser}
            allUsers={DEMO_USERS}
            onSwitchUser={(userId) => setCurrentUserId(userId)}
            onExitToLanding={() => setViewMode('public')}
            isDark={isDark}
            onToggleTheme={handleToggleTheme}
            materials={materials}
            buyerSpecs={buyerSpecs}
            enquiries={enquiries}
            offers={offers}
            auditLogs={auditLogs}
            clusterNodes={CLUSTER_SYNERGY_NODES}
            onAddMaterial={handleAddMaterial}
            onAddBuyerSpec={handleAddBuyerSpec}
            onSubmitEnquiry={handleSubmitEnquiry}
            onCreateOffer={handleCreateOffer}
            onAcceptOffer={handleAcceptOffer}
            onDeclineOffer={handleDeclineOffer}
          />
        ) : (
          /* =========================================================================
             PUBLIC 4-SECTION LANDING PAGE & WEBSITE
             ========================================================================= */
          <>
            {/* Subtle Top Viewport Scroll Progress Bar */}
            <ScrollProgressBar />

            {/* Floating Navigation Pill */}
            <Navigation
              activeSection={activeSection}
              onNavigate={handleNavigate}
              isDark={isDark}
              onToggleTheme={handleToggleTheme}
              onOpenAccess={handleOpenAccess}
            />

            {/* Connected 4-Section Narrative */}
            <main>
              {/* Section 1 — Hero */}
              <HeroSection
                onNavigate={handleNavigate}
                onOpenAccess={handleOpenAccess}
              />

              {/* Section 2 — The Problem & Section 3 — How It Works */}
              <EvaluationSection />

              {/* Section 4 — Platform & Footer */}
              <ExploreSection
                onNavigate={handleNavigate}
                onOpenAccess={handleOpenAccess}
              />
            </main>

            {/* Access & Persona Onboarding Dialog */}
            <AccessModal
              isOpen={isAccessModalOpen}
              onClose={() => setIsAccessModalOpen(false)}
              initialMode={accessMode}
              onLaunchAuthenticatedApp={(userId) => {
                setCurrentUserId(userId);
                setViewMode('app');
              }}
            />
          </>
        )}
      </div>
    </MotionConfig>
  );
}
