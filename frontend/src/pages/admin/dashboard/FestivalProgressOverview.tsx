import { motion } from 'framer-motion';
import { CalendarDays, CheckCircle2, Clock } from 'lucide-react';
import type { FestivalProgress } from '../../../application/view-models';
import { AdminCard } from '../components';

interface FestivalProgressOverviewProps {
  progress: FestivalProgress;
}

export function FestivalProgressOverview({ progress }: FestivalProgressOverviewProps) {
  const milestones = [
    { label: 'Completed', value: progress.completedActivities, icon: CheckCircle2, color: 'text-green-600' },
    { label: 'Upcoming', value: progress.upcomingActivities, icon: Clock, color: 'text-blue-600' },
    { label: 'Days Left', value: progress.daysRemaining, icon: CalendarDays, color: 'text-purple-600' },
  ];

  return (
    <AdminCard title="Festival Progress Overview" delay={0.15}>
      <div className="grid lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500">Current Phase</p>
              <p className="text-xl font-bold text-gray-900">{progress.phase}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {progress.percentComplete}%
              </p>
              <p className="text-sm text-gray-500">Season complete</p>
            </div>
          </div>
          <div className="h-4 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentComplete}%` }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            />
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Day {progress.daysElapsed} of {progress.totalDays} in the festival season
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {milestones.map((item) => (
            <div key={item.label} className="rounded-xl bg-gray-50 p-4 text-center">
              <item.icon className={`w-5 h-5 mx-auto mb-2 ${item.color}`} />
              <div className="text-xl font-bold text-gray-900">{item.value}</div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </AdminCard>
  );
}
