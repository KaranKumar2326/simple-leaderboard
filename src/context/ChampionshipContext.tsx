import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { StudentStats, ValidationIssue } from '../types/student';
import type { TestInfo } from '../types/test';
import type { Prize, ChampionshipStatus } from '../types/prize';
import {
  loadSettings,
  saveSettings,
  fetchLeaderboardData,
  type StoredSettings,
} from '../services/googleSheetService';
import { computeStudentStatistics } from '../engine/calculations';
import { computeSpotlights, type SpotlightsData } from '../engine/spotlights';

interface ChampionshipContextType {
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  lastUpdated: string;
  source: 'live' | 'cache' | 'demo';
  settings: StoredSettings;
  updateSettings: (newSettings: Partial<StoredSettings>) => void;
  refreshData: () => Promise<void>;
  
  // Data
  allStudents: StudentStats[];
  filteredStudents: StudentStats[];
  tests: Map<string, TestInfo>;
  prizes: Prize[];
  issues: ValidationIssue[];
  spotlights: SpotlightsData;
  championshipStatus: ChampionshipStatus;

  // Filters & State
  filterClass: string;
  setFilterClass: (val: string) => void;
  filterSection: string;
  setFilterSection: (val: string) => void;
  filterSubject: string;
  setFilterSubject: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  availableClasses: string[];
  availableSections: string[];
  availableSubjects: string[];

  // Selected student for modal view
  selectedStudent: StudentStats | null;
  setSelectedStudent: (student: StudentStats | null) => void;

