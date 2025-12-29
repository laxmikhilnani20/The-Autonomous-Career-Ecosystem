import React, { useState } from 'react';
import { X, CheckCircle, RotateCcw, Share2, Copy, Check } from 'lucide-react';
import { Insight, InsightStatus } from '../types';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  insight: Insight | null;
  onUpdateStatus: (id: string, status: InsightStatus) => void;
}

const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, insight, onUpdateStatus }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !insight) return null;

  const handleComplete = () => {
    onUpdateStatus(insight.id, 'completed');
    onClose();
  };

  const handleUndo = () => {
    onUpdateStatus(insight.id, 'active');
    onClose();
  };

  const handleCopyPost = () => {
    if (insight.actionContent) {
      navigator.clipboard.writeText(insight.actionContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getTypeColor = () => {
    switch (insight.type) {
      case 'success':
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400',
          button: 'from-emerald-500 to-emerald-600'
        };
      case 'gap':
        return {
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/30',
          text: 'text-purple-400',
          button: 'from-purple-500 to-purple-600'
        };
      case 'actionable':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          text: 'text-blue-400',
          button: 'from-blue-500 to-blue-600'
        };
      default:
        return {
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/30',
          text: 'text-slate-400',
          button: 'from-slate-500 to-slate-600'
        };
    }
  };

  const colors = getTypeColor();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${colors.bg} border-b ${colors.border} p-6`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs uppercase font-semibold ${colors.text} tracking-wider`}>
                  {insight.type}
                </span>
                {insight.status === 'completed' && (
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded font-medium">
                    ✓ Completed
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-slate-200">{insight.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] custom-scrollbar space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Overview
            </h3>
            <p className="text-slate-300 leading-relaxed">{insight.description}</p>
          </div>

          {/* Mission Brief */}
          {insight.missionBrief && (
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {insight.missionTitle || 'Action Plan'}
              </h3>
              <div className={`${colors.bg} border ${colors.border} rounded-lg p-4`}>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {insight.missionBrief}
                </p>
              </div>
            </div>
          )}

          {/* LinkedIn Post Draft */}
          {insight.actionContent && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Share on LinkedIn
                </h3>
                <button
                  onClick={handleCopyPost}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4">
                <p className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                  {insight.actionContent}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-white/10 p-6 flex gap-3">
          {insight.status !== 'completed' ? (
            <>
              <button
                onClick={onClose}
                className="px-6 py-2.5 border border-white/20 text-slate-300 rounded-lg hover:bg-white/5 transition-all font-medium"
              >
                Close
              </button>
              <button
                onClick={handleComplete}
                className={`flex-1 bg-gradient-to-r ${colors.button} hover:opacity-90 text-white font-medium py-2.5 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2`}
              >
                <CheckCircle className="w-5 h-5" />
                Mark as Complete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-6 py-2.5 border border-white/20 text-slate-300 rounded-lg hover:bg-white/5 transition-all font-medium"
              >
                Close
              </button>
              <button
                onClick={handleUndo}
                className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-all font-medium flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Undo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
