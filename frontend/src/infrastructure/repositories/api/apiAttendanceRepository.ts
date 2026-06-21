import {
  AttendanceSessionType,
  AttendanceStatus,
  FESTIVAL,
  buildPaginatedResult,
  normalizePagination,
  type AttendanceFilter,
  type AttendanceRecord,
  type CreateInput,
  type PaginatedResult,
  type PaginationParams,
  type UpdateInput,
} from '../../../domain';
import type { AttendanceRepositoryPort } from '../../../domain/ports';

const API_BASE = 'http://localhost:5001/api/attendance';

interface BackendParticipant {
  _id: string;
  fullName?: string;
}

interface BackendAttendance {
  _id: string;
  participant: string | BackendParticipant;
  sessionType: string;
  status: string;
  notes?: string;
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

function resolveParticipantId(participant: BackendAttendance['participant']): string {
  if (typeof participant === 'string') return participant;
  return participant._id;
}

function mapAttendance(item: BackendAttendance): AttendanceRecord {
  const memberId = resolveParticipantId(item.participant);

  return {
    id: item._id,
    memberId,
    userId: memberId,
    teamId: '',
    sessionType: mapSessionType(item.sessionType),
    status: item.status as AttendanceStatus,
    sessionDate: item.createdAt,
    recordedById: '',
    notes: item.notes,
    festivalYear: FESTIVAL.CURRENT_YEAR,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function toCreatePayload(data: CreateInput<AttendanceRecord>): Record<string, unknown> {
  return {
    participant: data.memberId,
    sessionType: toBackendSessionType(data.sessionType),
    status: data.status,
    notes: data.notes ?? '',
  };
}

function toUpdatePayload(data: UpdateInput<AttendanceRecord>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (data.memberId !== undefined) payload.participant = data.memberId;
  if (data.sessionType !== undefined) payload.sessionType = toBackendSessionType(data.sessionType);
  if (data.status !== undefined) payload.status = data.status;
  if (data.notes !== undefined) payload.notes = data.notes;

  return payload;
}

async function fetchAttendance(): Promise<BackendAttendance[]> {
  const response = await fetch(API_BASE);
  const result = await response.json();
  return result.data ?? [];
}

export class ApiAttendanceRepository implements AttendanceRepositoryPort {
  async findAll(filter?: AttendanceFilter): Promise<AttendanceRecord[]> {
    const records = (await fetchAttendance()).map(mapAttendance);
    return this.applyFilter(records, filter);
  }

  async findById(id: string): Promise<AttendanceRecord | null> {
    const records = await this.findAll();
    return records.find((record) => record.id === id) ?? null;
  }

  async findMany(
    filter?: AttendanceFilter,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<AttendanceRecord>> {
    const params = normalizePagination(pagination);
    const filtered = await this.findAll(filter);
    const start = (params.page - 1) * params.limit;
    const pageItems = filtered.slice(start, start + params.limit);
    return buildPaginatedResult(pageItems, filtered.length, params);
  }

  async create(data: CreateInput<AttendanceRecord>): Promise<AttendanceRecord> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toCreatePayload(data)),
    });
    const result = await response.json();
    return mapAttendance(result.data);
  }

  async update(id: string, data: UpdateInput<AttendanceRecord>): Promise<AttendanceRecord | null> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toUpdatePayload(data)),
    });
    const result = await response.json();
    if (!result.data) return null;
    return mapAttendance(result.data);
  }

  async delete(id: string): Promise<boolean> {
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    return true;
  }

  async count(filter?: AttendanceFilter): Promise<number> {
    const records = await this.findAll(filter);
    return records.length;
  }

  async findByMemberId(memberId: string): Promise<AttendanceRecord[]> {
    return this.findAll({ memberId });
  }

  private applyFilter(items: AttendanceRecord[], filter?: AttendanceFilter): AttendanceRecord[] {
    if (!filter) return items;

    return items.filter((record) => {
      if (filter.festivalYear && record.festivalYear !== filter.festivalYear) return false;
      if (filter.memberId && record.memberId !== filter.memberId) return false;
      if (filter.teamId && record.teamId !== filter.teamId) return false;
      if (filter.activityId && record.activityId !== filter.activityId) return false;
      if (filter.sessionType && record.sessionType !== filter.sessionType) return false;
      if (filter.status && record.status !== filter.status) return false;
      return true;
    });
  }
}
