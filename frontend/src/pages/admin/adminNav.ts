import {
  LayoutDashboard,
  Users,
  Target,
  ClipboardCheck,
  QrCode,
  Trophy,
  TrendingUp,
  AlertTriangle,
  Megaphone,
  FileText,
  Gift,
  type LucideIcon,
} from 'lucide-react';
import { ROUTES } from '../../utils/constants';

export interface AdminNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { to: ROUTES.ADMIN, icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: ROUTES.ADMIN_TEAMS, icon: Target, label: 'Teams' },
  { to: ROUTES.ADMIN_INDIVIDUALS, icon: Users, label: 'Individuals' },
  { to: ROUTES.ADMIN_ATTENDANCE, icon: ClipboardCheck, label: 'Attendance' },
  { to: ROUTES.ADMIN_QR_SESSIONS, icon: QrCode, label: 'QR Sessions' },
  { to: ROUTES.ADMIN_TEAM_SCORES, icon: Trophy, label: 'Team Scores' },
  { to: ROUTES.ADMIN_INDIVIDUAL_SCORES, icon: TrendingUp, label: 'Individual Scores' },
  { to: ROUTES.ADMIN_PENALTIES, icon: AlertTriangle, label: 'Penalties' },
  { to: ROUTES.ADMIN_ANNOUNCEMENTS, icon: Megaphone, label: 'Announcements' },
  { to: ROUTES.ADMIN_MATERIALS, icon: FileText, label: 'Materials' },
  { to: ROUTES.ADMIN_REWARDS, icon: Gift, label: 'Rewards' },
];
