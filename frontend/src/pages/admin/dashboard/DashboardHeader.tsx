import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { FestivalProgress } from '../../../application/view-models';

interface DashboardHeaderProps {
  festivalProgress: FestivalProgress;
}

export function DashboardHeader({ festivalProgress }: DashboardHeaderProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-6 lg:p-8 text-white shadow-xl"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-1/4 w-56 h-56 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Mahragan {new Date().getFullYear()} Admin
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold">Festival Command Center</h1>
          <p className="text-white/80 mt-2 max-w-2xl">
            Monitor teams, scores, attendance, and festival progress in one place.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-4 min-w-[240px]">
          <div className="flex items-center justify-between text-sm text-white/80 mb-2">
            <span>{festivalProgress.phase}</span>
            <span>{festivalProgress.percentComplete}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/20 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${festivalProgress.percentComplete}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-full bg-white"
            />
          </div>
          <p className="text-xs text-white/70 mt-2">
            Day {festivalProgress.daysElapsed} of {festivalProgress.totalDays} · {festivalProgress.daysRemaining} days left
          </p>
        </div>
      </div>
    </motion.section>
  );
}
