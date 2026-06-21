import { useMemo } from 'react';
import { getCategoryLabel } from '../../domain';
import { useAdminIndividualScores, useAdminMembers, useCurrentMember } from '../../hooks';

const ADMIN_NAMES: Record<string, string> = {
  admin1: 'Admin',
};

function MyScoresPage() {
  const currentMember = useCurrentMember();
  const { data: scoresData } = useAdminIndividualScores();
  const { data: membersData } = useAdminMembers();

  const scores = Array.isArray(scoresData) ? scoresData : [];
  const members = Array.isArray(membersData) ? membersData : [];

  const myScores = useMemo(() => {
    if (!currentMember) return [];
    return scores
      .filter((score) => score.memberId === currentMember.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [scores, currentMember]);

  const totals = useMemo(() => {
    let earned = 0;
    let penalties = 0;
    for (const score of myScores) {
      if (score.isPenalty) {
        penalties += score.points;
      } else {
        earned += score.points;
      }
    }
    return { earned, penalties, net: earned - penalties };
  }, [myScores]);

  function getAdminName(awardedById: string): string {
    if (ADMIN_NAMES[awardedById]) return ADMIN_NAMES[awardedById];
    const adminMember = members.find((m) => m.userId === awardedById);
    return adminMember?.displayName ?? awardedById;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">My Scores</h1>
      <p className="text-gray-500 mb-6">View all points, rewards, and penalties.</p>

      {currentMember && (
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-sm text-gray-500 mb-1">Total Earned</h2>
            <div className="text-3xl font-bold text-green-600">+{totals.earned}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-sm text-gray-500 mb-1">Total Penalties</h2>
            <div className="text-3xl font-bold text-red-600">-{totals.penalties}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-sm text-gray-500 mb-1">Net Points</h2>
            <div className="text-3xl font-bold text-blue-600">{currentMember.totalPoints}</div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Score History</h2>
        </div>

        {myScores.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No score records found.</div>
        ) : (
          <div className="divide-y">
            {myScores.map((score) => (
              <div key={score.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">{score.description}</div>
                  <div className="text-sm text-gray-500">{getCategoryLabel(score.category)}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(score.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    {score.awardedById && (
                      <> · Awarded by {getAdminName(score.awardedById)}</>
                    )}
                  </div>
                </div>
                <div
                  className={`font-bold text-lg ${
                    score.isPenalty ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {score.isPenalty ? '-' : '+'}
                  {score.points}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyScoresPage;
