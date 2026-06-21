import type { CreateInput, Quiz, QuizQuestion } from '../../domain';
import { calculateQuizTotalPoints } from '../../domain';
import type { ApplicationContext } from '../context';

export interface CreateQuizInput {
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimitMinutes: number;
  passingScorePercent: number;
  startDate: string;
  endDate: string;
  createdById: string;
  publish?: boolean;
}

export class QuizService {
  constructor(private readonly ctx: ApplicationContext) {}

  async getAll(): Promise<Quiz[]> {
    return this.ctx.repositories.quizzes.findAll();
  }

  async getPublished(): Promise<Quiz[]> {
    return this.ctx.repositories.quizzes.findAll({ isPublished: true });
  }

  async getById(id: string): Promise<Quiz | null> {
    return this.ctx.repositories.quizzes.findById(id);
  }

  async createQuiz(input: CreateQuizInput): Promise<Quiz> {
    const now = new Date().toISOString();
    const totalPoints = calculateQuizTotalPoints(input.questions);
    const quiz = await this.ctx.repositories.quizzes.create({
      title: input.title,
      description: input.description,
      questions: input.questions,
      totalPoints,
      timeLimitMinutes: input.timeLimitMinutes,
      passingScorePercent: input.passingScorePercent,
      startDate: input.startDate,
      endDate: input.endDate,
      createdById: input.createdById,
      isPublished: input.publish ?? false,
      publishedAt: input.publish ? now : undefined,
    } as CreateInput<Quiz>);

    this.ctx.activityLog.add(`Quiz "${quiz.title}" created`);
    this.ctx.notifyChange();
    return quiz;
  }

  async publishQuiz(id: string): Promise<Quiz | null> {
    const quiz = await this.ctx.repositories.quizzes.update(id, {
      isPublished: true,
      publishedAt: new Date().toISOString(),
    });
    if (quiz) {
      this.ctx.activityLog.add(`Quiz "${quiz.title}" published`);
      this.ctx.notifyChange();
    }
    return quiz;
  }
}
