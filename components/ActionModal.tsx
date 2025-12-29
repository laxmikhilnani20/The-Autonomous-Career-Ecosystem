import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Wand2, Shield, ChevronRight, Trophy, Terminal, Share2, Undo2, RotateCcw, Clock, Target, List } from 'lucide-react';
import { Insight, InsightStatus } from '../types';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  insight: Insight | null;
  onUpdateStatus: (id: string, status: InsightStatus) => void;
}

const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, insight, onUpdateStatus }) => {
  const [step, setStep] = useState<'brief' | 'processing' | 'result'>('brief');
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);

  // Reset state when modal opens with new insight
  useEffect(() => {
    if (isOpen && insight) {
      setContent(insight.actionContent || '');
      
      // If completed or shared, go straight to result to allow sharing/viewing
      if (insight.status === 'completed' || insight.status === 'shared') {
        setStep('result');
        return;
      }

      // If it's a success card without a mission, show result immediately
      if (insight.type === 'success' && !insight.missionBrief) {
         setStep('result');
      } else {
         setStep('brief');
      }
    }
  }, [isOpen, insight]);

  if (!isOpen || !insight) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completeMission = () => {
    setStep('processing');
    // Simulate AI verification
    setTimeout(() => {
      onUpdateStatus(insight.id, 'completed');
      setStep('result');
    }, 1500);
  };

  const markAsShared = () => {
    onUpdateStatus(insight.id, 'shared');
    onClose();
  };
  
  const handleUndo = () => {
      // Revert to active state
      onUpdateStatus(insight.id, 'active');
      onClose();
  };

  const isShared = insight.status === 'shared';
  const isCompleted = insight.status === 'completed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-[#0F172A] border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-slate-800/50 bg-slate-900/50 z-10 flex items-center justify-between">
             <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-lg ${step === 'result' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                     {step === 'result' ? <Trophy className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
                 </div>
                 <div>
                     <h3 className="text-slate-100 font-bold text-lg tracking-tight">
                         {step === 'brief' ? 'Mission Directive' : step === 'processing' ? 'Verifying Protocol' : 'Mission Debrief'}
                     </h3>
                     <p className="text-slate-500 text-xs font-mono uppercase tracking-wider">
                         ID: {insight.id.slice(0, 8)}
                     </p>
                 </div>
             </div>
             <button 
                 onClick={onClose}
                 className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
             >
                 <X className="w-5 h-5" />
             </button>
        </div>

        {/* Content Body */}
        <div className="p-0 overflow-y-auto custom-scrollbar">
            
            {/* STEP 1: THE MISSION BRIEF (INSTRUCTIONS) */}
            {step === 'brief' && (
                <div className="p-6 md:p-8 space-y-6">
                    
                    {/* Mission Header Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Target className="w-32 h-32 text-indigo-400" />
                        </div>
                        
                        <div className="relative z-10">
                            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Protocol Objective</h4>
                            <h2 className="text-xl font-semibold text-white mb-4">
                                {insight.missionTitle || insight.title}
                            </h2>
                            <p className="text-slate-300 leading-relaxed text-sm">
                                {insight.missionBrief || insight.description}
                            </p>
                        </div>
                    </div>

                    {/* Metadata / Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 border border-slate-800/50 p-3 rounded-xl flex items-center gap-3">
                            <Clock className="w-4 h-4 text-slate-500" />
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase font-bold">Est. Time</p>
                                <p className="text-sm text-slate-200">~45 Mins</p>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800/50 p-3 rounded-xl flex items-center gap-3">
                            <Shield className="w-4 h-4 text-emerald-500" />
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase font-bold">Reward</p>
                                <p className="text-sm text-emerald-400">+5 Readiness</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="pt-4 border-t border-white/5">
                        <button 
                            onClick={completeMission}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 group"
                        >
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                            </span>
                            Mission Accomplished
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform opacity-70" />
                        </button>
                        <p className="text-center text-[10px] text-slate-500 mt-3">
                            Click only after executing the protocol instructions above.
                        </p>
                    </div>
                </div>
            )}

            {/* STEP 2: PROCESSING ANIMATION */}
            {step === 'processing' && (
                <div className="p-12 flex flex-col items-center justify-center space-y-6 min-h-[350px]">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-8 h-8 text-emerald-500 animate-in zoom-in duration-500" />
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <h4 className="text-xl font-medium text-white">Verifying Evidence...</h4>
                        <p className="text-slate-500 text-sm">Updating Readiness Score & Garden Health</p>
                    </div>
                </div>
            )}

            {/* STEP 3: RESULT & SHARE (THE "POP") */}
            {step === 'result' && (
                <div className="p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* Success Banner */}
                    <div className="text-center space-y-3 mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40 mb-2">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                           Achievement Unlocked
                        </h2>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto">
                            Great work. Your readiness score has increased. Now, let your network know.
                        </p>
                    </div>

                    {/* Social Draft Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 shadow-inner">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                             <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <span className="text-xs font-semibold text-slate-300">LinkedIn Draft</span>
                             </div>
                             <span className="text-[10px] text-purple-400 flex items-center gap-1 border border-purple-500/20 px-2 py-0.5 rounded-full bg-purple-500/10">
                                <Wand2 className="w-3 h-3" /> AI Generated
                             </span>
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={isShared}
                            className={`w-full h-32 bg-transparent text-slate-200 p-4 focus:outline-none resize-none text-sm leading-relaxed ${isShared ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                         <div className="flex justify-end p-2 border-t border-slate-800">
                             <button 
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copied ? 'Copied' : 'Copy Text'}
                            </button>
                         </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-1 gap-3 pt-2">
                        {isShared ? (
                           <button 
                              onClick={onClose}
                              className="py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                          >
                              <Check className="w-4 h-4" />
                              Return to Dashboard
                          </button>
                        ) : (
                          <button 
                              onClick={markAsShared}
                              className="py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/20 transition-all flex items-center justify-center gap-2"
                          >
                              <Share2 className="w-4 h-4" />
                              Post to Profile & Close
                          </button>
                        )}
                        
                        <button 
                            onClick={handleUndo}
                            className="mt-2 text-xs text-slate-500 hover:text-red-400 flex items-center justify-center gap-1 mx-auto transition-colors py-2"
                        >
                            <RotateCcw className="w-3 h-3" />
                            {isShared ? "Undo Complete Status" : "I didn't finish this yet (Go Back)"}
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
