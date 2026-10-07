import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronUp, UserCheck, X } from 'lucide-react';
import type { StudentStats } from '../../types/student';
import { LiveScoreCounter } from './LiveScoreCounter';

interface UserRankStickyBarProps {
  currentUser: StudentStats | null;
  allStudents: StudentStats[];
  onSelectStudent: (student: StudentStats) => void;
  onClearUser?: () => void;
}

export const UserRankStickyBar: React.FC<UserRankStickyBarProps> = ({
  currentUser,
  allStudents,
  onSelectStudent,
  onClearUser,
}) => {
  if (!currentUser) return null;

  // Find next student above current user
  const sorted = [...allStudents].sort((a, b) => a.rank - b.rank);
  const userIndex = sorted.findIndex((s) => s.studentId === currentUser.studentId);
  const nextAbove = userIndex > 0 ? sorted[userIndex - 1] : null;

  const pointsToNext = nextAbove
    ? Math.max(0, (nextAbove.overallAverage - currentUser.overallAverage))
    : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 80, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl"
      >
        <div className="relative bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.12)] rounded-2xl p-3.5 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3 text-stone-900">
          {/* Glowing accent border */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none border border-indigo-500/20" />

          {/* Left: User Avatar & Rank Badge */}
          <div
            onClick={() => onSelectStudent(currentUser)}
            className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-mono font-bold text-sm flex items-center justify-center shadow-md shadow-indigo-500/20">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="absolute -top-1 -right-1 bg-stone-900 text-white font-mono text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-white">
                #{currentUser.rank}
              </span>
            </div>

            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-indigo-600 transition-colors truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 flex-shrink-0">
                  Your Rank
                </span>
              </div>
              <div className="text-[11px] text-stone-500 font-mono flex items-center gap-2 mt-0.5">
                <span>Class {currentUser.className}-{currentUser.section}</span>
                <span>•</span>
                <span className="text-stone-700 font-semibold">
                  <LiveScoreCounter value={currentUser.overallAverage} suffix="%" />
                </span>
              </div>
            </div>
          </div>

          {/* Center: Gap to Overtake */}
          {nextAbove && pointsToNext > 0 ? (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-600">
              <ChevronUp className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>
                <strong className="text-stone-900 font-mono">+{pointsToNext.toFixed(1)}%</strong> to pass Rank #{nextAbove.rank} ({nextAbove.name.split(' ')[0]})
              </span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs font-semibold text-amber-800">
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
              <span>Leading Rank #1!</span>
            </div>
          )}

          {/* Right Action */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => onSelectStudent(currentUser)}
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-sm flex items-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Profile</span>
            </button>
            {onClearUser && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClearUser();
                }}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                title="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
