import {
  ActivityStatus,
  AttendanceStatus,
  AttendanceSessionType,
  FESTIVAL,
  IndividualScoreCategory,
  PenaltyType,
  QrSessionStatus,
  TeamMemberStatus,
  TeamScoreCategory,
  buildTeamLeaderboard,
  buildTopPerformers,
  filterVisibleAnnouncements,
  isPresent,
} from '../../domain';
import type {
  Activity,
  Announcement,
  AttendanceRecord,
  IndividualScore,
  Material,
  QrAttendanceSession,
  Reward,
  Team,
  TeamMember,
  TeamScore,
} from '../../domain';
import type { ApplicationContext } from '../context';
import { toUiAnnouncement } from '../mappers';
import type {
  AdminDashboardData,
  AttendanceAnalytics,
  AttendanceTrendPoint,
  FestivalProgress,
} from '../view-models';
import type { RecordAttendanceInput } from '../services/attendanceService';
import { AnnouncementService } from '../services/announcementService';
import { AttendanceService } from '../services/attendanceService';
import { BadgeService } from '../services/badgeService';
import { FestivalService } from '../services/festivalService';
import { MaterialService } from '../services/materialService';
import { QrSessionService } from '../services/qrSessionService';
import { QuizService } from '../services/quizService';
import { RewardService } from '../services/rewardService';
import { ScoreService } from '../services/scoreService';

export class AdminService {
  readonly scores: ScoreService;
  readonly attendance: AttendanceService;
  readonly announcements: AnnouncementService;
  readonly materials: MaterialService;
  readonly quizzes: QuizService;
  readonly rewards: RewardService;
  readonly badges: BadgeService;
  readonly qrSessions: QrSessionService;
  private readonly festival: FestivalService;

  constructor(private readonly ctx: ApplicationContext) {
    this.scores = new ScoreService(ctx);
    this.attendance = new AttendanceService(ctx, this.scores);
    this.announcements = new AnnouncementService(ctx);
    this.materials = new MaterialService(ctx);
    this.quizzes = new QuizService(ctx);
    this.rewards = new RewardService(ctx);
    this.badges = new BadgeService(ctx);
    this.qrSessions = new QrSessionService(ctx, this.attendance);
    this.festival = new FestivalService(ctx);
  }

  async getDashboardData(): Promise<AdminDashboardData> {
    const year = FESTIVAL.CURRENT_YEAR;
    const [
      stats,
      recentActivity,
      teams,
      members,
      attendanceRecords,
      announcements,
      rewards,
      qrSessions,
      activities,
    ] = await Promise.all([
      this.festival.getStats(),
      this.festival.getRecentActivity(12),
      this.ctx.repositories.teams.findByFestivalYear(year),
      this.ctx.repositories.teamMembers.findAll({
        festivalYear: year,
        status: TeamMemberStatus.Active,
      }),
      this.ctx.repositories.attendance.findAll({ festivalYear: year }),
      this.ctx.repositories.announcements.findAll(),
      this.ctx.repositories.rewards.findAll(),
      this.qrSessions.getAll(),
      this.ctx.repositories.activities.findAll({ festivalYear: year }),
    ]);

    const teamMap = new Map(teams.map((team) => [team.id, team]));
    const teamLeaderboard = buildTeamLeaderboard(teams);
    const topTeams = teamLeaderboard.slice(0, 3).map((entry) => ({
      id: entry.id,
      name: entry.name,
      color: entry.color,
      totalPoints: entry.totalPoints,
      rank: entry.rank,
      memberCount: entry.memberCount,
    }));

    const topPerformers = buildTopPerformers(members, 10);
    const topIndividuals = topPerformers.map((performer) => {
      const team = teamMap.get(performer.teamId);
      return {
        id: performer.id,
        name: performer.displayName,
        grade: performer.grade,
        teamId: performer.teamId,
        teamName: team?.name ?? 'Unknown',
        teamColor: team?.color ?? '#6366F1',
        totalPoints: performer.totalPoints,
        rank: performer.rank,
      };
    });

    const teamScoreComparison = teamLeaderboard.map((entry) => ({
      name: entry.name.length > 12 ? `${entry.name.slice(0, 12)}…` : entry.name,
      points: entry.totalPoints,
      color: entry.color,
    }));

    const attendanceAnalytics = buildAttendanceAnalytics(attendanceRecords);
    const qrStats = buildQrStats(qrSessions);
    const rewardStats = buildRewardStats(rewards);
    const festivalProgress = buildFestivalProgress(activities);
    const recentAnnouncements = filterVisibleAnnouncements(announcements)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(toUiAnnouncement);

    return {
      stats,
      recentActivity,
      topTeams,
      topIndividuals,
      teamScoreComparison,
      attendanceAnalytics,
      qrStats,
      rewardStats,
      recentAnnouncements,
      festivalProgress,
    };
  }

