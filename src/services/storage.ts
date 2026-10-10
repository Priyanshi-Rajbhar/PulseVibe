import { 
  Survey, 
  SurveyResponse, 
  GamificationProfile, 
  Badge, 
  WeeklyTrendPoint, 
  DepartmentSummary,
  ManagerAction,
  NotificationSchedule,
  SentimentRating
} from '../types';

export const ALL_DEPARTMENTS = [
  'Engineering',
  'Product & Design',
  'Sales & BD',
  'Marketing',
  'Customer Success',
  'Operations & People'
];

export const DEPARTMENT_HEADCOUNTS: Record<string, number> = {
  'Engineering': 45,
  'Product & Design': 24,
  'Sales & BD': 32,
  'Marketing': 18,
  'Customer Success': 26,
  'Operations & People': 15,
};

export const BADGE_DEFINITIONS: Badge[] = [
  {
    id: 'badge_first_pulse',
    title: 'First Voice',
    description: 'Submitted your first anonymous weekly check-in',
    icon: 'Sparkles',
    category: 'participation',
    requirement: '1 Survey completed'
  },
  {
    id: 'badge_streak_3',
    title: 'Streak Sentinel',
    description: 'Kept a 3-week consecutive pulse check-in streak',
    icon: 'Flame',
    category: 'streak',
    requirement: '3 Weeks unbroken streak'
  },
  {
    id: 'badge_streak_6',
    title: 'Pulse Champion',
    description: 'Reached a 6-week streak of honest feedback',
    icon: 'Trophy',
    category: 'streak',
    requirement: '6 Weeks unbroken streak'
  },
  {
    id: 'badge_feedback_hero',
    title: 'Truth Teller',
    description: 'Shared detailed constructive written comments',
    icon: 'MessageSquareText',
    category: 'impact',
    requirement: 'Provide constructive feedback'
  },
  {
    id: 'badge_team_builder',
    title: 'Culture Catalyst',
    description: 'Helped your department hit a >90% participation milestone',
    icon: 'Users',
    category: 'impact',
    requirement: 'Department hit >90% participation'
  },
  {
    id: 'badge_enps_advocate',
    title: 'Loyalty Beacon',
    description: 'Contributed to organizational eNPS benchmark review',
    icon: 'ShieldCheck',
    category: 'special',
    requirement: 'Complete quarterly eNPS assessment'
  }
];

const STORAGE_KEYS = {
  SURVEYS: 'pulsevibe_surveys_v2',
  RESPONSES: 'pulsevibe_responses_v2',
  GAMIFICATION: 'pulsevibe_user_gamification_v2',
  NOTIFICATIONS: 'pulsevibe_notifications_v2',
  ACTIONS: 'pulsevibe_manager_actions_v2',
};

