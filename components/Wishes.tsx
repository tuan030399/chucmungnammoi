import React, { useState, useEffect } from 'react';
import { WISHES } from '../constants';

const Wishes: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fading out
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % WISHES.length);
        setFade(true); // Fade back in
      }, 1000); // Wait for fade out to finish
    }, 4000); // Change wish every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="z-20 w-full max-w-4xl px-4 text-center mt-8 md:mt-16">
      <div 
        className={`transition-all duration-1000 ease-in-out transform ${
          fade ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
        }`}
      >
        <div className="relative inline-block">
            {/* Decorative Quotes */}
            <span className="absolute -top-6 -left-8 text-6xl text-yellow-500 opacity-50 font-serif">“</span>
            
            <p className="text-3xl md:text-5xl lg:text-6xl text-yellow-100 font-script leading-relaxed drop-shadow-md text-balance">
            {WISHES[index]}
            </p>
            
            <span className="absolute -bottom-10 -right-8 text-6xl text-yellow-500 opacity-50 font-serif">”</span>
        </div>
      </div>
    </div>
  );
};

export default Wishes;