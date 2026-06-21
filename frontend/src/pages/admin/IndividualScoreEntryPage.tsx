import { FormEvent, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdminActions, useAdminIndividualScores, useAdminMembers } from '../../hooks';
import { IndividualScoreCategory, getCategoryLabel } from '../../domain';
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

function IndividualScoreEntryPage() {
  const { user } = useAuth();
  const admin = useAdminActions()();

  const membersResult = useAdminMembers();
  const scoresResult = useAdminIndividualScores();

  console.log('MEMBERS =', membersResult);
  console.log('INDIVIDUAL SCORES =', scoresResult);

  const members = Array.isArray(membersResult?.data)
    ? membersResult.data
    : [];

  const scores = Array.isArray(scoresResult?.data)
    ? scoresResult.data
    : [];

  const [memberId, setMemberId] = useState('');
  const [category, setCategory] = useState<IndividualScoreCategory>(
    IndividualScoreCategory.Participation
  );
  const [points, setPoints] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const memberMap = useMemo(
    () => new Map(members.map((m) => [m.id, m])),
    [members]
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

    if (!user || !memberId) return;

    const member = members.find((m) => m.id === memberId);

    if (!member) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const score = await admin.addIndividualScore(
        member.id,
        member.userId,
        member.teamId,
        category,
        user.id,
        points ? parseInt(points, 10) : undefined,
        description || undefined
      );

      setMessage({
        type: 'success',
        text: `+${score.points} points awarded to ${member.displayName}.`,
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
        title="Individual Score Entry"
        description="Award points to individual participants."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <AdminCard title="Award Individual Score" delay={0.1}>
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

            <AdminFormField label="Category">
              <AdminSelect
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as IndividualScoreCategory
                  )
                }
              >
                {Object.values(IndividualScoreCategory).map((cat) => (
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
              disabled={submitting || !memberId}
            >
              {submitting ? 'Saving...' : 'Award Score'}
            </AdminSubmitButton>
          </form>
        </AdminCard>

        <AdminCard
          title={`Recent Individual Scores (${sortedScores.length})`}
          delay={0.15}
        >
          {sortedScores.length === 0 ? (
            <AdminEmptyState message="No individual scores recorded yet." />
          ) : (
            sortedScores.slice(0, 15).map((score) => {
              const member = memberMap.get(score.memberId);

              return (
                <AdminListRow key={score.id}>
                  <div>
                    <div className="font-medium text-gray-800">
                      {member?.displayName ?? score.memberId}
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

export default IndividualScoreEntryPage;