  // Modals
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

const ChampionshipContext = createContext<ChampionshipContextType | undefined>(undefined);

export const ChampionshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettingsState] = useState<StoredSettings>(loadSettings);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [source, setSource] = useState<'live' | 'cache' | 'demo'>('demo');

  // Raw validated dataset state
  const [rawStudentsMap, setRawStudentsMap] = useState<Map<string, any>>(new Map());
  const [rawTestsMap, setRawTestsMap] = useState<Map<string, TestInfo>>(new Map());
  const [rawScores, setRawScores] = useState<any[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);

  // Filters
  const [filterClass, setFilterClass] = useState<string>('7'); // Default to primary class 7
  const [filterSection, setFilterSection] = useState<string>('All');
  const [filterSubject, setFilterSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [selectedStudent, setSelectedStudent] = useState<StudentStats | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const loadData = useCallback(async (currentSettings: StoredSettings, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await fetchLeaderboardData(currentSettings);
      setRawStudentsMap(res.dataset.students);
      setRawTestsMap(res.dataset.tests);
      setRawScores(res.dataset.scoreRecords);
      setPrizes(res.dataset.prizes);
      setIssues(res.dataset.issues);
      setSource(res.source);
      setLastUpdated(res.lastUpdated);
      if (res.error) {
        setError(res.error);
      }
    } catch (e: any) {
      setError(e?.message || 'Error fetching data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData(settings);
  }, [loadData]);

  const updateSettings = useCallback((newSettings: Partial<StoredSettings>) => {
    setSettingsState((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      loadData(updated, true);
      return updated;
    });
  }, [loadData]);

  const refreshData = useCallback(async () => {
    await loadData(settings, true);
  }, [loadData, settings]);

  // Compute all students rankings and stats
  const allStudents = useMemo(() => {
    if (rawStudentsMap.size === 0) return [];
    return computeStudentStatistics(rawStudentsMap, rawTestsMap, rawScores, {
      streakThresholdPercent: settings.streakThresholdPercent,
      provisionalMinTests: settings.provisionalMinTests,
    });
  }, [rawStudentsMap, rawTestsMap, rawScores, settings.streakThresholdPercent, settings.provisionalMinTests]);

  // Extract available filter options
  const availableClasses = useMemo(() => {
    const classSet = new Set<string>();
    allStudents.forEach((s) => {
      if (s.className) classSet.add(s.className);
    });
    return Array.from(classSet).sort();
  }, [allStudents]);

  const availableSections = useMemo(() => {
    const secSet = new Set<string>();
    allStudents.forEach((s) => {
      if (s.section && (filterClass === 'All' || s.className === filterClass)) {
        secSet.add(s.section);
      }
    });
    return Array.from(secSet).sort();
  }, [allStudents, filterClass]);

  const availableSubjects = useMemo(() => {
    const subSet = new Set<string>();
    rawTestsMap.forEach((t) => {
      if (t.subject) subSet.add(t.subject);
    });
    return Array.from(subSet).sort();
  }, [rawTestsMap]);

  // Compute filtered students
  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      // Class filter
      if (filterClass !== 'All' && student.className !== filterClass) {
        return false;
      }
      // Section filter
      if (filterSection !== 'All' && student.section !== filterSection) {
        return false;
      }
      // Search query (Student name or ID)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = student.name.toLowerCase().includes(q);
        const matchesId = student.studentId.toLowerCase().includes(q);
        if (!matchesName && !matchesId) return false;
      }
      return true;
    });
  }, [allStudents, filterClass, filterSection, searchQuery]);

  // Compute spotlights
  const spotlights = useMemo(() => {
    const targetSet = filterClass === 'All' ? allStudents : allStudents.filter((s) => s.className === filterClass);
    return computeSpotlights(targetSet);
  }, [allStudents, filterClass]);

  // Compute championship status
  const championshipStatus = useMemo((): ChampionshipStatus => {
    // Tests applicable to this class or overall
    const applicableTests = Array.from(rawTestsMap.values()).filter((t) => {
      return !t.targetClass || filterClass === 'All' || t.targetClass === filterClass || t.targetClass === 'All';
    });

    const completedTestsCount = Math.max(
      ...allStudents
        .filter((s) => filterClass === 'All' || s.className === filterClass)
        .map((s) => s.testsCompleted),
      0
    );

    const totalRequired = settings.championshipTotalTests || 15;
    const remaining = Math.max(0, totalRequired - completedTestsCount);
    const isCompleted = completedTestsCount >= totalRequired;

    const classRankers = allStudents.filter((s) => filterClass === 'All' || s.className === filterClass);

    return {
      season: applicableTests[0]?.season || 'Season 1',
      totalRequiredTests: totalRequired,
      completedTests: completedTestsCount,
      remainingTests: remaining,
      isCompleted,
      topRankers: {
        champion: classRankers[0]
          ? { studentId: classRankers[0].studentId, name: classRankers[0].name, percentage: classRankers[0].overallAverage }
          : undefined,
        runnerUp: classRankers[1]
          ? { studentId: classRankers[1].studentId, name: classRankers[1].name, percentage: classRankers[1].overallAverage }
          : undefined,
        thirdPlace: classRankers[2]
          ? { studentId: classRankers[2].studentId, name: classRankers[2].name, percentage: classRankers[2].overallAverage }
          : undefined,
      },
      prizes: prizes.map((p) => ({
        ...p,
        status: isCompleted || p.requiredTests <= completedTestsCount ? 'UNLOCKED' : 'LOCKED',
      })),
    };
  }, [rawTestsMap, allStudents, filterClass, settings.championshipTotalTests, prizes]);

  return (
    <ChampionshipContext.Provider
      value={{
        loading,
        refreshing,
        error,
        lastUpdated,
        source,
        settings,
        updateSettings,
        refreshData,
        allStudents,
        filteredStudents,
        tests: rawTestsMap,
        prizes,
        issues,
        spotlights,
        championshipStatus,
        filterClass,
        setFilterClass,
        filterSection,
        setFilterSection,
        filterSubject,
        setFilterSubject,
        searchQuery,
        setSearchQuery,
        availableClasses,
        availableSections,
        availableSubjects,
        selectedStudent,
        setSelectedStudent,
        isSettingsOpen,
        setIsSettingsOpen,
      }}
    >
      {children}
    </ChampionshipContext.Provider>
  );
};

export const useChampionship = () => {
  const context = useContext(ChampionshipContext);
  if (!context) {
    throw new Error('useChampionship must be used within a ChampionshipProvider');
  }
  return context;
};