  async listTeams(): Promise<Team[]> {
    return this.ctx.repositories.teams.findByFestivalYear(FESTIVAL.CURRENT_YEAR);
  }

  async listMembers(): Promise<TeamMember[]> {
    return this.ctx.repositories.teamMembers.findAll({
      festivalYear: FESTIVAL.CURRENT_YEAR,
      status: TeamMemberStatus.Active,
    });
  }

  async listAttendance(): Promise<AttendanceRecord[]> {
    return this.ctx.repositories.attendance.findAll({ festivalYear: FESTIVAL.CURRENT_YEAR });
  }

  async listIndividualScores(): Promise<IndividualScore[]> {
    return this.ctx.repositories.individualScores.findAll({ festivalYear: FESTIVAL.CURRENT_YEAR });
  }

  async listTeamScores(): Promise<TeamScore[]> {
    return this.ctx.repositories.teamScores.findAll({ festivalYear: FESTIVAL.CURRENT_YEAR });
  }

  async listAnnouncements(): Promise<Announcement[]> {
    return this.ctx.repositories.announcements.findAll();
  }

  async listMaterials(): Promise<Material[]> {
    return this.ctx.repositories.materials.findAll();
  }

  async listRewards(): Promise<Reward[]> {
    return this.ctx.repositories.rewards.findAll();
  }

  async listQrSessions(): Promise<QrAttendanceSession[]> {
    return this.qrSessions.getAll();
  }

  async addTeamScore(
    teamId: string,
    category: TeamScoreCategory,
    awardedById: string,
    points?: number,
    description?: string,
  ) {
    const score = await this.scores.awardTeamCategoryScore(
      teamId,
      category,
      awardedById,
      points,
      description,
    );
    this.ctx.activityLog.add(`Team score +${score.points} added (${category})`);
    return score;
  }

  async addIndividualScore(
    memberId: string,
    userId: string,
    teamId: string,
    category: IndividualScoreCategory,
    awardedById: string,
    points?: number,
    description?: string,
  ) {
    const member = await this.ctx.repositories.teamMembers.findById(memberId);
    const score = await this.scores.awardCategoryScore(
      memberId,
      userId,
      teamId,
      category,
      awardedById,
      points,
      description,
    );
    this.ctx.activityLog.add(
      `Score +${score.points} added to ${member?.displayName ?? memberId}`,
    );
    return score;
  }

  async applyPenalty(
    scope: 'individual' | 'team',
    targetId: string,
    penaltyType: PenaltyType,
    awardedById: string,
    userId?: string,
    teamId?: string,
  ) {
    if (scope === 'individual') {
      if (!userId || !teamId) {
        throw new Error('userId and teamId required for individual penalty');
      }
      const member = await this.ctx.repositories.teamMembers.findById(targetId);
      const score = await this.scores.applyIndividualPenalty(
        targetId,
        userId,
        teamId,
        penaltyType,
        awardedById,
      );
      this.ctx.activityLog.add(
        `Penalty applied to ${member?.displayName ?? targetId}`,
      );
      return score;
    }

    const team = await this.ctx.repositories.teams.findById(targetId);
    const score = await this.scores.applyTeamPenalty(targetId, penaltyType, awardedById);
    this.ctx.activityLog.add(`Penalty applied to team ${team?.name ?? targetId}`);
    return score;
  }

  async recordAttendanceEntry(input: RecordAttendanceInput) {
    const member = await this.ctx.repositories.teamMembers.findById(input.memberId);
    const record = await this.attendance.recordAttendance(input);
    this.ctx.activityLog.add(
      `Attendance recorded for ${member?.displayName ?? input.memberId}`,
    );
    return record;
  }

  async recordAttendance(
    memberId: string,
    userId: string,
    teamId: string,
    recordedById: string,
    activityId?: string,
  ) {
    return this.recordAttendanceEntry({
      memberId,
      userId,
      teamId,
      sessionType: AttendanceSessionType.Liturgy,
      status: AttendanceStatus.Present,
      activityId,
      recordedById,
    });
  }

  async recordConfession(
    memberId: string,
    userId: string,
    teamId: string,
    recordedById: string,
  ) {
    const member = await this.ctx.repositories.teamMembers.findById(memberId);
    await this.attendance.recordConfession(memberId, userId, teamId, recordedById);
    this.ctx.activityLog.add(
      `Confession recorded for ${member?.displayName ?? memberId}`,
    );
  }

