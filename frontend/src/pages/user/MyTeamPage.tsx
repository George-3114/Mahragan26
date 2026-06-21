import { Trophy, Users } from 'lucide-react';
import { useMyTeamData } from '../../hooks';

function MyTeamPage() {
  const teamData = useMyTeamData();

  if (!teamData) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">My Team</h1>
        <p className="text-gray-500">No team assigned to your account.</p>
      </div>
    );
  }

  const { team, teamRank, leaderboard, categoryPoints } = teamData;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Team</h1>
        <p className="text-gray-500">Team standings and member rankings.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl"
            style={{ backgroundColor: team.color }}
          >
            {team.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{team.name}</h2>
            <p className="text-gray-500 italic">{team.motto ?? 'No motto set'}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-sm text-gray-500 mb-1">Team Rank</div>
            <div className="text-2xl font-bold text-purple-600">#{teamRank}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-sm text-gray-500 mb-1">Total Points</div>
            <div className="text-2xl font-bold text-blue-600">{team.totalPoints.toLocaleString()}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-sm text-gray-500 mb-1">Members</div>
            <div className="text-2xl font-bold text-gray-800">{team.memberCount}</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-4 border-b flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-semibold">Team Leaderboard</h2>
          </div>
          {leaderboard.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No team members found.</div>
          ) : (
            <div className="divide-y">
              {leaderboard.map((member, index) => (
                <div key={member.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </span>
                    <span className="font-medium">{member.displayName}</span>
                  </div>
                  <span className="font-bold text-blue-600">{member.totalPoints} pts</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-4 border-b flex items-center gap-2">
            <Users className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-semibold">Score Breakdown by Category</h2>
          </div>
          <div className="p-4 grid grid-cols-2 gap-2">
            {Object.entries(categoryPoints).map(([key, value]) => (
              <div key={key} className="flex justify-between bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-gray-500 capitalize">{key}</span>
                <span className="font-medium text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyTeamPage;
