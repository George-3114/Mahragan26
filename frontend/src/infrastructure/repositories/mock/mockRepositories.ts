import type { EntityId } from '../../../domain';
import type {
  Activity,
  ActivityFilter,
  Announcement,
  AnnouncementFilter,
  AttendanceFilter,
  AttendanceRecord,
  Badge,
  BadgeFilter,
  IndividualScore,
  Material,
  MaterialFilter,
  QrAttendanceSession,
  QrSessionFilter,
  Quiz,
  QuizFilter,
  Reward,
  RewardFilter,
  ScoreFilter,
  Team,
  TeamFilter,
  TeamMember,
  TeamMemberFilter,
  TeamScore,
  TeamScoreFilter,
} from '../../../domain';
import type {
  ActivityRepositoryPort,
  AnnouncementRepositoryPort,
  AttendanceRepositoryPort,
  BadgeRepositoryPort,
  IndividualScoreRepositoryPort,
  MaterialRepositoryPort,
  QrSessionRepositoryPort,
  QuizRepositoryPort,
  RewardRepositoryPort,
  TeamMemberRepositoryPort,
  TeamRepositoryPort,
  TeamScoreRepositoryPort,
} from '../../../domain/ports';
import { BaseMockRepository } from './baseMockRepository';
import {
  generateExtraMembers,
  SEED_ACTIVITIES,
  SEED_ANNOUNCEMENTS,
  SEED_BADGES,
  SEED_EXTRA_ACTIVITIES,
  SEED_MATERIALS,
  SEED_MEMBERS,
  SEED_QUIZZES,
  SEED_REWARDS,
  SEED_QR_SESSIONS,
  SEED_TEAMS,
} from './seedData';

