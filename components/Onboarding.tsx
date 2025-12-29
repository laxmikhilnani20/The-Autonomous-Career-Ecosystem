import React, { useState } from 'react';
import { Upload, Target, ArrowRight, FileText } from 'lucide-react';

interface OnboardingProps {
  onComplete: (file: File, goal: string) => Promise<void>;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [file, setFile] = useState<File | null>(null);
  const [goal, setGoal] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleNext = () => {
    if (file && step === 1) {
      setStep(2);
    }
  };

  const handleComplete = async () => {
    if (file && goal.trim()) {
      setIsProcessing(true);
      await onComplete(file, goal);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B1120] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-indigo-600/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-600/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to AURA
          </h1>
          <p className="text-slate-400">Let's set up your career growth journey</p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
            1
          </div>
          <div className={`h-1 w-20 ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
            2
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Upload className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h2 className="text-2xl font-semibold text-slate-200 mb-2">Upload Your Resume</h2>
                <p className="text-slate-400 text-sm">We'll analyze it to understand your current position</p>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : file
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : 'border-white/20 hover:border-white/40 bg-slate-800/30'
                }`}
              >
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  {file ? (
                    <div className="space-y-3">
                      <FileText className="w-16 h-16 text-emerald-400 mx-auto" />
                      <p className="text-emerald-400 font-medium">{file.name}</p>
                      <p className="text-slate-500 text-sm">Click or drag to replace</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="w-16 h-16 text-slate-400 mx-auto" />
                      <p className="text-slate-300">Drag & drop your resume here</p>
                      <p className="text-slate-500 text-sm">or click to browse</p>
                    </div>
                  )}
                </label>
              </div>

              <button
                onClick={handleNext}
                disabled={!file}
                className="w-full bg-gradient-to-r from-emerald-500 to-purple-500 hover:from-emerald-600 hover:to-purple-600 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
              >
                Next Step
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Target className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <h2 className="text-2xl font-semibold text-slate-200 mb-2">Set Your North Star</h2>
                <p className="text-slate-400 text-sm">What role are you aiming for?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target Role
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., Senior Software Engineer, Product Manager..."
                  className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-3 px-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                />
              </div>

              {file && (
                <div className="bg-slate-800/30 border border-white/10 rounded-lg p-4 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-300 text-sm font-medium truncate">{file.name}</p>
                    <p className="text-slate-500 text-xs">Resume uploaded</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  disabled={isProcessing}
                  className="px-6 py-3 border border-white/20 text-slate-300 rounded-lg hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!goal.trim() || isProcessing}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-600 hover:to-emerald-600 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-all shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating Your Roadmap...
                    </>
                  ) : (
                    <>
                      Start Your Journey
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
