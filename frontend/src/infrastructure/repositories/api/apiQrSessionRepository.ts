import {
  AttendanceSessionType,
  FESTIVAL,
  QrSessionStatus,
  buildPaginatedResult,
  normalizePagination,
  type CreateInput,
  type PaginatedResult,
  type PaginationParams,
  type QrAttendanceSession,
  type QrSessionFilter,
  type UpdateInput,
} from '../../../domain';
import type { QrSessionRepositoryPort } from '../../../domain/ports';

const API_BASE = 'http://localhost:5001/api/qr-sessions';

interface BackendQrSession {
  _id: string;
  title: string;
  sessionType: string;
  code: string;
  expiresAt: string;
  isActive: boolean;
  duration?: number;
  createdAt: string;
  updatedAt: string;
}

function mapSessionType(value: string): AttendanceSessionType {
  if (value === AttendanceSessionType.Liturgy) return AttendanceSessionType.Liturgy;
  if (value === AttendanceSessionType.Activity || value === 'competition') {
    return AttendanceSessionType.Activity;
  }
  return AttendanceSessionType.General;
}

function toBackendSessionType(value: AttendanceSessionType): string {
  if (value === AttendanceSessionType.Liturgy) return 'liturgy';
  if (value === AttendanceSessionType.Activity) return 'activity';
  return 'meeting';
}

function mapStatus(isActive: boolean): QrSessionStatus {
  return isActive ? QrSessionStatus.Active : QrSessionStatus.Closed;
}

function mapQrSession(item: BackendQrSession): QrAttendanceSession {
  return {
    id: item._id,
    title: item.title,
    sessionType: mapSessionType(item.sessionType),
    status: mapStatus(item.isActive),
    code: item.code,
    expiresAt: item.expiresAt,
    createdById: '',
    checkInMemberIds: [],
    festivalYear: FESTIVAL.CURRENT_YEAR,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function toCreatePayload(data: CreateInput<QrAttendanceSession>): Record<string, unknown> {
  const expiresAt = new Date(data.expiresAt).getTime();
  const durationMinutes = Math.max(1, Math.round((expiresAt - Date.now()) / 60000));

  return {
    title: data.title,
    sessionType: toBackendSessionType(data.sessionType),
    duration: durationMinutes,
  };
}

function toUpdatePayload(data: UpdateInput<QrAttendanceSession>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (data.title !== undefined) payload.title = data.title;
  if (data.sessionType !== undefined) payload.sessionType = toBackendSessionType(data.sessionType);
  if (data.status !== undefined) {
    payload.isActive = data.status === QrSessionStatus.Active;
  }

  return payload;
}

async function fetchSessions(): Promise<BackendQrSession[]> {
  const response = await fetch(API_BASE);
  const result = await response.json();
  return result.data ?? [];
}

export class ApiQrSessionRepository implements QrSessionRepositoryPort {
  async findAll(filter?: QrSessionFilter): Promise<QrAttendanceSession[]> {
    const sessions = (await fetchSessions()).map(mapQrSession);
    return this.applyFilter(sessions, filter);
  }

  async findById(id: string): Promise<QrAttendanceSession | null> {
    const sessions = await this.findAll();
    return sessions.find((session) => session.id === id) ?? null;
  }

  async findMany(
    filter?: QrSessionFilter,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<QrAttendanceSession>> {
    const params = normalizePagination(pagination);
    const filtered = await this.findAll(filter);
    const start = (params.page - 1) * params.limit;
    const pageItems = filtered.slice(start, start + params.limit);
    return buildPaginatedResult(pageItems, filtered.length, params);
  }

  async create(data: CreateInput<QrAttendanceSession>): Promise<QrAttendanceSession> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toCreatePayload(data)),
    });
    const result = await response.json();
    return mapQrSession(result.data);
  }

  async update(id: string, data: UpdateInput<QrAttendanceSession>): Promise<QrAttendanceSession | null> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toUpdatePayload(data)),
    });
    const result = await response.json();
    if (!result.data) return null;
    return mapQrSession(result.data);
  }

  async delete(id: string): Promise<boolean> {
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    return true;
  }

  async count(filter?: QrSessionFilter): Promise<number> {
    const sessions = await this.findAll(filter);
    return sessions.length;
  }

  private applyFilter(
    items: QrAttendanceSession[],
    filter?: QrSessionFilter,
  ): QrAttendanceSession[] {
    if (!filter) return items;

    return items.filter((session) => {
      if (filter.festivalYear && session.festivalYear !== filter.festivalYear) return false;
      if (filter.status && session.status !== filter.status) return false;
      if (filter.sessionType && session.sessionType !== filter.sessionType) return false;
      return true;
    });
  }
}
