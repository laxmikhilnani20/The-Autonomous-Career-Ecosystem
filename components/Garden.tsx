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

        {/* Visual Garden Display */}
        <div className="mt-8 h-48 bg-slate-900/30 border border-white/10 rounded-xl p-6 flex items-end justify-center gap-2">
          {/* Dynamic "plants" based on growth level */}
          {Array.from({ length: Math.floor(growthLevel / 20) + 1 }).map((_, i) => (
            <div
              key={i}
              className={`transition-all duration-500 ${state.color}`}
              style={{
                animation: `sway ${2 + i * 0.3}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`
              }}
            >
              <Icon className={`w-${6 + i} h-${6 + i}`} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
      `}</style>
    </div>
  );
};

export default Garden;
