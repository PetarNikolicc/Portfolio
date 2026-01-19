import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

// 12 frames (15° steps)
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
  frame01,
  frame02,
  frame03,
  frame04,
  frame05,
  frame06,
  frame07,
  frame08,
  frame09,
  frame10,
  frame11,
  frame12,
];

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

const AIBrainRotation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastDrawnRef = useRef({ a: 0, b: 0, t: 0 });

  // Progress should start when this section hits the top of the viewport (so it doesn't "advance" off-screen)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Smooth the scroll progress (reduces fast/jittery jumps)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 34,
    mass: 0.6,
  });

  // Preload frames
  useEffect(() => {
    const loaded: HTMLImageElement[] = [];
    let count = 0;

    frameSources.forEach((src, i) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      img.onload = () => {
        loaded[i] = img;
        count += 1;
        if (count === frameSources.length) {
          setImages(loaded);
          setImagesLoaded(true);
        }
      };
    });
  }, []);

  const draw = useCallback(
    (aIndex: number, bIndex: number, mix: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      const a = images[aIndex];
      const b = images[bIndex];
      if (!a || !b) return;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw both images in the same position/scale for a smooth blend
      const scale =
        Math.min(canvas.width / a.width, canvas.height / a.height) * 0.92;
      const x = (canvas.width - a.width * scale) / 2;
      const y = (canvas.height - a.height * scale) / 2;

      ctx.globalAlpha = 1;
      ctx.drawImage(a, x, y, a.width * scale, a.height * scale);

      if (mix > 0 && bIndex !== aIndex) {
        ctx.globalAlpha = mix;
        ctx.drawImage(b, x, y, b.width * scale, b.height * scale);
        ctx.globalAlpha = 1;
      }

      lastDrawnRef.current = { a: aIndex, b: bIndex, t: mix };
    },
    [images]
  );

  // Resize canvas to container with DPR scaling
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height);
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(size * dpr);
      canvas.height = Math.floor(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;

      if (imagesLoaded) {
        const { a, b, t } = lastDrawnRef.current;
        requestAnimationFrame(() => draw(a, b, t));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imagesLoaded, draw]);

  // Drive frames from smoothed scroll progress
  useEffect(() => {
    if (!imagesLoaded) return;

    const start = 0.02; // start rotation right as the sticky scene begins
    const end = 0.98; // keep rotating almost until About takes over

    const unsub = smoothProgress.on('change', (latest) => {
      const t = clamp01((latest - start) / (end - start));
      const exact = t * (frameSources.length - 1);
      const a = Math.floor(exact);
      const b = Math.min(a + 1, frameSources.length - 1);
      const mix = exact - a;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => draw(a, b, mix));
    });

    // initial draw
    requestAnimationFrame(() => draw(0, 0, 0));

    return () => {
      unsub();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [imagesLoaded, smoothProgress, draw]);

  // Visual polish (parallax/scale) — uses smoothed progress
  const scale = useTransform(smoothProgress, [0, 0.25, 0.6, 1], [0.98, 1.06, 1.1, 1.02]);
  const y = useTransform(smoothProgress, [0, 1], ['3%', '-3%']);
  const glowOpacity = useTransform(smoothProgress, [0, 0.15, 0.5, 1], [0, 0.18, 0.28, 0.18]);

  // Fade-in immediately when the brain section enters, fade-out only at the very end
  const entryOpacity = useTransform(smoothProgress, [0, 0.005, 0.995, 1], [0, 1, 1, 0]);

  // Copy reveals
  const text1O = useTransform(smoothProgress, [0.12, 0.22, 0.34], [0, 1, 0]);
  const text1Y = useTransform(smoothProgress, [0.12, 0.22, 0.34], [18, 0, -18]);

  const text2O = useTransform(smoothProgress, [0.38, 0.5, 0.62], [0, 1, 0]);
  const text2Y = useTransform(smoothProgress, [0.38, 0.5, 0.62], [18, 0, -18]);

  const text3O = useTransform(smoothProgress, [0.66, 0.78, 0.9], [0, 1, 0]);
  const text3Y = useTransform(smoothProgress, [0.66, 0.78, 0.9], [18, 0, -18]);

  return (
    <section ref={containerRef} className="relative h-[220vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-background" />

        <motion.div
          style={{ opacity: glowOpacity, scale }}
          className="absolute w-[520px] h-[520px] bg-primary/18 rounded-full blur-[130px]"
        />

        <motion.div
          style={{ opacity: entryOpacity, scale, y }}
          className="relative w-[320px] h-[320px] md:w-[460px] md:h-[460px] lg:w-[560px] lg:h-[560px] flex items-center justify-center"
        >
          <canvas ref={canvasRef} className="w-full h-full" />

          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary/50 border-t-primary rounded-full animate-spin" />
            </div>
          )}
        </motion.div>

        <motion.div
          style={{ opacity: text1O, y: text1Y }}
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
          style={{ opacity: text2O, y: text2Y }}
          className="absolute top-[22%] right-4 md:right-16 lg:right-28 max-w-[180px] md:max-w-xs text-right"
        >
          <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-gradient">
            Full-Stack
          </h3>
          <p className="text-muted-foreground mt-1.5 text-xs md:text-sm">
            React, Python, Django &amp; Cloud
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: text3O, y: text3Y }}
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
