import { FormEvent, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  useAdminActions,
  useAdminIndividualScores,
  useAdminMembers,
  useAdminTeamScores,
  useAdminTeams,
} from '../../hooks';
import {
  PenaltyType,
  getCategoryLabel,
  getDefaultPoints,
} from '../../domain';
import {
  AdminBadge,
  AdminCard,
  AdminEmptyState,
  AdminFormField,
  AdminListRow,
  AdminMessage,
  AdminPageHeader,
  AdminSelect,
  AdminSubmitButton,
} from './components';
import { formatDate } from './adminUtils';

function PenaltyManagementPage() {
  const { user } = useAuth();
  const admin = useAdminActions()();

  const membersResult = useAdminMembers();
  const teamsResult = useAdminTeams();
  const individualScoresResult =
    useAdminIndividualScores();
  const teamScoresResult =
    useAdminTeamScores();

  console.log('MEMBERS', membersResult);
  console.log('TEAMS', teamsResult);
  console.log(
    'INDIVIDUAL SCORES',
    individualScoresResult
  );
  console.log('TEAM SCORES', teamScoresResult);

  const members = Array.isArray(
    membersResult?.data
  )
    ? membersResult.data
    : [];

  const teams = Array.isArray(teamsResult?.data)
    ? teamsResult.data
    : [];

  const individualScores = Array.isArray(
    individualScoresResult?.data
  )
    ? individualScoresResult.data
    : [];

  const teamScores = Array.isArray(
    teamScoresResult?.data
  )
    ? teamScoresResult.data
    : [];

  const [scope, setScope] = useState<
    'individual' | 'team'
  >('individual');

  const [targetId, setTargetId] = useState('');

  const [penaltyType, setPenaltyType] =
    useState<PenaltyType>(
      PenaltyType.NoiseSmall
    );

  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [submitting, setSubmitting] =
    useState(false);

  const memberMap = useMemo(
    () =>
      new Map(
        members.map((m) => [m.id, m])
      ),
    [members]
  );

  const teamMap = useMemo(
    () =>
      new Map(
        teams.map((t) => [t.id, t])
      ),
    [teams]
  );

  const recentPenalties = useMemo(() => {
    const individual = individualScores
      .filter((s) => s.isPenalty)
      .map((s) => ({
        ...s,
        scope: 'individual' as const,
        name:
          memberMap.get(s.memberId)
            ?.displayName ?? s.memberId,
      }));

    const team = teamScores
      .filter((s) => s.isPenalty)
      .map((s) => ({
        ...s,
        scope: 'team' as const,
        name:
          teamMap.get(s.teamId)?.name ??
          s.teamId,
      }));

    return [...individual, ...team]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 20);
  }, [
    individualScores,
    teamScores,
    memberMap,
    teamMap,
  ]);

  async function handleSubmit(
    e: FormEvent
  ) {
    e.preventDefault();

    if (!user || !targetId) return;

    setSubmitting(true);
    setMessage(null);

    try {
      if (scope === 'individual') {
        const member = members.find(
          (m) => m.id === targetId
        );

        if (!member)
          throw new Error(
            'Member not found'
          );

        const score =
          await admin.applyPenalty(
            'individual',
            member.id,
            penaltyType,
            user.id,
            member.userId,
            member.teamId
          );

        setMessage({
          type: 'success',
          text: `Penalty of ${score.points} points applied to ${member.displayName}.`,
        });
      } else {
        const team = teams.find(
          (t) => t.id === targetId
        );

        const score =
          await admin.applyPenalty(
            'team',
            targetId,
            penaltyType,
            user.id
          );

        setMessage({
          type: 'success',
          text: `Penalty of ${score.points} points applied to ${
            team?.name ?? 'team'
          }.`,
        });
      }

      setTargetId('');
    } catch (err) {
      setMessage({
        type: 'error',
        text:
          err instanceof Error
            ? err.message
            : 'Failed to apply penalty.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Penalty Management"
        description="Apply penalties to individuals or teams."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <AdminCard
          title="Apply Penalty"
          delay={0.1}
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <AdminFormField label="Scope">
              <AdminSelect
                value={scope}
                onChange={(e) => {
                  setScope(
                    e.target.value as
                      | 'individual'
                      | 'team'
                  );
                  setTargetId('');
                }}
              >
                <option value="individual">
                  Individual
                </option>
                <option value="team">
                  Team
                </option>
              </AdminSelect>
            </AdminFormField>

            <AdminFormField
              label={
                scope === 'individual'
                  ? 'Participant'
                  : 'Team'
              }
            >
              <AdminSelect
                value={targetId}
                onChange={(e) =>
                  setTargetId(
                    e.target.value
                  )
                }
                required
              >
                <option value="">
                  Select{' '}
                  {scope ===
                  'individual'
                    ? 'participant'
                    : 'team'}
                  ...
                </option>

                {scope === 'individual'
                  ? members.map((m) => (
                      <option
                        key={m.id}
                        value={m.id}
                      >
                        {m.displayName}
                      </option>
                    ))
                  : teams.map((t) => (
                      <option
                        key={t.id}
                        value={t.id}
                      >
                        {t.name}
                      </option>
                    ))}
              </AdminSelect>
            </AdminFormField>

            <AdminFormField label="Penalty Type">
              <AdminSelect
                value={penaltyType}
                onChange={(e) =>
                  setPenaltyType(
                    e.target
                      .value as PenaltyType
                  )
                }
              >
                {Object.values(
                  PenaltyType
                ).map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {getCategoryLabel(
                      type
                    )}{' '}
                    (-
                    {getDefaultPoints(
                      type
                    )}{' '}
                    pts)
                  </option>
                ))}
              </AdminSelect>
            </AdminFormField>

            {message && (
              <AdminMessage type={message.type}>
                {message.text}
              </AdminMessage>
            )}

            <AdminSubmitButton
              disabled={
                submitting || !targetId
              }
            >
              {submitting
                ? 'Applying...'
                : 'Apply Penalty'}
            </AdminSubmitButton>
          </form>
        </AdminCard>

        <AdminCard
          title={`Recent Penalties (${recentPenalties.length})`}
          delay={0.15}
        >
          {recentPenalties.length ===
          0 ? (
            <AdminEmptyState message="No penalties recorded yet." />
          ) : (
            recentPenalties.map(
              (penalty) => (
                <AdminListRow
                  key={`${penalty.scope}-${penalty.id}`}
                >
                  <div>
                    <div className="font-medium text-gray-800">
                      {penalty.name}
                    </div>

                    <div className="text-sm text-gray-500">
                      {getCategoryLabel(
                        penalty.category as PenaltyType
                      )}
                    </div>

                    <div className="text-xs text-gray-400">
                      {formatDate(
                        penalty.createdAt
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-red-600">
                      -{penalty.points}
                    </div>

                    <AdminBadge variant="danger">
                      {penalty.scope}
                    </AdminBadge>
                  </div>
                </AdminListRow>
              )
            )
          )}
        </AdminCard>
      </div>
    </div>
  );
}

export default PenaltyManagementPage;