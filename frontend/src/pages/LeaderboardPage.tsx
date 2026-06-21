import { motion } from 'framer-motion';
import { Trophy, User, Users } from 'lucide-react';
import { useState } from 'react';
import { useLeaderboardData } from '../hooks';

function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'individual' | 'team'>('individual');
  const { data } = useLeaderboardData();
  const mockTopPerformers = data?.topPerformers ?? [];
  const mockTeams = data?.teams ?? [];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
          Leaderboard
        </h1>
        <p className="text-gray-500 mt-2">See who's leading the competition!</p>
      </motion.div>

      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-xl flex">
          <button
            onClick={() => setActiveTab('individual')}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'individual' ? 'bg-white shadow text-purple-600' : 'text-gray-600'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Individual</span>
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'team' ? 'bg-white shadow text-purple-600' : 'text-gray-600'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Teams</span>
          </button>
        </div>
      </div>

      {activeTab === 'individual' ? (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span>Top Performers</span>
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {mockTopPerformers.map((performer, index) => (
              <motion.div
                key={performer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 flex items-center space-x-4 ${index < 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold
                  ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                    'bg-gradient-to-br from-blue-400 to-blue-600'}`}
                >
                  {index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {performer.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{performer.name}</p>
                  <p className="text-sm text-gray-500">{performer.grade} | {performer.team.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{performer.totalPoints}</p>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <Users className="w-6 h-6 text-purple-500" />
              <span>Team Rankings</span>
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {mockTeams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 flex items-center space-x-4 ${index < 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold
                  ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                    'bg-gradient-to-br from-blue-400 to-blue-600'}`}
                >
                  {index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
                </div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: team.color }}
                >
                  {team.name.split(' ')[1]?.charAt(0) || team.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{team.name}</p>
                  <p className="text-sm text-gray-500">{team.memberCount} members</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{team.totalPoints.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaderboardPage;
