import type { Mode } from '../types/index.ts';

export const MODES: readonly Mode[] = ['career'];

export const DEFAULT_MODE: Mode = 'career';

export const modePath = (mode: Mode): string => `/${mode}`;
