import type { EntityId, AuditableEntity, Publishable, Timestamp } from '../common';
import { QuizAttemptStatus, QuizQuestionType } from './enums';

export interface QuizQuestion {
  readonly id: EntityId;
  readonly questionText: string;
  readonly type: QuizQuestionType;
  readonly options: readonly string[];
  readonly correctAnswer: string;
  readonly points: number;
  readonly order: number;
}

export interface Quiz extends AuditableEntity, Publishable {
  readonly title: string;
  readonly description: string;
  readonly questions: readonly QuizQuestion[];
  readonly totalPoints: number;
  readonly timeLimitMinutes: number;
  readonly passingScorePercent: number;
  readonly startDate: Timestamp;
  readonly endDate: Timestamp;
  readonly createdById: EntityId;
}

export interface QuizAnswer {
  readonly questionId: EntityId;
  readonly selectedAnswer: string;
  readonly isCorrect: boolean;
  readonly pointsAwarded: number;
}

export interface QuizAttempt extends AuditableEntity {
  readonly quizId: EntityId;
  readonly memberId: EntityId;
  readonly userId: EntityId;
  readonly status: QuizAttemptStatus;
  readonly answers: readonly QuizAnswer[];
  readonly scorePercent: number;
  readonly pointsEarned: number;
  readonly startedAt: Timestamp;
  readonly submittedAt?: Timestamp;
}

export interface QuizSummary {
  readonly id: EntityId;
  readonly title: string;
  readonly totalPoints: number;
  readonly timeLimitMinutes: number;
  readonly isOpen: boolean;
}

export interface QuizFilter {
  readonly isPublished?: boolean;
  readonly isOpen?: boolean;
}

export interface GradeQuizAttemptInput {
  readonly quiz: Quiz;
  readonly selectedAnswers: Readonly<Record<EntityId, string>>;
}

export interface GradeQuizAttemptResult {
  readonly answers: QuizAnswer[];
  readonly correctCount: number;
  readonly scorePercent: number;
  readonly pointsEarned: number;
  readonly passed: boolean;
}
