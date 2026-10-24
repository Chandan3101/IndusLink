/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SectionId } from '../types/index.ts';
import { ILLUSTRATIVE_SCENARIOS } from '../data/mockData.ts';
import { WhatIfSimulator } from './WhatIfSimulator.tsx';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Layers,
  Sparkles,
  FileCheck,
} from 'lucide-react';

interface ExploreSectionProps {
  onNavigate: (section: SectionId) => void;
  onOpenAccess: (mode: 'login' | 'start') => void;
}

export const ExploreSection: React.FC<ExploreSectionProps> = ({ onNavigate, onOpenAccess }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState(ILLUSTRATIVE_SCENARIOS[0].id);

  const scenario =
    ILLUSTRATIVE_SCENARIOS.find((s) => s.id === selectedScenarioId) || ILLUSTRATIVE_SCENARIOS[0];

  return (
    <section
      id="explore"
      aria-label="Explore section"
      className="relative min-h-screen py-28 md:py-36 border-t border-black/5 dark:border-white/5 transition-colors overflow-hidden flex flex-col justify-between"
    >
      {/* Background Volumetric Light Blooms */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-[#9D1738]/8 dark:bg-[#9D1738]/12 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#C9AA79]/6 dark:bg-[#C9AA79]/10 blur-[110px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface text-xs font-semibold tracking-widest text-[#9D1738] dark:text-[#E899AA] uppercase mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Illustrative Case Studies</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-5xl font-medium tracking-tight text-[#15161A] dark:text-[#F4F1EC] leading-tight mb-4">
            “Same resource challenge. Different material requirements.”
          </h2>
          <p className="text-base sm:text-lg text-[#61646E] dark:text-[#A6A8B0] leading-relaxed mb-6">
            Compare how distinct secondary materials—even from the same plant—face completely different physical constraints, moisture freight penalties, and testing requirements.
          </p>

          {/* Mandatory Prominent Label */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-200 text-xs font-mono font-semibold shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>ILLUSTRATIVE SCENARIO — REQUIRES EVALUATION</span>
          </div>
        </div>

        {/* 3 Material Selector Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-surface-elevated max-w-2xl mb-8 overflow-x-auto scrollbar-none">
          {ILLUSTRATIVE_SCENARIOS.map((sc) => {
            const isSelected = selectedScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => setSelectedScenarioId(sc.id)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738] ${
                  isSelected
                    ? 'bg-[#9D1738] text-[#F4F1EC] shadow-[0_0_15px_rgba(157,23,56,0.35)]'
                    : 'text-[#61646E] dark:text-[#A6A8B0] hover:text-[#15161A] dark:hover:text-[#F4F1EC]'
                }`}
              >
                {sc.title}
              </button>
            );
          })}
        </div>

        {/* Shared Glass Evaluation Panel */}
        <div className="glass-surface-elevated rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden mb-24">
          {/* Top accent glow line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#9D1738] to-transparent opacity-80" />

          {/* Title & Origin Lockup */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-black/8 dark:border-white/10 pb-6 mb-8">
            <div>
              <div className="text-[11px] font-mono text-[#9D1738] dark:text-[#E899AA] uppercase tracking-wider mb-1">
                {scenario.subtitle}
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#15161A] dark:text-[#F4F1EC]">
                {scenario.materialIdentity}
              </h3>
              <p className="text-xs text-[#8E919B] mt-1">
                Origin: {scenario.originIndustry} · Candidate Target: {scenario.candidateApplication}
              </p>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl glass-surface text-xs font-mono font-medium text-[#9D1738] dark:text-[#E899AA] border-black/10 dark:border-white/10 shrink-0 self-start">
              {scenario.evaluationStatus}
            </div>
          </div>

          {/* 4-Box Detail Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Box 1: Known Properties */}
            <div className="p-4 rounded-2xl glass-surface space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E919B] block font-semibold">
                Documented Properties
              </span>
              <div className="space-y-2">
                {scenario.knownProperties.map((prop, i) => (
                  <div key={i} className="text-xs">
                    <div className="flex justify-between items-center text-[#15161A] dark:text-[#F4F1EC] font-medium">
                      <span>{prop.name}</span>
                      <span className="font-mono text-[11px] text-[#9D1738] dark:text-[#E899AA]">{prop.value}</span>
                    </div>
                    {prop.standard && (
                      <span className="text-[10px] text-[#8E919B]">{prop.standard}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Box 2: Missing Properties */}
            <div className="p-4 rounded-2xl glass-surface space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 block font-semibold">
                Critical Missing Assays
              </span>
              <div className="space-y-2.5">
                {scenario.missingProperties.map((prop, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-semibold text-[#15161A] dark:text-[#F4F1EC] block">
                      {prop.name}
                    </span>
                    <span className="text-[11px] text-[#61646E] dark:text-[#A6A8B0] leading-snug block">
                      {prop.reasonNeeded}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Box 3: Application Requirements */}
            <div className="p-4 rounded-2xl glass-surface space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E919B] block font-semibold">
                Recipient Engineering Tolerances
              </span>
              <div className="space-y-2.5">
                {scenario.applicationRequirements.map((req, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-medium text-[#15161A] dark:text-[#F4F1EC] block">
                      {req.requirement}
                    </span>
                    <span className="font-mono text-[11px] text-[#C9AA79] block">
                      {req.tolerance}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Box 4: Required Validation Tests */}
            <div className="p-4 rounded-2xl glass-surface space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E919B] block font-semibold">
                Mandatory Laboratory Protocols
              </span>
              <ul className="space-y-1.5 text-xs text-[#61646E] dark:text-[#A6A8B0]">
                {scenario.requiredTesting.map((test, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#9D1738] dark:text-[#E899AA] shrink-0 mt-0.5" />
                    <span>{test}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Transport and Processing Consideration Callout */}
          <div className="p-4 rounded-2xl glass-surface border-black/10 dark:border-white/10 text-xs">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#9D1738] dark:text-[#E899AA] block font-semibold mb-1">
              Logistics & Processing Reality Check
            </span>
            <p className="text-[#61646E] dark:text-[#A6A8B0] leading-relaxed">
              {scenario.transportProcessingNotes}
            </p>
          </div>
        </div>

        {/* What-If Scenario Interaction Component */}
        <div className="mb-24">
          <WhatIfSimulator />
        </div>

        {/* Final Closing Conversion Block */}
        <div className="glass-surface-elevated rounded-3xl p-8 sm:p-14 lg:p-16 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden mb-24">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#9D1738] to-transparent opacity-90" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#9D1738]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface text-xs font-semibold tracking-widest text-[#9D1738] dark:text-[#E899AA] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9D1738] dark:bg-[#E899AA]" aria-hidden="true" />
              <span>Evidence-First Industrial Intelligence</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[#15161A] dark:text-[#F4F1EC] leading-tight">
              “Make the next resource exchange an informed decision.”
            </h2>

            <p className="text-sm sm:text-base text-[#61646E] dark:text-[#A6A8B0] leading-relaxed">
              Bring material evidence, technical requirements, economic assumptions, and environmental considerations together.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => onOpenAccess('start')}
                className="flex items-center gap-2 px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold bg-[#9D1738] hover:bg-[#B81D43] text-[#F4F1EC] shadow-[0_0_20px_rgba(157,23,56,0.4)] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenAccess('login')}
                className="px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold glass-surface text-[#15161A] dark:text-[#F4F1EC] hover:bg-black/5 dark:hover:bg-white/10 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738]"
              >
                Log In
              </button>
            </div>
          </div>
        </div>

        {/* Restrained Liquid-Glass Footer */}
        <footer className="border-t border-black/8 dark:border-white/10 pt-12 pb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#8E919B]">
            {/* Brand Wordmark */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
              <span className="font-serif font-bold text-base text-[#15161A] dark:text-[#F4F1EC] tracking-wider">
                IndusLink
              </span>
              <span className="hidden sm:inline" aria-hidden="true">·</span>
              <span>Industrial Resource Intelligence</span>
            </div>

            {/* Working Section Navigation */}
            <nav aria-label="Footer Navigation" className="flex items-center gap-6 font-medium">
              <button
                onClick={() => onNavigate('home')}
                className="hover:text-[#9D1738] dark:hover:text-[#F4F1EC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738]"
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('evaluation')}
                className="hover:text-[#9D1738] dark:hover:text-[#F4F1EC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738]"
              >
                Evaluation
              </button>
              <button
                onClick={() => onNavigate('opportunities')}
                className="hover:text-[#9D1738] dark:hover:text-[#F4F1EC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738]"
              >
                Opportunities
              </button>
              <button
                onClick={() => onNavigate('explore')}
                className="hover:text-[#9D1738] dark:hover:text-[#F4F1EC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D1738]"
              >
                Explore
              </button>
            </nav>

            {/* Copyright & Disclaimer */}
            <div className="text-center md:text-right text-[11px]">
              <div>© 2026 IndusLink. Built for industrial resource intelligence.</div>
              <div className="text-[10px] opacity-75">All potential material pathways require verified laboratory assays.</div>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};
