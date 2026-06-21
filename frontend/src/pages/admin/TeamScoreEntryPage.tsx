import { FormEvent, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdminActions, useAdminTeamScores, useAdminTeams } from '../../hooks';
import { TeamScoreCategory, getCategoryLabel } from '../../domain';
import {
  AdminBadge,
  AdminCard,
  AdminEmptyState,
  AdminFormField,
  AdminInput,
  AdminListRow,
  AdminMessage,
  AdminPageHeader,
  AdminSelect,
  AdminSubmitButton,
} from './components';
import { formatDate } from './adminUtils';

function TeamScoreEntryPage() {
  const { user } = useAuth();
  const admin = useAdminActions()();

  const teamsResult = useAdminTeams();
  const scoresResult = useAdminTeamScores();

  console.log('TEAMS =', teamsResult);
  console.log('TEAM SCORES =', scoresResult);

  const teams = Array.isArray(teamsResult?.data)
    ? teamsResult.data
    : [];

  const scores = Array.isArray(scoresResult?.data)
    ? scoresResult.data
    : [];

  const [teamId, setTeamId] = useState('');
  const [category, setCategory] = useState<TeamScoreCategory>(
    TeamScoreCategory.Quiz
  );
  const [points, setPoints] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const teamMap = useMemo(
    () => new Map(teams.map((t) => [t.id, t])),
    [teams]
  );

  const sortedScores = useMemo(
    () =>
      [...scores].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      ),
    [scores]
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!user || !teamId) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const score = await admin.addTeamScore(
        teamId,
        category,
        user.id,
        points ? parseInt(points, 10) : undefined,
        description || undefined
      );

      const team = teamMap.get(teamId);

      setMessage({
        type: 'success',
        text: `+${score.points} points awarded to ${
          team?.name ?? 'team'
        }.`,
      });

      setPoints('');
      setDescription('');
    } catch (err) {
      setMessage({
        type: 'error',
        text:
          err instanceof Error
            ? err.message
            : 'Failed to add score.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Team Score Entry"
        description="Award points to teams by category."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <AdminCard title="Award Team Score" delay={0.1}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminFormField label="Team">
              <AdminSelect
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                required
              >
                <option value="">Select team...</option>

                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </AdminSelect>
            </AdminFormField>

            <AdminFormField label="Category">
              <AdminSelect
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as TeamScoreCategory
                  )
                }
              >
                {Object.values(TeamScoreCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {getCategoryLabel(cat)}
                  </option>
                ))}
              </AdminSelect>
            </AdminFormField>

            <AdminFormField label="Points (optional)">
              <AdminInput
                type="number"
                min={0}
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="Default points for category"
              />
            </AdminFormField>

            <AdminFormField label="Description (optional)">
              <AdminInput
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Reason for award"
              />
            </AdminFormField>

            {message && (
              <AdminMessage type={message.type}>
                {message.text}
              </AdminMessage>
            )}

            <AdminSubmitButton
              disabled={submitting || !teamId}
            >
              {submitting ? 'Saving...' : 'Award Score'}
            </AdminSubmitButton>
          </form>
        </AdminCard>

        <AdminCard
          title={`Recent Team Scores (${sortedScores.length})`}
          delay={0.15}
        >
          {sortedScores.length === 0 ? (
            <AdminEmptyState message="No team scores recorded yet." />
          ) : (
            sortedScores.slice(0, 15).map((score) => {
              const team = teamMap.get(score.teamId);

              return (
                <AdminListRow key={score.id}>
                  <div>
                    <div className="font-medium text-gray-800">
                      {team?.name ?? score.teamId}
                    </div>

                    <div className="text-sm text-gray-500">
                      {getCategoryLabel(score.category)}
                    </div>

                    <div className="text-xs text-gray-400">
                      {formatDate(score.createdAt)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-bold ${
                        score.isPenalty
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      {score.isPenalty ? '-' : '+'}
                      {score.points}
                    </div>

                    {score.isPenalty && (
                      <AdminBadge variant="danger">
                        Penalty
                      </AdminBadge>
                    )}
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

export default TeamScoreEntryPage;