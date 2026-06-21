import {
  ActivityStatus,
  ActivityType,
  AnnouncementPriority,
  AnnouncementType,
  AttendanceSessionType,
  AttendanceStatus,
  BadgeCategory,
  BadgeCriteriaType,
  FESTIVAL,
  Grade,
  MaterialCategory,
  MaterialType,
  RewardCategory,
  ScoreScope,
  TeamMemberRole,
  TeamMemberStatus,
  TeamStatus,
  type Activity,
  type Announcement,
  type Badge,
  type Material,
  type Quiz,
  type Reward,
  type Team,
  type TeamMember,
  QrSessionStatus,
  type QrAttendanceSession,
} from '../../../domain';
import { QuizQuestionType } from '../../../domain/quizzes/enums';

const ts = new Date().toISOString();
const year = FESTIVAL.CURRENT_YEAR;

export const SEED_TEAMS: Team[] = [
  { id: '1', name: 'St. Michael', color: '#3B82F6', motto: 'Strong in Faith', status: TeamStatus.Active, memberCount: 12, totalPoints: 1850, categoryPoints: { quiz: 450, liturgy: 300, sports: 600, hymn: 200, psalm: 150, penalty: 50 }, festivalYear: year, createdAt: ts, updatedAt: ts },
  { id: '2', name: 'St. Gabriel', color: '#10B981', motto: 'Messengers of God', status: TeamStatus.Active, memberCount: 11, totalPoints: 1720, categoryPoints: { quiz: 400, liturgy: 350, sports: 500, hymn: 170, psalm: 130, penalty: 30 }, festivalYear: year, createdAt: ts, updatedAt: ts },
  { id: '3', name: 'St. Raphael', color: '#F59E0B', motto: 'Healing Hearts', status: TeamStatus.Active, memberCount: 10, totalPoints: 1590, categoryPoints: { quiz: 380, liturgy: 280, sports: 450, hymn: 160, psalm: 120, penalty: 20 }, festivalYear: year, createdAt: ts, updatedAt: ts },
  { id: '4', name: 'St. George', color: '#EF4444', motto: 'Victorious Warriors', status: TeamStatus.Active, memberCount: 11, totalPoints: 1480, categoryPoints: { quiz: 350, liturgy: 250, sports: 480, hymn: 150, psalm: 100, penalty: 50 }, festivalYear: year, createdAt: ts, updatedAt: ts },
  { id: '5', name: 'St. Joseph', color: '#6366F1', motto: 'Humble Servants', status: TeamStatus.Active, memberCount: 10, totalPoints: 1350, categoryPoints: { quiz: 300, liturgy: 220, sports: 400, hymn: 130, psalm: 90, penalty: 90 }, festivalYear: year, createdAt: ts, updatedAt: ts },
  { id: '6', name: 'St. Mary', color: '#EC4899', motto: 'Pure Hearts', status: TeamStatus.Active, memberCount: 12, totalPoints: 1220, categoryPoints: { quiz: 280, liturgy: 200, sports: 350, hymn: 120, psalm: 80, penalty: 10 }, festivalYear: year, createdAt: ts, updatedAt: ts },
  { id: '7', name: 'St. Peter', color: '#14B8A6', motto: 'Rock of Faith', status: TeamStatus.Active, memberCount: 9, totalPoints: 1100, categoryPoints: { quiz: 250, liturgy: 180, sports: 320, hymn: 100, psalm: 70, penalty: 20 }, festivalYear: year, createdAt: ts, updatedAt: ts },
  { id: '8', name: 'St. Paul', color: '#8B5CF6', motto: 'Spreading the Word', status: TeamStatus.Active, memberCount: 11, totalPoints: 980, categoryPoints: { quiz: 220, liturgy: 150, sports: 280, hymn: 80, psalm: 60, penalty: 10 }, festivalYear: year, createdAt: ts, updatedAt: ts },
];

export const SEED_MEMBERS: TeamMember[] = [
  { id: 'm1', userId: 'u1', teamId: '1', displayName: 'Emma', grade: Grade.Grade6, role: TeamMemberRole.Member, status: TeamMemberStatus.Active, totalPoints: 420, joinedAt: ts, festivalYear: year, createdAt: ts, updatedAt: ts },
  { id: 'm2', userId: 'u2', teamId: '2', displayName: 'David', grade: Grade.Grade5, role: TeamMemberRole.Member, status: TeamMemberStatus.Active, totalPoints: 385, joinedAt: ts, festivalYear: year, createdAt: ts, updatedAt: ts },
  { id: 'm3', userId: 'u3', teamId: '3', displayName: 'Sophia', grade: Grade.Grade6, role: TeamMemberRole.Captain, status: TeamMemberStatus.Active, totalPoints: 340, joinedAt: ts, festivalYear: year, createdAt: ts, updatedAt: ts },
  { id: 'm4', userId: 'u4', teamId: '1', displayName: 'Matthew', grade: Grade.Grade5, role: TeamMemberRole.Member, status: TeamMemberStatus.Active, totalPoints: 310, joinedAt: ts, festivalYear: year, createdAt: ts, updatedAt: ts },
  { id: 'm5', userId: 'u5', teamId: '4', displayName: 'Isabella', grade: Grade.Grade6, role: TeamMemberRole.Member, status: TeamMemberStatus.Active, totalPoints: 290, joinedAt: ts, festivalYear: year, createdAt: ts, updatedAt: ts },
  { id: 'm6', userId: 'u6', teamId: '1', displayName: 'Friend', grade: Grade.Grade5, role: TeamMemberRole.Member, status: TeamMemberStatus.Active, totalPoints: 245, joinedAt: ts, festivalYear: year, createdAt: ts, updatedAt: ts },
];

