import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Import all 6 frames (0°, 30°, 60°, 90°, 120°, 150°)
import frame1 from '@/assets/ai-brain/frame-01.png';
import frame2 from '@/assets/ai-brain/frame-02.png';
import frame3 from '@/assets/ai-brain/frame-03.png';
import frame4 from '@/assets/ai-brain/frame-04.png';
import frame5 from '@/assets/ai-brain/frame-05.png';
import frame6 from '@/assets/ai-brain/frame-06.png';

const frames = [frame1, frame2, frame3, frame4, frame5, frame6];

const AIBrainRotation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Map scroll progress to frame index (0-7)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frames.length - 1]);
  
  // Scale effect - starts big, gets smaller, then big again
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.9]);
  
  // Opacity for text reveals
  const textOpacity1 = useTransform(scrollYProgress, [0, 0.15, 0.3], [0, 1, 0]);
  const textOpacity2 = useTransform(scrollYProgress, [0.35, 0.5, 0.65], [0, 1, 0]);
  const textOpacity3 = useTransform(scrollYProgress, [0.7, 0.85, 1], [0, 1, 1]);

  return (
    <section 
      ref={containerRef}
      className="relative h-[400vh]"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
        
        {/* Animated glow behind brain */}
        <motion.div 
          style={{ scale }}
          className="absolute w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]"
        />

        {/* Frame container */}
        <motion.div 
          style={{ scale }}
          className="relative w-[400px] h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px]"
        >
          {frames.map((frame, index) => (
            <Frame 
              key={index} 
              src={frame} 
              index={index} 
              frameIndex={frameIndex} 
            />
          ))}
        </motion.div>

        {/* Text overlays that appear at different scroll points */}
        <motion.div 
          style={{ opacity: textOpacity1 }}
          className="absolute top-1/4 left-8 md:left-16 lg:left-32 max-w-xs"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gradient">
            AI-Driven
          </h3>
          <p className="text-muted-foreground mt-2">
            Bygger intelligenta lösningar med maskininlärning
          </p>
        </motion.div>

        <motion.div 
          style={{ opacity: textOpacity2 }}
          className="absolute bottom-1/4 right-8 md:right-16 lg:right-32 max-w-xs text-right"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gradient">
            Full-Stack
          </h3>
          <p className="text-muted-foreground mt-2">
            End-to-end utveckling från backend till frontend
          </p>
        </motion.div>

        <motion.div 
          style={{ opacity: textOpacity3 }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center"
        >
          <h3 className="text-2xl md:text-4xl font-bold text-gradient">
            Skapar framtiden
          </h3>
        </motion.div>

        {/* Decorative particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Individual frame component with opacity based on current frame index
const Frame = ({ 
  src, 
  index, 
  frameIndex 
}: { 
  src: string; 
  index: number; 
  frameIndex: ReturnType<typeof useTransform<number[], number>>;
}) => {
  // Calculate opacity based on distance from current frame
  const opacity = useTransform(frameIndex, (latest: number) => {
    const distance = Math.abs(latest - index);
    if (distance < 0.5) return 1;
    if (distance < 1) return 1 - (distance - 0.5) * 2;
    return 0;
  });

  return (
    <motion.img
      src={src}
      alt={`AI Brain frame ${index + 1}`}
      style={{ opacity }}
      className="absolute inset-0 w-full h-full object-contain"
    />
  );
};

export default AIBrainRotation;
