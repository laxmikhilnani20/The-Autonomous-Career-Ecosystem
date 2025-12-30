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
    <aside className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AURA
          </h1>
        </div>

        {/* User Profile */}
        <div className="bg-gray-100 rounded-2xl p-4 shadow-[4px_4px_12px_#bebebe,-4px_-4px_12px_#ffffff]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center shadow-lg">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 truncate">{user.username}</h3>
              <p className="text-xs text-gray-600">
                {user.targetRole || 'Set your goal'}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-emerald-50 rounded-xl p-2 shadow-sm">
              <p className="text-emerald-600 font-medium">Growth</p>
              <p className="text-gray-800 font-semibold">{user.growthLevel}%</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-2 shadow-sm">
              <p className="text-purple-600 font-medium">Readiness</p>
              <p className="text-gray-800 font-semibold">{user.readiness}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Zones */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider">Quick Actions</h3>
          
          {/* Resume Upload */}
          <div
            onDragOver={(e) => handleDragOver(e, 'resume')}
            onDragLeave={() => handleDragLeave('resume')}
            onDrop={(e) => handleDrop(e, UploadType.RESUME)}
            className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer ${
              isDraggingResume
                ? 'border-purple-500 bg-purple-50 shadow-[inset_2px_2px_4px_rgba(168,85,247,0.1)]'
                : isProcessing
                ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
                : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50 shadow-[2px_2px_4px_#bebebe,-2px_-2px_4px_#ffffff]'
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
              <Upload className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-800">Upload Resume</p>
              <p className="text-xs text-gray-600 mt-1">Scan for gaps</p>
            </label>
          </div>

          {/* Achievement Upload */}
          <div
            onDragOver={(e) => handleDragOver(e, 'achievement')}
            onDragLeave={() => handleDragLeave('achievement')}
            onDrop={(e) => handleDrop(e, UploadType.ACHIEVEMENT)}
            className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer ${
              isDraggingAchievement
                ? 'border-emerald-500 bg-emerald-50 shadow-[inset_2px_2px_4px_rgba(16,185,129,0.1)]'
                : isProcessing
                ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
                : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/50 shadow-[2px_2px_4px_#bebebe,-2px_-2px_4px_#ffffff]'
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
              <Award className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-800">Share Achievement</p>
              <p className="text-xs text-gray-600 mt-1">Celebrate wins</p>
            </label>
          </div>
        </div>

        {isProcessing && (
          <div className="bg-blue-50 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
            <div className="w-5 h-5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
            <div>
              <p className="text-sm font-medium text-blue-600">Processing...</p>
              <p className="text-xs text-gray-600">AI is analyzing your file</p>
            </div>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="p-6 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-xl transition-all text-sm font-medium shadow-[4px_4px_12px_#bebebe,-4px_-4px_12px_#ffffff] hover:shadow-[6px_6px_16px_#bebebe,-6px_-6px_16px_#ffffff]"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
