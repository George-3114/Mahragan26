import type { EntityId, FestivalScopedEntity, Timestamp } from '../common';
import type { AttendanceSessionType } from '../attendance/enums';
import { QrSessionStatus } from './enums';

export interface QrAttendanceSession extends FestivalScopedEntity {
  readonly title: string;
  readonly sessionType: AttendanceSessionType;
  readonly activityId?: EntityId;
  readonly status: QrSessionStatus;
  readonly code: string;
  readonly expiresAt: Timestamp;
  readonly createdById: EntityId;
  readonly checkInMemberIds: readonly EntityId[];
}

export interface QrSessionFilter {
  readonly festivalYear?: string;
  readonly status?: QrSessionStatus;
  readonly sessionType?: AttendanceSessionType;
}

export interface CreateQrSessionInput {
  readonly title: string;
  readonly sessionType: AttendanceSessionType;
  readonly activityId?: EntityId;
  readonly createdById: EntityId;
  readonly expiresAt: Timestamp;
  readonly festivalYear: string;
}