class MockTeamRepository
  extends BaseMockRepository<Team, TeamFilter>
  implements TeamRepositoryPort
{
  constructor() {
    super(SEED_TEAMS);
  }

  protected applyFilter(items: Team[], filter?: TeamFilter): Team[] {
    if (!filter) return items;
    return items.filter((team) => {
      if (filter.festivalYear && team.festivalYear !== filter.festivalYear) return false;
      if (filter.status && team.status !== filter.status) return false;
      if (filter.search && !team.name.toLowerCase().includes(filter.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }

  async findByFestivalYear(festivalYear: string): Promise<Team[]> {
    return this.findAll({ festivalYear });
  }
}

class MockTeamMemberRepository
  extends BaseMockRepository<TeamMember, TeamMemberFilter>
  implements TeamMemberRepositoryPort
{
  constructor() {
    super([...SEED_MEMBERS, ...generateExtraMembers()]);
  }

  protected applyFilter(items: TeamMember[], filter?: TeamMemberFilter): TeamMember[] {
    if (!filter) return items;
    return items.filter((member) => {
      if (filter.festivalYear && member.festivalYear !== filter.festivalYear) return false;
      if (filter.teamId && member.teamId !== filter.teamId) return false;
      if (filter.userId && member.userId !== filter.userId) return false;
      if (filter.grade && member.grade !== filter.grade) return false;
      if (filter.status && member.status !== filter.status) return false;
      return true;
    });
  }

  async findByTeamId(teamId: EntityId): Promise<TeamMember[]> {
    return this.findAll({ teamId });
  }

  async findByUserId(userId: EntityId): Promise<TeamMember | null> {
    const members = await this.findAll({ userId });
    return members[0] ?? null;
  }
}

class MockIndividualScoreRepository
  extends BaseMockRepository<IndividualScore, ScoreFilter>
  implements IndividualScoreRepositoryPort
{
  protected applyFilter(items: IndividualScore[], filter?: ScoreFilter): IndividualScore[] {
    if (!filter) return items;
    return items.filter((score) => {
      if (filter.festivalYear && score.festivalYear !== filter.festivalYear) return false;
      if (filter.teamId && score.teamId !== filter.teamId) return false;
      if (filter.memberId && score.memberId !== filter.memberId) return false;
      if (filter.userId && score.userId !== filter.userId) return false;
      if (filter.category && score.category !== filter.category) return false;
      if (filter.entryType && score.entryType !== filter.entryType) return false;
      if (filter.activityId && score.activityId !== filter.activityId) return false;
      if (filter.isPenalty !== undefined && score.isPenalty !== filter.isPenalty) return false;
      return true;
    });
  }

  async findByMemberId(memberId: EntityId): Promise<IndividualScore[]> {
    return this.findAll({ memberId });
  }

  async findByTeamId(teamId: EntityId): Promise<IndividualScore[]> {
    return this.findAll({ teamId });
  }
}

class MockTeamScoreRepository
  extends BaseMockRepository<TeamScore, TeamScoreFilter>
  implements TeamScoreRepositoryPort
{
  protected applyFilter(items: TeamScore[], filter?: TeamScoreFilter): TeamScore[] {
    if (!filter) return items;
    return items.filter((score) => {
      if (filter.festivalYear && score.festivalYear !== filter.festivalYear) return false;
      if (filter.teamId && score.teamId !== filter.teamId) return false;
      if (filter.category && score.category !== filter.category) return false;
      if (filter.entryType && score.entryType !== filter.entryType) return false;
      if (filter.activityId && score.activityId !== filter.activityId) return false;
      if (filter.isPenalty !== undefined && score.isPenalty !== filter.isPenalty) return false;
      return true;
    });
  }

  async findByTeamId(teamId: EntityId): Promise<TeamScore[]> {
    return this.findAll({ teamId });
  }
}

class MockActivityRepository
  extends BaseMockRepository<Activity, ActivityFilter>
  implements ActivityRepositoryPort
{
  constructor() {
    super([...SEED_ACTIVITIES, ...SEED_EXTRA_ACTIVITIES]);
  }

  protected applyFilter(items: Activity[], filter?: ActivityFilter): Activity[] {
    if (!filter) return items;
    return items.filter((activity) => {
      if (filter.festivalYear && activity.festivalYear !== filter.festivalYear) return false;
      if (filter.type && activity.type !== filter.type) return false;
      if (filter.status && activity.status !== filter.status) return false;
      if (filter.scope && activity.scope !== filter.scope) return false;
      return true;
    });
  }
}

class MockAttendanceRepository
  extends BaseMockRepository<AttendanceRecord, AttendanceFilter>
  implements AttendanceRepositoryPort
{
  async findByMemberId(memberId: EntityId): Promise<AttendanceRecord[]> {
    return this.findAll({ memberId });
  }
}

class MockRewardRepository
  extends BaseMockRepository<Reward, RewardFilter>
  implements RewardRepositoryPort
{
  constructor() {
    super(SEED_REWARDS);
  }

  protected applyFilter(items: Reward[], filter?: RewardFilter): Reward[] {
    if (!filter) return items;
    return items.filter((reward) => {
      if (filter.category && reward.category !== filter.category) return false;
      if (filter.isActive !== undefined && reward.isActive !== filter.isActive) return false;
      if (filter.isPublished !== undefined && reward.isPublished !== filter.isPublished) return false;
      if (filter.maxRequiredPoints !== undefined && reward.requiredPoints > filter.maxRequiredPoints) {
        return false;
      }
      return true;
    });
  }
}

class MockAnnouncementRepository
  extends BaseMockRepository<Announcement, AnnouncementFilter>
  implements AnnouncementRepositoryPort
{
  constructor() {
    super(SEED_ANNOUNCEMENTS);
  }

  protected applyFilter(items: Announcement[], filter?: AnnouncementFilter): Announcement[] {
    if (!filter) return items;
    return items.filter((announcement) => {
      if (filter.type && announcement.type !== filter.type) return false;
      if (filter.priority && announcement.priority !== filter.priority) return false;
      if (filter.isPublished !== undefined && announcement.isPublished !== filter.isPublished) {
        return false;
      }
      if (filter.teamId && announcement.targetTeamIds?.length) {
        return announcement.targetTeamIds.includes(filter.teamId);
      }
      return true;
    });
  }
}

class MockMaterialRepository
  extends BaseMockRepository<Material, MaterialFilter>
  implements MaterialRepositoryPort
{
  constructor() {
    super(SEED_MATERIALS);
  }

  protected applyFilter(items: Material[], filter?: MaterialFilter): Material[] {
    if (!filter) return items;
    return items.filter((material) => {
      if (filter.isPublished !== undefined && material.isPublished !== filter.isPublished) {
        return false;
      }
      if (filter.category && material.category !== filter.category) return false;
      if (filter.type && material.type !== filter.type) return false;
      if (filter.tag && !material.tags.includes(filter.tag)) return false;
      if (filter.search) {
        const q = filter.search.toLowerCase();
        if (
          !material.title.toLowerCase().includes(q) &&
          !material.description.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }
}

class MockQuizRepository
  extends BaseMockRepository<Quiz, QuizFilter>
  implements QuizRepositoryPort
{
  constructor() {
    super(SEED_QUIZZES);
  }
}

class MockBadgeRepository
  extends BaseMockRepository<Badge, BadgeFilter>
  implements BadgeRepositoryPort
{
  constructor() {
    super(SEED_BADGES);
  }
}

class MockQrSessionRepository
  extends BaseMockRepository<QrAttendanceSession, QrSessionFilter>
  implements QrSessionRepositoryPort
{
  constructor() {
    super(SEED_QR_SESSIONS);
  }

  protected applyFilter(items: QrAttendanceSession[], filter?: QrSessionFilter): QrAttendanceSession[] {
    if (!filter) return items;
    return items.filter((session) => {
      if (filter.festivalYear && session.festivalYear !== filter.festivalYear) return false;
      if (filter.status && session.status !== filter.status) return false;
      if (filter.sessionType && session.sessionType !== filter.sessionType) return false;
      return true;
    });
  }
}

export function createMockRepositories() {
  return {
    teams: new MockTeamRepository(),
    teamMembers: new MockTeamMemberRepository(),
    individualScores: new MockIndividualScoreRepository(),
    teamScores: new MockTeamScoreRepository(),
    activities: new MockActivityRepository(),
    attendance: new MockAttendanceRepository(),
    rewards: new MockRewardRepository(),
    announcements: new MockAnnouncementRepository(),
    materials: new MockMaterialRepository(),
    quizzes: new MockQuizRepository(),
    badges: new MockBadgeRepository(),
    qrSessions: new MockQrSessionRepository(),
  };
}

export type MockRepositories = ReturnType<typeof createMockRepositories>;
