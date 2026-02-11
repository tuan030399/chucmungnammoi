import React, { useEffect, useRef } from 'react';
import { COLORS, EXPLOSION_SOUNDS } from '../constants';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
  flicker: boolean;
}

type FireworkType = 'sphere' | 'heart' | 'ring' | 'star';

interface Firework {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  type: FireworkType;
  exploded: boolean;
  particles: Particle[];
}

interface FireworksProps {
  isMuted: boolean;
}

const Fireworks: React.FC<FireworksProps> = ({ isMuted }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Audio pool to handle multiple explosions simultaneously
  const audioPool = useRef<HTMLAudioElement[]>([]);
  const poolIndex = useRef(0);

  // Initialize audio pool
  useEffect(() => {
    // Create 10 audio elements for polyphony
    audioPool.current = Array.from({ length: 10 }).map(() => new Audio());
  }, []);

  const playExplosionSound = () => {
    if (isMuted) return;
    
    // Pick a random explosion sound
    const soundUrl = EXPLOSION_SOUNDS[Math.floor(Math.random() * EXPLOSION_SOUNDS.length)];
    
    // Use the next audio element in the pool
    const audio = audioPool.current[poolIndex.current];
    audio.src = soundUrl;
    audio.volume = 0.6 + Math.random() * 0.4; // Random volume 0.6 - 1.0
    audio.playbackRate = 0.8 + Math.random() * 0.4; // Random pitch variation
    
    audio.play().catch(() => {}); // Ignore auto-play errors
    
    // Rotate pool index
    poolIndex.current = (poolIndex.current + 1) % audioPool.current.length;
  };

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
      // Explode higher up (top 40%)
      const targetY = height * 0.15 + Math.random() * (height * 0.35); 
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      
      const types: FireworkType[] = ['sphere', 'sphere', 'sphere', 'heart', 'ring', 'star'];
      const type = types[Math.floor(Math.random() * types.length)];

      fireworks.push({
        x,
        y: height,
        targetY,
        vx: (Math.random() - 0.5) * 3, 
        vy: -14 - Math.random() * 6, // Faster launch
        color,
        type,
        exploded: false,
        particles: []
      });
    };

    const createParticles = (x: number, y: number, color: string, type: FireworkType) => {
      const particles: Particle[] = [];
      let particleCount = 100;
      let baseSpeed = 5;

      // SHAPE LOGIC
      if (type === 'heart') {
        particleCount = 60;
        baseSpeed = 0.15; // Heart scale factor
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            // Heart formula: 
            // x = 16sin^3(t)
            // y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
            // Note: Flip Y because canvas Y is down
            const heartX = 16 * Math.pow(Math.sin(angle), 3);
            const heartY = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
            
            particles.push({
                x,
                y,
                vx: heartX * baseSpeed,
                vy: heartY * baseSpeed,
                alpha: 1,
                color: color,
                size: Math.random() * 3 + 2,
                decay: 0.015,
                flicker: Math.random() > 0.5
            });
        }
      } else if (type === 'ring') {
        particleCount = 80;
        for (let i = 0; i < particleCount; i++) {
          const angle = (i / particleCount) * Math.PI * 2;
          const speed = Math.random() * 1 + 6; // Uniform speed for ring
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            color: color,
            size: Math.random() * 2 + 1,
            decay: 0.02,
            flicker: false
          });
        }
      } else if (type === 'star') {
        particleCount = 50;
        const spikes = 8;
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            // Add spike effect
            const r = 4 + 2 * Math.sin(angle * spikes); 
            particles.push({
                x,
                y,
                vx: Math.cos(angle) * r,
                vy: Math.sin(angle) * r,
                alpha: 1,
                color: color,
                size: Math.random() * 3 + 1,
                decay: 0.03,
                flicker: true
            });
        }
      } else {
        // Default Sphere
        particleCount = 100 + Math.random() * 50;
        for (let i = 0; i < particleCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 6 + 2;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            color: color,
            size: Math.random() * 3 + 1,
            decay: 0.015,
            flicker: Math.random() > 0.8
          });
        }
      }
      return particles;
    };

    const update = () => {
      // Clear with trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; // More transparent = longer trails
      ctx.fillRect(0, 0, width, height);

      // Launch rate
      if (Math.random() < 0.04) {
        createFirework();
      }

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];

        if (!fw.exploded) {
          fw.x += fw.vx;
          fw.y += fw.vy;
          fw.vy += 0.2; // Gravity applied to rocket

          // Rocket Trail
          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#FFF';
          ctx.fill();

          // Explode
          if (fw.vy >= 0 || fw.y <= fw.targetY) {
            fw.exploded = true;
            fw.particles = createParticles(fw.x, fw.y, fw.color, fw.type);
            playExplosionSound();
          }
        } else {
          // Particles
          for (let j = fw.particles.length - 1; j >= 0; j--) {
            const p = fw.particles[j];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.08; // Gravity
            p.vx *= 0.96; // Air resistance
            p.vy *= 0.96;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
              fw.particles.splice(j, 1);
            } else {
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              
              if (p.flicker && Math.random() > 0.5) {
                  ctx.fillStyle = '#FFF'; // Flicker white
              } else {
                  ctx.fillStyle = p.color;
              }
              
              ctx.globalAlpha = p.alpha;
              ctx.fill();
              ctx.globalAlpha = 1;
            }
          }

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
  }, [isMuted]); // Re-create if mute state changes isn't strictly necessary but safe

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default Fireworks;