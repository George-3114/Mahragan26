import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { ADMIN_NAV_ITEMS } from '../adminNav';
import { AdminCard } from '../components';

const moduleLinks = ADMIN_NAV_ITEMS.filter((item) => item.to !== ROUTES.ADMIN);

export function AdminModulesGrid() {
  return (
    <AdminCard title="Admin Modules" delay={0.7}>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {moduleLinks.map((mod) => (
          <Link
            key={mod.to}
            to={mod.to}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 hover:shadow-sm transition-all text-center"
          >
            <mod.icon className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">{mod.label}</span>
          </Link>
        ))}
      </div>
    </AdminCard>
  );
}
