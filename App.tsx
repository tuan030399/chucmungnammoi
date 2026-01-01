import React, { useState, useRef, useEffect } from 'react';
import Countdown from './components/Countdown';
import Fireworks from './components/Fireworks';
import Wishes from './components/Wishes';
import { YOUTUBE_VIDEO_ID, TICK_SOUND_URL } from './constants';

// Type definition for window.YT
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const App: React.FC = () => {
  // Stage 0: Waiting for user interaction (Browser Autoplay Policy)
  const [hasInteracted, setHasInteracted] = useState(false);
  // Stage 1: Transition starts (Music + Fireworks begin)
  const [isTransitionStarting, setIsTransitionStarting] = useState(false);
  // Stage 2: Animation is fully done, Countdown component is unmounted
  const [isZoomFinished, setIsZoomFinished] = useState(false);
  
  const [isMuted, setIsMuted] = useState(false);
  
  // Audio Refs
  const tickRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<any>(null); // YouTube Player Reference

  // --- YouTube API Initialization ---
  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          'playsinline': 1,
          'controls': 0,
          'loop': 1,
          'playlist': YOUTUBE_VIDEO_ID
        },
        events: {
          'onReady': (event: any) => {
             event.target.setVolume(100);
          }
        }
      });
    };
  }, []);

  // --- Interaction Handler (Fixes Autoplay) ---
  const handleStart = () => {
    setHasInteracted(true);
    if (tickRef.current) {
        tickRef.current.volume = 0.6;
        tickRef.current.play().catch(e => console.error("Tick play failed", e));
    }
    
    // Warm up player
    if (playerRef.current && playerRef.current.playVideo) {
        playerRef.current.playVideo();
        setTimeout(() => {
            if (!isTransitionStarting) {
                playerRef.current.pauseVideo();
            }
        }, 100); 
    }
  };

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
    
    // Play Celebration Music (YouTube)
    if (playerRef.current && playerRef.current.playVideo) {
        if (!isMuted) {
            playerRef.current.unMute();
        } else {
            playerRef.current.mute();
        }
        
        // IMPORTANT: Lower background music volume so Voiceover is clear
        if (typeof playerRef.current.setVolume === 'function') {
            playerRef.current.setVolume(20); // 20% Volume for background
        }
        
        playerRef.current.playVideo();
    }
  };

  // 3. Called when Transition ENDS (1.5s later)
  const handleZoomComplete = () => {
    setIsZoomFinished(true);
  };

  const toggleMute = () => {
    const nextMuteState = !isMuted;
    setIsMuted(nextMuteState);
    
    // Toggle YouTube Music
    if (playerRef.current && playerRef.current.mute) {
        if (nextMuteState) {
            playerRef.current.mute();
        } else {
            playerRef.current.unMute();
        }
    }

    // Toggle Tick
    if (tickRef.current) {
        tickRef.current.muted = nextMuteState;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      
      {/* Hidden YouTube Player */}
      <div id="youtube-player" className="absolute pointer-events-none opacity-0 -z-50"></div>
      
      {/* Ticking Sound */}
      <audio ref={tickRef} src={TICK_SOUND_URL} loop />

      {/* --- START OVERLAY --- */}
      {!hasInteracted && (
        <div className="absolute inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4 transition-opacity duration-500">
            <div className="text-center space-y-6 animate-pulse">
                <div className="text-6xl md:text-8xl">🎆</div>
                <h1 className="text-2xl md:text-4xl text-yellow-400 font-bold uppercase tracking-widest font-sans">
                    Sẵn sàng đón năm mới
                </h1>
                <button 
                    onClick={handleStart}
                    className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-xl shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all transform hover:scale-105 active:scale-95"
                >
                    Chạm để bắt đầu
                </button>
                <p className="text-gray-400 text-sm font-light italic">Bật âm thanh để có trải nghiệm tốt nhất</p>
            </div>
        </div>
      )}

      {/* Mute Button */}
      {hasInteracted && (
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
      )}

      {/* 
          LAYER 0: CELEBRATION CONTENT 
          Always rendered at the bottom.
      */}
      <div className={`absolute inset-0 z-0 flex flex-col items-center justify-center transition-all duration-[1500ms] ease-in-out ${isTransitionStarting ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            {/* Celebration Background */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=2669&auto=format&fit=crop" 
                    alt="Celebration Background" 
                    className="w-full h-full object-cover animate-[pulse_8s_ease-in-out_infinite]"
                />
                <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-red-900/80 via-transparent to-black/60"></div>
            </div>
            
            {/* Fireworks */}
            {isTransitionStarting && <Fireworks />}
            
            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col items-center pt-10 md:pt-20 p-4 z-10 overflow-y-auto md:overflow-hidden">
              <div className="mb-4 md:mb-8 relative animate-[bounce_3s_infinite_1s] shrink-0">
                {/* BIGGER AND HIGHER TITLE */}
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-red-500 to-yellow-300 drop-shadow-[0_0_50px_rgba(234,179,8,1)] text-center tracking-tighter filter hue-rotate-15 leading-tight">
                  CHÚC MỪNG <br className="md:hidden" /> NĂM MỚI
                </h1>
                
                <div className="absolute -top-6 -right-4 md:-right-12 bg-yellow-500 text-red-900 font-bold px-4 py-2 rounded-full text-xl md:text-3xl rotate-12 shadow-[0_0_20px_rgba(234,179,8,1)] animate-pulse border-4 border-red-600">
                  {new Date().getFullYear() + 1}
                </div>
              </div>

              {/* Wishes Component now handles Voice and Text Sync */}
              <div className="animate-[fadeIn_1s_ease-in_0.5s_forwards] w-full flex justify-center">
                  <Wishes isActive={isTransitionStarting} />
              </div>
            </div>
      </div>

      {/* LAYER 1: COUNTDOWN */}
      {!isZoomFinished && hasInteracted && (
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