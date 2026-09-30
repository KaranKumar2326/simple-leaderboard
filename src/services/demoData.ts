import type { RawStudentRow, RawTestRow, RawTestResultRow, RawPrizeRow } from '../types/sheet';

export const DEMO_STUDENTS: RawStudentRow[] = [
  { 'Student ID': 'S001', 'Name': 'Rahul Sharma', 'Class': '7', 'Section': 'A', 'Active': 'TRUE' },
  { 'Student ID': 'S002', 'Name': 'Priya Patel', 'Class': '7', 'Section': 'A', 'Active': 'TRUE' },
  { 'Student ID': 'S003', 'Name': 'Aman Verma', 'Class': '7', 'Section': 'A', 'Active': 'TRUE' },
  { 'Student ID': 'S004', 'Name': 'Rohan Gupta', 'Class': '7', 'Section': 'B', 'Active': 'TRUE' },
  { 'Student ID': 'S005', 'Name': 'Ananya Sen', 'Class': '7', 'Section': 'A', 'Active': 'TRUE' },
  { 'Student ID': 'S006', 'Name': 'Kavita Nair', 'Class': '7', 'Section': 'B', 'Active': 'TRUE' },
  { 'Student ID': 'S007', 'Name': 'Sneha Rao', 'Class': '7', 'Section': 'A', 'Active': 'TRUE' },
  { 'Student ID': 'S008', 'Name': 'Aditya Joshi', 'Class': '7', 'Section': 'B', 'Active': 'TRUE' },
  { 'Student ID': 'S009', 'Name': 'Vikram Malhotra', 'Class': '7', 'Section': 'A', 'Active': 'TRUE' },
  { 'Student ID': 'S010', 'Name': 'Diya Agarwal', 'Class': '7', 'Section': 'B', 'Active': 'TRUE' },
  { 'Student ID': 'S011', 'Name': 'Kabir Khan', 'Class': '7', 'Section': 'A', 'Active': 'TRUE' },
  { 'Student ID': 'S012', 'Name': 'Neha Reddy', 'Class': '7', 'Section': 'B', 'Active': 'TRUE' },
  { 'Student ID': 'S013', 'Name': 'Arjun Mehra', 'Class': '7', 'Section': 'A', 'Active': 'TRUE' },
  { 'Student ID': 'S014', 'Name': 'Tanvi Bhat', 'Class': '7', 'Section': 'B', 'Active': 'TRUE' },
  { 'Student ID': 'S015', 'Name': 'Ishaan Roy', 'Class': '7', 'Section': 'A', 'Active': 'TRUE' },
  { 'Student ID': 'S016', 'Name': 'Riya Kapoor', 'Class': '7', 'Section': 'B', 'Active': 'TRUE' },
  { 'Student ID': 'S017', 'Name': 'Sameer Deshmukh', 'Class': '7', 'Section': 'A', 'Active': 'TRUE' },
  { 'Student ID': 'S018', 'Name': 'Zoya Siddiqui', 'Class': '7', 'Section': 'B', 'Active': 'TRUE' },
  { 'Student ID': 'S019', 'Name': 'Devansh Saxena', 'Class': '7', 'Section': 'A', 'Active': 'TRUE' }, // New student with 2 tests
  { 'Student ID': 'S020', 'Name': 'Pooja Hegde', 'Class': '8', 'Section': 'A', 'Active': 'TRUE' },
  { 'Student ID': 'S021', 'Name': 'Manish Kulkarni', 'Class': '8', 'Section': 'A', 'Active': 'TRUE' },
  { 'Student ID': 'S022', 'Name': 'Meera Nambiar', 'Class': '8', 'Section': 'A', 'Active': 'TRUE' },
];