  async recordPsalmMemorization(
    memberId: string,
    userId: string,
    teamId: string,
    recordedById: string,
  ) {
    const member = await this.ctx.repositories.teamMembers.findById(memberId);
    const score = await this.scores.awardCategoryScore(
      memberId,
      userId,
      teamId,
      IndividualScoreCategory.PsalmMemorization,
      recordedById,
      undefined,
      'Psalm memorization completed',
    );
    this.ctx.activityLog.add(
      `Psalm memorization recorded for ${member?.displayName ?? memberId}`,
    );
    return score;
  }

  async recordHymnMemorization(teamId: string, recordedById: string, memberId?: string) {
    const team = await this.ctx.repositories.teams.findById(teamId);
    const score = await this.scores.awardTeamCategoryScore(
      teamId,
      TeamScoreCategory.HymnMemorization,
      recordedById,
      undefined,
      'Hymn memorization completed',
    );
    this.ctx.activityLog.add(
      `Hymn memorization recorded for ${team?.name ?? teamId}`,
    );

    if (memberId) {
      const member = await this.ctx.repositories.teamMembers.findById(memberId);
      if (member) {
        await this.scores.awardCategoryScore(
          memberId,
          member.userId,
          teamId,
          IndividualScoreCategory.Participation,
          recordedById,
          undefined,
          'Hymn memorization participation',
        );
      }
    }
    return score;
  }

  publishAnnouncement(input: Parameters<AnnouncementService['publishAnnouncement']>[0]) {
    return this.announcements.publishAnnouncement(input);
  }

  uploadMaterial(input: Parameters<MaterialService['uploadMaterial']>[0]) {
    return this.materials.uploadMaterial(input);
  }

  publishMaterial(id: string) {
    return this.materials.publishMaterial(id);
  }

  createQuiz(input: Parameters<QuizService['createQuiz']>[0]) {
    return this.quizzes.createQuiz(input);
  }

  createReward(input: Parameters<RewardService['createReward']>[0]) {
    return this.rewards.createReward(input);
  }

  updateReward(id: string, data: Parameters<RewardService['updateReward']>[1]) {
    return this.rewards.updateReward(id, data);
  }

  async updateMember(
    memberId: string,
    data: Partial<Pick<TeamMember, 'displayName' | 'teamId' | 'grade' | 'status'>>,
  ): Promise<TeamMember | null> {
    const member = await this.ctx.repositories.teamMembers.findById(memberId);
    if (!member) {
      throw new Error('Member not found');
    }

    if (data.teamId && data.teamId !== member.teamId) {
      const oldTeam = await this.ctx.repositories.teams.findById(member.teamId);
      const newTeam = await this.ctx.repositories.teams.findById(data.teamId);
      if (oldTeam) {
        await this.ctx.repositories.teams.update(oldTeam.id, {
          memberCount: Math.max(0, oldTeam.memberCount - 1),
        });
      }
      if (newTeam) {
        await this.ctx.repositories.teams.update(newTeam.id, {
          memberCount: newTeam.memberCount + 1,
        });
      }
    }

    const updated = await this.ctx.repositories.teamMembers.update(memberId, data);
    if (updated) {
      this.ctx.activityLog.add(`Member ${updated.displayName} updated`);
      this.ctx.notifyChange();
    }
    return updated;
  }

  async updateTeam(
    teamId: string,
    data: Partial<Pick<Team, 'name' | 'color' | 'motto' | 'status'>>,
  ): Promise<Team | null> {
    const updated = await this.ctx.repositories.teams.update(teamId, data);
    if (updated) {
      this.ctx.activityLog.add(`Team ${updated.name} updated`);
      this.ctx.notifyChange();
    }
    return updated;
  }

  redeemReward(rewardId: string, memberId: string, userId: string) {
    return this.rewards.redeemReward(rewardId, memberId, userId);
  }

  async getPublishedMaterials() {
    return this.materials.getAll();
  }

  async getActiveRewards() {
    return this.rewards.getAll();
  }

  async getPublishedAnnouncements(teamId?: string) {
    const announcements = await this.announcements.getPublished();
    return filterVisibleAnnouncements(announcements, teamId);
  }
}

