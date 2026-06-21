import type {
  BaseEntity,
  CreateInput,
  EntityId,
  PaginatedResult,
  PaginationParams,
  UpdateInput,
} from '../common';

/**
 * Generic repository port — infrastructure implements this for MongoDB.
 * Uses string IDs that map to MongoDB ObjectId at the persistence boundary.
 */
export interface Repository<T extends BaseEntity, TFilter = unknown> {
  findById(id: EntityId): Promise<T | null>;
  findMany(filter?: TFilter, pagination?: PaginationParams): Promise<PaginatedResult<T>>;
  findAll(filter?: TFilter): Promise<T[]>;
  create(data: CreateInput<T>): Promise<T>;
  update(id: EntityId, data: UpdateInput<T>): Promise<T | null>;
  delete(id: EntityId): Promise<boolean>;
  count(filter?: TFilter): Promise<number>;
}

export interface FestivalYearFilter {
  readonly festivalYear: string;
}

export interface TeamRepositoryPort
  extends Repository<import('../teams').Team, import('../teams').TeamFilter> {
  findByFestivalYear(festivalYear: string): Promise<import('../teams').Team[]>;
}

export interface TeamMemberRepositoryPort
  extends Repository<
    import('../team-members').TeamMember,
    import('../team-members').TeamMemberFilter
  > {
  findByTeamId(teamId: EntityId): Promise<import('../team-members').TeamMember[]>;
  findByUserId(userId: EntityId): Promise<import('../team-members').TeamMember | null>;
}

export interface IndividualScoreRepositoryPort
  extends Repository<
    import('../individual-scores').IndividualScore,
    import('../individual-scores').ScoreFilter
  > {
  findByMemberId(memberId: EntityId): Promise<import('../individual-scores').IndividualScore[]>;
  findByTeamId(teamId: EntityId): Promise<import('../individual-scores').IndividualScore[]>;
}

export interface TeamScoreRepositoryPort
  extends Repository<
    import('../team-scores').TeamScore,
    import('../team-scores').TeamScoreFilter
  > {
  findByTeamId(teamId: EntityId): Promise<import('../team-scores').TeamScore[]>;
}

export interface ActivityRepositoryPort
  extends Repository<
    import('../activities').Activity,
    import('../activities').ActivityFilter
  > {}

export interface AttendanceRepositoryPort
  extends Repository<
    import('../attendance').AttendanceRecord,
    import('../attendance').AttendanceFilter
  > {
  findByMemberId(memberId: EntityId): Promise<import('../attendance').AttendanceRecord[]>;
}

export interface RewardRepositoryPort
  extends Repository<
    import('../rewards').Reward,
    import('../rewards').RewardFilter
  > {}

export interface AnnouncementRepositoryPort
  extends Repository<
    import('../announcements').Announcement,
    import('../announcements').AnnouncementFilter
  > {}

export interface MaterialRepositoryPort
  extends Repository<
    import('../materials').Material,
    import('../materials').MaterialFilter
  > {}

export interface QuizRepositoryPort
  extends Repository<
    import('../quizzes').Quiz,
    import('../quizzes').QuizFilter
  > {}

export interface BadgeRepositoryPort
  extends Repository<
    import('../badges').Badge,
    import('../badges').BadgeFilter
  > {}

export interface QrSessionRepositoryPort
  extends Repository<
    import('../qr-sessions').QrAttendanceSession,
    import('../qr-sessions').QrSessionFilter
  > {}

/** Aggregate repository container for dependency injection. */
export interface FestivalRepositories {
  readonly teams: TeamRepositoryPort;
  readonly teamMembers: TeamMemberRepositoryPort;
  readonly individualScores: IndividualScoreRepositoryPort;
  readonly teamScores: TeamScoreRepositoryPort;
  readonly activities: ActivityRepositoryPort;
  readonly attendance: AttendanceRepositoryPort;
  readonly rewards: RewardRepositoryPort;
  readonly announcements: AnnouncementRepositoryPort;
  readonly materials: MaterialRepositoryPort;
  readonly quizzes: QuizRepositoryPort;
  readonly badges: BadgeRepositoryPort;
  readonly qrSessions: QrSessionRepositoryPort;
}
