/**
 * Small "atom" glyph from the molecular motif. Its fill encodes meaning
 * (defined where it's used), echoing the hero network.
 */
type NodeStyle = 'solid-accent' | 'ring-accent' | 'solid-ink' | 'ring-muted';

const styles: Record<NodeStyle, string> = {
  'solid-accent': 'bg-accent',
  'ring-accent': 'border border-accent',
  'solid-ink': 'bg-muted',
  'ring-muted': 'border border-muted',
};

export function NodeMark({ style }: { style: NodeStyle }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block size-[7px] shrink-0 -translate-y-px rounded-full ${styles[style]}`}
    />
  );
}

export type { NodeStyle };
