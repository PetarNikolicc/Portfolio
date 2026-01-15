import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);

  return (
    <section 
      ref={sectionRef}
      className="relative section-padding overflow-hidden"
    >
      {/* Parallax background element */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
      </motion.div>

      <div className="container max-w-6xl mx-auto px-4">
        <ScrollReveal>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-4">
            <span className="text-gradient">Om mig</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal>
          <div className="max-w-3xl mx-auto mt-16">
            <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground leading-relaxed text-center">
              Utbildad{' '}
              <span className="text-foreground font-medium">AI-utvecklare</span>{' '}
              med stark bakgrund inom fullstack-utveckling och praktisk{' '}
              <span className="text-foreground font-medium">maskininlärning</span>. 
              Har byggt och driftsatt kompletta webb- och AI-lösningar end-to-end i produktionsmiljö, 
              från datamodellering och backend-arkitektur till användargränssnitt och affärskritiska flöden.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
            {
              number: "4",
              label: "Språk",
              description: "Svenska, Engelska, Spanska, Serbiska"
            },
            {
              number: "4+",
              label: "Kundprojekt",
              description: "Framgångsrikt levererade i produktion"
            },
            {
              number: "100%",
              label: "End-to-end",
              description: "Från idé till driftsättning"
            }
          ].map((stat, index) => (
            <ScrollReveal key={index}>
              <motion.div 
                className="glass rounded-2xl p-8 text-center group hover:border-primary/30 transition-colors duration-500"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-5xl md:text-6xl font-bold text-gradient">{stat.number}</span>
                <h3 className="text-xl font-semibold mt-4 text-foreground">{stat.label}</h3>
                <p className="text-muted-foreground mt-2">{stat.description}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
