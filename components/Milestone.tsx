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
    <div className="h-full bg-gray-100 rounded-3xl p-6 relative overflow-hidden shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]">
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-1">
              North Star Goal
            </h3>
            {!isEditing ? (
              <div className="flex items-center gap-2 group">
                <p className="text-2xl font-bold text-gray-800">Set Your Target</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-200 rounded-lg"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="e.g., Senior Product Manager"
                  className="flex-1 bg-gray-100 rounded-xl py-2 px-3 text-gray-800 placeholder-gray-500 focus:outline-none shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] text-sm"
                  autoFocus
                />
                <button
                  onClick={handleSubmit}
                  disabled={!newGoal.trim() || isSubmitting}
                  className="px-3 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl p-3 shadow-lg">
            <Target className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Readiness Meter */}
        <div className="flex-1 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Career Readiness</span>
          </div>

          <div className="relative">
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-[inset_2px_2px_4px_#bebebe]">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-1000 ease-out relative"
                style={{ width: `${readiness}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 text-orange-600 font-bold text-sm"
              style={{ left: `${Math.max(readiness - 5, 5)}%` }}
            >
              {readiness}%
            </div>
          </div>

          <div className="bg-gray-100 rounded-2xl p-4 shadow-[inset_2px_2px_4px_#bebebe]">
            <p className="text-sm font-semibold text-purple-600 mb-1">{state.label}</p>
            <p className="text-xs text-gray-600">
              {readiness < 40 && 'Keep building your foundation. Complete tasks to increase readiness.'}
              {readiness >= 40 && readiness < 70 && 'You\'re making great progress! Stay consistent.'}
              {readiness >= 70 && 'You\'re well-prepared! Consider applying to target roles.'}
            </p>
          </div>
        </div>

        {/* Quick Action Hint */}
        {!isEditing && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-2.5 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl transition-all text-sm font-medium shadow-[4px_4px_12px_#bebebe,-4px_-4px_12px_#ffffff]"
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
