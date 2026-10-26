import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mulberry32 } from '../../src/animation/engine/math.ts';
import { SpatialGrid } from '../../src/animation/engine/spatialGrid.ts';

function bruteForcePairs(points: { x: number; y: number }[], maxDist: number): Set<string> {
  const out = new Set<string>();
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const a = points[i]!;
      const b = points[j]!;
      if ((a.x - b.x) ** 2 + (a.y - b.y) ** 2 < maxDist * maxDist) out.add(`${i}-${j}`);
    }
  }
  return out;
}

test('finds exactly the same pairs as brute force', () => {
  const rand = mulberry32(11);
  for (const [n, w, h, d] of [
    [50, 800, 600, 120],
    [200, 1920, 1080, 150],
    [30, 300, 900, 200],
  ] as const) {
    const points = Array.from({ length: n }, () => ({ x: rand() * w, y: rand() * h }));
    const grid = new SpatialGrid();
    grid.build(points, d, 0, 0, w, h);
    const found = new Set<string>();
    grid.forEachPair(d, (i, j, d2) => {
      assert.ok(i < j, 'pairs are ordered');
      assert.ok(!found.has(`${i}-${j}`), 'no duplicate pairs');
      const a = points[i]!;
      const b = points[j]!;
      assert.ok(Math.abs(d2 - ((a.x - b.x) ** 2 + (a.y - b.y) ** 2)) < 1e-6);
      found.add(`${i}-${j}`);
    });
    assert.deepEqual(found, bruteForcePairs(points, d), `n=${n}`);
  }
});

test('handles points outside the build bounds (clamped into edge cells)', () => {
  const points = [
    { x: -50, y: -50 },
    { x: -10, y: -10 },
    { x: 1050, y: 1050 },
  ];
  const grid = new SpatialGrid();
  grid.build(points, 100, 0, 0, 1000, 1000);
  const pairs: string[] = [];
  grid.forEachPair(100, (i, j) => pairs.push(`${i}-${j}`));
  assert.deepEqual(pairs, ['0-1']);
});

test('can be rebuilt with fewer or more points', () => {
  const grid = new SpatialGrid();
  grid.build([{ x: 0, y: 0 }, { x: 5, y: 5 }, { x: 9, y: 9 }], 20, 0, 0, 100, 100);
  let count = 0;
  grid.forEachPair(20, () => count++);
  assert.equal(count, 3);

  grid.build([{ x: 0, y: 0 }], 20, 0, 0, 100, 100);
  count = 0;
  grid.forEachPair(20, () => count++);
  assert.equal(count, 0);
});
