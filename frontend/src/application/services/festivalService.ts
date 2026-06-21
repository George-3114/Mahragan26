import {
  ActivityStatus,
  buildTeamLeaderboard,
  buildTopPerformers,
  calculateFestivalStats,
  FESTIVAL,
  filterUpcomingActivities,
  filterVisibleAnnouncements,
  TeamMemberStatus,
} from '../../domain';
import type { ApplicationContext } from '../context';
import {
  buildUiTopPerformers,
  toUiActivity,
  toUiAnnouncement,
  toUiTeam,
} from '../mappers';
import type { AppStats, HomePageData, LeaderboardData } from '../view-models';

export class FestivalService {
  constructor(private readonly ctx: ApplicationContext) {}

  async getStats(): Promise<AppStats> {
    const year = FESTIVAL.CURRENT_YEAR;
    const [members, teams, activities] = await Promise.all([
      this.ctx.repositories.teamMembers.findAll({ festivalYear: year, status: TeamMemberStatus.Active }),
      this.ctx.repositories.teams.findByFestivalYear(year),
      this.ctx.repositories.activities.findAll({ festivalYear: year }),
    ]);

    const stats = calculateFestivalStats({ festivalYear: year, members, teams, activities });
    const activeActivities = activities.filter(
      (a) => a.status === ActivityStatus.Active || a.status === ActivityStatus.Upcoming,
    ).length;

    return {
      totalUsers: stats.totalMembers,
      totalTeams: stats.totalTeams,
      totalPoints: stats.totalIndividualPoints + stats.totalTeamPoints,
      activities: activeActivities,
    };
  }

  async getHomePageData(): Promise<HomePageData> {
    const year = FESTIVAL.CURRENT_YEAR;
    const [teams, members, announcements, activities, stats] = await Promise.all([
      this.ctx.repositories.teams.findByFestivalYear(year),
      this.ctx.repositories.teamMembers.findAll({ festivalYear: year, status: TeamMemberStatus.Active }),
      this.ctx.repositories.announcements.findAll({ isPublished: true }),
      this.ctx.repositories.activities.findAll({ festivalYear: year }),
      this.getStats(),
    ]);

    const leaderboard = buildTeamLeaderboard(teams);
    const topPerformers = buildTopPerformers(members, 5);

    return {
      stats,
      topTeams: leaderboard.slice(0, 5).map((entry) => toUiTeam(teams.find((t) => t.id === entry.id)!)),
      topPerformers: buildUiTopPerformers(topPerformers, teams),
      announcements: filterVisibleAnnouncements(announcements)
        .slice(0, 5)
        .map(toUiAnnouncement),
      activities: filterUpcomingActivities(activities)
        .slice(0, 3)
        .map(toUiActivity),
    };
  }

  async getLeaderboardData(): Promise<LeaderboardData> {
    const year = FESTIVAL.CURRENT_YEAR;
    const [teams, members] = await Promise.all([
      this.ctx.repositories.teams.findByFestivalYear(year),
      this.ctx.repositories.teamMembers.findAll({ festivalYear: year, status: TeamMemberStatus.Active }),
    ]);

    const teamLeaderboard = buildTeamLeaderboard(teams);
    const rankedTeams = teamLeaderboard.map((entry) => toUiTeam(teams.find((t) => t.id === entry.id)!));
    const topPerformers = buildUiTopPerformers(buildTopPerformers(members), teams);

    return { topPerformers, teams: rankedTeams };
  }

  async getRecentActivity(limit = 10): Promise<string[]> {
    return this.ctx.activityLog.getRecent(limit);
  }
}
