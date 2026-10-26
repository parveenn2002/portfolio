import { Menu, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { modeNavigation } from '../../config/navigation.ts';
import { site } from '../../config/site.ts';
import { useScrolled } from '../../hooks/useScrolled.ts';
import type { Mode } from '../../types/index.ts';
import { ButtonLink } from '../ui/ButtonLink.tsx';
import { ContentText } from '../ui/ContentText.tsx';

const DESKTOP_QUERY = '(min-width: 48rem)';

/**
 * Fixed header: transparent over the hero, solid once scrolled. On small
 * screens the navigation collapses into a disclosure menu (not a modal), so
 * focus is never trapped: Escape, an outside click, a link click or growing
 * to desktop width all close it.
 */
export function SiteHeader({ mode }: { mode: Mode }) {
  const nav = modeNavigation[mode];
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const hasMenu = nav.items.length > 0 || nav.cta;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const desktop = matchMedia(DESKTOP_QUERY);
    const onDesktop = () => desktop.matches && setOpen(false);

    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    desktop.addEventListener('change', onDesktop);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      desktop.removeEventListener('change', onDesktop);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color] duration-300 ${
        solid ? 'border-line bg-canvas/85 backdrop-blur-md' : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-(--header-height) max-w-content items-center justify-between gap-6 px-6 sm:px-10">
        <a
          href="#top"
          className="min-w-0 truncate font-display text-[1.05rem] font-semibold tracking-tight text-ink"
        >
          <ContentText>{site.person.name}</ContentText>
        </a>

        {hasMenu && (
          <div className="hidden items-center gap-10 md:flex">
            {nav.items.length > 0 && (
              <nav aria-label="Main">
                <ul className="flex items-center gap-8 text-[0.95rem]">
                  {nav.items.map((item) => (
                    <li key={item.href}>
                      <a href={item.href} className="text-muted transition-colors hover:text-ink">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            {nav.cta && (
              <ButtonLink href={nav.cta.href} size="sm" variant="secondary">
                {nav.cta.label}
              </ButtonLink>
            )}
          </div>
        )}

        {hasMenu && (
          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        )}
      </div>

      {open && (
          <div id={menuId} className="drop-in md:hidden">
            <nav aria-label="Main" className="px-6 pt-2 pb-8 sm:px-10">
              <ul>
                {nav.items.map((item) => (
                  <li key={item.href} className="border-b border-line">
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block py-4 font-display text-xl text-ink"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              {nav.cta && (
                <ButtonLink
                  href={nav.cta.href}
                  onClick={() => setOpen(false)}
                  className="mt-6 w-full"
                >
                  {nav.cta.label}
                </ButtonLink>
              )}
            </nav>
          </div>
      )}
    </header>
  );
}
