import React from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Crown, Flame, ArrowUpRight, Award, Sparkles } from 'lucide-react';
import type { StudentStats } from '../../types/student';
import { LiveScoreCounter } from '../leaderboard/LiveScoreCounter';

interface PodiumCardProps {
  student: StudentStats;
  place: 1 | 2 | 3;
  onSelect: (student: StudentStats) => void;
}

export const PodiumCard: React.FC<PodiumCardProps> = ({ student, place, onSelect }) => {
  const triggerConfetti = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (place === 1) {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#fbbf24', '#d97706', '#6366f1', '#a855f7'],
      });
    }
  };

  // 1st place: taller, centered, glowing gold aura
  // 2nd place: silver aura
  // 3rd place: bronze / amber aura
  const config = {
    1: {
      orderClass: 'order-1 md:order-2',
      heightClass: 'md:-translate-y-4 md:scale-105',
      badge: 'Championship Leader',
      crownColor: 'text-amber-500 fill-amber-400',
      gradient: 'from-amber-500/15 via-yellow-500/5 to-white',
      border: 'border-amber-400/80 shadow-[0_10px_35px_rgba(245,158,11,0.18)] hover:shadow-[0_15px_45px_rgba(245,158,11,0.28)]',
      pill: 'bg-amber-100 text-amber-900 border-amber-300',
      rankBg: 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-white',
      number: '01',
    },
    2: {
      orderClass: 'order-2 md:order-1',
      heightClass: 'md:translate-y-0',
      badge: 'Silver Contender',
      crownColor: 'text-slate-400 fill-slate-300',
      gradient: 'from-slate-400/10 via-zinc-400/5 to-white',
      border: 'border-slate-300 shadow-[0_8px_30px_rgba(148,163,184,0.12)] hover:shadow-[0_12px_40px_rgba(148,163,184,0.22)]',
      pill: 'bg-slate-100 text-slate-800 border-slate-300',
      rankBg: 'bg-gradient-to-tr from-slate-500 to-slate-400 text-white',
      number: '02',
    },
    3: {
      orderClass: 'order-3 md:order-3',
      heightClass: 'md:translate-y-2',
      badge: 'Bronze Podium',
      crownColor: 'text-amber-700 fill-amber-600',
      gradient: 'from-amber-700/10 via-orange-600/5 to-white',
      border: 'border-amber-600/30 shadow-[0_8px_30px_rgba(180,83,9,0.1)] hover:shadow-[0_12px_35px_rgba(180,83,9,0.2)]',
      pill: 'bg-amber-50 text-amber-900 border-amber-200',
      rankBg: 'bg-gradient-to-tr from-amber-700 to-orange-500 text-white',
      number: '03',
    },
  }[place];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: place === 1 ? 0.1 : place === 2 ? 0.2 : 0.3 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onClick={() => onSelect(student)}
      onMouseEnter={place === 1 ? triggerConfetti : undefined}
      className={`relative cursor-pointer rounded-2xl border bg-gradient-to-b ${config.gradient} ${config.border} p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 ${config.orderClass} ${config.heightClass} group will-change-transform`}
    >
      {/* Top Banner Ribbon */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${config.rankBg} font-mono font-black text-sm sm:text-base flex items-center justify-center shadow-sm`}>
            {config.number}
          </div>
          <div>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${config.pill}`}>
              {place === 1 && <Sparkles className="w-2.5 h-2.5 fill-amber-500" />}
              {config.badge}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {place === 1 && (
            <Crown className={`w-6 h-6 ${config.crownColor} animate-bounce drop-shadow`} />
          )}
          {place > 1 && (
            <Award className={`w-5 h-5 ${config.crownColor}`} />
          )}
          <span className="p-1 rounded-full text-stone-400 group-hover:text-stone-900 group-hover:bg-white/80 transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Avatar & Student Name */}
      <div className="my-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white font-mono font-bold text-base flex items-center justify-center shadow-inner">
            {student.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-extrabold text-stone-950 truncate group-hover:text-indigo-600 transition-colors tracking-tight">
              {student.name}
            </h3>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              Class {student.className}-{student.section} • {student.testsCompleted} tests
            </p>
          </div>
        </div>
      </div>

      {/* Key Metric Blocks */}
      <div className="pt-3 border-t border-stone-200/70 grid grid-cols-3 gap-2">
        <div>
          <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold">
            Score
          </span>
          <div className="text-base sm:text-lg font-black text-stone-950">
            <LiveScoreCounter value={student.overallAverage} />
          </div>
        </div>

        <div className="border-l border-stone-200/70 pl-2">
          <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold">
            Form
          </span>
          <div className="text-base sm:text-lg font-bold text-stone-700">
            {student.currentForm > 0 ? (
              <LiveScoreCounter value={student.currentForm} />
            ) : (
              '—'
            )}
          </div>
        </div>

        <div className="border-l border-stone-200/70 pl-2">
          <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold">
            Streak
          </span>
          <div className="text-base sm:text-lg font-bold text-amber-700 font-mono">
            {student.activeStreak > 0 ? (
              <span className="flex items-center gap-0.5">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-600 inline" />
                {student.activeStreak}
              </span>
            ) : (
              '—'
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
