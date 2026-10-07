import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Minus, ChevronRight, Flame } from 'lucide-react';
import type { StudentStats } from '../../types/student';
import { LiveScoreCounter } from './LiveScoreCounter';

interface LeaderboardCardsProps {
  students: StudentStats[];
  onSelectStudent: (student: StudentStats) => void;
  selectedStudentId?: string;
}

export const LeaderboardCards: React.FC<LeaderboardCardsProps> = ({
  students,
  onSelectStudent,
  selectedStudentId,
}) => {
  if (students.length === 0) {
    return (
      <div className="md:hidden py-12 text-center border border-stone-200 rounded-2xl bg-white my-4 shadow-sm">
        <p className="text-xs text-stone-500 font-medium">No students found matching your criteria.</p>
      </div>
    );
  }

  const renderMovement = (movement: StudentStats['rankMovement']) => {
    switch (movement.direction) {
      case 'UP':
        return (
          <span className="inline-flex items-center gap-0.5 font-mono text-[11px] font-bold text-emerald-600">
            <ArrowUp className="w-3 h-3 stroke-[2.5]" />
            +{movement.delta}
          </span>
        );
      case 'DOWN':
        return (
          <span className="inline-flex items-center gap-0.5 font-mono text-[11px] font-bold text-rose-600">
            <ArrowDown className="w-3 h-3 stroke-[2.5]" />
            -{movement.delta}
          </span>
        );
      case 'NEW':
        return <span className="font-mono text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded border border-indigo-200">NEW</span>;
      default:
        return (
          <span className="inline-flex items-center text-stone-300">
            <Minus className="w-3 h-3" />
          </span>
        );
    }
  };

  return (
    <div className="md:hidden space-y-3 my-4">
      {students.map((student, idx) => {
        const isTop3 = student.rank <= 3 && student.testsCompleted > 0;
        const rankFormatted = student.rank < 10 ? `0${student.rank}` : `${student.rank}`;
        const isSelected = student.studentId === selectedStudentId;

        return (
          <motion.div
            key={student.studentId}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectStudent(student)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm ${
              isSelected
                ? 'border-indigo-400 bg-indigo-50/40 ring-2 ring-indigo-500/20'
                : isTop3
                ? student.rank === 1
                  ? 'border-amber-300/80 bg-gradient-to-r from-amber-50/40 to-white'
                  : 'border-stone-300 bg-white'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            {/* Top row: Rank, Name, Score */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl font-mono text-xs font-black flex items-center justify-center flex-shrink-0 ${
                  student.rank === 1
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : student.rank === 2
                    ? 'bg-slate-100 text-slate-800 border border-slate-300'
                    : student.rank === 3
                    ? 'bg-orange-100 text-orange-950 border border-orange-300'
                    : 'bg-stone-100 text-stone-600'
                }`}>
                  {rankFormatted}
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-stone-950 text-sm truncate">
                    {student.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-mono mt-0.5">
                    <span>Class {student.className}-{student.section}</span>
                    <span>•</span>
                    <span>{renderMovement(student.rankMovement)}</span>
                  </div>
                </div>
              </div>

              {/* Overall percentage */}
              <div className="text-right flex-shrink-0 ml-2">
                <div className="text-base font-mono font-black text-stone-950 tabular-nums">
                  <LiveScoreCounter value={student.overallAverage} />
                </div>
                <span className="text-[10px] font-mono uppercase text-stone-400 font-semibold">
                  Overall
                </span>
              </div>
            </div>

            {/* Bottom summary strip */}
            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600 font-mono">
              <div>
                <span className="text-stone-400">Form: </span>
                <span className="font-semibold text-stone-800">
                  {student.currentForm > 0 ? (
                    <LiveScoreCounter value={student.currentForm} />
                  ) : (
                    '—'
                  )}
                </span>
              </div>

              <div>
                <span className="text-stone-400">Streak: </span>
                <span className="font-semibold text-amber-700">
                  {student.activeStreak > 0 ? (
                    <span className="inline-flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-amber-500 inline" />
                      {student.activeStreak}
                    </span>
                  ) : (
                    '—'
                  )}
                </span>
              </div>

              <div className="flex items-center text-stone-500 font-medium">
                <span>{student.testsCompleted} tests</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1 text-stone-400" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

