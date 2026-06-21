import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  Target,
  TrendingUp,
  Calendar,
  ClipboardCheck,
  QrCode,
  Gift,
  Megaphone,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import type { AdminDashboardData } from '../../../application/view-models';
import { ROUTES } from '../../../utils/constants';

interface StatCardsRowProps {
  data: AdminDashboardData;
}

interface StatCard {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
  color: string;
  to: string;
}

export function StatCardsRow({ data }: StatCardsRowProps) {
  const { stats, attendanceAnalytics, qrStats, rewardStats } = data;

  const cards: StatCard[] = [
    {
      icon: Users,
      label: 'Participants',
      value: stats.totalUsers.toLocaleString(),
      sub: 'Active members',
      color: 'from-blue-500 to-cyan-500',
      to: ROUTES.ADMIN_INDIVIDUALS,
    },
    {
      icon: Target,
      label: 'Teams',
      value: stats.totalTeams.toString(),
      sub: 'Competing teams',
      color: 'from-purple-500 to-pink-500',
      to: ROUTES.ADMIN_TEAMS,
    },
    {
      icon: TrendingUp,
      label: 'Total Points',
      value: stats.totalPoints.toLocaleString(),
      sub: 'Combined score',
      color: 'from-green-500 to-emerald-500',
      to: ROUTES.ADMIN_TEAM_SCORES,
    },
    {
      icon: Calendar,
      label: 'Activities',
      value: stats.activities.toString(),
      sub: 'Upcoming & active',
      color: 'from-orange-500 to-red-500',
      to: ROUTES.ADMIN_ATTENDANCE,
    },
    {
      icon: ClipboardCheck,
      label: 'Attendance Rate',
      value: `${attendanceAnalytics.attendanceRate}%`,
      sub: `${attendanceAnalytics.presentCount} present`,
      color: 'from-teal-500 to-cyan-600',
      to: ROUTES.ADMIN_ATTENDANCE,
    },
    {
      icon: QrCode,
      label: 'QR Check-ins',
      value: qrStats.totalCheckIns.toString(),
      sub: `${qrStats.activeSessions} active sessions`,
      color: 'from-indigo-500 to-violet-500',
      to: ROUTES.ADMIN_QR_SESSIONS,
    },
    {
      icon: Gift,
      label: 'Reward Stock',
      value: rewardStats.totalStock.toString(),
      sub: `${rewardStats.activeRewards} active rewards`,
      color: 'from-rose-500 to-pink-500',
      to: ROUTES.ADMIN_REWARDS,
    },
    {
      icon: Megaphone,
      label: 'Announcements',
      value: data.recentAnnouncements.length.toString(),
      sub: 'Recent updates',
      color: 'from-amber-500 to-orange-500',
      to: ROUTES.ADMIN_ANNOUNCEMENTS,
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Link key={card.label} to={card.to}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-lg border border-gray-100 h-full"
          >
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.color} opacity-10 rounded-bl-full`} />
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-md`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className="text-sm font-medium text-gray-700 mt-0.5">{card.label}</div>
            <div className="text-xs text-gray-500 mt-1">{card.sub}</div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
