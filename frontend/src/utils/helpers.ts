// Format points with K suffix
export const formatPoints = (points: number): string => {
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}k`;
  }
  return points.toString();
};

// Get rank badge styling
export const getRankBadge = (rank: number): { color: string; emoji: string } => {
  switch (rank) {
    case 1:
      return { color: 'from-yellow-400 to-yellow-600', emoji: '🥇' };
    case 2:
      return { color: 'from-gray-300 to-gray-500', emoji: '🥈' };
    case 3:
      return { color: 'from-orange-400 to-orange-600', emoji: '🥉' };
    default:
      return { color: 'from-blue-400 to-blue-600', emoji: '' };
  }
};

// Get category label from value
export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    quiz: 'Quiz Competition',
    liturgy_attendance: 'Liturgy Attendance',
    confession: 'Confession',
    participation: 'Participation',
    psalm_memorization: 'Psalm Memorization',
    hymn_memorization: 'Hymn Memorization',
    online_quiz: 'Online Quiz',
    bring_friend: 'Bring a Friend',
    perfect_week: 'Perfect Week',
    volunteer: 'Volunteer Award',
    flag_competition: 'Flag Competition',
    presentation: 'Presentation',
    genius_competition: 'Genius Competition',
    sports_competition: 'Sports Competition',
    early_attendance: 'Early Attendance',
    best_behavior: 'Best Behavior Team',
    penalty: 'Penalty',
    custom: 'Custom',
  };
  return labels[category] || category;
};

// Format date
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format date with time
export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(date);
};

// Calculate time remaining
export const calculateTimeLeft = (targetDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} => {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get file icon based on type
export const getFileIcon = (type: string): string => {
  const icons: Record<string, string> = {
    pdf: 'file-text',
    ppt: 'presentation',
    image: 'image',
    video: 'video',
    hymn: 'music',
    other: 'file',
  };
  return icons[type] || 'file';
};

// Generate random color
export const generateRandomColor = (): string => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#14B8A6', '#8B5CF6'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Class names helper
export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};
