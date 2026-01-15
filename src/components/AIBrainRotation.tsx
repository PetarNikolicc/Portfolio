import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Import all 12 frames for smooth rotation
import frame01 from '@/assets/ai-brain/frame-01.png';
import frame02 from '@/assets/ai-brain/frame-01b.png';
import frame03 from '@/assets/ai-brain/frame-02.png';
import frame04 from '@/assets/ai-brain/frame-02b.png';
import frame05 from '@/assets/ai-brain/frame-03.png';
import frame06 from '@/assets/ai-brain/frame-03b.png';
import frame07 from '@/assets/ai-brain/frame-04.png';
import frame08 from '@/assets/ai-brain/frame-04b.png';
import frame09 from '@/assets/ai-brain/frame-05.png';
import frame10 from '@/assets/ai-brain/frame-05b.png';
import frame11 from '@/assets/ai-brain/frame-06.png';
import frame12 from '@/assets/ai-brain/frame-06b.png';

const frameSources = [
  frame01, frame02, frame03, frame04, frame05, frame06,
  frame07, frame08, frame09, frame10, frame11, frame12
];

const AIBrainRotation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>();
  
  // Track scroll from when this section starts to when it ends
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Preload all images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    frameSources.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedImages[index] = img;
        loadedCount++;
        if (loadedCount === frameSources.length) {
          setImages(loadedImages);
          setImagesLoaded(true);
        }
      };
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Draw frame to canvas
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !images[frameIndex]) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const img = images[frameIndex];
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.9;
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;
    
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  }, [images]);

  // Scroll-driven frame animation
  useEffect(() => {
    if (!imagesLoaded) return;

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Use the middle 80% of scroll for rotation (10% fade in, 80% rotate, 10% fade out)
      const rotationProgress = Math.max(0, Math.min(1, (latest - 0.05) / 0.9));
      const frameIndex = Math.min(
        Math.round(rotationProgress * (frameSources.length - 1)),
        frameSources.length - 1
      );
      
      if (frameIndex !== currentFrameRef.current && frameIndex >= 0) {
        currentFrameRef.current = frameIndex;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
      }
    });

    requestAnimationFrame(() => drawFrame(0));

    return () => {
      unsubscribe();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [imagesLoaded, scrollYProgress, drawFrame]);

  // Canvas resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const container = canvas.parentElement;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height);
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      
      if (imagesLoaded) {
        requestAnimationFrame(() => drawFrame(currentFrameRef.current));
      }
    };

    setTimeout(handleResize, 50);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imagesLoaded, drawFrame]);

  // FADE IN immediately at start (first 5% of scroll)
  const brainOpacity = useTransform(scrollYProgress, [0, 0.05, 0.92, 1], [0, 1, 1, 0]);
  
  // Scale effect during rotation
  const scale = useTransform(scrollYProgress, [0, 0.1, 0.5, 0.9, 1], [0.85, 1, 1.1, 1, 0.9]);
  
  // Subtle Y movement
  const y = useTransform(scrollYProgress, [0, 0.5, 1], ['5%', '0%', '-5%']);
  
  // Glow intensity
  const glowOpacity = useTransform(scrollYProgress, [0, 0.1, 0.5, 0.9, 1], [0, 0.2, 0.3, 0.2, 0]);

  // Text reveals
  const textOpacity1 = useTransform(scrollYProgress, [0.1, 0.2, 0.35], [0, 1, 0]);
  const textY1 = useTransform(scrollYProgress, [0.1, 0.2, 0.35], [20, 0, -20]);
  
  const textOpacity2 = useTransform(scrollYProgress, [0.4, 0.5, 0.65], [0, 1, 0]);
  const textY2 = useTransform(scrollYProgress, [0.4, 0.5, 0.65], [20, 0, -20]);
  
  const textOpacity3 = useTransform(scrollYProgress, [0.7, 0.8, 0.92], [0, 1, 0]);
  const textY3 = useTransform(scrollYProgress, [0.7, 0.8, 0.92], [20, 0, -20]);

  return (
    <section 
      ref={containerRef}
      className="relative h-[200vh]"
    >
      {/* Sticky container that stays in view */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background matching site theme */}
        <div className="absolute inset-0 bg-background" />
        
        {/* Animated glow */}
        <motion.div 
          style={{ opacity: glowOpacity }}
          className="absolute w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"
        />

        {/* Brain canvas with fade and scale */}
        <motion.div 
          style={{ opacity: brainOpacity, scale, y }}
          className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] flex items-center justify-center"
        >
          <canvas 
            ref={canvasRef}
            className="w-full h-full"
          />
          
          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary/50 border-t-primary rounded-full animate-spin" />
            </div>
          )}
        </motion.div>

        {/* Text overlays */}
        <motion.div 
          style={{ opacity: textOpacity1, y: textY1 }}
          className="absolute top-[22%] left-4 md:left-16 lg:left-28 max-w-[180px] md:max-w-xs"
        >
          <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-gradient">
            Machine Learning
          </h3>
          <p className="text-muted-foreground mt-1.5 text-xs md:text-sm">
            Prediktiva modeller och intelligent dataanalys
          </p>
        </motion.div>

        <motion.div 
          style={{ opacity: textOpacity2, y: textY2 }}
          className="absolute top-[22%] right-4 md:right-16 lg:right-28 max-w-[180px] md:max-w-xs text-right"
        >
          <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-gradient">
            Full-Stack
          </h3>
          <p className="text-muted-foreground mt-1.5 text-xs md:text-sm">
            React, Python, Django & Supabase
          </p>
        </motion.div>

        <motion.div 
          style={{ opacity: textOpacity3, y: textY3 }}
          className="absolute bottom-[18%] left-1/2 -translate-x-1/2 text-center"
        >
          <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-gradient">
            End-to-End Solutions
          </h3>
          <p className="text-muted-foreground mt-1.5 text-xs md:text-sm">
            Från idé till produktion
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AIBrainRotation;
