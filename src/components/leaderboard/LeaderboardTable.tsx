import React from 'react';
import { ArrowUp, ArrowDown, Minus, ArrowRight } from 'lucide-react';
import type { StudentStats } from '../../types/student';

interface LeaderboardTableProps {
  students: StudentStats[];
  onSelectStudent: (student: StudentStats) => void;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ students, onSelectStudent }) => {
  if (students.length === 0) {
    return (
      <div className="py-16 text-center border border-stone-200 rounded-lg bg-white my-6">
        <h3 className="text-base font-bold text-stone-900 uppercase tracking-tight">No Students Found</h3>
        <p className="text-xs text-stone-500 mt-1">Try adjusting your class filter or search criteria.</p>
      </div>
    );
  }

  const renderRankNumber = (rank: number) => {
    const formatted = rank < 10 ? `0${rank}` : `${rank}`;
    if (rank === 1) {
      return (
        <span className="font-mono font-black text-amber-700">
          {formatted}
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="font-mono font-bold text-stone-700">
          {formatted}
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="font-mono font-bold text-orange-800">
          {formatted}
        </span>
      );
    }
    return (
      <span className="font-mono font-medium text-stone-500">
        {formatted}
      </span>
    );
  };

  const renderMovement = (movement: StudentStats['rankMovement']) => {
    switch (movement.direction) {
      case 'UP':
        return (
          <span className="inline-flex items-center gap-0.5 font-mono text-xs font-semibold text-emerald-700">
            <ArrowUp className="w-3 h-3 stroke-[2.5]" />
            {movement.delta}
          </span>
        );
      case 'DOWN':
        return (
          <span className="inline-flex items-center gap-0.5 font-mono text-xs font-semibold text-rose-700">
            <ArrowDown className="w-3 h-3 stroke-[2.5]" />
            {movement.delta}
          </span>
        );
      case 'NEW':
        return (
          <span className="font-mono text-[10px] font-bold text-stone-600 bg-stone-100 px-1 py-0.5 rounded">
            NEW
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-stone-300">
            <Minus className="w-3 h-3" />
          </span>
        );
    }
  };

  return (
    <div className="hidden md:block my-6 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50/75 text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">
            <th className="py-3 px-4 w-14 text-center">Pos</th>
            <th className="py-3 px-2 w-14 text-center">Move</th>
            <th className="py-3 px-4">Student</th>
            <th className="py-3 px-3 text-center">Class</th>
            <th className="py-3 px-4 text-center">Tests</th>
            <th className="py-3 px-4 text-right">Overall</th>
            <th className="py-3 px-4 text-right">Current Form</th>
            <th className="py-3 px-4 text-center">Streak</th>
            <th className="py-3 px-4 text-right w-16">Profile</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 text-xs">
          {students.map((student) => {
            const isTop3 = student.rank <= 3 && student.testsCompleted > 0;

            return (
              <tr
                key={student.studentId}
                onClick={() => onSelectStudent(student)}
                className={`group cursor-pointer transition-colors duration-100 ${
                  isTop3
                    ? student.rank === 1
                      ? 'bg-amber-50/30 hover:bg-amber-50/60'
                      : 'hover:bg-stone-50'
                    : 'hover:bg-stone-50'
                }`}
              >
                {/* Pos */}
                <td className="py-3.5 px-4 text-center text-sm">
                  {renderRankNumber(student.rank)}
                </td>

                {/* Move */}
                <td className="py-3.5 px-2 text-center">
                  {renderMovement(student.rankMovement)}
                </td>

                {/* Student Name */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-950 group-hover:text-stone-900 group-hover:underline underline-offset-2">
                      {student.name}
                    </span>
                    {student.isProvisional && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                        Provisional
                      </span>
                    )}
                  </div>
                </td>

                {/* Class */}
                <td className="py-3.5 px-3 text-center font-mono text-stone-600">
                  {student.className}-{student.section}
                </td>

                {/* Tests Logged */}
                <td className="py-3.5 px-4 text-center font-mono text-stone-600">
                  {student.testsCompleted}
                </td>

                {/* Overall Score */}
                <td className="py-3.5 px-4 text-right">
                  <span className="font-mono text-sm font-black text-stone-950 tabular-nums">
                    {student.overallAverage.toFixed(1)}%
                  </span>
                </td>

                {/* Current Form */}
                <td className="py-3.5 px-4 text-right">
                  <span className="font-mono text-xs font-semibold text-stone-700 tabular-nums">
                    {student.currentForm > 0 ? `${student.currentForm.toFixed(1)}%` : '—'}
                  </span>
                </td>

                {/* Streak */}
                <td className="py-3.5 px-4 text-center font-mono">
                  {student.activeStreak > 0 ? (
                    <span className="font-bold text-amber-700 tabular-nums">
                      🔥 {student.activeStreak}
                    </span>
                  ) : (
                    <span className="text-stone-300">—</span>
                  )}
                </td>

                {/* View Action Arrow */}
                <td className="py-3.5 px-4 text-right">
                  <span className="inline-flex items-center text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
