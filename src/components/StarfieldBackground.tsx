import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
  layer: number;
}

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  angle: number;
  length: number;
  duration: number;
}

const StarfieldBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const shootingStarId = useRef(0);
  
  const { scrollYProgress } = useScroll();
  
  // Parallax transforms for different layers
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);

  // Generate stars once
  const stars = useMemo(() => {
    const generated: Star[] = [];
    const count = 180;
    
    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        delay: Math.random() * 8,
        duration: Math.random() * 4 + 2,
        layer: Math.floor(Math.random() * 3) + 1,
      });
    }
    
    return generated;
  }, []);

  const layer1Stars = stars.filter(s => s.layer === 1);
  const layer2Stars = stars.filter(s => s.layer === 2);
  const layer3Stars = stars.filter(s => s.layer === 3);

  // Spawn a shooting star
  const spawnShootingStar = useCallback(() => {
    const newStar: ShootingStar = {
      id: shootingStarId.current++,
      startX: Math.random() * 60 + 10, // 10-70% from left
      startY: Math.random() * 30 + 5,  // 5-35% from top
      angle: Math.random() * 30 + 30,  // 30-60 degrees
      length: Math.random() * 80 + 60, // 60-140px trail
      duration: Math.random() * 0.8 + 0.6, // 0.6-1.4s
    };
    
    setShootingStars(prev => [...prev, newStar]);
    
    // Remove after animation completes
    setTimeout(() => {
      setShootingStars(prev => prev.filter(s => s.id !== newStar.id));
    }, newStar.duration * 1000 + 500);
  }, []);

  // Spawn shooting stars every ~20 seconds (with some randomness)
  useEffect(() => {
    const scheduleNext = () => {
      const delay = 15000 + Math.random() * 10000; // 15-25 seconds
      return setTimeout(() => {
        spawnShootingStar();
        scheduleNext();
      }, delay);
    };
    
    // First one after 5-10 seconds
    const initialDelay = setTimeout(() => {
      spawnShootingStar();
      scheduleNext();
    }, 5000 + Math.random() * 5000);
    
    return () => clearTimeout(initialDelay);
  }, [spawnShootingStar]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
    >
      {/* Shooting stars layer */}
      <AnimatePresence>
        {shootingStars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ 
              opacity: 0,
              x: 0,
              y: 0,
            }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              x: Math.cos(star.angle * Math.PI / 180) * 300,
              y: Math.sin(star.angle * Math.PI / 180) * 300,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: star.duration,
              ease: "easeOut",
            }}
            className="absolute"
            style={{
              left: `${star.startX}%`,
              top: `${star.startY}%`,
            }}
          >
            {/* Shooting star with tail */}
            <div 
              className="relative"
              style={{
                transform: `rotate(${star.angle}deg)`,
              }}
            >
              {/* Bright head */}
              <div className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_6px_2px_rgba(255,255,255,0.8)]" />
              {/* Glowing tail */}
              <div 
                className="absolute top-0.5 right-1"
                style={{
                  width: `${star.length}px`,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), rgba(255,255,255,0.6), white)',
                  filter: 'blur(0.5px)',
                }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Layer 1 - Slowest parallax (far stars) */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 w-full h-[120%]"
      >
        {layer1Stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white/80 animate-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity * 0.5,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </motion.div>

      {/* Layer 2 - Medium parallax */}
      <motion.div 
        style={{ y: y2 }}
        className="absolute inset-0 w-full h-[140%]"
      >
        {layer2Stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-primary/60 animate-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity * 0.7,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </motion.div>

      {/* Layer 3 - Fastest parallax (close stars) */}
      <motion.div 
        style={{ y: y3 }}
        className="absolute inset-0 w-full h-[160%]"
      >
        {layer3Stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-twinkle-bright"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size * 1.2}px`,
              height: `${star.size * 1.2}px`,
              opacity: star.opacity,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration * 0.8}s`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default StarfieldBackground;
