import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

const skills = [
  { name: "Python", level: 95, category: "AI & ML" },
  { name: "TensorFlow / PyTorch", level: 90, category: "AI & ML" },
  { name: "Machine Learning", level: 92, category: "AI & ML" },
  { name: "Natural Language Processing", level: 88, category: "AI & ML" },
  { name: "React / TypeScript", level: 90, category: "Web" },
  { name: "Node.js", level: 85, category: "Web" },
  { name: "Cloud Services (AWS/GCP)", level: 82, category: "Infrastructure" },
  { name: "Docker / Kubernetes", level: 80, category: "Infrastructure" },
];

const SkillBar = ({ name, level, index }: { name: string; level: number; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="flex justify-between mb-2">
        <span className="text-foreground font-medium">{name}</span>
        <span className="text-muted-foreground">{level}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse-glow" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const SkillsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -10]);

  return (
    <section 
      ref={sectionRef}
      className="relative section-padding overflow-hidden bg-secondary/30"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container max-w-6xl mx-auto px-4">
        <ScrollReveal>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-4">
            <span className="text-gradient">Skills</span>
          </h2>
          <p className="text-muted-foreground text-center text-lg max-w-2xl mx-auto mt-4">
            Teknologier och verktyg jag behärskar för att bygga intelligenta lösningar
          </p>
        </ScrollReveal>

        <motion.div 
          style={{ rotateX, perspective: 1000 }}
          className="mt-16 grid md:grid-cols-2 gap-x-16 gap-y-6"
        >
          {skills.map((skill, index) => (
            <SkillBar 
              key={skill.name} 
              name={skill.name} 
              level={skill.level} 
              index={index}
            />
          ))}
        </motion.div>

        {/* Tech icons floating */}
        <ScrollReveal className="mt-20">
          <div className="flex flex-wrap justify-center gap-6">
            {['Python', 'React', 'TensorFlow', 'AWS', 'Docker', 'Node.js'].map((tech, i) => (
              <motion.div
                key={tech}
                className="glass px-6 py-3 rounded-full text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors cursor-default"
                whileHover={{ scale: 1.05, y: -5 }}
                animate={{ y: [0, -5, 0] }}
                transition={{ 
                  y: { duration: 3, repeat: Infinity, delay: i * 0.2 },
                  scale: { type: "spring", stiffness: 400 }
                }}
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default SkillsSection;
