import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-stone-200 bg-white py-8 text-xs text-stone-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center space-x-2">
          <span className="font-mono font-bold text-stone-900">TC</span>
          <span className="text-stone-300">/</span>
          <span className="font-semibold text-stone-800">Tuition Championship</span>
          <span className="text-stone-300">·</span>
          <span>Academic Sports League</span>
        </div>

        <div className="flex items-center space-x-1.5 text-stone-500 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
          <span>Student privacy preserved. Only public names and test scores recorded.</span>
        </div>

        <div className="font-mono text-[11px] text-stone-400">
          Season 01 · 15 Examinations
        </div>

      </div>
    </footer>
  );
};