function buildAttendanceTrend(records: AttendanceRecord[]): AttendanceTrendPoint[] {
  const dayKeys: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dayKeys.push(date.toISOString().slice(0, 10));
  }

  const grouped = new Map<string, { present: number; absent: number }>();
  for (const record of records) {
    const key = record.sessionDate.slice(0, 10);
    const bucket = grouped.get(key) ?? { present: 0, absent: 0 };
    if (isPresent(record.status)) {
      bucket.present++;
    } else if (record.status === AttendanceStatus.Absent) {
      bucket.absent++;
    }
    grouped.set(key, bucket);
  }

  return dayKeys.map((key) => {
    const bucket = grouped.get(key) ?? { present: 0, absent: 0 };
    const date = new Date(`${key}T12:00:00`);
    return {
      label: date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' }),
      present: bucket.present,
      absent: bucket.absent,
      total: bucket.present + bucket.absent,
    };
  });
}

function buildAttendanceAnalytics(records: AttendanceRecord[]): AttendanceAnalytics {
  let presentCount = 0;
  let absentCount = 0;
  let excusedCount = 0;
  let lateCount = 0;

  for (const record of records) {
    switch (record.status) {
      case AttendanceStatus.Present:
        presentCount++;
        break;
      case AttendanceStatus.Absent:
        absentCount++;
        break;
      case AttendanceStatus.Excused:
        excusedCount++;
        break;
      case AttendanceStatus.Late:
        lateCount++;
        presentCount++;
        break;
    }
  }

  const totalRecords = records.length;
  const attendanceRate =
    totalRecords === 0 ? 0 : Math.round((presentCount / totalRecords) * 100);

  return {
    totalRecords,
    presentCount,
    absentCount,
    excusedCount,
    lateCount,
    attendanceRate,
    trend: buildAttendanceTrend(records),
  };
}

function buildQrStats(sessions: QrAttendanceSession[]) {
  const totalCheckIns = sessions.reduce(
    (sum, session) => sum + session.checkInMemberIds.length,
    0,
  );

  return {
    totalSessions: sessions.length,
    activeSessions: sessions.filter((s) => s.status === QrSessionStatus.Active).length,
    closedSessions: sessions.filter(
      (s) => s.status === QrSessionStatus.Closed || s.status === QrSessionStatus.Expired,
    ).length,
    totalCheckIns,
    averageCheckIns:
      sessions.length === 0 ? 0 : Math.round((totalCheckIns / sessions.length) * 10) / 10,
  };
}

function buildRewardStats(rewards: Reward[]) {
  const activeRewards = rewards.filter((reward) => reward.isActive);
  const publishedRewards = rewards.filter((reward) => reward.isPublished);
  const totalStock = rewards.reduce((sum, reward) => sum + reward.stock, 0);
  const lowStockCount = rewards.filter((reward) => reward.stock <= 5).length;
  const averagePointsRequired =
    rewards.length === 0
      ? 0
      : Math.round(
          rewards.reduce((sum, reward) => sum + reward.requiredPoints, 0) / rewards.length,
        );

  return {
    totalRewards: rewards.length,
    activeRewards: activeRewards.length,
    publishedRewards: publishedRewards.length,
    totalStock,
    lowStockCount,
    averagePointsRequired,
  };
}

function buildFestivalProgress(activities: Activity[]): FestivalProgress {
  const start = new Date(FESTIVAL.START_DATE);
  const end = new Date(FESTIVAL.END_DATE);
  const now = new Date();
  const totalMs = end.getTime() - start.getTime();
  const elapsedMs = Math.max(0, Math.min(totalMs, now.getTime() - start.getTime()));
  const totalDays = Math.max(1, Math.ceil(totalMs / 86400000));
  const daysElapsed = Math.min(totalDays, Math.ceil(elapsedMs / 86400000));
  const daysRemaining = Math.max(0, totalDays - daysElapsed);
  const percentComplete = Math.min(100, Math.round((daysElapsed / totalDays) * 100));

  const completedActivities = activities.filter(
    (activity) => activity.status === ActivityStatus.Completed,
  ).length;
  const upcomingActivities = activities.filter(
    (activity) =>
      activity.status === ActivityStatus.Upcoming ||
      activity.status === ActivityStatus.Active,
  ).length;

  let phase = 'Preparation';
  if (percentComplete >= 75) phase = 'Closing Week';
  else if (percentComplete >= 50) phase = 'Peak Season';
  else if (percentComplete >= 25) phase = 'Active Festival';
  else if (percentComplete > 0) phase = 'Opening Phase';

  return {
    percentComplete,
    daysElapsed,
    daysRemaining,
    totalDays,
    completedActivities,
    upcomingActivities,
    phase,
  };
}

export {
  IndividualScoreCategory,
  TeamScoreCategory,
  PenaltyType,
  AttendanceSessionType,
  AttendanceStatus,
};
