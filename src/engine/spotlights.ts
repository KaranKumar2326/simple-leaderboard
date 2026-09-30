import type { StudentStats } from '../types/student';

export interface ClosestBattlePair {
  studentA: StudentStats;
  studentB: StudentStats;
  difference: number;
}

export interface SpotlightsData {
  hotStreaks: StudentStats[];
  risingStars: StudentStats[];
  mostImproved: StudentStats[];
  perfectScores: { student: StudentStats; perfectCount: number }[];
  closestBattle: ClosestBattlePair | null;
}

export function computeSpotlights(students: StudentStats[]): SpotlightsData {
  // Only evaluate ranked students with at least 1 test completed
  const eligible = students.filter((s) => s.testsCompleted > 0 && !s.isProvisional);

  // 1. Hot Streak: sorted by activeStreak descending, at least activeStreak >= 3
  const hotStreaks = [...eligible]
    .filter((s) => s.activeStreak >= 3)
    .sort((a, b) => b.activeStreak - a.activeStreak || b.overallAverage - a.overallAverage)
    .slice(0, 5);

  // 2. Rising Stars: currentForm - overallAverage is highest (recent surge)
  const risingStars = [...eligible]
    .filter((s) => s.testsCompleted >= 3 && s.recentChange > 1.5)
    .sort((a, b) => b.recentChange - a.recentChange)
    .slice(0, 5);

  // 3. Most Improved: highest improvement delta from first tests to last tests
  const mostImproved = [...eligible]
    .filter((s) => s.scores.length >= 4)
    .map((student) => {
      const scores = student.scores;
      const earlyTestsCount = Math.min(3, Math.floor(scores.length / 2));
      const firstAvg = scores.slice(0, earlyTestsCount).reduce((sum, s) => sum + s.percentage, 0) / earlyTestsCount;
      const recentAvg = scores.slice(-earlyTestsCount).reduce((sum, s) => sum + s.percentage, 0) / earlyTestsCount;
      const delta = Number((recentAvg - firstAvg).toFixed(2));
      return { student, delta };
    })
    .filter((item) => item.delta > 2)
    .sort((a, b) => b.delta - a.delta)
    .map((item) => item.student)
    .slice(0, 5);

  // 4. Perfect Scores (100% achieved)
  const perfectScores = eligible
    .filter((s) => s.perfectScoresCount > 0)
    .map((s) => ({ student: s, perfectCount: s.perfectScoresCount }))
    .sort((a, b) => b.perfectCount - a.perfectCount || b.student.overallAverage - a.student.overallAverage);

  // 5. Closest Battle: Find adjacent students on leaderboard with minimal gap
  let minDiff = Infinity;
  let closestPair: ClosestBattlePair | null = null;

  for (let i = 0; i < eligible.length - 1; i++) {
    const sA = eligible[i];
    const sB = eligible[i + 1];
    const diff = Number(Math.abs(sA.overallAverage - sB.overallAverage).toFixed(2));

    if (diff < minDiff && sA.testsCompleted >= 3 && sB.testsCompleted >= 3) {
      minDiff = diff;
      closestPair = {
        studentA: sA,
        studentB: sB,
        difference: diff,
      };
    }
  }

  return {
    hotStreaks,
    risingStars,
    mostImproved,
    perfectScores,
    closestBattle: closestPair,
  };
}
