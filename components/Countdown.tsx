import React, { useEffect, useState } from 'react';
import FallingEffects from './FallingEffects';

interface CountdownProps {
  onTimerComplete: () => void;
  onZoomComplete: () => void;
  onCountFinished: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ onTimerComplete, onZoomComplete, onCountFinished }) => {
  const [seconds, setSeconds] = useState(55);
  const [isExiting, setIsExiting] = useState(false);
  const [pop, setPop] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const prefix = "202";
  const suffixCurrent = "5";
  const suffixNext = "6";

  // 1. Timer Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev < 60) return prev + 1;
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Pop Effect Logic
  useEffect(() => {
    setPop(true);
    const timeout = setTimeout(() => setPop(false), 200);
    return () => clearTimeout(timeout);
  }, [seconds]);

  // 3. Transition Logic
  useEffect(() => {
    if (seconds === 60) {
      onCountFinished();
      const startTransitionTimeout = setTimeout(() => {
        setIsExiting(true);
        onTimerComplete();
        const cleanupTimeout = setTimeout(() => {
          onZoomComplete();
        }, 1500);
        return () => clearTimeout(cleanupTimeout);
      }, 1000);
      return () => clearTimeout(startTransitionTimeout);
    }
  }, [seconds, onCountFinished, onTimerComplete, onZoomComplete]);

  const displaySeconds = seconds === 60 ? "00" : seconds.toString();

  return (
    // CONTAINER with explicit inline styles as failsafe
    <div 
        className={`w-full h-full relative flex flex-col items-center justify-center overflow-hidden transition-all duration-[1500ms] ease-in-out origin-center bg-gradient-to-b from-red-800 via-red-950 to-black ${
            isExiting ? 'opacity-0 scale-[2] blur-sm pointer-events-none' : 'opacity-100 scale-100'
        }`}
        style={{ color: 'white' }}
    >
      
      {/* BACKGROUND IMAGE - Only show when loaded to prevent ugly cutouts */}
      <div className="absolute inset-0 z-0 bg-red-900/20">
        <img 
            src="https://images.unsplash.com/photo-1514416432279-50fac261ea7f?q=80&w=2592&auto=format&fit=crop" 
            alt="Tet Background" 
            className={`w-full h-full object-cover transition-opacity duration-1000 ${isImageLoaded ? 'opacity-60' : 'opacity-0'}`}
            onLoad={() => setIsImageLoaded(true)}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        {/* Dark Overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
      </div>

      {/* FALLING EFFECTS */}
      <div className="absolute inset-0 z-10 pointer-events-none">
          <FallingEffects />
      </div>

      {/* MAIN CONTENT */}
      <div className="z-20 flex flex-col items-center gap-4 md:gap-10 relative px-4 w-full max-w-4xl mx-auto">
        
        {/* Label */}
        <div className="text-yellow-400 text-sm md:text-xl font-bold tracking-[0.3em] md:tracking-[0.5em] mb-2 uppercase font-sans border-b border-yellow-500/50 pb-4 text-center">
          Thời khắc giao thừa
        </div>

        {/* Date Row */}
        <div className="w-full flex items-center justify-center gap-2 md:gap-6 bg-white/10 p-4 md:p-8 rounded-[2rem] backdrop-blur-md border border-white/10 shadow-lg">
            <div className="flex flex-col items-center">
                <span className="text-2xl md:text-5xl font-bold text-gray-100 font-mono">31</span>
                <span className="text-[10px] md:text-sm text-yellow-500/80 uppercase tracking-wider mt-1">Tháng 12</span>
            </div>
            <span className="text-2xl md:text-4xl text-gray-500 font-light opacity-50 px-2">|</span>
            {/* Year with Roll */}
            <div className="flex flex-col items-center">
                <div className="flex items-baseline relative text-2xl md:text-5xl font-bold text-yellow-400">
                    <span>{prefix}</span>
                    <div className="relative h-[1.1em] overflow-hidden ml-1">
                        <div className={`flex flex-col transition-transform duration-[1000ms] cubic-bezier(0.34, 1.56, 0.64, 1) ${seconds === 60 ? '-translate-y-1/2' : 'translate-y-0'}`}>
                            <span className="h-[1.1em] flex items-center justify-center tabular-nums">{suffixCurrent}</span>
                            <span className="h-[1.1em] flex items-center justify-center text-yellow-200 tabular-nums">{suffixNext}</span>
                        </div>
                    </div>
                </div>
                <span className="text-[10px] md:text-sm text-yellow-500/80 uppercase tracking-wider mt-1">Năm Mới</span>
            </div>
        </div>

        {/* Timer Row */}
        <div className="w-full flex items-center justify-center gap-1 md:gap-4 bg-red-950/60 p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] backdrop-blur-xl border border-red-500/20 shadow-2xl">
             {/* Hour */}
             <div className="flex flex-col items-center w-16 md:w-32">
                <span className={`text-4xl md:text-7xl font-black text-white tabular-nums ${seconds === 60 ? 'text-green-400' : ''}`}>
                    {seconds === 60 ? '00' : '23'}
                </span>
                <span className="text-[9px] md:text-xs text-red-200 uppercase tracking-widest mt-1 opacity-70">Giờ</span>
            </div>
            <span className="text-2xl md:text-6xl text-red-500/50 font-thin -mt-4">:</span>
            {/* Minute */}
            <div className="flex flex-col items-center w-16 md:w-32">
                <span className={`text-4xl md:text-7xl font-black text-white tabular-nums ${seconds === 60 ? 'text-green-400' : ''}`}>
                    {seconds === 60 ? '00' : '59'}
                </span>
                <span className="text-[9px] md:text-xs text-red-200 uppercase tracking-widest mt-1 opacity-70">Phút</span>
            </div>
            <span className="text-2xl md:text-6xl text-red-500/50 font-thin -mt-4">:</span>
            {/* Second */}
            <div className="flex flex-col items-center w-20 md:w-40">
                <span className={`text-5xl md:text-8xl font-black tabular-nums transition-transform duration-200 
                    ${pop ? 'scale-110' : 'scale-100'} 
                    ${seconds === 60 ? 'text-white' : 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]'}
                `}>
                    {displaySeconds}
                </span>
                <span className="text-[9px] md:text-xs text-red-400 uppercase tracking-widest mt-1 font-bold">Giây</span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Countdown;