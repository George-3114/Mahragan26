import type { EntityId, FestivalScopedEntity, Timestamp } from '../common';
import { AttendanceSessionType, AttendanceStatus } from './enums';

export interface AttendanceRecord extends FestivalScopedEntity {
  readonly memberId: EntityId;
  readonly userId: EntityId;
  readonly teamId: EntityId;
  readonly sessionType: AttendanceSessionType;
  readonly activityId?: EntityId;
  readonly status: AttendanceStatus;
  readonly sessionDate: Timestamp;
  readonly recordedById: EntityId;
  readonly notes?: string;
}

export interface AttendanceSummary {
  readonly memberId: EntityId;
  readonly totalSessions: number;
  readonly presentCount: number;
  readonly absentCount: number;
  readonly excusedCount: number;
  readonly lateCount: number;
  readonly attendanceRate: number;
}

export interface AttendanceFilter {
  readonly festivalYear?: string;
  readonly memberId?: EntityId;
  readonly teamId?: EntityId;
  readonly activityId?: EntityId;
  readonly sessionType?: AttendanceSessionType;
  readonly status?: AttendanceStatus;
  readonly fromDate?: Timestamp;
  readonly toDate?: Timestamp;
}

export interface AttendanceStreak {
  readonly memberId: EntityId;
  readonly currentStreak: number;
  readonly longestStreak: number;
}
