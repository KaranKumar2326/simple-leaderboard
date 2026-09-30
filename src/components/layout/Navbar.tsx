import React from 'react';
import { RefreshCw, Settings, ExternalLink, ShieldAlert, FileSpreadsheet, BookOpen } from 'lucide-react';
import { useChampionship } from '../../context/ChampionshipContext';

interface NavbarProps {
  onOpenSettings: () => void;
  onOpenTestExplorer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings, onOpenTestExplorer }) => {
  const {
    refreshData,
    refreshing,
    lastUpdated,
    source,
    settings,
    issues,
    championshipStatus,
  } = useChampionship();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Masthead / Brand */}
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-stone-900 text-white flex items-center justify-center font-mono font-bold text-sm tracking-wider shadow-sm">
              TC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-stone-900 uppercase">
                  Tuition Championship
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-300 rounded">
                  {championshipStatus.season}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                <span>Test {championshipStatus.completedTests} of {championshipStatus.totalRequiredTests}</span>
                <span className="text-stone-300">•</span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                  <span className={`w-1.5 h-1.5 rounded-full ${source === 'live' ? 'bg-emerald-600' : 'bg-amber-500'}`}></span>
                  <span className={source === 'live' ? 'text-emerald-700 font-semibold' : 'text-stone-600'}>
                    {source === 'live' ? 'LIVE SHEET' : source === 'cache' ? 'CACHED' : 'DEMO'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Download Excel File Button */}
            <a
              href="/Tuition_Championship_Data.xlsx"
              download="Tuition_Championship_Data.xlsx"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 text-xs font-semibold transition-colors"
              title="Download Tuition_Championship_Data.xlsx with all 4 sheets"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Excel (.xlsx)</span>
            </a>

            {/* Validation Notice */}
            {issues.length > 0 && (
              <button
                onClick={onOpenSettings}
                className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium hover:bg-amber-100 transition-colors"
                title={`${issues.length} data validation notice(s)`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>{issues.length} {issues.length === 1 ? 'Notice' : 'Notices'}</span>
              </button>
            )}

            {/* Test Log Button */}
            <button
              onClick={onOpenTestExplorer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs sm:text-sm font-medium transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Tests Log</span>
              <span className="sm:hidden">Tests</span>
            </button>

            {/* Google Form Link */}
            {settings.googleFormUrl && (
              <a
                href={settings.googleFormUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Enter Marks</span>
              </a>
            )}

            {/* Refresh Button */}
            <button
              onClick={() => refreshData()}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs sm:text-sm font-medium transition-colors disabled:opacity-50"
              title={`Last updated: ${lastUpdated || 'Just now'}`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-stone-900' : 'text-stone-500'}`} />
              <span className="hidden md:inline">{refreshing ? 'Syncing...' : 'Refresh'}</span>
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-md bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 border border-stone-200 transition-colors"
              title="Sheet Configuration & Settings"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
