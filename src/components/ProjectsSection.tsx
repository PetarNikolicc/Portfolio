import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

const projects = [
  {
    title: "Glasnova.se",
    description: "Modern webbapplikation för glasmästeri med AI-driven kundservice och online bokningssystem.",
    image: "/placeholder.svg",
    tags: ["React", "TypeScript", "AI", "Supabase"],
    color: "from-cyan-500/20 to-blue-500/20",
    link: "https://glasnova.se"
  },
  {
    title: "AI Chat Assistant",
    description: "En intelligent chattbot byggd med GPT-4 och RAG-teknologi för kundservice automation.",
    image: "/placeholder.svg",
    tags: ["Python", "LangChain", "React", "FastAPI"],
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    title: "Fler projekt kommer...",
    description: "Jobbar kontinuerligt med nya spännande AI-projekt och moderna webbapplikationer.",
    image: "/placeholder.svg",
    tags: ["AI", "React", "TypeScript", "Innovation"],
    color: "from-purple-500/20 to-pink-500/20"
  }
];

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  color: string;
  link?: string;
}

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="group relative"
    >
      <motion.div
        className="relative glass rounded-3xl overflow-hidden"
        whileHover={{ scale: 1.02, y: -10 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        {/* Image container with parallax */}
        <div className="relative h-64 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-secondary"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0.5 }}
                whileHover={{ opacity: 1 }}
                className="text-6xl text-muted-foreground/30"
              >
                ⚡
              </motion.div>
            </div>
          </motion.div>
          
          {/* Shine effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
          />
        </div>

        {/* Content */}
        <div className="relative p-6 md:p-8">
          <h3 className="text-2xl font-bold text-foreground group-hover:text-gradient transition-all duration-300">
            {project.title}
          </h3>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-6">
            {project.tags.map((tag) => (
              <span 
                key={tag}
                className="px-3 py-1 text-xs rounded-full bg-secondary/80 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* View project link */}
          {project.link ? (
            <motion.a 
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
              initial={{ x: -10 }}
              whileHover={{ x: 0 }}
            >
              <span className="text-sm font-medium">Besök sidan</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </motion.a>
          ) : (
            <motion.div 
              className="mt-6 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
              initial={{ x: -10 }}
              whileHover={{ x: 0 }}
            >
              <span className="text-sm font-medium">Se projekt</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundX = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <section 
      ref={sectionRef}
      className="relative section-padding overflow-hidden bg-secondary/30"
    >
      {/* Animated background */}
      <motion.div 
        style={{ x: backgroundX }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      </motion.div>

      {/* Decorative lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container max-w-6xl mx-auto px-4">
        <ScrollReveal>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-4">
            <span className="text-gradient">Projekt</span>
          </h2>
          <p className="text-muted-foreground text-center text-lg max-w-2xl mx-auto mt-4">
            Utvalda projekt som visar min expertis inom AI och utveckling
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
