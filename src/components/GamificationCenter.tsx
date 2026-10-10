import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Flame, 
  Trophy, 
  Sparkles, 
  Award, 
  Lock, 
  CheckCircle2, 
  RotateCw, 
  ShieldCheck, 
  Users, 
  Star,
  ChevronRight
} from 'lucide-react';
import { GamificationProfile } from '../types';
import { storage, BADGE_DEFINITIONS } from '../services/storage';
import { notificationService } from '../services/notificationService';

interface GamificationCenterProps {
  profile: GamificationProfile;
  onRefresh: () => void;
  onTakeSurvey: () => void;
}

export const GamificationCenter: React.FC<GamificationCenterProps> = ({
  profile,
  onRefresh,
  onTakeSurvey,
}) => {
  const [spinning, setSpinning] = useState(false);
  const [spinReward, setSpinReward] = useState<number | null>(null);

  const deptSummaries = storage.getDepartmentSummaries();
  // Sort departments by participation rate
  const sortedDepts = [...deptSummaries].sort((a, b) => b.participationRate - a.participationRate);

  const handleSpin = () => {
    if (profile.spinRewardsRemaining <= 0 || spinning) return;
    setSpinning(true);

    setTimeout(() => {
      const { bonusXp } = storage.useSpinReward();
      setSpinReward(bonusXp);
      setSpinning(false);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch {}
      notificationService.playChime();
      onRefresh();
    }, 700);
  };

  const levels = [
    { level: 1, title: 'Pulse Observer', xpReq: 0 },
    { level: 2, title: 'Squad Voice', xpReq: 300 },
    { level: 3, title: 'Culture Advocate', xpReq: 600 },
    { level: 4, title: 'Streak Sentinel', xpReq: 900 },
    { level: 5, title: 'Culture Legend', xpReq: 1200 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Streak & Level Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                Anonymous Gamification HUD
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-slate-300 text-xs font-mono tabular-nums">Level {profile.level} Tier</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {profile.currentStreak}-Week Active Pulse Streak 🔥
            </h1>

            <p className="text-sm text-slate-300 max-w-xl">
              Consistent anonymous check-ins elevate your squad's culture metrics, unlock bonus company rewards, and keep squad leads accountable.
            </p>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={onTakeSurvey}
                className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold transition-all shadow-xs"
              >
                Complete This Week's Check-In
              </button>
              <div className="text-xs text-slate-300">
                Next bonus unlock at <strong className="text-white">6-week streak</strong>
              </div>
            </div>
          </div>

          {/* XP & Spin Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-5 min-w-[240px] text-center space-y-3 shrink-0">
            <div>
              <span className="text-xs text-slate-300 block">Total Accumulated XP</span>
              <span className="text-3xl font-extrabold text-amber-400 tabular-nums">
                {profile.xp} XP
              </span>
            </div>

            <div className="border-t border-white/10 pt-3">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                <span>Mystery Bonus Spin</span>
                <span className="font-bold text-white tabular-nums">{profile.spinRewardsRemaining} Available</span>
              </div>

              <button
                onClick={handleSpin}
                disabled={profile.spinRewardsRemaining <= 0 || spinning}
                className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <RotateCw className={`w-3.5 h-3.5 ${spinning ? 'animate-spin' : ''}`} />
                <span>{spinning ? 'Spinning...' : 'Spin for Mystery XP'}</span>
              </button>
            </div>
          </div>
        </div>

        {spinReward && (
          <div className="mt-4 p-3 bg-amber-500/20 border border-amber-400/40 rounded-lg text-xs text-amber-200 flex items-center justify-between">
            <span>🎉 Lucky Spin! You were awarded +{spinReward} Bonus XP!</span>
            <button onClick={() => setSpinReward(null)} className="underline hover:text-white">Dismiss</button>
          </div>
        )}
      </div>

      {/* Main Grid: Badges Showcase & Department Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Badges Showcase (2 Columns on Desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Participation Badges & Milestones
              </h2>
              <p className="text-xs text-slate-500">
                Unlocked through verified weekly check-ins and thoughtful feedback
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-600 tabular-nums">
              {profile.badges.length} of {BADGE_DEFINITIONS.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BADGE_DEFINITIONS.map(badge => {
              const isUnlocked = profile.badges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isUnlocked
                      ? 'bg-white border-slate-200 shadow-2xs'
                      : 'bg-slate-50/60 border-slate-200/60 opacity-65'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        isUnlocked
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {isUnlocked ? (
                        <Trophy className="w-5 h-5 text-amber-600" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-500" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xs font-bold text-slate-900 truncate">
                          {badge.title}
                        </h3>
                        {isUnlocked && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                            Earned
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                        {badge.description}
                      </p>
                      <span className="text-[11px] text-slate-400 block mt-1.5">
                        Req: {badge.requirement}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Level Progression Ladder */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Level Progression Path
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {levels.map(l => {
                const isPassed = profile.level >= l.level;
                const isCurrent = profile.level === l.level;
                return (
                  <div
                    key={l.level}
                    className={`p-3 rounded-lg border text-center ${
                      isCurrent
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : isPassed
                        ? 'bg-slate-50 border-slate-200 text-slate-800'
                        : 'bg-slate-50/40 border-slate-100 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-bold block uppercase tracking-wide">
                      Tier {l.level}
                    </span>
                    <span className="text-xs font-bold block mt-0.5 truncate">
                      {l.title}
                    </span>
                    <span className="text-[10px] opacity-75 mt-1 block tabular-nums">
                      {l.xpReq} XP
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Squad Participation Leaderboard */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-slate-700" />
              <h3 className="text-base font-bold text-slate-900">
                Squad Participation
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Ranked by weekly response consistency
            </p>

            <div className="space-y-3">
              {sortedDepts.map((d, index) => (
                <div key={d.name} className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="font-bold text-slate-900">{d.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {d.participationRate}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        d.participationRate >= 90
                          ? 'bg-emerald-600'
                          : d.participationRate >= 80
                          ? 'bg-sky-600'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${d.participationRate}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                    <span>{d.totalResponses} of {d.headcount} answered</span>
                    <span className="tabular-nums">Avg: {d.sentimentAvg}/5.0</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
