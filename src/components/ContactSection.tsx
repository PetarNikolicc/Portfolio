import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
const ContactSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px"
  });
  const socialLinks = [{
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/petarnikolic/",
    icon: "in"
  }, {
    name: "Email",
    href: "mailto:petar-nikolic@outlook.com",
    icon: "@"
  }, {
    name: "Phone",
    href: "tel:+46733943233",
    icon: "☎"
  }];
  return <section ref={ref} className="relative section-padding overflow-hidden">
      {/* Background glow */}
      <motion.div initial={{
      opacity: 0
    }} animate={isInView ? {
      opacity: 1
    } : {}} transition={{
      duration: 1
    }} className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />
      </motion.div>

      <div className="container max-w-4xl mx-auto px-4 text-center">
        <ScrollReveal>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
            <span className="text-gradient">Låt oss prata</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mt-4">
            Oavsett om du behöver hjälp med webbutveckling, AI-lösningar eller strategisk rådgivning – jag finns här för att hjälpa dig framåt.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <motion.a href="mailto:petar-nikolic@outlook.com" className="inline-block mt-12 px-8 py-4 text-lg font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors glow" whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.98
        }}>
            Kontakta mig
          </motion.a>
        </ScrollReveal>

        <ScrollReveal className="mt-16">
          <div className="flex justify-center gap-6">
            {socialLinks.map((link, index) => <motion.a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center glass rounded-full text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all" whileHover={{
            scale: 1.1,
            y: -5
          }} initial={{
            opacity: 0,
            y: 20
          }} animate={isInView ? {
            opacity: 1,
            y: 0
          } : {}} transition={{
            delay: index * 0.1
          }}>
                <span className="font-bold">{link.icon}</span>
              </motion.a>)}
          </div>
        </ScrollReveal>

        <motion.p initial={{
        opacity: 0
      }} animate={isInView ? {
        opacity: 1
      } : {}} transition={{
        delay: 0.8
      }} className="mt-20 text-muted-foreground text-sm">
          
          
          © 2025 Petar Nikolic  
         
         
        </motion.p>
      </div>
    </section>;
};
export default ContactSection;