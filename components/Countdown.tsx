import React, { useEffect, useState } from 'react';
import FallingEffects from './FallingEffects';

interface CountdownProps {
  onTimerComplete: () => void; // Called when transition STARTS (Music + Fireworks)
  onZoomComplete: () => void;  // Called when transition ENDS (Unmount)
  onCountFinished: () => void; // Called when counter hits 00 (Stop Ticking)
}

const Countdown: React.FC<CountdownProps> = ({ onTimerComplete, onZoomComplete, onCountFinished }) => {
  // Start at 55. Display 55 -> ... -> 59 -> 00
  const [seconds, setSeconds] = useState(55);
  
  // Controls the CSS Transition class
  const [isExiting, setIsExiting] = useState(false);

  const prefix = "202";
  const suffixCurrent = "5";
  const suffixNext = "6";

  // 1. Timer Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev < 60) {
          return prev + 1;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 2. Transition Logic (The Director)
  useEffect(() => {
    if (seconds === 60) {
      // Step A: Immediately stop the ticking sound
      onCountFinished();

      // Step B: Wait exactly 1 second while showing "2026"
      const startTransitionTimeout = setTimeout(() => {
        
        // 1. Start the Visual Transition (CSS class)
        setIsExiting(true);
        
        // 2. Fire the signals (Music, Fireworks start NOW)
        onTimerComplete();

        // 3. Wait for the visual transition to finish (1.5s), then unmount
        const cleanupTimeout = setTimeout(() => {
          onZoomComplete();
        }, 1500); // Matches CSS duration

        return () => clearTimeout(cleanupTimeout);

      }, 1000); // 1s delay before moving

      return () => clearTimeout(startTransitionTimeout);
    }
  }, [seconds, onCountFinished, onTimerComplete, onZoomComplete]);

  // Display Logic
  const displaySeconds = seconds === 60 ? "00" : seconds.toString();
  
  // Tick pop effect
  const [prevSec, setPrevSec] = useState(seconds);
  const [pop, setPop] = useState(false);
  if (seconds !== prevSec) {
      setPrevSec(seconds);
      setPop(true);
      setTimeout(() => setPop(false), 200);
  }

  return (
    // CONTAINER: Handles the Zoom & Fade Effect
    // - opacity-0: Fades out
    // - scale-[2]: Zooms in towards the user
    // - blur-sm: Motion blur effect
    <div 
        className={`w-full h-full relative flex flex-col items-center justify-center overflow-hidden transition-all duration-[1500ms] ease-in-out origin-center ${
            isExiting ? 'opacity-0 scale-[2] blur-sm pointer-events-none' : 'opacity-100 scale-100'
        }`}
    >
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img 
            src="https://images.unsplash.com/photo-1514416432279-50fac261ea7f?q=80&w=2592&auto=format&fit=crop" 
            alt="Tet Background Lanterns" 
            className="w-full h-full object-cover brightness-75"
        />
        {/* Falling Lanterns & Flowers */}
        <FallingEffects />
        
        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/90 via-transparent to-red-950/90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
      </div>

      {/* CONTENT */}
      <div className="z-10 flex flex-col items-center gap-6 md:gap-10">
        
        {/* Label */}
        <div className="text-yellow-400 text-sm md:text-xl font-bold tracking-[0.5em] mb-4 uppercase font-sans border-b border-yellow-500/50 pb-4 drop-shadow-md">
          Thời khắc giao thừa
        </div>

        {/* Date Row */}
        <div className="flex items-center justify-center gap-2 md:gap-6 bg-black/60 p-6 md:p-8 rounded-[2rem] backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col items-center">
                <span className="text-3xl md:text-6xl font-bold text-gray-200 tabular-nums font-mono">31</span>
                <span className="text-[10px] md:text-sm text-yellow-500/70 uppercase tracking-wider mt-1">Tháng 12</span>
            </div>
            <span className="text-2xl md:text-5xl text-gray-500 font-light opacity-50">|</span>
            {/* Year with Roll */}
            <div className="flex flex-col items-center relative">
                <div className="flex items-baseline relative text-3xl md:text-6xl font-bold text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                    <span>{prefix}</span>
                    <div className="relative h-[1.1em] overflow-hidden ml-1">
                        <div className={`flex flex-col transition-transform duration-[1000ms] cubic-bezier(0.34, 1.56, 0.64, 1) ${seconds === 60 ? '-translate-y-1/2' : 'translate-y-0'}`}>
                            <span className="h-[1.1em] flex items-center justify-center tabular-nums">{suffixCurrent}</span>
                            <span className="h-[1.1em] flex items-center justify-center text-yellow-200 tabular-nums">{suffixNext}</span>
                        </div>
                    </div>
                </div>
                <span className="text-[10px] md:text-sm text-yellow-500/70 uppercase tracking-wider mt-1">Năm Mới</span>
            </div>
        </div>

        {/* Timer Row */}
        <div className="flex items-center justify-center gap-2 md:gap-6 bg-red-950/50 p-8 md:p-12 rounded-[3rem] backdrop-blur-xl border border-red-500/20 shadow-[0_0_60px_rgba(255,0,0,0.2)]">
             {/* Hour */}
             <div className="flex flex-col items-center min-w-[60px] md:min-w-[120px]">
                <span className={`text-5xl md:text-8xl font-black text-white tabular-nums ${seconds === 60 ? 'text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.8)]' : ''}`}>
                    {seconds === 60 ? '00' : '23'}
                </span>
                <span className="text-[10px] md:text-sm text-red-200 uppercase tracking-widest mt-2 opacity-70">Giờ</span>
            </div>
            <span className="text-4xl md:text-7xl text-red-500/50 font-thin pb-6">:</span>
            {/* Minute */}
            <div className="flex flex-col items-center min-w-[60px] md:min-w-[120px]">
                <span className={`text-5xl md:text-8xl font-black text-white tabular-nums ${seconds === 60 ? 'text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.8)]' : ''}`}>
                    {seconds === 60 ? '00' : '59'}
                </span>
                <span className="text-[10px] md:text-sm text-red-200 uppercase tracking-widest mt-2 opacity-70">Phút</span>
            </div>
            <span className="text-4xl md:text-7xl text-red-500/50 font-thin pb-6">:</span>
            {/* Second */}
            <div className="flex flex-col items-center min-w-[70px] md:min-w-[140px]">
                <span className={`text-6xl md:text-9xl font-black tabular-nums transition-transform duration-200 
                    ${pop ? 'scale-110' : 'scale-100'} 
                    ${seconds === 60 ? 'text-white' : 'text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]'}
                `}>
                    {displaySeconds}
                </span>
                <span className="text-[10px] md:text-sm text-red-400 uppercase tracking-widest mt-2 font-bold">Giây</span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Countdown;