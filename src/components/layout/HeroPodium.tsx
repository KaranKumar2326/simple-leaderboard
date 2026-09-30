import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { StudentStats } from '../../types/student';

interface HeroPodiumProps {
  topStudents: StudentStats[];
  onSelectStudent: (student: StudentStats) => void;
}

export const HeroPodium: React.FC<HeroPodiumProps> = ({ topStudents, onSelectStudent }) => {
  if (!topStudents || topStudents.length === 0) return null;

  const first = topStudents[0];
  const second = topStudents[1];
  const third = topStudents[2];

  const leaders = [
    {
      student: first,
      rankDisplay: '01',
      rankTitle: 'LEADER',
      accentColor: 'border-amber-400 bg-amber-50/40',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      rankNumberClass: 'text-amber-900/90',
    },
    {
      student: second,
      rankDisplay: '02',
      rankTitle: 'SECOND',
      accentColor: 'border-slate-300 bg-slate-50/40',
      badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
      rankNumberClass: 'text-slate-700',
    },
    {
      student: third,
      rankDisplay: '03',
      rankTitle: 'THIRD',
      accentColor: 'border-orange-300 bg-orange-50/30',
      badgeClass: 'bg-orange-100 text-orange-900 border-orange-200',
      rankNumberClass: 'text-orange-900/80',
    },
  ].filter((item) => Boolean(item.student));

  return (
    <section className="py-8 border-b border-stone-200">
      {/* Editorial Title Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-stone-200">
        <div>
          <div className="text-[11px] font-mono font-bold tracking-widest text-stone-500 uppercase mb-1">
            Official Championship Standings
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-950 uppercase">
            Top Contenders
          </h1>
        </div>
        <p className="mt-2 md:mt-0 text-xs sm:text-sm text-stone-600 font-medium">
          Every test changes the table. Rankings update dynamically after each exam.
        </p>
      </div>

      {/* Top 3 Leaders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaders.map(({ student, rankDisplay, rankTitle, accentColor, badgeClass, rankNumberClass }) => (
          <div
            key={student.studentId}
            onClick={() => onSelectStudent(student)}
            className={`group cursor-pointer rounded-lg border p-5 transition-all duration-200 hover:shadow-md hover:border-stone-400 ${accentColor} flex flex-col justify-between`}
          >
            {/* Top row: Rank number and Badge */}
            <div className="flex items-start justify-between">
              <span className={`font-mono text-3xl sm:text-4xl font-black tracking-tight ${rankNumberClass}`}>
                {rankDisplay}
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border ${badgeClass}`}>
                  {rankTitle}
                </span>
                <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 transition-colors" />
              </div>
            </div>

            {/* Student Name & Meta */}
            <div className="my-4">
              <h2 className="text-lg sm:text-xl font-bold text-stone-950 group-hover:underline decoration-1 underline-offset-4 tracking-tight">
                {student.name}
              </h2>
              <p className="text-xs text-stone-500 font-mono mt-0.5">
                Class {student.className}-{student.section} · {student.testsCompleted} tests logged
              </p>
            </div>

            {/* Key Statistics Strip */}
            <div className="pt-3 border-t border-stone-200/80 grid grid-cols-3 gap-2">
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-500">
                  Overall
                </span>
                <span className="font-mono text-lg font-extrabold text-stone-950 tabular-nums">
                  {student.overallAverage.toFixed(1)}%
                </span>
              </div>
              <div className="border-l border-stone-200/80 pl-2">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-500">
                  Form (L3)
                </span>
                <span className="font-mono text-lg font-bold text-stone-800 tabular-nums">
                  {student.currentForm.toFixed(1)}%
                </span>
              </div>
              <div className="border-l border-stone-200/80 pl-2">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-500">
                  Streak
                </span>
                <span className="font-mono text-lg font-bold text-amber-700 tabular-nums">
                  🔥 {student.activeStreak}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
