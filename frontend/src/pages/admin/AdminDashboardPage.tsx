import { useAdminDashboard } from '../../hooks';
import {
  AdminActionsTimeline,
  AdminModulesGrid,
  AttendanceAnalyticsPanel,
  AttendanceTrendChart,
  DashboardHeader,
  FestivalProgressOverview,
  QuickActionsPanel,
  QrStatsPanel,
  RecentAnnouncementsPanel,
  RewardsStatsPanel,
  StatCardsRow,
  TeamScoreChart,
  TopIndividualsLeaderboard,
  TopTeamsPodium,
} from './dashboard';

const emptyDashboard = {
  stats: { totalUsers: 0, totalTeams: 0, totalPoints: 0, activities: 0 },
  recentActivity: [],
  topTeams: [],
  topIndividuals: [],
  teamScoreComparison: [],
  attendanceAnalytics: {
    totalRecords: 0,
    presentCount: 0,
    absentCount: 0,
    excusedCount: 0,
    lateCount: 0,
    attendanceRate: 0,
    trend: [],
  },
  qrStats: {
    totalSessions: 0,
    activeSessions: 0,
    closedSessions: 0,
    totalCheckIns: 0,
    averageCheckIns: 0,
  },
  rewardStats: {
    totalRewards: 0,
    activeRewards: 0,
    publishedRewards: 0,
    totalStock: 0,
    lowStockCount: 0,
    averagePointsRequired: 0,
  },
  recentAnnouncements: [],
  festivalProgress: {
    percentComplete: 0,
    daysElapsed: 0,
    daysRemaining: 0,
    totalDays: 1,
    completedActivities: 0,
    upcomingActivities: 0,
    phase: 'Preparation',
  },
};

function AdminDashboardPage() {
  const { data, loading, error } = useAdminDashboard();
  const dashboard = data ?? emptyDashboard;

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 rounded-3xl bg-gray-200" />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-gray-200" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-gray-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Unable to load dashboard</h2>
        <p className="text-sm text-gray-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader festivalProgress={dashboard.festivalProgress} />

      <StatCardsRow data={dashboard} />

      <FestivalProgressOverview progress={dashboard.festivalProgress} />

      <div className="grid xl:grid-cols-2 gap-6">
        <TopTeamsPodium teams={dashboard.topTeams} />
        <TopIndividualsLeaderboard individuals={dashboard.topIndividuals} />
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <TeamScoreChart data={dashboard.teamScoreComparison} />
        <AttendanceTrendChart data={dashboard.attendanceAnalytics.trend} />
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AttendanceAnalyticsPanel analytics={dashboard.attendanceAnalytics} />
        <QrStatsPanel stats={dashboard.qrStats} />
        <RewardsStatsPanel stats={dashboard.rewardStats} />
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <RecentAnnouncementsPanel announcements={dashboard.recentAnnouncements} />
        <AdminActionsTimeline actions={dashboard.recentActivity} />
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <QuickActionsPanel />
        <AdminModulesGrid />
      </div>
    </div>
  );
}

export default AdminDashboardPage;
