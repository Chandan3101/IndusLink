/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, Shield, ArrowRight, Building, Mail, FileCheck } from 'lucide-react';

interface AccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'start';
}

export const AccessModal: React.FC<AccessModalProps> = ({ isOpen, onClose, initialMode }) => {
  const [tab, setTab] = useState<'onboard' | 'roadmap'>(initialMode === 'login' ? 'roadmap' : 'onboard');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [materialStream, setMaterialStream] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid work email address.');
      return;
    }
    if (!company.trim()) {
      setError('Please specify your facility or organization.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setEmail('');
    setCompany('');
    setMaterialStream('');
    setError('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="access-modal-title"
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="glass-surface-floating rounded-3xl max-w-lg w-full max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain p-6 sm:p-8 shadow-2xl relative text-left">
        {/* Top burgundy accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#9D1738] to-transparent opacity-90" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 min-h-11 min-w-11 inline-flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#61646E] dark:text-[#94A3B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738]"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 pr-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#9D1738] dark:text-[#E899AA] uppercase tracking-wider mb-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Evaluation Access & Pilot Onboarding</span>
          </div>
          <h3
            id="access-modal-title"
            className="font-serif text-2xl sm:text-3xl font-semibold text-[#15161A] dark:text-[#F8FAFC]"
          >
            {tab === 'onboard' ? 'Request Pilot Evaluation Access' : 'Enterprise Authentication Portal'}
          </h3>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1.5 rounded-xl glass-surface mb-6 text-xs font-semibold">
          <button
            onClick={() => setTab('onboard')}
            className={`min-h-11 py-2 px-3 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738] ${
              tab === 'onboard'
                ? 'bg-[#9D1738] text-[#F8FAFC] shadow-sm'
                : 'text-[#61646E] dark:text-[#94A3B8]'
            }`}
          >
            Pilot Access Request
          </button>
          <button
            onClick={() => setTab('roadmap')}
            className={`min-h-11 py-2 px-3 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738] ${
              tab === 'roadmap'
                ? 'bg-[#9D1738] text-[#F8FAFC] shadow-sm'
                : 'text-[#61646E] dark:text-[#94A3B8]'
            }`}
          >
            Authentication Roadmap
          </button>
        </div>

        {tab === 'onboard' ? (
          submitted ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl font-semibold text-[#15161A] dark:text-[#F8FAFC]">
                Evaluation Request Received
              </h4>
              <p className="text-xs sm:text-sm text-[#61646E] dark:text-[#94A3B8] leading-relaxed max-w-sm mx-auto">
                Thank you, <strong className="text-[#15161A] dark:text-[#F8FAFC]">{email}</strong>. Our industrial materials evaluation engineering group will review your byproduct stream parameters and contact you regarding sandbox onboarding.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="px-5 py-2 rounded-full text-xs font-semibold text-[#8E919B] hover:text-[#15161A] dark:hover:text-[#F8FAFC] transition-colors"
                >
                  Submit another request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <p className="text-[#61646E] dark:text-[#94A3B8] leading-relaxed">
                IndusLink is actively onboarding industrial facilities generating or seeking secondary mineral, biomass, and chemical streams for structured dossier verification.
              </p>

              {error && (
                <div className="p-2.5 rounded-lg border border-red-500/40 bg-red-500/10 text-red-800 dark:text-red-300">
                  {error}
                </div>
              )}

              <div>
                <label className="block font-semibold text-[#15161A] dark:text-[#F8FAFC] mb-1">
                  Work Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@facility.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl glass-surface text-[#15161A] dark:text-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#15161A] dark:text-[#F8FAFC] mb-1">
                  Facility / Organization Name *
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Apex Minerals Refining"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl glass-surface text-[#15161A] dark:text-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#15161A] dark:text-[#F8FAFC] mb-1">
                  Byproduct or Target Application
                </label>
                <input
                  type="text"
                  value={materialStream}
                  onChange={(e) => setMaterialStream(e.target.value)}
                  placeholder="e.g. Biomass ash, copper slag, foundry sand..."
                  className="w-full px-3.5 py-2.5 rounded-xl glass-surface text-[#15161A] dark:text-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-full text-xs font-semibold bg-[#9D1738] hover:bg-[#BE185D] text-[#F8FAFC] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(157,23,56,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738]"
                >
                  <span>Request Technical Evaluation Access</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-[11px] text-center text-[#8E919B]">
                Strict NDA & industrial trade secret confidentiality observed.
              </div>
            </form>
          )
        ) : (
          <div className="space-y-4 text-xs text-[#61646E] dark:text-[#94A3B8] leading-relaxed">
            <div className="p-4 rounded-2xl glass-surface">
              <span className="font-semibold text-[#15161A] dark:text-[#F8FAFC] block mb-1">
                Single Sign-On & Dedicated Auth Infrastructure
              </span>
              <p className="text-[11px]">
                In accordance with IndusLink architecture guidelines, real authentication and account management will be provisioned in the upcoming platform phase.
              </p>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#9D1738] dark:text-[#E899AA] shrink-0" />
                <span>Enterprise SAML / OAuth 2.0 multi-tenant integration planned</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#9D1738] dark:text-[#E899AA] shrink-0" />
                <span>Role-based access controls for plant operators vs analytical chemists</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#9D1738] dark:text-[#E899AA] shrink-0" />
                <span>Certified ISO 17025 laboratory verification uploads</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setTab('onboard')}
                className="w-full py-2.5 rounded-full text-xs font-semibold glass-surface text-[#15161A] dark:text-[#F8FAFC] hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738]"
              >
                Join the Pilot Program
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
