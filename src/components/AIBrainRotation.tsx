import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

// 12 frames for 180° rotation (15° per frame)
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
  frame07, frame08, frame09, frame10, frame11, frame12,
];

const FRAME_COUNT = frameSources.length;

// Apple uses ~400vh for smooth rotation
const SECTION_HEIGHT = '400vh';

// Clamp helper
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const AIBrainRotation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef({ a: 0, b: 0, mix: 0 });

  // Scroll progress: 0 when section top reaches viewport top, 1 when section bottom leaves viewport top
  // This means the sticky element stays put while we scroll through 400vh
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Very smooth spring for premium feel - low stiffness, high damping
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 30,
    mass: 1,
  });

  // Preload all images before animation starts
  useEffect(() => {
    const loaded: HTMLImageElement[] = [];
    let count = 0;

    frameSources.forEach((src, i) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      img.onload = () => {
        loaded[i] = img;
        count++;
        if (count === FRAME_COUNT) {
          setImages(loaded);
          setImagesLoaded(true);
        }
      };
    });
  }, []);

  // Draw frame with optional crossfade between two frames
  const draw = useCallback((aIdx: number, bIdx: number, mix: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !images.length) return;

    const a = images[aIdx];
    const b = images[bIdx];
    if (!a) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Center and scale image
    const scale = Math.min(canvas.width / a.width, canvas.height / a.height) * 0.88;
    const x = (canvas.width - a.width * scale) / 2;
    const y = (canvas.height - a.height * scale) / 2;

    // Draw base frame
    ctx.globalAlpha = 1;
    ctx.drawImage(a, x, y, a.width * scale, a.height * scale);

    // Crossfade to next frame if available
    if (b && bIdx !== aIdx && mix > 0.01) {
      ctx.globalAlpha = mix;
      ctx.drawImage(b, x, y, b.width * scale, b.height * scale);
      ctx.globalAlpha = 1;
    }

    lastFrameRef.current = { a: aIdx, b: bIdx, mix };
  }, [images]);

  // Setup canvas with proper DPI scaling
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      const parent = canvas?.parentElement;
      if (!canvas || !parent) return;

      const rect = parent.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height);
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(size * dpr);
      canvas.height = Math.floor(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;

      if (imagesLoaded) {
        const { a, b, mix } = lastFrameRef.current;
        requestAnimationFrame(() => draw(a, b, mix));
      }
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [imagesLoaded, draw]);

  // Drive animation from scroll
  useEffect(() => {
    if (!imagesLoaded) return;

    // Animation phases:
    // 0.00 - 0.08: Fade in (brain appears)
    // 0.08 - 0.85: Rotation (frames 0-11)
    // 0.85 - 1.00: Hold last frame, then fade out to About section
    
    const FADE_IN_END = 0.08;
    const ROTATION_START = 0.08;
    const ROTATION_END = 0.85;

    const unsub = smoothProgress.on('change', (progress) => {
      // Calculate frame based on rotation phase only
      const rotationProgress = clamp(
        (progress - ROTATION_START) / (ROTATION_END - ROTATION_START),
        0,
        1
      );

      // Map to frame index with crossfade
      const exactFrame = rotationProgress * (FRAME_COUNT - 1);
      const aIdx = Math.floor(exactFrame);
      const bIdx = Math.min(aIdx + 1, FRAME_COUNT - 1);
      const mix = exactFrame - aIdx;

      // Only redraw if something changed
      const last = lastFrameRef.current;
      if (aIdx !== last.a || bIdx !== last.b || Math.abs(mix - last.mix) > 0.01) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => draw(aIdx, bIdx, mix));
      }
    });

    // Initial draw
    requestAnimationFrame(() => draw(0, 0, 0));

    return () => {
      unsub();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [imagesLoaded, smoothProgress, draw]);

  // Visual transforms
  // Fade in during first 8%, stay visible, fade out in last 8%
  const opacity = useTransform(smoothProgress, [0, 0.06, 0.92, 1], [0, 1, 1, 0]);
  
  // Subtle scale: start slightly smaller, grow, then shrink slightly at end
  const scale = useTransform(smoothProgress, [0, 0.15, 0.5, 0.85, 1], [0.92, 1.0, 1.08, 1.04, 0.96]);
  
  // Subtle vertical parallax
  const yMove = useTransform(smoothProgress, [0, 1], ['2%', '-2%']);
  
  // Glow intensity
  const glowOpacity = useTransform(smoothProgress, [0, 0.1, 0.5, 0.9, 1], [0, 0.15, 0.25, 0.15, 0]);

  // Text reveals at different scroll points
  const text1Opacity = useTransform(smoothProgress, [0.12, 0.20, 0.32], [0, 1, 0]);
  const text1Y = useTransform(smoothProgress, [0.12, 0.20, 0.32], [25, 0, -25]);

  const text2Opacity = useTransform(smoothProgress, [0.38, 0.48, 0.60], [0, 1, 0]);
  const text2Y = useTransform(smoothProgress, [0.38, 0.48, 0.60], [25, 0, -25]);

  const text3Opacity = useTransform(smoothProgress, [0.68, 0.78, 0.88], [0, 1, 0]);
  const text3Y = useTransform(smoothProgress, [0.68, 0.78, 0.88], [25, 0, -25]);

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: SECTION_HEIGHT }}
    >
      {/* Sticky container - stays fixed while scrolling through 400vh */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-background" />

        {/* Glow effect */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="absolute w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px]"
        />

        {/* Brain canvas */}
        <motion.div
          style={{ opacity, scale, y: yMove }}
          className="relative w-[300px] h-[300px] md:w-[440px] md:h-[440px] lg:w-[540px] lg:h-[540px] flex items-center justify-center"
        >
          <canvas ref={canvasRef} className="w-full h-full" />

          {/* Loading spinner */}
          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
            </div>
          )}
        </motion.div>

        {/* Text overlays */}
        <motion.div
          style={{ opacity: text1Opacity, y: text1Y }}
          className="absolute top-[22%] left-4 md:left-12 lg:left-24 max-w-[200px] md:max-w-xs"
        >
          <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-gradient">
            Machine Learning
          </h3>
          <p className="text-muted-foreground mt-2 text-xs md:text-sm leading-relaxed">
            Prediktiva modeller och intelligent dataanalys
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: text2Opacity, y: text2Y }}
          className="absolute top-[22%] right-4 md:right-12 lg:right-24 max-w-[200px] md:max-w-xs text-right"
        >
          <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-gradient">
            Full-Stack
          </h3>
          <p className="text-muted-foreground mt-2 text-xs md:text-sm leading-relaxed">
            React, Python, Django & Supabase
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: text3Opacity, y: text3Y }}
          className="absolute bottom-[20%] left-1/2 -translate-x-1/2 text-center"
        >
          <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-gradient">
            End-to-End Solutions
          </h3>
          <p className="text-muted-foreground mt-2 text-xs md:text-sm leading-relaxed">
            Från idé till produktion
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AIBrainRotation;
