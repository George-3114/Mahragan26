import type { Badge, BadgeEligibilityContext, BadgeSummary, MemberBadge } from './entity';
import { BADGE_CATEGORY_LABELS } from './constants';
import { BadgeCategory, BadgeCriteriaType } from './enums';

export function getBadgeCategoryLabel(category: BadgeCategory): string {
  return BADGE_CATEGORY_LABELS[category];
}

export function toBadgeSummary(badge: Badge): BadgeSummary {
  return {
    id: badge.id,
    name: badge.name,
    icon: badge.icon,
    color: badge.color,
    category: badge.category,
    pointsBonus: badge.pointsBonus,
  };
}

export function isBadgeEligible(
  badge: Badge,
  context: BadgeEligibilityContext,
): boolean {
  if (!badge.isActive) return false;

  const { criteria } = badge;
  const threshold = criteria.threshold ?? 0;

  switch (criteria.type) {
    case BadgeCriteriaType.PointsThreshold:
      return context.totalPoints >= threshold;
    case BadgeCriteriaType.RankThreshold:
      return context.rank !== undefined && context.rank <= threshold;
    case BadgeCriteriaType.AttendanceStreak:
      return (
        context.attendanceStreak !== undefined &&
        context.attendanceStreak >= threshold
      );
    case BadgeCriteriaType.QuizPerfectScore:
      return (
        context.perfectQuizCount !== undefined &&
        context.perfectQuizCount >= threshold
      );
    case BadgeCriteriaType.Manual:
      return false;
    default:
      return false;
  }
}

export function findEligibleBadges(
  badges: readonly Badge[],
  context: BadgeEligibilityContext,
  earnedBadgeIds: ReadonlySet<string>,
): Badge[] {
  return badges.filter(
    (badge) => !earnedBadgeIds.has(badge.id) && isBadgeEligible(badge, context),
  );
}

export function calculateBadgeBonusPoints(
  memberBadges: readonly MemberBadge[],
  badges: readonly Badge[],
): number {
  const badgeMap = new Map(badges.map((b) => [b.id, b]));
  return memberBadges.reduce((total, memberBadge) => {
    const badge = badgeMap.get(memberBadge.badgeId);
    return total + (badge?.pointsBonus ?? 0);
  }, 0);
}

export function groupBadgesByCategory(
  badges: readonly Badge[],
): Record<BadgeCategory, Badge[]> {
  const grouped = Object.values(BadgeCategory).reduce(
    (acc, category) => {
      acc[category] = [];
      return acc;
    },
    {} as Record<BadgeCategory, Badge[]>,
  );

  for (const badge of badges) {
    grouped[badge.category].push(badge);
  }

  return grouped;
}
