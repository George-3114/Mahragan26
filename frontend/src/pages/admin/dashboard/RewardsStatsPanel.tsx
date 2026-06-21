import { Gift, Package, AlertTriangle, Star } from 'lucide-react';
import type { RewardStats } from '../../../application/view-models';
import { AdminCard } from '../components';

interface RewardsStatsPanelProps {
  stats: RewardStats;
}

export function RewardsStatsPanel({ stats }: RewardsStatsPanelProps) {
  const items = [
    { icon: Gift, label: 'Total Rewards', value: stats.totalRewards },
    { icon: Package, label: 'In Stock', value: stats.totalStock },
    { icon: Star, label: 'Avg Points', value: stats.averagePointsRequired },
    { icon: AlertTriangle, label: 'Low Stock', value: stats.lowStockCount },
  ];

  return (
    <AdminCard title="Rewards Statistics" delay={0.5}>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl bg-gray-50 p-4">
            <item.icon className="w-4 h-4 text-pink-600 mb-2" />
            <div className="text-xl font-bold text-gray-900">{item.value}</div>
            <div className="text-xs text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 px-4 py-3">
        <span className="text-gray-600">Active rewards</span>
        <span className="font-semibold text-purple-700">{stats.activeRewards} published</span>
      </div>
    </AdminCard>
  );
}
