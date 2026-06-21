import type { Timestamp } from '../common';
import {
  calculateQuizAwardPoints,
  calculateQuizScorePercent,
  isQuizPassing,
  DEFAULT_SCORING_CONFIG,
} from '../scoring';
import type {
  GradeQuizAttemptInput,
  GradeQuizAttemptResult,
  Quiz,
  QuizAnswer,
  QuizQuestion,
} from './entity';
import { QuizAttemptStatus } from './enums';

function buildQuizScoringConfig(quiz: Quiz) {
  return {
    ...DEFAULT_SCORING_CONFIG,
    quizPassingScorePercent: quiz.passingScorePercent,
  };
}

export function isQuizOpen(
  quiz: Quiz,
  now: Timestamp = new Date().toISOString(),
): boolean {
  if (!quiz.isPublished) return false;
  const current = new Date(now).getTime();
  return (
    current >= new Date(quiz.startDate).getTime() &&
    current <= new Date(quiz.endDate).getTime()
  );
}

export function getQuizQuestionCount(quiz: Quiz): number {
  return quiz.questions.length;
}

export function gradeQuizAttempt(input: GradeQuizAttemptInput): GradeQuizAttemptResult {
  const { quiz, selectedAnswers } = input;
  const config = buildQuizScoringConfig(quiz);

  const answers: QuizAnswer[] = quiz.questions.map((question) => {
    const selectedAnswer = selectedAnswers[question.id] ?? '';
    const isCorrect = selectedAnswer === question.correctAnswer;
    return {
      questionId: question.id,
      selectedAnswer,
      isCorrect,
      pointsAwarded: isCorrect ? question.points : 0,
    };
  });

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const scorePercent = calculateQuizScorePercent(correctCount, quiz.questions.length);
  const passed = isQuizPassing(scorePercent, config);
  const pointsEarned = passed
    ? calculateQuizAwardPoints(scorePercent, quiz.totalPoints, config)
    : 0;

  return { answers, correctCount, scorePercent, pointsEarned, passed };
}

export function validateQuizQuestion(question: QuizQuestion): boolean {
  if (!question.questionText.trim()) return false;
  if (question.points <= 0) return false;
  if (!question.correctAnswer.trim()) return false;
  if (question.type === 'multiple' && question.options.length < 2) return false;
  return true;
}

export function calculateQuizTotalPoints(questions: readonly QuizQuestion[]): number {
  return questions.reduce((sum, q) => sum + q.points, 0);
}

export function filterOpenQuizzes(
  quizzes: readonly Quiz[],
  now?: Timestamp,
): Quiz[] {
  return quizzes.filter((quiz) => isQuizOpen(quiz, now));
}

export function isAttemptComplete(status: QuizAttemptStatus): boolean {
  return (
    status === QuizAttemptStatus.Submitted ||
    status === QuizAttemptStatus.Graded
  );
}
