import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { AdminCard } from '../components';

const quickActions = [
  { to: ROUTES.ADMIN_INDIVIDUAL_SCORES, label: '+ Individual Score', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { to: ROUTES.ADMIN_TEAM_SCORES, label: '+ Team Score', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
  { to: ROUTES.ADMIN_ATTENDANCE, label: 'Record Attendance', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  { to: ROUTES.ADMIN_QR_SESSIONS, label: 'QR Session', color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' },
  { to: ROUTES.ADMIN_PENALTIES, label: 'Apply Penalty', color: 'bg-red-100 text-red-700 hover:bg-red-200' },
  { to: ROUTES.ADMIN_ANNOUNCEMENTS, label: '+ Post News', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
];

export function QuickActionsPanel() {
  return (
    <AdminCard title="Quick Actions" delay={0.65}>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className={`p-4 rounded-xl font-medium text-center text-sm transition-colors ${action.color}`}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </AdminCard>
  );
}
