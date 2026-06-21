import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { UserCheck, UserX, Clock, ClipboardList } from 'lucide-react';
import type { AttendanceAnalytics } from '../../../application/view-models';
import { AdminCard } from '../components';

interface AttendanceAnalyticsPanelProps {
  analytics: AttendanceAnalytics;
}

const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#6366F1'];

export function AttendanceAnalyticsPanel({ analytics }: AttendanceAnalyticsPanelProps) {
  const pieData = [
    { name: 'Present', value: analytics.presentCount },
    { name: 'Absent', value: analytics.absentCount },
    { name: 'Excused', value: analytics.excusedCount },
    { name: 'Late', value: analytics.lateCount },
  ].filter((item) => item.value > 0);

  const metrics = [
    { icon: ClipboardList, label: 'Total Records', value: analytics.totalRecords, color: 'text-blue-600' },
    { icon: UserCheck, label: 'Present', value: analytics.presentCount, color: 'text-green-600' },
    { icon: UserX, label: 'Absent', value: analytics.absentCount, color: 'text-red-600' },
    { icon: Clock, label: 'Rate', value: `${analytics.attendanceRate}%`, color: 'text-purple-600' },
  ];

  return (
    <AdminCard title="Attendance Analytics" delay={0.4}>
      <div className="grid sm:grid-cols-2 gap-4 items-center">
        <div className="h-[180px]">
          {pieData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-500">
              No attendance data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-xl bg-gray-50 p-3">
              <metric.icon className={`w-4 h-4 mb-1 ${metric.color}`} />
              <div className="text-lg font-bold text-gray-900">{metric.value}</div>
              <div className="text-xs text-gray-500">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </AdminCard>
  );
}
