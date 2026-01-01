import React, { useState, useEffect, useRef } from 'react';
import { SYNCED_WISHES } from '../constants';

interface WishesProps {
  isActive: boolean;
  voiceRef: React.RefObject<HTMLAudioElement | null>;
}

const Wishes: React.FC<WishesProps> = ({ isActive, voiceRef }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const animationFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const isFallbackMode = useRef<boolean>(false);

  // Function to determine which line should be active
  const checkTime = (currentTime: number) => {
    let currentLine = -1;
    for (let i = 0; i < SYNCED_WISHES.length; i++) {
      // Add a small buffer (0.1s) to make sure the first line shows immediately
      if (currentTime >= SYNCED_WISHES[i].startTime - 0.1) {
        currentLine = i;
      } else {
        break;
      }
    }
    setActiveIndex((prev) => (currentLine !== prev ? currentLine : prev));
  };

  // Loop for smooth updates
  const updateLoop = () => {
    if (isFallbackMode.current) {
      // Fallback: Use system time if audio failed
      const now = Date.now() / 1000;
      const elapsed = now - startTimeRef.current;
      checkTime(elapsed);
    } else if (voiceRef.current && !voiceRef.current.paused) {
      // Normal: Use audio time from parent ref
      checkTime(voiceRef.current.currentTime);
    } else if (isActive && (!voiceRef.current || voiceRef.current.paused)) {
       // Audio exists but isn't playing yet, or finished. 
       // If it should be active but audio isn't moving, we might need fallback 
       // BUT we wait a bit or check if it ended.
       if (voiceRef.current && voiceRef.current.ended) {
           // Do nothing, keep last state
       }
    }
    
    animationFrameRef.current = requestAnimationFrame(updateLoop);
  };

  useEffect(() => {
    if (isActive) {
      // Start the loop
      cancelAnimationFrame(animationFrameRef.current);
      updateLoop();
      
      // We don't play audio here anymore. App.tsx plays it.
      // We just monitor it.
      
      // Fallback safety: If after 1 second, audio hasn't started (currentTime is still 0 or paused), enable fallback
      const safetyTimeout = setTimeout(() => {
          if (voiceRef.current && (voiceRef.current.paused || voiceRef.current.currentTime === 0)) {
              console.log("Audio didn't start in time. Using fallback timer for text.");
              isFallbackMode.current = true;
              startTimeRef.current = Date.now() / 1000;
          }
      }, 1500); // Wait 1.5s for audio to possibly load/start
      
      return () => clearTimeout(safetyTimeout);
    }

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isActive, voiceRef]);

  return (
    <div className="z-20 w-full max-w-5xl px-4 text-center mt-2 relative">
      <div className="flex flex-col gap-4 md:gap-6 items-center justify-center min-h-[300px]">
        {SYNCED_WISHES.map((item, index) => {
          const isVisible = index <= activeIndex;
          const isCurrent = index === activeIndex;

          return (
            <div 
              key={index}
              className={`transition-all duration-700 ease-out transform ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <p 
                className={`
                  font-script text-2xl md:text-3xl lg:text-4xl leading-relaxed text-balance
                  transition-colors duration-500 font-bold
                  ${isCurrent ? 'text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,1)] scale-105' : 'text-yellow-100 scale-100'}
                  ${index === SYNCED_WISHES.length - 1 ? 'text-red-500 mt-4 text-3xl md:text-5xl drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]' : ''}
                `}
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
              >
                {item.text}
              </p>
            </div>
          );
        })}
      </div>
      
      {/* Decorative Heart */}
      <div className={`mt-8 text-red-500 animate-bounce text-4xl transition-opacity duration-1000 ${activeIndex >= 0 ? 'opacity-100' : 'opacity-0'}`}>
         ♥
      </div>
    </div>
  );
};

export default Wishes;