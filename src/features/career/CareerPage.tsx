import { ModeLayout } from '../../components/layout/ModeLayout.tsx';
import { ApproachSection } from './sections/ApproachSection.tsx';
import { CareerHero } from './sections/CareerHero.tsx';
import { CaseStudiesSection } from './sections/CaseStudiesSection.tsx';
import { ContactSection } from './sections/ContactSection.tsx';
import { ExperienceSection } from './sections/ExperienceSection.tsx';
import { LearningSection } from './sections/LearningSection.tsx';
import { ProjectsSection } from './sections/ProjectsSection.tsx';
import { SkillsSection } from './sections/SkillsSection.tsx';

export function CareerPage() {
  return (
    <ModeLayout mode="career">
      <CareerHero />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <CaseStudiesSection />
      <ApproachSection />
      <LearningSection />
      <ContactSection />
    </ModeLayout>
  );
}
