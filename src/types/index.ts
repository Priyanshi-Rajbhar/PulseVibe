export type SurveyCategory = 'weekly_pulse' | 'culture' | 'burnout' | 'retro' | 'general';
export type SurveyStatus = 'active' | 'closed' | 'scheduled';

export interface Survey {
  id: string;
  title: string;
  description: string;
  category: SurveyCategory;
  status: SurveyStatus;
  targetDepartment: string; // 'All Departments' or specific
  weekNumber: number;
  year: number;
  createdAt: string;
  deadline: string;
}

export type SentimentRating = 1 | 2 | 3 | 4 | 5; // 1: Drained, 2: Low, 3: Neutral, 4: Good, 5: Thriving

export interface SurveyResponse {
  id: string;
  surveyId: string;
  department: string;
  sentimentScore: SentimentRating;
  enpsScore: number; // 0 - 10
  stressLevel: number; // 1 - 5 (1 lowest stress, 5 extreme stress)
  safetyScore: number; // 1 - 5 psychological safety
  comment?: string;
  tags: string[];
  submittedAt: string;
  weekNumber: number;
  year: number;
  // Note: NO USER IDENTIFIER IS STORED to preserve strict mathematical anonymity
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'participation' | 'impact' | 'special';
  unlockedAt?: string;
  requirement: string;
}

export interface GamificationProfile {
  id: string; // Anonymous device token hash
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  xp: number;
  level: number;
  badges: string[]; // Badge IDs
  lastCheckInWeek?: number;
  lastCheckInYear?: number;
  spinRewardsRemaining: number;
}

export interface WeeklyTrendPoint {
  weekLabel: string;
  weekNumber: number;
  year: number;
  sentimentAvg: number;
  enps: number;
  participationRate: number; // percentage 0-100
  responseCount: number;
  stressAvg: number;
  safetyAvg: number;
  engineeringAvg: number;
  designAvg: number;
  productAvg: number;
  salesAvg: number;
  operationsAvg: number;
}

export interface DepartmentSummary {
  name: string;
  sentimentAvg: number;
  enps: number;
  participationRate: number;
  stressAvg: number;
  safetyAvg: number;
  totalResponses: number;
  headcount: number;
  trendDelta: number; // positive or negative MoM
}

export interface NotificationSchedule {
  enabled: boolean;
  dayOfWeek: number; // 1 = Monday, 5 = Friday
  time: string; // "14:00"
  lastTriggered?: string;
  soundEnabled: boolean;
}

export interface ManagerAction {
  id: string;
  commentId: string;
  responseNote: string;
  managerName: string;
  status: 'planned' | 'in_progress' | 'resolved';
  createdAt: string;
}