// Seed initial data generator
function createSeedData() {
  const currentYear = 2026;
  const currentWeek = 41;

  const currentSurvey: Survey = {
    id: 'survey_2026_w41',
    title: 'Week 41 Pulse: Team Momentum & Workplace Wellbeing',
    description: 'A 60-second anonymous pulse to assess workload balance, recognition, and psychological safety across all squads.',
    category: 'weekly_pulse',
    status: 'active',
    targetDepartment: 'All Departments',
    weekNumber: currentWeek,
    year: currentYear,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    deadline: new Date(Date.now() + 4 * 86400000).toISOString(),
  };

  // Generate historical responses for past 8 weeks (weeks 34 to 41)
  const seedResponses: SurveyResponse[] = [];
  const baseDeptScores: Record<string, { baseSent: number; baseEnps: number; baseStress: number }> = {
    'Engineering': { baseSent: 4.1, baseEnps: 8, baseStress: 2.7 },
    'Product & Design': { baseSent: 4.3, baseEnps: 9, baseStress: 2.3 },
    'Sales & BD': { baseSent: 3.9, baseEnps: 7, baseStress: 3.1 },
    'Marketing': { baseSent: 4.2, baseEnps: 8, baseStress: 2.4 },
    'Customer Success': { baseSent: 4.0, baseEnps: 8, baseStress: 2.8 },
    'Operations & People': { baseSent: 4.5, baseEnps: 9, baseStress: 2.0 },
  };

  const sampleComments = [
    { text: "Great sprint velocity, but the back-to-back Thursday meetings are exhausting.", dept: "Engineering", tags: ["Meeting Fatigue", "Velocity"] },
    { text: "Appreciated the clear roadmap update from leadership at yesterday's town hall.", dept: "Product & Design", tags: ["Transparency", "Leadership"] },
    { text: "Closing key enterprise deals this quarter, team morale is high!", dept: "Sales & BD", tags: ["Morale", "Recognition"] },
    { text: "New creative design system is saving us countless hours each week.", dept: "Product & Design", tags: ["Tooling", "Efficiency"] },
    { text: "CS queue volume spiked after product release; we could use another tier-2 specialist.", dept: "Customer Success", tags: ["Workload", "Staffing"] },
    { text: "The flexible remote policy has made a huge positive impact on my family balance.", dept: "Marketing", tags: ["Work-Life Balance", "Flexibility"] },
    { text: "Feeling listened to by my engineering lead when proposing refactoring initiatives.", dept: "Engineering", tags: ["Psychological Safety", "Leadership"] },
    { text: "Transparent compensation guidelines shared last month boosted team confidence.", dept: "Operations & People", tags: ["Transparency", "Culture"] },
  ];

  for (let w = 34; w <= currentWeek; w++) {
    const isCurrent = w === currentWeek;
    const weekCount = isCurrent ? 128 : 135 + Math.floor(Math.sin(w) * 10);
    const weekDate = new Date(Date.now() - (currentWeek - w) * 7 * 86400000);

    for (let i = 0; i < weekCount; i++) {
      const deptIndex = i % ALL_DEPARTMENTS.length;
      const dept = ALL_DEPARTMENTS[deptIndex];
      const deptBase = baseDeptScores[dept];

      // Natural weekly variation
      const variance = (Math.sin(w * 0.7 + i) * 0.4);
      const rawSent = Math.min(5, Math.max(1, Math.round((deptBase.baseSent + variance) * 10) / 10));
      const sentimentScore = Math.min(5, Math.max(1, Math.round(rawSent))) as SentimentRating;

      const rawEnps = Math.min(10, Math.max(2, Math.round(deptBase.baseEnps + (variance * 2))));
      const stress = Math.min(5, Math.max(1, Math.round(deptBase.baseStress - variance)));
      const safety = Math.min(5, Math.max(1, Math.round(deptBase.baseSent + 0.3)));

      const hasComment = (i % 6 === 0);
      const commentObj = hasComment ? sampleComments[i % sampleComments.length] : undefined;

      seedResponses.push({
        id: `resp_w${w}_${i}`,
        surveyId: currentSurvey.id,
        department: dept,
        sentimentScore,
        enpsScore: rawEnps,
        stressLevel: stress,
        safetyScore: safety,
        comment: commentObj ? commentObj.text : undefined,
        tags: commentObj ? commentObj.tags : ['Teamwork', 'Pacing'],
        submittedAt: new Date(weekDate.getTime() + (i * 3600000)).toISOString(),
        weekNumber: w,
        year: currentYear,
      });
    }
  }

  const initialProfile: GamificationProfile = {
    id: 'user_anonymous_' + Math.random().toString(36).substring(2, 9),
    currentStreak: 4,
    longestStreak: 5,
    totalCheckIns: 4,
    xp: 680,
    level: 3,
    badges: ['badge_first_pulse', 'badge_streak_3', 'badge_feedback_hero'],
    lastCheckInWeek: 40,
    lastCheckInYear: 2026,
    spinRewardsRemaining: 1,
  };

  const initialNotifications: NotificationSchedule = {
    enabled: true,
    dayOfWeek: 5, // Friday
    time: "14:00",
    soundEnabled: true,
  };

  const initialActions: ManagerAction[] = [
    {
      id: 'act_1',
      commentId: 'resp_w41_0',
      responseNote: "We hear you! People Ops has mandated No-Meeting Thursday afternoons across all squads starting next week.",
      managerName: "Elena Rostova (VP People)",
      status: 'resolved',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    }
  ];

  return {
    surveys: [currentSurvey],
    responses: seedResponses,
    profile: initialProfile,
    notifications: initialNotifications,
    actions: initialActions,
  };
}

