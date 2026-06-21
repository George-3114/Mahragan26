export type UserRole = 'admin' | 'child';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  grade?: 'Grade 5' | 'Grade 6';
  teamId?: string;
  profilePicture?: string;
  totalPoints: number;
  achievements: Achievement[];
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  logo?: string;
  flag?: string;
  motto?: string;
  description?: string;
  memberCount: number;
  totalPoints: number;
  rank?: number;
  categoryPoints: {
    quiz: number;
    liturgy: number;
    sports: number;
    hymn: number;
    psalm: number;
    penalty: number;
  };
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  points: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'news' | 'update' | 'competition' | 'important' | 'general';
  createdAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  pointsBonus: number;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  image?: string;
  requiredPoints: number;
  category: string;
  stock: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  totalPoints: number;
  timeLimit: number;
  startDate: string;
  endDate: string;
  isPublished: boolean;
}

export interface QuizQuestion {
  questionText: string;
  type: 'multiple' | 'trueFalse';
  options: string[];
  correctAnswer: string;
  points: number;
}

export interface Material {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'ppt' | 'image' | 'video' | 'hymn' | 'other';
  fileUrl: string;
  downloads: number;
}

export interface Score {
  id: string;
  userId: string;
  teamId?: string;
  points: number;
  category: string;
  description: string;
  isPenalty: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AppStats {
  totalUsers: number;
  totalTeams: number;
  totalPoints: number;
  activities: number;
}

export interface TopPerformer {
  id: string;
  name: string;
  grade: string;
  teamId: string;
  team: Team;
  totalPoints: number;
}