export const SEED_ANNOUNCEMENTS: Announcement[] = [
  { id: 'a1', title: 'Welcome to the Festival!', content: "We are excited to welcome all children to this year's church festival. May God bless you all!", type: AnnouncementType.News, priority: AnnouncementPriority.Normal, authorId: 'admin1', isPublished: true, publishedAt: ts, createdAt: ts, updatedAt: ts },
  { id: 'a2', title: 'Sports Day Announcement', content: 'Get ready for our annual Sports Day! Prepare your teams and show your best performances.', type: AnnouncementType.Competition, priority: AnnouncementPriority.High, authorId: 'admin1', isPublished: true, publishedAt: ts, createdAt: ts, updatedAt: ts },
  { id: 'a3', title: 'Quiz Competition This Week', content: "Don't forget the online quiz competition. Complete it before Sunday for bonus points!", type: AnnouncementType.Important, priority: AnnouncementPriority.Urgent, authorId: 'admin1', isPublished: true, publishedAt: ts, createdAt: ts, updatedAt: ts },
];

export const SEED_ACTIVITIES: Activity[] = [
  { id: 'act1', title: 'Monthly Liturgy', description: 'Regular Sunday liturgy attendance', type: ActivityType.Liturgy, status: ActivityStatus.Upcoming, scope: ScoreScope.Individual, scheduledAt: new Date(Date.now() + 2 * 86400000).toISOString(), defaultPoints: 100, isMandatory: true, createdById: 'admin1', festivalYear: year, createdAt: ts, updatedAt: ts },
  { id: 'act2', title: 'Psalm Memorization', description: 'Memorize and recite Psalm 23', type: ActivityType.PsalmMemorization, status: ActivityStatus.Upcoming, scope: ScoreScope.Individual, scheduledAt: new Date(Date.now() + 5 * 86400000).toISOString(), defaultPoints: 100, isMandatory: false, createdById: 'admin1', festivalYear: year, createdAt: ts, updatedAt: ts },
  { id: 'act3', title: 'Sports Competition', description: 'Annual sports competition', type: ActivityType.Sports, status: ActivityStatus.Upcoming, scope: ScoreScope.Team, scheduledAt: new Date(Date.now() + 7 * 86400000).toISOString(), defaultPoints: 600, isMandatory: false, createdById: 'admin1', festivalYear: year, createdAt: ts, updatedAt: ts },
];

export const SEED_REWARDS: Reward[] = [
  { id: 'r1', name: 'Festival Notebook', description: 'Custom festival notebook', requiredPoints: 100, category: RewardCategory.Stationery, stock: 25, isActive: true, isPublished: true, publishedAt: ts, createdAt: ts, updatedAt: ts },
  { id: 'r2', name: 'Bible Story Book', description: 'Illustrated Bible stories', requiredPoints: 250, category: RewardCategory.Book, stock: 15, isActive: true, isPublished: true, publishedAt: ts, createdAt: ts, updatedAt: ts },
  { id: 'r3', name: 'Saint Medal Set', description: 'Collectible saint medals', requiredPoints: 500, category: RewardCategory.Gift, stock: 10, isActive: true, isPublished: true, publishedAt: ts, createdAt: ts, updatedAt: ts },
];

export const SEED_MATERIALS: Material[] = [
  { id: 'mat1', title: 'Liturgy Guide', description: 'Guide for Sunday liturgy participation', type: MaterialType.Pdf, category: MaterialCategory.Liturgy, fileUrl: '/materials/liturgy-guide.pdf', tags: ['liturgy', 'guide'], downloadCount: 42, isPublished: true, publishedAt: ts, uploadedById: 'admin1', createdAt: ts, updatedAt: ts },
  { id: 'mat2', title: 'Hymn Sheet - Alleluia', description: 'Sheet music for Alleluia hymn', type: MaterialType.Hymn, category: MaterialCategory.Hymns, fileUrl: '/materials/alleluia.pdf', tags: ['hymn'], downloadCount: 28, isPublished: true, publishedAt: ts, uploadedById: 'admin1', createdAt: ts, updatedAt: ts },
];

