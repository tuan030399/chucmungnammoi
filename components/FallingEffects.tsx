import React, { useState } from 'react';
import { FALLING_ITEMS } from '../constants';

const FallingEffects: React.FC = () => {
  // Create a fixed set of items to avoid re-rendering randomization
  const [items] = useState(() => 
    Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      char: FALLING_ITEMS[i % FALLING_ITEMS.length],
      left: `${Math.random() * 100}%`,
      animationDuration: `${4 + Math.random() * 6}s`,
      animationDelay: `${Math.random() * 5}s`,
      fontSize: `${20 + Math.random() * 30}px`
    }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute -top-20 opacity-80 animate-fall"
          style={{
            left: item.left,
            fontSize: item.fontSize,
            animation: `fall ${item.animationDuration} linear infinite`,
            animationDelay: item.animationDelay,
          }}
        >
          {item.char}
        </div>
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default FallingEffects;