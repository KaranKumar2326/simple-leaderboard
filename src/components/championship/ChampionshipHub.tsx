import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Lock, Unlock } from 'lucide-react';
import { useChampionship } from '../../context/ChampionshipContext';
import type { StudentStats } from '../../types/student';

interface ChampionshipHubProps {
  onSelectStudent: (student: StudentStats) => void;
}

export const ChampionshipHub: React.FC<ChampionshipHubProps> = ({ onSelectStudent }) => {
  const { championshipStatus, allStudents, filterClass } = useChampionship();
  const [revealedPrizes, setRevealedPrizes] = useState<Record<string, boolean>>({});

  const {
    season,
    totalRequiredTests,
    completedTests,
    remainingTests,
    isCompleted,
    prizes,
  } = championshipStatus;

  const progressPercent = Math.min(100, Math.round((completedTests / totalRequiredTests) * 100));

  // Filter students for current class
  const classStudents = allStudents.filter(
    (s) => (filterClass === 'All' || s.className === filterClass) && s.testsCompleted > 0
  );

  const handleReveal = (prizeId: string) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#0f172a', '#d97706', '#059669'],
    });

    setRevealedPrizes((prev) => ({ ...prev, [prizeId]: true }));
  };

  return (
    <section className="my-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 border-b border-stone-200 mb-8">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-stone-500 uppercase">
            {season.toUpperCase()} · TESTS 01—{totalRequiredTests < 10 ? `0${totalRequiredTests}` : totalRequiredTests}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-950 uppercase mt-0.5">
            Championship Standings
          </h2>
        </div>

        {/* Progress Tracker */}
        <div className="mt-4 md:mt-0 md:text-right">
          <div className="font-mono text-sm font-bold text-stone-900">
            {completedTests} / {totalRequiredTests} Tests Completed
          </div>
          <div className="text-xs text-stone-500 font-mono mt-0.5">
            {isCompleted ? 'Season Schedule Complete' : `${remainingTests} tests remaining until final cut`}
          </div>
        </div>
      </div>

      {/* Progress Bar (Subtle, Disciplined) */}
      <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-stone-900 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Current Leaders & Tiers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Championship Tier: Top 3 */}
        <div className="bg-white border border-stone-200 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-800">
              Gold Tier (Top 3)
            </span>
            <span className="text-[10px] font-mono text-stone-400">Podium</span>
          </div>

          <div className="space-y-2">
            {classStudents.slice(0, 3).map((st, idx) => (
              <div
                key={st.studentId}
                onClick={() => onSelectStudent(st)}
                className="group cursor-pointer flex items-center justify-between p-2 rounded hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-stone-400">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-stone-900 group-hover:underline">
                    {st.name}
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-stone-900 tabular-nums">
                  {st.overallAverage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Honors Tier: Top 4-10 */}
        <div className="bg-white border border-stone-200 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-700">
              Honors Tier (Rank 4—10)
            </span>
            <span className="text-[10px] font-mono text-stone-400">Contenders</span>
          </div>

          <div className="space-y-1.5">
            {classStudents.slice(3, 8).map((st) => (
              <div
                key={st.studentId}
                onClick={() => onSelectStudent(st)}
                className="group cursor-pointer flex items-center justify-between p-1.5 rounded hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[11px] text-stone-400">
                    {st.rank < 10 ? `0${st.rank}` : st.rank}
                  </span>
                  <span className="text-xs font-medium text-stone-800 group-hover:underline">
                    {st.name}
                  </span>
                </div>
                <span className="font-mono text-xs text-stone-600 tabular-nums">
                  {st.overallAverage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Merit Tier: Rank 11+ */}
        <div className="bg-white border border-stone-200 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-500">
              Rising Tier
            </span>
            <span className="text-[10px] font-mono text-stone-400">Chasing Pack</span>
          </div>

          <div className="space-y-1.5">
            {classStudents.slice(8, 13).map((st) => (
              <div
                key={st.studentId}
                onClick={() => onSelectStudent(st)}
                className="group cursor-pointer flex items-center justify-between p-1.5 rounded hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[11px] text-stone-400">
                    {st.rank < 10 ? `0${st.rank}` : st.rank}
                  </span>
                  <span className="text-xs font-medium text-stone-700 group-hover:underline">
                    {st.name}
                  </span>
                </div>
                <span className="font-mono text-xs text-stone-500 tabular-nums">
                  {st.overallAverage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Championship Rewards Section */}
      <div>
        <div className="pb-3 border-b border-stone-200 mb-6">
          <span className="text-[10px] font-mono font-bold tracking-widest text-stone-500 uppercase">
            End of Season Accolades
          </span>
          <h3 className="text-lg font-bold text-stone-950 uppercase mt-0.5">
            Championship Rewards & Prizes
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prizes.map((prize) => {
            const isUnlocked = prize.status === 'UNLOCKED';
            const isRevealed = revealedPrizes[prize.prizeId] || isUnlocked;

            return (
              <div
                key={prize.prizeId}
                className="bg-white border border-stone-200 rounded-lg p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">
                      Rank #{prize.requiredRank}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase font-semibold ${
                      !isUnlocked ? 'text-stone-400' : 'text-emerald-700'
                    }`}>
                      {!isUnlocked ? (
                        <>
                          <Lock className="w-3 h-3 text-stone-400" />
                          Locked
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3 h-3 text-emerald-600" />
                          Unlocked
                        </>
                      )}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-stone-950 mb-1">
                    {prize.name}
                  </h4>
                  <p className="text-xs text-stone-500 mb-3">
                    {prize.description || `Award for rank #${prize.requiredRank}`}
                  </p>

                  {/* Reward Reveal Box */}
                  <div className="p-3 bg-stone-50 rounded border border-stone-100">
                    {!isUnlocked ? (
                      <div className="text-center py-2">
                        <span className="block text-[11px] font-mono font-semibold text-stone-400 uppercase">
                          Reward Locked
                        </span>
                        <span className="text-[10px] text-stone-400">
                          Complete {prize.requiredTests} tests to reveal
                        </span>
                      </div>
                    ) : isRevealed ? (
                      <div>
                        <div className="text-[10px] font-mono font-bold uppercase text-emerald-800 tracking-wider">
                          Reward Unlocked
                        </div>
                        <div className="text-xs font-bold text-stone-950 mt-0.5">
                          {prize.revealedName || prize.name}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-1">
                        <button
                          onClick={() => handleReveal(prize.prizeId)}
                          className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold tracking-wide transition-colors"
                        >
                          Reveal Mystery Reward
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-mono">
                  <span>Requirement</span>
                  <span>{prize.requiredTests} Tests</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
