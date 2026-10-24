/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, Shield, ArrowRight, Building, Mail, FileCheck, ArrowUpRight } from 'lucide-react';
import { DEMO_USERS } from '../data/mockData.ts';

interface AccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'start';
  onLaunchAuthenticatedApp: (userId: string) => void;
}

export const AccessModal: React.FC<AccessModalProps> = ({
  isOpen,
  onClose,
  initialMode,
  onLaunchAuthenticatedApp,
}) => {
  const [tab, setTab] = useState<'signin' | 'onboard'>(initialMode === 'login' ? 'signin' : 'onboard');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [workspaceSelection, setWorkspaceSelection] = useState<'buyer' | 'seller' | 'both'>('buyer');
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

  const handleLaunchWithDemo = (userId: string) => {
    onClose();
    onLaunchAuthenticatedApp(userId);
  };

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid work email address.');
      return;
    }
    // Launch app matching selected workspace
    const targetUserId =
      workspaceSelection === 'seller'
        ? 'user-seller'
        : workspaceSelection === 'both'
        ? 'user-both'
        : 'user-buyer';
    onClose();
    onLaunchAuthenticatedApp(targetUserId);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="access-modal-title"
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto p-4 bg-black/50 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="glass-surface-floating rounded-3xl max-w-lg w-full max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain p-6 sm:p-8 shadow-2xl relative text-left dialog-pop-animation border border-slate-200/90 dark:border-white/10">
        {/* Top emerald accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#10b981] to-transparent opacity-90" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 min-h-11 min-w-11 inline-flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 pr-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Industrial Platform Access Portal</span>
          </div>
          <h3
            id="access-modal-title"
            className="font-serif text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-[#F8FAFC]"
          >
            {tab === 'signin' ? 'Sign In / Workspace Access' : 'Quick Organization Onboarding'}
          </h3>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl glass-surface mb-6 text-xs font-semibold">
          <button
            onClick={() => setTab('signin')}
            className={`min-h-11 py-2 px-3 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              tab === 'signin'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In / Quick Demo
          </button>
          <button
            onClick={() => setTab('onboard')}
            className={`min-h-11 py-2 px-3 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              tab === 'onboard'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            New Organization
          </button>
        </div>

        {tab === 'signin' ? (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              Launch directly into an authenticated enterprise workspace with pre-configured facilities, dossiers, and active commercial opportunities:
            </p>

            <div className="space-y-2.5">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleLaunchWithDemo(user.id)}
                  className="w-full p-3.5 rounded-2xl glass-surface-elevated hover:border-emerald-500/50 text-left transition-all group flex items-center justify-between border border-slate-200/60 dark:border-white/10"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 dark:text-[var(--text-primary)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {user.name}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        {user.workspace.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-600 dark:text-[var(--text-secondary)] block mt-0.5">
                      {user.title} • {user.organization}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-500 block">
                      Facility: {user.facility}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitCustom} className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              One organization. One account. Configure whether your facilities generate byproducts, purchase feedstocks, or both:
            </p>

            {error && (
              <div className="p-2.5 rounded-lg border border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-900 dark:text-[#F8FAFC] mb-1">
                Work Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="engineer@facility.com"
                required
                className="w-full px-3.5 py-2.5 rounded-xl glass-surface text-slate-900 dark:text-[#F8FAFC] border border-slate-200/90 dark:border-white/10 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-900 dark:text-[#F8FAFC] mb-1">
                Organization / Facility Name
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Apex Industrial Minerals"
                className="w-full px-3.5 py-2.5 rounded-xl glass-surface text-slate-900 dark:text-[#F8FAFC] border border-slate-200/90 dark:border-white/10 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-900 dark:text-[#F8FAFC] mb-1">
                Primary Organization Focus
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['buyer', 'seller', 'both'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setWorkspaceSelection(role)}
                    className={`py-2 px-3 rounded-xl border font-semibold text-center uppercase tracking-wider text-[10px] transition-all ${
                      workspaceSelection === role
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'glass-surface text-slate-600 dark:text-[var(--text-secondary)] border-slate-200/80 dark:border-white/10 hover:text-slate-900'
                    }`}
                  >
                    {role === 'both' ? 'Buy & Sell' : role}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full glow-button-emerald py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <span>Enter Enterprise Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-[11px] text-center text-[#8E919B]">
              Strict NDA & industrial trade secret confidentiality observed.
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
