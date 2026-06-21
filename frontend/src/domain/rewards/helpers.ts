import type { Reward, RewardSummary } from './entity';
import { REWARD_CATEGORY_LABELS } from './constants';
import { RewardCategory } from './enums';

export function getRewardCategoryLabel(category: RewardCategory): string {
  return REWARD_CATEGORY_LABELS[category];
}

export function isRewardAvailable(reward: Reward): boolean {
  return reward.isActive && reward.isPublished && reward.stock > 0;
}

export function canAffordReward(memberPoints: number, reward: Reward): boolean {
  return memberPoints >= reward.requiredPoints && isRewardAvailable(reward);
}

export function toRewardSummary(reward: Reward): RewardSummary {
  return {
    id: reward.id,
    name: reward.name,
    requiredPoints: reward.requiredPoints,
    category: reward.category,
    stock: reward.stock,
    isAvailable: isRewardAvailable(reward),
  };
}

export function filterAffordableRewards(
  rewards: readonly Reward[],
  memberPoints: number,
): Reward[] {
  return rewards.filter(
    (reward) => canAffordReward(memberPoints, reward),
  );
}

export function sortRewardsByPoints(
  rewards: readonly Reward[],
  direction: 'asc' | 'desc' = 'asc',
): Reward[] {
  return [...rewards].sort((a, b) =>
    direction === 'asc'
      ? a.requiredPoints - b.requiredPoints
      : b.requiredPoints - a.requiredPoints,
  );
}
