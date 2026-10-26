import { clamp, frameLerp, lerp } from './math.ts';
import type { PointerState, Scene, ScenePalette } from './types.ts';

export interface StageOptions {
  scene: Scene;
  /** Resolves theme colours (e.g. from CSS variables). Called on start and resize. */
  palette: () => ScenePalette;
  /** Element whose size the canvas follows. Defaults to the canvas's parent. */
  container?: HTMLElement;
  /** Device-pixel-ratio cap; higher costs fill-rate for little visible gain. */
  maxDpr?: number;
  /** Viewport width (CSS px) below which scenes use their compact budget. */
  compactBelow?: number;
  /** Pointer position smoothing per 60fps frame (0–1). */
  pointerSmoothing?: number;
  /** Average frame interval (ms) above which the governor lowers quality. */
  frameBudgetMs?: number;
  /** Lowest quality the governor may reach (0–1). */
  minQuality?: number;
  /** Called once after the first frame is drawn (e.g. to fade the canvas in). */
  onFirstFrame?: () => void;
  /** Override for tests; defaults to the prefers-reduced-motion media query. */
  reducedMotion?: boolean;
}

export interface StageStats {
  running: boolean;
  reducedMotion: boolean;
  visible: boolean;
  pageVisible: boolean;
  quality: number;
  fps: number;
  frames: number;
  dpr: number;
  width: number;
  height: number;
  [key: string]: number | boolean;
}

/**
 * Owns a canvas: sizing (incl. high-DPI), the requestAnimationFrame loop,
 * smoothed pointer input, pausing when off-screen or hidden, reduced motion,
 * an adaptive quality governor and complete teardown. Knows nothing about
 * React; the scene knows nothing about the DOM.
 */
export class CanvasStage {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly scene: Scene;
  private readonly container: HTMLElement;
  private readonly opts: Required<
    Pick<StageOptions, 'maxDpr' | 'compactBelow' | 'pointerSmoothing' | 'frameBudgetMs' | 'minQuality'>
  > &
    StageOptions;

  private palette: ScenePalette;
  private started = false;
  private destroyed = false;
  private rafId = 0;
  private lastTime = 0;
  private elapsed = 0;
  private frames = 0;
  private firstFrameDone = false;

  private width = 0;
  private height = 0;
  private dpr = 1;
  private quality = 1;
  private frameEma = 16.7;
  private slowFrames = 0;

  private visible = true;
  private pageVisible = true;
  private reduced = false;

  private rawX = 0;
  private rawY = 0;
  private hasPointer = false;
  private pointer: PointerState = { x: 0, y: 0, influence: 0, nx: 0, ny: 0 };

  private resizeObserver?: ResizeObserver;
  private intersectionObserver?: IntersectionObserver;
  private motionQuery?: MediaQueryList;

  constructor(canvas: HTMLCanvasElement, options: StageOptions) {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) throw new Error('CanvasStage: 2D context unavailable');
    const container = options.container ?? canvas.parentElement;
    if (!container) throw new Error('CanvasStage: canvas needs a container element');

