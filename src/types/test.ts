export type TestDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface TestInfo {
  testId: string;
  date: string;
  testName: string;
  subject: string;
  targetClass: string;
  totalMarks: number;
  difficulty: TestDifficulty;
  testNumber: number;
  season: string;
}

export interface StudentScoreRecord {
  testId: string;
  studentId: string;
  marksScored: number;
  totalMarks: number;
  percentage: number;
  testNumber: number;
  date: string;
  testName: string;
  subject: string;
  difficulty: TestDifficulty;
  timestamp?: string;
  isInvalid?: boolean;
  validationError?: string;
}

export interface TestSummaryStats {
  test: TestInfo;
  participantsCount: number;
  highestMarks: number;
  highestPercentage: number;
  averageMarks: number;
  averagePercentage: number;
  lowestMarks: number;
}
