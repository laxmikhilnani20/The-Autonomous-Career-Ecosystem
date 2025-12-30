import React, { useState } from 'react';
import { Target, Edit2, Check, TrendingUp } from 'lucide-react';

interface MilestoneProps {
  onSetGoal: (goal: string) => Promise<void>;
  readiness: number;
}

const Milestone: React.FC<MilestoneProps> = ({ onSetGoal, readiness }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (newGoal.trim()) {
      setIsSubmitting(true);
      await onSetGoal(newGoal);
      setIsEditing(false);
      setNewGoal('');
      setIsSubmitting(false);
    }
  };

  const getReadinessState = () => {
    if (readiness < 40) {
      return {
        label: 'Foundation Building',
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/20',
        barColor: 'from-orange-500 to-orange-400'
      };
    } else if (readiness < 70) {
      return {
        label: 'Progressing Well',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20',
        barColor: 'from-yellow-500 to-yellow-400'
      };
    } else {
      return {
        label: 'Ready to Launch',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/20',
        barColor: 'from-emerald-500 to-emerald-400'
      };
    }
  };

  const state = getReadinessState();

  return (
    <div className="h-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className={`absolute top-0 right-0 w-1/2 h-1/2 ${state.bgColor} blur-3xl`} />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">
              North Star Goal
            </h3>
            {!isEditing ? (
              <div className="flex items-center gap-2 group">
                <p className="text-2xl font-bold text-slate-200">Set Your Target</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded-lg"
                >
                  <Edit2 className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="e.g., Senior Product Manager"
                  className="flex-1 bg-slate-900/50 border border-white/10 rounded-lg py-2 px-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                  autoFocus
                />
                <button
                  onClick={handleSubmit}
                  disabled={!newGoal.trim() || isSubmitting}
                  className={`px-3 py-2 ${state.bgColor} ${state.color} border ${state.borderColor} rounded-lg hover:bg-opacity-20 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <div className={`${state.bgColor} ${state.borderColor} border rounded-xl p-3`}>
            <Target className={`w-8 h-8 ${state.color}`} />
          </div>
        </div>

        {/* Readiness Meter */}
        <div className="flex-1 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-5 h-5 ${state.color}`} />
            <span className="text-sm font-medium text-slate-400">Career Readiness</span>
          </div>

          <div className="relative">
            <div className="w-full h-4 bg-slate-900/50 rounded-full overflow-hidden border border-white/10">
              <div
                className={`h-full bg-gradient-to-r ${state.barColor} transition-all duration-1000 ease-out relative`}
                style={{ width: `${readiness}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
            <div
              className={`absolute top-1/2 -translate-y-1/2 ${state.color} font-bold text-sm`}
              style={{ left: `${Math.max(readiness - 5, 5)}%` }}
            >
              {readiness}%
            </div>
          </div>

          <div className={`${state.bgColor} ${state.borderColor} border rounded-lg p-4`}>
            <p className={`text-sm font-semibold ${state.color} mb-1`}>{state.label}</p>
            <p className="text-xs text-slate-400">
              {readiness < 40 && 'Keep building your foundation. Complete tasks to increase readiness.'}
              {readiness >= 40 && readiness < 70 && 'You\'re making great progress! Stay consistent.'}
              {readiness >= 70 && 'You\'re well-prepared! Consider applying to target roles.'}
            </p>
          </div>
        </div>

        {/* Quick Action Hint */}
        {!isEditing && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg transition-all text-sm font-medium"
            >
              Update North Star
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Milestone;
