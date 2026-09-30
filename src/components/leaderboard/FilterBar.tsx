import React from 'react';
import { Search, X } from 'lucide-react';
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

  return (
    <div className="py-4 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Segmented Controls for Class Filter */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
        <span className="text-xs font-mono font-semibold text-stone-500 uppercase tracking-wider mr-2 hidden sm:inline">
          Filter:
        </span>
        <button
          onClick={() => setFilterClass('All')}
          className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide transition-colors whitespace-nowrap ${
            filterClass === 'All'
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
          }`}
        >
          All Classes
        </button>
        {availableClasses.map((cls) => (
          <button
            key={cls}
            onClick={() => setFilterClass(cls)}
            className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide transition-colors whitespace-nowrap ${
              filterClass === cls
                ? 'bg-stone-900 text-white'
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
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded px-2.5 py-1.5 border-0 focus:ring-1 focus:ring-stone-900 cursor-pointer"
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
        <div className="relative flex-1 sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 bg-white border border-stone-200 rounded text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <span className="text-xs font-mono text-stone-500 whitespace-nowrap">
          {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'}
        </span>
      </div>
    </div>
  );
};
