import React, { useState, useRef, useEffect } from 'react';
import Countdown from './components/Countdown';
import Fireworks from './components/Fireworks';
import Wishes from './components/Wishes';
import { MAIN_AUDIO_URL, BACKUP_AUDIO_URL, TICK_SOUND_URL } from './constants';

const App: React.FC = () => {
  // Stage 0: Waiting for user interaction
  const [hasInteracted, setHasInteracted] = useState(false);
  // Stage 1: Transition starts (Fireworks + Music)
  const [isTransitionStarting, setIsTransitionStarting] = useState(false);
  // Stage 2: Animation is fully done (Countdown hidden)
  const [isZoomFinished, setIsZoomFinished] = useState(false);
  
  const [isMuted, setIsMuted] = useState(false);
  const [showManualPlay, setShowManualPlay] = useState(false);
  
  // Audio state
  const [audioSrc, setAudioSrc] = useState(MAIN_AUDIO_URL);
  const [isBackup, setIsBackup] = useState(false);

  // Audio Refs
  const tickRef = useRef<HTMLAudioElement>(null);
  const mainAudioRef = useRef<HTMLAudioElement>(null);

  // Ngăn chặn cuộn trang trên điện thoại
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
        e.preventDefault();
    };
    document.addEventListener('touchmove', preventScroll, { passive: false });
    return () => document.removeEventListener('touchmove', preventScroll);
  }, []);

  // --- Helper to get audio time for Wishes ---
  const getAudioTime = () => {
    if (mainAudioRef.current) {
      return mainAudioRef.current.currentTime;
    }
    if (isTransitionStarting) {
        return (Date.now() - transitionStartTime.current) / 1000;
    }
    return 0;
  };
  
  const transitionStartTime = useRef<number>(0);

  // Auto-play effect
  useEffect(() => {
    if (mainAudioRef.current && isTransitionStarting) {
         const playPromise = mainAudioRef.current.play();
         if (playPromise !== undefined) {
             playPromise
                .then(() => setShowManualPlay(false))
                .catch((e) => {
                    // Autoplay bị chặn, hiện nút manual play
                    setShowManualPlay(true);
                });
         }
    }
  }, [isTransitionStarting]);

  const handleStart = () => {
    setHasInteracted(true);
    
    // 1. Play Ticking Sound
    if (tickRef.current) {
        tickRef.current.volume = 0.6;
        tickRef.current.play().catch(() => {});
    }
    
    // 2. Mồi file nhạc chính (Unlock Audio Context)
    if (mainAudioRef.current) {
        mainAudioRef.current.load(); 
        const playPromise = mainAudioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                mainAudioRef.current?.pause();
                if(mainAudioRef.current) mainAudioRef.current.currentTime = 0;
            }).catch(() => {});
        }
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
    
    if (mainAudioRef.current) {
        mainAudioRef.current.volume = 1.0;
        mainAudioRef.current.currentTime = 0;
        
        const playPromise = mainAudioRef.current.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => setShowManualPlay(false))
                .catch(e => {
                    setShowManualPlay(true);
                });
        }
    } else {
        setShowManualPlay(true);
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

  const manualPlayAudio = () => {
      if (mainAudioRef.current) {
          mainAudioRef.current.play()
            .then(() => setShowManualPlay(false))
            .catch(e => alert("Không thể phát nhạc: " + e.message));
      }
  };

  // --- XỬ LÝ LỖI AUDIO ---
  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
      const error = e.currentTarget.error;
      console.log(`Lỗi tải nhạc: ${audioSrc}`, error);

      // Nếu đang dùng file chính mà lỗi -> Chuyển sang file dự phòng ngay lập tức
      if (audioSrc === MAIN_AUDIO_URL) {
          console.log("-> Đang chuyển sang link dự phòng (Backup)...");
          setAudioSrc(BACKUP_AUDIO_URL);
          setIsBackup(true);
          
          // Sau khi đổi nguồn, thử phát lại ngay nếu đang trong giai đoạn phát nhạc
          if (isTransitionStarting && mainAudioRef.current) {
              mainAudioRef.current.load();
              // Đợi load 1 chút rồi play
              setTimeout(() => {
                  mainAudioRef.current?.play().catch(console.error);
              }, 100);
          }
      }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black touch-none">
      
      {/* Audio Elements */}
      <audio ref={tickRef} src={TICK_SOUND_URL} loop preload="auto" playsInline crossOrigin="anonymous" />
      <audio 
        ref={mainAudioRef} 
        src={audioSrc} 
        preload="auto"
        playsInline
        crossOrigin="anonymous"
        onPlay={() => setShowManualPlay(false)}
        onError={handleAudioError}
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

      {/* MANUAL PLAY BUTTON (Nút cứu hộ) */}
      {showManualPlay && isTransitionStarting && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] animate-[fadeIn_0.5s_ease-out] flex flex-col items-center w-full max-w-sm px-4 space-y-4">
             <button
                onClick={manualPlayAudio}
                className="bg-green-600 hover:bg-green-500 text-white text-lg md:text-xl font-bold px-8 py-6 rounded-full animate-bounce shadow-[0_0_50px_rgba(34,197,94,0.6)] border-4 border-white flex items-center gap-3 whitespace-nowrap transform hover:scale-110 transition-transform cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
                {isBackup ? "PHÁT NHẠC (DỰ PHÒNG)" : "PHÁT NHẠC"}
            </button>
            <p className="text-white bg-black/50 px-2 py-1 rounded text-sm text-center">
                {isBackup ? "Đã chuyển sang nhạc online do không tìm thấy file của bạn." : "Chạm để phát nhạc"}
            </p>
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