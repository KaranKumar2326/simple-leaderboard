import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import { DEMO_STUDENTS, DEMO_TESTS, DEMO_TEST_RESULTS, DEMO_PRIZES } from '../src/services/demoData';

// Create a new workbook
const wb = XLSX.utils.book_new();

// 1. STUDENTS worksheet
const wsStudents = XLSX.utils.json_to_sheet(DEMO_STUDENTS);
XLSX.utils.book_append_sheet(wb, wsStudents, 'STUDENTS');

// 2. TESTS worksheet
const wsTests = XLSX.utils.json_to_sheet(DEMO_TESTS);
XLSX.utils.book_append_sheet(wb, wsTests, 'TESTS');

// 3. TEST_RESULTS worksheet
const wsResults = XLSX.utils.json_to_sheet(DEMO_TEST_RESULTS);
XLSX.utils.book_append_sheet(wb, wsResults, 'TEST_RESULTS');

// 4. PRIZES worksheet
const wsPrizes = XLSX.utils.json_to_sheet(DEMO_PRIZES);
XLSX.utils.book_append_sheet(wb, wsPrizes, 'PRIZES');

// Target locations:
// 1. In project root
const projectPath = path.resolve('Tuition_Championship_Data.xlsx');
XLSX.writeFile(wb, projectPath);
console.log(`✅ Created Excel file in project: ${projectPath}`);

// 2. Also in public folder so users can download it directly from the web UI!
const publicPath = path.resolve('public', 'Tuition_Championship_Data.xlsx');
XLSX.writeFile(wb, publicPath);
console.log(`✅ Created Excel file in public folder: ${publicPath}`);

// 3. Also on Desktop for instant double-click
const desktopPath = 'C:\\Users\\PC\\Desktop\\Tuition_Championship_Data.xlsx';
try {
  XLSX.writeFile(wb, desktopPath);
  console.log(`✅ Created Excel file on Desktop: ${desktopPath}`);
} catch (e) {
  console.warn('Could not write to desktop:', e);
}
