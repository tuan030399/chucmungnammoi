import React, { useState, useRef, useEffect } from 'react';
import Countdown from './components/Countdown';
import Fireworks from './components/Fireworks';
import Wishes from './components/Wishes';
import { YOUTUBE_VIDEO_ID, VOICE_URL, TICK_SOUND_URL } from './constants';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const App: React.FC = () => {
  // Stage 0: Waiting for user interaction
  const [hasInteracted, setHasInteracted] = useState(false);
  // Stage 1: Transition starts
  const [isTransitionStarting, setIsTransitionStarting] = useState(false);
  // Stage 2: Animation is fully done
  const [isZoomFinished, setIsZoomFinished] = useState(false);
  
  const [isMuted, setIsMuted] = useState(false);
  const [voiceError, setVoiceError] = useState(false);
  
  // Audio Refs
  const tickRef = useRef<HTMLAudioElement>(null);
  const voiceRef = useRef<HTMLAudioElement>(null); // MP3 Player
  const bgPlayerRef = useRef<any>(null); // YouTube Player

  // --- YouTube API Initialization ---
  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      bgPlayerRef.current = new window.YT.Player('yt-bg-player', {
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
             event.target.setVolume(20); // Nhạc nền nhỏ (20%)
          }
        }
      });
    };
  }, []);

  // --- Helper to get voice time for Wishes ---
  const getVoiceTime = () => {
    if (voiceRef.current && !voiceError) {
      return voiceRef.current.currentTime;
    }
    // Fallback: Nếu lỗi audio, có thể trả về một timer giả lập hoặc 0
    // Ở đây trả về 0 để tránh lỗi logic, animation sẽ chạy theo fallback (nếu có) hoặc dừng.
    return 0;
  };

  const handleStart = () => {
    setHasInteracted(true);
    
    // 1. Play Ticking Sound
    if (tickRef.current) {
        tickRef.current.volume = 0.6;
        tickRef.current.play().catch(console.error);
    }
    
    // 2. UNLOCK AUDIO (Fix mobile issue): Play empty/brief audio to get permission
    if (voiceRef.current && !voiceError) {
        voiceRef.current.play().then(() => {
            // Immediately pause and reset so it's ready for later
            voiceRef.current?.pause();
            if(voiceRef.current) voiceRef.current.currentTime = 0;
        }).catch(err => console.warn("Audio unlock skipped or failed:", err));
    }

    // 3. Warm up YouTube player
    if (bgPlayerRef.current && bgPlayerRef.current.playVideo) {
        bgPlayerRef.current.playVideo();
        // Pause immediately just to unlock
        setTimeout(() => {
             if (!isTransitionStarting) bgPlayerRef.current.pauseVideo();
        }, 100);
    }
  };

  const handleCountFinished = () => {
     if (tickRef.current) {
         tickRef.current.pause();
         tickRef.current.currentTime = 0;
     }
  };

  const handleTimerComplete = () => {
    setIsTransitionStarting(true);
    
    // Play Background Music (YouTube)
    if (bgPlayerRef.current && bgPlayerRef.current.playVideo) {
        if (!isMuted) bgPlayerRef.current.unMute();
        else bgPlayerRef.current.mute();
        bgPlayerRef.current.playVideo();
    }

    // Play Voice/Song (MP3)
    if (voiceRef.current && !voiceError) {
        console.log("Starting voice playback...");
        voiceRef.current.volume = 1.0; // Giọng to (100%)
        voiceRef.current.currentTime = 0;
        voiceRef.current.play().catch(e => {
            console.error("Voice play failed:", e?.message || e);
            // Không alert nữa để tránh làm phiền người dùng
        });
    }
  };

  const handleZoomComplete = () => {
    setIsZoomFinished(true);
  };

  const toggleMute = () => {
    const nextMuteState = !isMuted;
    setIsMuted(nextMuteState);
    
    // Mute YouTube
    if (bgPlayerRef.current && bgPlayerRef.current.mute) {
        nextMuteState ? bgPlayerRef.current.mute() : bgPlayerRef.current.unMute();
    }
    // Mute MP3
    if (voiceRef.current) voiceRef.current.muted = nextMuteState;
    // Mute Tick
    if (tickRef.current) tickRef.current.muted = nextMuteState;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      
      {/* Hidden Youtube Player */}
      <div id="yt-bg-player" className="absolute pointer-events-none opacity-0 -z-50 top-0 left-0"></div>
      
      {/* Audio Elements */}
      <audio ref={tickRef} src={TICK_SOUND_URL} loop preload="auto" />
      <audio 
        ref={voiceRef} 
        src={VOICE_URL} 
        preload="auto"
        onError={() => {
            console.warn("Audio Warning: Could not load voice file. Check constants.ts or file path.");
            setVoiceError(true);
        }} 
      />

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

      {/* Controls */}
      {hasInteracted && (
        <div className="absolute top-4 right-4 z-50 flex gap-2">
            <button 
                onClick={toggleMute}
                className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
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
        </div>
      )}

      {/* Layer 0: Celebration */}
      <div className={`absolute inset-0 z-0 flex flex-col items-center justify-center transition-all duration-[1500ms] ease-in-out ${isTransitionStarting ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=2669&auto=format&fit=crop" 
                    alt="Celebration Background" 
                    className="w-full h-full object-cover animate-[pulse_8s_ease-in-out_infinite]"
                />
                <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-red-900/80 via-transparent to-black/60"></div>
            </div>
            
            {isTransitionStarting && <Fireworks />}
            
            <div className="absolute inset-0 flex flex-col items-center pt-10 md:pt-20 p-4 z-10 overflow-y-auto md:overflow-hidden">
              <div className="mb-4 md:mb-8 relative animate-[bounce_3s_infinite_1s] shrink-0">
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-red-500 to-yellow-300 drop-shadow-[0_0_50px_rgba(234,179,8,1)] text-center tracking-tighter filter hue-rotate-15 leading-tight">
                  CHÚC MỪNG <br className="md:hidden" /> NĂM MỚI
                </h1>
                
                <div className="absolute -top-6 -right-4 md:-right-12 bg-yellow-500 text-red-900 font-bold px-4 py-2 rounded-full text-xl md:text-3xl rotate-12 shadow-[0_0_20px_rgba(234,179,8,1)] animate-pulse border-4 border-red-600">
                  {new Date().getFullYear() + 1}
                </div>
              </div>

              <div className="animate-[fadeIn_1s_ease-in_0.5s_forwards] w-full flex justify-center">
                  <Wishes isActive={isTransitionStarting} getCurrentTime={getVoiceTime} />
              </div>
            </div>
      </div>

      {/* Layer 1: Countdown */}
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