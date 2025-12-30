import React from 'react';
import { Insight } from '../types';
import { Trophy, AlertCircle, Target, CheckCircle, Clock } from 'lucide-react';

interface InsightsProps {
  insights: Insight[];
  onSelectInsight: (insight: Insight) => void;
}

const Insights: React.FC<InsightsProps> = ({ insights, onSelectInsight }) => {
  // Filter out gap-type insights (those belong in Roadmap/Strategy Checklist)
  const feedInsights = insights.filter(i => i.type !== 'gap');
  
  const getInsightStyle = (type: string) => {
    switch (type) {
      case 'success':
        return {
          icon: Trophy,
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/30',
          iconColor: 'text-emerald-400',
          accentColor: 'text-emerald-400'
        };
      case 'gap':
        return {
          icon: AlertCircle,
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/30',
          iconColor: 'text-purple-400',
          accentColor: 'text-purple-400'
        };
      case 'actionable':
        return {
          icon: Target,
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
          iconColor: 'text-blue-400',
          accentColor: 'text-blue-400'
        };
      default:
        return {
          icon: Clock,
          bgColor: 'bg-slate-500/10',
          borderColor: 'border-slate-500/30',
          iconColor: 'text-slate-400',
          accentColor: 'text-slate-400'
        };
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (feedInsights.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_12px_#bebebe,-4px_-4px_12px_#ffffff]">
            <Target className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Activity Yet</h3>
          <p className="text-gray-600 text-sm mb-4">
            Share achievements or complete tasks to see your activity feed
          </p>
          <button
            onClick={() => {
              console.log('🔍 Debug - Feed insights:', feedInsights);
              alert(`Feed insights count: ${feedInsights.length}. Check browser console for details.`);
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-xl text-sm hover:from-blue-500 hover:to-purple-500 transition-colors shadow-lg"
          >
            Debug: Show Insights Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pr-2 space-y-3">
      {feedInsights.map((insight) => {
        const style = getInsightStyle(insight.type);
        const Icon = style.icon;

        return (
          <div
            key={insight.id}
            onClick={() => onSelectInsight(insight)}
            className={`bg-gray-100 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-[6px_6px_16px_#bebebe,-6px_-6px_16px_#ffffff] shadow-[4px_4px_12px_#bebebe,-4px_-4px_12px_#ffffff] ${
              insight.status === 'completed' ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl p-2 flex-shrink-0 shadow-lg">
                <Icon className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                {/* AI Message Type Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {insight.type === 'gap' && (
                      <span className="text-[10px] font-bold uppercase tracking-wide text-purple-600 bg-purple-100 px-2 py-0.5 rounded-lg shadow-sm">
                        🔍 Diagnostic
                      </span>
                    )}
                    {insight.type === 'success' && (
                      <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-lg shadow-sm">
                        📈 Growth
                      </span>
                    )}
                    {insight.type === 'actionable' && (
                      <span className="text-[10px] font-bold uppercase tracking-wide text-blue-600 bg-blue-100 px-2 py-0.5 rounded-lg shadow-sm">
                        💡 Proactive
                      </span>
                    )}
                  </div>
                  {insight.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  )}
                </div>

                <h4 className={`font-semibold text-gray-800 mb-1 ${insight.status === 'completed' ? 'line-through' : ''}`}>
                  {insight.title}
                </h4>

                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {insight.description}
                </p>

                {insight.missionTitle && (
                  <div className="mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-lg shadow-sm">
                      {insight.missionTitle}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="opacity-60">{formatTimestamp(insight.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Insights;
