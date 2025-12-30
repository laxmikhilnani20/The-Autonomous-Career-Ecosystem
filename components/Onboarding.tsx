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
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Welcome to AURA
          </h1>
          <p className="text-gray-600">Let's set up your career growth journey</p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${step >= 1 ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]' : 'bg-gray-200 text-gray-400 shadow-[inset_2px_2px_4px_#bebebe,inset_-2px_-2px_4px_#ffffff]'}`}>
            1
          </div>
          <div className={`h-1 w-20 rounded-full ${step >= 2 ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gray-300'}`} />
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${step >= 2 ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]' : 'bg-gray-200 text-gray-400 shadow-[inset_2px_2px_4px_#bebebe,inset_-2px_-2px_4px_#ffffff]'}`}>
            2
          </div>
        </div>

        <div className="bg-gray-100 rounded-2xl p-8 shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Upload Your Resume</h2>
                <p className="text-gray-600 text-sm">We'll analyze it to understand your current position</p>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-purple-400 bg-purple-50'
                    : file
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
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
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl flex items-center justify-center mx-auto">
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-blue-600 font-medium">{file.name}</p>
                      <p className="text-gray-500 text-sm">Click or drag to replace</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                      <p className="text-gray-700 font-medium">Drag & drop your resume here</p>
                      <p className="text-gray-500 text-sm">or click to browse</p>
                    </div>
                  )}
                </label>
              </div>

              <button
                onClick={handleNext}
                disabled={!file}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] hover:shadow-[4px_4px_12px_#bebebe,-4px_-4px_12px_#ffffff] flex items-center justify-center gap-2"
              >
                Next Step
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Set Your North Star</h2>
                <p className="text-gray-600 text-sm">What role are you aiming for?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Role
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., Senior Software Engineer, Product Manager..."
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all shadow-[inset_2px_2px_4px_#bebebe,inset_-2px_-2px_4px_#ffffff]"
                />
              </div>

              {file && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-sm font-medium truncate">{file.name}</p>
                    <p className="text-gray-600 text-xs">Resume uploaded</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  disabled={isProcessing}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!goal.trim() || isProcessing}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] hover:shadow-[4px_4px_12px_#bebebe,-4px_-4px_12px_#ffffff] flex items-center justify-center gap-2"
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
