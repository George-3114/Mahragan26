import { RewardCategory } from './enums';

export const REWARD_CATEGORY_LABELS: Readonly<Record<RewardCategory, string>> = {
  [RewardCategory.Toy]: 'Toys',
  [RewardCategory.Book]: 'Books',
  [RewardCategory.Stationery]: 'Stationery',
  [RewardCategory.Gift]: 'Gifts',
  [RewardCategory.Other]: 'Other',
};
