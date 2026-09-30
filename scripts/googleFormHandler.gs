// googleFormHandler.gs
// Handles Google Form submissions → TEST_RESULTS → LEADERBOARD (auto-updated).

/**
 * Triggered when a Google Form linked to this spreadsheet is submitted.
 * Form fields (exact question titles):
 *   • Name                  (dropdown) – student name
 *   • Test ID               (dropdown) – e.g. T001
 *   • Test subject and name (short answer) – optional
 *   • Marks Obtained        (short answer, number)
 *   • Total Marks           (short answer, number)
 */
function onFormSubmit(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const resultsSheet = ss.getSheetByName('TEST_RESULTS');
  if (!resultsSheet) return;

  const studentName   = e.namedValues['Name']                  ? e.namedValues['Name'][0].trim()                  : '';
  const testId        = e.namedValues['Test ID']               ? e.namedValues['Test ID'][0].trim()               : '';
  const marksObtained = Number(e.namedValues['Marks Obtained'] ? e.namedValues['Marks Obtained'][0] : 0);
  const testSubject   = e.namedValues['Test subject and name'] ? e.namedValues['Test subject and name'][0].trim() : '';
  const totalMarks    = Number(e.namedValues['Total Marks']    ? e.namedValues['Total Marks'][0] : 0);

  const studentId = lookupStudentId(studentName);
  const row = [new Date(), testId, studentId || studentName, marksObtained];
  resultsSheet.appendRow(row);

  Logger.log('Form submit: %s | %s | %s | %s/%s', studentName, testId, testSubject, marksObtained, totalMarks);
  updateLeaderboard();
}

/** Returns the Student ID for a given name from the STUDENTS sheet. */
function lookupStudentId(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const students = ss.getSheetByName('STUDENTS');
  if (!students) return null;
  const data    = students.getDataRange().getValues();
  const header  = data[0];
  const idxName = header.indexOf('Name');
  const idxId   = header.indexOf('Student ID');
  for (let i = 1; i < data.length; i++) {
    if (data[i][idxName] && data[i][idxName].toString().trim() === name.trim()) {
      return data[i][idxId];
    }
  }
  return null;
}

/**
 * Recalculates the LEADERBOARD sheet.
 * ONLY students that exist in the STUDENTS sheet appear in the leaderboard
 * (ghost / demo IDs are ignored automatically).
 * Columns: Rank | Student ID | Name | Class | Total Scored | Total Possible | % Score
 */
function updateLeaderboard() {
  const ss       = SpreadsheetApp.getActiveSpreadsheet();
  const results  = ss.getSheetByName('TEST_RESULTS');
  const tests    = ss.getSheetByName('TESTS');
  const students = ss.getSheetByName('STUDENTS');
  if (!results || !tests || !students) return;

  // ── 1. Build a set of valid student IDs from STUDENTS sheet ──────────────
  const studentData  = students.getDataRange().getValues();
  const stuHeader    = studentData[0];
  const idxStuId    = stuHeader.indexOf('Student ID');
  const idxStuName  = stuHeader.indexOf('Name');
  const idxStuClass = stuHeader.indexOf('Class');

  const validStudents = {}; // { studentId: { name, class } }
  for (let i = 1; i < studentData.length; i++) {
    const id = studentData[i][idxStuId];
    if (!id) continue;
    validStudents[id] = {
      name : studentData[i][idxStuName]  || '',
      cls  : studentData[i][idxStuClass] || ''
    };
  }

  // ── 2. Build a map of Test ID → Total Marks from TESTS sheet ─────────────
  const testData      = tests.getDataRange().getValues();
  const testHeader    = testData[0];
  const idxTestId     = testHeader.indexOf('Test ID');
  const idxTotalMarks = testHeader.indexOf('Total Marks');
  const testMarksMap  = {};
  for (let i = 1; i < testData.length; i++) {
    const id    = testData[i][idxTestId];
    const marks = Number(testData[i][idxTotalMarks]);
    if (id) testMarksMap[id] = marks;
  }

  // ── 3. Aggregate scores – skip rows whose student is not in validStudents ─
  const resultData      = results.getDataRange().getValues();
  const resHeader       = resultData[0];
  const idxResStudentId = resHeader.indexOf('Student ID');
  const idxResTestId    = resHeader.indexOf('Test ID');
  const idxResScore     = resHeader.indexOf('Marks Scored');
  const studentAgg      = {};

  for (let i = 1; i < resultData.length; i++) {
    const sId = resultData[i][idxResStudentId];
    if (!sId || !validStudents[sId]) continue; // ← skip ghost / demo IDs
    const tId   = resultData[i][idxResTestId];
    const score = Number(resultData[i][idxResScore]);
    if (!studentAgg[sId]) studentAgg[sId] = { totalScore: 0, possibleScore: 0 };
    studentAgg[sId].totalScore   += score;
    studentAgg[sId].possibleScore += (testMarksMap[tId] || 0);
  }

  // ── 4. Build leaderboard rows ────────────────────────────────────────────
  const leaderboardRows = [];
  for (const sId in studentAgg) {
    const agg     = studentAgg[sId];
    const percent = agg.possibleScore ? (agg.totalScore / agg.possibleScore) * 100 : 0;
    const student = validStudents[sId];
    leaderboardRows.push([sId, student.name, student.cls, agg.totalScore, agg.possibleScore, percent]);
  }

  // ── 5. Sort descending by total score ─────────────────────────────────────
  leaderboardRows.sort((a, b) => b[3] - a[3]);

  // ── 6. Add rank (with tie handling) ──────────────────────────────────────
  const finalRows = [];
  let currentRank = 1;
  for (let i = 0; i < leaderboardRows.length; i++) {
    if (i > 0 && leaderboardRows[i][3] < leaderboardRows[i - 1][3]) currentRank = i + 1;
    finalRows.push([currentRank, ...leaderboardRows[i]]);
  }

  // ── 7. Write to LEADERBOARD sheet ────────────────────────────────────────
  let lbSheet = ss.getSheetByName('LEADERBOARD');
  if (!lbSheet) {
    lbSheet = ss.insertSheet('LEADERBOARD');
  } else {
    lbSheet.clearContents();
  }
  const header = ['Rank', 'Student ID', 'Name', 'Class', 'Total Scored', 'Total Possible', '% Score'];
  lbSheet.getRange(1, 1, 1, header.length).setValues([header]);
  if (finalRows.length) {
    lbSheet.getRange(2, 1, finalRows.length, finalRows[0].length).setValues(finalRows);
  }
}

