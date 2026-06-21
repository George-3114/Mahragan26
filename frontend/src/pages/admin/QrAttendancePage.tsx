import { FormEvent, useMemo, useState } from 'react';
import { QrCode } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdminActions, useAdminMembers, useAdminQrSessions } from '../../hooks';
import { AttendanceSessionType } from '../../application/admin/adminService';
import { QrSessionStatus } from '../../domain';
import {
  AdminBadge,
  AdminCard,
  AdminEmptyState,
  AdminFormField,
  AdminInput,
  AdminListRow,
  AdminMessage,
  AdminPageHeader,
  AdminSecondaryButton,
  AdminSelect,
  AdminSubmitButton,
} from './components';
import { formatDate, formatEnumLabel } from './adminUtils';

function QrAttendancePage() {
  const { user } = useAuth();
  const admin = useAdminActions()();

  const sessionsResult = useAdminQrSessions();
  const membersResult = useAdminMembers();

  const sessions = Array.isArray(sessionsResult?.data)
    ? sessionsResult.data
    : [];

  const members = Array.isArray(membersResult?.data)
    ? membersResult.data
    : [];

  const [title, setTitle] = useState('');
  const [sessionType, setSessionType] =
    useState<AttendanceSessionType>(
      AttendanceSessionType.Liturgy
    );

  const [durationMinutes, setDurationMinutes] =
    useState('60');

  const [checkInSessionId, setCheckInSessionId] =
    useState('');

  const [checkInMemberId, setCheckInMemberId] =
    useState('');

  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const sortedSessions = useMemo(
    () =>
      [...sessions].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      ),
    [sessions]
  );

  const activeSessions = sortedSessions.filter(
    (s) => s.status === QrSessionStatus.Active
  );

  async function handleCreate(e: FormEvent) {
    e.preventDefault();

    if (!user || !title.trim()) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const session =
        await admin.qrSessions.createSession({
          title: title.trim(),
          sessionType,
          createdById: user.id,
          durationMinutes:
            parseInt(durationMinutes, 10) || 60,
        });

      setMessage({
        type: 'success',
        text: `Session created with code ${session.code}.`,
      });

      setTitle('');
    } catch (err) {
      setMessage({
        type: 'error',
        text:
          err instanceof Error
            ? err.message
            : 'Failed to create session.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCheckIn(e: FormEvent) {
    e.preventDefault();

    if (
      !user ||
      !checkInSessionId ||
      !checkInMemberId
    )
      return;

    setSubmitting(true);
    setMessage(null);

    try {
      await admin.qrSessions.checkInMember(
        checkInSessionId,
        checkInMemberId,
        user.id
      );

      const member = members.find(
        (m) => m.id === checkInMemberId
      );

      setMessage({
        type: 'success',
        text: `${
          member?.displayName ?? 'Member'
        } checked in successfully.`,
      });

      setCheckInMemberId('');
    } catch (err) {
      setMessage({
        type: 'error',
        text:
          err instanceof Error
            ? err.message
            : 'Check-in failed.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleClose(
    sessionId: string
  ) {
    await admin.qrSessions.closeSession(
      sessionId
    );

    setMessage({
      type: 'success',
      text: 'Session closed.',
    });
  }

  function statusVariant(
    status: QrSessionStatus
  ) {
    if (status === QrSessionStatus.Active)
      return 'success' as const;

    if (status === QrSessionStatus.Expired)
      return 'warning' as const;

    return 'default' as const;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="QR Attendance Sessions"
        description="Create QR check-in sessions and manage participant scans."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <AdminCard
          title="Create Session"
          delay={0.1}
        >
          <form
            onSubmit={handleCreate}
            className="space-y-4"
          >
            <AdminFormField label="Session Title">
              <AdminInput
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="e.g. Sunday Liturgy"
                required
              />
            </AdminFormField>

            <AdminFormField label="Session Type">
              <AdminSelect
                value={sessionType}
                onChange={(e) =>
                  setSessionType(
                    e.target.value as AttendanceSessionType
                  )
                }
              >
                {Object.values(
                  AttendanceSessionType
                ).map((type) => (
                  <option key={type} value={type}>
                    {formatEnumLabel(type)}
                  </option>
                ))}
              </AdminSelect>
            </AdminFormField>

            <AdminFormField label="Duration (minutes)">
              <AdminInput
                type="number"
                min={5}
                value={durationMinutes}
                onChange={(e) =>
                  setDurationMinutes(
                    e.target.value
                  )
                }
              />
            </AdminFormField>

            {message && (
              <AdminMessage type={message.type}>
                {message.text}
              </AdminMessage>
            )}

            <AdminSubmitButton disabled={submitting}>
              {submitting
                ? 'Creating...'
                : 'Create QR Session'}
            </AdminSubmitButton>
          </form>
        </AdminCard>

        <AdminCard
          title="Manual Check-in"
          delay={0.15}
        >
          <form
            onSubmit={handleCheckIn}
            className="space-y-4"
          >
            <AdminFormField label="Active Session">
              <AdminSelect
                value={checkInSessionId}
                onChange={(e) =>
                  setCheckInSessionId(
                    e.target.value
                  )
                }
                required
              >
                <option value="">
                  Select session...
                </option>

                {activeSessions.map((s) => (
                  <option
                    key={s.id}
                    value={s.id}
                  >
                    {s.title} ({s.code})
                  </option>
                ))}
              </AdminSelect>
            </AdminFormField>

            <AdminFormField label="Participant">
              <AdminSelect
                value={checkInMemberId}
                onChange={(e) =>
                  setCheckInMemberId(
                    e.target.value
                  )
                }
                required
              >
                <option value="">
                  Select participant...
                </option>

                {members.map((m) => (
                  <option
                    key={m.id}
                    value={m.id}
                  >
                    {m.displayName}
                  </option>
                ))}
              </AdminSelect>
            </AdminFormField>

            <AdminSubmitButton
              disabled={
                submitting ||
                !checkInSessionId ||
                !checkInMemberId
              }
            >
              {submitting
                ? 'Checking in...'
                : 'Check In'}
            </AdminSubmitButton>
          </form>
        </AdminCard>
      </div>

      <AdminCard
        title={`Sessions (${sortedSessions.length})`}
        delay={0.2}
      >
        {sortedSessions.length === 0 ? (
          <AdminEmptyState message="No QR sessions yet." />
        ) : (
          sortedSessions.map((session) => (
            <AdminListRow
              key={session.id}
              actions={
                session.status ===
                QrSessionStatus.Active ? (
                  <AdminSecondaryButton
                    onClick={() =>
                      handleClose(session.id)
                    }
                  >
                    Close
                  </AdminSecondaryButton>
                ) : undefined
              }
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                  <QrCode className="w-6 h-6 text-white" />
                </div>

                <div>
                  <div className="font-semibold text-gray-800">
                    {session.title}
                  </div>

                  <div className="text-sm text-gray-500">
                    Code:{' '}
                    <span className="font-mono font-medium text-purple-600">
                      {session.code}
                    </span>
                  </div>

                  <div className="text-sm text-gray-500">
                    Expires:{' '}
                    {formatDate(
                      session.expiresAt
                    )}{' '}
                    ·{' '}
                    {
                      session.checkInMemberIds
                        .length
                    }{' '}
                    check-ins
                  </div>
                </div>
              </div>

              <div className="text-right">
                <AdminBadge
                  variant={statusVariant(
                    session.status
                  )}
                >
                  {formatEnumLabel(
                    session.status
                  )}
                </AdminBadge>

                <div className="mt-1">
                  <AdminBadge>
                    {formatEnumLabel(
                      session.sessionType
                    )}
                  </AdminBadge>
                </div>
              </div>
            </AdminListRow>
          ))
        )}
      </AdminCard>
    </div>
  );
}

export default QrAttendancePage;