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
          bg: 'bg-emerald-100',
          border: 'border-emerald-300',
          text: 'text-emerald-700',
          button: 'from-emerald-400 to-emerald-500'
        };
      case 'gap':
        return {
          bg: 'bg-purple-100',
          border: 'border-purple-300',
          text: 'text-purple-700',
          button: 'from-purple-400 to-purple-500'
        };
      case 'actionable':
        return {
          bg: 'bg-blue-100',
          border: 'border-blue-300',
          text: 'text-blue-700',
          button: 'from-blue-400 to-blue-500'
        };
      default:
        return {
          bg: 'bg-gray-100',
          border: 'border-gray-300',
          text: 'text-gray-700',
          button: 'from-gray-400 to-gray-500'
        };
    }
  };

  const colors = getTypeColor();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div
        className="bg-gray-100 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-[12px_12px_24px_#bebebe,-12px_-12px_24px_#ffffff]"
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
                  <span className="text-xs bg-emerald-200 text-emerald-700 px-2 py-1 rounded font-medium">
                    ✓ Completed
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{insight.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] custom-scrollbar space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Overview
            </h3>
            <p className="text-gray-700 leading-relaxed">{insight.description}</p>
          </div>

          {/* Mission Brief */}
          {insight.missionBrief && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                {insight.missionTitle || 'Action Plan'}
              </h3>
              <div className={`${colors.bg} border ${colors.border} rounded-xl p-4 shadow-[inset_2px_2px_4px_#bebebe,inset_-2px_-2px_4px_#ffffff]`}>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {insight.missionBrief}
                </p>
              </div>
            </div>
          )}

          {/* LinkedIn Post Draft */}
          {insight.actionContent && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Share on LinkedIn
                </h3>
                <button
                  onClick={handleCopyPost}
                  className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-[inset_2px_2px_4px_#bebebe,inset_-2px_-2px_4px_#ffffff]">
                <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                  {insight.actionContent}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 flex gap-3 bg-gray-50">
          {insight.status !== 'completed' ? (
            <>
              <button
                onClick={onClose}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]"
              >
                Close
              </button>
              <button
                onClick={handleComplete}
                className={`flex-1 bg-gradient-to-r ${colors.button} hover:opacity-90 text-white font-medium py-2.5 rounded-xl transition-all shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] flex items-center justify-center gap-2`}
              >
                <CheckCircle className="w-5 h-5" />
                Mark as Complete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]"
              >
                Close
              </button>
              <button
                onClick={handleUndo}
                className="px-6 py-2.5 bg-gray-400 hover:bg-gray-500 text-white rounded-xl transition-all font-medium flex items-center gap-2 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]"
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
