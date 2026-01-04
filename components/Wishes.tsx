import React, { useState, useEffect, useRef } from 'react';
import { SYNCED_WISHES } from '../constants';

interface WishesProps {
  isActive: boolean;
  getCurrentTime: () => number; // Changed from ref to function
}

const Wishes: React.FC<WishesProps> = ({ isActive, getCurrentTime }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const animationFrameRef = useRef<number>(0);

  // Check sync logic
  const checkTime = (currentTime: number) => {
    let currentLine = -1;
    for (let i = 0; i < SYNCED_WISHES.length; i++) {
      // Cho phép hiển thị sớm 0.2s để khớp nhạc hơn
      if (currentTime >= SYNCED_WISHES[i].startTime - 0.2) {
        currentLine = i;
      } else {
        break;
      }
    }
    setActiveIndex((prev) => (currentLine !== prev ? currentLine : prev));
  };

  const updateLoop = () => {
    if (isActive) {
      const time = getCurrentTime();
      if (time > 0) {
        checkTime(time);
      }
    }
    animationFrameRef.current = requestAnimationFrame(updateLoop);
  };

  useEffect(() => {
    if (isActive) {
      cancelAnimationFrame(animationFrameRef.current);
      updateLoop();
    }
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isActive]);

  return (
    <div className="z-20 w-full max-w-4xl px-2 text-center mt-2 relative">
      <div className="flex flex-col gap-2 md:gap-4 items-center justify-center min-h-[300px]">
        {SYNCED_WISHES.map((item, index) => {
          const isCurrent = index === activeIndex;
          const isPast = index < activeIndex;
          
          // Karaoke Logic
          let styleClass = "";
          if (isCurrent) {
              styleClass = "opacity-100 scale-110 text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.8)] font-extrabold z-10";
          } else if (isPast) {
              styleClass = "opacity-40 scale-95 text-gray-300 blur-[0.5px] font-normal";
          } else {
              // Future lines
              styleClass = "opacity-0 translate-y-4 scale-90";
          }

          return (
            <div 
              key={index}
              className={`transition-all duration-300 ease-out transform w-full ${styleClass}`}
            >
              <p 
                className={`
                  font-script text-2xl md:text-3xl lg:text-4xl leading-snug text-balance px-4
                `}
                style={isCurrent ? { textShadow: '2px 2px 0px #b91c1c' } : {}}
              >
                {item.text}
              </p>
            </div>
          );
        })}
      </div>
      
      {/* Footer Decoration */}
      <div className={`mt-8 text-red-500 animate-pulse text-4xl transition-opacity duration-500 ${activeIndex >= 0 ? 'opacity-100' : 'opacity-0'}`}>
         🌸
      </div>
    </div>
  );
};

export default Wishes;