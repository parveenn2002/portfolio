/**
 * Pure helpers for the animation engine. No DOM access — unit-tested in
 * tests/animation/math.test.ts.
 */
import type { Rgb } from './types.ts';

export const clamp = (v: number, min: number, max: number): number =>
  v < min ? min : v > max ? max : v;

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Frame-rate independent lerp factor: `rate` is the per-60fps-frame factor. */
export const frameLerp = (rate: number, dt: number): number => 1 - Math.pow(1 - rate, dt);

/** Deterministic PRNG (mulberry32), so layouts are stable and testable. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Radial pointer force with smooth quadratic falloff. Returns the force on a
 * point at offset (dx, dy) from the pointer — positive strength pushes away
 * (repel), negative pulls in (attract). Zero at and beyond `radius`.
 */
export function pointerForce(
  dx: number,
  dy: number,
  radius: number,
  strength: number,
): [number, number] {
  const d2 = dx * dx + dy * dy;
  if (d2 >= radius * radius || d2 < 1e-6) return [0, 0];
  const d = Math.sqrt(d2);
  const falloff = 1 - d / radius;
  const f = (falloff * falloff * strength) / d;
  return [dx * f, dy * f];
}

/**
 * One damped-spring integration step (semi-implicit Euler) along one axis.
 * `extraAccel` adds external forces (pointer). Returns [position, velocity].
 * `damping` is the velocity retained per 60fps frame (0–1).
 */
export function springStep(
  pos: number,
  vel: number,
  target: number,
  extraAccel: number,
  spring: number,
  damping: number,
  dt: number,
): [number, number] {
  const accel = (target - pos) * spring + extraAccel;
  const v = (vel + accel * dt) * Math.pow(damping, dt);
  return [pos + v * dt, v];
}

/**
 * Evenly spread points in the unit square: a grid sized to `count` with each
 * point jittered inside its cell. Organic-looking, but without random clumps
 * or holes. `aspect` = width / height. Coordinates may extend `bleed` beyond
 * 0–1 so connections run off the edges.
 */
export function jitteredGrid(
  count: number,
  aspect: number,
  rand: () => number,
  jitter = 0.38,
  bleed = 0.04,
): Array<[number, number]> {
  if (count <= 0) return [];
  const cols = Math.max(1, Math.round(Math.sqrt(count * aspect)));
  const rows = Math.max(1, Math.ceil(count / cols));
  const span = 1 + bleed * 2;
  const points: Array<[number, number]> = [];
  for (let r = 0; r < rows && points.length < count; r++) {
    for (let c = 0; c < cols && points.length < count; c++) {
      const u = (c + 0.5 + (rand() - 0.5) * 2 * jitter) / cols;
      const v = (r + 0.5 + (rand() - 0.5) * 2 * jitter) / rows;
      points.push([u * span - bleed, v * span - bleed]);
    }
  }
  return points;
}

/** Parse "#rgb", "#rrggbb" or "rgb(r g b)" / "rgb(r, g, b)". Returns fallback if unparseable. */
export function parseColor(input: string, fallback: Rgb): Rgb {
  const s = input.trim();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(s)?.[1];
  if (hex) {
    const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;
    return [
      parseInt(full.slice(0, 2), 16),
      parseInt(full.slice(2, 4), 16),
      parseInt(full.slice(4, 6), 16),
    ];
  }
  const rgb = /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i.exec(s);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  return fallback;
}

export const rgba = ([r, g, b]: Rgb, a: number): string =>
  `rgba(${r},${g},${b},${Math.round(clamp(a, 0, 1) * 1000) / 1000})`;
