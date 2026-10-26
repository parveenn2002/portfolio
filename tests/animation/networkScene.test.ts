import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { careerNetwork } from '../../src/animation/presets.ts';
import { NetworkScene } from '../../src/animation/scenes/networkScene.ts';
import type { PointerState, SceneSize } from '../../src/animation/engine/types.ts';

const desktop: SceneSize = { width: 1440, height: 900, quality: 1, compact: false };
const phone: SceneSize = { width: 390, height: 844, quality: 1, compact: true };
const still = { ...careerNetwork, drift: 0, parallax: 0 }; // isolate pointer + spring behaviour
const noPointer: PointerState = { x: 0, y: 0, influence: 0, nx: 0, ny: 0 };

/** Minimal stand-in for CanvasRenderingContext2D that counts draw calls. */
function recordingContext() {
  const calls = { stroke: 0, fill: 0, segments: 0, arcs: 0 };
  const ctx = {
    lineWidth: 1,
    strokeStyle: '',
    fillStyle: '',
    clearRect() {},
    beginPath() {},
    moveTo() {},
    lineTo() {
      calls.segments++;
    },
    arc() {
      calls.arcs++;
    },
    stroke() {
      calls.stroke++;
    },
    fill() {
      calls.fill++;
    },
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, calls };
}

const palette = { ink: [230, 235, 240], accent: [108, 196, 212] } as const;

describe('NetworkScene sizing', () => {
  test('scales node count with area and respects caps', () => {
    const scene = new NetworkScene(careerNetwork);
    const big = scene.targetCount(desktop);
    const small = scene.targetCount(phone);
    assert.ok(big <= careerNetwork.maxNodes && big >= careerNetwork.minNodes, `desktop=${big}`);
    assert.ok(small <= careerNetwork.maxNodesCompact, `phone=${small}`);
    assert.ok(small < big);
  });

  test('governor quality reduces node count', () => {
    const scene = new NetworkScene(careerNetwork);
    const full = scene.targetCount({ ...desktop, width: 1100, height: 700 });
    const reduced = scene.targetCount({ ...desktop, width: 1100, height: 700, quality: 0.4 });
    assert.ok(reduced < full, `${reduced} < ${full}`);
  });

  test('starts settled: nodes at their anchors', () => {
    const scene = new NetworkScene(still);
    scene.resize(desktop);
    assert.equal(scene.meanDisplacement(), 0);
  });

  test('resizing keeps nodes in place and lets them ease to new anchors', () => {
    const scene = new NetworkScene(still);
    scene.resize(desktop);
    scene.resize({ ...desktop, width: 1200 }); // same count range, anchors move
    const before = scene.meanDisplacement();
    for (let i = 0; i < 400; i++) scene.update(1, i / 60, noPointer);
    assert.ok(scene.meanDisplacement() < before * 0.01 + 0.01, `${before} → ${scene.meanDisplacement()}`);
  });
});

describe('NetworkScene pointer interaction', () => {
  test('pointer pushes nearby nodes away and leaves distant nodes alone', () => {
    const scene = new NetworkScene(still);
    scene.resize(desktop);
    const pointer: PointerState = { x: 720, y: 450, influence: 1, nx: 0, ny: 0 };
    for (let i = 0; i < 120; i++) scene.update(1, i / 60, pointer);
    const near = scene.displacementNear(720, 450, careerNetwork.pointerRadius * 0.6);
    const far = scene.displacementNear(100, 100, 80);
    assert.ok(near > 3, `near displacement ${near.toFixed(2)}px`);
    assert.ok(far < 0.01, `far displacement ${far.toFixed(4)}px`);
  });

  test('nodes ease back to their anchors after the pointer leaves', () => {
    const scene = new NetworkScene(still);
    scene.resize(desktop);
    const pointer: PointerState = { x: 720, y: 450, influence: 1, nx: 0, ny: 0 };
    const r = careerNetwork.pointerRadius * 0.6;
    for (let i = 0; i < 120; i++) scene.update(1, i / 60, pointer);
    const displaced = scene.displacementNear(720, 450, r);
    for (let i = 0; i < 360; i++) scene.update(1, 2 + i / 60, noPointer);
    const settled = scene.displacementNear(720, 450, r);
    assert.ok(displaced > 3, `displaced ${displaced}`);
    assert.ok(settled < 0.02, `settled ${settled}`);
  });

  test('settle() snaps everything to rest', () => {
    const scene = new NetworkScene(careerNetwork);
    scene.resize(desktop);
    for (let i = 0; i < 60; i++) scene.update(1, i / 60, { x: 500, y: 400, influence: 1, nx: 0.5, ny: 0 });
    scene.settle();
    assert.equal(scene.meanDisplacement(), 0);
  });

  test('large dt (tab resume) stays numerically stable', () => {
    const scene = new NetworkScene(careerNetwork);
    scene.resize(desktop);
    for (let i = 0; i < 50; i++) scene.update(3, i, { x: 700, y: 400, influence: 1, nx: 1, ny: 1 });
    const d = scene.meanDisplacement();
    assert.ok(Number.isFinite(d) && d < 100, `displacement ${d}`);
  });
});

describe('NetworkScene drawing', () => {
  test('batches lines and nodes into a bounded number of draw calls', () => {
    const scene = new NetworkScene(careerNetwork);
    scene.resize(desktop);
    scene.update(1, 0, { x: 700, y: 400, influence: 1, nx: 0, ny: 0 });
    const { ctx, calls } = recordingContext();
    scene.draw(ctx, palette);
    const { nodes, links } = scene.stats();
    assert.ok(links! > nodes!, `links=${links} nodes=${nodes}`);
    assert.equal(calls.segments, links, 'one segment per link');
    // ≤ 6 ink + 4 accent line buckets, ≤ 6 node fills + 1 highlight, 1 ring stroke
    assert.ok(calls.stroke <= 11, `stroke calls ${calls.stroke}`);
    assert.ok(calls.fill <= 7, `fill calls ${calls.fill}`);
  });

  test('caps connections per node', () => {
    const scene = new NetworkScene({ ...careerNetwork, linkDistance: 400 });
    scene.resize(desktop);
    const { ctx } = recordingContext();
    scene.draw(ctx, palette);
    const { nodes, links } = scene.stats();
    assert.ok(links! <= (nodes! * careerNetwork.maxLinksPerNode) / 2);
  });
});
