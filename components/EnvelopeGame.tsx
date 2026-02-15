import React, { useState } from 'react';
import { getRandomReward } from '../constants';

interface EnvelopeProps {
  onOpen: (reward: any) => void;
  disabled: boolean;
}

const EnvelopeGame: React.FC<EnvelopeProps> = ({ onOpen, disabled }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Tạo 8 bao lì xì cố định
  const envelopes = Array.from({ length: 8 }).map((_, i) => i);

  const handleSelect = (id: number) => {
    if (disabled || selectedId !== null) return;
    setSelectedId(id);
    
    // Animation delay một chút rồi mới mở quà
    setTimeout(() => {
      onOpen(getRandomReward());
    }, 1500);
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-2 md:p-4">
      {/* Tiêu đề hướng dẫn */}
      {!disabled && (
        <div className="mb-4 md:mb-8 text-center animate-pulse relative z-30">
            <h2 className="text-yellow-200 text-sm md:text-xl font-light uppercase tracking-[0.2em] md:tracking-[0.3em]">
              Mời bạn chọn một bao lì xì
            </h2>
            <div className="w-16 md:w-24 h-0.5 md:h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mt-2"></div>
        </div>
      )}

      {/* Grid Layout sang trọng - Mobile: 4 cột (2 dòng) để gọn màn hình */}
      <div className="grid grid-cols-4 md:grid-cols-4 gap-2 md:gap-10 max-w-5xl w-full perspective-1000 px-2 md:px-0">
        {envelopes.map((id) => {
          const isSelected = selectedId === id;
          const isHidden = selectedId !== null && !isSelected;

          return (
            <div 
              key={id}
              onClick={() => handleSelect(id)}
              className={`
                relative group cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                ${isHidden ? 'opacity-0 scale-50 pointer-events-none translate-y-20' : 'opacity-100'}
                ${isSelected 
                    ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[3.5] md:scale-[1.8] z-50 pointer-events-none' 
                    : 'hover:-translate-y-2 md:hover:-translate-y-4 hover:rotate-1'}
              `}
              style={{
                transitionDelay: isHidden ? `${id * 50}ms` : '0ms'
              }}
            >
              {/* --- ENVELOPE DESIGN --- */}
              <div className={`
                relative w-full aspect-[3/4] rounded md:rounded-lg shadow-lg md:shadow-2xl overflow-hidden
                bg-gradient-to-br from-red-600 to-red-900
                border-[0.5px] md:border-[1px] border-yellow-500/30
                ${isSelected ? 'animate-shake-open' : ''}
              `}>
                {/* Texture Giấy */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
                
                {/* Nắp bao lì xì (Top Flap) */}
                <div className="absolute top-0 left-0 w-full h-[35%] bg-gradient-to-b from-red-700 to-red-800 shadow-md rounded-b-[50%] z-20 border-b border-yellow-500/20 origin-top transition-transform duration-1000"
                     style={{ transform: isSelected ? 'rotateX(180deg)' : 'rotateX(0deg)' }}>
                </div>

                {/* Thân bao - Họa tiết */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-6 md:pt-10 z-10">
                    <div className="w-[75%] h-[75%] border border-yellow-500/20 rounded flex items-center justify-center">
                         <div className="w-8 h-8 md:w-20 md:h-20 bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(234,179,8,0.6)]">
                            <span className="text-red-800 font-script font-bold text-sm md:text-4xl">
                                {id % 2 === 0 ? 'Tết' : 'Lộc'}
                            </span>
                         </div>
                    </div>
                </div>
                
                {/* Dây tua rua trang trí (Giả lập) */}
                <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 w-0.5 md:w-1 h-6 md:h-12 bg-yellow-500/50 z-30"></div>
                <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 w-2 md:w-4 h-2 md:h-4 rounded-full bg-yellow-400 shadow-lg z-30"></div>

                {/* Hiệu ứng bóng sáng (Sheen) */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
              
              {/* Bóng đổ dưới chân để tạo cảm giác 3D */}
              <div className="absolute -bottom-2 md:-bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-2 md:h-4 bg-black/40 blur-sm md:blur-md rounded-[100%] transition-all duration-300 group-hover:w-[60%] group-hover:opacity-20"></div>
            </div>
          );
        })}
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        @keyframes shake-open {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        .animate-shake-open {
            animation: shake-open 0.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EnvelopeGame;