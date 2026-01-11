import React, { useState, useRef, useEffect } from 'react';
import Countdown from './components/Countdown';
import Fireworks from './components/Fireworks';
import Wishes from './components/Wishes';
import { LOCAL_AUDIO_URL, TICK_SOUND_URL } from './constants';

const App: React.FC = () => {
  // Stage 0: Waiting for user interaction
  const [hasInteracted, setHasInteracted] = useState(false);
  // Stage 1: Transition starts (Fireworks + Music)
  const [isTransitionStarting, setIsTransitionStarting] = useState(false);
  // Stage 2: Animation is fully done (Countdown hidden)
  const [isZoomFinished, setIsZoomFinished] = useState(false);
  
  const [isMuted, setIsMuted] = useState(false);
  
  // Audio Refs
  const tickRef = useRef<HTMLAudioElement>(null);
  const mainAudioRef = useRef<HTMLAudioElement>(null);
  const transitionStartTime = useRef<number>(0);

  // Ngăn chặn cuộn trang trên điện thoại
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
        e.preventDefault();
    };
    document.addEventListener('touchmove', preventScroll, { passive: false });
    return () => document.removeEventListener('touchmove', preventScroll);
  }, []);

  // Helper lấy thời gian nhạc
  const getAudioTime = () => {
    if (mainAudioRef.current) {
      return mainAudioRef.current.currentTime;
    }
    if (isTransitionStarting) {
        return (Date.now() - transitionStartTime.current) / 1000;
    }
    return 0;
  };

  const handleStart = () => {
    setHasInteracted(true);
    
    // --- QUAN TRỌNG: MỞ KHÓA AUDIO CHO TRÌNH DUYỆT ĐIỆN THOẠI ---
    // Ngay khoảnh khắc người dùng chạm vào nút "Mở Quà", ta phải gọi lệnh .play()
    
    // 1. Mở khóa tiếng tích tắc
    if (tickRef.current) {
        tickRef.current.volume = 0.6;
        tickRef.current.play().catch(() => {});
    }
    
    // 2. Mở khóa nhạc chính (Phát rồi Pause ngay lập tức)
    // Điều này đánh lừa trình duyệt rằng "người dùng đã cho phép phát nhạc này"
    if (mainAudioRef.current) {
        mainAudioRef.current.volume = 0; // Tắt tiếng tạm thời
        mainAudioRef.current.play().then(() => {
            mainAudioRef.current?.pause();
            if(mainAudioRef.current) {
                mainAudioRef.current.currentTime = 0;
                mainAudioRef.current.volume = 1; // Trả lại volume to
            }
        }).catch((e) => {
            // Nếu vào đây trên Preview -> Là do chưa có file nhạc.
            // Nếu vào đây trên Web thật -> Là lỗi trình duyệt chặn (ít khi xảy ra nếu đã click)
            console.log("Pre-load status:", e.message);
        });
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
    transitionStartTime.current = Date.now();
    
    // LÚC NÀY NHẠC CHÍNH SẼ TỰ PHÁT
    if (mainAudioRef.current) {
        mainAudioRef.current.volume = 1.0;
        mainAudioRef.current.currentTime = 0;
        const playPromise = mainAudioRef.current.play();
        if (playPromise !== undefined) {
             playPromise.catch(e => console.log("Auto-play blocked or file missing:", e));
        }
    }
  };

  const handleZoomComplete = () => {
    setIsZoomFinished(true);
  };

  const toggleMute = () => {
    const nextMuteState = !isMuted;
    setIsMuted(nextMuteState);
    if (mainAudioRef.current) mainAudioRef.current.muted = nextMuteState;
    if (tickRef.current) tickRef.current.muted = nextMuteState;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black touch-none">
      
      {/* 
         AUDIO TAGS
         - Không dùng crossOrigin cho file nội bộ (quan trọng).
         - type="audio/mpeg" giúp trình duyệt nhận diện file nhanh hơn.
      */}
      <audio 
        ref={tickRef} 
        src={TICK_SOUND_URL} 
        loop 
        preload="auto" 
        playsInline 
        crossOrigin="anonymous" 
      />
      
      <audio 
        ref={mainAudioRef} 
        src={LOCAL_AUDIO_URL} 
        preload="auto"
        playsInline
      />

      {/* --- START OVERLAY --- */}
      {!hasInteracted && (
        <div className="absolute inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 transition-opacity duration-500">
            <div className="text-center space-y-8 animate-pulse">
                <div className="relative">
                    <div className="text-6xl md:text-8xl mb-4">🎆</div>
                    <div className="absolute -inset-4 bg-red-500/20 blur-xl rounded-full animate-pulse"></div>
                </div>
                
                <h1 className="text-2xl md:text-5xl text-yellow-400 font-bold uppercase tracking-widest font-sans drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                    Sẵn sàng đón năm mới
                </h1>
                
                <button 
                    onClick={handleStart}
                    className="group relative px-8 py-4 md:px-12 md:py-6 bg-transparent overflow-hidden rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-600 to-yellow-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute inset-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                    <span className="relative text-white font-bold text-xl md:text-2xl uppercase tracking-wider flex items-center gap-3">
                        <span>Mở Quà</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 animate-bounce">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clipRule="evenodd" />
                        </svg>
                    </span>
                </button>
            </div>
        </div>
      )}

      {/* Mute Button */}
      {hasInteracted && (
        <div className="absolute top-4 right-4 z-50 flex gap-2 animate-[fadeIn_0.5s_ease-out]">
            <button onClick={toggleMute} className="p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-white/10">
                {isMuted ? "🔇" : "🔊"}
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
                  <Wishes isActive={isTransitionStarting} getCurrentTime={getAudioTime} />
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