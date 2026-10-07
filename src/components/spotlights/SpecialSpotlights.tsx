import React from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, Award, Swords, Sparkles } from 'lucide-react';
import type { StudentStats } from '../../types/student';
import { useChampionship } from '../../context/ChampionshipContext';
import { LiveScoreCounter } from '../leaderboard/LiveScoreCounter';

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
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-widest text-indigo-700 uppercase bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            <Sparkles className="w-2.5 h-2.5 text-indigo-600" />
            Performance Analysis
          </span>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-stone-950 uppercase mt-1">
            Season Highlights
          </h2>
        </div>
        <p className="text-xs text-stone-500 font-medium mt-1 sm:mt-0">
          Spotlighting consistency, rapid improvement, and standout scores.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {/* 1. RISING FORM */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all"
        >
          <div>
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-stone-100">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Rising Form
              </span>
              <span className="text-[10px] font-mono text-stone-400 bg-stone-50 px-2 py-0.5 rounded border border-stone-100">Last 3 Tests</span>
            </div>

            <div className="space-y-2 mt-2">
              {risingStars.length > 0 ? (
                risingStars.slice(0, 3).map((st) => (
                  <div
                    key={st.studentId}
                    onClick={() => onSelectStudent(st)}
                    className="group cursor-pointer flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-indigo-600 transition-colors">
                        {st.name}
                      </div>
                      <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                        Avg {st.overallAverage.toFixed(1)}% → Form {st.currentForm.toFixed(1)}%
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      +{st.recentChange.toFixed(1)}%
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-400 py-4 text-center">No recent surge recorded</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* 2. ACTIVE STREAKS */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all"
        >
          <div>
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-stone-100">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-600" />
                Active Streaks
              </span>
              <span className="text-[10px] font-mono text-stone-400 bg-stone-50 px-2 py-0.5 rounded border border-stone-100">Score ≥ 80%</span>
            </div>

            <div className="space-y-2 mt-2">
              {hotStreaks.length > 0 ? (
                hotStreaks.slice(0, 3).map((st) => (
                  <div
                    key={st.studentId}
                    onClick={() => onSelectStudent(st)}
                    className="group cursor-pointer flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-indigo-600 transition-colors">
                        {st.name}
                      </div>
                      <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                        Class {st.className}-{st.section}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-amber-500 text-amber-600" />
                      {st.activeStreak} in a row
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-400 py-4 text-center">No active streaks</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* 3. MOST IMPROVED */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all"
        >
          <div>
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-stone-100">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" />
                Most Improved
              </span>
              <span className="text-[10px] font-mono text-stone-400 bg-stone-50 px-2 py-0.5 rounded border border-stone-100">Baseline Delta</span>
            </div>

            <div className="space-y-2 mt-2">
              {mostImproved.length > 0 ? (
                mostImproved.slice(0, 3).map((st) => {
                  const firstScore = st.scores[0]?.percentage || 0;
                  const lastScore = st.scores[st.scores.length - 1]?.percentage || 0;
                  const delta = lastScore - firstScore;

                  return (
                    <div
                      key={st.studentId}
                      onClick={() => onSelectStudent(st)}
                      className="group cursor-pointer flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 transition-colors"
                    >
                      <div>
                        <div className="text-xs font-bold text-stone-900 group-hover:text-indigo-600 transition-colors">
                          {st.name}
                        </div>
                        <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                          Started at {firstScore.toFixed(0)}%
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {delta >= 0 ? `+${delta.toFixed(1)}%` : `${delta.toFixed(1)}%`}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-stone-400 py-4 text-center">Tracking in progress</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* 4. PERFECT SCORE CLUB */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all"
        >
          <div>
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-stone-100">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500 fill-amber-400" />
                Century Club
              </span>
              <span className="text-[10px] font-mono text-stone-400 bg-stone-50 px-2 py-0.5 rounded border border-stone-100">100% Scores</span>
            </div>

            <div className="space-y-2 mt-2">
              {perfectScores.length > 0 ? (
                perfectScores.slice(0, 3).map(({ student: st, perfectCount }) => (
                  <div
                    key={st.studentId}
                    onClick={() => onSelectStudent(st)}
                    className="group cursor-pointer flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-indigo-600 transition-colors">
                        {st.name}
                      </div>
                      <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                        {perfectCount} perfect test{perfectCount > 1 ? 's' : ''}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-black text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-lg">
                      100%
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-400 py-4 text-center">No 100% test recorded yet</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* 5. TITLE BATTLE */}
        {closestBattle && (
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all md:col-span-2"
          >
            <div>
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-stone-100">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <Swords className="w-4 h-4 text-indigo-600" />
                  Closest Title Battle
                </span>
                <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Margin: {closestBattle.difference.toFixed(2)}%
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-stone-50 via-white to-stone-50 rounded-xl border border-stone-200/70">
                <div
                  onClick={() => onSelectStudent(closestBattle.studentA)}
                  className="cursor-pointer group flex-1"
                >
                  <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-wider">
                    LEADER
                  </span>
                  <div className="text-sm font-bold text-stone-900 group-hover:text-indigo-600 transition-colors">
                    {closestBattle.studentA.name}
                  </div>
                  <div className="font-mono text-xs font-black text-stone-950 mt-0.5">
                    <LiveScoreCounter value={closestBattle.studentA.overallAverage} />
                  </div>
                </div>

                <div className="px-4 text-center">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-stone-900 text-white font-mono text-[10px] font-black uppercase tracking-wider shadow-sm">
                    VS
                  </span>
                </div>

                <div
                  onClick={() => onSelectStudent(closestBattle.studentB)}
                  className="cursor-pointer group flex-1 text-right"
                >
                  <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">
                    CHASER
                  </span>
                  <div className="text-sm font-bold text-stone-900 group-hover:text-indigo-600 transition-colors">
                    {closestBattle.studentB.name}
                  </div>
                  <div className="font-mono text-xs font-black text-stone-950 mt-0.5">
                    <LiveScoreCounter value={closestBattle.studentB.overallAverage} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
};

