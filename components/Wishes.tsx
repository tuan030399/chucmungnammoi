import React, { useState, useEffect, useRef } from 'react';
import { SYNCED_WISHES } from '../constants';

interface WishesProps {
  isActive: boolean;
  voiceRef: React.RefObject<HTMLAudioElement | null>;
  voiceError?: boolean;
}

const Wishes: React.FC<WishesProps> = ({ isActive, voiceRef, voiceError = false }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const animationFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const isFallbackMode = useRef<boolean>(false);

  // Check sync logic
  const checkTime = (currentTime: number) => {
    let currentLine = -1;
    // Tìm dòng text phù hợp nhất với thời gian hiện tại
    for (let i = 0; i < SYNCED_WISHES.length; i++) {
      // Cho phép hiển thị sớm 0.2s để khớp nhạc hơn
      if (currentTime >= SYNCED_WISHES[i].startTime - 0.2) {
        currentLine = i;
      } else {
        break; // Vì array đã sort theo time, nên ko cần check tiếp
      }
    }
    setActiveIndex((prev) => (currentLine !== prev ? currentLine : prev));
  };

  const updateLoop = () => {
    // 1. Chế độ Fallback (Dựa vào đồng hồ hệ thống nếu không có file nhạc)
    if (isFallbackMode.current) {
      const now = Date.now() / 1000;
      const elapsed = now - startTimeRef.current;
      checkTime(elapsed);
    } 
    // 2. Chế độ Chuẩn (Dựa vào thời gian thực của file nhạc)
    else if (voiceRef.current && !voiceRef.current.paused) {
      setShowPlayButton(false); // Đang chạy thì ẩn nút Play
      checkTime(voiceRef.current.currentTime);
    } 
    // 3. Trường hợp nhạc bị Pause dù lẽ ra phải chạy (Trình duyệt chặn)
    else if (isActive && voiceRef.current && voiceRef.current.paused && !voiceRef.current.ended) {
        // Nếu đã active được > 1s mà nhạc vẫn pause -> Hiện nút Play cứu hộ
        if (voiceRef.current.currentTime === 0) {
            setShowPlayButton(true);
        }
    }
    
    animationFrameRef.current = requestAnimationFrame(updateLoop);
  };

  useEffect(() => {
    if (isActive) {
      if (voiceError) {
          isFallbackMode.current = true;
          startTimeRef.current = Date.now() / 1000;
      }
      
      cancelAnimationFrame(animationFrameRef.current);
      updateLoop();
    }
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isActive, voiceRef, voiceError]);

  const handleManualPlay = () => {
      if (voiceRef.current) {
          voiceRef.current.play().catch(console.error);
          setShowPlayButton(false);
      }
  };

  return (
    <div className="z-20 w-full max-w-4xl px-2 text-center mt-2 relative">
      
      {/* Nút Play Cứu Hộ: Chỉ hiện khi trình duyệt chặn Autoplay */}
      {showPlayButton && (
        <div className="absolute inset-0 z-50 flex items-center justify-center -mt-20">
            <button 
                onClick={handleManualPlay}
                className="bg-red-600/90 text-white px-6 py-3 rounded-full animate-bounce shadow-lg font-bold flex items-center gap-2 backdrop-blur-sm border border-red-400"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
                BẤM ĐỂ NGHE LỜI CHÚC
            </button>
        </div>
      )}

      <div className="flex flex-col gap-2 md:gap-4 items-center justify-center min-h-[300px]">
        {SYNCED_WISHES.map((item, index) => {
          const isCurrent = index === activeIndex;
          const isPast = index < activeIndex;
          
          // Karaoke Logic:
          // - Dòng hiện tại: Sáng rõ, to, màu vàng rực
          // - Dòng quá khứ: Mờ đi, nhỏ lại
          // - Dòng tương lai: Ẩn hoặc rất mờ
          
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
              className={`transition-all duration-700 ease-out transform w-full ${styleClass}`}
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
      <div className={`mt-8 text-red-500 animate-pulse text-4xl transition-opacity duration-1000 ${activeIndex >= 0 ? 'opacity-100' : 'opacity-0'}`}>
         🌸
      </div>
    </div>
  );
};

export default Wishes;