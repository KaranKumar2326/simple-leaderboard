import type { RawStudentRow, RawTestRow, RawTestResultRow, RawPrizeRow } from '../types/sheet';
import type { StudentBase, ValidationIssue } from '../types/student';
import type { TestInfo, StudentScoreRecord, TestDifficulty } from '../types/test';
import type { Prize } from '../types/prize';

export interface ValidatedDataset {
  students: Map<string, StudentBase>;
  tests: Map<string, TestInfo>;
  scoreRecords: StudentScoreRecord[];
  prizes: Prize[];
  issues: ValidationIssue[];
}

export function validateAndSanitize(
  rawStudents: RawStudentRow[],
  rawTests: RawTestRow[],
  rawResults: RawTestResultRow[],
  rawPrizes: RawPrizeRow[]
): ValidatedDataset {
  const issues: ValidationIssue[] = [];
  const students = new Map<string, StudentBase>();
  const tests = new Map<string, TestInfo>();

  // 1. Process Students
  rawStudents.forEach((row, idx) => {
    const studentId = String(row['Student ID'] || row.student_id || row.id || '').trim();
    const name = String(row['Name'] || row.name || '').trim();
    const className = String(row['Class'] || row.class || '').trim();
    const section = String(row['Section'] || row.section || '').trim().toUpperCase();
    const activeRaw = String(row['Active'] || row.active || 'TRUE').trim().toUpperCase();
    const active = activeRaw === 'TRUE' || activeRaw === '1' || activeRaw === 'YES';
    const photoUrl = String(row['Photo'] || row['Photo URL'] || row.photo || row.photo_url || row.image || row.avatar || '').trim() || undefined;

    if (!studentId) {
      issues.push({
        type: 'MISSING_DATA',
        message: `Row #${idx + 1} in STUDENTS has no Student ID.`,
        rawRowIndex: idx,
      });
      return;
    }

    if (students.has(studentId)) {
      issues.push({
        type: 'DUPLICATE',
        message: `Duplicate Student ID "${studentId}" found for student "${name}". Keeping first entry.`,
        rawRowIndex: idx,
      });
      return;
    }

    students.set(studentId, {
      studentId,
      name: name || `Student ${studentId}`,
      className: className || 'General',
      section: section || 'A',
      active,
      photoUrl,
    });
  });

  // 2. Process Tests
  rawTests.forEach((row, idx) => {
    const testId = String(row['Test ID'] || row.test_id || row.id || '').trim();
    const testName = String(row['Test Name'] || row.test_name || row.name || '').trim();
    const date = String(row['Date'] || row.date || '').trim();
    const subject = String(row['Subject'] || row.subject || 'General').trim();
    const targetClass = String(row['Class'] || row.class || '').trim();
    const totalMarksRaw = Number(row['Total Marks'] || row.total_marks || 0);
    const difficultyRaw = String(row['Difficulty'] || row.difficulty || 'Medium').trim();
    const testNumberRaw = Number(row['Test Number'] || row.test_number || (idx + 1));
    const season = String(row['Season'] || row.season || 'Season 1').trim();

    if (!testId) {
      issues.push({
        type: 'MISSING_DATA',
        message: `Row #${idx + 1} in TESTS has no Test ID.`,
        rawRowIndex: idx,
      });
      return;
    }

    const totalMarks = isNaN(totalMarksRaw) || totalMarksRaw <= 0 ? 50 : totalMarksRaw;
    const testNumber = isNaN(testNumberRaw) || testNumberRaw <= 0 ? idx + 1 : testNumberRaw;

    const validDifficulties: TestDifficulty[] = ['Easy', 'Medium', 'Hard'];
    const difficulty: TestDifficulty = validDifficulties.includes(difficultyRaw as TestDifficulty)
      ? (difficultyRaw as TestDifficulty)
      : 'Medium';

    tests.set(testId, {
      testId,
      testName: testName || `Test ${testId}`,
      date: date || new Date().toISOString().split('T')[0],
      subject,
      targetClass,
      totalMarks,
      difficulty,
      testNumber,
      season,
    });
  });

  // 3. Process Test Results
  const seenSubmissions = new Map<string, StudentScoreRecord>();
  const scoreRecords: StudentScoreRecord[] = [];

  rawResults.forEach((row, idx) => {
    const testId = String(row['Test ID'] || row.test_id || '').trim();
    const studentId = String(row['Student ID'] || row.student_id || '').trim();
    const marksRaw = row['Marks Scored'] ?? row.marks_scored ?? row.marks;
    const timestamp = String(row['Timestamp'] || row.timestamp || '').trim();

    if (!testId || !studentId) {
      issues.push({
        type: 'MISSING_DATA',
        message: `Result row #${idx + 1} has missing Test ID or Student ID.`,
        rawRowIndex: idx,
      });
      return;
    }

    const test = tests.get(testId);
    if (!test) {
      issues.push({
        type: 'TEST_UNKNOWN',
        message: `Result row #${idx + 1} references unknown Test ID "${testId}".`,
        rawRowIndex: idx,
      });
      return;
    }

    const student = students.get(studentId);
    if (!student) {
      issues.push({
        type: 'STUDENT_UNKNOWN',
        message: `Result row #${idx + 1} references unknown Student ID "${studentId}".`,
        rawRowIndex: idx,
      });
      return;
    }

    const marks = Number(marksRaw);
    if (isNaN(marks)) {
      issues.push({
        type: 'MISSING_DATA',
        message: `Invalid marks "${marksRaw}" for Student "${studentId}" in Test "${testId}".`,
        rawRowIndex: idx,
      });
      return;
    }

    if (marks < 0) {
      issues.push({
        type: 'NEGATIVE_MARKS',
        message: `Negative marks (${marks}) for Student "${studentId}" in Test "${testId}". Clamping to 0.`,
        rawRowIndex: idx,
      });
    }

    const clampedMarks = Math.max(0, marks);
    if (clampedMarks > test.totalMarks) {
      issues.push({
        type: 'MARKS_EXCEEDED',
        message: `Marks scored (${clampedMarks}) exceeds Total Marks (${test.totalMarks}) for Test "${testId}". Clamped to maximum.`,
        rawRowIndex: idx,
      });
    }

    const finalMarks = Math.min(clampedMarks, test.totalMarks);
    const percentage = Number(((finalMarks / test.totalMarks) * 100).toFixed(2));

    const record: StudentScoreRecord = {
      testId,
      studentId,
      marksScored: finalMarks,
      totalMarks: test.totalMarks,
      percentage,
      testNumber: test.testNumber,
      date: test.date,
      testName: test.testName,
      subject: test.subject,
      difficulty: test.difficulty,
      timestamp,
    };

    const duplicateKey = `${studentId}__${testId}`;
    if (seenSubmissions.has(duplicateKey)) {
      issues.push({
        type: 'DUPLICATE',
        message: `Duplicate submission for Student "${studentId}" on Test "${testId}". Using latest entry.`,
        rawRowIndex: idx,
      });
    }

    seenSubmissions.set(duplicateKey, record);
  });

  seenSubmissions.forEach((record) => {
    scoreRecords.push(record);
  });

  // Sort score records by test number
  scoreRecords.sort((a, b) => a.testNumber - b.testNumber);

  // 4. Process Prizes
  const prizes: Prize[] = (rawPrizes || []).map((row, idx) => {
    const prizeId = String(row['Prize ID'] || row.prize_id || `P${idx + 1}`).trim();
    const name = String(row['Name'] || row.name || 'Mystery Reward').trim();
    const requiredRank = Number(row['Required Rank'] || row.required_rank || 1);
    const requiredTests = Number(row['Required Tests'] || row.required_tests || 15);
    const statusRaw = String(row['Status'] || row.status || 'LOCKED').trim().toUpperCase();
    const status: 'LOCKED' | 'UNLOCKED' = statusRaw === 'UNLOCKED' ? 'UNLOCKED' : 'LOCKED';
    const description = String(row['Description'] || row.description || '').trim();

    return {
      prizeId,
      name,
      requiredRank: isNaN(requiredRank) ? 1 : requiredRank,
      requiredTests: isNaN(requiredTests) ? 15 : requiredTests,
      status,
      description,
    };
  });

  return {
    students,
    tests,
    scoreRecords,
    prizes,
    issues,
  };
}
