import { FormEvent, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdminActions, useAdminAttendance, useAdminMembers } from '../../hooks';
import { AttendanceSessionType, AttendanceStatus } from '../../application/admin/adminService';
import {
  AdminCard,
  AdminEmptyState,
  AdminFormField,
  AdminInput,
  AdminListRow,
  AdminMessage,
  AdminPageHeader,
  AdminSelect,
  AdminSubmitButton,
  AdminBadge,
} from './components';
import { formatDate, formatEnumLabel } from './adminUtils';

function AttendanceManagementPage() {
  const { user } = useAuth();
  const admin = useAdminActions()();

  const membersResult = useAdminMembers();
  const attendanceResult = useAdminAttendance();

  console.log('MEMBERS =', membersResult);
  console.log('ATTENDANCE =', attendanceResult);

  const members = Array.isArray(membersResult?.data)
    ? membersResult.data
    : [];

  const records = Array.isArray(attendanceResult?.data)
    ? attendanceResult.data
    : [];

  const [memberId, setMemberId] = useState('');
  const [sessionType, setSessionType] = useState<AttendanceSessionType>(
    AttendanceSessionType.Liturgy
  );
  const [status, setStatus] = useState<AttendanceStatus>(
    AttendanceStatus.Present
  );
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const memberMap = useMemo(
    () => new Map(members.map((m) => [m.id, m])),
    [members]
  );

  const sortedRecords = useMemo(
    () =>
      [...records].sort(
        (a, b) =>
          new Date(b.sessionDate).getTime() -
          new Date(a.sessionDate).getTime()
      ),
    [records]
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!user || !memberId) return;

    const member = members.find((m) => m.id === memberId);

    if (!member) return;

    setSubmitting(true);
    setMessage(null);

    try {
      await admin.recordAttendanceEntry({
        memberId: member.id,
        userId: member.userId,
        teamId: member.teamId,
        sessionType,
        status,
        recordedById: user.id,
        notes: notes || undefined,
      });

      setMessage({
        type: 'success',
        text: `Attendance recorded for ${member.displayName}.`,
      });

      setNotes('');
    } catch (err) {
      setMessage({
        type: 'error',
        text:
          err instanceof Error
            ? err.message
            : 'Failed to record attendance.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Attendance Management"
        description="Record and review participant attendance sessions."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <AdminCard title="Record Attendance" delay={0.1}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminFormField label="Participant">
              <AdminSelect
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                required
              >
                <option value="">Select participant...</option>

                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.displayName}
                  </option>
                ))}
              </AdminSelect>
            </AdminFormField>

            <AdminFormField label="Session Type">
              <AdminSelect
                value={sessionType}
                onChange={(e) =>
                  setSessionType(e.target.value as AttendanceSessionType)
                }
              >
                {Object.values(AttendanceSessionType).map((type) => (
                  <option key={type} value={type}>
                    {formatEnumLabel(type)}
                  </option>
                ))}
              </AdminSelect>
            </AdminFormField>

            <AdminFormField label="Status">
              <AdminSelect
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as AttendanceStatus)
                }
              >
                {Object.values(AttendanceStatus).map((s) => (
                  <option key={s} value={s}>
                    {formatEnumLabel(s)}
                  </option>
                ))}
              </AdminSelect>
            </AdminFormField>

            <AdminFormField label="Notes (optional)">
              <AdminInput
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes"
              />
            </AdminFormField>

            {message && (
              <AdminMessage type={message.type}>
                {message.text}
              </AdminMessage>
            )}

            <AdminSubmitButton
              disabled={submitting || !memberId}
            >
              {submitting ? 'Recording...' : 'Record Attendance'}
            </AdminSubmitButton>
          </form>
        </AdminCard>

        <AdminCard
          title={`Recent Records (${sortedRecords.length})`}
          delay={0.15}
        >
          {sortedRecords.length === 0 ? (
            <AdminEmptyState message="No attendance records yet." />
          ) : (
            sortedRecords.slice(0, 20).map((record) => {
              const member = memberMap.get(record.memberId);

              return (
                <AdminListRow key={record.id}>
                  <div>
                    <div className="font-medium text-gray-800">
                      {member?.displayName ?? record.memberId}
                    </div>

                    <div className="text-sm text-gray-500">
                      {formatDate(record.sessionDate)}
                    </div>
                  </div>

                  <div className="text-right">
                    <AdminBadge>
                      {formatEnumLabel(record.sessionType)}
                    </AdminBadge>

                    <div className="mt-1">
                      <AdminBadge
                        variant={
                          record.status === AttendanceStatus.Present
                            ? 'success'
                            : 'warning'
                        }
                      >
                        {formatEnumLabel(record.status)}
                      </AdminBadge>
                    </div>
                  </div>
                </AdminListRow>
              );
            })
          )}
        </AdminCard>
      </div>
    </div>
  );
}

export default AttendanceManagementPage;