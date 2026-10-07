// Raw representations of rows coming from Google Sheets tabs

export interface RawStudentRow {
  'Student ID'?: string;
  student_id?: string;
  id?: string;
  'Name'?: string;
  name?: string;
  'Class'?: string | number;
  class?: string | number;
  'Section'?: string;
  section?: string;
  'Active'?: string | boolean;
  active?: string | boolean;
  'Photo'?: string;
  'Photo URL'?: string;
  photo?: string;
  photo_url?: string;
  image?: string;
  avatar?: string;
}

export type TestDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface RawTestRow {
  'Test ID'?: string;
  test_id?: string;
  id?: string;
  'Date'?: string;
  date?: string;
  'Test Name'?: string;
  test_name?: string;
  name?: string;
  'Subject'?: string;
  subject?: string;
  'Class'?: string | number;
  class?: string | number;
  'Total Marks'?: string | number;
  total_marks?: string | number;
  'Difficulty'?: string;
  difficulty?: string;
  'Test Number'?: string | number;
  test_number?: string | number;
  'Season'?: string;
  season?: string;
}

export interface RawTestResultRow {
  'Timestamp'?: string;
  timestamp?: string;
  'Test ID'?: string;
  test_id?: string;
  'Student ID'?: string;
  student_id?: string;
  'Marks Scored'?: string | number;
  marks_scored?: string | number;
  marks?: string | number;
}

export interface RawPrizeRow {
  'Prize ID'?: string;
  prize_id?: string;
  'Name'?: string;
  name?: string;
  'Required Rank'?: string | number;
  required_rank?: string | number;
  'Required Tests'?: string | number;
  required_tests?: string | number;
  'Status'?: string;
  status?: string;
  'Description'?: string;
  description?: string;
}

export interface GoogleSheetsConfig {
  sheetId: string;
  studentsTab: string;
  testsTab: string;
  resultsTab: string;
  prizesTab: string;
  googleFormUrl?: string;
}

export interface AppSettings {
  sourceType: 'demo' | 'live';
  sheetsConfig: GoogleSheetsConfig;
  streakThresholdPercent: number; // default 80
  championshipTotalTests: number; // default 15
  provisionalMinTests: number; // default 3
  lastSyncedAt?: string;
}
