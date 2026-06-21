import { ATTENDANCE_SCORING } from '../scoring';
import type { AttendanceRecord, AttendanceStreak, AttendanceSummary } from './entity';
import { AttendanceStatus } from './enums';

export function isPresent(status: AttendanceStatus): boolean {
  return status === AttendanceStatus.Present || status === AttendanceStatus.Late;
}

export function summarizeAttendance(
  records: readonly AttendanceRecord[],
): AttendanceSummary {
  const memberId = records[0]?.memberId ?? '';
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

  const totalSessions = records.length;
  const attendanceRate =
    totalSessions === 0 ? 0 : Math.round((presentCount / totalSessions) * 100);

  return {
    memberId,
    totalSessions,
    presentCount,
    absentCount,
    excusedCount,
    lateCount,
    attendanceRate,
  };
}

export function hasPerfectWeek(records: readonly AttendanceRecord[]): boolean {
  const summary = summarizeAttendance(records);
  return (
    summary.presentCount >= ATTENDANCE_SCORING.PERFECT_WEEK_MIN_SESSIONS &&
    summary.absentCount === 0
  );
}

export function calculateAttendanceStreak(
  records: readonly AttendanceRecord[],
): AttendanceStreak {
  const memberId = records[0]?.memberId ?? '';
  const sorted = [...records].sort(
    (a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime(),
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let running = 0;

  for (const record of sorted) {
    if (isPresent(record.status)) {
      running++;
      longestStreak = Math.max(longestStreak, running);
    } else if (record.status !== AttendanceStatus.Excused) {
      running = 0;
    }
  }

  for (const record of sorted) {
    if (isPresent(record.status)) {
      currentStreak++;
    } else if (record.status !== AttendanceStatus.Excused) {
      break;
    }
  }

  return { memberId, currentStreak, longestStreak };
}

export function filterAttendanceByMember(
  records: readonly AttendanceRecord[],
  memberId: string,
): AttendanceRecord[] {
  return records.filter((record) => record.memberId === memberId);
}

export function filterAttendanceByTeam(
  records: readonly AttendanceRecord[],
  teamId: string,
): AttendanceRecord[] {
  return records.filter((record) => record.teamId === teamId);
}
