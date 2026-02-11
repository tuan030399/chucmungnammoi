import React, { useEffect, useState } from 'react';

interface CountdownProps {
  onComplete: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ onComplete }) => {
  const [count, setCount] = useState(5);
  const [showHappyNewYear, setShowHappyNewYear] = useState(false);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowHappyNewYear(true);
      const timer = setTimeout(() => {
        onComplete();
      }, 2000); // Hiện chữ Happy New Year 2s rồi vào game
      return () => clearTimeout(timer);
    }
  }, [count, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/40 via-black to-black"></div>

      {!showHappyNewYear ? (
        <div key={count} className="relative animate-ping-slow">
          <span className="text-[15rem] md:text-[20rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)] font-script">
            {count}
          </span>
          <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full animate-ping"></div>
        </div>
      ) : (
        <div className="text-center animate-pop-in">
          <h1 className="text-6xl md:text-8xl text-yellow-400 font-black font-script uppercase drop-shadow-2xl tracking-tighter">
            Happy<br/>New Year<br/><span className="text-red-600 text-8xl md:text-9xl">2026</span>
          </h1>
        </div>
      )}

      <style>{`
        @keyframes ping-slow {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          80% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-ping-slow {
          animation: ping-slow 1s cubic-bezier(0, 0, 0.2, 1) forwards;
        }
        .animate-pop-in {
          animation: pop-in 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Countdown;