    this.canvas = canvas;
    this.ctx = ctx;
    this.scene = options.scene;
    this.container = container;
    this.opts = {
      maxDpr: 2,
      compactBelow: 640,
      pointerSmoothing: 0.16,
      frameBudgetMs: 26,
      minQuality: 0.4,
      ...options,
    };
    this.palette = options.palette();
  }

  start(): void {
    if (this.started || this.destroyed) return;
    this.started = true;

    if (this.opts.reducedMotion !== undefined) {
      this.reduced = this.opts.reducedMotion;
    } else if (typeof matchMedia === 'function') {
      this.motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
      this.reduced = this.motionQuery.matches;
      this.motionQuery.addEventListener('change', this.onMotionChange);
    }

    this.pageVisible = !document.hidden;
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerdown', this.onPointerMove, { passive: true });
    window.addEventListener('pointerup', this.onPointerEnd, { passive: true });
    window.addEventListener('pointercancel', this.onPointerEnd, { passive: true });
    document.documentElement.addEventListener('pointerleave', this.onPointerLeave);
    window.addEventListener('blur', this.onPointerLeave);

    this.resizeObserver = new ResizeObserver(this.onResize);
    this.resizeObserver.observe(this.container);
    this.intersectionObserver = new IntersectionObserver(this.onIntersect);
    this.intersectionObserver.observe(this.canvas);

    this.measure();
    this.sync();
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.stopLoop();
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.motionQuery?.removeEventListener('change', this.onMotionChange);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerdown', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerEnd);
    window.removeEventListener('pointercancel', this.onPointerEnd);
    document.documentElement.removeEventListener('pointerleave', this.onPointerLeave);
    window.removeEventListener('blur', this.onPointerLeave);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  get stats(): StageStats {
    return {
      running: this.rafId !== 0,
      reducedMotion: this.reduced,
      visible: this.visible,
      pageVisible: this.pageVisible,
      quality: this.quality,
      fps: Math.round(1000 / this.frameEma),
      frames: this.frames,
      dpr: this.dpr,
      width: this.width,
      height: this.height,
      ...this.scene.stats(),
    };
  }

  // ---------- lifecycle ----------

  /** Start or stop the loop to match the current conditions. */
  private sync(): void {
    const shouldRun = this.started && !this.destroyed && !this.reduced && this.visible && this.pageVisible;
    if (shouldRun && this.rafId === 0) {
      this.lastTime = 0;
      this.slowFrames = 0;
      this.rafId = requestAnimationFrame(this.tick);
    } else if (!shouldRun) {
      this.stopLoop();
    }
    if (this.reduced && this.started && !this.destroyed) this.drawStatic();
  }

  private stopLoop(): void {
    if (this.rafId !== 0) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  private tick = (now: number): void => {
    this.rafId = 0;
    if (this.destroyed) return;

    const interval = this.lastTime ? clamp(now - this.lastTime, 0, 100) : 16.7;
    this.lastTime = now;
    const dt = Math.min(interval / 16.667, 3);
    this.elapsed += interval / 1000;
    this.frames++;

    this.updatePointer(dt);
    this.scene.update(dt, this.elapsed, this.pointer);
    this.scene.draw(this.ctx, this.palette);
    this.governor(interval);

    if (!this.firstFrameDone) {
      this.firstFrameDone = true;
      this.opts.onFirstFrame?.();
    }
    this.rafId = requestAnimationFrame(this.tick);
  };

  /** Lower density if frames are consistently slow. Never raises it again, to avoid oscillation. */
  private governor(interval: number): void {
    this.frameEma = lerp(this.frameEma, interval, 0.1);
    if (this.frames < 60 || this.quality <= this.opts.minQuality) return;
    this.slowFrames = this.frameEma > this.opts.frameBudgetMs ? this.slowFrames + 1 : 0;
    if (this.slowFrames >= 90) {
      this.quality = Math.max(this.opts.minQuality, this.quality - 0.2);
      this.slowFrames = 0;
      this.frameEma = 16.7;
      this.resizeScene();
    }
  }

  private drawStatic(): void {
    this.scene.settle();
    this.scene.draw(this.ctx, this.palette);
    if (!this.firstFrameDone) {
      this.firstFrameDone = true;
      this.opts.onFirstFrame?.();
    }
  }

  // ---------- sizing ----------

  private measure(): void {
    const rect = this.container.getBoundingClientRect();
    this.applySize(rect.width, rect.height);
  }

  private applySize(width: number, height: number): void {
    if (width <= 0 || height <= 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, this.opts.maxDpr);
    if (width === this.width && height === this.height && dpr === this.dpr) return;
    this.width = width;
    this.height = height;
    this.dpr = dpr;
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.palette = this.opts.palette();
    this.resizeScene();
    // Resizing clears the bitmap; redraw now rather than waiting a frame.
    if (this.reduced) this.drawStatic();
    else if (this.firstFrameDone) this.scene.draw(this.ctx, this.palette);
  }

  private resizeScene(): void {
    this.scene.resize({
      width: this.width,
      height: this.height,
      quality: this.quality,
      compact: window.innerWidth < this.opts.compactBelow,
    });
  }

  // ---------- pointer ----------

  private updatePointer(dt: number): void {
    const p = this.pointer;
    let target = 0;
    if (this.hasPointer && !this.reduced) {
      const rect = this.canvas.getBoundingClientRect();
      const x = this.rawX - rect.left;
      const y = this.rawY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (inside) {
        target = 1;
        // Snap rather than sweep across the canvas when the pointer re-enters.
        if (p.influence < 0.02) {
          p.x = x;
          p.y = y;
        }
        const k = frameLerp(this.opts.pointerSmoothing, dt);
        p.x = lerp(p.x, x, k);
        p.y = lerp(p.y, y, k);
        p.nx = lerp(p.nx, clamp((x / rect.width - 0.5) * 2, -1, 1), frameLerp(0.05, dt));
        p.ny = lerp(p.ny, clamp((y / rect.height - 0.5) * 2, -1, 1), frameLerp(0.05, dt));
      }
    }
    p.influence = lerp(p.influence, target, frameLerp(target > p.influence ? 0.08 : 0.04, dt));
    if (p.influence < 0.001) p.influence = 0;
  }

  // ---------- event handlers (arrow functions keep `this` and stable identity for removal) ----------

  private onPointerMove = (e: PointerEvent): void => {
    this.rawX = e.clientX;
    this.rawY = e.clientY;
    this.hasPointer = true;
  };

  private onPointerEnd = (e: PointerEvent): void => {
    if (e.pointerType !== 'mouse') this.hasPointer = false;
  };

  private onPointerLeave = (): void => {
    this.hasPointer = false;
  };

  private onResize = (entries: ResizeObserverEntry[]): void => {
    const box = entries[0]?.contentRect;
    if (box) this.applySize(box.width, box.height);
  };

  private onIntersect = (entries: IntersectionObserverEntry[]): void => {
    const entry = entries[entries.length - 1];
    if (!entry) return;
    this.visible = entry.isIntersecting;
    this.sync();
  };

  private onVisibilityChange = (): void => {
    this.pageVisible = !document.hidden;
    this.sync();
  };

  private onMotionChange = (e: MediaQueryListEvent): void => {
    this.reduced = e.matches;
    if (this.reduced) this.pointer.influence = 0;
    this.sync();
  };
}
