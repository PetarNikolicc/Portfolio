import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import profileImage from '@/assets/profile-image.png';

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Keep hero visible until the very end of the scroll to avoid a "blank" gap
  const opacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.85, 1], [0, 0, -80]);
  const titleY = useTransform(scrollYProgress, [0, 0.85, 1], [0, 0, -40]);

  return (
    <section 
      ref={containerRef}
      className="relative h-screen"
    >
      <div className="h-full flex flex-col items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
        
        {/* Animated glow orbs */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-glow"
          style={{ opacity }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-[100px] animate-pulse-glow"
          style={{ opacity, animationDelay: '1s' }}
        />

        <motion.div 
          style={{ opacity, scale, y }}
          className="relative z-10 text-center px-4"
        >
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative w-40 h-40 md:w-52 md:h-52 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-accent/50 rounded-full blur-xl opacity-50 animate-pulse-glow" />
              <img 
                src={profileImage} 
                alt="Petar Nikolic" 
                className="relative w-full h-full object-cover rounded-full border-2 border-primary/30"
              />
            </div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-muted-foreground text-lg md:text-xl mb-4 tracking-widest uppercase"
          >
            AI Developer
          </motion.p>
          
          <motion.h1 
            style={{ y: titleY }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight mb-6"
          >
            <span className="text-gradient glow-text">Petar</span>
            <br />
            <span className="text-foreground">Nikolic</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto"
          >
            Webbutvecklare · AI-specialist · Solutions Architect
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="mt-12"
          >
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2 text-muted-foreground"
            >
              <span className="text-sm tracking-wider uppercase">Scrolla ner</span>
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
