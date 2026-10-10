import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Flame, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  ArrowRight, 
  Award, 
  Lock, 
  Smile, 
  Frown, 
  Meh, 
  HeartHandshake, 
  BellRing,
  RotateCcw
} from 'lucide-react';
import { 
  SentimentRating, 
  GamificationProfile, 
  Badge 
} from '../types';
import { storage, ALL_DEPARTMENTS, BADGE_DEFINITIONS } from '../services/storage';
import { notificationService } from '../services/notificationService';

interface EmployeeSurveyViewProps {
  profile: GamificationProfile;
  onRefresh: () => void;
  onOpenNotifications: () => void;
  onViewAnalytics: () => void;
}

const AVAILABLE_TAGS = [
  'Work-Life Balance',
  'Team Collaboration',
  'Leadership Clarity',
  'Meeting Fatigue',
  'Career Growth',
  'Recognition',
  'Refactoring / Tech Debt',
  'Customer Impact',
  'Flexible Remote'
];

export const EmployeeSurveyView: React.FC<EmployeeSurveyViewProps> = ({
  profile,
  onRefresh,
  onOpenNotifications,
  onViewAnalytics,
}) => {
  const activeSurvey = storage.getActiveSurvey();
  const currentWeek = activeSurvey ? activeSurvey.weekNumber : 41;
  const isAlreadyCompletedThisWeek = profile.lastCheckInWeek === currentWeek;

  // Form State
  const [department, setDepartment] = useState<string>('Engineering');
  const [sentimentScore, setSentimentScore] = useState<SentimentRating>(4);
  const [enpsScore, setEnpsScore] = useState<number>(8);
  const [stressLevel, setStressLevel] = useState<number>(2);
  const [safetyScore, setSafetyScore] = useState<number>(4);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Team Collaboration']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<Badge[]>([]);
  const [spinResult, setSpinResult] = useState<number | null>(null);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length < 4) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const result = storage.submitResponse({
        surveyId: activeSurvey ? activeSurvey.id : 'survey_2026_w41',
        department,
        sentimentScore,
        enpsScore,
        stressLevel,
        safetyScore,
        comment: comment.trim() || undefined,
        tags: selectedTags,
      });

      notificationService.playChime();
      triggerConfetti();
      setNewlyUnlockedBadges(result.newlyUnlockedBadges);
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      onRefresh();
    }, 450);
  };

  const handleSpinWheel = () => {
    const { bonusXp } = storage.useSpinReward();
    setSpinResult(bonusXp);
    triggerConfetti();
    notificationService.playChime();
    onRefresh();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Gamification Status Bar & Progress */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-xs">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  {profile.currentStreak}-Week Active Streak
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 tabular-nums">
                  Level {profile.level}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {profile.totalCheckIns} anonymous check-ins completed · Next streak milestone in 2 weeks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Total XP</span>
              <span className="text-lg font-bold text-slate-900 tabular-nums">{profile.xp} XP</span>
            </div>
            {profile.spinRewardsRemaining > 0 && !spinResult && (
              <button
                onClick={handleSpinWheel}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1.5 animate-pulse"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Spin Bonus ({profile.spinRewardsRemaining})</span>
              </button>
            )}
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-slate-900 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(100, (profile.xp % 300) / 3)}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5">
          <span>Level {profile.level}</span>
          <span className="tabular-nums">{(profile.xp % 300)} / 300 XP to Level {profile.level + 1}</span>
        </div>
      </div>

      {spinResult && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6 flex items-center justify-between text-purple-900">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-semibold">
              Mystery Reward Unlocked! You earned +{spinResult} Bonus XP!
            </span>
          </div>
          <button
            onClick={() => setSpinResult(null)}
            className="text-xs text-purple-700 font-medium hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Survey Form or Completed View */}
      {isAlreadyCompletedThisWeek && !submittedSuccess ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xs">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            You're All Caught Up for Week {currentWeek}!
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
            Your anonymous check-in has been counted. Your insights directly impact weekly engineering and culture decisions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onViewAnalytics}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <span>View Team Analytics Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                // Allow submitting another anonymous feedback if desired
                setSubmittedSuccess(false);
                storage.saveNotificationSchedule({
                  ...storage.getNotificationSchedule(),
                  lastTriggered: undefined
                });
                handleSubmit({ preventDefault: () => {} } as React.FormEvent);
              }}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Submit Another Note</span>
            </button>
          </div>
        </div>
      ) : submittedSuccess ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xs">
          <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Anonymous Feedback Submitted!
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-4">
            Earned <strong className="text-emerald-700">+150 XP</strong>. Your continuous participation keeps your streak at <strong className="text-amber-700">{profile.currentStreak} weeks</strong>.
          </p>

          {newlyUnlockedBadges.length > 0 && (
            <div className="my-6 p-4 bg-amber-50 border border-amber-200 rounded-xl max-w-md mx-auto">
              <span className="text-xs font-bold text-amber-900 block mb-2 uppercase tracking-wide">
                🎉 New Badge Unlocked!
              </span>
              {newlyUnlockedBadges.map(b => (
                <div key={b.id} className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{b.title}</h4>
                    <p className="text-[11px] text-slate-600">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={onViewAnalytics}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <span>Explore Real-Time Trend Charts</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          {/* Survey Header */}
          <div className="border-b border-slate-200 pb-6 mb-6">
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">
                Week {currentWeek} Check-In
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-md">
                <Lock className="w-3 h-3" />
                <span>Zero Identifiers Stored</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              {activeSurvey ? activeSurvey.title : 'Weekly Team Wellbeing & Pulse Check'}
            </h1>
            <p className="text-sm text-slate-600">
              Takes ~60 seconds. Responses are aggregated in real time to help leadership improve squad dynamics, eliminate blockers, and safeguard team wellbeing.
            </p>
          </div>

          <div className="space-y-8">
            {/* Question 1: Sentiment Card Grid */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                1. How was your overall work vibe and energy this week?
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Select the emotion that best captures your past 5 working days.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { score: 1, label: 'Drained', desc: 'High friction or depleted', emoji: '😫' },
                  { score: 2, label: 'Low', desc: 'Struggling with momentum', emoji: '🙁' },
                  { score: 3, label: 'Steady', desc: 'Balanced, getting work done', emoji: '😐' },
                  { score: 4, label: 'Good', desc: 'Positive, productive flow', emoji: '🙂' },
                  { score: 5, label: 'Thriving', desc: 'Inspired, high energy', emoji: '🚀' },
                ].map(item => {
                  const isSelected = sentimentScore === item.score;
                  return (
                    <button
                      key={item.score}
                      type="button"
                      onClick={() => setSentimentScore(item.score as SentimentRating)}
                      className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-2xl mb-1.5">{item.emoji}</span>
                      <span className={`text-xs font-bold block ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {item.label}
                      </span>
                      <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 2: eNPS Rating */}
            <div className="border-t border-slate-200 pt-6">
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                2. Employee Net Promoter Score (eNPS)
              </label>
              <p className="text-xs text-slate-500 mb-3">
                How likely are you to recommend our team/company as a great place to work? (0 = Not likely, 10 = Extremely likely)
              </p>

              <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5 mb-2">
                {Array.from({ length: 11 }, (_, i) => i).map(val => {
                  const isSelected = enpsScore === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setEnpsScore(val)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all tabular-nums ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 px-1">
                <span>0 · Detractor</span>
                <span>7-8 · Passive</span>
                <span>9-10 · Promoter</span>
              </div>
            </div>

            {/* Question 3 & 4: Stress & Safety in 2 Column Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-200 pt-6">
              {/* Stress Level */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">
                  3. Workload & Stress Level
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  1 = Very manageable, 5 = Severe burnout risk
                </p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setStressLevel(lvl)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all tabular-nums ${
                        stressLevel === lvl
                          ? lvl >= 4
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1.5">
                  <span>Relaxed / Calm</span>
                  <span>Overwhelmed</span>
                </div>
              </div>

              {/* Psychological Safety */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">
                  4. Psychological Safety
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  "I feel safe sharing honest opinions & making mistakes."
                </p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSafetyScore(lvl)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all tabular-nums ${
                        safetyScore === lvl
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {lvl}★
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1.5">
                  <span>Hesitant / Reserved</span>
                  <span>Fully Supported</span>
                </div>
              </div>
            </div>

            {/* Department and Tags */}
            <div className="border-t border-slate-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">
                    5. Department Category
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    Used only for broad aggregated reports (min 3 responses required).
                  </p>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    {ALL_DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">
                    6. Key Topics (Select up to 4)
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    Highlight the themes top of mind for you.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_TAGS.map(tag => {
                      const isSel = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                            isSel
                              ? 'bg-slate-900 text-white font-medium'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Open-Ended Anonymous Voice */}
            <div className="border-t border-slate-200 pt-6">
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                7. Anonymous Written Feedback (Optional · +50 Bonus XP)
              </label>
              <p className="text-xs text-slate-500 mb-2">
                What went well, what is blocking you, or what could leadership do to make your week better?
              </p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your raw, honest perspective safely... All submissions are completely anonymized."
                rows={3}
                maxLength={600}
                className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-400"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
                <span>Safe space · Never tied to your login</span>
                <span className="tabular-nums">{comment.length} / 600</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="border-t border-slate-200 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Submission will earn you +150 XP & advance your streak</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <span>Securing & Submitting...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Anonymous Pulse (+150 XP)</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Push Notification Setup Prompt Card */}
      <div className="mt-8 bg-slate-100 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-slate-700 shadow-xs">
            <BellRing className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              Never Miss a Weekly Check-In
            </h4>
            <p className="text-xs text-slate-600">
              Set up a scheduled Friday push notification so your streak never breaks.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenNotifications}
          className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
        >
          Configure Reminders
        </button>
      </div>
    </div>
  );
};
