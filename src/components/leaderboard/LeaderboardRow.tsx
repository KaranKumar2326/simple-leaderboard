import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Minus, ArrowRight, Flame } from 'lucide-react';
import type { StudentStats } from '../../types/student';
import { LiveScoreCounter } from './LiveScoreCounter';
import { StudentAvatar } from '../common/StudentAvatar';

interface LeaderboardRowProps {
  student: StudentStats;
  index: number;
  isSelected?: boolean;
  onSelect: (student: StudentStats) => void;
}

export const LeaderboardRow: React.FC<LeaderboardRowProps> = ({
  student,
  index,
  isSelected = false,
  onSelect,
}) => {
  const isTop3 = student.rank <= 3 && student.testsCompleted > 0;

  const renderMovement = (movement: StudentStats['rankMovement']) => {
    switch (movement.direction) {
      case 'UP':
        return (
          <span className="inline-flex items-center gap-0.5 font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            <ArrowUp className="w-3 h-3 stroke-[2.5]" />
            +{movement.delta}
          </span>
        );
      case 'DOWN':
        return (
          <span className="inline-flex items-center gap-0.5 font-mono text-xs font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
            <ArrowDown className="w-3 h-3 stroke-[2.5]" />
            -{movement.delta}
          </span>
        );
      case 'NEW':
        return (
          <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
            NEW
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-stone-300">
            <Minus className="w-3.5 h-3.5" />
          </span>
        );
    }
  };

  const getRankBadgeStyle = (rank: number) => {
    if (rank === 1) return 'bg-amber-100 text-amber-900 border-amber-300 font-black';
    if (rank === 2) return 'bg-slate-100 text-slate-800 border-slate-300 font-bold';
    if (rank === 3) return 'bg-orange-100 text-orange-950 border-orange-300 font-bold';
    return 'bg-stone-50 text-stone-600 border-stone-200 font-medium';
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ scale: 1.002, backgroundColor: 'rgba(248, 250, 252, 1)' }}
      onClick={() => onSelect(student)}
      className={`group cursor-pointer transition-colors duration-150 border-b border-stone-100 ${
        isSelected ? 'bg-indigo-50/60' : isTop3 ? 'bg-amber-50/20' : 'bg-white'
      }`}
    >
      {/* Pos */}
      <td className="py-3.5 px-4 text-center">
        <span
          className={`inline-block w-8 py-0.5 rounded-lg border text-xs font-mono tabular-nums ${getRankBadgeStyle(
            student.rank
          )}`}
        >
          {student.rank < 10 ? `0${student.rank}` : student.rank}
        </span>
      </td>

      {/* Move */}
      <td className="py-3.5 px-2 text-center">
        {renderMovement(student.rankMovement)}
      </td>

      {/* Student Name & Avatar */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <StudentAvatar
            name={student.name}
            studentId={student.studentId}
            photoUrl={student.photoUrl}
            size="sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900 group-hover:text-indigo-600 transition-colors">
                {student.name}
              </span>
              {student.isProvisional && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 border border-stone-200">
                  Provisional
                </span>
              )}
            </div>
            <span className="text-[11px] font-mono text-stone-400">
              ID: {student.studentId}
            </span>
          </div>
        </div>
      </td>

      {/* Class */}
      <td className="py-3.5 px-3 text-center font-mono text-xs font-semibold text-stone-600">
        <span className="px-2 py-0.5 rounded bg-stone-100 border border-stone-200">
          {student.className}-{student.section}
        </span>
      </td>

      {/* Tests Logged */}
      <td className="py-3.5 px-4 text-center font-mono text-xs text-stone-600">
        <span className="tabular-nums font-semibold text-stone-800">{student.testsCompleted}</span>
      </td>

      {/* Overall Score + Mini Progress Bar */}
      <td className="py-3.5 px-4 text-right">
        <div className="inline-block text-right">
          <div className="font-mono text-sm font-black text-stone-950 tabular-nums">
            <LiveScoreCounter value={student.overallAverage} />
          </div>
          <div className="w-20 bg-stone-100 h-1 rounded-full overflow-hidden mt-1 ml-auto">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                student.overallAverage >= 90
                  ? 'bg-amber-500'
                  : student.overallAverage >= 80
                  ? 'bg-indigo-600'
                  : 'bg-stone-500'
              }`}
              style={{ width: `${Math.min(100, student.overallAverage)}%` }}
            />
          </div>
        </div>
      </td>

      {/* Current Form (Last 3) */}
      <td className="py-3.5 px-4 text-right font-mono text-xs font-semibold text-stone-700 tabular-nums">
        {student.currentForm > 0 ? (
          <LiveScoreCounter value={student.currentForm} />
        ) : (
          <span className="text-stone-300">—</span>
        )}
      </td>

      {/* Streak */}
      <td className="py-3.5 px-4 text-center font-mono">
        {student.activeStreak > 0 ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold tabular-nums">
            <Flame className="w-3 h-3 fill-amber-500 text-amber-600" />
            {student.activeStreak}
          </span>
        ) : (
          <span className="text-stone-300 text-xs">—</span>
        )}
      </td>

      {/* Action Arrow */}
      <td className="py-3.5 px-4 text-right">
        <span className="inline-flex items-center p-1 rounded-lg text-stone-400 group-hover:text-stone-900 group-hover:bg-stone-100 transition-all">
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </td>
    </motion.tr>
  );
};
