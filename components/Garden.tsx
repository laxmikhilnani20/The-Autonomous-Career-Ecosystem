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
    <div className="h-full bg-gray-100 rounded-3xl p-6 relative overflow-hidden shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]">
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-1">
              Your Garden
            </h3>
            <p className="text-2xl font-bold text-gray-800">{state.title}</p>
            <p className="text-sm text-gray-600 mt-1">{state.description}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl p-3 shadow-lg">
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Growth Level</span>
            <span className="font-semibold text-blue-600">{growthLevel}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-[inset_2px_2px_4px_#bebebe]">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-1000 ease-out"
              style={{ width: `${growthLevel}%` }}
            />
          </div>
        </div>

        {/* Dynamic Skill Tree Ecosystem */}
        <div className="mt-8 h-72 bg-gray-100 rounded-2xl p-8 relative overflow-hidden shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]">
          
          {/* SVG Skill Tree */}
          <div className="relative h-full flex items-center justify-center">
            <svg 
              viewBox="0 0 400 300" 
              className="w-full h-full"
              style={{ filter: 'drop-shadow(0 0 10px rgba(0, 210, 255, 0.3))' }}
            >
              <defs>
                {/* Glowing gradient for trunk */}
                <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: state.color.includes('green') ? '#10b981' : state.color.includes('emerald') ? '#34d399' : '#2dd4bf', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: state.color.includes('green') ? '#059669' : state.color.includes('emerald') ? '#10b981' : '#14b8a6', stopOpacity: 0.8 }} />
                </linearGradient>
                
                {/* Glow filter */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Central Trunk (Always visible - The Resume) */}
              <g className="skill-tree-trunk">
                <path
                  d="M 200 280 L 200 180 L 195 180 L 200 120 L 205 180 L 200 180 Z"
                  fill="url(#trunkGradient)"
                  stroke={state.color.includes('green') ? '#10b981' : state.color.includes('emerald') ? '#34d399' : '#2dd4bf'}
                  strokeWidth="2"
                  className="animate-pulse-glow"
                />
                {/* Root system */}
                <path
                  d="M 200 280 Q 180 290 160 285 M 200 280 Q 220 290 240 285"
                  stroke={state.color.includes('green') ? '#10b981' : state.color.includes('emerald') ? '#34d399' : '#2dd4bf'}
                  strokeWidth="2"
                  fill="none"
                  opacity="0.5"
                />
              </g>

              {/* Branches (31-60%: Sprouting branches with glowing nodes) */}
              {growthLevel >= 31 && (
                <g className="skill-tree-branches">
                  {/* Left Branch 1 */}
                  <path
                    d="M 200 160 Q 150 140 120 130"
                    stroke={state.color.includes('green') ? '#10b981' : state.color.includes('emerald') ? '#34d399' : '#2dd4bf'}
                    strokeWidth="3"
                    fill="none"
                    className="animate-branch-grow"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <circle 
                    cx="120" 
                    cy="130" 
                    r="6" 
                    fill={state.color.includes('green') ? '#10b981' : state.color.includes('emerald') ? '#34d399' : '#2dd4bf'}
                    className="animate-pulse-glow"
                    filter="url(#glow)"
                  />

                  {/* Right Branch 1 */}
                  <path
                    d="M 200 160 Q 250 140 280 130"
                    stroke={state.color.includes('green') ? '#10b981' : state.color.includes('emerald') ? '#34d399' : '#2dd4bf'}
                    strokeWidth="3"
                    fill="none"
                    className="animate-branch-grow"
                    style={{ animationDelay: '0.4s' }}
                  />
                  <circle 
                    cx="280" 
                    cy="130" 
                    r="6" 
                    fill={state.color.includes('green') ? '#10b981' : state.color.includes('emerald') ? '#34d399' : '#2dd4bf'}
                    className="animate-pulse-glow"
                    filter="url(#glow)"
                  />

                  {/* Left Branch 2 */}
                  <path
                    d="M 200 180 Q 140 180 100 160"
                    stroke={state.color.includes('green') ? '#10b981' : state.color.includes('emerald') ? '#34d399' : '#2dd4bf'}
                    strokeWidth="2.5"
                    fill="none"
                    className="animate-branch-grow"
                    style={{ animationDelay: '0.6s' }}
                  />
                  <circle 
                    cx="100" 
                    cy="160" 
                    r="5" 
                    fill={state.color.includes('green') ? '#10b981' : state.color.includes('emerald') ? '#34d399' : '#2dd4bf'}
                    className="animate-pulse-glow"
                    filter="url(#glow)"
                  />

                  {/* Right Branch 2 */}
                  <path
                    d="M 200 180 Q 260 180 300 160"
                    stroke={state.color.includes('green') ? '#10b981' : state.color.includes('emerald') ? '#34d399' : '#2dd4bf'}
                    strokeWidth="2.5"
                    fill="none"
                    className="animate-branch-grow"
                    style={{ animationDelay: '0.8s' }}
                  />
                  <circle 
                    cx="300" 
                    cy="160" 
                    r="5" 
                    fill={state.color.includes('green') ? '#10b981' : state.color.includes('emerald') ? '#34d399' : '#2dd4bf'}
                    className="animate-pulse-glow"
                    filter="url(#glow)"
                  />
                </g>
              )}

              {/* Flowers/Leaves (61-100%: Full bloom) */}
              {growthLevel >= 61 && (
                <g className="skill-tree-blooms">
                  {/* Flowers on branch ends */}
                  {[
                    { cx: 120, cy: 130, delay: '0.2s' },
                    { cx: 280, cy: 130, delay: '0.4s' },
                    { cx: 100, cy: 160, delay: '0.6s' },
                    { cx: 300, cy: 160, delay: '0.8s' },
                    { cx: 200, cy: 120, delay: '0.3s' }
                  ].map((bloom, i) => (
                    <g key={i} className="animate-bloom" style={{ animationDelay: bloom.delay }}>
                      {/* Petals */}
                      {[0, 72, 144, 216, 288].map((angle, j) => {
                        const rad = (angle * Math.PI) / 180;
                        const petalX = bloom.cx + Math.cos(rad) * 8;
                        const petalY = bloom.cy + Math.sin(rad) * 8;
                        return (
                          <ellipse
                            key={j}
                            cx={petalX}
                            cy={petalY}
                            rx="5"
                            ry="8"
                            fill={state.color.includes('green') ? '#22c55e' : state.color.includes('emerald') ? '#10b981' : '#14b8a6'}
                            opacity="0.8"
                            transform={`rotate(${angle} ${petalX} ${petalY})`}
                          />
                        );
                      })}
                      {/* Center */}
                      <circle
                        cx={bloom.cx}
                        cy={bloom.cy}
                        r="4"
                        fill="#fbbf24"
                        filter="url(#glow)"
                        className="animate-pulse-glow"
                      />
                    </g>
                  ))}

                  {/* Extra top bloom */}
                  <circle
                    cx="200"
                    cy="120"
                    r="8"
                    fill={state.color.includes('green') ? '#10b981' : state.color.includes('emerald') ? '#34d399' : '#2dd4bf'}
                    filter="url(#glow)"
                    className="animate-pulse-glow"
                  />
                </g>
              )}

              {/* Floating particles for fully flourished state */}
              {growthLevel >= 80 && (
                <g className="skill-tree-particles">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <circle
                      key={i}
                      cx={100 + (i * 40)}
                      cy={80 + (i % 3) * 30}
                      r="2"
                      fill={state.color.includes('green') ? '#10b981' : state.color.includes('emerald') ? '#34d399' : '#2dd4bf'}
                      opacity="0.6"
                      className="animate-float-particle"
                      style={{ animationDelay: `${i * 0.3}s` }}
                    />
                  ))}
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            filter: drop-shadow(0 0 5px #00d2ff);
            opacity: 0.8;
          }
          50% { 
            filter: drop-shadow(0 0 15px #00d2ff);
            opacity: 1;
          }
        }
        
        @keyframes branch-grow {
          from { 
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
            opacity: 0;
          }
          to { 
            stroke-dasharray: 200;
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        
        @keyframes bloom {
          0% { 
            opacity: 0;
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes float-particle {
          0%, 100% { 
            transform: translateY(0px) translateX(0px);
            opacity: 0.4;
          }
          50% { 
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        
        .animate-branch-grow {
          animation: branch-grow 2s ease-out forwards;
        }
        
        .animate-bloom {
          animation: bloom 1.5s ease-out forwards;
          transform-origin: center;
        }
        
        .animate-float-particle {
          animation: float-particle 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Garden;
