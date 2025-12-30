import React from 'react';
import { Insight } from '../types';
import { AlertCircle, CheckCircle, MapPin, Target } from 'lucide-react';

interface RoadmapProps {
  insights: Insight[];
  targetRole?: string;
  readiness: number;
  onSelectInsight: (insight: Insight) => void;
}

const Roadmap: React.FC<RoadmapProps> = ({ insights, targetRole, readiness, onSelectInsight }) => {
  // Filter only gap-type insights for the roadmap
  const gapInsights = insights.filter(i => i.type === 'gap');

  const completedCount = gapInsights.filter(i => i.status === 'completed').length;
  const totalCount = gapInsights.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (gapInsights.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_12px_#bebebe,-4px_-4px_12px_#ffffff]">
            <MapPin className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Strategy Items Yet</h3>
          <p className="text-gray-600 text-sm">
            Upload your resume to generate a personalized roadmap
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with Progress */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {targetRole ? `Path to ${targetRole}` : 'Your Career Strategy'}
            </h3>
            <p className="text-sm text-gray-600">
              {completedCount} of {totalCount} milestones completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">{progressPercent}%</div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden shadow-[inset_2px_2px_4px_#bebebe]">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
        {gapInsights.map((insight, index) => {
          const isCompleted = insight.status === 'completed';

          return (
            <div
              key={insight.id}
              onClick={() => onSelectInsight(insight)}
              className={`bg-gray-100 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-[6px_6px_16px_#bebebe,-6px_-6px_16px_#ffffff] shadow-[4px_4px_12px_#bebebe,-4px_-4px_12px_#ffffff] relative ${
                isCompleted ? 'opacity-70' : ''
              }`}
            >
              {/* Checkpoint Number */}
              <div className="absolute -left-3 top-4">
                <div
                  className={`w-8 h-8 rounded-full shadow-lg ${
                    isCompleted
                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                      : 'bg-gradient-to-br from-purple-400 to-purple-600'
                  } flex items-center justify-center font-bold text-xs text-white`}
                >
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
              </div>

              <div className="pl-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4
                    className={`font-semibold text-gray-800 ${
                      isCompleted ? 'line-through opacity-60' : ''
                    }`}
                  >
                    {insight.title}
                  </h4>
                  {isCompleted && (
                    <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg font-medium shadow-sm">
                      ✓ Done
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {insight.description}
                </p>

                {insight.missionTitle && (
                  <div className="flex items-center gap-2 text-xs">
                    <Target className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-purple-600">
                      {insight.missionTitle}
                    </span>
                  </div>
                )}

                {!isCompleted && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <button className="text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors">
                      View Details & Take Action →
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Encouragement */}
      {completedCount > 0 && completedCount < totalCount && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="bg-purple-50 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-purple-600">Keep Going!</p>
              <p className="text-xs text-gray-600">
                {totalCount - completedCount} more {totalCount - completedCount === 1 ? 'task' : 'tasks'} to complete
              </p>
            </div>
          </div>
        </div>
      )}

      {completedCount === totalCount && totalCount > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-emerald-400">All Set! 🎉</p>
              <p className="text-xs text-slate-400">
                You've completed all milestones. Your readiness: {readiness}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;
