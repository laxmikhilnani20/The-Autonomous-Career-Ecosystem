import React, { useRef, useState } from 'react';
import { BrainCircuit, FileText, Upload, ChevronRight, Loader2, Target, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: (file: File, goal: string) => Promise<void>;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [file, setFile] = useState<File | null>(null);
  const [goal, setGoal] = useState('');
  
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setStep(2); // Auto advance
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStep(2); // Auto advance
    }
  };

  const finishOnboarding = async () => {
    if (!file || !goal.trim()) return;
    setIsProcessing(true);
    await onComplete(file, goal);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-2xl w-full p-8 z-10">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-purple-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Initialize AURA
          </h1>
          
          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className={`h-1 rounded-full transition-all duration-500 ${step === 1 ? 'w-8 bg-emerald-400' : 'w-2 bg-slate-700'}`} />
            <div className={`h-1 rounded-full transition-all duration-500 ${step === 2 ? 'w-8 bg-emerald-400' : 'w-2 bg-slate-700'}`} />
          </div>
        </div>

        {/* STEP 1: RESUME */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
             <div 
              className={`
                relative group transition-all duration-500 rounded-3xl border-2 border-dashed p-10 text-center cursor-pointer
                ${isDragging 
                  ? 'border-emerald-400 bg-emerald-950/30 scale-[1.02] shadow-[0_0_50px_rgba(52,211,153,0.3)]' 
                  : 'border-slate-800 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/60'}
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input 
                ref={inputRef}
                type="file" 
                className="hidden" 
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx"
              />
              <div className="py-8 space-y-6">
                <div className={`
                  w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-all duration-300
                  ${isDragging ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'}
                `}>
                  <Upload className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-slate-200">The Soil</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    Upload your current CV to establish the baseline for your garden.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: GOAL */}
        {step === 2 && (
           <div className="animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="bg-slate-900/40 border border-slate-700 rounded-3xl p-10 text-center backdrop-blur-sm">
                
                {isProcessing ? (
                   <div className="py-12 flex flex-col items-center justify-center space-y-4">
                      <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
                      <div className="space-y-1">
                        <h3 className="text-xl font-medium text-white">Calibrating Roadmap...</h3>
                        <p className="text-sm text-slate-500">Analyzing gaps between Soil and North Star.</p>
                      </div>
                    </div>
                ) : (
                  <>
                    <div className="w-20 h-20 mx-auto rounded-full bg-slate-800 flex items-center justify-center mb-6 border border-slate-700">
                      <Target className="w-8 h-8 text-purple-400" />
                    </div>
                    
                    <h3 className="text-2xl font-semibold text-slate-200 mb-2">The North Star</h3>
                    <p className="text-slate-500 mb-8">What is your target role or dream company?</p>
                    
                    <div className="relative max-w-md mx-auto">
                      <input 
                        type="text" 
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="e.g. Senior Frontend Engineer at Netflix"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-5 py-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-center placeholder:text-slate-700"
                        onKeyDown={(e) => e.key === 'Enter' && finishOnboarding()}
                        autoFocus
                      />
                    </div>

                    <button 
                      onClick={finishOnboarding}
                      disabled={!goal.trim()}
                      className="mt-8 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 mx-auto"
                    >
                      Generate Flight Plan
                      <ArrowRight className="w-5 h-5" />
                    </button>

                     <button 
                      onClick={() => setStep(1)}
                      className="mt-4 text-xs text-slate-500 hover:text-slate-300 underline underline-offset-4"
                    >
                      Back to Resume Upload
                    </button>
                  </>
                )}
             </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default Onboarding;
