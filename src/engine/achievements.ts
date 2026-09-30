import type { AchievementBadge } from '../types/student';
import type { StudentScoreRecord } from '../types/test';

interface EvaluateBadgeParams {
  rank: number;
  overallAverage: number;
  currentForm: number;
  bestPercentage: number;
  testsCompleted: number;
  testsMissed: number;
  activeStreak: number;
  longestStreak: number;
  scores: StudentScoreRecord[];
}

export function evaluateAchievements(params: EvaluateBadgeParams): AchievementBadge[] {
  const {
    rank,
    overallAverage,
    currentForm,
    bestPercentage,
    testsCompleted,
    testsMissed,
    activeStreak,
    longestStreak,
    scores,
  } = params;

  const badges: AchievementBadge[] = [];

  // 1. 🎯 First Test
  badges.push({
    id: 'first_test',
    title: 'First Test',
    description: 'Completed your first championship test',
    icon: '🎯',
    category: 'milestone',
    isUnlocked: testsCompleted >= 1,
    progressPercentage: Math.min(100, testsCompleted * 100),
  });

  // 2. ⭐ 90% Club
  badges.push({
    id: '90_club',
    title: '90% Club',
    description: 'Scored 90% or higher on any weekly test',
    icon: '⭐',
    category: 'performance',
    isUnlocked: bestPercentage >= 90,
    progressPercentage: Math.min(100, Math.round((bestPercentage / 90) * 100)),
  });

  // 3. 💯 Perfect Score
  const hasPerfectScore = scores.some((s) => s.percentage >= 100);
  badges.push({
    id: 'perfect_score',
    title: 'Perfect Score',
    description: 'Scored 100% full marks on a test',
    icon: '💯',
    category: 'performance',
    isUnlocked: hasPerfectScore,
    progressPercentage: Math.min(100, Math.round(bestPercentage)),
  });

  // 4. 🔥 5 Test Streak
  badges.push({
    id: 'streak_5',
    title: '5 Test Streak',
    description: 'Maintained 5 consecutive tests with score ≥ 80%',
    icon: '🔥',
    category: 'streak',
    isUnlocked: longestStreak >= 5 || activeStreak >= 5,
    progressPercentage: Math.min(100, Math.round((Math.max(longestStreak, activeStreak) / 5) * 100)),
  });

  // 5. ⚡ 10 Test Streak
  badges.push({
    id: 'streak_10',
    title: '10 Test Streak',
    description: 'Legendary consistency! 10 consecutive tests ≥ 80%',
    icon: '⚡',
    category: 'streak',
    isUnlocked: longestStreak >= 10 || activeStreak >= 10,
    progressPercentage: Math.min(100, Math.round((Math.max(longestStreak, activeStreak) / 10) * 100)),
  });

  // 6. 📈 Rising Star
  // Current form is at least 4% higher than overall average, with at least 3 tests completed
  const isRisingStar = testsCompleted >= 3 && currentForm - overallAverage >= 4;
  badges.push({
    id: 'rising_star',
    title: 'Rising Star',
    description: 'Recent form is 4%+ above your historical average',
    icon: '📈',
    category: 'improvement',
    isUnlocked: isRisingStar,
    progressPercentage: isRisingStar ? 100 : Math.max(0, Math.min(95, Math.round(((currentForm - overallAverage + 4) / 8) * 100))),
  });

  // 7. 🚀 Most Improved
  // Compare average of first 3 tests vs last 3 tests
  let improvementDelta = 0;
  if (scores.length >= 6) {
    const firstThreeAvg = (scores[0].percentage + scores[1].percentage + scores[2].percentage) / 3;
    const lastThreeAvg = (scores[scores.length - 1].percentage + scores[scores.length - 2].percentage + scores[scores.length - 3].percentage) / 3;
    improvementDelta = lastThreeAvg - firstThreeAvg;
  }
  badges.push({
    id: 'most_improved',
    title: 'Most Improved',
    description: 'Gained 7%+ increase from early tests to recent form',
    icon: '🚀',
    category: 'improvement',
    isUnlocked: improvementDelta >= 7,
    progressPercentage: Math.min(100, Math.max(0, Math.round((improvementDelta / 7) * 100))),
  });

  // 8. 🛡️ Iron Consistency
  // 10 or more tests completed with 0 missed tests
  badges.push({
    id: 'iron_consistency',
    title: 'Iron Consistency',
    description: 'Attended 10+ consecutive tests without missing a single one',
    icon: '🛡️',
    category: 'milestone',
    isUnlocked: testsCompleted >= 10 && testsMissed === 0,
    progressPercentage: Math.min(100, Math.round((testsCompleted / 10) * 100)),
  });

  // 9. 🏆 Top 3 Podium
  badges.push({
    id: 'top_3',
    title: 'Podium Finisher',
    description: 'Achieved a top 3 rank on the overall championship leaderboard',
    icon: '🏆',
    category: 'performance',
    isUnlocked: rank > 0 && rank <= 3,
    progressPercentage: rank > 0 && rank <= 3 ? 100 : Math.max(0, 100 - (rank - 3) * 10),
  });

  // 10. 🥇 Rank #1 Champion
  badges.push({
    id: 'rank_1',
    title: 'Reigning Champion',
    description: 'Currently holding the prestigious Rank #1 position',
    icon: '🥇',
    category: 'performance',
    isUnlocked: rank === 1,
    progressPercentage: rank === 1 ? 100 : Math.max(0, 100 - (rank - 1) * 15),
  });

  return badges;
}
