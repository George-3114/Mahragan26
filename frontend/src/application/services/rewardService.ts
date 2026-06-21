import type { CreateInput, Reward, RewardRedemption } from '../../domain';
import { RewardRedemptionStatus } from '../../domain';
import type { ApplicationContext } from '../context';
import { nextId, now } from '../../infrastructure/repositories/mock/baseMockRepository';

export class RewardService {
  private redemptions: RewardRedemption[] = [];

  constructor(private readonly ctx: ApplicationContext) {}

  async getAll(): Promise<Reward[]> {
    return this.ctx.repositories.rewards.findAll({ isActive: true, isPublished: true });
  }

  async getById(id: string): Promise<Reward | null> {
    return this.ctx.repositories.rewards.findById(id);
  }

  async createReward(data: CreateInput<Reward>): Promise<Reward> {
    const reward = await this.ctx.repositories.rewards.create(data);
    this.ctx.activityLog.add(`Reward "${reward.name}" created`);
    this.ctx.notifyChange();
    return reward;
  }

  async updateReward(id: string, data: Partial<Reward>): Promise<Reward | null> {
    const reward = await this.ctx.repositories.rewards.update(id, data);
    if (reward) {
      this.ctx.activityLog.add(`Reward "${reward.name}" updated`);
      this.ctx.notifyChange();
    }
    return reward;
  }

  async adjustStock(id: string, delta: number): Promise<Reward | null> {
    const reward = await this.ctx.repositories.rewards.findById(id);
    if (!reward) return null;
    return this.updateReward(id, { stock: Math.max(0, reward.stock + delta) });
  }

  async getRedemptionsByMember(memberId: string): Promise<RewardRedemption[]> {
    return this.redemptions.filter((r) => r.memberId === memberId);
  }

  async redeemReward(
    rewardId: string,
    memberId: string,
    userId: string,
  ): Promise<RewardRedemption> {
    const reward = await this.getById(rewardId);
    if (!reward || !reward.isActive || !reward.isPublished) {
      throw new Error('Reward is not available');
    }
    if (reward.stock <= 0) {
      throw new Error('Reward is out of stock');
    }

    const member = await this.ctx.repositories.teamMembers.findById(memberId);
    if (!member) {
      throw new Error('Member not found');
    }
    if (member.totalPoints < reward.requiredPoints) {
      throw new Error('Insufficient points');
    }

    await this.ctx.repositories.teamMembers.update(memberId, {
      totalPoints: member.totalPoints - reward.requiredPoints,
    });
    await this.updateReward(rewardId, { stock: reward.stock - 1 });

    const timestamp = now();
    const redemption: RewardRedemption = {
      id: nextId(),
      rewardId,
      memberId,
      userId,
      pointsSpent: reward.requiredPoints,
      status: RewardRedemptionStatus.Pending,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.redemptions.push(redemption);
    this.ctx.activityLog.add(`${member.displayName} redeemed "${reward.name}"`);
    this.ctx.notifyChange();
    return redemption;
  }
}
