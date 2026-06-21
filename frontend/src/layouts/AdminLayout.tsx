import { ReactNode, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowLeft, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context';
import { ROUTES } from '../utils/constants';
import { ADMIN_NAV_ITEMS } from '../pages/admin/adminNav';

interface AdminLayoutProps {
  children: ReactNode;
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {ADMIN_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`
          }
        >
          <item.icon className="w-5 h-5 shrink-0" />
          <span className="text-sm">{item.label}</span>
        </NavLink>
      ))}
    </>
  );
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-40 bg-gray-900 px-4 py-3 flex items-center justify-between">
        <span className="text-white font-bold">Admin Panel</span>
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu overlay"
          />
          <nav className="absolute top-14 left-0 right-0 bottom-0 bg-gray-900 p-2 overflow-y-auto space-y-1">
            <NavLinks onNavigate={() => setMobileOpen(false)} />
            <div className="pt-4 mt-4 border-t border-gray-800 space-y-1">
              <Link
                to={ROUTES.HOME}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Back to Festival</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-gray-900 flex-col">
        <div className="p-6">
          <span className="text-white font-bold text-lg">Admin Panel</span>
        </div>
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          <NavLinks />
        </nav>
        <div className="p-2 border-t border-gray-800 space-y-1">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back to Festival</span>
          </Link>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="lg:pl-64 p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
}
