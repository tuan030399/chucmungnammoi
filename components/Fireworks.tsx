import React, { useEffect, useRef } from 'react';
import { COLORS } from '../constants';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

interface Firework {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  exploded: boolean;
  particles: Particle[];
}

const Fireworks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let fireworks: Firework[] = [];
    let animationFrameId: number;

    const createFirework = () => {
      const x = Math.random() * width;
      const targetY = height * 0.1 + Math.random() * (height * 0.4); // Explode in top 50%
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      
      fireworks.push({
        x,
        y: height,
        targetY,
        vx: (Math.random() - 0.5) * 2, // Slight horizontal drift
        vy: -12 - Math.random() * 4, // Upward velocity
        color,
        exploded: false,
        particles: []
      });
    };

    const createParticles = (x: number, y: number, color: string) => {
      const particleCount = 50 + Math.random() * 50;
      const particles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 1;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: color,
          size: Math.random() * 3 + 1
        });
      }
      return particles;
    };

    const update = () => {
      // Clear canvas with trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Adjust alpha for trail length
      ctx.fillRect(0, 0, width, height);

      // Randomly launch fireworks
      if (Math.random() < 0.05) {
        createFirework();
      }

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];

        if (!fw.exploded) {
          fw.x += fw.vx;
          fw.y += fw.vy;
          fw.vy += 0.15; // Gravity

          // Draw rising rocket
          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = fw.color;
          ctx.fill();

          // Explode condition
          if (fw.vy >= 0 || fw.y <= fw.targetY) {
            fw.exploded = true;
            fw.particles = createParticles(fw.x, fw.y, fw.color);
          }
        } else {
          // Update particles
          for (let j = fw.particles.length - 1; j >= 0; j--) {
            const p = fw.particles[j];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // Gravity
            p.vx *= 0.99; // Air resistance
            p.vy *= 0.99;
            p.alpha -= 0.01; // Fade out

            if (p.alpha <= 0) {
              fw.particles.splice(j, 1);
            } else {
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fillStyle = p.color;
              ctx.globalAlpha = p.alpha;
              ctx.fill();
              ctx.globalAlpha = 1;
            }
          }

          // Remove firework if all particles gone
          if (fw.particles.length === 0) {
            fireworks.splice(i, 1);
          }
        }
      }

      animationFrameId = requestAnimationFrame(update);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    update();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default Fireworks;