import { clamp, jitteredGrid, mulberry32, pointerForce, rgba, springStep } from '../engine/math.ts';
import { SpatialGrid } from '../engine/spatialGrid.ts';
import type { PointerState, Scene, ScenePalette, SceneSize } from '../engine/types.ts';

/**
 * Molecular network: nodes on a jittered lattice, each held to its anchor by a
 * damped spring, drifting gently, displaced by the pointer and connected to
 * nearby nodes by fine lines. Depth (z) scales size, brightness, drift and
 * parallax so the field reads as layered rather than flat.
 */
export interface NetworkOptions {
  /** CSS px² of canvas per node (lower = denser). */
  density: number;
  minNodes: number;
  maxNodes: number;
  /** Cap on narrow viewports. */
  maxNodesCompact: number;
  /** Max connection length in CSS px. */
  linkDistance: number;
  /** Max connections drawn per node (keeps dense areas readable). */
  maxLinksPerNode: number;
  pointerRadius: number;
  /** Peak pointer acceleration (px/frame²). Positive repels, negative attracts. */
  pointerStrength: number;
  /** Spring stiffness towards the anchor (per frame²). */
  spring: number;
  /** Velocity retained per frame (0–1). Lower = settles faster. */
  damping: number;
  /** Idle drift amplitude in px (nearest depth). */
  drift: number;
  /** Idle drift speed multiplier. */
  driftSpeed: number;
  /** Max parallax offset in px for the nearest depth, following the pointer. */
  parallax: number;
  /** Peak line opacity. */
  lineAlpha: number;
  /** Peak node opacity. */
  nodeAlpha: number;
  /** Fraction of nodes drawn in the accent colour. */
  accentShare: number;
  /** Fraction of nodes drawn as ringed "atoms". */
  atomShare: number;
  seed: number;
}

interface Node {
  /** Normalised anchor (0–1, may bleed slightly outside). */
  u: number;
  v: number;
  /** Anchor in px. */
  ax: number;
  ay: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Depth 0 (far) – 1 (near). */
  z: number;
  phase: number;
  fx: number;
  fy: number;
  accent: boolean;
  atom: boolean;
  links: number;
}

const INK_BUCKETS = 6;
const ACCENT_BUCKETS = 4;

export class NetworkScene implements Scene {
  private readonly opts: NetworkOptions;
  private nodes: Node[] = [];
  private width = 0;
  private height = 0;
  private linkCount = 0;
  private readonly grid = new SpatialGrid();
  // Line segments grouped by opacity so each group is one stroke() call.
  private readonly inkLines: number[][] = Array.from({ length: INK_BUCKETS }, () => []);
  private readonly accentLines: number[][] = Array.from({ length: ACCENT_BUCKETS }, () => []);
  private pointer: PointerState = { x: 0, y: 0, influence: 0, nx: 0, ny: 0 };

  constructor(options: NetworkOptions) {
    this.opts = options;
  }

  targetCount(size: SceneSize): number {
    const o = this.opts;
    const raw = Math.round(((size.width * size.height) / o.density) * size.quality);
    const max = size.compact ? o.maxNodesCompact : o.maxNodes;
    return clamp(raw, Math.min(o.minNodes, max), max);
  }

  resize(size: SceneSize): void {
    const { width, height } = size;
    if (width <= 0 || height <= 0) return;
    const count = this.targetCount(size);

    if (count !== this.nodes.length) {
      this.layout(count, width / height);
    }
    // Anchors follow the new size. Existing positions are kept, so nodes ease
    // to their new anchors instead of jumping.
    const firstLayout = this.width === 0;
    this.width = width;
    this.height = height;
    for (const n of this.nodes) {
      n.ax = n.u * width;
      n.ay = n.v * height;
      if (firstLayout || !Number.isFinite(n.x)) {
        n.x = n.ax;
        n.y = n.ay;
      }
    }
  }

