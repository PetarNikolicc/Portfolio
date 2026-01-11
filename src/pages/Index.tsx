import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  return (
    <div className="relative bg-background text-foreground overflow-x-hidden">
      <Navigation />
      
      <main>
        <HeroSection />
        
        <div id="about">
          <AboutSection />
        </div>
        
        <div id="skills">
          <SkillsSection />
        </div>
        
        <div id="experience">
          <ExperienceSection />
        </div>
        
        <div id="projects">
          <ProjectsSection />
        </div>
        
        <div id="contact">
          <ContactSection />
        </div>
      </main>
    </div>
  );
};

export default Index;
