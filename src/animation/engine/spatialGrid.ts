/**
 * Uniform spatial hash for "which points are within d of each other" queries.
 * Turns the O(n²) pair search into roughly O(n) when cell size ≈ query distance.
 * Allocation-free after the first build at a given size.
 */
export interface Point {
  x: number;
  y: number;
}

export class SpatialGrid {
  private cols = 0;
  private rows = 0;
  private cellSize = 1;
  private head = new Int32Array(0);
  private next = new Int32Array(0);
  private cellX = new Int32Array(0);
  private cellY = new Int32Array(0);
  private points: readonly Point[] = [];

  /** Index `points` into cells of `cellSize` covering the given bounds. */
  build(
    points: readonly Point[],
    cellSize: number,
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
  ): void {
    this.points = points;
    this.cellSize = Math.max(1, cellSize);
    this.cols = Math.max(1, Math.ceil((maxX - minX) / this.cellSize));
    this.rows = Math.max(1, Math.ceil((maxY - minY) / this.cellSize));

    const cells = this.cols * this.rows;
    if (this.head.length < cells) this.head = new Int32Array(cells);
    this.head.fill(-1, 0, cells);
    if (this.next.length < points.length) {
      this.next = new Int32Array(points.length);
      this.cellX = new Int32Array(points.length);
      this.cellY = new Int32Array(points.length);
    }

    for (let i = 0; i < points.length; i++) {
      const p = points[i]!;
      const cx = Math.min(this.cols - 1, Math.max(0, Math.floor((p.x - minX) / this.cellSize)));
      const cy = Math.min(this.rows - 1, Math.max(0, Math.floor((p.y - minY) / this.cellSize)));
      const cell = cy * this.cols + cx;
      this.cellX[i] = cx;
      this.cellY[i] = cy;
      this.next[i] = this.head[cell]!;
      this.head[cell] = i;
    }
  }

  /**
   * Call `visit(i, j, distanceSquared)` once for every unordered pair closer
   * than `maxDist`. `maxDist` must not exceed the cell size used in build().
   */
  forEachPair(maxDist: number, visit: (i: number, j: number, d2: number) => void): void {
    const max2 = maxDist * maxDist;
    const pts = this.points;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i]!;
      const cx = this.cellX[i]!;
      const cy = this.cellY[i]!;
      for (let y = cy - 1; y <= cy + 1; y++) {
        if (y < 0 || y >= this.rows) continue;
        for (let x = cx - 1; x <= cx + 1; x++) {
          if (x < 0 || x >= this.cols) continue;
          for (let j = this.head[y * this.cols + x]!; j !== -1; j = this.next[j]!) {
            if (j <= i) continue;
            const b = pts[j]!;
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < max2) visit(i, j, d2);
          }
        }
      }
    }
  }
}
