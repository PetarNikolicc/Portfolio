import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

const experiences = [
  {
    year: "10/2025 - Nu",
    title: "Fullstack Developer",
    company: "Glasnova",
    description: "Utvecklade och ansvarade för hela Glasnovas webbplattform med kundvänd webbapplikation och internt adminsystem. Byggde frontend i React/TypeScript och backend med Supabase/PostgreSQL. Implementerade Stripe-betalning, roll- och behörighetsstyrning.",
    technologies: ["React", "TypeScript", "Supabase", "PostgreSQL", "Stripe"]
  },
  {
    year: "07/2025 - 10/2025",
    title: "Fullstack Developer",
    company: "Röntgendirekt AB",
    description: "Utvecklade den kundvända webbapplikationen end-to-end med fokus på användarflöden, prestanda och driftsäkerhet. Frontend i React, backend med Flask och Firebase för datalagring.",
    technologies: ["React", "Flask", "Firebase", "Docker", "Nginx"]
  },
  {
    year: "02/2025 - 05/2025",
    title: "Python / Machine Learning Developer",
    company: "Consid AB",
    description: "Utvecklade ML-applikation för att förutse materialegenskaper baserat på historisk produktionsdata. Implementerade Random Forest-modeller och byggde Flask-baserat API för prediktioner.",
    technologies: ["Python", "Machine Learning", "Flask", "Random Forest", "API"]
  },
  {
    year: "11/2024 - 02/2025",
    title: "Backend / Data Engineer",
    company: "EDTools AB - mappi.ai",
    description: "Arbetade på AI-baserad produkt med fokus på backend- och datainfrastruktur. Designade databasstruktur och REST-API i Django för användar- och organisationshantering.",
    technologies: ["Django", "Python", "REST API", "PostgreSQL"]
  }
];

const TimelineItem = ({ experience, index }: { experience: typeof experiences[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Content card */}
      <motion.div 
        className="flex-1 glass rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-all duration-500 group"
        whileHover={{ scale: 1.02 }}
      >
        <span className="text-primary font-medium text-sm">{experience.year}</span>
        <h3 className="text-xl md:text-2xl font-bold text-foreground mt-2">{experience.title}</h3>
        <p className="text-muted-foreground mt-1">{experience.company}</p>
        <p className="text-muted-foreground mt-4 leading-relaxed">{experience.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {experience.technologies.map((tech) => (
            <span 
              key={tech}
              className="px-3 py-1 text-xs rounded-full bg-secondary text-muted-foreground group-hover:text-foreground transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Timeline dot - hidden on mobile */}
      <div className="hidden md:flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-4 h-4 rounded-full bg-primary glow"
        />
      </div>

      {/* Spacer for alignment */}
      <div className="hidden md:block flex-1" />
    </motion.div>
  );
};

const ExperienceSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section 
      ref={sectionRef}
      className="relative section-padding overflow-hidden"
    >
      <div className="container max-w-6xl mx-auto px-4">
        <ScrollReveal>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-4">
            <span className="text-gradient">Erfarenheter</span>
          </h2>
          <p className="text-muted-foreground text-center text-lg max-w-2xl mx-auto mt-4">
            Min resa genom tech-industrin
          </p>
        </ScrollReveal>

        <div className="relative mt-20">
          {/* Animated timeline line - hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border">
            <motion.div 
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-primary to-accent"
            />
          </div>

          {/* Timeline items */}
          <div className="space-y-12 md:space-y-16">
            {experiences.map((experience, index) => (
              <TimelineItem key={index} experience={experience} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
