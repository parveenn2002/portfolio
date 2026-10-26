import { Download } from 'lucide-react';
import { ButtonLink } from '../../../components/ui/ButtonLink.tsx';
import { ContactLinks } from '../../../components/ui/ContactLinks.tsx';
import { ContentText } from '../../../components/ui/ContentText.tsx';
import { Section } from '../../../components/ui/Section.tsx';
import { site } from '../../../config/site.ts';
import { careerContact } from '../../../content/career.ts';

export function ContactSection() {
  return (
    <Section
      id="contact"
      title={careerContact.heading}
      intro={
        <p>
          <ContentText>{careerContact.body}</ContentText>
        </p>
      }
    >
      <ContactLinks />

      <div className="mt-10">
        {site.resume.available ? (
          <ButtonLink href={site.resume.path} download icon={<Download size={18} />}>
            Download resume (PDF)
          </ButtonLink>
        ) : (
          import.meta.env.DEV && (
            // Development-only reminder; nothing is shown in production until the PDF exists.
            // Plain text, not a [CONFIRM] marker: the resume is optional, so it must not block release builds.
            <p className="rounded-xl border border-dashed border-confirm/50 p-5 text-sm text-confirm">
              Resume not published yet: add public/resume/resume.pdf, then set resume.available to true in
              src/config/site.ts.
            </p>
          )
        )}
      </div>
    </Section>
  );
}
