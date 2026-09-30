import React from 'react';
import { ArrowUp, ArrowDown, Minus, ChevronRight } from 'lucide-react';
import type { StudentStats } from '../../types/student';

interface LeaderboardCardsProps {
  students: StudentStats[];
  onSelectStudent: (student: StudentStats) => void;
}

export const LeaderboardCards: React.FC<LeaderboardCardsProps> = ({ students, onSelectStudent }) => {
  if (students.length === 0) {
    return (
      <div className="md:hidden py-12 text-center border border-stone-200 rounded-lg bg-white my-4">
        <p className="text-xs text-stone-500 font-medium">No students found matching your criteria.</p>
      </div>
    );
  }

  const renderMovement = (movement: StudentStats['rankMovement']) => {
    switch (movement.direction) {
      case 'UP':
        return (
          <span className="inline-flex items-center gap-0.5 font-mono text-[11px] font-semibold text-emerald-700">
            <ArrowUp className="w-3 h-3 stroke-[2.5]" />
            {movement.delta}
          </span>
        );
      case 'DOWN':
        return (
          <span className="inline-flex items-center gap-0.5 font-mono text-[11px] font-semibold text-rose-700">
            <ArrowDown className="w-3 h-3 stroke-[2.5]" />
            {movement.delta}
          </span>
        );
      case 'NEW':
        return <span className="font-mono text-[9px] font-bold text-stone-600 bg-stone-100 px-1 py-0.5 rounded">NEW</span>;
      default:
        return (
          <span className="inline-flex items-center text-stone-300">
            <Minus className="w-3 h-3" />
          </span>
        );
    }
  };

  return (
    <div className="md:hidden space-y-2.5 my-4">
      {students.map((student) => {
        const isTop3 = student.rank <= 3 && student.testsCompleted > 0;
        const rankFormatted = student.rank < 10 ? `0${student.rank}` : `${student.rank}`;

        return (
          <div
            key={student.studentId}
            onClick={() => onSelectStudent(student)}
            className={`p-3.5 rounded-lg border transition-colors cursor-pointer bg-white ${
              isTop3
                ? student.rank === 1
                  ? 'border-amber-400 bg-amber-50/20'
                  : 'border-stone-300'
                : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            {/* Top row: Rank, Name, Score */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`font-mono text-base font-bold ${
                  student.rank === 1 ? 'text-amber-800' : student.rank === 2 ? 'text-stone-800' : student.rank === 3 ? 'text-orange-900' : 'text-stone-400'
                }`}>
                  {rankFormatted}
                </span>

                <div>
                  <h3 className="font-bold text-stone-950 text-sm">
                    {student.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                    <span>Class {student.className}-{student.section}</span>
                    <span>·</span>
                    <span>{renderMovement(student.rankMovement)}</span>
                  </div>
                </div>
              </div>

              {/* Overall percentage */}
              <div className="text-right">
                <div className="text-base font-mono font-black text-stone-950 tabular-nums">
                  {student.overallAverage.toFixed(1)}%
                </div>
                <span className="text-[10px] font-mono uppercase text-stone-400">
                  Overall
                </span>
              </div>
            </div>

            {/* Bottom summary strip */}
            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600 font-mono">
              <div>
                <span className="text-stone-400">Form: </span>
                <span className="font-semibold text-stone-800">
                  {student.currentForm > 0 ? `${student.currentForm.toFixed(1)}%` : '—'}
                </span>
              </div>

              <div>
                <span className="text-stone-400">Streak: </span>
                <span className="font-semibold text-amber-700">
                  {student.activeStreak > 0 ? `🔥 ${student.activeStreak}` : '—'}
                </span>
              </div>

              <div className="flex items-center text-stone-500">
                <span>{student.testsCompleted} tests</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1 text-stone-400" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
