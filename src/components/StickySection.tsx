import { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface StickySectionProps {
  children: ReactNode;
  className?: string;
  height?: string;
}

const StickySection = ({ 
  children, 
  className = '',
  height = '200vh'
}: StickySectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div 
      ref={containerRef} 
      style={{ height }}
      className="relative"
    >
      <div className={`sticky top-0 h-screen flex items-center justify-center overflow-hidden ${className}`}>
        <motion.div
          style={{ 
            scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 0.9]),
            opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1, 1, 0])
          }}
          className="w-full"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default StickySection;
