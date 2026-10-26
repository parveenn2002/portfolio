import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  frameLerp,
  jitteredGrid,
  mulberry32,
  parseColor,
  pointerForce,
  springStep,
} from '../../src/animation/engine/math.ts';
import { careerNetwork } from '../../src/animation/presets.ts';

describe('pointerForce', () => {
  test('is zero at and beyond the radius', () => {
    assert.deepEqual(pointerForce(100, 0, 100, 1), [0, 0]);
    assert.deepEqual(pointerForce(300, 400, 100, 1), [0, 0]);
  });

  test('is zero at the exact pointer position (no NaN)', () => {
    const [fx, fy] = pointerForce(0, 0, 100, 1);
    assert.equal(fx, 0);
    assert.equal(fy, 0);
  });

  test('repels along the offset direction with positive strength', () => {
    const [fx, fy] = pointerForce(30, 40, 100, 1); // distance 50, direction (0.6, 0.8)
    assert.ok(fx > 0 && fy > 0);
    assert.ok(Math.abs(fx / fy - 0.75) < 1e-9);
    // magnitude = (1 - 50/100)^2 * 1 = 0.25
    assert.ok(Math.abs(Math.hypot(fx, fy) - 0.25) < 1e-9);
  });

  test('attracts with negative strength', () => {
    const [fx] = pointerForce(20, 0, 100, -1);
    assert.ok(fx < 0);
  });

  test('falls off monotonically with distance', () => {
    const near = Math.hypot(...pointerForce(10, 0, 100, 1));
    const mid = Math.hypot(...pointerForce(50, 0, 100, 1));
    const far = Math.hypot(...pointerForce(90, 0, 100, 1));
    assert.ok(near > mid && mid > far && far > 0);
  });
});

describe('springStep', () => {
  test('settles at the target without external force', () => {
    let x = 0;
    let v = 0;
    for (let i = 0; i < 600; i++) [x, v] = springStep(x, v, 100, 0, 0.018, 0.86, 1);
    assert.ok(Math.abs(x - 100) < 0.01, `x=${x}`);
    assert.ok(Math.abs(v) < 0.01);
  });

  test('career preset constants ease back with under 5% overshoot', () => {
    let x = 0;
    let v = 0;
    let max = 0;
    for (let i = 0; i < 300; i++) {
      [x, v] = springStep(x, v, 100, 0, careerNetwork.spring, careerNetwork.damping, 1);
      max = Math.max(max, x);
    }
    assert.ok(max < 105, `overshoot to ${max}`);
  });

  test('is frame-rate independent within tolerance (60 vs 30 fps)', () => {
    let a = 0, av = 0, b = 0, bv = 0;
    for (let i = 0; i < 120; i++) [a, av] = springStep(a, av, 100, 0, 0.018, 0.86, 1);
    for (let i = 0; i < 60; i++) [b, bv] = springStep(b, bv, 100, 0, 0.018, 0.86, 2);
    assert.ok(Math.abs(a - b) < 5, `60fps=${a.toFixed(2)} 30fps=${b.toFixed(2)}`);
  });

  test('holds a steady offset under constant force (equilibrium = force / spring)', () => {
    let x = 0;
    let v = 0;
    for (let i = 0; i < 1000; i++) [x, v] = springStep(x, v, 0, 0.18, 0.018, 0.86, 1);
    assert.ok(Math.abs(x - 10) < 0.05, `x=${x}`);
  });
});

describe('frameLerp', () => {
  test('equals the rate at dt = 1 and compounds for larger dt', () => {
    assert.ok(Math.abs(frameLerp(0.2, 1) - 0.2) < 1e-12);
    assert.ok(Math.abs(frameLerp(0.2, 2) - 0.36) < 1e-12);
  });
});

describe('mulberry32', () => {
  test('is deterministic and in [0, 1)', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    for (let i = 0; i < 1000; i++) {
      const v = a();
      assert.equal(v, b());
      assert.ok(v >= 0 && v < 1);
    }
  });
});

describe('jitteredGrid', () => {
  test('returns exactly the requested count', () => {
    for (const n of [0, 1, 7, 50, 111]) {
      assert.equal(jitteredGrid(n, 16 / 9, mulberry32(1)).length, n);
    }
  });

  test('covers the area without large holes', () => {
    const pts = jitteredGrid(100, 1, mulberry32(3));
    // Every quadrant gets a fair share.
    const quads = [0, 0, 0, 0];
    for (const [u, v] of pts) quads[(u > 0.5 ? 1 : 0) + (v > 0.5 ? 2 : 0)]!++;
    for (const q of quads) assert.ok(q >= 18 && q <= 32, `quadrants ${quads.join(',')}`);
  });
});

describe('parseColor', () => {
  test('parses hex and rgb formats', () => {
    assert.deepEqual(parseColor('#6cc4d4', [0, 0, 0]), [108, 196, 212]);
    assert.deepEqual(parseColor(' #fff ', [0, 0, 0]), [255, 255, 255]);
    assert.deepEqual(parseColor('rgb(1, 2, 3)', [0, 0, 0]), [1, 2, 3]);
    assert.deepEqual(parseColor('rgb(4 5 6)', [0, 0, 0]), [4, 5, 6]);
  });

  test('falls back on unparseable input', () => {
    assert.deepEqual(parseColor('', [9, 9, 9]), [9, 9, 9]);
    assert.deepEqual(parseColor('oklch(0.7 0.1 200)', [9, 9, 9]), [9, 9, 9]);
  });
});
