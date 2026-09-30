import React from 'react';
import { X, Calendar } from 'lucide-react';
import { useChampionship } from '../../context/ChampionshipContext';
import type { TestInfo } from '../../types/test';

interface TestExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestExplorerModal: React.FC<TestExplorerModalProps> = ({ isOpen, onClose }) => {
  const { tests, allStudents } = useChampionship();

  if (!isOpen) return null;

  const testList = Array.from(tests.values()).sort((a, b) => a.testNumber - b.testNumber);

  // Compute test-specific stats
  const getTestStats = (test: TestInfo) => {
    let count = 0;
    let sumMarks = 0;
    let highestMarks = 0;

    allStudents.forEach((student) => {
      const match = student.scores.find((s) => s.testId === test.testId);
      if (match) {
        count++;
        sumMarks += match.marksScored;
        if (match.marksScored > highestMarks) {
          highestMarks = match.marksScored;
        }
      }
    });

    const averagePercentage = count > 0 ? Number(((sumMarks / (count * test.totalMarks)) * 100).toFixed(1)) : 0;
    const highestPercentage = count > 0 ? Number(((highestMarks / test.totalMarks) * 100).toFixed(1)) : 0;

    return {
      participants: count,
      averagePercentage,
      highestPercentage,
      highestMarks,
    };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-white border border-stone-200 rounded-xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-stone-200 bg-stone-50/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-stone-500 uppercase">
              Schedule & Historical Record
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-stone-950 uppercase mt-0.5">
              Championship Examination Log
            </h2>
            <p className="text-xs text-stone-500 font-medium mt-1">
              Complete archive of tests, difficulty ratings, participation, and benchmark scores.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-stone-400 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testList.map((test) => {
              const stats = getTestStats(test);
              const isFuture = stats.participants === 0;

              return (
                <div
                  key={test.testId}
                  className={`p-4 rounded-lg border transition-colors ${
                    isFuture
                      ? 'bg-stone-50/50 border-stone-200 opacity-60'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-stone-900">
                          {test.testId} · Test #{test.testNumber < 10 ? `0${test.testNumber}` : test.testNumber}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                          {test.difficulty}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-stone-950 mt-1">
                        {test.testName}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-mono text-stone-500 mt-0.5">
                        <span>{test.subject}</span>
                        <span>·</span>
                        <span>Max {test.totalMarks} Marks</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          {test.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Benchmark Stats Strip */}
                  {!isFuture ? (
                    <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-3 gap-2 text-center font-mono">
                      <div>
                        <span className="text-[10px] text-stone-400 block uppercase">Turnout</span>
                        <span className="text-xs font-bold text-stone-900">{stats.participants} students</span>
                      </div>
                      <div className="border-l border-stone-100">
                        <span className="text-[10px] text-stone-400 block uppercase">Class Avg</span>
                        <span className="text-xs font-bold text-stone-900">{stats.averagePercentage}%</span>
                      </div>
                      <div className="border-l border-stone-100">
                        <span className="text-[10px] text-stone-400 block uppercase">Top Score</span>
                        <span className="text-xs font-bold text-stone-900">
                          {stats.highestMarks}/{test.totalMarks} ({stats.highestPercentage}%)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 pt-2 text-center text-xs font-mono text-stone-400">
                      Scheduled Examination · Pending
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
