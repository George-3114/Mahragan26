import { Team, Activity, Announcement, AppStats, TopPerformer } from '../types';

// Mock teams data
export const mockTeams: Team[] = [
  { id: '1', name: 'St. Michael', color: '#3B82F6', totalPoints: 1850, memberCount: 12, motto: 'Strong in Faith', categoryPoints: { quiz: 450, liturgy: 300, sports: 600, hymn: 200, psalm: 150, penalty: 50 } },
  { id: '2', name: 'St. Gabriel', color: '#10B981', totalPoints: 1720, memberCount: 11, motto: 'Messengers of God', categoryPoints: { quiz: 400, liturgy: 350, sports: 500, hymn: 170, psalm: 130, penalty: 30 } },
  { id: '3', name: 'St. Raphael', color: '#F59E0B', totalPoints: 1590, memberCount: 10, motto: 'Healing Hearts', categoryPoints: { quiz: 380, liturgy: 280, sports: 450, hymn: 160, psalm: 120, penalty: 20 } },
  { id: '4', name: 'St. George', color: '#EF4444', totalPoints: 1480, memberCount: 11, motto: 'Victorious Warriors', categoryPoints: { quiz: 350, liturgy: 250, sports: 480, hymn: 150, psalm: 100, penalty: 50 } },
  { id: '5', name: 'St. Joseph', color: '#6366F1', totalPoints: 1350, memberCount: 10, motto: 'Humble Servants', categoryPoints: { quiz: 300, liturgy: 220, sports: 400, hymn: 130, psalm: 90, penalty: 90 } },
  { id: '6', name: 'St. Mary', color: '#EC4899', totalPoints: 1220, memberCount: 12, motto: 'Pure Hearts', categoryPoints: { quiz: 280, liturgy: 200, sports: 350, hymn: 120, psalm: 80, penalty: 10 } },
  { id: '7', name: 'St. Peter', color: '#14B8A6', totalPoints: 1100, memberCount: 9, motto: 'Rock of Faith', categoryPoints: { quiz: 250, liturgy: 180, sports: 320, hymn: 100, psalm: 70, penalty: 20 } },
  { id: '8', name: 'St. Paul', color: '#8B5CF6', totalPoints: 980, memberCount: 11, motto: 'Spreading the Word', categoryPoints: { quiz: 220, liturgy: 150, sports: 280, hymn: 80, psalm: 60, penalty: 10 } },
];

export const mockTopPerformers: TopPerformer[] = [
  { id: '1', name: 'Emma', grade: 'Grade 6', teamId: '1', team: mockTeams[0], totalPoints: 420 },
  { id: '2', name: 'David', grade: 'Grade 5', teamId: '2', team: mockTeams[1], totalPoints: 385 },
  { id: '3', name: 'Sophia', grade: 'Grade 6', teamId: '3', team: mockTeams[2], totalPoints: 340 },
  { id: '4', name: 'Matthew', grade: 'Grade 5', teamId: '1', team: mockTeams[0], totalPoints: 310 },
  { id: '5', name: 'Isabella', grade: 'Grade 6', teamId: '4', team: mockTeams[3], totalPoints: 290 },
];

export const mockAnnouncements: Announcement[] = [
  { id: '1', title: 'Welcome to the Festival!', content: 'We are excited to welcome all children to this year\'s church festival. May God bless you all!', type: 'news', createdAt: new Date().toISOString() },
  { id: '2', title: 'Sports Day Announcement', content: 'Get ready for our annual Sports Day! Prepare your teams and show your best performances.', type: 'competition', createdAt: new Date().toISOString() },
  { id: '3', title: 'Quiz Competition This Week', content: 'Don\'t forget the online quiz competition. Complete it before Sunday for bonus points!', type: 'important', createdAt: new Date().toISOString() },
];

export const mockActivities: Activity[] = [
  { id: '1', title: 'Monthly Liturgy', description: 'Regular Sunday liturgy attendance', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), points: 100, status: 'upcoming', type: 'liturgy' },
  { id: '2', title: 'Psalm Memorization', description: 'Memorize and recite Psalm 23', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), points: 100, status: 'upcoming', type: 'psalm_memorization' },
  { id: '3', title: 'Sports Competition', description: 'Annual sports competition', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), points: 600, status: 'upcoming', type: 'sports' },
];

export const appStats: AppStats = {
  totalUsers: 86,
  totalTeams: 8,
  totalPoints: 11290,
  activities: 12,
};

export const scoreCategories = {
  individual: [
    { value: 'liturgy_attendance', label: 'Liturgy Attendance', points: 100 },
    { value: 'confession', label: 'Confession', points: 250 },
    { value: 'participation', label: 'Participation', points: 50 },
    { value: 'psalm_memorization', label: 'Psalm Memorization', points: 50 },
    { value: 'online_quiz', label: 'Online Quiz', points: 50 },
    { value: 'bring_friend', label: 'Bring a Friend', points: 100 },
    { value: 'perfect_week', label: 'Perfect Week', points: 150 },
    { value: 'volunteer', label: 'Volunteer Award', points: 100 },
  ],
  team: [
    { value: 'quiz', label: 'Quiz Competition', points: 50 },
    { value: 'liturgy_attendance', label: 'Monthly Liturgy', points: 100 },
    { value: 'flag_competition', label: 'Flag Competition', points: 100 },
    { value: 'presentation', label: 'Presentation', points: 100 },
    { value: 'genius_competition', label: 'Genius Competition', points: 700 },
    { value: 'sports_competition', label: 'Sports Competition', points: 600 },
    { value: 'hymn_memorization', label: 'Hymn Memorization', points: 300 },
    { value: 'psalm_memorization', label: 'Psalm Memorization', points: 100 },
  ],
};

export const penaltyTypes = [
  { value: 'noise_small', label: 'Noise (-10)', points: 10 },
  { value: 'noise_medium', label: 'Noise (-20)', points: 20 },
  { value: 'noise_large', label: 'Noise (-30)', points: 30 },
  { value: 'misbehavior', label: 'Misbehavior (-50)', points: 50 },
  { value: 'missing_activity', label: 'Missing Activity (-100)', points: 100 },
];

export const achievementCategories = [
  'top_performer',
  'team_champion',
  'attendance_streak',
  'quiz_master',
  'psalm_hero',
  'hymn_hero',
  'special',
];

export const materialTypes = [
  { value: 'pdf', label: 'PDF Document' },
  { value: 'ppt', label: 'PowerPoint' },
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'hymn', label: 'Hymn Sheet' },
  { value: 'other', label: 'Other' },
];

export const rewardCategories = [
  { value: 'toy', label: 'Toys' },
  { value: 'book', label: 'Books' },
  { value: 'stationery', label: 'Stationery' },
  { value: 'gift', label: 'Gifts' },
  { value: 'other', label: 'Other' },
];
