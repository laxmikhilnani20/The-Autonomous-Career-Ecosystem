import React from 'react';
import { Sprout, Flower2, Trees } from 'lucide-react';

interface GardenProps {
  growthLevel: number;
}

const Garden: React.FC<GardenProps> = ({ growthLevel }) => {
  const getGardenState = () => {
    if (growthLevel < 30) {
      return {
        icon: Sprout,
        title: 'Seedling Stage',
        description: 'Your journey begins',
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20'
      };
    } else if (growthLevel < 70) {
      return {
        icon: Flower2,
        title: 'Blooming Phase',
        description: 'Skills are developing',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/20'
      };
    } else {
      return {
        icon: Trees,
        title: 'Flourishing Garden',
        description: 'Thriving ecosystem',
        color: 'text-teal-400',
        bgColor: 'bg-teal-500/10',
        borderColor: 'border-teal-500/20'
      };
    }
  };

  const state = getGardenState();
  const Icon = state.icon;

  return (
    <div className={`h-full bg-slate-800/30 backdrop-blur-sm border ${state.borderColor} rounded-2xl p-6 relative overflow-hidden`}>
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className={`absolute bottom-0 left-0 w-full h-1/2 ${state.bgColor} blur-3xl`} />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">
              Your Garden
            </h3>
            <p className="text-2xl font-bold text-slate-200">{state.title}</p>
            <p className="text-sm text-slate-400 mt-1">{state.description}</p>
          </div>
          <div className={`${state.bgColor} ${state.borderColor} border rounded-xl p-3`}>
            <Icon className={`w-8 h-8 ${state.color}`} />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Growth Level</span>
            <span className={`font-semibold ${state.color}`}>{growthLevel}%</span>
          </div>
          <div className="w-full h-3 bg-slate-900/50 rounded-full overflow-hidden border border-white/10">
            <div
              className={`h-full bg-gradient-to-r ${
                growthLevel < 30
                  ? 'from-green-500 to-green-400'
                  : growthLevel < 70
                  ? 'from-emerald-500 to-emerald-400'
                  : 'from-teal-500 to-teal-400'
              } transition-all duration-1000 ease-out`}
              style={{ width: `${growthLevel}%` }}
            />
          </div>
        </div>

        {/* Visual Garden Display - Enhanced Hero Section */}
        <div className="mt-8 h-72 bg-slate-900/30 border border-white/10 rounded-xl p-8 relative overflow-hidden">
          {/* Ambient Glow Background */}
          <div className={`absolute inset-0 ${state.bgColor} blur-2xl opacity-30 animate-pulse-slow`} />
          
          {/* Interconnected Plant Network */}
          <div className="relative h-full flex items-center justify-center">
            {/* Central Core Plant - Largest */}
            <div className="absolute z-20 animate-float">
              <div className={`relative ${state.color} drop-shadow-2xl`}>
                <Icon className="w-32 h-32 animate-glow" />
                {/* Glow ring around main plant */}
                <div className={`absolute inset-0 ${state.bgColor} rounded-full blur-xl animate-pulse-slow`} />
              </div>
            </div>

            {/* Surrounding Satellite Plants - Based on Growth */}
            {Array.from({ length: Math.min(Math.floor(growthLevel / 15) + 2, 8) }).map((_, i) => {
              const angle = (360 / Math.min(Math.floor(growthLevel / 15) + 2, 8)) * i;
              const radius = 80 + (i % 2) * 20;
              const size = 12 + (i % 3) * 4;
              
              return (
                <div
                  key={i}
                  className={`absolute ${state.color} opacity-80 animate-orbit`}
                  style={{
                    left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * radius}px)`,
                    top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * radius}px)`,
                    transform: 'translate(-50%, -50%)',
                    animation: `orbit ${8 + i}s linear infinite, pulse-glow ${2 + i * 0.3}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`
                  }}
                >
                  <Icon className={`w-${size} h-${size}`} />
                  {/* Individual plant glow */}
                  <div className={`absolute inset-0 ${state.bgColor} rounded-full blur-md opacity-60`} />
                </div>
              );
            })}

            {/* Connecting Energy Lines */}
            {growthLevel >= 40 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                {Array.from({ length: Math.min(Math.floor(growthLevel / 20), 6) }).map((_, i) => {
                  const angle = (360 / Math.min(Math.floor(growthLevel / 20), 6)) * i;
                  const radius = 80;
                  const x1 = 50;
                  const y1 = 50;
                  const x2 = 50 + Math.cos((angle * Math.PI) / 180) * radius / 2.5;
                  const y2 = 50 + Math.sin((angle * Math.PI) / 180) * radius / 2.5;
                  
                  return (
                    <line
                      key={i}
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke="currentColor"
                      strokeWidth="1"
                      className={`${state.color} animate-pulse-slow`}
                      strokeDasharray="4 4"
                      style={{
                        animation: `pulse-glow ${3 + i * 0.5}s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  );
                })}
              </svg>
            )}

            {/* Particle Effects for High Growth */}
            {growthLevel >= 60 && (
              <>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={`particle-${i}`}
                    className={`absolute w-1 h-1 ${state.bgColor} rounded-full animate-float-particle`}
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                      animation: `float-particle ${4 + Math.random() * 3}s ease-in-out infinite`,
                      animationDelay: `${Math.random() * 2}s`,
                      opacity: 0.6
                    }}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 10px currentColor); }
          50% { filter: drop-shadow(0 0 20px currentColor); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @keyframes orbit {
          from { transform: translate(-50%, -50%) rotate(0deg) translateX(5px) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateX(5px) rotate(-360deg); }
        }
        
        @keyframes float-particle {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          50% { transform: translate(10px, -15px) scale(1.2); opacity: 0.8; }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        
        .animate-orbit {
          animation: orbit 8s linear infinite;
        }
        
        .animate-float-particle {
          animation: float-particle 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Garden;
