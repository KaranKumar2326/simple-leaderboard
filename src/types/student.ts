import type { StudentScoreRecord } from './test';

export interface StudentBase {
  studentId: string;
  name: string;
  className: string;
  section: string;
  active: boolean;
  photoUrl?: string;
}

export type RankMovementDirection = 'UP' | 'DOWN' | 'SAME' | 'NEW';

export interface RankMovement {
  direction: RankMovementDirection;
  delta: number; // positive number (e.g. 2 for UP 2, -1 for DOWN 1, 0 for SAME)
  formattedText: string; // e.g. "↑2", "↓1", "→", "NEW"
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'performance' | 'streak' | 'improvement' | 'milestone';
  isUnlocked: boolean;
  unlockedAtTestNumber?: number;
  progressPercentage?: number; // 0 to 100 towards unlock
}

export interface StudentStats extends StudentBase {
  rank: number;
  overallAverage: number; // calculated average % across completed tests
  currentForm: number; // average % of last 3 completed tests
  bestPercentage: number;
  lowestPercentage: number;
  testsCompleted: number;
  testsMissed: number;
  activeStreak: number; // consecutive tests >= 80% leading up to latest test
  longestStreak: number;
  rankMovement: RankMovement;
  isProvisional: boolean; // true if testsCompleted < provisional threshold (e.g. 3)
  scores: StudentScoreRecord[]; // sorted chronologically by testNumber
  achievements: AchievementBadge[];
  recentChange: number; // form vs overall average delta
  perfectScoresCount: number; // number of 100% scores
}

export interface ValidationIssue {
  type: 'STUDENT_UNKNOWN' | 'TEST_UNKNOWN' | 'MARKS_EXCEEDED' | 'NEGATIVE_MARKS' | 'DUPLICATE' | 'MISSING_DATA';
  message: string;
  rawRowIndex?: number;
  rowDetails?: Record<string, unknown>;
}
