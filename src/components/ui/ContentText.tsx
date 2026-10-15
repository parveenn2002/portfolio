import { isPlaceholder } from '../../lib/placeholder.ts';

/**
 * Renders content text. Values containing a [CONFIRM: …] marker are
 * highlighted so unreviewed content is impossible to miss before publishing.
 */
export function ContentText({ children }: { children: string }) {
  if (!isPlaceholder(children)) return <>{children}</>;
  return (
    <span
      className="text-confirm underline decoration-confirm/60 decoration-dashed decoration-1 underline-offset-4"
      title="Placeholder — replace before publishing"
    >
      {children}
    </span>
  );
}
