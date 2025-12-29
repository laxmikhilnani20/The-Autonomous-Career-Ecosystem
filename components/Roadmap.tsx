import React from 'react';
import { Insight } from '../types';
import { CheckCircle2, Circle, Target, ListTodo, ChevronRight } from 'lucide-react';

interface RoadmapProps {
  insights: Insight[];
  targetRole?: string;
  readiness: number;
  onSelectInsight: (insight: Insight) => void;
}

const Roadmap: React.FC<RoadmapProps> = ({ insights, targetRole, readiness, onSelectInsight }) => {
  // Filter for items that are essentially checklist items (gaps or actionable)
  const checklistItems = insights.filter(i => i.type === 'gap' || i.type === 'actionable');
  
  // Calculate specific matrix stats
  const completedCount = checklistItems.filter(i => i.status === 'completed' || i.status === 'shared').length;
  const totalCount = checklistItems.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 h-full flex flex-col backdrop-blur-md">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
        <div className="p-2.5 bg-indigo-500/10 rounded-xl">
           <ListTodo className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
           <h2 className="font-bold text-white tracking-tight">Career Matrix</h2>
           <p className="text-xs text-slate-500 font-mono uppercase">System Audit & Roadmap</p>
        </div>
      </div>

      {/* Target Summary */}
      <div className="mb-6 space-y-4">
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400 font-bold uppercase">Target Locked</span>
                <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-sm font-medium text-slate-200 line-clamp-2 leading-relaxed">
                {targetRole || "No Target Set"}
            </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
             <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                 <span className="block text-2xl font-bold text-emerald-400">{readiness}%</span>
                 <span className="text-[10px] text-slate-500 uppercase tracking-wide">Ready</span>
             </div>
             <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                 <span className="block text-2xl font-bold text-purple-400">{completedCount}/{totalCount}</span>
                 <span className="text-[10px] text-slate-500 uppercase tracking-wide">Missions</span>
             </div>
        </div>
      </div>

      {/* Checklist Scroller */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">Strategic Checklist</h3>
         
         {checklistItems.length === 0 ? (
            <div className="text-center py-8 text-slate-600 text-xs">
                No active protocols.
            </div>
         ) : (
             checklistItems.map(item => {
                 const isDone = item.status === 'completed' || item.status === 'shared';
                 return (
                     <button 
                        key={item.id} 
                        onClick={() => onSelectInsight(item)}
                        className={`
                          w-full group flex gap-3 items-center p-3 rounded-xl transition-all text-left border border-transparent
                          ${isDone 
                            ? 'bg-emerald-950/20 opacity-60 hover:bg-emerald-950/30' 
                            : 'bg-slate-800/40 hover:bg-slate-800 hover:border-slate-700/50 hover:shadow-lg'}
                        `}
                     >
                         <div className="mt-0.5 flex-shrink-0">
                             {isDone ? (
                                 <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                             ) : (
                                 <Circle className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transition-colors" />
                             )}
                         </div>
                         <div className="flex-1 min-w-0">
                             <p className={`text-sm font-medium truncate ${isDone ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                                 {item.missionTitle || item.title}
                             </p>
                             <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                                 {item.type === 'gap' ? 'Critical Gap' : 'Optimization'}
                             </p>
                         </div>
                         {!isDone && (
                           <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                         )}
                     </button>
                 )
             })
         )}
      </div>

      {/* Footer / Call to Action */}
      <div className="mt-6 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>AUDIT STATUS: {progressPercent === 100 ? 'COMPLETE' : 'PENDING'}</span>
            <div className="flex gap-1">
                <span className={`w-2 h-2 rounded-full ${progressPercent > 30 ? 'bg-emerald-500' : 'bg-slate-700'}`}></span>
                <span className={`w-2 h-2 rounded-full ${progressPercent > 60 ? 'bg-emerald-500' : 'bg-slate-700'}`}></span>
                <span className={`w-2 h-2 rounded-full ${progressPercent === 100 ? 'bg-emerald-500' : 'bg-slate-700'}`}></span>
            </div>
        </div>
      </div>

    </div>
  );
};

export default Roadmap;
