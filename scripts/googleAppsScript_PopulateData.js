/**
 * GOOGLE APPS SCRIPT: AUTO-POPULATE TUITION CHAMPIONSHIP DATA
 * 
 * Instructions:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1QDany--BNFoCEfbBhWJdY_WJInNIPLDNfLV-c44Vg24/edit
 * 2. In the top menu, click: Extensions -> Apps Script
 * 3. Delete any code in the editor, and paste this entire file.
 * 4. Click the "Save" (disk) icon, then click "Run".
 * 5. Grant permissions if prompted.
 * 
 * DONE! All 4 tabs (STUDENTS, TESTS, TEST_RESULTS, PRIZES) will be created and filled instantly.
 */

function populateChampionshipData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. STUDENTS
  const studentsData = [
    ["Student ID", "Name", "Class", "Section", "Active"],
    ["S001", "Rahul Sharma", "7", "A", "TRUE"],
    ["S002", "Priya Patel", "7", "A", "TRUE"],
    ["S003", "Aman Verma", "7", "A", "TRUE"],
    ["S004", "Rohan Gupta", "7", "B", "TRUE"],
    ["S005", "Ananya Sen", "7", "A", "TRUE"],
    ["S006", "Kavita Nair", "7", "B", "TRUE"],
    ["S007", "Sneha Rao", "7", "A", "TRUE"],
    ["S008", "Aditya Joshi", "7", "B", "TRUE"],
    ["S009", "Vikram Malhotra", "7", "A", "TRUE"],
    ["S010", "Diya Agarwal", "7", "B", "TRUE"],
    ["S011", "Kabir Khan", "7", "A", "TRUE"],
    ["S012", "Neha Reddy", "7", "B", "TRUE"],
    ["S013", "Arjun Mehra", "7", "A", "TRUE"],
    ["S014", "Tanvi Bhat", "7", "B", "TRUE"],
    ["S015", "Ishaan Roy", "7", "A", "TRUE"],
    ["S016", "Riya Kapoor", "7", "B", "TRUE"],
    ["S017", "Sameer Deshmukh", "7", "A", "TRUE"],
    ["S018", "Zoya Siddiqui", "7", "B", "TRUE"],
    ["S019", "Devansh Saxena", "7", "A", "TRUE"],
    ["S020", "Pooja Hegde", "8", "A", "TRUE"],
    ["S021", "Manish Kulkarni", "8", "A", "TRUE"],
    ["S022", "Meera Nambiar", "8", "A", "TRUE"]
  ];
  setSheetData(ss, "STUDENTS", studentsData);

  // 2. TESTS
  const testsData = [
    ["Test ID", "Test Number", "Test Name", "Date", "Subject", "Class", "Total Marks", "Difficulty", "Season"],
    ["T001", 1, "Diagnostic Benchmark", "2026-06-05", "General Science", "7", 50, "Medium", "Season 1"],
    ["T002", 2, "Linear Equations & Algebra", "2026-06-12", "Mathematics", "7", 40, "Hard", "Season 1"],
    ["T003", 3, "Matter in Our Surroundings", "2026-06-19", "Physics/Chem", "7", 50, "Easy", "Season 1"],
    ["T004", 4, "Fractions, Decimals & Ratios", "2026-06-26", "Mathematics", "7", 40, "Medium", "Season 1"],
    ["T005", 5, "Mid-Term Review Paper", "2026-07-03", "Combined Science", "7", 60, "Hard", "Season 1"],
    ["T006", 6, "Motion & Time Basics", "2026-07-10", "Physics", "7", 50, "Medium", "Season 1"],
    ["T007", 7, "Geometry & Angles", "2026-07-17", "Mathematics", "7", 50, "Hard", "Season 1"],
    ["T008", 8, "Acids, Bases & Salts", "2026-07-24", "Chemistry", "7", 40, "Medium", "Season 1"],
    ["T009", 9, "Data Handling & Probability", "2026-07-31", "Mathematics", "7", 50, "Easy", "Season 1"],
    ["T010", 10, "Respiration in Organisms", "2026-08-07", "Biology", "7", 50, "Medium", "Season 1"],
    ["T011", 11, "Algebraic Expressions Sprint", "2026-08-14", "Mathematics", "7", 40, "Hard", "Season 1"],
    ["T012", 12, "Electric Current & Circuits", "2026-08-21", "Physics", "7", 50, "Medium", "Season 1"],
    ["T013", 13, "Exponents & Powers Blitz", "2026-08-28", "Mathematics", "7", 40, "Easy", "Season 1"],
    ["T014", 14, "Light & Reflection", "2026-09-04", "Physics", "7", 50, "Hard", "Season 1"],
    ["T015", 15, "Grand Championship Final", "2026-09-11", "Combined STEM", "7", 100, "Hard", "Season 1"]
  ];
  setSheetData(ss, "TESTS", testsData);

  // 3. PRIZES
  const prizesData = [
    ["Prize ID", "Name", "Required Rank", "Required Tests", "Status", "Revealed Name"],
    ["P001", "Championship Trophy & Gold Medal", 1, 15, "UNLOCKED", "🏆 1st Place Grand Champion Trophy"],
    ["P002", "Silver Medal of Excellence", 2, 15, "UNLOCKED", "🥈 Runner-Up Silver Shield"],
    ["P003", "Bronze Medal of Honor", 3, 15, "UNLOCKED", "🥉 3rd Place Bronze Medal"],
    ["P004", "Iron Consistency Award", 5, 12, "UNLOCKED", "🎖️ Master of Consistency Pen Set"],
    ["P005", "Rising Star Commendation", 10, 10, "UNLOCKED", "⭐ Academic Excellence Certificate"]
  ];
  setSheetData(ss, "PRIZES", prizesData);

  // 4. TEST_RESULTS
  const resultsHeaders = ["Test ID", "Student ID", "Marks Scored", "Timestamp"];
  const resultsRows = [];

  // Generate score distribution
  const students = [
    { id: "S001", mean: 0.94 }, { id: "S002", mean: 0.92 }, { id: "S003", mean: 0.91 },
    { id: "S004", mean: 0.89 }, { id: "S005", mean: 0.88 }, { id: "S006", mean: 0.87 },
    { id: "S007", mean: 0.86 }, { id: "S008", mean: 0.84 }, { id: "S009", mean: 0.83 },
    { id: "S010", mean: 0.82 }, { id: "S011", mean: 0.81 }, { id: "S012", mean: 0.79 },
    { id: "S013", mean: 0.78 }, { id: "S014", mean: 0.76 }, { id: "S015", mean: 0.75 },
    { id: "S016", mean: 0.74 }, { id: "S017", mean: 0.72 }, { id: "S018", mean: 0.70 },
    { id: "S019", mean: 0.85, limit: 2 }, { id: "S020", mean: 0.92 }, { id: "S021", mean: 0.88 },
    { id: "S022", mean: 0.84 }
  ];

  const testMaxMarks = {
    T001: 50, T002: 40, T003: 50, T004: 40, T005: 60,
    T006: 50, T007: 50, T008: 40, T009: 50, T010: 50,
    T011: 40, T012: 50, T013: 40, T014: 50, T015: 100
  };

  for (let tNum = 1; tNum <= 15; tNum++) {
    const tId = "T" + (tNum < 10 ? "00" + tNum : "0" + tNum);
    const maxM = testMaxMarks[tId];

    students.forEach((st, idx) => {
      if (st.limit && tNum > st.limit) return;
      if (st.id === "S006" && tNum === 5) return; // missed test
      if (st.id === "S011" && tNum === 8) return; // missed test

      // score calculation
      let pct = st.mean + ((Math.sin(tNum * 1.5 + idx) * 0.08));
      pct = Math.max(0.45, Math.min(1.0, pct));
      if (st.id === "S001" && tNum === 15) pct = 0.98;
      if (st.id === "S006" && tNum === 4) pct = 1.0;

      const marks = Math.round(pct * maxM);
      resultsRows.push([tId, st.id, marks, "2026-06-05T12:00:00Z"]);
    });
  }

  setSheetData(ss, "TEST_RESULTS", [resultsHeaders, ...resultsRows]);

  SpreadsheetApp.getUi().alert("✅ Success! All 4 tabs (STUDENTS, TESTS, TEST_RESULTS, PRIZES) have been populated!");
}

function setSheetData(ss, sheetName, data) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }
  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
}
