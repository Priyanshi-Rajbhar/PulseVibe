/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EmployeeSurveyView } from './components/EmployeeSurveyView';
import { ManagerDashboard } from './components/ManagerDashboard';
import { GamificationCenter } from './components/GamificationCenter';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { storage } from './services/storage';
import { notificationService } from './services/notificationService';
import { generateLeadershipPdfReport } from './services/pdfExportService';
import { GamificationProfile } from './types';
import { ShieldCheck, Download, Check, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'survey' | 'analytics' | 'gamification'>('survey');
  const [isManagerMode, setIsManagerMode] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [profile, setProfile] = useState<GamificationProfile>(storage.getGamificationProfile());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    notificationService.startScheduleMonitor();
    const unsubscribe = storage.subscribe(() => {
      setProfile(storage.getGamificationProfile());
    });
    return () => {
      notificationService.stopScheduleMonitor();
      unsubscribe();
    };
  }, []);

  const handleExportPdf = () => {
    const result = generateLeadershipPdfReport();
    if (result.success) {
      setToastMessage(`Leadership Report exported: ${result.filename}`);
      setTimeout(() => {
        setToastMessage(null);
      }, 5000);
    }
  };

  const handleRefresh = () => {
    setProfile(storage.getGamificationProfile());
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-slate-900 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-3 h-3 text-emerald-400" />
          </div>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        onExportPdf={handleExportPdf}
        isManagerMode={isManagerMode}
        setIsManagerMode={setIsManagerMode}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'survey' && (
          <EmployeeSurveyView
            profile={profile}
            onRefresh={handleRefresh}
            onOpenNotifications={() => setIsNotificationModalOpen(true)}
            onViewAnalytics={() => setActiveTab('analytics')}
          />
        )}

        {activeTab === 'analytics' && (
          <ManagerDashboard
            onExportPdf={handleExportPdf}
            onRefresh={handleRefresh}
          />
        )}

        {activeTab === 'gamification' && (
          <GamificationCenter
            profile={profile}
            onRefresh={handleRefresh}
            onTakeSurvey={() => setActiveTab('survey')}
          />
        )}
      </main>

      {/* Notification Settings Modal */}
      <NotificationSettingsModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              PulseVibe Architecture · Zero PII Linked · Differential Privacy & Aggregated Cohorts
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsNotificationModalOpen(true)}
              className="hover:text-slate-800 transition-colors"
            >
              Push Notification Preferences
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleExportPdf}
              className="hover:text-slate-800 transition-colors"
            >
              Executive Report Generator
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
