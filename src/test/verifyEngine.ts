import { validateAndSanitize } from '../services/dataValidator';
import { computeStudentStatistics } from '../engine/calculations';
import { computeSpotlights } from '../engine/spotlights';
import { DEMO_STUDENTS, DEMO_TESTS, DEMO_TEST_RESULTS, DEMO_PRIZES } from '../services/demoData';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    process.exit(1);
  } else {
    console.log(`✅ ${msg}`);
  }
}

console.log('\n--- 1. Testing Validation & Sanitization ---');
const validated = validateAndSanitize(DEMO_STUDENTS, DEMO_TESTS, DEMO_TEST_RESULTS, DEMO_PRIZES);
assert(validated.students.size >= 20, `Loaded ${validated.students.size} students`);
assert(validated.tests.size === 15, `Loaded 15 tests`);
assert(validated.scoreRecords.length > 100, `Loaded ${validated.scoreRecords.length} score records`);

// Test edge cases: marks exceeding total marks, negative marks, unknown test ID
const testMalicious = validateAndSanitize(
  [{ 'Student ID': 'S999', 'Name': 'Test Student', 'Class': '7', 'Section': 'A', 'Active': 'TRUE' }],
  [{ 'Test ID': 'TX', 'Test Name': 'Short Quiz', 'Total Marks': 20, 'Difficulty': 'Easy', 'Test Number': 1, 'Class': '7' }],
  [
    { 'Test ID': 'TX', 'Student ID': 'S999', 'Marks Scored': 25 }, // Exceeds total marks
    { 'Test ID': 'TX', 'Student ID': 'S999', 'Marks Scored': -5 }, // Negative marks
    { 'Test ID': 'TY_UNKNOWN', 'Student ID': 'S999', 'Marks Scored': 10 }, // Unknown test
  ],
  []
);
assert(testMalicious.issues.length >= 2, `Detected ${testMalicious.issues.length} data validation notices`);
assert(testMalicious.scoreRecords[0].marksScored <= 20, `Marks clamped to max total marks (got ${testMalicious.scoreRecords[0].marksScored})`);

console.log('\n--- 2. Testing Percentage & Calculations ---');
const studentsList = computeStudentStatistics(validated.students, validated.tests, validated.scoreRecords, {
  streakThresholdPercent: 80,
  provisionalMinTests: 3,
});

assert(studentsList.length > 0, `Computed stats for ${studentsList.length} students`);

// Check Rank 1 student
const rank1 = studentsList[0];
assert(rank1.rank === 1, `Rank 1 assigned properly to ${rank1.name}`);
assert(rank1.overallAverage > 90, `Top student average is ${rank1.overallAverage}% (> 90%)`);
assert(rank1.currentForm > 0, `Current form is calculated: ${rank1.currentForm}%`);
assert(rank1.activeStreak >= 5, `Top student has active streak: ${rank1.activeStreak}`);

// Check provisional student (Devansh S019 with only 2 tests completed)
const devansh = studentsList.find((s) => s.studentId === 'S019');
assert(devansh !== undefined, 'Found student Devansh');
assert(devansh!.isProvisional === true, `Devansh (< 3 tests) is marked PROVISIONAL (testsCompleted: ${devansh!.testsCompleted})`);

// Check missed test does NOT count as 0% in average
const kavita = studentsList.find((s) => s.studentId === 'S006');
assert(kavita !== undefined, 'Found student Kavita');
assert(kavita!.testsMissed >= 1, `Kavita has missed tests: ${kavita!.testsMissed}`);
assert(kavita!.overallAverage > 80, `Kavita average (${kavita!.overallAverage}%) is not penalized by 0% for missed tests`);

console.log('\n--- 3. Testing Tie-Breaking Hierarchy ---');
for (let i = 0; i < studentsList.length - 1; i++) {
  const a = studentsList[i];
  const b = studentsList[i + 1];
  if (a.overallAverage === b.overallAverage) {
    if (a.currentForm !== b.currentForm) {
      assert(a.currentForm >= b.currentForm, `Tie-breaker 1 (Form) respected: ${a.currentForm} >= ${b.currentForm}`);
    } else if (a.bestPercentage !== b.bestPercentage) {
      assert(a.bestPercentage >= b.bestPercentage, `Tie-breaker 2 (Best %) respected: ${a.bestPercentage} >= ${b.bestPercentage}`);
    }
  } else {
    assert(a.overallAverage >= b.overallAverage, `Overall average ordering respected: ${a.overallAverage} >= ${b.overallAverage}`);
  }
}

console.log('\n--- 4. Testing Spotlights ---');
const spotlights = computeSpotlights(studentsList);
assert(spotlights.hotStreaks.length > 0, `Hot streaks detected: ${spotlights.hotStreaks.length}`);
assert(spotlights.perfectScores.length > 0, `Century club detected: ${spotlights.perfectScores.length}`);
assert(spotlights.closestBattle !== null, `Closest battle detected: gap = ${spotlights.closestBattle?.difference}%`);

console.log('\n🎉 ALL VERIFICATION TESTS PASSED SUCCESSFULLY!\n');
