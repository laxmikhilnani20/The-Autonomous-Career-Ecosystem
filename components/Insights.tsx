import React from 'react';
import { Insight, InsightStatus } from '../types';
import { Sparkles, TrendingUp, AlertTriangle, Play, Share2, Check, ArrowRight } from 'lucide-react';

interface InsightsProps {
  insights: Insight[];
  onSelectInsight: (insight: Insight) => void;
}

const Insights: React.FC<InsightsProps> = ({ insights, onSelectInsight }) => {

  const getIcon = (type: string, status: InsightStatus) => {
    if (status === 'shared') return <Share2 className="w-5 h-5 text-indigo-400" />;
    if (status === 'completed') return <Check className="w-5 h-5 text-emerald-400" />;

    switch (type) {
      case 'success': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'actionable': return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'gap': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default: return <Sparkles className="w-5 h-5 text-slate-400" />;
    }
  };

  const getCardStyle = (type: string, status: InsightStatus) => {
    if (status === 'shared') return 'border-indigo-500/20 bg-indigo-950/20 opacity-80';
    if (status === 'completed') return 'border-emerald-500/20 bg-emerald-950/20 opacity-90';

    switch (type) {
      case 'success': return 'border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 to-transparent hover:border-emerald-500/40';
      case 'actionable': return 'border-purple-500/20 bg-gradient-to-br from-purple-950/20 to-transparent hover:border-purple-500/40';
      case 'gap': return 'border-amber-500/20 bg-gradient-to-br from-amber-950/20 to-transparent hover:border-amber-500/40';
      default: return 'border-slate-700 bg-slate-800/30';
    }
  };

  return (
    <div className="flex-1 min-h-[300px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-slate-100 flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          Agent Feed
        </h2>
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold border border-slate-800 px-2 py-1 rounded">Live Analysis</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2 pb-4">
        {insights.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-slate-500 space-y-3 border border-dashed border-slate-800 rounded-2xl bg-white/5">
            <Sparkles className="w-6 h-6 opacity-30" />
            <p className="text-sm font-medium">System Idle • Awaiting Inputs</p>
          </div>
        ) : (
          insights.map((insight) => (
            <div 
              key={insight.id}
              onClick={() => onSelectInsight(insight)}
              className={`
                relative backdrop-blur-md border rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer group
                ${getCardStyle(insight.type, insight.status)}
              `}
            >
              <div className="flex gap-4">
                <div className={`mt-1 flex-shrink-0 p-2.5 rounded-xl h-fit bg-slate-900/50 border border-white/5 shadow-inner`}>
                  {getIcon(insight.type, insight.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-slate-100 text-sm truncate pr-2">
                      {insight.status === 'shared' ? 'Archived: ' + insight.title : insight.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                      {insight.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <p className={`text-sm leading-relaxed mb-4 ${insight.status !== 'active' ? 'text-slate-500 line-through' : 'text-slate-400'}`}>
                    {insight.description}
                  </p>

                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Secondary Tags */}
                        {insight.missionTitle && insight.type === 'gap' && (
                            <span className="text-[10px] text-slate-500 font-mono uppercase border border-slate-700 px-2 py-1.5 rounded-md">
                                {insight.missionTitle}
                            </span>
                        )}
                        
                        {/* Status Badges */}
                        {insight.status === 'completed' && (
                           <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                             <Check className="w-3.5 h-3.5" />
                             Complete
                           </div>
                        )}
                        
                         {insight.status === 'shared' && (
                           <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                             <Share2 className="w-3.5 h-3.5" />
                             Posted
                           </div>
                        )}
                      </div>

                      {/* Primary Action Button (Rendered only if Active) */}
                      {insight.status === 'active' && (
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                           {insight.type === 'gap' || insight.type === 'actionable' ? 'View Protocol' : 'View Details'}
                           <div className="p-1 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors">
                              <ArrowRight className="w-3 h-3" />
                           </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Insights;
