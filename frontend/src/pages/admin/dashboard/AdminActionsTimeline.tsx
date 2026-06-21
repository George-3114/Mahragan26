import { motion } from 'framer-motion';
import {
  Activity,
  Award,
  Bell,
  ClipboardCheck,
  QrCode,
  AlertTriangle,
  Trophy,
} from 'lucide-react';
import { AdminCard } from '../components';

interface AdminActionsTimelineProps {
  actions: string[];
}

function getActionIcon(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes('qr') || lower.includes('check-in')) return QrCode;
  if (lower.includes('attendance')) return ClipboardCheck;
  if (lower.includes('announcement')) return Bell;
  if (lower.includes('penalty')) return AlertTriangle;
  if (lower.includes('team score') || lower.includes('score +')) return Trophy;
  if (lower.includes('reward')) return Award;
  return Activity;
}

function getActionColor(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes('penalty')) return 'from-red-500 to-rose-500';
  if (lower.includes('qr') || lower.includes('check-in')) return 'from-indigo-500 to-purple-500';
  if (lower.includes('attendance')) return 'from-blue-500 to-cyan-500';
  if (lower.includes('announcement')) return 'from-orange-500 to-amber-500';
  if (lower.includes('score')) return 'from-green-500 to-emerald-500';
  return 'from-purple-500 to-pink-500';
}

export function AdminActionsTimeline({ actions }: AdminActionsTimelineProps) {
  return (
    <AdminCard title="Recent Admin Actions" delay={0.6} className="h-full">
      {actions.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">No admin actions recorded yet.</p>
      ) : (
        <div className="relative">
          <div className="absolute left-[18px] top-2 bottom-2 w-px bg-gray-200" />
          <div className="space-y-4">
            {actions.map((action, index) => {
              const Icon = getActionIcon(action);
              const color = getActionColor(action);

              return (
                <motion.div
                  key={`${action}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="relative flex gap-4 pl-1"
                >
                  <div className={`relative z-10 w-9 h-9 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shrink-0 shadow-md`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm text-gray-700 leading-relaxed">{action}</p>
                    <p className="text-xs text-gray-400 mt-1">Just now</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </AdminCard>
  );
}
