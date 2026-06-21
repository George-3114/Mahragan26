import { FormEvent, useMemo, useState } from 'react';
import { Grade, TeamMemberStatus } from '../../domain';
import { useAdminActions, useAdminMembers, useAdminTeams } from '../../hooks';
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
import { formatEnumLabel } from './adminUtils';

function IndividualManagementPage() {
  const admin = useAdminActions()();
  const membersResult = useAdminMembers();
  const teamsResult = useAdminTeams();

  const members = Array.isArray(membersResult?.data) ? membersResult.data : [];
  const teams = Array.isArray(teamsResult?.data) ? teamsResult.data : [];

  const [teamFilter, setTeamFilter] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [grade, setGrade] = useState<Grade>(Grade.Grade5);
  const [status, setStatus] = useState<TeamMemberStatus>(TeamMemberStatus.Active);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const teamMap = useMemo(() => new Map(teams.map((t) => [t.id, t])), [teams]);

  const filtered = useMemo(() => {
    const list = [...members].sort((a, b) => b.totalPoints - a.totalPoints);
    if (teamFilter === 'all') return list;
    return list.filter((m) => m.teamId === teamFilter);
  }, [members, teamFilter]);

  function startEdit(memberId: string) {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;
    setEditingId(memberId);
    setDisplayName(member.displayName);
    setTeamId(member.teamId);
    setGrade(member.grade);
    setStatus(member.status);
    setMessage(null);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!editingId) return;

    setSubmitting(true);
    setMessage(null);

    try {
      await admin.updateMember(editingId, { displayName, teamId, grade, status });
      setMessage({ type: 'success', text: 'Participant updated successfully.' });
      setEditingId(null);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Update failed.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Individual Management"
        description="Browse and manage festival participants."
        action={
          <AdminSelect
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="w-48"
          >
            <option value="all">All Teams</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </AdminSelect>
        }
      />

      {message && (
        <AdminMessage type={message.type}>{message.text}</AdminMessage>
      )}

      {editingId && (
        <AdminCard title="Edit Participant" delay={0.05}>
          <form onSubmit={handleSave} className="space-y-4">
            <AdminFormField label="Display Name">
              <AdminInput value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
            </AdminFormField>
            <AdminFormField label="Team">
              <AdminSelect value={teamId} onChange={(e) => setTeamId(e.target.value)} required>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </AdminSelect>
            </AdminFormField>
            <AdminFormField label="Grade">
              <AdminSelect value={grade} onChange={(e) => setGrade(e.target.value as Grade)}>
                {Object.values(Grade).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </AdminSelect>
            </AdminFormField>
            <AdminFormField label="Status">
              <AdminSelect value={status} onChange={(e) => setStatus(e.target.value as TeamMemberStatus)}>
                {Object.values(TeamMemberStatus).map((s) => (
                  <option key={s} value={s}>{formatEnumLabel(s)}</option>
                ))}
              </AdminSelect>
            </AdminFormField>
            <div className="flex gap-2">
              <AdminSubmitButton disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Changes'}
              </AdminSubmitButton>
              <AdminSecondaryButton type="button" onClick={() => setEditingId(null)}>
                Cancel
              </AdminSecondaryButton>
            </div>
          </form>
        </AdminCard>
      )}

      <AdminCard title={`Participants (${filtered.length})`} delay={0.1}>
        {filtered.length === 0 ? (
          <AdminEmptyState message="No participants found." />
        ) : (
          filtered.map((member, index) => {
            const team = teamMap.get(member.teamId);
            return (
              <AdminListRow
                key={member.id}
                actions={
                  <AdminSecondaryButton onClick={() => startEdit(member.id)}>
                    Edit
                  </AdminSecondaryButton>
                }
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{member.displayName}</div>
                    <div className="text-sm text-gray-500">
                      {member.grade} · {team?.name ?? 'Unknown team'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">{member.totalPoints} pts</div>
                  <div className="flex gap-1 justify-end mt-1">
                    <AdminBadge>{formatEnumLabel(member.role)}</AdminBadge>
                    <AdminBadge variant="success">{formatEnumLabel(member.status)}</AdminBadge>
                  </div>
                </div>
              </AdminListRow>
            );
          })
        )}
      </AdminCard>
    </div>
  );
}

export default IndividualManagementPage;
