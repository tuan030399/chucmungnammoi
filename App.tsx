import React, { useState, useRef, useEffect } from 'react';
import Countdown from './components/Countdown';
import Fireworks from './components/Fireworks';
import Wishes from './components/Wishes';
import { MUSIC_URL, TICK_SOUND_URL } from './constants';

const App: React.FC = () => {
  // Stage 1: Transition starts (Music + Fireworks begin)
  const [isTransitionStarting, setIsTransitionStarting] = useState(false);
  // Stage 2: Animation is fully done, Countdown component is unmounted
  const [isZoomFinished, setIsZoomFinished] = useState(false);
  
  const [isMuted, setIsMuted] = useState(false);
  
  const musicRef = useRef<HTMLAudioElement>(null);
  const tickRef = useRef<HTMLAudioElement>(null);

  // 1. Called when Countdown reaches "00" (Stop Ticking)
  const handleCountFinished = () => {
     if (tickRef.current) {
         tickRef.current.pause();
         tickRef.current.currentTime = 0;
     }
  };

  // 2. Called when 1s hold is over and Transition STARTS
  const handleTimerComplete = () => {
    setIsTransitionStarting(true);
    
    // Play Celebration Music
    if (musicRef.current && !isMuted) {
        musicRef.current.volume = 0.8;
        musicRef.current.play().catch(e => console.log("Music blocked:", e));
    }
  };

  // 3. Called when Transition ENDS (1.5s later)
  const handleZoomComplete = () => {
    setIsZoomFinished(true);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    
    // Toggle Music
    if (musicRef.current) {
        musicRef.current.muted = !musicRef.current.muted;
        if (!musicRef.current.muted && isTransitionStarting && musicRef.current.paused) {
             musicRef.current.play().catch(() => {});
        }
    }

    // Toggle Tick
    if (tickRef.current) {
        tickRef.current.muted = !tickRef.current.muted;
        if (!tickRef.current.muted && !isTransitionStarting && tickRef.current.paused) {
             tickRef.current.play().catch(() => {});
        }
    }
  };

  useEffect(() => {
    if (tickRef.current) {
        tickRef.current.volume = 0.6;
        const playPromise = tickRef.current.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                setIsMuted(true);
                if (tickRef.current) tickRef.current.muted = true;
                if (musicRef.current) musicRef.current.muted = true;
            });
        }
    }
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      
      <audio ref={musicRef} src={MUSIC_URL} loop />
      <audio ref={tickRef} src={TICK_SOUND_URL} loop />

      {/* Mute Button */}
      <button 
        onClick={toggleMute}
        className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
      >
        {isMuted ? (
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 21 12m0 0-3.75 2.25M21 12H3m3.375-3.375-1.5-1.5m6.75 9.75-1.5 1.5" />
             <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75c0-1.33.72-2.5 1.809-3.125A12 12 0 0 0 12 6C9.274 6 6.758 6.94 4.8 8.527" />
             <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
           </svg>
        ) : (
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 animate-pulse">
             <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
           </svg>
        )}
      </button>

      {/* 
          LAYER 0: CELEBRATION CONTENT 
          Always rendered at the bottom.
          Animation: Scales UP slightly (0.9 -> 1.0) and Fades IN as Countdown fades out.
      */}
      <div className={`absolute inset-0 z-0 flex flex-col items-center justify-center transition-all duration-[1500ms] ease-in-out ${isTransitionStarting ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            {/* Celebration Background Image */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=2669&auto=format&fit=crop" 
                    alt="Celebration Background" 
                    className="w-full h-full object-cover animate-[pulse_8s_ease-in-out_infinite]"
                />
                <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-red-900/80 via-transparent to-black/60"></div>
            </div>
            
            {/* Fireworks start exactly when transition starts */}
            {isTransitionStarting && <Fireworks />}
            
            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10">
              <div className="mb-6 relative animate-[bounce_3s_infinite_1s]">
                <h1 className="text-5xl md:text-7xl lg:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-red-500 to-yellow-300 drop-shadow-[0_0_35px_rgba(234,179,8,0.8)] text-center tracking-tighter filter hue-rotate-15">
                  CHÚC MỪNG <br className="md:hidden" /> NĂM MỚI
                </h1>
                
                <div className="absolute -top-4 -right-4 md:-right-10 bg-yellow-500 text-red-900 font-bold px-4 py-2 rounded-full text-xl md:text-2xl rotate-12 shadow-[0_0_20px_rgba(234,179,8,1)] animate-pulse border-2 border-red-600">
                  {new Date().getFullYear() + 1}
                </div>
              </div>

              <div className="animate-[fadeIn_2s_ease-in_0.5s_forwards]">
                  <Wishes />
              </div>
            </div>
      </div>

      {/* 
          LAYER 1: COUNTDOWN
          Sits on top. Handles its own fade-out internally via props from handleTimerComplete logic inside Countdown.
          We remove it from DOM only after animation finishes to save resources.
      */}
      {!isZoomFinished && (
        <div className="absolute inset-0 z-20">
            <Countdown 
                onTimerComplete={handleTimerComplete} 
                onZoomComplete={handleZoomComplete} 
                onCountFinished={handleCountFinished}
            />
        </div>
      )}

    </div>
  );
};

export default App;