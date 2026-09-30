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
import { AlertCircle } from 'lucide-react';

const MainApp: React.FC = () => {
  const {
    error,
    filteredStudents,
    selectedStudent,
    setSelectedStudent,
    isSettingsOpen,
    setIsSettingsOpen,
  } = useChampionship();

  const [activeTab, setActiveTab] = useState<'leaderboard' | 'spotlights' | 'championship'>('leaderboard');
  const [isTestExplorerOpen, setIsTestExplorerOpen] = useState(false);

  // Top 3 for hero showcase
  const top3Students = filteredStudents.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-stone-900 flex flex-col">
      
      {/* Editorial Masthead Navbar */}
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTestExplorer={() => setIsTestExplorerOpen(true)}
      />

      {/* Error notification banner if fallback was used */}
      {error && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-xs font-mono flex items-center justify-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-amber-700" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Editorial Top 3 Standings */}
        <HeroPodium
          topStudents={top3Students}
          onSelectStudent={(st) => setSelectedStudent(st)}
        />

        {/* Section Navigation Tabs (Restrained, Editorial) */}
        <div className="flex items-center justify-between border-b border-stone-200 my-6">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === 'leaderboard'
                  ? 'text-stone-950 border-b-2 border-stone-950'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Standings Table
            </button>

            <button
              onClick={() => setActiveTab('spotlights')}
              className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === 'spotlights'
                  ? 'text-stone-950 border-b-2 border-stone-950'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Highlights & Form
            </button>

            <button
              onClick={() => setActiveTab('championship')}
              className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === 'championship'
                  ? 'text-stone-950 border-b-2 border-stone-950'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
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
              onSelectStudent={(st) => setSelectedStudent(st)}
            />

            {/* Mobile Cards View */}
            <LeaderboardCards
              students={filteredStudents}
              onSelectStudent={(st) => setSelectedStudent(st)}
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
