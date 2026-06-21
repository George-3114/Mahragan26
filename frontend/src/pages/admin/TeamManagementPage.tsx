import { FormEvent, useMemo, useState } from 'react';
import { TeamStatus } from '../../domain';
import { useAdminActions, useAdminTeams } from '../../hooks';
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

function TeamManagementPage() {
  const admin = useAdminActions()();
  const result = useAdminTeams();
  const teams = Array.isArray(result?.data) ? result.data : [];

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366F1');
  const [motto, setMotto] = useState('');
  const [status, setStatus] = useState<TeamStatus>(TeamStatus.Active);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const sortedTeams = useMemo(
    () => [...teams].sort((a, b) => b.totalPoints - a.totalPoints),
    [teams],
  );

  function startEdit(teamId: string) {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return;
    setEditingId(teamId);
    setName(team.name);
    setColor(team.color);
    setMotto(team.motto ?? '');
    setStatus(team.status);
    setMessage(null);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!editingId) return;

    setSubmitting(true);
    setMessage(null);

    try {
      await admin.updateTeam(editingId, { name, color, motto, status });
      setMessage({ type: 'success', text: 'Team updated successfully.' });
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
        title="Team Management"
        description="View and edit festival teams, members, and point totals."
      />

      {message && (
        <AdminMessage type={message.type}>{message.text}</AdminMessage>
      )}

      {editingId && (
        <AdminCard title="Edit Team" delay={0.05}>
          <form onSubmit={handleSave} className="space-y-4">
            <AdminFormField label="Team Name">
              <AdminInput value={name} onChange={(e) => setName(e.target.value)} required />
            </AdminFormField>
            <AdminFormField label="Color">
              <AdminInput type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </AdminFormField>
            <AdminFormField label="Motto">
              <AdminInput value={motto} onChange={(e) => setMotto(e.target.value)} />
            </AdminFormField>
            <AdminFormField label="Status">
              <AdminSelect value={status} onChange={(e) => setStatus(e.target.value as TeamStatus)}>
                {Object.values(TeamStatus).map((s) => (
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

      <AdminCard title={`Teams (${sortedTeams.length})`} delay={0.1}>
        {sortedTeams.length === 0 ? (
          <AdminEmptyState message="No teams found." />
        ) : (
          sortedTeams.map((team, index) => (
            <AdminListRow
              key={team.id}
              actions={
                <AdminSecondaryButton onClick={() => startEdit(team.id)}>
                  Edit
                </AdminSecondaryButton>
              }
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: team.color }}
                >
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{team.name}</div>
                  <div className="text-sm text-gray-500">{team.motto ?? 'No motto'}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-800">{team.totalPoints.toLocaleString()} pts</div>
                <div className="text-sm text-gray-500">{team.memberCount} members</div>
                <AdminBadge>{formatEnumLabel(team.status)}</AdminBadge>
              </div>
            </AdminListRow>
          ))
        )}
      </AdminCard>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTeams.map((team, index) => (
          <AdminCard key={team.id} delay={0.15 + index * 0.05}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: team.color }} />
              <h3 className="font-bold text-gray-800">{team.name}</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(team.categoryPoints).map(([key, value]) => (
                <div key={key} className="flex justify-between bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-gray-500 capitalize">{key}</span>
                  <span className="font-medium text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}

export default TeamManagementPage;
