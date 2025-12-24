
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  class?: string;
}

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: 'MULTIPLE_CHOICE' | 'ESSAY';
  content: string;
  options?: Option[];
  correctAnswer: string; // For MC: the ID of option. For Essay: Sample answer.
  points: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  startTime: number;
  endTime?: number;
  mcAnswers: Record<string, string>; // questionId -> optionId
  essayAnswers: Record<string, string>; // questionId -> student text
  score: number;
  status: 'COMPLETED' | 'IN_PROGRESS';
}

export interface QuestionBank {
  title: string;
  mcQuestions: Question[];
  essayQuestions: Question[];
}
