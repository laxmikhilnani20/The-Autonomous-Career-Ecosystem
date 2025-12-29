import React, { useState, useRef } from 'react';
import { UploadType, User } from '../types';
import { BrainCircuit, UploadCloud, Sprout, FileText, CheckCircle2, Loader2, LogOut, UserCircle, RefreshCw } from 'lucide-react';

interface SidebarProps {
  onFileUpload: (type: UploadType, file: File) => Promise<void>;
  isProcessing: boolean;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onFileUpload, isProcessing, user, onLogout }) => {
  const [dragActive, setDragActive] = useState<UploadType | null>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const achievementInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent, type: UploadType) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(type);
    } else if (e.type === 'dragleave') {
      setDragActive(null);
    }
  };

  const handleDrop = (e: React.DragEvent, type: UploadType) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(type, e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, type: UploadType) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(type, e.target.files[0]);
    }
  };

  const UploadZone = ({ type, title, subtitle, icon: Icon, inputRef }: any) => {
    const isActive = dragActive === type;
    
    return (
      <div 
        className={`
          relative group cursor-pointer transition-all duration-300 rounded-2xl border-2 border-dashed p-6
          ${isActive 
            ? 'border-emerald-400 bg-emerald-500/10 scale-[1.02]' 
            : 'border-slate-700/50 hover:border-slate-500 bg-white/5 hover:bg-white/10'}
        `}
        onDragEnter={(e) => handleDrag(e, type)}
        onDragLeave={(e) => handleDrag(e, type)}
        onDragOver={(e) => handleDrag(e, type)}
        onDrop={(e) => handleDrop(e, type)}
        onClick={() => inputRef.current?.click()}
      >
        <input 
          ref={inputRef}
          type="file" 
          className="hidden" 
          onChange={(e) => handleChange(e, type)}
        />
        
        {isProcessing && dragActive === type ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm rounded-2xl z-10">
             <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-2" />
             <span className="text-xs text-emerald-400 font-mono animate-pulse">SCANNING DNA...</span>
           </div>
        ) : null}

        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`p-3.5 rounded-full transition-colors ${isActive ? 'bg-emerald-400/20' : 'bg-slate-800'}`}>
            <Icon className={`w-6 h-6 ${isActive ? 'text-emerald-400' : 'text-slate-300'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-200">{title}</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{subtitle}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside className="hidden md:flex w-72 h-full flex-col border-r border-white/5 bg-[#0F172A]/80 backdrop-blur-2xl p-6 relative overflow-hidden z-20">
      
      {/* Header */}
      <div className="flex items-center space-x-4 mb-10 relative z-10 pl-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/10">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            AURA
          </h1>
          <p className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">Agent Active</p>
        </div>
      </div>

      {/* User Info */}
      <div className="mb-8 bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/5">
        <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <UserCircle className="w-5 h-5 text-slate-300" />
        </div>
        <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-slate-200 truncate">{user.username}</p>
            <p className="text-[10px] text-slate-500 font-medium truncate">{user.targetRole || 'Calibrating...'}</p>
        </div>
      </div>

      {/* Zones */}
      <div className="space-y-4 flex-1 relative z-10">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Uploads</h3>
        
        <UploadZone 
          type={UploadType.RESUME}
          title="Update Soil"
          subtitle="Refine Baseline Resume"
          icon={FileText}
          inputRef={resumeInputRef}
        />

        <UploadZone 
          type={UploadType.ACHIEVEMENT}
          title="Maintenance"
          subtitle="Renew Certificates"
          icon={RefreshCw}
          inputRef={achievementInputRef}
        />
      </div>

      {/* Footer Status */}
      <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 text-xs font-medium text-slate-400 hover:text-white py-2.5 rounded-xl hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Terminate Session
        </button>

        <div className="flex items-center justify-between text-xs text-slate-600 px-2">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System Online
          </span>
          <span className="font-mono opacity-50">v2.5.0</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
