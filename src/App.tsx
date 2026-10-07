import React, { useState } from 'react';
import { ChampionshipProvider, useChampionship } from './context/ChampionshipContext';
import { Navbar } from './components/layout/Navbar';
import { HeroPodium } from './components/layout/HeroPodium';
import { FilterBar } from './components/leaderboard/FilterBar';
import { LeaderboardTable } from './components/leaderboard/LeaderboardTable';
import { LeaderboardCards } from './components/leaderboard/LeaderboardCards';
import { SpecialSpotlights } from './components/spotlights/SpecialSpotlights';
import { ChampionshipHub } from './components/championship/ChampionshipHub';
import { StudentProfileModal } from './components/student/StudentProfileModal';
import { TestExplorerModal } from './components/tests/TestExplorerModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { Footer } from './components/layout/Footer';
import { UserRankStickyBar } from './components/leaderboard/UserRankStickyBar';
import { AlertCircle, Trophy, Sparkles, Flame } from 'lucide-react';

const MainApp: React.FC = () => {
  const {
    error,
    filteredStudents,
    allStudents,
    selectedStudent,
    setSelectedStudent,
    isSettingsOpen,
    setIsSettingsOpen,
  } = useChampionship();

  const [activeTab, setActiveTab] = useState<'leaderboard' | 'spotlights' | 'championship'>('leaderboard');
  const [isTestExplorerOpen, setIsTestExplorerOpen] = useState(false);
  const [pinnedStudentId, setPinnedStudentId] = useState<string | null>(null);

  // Top 3 for hero showcase
  const top3Students = filteredStudents.slice(0, 3);

  // Resolve pinned student or default to a lower rank to demonstrate sticky bar if user clicked
  const pinnedStudent = allStudents.find((s) => s.studentId === pinnedStudentId) || null;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-stone-900 flex flex-col font-sans antialiased selection:bg-stone-900 selection:text-white">
      
      {/* Editorial Masthead Navbar */}
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTestExplorer={() => setIsTestExplorerOpen(true)}
      />

      {/* Error notification banner if fallback was used */}
      {error && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs font-mono flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        
        {/* Dynamic Top 3 Podium */}
        <HeroPodium
          topStudents={top3Students}
          onSelectStudent={(st) => {
            setSelectedStudent(st);
            setPinnedStudentId(st.studentId);
          }}
        />

        {/* Section Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-stone-200 my-6">
          <div className="flex space-x-6 sm:space-x-8">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 relative ${
                activeTab === 'leaderboard'
                  ? 'text-stone-950 border-b-2 border-stone-950 font-black'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              Standings Table
            </button>

            <button
              onClick={() => setActiveTab('spotlights')}
              className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 relative ${
                activeTab === 'spotlights'
                  ? 'text-stone-950 border-b-2 border-stone-950 font-black'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Highlights & Form
            </button>

            <button
              onClick={() => setActiveTab('championship')}
              className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 relative ${
                activeTab === 'championship'
                  ? 'text-stone-950 border-b-2 border-stone-950 font-black'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Championship Tiers
            </button>
          </div>
        </div>

        {/* Tab 1: Leaderboard View */}
        {activeTab === 'leaderboard' && (
          <div>
            <FilterBar />

            {/* Desktop Table View */}
            <LeaderboardTable
              students={filteredStudents}
              selectedStudentId={pinnedStudentId || undefined}
              onSelectStudent={(st) => {
                setSelectedStudent(st);
                setPinnedStudentId(st.studentId);
              }}
            />

            {/* Mobile Cards View */}
            <LeaderboardCards
              students={filteredStudents}
              selectedStudentId={pinnedStudentId || undefined}
              onSelectStudent={(st) => {
                setSelectedStudent(st);
                setPinnedStudentId(st.studentId);
              }}
            />

            {/* Highlights Section directly below table */}
            <div className="pt-8">
              <SpecialSpotlights onSelectStudent={(st) => setSelectedStudent(st)} />
            </div>
          </div>
        )}

        {/* Tab 2: Spotlights & Highlights View */}
        {activeTab === 'spotlights' && (
          <div>
            <FilterBar />
            <SpecialSpotlights onSelectStudent={(st) => setSelectedStudent(st)} />
          </div>
        )}

        {/* Tab 3: Championship Race & Mystery Prize */}
        {activeTab === 'championship' && (
          <div>
            <FilterBar />
            <ChampionshipHub onSelectStudent={(st) => setSelectedStudent(st)} />
          </div>
        )}

      </main>

      {/* Floating User Rank Sticky Banner */}
      <UserRankStickyBar
        currentUser={pinnedStudent}
        allStudents={allStudents}
        onSelectStudent={(st) => setSelectedStudent(st)}
        onClearUser={() => setPinnedStudentId(null)}
      />

      {/* Footer */}
      <Footer />

      {/* Student Profile Modal */}
      <StudentProfileModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />

      {/* Test Explorer Modal */}
      <TestExplorerModal
        isOpen={isTestExplorerOpen}
        onClose={() => setIsTestExplorerOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <ChampionshipProvider>
      <MainApp />
    </ChampionshipProvider>
  );
}
