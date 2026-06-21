import {
  FESTIVAL,
  IndividualScoreCategory,
  PenaltyType,
  ScoreEntryType,
  TeamScoreCategory,
  getDefaultPoints,
} from '../../domain';
import type {
  AwardIndividualScoreInput,
  AwardTeamScoreInput,
  IndividualScore,
  TeamScore,
} from '../../domain';
import type { ApplicationContext } from '../context';

export class ScoreService {
  constructor(private readonly ctx: ApplicationContext) {}

  async getIndividualScoresByMember(memberId: string): Promise<IndividualScore[]> {
    return this.ctx.repositories.individualScores.findByMemberId(memberId);
  }

  async getTeamScoresByTeam(teamId: string): Promise<TeamScore[]> {
    return this.ctx.repositories.teamScores.findByTeamId(teamId);
  }

  async addIndividualScore(input: Omit<AwardIndividualScoreInput, 'festivalYear'>): Promise<IndividualScore> {
    const isPenalty = input.entryType === ScoreEntryType.Penalty;
    const score = await this.ctx.repositories.individualScores.create({
      ...input,
      festivalYear: FESTIVAL.CURRENT_YEAR,
      isPenalty,
    });

    await this.applyMemberPointsDelta(input.memberId, isPenalty ? -input.points : input.points);
    this.ctx.notifyChange();
    return score;
  }

  async addTeamScore(input: Omit<AwardTeamScoreInput, 'festivalYear'>): Promise<TeamScore> {
    const isPenalty = input.entryType === ScoreEntryType.Penalty;
    const score = await this.ctx.repositories.teamScores.create({
      ...input,
      festivalYear: FESTIVAL.CURRENT_YEAR,
      isPenalty,
    });

    await this.applyTeamPointsDelta(input.teamId, input.category, input.points, isPenalty);
    this.ctx.notifyChange();
    return score;
  }

  async applyIndividualPenalty(
    memberId: string,
    userId: string,
    teamId: string,
    penaltyType: PenaltyType,
    awardedById: string,
    description?: string,
  ): Promise<IndividualScore> {
    const points = getDefaultPoints(penaltyType);
    return this.addIndividualScore({
      memberId,
      userId,
      teamId,
      category: penaltyType,
      entryType: ScoreEntryType.Penalty,
      points,
      description: description ?? `Penalty: ${penaltyType}`,
      awardedById,
    });
  }

  async applyTeamPenalty(
    teamId: string,
    penaltyType: PenaltyType,
    awardedById: string,
    description?: string,
  ): Promise<TeamScore> {
    const points = getDefaultPoints(penaltyType);
    return this.addTeamScore({
      teamId,
      category: penaltyType,
      entryType: ScoreEntryType.Penalty,
      points,
      description: description ?? `Team penalty: ${penaltyType}`,
      awardedById,
    });
  }

  async awardCategoryScore(
    memberId: string,
    userId: string,
    teamId: string,
    category: IndividualScoreCategory,
    awardedById: string,
    points?: number,
    description?: string,
    activityId?: string,
  ): Promise<IndividualScore> {
    return this.addIndividualScore({
      memberId,
      userId,
      teamId,
      category,
      entryType: ScoreEntryType.Award,
      points: points ?? getDefaultPoints(category),
      description: description ?? category,
      awardedById,
      activityId,
    });
  }

  async awardTeamCategoryScore(
    teamId: string,
    category: TeamScoreCategory,
    awardedById: string,
    points?: number,
    description?: string,
    activityId?: string,
  ): Promise<TeamScore> {
    return this.addTeamScore({
      teamId,
      category,
      entryType: ScoreEntryType.Award,
      points: points ?? getDefaultPoints(category),
      description: description ?? category,
      awardedById,
      activityId,
    });
  }

  private async applyMemberPointsDelta(memberId: string, delta: number): Promise<void> {
    const member = await this.ctx.repositories.teamMembers.findById(memberId);
    if (!member) return;
    await this.ctx.repositories.teamMembers.update(memberId, {
      totalPoints: Math.max(0, member.totalPoints + delta),
    });
  }

  private async applyTeamPointsDelta(
    teamId: string,
    category: TeamScoreCategory | PenaltyType,
    points: number,
    isPenalty: boolean,
  ): Promise<void> {
    const team = await this.ctx.repositories.teams.findById(teamId);
    if (!team) return;

    const breakdown = { ...team.categoryPoints };
    const signedPoints = isPenalty ? -Math.abs(points) : points;

    const categoryKeyMap: Partial<Record<TeamScoreCategory, keyof typeof breakdown>> = {
      [TeamScoreCategory.Quiz]: 'quiz',
      [TeamScoreCategory.LiturgyAttendance]: 'liturgy',
      [TeamScoreCategory.SportsCompetition]: 'sports',
      [TeamScoreCategory.HymnMemorization]: 'hymn',
      [TeamScoreCategory.PsalmMemorization]: 'psalm',
    };

    const breakdownKey = categoryKeyMap[category as TeamScoreCategory];
    if (breakdownKey && breakdownKey !== 'penalty') {
      breakdown[breakdownKey] = Math.max(0, breakdown[breakdownKey] + signedPoints);
    } else if (isPenalty) {
      breakdown.penalty += Math.abs(points);
    }

    const gross =
      breakdown.quiz +
      breakdown.liturgy +
      breakdown.sports +
      breakdown.hymn +
      breakdown.psalm;

    await this.ctx.repositories.teams.update(teamId, {
      categoryPoints: breakdown,
      totalPoints: Math.max(0, gross - breakdown.penalty),
    });
  }
}

export { IndividualScoreCategory, TeamScoreCategory, PenaltyType };
