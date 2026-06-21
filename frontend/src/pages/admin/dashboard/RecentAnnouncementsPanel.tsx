import { motion } from 'framer-motion';
import { Bell, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Announcement } from '../../../types';
import { ROUTES } from '../../../utils/constants';
import { AdminCard } from '../components';

interface RecentAnnouncementsPanelProps {
  announcements: Announcement[];
}

const typeColors: Record<Announcement['type'], string> = {
  news: 'bg-blue-100 text-blue-700',
  update: 'bg-purple-100 text-purple-700',
  competition: 'bg-orange-100 text-orange-700',
  important: 'bg-red-100 text-red-700',
  general: 'bg-gray-100 text-gray-700',
};

export function RecentAnnouncementsPanel({ announcements }: RecentAnnouncementsPanelProps) {
  return (
    <AdminCard
      title="Recent Announcements"
      delay={0.55}
      className="h-full"
    >
      {announcements.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">No announcements published yet.</p>
      ) : (
        <div className="space-y-3">
          {announcements.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl border border-gray-100 hover:border-purple-100 hover:bg-purple-50/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                    <span className={`shrink-0 px-2 py-0.5 rounded-md text-xs font-medium capitalize ${typeColors[item.type]}`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{item.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Link
        to={ROUTES.ADMIN_ANNOUNCEMENTS}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700"
      >
        Manage announcements
        <ChevronRight className="w-4 h-4" />
      </Link>
    </AdminCard>
  );
}
