import { AdminService } from './admin/adminService';
import { ApplicationContext } from './context';
import { AnnouncementService } from './services/announcementService';
import { AttendanceService } from './services/attendanceService';
import { BadgeService } from './services/badgeService';
import { FestivalService } from './services/festivalService';
import { MaterialService } from './services/materialService';
import { QuizService } from './services/quizService';
import { RewardService } from './services/rewardService';
import { ScoreService } from './services/scoreService';
import { TeamService } from './services/teamService';
import { createApiRepositories } from '../infrastructure/repositories/api/createApiRepositories';
export interface AppServices {
  festival: FestivalService;
  teams: TeamService;
  scores: ScoreService;
  attendance: AttendanceService;
  rewards: RewardService;
  materials: MaterialService;
  announcements: AnnouncementService;
  quizzes: QuizService;
  badges: BadgeService;
  admin: AdminService;
  context: ApplicationContext;
}

let servicesInstance: AppServices | null = null;

function buildServices(ctx: ApplicationContext): AppServices {
  const scores = new ScoreService(ctx);
  return {
    festival: new FestivalService(ctx),
    teams: new TeamService(ctx),
    scores,
    attendance: new AttendanceService(ctx, scores),
    rewards: new RewardService(ctx),
    materials: new MaterialService(ctx),
    announcements: new AnnouncementService(ctx),
    quizzes: new QuizService(ctx),
    badges: new BadgeService(ctx),
    admin: new AdminService(ctx),
    context: ctx,
  };
}

export function initApplication(): AppServices {
  const repositories = createApiRepositories();
  const ctx = new ApplicationContext(repositories);
  servicesInstance = buildServices(ctx);
  return servicesInstance;
}

export function getServices(): AppServices {
  if (!servicesInstance) {
    return initApplication();
  }
  return servicesInstance;
}

export function resetApplication(): void {
  servicesInstance = null;
}
