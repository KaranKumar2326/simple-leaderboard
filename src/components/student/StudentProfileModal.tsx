import React from 'react';
import { X, Award, Check } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { StudentStats } from '../../types/student';

interface StudentProfileModalProps {
  student: StudentStats | null;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ student, onClose }) => {
  if (!student) return null;

  // Chart data
  const chartData = student.scores.map((score) => ({
    name: `T${score.testNumber}`,
    testName: score.testName,
    subject: score.subject,
    percentage: score.percentage,
    marksScored: score.marksScored,
    totalMarks: score.totalMarks,
    date: score.date,
  }));

  const rankFormatted = student.rank < 10 ? `0${student.rank}` : `${student.rank}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-white border border-stone-200 rounded-xl shadow-2xl overflow-hidden my-6">
        
        {/* Header Strip */}
        <div className="p-6 sm:p-8 border-b border-stone-200 bg-stone-50/50">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-1.5 rounded text-stone-400 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">
                  Player Dossier · Class {student.className}-{student.section}
                </span>
                {student.isProvisional && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-200 text-stone-700">
                    Provisional
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-950 uppercase">
                {student.name}
              </h2>
              <div className="flex items-center gap-3 text-xs font-mono text-stone-500 mt-1">
                <span>Rank #{rankFormatted}</span>
                <span>·</span>
                <span>ID: {student.studentId}</span>
                <span>·</span>
                <span>Trend: {student.rankMovement.formattedText}</span>
              </div>
            </div>

            {/* Overall Score Highlight */}
            <div className="sm:text-right">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
                Overall Standing
              </span>
              <span className="font-mono text-3xl font-black text-stone-950 tabular-nums">
                {student.overallAverage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Key Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-stone-200 divide-x divide-stone-200 bg-white">
          <div className="p-4 sm:p-5 text-center">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-500">
              Current Form (L3)
            </span>
            <span className="font-mono text-xl font-bold text-stone-900 tabular-nums mt-0.5 block">
              {student.currentForm > 0 ? `${student.currentForm.toFixed(1)}%` : '—'}
            </span>
          </div>

          <div className="p-4 sm:p-5 text-center">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-500">
              Active Streak
            </span>
            <span className="font-mono text-xl font-bold text-amber-700 tabular-nums mt-0.5 block">
              {student.activeStreak > 0 ? `🔥 ${student.activeStreak}` : '—'}
            </span>
          </div>

          <div className="p-4 sm:p-5 text-center">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-500">
              Tests Completed
            </span>
            <span className="font-mono text-xl font-bold text-stone-900 tabular-nums mt-0.5 block">
              {student.testsCompleted}
            </span>
          </div>

          <div className="p-4 sm:p-5 text-center">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-500">
              Personal Best
            </span>
            <span className="font-mono text-xl font-bold text-stone-900 tabular-nums mt-0.5 block">
              {student.bestPercentage > 0 ? `${student.bestPercentage.toFixed(1)}%` : '—'}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[60vh] overflow-y-auto">

          {/* Section 1: Performance Timeline Chart */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900">
                Performance Trajectory
              </span>
              <span className="text-[11px] font-mono text-stone-500">
                Score percentage per test
              </span>
            </div>

            {chartData.length > 0 ? (
              <div className="h-56 sm:h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      ticks={[25, 50, 75, 100]}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-stone-900 text-white p-2.5 rounded shadow-lg text-xs font-mono">
                              <div className="font-bold">{data.testName} ({data.name})</div>
                              <div className="text-stone-300">{data.subject} · {data.date}</div>
                              <div className="mt-1 text-emerald-400 font-bold">
                                {data.percentage.toFixed(1)}% ({data.marksScored}/{data.totalMarks})
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="percentage"
                      stroke="#0f172a"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#0f172a' }}
                      activeDot={{ r: 5, fill: '#0f172a' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-xs text-stone-400 py-6 text-center">No test history recorded yet.</p>
            )}
          </div>

          {/* Section 2: Test History Table */}
          <div>
            <div className="pb-2 border-b border-stone-200 mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900">
                Examination Record
              </span>
            </div>

            <div className="overflow-x-auto border border-stone-200 rounded">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-mono font-bold uppercase text-stone-500">
                    <th className="py-2.5 px-3">Test</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3 text-right">Score</th>
                    <th className="py-2.5 px-3 text-right">Percentage</th>
                    <th className="py-2.5 px-3 text-center">Difficulty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono">
                  {student.scores.map((score) => (
                    <tr key={score.testId} className="hover:bg-stone-50/70">
                      <td className="py-2.5 px-3 font-semibold text-stone-900">
                        {score.testName}
                      </td>
                      <td className="py-2.5 px-3 text-stone-500">
                        {score.date}
                      </td>
                      <td className="py-2.5 px-3 text-stone-700">
                        {score.subject}
                      </td>
                      <td className="py-2.5 px-3 text-right text-stone-700">
                        {score.marksScored} / {score.totalMarks}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-stone-950">
                        {score.percentage.toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3 text-center text-stone-500">
                        {score.difficulty}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Achievements */}
          <div>
            <div className="pb-2 border-b border-stone-200 mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900">
                Honors & Achievements
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {student.achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-3 rounded border flex items-start gap-2.5 ${
                    ach.isUnlocked
                      ? 'bg-stone-50/80 border-stone-300'
                      : 'bg-white border-stone-200 opacity-40'
                  }`}
                >
                  <div className={`p-1.5 rounded text-xs ${ach.isUnlocked ? 'text-amber-800' : 'text-stone-400'}`}>
                    {ach.isUnlocked ? <Check className="w-4 h-4 stroke-[3]" /> : <Award className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-950 uppercase tracking-tight">
                      {ach.title}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {ach.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
