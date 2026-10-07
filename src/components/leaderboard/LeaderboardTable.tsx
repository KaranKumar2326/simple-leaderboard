import React from 'react';
import type { StudentStats } from '../../types/student';
import { LeaderboardRow } from './LeaderboardRow';

interface LeaderboardTableProps {
  students: StudentStats[];
  onSelectStudent: (student: StudentStats) => void;
  selectedStudentId?: string;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  students,
  onSelectStudent,
  selectedStudentId,
}) => {
  if (students.length === 0) {
    return (
      <div className="py-16 text-center border border-stone-200 rounded-2xl bg-white my-6 shadow-sm">
        <h3 className="text-base font-bold text-stone-900 uppercase tracking-tight">No Students Found</h3>
        <p className="text-xs text-stone-500 mt-1">Try adjusting your class filter or search criteria.</p>
      </div>
    );
  }

  return (
    <div className="hidden md:block my-6 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50/90 text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">
            <th className="py-3.5 px-4 w-14 text-center">Pos</th>
            <th className="py-3.5 px-2 w-14 text-center">Shift</th>
            <th className="py-3.5 px-4">Student</th>
            <th className="py-3.5 px-3 text-center">Class</th>
            <th className="py-3.5 px-4 text-center">Tests</th>
            <th className="py-3.5 px-4 text-right">Overall %</th>
            <th className="py-3.5 px-4 text-right">Form (L3)</th>
            <th className="py-3.5 px-4 text-center">Streak</th>
            <th className="py-3.5 px-4 text-right w-16">Profile</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {students.map((student, index) => (
            <LeaderboardRow
              key={student.studentId}
              student={student}
              index={index}
              isSelected={student.studentId === selectedStudentId}
              onSelect={onSelectStudent}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