class StorageService {
  private listeners: (() => void)[] = [];

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (!localStorage.getItem(STORAGE_KEYS.SURVEYS)) {
      const seed = createSeedData();
      localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(seed.surveys));
      localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(seed.responses));
      localStorage.setItem(STORAGE_KEYS.GAMIFICATION, JSON.stringify(seed.profile));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(seed.notifications));
      localStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(seed.actions));
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public getSurveys(): Survey[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SURVEYS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public getActiveSurvey(): Survey | null {
    const surveys = this.getSurveys();
    return surveys.find(s => s.status === 'active') || surveys[0] || null;
  }

  public getResponses(departmentFilter?: string): SurveyResponse[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESPONSES);
      const responses: SurveyResponse[] = data ? JSON.parse(data) : [];
      if (!departmentFilter || departmentFilter === 'All') {
        return responses;
      }
      return responses.filter(r => r.department === departmentFilter);
    } catch {
      return [];
    }
  }

  public getGamificationProfile(): GamificationProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GAMIFICATION);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    const seed = createSeedData();
    return seed.profile;
  }

  public getNotificationSchedule(): NotificationSchedule {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return {
      enabled: true,
      dayOfWeek: 5,
      time: "14:00",
      soundEnabled: true,
    };
  }

  public saveNotificationSchedule(schedule: NotificationSchedule) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(schedule));
    this.notify();
  }

  public getManagerActions(): ManagerAction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public addManagerAction(action: Omit<ManagerAction, 'id' | 'createdAt'>) {
    const actions = this.getManagerActions();
    const newAction: ManagerAction = {
      ...action,
      id: 'act_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    actions.unshift(newAction);
    localStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(actions));
    this.notify();
    return newAction;
  }

  public submitResponse(
    response: Omit<SurveyResponse, 'id' | 'submittedAt' | 'weekNumber' | 'year'>
  ): { response: SurveyResponse; newProfile: GamificationProfile; newlyUnlockedBadges: Badge[] } {
    const activeSurvey = this.getActiveSurvey();
    const currentWeek = activeSurvey ? activeSurvey.weekNumber : 41;
    const currentYear = activeSurvey ? activeSurvey.year : 2026;

    const newResponse: SurveyResponse = {
      ...response,
      id: 'resp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      submittedAt: new Date().toISOString(),
      weekNumber: currentWeek,
      year: currentYear,
    };

    const responses = this.getResponses();
    responses.push(newResponse);
    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(responses));

    // Update Gamification
    const profile = this.getGamificationProfile();
    const isConsecutive = profile.lastCheckInWeek === currentWeek - 1;
    const isSameWeek = profile.lastCheckInWeek === currentWeek;

    let newStreak = profile.currentStreak;
    if (!isSameWeek) {
      newStreak = isConsecutive ? profile.currentStreak + 1 : 1;
    }
    const longestStreak = Math.max(newStreak, profile.longestStreak);
    const xpEarned = 150 + (response.comment ? 50 : 0);
    const totalXp = profile.xp + xpEarned;
    const newLevel = Math.floor(totalXp / 300) + 1;

    // Check newly unlocked badges
    const newlyUnlockedBadges: Badge[] = [];
    const unlockedIds = new Set(profile.badges);

    if (!unlockedIds.has('badge_first_pulse')) {
      unlockedIds.add('badge_first_pulse');
      newlyUnlockedBadges.push(BADGE_DEFINITIONS.find(b => b.id === 'badge_first_pulse')!);
    }
    if (newStreak >= 3 && !unlockedIds.has('badge_streak_3')) {
      unlockedIds.add('badge_streak_3');
      newlyUnlockedBadges.push(BADGE_DEFINITIONS.find(b => b.id === 'badge_streak_3')!);
    }
    if (newStreak >= 6 && !unlockedIds.has('badge_streak_6')) {
      unlockedIds.add('badge_streak_6');
      newlyUnlockedBadges.push(BADGE_DEFINITIONS.find(b => b.id === 'badge_streak_6')!);
    }
    if (response.comment && response.comment.length > 20 && !unlockedIds.has('badge_feedback_hero')) {
      unlockedIds.add('badge_feedback_hero');
      newlyUnlockedBadges.push(BADGE_DEFINITIONS.find(b => b.id === 'badge_feedback_hero')!);
    }

    const updatedProfile: GamificationProfile = {
      ...profile,
      currentStreak: newStreak,
      longestStreak,
      totalCheckIns: profile.totalCheckIns + 1,
      xp: totalXp,
      level: newLevel,
      badges: Array.from(unlockedIds),
      lastCheckInWeek: currentWeek,
      lastCheckInYear: currentYear,
      spinRewardsRemaining: profile.spinRewardsRemaining + 1,
    };

    localStorage.setItem(STORAGE_KEYS.GAMIFICATION, JSON.stringify(updatedProfile));
    this.notify();

    return { response: newResponse, newProfile: updatedProfile, newlyUnlockedBadges };
  }

  public useSpinReward(): { bonusXp: number; updatedProfile: GamificationProfile } {
    const profile = this.getGamificationProfile();
    if (profile.spinRewardsRemaining <= 0) {
      return { bonusXp: 0, updatedProfile: profile };
    }
    const bonusXp = [50, 100, 150, 200][Math.floor(Math.random() * 4)];
    const totalXp = profile.xp + bonusXp;
    const newLevel = Math.floor(totalXp / 300) + 1;

    const updatedProfile: GamificationProfile = {
      ...profile,
      xp: totalXp,
      level: newLevel,
      spinRewardsRemaining: profile.spinRewardsRemaining - 1,
    };
    localStorage.setItem(STORAGE_KEYS.GAMIFICATION, JSON.stringify(updatedProfile));
    this.notify();
    return { bonusXp, updatedProfile };
  }

  public simulateLiveResponses(count = 5) {
    const depts = ALL_DEPARTMENTS;
    const activeSurvey = this.getActiveSurvey();
    const currentWeek = activeSurvey ? activeSurvey.weekNumber : 41;
    const comments = [
      "Sprint velocity is outstanding. Everyone is pulling together.",
      "Would love more async status check-ins rather than long daily standups.",
      "Mentorship from senior engineers this month has been incredible.",
      "Clear priorities from product management have drastically reduced rework.",
      "Excited about the upcoming feature launch; team morale is strong."
    ];

    for (let i = 0; i < count; i++) {
      const dept = depts[Math.floor(Math.random() * depts.length)];
      const sent = (Math.floor(Math.random() * 2) + 4) as SentimentRating; // 4 or 5
      const enps = Math.floor(Math.random() * 3) + 8; // 8-10
      const stress = Math.floor(Math.random() * 3) + 1; // 1-3
      const safety = Math.floor(Math.random() * 2) + 4; // 4-5
      const comment = comments[i % comments.length];

      this.submitResponse({
        surveyId: activeSurvey ? activeSurvey.id : 'survey_2026_w41',
        department: dept,
        sentimentScore: sent,
        enpsScore: enps,
        stressLevel: stress,
        safetyScore: safety,
        comment,
        tags: ['Real-time', 'Morale', 'Culture']
      });
    }
  }

  public resetToDefault() {
    localStorage.clear();
    this.ensureInitialized();
    this.notify();
  }

  // Analytics helper calculations
  public getWeeklyTrends(departmentFilter?: string): WeeklyTrendPoint[] {
    const allResponses = this.getResponses(departmentFilter);
    const weeks = [34, 35, 36, 37, 38, 39, 40, 41];
    const totalHeadcount = Object.values(DEPARTMENT_HEADCOUNTS).reduce((a, b) => a + b, 0);

    return weeks.map(w => {
      const weekResps = allResponses.filter(r => r.weekNumber === w);
      const count = weekResps.length || 1;

      const sentSum = weekResps.reduce((acc, r) => acc + r.sentimentScore, 0);
      const sentimentAvg = Math.round((sentSum / count) * 10) / 10;

      // eNPS
      const promoters = weekResps.filter(r => r.enpsScore >= 9).length;
      const detractors = weekResps.filter(r => r.enpsScore <= 6).length;
      const enps = Math.round(((promoters - detractors) / count) * 100);

      const stressSum = weekResps.reduce((acc, r) => acc + r.stressLevel, 0);
      const stressAvg = Math.round((stressSum / count) * 10) / 10;

      const safetySum = weekResps.reduce((acc, r) => acc + r.safetyScore, 0);
      const safetyAvg = Math.round((safetySum / count) * 10) / 10;

      // Breakdown by department for this week
      const getDeptAvg = (deptName: string) => {
        const dResps = weekResps.filter(r => r.department === deptName);
        if (dResps.length === 0) return sentimentAvg;
        return Math.round((dResps.reduce((a, b) => a + b.sentimentScore, 0) / dResps.length) * 10) / 10;
      };

      const participationRate = Math.min(100, Math.round((weekResps.length / (totalHeadcount * 0.9)) * 100));

      return {
        weekLabel: `W${w}`,
        weekNumber: w,
        year: 2026,
        sentimentAvg: sentimentAvg || 4.1,
        enps: enps || 42,
        participationRate: participationRate || 84,
        responseCount: weekResps.length,
        stressAvg: stressAvg || 2.4,
        safetyAvg: safetyAvg || 4.3,
        engineeringAvg: getDeptAvg('Engineering'),
        designAvg: getDeptAvg('Product & Design'),
        productAvg: getDeptAvg('Product & Design'),
        salesAvg: getDeptAvg('Sales & BD'),
        operationsAvg: getDeptAvg('Operations & People'),
      };
    });
  }

  public getDepartmentSummaries(): DepartmentSummary[] {
    const allResponses = this.getResponses();
    const currentWeekResponses = allResponses.filter(r => r.weekNumber === 41);
    const prevWeekResponses = allResponses.filter(r => r.weekNumber === 40);

    return ALL_DEPARTMENTS.map(dept => {
      const curDept = currentWeekResponses.filter(r => r.department === dept);
      const prevDept = prevWeekResponses.filter(r => r.department === dept);
      const headcount = DEPARTMENT_HEADCOUNTS[dept] || 30;

      const curCount = curDept.length || 1;
      const prevCount = prevDept.length || 1;

      const curSent = curDept.reduce((a, b) => a + b.sentimentScore, 0) / curCount;
      const prevSent = prevDept.reduce((a, b) => a + b.sentimentScore, 0) / prevCount;
      const trendDelta = Math.round((curSent - prevSent) * 10) / 10;

      const promoters = curDept.filter(r => r.enpsScore >= 9).length;
      const detractors = curDept.filter(r => r.enpsScore <= 6).length;
      const enps = Math.round(((promoters - detractors) / curCount) * 100);

      const stress = curDept.reduce((a, b) => a + b.stressLevel, 0) / curCount;
      const safety = curDept.reduce((a, b) => a + b.safetyScore, 0) / curCount;
      const participationRate = Math.min(100, Math.round((curDept.length / headcount) * 100));

      return {
        name: dept,
        sentimentAvg: Math.round(curSent * 10) / 10,
        enps,
        participationRate,
        stressAvg: Math.round(stress * 10) / 10,
        safetyAvg: Math.round(safety * 10) / 10,
        totalResponses: curDept.length,
        headcount,
        trendDelta,
      };
    });
  }
}

export const storage = new StorageService();