/**
 * ONE-OFF: Remove all rows from TEST_RESULTS whose Student ID does NOT exist
 * in the STUDENTS sheet. This cleans out all old demo / ghost data.
 * Run once from the script editor.
 */
function cleanTestResults() {
  const ss       = SpreadsheetApp.getActiveSpreadsheet();
  const results  = ss.getSheetByName('TEST_RESULTS');
  const students = ss.getSheetByName('STUDENTS');
  if (!results || !students) return;

  // Collect valid student IDs
  const studentData = students.getDataRange().getValues();
  const stuHeader   = studentData[0];
  const idxStuId    = stuHeader.indexOf('Student ID');
  const validIds    = new Set();
  for (let i = 1; i < studentData.length; i++) {
    if (studentData[i][idxStuId]) validIds.add(studentData[i][idxStuId].toString());
  }

  const data      = results.getDataRange().getValues();
  const resHeader = data[0];
  const idxStuId2 = resHeader.indexOf('Student ID');

  // Collect row indices to delete (bottom to top to avoid index shifting)
  const toDelete = [];
  for (let i = 1; i < data.length; i++) {
    const sId = data[i][idxStuId2] ? data[i][idxStuId2].toString() : '';
    if (!validIds.has(sId)) toDelete.push(i + 1); // sheet rows are 1-indexed
  }

  // Delete from bottom to top
  for (let j = toDelete.length - 1; j >= 0; j--) {
    results.deleteRow(toDelete[j]);
  }

  Logger.log('Deleted %s ghost rows from TEST_RESULTS.', toDelete.length);
  updateLeaderboard(); // refresh leaderboard after cleaning
}

/**
 * ONE-OFF: Populate the STUDENTS sheet with your 8 students.
 * Run once to seed / reset the sheet.
 */
function populateStudents() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('STUDENTS');
  if (!sheet) return;
  const header = ['Student ID', 'Name', 'Class', 'Section', 'Active'];
  const data   = [
    ['S001', 'Sanvi',   5, 'A', true],
    ['S002', 'Adhyan',  5, 'A', true],
    ['S003', 'Dev',     4, 'A', true],
    ['S004', 'Harsh',   7, 'A', true],
    ['S005', 'Yashika', 7, 'A', true],
    ['S006', 'Radhika', 9, 'A', true],
    ['S007', 'Ankur',   9, 'A', true],
    ['S008', 'Aryan',   9, 'A', true]
  ];
  sheet.clearContents();
  sheet.getRange(1, 1, 1, header.length).setValues([header]);
  sheet.getRange(2, 1, data.length, header.length).setValues(data);
  Logger.log('STUDENTS sheet populated with %s students.', data.length);
}

/** ONE-OFF: Remove the "Difficulty" column from the TESTS sheet. */
function removeDifficultyColumn() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const tests = ss.getSheetByName('TESTS');
  if (!tests) return;
  const header = tests.getDataRange().getValues()[0];
  const idx    = header.indexOf('Difficulty');
  if (idx === -1) return;
  tests.deleteColumn(idx + 1);
  Logger.log('Difficulty column removed.');
}
