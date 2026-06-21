import {
  aggregateTeamCategoryBreakdown,
  TeamScoreCategory,
} from '../scoring';
import type { TeamScore, TeamScoreSummary } from './entity';
import { ScoreEntryType } from '../scoring';

export function summarizeTeamScores(
  scores: readonly TeamScore[],
): TeamScoreSummary {
  if (scores.length === 0) {
    return {
      teamId: '',
      totalPoints: 0,
      penaltyTotal: 0,
      awardTotal: 0,
      entryCount: 0,
    };
  }

  let awardTotal = 0;
  let penaltyTotal = 0;

  for (const score of scores) {
    if (score.isPenalty || score.entryType === ScoreEntryType.Penalty) {
      penaltyTotal += Math.abs(score.points);
    } else {
      awardTotal += score.points;
    }
  }

  const teamScoreEntries = scores
    .filter((score): score is TeamScore & { category: TeamScoreCategory } =>
      Object.values(TeamScoreCategory).includes(score.category as TeamScoreCategory),
    )
    .map((score) => ({
      category: score.category,
      points: score.points,
      isPenalty: score.isPenalty,
    }));

  const breakdown = aggregateTeamCategoryBreakdown(teamScoreEntries);

  return {
    teamId: scores[0].teamId,
    totalPoints:
      breakdown.quiz +
      breakdown.liturgy +
      breakdown.sports +
      breakdown.hymn +
      breakdown.psalm -
      breakdown.penalty,
    penaltyTotal,
    awardTotal,
    entryCount: scores.length,
  };
}

export function filterTeamScoresByTeam(
  scores: readonly TeamScore[],
  teamId: string,
): TeamScore[] {
  return scores.filter((score) => score.teamId === teamId);
}

export function isTeamPenaltyScore(score: TeamScore): boolean {
  return score.isPenalty || score.entryType === ScoreEntryType.Penalty;
}

export function sortTeamScoresByDateDesc(
  scores: readonly TeamScore[],
): TeamScore[] {
  return [...scores].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
