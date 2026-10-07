import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy } from 'lucide-react';
import type { StudentStats } from '../../types/student';
import { PodiumCard } from './PodiumCard';

interface HeroPodiumProps {
  topStudents: StudentStats[];
  onSelectStudent: (student: StudentStats) => void;
}

export const HeroPodium: React.FC<HeroPodiumProps> = ({ topStudents, onSelectStudent }) => {
  if (!topStudents || topStudents.length === 0) return null;

  const first = topStudents[0];
  const second = topStudents[1];
  const third = topStudents[2];

  return (
    <section className="py-6 sm:py-8 border-b border-stone-200">
      {/* Header section with live badge */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-stone-200 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-200/80 uppercase mb-2">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            Official Championship Standings
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-950 uppercase flex items-center gap-2.5">
            The Podium
            <Trophy className="w-8 h-8 text-amber-500 fill-amber-400 hidden sm:inline" />
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-md">
          Live championship rankings recalculated instantly across all completed assessments and submissions.
        </p>
      </div>

      {/* Podium Grid (2nd place left, 1st center elevated, 3rd right) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-4 items-end pt-2 pb-6">
        {second && (
          <PodiumCard student={second} place={2} onSelect={onSelectStudent} />
        )}
        {first && (
          <PodiumCard student={first} place={1} onSelect={onSelectStudent} />
        )}
        {third && (
          <PodiumCard student={third} place={3} onSelect={onSelectStudent} />
        )}
      </div>
    </section>
  );
};

