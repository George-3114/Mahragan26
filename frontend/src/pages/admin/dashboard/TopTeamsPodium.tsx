import { motion } from 'framer-motion';
import { Crown, Medal, Trophy } from 'lucide-react';
import type { AdminTeamRanking } from '../../../application/view-models';
import { AdminCard } from '../components';

interface TopTeamsPodiumProps {
  teams: AdminTeamRanking[];
}

const podiumConfig = [
  { rank: 2, height: 'h-28', medal: Medal, medalColor: 'text-gray-400', delay: 0.2 },
  { rank: 1, height: 'h-36', medal: Crown, medalColor: 'text-yellow-500', delay: 0.1 },
  { rank: 3, height: 'h-24', medal: Trophy, medalColor: 'text-amber-700', delay: 0.3 },
];

export function TopTeamsPodium({ teams }: TopTeamsPodiumProps) {
  const ordered = [teams[1], teams[0], teams[2]].filter(Boolean);

  return (
    <AdminCard title="Top 3 Teams" delay={0.2}>
      {teams.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">No team rankings yet.</p>
      ) : (
        <div className="flex items-end justify-center gap-3 pt-4 pb-2">
          {ordered.map((team, index) => {
            const config = podiumConfig[index];
            if (!team || !config) return null;
            const Icon = config.medal;

            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: config.delay }}
                className="flex flex-col items-center flex-1 max-w-[120px]"
              >
                <Icon className={`w-6 h-6 mb-2 ${config.medalColor}`} />
                <div
                  className={`w-full ${config.height} rounded-t-2xl flex flex-col items-center justify-end p-3 text-white shadow-lg`}
                  style={{ backgroundColor: team.color }}
                >
                  <span className="text-xs font-medium opacity-90">#{team.rank}</span>
                  <span className="text-sm font-bold text-center leading-tight mt-1">{team.name}</span>
                  <span className="text-xs mt-1 opacity-90">{team.totalPoints.toLocaleString()} pts</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">{team.memberCount} members</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </AdminCard>
  );
}
