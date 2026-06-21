import type { FestivalRepositories } from '../../../domain/ports';
import { createMockRepositories } from '../mock/mockRepositories';
import { ApiAnnouncementRepository } from './apiAnnouncementRepository';
import { ApiAttendanceRepository } from './apiAttendanceRepository';
import { ApiIndividualScoreRepository } from './apiIndividualScoreRepository';
import { ApiMaterialRepository } from './apiMaterialRepository';
import { ApiQrSessionRepository } from './apiQrSessionRepository';
import { ApiRewardRepository } from './apiRewardRepository';
import { ApiTeamMemberRepository } from './apiTeamMemberRepository';
import { ApiTeamRepository } from './apiTeamRepository';
import { ApiTeamScoreRepository } from './apiTeamScoreRepository';

export function createApiRepositories(): FestivalRepositories {
  const mockRepositories = createMockRepositories();

  return {
    teams: new ApiTeamRepository(),
    announcements: new ApiAnnouncementRepository(),
    rewards: new ApiRewardRepository(),
    materials: new ApiMaterialRepository(),
    attendance: new ApiAttendanceRepository(),
    qrSessions: new ApiQrSessionRepository(),
    individualScores: new ApiIndividualScoreRepository(),
    teamScores: new ApiTeamScoreRepository(),
    teamMembers: new ApiTeamMemberRepository(),
    activities: mockRepositories.activities,
    quizzes: mockRepositories.quizzes,
    badges: mockRepositories.badges,
  };
}
