import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useTeamsData } from '../hooks';

function TeamsPage() {
  const { data } = useTeamsData();
  const mockTeams = data ?? [];
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Festival Teams
        </h1>
        <p className="text-gray-500 mt-2">Meet the 8 amazing teams competing in the festival!</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockTeams.map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
          >
            <div className="h-24 relative" style={{ backgroundColor: team.color }}>
              <div className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: team.color }}
                >
                  {team.name.split(' ')[1]?.charAt(0) || team.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{team.name}</h3>
                  <p className="text-sm text-gray-500">{team.memberCount} members</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-1 text-purple-600">
                  <Trophy className="w-4 h-4" />
                  <span className="font-bold">{team.totalPoints.toLocaleString()}</span>
                </div>
                <span className="text-gray-400">Rank #{index + 1}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default TeamsPage;