  private layout(count: number, aspect: number): void {
    const rand = mulberry32(this.opts.seed);
    const points = jitteredGrid(count, aspect, rand);
    const previous = this.nodes;
    this.nodes = points.map(([u, v], i) => {
      const z = rand();
      const prev = previous[i];
      return {
        u,
        v,
        ax: 0,
        ay: 0,
        // Reuse the old node's position so a re-layout animates smoothly.
        x: prev ? prev.x : NaN,
        y: prev ? prev.y : NaN,
        vx: 0,
        vy: 0,
        z,
        phase: rand() * Math.PI * 2,
        fx: 0.6 + rand() * 0.7,
        fy: 0.5 + rand() * 0.7,
        accent: rand() < this.opts.accentShare,
        atom: rand() < this.opts.atomShare,
        links: 0,
      };
    });
  }

  settle(): void {
    for (const n of this.nodes) {
      n.x = n.ax;
      n.y = n.ay;
      n.vx = 0;
      n.vy = 0;
    }
    this.pointer = { x: 0, y: 0, influence: 0, nx: 0, ny: 0 };
  }

  update(dt: number, time: number, pointer: PointerState): void {
    const o = this.opts;
    this.pointer = pointer;
    const t = time * o.driftSpeed;
    const influence = pointer.influence;
    const strength = o.pointerStrength * influence;

    for (const n of this.nodes) {
      const depth = 0.35 + 0.65 * n.z;
      const tx =
        n.ax + Math.sin(t * n.fx + n.phase) * o.drift * depth + pointer.nx * o.parallax * n.z * influence;
      const ty =
        n.ay + Math.cos(t * n.fy + n.phase) * o.drift * depth + pointer.ny * o.parallax * n.z * influence;

      let fx = 0;
      let fy = 0;
      if (strength !== 0) {
        [fx, fy] = pointerForce(n.x - pointer.x, n.y - pointer.y, o.pointerRadius, strength * depth);
      }
      [n.x, n.vx] = springStep(n.x, n.vx, tx, fx, o.spring, o.damping, dt);
      [n.y, n.vy] = springStep(n.y, n.vy, ty, fy, o.spring, o.damping, dt);
    }
  }

