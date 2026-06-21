import {
  AttendanceSessionType,
  AttendanceStatus,
  FESTIVAL,
  IndividualScoreCategory,
} from '../../domain';
import type { AttendanceRecord } from '../../domain';
import type { ApplicationContext } from '../context';
import type { ScoreService } from './scoreService';

export interface RecordAttendanceInput {
  memberId: string;
  userId: string;
  teamId: string;
  sessionType: AttendanceSessionType;
  status: AttendanceStatus;
  activityId?: string;
  recordedById: string;
  notes?: string;
}

export class AttendanceService {
  constructor(
    private readonly ctx: ApplicationContext,
    private readonly scoreService: ScoreService,
  ) {}

  async getByMember(memberId: string): Promise<AttendanceRecord[]> {
    return this.ctx.repositories.attendance.findByMemberId(memberId);
  }

  async recordAttendance(input: RecordAttendanceInput): Promise<AttendanceRecord> {
    const record = await this.ctx.repositories.attendance.create({
      memberId: input.memberId,
      userId: input.userId,
      teamId: input.teamId,
      sessionType: input.sessionType,
      activityId: input.activityId,
      status: input.status,
      sessionDate: new Date().toISOString(),
      recordedById: input.recordedById,
      notes: input.notes,
      festivalYear: FESTIVAL.CURRENT_YEAR,
    });

    if (
      input.status === AttendanceStatus.Present &&
      input.sessionType === AttendanceSessionType.Liturgy
    ) {
      await this.scoreService.awardCategoryScore(
        input.memberId,
        input.userId,
        input.teamId,
        IndividualScoreCategory.LiturgyAttendance,
        input.recordedById,
        undefined,
        'Liturgy attendance recorded',
        input.activityId,
      );
    }

    this.ctx.notifyChange();
    return record;
  }

  async recordConfession(
    memberId: string,
    userId: string,
    teamId: string,
    recordedById: string,
  ): Promise<void> {
    await this.scoreService.awardCategoryScore(
      memberId,
      userId,
      teamId,
      IndividualScoreCategory.Confession,
      recordedById,
      undefined,
      'Confession recorded',
    );
    this.ctx.notifyChange();
  }
}

export { AttendanceSessionType, AttendanceStatus };
