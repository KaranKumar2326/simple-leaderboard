import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { DEMO_STUDENTS, DEMO_TESTS, DEMO_TEST_RESULTS, DEMO_PRIZES } from '../src/services/demoData';

const outDir = path.resolve('csv_templates');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. STUDENTS
const studentsCsv = Papa.unparse(DEMO_STUDENTS);
fs.writeFileSync(path.join(outDir, 'STUDENTS.csv'), studentsCsv, 'utf8');

// 2. TESTS
const testsCsv = Papa.unparse(DEMO_TESTS);
fs.writeFileSync(path.join(outDir, 'TESTS.csv'), testsCsv, 'utf8');

// 3. TEST_RESULTS
const resultsCsv = Papa.unparse(DEMO_TEST_RESULTS);
fs.writeFileSync(path.join(outDir, 'TEST_RESULTS.csv'), resultsCsv, 'utf8');

// 4. PRIZES
const prizesCsv = Papa.unparse(DEMO_PRIZES);
fs.writeFileSync(path.join(outDir, 'PRIZES.csv'), prizesCsv, 'utf8');

console.log('✅ Exported all 4 CSV templates to csv_templates/');
