import React, { useState } from 'react';
import { Target, Search, ArrowRight } from 'lucide-react';

interface MilestoneProps {
  onSetGoal: (goal: string) => void;
  readiness: number; // 0-100
}

const Milestone: React.FC<MilestoneProps> = ({ onSetGoal, readiness }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSetGoal(input);
    }
  };

  // SVG parameters for circle
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readiness / 100) * circumference;

  return (
    <div className="bg-slate-800/40 border border-slate-700 backdrop-blur-md rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/10 blur-[50px] rounded-full" />

      {/* Input Section */}
      <div className="flex-1 w-full z-10">
        <div className="flex items-center gap-2 mb-3 text-emerald-400">
          <Target className="w-5 h-5" />
          <h3 className="font-semibold tracking-wide uppercase text-xs">North Star Milestone</h3>
        </div>
        <form onSubmit={handleSubmit} className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste target role (e.g., 'Senior AI Engineer at Google')..."
            className="w-full bg-slate-900/50 border border-slate-700 text-slate-100 rounded-xl px-4 py-4 pr-12 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 bottom-2 aspect-square bg-slate-800 hover:bg-emerald-500 hover:text-white text-slate-400 rounded-lg flex items-center justify-center transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Gauge Section */}
      <div className="flex items-center gap-6 z-10">
        <div className="relative w-24 h-24 flex-shrink-0">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-slate-800"
            />
            {/* Progress Circle */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-emerald-400 transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-white">{readiness}%</span>
            <span className="text-[9px] text-slate-400 uppercase">Match</span>
          </div>
        </div>
        
        <div className="hidden xl:block">
          <p className="text-sm font-medium text-white">Gap Closing</p>
          <p className="text-xs text-slate-400">Keep watering your garden.</p>
        </div>
      </div>
    </div>
  );
};

export default Milestone;