  draw(ctx: CanvasRenderingContext2D, palette: ScenePalette): void {
    const o = this.opts;
    const nodes = this.nodes;
    ctx.clearRect(0, 0, this.width, this.height);
    if (nodes.length === 0) return;

    for (const bucket of this.inkLines) bucket.length = 0;
    for (const bucket of this.accentLines) bucket.length = 0;
    for (const n of nodes) n.links = 0;

    const L = o.linkDistance;
    const pad = L;
    this.grid.build(nodes, L, -pad, -pad, this.width + pad, this.height + pad);

    const p = this.pointer;
    const pr = o.pointerRadius;
    const pr2 = pr * pr;
    let links = 0;

    this.grid.forEachPair(L, (i, j, d2) => {
      const a = nodes[i]!;
      const b = nodes[j]!;
      if (a.links >= o.maxLinksPerNode || b.links >= o.maxLinksPerNode) return;
      a.links++;
      b.links++;
      links++;

      const closeness = 1 - Math.sqrt(d2) / L;
      const depth = 0.45 + 0.55 * ((a.z + b.z) / 2);
      const alpha = closeness * closeness * depth; // 0–1, scaled by lineAlpha at stroke time

      if (p.influence > 0.01) {
        const mx = (a.x + b.x) / 2 - p.x;
        const my = (a.y + b.y) / 2 - p.y;
        const m2 = mx * mx + my * my;
        if (m2 < pr2) {
          const near = (1 - Math.sqrt(m2) / pr) * p.influence;
          const level = clamp(Math.floor(near * ACCENT_BUCKETS), 0, ACCENT_BUCKETS - 1);
          this.accentLines[level]!.push(a.x, a.y, b.x, b.y);
          return;
        }
      }
      const level = clamp(Math.floor(alpha * INK_BUCKETS), 0, INK_BUCKETS - 1);
      this.inkLines[level]!.push(a.x, a.y, b.x, b.y);
    });
    this.linkCount = links;

    ctx.lineWidth = 0.75;
    this.strokeBuckets(ctx, this.inkLines, palette.ink, o.lineAlpha);
    this.strokeBuckets(ctx, this.accentLines, palette.accent, Math.min(1, o.lineAlpha * 2.4));

    // Nodes: three depth layers × two colours, plus atom rings.
    for (let layer = 0; layer < 3; layer++) {
      const layerAlpha = o.nodeAlpha * (0.4 + 0.3 * layer);
      for (const accent of [false, true]) {
        ctx.beginPath();
        let any = false;
        for (const n of nodes) {
          if (n.accent !== accent || Math.min(2, Math.floor(n.z * 3)) !== layer) continue;
          const r = (0.9 + n.z * 1.5) * (n.atom ? 1.5 : 1);
          ctx.moveTo(n.x + r, n.y);
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          any = true;
        }
        if (any) {
          ctx.fillStyle = rgba(accent ? palette.accent : palette.ink, layerAlpha);
          ctx.fill();
        }
      }
    }

    ctx.beginPath();
    for (const n of nodes) {
      if (!n.atom) continue;
      const r = (0.9 + n.z * 1.5) * 1.5 * 2.6;
      ctx.moveTo(n.x + r, n.y);
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    }
    ctx.lineWidth = 0.6;
    ctx.strokeStyle = rgba(palette.ink, o.nodeAlpha * 0.35);
    ctx.stroke();

    // Pointer-near nodes get a soft accent highlight.
    if (p.influence > 0.01) {
      ctx.beginPath();
      for (const n of nodes) {
        const dx = n.x - p.x;
        const dy = n.y - p.y;
        if (dx * dx + dy * dy > pr2 * 0.36) continue;
        const r = (0.9 + n.z * 1.5) * (n.atom ? 1.5 : 1) + 0.6;
        ctx.moveTo(n.x + r, n.y);
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      }
      ctx.fillStyle = rgba(palette.accent, Math.min(1, o.nodeAlpha * 1.3) * p.influence);
      ctx.fill();
    }
  }

  private strokeBuckets(
    ctx: CanvasRenderingContext2D,
    buckets: number[][],
    color: ScenePalette['ink'],
    peak: number,
  ): void {
    const n = buckets.length;
    for (let level = 0; level < n; level++) {
      const segs = buckets[level]!;
      if (segs.length === 0) continue;
      ctx.beginPath();
      for (let k = 0; k < segs.length; k += 4) {
        ctx.moveTo(segs[k]!, segs[k + 1]!);
        ctx.lineTo(segs[k + 2]!, segs[k + 3]!);
      }
      ctx.strokeStyle = rgba(color, peak * ((level + 1) / n));
      ctx.stroke();
    }
  }

  /** Mean distance of nodes from their anchors (px) — used by tests/diagnostics. */
  meanDisplacement(): number {
    if (this.nodes.length === 0) return 0;
    let sum = 0;
    for (const n of this.nodes) sum += Math.hypot(n.x - n.ax, n.y - n.ay);
    return sum / this.nodes.length;
  }

  /** Mean displacement of nodes within `radius` of a point. */
  displacementNear(x: number, y: number, radius: number): number {
    let sum = 0;
    let count = 0;
    for (const n of this.nodes) {
      if (Math.hypot(n.ax - x, n.ay - y) > radius) continue;
      sum += Math.hypot(n.x - n.ax, n.y - n.ay);
      count++;
    }
    return count ? sum / count : 0;
  }

  stats(): Record<string, number> {
    return { nodes: this.nodes.length, links: this.linkCount };
  }
}
