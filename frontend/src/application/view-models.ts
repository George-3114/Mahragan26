/** UI-facing view models matching existing page contracts. */
export type { Team, Activity, Announcement, TopPerformer, AppStats } from '../types';

export interface HomePageData {
  stats: import('../types').AppStats;
  topTeams: import('../types').Team[];
  topPerformers: import('../types').TopPerformer[];
  announcements: import('../types').Announcement[];
  activities: import('../types').Activity[];
}

export interface LeaderboardData {
  topPerformers: import('../types').TopPerformer[];
  teams: import('../types').Team[];
}

export interface AdminTeamRanking {
  id: string;
  name: string;
  color: string;
  totalPoints: number;
  rank: number;
  memberCount: number;
}

export interface AdminIndividualRanking {
  id: string;
  name: string;
  grade: string;
  teamId: string;
  teamName: string;
  teamColor: string;
  totalPoints: number;
  rank: number;
}

export interface AdminChartPoint {
  name: string;
  points: number;
  color: string;
}

export interface AttendanceTrendPoint {
  label: string;
  present: number;
  absent: number;
  total: number;
}

export interface AttendanceAnalytics {
  totalRecords: number;
  presentCount: number;
  absentCount: number;
  excusedCount: number;
  lateCount: number;
  attendanceRate: number;
  trend: AttendanceTrendPoint[];
}

export interface QrAttendanceStats {
  totalSessions: number;
  activeSessions: number;
  closedSessions: number;
  totalCheckIns: number;
  averageCheckIns: number;
}

export interface RewardStats {
  totalRewards: number;
  activeRewards: number;
  publishedRewards: number;
  totalStock: number;
  lowStockCount: number;
  averagePointsRequired: number;
}

export interface FestivalProgress {
  percentComplete: number;
  daysElapsed: number;
  daysRemaining: number;
  totalDays: number;
  completedActivities: number;
  upcomingActivities: number;
  phase: string;
}

export interface AdminDashboardData {
  stats: import('../types').AppStats;
  recentActivity: string[];
  topTeams: AdminTeamRanking[];
  topIndividuals: AdminIndividualRanking[];
  teamScoreComparison: AdminChartPoint[];
  attendanceAnalytics: AttendanceAnalytics;
  qrStats: QrAttendanceStats;
  rewardStats: RewardStats;
  recentAnnouncements: import('../types').Announcement[];
  festivalProgress: FestivalProgress;
}
