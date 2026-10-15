import { InteractiveBackground } from '../../../animation/InteractiveBackground.tsx';
import { ButtonLink } from '../../../components/ui/ButtonLink.tsx';
import { ContentText } from '../../../components/ui/ContentText.tsx';
import { site } from '../../../config/site.ts';
import { careerHero } from '../../../content/career.ts';

/**
 * The page's one orchestrated moment: the molecular network fades in behind,
 * and the introduction rises into place once.
 */
export function CareerHero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <InteractiveBackground preset="career-network" />
      {/* Scrim: keeps the text area calm and fades the network into the page.
          (A CSS mask on the canvas would do the fade too, but re-compositing a
          mask every frame halved the frame rate at 1920×1080 in testing.) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-full bg-linear-to-t from-canvas via-canvas/80 to-canvas/30 sm:h-3/4 sm:to-transparent"
      />
      {/* Wide screens: text column stays calm; the network lives to its right. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-2/3 bg-linear-to-r from-canvas/80 via-canvas/40 to-transparent lg:block"
      />

      <div className="relative mx-auto flex min-h-[max(40rem,min(100svh,64rem))] max-w-content flex-col justify-end px-6 pt-[calc(var(--header-height)+4rem)] pb-14 sm:px-10 sm:pb-20">
        <h1
          id="hero-title"
          className="rise max-w-[14ch] font-display text-hero font-semibold text-balance text-ink"
        >
          {careerHero.heading}
        </h1>
        <p className="rise mt-8 max-w-[38rem] text-lede text-muted [--rise-delay:120ms]">
          <ContentText>{careerHero.lede}</ContentText>
        </p>
        <div className="rise mt-10 flex flex-wrap gap-3 [--rise-delay:240ms]">
          <ButtonLink href="#projects">See selected projects</ButtonLink>
          {site.resume.available ? (
            <ButtonLink href={site.resume.path} variant="secondary" download>
              Download resume
            </ButtonLink>
          ) : (
            <ButtonLink href="#contact" variant="secondary">
              Get in touch
            </ButtonLink>
          )}
        </div>

        <dl className="rise [--rise-delay:360ms] mt-16 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-6 sm:mt-24 lg:grid-cols-4">
          {careerHero.facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-sm text-muted">{fact.label}</dt>
              <dd className="mt-1 text-[0.975rem] text-ink">
                <ContentText>{fact.value}</ContentText>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
