import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Import all 12 frames for smooth rotation (every 15 degrees)
// Order: 0°, 15°, 30°, 45°, 60°, 75°, 90°, 105°, 120°, 135°, 150°, 165°
import frame01 from '@/assets/ai-brain/frame-01.png';   // 0°
import frame02 from '@/assets/ai-brain/frame-01b.png';  // 15°
import frame03 from '@/assets/ai-brain/frame-02.png';   // 30°
import frame04 from '@/assets/ai-brain/frame-02b.png';  // 45°
import frame05 from '@/assets/ai-brain/frame-03.png';   // 60°
import frame06 from '@/assets/ai-brain/frame-03b.png';  // 75°
import frame07 from '@/assets/ai-brain/frame-04.png';   // 90°
import frame08 from '@/assets/ai-brain/frame-04b.png';  // 105°
import frame09 from '@/assets/ai-brain/frame-05.png';   // 120°
import frame10 from '@/assets/ai-brain/frame-05b.png';  // 135°
import frame11 from '@/assets/ai-brain/frame-06.png';   // 150°
import frame12 from '@/assets/ai-brain/frame-06b.png';  // 165°

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
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Preload all images for smooth playback
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
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Draw frame to canvas with high quality
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !images[frameIndex]) return;

    // Enable high quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Clear with transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the image centered and scaled to fit
    const img = images[frameIndex];
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.95;
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;
    
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  }, [images]);

  // Smooth scroll-driven animation using requestAnimationFrame
  useEffect(() => {
    if (!imagesLoaded) return;

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Map scroll progress to frame index (0 to frameCount-1)
      const frameIndex = Math.min(
        Math.round(latest * (frameSources.length - 1)),
        frameSources.length - 1
      );
      
      // Only redraw if frame changed
      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        
        // Use requestAnimationFrame for smooth rendering
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
        rafRef.current = requestAnimationFrame(() => {
          drawFrame(frameIndex);
        });
      }
    });

    // Draw initial frame
    requestAnimationFrame(() => drawFrame(0));

    return () => {
      unsubscribe();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [imagesLoaded, scrollYProgress, drawFrame]);

  // Handle canvas resize with proper DPI scaling
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const container = canvas.parentElement;
      if (!container) return;
      
      // Get container dimensions
      const rect = container.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height);
      
      // Scale for retina displays
      const dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      
      // Scale context for retina
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        canvas.width = size * dpr;
        canvas.height = size * dpr;
      }
      
      // Redraw current frame
      if (imagesLoaded) {
        requestAnimationFrame(() => drawFrame(currentFrameRef.current));
      }
    };

    // Initial setup
    setTimeout(handleResize, 100);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imagesLoaded, drawFrame]);

  // Scale transform for zoom effect
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1.15, 1.15, 0.9]);
  
  // Y position for subtle parallax
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  
  // Text reveals at different scroll points
  const textOpacity1 = useTransform(scrollYProgress, [0.05, 0.15, 0.25], [0, 1, 0]);
  const textY1 = useTransform(scrollYProgress, [0.05, 0.15, 0.25], [30, 0, -30]);
  
  const textOpacity2 = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 1, 0]);
  const textY2 = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [30, 0, -30]);
  
  const textOpacity3 = useTransform(scrollYProgress, [0.75, 0.85, 1], [0, 1, 1]);
  const textY3 = useTransform(scrollYProgress, [0.75, 0.85, 1], [30, 0, 0]);

  // Glow intensity based on scroll
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.25, 0.1]);

  return (
    <section 
      ref={containerRef}
      className="relative h-[250vh]"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Pure black background for seamless blend */}
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        
        {/* Animated glow behind brain */}
        <motion.div 
          style={{ opacity: glowOpacity, scale }}
          className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-cyan-500/20 rounded-full blur-[100px]"
        />
        <motion.div 
          style={{ opacity: glowOpacity, scale }}
          className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-blue-500/15 rounded-full blur-[80px]"
        />

        {/* Canvas container with smooth transforms */}
        <motion.div 
          style={{ scale, y }}
          className="relative w-[280px] h-[280px] md:w-[420px] md:h-[420px] lg:w-[520px] lg:h-[520px] flex items-center justify-center"
        >
          <canvas 
            ref={canvasRef}
            className="w-full h-full"
            style={{ 
              imageRendering: 'auto',
            }}
          />
          
          {/* Loading state */}
          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-cyan-500/50 border-t-cyan-500 rounded-full animate-spin" />
            </div>
          )}
        </motion.div>

        {/* Text overlays with smooth animations */}
        <motion.div 
          style={{ opacity: textOpacity1, y: textY1 }}
          className="absolute top-[20%] left-4 md:left-12 lg:left-24 max-w-[200px] md:max-w-xs"
        >
          <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-gradient">
            Machine Learning
          </h3>
          <p className="text-muted-foreground mt-2 text-xs md:text-sm">
            Prediktiva modeller och intelligent dataanalys
          </p>
        </motion.div>

        <motion.div 
          style={{ opacity: textOpacity2, y: textY2 }}
          className="absolute top-[25%] right-4 md:right-12 lg:right-24 max-w-[200px] md:max-w-xs text-right"
        >
          <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-gradient">
            Full-Stack
          </h3>
          <p className="text-muted-foreground mt-2 text-xs md:text-sm">
            React, Python, Django & Supabase
          </p>
        </motion.div>

        <motion.div 
          style={{ opacity: textOpacity3, y: textY3 }}
          className="absolute bottom-[15%] left-1/2 -translate-x-1/2 text-center"
        >
          <h3 className="text-lg md:text-2xl lg:text-4xl font-bold text-gradient">
            End-to-End Solutions
          </h3>
          <p className="text-muted-foreground mt-2 text-xs md:text-sm max-w-md">
            Från idé till produktion
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0, 0.08], [1, 0]) }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1.5 text-muted-foreground/60"
          >
            <span className="text-[10px] tracking-widest uppercase">Scrolla</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIBrainRotation;
