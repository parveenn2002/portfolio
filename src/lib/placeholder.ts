/** Marker for content that needs the owner's confirmation before publishing. */
export const PLACEHOLDER_MARK = '[CONFIRM';

export const isPlaceholder = (value: string): boolean => value.includes(PLACEHOLDER_MARK);