export const SEED_QUIZZES: Quiz[] = [
  {
    id: 'q1',
    title: 'Bible Basics Quiz',
    description: 'Test your knowledge of Bible stories',
    questions: [
      { id: 'qq1', questionText: 'Who built the ark?', type: QuizQuestionType.MultipleChoice, options: ['Moses', 'Noah', 'David', 'Abraham'], correctAnswer: 'Noah', points: 10, order: 1 },
      { id: 'qq2', questionText: 'Jesus was born in Bethlehem.', type: QuizQuestionType.TrueFalse, options: ['True', 'False'], correctAnswer: 'True', points: 10, order: 2 },
    ],
    totalPoints: 50,
    timeLimitMinutes: 30,
    passingScorePercent: 50,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    isPublished: true,
    publishedAt: ts,
    createdById: 'admin1',
    createdAt: ts,
    updatedAt: ts,
  },
];

export const SEED_BADGES: Badge[] = [
  { id: 'b1', name: 'Top Performer', description: 'Reach 400+ individual points', icon: 'trophy', color: '#F59E0B', category: BadgeCategory.TopPerformer, pointsBonus: 25, criteria: { type: BadgeCriteriaType.PointsThreshold, threshold: 400 }, isActive: true, createdAt: ts, updatedAt: ts },
  { id: 'b2', name: 'Quiz Master', description: 'Score 100% on a quiz', icon: 'brain', color: '#8B5CF6', category: BadgeCategory.QuizMaster, pointsBonus: 20, criteria: { type: BadgeCriteriaType.QuizPerfectScore, threshold: 1 }, isActive: true, createdAt: ts, updatedAt: ts },
  { id: 'b3', name: 'Psalm Hero', description: 'Complete psalm memorization', icon: 'book', color: '#10B981', category: BadgeCategory.PsalmHero, pointsBonus: 15, criteria: { type: BadgeCriteriaType.Manual }, isActive: true, createdAt: ts, updatedAt: ts },
];

/** Extra activities to match historical appStats count of 12 */
export const SEED_EXTRA_ACTIVITIES: Activity[] = Array.from({ length: 9 }, (_, i) => ({
  id: `act-extra-${i + 4}`,
  title: `Festival Activity ${i + 4}`,
  description: 'Scheduled festival activity',
  type: ActivityType.General,
  status: ActivityStatus.Upcoming,
  scope: ScoreScope.Individual,
  scheduledAt: new Date(Date.now() + (i + 10) * 86400000).toISOString(),
  defaultPoints: 50,
  isMandatory: false,
  createdById: 'admin1',
  festivalYear: year,
  createdAt: ts,
  updatedAt: ts,
}));

/** Synthetic members to reach ~86 participants in stats */
export function generateExtraMembers(): TeamMember[] {
  const extras: TeamMember[] = [];
  let id = 100;
  for (const team of SEED_TEAMS) {
    const needed = team.memberCount - SEED_MEMBERS.filter((m) => m.teamId === team.id).length;
    for (let i = 0; i < needed; i++) {
      id += 1;
      extras.push({
        id: `m${id}`,
        userId: `u${id}`,
        teamId: team.id,
        displayName: `Member ${id}`,
        grade: i % 2 === 0 ? Grade.Grade5 : Grade.Grade6,
        role: TeamMemberRole.Member,
        status: TeamMemberStatus.Active,
        totalPoints: 50 + (id % 100),
        joinedAt: ts,
        festivalYear: year,
        createdAt: ts,
        updatedAt: ts,
      });
    }
  }
  return extras;
}

export const SEED_ACTIVITY_LOG = [
  'Score +100 added to Emma',
  'New user David created',
  'Activity Sports updated',
  'Announcement posted',
];

export const SEED_QR_SESSIONS: QrAttendanceSession[] = [
  {
    id: 'qr1',
    title: 'Sunday Liturgy Check-in',
    sessionType: AttendanceSessionType.Liturgy,
    status: QrSessionStatus.Active,
    code: 'QR-LIT001',
    expiresAt: new Date(Date.now() + 2 * 3600000).toISOString(),
    createdById: 'admin1',
    checkInMemberIds: ['m1', 'm4'],
    festivalYear: year,
    createdAt: ts,
    updatedAt: ts,
  },
  {
    id: 'qr2',
    title: 'Sports Day Attendance',
    sessionType: AttendanceSessionType.Activity,
    activityId: 'act3',
    status: QrSessionStatus.Closed,
    code: 'QR-SPT002',
    expiresAt: new Date(Date.now() - 86400000).toISOString(),
    createdById: 'admin1',
    checkInMemberIds: ['m2', 'm3', 'm5'],
    festivalYear: year,
    createdAt: ts,
    updatedAt: ts,
  },
];

export { AttendanceSessionType, AttendanceStatus };
