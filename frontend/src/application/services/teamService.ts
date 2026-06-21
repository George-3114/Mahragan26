import { FESTIVAL, buildTeamLeaderboard, findTeamById } from '../../domain';
import type { Team, TeamFilter } from '../../domain';
import type { ApplicationContext } from '../context';
import { toUiTeam } from '../mappers';
import type { Team as UiTeam } from '../../types';

export class TeamService {
  constructor(private readonly ctx: ApplicationContext) {}

  async getAllTeams(): Promise<Team[]> {
    return this.ctx.repositories.teams.findByFestivalYear(FESTIVAL.CURRENT_YEAR);
  }

  async getTeamsForDisplay(): Promise<UiTeam[]> {
    const teams = await this.getAllTeams();
    return buildTeamLeaderboard(teams).map((entry) =>
      toUiTeam(teams.find((t) => t.id === entry.id)!),
    );
  }

  async getTeamById(teamId: string): Promise<Team | null> {
    return this.ctx.repositories.teams.findById(teamId);
  }

  async findTeams(filter?: TeamFilter): Promise<Team[]> {
    return this.ctx.repositories.teams.findAll(filter);
  }

  async updateTeamPoints(teamId: string, totalPoints: number, categoryPoints: Team['categoryPoints']): Promise<Team | null> {
    const updated = await this.ctx.repositories.teams.update(teamId, {
      totalPoints,
      categoryPoints,
    });
    if (updated) this.ctx.notifyChange();
    return updated;
  }
}

export { findTeamById };
