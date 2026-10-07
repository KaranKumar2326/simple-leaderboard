import React, { useEffect, useRef } from 'react';
import { Search, X, Sparkles, Command } from 'lucide-react';
import { useChampionship } from '../../context/ChampionshipContext';

export const FilterBar: React.FC = () => {
  const {
    filterClass,
    setFilterClass,
    filterSection,
    setFilterSection,
    searchQuery,
    setSearchQuery,
    availableClasses,
    availableSections,
    filteredStudents,
  } = useChampionship();

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener: Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchQuery]);

  return (
    <div className="py-4 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Segmented Controls for Class Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
        <span className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider mr-1 hidden sm:inline-flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          Filter:
        </span>

        <button
          onClick={() => setFilterClass('All')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all whitespace-nowrap ${
            filterClass === 'All'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
          }`}
        >
          All Classes
        </button>

        {availableClasses.map((cls) => (
          <button
            key={cls}
            onClick={() => setFilterClass(cls)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all whitespace-nowrap ${
              filterClass === cls
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            Class {cls}
          </button>
        ))}

        {/* Section filter */}
        {availableSections.length > 1 && (
          <div className="ml-2 pl-2 border-l border-stone-200 flex items-center">
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl px-2.5 py-1.5 border-0 focus:ring-2 focus:ring-stone-900 cursor-pointer transition-colors"
            >
              <option value="All">All Sections</option>
              {availableSections.map((sec) => (
                <option key={sec} value={sec}>
                  Section {sec}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Search Input & Student Count */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 sm:w-72">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search student or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-16 py-1.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition-all"
          />

          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5 rounded"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200 text-[10px] font-mono text-stone-500 pointer-events-none">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          )}
        </div>

        <span className="text-xs font-mono font-semibold text-stone-500 whitespace-nowrap bg-stone-100/80 px-2.5 py-1 rounded-lg border border-stone-200/80">
          {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'}
        </span>
      </div>
    </div>
  );
};

