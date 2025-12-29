import React, { useMemo } from 'react';

interface GardenProps {
  growthLevel: number; // 0 - 100
}

const Garden: React.FC<GardenProps> = ({ growthLevel }) => {
  // Generate random positions for plants once
  const plants = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80, // 10% to 90% width
      delay: Math.random() * 2,
      variant: Math.floor(Math.random() * 3) // 3 plant types
    }));
  }, []);

  // Helper to determine plant state based on global growth level
  // We stagger the growth so plants bloom one by one as level increases
  const getPlantState = (index: number, currentLevel: number) => {
    const threshold = (index / 12) * 100;
    if (currentLevel < threshold) return 'seed';
    if (currentLevel < threshold + 15) return 'sprout';
    return 'bloom';
  };

  return (
    <div className="relative w-full h-80 rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-2xl shadow-indigo-500/5 group">
      
      {/* Background Grid & Glows */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-emerald-500/10 blur-[80px]" />
      <div className="absolute top-10 right-10 w-32 h-32 bg-purple-500/10 blur-[60px]" />

      {/* Title */}
      <div className="absolute top-6 left-6 z-10">
        <h2 className="text-lg font-medium text-slate-300 flex items-center gap-2">
          Your Professional Ecosystem
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {growthLevel}% Mature
          </span>
        </h2>
      </div>

      {/* SVG Container */}
      <svg className="absolute bottom-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 100 50" preserveAspectRatio="none">
        <defs>
          <linearGradient id="stemGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#34d399" /> {/* emerald-400 */}
            <stop offset="100%" stopColor="#059669" /> {/* emerald-600 */}
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {plants.map((plant) => {
          const state = getPlantState(plant.id, growthLevel);
          const isBlooming = state === 'bloom';
          const isSprouting = state === 'sprout' || isBlooming;
          
          // Plant Paths
          const stemHeight = isBlooming ? 30 : (isSprouting ? 10 : 0);
          const stemPath = `M ${plant.x} 50 Q ${plant.x + 2} ${40 - stemHeight/2} ${plant.x} ${50 - stemHeight}`;

          return (
            <g key={plant.id} className="transition-all duration-1000 ease-out" style={{ transitionDelay: `${plant.delay * 0.1}s` }}>
              
              {/* Soil Glow */}
              <circle cx={plant.x} cy="50" r={isSprouting ? 3 : 0} fill="#10b981" opacity="0.3" filter="url(#glow)" />

              {/* Stem */}
              <path 
                d={stemPath} 
                stroke="url(#stemGradient)" 
                strokeWidth="0.5" 
                fill="none" 
                className="transition-all duration-1000 ease-in-out"
                style={{
                    opacity: isSprouting ? 1 : 0,
                    strokeDasharray: 50,
                    strokeDashoffset: isSprouting ? 0 : 50
                }}
              />

              {/* Bloom/Leaves */}
              <g 
                transform={`translate(${plant.x}, ${50 - stemHeight}) scale(${isBlooming ? 1 : 0})`} 
                className="transition-transform duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)"
              >
                 {plant.variant === 0 && (
                   // Digital Flower 1
                   <g filter="url(#glow)">
                     <circle r="2" fill="#a78bfa" className="animate-pulse" />
                     <path d="M0,0 C-3,-5 -3,-10 0,-12 C3,-10 3,-5 0,0" fill="#8b5cf6" opacity="0.8" />
                     <path d="M0,0 C-5,-2 -10,-2 -12,0 C-10,2 -5,2 0,0" fill="#a78bfa" opacity="0.6" />
                     <path d="M0,0 C5,-2 10,-2 12,0 C10,2 5,2 0,0" fill="#a78bfa" opacity="0.6" />
                   </g>
                 )}
                 {plant.variant === 1 && (
                   // Cyber Fern
                   <g filter="url(#glow)">
                      <path d="M0,0 L-3,-8 L0,-12 L3,-8 Z" fill="#34d399" />
                      <circle cx="0" cy="-14" r="1.5" fill="#f472b6" className="animate-pulse" />
                   </g>
                 )}
                 {plant.variant === 2 && (
                    // Tech Orb Plant
                    <g filter="url(#glow)">
                      <circle r="1" fill="#fff" />
                      <circle r="4" stroke="#c084fc" strokeWidth="0.5" fill="none" className="animate-[spin_4s_linear_infinite]" />
                      <path d="M0,0 L-4,-4 M0,0 L4,-4" stroke="#34d399" strokeWidth="0.5" />
                    </g>
                 )}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default Garden;
