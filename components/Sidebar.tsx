import React, { useState } from 'react';
import { User as UserIcon, Upload, Award, LogOut, Sparkles } from 'lucide-react';
import { User, UploadType } from '../types';

interface SidebarProps {
  user: User;
  onFileUpload: (type: UploadType, file: File) => Promise<void>;
  isProcessing: boolean;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onFileUpload, isProcessing, onLogout }) => {
  const [isDraggingResume, setIsDraggingResume] = useState(false);
  const [isDraggingAchievement, setIsDraggingAchievement] = useState(false);

  const handleDragOver = (e: React.DragEvent, type: 'resume' | 'achievement') => {
    e.preventDefault();
    if (type === 'resume') {
      setIsDraggingResume(true);
    } else {
      setIsDraggingAchievement(true);
    }
  };

  const handleDragLeave = (type: 'resume' | 'achievement') => {
    if (type === 'resume') {
      setIsDraggingResume(false);
    } else {
      setIsDraggingAchievement(false);
    }
  };

  const handleDrop = async (e: React.DragEvent, type: UploadType) => {
    e.preventDefault();
    setIsDraggingResume(false);
    setIsDraggingAchievement(false);
    
    const file = e.dataTransfer.files[0];
    if (file && !isProcessing) {
      await onFileUpload(type, file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: UploadType) => {
    const file = e.target.files?.[0];
    if (file && !isProcessing) {
      await onFileUpload(type, file);
    }
    e.target.value = '';
  };

  return (
    <aside className="w-80 bg-slate-900/30 backdrop-blur-sm border-r border-white/5 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-emerald-400" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
            AURA
          </h1>
        </div>

        {/* User Profile */}
        <div className="bg-slate-800/40 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-purple-400 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-200 truncate">{user.username}</h3>
              <p className="text-xs text-slate-400">
                {user.targetRole || 'Set your goal'}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2">
              <p className="text-emerald-400 font-medium">Growth</p>
              <p className="text-slate-300 font-semibold">{user.growthLevel}%</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2">
              <p className="text-purple-400 font-medium">Readiness</p>
              <p className="text-slate-300 font-semibold">{user.readiness}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Zones */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Quick Actions</h3>
          
          {/* Resume Upload */}
          <div
            onDragOver={(e) => handleDragOver(e, 'resume')}
            onDragLeave={() => handleDragLeave('resume')}
            onDrop={(e) => handleDrop(e, UploadType.RESUME)}
            className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${
              isDraggingResume
                ? 'border-purple-500 bg-purple-500/10'
                : isProcessing
                ? 'border-white/10 bg-slate-800/20 cursor-not-allowed opacity-50'
                : 'border-white/20 hover:border-purple-500/50 hover:bg-purple-500/5'
            }`}
          >
            <input
              type="file"
              onChange={(e) => handleFileSelect(e, UploadType.RESUME)}
              className="hidden"
              id="resume-upload-sidebar"
              accept=".pdf,.doc,.docx"
              disabled={isProcessing}
            />
            <label htmlFor="resume-upload-sidebar" className="cursor-pointer block">
              <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-300">Upload Resume</p>
              <p className="text-xs text-slate-500 mt-1">Scan for gaps</p>
            </label>
          </div>

          {/* Achievement Upload */}
          <div
            onDragOver={(e) => handleDragOver(e, 'achievement')}
            onDragLeave={() => handleDragLeave('achievement')}
            onDrop={(e) => handleDrop(e, UploadType.ACHIEVEMENT)}
            className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${
              isDraggingAchievement
                ? 'border-emerald-500 bg-emerald-500/10'
                : isProcessing
                ? 'border-white/10 bg-slate-800/20 cursor-not-allowed opacity-50'
                : 'border-white/20 hover:border-emerald-500/50 hover:bg-emerald-500/5'
            }`}
          >
            <input
              type="file"
              onChange={(e) => handleFileSelect(e, UploadType.ACHIEVEMENT)}
              className="hidden"
              id="achievement-upload-sidebar"
              accept=".pdf,.doc,.docx,.jpg,.png"
              disabled={isProcessing}
            />
            <label htmlFor="achievement-upload-sidebar" className="cursor-pointer block">
              <Award className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-300">Share Achievement</p>
              <p className="text-xs text-slate-500 mt-1">Celebrate wins</p>
            </label>
          </div>
        </div>

        {isProcessing && (
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
            <div>
              <p className="text-sm font-medium text-indigo-400">Processing...</p>
              <p className="text-xs text-slate-500">AI is analyzing your file</p>
            </div>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="p-6 border-t border-white/5">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800/50 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-slate-200 rounded-lg transition-all text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