export const DEMO_TESTS: RawTestRow[] = [
  { 'Test ID': 'T001', 'Date': '2026-07-05', 'Test Name': 'Number Systems Sprint', 'Subject': 'Maths', 'Class': '7', 'Total Marks': 50, 'Difficulty': 'Medium', 'Test Number': 1, 'Season': 'Season 1' },
  { 'Test ID': 'T002', 'Date': '2026-07-12', 'Test Name': 'Algebra Basics & Linear', 'Subject': 'Maths', 'Class': '7', 'Total Marks': 40, 'Difficulty': 'Hard', 'Test Number': 2, 'Season': 'Season 1' },
  { 'Test ID': 'T003', 'Date': '2026-07-19', 'Test Name': 'Heat & Temperature', 'Subject': 'Science', 'Class': '7', 'Total Marks': 50, 'Difficulty': 'Medium', 'Test Number': 3, 'Season': 'Season 1' },
  { 'Test ID': 'T004', 'Date': '2026-07-26', 'Test Name': 'Fractions & Decimals Blitz', 'Subject': 'Maths', 'Class': '7', 'Total Marks': 25, 'Difficulty': 'Easy', 'Test Number': 4, 'Season': 'Season 1' },
  { 'Test ID': 'T005', 'Date': '2026-08-02', 'Test Name': 'Acids, Bases & Salts', 'Subject': 'Science', 'Class': '7', 'Total Marks': 50, 'Difficulty': 'Hard', 'Test Number': 5, 'Season': 'Season 1' },
  { 'Test ID': 'T006', 'Date': '2026-08-09', 'Test Name': 'Geometry Lines & Angles', 'Subject': 'Maths', 'Class': '7', 'Total Marks': 60, 'Difficulty': 'Medium', 'Test Number': 6, 'Season': 'Season 1' },
  { 'Test ID': 'T007', 'Date': '2026-08-16', 'Test Name': 'Physical & Chemical Changes', 'Subject': 'Science', 'Class': '7', 'Total Marks': 40, 'Difficulty': 'Medium', 'Test Number': 7, 'Season': 'Season 1' },
  { 'Test ID': 'T008', 'Date': '2026-08-23', 'Test Name': 'Triangles & Properties Master', 'Subject': 'Maths', 'Class': '7', 'Total Marks': 50, 'Difficulty': 'Hard', 'Test Number': 8, 'Season': 'Season 1' },
  { 'Test ID': 'T009', 'Date': '2026-08-30', 'Test Name': 'Respiration & Circulation', 'Subject': 'Science', 'Class': '7', 'Total Marks': 50, 'Difficulty': 'Medium', 'Test Number': 9, 'Season': 'Season 1' },
  { 'Test ID': 'T010', 'Date': '2026-09-06', 'Test Name': 'Comparing Quantities Speedrun', 'Subject': 'Maths', 'Class': '7', 'Total Marks': 30, 'Difficulty': 'Easy', 'Test Number': 10, 'Season': 'Season 1' },
  { 'Test ID': 'T011', 'Date': '2026-09-13', 'Test Name': 'Motion & Time Dynamics', 'Subject': 'Science', 'Class': '7', 'Total Marks': 50, 'Difficulty': 'Hard', 'Test Number': 11, 'Season': 'Season 1' },
  { 'Test ID': 'T012', 'Date': '2026-09-20', 'Test Name': 'Rational Numbers Grand Prix', 'Subject': 'Maths', 'Class': '7', 'Total Marks': 50, 'Difficulty': 'Hard', 'Test Number': 12, 'Season': 'Season 1' },
  // Remaining tests for the 15-test championship
  { 'Test ID': 'T013', 'Date': '2026-09-27', 'Test Name': 'Electric Current & Circuits', 'Subject': 'Science', 'Class': '7', 'Total Marks': 50, 'Difficulty': 'Medium', 'Test Number': 13, 'Season': 'Season 1' },
  { 'Test ID': 'T014', 'Date': '2026-10-04', 'Test Name': 'Perimeter & Area Challenge', 'Subject': 'Maths', 'Class': '7', 'Total Marks': 60, 'Difficulty': 'Hard', 'Test Number': 14, 'Season': 'Season 1' },
  { 'Test ID': 'T015', 'Date': '2026-10-11', 'Test Name': 'Grand Finale Championship Exam', 'Subject': 'All Subjects', 'Class': '7', 'Total Marks': 100, 'Difficulty': 'Hard', 'Test Number': 15, 'Season': 'Season 1' },
];

// Helper to generate marks for realistic performance distributions
interface ScoreMap {
  [studentId: string]: number[]; // raw marks scored for tests 1 through 12
}

