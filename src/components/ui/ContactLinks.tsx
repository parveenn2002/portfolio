import { ArrowUpRight, Mail, MessageCircle } from 'lucide-react';
import { site } from '../../config/site.ts';
import { contactItems, type ContactItem } from '../../lib/contact.ts';
import { ContentText } from './ContentText.tsx';

interface ContactLinksProps {
  /** "list": labelled rows for a contact section. "inline": compact row for footers. */
  variant?: 'list' | 'inline';
  whatsappMessage?: string;
  emailSubject?: string;
}

function Icon({ item }: { item: ContactItem }) {
  const props = { size: 18, strokeWidth: 1.75, 'aria-hidden': true } as const;
  if (item.kind === 'email') return <Mail {...props} />;
  if (item.kind === 'whatsapp') return <MessageCircle {...props} />;
  return <ArrowUpRight {...props} />;
}

/** Contact details from src/config/site.ts. Unpublished (empty) values are hidden. */
export function ContactLinks({ variant = 'list', whatsappMessage, emailSubject }: ContactLinksProps) {
  const items = contactItems(site, { whatsappMessage, emailSubject });
  if (items.length === 0) return null;

  if (variant === 'inline') {
    return (
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {items.map((item) => (
          <li key={item.kind}>
            {item.href ? (
              <a
                href={item.href}
                {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="text-muted transition-colors hover:text-ink"
              >
                {item.label}
                {item.external && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            ) : (
              <span className="text-muted">
                {item.label}: <ContentText>{item.display}</ContentText>
              </span>
            )}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((item) => {
        const content = (
          <>
            <span className="flex items-center gap-3 text-muted transition-colors group-hover:text-accent">
              <Icon item={item} />
              {item.label}
            </span>
            <span className="min-w-0 truncate text-right text-ink transition-colors group-hover:text-accent">
              <ContentText>{item.display}</ContentText>
            </span>
          </>
        );
        return (
          <li key={item.kind}>
            {item.href ? (
              <a
                href={item.href}
                {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group flex items-center justify-between gap-6 py-5"
              >
                {content}
                {item.external && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            ) : (
              <div className="flex items-center justify-between gap-6 py-5">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
