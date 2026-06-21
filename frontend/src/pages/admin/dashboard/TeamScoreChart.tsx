import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AdminChartPoint } from '../../../application/view-models';
import { AdminCard } from '../components';

interface TeamScoreChartProps {
  data: AdminChartPoint[];
}

export function TeamScoreChart({ data }: TeamScoreChartProps) {
  return (
    <AdminCard title="Team Score Comparison" delay={0.3}>
      {data.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-16">No team scores to compare.</p>
      ) : (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                }}
                formatter={(value: number) => [`${value.toLocaleString()} pts`, 'Score']}
              />
              <Bar dataKey="points" radius={[8, 8, 0, 0]} maxBarSize={48}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </AdminCard>
  );
}
