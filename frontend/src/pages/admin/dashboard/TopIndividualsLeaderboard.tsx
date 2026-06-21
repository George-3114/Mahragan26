import { motion } from 'framer-motion';
import type { AdminIndividualRanking } from '../../../application/view-models';
import { AdminCard } from '../components';

interface TopIndividualsLeaderboardProps {
  individuals: AdminIndividualRanking[];
}

export function TopIndividualsLeaderboard({ individuals }: TopIndividualsLeaderboardProps) {
  return (
    <AdminCard title="Top 10 Individuals" delay={0.25} className="h-full">
      {individuals.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">No individual rankings yet.</p>
      ) : (
        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
          {individuals.map((person, index) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                  person.rank <= 3
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                {person.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate">{person.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: person.teamColor }}
                  />
                  <span className="truncate">{person.teamName}</span>
                  <span>· {person.grade}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold text-purple-600">{person.totalPoints}</div>
                <div className="text-xs text-gray-400">pts</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AdminCard>
  );
}
