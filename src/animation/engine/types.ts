/** RGB triple, 0–255. Alpha is applied per draw call. */
export type Rgb = readonly [number, number, number];

export interface ScenePalette {
  /** Primary foreground (lines, most nodes). */
  ink: Rgb;
  /** Highlight colour (pointer-near elements, accent nodes). */
  accent: Rgb;
}

export interface SceneSize {
  /** CSS pixels. */
  width: number;
  height: number;
  /** 0–1 density multiplier, lowered by the performance governor. */
  quality: number;
  /** True for narrow viewports; scenes use fewer elements. */
  compact: boolean;
}

/** Pointer as seen by a scene, already smoothed by the stage. */
export interface PointerState {
  /** Position in CSS pixels relative to the canvas. */
  x: number;
  y: number;
  /** 0–1: eased presence. 0 = no pointer (left the page, touch ended, reduced motion). */
  influence: number;
  /** -1–1 offset of the pointer from the canvas centre, for parallax. */
  nx: number;
  ny: number;
}

/**
 * A scene owns its elements and drawing. The stage owns the canvas, timing,
 * pointer, sizing and lifecycle. Scenes never touch the DOM.
 */
export interface Scene {
  resize(size: SceneSize): void;
  /** Advance the simulation. `dt` is in 60 fps frames (1 ≈ 16.7 ms); `time` in seconds. */
  update(dt: number, time: number, pointer: PointerState): void;
  /** Put every element at rest (used for the reduced-motion static frame). */
  settle(): void;
  draw(ctx: CanvasRenderingContext2D, palette: ScenePalette): void;
  stats(): Record<string, number>;
}

export const NO_POINTER: PointerState = { x: -1e6, y: -1e6, influence: 0, nx: 0, ny: 0 };
