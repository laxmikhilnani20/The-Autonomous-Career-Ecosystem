import React from 'react';
import { Insight } from '../types';
import { Trophy, AlertCircle, Target, CheckCircle, Clock } from 'lucide-react';

interface InsightsProps {
  insights: Insight[];
  onSelectInsight: (insight: Insight) => void;
}

const Insights: React.FC<InsightsProps> = ({ insights, onSelectInsight }) => {
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

  if (insights.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">No Insights Yet</h3>
          <p className="text-slate-500 text-sm">
            Upload your resume or share achievements to start receiving personalized insights
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pr-2 space-y-3">
      {insights.map((insight) => {
        const style = getInsightStyle(insight.type);
        const Icon = style.icon;

        return (
          <div
            key={insight.id}
            onClick={() => onSelectInsight(insight)}
            className={`${style.bgColor} border ${style.borderColor} rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg ${
              insight.status === 'completed' ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`${style.bgColor} border ${style.borderColor} rounded-lg p-2 flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${style.iconColor}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className={`font-semibold text-slate-200 ${insight.status === 'completed' ? 'line-through' : ''}`}>
                    {insight.title}
                  </h4>
                  {insight.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  )}
                </div>

                <p className="text-sm text-slate-400 mb-2 line-clamp-2">
                  {insight.description}
                </p>

                {insight.missionTitle && (
                  <div className="mb-2">
                    <span className={`text-xs font-medium ${style.accentColor} bg-slate-900/30 px-2 py-1 rounded`}>
                      {insight.missionTitle}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="capitalize">{insight.type}</span>
                  <span>{formatTimestamp(insight.timestamp)}</span>
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
