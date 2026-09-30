import type { StudentBase, StudentStats, RankMovement } from '../types/student';
import type { TestInfo, StudentScoreRecord } from '../types/test';
import { evaluateAchievements } from './achievements';

interface ComputeLeaderboardOptions {
  streakThresholdPercent?: number; // default 80
  provisionalMinTests?: number; // default 3
}

export function computeStudentStatistics(
  students: Map<string, StudentBase>,
  tests: Map<string, TestInfo>,
  scoreRecords: StudentScoreRecord[],
  options: ComputeLeaderboardOptions = {}
): StudentStats[] {
  const streakThreshold = options.streakThresholdPercent ?? 80;
  const provisionalMin = options.provisionalMinTests ?? 3;

  // Filter to active students only
  const activeStudents = Array.from(students.values()).filter((s) => s.active);

  // Group scores by studentId
  const scoresByStudent = new Map<string, StudentScoreRecord[]>();
  scoreRecords.forEach((record) => {
    if (!scoresByStudent.has(record.studentId)) {
      scoresByStudent.set(record.studentId, []);
    }
    scoresByStudent.get(record.studentId)!.push(record);
  });


  // Helper to compute raw stats for a specific subset of scores
  const computeStatsForScores = (studentScores: StudentScoreRecord[], totalApplicableTests: number) => {
    // Sort scores chronologically by testNumber
    const sortedScores = [...studentScores].sort((a, b) => a.testNumber - b.testNumber);
    const testsCompleted = sortedScores.length;
    const testsMissed = Math.max(0, totalApplicableTests - testsCompleted);

    if (testsCompleted === 0) {
      return {
        overallAverage: 0,
        currentForm: 0,
        bestPercentage: 0,
        lowestPercentage: 0,
        testsCompleted: 0,
        testsMissed: totalApplicableTests,
        activeStreak: 0,
        longestStreak: 0,
        perfectScoresCount: 0,
        sortedScores: [],
      };
    }

    // Overall Average = sum of percentages / completed tests
    const sumPercentages = sortedScores.reduce((sum, s) => sum + s.percentage, 0);
    const overallAverage = Number((sumPercentages / testsCompleted).toFixed(2));

    // Current Form = average percentage of last 3 completed tests
    const last3Scores = sortedScores.slice(-3);
    const sumLast3 = last3Scores.reduce((sum, s) => sum + s.percentage, 0);
    const currentForm = Number((sumLast3 / last3Scores.length).toFixed(2));

    // Best and lowest
    const percentages = sortedScores.map((s) => s.percentage);
    const bestPercentage = Math.max(...percentages);
    const lowestPercentage = Math.min(...percentages);

    // Streaks (score >= streakThreshold)
    // Active streak: count consecutive tests >= threshold starting backwards from the most recent test
    let activeStreak = 0;
    for (let i = sortedScores.length - 1; i >= 0; i--) {
      if (sortedScores[i].percentage >= streakThreshold) {
        activeStreak++;
      } else {
        break;
      }
    }

    // Longest streak across all history
    let longestStreak = 0;
    let tempStreak = 0;
    sortedScores.forEach((s) => {
      if (s.percentage >= streakThreshold) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    });

    const perfectScoresCount = sortedScores.filter((s) => s.percentage >= 100).length;

    return {
      overallAverage,
      currentForm,
      bestPercentage,
      lowestPercentage,
      testsCompleted,
      testsMissed,
      activeStreak,
      longestStreak,
      perfectScoresCount,
      sortedScores,
    };
  };

  // Determine applicable tests for each class
  const getApplicableTestsCount = (className: string, upToTestNumber?: number) => {
    return Array.from(tests.values()).filter((t) => {
      const matchClass = !t.targetClass || t.targetClass === className || t.targetClass === 'All';
      const matchNumber = upToTestNumber ? t.testNumber <= upToTestNumber : true;
      return matchClass && matchNumber;
    }).length;
  };

  // 1. Calculate stats up to previous test (to compute rank movement)
  // Determine the second to last test number that has results
  const allTestNumbers = Array.from(new Set(scoreRecords.map((r) => r.testNumber))).sort((a, b) => a - b);
  const latestTestNumber = allTestNumbers.length > 0 ? allTestNumbers[allTestNumbers.length - 1] : 0;
  const previousTestNumber = allTestNumbers.length > 1 ? allTestNumbers[allTestNumbers.length - 2] : 0;

  // Previous ranks map: studentId -> rank
  const previousRanks = new Map<string, number>();

  if (previousTestNumber > 0) {
    const prevStudentStats = activeStudents.map((student) => {
      const allStudentScores = scoresByStudent.get(student.studentId) || [];
      const prevScores = allStudentScores.filter((s) => s.testNumber <= previousTestNumber);
      const applicableCount = getApplicableTestsCount(student.className, previousTestNumber);
      const computed = computeStatsForScores(prevScores, applicableCount);
      return {
        studentId: student.studentId,
        className: student.className,
        overallAverage: computed.overallAverage,
        currentForm: computed.currentForm,
        bestPercentage: computed.bestPercentage,
        testsCompleted: computed.testsCompleted,
      };
    });

    // Rank previous stats by class or globally
    // We sort with tie breakers:
    // 1. overallAverage desc
    // 2. currentForm desc
    // 3. bestPercentage desc
    // 4. testsCompleted desc
    prevStudentStats.sort((a, b) => {
      if (b.overallAverage !== a.overallAverage) return b.overallAverage - a.overallAverage;
      if (b.currentForm !== a.currentForm) return b.currentForm - a.currentForm;
      if (b.bestPercentage !== a.bestPercentage) return b.bestPercentage - a.bestPercentage;
      return b.testsCompleted - a.testsCompleted;
    });

    let currentRank = 1;
    for (let i = 0; i < prevStudentStats.length; i++) {
      if (i > 0) {
        const prev = prevStudentStats[i - 1];
        const curr = prevStudentStats[i];
        const isTied =
          curr.overallAverage === prev.overallAverage &&
          curr.currentForm === prev.currentForm &&
          curr.bestPercentage === prev.bestPercentage &&
          curr.testsCompleted === prev.testsCompleted;
        if (!isTied) {
          currentRank = i + 1;
        }
      }
      if (prevStudentStats[i].testsCompleted > 0) {
        previousRanks.set(prevStudentStats[i].studentId, currentRank);
      }
    }
  }

  // 2. Calculate current stats for each student
  const studentStatsList: Omit<StudentStats, 'rank' | 'achievements'>[] = activeStudents.map((student) => {
    const allStudentScores = scoresByStudent.get(student.studentId) || [];
    const applicableCount = getApplicableTestsCount(student.className, latestTestNumber);
    const computed = computeStatsForScores(allStudentScores, applicableCount);

    const isProvisional = computed.testsCompleted < provisionalMin;
    const recentChange = Number((computed.currentForm - computed.overallAverage).toFixed(2));

    return {
      studentId: student.studentId,
      name: student.name,
      className: student.className,
      section: student.section,
      active: student.active,
      overallAverage: computed.overallAverage,
      currentForm: computed.currentForm,
      bestPercentage: computed.bestPercentage,
      lowestPercentage: computed.lowestPercentage,
      testsCompleted: computed.testsCompleted,
      testsMissed: computed.testsMissed,
      activeStreak: computed.activeStreak,
      longestStreak: computed.longestStreak,
      perfectScoresCount: computed.perfectScoresCount,
      scores: computed.sortedScores,
      isProvisional,
      recentChange,
      rankMovement: { direction: 'SAME', delta: 0, formattedText: '→' },
    };
  });

  // 3. Sort students by Tie-Breaking Rules:
  // 1) Higher overall average
  // 2) Higher current form
  // 3) Higher best percentage
  // 4) More tests completed
  studentStatsList.sort((a, b) => {
    if (b.overallAverage !== a.overallAverage) return b.overallAverage - a.overallAverage;
    if (b.currentForm !== a.currentForm) return b.currentForm - a.currentForm;
    if (b.bestPercentage !== a.bestPercentage) return b.bestPercentage - a.bestPercentage;
    return b.testsCompleted - a.testsCompleted;
  });

  // 4. Assign ranks and compute rank movements
  const finalResults: StudentStats[] = [];
  let currentRank = 1;

  for (let i = 0; i < studentStatsList.length; i++) {
    const item = studentStatsList[i];

    if (i > 0) {
      const prev = studentStatsList[i - 1];
      const isTied =
        item.overallAverage === prev.overallAverage &&
        item.currentForm === prev.currentForm &&
        item.bestPercentage === prev.bestPercentage &&
        item.testsCompleted === prev.testsCompleted;
      if (!isTied) {
        currentRank = i + 1;
      }
    }

    const assignedRank = item.testsCompleted > 0 ? currentRank : 999;

    // Calculate movement
    let movement: RankMovement;
    const prevRank = previousRanks.get(item.studentId);

    if (item.testsCompleted === 0 || prevRank === undefined) {
      movement = { direction: 'NEW', delta: 0, formattedText: 'NEW' };
    } else {
      const diff = prevRank - assignedRank; // e.g. prev 5, curr 3 -> +2 (jumped up)
      if (diff > 0) {
        movement = { direction: 'UP', delta: diff, formattedText: `↑${diff}` };
      } else if (diff < 0) {
        movement = { direction: 'DOWN', delta: Math.abs(diff), formattedText: `↓${Math.abs(diff)}` };
      } else {
        movement = { direction: 'SAME', delta: 0, formattedText: '→' };
      }
    }

    const achievements = evaluateAchievements({
      rank: assignedRank,
      overallAverage: item.overallAverage,
      currentForm: item.currentForm,
      bestPercentage: item.bestPercentage,
      testsCompleted: item.testsCompleted,
      testsMissed: item.testsMissed,
      activeStreak: item.activeStreak,
      longestStreak: item.longestStreak,
      scores: item.scores,
    });

    finalResults.push({
      ...item,
      rank: assignedRank,
      rankMovement: movement,
      achievements,
    });
  }

  return finalResults;
}
