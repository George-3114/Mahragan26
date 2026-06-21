import {
  AttendanceSessionType,
  FESTIVAL,
  QrSessionStatus,
  type QrAttendanceSession,
} from '../../domain';
import type { ApplicationContext } from '../context';
import type { AttendanceService } from './attendanceService';
import { AttendanceStatus } from '../../domain';

export interface CreateQrSessionParams {
  title: string;
  sessionType: AttendanceSessionType;
  activityId?: string;
  createdById: string;
  durationMinutes?: number;
}

function generateSessionCode(): string {
  return `QR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export class QrSessionService {
  constructor(
    private readonly ctx: ApplicationContext,
    private readonly attendance: AttendanceService,
  ) {}

  async getAll(): Promise<QrAttendanceSession[]> {
    return this.ctx.repositories.qrSessions.findAll({ festivalYear: FESTIVAL.CURRENT_YEAR });
  }

  async getById(id: string): Promise<QrAttendanceSession | null> {
    return this.ctx.repositories.qrSessions.findById(id);
  }

  async createSession(params: CreateQrSessionParams): Promise<QrAttendanceSession> {
    const expiresAt = new Date(
      Date.now() + (params.durationMinutes ?? 60) * 60 * 1000,
    ).toISOString();

    const session = await this.ctx.repositories.qrSessions.create({
      title: params.title,
      sessionType: params.sessionType,
      activityId: params.activityId,
      status: QrSessionStatus.Active,
      code: generateSessionCode(),
      expiresAt,
      createdById: params.createdById,
      checkInMemberIds: [],
      festivalYear: FESTIVAL.CURRENT_YEAR,
    });

    this.ctx.activityLog.add(`QR session "${session.title}" created`);
    this.ctx.notifyChange();
    return session;
  }

  async closeSession(id: string): Promise<QrAttendanceSession | null> {
    const session = await this.ctx.repositories.qrSessions.update(id, {
      status: QrSessionStatus.Closed,
    });
    if (session) {
      this.ctx.activityLog.add(`QR session "${session.title}" closed`);
      this.ctx.notifyChange();
    }
    return session;
  }

  async findActiveSessionByCode(code: string): Promise<QrAttendanceSession | null> {
    const normalized = code.trim().toUpperCase();
    const sessions = await this.getAll();
    return (
      sessions.find(
        (s) =>
          s.code.toUpperCase() === normalized &&
          s.status === QrSessionStatus.Active &&
          new Date(s.expiresAt) >= new Date(),
      ) ?? null
    );
  }

  async checkInByCode(
    code: string,
    memberId: string,
    recordedById: string,
  ): Promise<QrAttendanceSession | null> {
    const session = await this.findActiveSessionByCode(code);
    if (!session) {
      throw new Error('Invalid or expired QR code');
    }
    return this.checkInMember(session.id, memberId, recordedById);
  }

  async checkInMember(
    sessionId: string,
    memberId: string,
    recordedById: string,
  ): Promise<QrAttendanceSession | null> {
    const session = await this.ctx.repositories.qrSessions.findById(sessionId);
    if (!session || session.status !== QrSessionStatus.Active) {
      throw new Error('QR session is not active');
    }

    if (new Date(session.expiresAt) < new Date()) {
      await this.ctx.repositories.qrSessions.update(sessionId, {
        status: QrSessionStatus.Expired,
      });
      throw new Error('QR session has expired');
    }

    if (session.checkInMemberIds.includes(memberId)) {
      throw new Error('Member already checked in');
    }

    const member = await this.ctx.repositories.teamMembers.findById(memberId);
    if (!member) {
      throw new Error('Member not found');
    }

    await this.attendance.recordAttendance({
      memberId: member.id,
      userId: member.userId,
      teamId: member.teamId,
      sessionType: session.sessionType,
      status: AttendanceStatus.Present,
      activityId: session.activityId,
      recordedById,
      notes: `QR check-in: ${session.code}`,
    });

    const updated = await this.ctx.repositories.qrSessions.update(sessionId, {
      checkInMemberIds: [...session.checkInMemberIds, memberId],
    });

    if (updated) {
      this.ctx.activityLog.add(
        `${member.displayName} checked in via QR (${session.code})`,
      );
      this.ctx.notifyChange();
    }

    return updated;
  }
}

export { QrSessionStatus, AttendanceSessionType };
