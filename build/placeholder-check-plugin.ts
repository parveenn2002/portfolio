import type { Plugin } from 'vite';

/**
 * Counts unresolved `[CONFIRM: …]` placeholders in source modules.
 * `npm run build` warns; `npm run build:release` (mode "release") fails, so
 * placeholder text can't be deployed by accident. Doc comments that only show
 * the marker format (`[CONFIRM: …]`) are ignored.
 */
const PLACEHOLDER = /\[CONFIRM:(?!\s*…\])[^\]]*\]/g;

export function placeholderCheckPlugin(): Plugin {
  let release = false;
  const found = new Map<string, string[]>();
  return {
    name: 'placeholder-check',
    apply: 'build',
    configResolved(config) {
      release = config.mode === 'release';
    },
    buildStart() {
      found.clear();
    },
    transform(code, id) {
      if (!id.includes('/src/') || id.includes('node_modules')) return null;
      const matches = code.match(PLACEHOLDER);
      if (matches) found.set(id.slice(id.indexOf('/src/') + 1), [...new Set(matches)]);
      return null;
    },
    generateBundle() {
      const total = [...found.values()].reduce((n, list) => n + list.length, 0);
      if (total === 0) return;
      const summary = `${total} unresolved [CONFIRM: …] placeholders in ${found.size} files — see CONTENT_CHECKLIST.md`;
      if (release) {
        const detail = [...found].map(([file, list]) => `  ${file}\n${list.map((m) => `    ${m}`).join('\n')}`).join('\n');
        this.error(`${summary}\n${detail}`);
      }
      this.warn(summary);
    },
  };
}
