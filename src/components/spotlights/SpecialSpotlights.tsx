import React from 'react';
import { Flame, TrendingUp, Award, Swords } from 'lucide-react';
import type { StudentStats } from '../../types/student';
import { useChampionship } from '../../context/ChampionshipContext';

interface SpecialSpotlightsProps {
  onSelectStudent: (student: StudentStats) => void;
}

export const SpecialSpotlights: React.FC<SpecialSpotlightsProps> = ({ onSelectStudent }) => {
  const { spotlights } = useChampionship();
  const { hotStreaks, risingStars, mostImproved, perfectScores, closestBattle } = spotlights;

  return (
    <section className="my-10">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-stone-200">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-stone-500 uppercase">
            Performance Analysis
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-950 uppercase mt-0.5">
            Season Highlights
          </h2>
        </div>
        <p className="text-xs text-stone-500 font-medium mt-1 sm:mt-0">
          Spotlighting consistency, rapid improvement, and standout scores.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* 1. RISING FORM */}
        <div className="bg-white border border-stone-200 rounded-lg p-5 flex flex-col justify-between hover:border-stone-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-stone-700" />
                Rising Form
              </span>
              <span className="text-[11px] font-mono text-stone-400">Recent 3-Test Surge</span>
            </div>

            <div className="space-y-3 mt-2">
              {risingStars.length > 0 ? (
                risingStars.slice(0, 3).map((st) => (
                  <div
                    key={st.studentId}
                    onClick={() => onSelectStudent(st)}
                    className="group cursor-pointer flex items-center justify-between p-2 rounded hover:bg-stone-50 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:underline underline-offset-2">
                        {st.name}
                      </div>
                      <div className="text-[11px] font-mono text-stone-500">
                        Avg {st.overallAverage.toFixed(1)}% → Form {st.currentForm.toFixed(1)}%
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-700">
                      +{st.recentChange.toFixed(1)}%
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-400 py-3 text-center">No recent surge recorded</p>
              )}
            </div>
          </div>
        </div>

        {/* 2. ACTIVE STREAKS */}
        <div className="bg-white border border-stone-200 rounded-lg p-5 flex flex-col justify-between hover:border-stone-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-700" />
                Active Streaks
              </span>
              <span className="text-[11px] font-mono text-stone-400">Score ≥ 80%</span>
            </div>

            <div className="space-y-3 mt-2">
              {hotStreaks.length > 0 ? (
                hotStreaks.slice(0, 3).map((st) => (
                  <div
                    key={st.studentId}
                    onClick={() => onSelectStudent(st)}
                    className="group cursor-pointer flex items-center justify-between p-2 rounded hover:bg-stone-50 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:underline underline-offset-2">
                        {st.name}
                      </div>
                      <div className="text-[11px] font-mono text-stone-500">
                        Class {st.className}-{st.section}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-800">
                      🔥 {st.activeStreak} in a row
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-400 py-3 text-center">No active streaks</p>
              )}
            </div>
          </div>
        </div>

        {/* 3. MOST IMPROVED */}
        <div className="bg-white border border-stone-200 rounded-lg p-5 flex flex-col justify-between hover:border-stone-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-stone-700" />
                Most Improved
              </span>
              <span className="text-[11px] font-mono text-stone-400">Baseline to Date</span>
            </div>

            <div className="space-y-3 mt-2">
              {mostImproved.length > 0 ? (
                mostImproved.slice(0, 3).map((st) => {
                  const firstScore = st.scores[0]?.percentage || 0;
                  const lastScore = st.scores[st.scores.length - 1]?.percentage || 0;
                  const delta = lastScore - firstScore;

                  return (
                    <div
                      key={st.studentId}
                      onClick={() => onSelectStudent(st)}
                      className="group cursor-pointer flex items-center justify-between p-2 rounded hover:bg-stone-50 transition-colors"
                    >
                      <div>
                        <div className="text-xs font-bold text-stone-900 group-hover:underline underline-offset-2">
                          {st.name}
                        </div>
                        <div className="text-[11px] font-mono text-stone-500">
                          Started at {firstScore.toFixed(0)}%
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-emerald-700">
                        {delta >= 0 ? `+${delta.toFixed(1)}%` : `${delta.toFixed(1)}%`}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-stone-400 py-3 text-center">Tracking in progress</p>
              )}
            </div>
          </div>
        </div>

        {/* 4. PERFECT SCORE CLUB */}
        <div className="bg-white border border-stone-200 rounded-lg p-5 flex flex-col justify-between hover:border-stone-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-700" />
                Century Club
              </span>
              <span className="text-[11px] font-mono text-stone-400">100% on any Test</span>
            </div>

            <div className="space-y-3 mt-2">
              {perfectScores.length > 0 ? (
                perfectScores.slice(0, 3).map(({ student: st, perfectCount }) => (
                  <div
                    key={st.studentId}
                    onClick={() => onSelectStudent(st)}
                    className="group cursor-pointer flex items-center justify-between p-2 rounded hover:bg-stone-50 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:underline underline-offset-2">
                        {st.name}
                      </div>
                      <div className="text-[11px] font-mono text-stone-500">
                        {perfectCount} perfect test{perfectCount > 1 ? 's' : ''}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-1.5 py-0.5 rounded">
                      100%
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-400 py-3 text-center">No 100% test recorded yet</p>
              )}
            </div>
          </div>
        </div>

        {/* 5. TITLE BATTLE */}
        {closestBattle && (
          <div className="bg-white border border-stone-200 rounded-lg p-5 flex flex-col justify-between hover:border-stone-300 transition-colors md:col-span-2">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-stone-700" />
                  Closest Title Battle
                </span>
                <span className="text-[11px] font-mono text-stone-400">Margin: {closestBattle.difference.toFixed(2)}%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-stone-50 rounded">
                <div
                  onClick={() => onSelectStudent(closestBattle.studentA)}
                  className="cursor-pointer group"
                >
                  <span className="text-[10px] font-mono text-stone-400">LEADER</span>
                  <div className="text-sm font-bold text-stone-900 group-hover:underline">
                    {closestBattle.studentA.name}
                  </div>
                  <div className="font-mono text-xs font-bold text-stone-900">
                    {closestBattle.studentA.overallAverage.toFixed(1)}%
                  </div>
                </div>

                <div className="text-center px-4 font-mono text-xs text-stone-400">
                  vs
                </div>

                <div
                  onClick={() => onSelectStudent(closestBattle.studentB)}
                  className="cursor-pointer group text-right"
                >
                  <span className="text-[10px] font-mono text-stone-400">CHASER</span>
                  <div className="text-sm font-bold text-stone-900 group-hover:underline">
                    {closestBattle.studentB.name}
                  </div>
                  <div className="font-mono text-xs font-bold text-stone-900">
                    {closestBattle.studentB.overallAverage.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
