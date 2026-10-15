import type { AnchorHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'quiet';
type Size = 'sm' | 'md';

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  size?: Size;
  /** Optional trailing icon (decorative). */
  icon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-ink hover:bg-ink',
  secondary: 'border border-line text-ink hover:border-accent hover:text-accent',
  quiet: 'text-ink underline decoration-line underline-offset-[6px] hover:decoration-accent px-0!',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-12 px-6 text-[0.975rem]',
};

/**
 * Link styled as a button. Use for navigation and downloads; real actions
 * (submitting, toggling) use <button>. External links open in a new tab and
 * say so to screen readers.
 */
export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  children,
  ...rest
}: ButtonLinkProps) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors duration-200 ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
      {icon && (
        <span aria-hidden="true" className="-mr-1 inline-flex">
          {icon}
        </span>
      )}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
