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
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile for performance optimization
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const { scrollYProgress } = useScroll();
  
  // Disable parallax on mobile for better performance
  const y1 = useTransform(scrollYProgress, [0, 1], isMobile ? ['0%', '0%'] : ['0%', '-15%']);
  const y2 = useTransform(scrollYProgress, [0, 1], isMobile ? ['0%', '0%'] : ['0%', '-30%']);
  const y3 = useTransform(scrollYProgress, [0, 1], isMobile ? ['0%', '0%'] : ['0%', '-50%']);

  // Generate fewer stars on mobile
  const stars = useMemo(() => {
    const generated: Star[] = [];
    const count = isMobile ? 60 : 180; // Reduce stars on mobile
    
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
  }, [isMobile]);

  const layer1Stars = stars.filter(s => s.layer === 1);
  const layer2Stars = stars.filter(s => s.layer === 2);
  const layer3Stars = stars.filter(s => s.layer === 3);

  // Spawn a shooting star (disabled on mobile)
  const spawnShootingStar = useCallback(() => {
    if (isMobile) return; // Skip shooting stars on mobile
    
    const newStar: ShootingStar = {
      id: shootingStarId.current++,
      startX: Math.random() * 60 + 10,
      startY: Math.random() * 30 + 5,
      angle: Math.random() * 30 + 30,
      length: Math.random() * 80 + 60,
      duration: Math.random() * 0.8 + 0.6,
    };
    
    setShootingStars(prev => [...prev, newStar]);
    
    setTimeout(() => {
      setShootingStars(prev => prev.filter(s => s.id !== newStar.id));
    }, newStar.duration * 1000 + 500);
  }, [isMobile]);

  // Spawn shooting stars (less frequently, disabled on mobile)
  useEffect(() => {
    if (isMobile) return;
    
    const scheduleNext = () => {
      const delay = 15000 + Math.random() * 10000;
      return setTimeout(() => {
        spawnShootingStar();
        scheduleNext();
      }, delay);
    };
    
    const initialDelay = setTimeout(() => {
      spawnShootingStar();
      scheduleNext();
    }, 5000 + Math.random() * 5000);
    
    return () => clearTimeout(initialDelay);
  }, [spawnShootingStar, isMobile]);

  // On mobile, render a simplified static starfield
  if (isMobile) {
    return (
      <div 
        ref={containerRef}
        className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      >
        {/* Single static layer with fewer stars */}
        <div className="absolute inset-0 w-full h-full">
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full bg-white/60"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity * 0.6,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

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
            <div 
              className="relative"
              style={{
                transform: `rotate(${star.angle}deg)`,
              }}
            >
              <div className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_6px_2px_rgba(255,255,255,0.8)]" />
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

      {/* Layer 1 - Slowest parallax */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 w-full h-[120%] will-change-transform"
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
        className="absolute inset-0 w-full h-[140%] will-change-transform"
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

      {/* Layer 3 - Fastest parallax */}
      <motion.div 
        style={{ y: y3 }}
        className="absolute inset-0 w-full h-[160%] will-change-transform"
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
