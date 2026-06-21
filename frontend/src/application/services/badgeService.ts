import {
  findEligibleBadges,
  type Badge,
  type BadgeEligibilityContext,
  type MemberBadge,
} from '../../domain';
import type { ApplicationContext } from '../context';
import { nextId, now } from '../../infrastructure/repositories/mock/baseMockRepository';

export class BadgeService {
  private memberBadges: MemberBadge[] = [];

  constructor(private readonly ctx: ApplicationContext) {}

  async getAll(): Promise<Badge[]> {
    return this.ctx.repositories.badges.findAll({ isActive: true });
  }

  async getById(id: string): Promise<Badge | null> {
    return this.ctx.repositories.badges.findById(id);
  }

  async getMemberBadges(memberId: string): Promise<MemberBadge[]> {
    return this.memberBadges.filter((b) => b.memberId === memberId);
  }

  async checkEligibility(
    context: BadgeEligibilityContext,
    earnedBadgeIds: string[],
  ): Promise<Badge[]> {
    const badges = await this.getAll();
    return findEligibleBadges(badges, context, new Set(earnedBadgeIds));
  }

  async awardBadge(
    badgeId: string,
    memberId: string,
    userId: string,
    awardedById?: string,
  ): Promise<MemberBadge> {
    const badge = await this.getById(badgeId);
    if (!badge) throw new Error('Badge not found');

    const timestamp = now();
    const memberBadge: MemberBadge = {
      id: nextId(),
      badgeId,
      memberId,
      userId,
      earnedAt: timestamp,
      awardedById,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.memberBadges.push(memberBadge);
    this.ctx.activityLog.add(`Badge "${badge.name}" awarded`);
    this.ctx.notifyChange();
    return memberBadge;
  }
}
