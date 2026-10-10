import React from 'react';
import { Flame, Bell, Shield, Sparkles } from 'lucide-react';
import { GamificationProfile } from '../types';

interface HeaderProps {
  activeTab: 'survey' | 'analytics' | 'gamification';
  setActiveTab: (tab: 'survey' | 'analytics' | 'gamification') => void;
  profile: GamificationProfile;
  onOpenNotifications: () => void;
  onExportPdf: () => void;
  isManagerMode: boolean;
  setIsManagerMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onOpenNotifications,
  onExportPdf,
  isManagerMode,
  setIsManagerMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('survey')}
              className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-lg p-1"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-base shadow-sm">
                P
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
                PulseVibe
              </span>
            </button>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium pl-2 border-l border-slate-200">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Anonymous</span>
            </span>
          </div>

          {/* Zone 2: Clean single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('survey')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 ${
                activeTab === 'survey'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Weekly Pulse
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 ${
                activeTab === 'analytics'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Real-Time Analytics
            </button>
            <button
              onClick={() => setActiveTab('gamification')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 ${
                activeTab === 'gamification'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Rewards & Streaks
            </button>
          </nav>

          {/* Zone 3: Primary action / utility tools */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Gamification Streak pill */}
            <button
              onClick={() => setActiveTab('gamification')}
              title={`Your current streak: ${profile.currentStreak} weeks!`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg text-xs font-semibold text-amber-800 transition-colors whitespace-nowrap shrink-0"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="tabular-nums">{profile.currentStreak} Wk Streak</span>
              <span className="text-amber-600/70 font-normal">·</span>
              <span className="text-amber-700 font-medium tabular-nums">{profile.xp} XP</span>
            </button>

            {/* Notification reminder triggers */}
            <button
              onClick={onOpenNotifications}
              title="Configure weekly push reminders"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
              aria-label="Notification settings"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Role switch / Export report */}
            {activeTab === 'analytics' ? (
              <button
                onClick={onExportPdf}
                className="px-3.5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm flex items-center gap-1.5"
              >
                <span>Export PDF</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  const nextTab = activeTab === 'survey' ? 'analytics' : 'survey';
                  setActiveTab(nextTab);
                  setIsManagerMode(nextTab === 'analytics');
                }}
                className="hidden sm:inline-flex px-3.5 py-2 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                {activeTab === 'survey' ? 'Manager View' : 'Employee View'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile bottom-friendly subnav */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 bg-white px-2 py-2">
        <button
          onClick={() => setActiveTab('survey')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'survey' ? 'bg-slate-900 text-white' : 'text-slate-600'
          }`}
        >
          Weekly Pulse
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'analytics' ? 'bg-slate-900 text-white' : 'text-slate-600'
          }`}
        >
          Analytics & Trends
        </button>
        <button
          onClick={() => setActiveTab('gamification')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'gamification' ? 'bg-slate-900 text-white' : 'text-slate-600'
          }`}
        >
          Streaks & XP
        </button>
      </div>
    </header>
  );
};
