import { useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
  layer: number; // 1-3 for parallax depth
}

const StarfieldBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  
  // Parallax transforms for different layers
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);

  // Generate stars once
  const stars = useMemo(() => {
    const generated: Star[] = [];
    const count = 180; // Number of stars
    
    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5, // 0.5-2.5px
        opacity: Math.random() * 0.6 + 0.2, // 0.2-0.8
        delay: Math.random() * 8, // 0-8s delay
        duration: Math.random() * 4 + 2, // 2-6s duration
        layer: Math.floor(Math.random() * 3) + 1, // 1, 2, or 3
      });
    }
    
    return generated;
  }, []);

  const layer1Stars = stars.filter(s => s.layer === 1);
  const layer2Stars = stars.filter(s => s.layer === 2);
  const layer3Stars = stars.filter(s => s.layer === 3);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
    >
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
