import { ScoreEntryType } from '../scoring';
import type { IndividualScore, IndividualScoreSummary } from './entity';

export function summarizeIndividualScores(
  scores: readonly IndividualScore[],
): IndividualScoreSummary {
  if (scores.length === 0) {
    return {
      memberId: '',
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

  return {
    memberId: scores[0].memberId,
    totalPoints: Math.max(0, awardTotal - penaltyTotal),
    penaltyTotal,
    awardTotal,
    entryCount: scores.length,
  };
}

export function filterScoresByMember(
  scores: readonly IndividualScore[],
  memberId: string,
): IndividualScore[] {
  return scores.filter((score) => score.memberId === memberId);
}

export function filterScoresByTeam(
  scores: readonly IndividualScore[],
  teamId: string,
): IndividualScore[] {
  return scores.filter((score) => score.teamId === teamId);
}

export function isPenaltyScore(score: IndividualScore): boolean {
  return score.isPenalty || score.entryType === ScoreEntryType.Penalty;
}

export function sortScoresByDateDesc(
  scores: readonly IndividualScore[],
): IndividualScore[] {
  return [...scores].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
