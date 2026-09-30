export interface Prize {
  prizeId: string;
  name: string;
  requiredRank: number;
  requiredTests: number;
  status: 'LOCKED' | 'UNLOCKED';
  description?: string;
  revealedName?: string;
  icon?: string;
}

export interface ChampionshipStatus {
  season: string;
  totalRequiredTests: number;
  completedTests: number;
  remainingTests: number;
  isCompleted: boolean;
  topRankers: {
    champion?: { studentId: string; name: string; percentage: number };
    runnerUp?: { studentId: string; name: string; percentage: number };
    thirdPlace?: { studentId: string; name: string; percentage: number };
  };
  prizes: Prize[];
}
