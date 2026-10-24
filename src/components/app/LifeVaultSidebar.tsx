/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Compass,
  Cpu,
  DollarSign,
  Shield,
  FileText,
  Factory,
  Layers,
  Send,
  Building,
  Users,
  Settings,
  X,
  LogOut,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import type { AppNavTab, UserProfile } from '../../types/index.ts';

interface LifeVaultSidebarProps {
  activeTab: AppNavTab;
  onSelectTab: (tab: AppNavTab) => void;
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSwitchUser: (userId: string) => void;
  onExitToLanding: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: AppNavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavGroup {
  name: string;
  items: NavItem[];
}

export const LifeVaultSidebar: React.FC<LifeVaultSidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  allUsers,
  onSwitchUser,
  onExitToLanding,
  isMobileOpen,
  onCloseMobile,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  // Clean Navigation Structure adapted to prompt Section 4 specification
  const navGroups: NavGroup[] = [
    {
      name: 'Workspace',
      items: [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'matching', label: 'Material Intelligence', icon: Cpu },
        { id: 'discover', label: 'Material Discovery', icon: Compass },
        { id: 'evidence_center', label: 'Evidence Center', icon: Shield },
        { id: 'cost_engine', label: 'Cost & Carbon', icon: DollarSign },
        { id: 'reports', label: 'Reports', icon: FileText },
      ],
    },
    {
      name: 'Business',
      items: [
        { id: 'buyer_overview', label: 'Buyer Workspace', icon: Layers },
        { id: 'seller_overview', label: 'Seller Workspace', icon: Factory },
        { id: 'enquiries', label: 'Enquiries & Offers', icon: Send, badge: '2' },
      ],
    },
    {
      name: 'Administration',
      items: [
        { id: 'facilities', label: 'Facilities', icon: Building },
        { id: 'team', label: 'Team & Access', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  const isExpanded = isHovered;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* LifeVault-Inspired Floating Rounded Animated Sidebar */}
      <aside
        ref={sidebarRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setUserDropdownOpen(false);
        }}
        className={`fixed md:sticky top-0 md:top-3 left-0 md:left-3 h-screen md:h-[calc(100vh-1.5rem)] z-50 flex flex-col justify-between bg-white/85 dark:bg-[#0e1014]/90 backdrop-blur-2xl rounded-none md:rounded-[24px] border-r md:border border-slate-200/80 dark:border-white/10 transition-all duration-300 ease-in-out shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden ${
          // Desktop: 72px collapsed, 220px expanded
          isExpanded ? 'md:w-[220px]' : 'md:w-[72px]'
        } ${
          // Mobile: Drawer slide-in
          isMobileOpen ? 'translate-x-0 w-[240px]' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top: Brand Header */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="h-16 px-4 border-b border-black/8 dark:border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-[#F8FAFC] flex items-center justify-center font-bold text-xs shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.35)]">
                IL
              </div>

              {/* Title & subtitle: Animated fade & slide */}
              <div
                className={`transition-all duration-200 whitespace-nowrap overflow-hidden ${
                  isExpanded || isMobileOpen ? 'opacity-100 translate-x-0 max-w-[150px]' : 'opacity-0 -translate-x-2 max-w-0 md:hidden'
                }`}
              >
                <span className="font-serif font-bold text-sm text-slate-900 dark:text-[#F8FAFC] block leading-none">
                  IndusLink
                </span>
                <span className="font-mono text-[9px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mt-1 font-semibold">
                  Intelligence
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-zinc-400"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items Scroll Container */}
          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 scrollbar-none text-xs">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {/* Group label: Visible on expanded, subtle dot on collapsed */}
                <div className="h-4 px-2.5 flex items-center overflow-hidden">
                  <span
                    className={`font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-semibold transition-opacity duration-200 whitespace-nowrap ${
                      isExpanded || isMobileOpen ? 'opacity-100' : 'opacity-0 md:hidden'
                    }`}
                  >
                    {group.name}
                  </span>
                </div>

                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        if (isMobileOpen) onCloseMobile();
                      }}
                      title={!isExpanded ? item.label : undefined}
                      className={`w-full group relative flex items-center h-10 px-3 rounded-xl transition-all duration-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold shadow-[inset_0_0_12px_rgba(16,185,129,0.15)] border border-emerald-500/30'
                          : 'text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-[#F8FAFC] hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      )}

                      {/* Icon with consistent alignment */}
                      <div className="w-5 h-5 flex items-center justify-center shrink-0">
                        <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-zinc-200'}`} />
                      </div>

                      {/* Animated Label */}
                      <span
                        className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-200 text-xs font-medium ${
                          isExpanded || isMobileOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none md:hidden'
                        }`}
                      >
                        {item.label}
                      </span>

                      {/* Optional Badge */}
                      {item.badge && (isExpanded || isMobileOpen) && (
                        <span className="ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Persistent Account & Persona Area */}
        <div className="p-2 border-t border-black/8 dark:border-white/10 shrink-0 relative bg-slate-100/60 dark:bg-black/25">
          {userDropdownOpen && (
            <div className="absolute bottom-full left-2 right-2 mb-2 p-2 rounded-2xl bg-white/95 dark:bg-[#14171d]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 shadow-2xl z-50 space-y-1.5 dropdown-pop-animation">
              <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider block px-2 py-1 font-semibold">
                Switch Demo Persona
              </span>
              {allUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    onSwitchUser(user.id);
                    setUserDropdownOpen(false);
                  }}
                  className={`w-full p-2 rounded-xl text-left flex items-center gap-2 text-xs transition-colors ${
                    user.id === currentUser.id
                      ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-500/30'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-zinc-800 text-[10px] font-bold flex items-center justify-center text-slate-800 dark:text-white shrink-0">
                    {user.avatarInitials}
                  </div>
                  <div className="overflow-hidden">
                    <div className="truncate font-semibold">{user.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">{user.organizationType}</div>
                  </div>
                </button>
              ))}
              <div className="pt-1 border-t border-black/8 dark:border-white/10">
                <button
                  onClick={onExitToLanding}
                  className="w-full p-2 rounded-xl text-left flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Exit to Public Landing</span>
                </button>
              </div>
            </div>
          )}

          {/* User Profile Mini Bar */}
          <button
            onClick={() => setUserDropdownOpen((prev) => !prev)}
            className="w-full flex items-center p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all text-left group overflow-hidden"
            title={`${currentUser.name} (${currentUser.title})`}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser.avatarInitials}
            </div>

            <div
              className={`ml-2.5 overflow-hidden transition-all duration-200 ${
                isExpanded || isMobileOpen ? 'opacity-100 max-w-[130px]' : 'opacity-0 max-w-0 md:hidden'
              }`}
            >
              <span className="font-semibold text-xs text-slate-900 dark:text-[#F8FAFC] block truncate leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 block truncate leading-tight">
                {currentUser.organization}
              </span>
            </div>

            {(isExpanded || isMobileOpen) && (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 ml-auto group-hover:text-slate-800 dark:group-hover:text-zinc-200 shrink-0" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
