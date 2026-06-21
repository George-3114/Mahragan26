import { QrCode, Radio, Users, Archive } from 'lucide-react';
import type { QrAttendanceStats } from '../../../application/view-models';
import { AdminCard } from '../components';

interface QrStatsPanelProps {
  stats: QrAttendanceStats;
}

export function QrStatsPanel({ stats }: QrStatsPanelProps) {
  const items = [
    { icon: QrCode, label: 'Total Sessions', value: stats.totalSessions, color: 'from-indigo-500 to-purple-500' },
    { icon: Radio, label: 'Active Now', value: stats.activeSessions, color: 'from-green-500 to-emerald-500' },
    { icon: Users, label: 'Total Check-ins', value: stats.totalCheckIns, color: 'from-blue-500 to-cyan-500' },
    { icon: Archive, label: 'Avg / Session', value: stats.averageCheckIns, color: 'from-orange-500 to-red-500' },
  ];

  return (
    <AdminCard title="QR Attendance Statistics" delay={0.45}>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl bg-gray-50 p-4">
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
              <item.icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-xl font-bold text-gray-900">{item.value}</div>
            <div className="text-xs text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4">
        {stats.closedSessions} closed sessions this season
      </p>
    </AdminCard>
  );
}
