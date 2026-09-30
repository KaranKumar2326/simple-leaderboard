import Papa from 'papaparse';
import type { RawStudentRow, RawTestRow, RawTestResultRow, RawPrizeRow } from '../types/sheet';
import { DEMO_STUDENTS, DEMO_TESTS, DEMO_TEST_RESULTS, DEMO_PRIZES } from './demoData';
import { validateAndSanitize, type ValidatedDataset } from './dataValidator';

const CACHE_KEY_DATA = 'tuition_champ_cached_data_v1';
const CACHE_KEY_SETTINGS = 'tuition_champ_settings_v1';

export interface SheetFetchResult {
  dataset: ValidatedDataset;
  rawStudents: RawStudentRow[];
  rawTests: RawTestRow[];
  rawResults: RawTestResultRow[];
  rawPrizes: RawPrizeRow[];
  source: 'live' | 'cache' | 'demo';
  lastUpdated: string;
  error?: string;
}

export interface StoredSettings {
  sourceType: 'demo' | 'live';
  sheetId: string;
  studentsTab: string;
  testsTab: string;
  resultsTab: string;
  prizesTab: string;
  googleFormUrl: string;
  streakThresholdPercent: number;
  championshipTotalTests: number;
  provisionalMinTests: number;
}

export const DEFAULT_SETTINGS: StoredSettings = {
  sourceType: 'demo',
  sheetId: '1QDany--BNFoCEfbBhWJdY_WJInNIPLDNfLV-c44Vg24',
  studentsTab: 'STUDENTS',
  testsTab: 'TESTS',
  resultsTab: 'TEST_RESULTS',
  prizesTab: 'PRIZES',
  googleFormUrl: 'https://forms.google.com',
  streakThresholdPercent: 80,
  championshipTotalTests: 15,
  provisionalMinTests: 3,
};

export function loadSettings(): StoredSettings {
  try {
    const raw = localStorage.getItem(CACHE_KEY_SETTINGS);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load settings from localStorage:', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: StoredSettings): void {
  try {
    localStorage.setItem(CACHE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

async function fetchTabCsv(sheetId: string, tabName: string): Promise<string> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
  const response = await fetch(url, { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error(`Failed to fetch tab "${tabName}" (HTTP ${response.status})`);
  }
  return await response.text();
}

function parseCsv<T>(csvText: string): T[] {
  const result = Papa.parse<T>(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
    transformHeader: (header) => header.trim(),
  });
  return result.data;
}

export async function fetchLeaderboardData(settings: StoredSettings): Promise<SheetFetchResult> {
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // If set to demo or sheet ID is empty, use rich demo dataset
  if (settings.sourceType === 'demo' || !settings.sheetId.trim()) {
    const dataset = validateAndSanitize(
      DEMO_STUDENTS,
      DEMO_TESTS,
      DEMO_TEST_RESULTS,
      DEMO_PRIZES
    );
    return {
      dataset,
      rawStudents: DEMO_STUDENTS,
      rawTests: DEMO_TESTS,
      rawResults: DEMO_TEST_RESULTS,
      rawPrizes: DEMO_PRIZES,
      source: 'demo',
      lastUpdated: nowStr,
    };
  }

  // Attempt live Google Sheet fetch
  try {
    const [studentsCsv, testsCsv, resultsCsv, prizesCsv] = await Promise.all([
      fetchTabCsv(settings.sheetId, settings.studentsTab),
      fetchTabCsv(settings.sheetId, settings.testsTab),
      fetchTabCsv(settings.sheetId, settings.resultsTab),
      fetchTabCsv(settings.sheetId, settings.prizesTab).catch(() => ''), // Prizes tab can be optional
    ]);

    const rawStudents = parseCsv<RawStudentRow>(studentsCsv);
    const rawTests = parseCsv<RawTestRow>(testsCsv);
    const rawResults = parseCsv<RawTestResultRow>(resultsCsv);
    const rawPrizes = prizesCsv ? parseCsv<RawPrizeRow>(prizesCsv) : DEMO_PRIZES;

    // If live sheet tabs are empty, fallback to demo data and inform teacher
    if (rawStudents.length === 0 && rawTests.length === 0) {
      const fallbackDataset = validateAndSanitize(
        DEMO_STUDENTS,
        DEMO_TESTS,
        DEMO_TEST_RESULTS,
        DEMO_PRIZES
      );
      return {
        dataset: fallbackDataset,
        rawStudents: DEMO_STUDENTS,
        rawTests: DEMO_TESTS,
        rawResults: DEMO_TEST_RESULTS,
        rawPrizes: DEMO_PRIZES,
        source: 'live',
        lastUpdated: nowStr,
        error: 'Connected Google Sheet is currently empty. Showing demo data until you paste or import students and tests!',
      };
    }

    const dataset = validateAndSanitize(rawStudents, rawTests, rawResults, rawPrizes);

    // Save successful fetch to cache
    const cachePayload = {
      rawStudents,
      rawTests,
      rawResults,
      rawPrizes,
      lastUpdated: nowStr,
    };
    try {
      localStorage.setItem(CACHE_KEY_DATA, JSON.stringify(cachePayload));
    } catch {
      // ignore storage quota errors
    }

    return {
      dataset,
      rawStudents,
      rawTests,
      rawResults,
      rawPrizes,
      source: 'live',
      lastUpdated: nowStr,
    };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unable to connect to Google Sheets.';
    console.warn('Google Sheets live fetch failed, attempting cache fallback:', errorMsg);

    // Attempt cache fallback
    try {
      const cached = localStorage.getItem(CACHE_KEY_DATA);
      if (cached) {
        const parsedCache = JSON.parse(cached);
        const dataset = validateAndSanitize(
          parsedCache.rawStudents,
          parsedCache.rawTests,
          parsedCache.rawResults,
          parsedCache.rawPrizes
        );
        return {
          dataset,
          rawStudents: parsedCache.rawStudents,
          rawTests: parsedCache.rawTests,
          rawResults: parsedCache.rawResults,
          rawPrizes: parsedCache.rawPrizes,
          source: 'cache',
          lastUpdated: parsedCache.lastUpdated || nowStr,
          error: `Unable to refresh live data (${errorMsg}). Showing cached data.`,
        };
      }
    } catch (e) {
      console.error('Cache read error:', e);
    }

    // Fallback to Demo Dataset so app never crashes
    const fallbackDataset = validateAndSanitize(
      DEMO_STUDENTS,
      DEMO_TESTS,
      DEMO_TEST_RESULTS,
      DEMO_PRIZES
    );
    return {
      dataset: fallbackDataset,
      rawStudents: DEMO_STUDENTS,
      rawTests: DEMO_TESTS,
      rawResults: DEMO_TEST_RESULTS,
      rawPrizes: DEMO_PRIZES,
      source: 'demo',
      lastUpdated: nowStr,
      error: `Could not fetch Google Sheet (${errorMsg}). Displaying demo dataset.`,
    };
  }
}