// Total Marks sequence: T1(50), T2(40), T3(50), T4(25), T5(50), T6(60), T7(40), T8(50), T9(50), T10(30), T11(50), T12(50)
const RAW_SCORES_MAP: ScoreMap = {
  // Rahul: Top performer, strong streak, 100% on T4 (25/25) & T10 (30/30)
  'S001': [47, 38, 48, 25, 46, 56, 38, 48, 49, 30, 48, 49], 
  // Priya: Close contender, 100% on T8 (50/50), solid form
  'S002': [46, 37, 47, 24, 47, 55, 37, 50, 47, 29, 47, 48],
  // Aman: High ranker, slight dip on T2, then strong comeback
  'S003': [45, 33, 46, 24, 45, 54, 36, 46, 46, 28, 47, 47],
  // Rohan: Rising star! Started average (T1: 35/50=70%), but recent tests are 92%+
  'S004': [35, 29, 37, 20, 39, 48, 35, 45, 46, 29, 46, 48],
  // Ananya: Consistent top 5
  'S005': [44, 35, 43, 23, 44, 52, 35, 44, 45, 27, 44, 45],
  // Kavita: Missed T005, but high scores in other tests
  'S006': [42, 34, 44, 22, -1, 51, 34, 43, 44, 27, 43, 44], // -1 indicates missed test
  // Sneha: Consistent 82-86%
  'S007': [41, 33, 42, 21, 41, 49, 33, 41, 42, 25, 41, 42],
  // Aditya: Solid performance, recent improvement
  'S008': [40, 31, 40, 21, 42, 48, 32, 42, 43, 26, 42, 44],
  // Vikram: Variable performance, big spike on T10
  'S009': [38, 30, 39, 20, 38, 45, 31, 40, 41, 28, 39, 41],
  // Diya: Steady performer
  'S010': [39, 32, 40, 20, 39, 46, 32, 39, 40, 25, 40, 42],
  // Kabir: Strong science, missed T008
  'S011': [37, 28, 45, 19, 44, 42, 36, -1, 45, 24, 45, 40],
  // Neha: Improving steadily
  'S012': [35, 27, 36, 18, 36, 43, 30, 38, 41, 26, 41, 43],
  // Arjun: Average 70-75%
  'S013': [36, 28, 37, 18, 35, 42, 29, 36, 37, 23, 37, 38],
  // Tanvi: Missed T002 & T003
  'S014': [38, -1, -1, 19, 37, 44, 30, 37, 38, 24, 38, 39],
  // Ishaan: Middle of pack
  'S015': [34, 26, 35, 17, 34, 40, 28, 35, 36, 22, 35, 36],
  // Riya: Around 68%
  'S016': [33, 25, 33, 17, 33, 39, 27, 34, 34, 21, 34, 35],
  // Sameer: Struggles on hard tests
  'S017': [31, 22, 32, 16, 30, 36, 25, 31, 33, 20, 32, 33],
  // Zoya: Improving trend
  'S018': [29, 24, 31, 16, 33, 38, 27, 34, 36, 23, 36, 38],
  // Devansh: Joined recently! Only took T011 and T012 -> PROVISIONAL student (< 3 tests)
  'S019': [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 44, 46],
  // Class 8 students
  'S020': [48, 39, 49, 25, 48, 58, 39, 49, 49, 30, 49, 50],
  'S021': [45, 36, 46, 23, 44, 53, 36, 45, 46, 28, 45, 46],
  'S022': [42, 33, 43, 22, 42, 50, 34, 43, 44, 26, 43, 44],
};

export const DEMO_TEST_RESULTS: RawTestResultRow[] = [];

// Populate DEMO_TEST_RESULTS based on RAW_SCORES_MAP
Object.entries(RAW_SCORES_MAP).forEach(([studentId, scores]) => {
  scores.forEach((marks, idx) => {
    if (marks >= 0) {
      const testNum = idx + 1;
      const testId = `T${testNum.toString().padStart(3, '0')}`;
      DEMO_TEST_RESULTS.push({
        'Timestamp': `2026-07-${(idx * 7 + 6).toString().padStart(2, '0')} 18:30:00`,
        'Test ID': testId,
        'Student ID': studentId,
        'Marks Scored': marks,
      });
    }
  });
});

export const DEMO_PRIZES: RawPrizeRow[] = [
  {
    'Prize ID': 'P001',
    'Name': '👑 Season Champion Grand Prize: Kindle Paperwhite + Championship Trophy',
    'Required Rank': 1,
    'Required Tests': 15,
    'Status': 'LOCKED',
    'Description': 'Awarded to the #1 ranked student at the conclusion of all 15 weekly championship tests.',
  },
  {
    'Prize ID': 'P002',
    'Name': '🥈 Runner-Up Honors: Noise ColorFit Pro Smartwatch + Silver Medal',
    'Required Rank': 2,
    'Required Tests': 15,
    'Status': 'LOCKED',
    'Description': 'Awarded to the 2nd place student for exceptional consistency.',
  },
  {
    'Prize ID': 'P003',
    'Name': '🥉 Bronze Podium: Premium Fountain Pen Set + Bronze Medal',
    'Required Rank': 3,
    'Required Tests': 15,
    'Status': 'LOCKED',
    'Description': 'Awarded to the 3rd place podium finisher.',
  },
  {
    'Prize ID': 'P004',
    'Name': '🌟 Top 10 Elite League Badges & Amazon Gift Vouchers',
    'Required Rank': 10,
    'Required Tests': 15,
    'Status': 'LOCKED',
    'Description': 'Recognizing all students who maintain a top 10 ranking across the championship.',
  },
  {
    'Prize ID': 'P005',
    'Name': '🚀 Mid-Season Most Improved: STEM Science Kit',
    'Required Rank': 15,
    'Required Tests': 10,
    'Status': 'UNLOCKED',
    'Description': 'Awarded to the student with the highest percentage leap over tests 1-10.',
  },
];
