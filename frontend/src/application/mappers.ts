import type {
  Activity,
  ActivityStatus,
  Announcement,
  AnnouncementType,
  Team,
  TeamMember,
  TopPerformer as DomainTopPerformer,
} from '../domain';
import type { Activity as UiActivity, Announcement as UiAnnouncement, Team as UiTeam, TopPerformer as UiTopPerformer } from '../types';

const ANNOUNCEMENT_TYPE_MAP: Record<AnnouncementType, UiAnnouncement['type']> = {
  news: 'news',
  update: 'update',
  competition: 'competition',
  important: 'important',
  general: 'general',
};

const ACTIVITY_STATUS_MAP: Record<ActivityStatus, UiActivity['status']> = {
  draft: 'upcoming',
  upcoming: 'upcoming',
  active: 'active',
  completed: 'completed',
  cancelled: 'cancelled',
};

export function toUiTeam(team: Team): UiTeam {
  return {
    id: team.id,
    name: team.name,
    color: team.color,
    logo: team.logoUrl,
    flag: team.flagUrl,
    motto: team.motto,
    description: team.description,
    memberCount: team.memberCount,
    totalPoints: team.totalPoints,
    rank: undefined,
    categoryPoints: { ...team.categoryPoints },
  };
}

export function toUiTopPerformer(
  performer: DomainTopPerformer,
  team: Team,
): UiTopPerformer {
  return {
    id: performer.id,
    name: performer.displayName,
    grade: performer.grade,
    teamId: performer.teamId,
    team: toUiTeam(team),
    totalPoints: performer.totalPoints,
  };
}

export function toUiAnnouncement(announcement: Announcement): UiAnnouncement {
  return {
    id: announcement.id,
    title: announcement.title,
    content: announcement.content,
    type: ANNOUNCEMENT_TYPE_MAP[announcement.type],
    createdAt: announcement.createdAt,
  };
}

export function toUiActivity(activity: Activity): UiActivity {
  return {
    id: activity.id,
    title: activity.title,
    description: activity.description,
    type: activity.type,
    date: activity.scheduledAt,
    points: activity.defaultPoints,
    status: ACTIVITY_STATUS_MAP[activity.status],
  };
}

export function buildUiTopPerformers(
  performers: DomainTopPerformer[],
  teams: Team[],
): UiTopPerformer[] {
  const teamMap = new Map(teams.map((team) => [team.id, team]));
  return performers.map((performer) => {
    const team = teamMap.get(performer.teamId);
    if (!team) {
      throw new Error(`Team not found for performer ${performer.id}`);
    }
    return toUiTopPerformer(performer, team);
  });
}

export function memberToUiPerformer(member: TeamMember, team: Team): UiTopPerformer {
  return {
    id: member.id,
    name: member.displayName,
    grade: member.grade,
    teamId: member.teamId,
    team: toUiTeam(team),
    totalPoints: member.totalPoints,
  };
}
